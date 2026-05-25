import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { ScripturePrompts } from './scripture-prompts';
import { GeneratedStudyOutputValidator } from './generated-study-output.validator';
import { buildFallbackStudySynthesis } from './scripture-fallbacks';

export interface StudySynthesisData {
  passage: string;
  centralClaim: string;
  canonicalSignificance: string;
  pastoralTakeaway: string;
  preachingFocus: string;
  dataSource: 'llm-generated' | 'computed' | 'curated' | 'unavailable';
  status?: 'ready' | 'not_generated' | 'unavailable';
  message?: string;
  warnings?: string[];
}

@Injectable()
export class StudySynthesisService {
  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService,
    private generatedStudyOutputValidator: GeneratedStudyOutputValidator,
  ) {}

  async getStudySynthesis(reference: string, userId?: string, language?: string): Promise<StudySynthesisData> {
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
        console.error('Failed to fetch passage text for study synthesis:', error);
      }

      const prompt = this.buildPrompt(reference, passageText, language || 'en');
      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 1200,
          timeoutMs: 12000,
        }
      );

      const parsed = this.parseResponse(response, reference);
      const validation = this.generatedStudyOutputValidator.validate('study-synthesis', parsed, { reference, language });
      if (validation.valid) {
        return {
          ...parsed,
          status: 'ready',
          message: undefined,
          warnings: [],
        };
      }

      const computed = buildFallbackStudySynthesis(reference, passageText, language || 'en');
      return {
        ...computed,
        dataSource: 'computed',
        status: 'ready',
        message: undefined,
        warnings: [],
      };
    } catch (error) {
      console.error('Error generating study synthesis:', error);
      const computed = buildFallbackStudySynthesis(reference, passageText, language || 'en');
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

  private isWeakSynthesis(parsed: StudySynthesisData): boolean {
    const serialized = JSON.stringify(parsed || {}).toLowerCase();
    const startsWithReference = /^\s*[a-z0-9]+\s+\d+:\d+/.test(String(parsed.centralClaim || '').trim().toLowerCase());
    return startsWithReference || [
      'gospel summary',
      'response of faith',
      'central truth',
      'appeal',
      'decision',
      'call to response',
    ].some((phrase) => serialized.includes(phrase));
  }
}
