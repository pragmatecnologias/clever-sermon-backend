import { Injectable } from '@nestjs/common';
import { EGWService } from '../egw/egw.service';
import { LlmService } from '../llm/llm.service';

export interface VerseCommentary {
  verseReference: string;
  notes: CommentaryNote[];
  dataSource: 'egw' | 'llm-generated' | 'unavailable';
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
    private llmService: LlmService
  ) {}

  async getCommentary(verseReference: string, userId?: string, force?: boolean, language?: string): Promise<VerseCommentary> {
    try {
      const notes: CommentaryNote[] = [];

      // 1. Get EGW quotes for this passage
      // Note: Force refresh is handled at the controller level by not caching the response
      const egwQuotes = await this.egwService.getRelevantQuotes(verseReference, undefined, 5);
      
      for (const quote of egwQuotes) {
        notes.push({
          type: 'egw',
          content: quote.text,
          source: `${quote.bookTitle} - ${quote.reference}`
        });
      }

      // 2. If we have EGW quotes, generate contextual commentary using LLM
      if (notes.length > 0) {
        const contextualNote = await this.generateContextualCommentary(verseReference, userId, language || 'en');
        if (contextualNote) {
          notes.unshift(contextualNote); // Add at beginning
        }
      }

      // 3. If no EGW quotes found, generate full LLM commentary
      if (notes.length === 0) {
        const llmNotes = await this.generateLLMCommentary(verseReference, userId, language || 'en');
        notes.push(...llmNotes);
      }

      return {
        verseReference,
        notes,
        dataSource: egwQuotes.length > 0 ? 'egw' : (notes.length > 0 ? 'llm-generated' : 'unavailable')
      };
    } catch (error) {
      console.error('Error generating verse commentary:', error);
      return {
        verseReference,
        notes: [],
        dataSource: 'unavailable'
      };
    }
  }

  private async generateContextualCommentary(reference: string, userId?: string, language?: string): Promise<CommentaryNote | null> {
    try {
      const languageLabel = language === 'es' ? 'Spanish' : 'English';
      const languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
      
      const prompt = `${languageInstruction} Provide a brief 2-3 sentence contextual overview of ${reference}. Include:
- What is happening in this passage
- Where it fits in the book/narrative
- Key theological significance

Be concise and pastor-focused. Language: ${languageLabel}`;

      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 200,
        }
      );

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
      
      const prompt = `${languageInstruction} You are a biblical scholar providing verse commentary for pastors.

Analyze ${reference} and provide 3-4 concise commentary notes covering:

1. **Context**: What's happening in this passage? Where does it fit in the book?
2. **Key Words**: Any significant Greek/Hebrew words or phrases worth noting?
3. **Historical/Cultural**: Relevant historical or cultural background
4. **Theological**: Main theological significance or application

Format as JSON:
{
  "notes": [
    {
      "type": "context" | "word" | "historical" | "theological",
      "content": "...",
      "source": "..."
    }
  ]
}

Keep each note to 2-3 sentences. Be practical and pastor-focused. Language: ${languageLabel}`;

      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 800,
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
