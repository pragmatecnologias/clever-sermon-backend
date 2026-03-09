import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';

export interface InterpretiveChallenge {
  passage: string;
  challenge: string;
  views: InterpretiveView[];
  sdaPerspective?: SDAPerspective;
  dataSource: 'llm-generated' | 'curated' | 'unavailable';
}

export interface InterpretiveView {
  viewName: string;
  summary: string;
  proponents?: string;
  keyArguments: string[];
}

export interface SDAPerspective {
  position: string;
  reasoning: string;
  supportingTexts?: string[];
}

@Injectable()
export class InterpretiveChallengesDataService {
  private challengeIndex: Map<string, InterpretiveChallenge> = new Map();

  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService
  ) {
    this.initializeChallengeData();
  }

  async getInterpretiveChallenge(passage: string, language?: string): Promise<InterpretiveChallenge | null> {
    const normalized = this.normalizePassage(passage);
    const challenge = this.challengeIndex.get(normalized);
    
    if (challenge) {
      return { ...challenge, dataSource: 'curated' };
    }

    // Generate interpretive challenges using LLM
    try {
      const generated = await this.generateInterpretiveChallenge(passage, language || 'en');
      return generated;
    } catch (error) {
      console.error('Failed to generate interpretive challenge:', error);
      return null;
    }
  }

  private async generateInterpretiveChallenge(passage: string, language?: string): Promise<InterpretiveChallenge> {
    // Fetch actual passage text to prevent LLM hallucination
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(passage, 'KJV');
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      console.error('Failed to fetch passage text for interpretive challenges:', error);
    }

    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
    
    const prompt = `${languageInstruction} You are a biblical scholar identifying interpretive challenges and different theological perspectives on scripture passages.

Passage Reference: ${passage}

Passage Text:
${passageText || 'Text not available'}

Provide interpretive challenges in the following JSON format:
{
  "challenge": "Main interpretive question or difficulty",
  "views": [
    {
      "viewName": "Name of interpretive view",
      "summary": "Brief summary of this view",
      "proponents": "Optional: who holds this view",
      "keyArguments": ["Argument 1", "Argument 2", "Argument 3"]
    }
  ],
  "sdaPerspective": {
    "position": "SDA theological position",
    "reasoning": "Why SDA theology holds this position",
    "supportingTexts": ["Reference 1", "Reference 2"]
  }
}

Guidelines:
- Identify genuine interpretive challenges or theological debates
- Present 2-4 different scholarly views fairly
- Include key arguments for each view
- Provide SDA perspective when relevant to SDA theology
- Be balanced and scholarly
- If no significant interpretive challenge exists, return null for challenge field
- Return ONLY valid JSON, no markdown or extra text`;

    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.3,
      maxTokens: 1200,
    });

    const parsed = JSON.parse(response);

    if (!parsed.challenge) {
      return null;
    }

    return {
      passage,
      challenge: parsed.challenge,
      views: parsed.views || [],
      sdaPerspective: parsed.sdaPerspective,
      dataSource: 'llm-generated',
    };
  }

  private normalizePassage(passage: string): string {
    return passage.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private initializeChallengeData() {
    // Reserved for future curated high-priority passages
    // All other passages will be dynamically generated via LLM
  }

  hasInterpretiveChallenge(passage: string): boolean {
    const normalized = this.normalizePassage(passage);
    return this.challengeIndex.has(normalized);
  }

  getAllAvailablePassages(): string[] {
    return Array.from(this.challengeIndex.keys());
  }
}
