import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { parseJsonObjectFromLlm } from './json-response.util';
import { ScripturePrompts } from './scripture-prompts';

export interface PassageSummaryData {
  passage: string;
  summary: string;
  interpretiveCenter: string;
  mainTension: string;
  movement: string[];
  dataSource: 'llm-generated' | 'curated' | 'unavailable';
}

@Injectable()
export class PassageSummaryService {
  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService
  ) {}

  async getPassageSummary(reference: string, userId?: string, language?: string): Promise<PassageSummaryData> {
    try {
      const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
      // Fetch actual passage text to prevent LLM hallucination
      let passageText = '';
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
        }
      );

      const parsed = this.parseResponse(response, reference);
      return parsed;
    } catch (error) {
      console.error('Error generating passage summary:', error);
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

  private buildPrompt(reference: string, passageText: string, language?: string): string {
    const languageLabel = language === 'es' ? 'Spanish' : 'English';
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
}
