import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';

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
      // Fetch actual passage text to prevent LLM hallucination
      let passageText = '';
      try {
        const result = await this.scriptureService.getPassage(reference, 'KJV');
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
    const languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
    
    return `${languageInstruction} You are a biblical theologian synthesizing study insights for pastors preparing sermons.

Passage Reference: ${reference}

Passage Text:
${passageText || 'Text not available'}

After analyzing this passage through multiple interpretive lenses (structure, context, themes, challenges), provide a unified theological synthesis:

1. **Central Claim** (1-2 sentences): What is the core theological truth this passage communicates? State it as a clear, declarative claim.

2. **Canonical Significance** (2-3 sentences): How does this passage fit into the larger biblical storyline? What role does it play in God's unfolding revelation?

3. **Pastoral Takeaway** (2-3 sentences): What does this passage mean for God's people today? How should it shape faith and practice?

4. **Preaching Focus** (1-2 sentences): What is the sermon-ready angle? What should a pastor emphasize when preaching this text?

Format your response as JSON:
{
  "centralClaim": "...",
  "canonicalSignificance": "...",
  "pastoralTakeaway": "...",
  "preachingFocus": "..."
}

Be theologically precise, pastorally practical, and sermon-focused.`;
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
