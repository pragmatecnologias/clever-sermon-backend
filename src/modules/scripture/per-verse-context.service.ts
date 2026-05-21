import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { parseJsonObjectFromLlm } from './json-response.util';
import { ScripturePrompts } from './scripture-prompts';
import { buildFallbackVerseContext, extractBookName } from './scripture-fallbacks';

export interface PerVerseContext {
  reference: string;
  historical?: HistoricalNote[];
  cultural?: CulturalNote[];
  geographical?: GeographicalNote[];
  timeline?: TimelineEvent[];
  dataSource: 'llm-generated' | 'curated' | 'unavailable';
}

export interface HistoricalNote {
  note: string;
  period?: string;
  source?: string;
}

export interface CulturalNote {
  note: string;
  category: 'custom' | 'law' | 'practice' | 'belief' | 'social';
  source?: string;
}

export interface GeographicalNote {
  place: string;
  description: string;
  significance: string;
  modernLocation?: string;
}

export interface TimelineEvent {
  event: string;
  date: string;
  significance: string;
}

@Injectable()
export class PerVerseContextService {
  private contextIndex: Map<string, PerVerseContext> = new Map();

  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService
  ) {
    this.initializeContextData();
  }

  async getVerseContext(reference: string, language?: string): Promise<PerVerseContext> {
    const normalized = this.normalizeReference(reference);
    const context = this.contextIndex.get(normalized);
    
    if (context) {
      return { ...context, dataSource: 'curated' };
    }

    // Generate context dynamically using LLM
    try {
      const generatedContext = await this.generateContextWithLLM(reference, language || 'en');
      if (
        (Array.isArray(generatedContext.historical) && generatedContext.historical.length > 0) ||
        (Array.isArray(generatedContext.cultural) && generatedContext.cultural.length > 0) ||
        (Array.isArray(generatedContext.geographical) && generatedContext.geographical.length > 0) ||
        (Array.isArray(generatedContext.timeline) && generatedContext.timeline.length > 0)
      ) {
        const totalCount =
          (generatedContext.historical?.length || 0) +
          (generatedContext.cultural?.length || 0) +
          (generatedContext.geographical?.length || 0) +
          (generatedContext.timeline?.length || 0);
        if (totalCount >= 6) {
          return generatedContext;
        }
      }
      return this.buildFallbackContext(reference, language || 'en');
    } catch (error) {
      console.error('Failed to generate verse context:', error);
      return this.buildFallbackContext(reference, language || 'en');
    }
  }

  private async generateContextWithLLM(reference: string, language?: string): Promise<PerVerseContext> {
    const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
    // Fetch actual passage text to prevent LLM hallucination
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(reference, analysisTranslation);
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      console.error('Failed to fetch passage text for verse context:', error);
    }

    const languageInstruction = language === 'es'
      ? 'Responde únicamente en español. No uses inglés en ningún campo de texto de la respuesta.'
      : 'Respond in English.';
    
    const prompt = ScripturePrompts.perVerseContext({
      languageInstruction,
      reference,
      passageText: passageText || 'Text not available',
    });

    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.3,
      maxTokens: 4000,
      timeoutMs: 12000,
    });

    let parsed: any;
    try {
      parsed = parseJsonObjectFromLlm(response);
    } catch (error) {
      console.error('Failed to parse per-verse context response:', error);
      console.error('Raw response:', response);
      throw new Error('Invalid JSON response from LLM');
    }

    // Handle Spanish field names
    return {
      reference,
      historical: parsed.historical || parsed.histórico || parsed.historico || [],
      cultural: parsed.cultural || [],
      geographical: parsed.geographical || parsed.geográfico || parsed.geografico || [],
      timeline: parsed.timeline || parsed.línea || parsed.linea || [],
      dataSource: 'llm-generated',
    };
  }

  private async buildFallbackContext(reference: string, language?: string): Promise<PerVerseContext> {
    const book = extractBookName(reference);
    const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(reference, analysisTranslation);
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch {
      // keep fallback
    }

    const [bookMetadata, historical, cultural, geography, timeline] = await Promise.all([
      this.scriptureService.getBookMetadata(book),
      this.scriptureService.getHistoricalContext(book),
      this.scriptureService.getCulturalContext(book),
      this.scriptureService.getGeography(book),
      this.scriptureService.getTimeline(book),
    ]);

    return buildFallbackVerseContext(reference, passageText, language, bookMetadata, historical, cultural, geography, timeline);
  }

  private normalizeReference(ref: string): string {
    return ref.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private initializeContextData() {
    // Reserved for future curated high-priority verses
    // All other verses will be dynamically generated via LLM
  }

  hasContextData(reference: string): boolean {
    const normalized = this.normalizeReference(reference);
    return this.contextIndex.has(normalized);
  }

  getAllAvailableVerses(): string[] {
    return Array.from(this.contextIndex.keys());
  }
}
