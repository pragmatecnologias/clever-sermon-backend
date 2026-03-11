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
    const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
    // Fetch actual passage text to prevent LLM hallucination
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(reference, analysisTranslation);
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      console.error('Failed to fetch passage text for verse context:', error);
    }

    const languageInstruction = language === 'es'
      ? 'Responde únicamente en español. No uses inglés en ningún campo de texto de la respuesta.'
      : 'Respond in English.';
    
    const prompt = `${languageInstruction} Devuelve solo JSON válido. Eres un erudito bíblico que da contexto histórico, cultural y geográfico.

Reference: ${reference}

Passage Text:
${passageText || 'Text not available'}

Formato JSON:
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

Reglas:
- 2-3 notas históricas.
- 2-3 notas culturales.
- 1-2 notas geográficas.
- 1-2 eventos cronológicos.
- Sin markdown ni texto fuera del JSON.`;

    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.3,
      maxTokens: 900,
    });

    let parsed: any;
    try {
      // Extract JSON from response - handle markdown code blocks
      let jsonStr = response.trim();
      const codeBlockMatch = jsonStr.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      } else {
        const jsonMatch = jsonStr.match(/{[\s\S]*}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        }
      }
      jsonStr = jsonStr
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/,\s*([}\]])/g, '$1')
        .trim();

      parsed = JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse per-verse context response:', error);
      console.error('Raw response:', response);
      throw new Error('Invalid JSON response from LLM');
    }

    // Handle Spanish field names
    return {
      reference,
      historical: parsed.historical || parsed.histórico || parsed.historico || [],
      cultural: parsed.cultural || [],
      geographical: parsed.geographical || parsed.geográfico || parsed.geografico || [],
      timeline: parsed.timeline || parsed.línea || parsed.linea || [],
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
