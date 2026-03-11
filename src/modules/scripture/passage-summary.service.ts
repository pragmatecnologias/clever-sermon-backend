import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { parseJsonObjectFromLlm } from './json-response.util';

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
    
    return `${languageInstruction} You are a biblical scholar providing interpretive guidance for pastors studying Scripture.

Passage Reference: ${reference}

Passage Text:
${passageText || 'Text not available'}

Analyze this passage and provide:

1. **Summary** (2-3 sentences): What happens in this passage? What is the basic content?

2. **Passage Movement** (if narrative, 3-5 steps): Break down the flow of the passage step by step. If it's not narrative (e.g., poetry, epistle), skip this section.

3. **Interpretive Center** (1-2 sentences): What is the theological heart of this passage? What is the main claim or truth being communicated?

4. **Main Tension** (1-2 sentences): What is the primary theological or interpretive tension in this passage? What question or difficulty does it raise?

Format your response as JSON:
{
  "summary": "...",
  "movement": ["step 1", "step 2", "step 3"] or [],
  "interpretiveCenter": "...",
  "mainTension": "..."
}

Be concise, theologically precise, and pastor-focused.`;
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
