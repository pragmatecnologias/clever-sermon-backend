import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { parseJsonObjectFromLlm } from './json-response.util';
import { ScripturePrompts } from './scripture-prompts';
import { GeneratedStudyOutputValidator } from './generated-study-output.validator';
import { buildFallbackPassageSummary } from './scripture-fallbacks';

export interface PassageSummaryData {
  passage: string;
  summary: string;
  interpretiveCenter: string;
  mainTension: string;
  movement: string[];
  dataSource: 'llm-generated' | 'computed' | 'curated' | 'unavailable';
  status?: 'ready' | 'not_generated' | 'unavailable';
  message?: string;
  warnings?: string[];
}

@Injectable()
export class PassageSummaryService {
  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService,
    private generatedStudyOutputValidator: GeneratedStudyOutputValidator,
  ) {}

  async getPassageSummary(reference: string, userId?: string, language?: string): Promise<PassageSummaryData> {
    let passageText = '';
    try {
      const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
      // Fetch actual passage text to prevent LLM hallucination
      try {
        const result = await this.scriptureService.getPassage(reference, analysisTranslation);
        if (result && result.verses && result.verses.length > 0) {
          passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
        }
      } catch (error) {
        console.error('Failed to fetch passage text for summary:', error);
      }

      const prompt = this.buildPrompt(reference, passageText, language || 'en');
      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 1000,
          timeoutMs: 12000,
        }
      );

      const parsed = this.parseResponse(response, reference);
      const validation = this.generatedStudyOutputValidator.validate('passage-summary', parsed, { reference, language });
      if (validation.valid) {
        return {
          ...parsed,
          status: 'ready',
          message: undefined,
          warnings: [],
        };
      }

      const computed = buildFallbackPassageSummary(reference, passageText, language || 'en');
      return {
        ...computed,
        dataSource: 'computed',
        status: 'ready',
        message: undefined,
        warnings: [],
      };
    } catch (error) {
      console.error('Error generating passage summary:', error);
      const computed = buildFallbackPassageSummary(reference, passageText, language || 'en');
      return {
        ...computed,
        dataSource: 'computed',
        status: 'ready',
        message: undefined,
        warnings: [],
      };
    }
  }

  private buildPrompt(reference: string, passageText: string, language?: string): string {
    const languageInstruction = language === 'es'
      ? 'Responde únicamente en español. No uses inglés en ningún campo de texto de la respuesta.'
      : 'Respond in English.';
    
    return ScripturePrompts.passageSummary({
      languageInstruction,
      reference,
      passageText: passageText || 'Text not available',
    });
  }

  private parseResponse(response: string, reference: string): PassageSummaryData {
    try {
      const parsed: any = parseJsonObjectFromLlm(response);

      // Handle Spanish field names
      return {
        passage: reference,
        summary: String(parsed.summary || parsed.resumen || '').substring(0, 500),
        interpretiveCenter: String(parsed.interpretiveCenter || parsed.centroInterpretativo || '').substring(0, 500),
        mainTension: String(parsed.mainTension || parsed.tensiónPrincipal || parsed.tensionPrincipal || '').substring(0, 500),
        movement: Array.isArray(parsed.movement || parsed.movimiento) 
          ? (parsed.movement || parsed.movimiento).slice(0, 10).map((m: any) => String(m).substring(0, 200))
          : [],
        dataSource: 'llm-generated',
      };
    } catch (error) {
      console.error('Error parsing passage summary response:', error);
      console.error('Raw response:', response.substring(0, 500));
      return {
        passage: reference,
        summary: '',
        interpretiveCenter: '',
        mainTension: '',
        movement: [],
        dataSource: 'unavailable',
      };
    }
  }

  private isWeakSummary(parsed: PassageSummaryData): boolean {
    const serialized = JSON.stringify(parsed || {}).toLowerCase();
    const startsWithReference = /^\s*[a-z0-9]+\s+\d+:\d+/.test(String(parsed.summary || '').trim().toLowerCase()) ||
      /^\s*[a-z0-9]+\s+\d+:\d+/.test(String(parsed.interpretiveCenter || '').trim().toLowerCase()) ||
      /^\s*[a-z0-9]+\s+\d+:\d+/.test(String(parsed.mainTension || '').trim().toLowerCase());
    return startsWithReference || [
      'not just a statement of truth',
      'gospel invitation',
      'central claim and the response',
      'state the passage',
      'show how the promise leads',
      'call to response',
      'text’s main truth',
      'text\'s main truth',
      'verse text',
    ].some((phrase) => serialized.includes(phrase));
  }

  private isRawVerseMovement(movement: string[]): boolean {
    const serialized = JSON.stringify(movement || []).toLowerCase();
    if (!Array.isArray(movement) || movement.length === 0) return true;
    const looksLikeRawVerse = movement.some((item) => {
      const text = String(item || '').trim().toLowerCase();
      return (
        !text ||
        /^\s*\d+:\d+/.test(text) ||
        /^(state|show|explain|preach|apply)\b/.test(text) ||
        text.includes('ordered by the lord') ||
        text.includes('for the lord upholdeth') ||
        text.includes('for yahweh holds him up') ||
        text.includes('verse 23') ||
        text.includes('verse 24')
      );
    });

    return looksLikeRawVerse || serialized.includes('verse text');
  }
}
