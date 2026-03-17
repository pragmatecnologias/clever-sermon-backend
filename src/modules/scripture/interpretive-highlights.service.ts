import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScripturePrompts } from './scripture-prompts';

export interface InterpretiveHighlight {
  phrase: string;
  startIndex: number;
  endIndex: number;
  type: 'grammatical_ambiguity' | 'theological_debate' | 'textual_variant' | 'contextual_tension';
  options: {
    view: string;
    explanation: string;
    proponents: string[];
  }[];
  significance: string;
}

@Injectable()
export class InterpretiveHighlightsService {
  constructor(private llmService: LlmService) {}

  async getInterpretiveHighlights(
    reference: string,
    verseText: string
  ): Promise<InterpretiveHighlight[]> {
    // Generate highlights using LLM
    const prompt = ScripturePrompts.interpretiveHighlights({ reference, verseText });

    try {
      const response = await this.llmService.generateCompletion(prompt, 'system', {
        temperature: 0.3,
        maxTokens: 1500
      });

      const parsed = this.parseHighlights(response, verseText);
      return parsed;
    } catch (error) {
      console.error('[InterpretiveHighlights] Error:', error);
      return [];
    }
  }

  private parseHighlights(response: string, verseText: string): InterpretiveHighlight[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const data = JSON.parse(jsonMatch[0]);
      
      return data.map((item: any) => {
        const startIndex = verseText.indexOf(item.phrase);
        const endIndex = startIndex + item.phrase.length;

        return {
          phrase: item.phrase,
          startIndex: startIndex >= 0 ? startIndex : 0,
          endIndex: endIndex > 0 ? endIndex : item.phrase.length,
          type: item.type || 'theological_debate',
          options: item.options || [],
          significance: item.significance || ''
        };
      });
    } catch (error) {
      return [];
    }
  }

  async getHighlightsByType(
    reference: string,
    verseText: string,
    type: 'grammatical_ambiguity' | 'theological_debate' | 'textual_variant' | 'contextual_tension'
  ): Promise<InterpretiveHighlight[]> {
    const all = await this.getInterpretiveHighlights(reference, verseText);
    return all.filter(h => h.type === type);
  }

  formatHighlightedText(verseText: string, highlights: InterpretiveHighlight[]): any {
    // Sort highlights by start index
    const sorted = [...highlights].sort((a, b) => a.startIndex - b.startIndex);

    const segments: any[] = [];
    let currentIndex = 0;

    sorted.forEach(highlight => {
      // Add text before highlight
      if (currentIndex < highlight.startIndex) {
        segments.push({
          text: verseText.substring(currentIndex, highlight.startIndex),
          highlighted: false
        });
      }

      // Add highlighted text
      segments.push({
        text: highlight.phrase,
        highlighted: true,
        type: highlight.type,
        options: highlight.options,
        significance: highlight.significance
      });

      currentIndex = highlight.endIndex;
    });

    // Add remaining text
    if (currentIndex < verseText.length) {
      segments.push({
        text: verseText.substring(currentIndex),
        highlighted: false
      });
    }

    return {
      reference: verseText,
      segments,
      highlightCount: highlights.length
    };
  }
}
