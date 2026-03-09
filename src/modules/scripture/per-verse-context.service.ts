import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';

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
      return generatedContext;
    } catch (error) {
      console.error('Failed to generate verse context:', error);
      return {
        reference,
        dataSource: 'unavailable'
      };
    }
  }

  private async generateContextWithLLM(reference: string, language?: string): Promise<PerVerseContext> {
    // Fetch actual passage text to prevent LLM hallucination
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(reference, 'KJV');
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      console.error('Failed to fetch passage text for verse context:', error);
    }

    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
    
    const prompt = `${languageInstruction} You are a biblical scholar providing historical, cultural, and geographical context for scripture passages.

Reference: ${reference}

Passage Text:
${passageText || 'Text not available'}

Provide detailed context in the following JSON format:
{
  "historical": [
    {
      "note": "Historical fact or background",
      "period": "Time period (e.g., 'United Monarchy Period', 'c. 1025 BC')",
      "source": "Biblical reference or historical source (optional)"
    }
  ],
  "cultural": [
    {
      "note": "Cultural practice, custom, or belief",
      "category": "custom|law|practice|belief|social",
      "source": "Biblical reference (optional)"
    }
  ],
  "geographical": [
    {
      "place": "Place name",
      "description": "Description of the place",
      "significance": "Biblical or historical significance",
      "modernLocation": "Modern location (optional)"
    }
  ],
  "timeline": [
    {
      "event": "Event name",
      "date": "Approximate date",
      "significance": "Why this event matters"
    }
  ]
}

Guidelines:
- Provide 2-4 historical notes covering the political, religious, and social background
- Include 2-4 cultural notes about customs, practices, or beliefs relevant to the passage
- List 1-3 geographical locations mentioned or relevant to the passage
- Include 1-3 timeline events that provide chronological context
- Be specific and scholarly, citing biblical references where appropriate
- Use accurate historical dates and periods
- For cultural categories, use: custom, law, practice, belief, or social
- Return ONLY valid JSON, no markdown or extra text`;

    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.3,
      maxTokens: 1500,
    });

    const parsed = JSON.parse(response);

    return {
      reference,
      historical: parsed.historical || [],
      cultural: parsed.cultural || [],
      geographical: parsed.geographical || [],
      timeline: parsed.timeline || [],
      dataSource: 'llm-generated',
    };
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
