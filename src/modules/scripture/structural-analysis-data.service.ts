import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { parseJsonObjectFromLlm } from './json-response.util';
import { ScripturePrompts } from './scripture-prompts';
import { buildFallbackStructuralAnalysis, detectStudyGenre } from './scripture-fallbacks';
import { GeneratedStudyOutputValidator } from './generated-study-output.validator';

export interface StructuralAnalysis {
  passage: string;
  literaryGenre: string;
  structure: StructuralElement[];
  chiasm?: ChiasmStructure;
  parallelism?: ParallelismPattern[];
  dataSource: 'llm-generated' | 'curated' | 'unavailable';
  status?: 'ready' | 'not_generated' | 'unavailable';
  message?: string;
  warnings?: string[];
}

export interface StructuralElement {
  verses: string;
  type: 'introduction' | 'body' | 'conclusion' | 'transition' | 'climax' | 'inclusio';
  description: string;
}

export interface ChiasmStructure {
  pattern: string;
  elements: Array<{ label: string; verses: string; content: string }>;
}

export interface ParallelismPattern {
  type: 'synonymous' | 'antithetic' | 'synthetic' | 'emblematic';
  verses: string;
  lineA: string;
  lineB: string;
}

@Injectable()
export class StructuralAnalysisDataService {
  private structureIndex: Map<string, StructuralAnalysis> = new Map();

  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService,
    private generatedStudyOutputValidator: GeneratedStudyOutputValidator,
  ) {
    this.initializeStructuralData();
  }

  async getStructuralAnalysis(passage: string, language?: string): Promise<StructuralAnalysis> {
    const normalized = this.normalizePassage(passage);
    const analysis = this.structureIndex.get(normalized);
    
    if (analysis) {
      return { ...analysis, dataSource: 'curated', status: 'ready', warnings: [] };
    }

    // Generate structural analysis using LLM
    try {
      console.log(`[StructuralAnalysis] Generating for passage: ${passage}, language: ${language || 'en'}`);
      const generated = await this.generateStructuralAnalysis(passage, language || 'en');
      console.log(`[StructuralAnalysis] Successfully generated for ${passage}`);
      return generated;
    } catch (error) {
      console.error(`[StructuralAnalysis] Failed for passage: ${passage}, language: ${language}`, error);
      console.error('[StructuralAnalysis] Error details:', error.message, error.stack?.substring(0, 500));
      const fallbackText = await this.fetchPassageText(passage, language || 'en');
      const computed = buildFallbackStructuralAnalysis(passage, fallbackText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }
  }

  private async generateStructuralAnalysis(passage: string, language?: string): Promise<StructuralAnalysis> {
    const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
    // Fetch the actual passage text to prevent LLM hallucination
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(passage, analysisTranslation);
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      console.error('Failed to fetch passage text for structural analysis:', error);
    }

    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const languageInstruction = language === 'es'
      ? `CRITICAL INSTRUCTIONS:
1. You MUST respond ONLY in Spanish. Every single field in the JSON must be in Spanish.
2. Do NOT use any English words in the JSON fields.
3. Return ONLY the JSON object - no explanations, no markdown, no extra text.

INSTRUCCIONES CRÍTICAS:
1. Debes responder ÚNICAMENTE en español. Todos los campos del JSON deben estar en español.
2. NO uses NINGUNA palabra en inglés en los campos del JSON.
3. Devuelve SOLAMENTE el objeto JSON - sin explicaciones, sin markdown, sin texto adicional.`
      : 'Respond in English. Return ONLY the JSON object - no markdown, no extra text.';
    
    const prompt = ScripturePrompts.structuralAnalysis({
      languageInstruction,
      passage,
      passageText: passageText || 'Text not available - analyze based on reference only',
    });

    let parsed: any = null;
    let lastParseError: Error | null = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      const attemptPrompt =
        attempt === 1
          ? prompt
          : `${prompt}\n\nCRITICAL: Your previous response was invalid JSON. Return compact valid JSON only. No comments, no prose, no markdown.`;

      console.log(`[StructuralAnalysis] Calling LLM for passage: ${passage} (attempt ${attempt})`);
      const response = await this.llmService.generateCompletion(attemptPrompt, 'system', {
        temperature: 0.2,
        maxTokens: 1600,
        timeoutMs: 12000,
      });

      console.log(`[StructuralAnalysis] LLM response length: ${response.length} chars`);
      console.log(`[StructuralAnalysis] Response preview: ${response.substring(0, 200)}...`);

      try {
        parsed = parseJsonObjectFromLlm(response);
        console.log('[StructuralAnalysis] Successfully parsed JSON');
        break;
      } catch (parseError: any) {
        lastParseError = parseError;
        console.error('[StructuralAnalysis] Failed to parse JSON:', parseError.message);
        console.error('[StructuralAnalysis] Full response:', response);
      }
    }

    if (!parsed) {
      const computed = buildFallbackStructuralAnalysis(passage, passageText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }

    // Handle Spanish field names and normalize structure elements
    const rawStructure = parsed.structure || parsed.estructura || [];
    const normalizedStructure = Array.isArray(rawStructure) ? rawStructure.map((el: any) => ({
      verses: el.verses || el.versículos || el.versiculos || '',
      type: el.type || el.tipo || 'body',
      description: el.description || el.descripción || el.descripcion || '',
    })) : [];

    const rawChiasm = parsed.chiasm || parsed.quiasmo;
    const normalizedChiasm = rawChiasm ? {
      pattern: rawChiasm.pattern || rawChiasm.patrón || rawChiasm.patron || '',
      elements: Array.isArray(rawChiasm.elements || rawChiasm.elementos) 
        ? (rawChiasm.elements || rawChiasm.elementos).map((el: any) => ({
            label: el.label || el.etiqueta || '',
            verses: el.verses || el.versículos || el.versiculos || '',
            content: el.content || el.contenido || '',
          }))
        : [],
    } : undefined;

    const structuralAnalysis: StructuralAnalysis = {
      passage,
      literaryGenre: parsed.literaryGenre || parsed.géneroLiterario || parsed.generoLiterario || 'Unknown',
      structure: normalizedStructure,
      chiasm: normalizedChiasm,
      parallelism: (parsed.parallelism || parsed.paralelismo) && (parsed.parallelism || parsed.paralelismo).length > 0 ? (parsed.parallelism || parsed.paralelismo) : undefined,
      dataSource: 'llm-generated',
    };

    if (
      structuralAnalysis.structure.length < 3 ||
      structuralAnalysis.structure.some((element) => String(element.description || '').trim().length < 20) ||
      this.isWrongGenre(structuralAnalysis.literaryGenre, passage) ||
      this.isWeakStructure(structuralAnalysis) ||
      this.shouldPreferSemanticPoeticStructure(structuralAnalysis, passage)
    ) {
      const computed = buildFallbackStructuralAnalysis(passage, passageText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }

    const validation = this.generatedStudyOutputValidator.validate('structural-analysis', structuralAnalysis, { reference: passage, language });
    if (!validation.valid) {
      const computed = buildFallbackStructuralAnalysis(passage, passageText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }

    return { ...structuralAnalysis, status: 'ready', warnings: [] };
  }

  private normalizePassage(passage: string): string {
    if (!passage) return '';
    return passage.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private initializeStructuralData() {
    // Reserved for future curated high-priority passages
    // All other passages will be dynamically generated via LLM
  }

  private async fetchPassageText(passage: string, language: string): Promise<string> {
    const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
    try {
      const result = await this.scriptureService.getPassage(passage, analysisTranslation);
      if (result && result.verses && result.verses.length > 0) {
        return result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      console.error('[StructuralAnalysis] Failed to fetch passage text for fallback:', error);
    }
    return '';
  }

  hasStructuralData(passage: string): boolean {
    const normalized = this.normalizePassage(passage);
    return this.structureIndex.has(normalized);
  }

  getAllAvailablePassages(): string[] {
    return Array.from(this.structureIndex.keys());
  }

  private isWrongGenre(literaryGenre: string, passage: string): boolean {
    const normalized = String(literaryGenre || '').toLowerCase();
    const expected = detectStudyGenre(passage);
    if (expected === 'wisdom_poetry' && /narrative|expository/.test(normalized)) {
      return true;
    }
    if (expected === 'prophetic_apocalyptic' && /narrative/.test(normalized)) {
      return true;
    }
    if (expected === 'covenant_law' && /narrative/.test(normalized)) {
      return true;
    }
    return false;
  }

  private isWeakStructure(analysis: StructuralAnalysis): boolean {
    const serialized = JSON.stringify(analysis || {}).toLowerCase();
    return [
      'introduction / body / conclusion',
      'state the passage',
      'show how',
      'narrative or doctrinal flow',
    ].some((phrase) => serialized.includes(phrase));
  }

  private shouldPreferSemanticPoeticStructure(analysis: StructuralAnalysis, passage: string): boolean {
    const expected = detectStudyGenre(passage);
    if (expected !== 'wisdom_poetry') return false;

    const serialized = JSON.stringify(analysis || {}).toLowerCase();
    const genericTypes = Array.isArray(analysis.structure) && analysis.structure.length > 0
      ? analysis.structure.every((element) => ['introduction', 'body', 'conclusion'].includes(String(element.type || '').toLowerCase()))
      : false;

    if (!genericTypes) return false;

    return [
      'divine guidance',
      'divine delight',
      'human weakness',
      'divine support',
      'parallelism',
      'wisdom psalm',
      'hebrew poetry',
    ].every((phrase) => !serialized.includes(phrase));
  }

  private buildUnavailableAnalysis(passage: string, language: string | undefined, warnings: string[]): StructuralAnalysis {
    return {
      passage,
      literaryGenre: '',
      structure: [],
      chiasm: undefined,
      parallelism: undefined,
      dataSource: 'unavailable',
      status: 'unavailable',
      message: 'Structural analysis could not be generated. Please retry.',
      warnings,
    };
  }
}
