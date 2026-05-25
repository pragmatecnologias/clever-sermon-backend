import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { parseJsonObjectFromLlm } from './json-response.util';
import { ScripturePrompts } from './scripture-prompts';
import { buildFallbackCanonicalThemes, detectStudyGenre } from './scripture-fallbacks';
import { GeneratedStudyOutputValidator } from './generated-study-output.validator';

export interface ThemeThread {
  id?: string;
  theme: string;
  name?: string;
  priority?: 'primary' | 'secondary' | 'supporting';
  summary?: string;
  description: string;
  explanation: string;
  canonicalMovement: string;
  passageAnchor?: string;
  canonicalCategory?: string;
  tags?: string[];
  preachingUse?: string;
  cautions?: string[];
  confidence?: number;
  development?: ThemeVerse[];
  verses: ThemeVerse[];
  category: string;
  isPrimary?: boolean;
}

export interface ThemeVerse {
  reference: string;
  snippet: string;
  explanation: string;
  contribution?: string;
  relation?: 'foundation' | 'echo' | 'development' | 'contrast' | 'fulfillment' | 'application' | 'parallel';
  canonicalStage?: string;
  stage: 'foundation' | 'expansion' | 'echo' | 'fulfillment';
  testament: 'OT' | 'NT';
  era: 'Torah' | 'History' | 'Wisdom' | 'Prophets' | 'Gospels' | 'Acts' | 'Epistles' | 'Revelation';
}

export interface CanonicalThemesResponse {
  passage: string;
  themes: ThemeThread[];
  dataSource: 'llm-generated' | 'curated' | 'unavailable';
  status?: 'ready' | 'not_generated' | 'unavailable';
  message?: string;
  warnings?: string[];
}

@Injectable()
export class CanonicalThemeTracerService {
  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService,
    private generatedStudyOutputValidator: GeneratedStudyOutputValidator,
  ) {}

  async getThemesForPassage(reference: string, language?: string, userId?: string): Promise<CanonicalThemesResponse> {
    let passageText = '';
    try {
      // Fetch actual passage text to prevent LLM hallucination
      const translationCode = language === 'es' ? 'RVR1960' : 'KJV';
      try {
        const result = await this.scriptureService.getPassage(reference, translationCode);
        if (result && result.verses && result.verses.length > 0) {
          passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
        }
      } catch (error) {
        console.error('Failed to fetch passage text for canonical themes:', error);
      }

      const prompt = this.buildPrompt(reference, passageText, language);

      let lastParseError: Error | null = null;
      for (let attempt = 1; attempt <= 2; attempt++) {
        const attemptPrompt =
          attempt === 1
            ? prompt
            : `${prompt}\n\nCRITICAL: Your previous response was invalid or truncated JSON. Return compact valid JSON only.`;
        const response = await this.llmService.generateCompletion(
          attemptPrompt,
          userId || 'system',
          {
            temperature: 0.3,
            maxTokens: 4000,
            timeoutMs: 12000,
          }
        );

        try {
            const parsed = this.parseResponse(response, reference);
          const validation = this.generatedStudyOutputValidator.validate('canonical-themes', parsed, { reference, language });
          if (validation.valid && parsed.dataSource === 'llm-generated' && parsed.themes.length > 0 && !this.isWeakThemes(parsed, reference)) {
            return {
              ...parsed,
              status: 'ready',
              warnings: [],
            };
          }
        } catch (error: any) {
          lastParseError = error;
        }
      }

      if (lastParseError) {
        console.error('Canonical themes parse failed after retries:', lastParseError.message);
      }
      const computed = buildFallbackCanonicalThemes(reference, passageText, language || 'en');
      const computedValidation = this.generatedStudyOutputValidator.validate('canonical-themes', computed, { reference, language });
      if (!computedValidation.valid) {
        return this.buildUnavailableThemes(reference, language, computedValidation.errors);
      }
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: computed.warnings || [],
      };
    } catch (error) {
      console.error('Error generating canonical themes:', error);
      const computed = buildFallbackCanonicalThemes(reference, passageText, language || 'en');
      const computedValidation = this.generatedStudyOutputValidator.validate('canonical-themes', computed, { reference, language });
      if (!computedValidation.valid) {
        return this.buildUnavailableThemes(reference, language, computedValidation.errors);
      }
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: computed.warnings || [],
      };
    }
  }

  private buildPrompt(reference: string, passageText: string, language?: string): string {
    const languageInstruction = language === 'es'
      ? 'Responde únicamente en español. Todos los campos del JSON deben estar en español. Devuelve solo JSON válido.\n\n'
      : 'Respond in English and return only valid JSON.\n\n';

    return ScripturePrompts.canonicalThemes({
      languageInstruction,
      reference,
      passageText: passageText || 'Text not available',
    });
  }

  private parseResponse(response: string, reference: string): CanonicalThemesResponse {
    try {
      const parsed: any = parseJsonObjectFromLlm(response);

      // Handle both "themes" and Spanish "temas" field names
      let themesArray = parsed.themes || parsed.temas;

      // If themes is not an array directly, check if it's wrapped in another object
      if (!Array.isArray(themesArray) && parsed.themes && typeof parsed.themes === 'object') {
        themesArray = parsed.themes.themes || parsed.themes.temas || parsed.themes;
      }

      if (!themesArray || !Array.isArray(themesArray)) {
        throw new Error('Invalid themes structure - missing or invalid themes array');
      }

      // Mark first theme as primary and validate structure
      const normalizedTheme = (theme: any, index: number): ThemeThread => {
        const rawDevelopment = theme.development || theme.desarrollo || theme.verses || theme.versículos || theme.versiculos;
        const normalizedVerses: ThemeVerse[] = Array.isArray(rawDevelopment)
          ? rawDevelopment.slice(0, 10).map((v: any) => ({
              reference: String(v.reference || v.referencia || '').substring(0, 100),
              snippet: String(v.snippet || v.fragmento || '').substring(0, 200),
              explanation: String(v.explanation || v.explicacion || v.contribution || v.contribucion || '').substring(0, 300),
              contribution: String(v.contribution || v.contribucion || v.explanation || v.explicacion || '').substring(0, 300),
              relation: ['foundation', 'echo', 'development', 'contrast', 'fulfillment', 'application', 'parallel'].includes(String(v.relation || '').toLowerCase())
                ? String(v.relation).toLowerCase() as ThemeVerse['relation']
                : undefined,
              canonicalStage: String(v.canonicalStage || v.etapaCanonica || '').substring(0, 120),
              stage: ['foundation', 'expansion', 'echo', 'fulfillment'].includes(String(v.stage || '').toLowerCase())
                ? String(v.stage).toLowerCase() as ThemeVerse['stage']
                : 'echo',
              testament: ['OT', 'NT'].includes(String(v.testament || '').toUpperCase())
                ? String(v.testament).toUpperCase() as ThemeVerse['testament']
                : 'NT',
              era: String(v.era || '').substring(0, 100) as ThemeVerse['era'],
            }))
          : [];

        return {
          id: String(theme.id || theme.themeId || theme.temaId || '').substring(0, 120) || `theme-${index + 1}`,
          theme: String(theme.theme || theme.tema || theme.name || theme.nombre || '').substring(0, 200),
          name: String(theme.name || theme.nombre || theme.theme || theme.tema || '').substring(0, 200),
          priority: ['primary', 'secondary', 'supporting'].includes(String(theme.priority || '').toLowerCase())
            ? String(theme.priority).toLowerCase() as ThemeThread['priority']
            : index === 0 ? 'primary' : 'secondary',
          summary: String(theme.summary || theme.resumen || theme.description || theme.descripcion || '').substring(0, 500),
          description: String(theme.description || theme.descripción || theme.descripcion || theme.summary || theme.resumen || '').substring(0, 500),
          explanation: String(theme.explanation || theme.explicación || theme.explicacion || '').substring(0, 1000),
          canonicalMovement: String(theme.canonicalMovement || theme.movimientoCanónico || theme.movimientoCanonico || '').substring(0, 1000),
          passageAnchor: String(theme.passageAnchor || theme.anclaDelPasaje || theme.anchor || '').substring(0, 200),
          canonicalCategory: String(theme.canonicalCategory || theme.categoriaCanonica || theme.category || '').substring(0, 80),
          tags: Array.isArray(theme.tags || theme.etiquetas) ? (theme.tags || theme.etiquetas).slice(0, 8).map((item: any) => String(item).substring(0, 60)) : [],
          preachingUse: String(theme.preachingUse || theme.usoParaPredicar || '').substring(0, 400),
          cautions: Array.isArray(theme.cautions || theme.advertencias) ? (theme.cautions || theme.advertencias).slice(0, 4).map((item: any) => String(item).substring(0, 240)) : [],
          confidence: Number.isFinite(Number(theme.confidence)) ? Number(theme.confidence) : 0.7,
          development: normalizedVerses,
          verses: normalizedVerses,
          category: ['gospel', 'sanctuary', 'prophecy', 'covenant', 'law', 'salvation', 'gracia', 'grace', 'judgment', 'worship', 'wisdom'].includes(String(theme.category || theme.categoría || theme.categoria || '').toLowerCase())
            ? String(theme.category || theme.categoría || theme.categoria)
            : 'gospel',
          isPrimary: index === 0,
        };
      };

      const themes: ThemeThread[] = themesArray
        .filter((theme: any) => theme && typeof theme === 'object')
        .map((theme: any, index: number) => normalizedTheme(theme, index))
        .filter(theme => theme.theme && theme.description); // Only keep themes with required fields

      if (themes.length === 0) {
        throw new Error('No valid themes extracted from response');
      }

      if (themes.length < 2 || themes.some((theme) => String(theme.description || '').trim().length < 30)) {
        throw new Error('Canonical themes response too thin');
      }

      return {
        passage: reference,
        themes: themes.slice(0, 6), // Limit to 6 themes
        dataSource: 'llm-generated',
      };
    } catch (error) {
      console.error('Error parsing canonical themes response:', error);
      console.error('Raw response:', response.substring(0, 500));
      throw error;
    }
  }

  private buildUnavailableThemes(reference: string, language: string | undefined, warnings: string[]): CanonicalThemesResponse {
    return {
      passage: reference,
      themes: [],
      dataSource: 'unavailable',
      status: 'unavailable',
      message: 'Canonical themes could not be generated. Please retry.',
      warnings,
    };
  }

  async getThemeByName(themeName: string): Promise<ThemeThread | null> {
    // This method is no longer supported with LLM approach
    return null;
  }

  async getAllThemes(): Promise<ThemeThread[]> {
    // This method is no longer supported with LLM approach
    return [];
  }

  private isWeakThemes(parsed: CanonicalThemesResponse, reference: string): boolean {
    const serialized = JSON.stringify(parsed || {}).toLowerCase();
    const expected = detectStudyGenre(reference);
    if (serialized.includes('gospel summary')) return true;
    if (serialized.includes('grace and salvation') && expected === 'wisdom_poetry') return true;
    if (expected === 'wisdom_poetry' && !serialized.includes('steps') && !serialized.includes('righteous')) return true;
    if (expected === 'prophetic_apocalyptic' && !serialized.includes('worship') && !serialized.includes('everlasting gospel')) return true;
    return false;
  }
}
