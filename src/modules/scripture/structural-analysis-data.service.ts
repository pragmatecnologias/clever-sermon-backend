import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';

export interface StructuralAnalysis {
  passage: string;
  literaryGenre: string;
  structure: StructuralElement[];
  chiasm?: ChiasmStructure;
  parallelism?: ParallelismPattern[];
  dataSource: 'llm-generated' | 'curated' | 'unavailable';
}

export interface StructuralElement {
  verses: string;
  type: 'introduction' | 'body' | 'conclusion' | 'transition' | 'climax' | 'inclusio';
  description: string;
}

export interface ChiasmStructure {
  pattern: string;
  elements: Array<{ label: string; verses: string; content: string }>;
}

export interface ParallelismPattern {
  type: 'synonymous' | 'antithetic' | 'synthetic' | 'emblematic';
  verses: string;
  lineA: string;
  lineB: string;
}

@Injectable()
export class StructuralAnalysisDataService {
  private structureIndex: Map<string, StructuralAnalysis> = new Map();

  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService
  ) {
    this.initializeStructuralData();
  }

  async getStructuralAnalysis(passage: string, language?: string): Promise<StructuralAnalysis> {
    const normalized = this.normalizePassage(passage);
    const analysis = this.structureIndex.get(normalized);
    
    if (analysis) {
      return { ...analysis, dataSource: 'curated' };
    }

    // Generate structural analysis using LLM
    try {
      console.log(`[StructuralAnalysis] Generating for passage: ${passage}, language: ${language || 'en'}`);
      const generated = await this.generateStructuralAnalysis(passage, language || 'en');
      console.log(`[StructuralAnalysis] Successfully generated for ${passage}`);
      return generated;
    } catch (error) {
      console.error(`[StructuralAnalysis] Failed for passage: ${passage}, language: ${language}`, error);
      console.error('[StructuralAnalysis] Error details:', error.message, error.stack?.substring(0, 500));
      return {
        passage,
        literaryGenre: 'Unknown',
        structure: [],
        dataSource: 'unavailable'
      };
    }
  }

  private async generateStructuralAnalysis(passage: string, language?: string): Promise<StructuralAnalysis> {
    const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
    // Fetch the actual passage text to prevent LLM hallucination
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(passage, analysisTranslation);
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      console.error('Failed to fetch passage text for structural analysis:', error);
    }

    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const languageInstruction = language === 'es'
      ? `CRITICAL INSTRUCTIONS:
1. You MUST respond ONLY in Spanish. Every single field in the JSON must be in Spanish.
2. Do NOT use any English words in the JSON fields.
3. Return ONLY the JSON object - no explanations, no markdown, no extra text.

INSTRUCCIONES CRÍTICAS:
1. Debes responder ÚNICAMENTE en español. Todos los campos del JSON deben estar en español.
2. NO uses NINGUNA palabra en inglés en los campos del JSON.
3. Devuelve SOLAMENTE el objeto JSON - sin explicaciones, sin markdown, sin texto adicional.`
      : 'Respond in English. Return ONLY the JSON object - no markdown, no extra text.';
    
    const prompt = `${languageInstruction}

You are a biblical scholar analyzing the literary structure of scripture passages.

Passage Reference: ${passage}

Passage Text:
${passageText || 'Text not available - analyze based on reference only'}

Provide a detailed structural analysis in the following JSON format:
{
  "literaryGenre": "Genre (e.g., Narrative, Poetry, Apocalyptic, Legal, Wisdom, Gospel, Epistle)",
  "structure": [
    {
      "verses": "verse range",
      "type": "introduction|body|conclusion|transition|climax|inclusio",
      "description": "Description of this structural element"
    }
  ],
  "chiasm": {
    "pattern": "Pattern notation (e.g., A-B-C-B'-A')",
    "elements": [
      {
        "label": "A",
        "verses": "verse range",
        "content": "Brief description"
      }
    ]
  },
  "parallelism": [
    {
      "type": "synonymous|antithetic|synthetic|emblematic",
      "verses": "verse range",
      "lineA": "First line",
      "lineB": "Second line"
    }
  ]
}

Guidelines:
- Identify the literary genre accurately
- Break down the passage into 3-6 structural elements
- Note transitions, climaxes, and literary devices
- ALWAYS create a chiastic structure with at least 3 elements (A-B-A' minimum), even if the passage doesn't have an obvious chiasm - identify thematic or conceptual parallels
- For poetry, identify parallelism patterns when present
- Parallelism is optional - only include if clearly present
- Return ONLY valid JSON, no markdown or extra text`;

    console.log(`[StructuralAnalysis] Calling LLM for passage: ${passage}`);
    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.3,
      maxTokens: 1500, // Increased for Spanish responses
    });

    console.log(`[StructuralAnalysis] LLM response length: ${response.length} chars`);
    console.log(`[StructuralAnalysis] Response preview: ${response.substring(0, 200)}...`);

    // Extract JSON from response - handle markdown code blocks or extra text
    let jsonStr = response.trim();
    
    // Try to extract JSON from markdown code block
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      console.log('[StructuralAnalysis] Extracted JSON from markdown code block');
      jsonStr = codeBlockMatch[1];
    } else {
      // Try to find raw JSON object
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('[StructuralAnalysis] Extracted JSON from raw response');
        jsonStr = jsonMatch[0];
      } else {
        console.error('[StructuralAnalysis] No JSON found in response');
      }
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
      console.log('[StructuralAnalysis] Successfully parsed JSON');
    } catch (parseError) {
      console.error('[StructuralAnalysis] Failed to parse JSON:', parseError.message);
      console.error('[StructuralAnalysis] JSON string length:', jsonStr.length);
      console.error('[StructuralAnalysis] JSON snippet:', jsonStr.substring(0, 500));
      console.error('[StructuralAnalysis] Full response:', response);
      throw new Error(`JSON parse failed: ${parseError.message}`);
    }

    // Handle Spanish field names
    return {
      passage,
      literaryGenre: parsed.literaryGenre || parsed.géneroLiterario || parsed.generoLiterario || 'Unknown',
      structure: parsed.structure || parsed.estructura || [],
      chiasm: parsed.chiasm || parsed.quiasmo,
      parallelism: (parsed.parallelism || parsed.paralelismo) && (parsed.parallelism || parsed.paralelismo).length > 0 ? (parsed.parallelism || parsed.paralelismo) : undefined,
      dataSource: 'llm-generated',
    };
  }

  private normalizePassage(passage: string): string {
    if (!passage) return '';
    return passage.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private initializeStructuralData() {
    // Reserved for future curated high-priority passages
    // All other passages will be dynamically generated via LLM
  }

  hasStructuralData(passage: string): boolean {
    const normalized = this.normalizePassage(passage);
    return this.structureIndex.has(normalized);
  }

  getAllAvailablePassages(): string[] {
    return Array.from(this.structureIndex.keys());
  }
}
