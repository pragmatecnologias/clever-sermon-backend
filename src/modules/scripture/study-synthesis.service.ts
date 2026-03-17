import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { ScripturePrompts } from './scripture-prompts';

export interface StudySynthesisData {
  passage: string;
  centralClaim: string;
  canonicalSignificance: string;
  pastoralTakeaway: string;
  preachingFocus: string;
  dataSource: 'llm-generated' | 'curated' | 'unavailable';
}

@Injectable()
export class StudySynthesisService {
  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService
  ) {}

  async getStudySynthesis(reference: string, userId?: string, language?: string): Promise<StudySynthesisData> {
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
        console.error('Failed to fetch passage text for study synthesis:', error);
      }

      const prompt = this.buildPrompt(reference, passageText, language || 'en');
      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 1200,
        }
      );

      const parsed = this.parseResponse(response, reference);
      return parsed;
    } catch (error) {
      console.error('Error generating study synthesis:', error);
      return {
        passage: reference,
        centralClaim: '',
        canonicalSignificance: '',
        pastoralTakeaway: '',
        preachingFocus: '',
        dataSource: 'unavailable',
      };
    }
  }

  private buildPrompt(reference: string, passageText: string, language?: string): string {
    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const languageInstruction = language === 'es'
      ? 'Responde únicamente en español. No uses inglés en ningún campo de texto de la respuesta.'
      : 'Respond in English.';
    
    return ScripturePrompts.studySynthesis({
      languageInstruction,
      reference,
      passageText: passageText || 'Text not available',
    });
  }

  private parseResponse(response: string, reference: string): StudySynthesisData {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        passage: reference,
        centralClaim: parsed.centralClaim || '',
        canonicalSignificance: parsed.canonicalSignificance || '',
        pastoralTakeaway: parsed.pastoralTakeaway || '',
        preachingFocus: parsed.preachingFocus || '',
        dataSource: 'llm-generated',
      };
    } catch (error) {
      console.error('Error parsing study synthesis response:', error);
      return {
        passage: reference,
        centralClaim: '',
        canonicalSignificance: '',
        pastoralTakeaway: '',
        preachingFocus: '',
        dataSource: 'unavailable',
      };
    }
  }
}
