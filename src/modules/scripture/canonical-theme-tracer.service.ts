import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { parseJsonObjectFromLlm } from './json-response.util';
import { ScripturePrompts } from './scripture-prompts';
import { buildFallbackCanonicalThemes } from './scripture-fallbacks';

export interface ThemeThread {
  theme: string;
  description: string;
  explanation: string;
  canonicalMovement: string;
  verses: ThemeVerse[];
  category: string;
  isPrimary?: boolean;
}

export interface ThemeVerse {
  reference: string;
  snippet: string;
  explanation: string;
  stage: 'foundation' | 'expansion' | 'echo' | 'fulfillment';
  testament: 'OT' | 'NT';
  era: 'Torah' | 'History' | 'Wisdom' | 'Prophets' | 'Gospels' | 'Acts' | 'Epistles' | 'Revelation';
}

export interface CanonicalThemesResponse {
  passage: string;
  themes: ThemeThread[];
  dataSource: 'llm-generated' | 'unavailable';
}

@Injectable()
export class CanonicalThemeTracerService {
  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService
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
          if (parsed.dataSource === 'llm-generated' && parsed.themes.length > 0) {
            return parsed;
          }
        } catch (error: any) {
          lastParseError = error;
        }
      }

      if (lastParseError) {
        console.error('Canonical themes parse failed after retries:', lastParseError.message);
      }
      return buildFallbackCanonicalThemes(reference, passageText, language);
    } catch (error) {
      console.error('Error generating canonical themes:', error);
      return buildFallbackCanonicalThemes(reference, passageText, language);
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
      const themes: ThemeThread[] = themesArray
        .filter((theme: any) => theme && typeof theme === 'object')
        .map((theme: any, index: number) => ({
          theme: String(theme.theme || theme.tema || '').substring(0, 200),
          description: String(theme.description || theme.descripción || theme.descripcion || '').substring(0, 500),
          explanation: String(theme.explanation || theme.explicación || theme.explicacion || '').substring(0, 1000),
          canonicalMovement: String(theme.canonicalMovement || theme.movimientoCanónico || theme.movimientoCanonico || '').substring(0, 1000),
          verses: Array.isArray(theme.verses || theme.versículos || theme.versiculos) 
            ? (theme.verses || theme.versículos || theme.versiculos).slice(0, 10).map((v: any) => ({
                reference: String(v.reference || v.referencia || '').substring(0, 100),
                snippet: String(v.snippet || v.fragmento || '').substring(0, 200),
                era: String(v.era || '').substring(0, 100),
              }))
            : [],
          category: ['gospel', 'sanctuary', 'prophecy', 'covenant', 'law', 'salvation', 'gracia', 'grace'].includes(theme.category || theme.categoría || theme.categoria)
            ? (theme.category || theme.categoría || theme.categoria)
            : 'gospel',
          isPrimary: index === 0,
        }))
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

  async getThemeByName(themeName: string): Promise<ThemeThread | null> {
    // This method is no longer supported with LLM approach
    return null;
  }

  async getAllThemes(): Promise<ThemeThread[]> {
    // This method is no longer supported with LLM approach
    return [];
  }
}
