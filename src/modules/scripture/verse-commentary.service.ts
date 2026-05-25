import { Injectable } from '@nestjs/common';
import { EGWService } from '../egw/egw.service';
import { LlmService } from '../llm/llm.service';
import { ScripturePrompts } from './scripture-prompts';
import { GeneratedStudyOutputValidator } from './generated-study-output.validator';

export interface VerseCommentary {
  verseReference: string;
  notes: CommentaryNote[];
  dataSource: 'egw' | 'llm-generated' | 'unavailable';
  status?: 'ready' | 'not_generated' | 'unavailable';
  message?: string;
  warnings?: string[];
}

export interface CommentaryNote {
  type: 'context' | 'word' | 'historical' | 'theological' | 'egw';
  content: string;
  source: string;
}

@Injectable()
export class VerseCommentaryService {
  constructor(
    private egwService: EGWService,
    private llmService: LlmService,
    private generatedStudyOutputValidator: GeneratedStudyOutputValidator,
  ) {}

  async getCommentary(verseReference: string, userId?: string, force?: boolean, language?: string): Promise<VerseCommentary> {
    try {
      const notes: CommentaryNote[] = [];
      const requestedLanguage = language || 'en';

      // 1. Get EGW quotes for this passage
      // Note: Force refresh is handled at the controller level by not caching the response
      const egwQuotes = await this.egwService.getRelevantQuotes(verseReference, undefined, 5, requestedLanguage);
      
      for (const quote of egwQuotes) {
        notes.push({
          type: 'egw',
          content: quote.text,
          source: `${quote.bookTitle} - ${quote.reference}`
        });
      }

      // 2. If we have EGW quotes, generate contextual commentary using LLM
      if (notes.length > 0) {
        const contextualNote = await this.generateContextualCommentary(verseReference, userId, requestedLanguage);
        if (contextualNote) {
          notes.unshift(contextualNote); // Add at beginning
        }
      }

      // 3. If no EGW quotes found, generate full LLM commentary
      if (notes.length === 0) {
        const llmNotes = await this.generateLLMCommentary(verseReference, userId, requestedLanguage);
        notes.push(...llmNotes);
      }

      if (notes.length === 0) {
        return {
          verseReference,
          notes: [],
          dataSource: 'unavailable',
          status: 'unavailable',
          message: 'Verse commentary could not be generated. Please retry.',
          warnings: ['No commentary notes were generated.'],
        };
      }

      const validation = this.generatedStudyOutputValidator.validate('verse-commentary', { verseReference, notes, dataSource: 'llm-generated' }, { reference: verseReference, language: requestedLanguage });
      if (!validation.valid) {
        return {
          verseReference,
          notes: [],
          dataSource: 'unavailable',
          status: 'unavailable',
          message: 'Verse commentary could not be generated. Please retry.',
          warnings: validation.errors,
        };
      }

      return {
        verseReference,
        notes,
        dataSource: egwQuotes.length > 0 ? 'egw' : (notes.length > 0 ? 'llm-generated' : 'unavailable'),
        status: 'ready',
        warnings: [],
      };
    } catch (error) {
      console.error('Error generating verse commentary:', error);
      return {
        verseReference,
        notes: [],
        dataSource: 'unavailable',
        status: 'unavailable',
        message: 'Verse commentary could not be generated. Please retry.',
        warnings: ['Verse commentary generation failed.'],
      };
    }
  }

  private async generateContextualCommentary(reference: string, userId?: string, language?: string): Promise<CommentaryNote | null> {
    try {
      const languageLabel = language === 'es' ? 'Spanish' : 'English';
      const languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
      
      const prompt = ScripturePrompts.verseContextualCommentary({
        languageInstruction,
        reference,
        languageLabel,
      });

      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 1000,
          timeoutMs: 12000,
        }
      );

      if (!response || response.trim().length === 0) {
        return null;
      }

      return {
        type: 'context',
        content: response.trim(),
        source: 'Contextual Analysis'
      };
    } catch (error) {
      console.error('Error generating contextual commentary:', error);
      return null;
    }
  }

  private async generateLLMCommentary(reference: string, userId?: string, language?: string): Promise<CommentaryNote[]> {
    try {
      const languageLabel = language === 'es' ? 'Spanish' : 'English';
      const languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
      
      const prompt = ScripturePrompts.verseLlmCommentary({
        languageInstruction,
        reference,
        languageLabel,
      });

      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 800,
          timeoutMs: 12000,
        }
      );

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed.notes) ? parsed.notes : [];
    } catch (error) {
      console.error('Error generating LLM commentary:', error);
      return [];
    }
  }
}
