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
      const generated = await this.generateStructuralAnalysis(passage, language || 'en');
      return generated;
    } catch (error) {
      console.error('Failed to generate structural analysis:', error);
      return {
        passage,
        literaryGenre: 'Unknown',
        structure: [],
        dataSource: 'unavailable'
      };
    }
  }

  private async generateStructuralAnalysis(passage: string, language?: string): Promise<StructuralAnalysis> {
    // Fetch the actual passage text to prevent LLM hallucination
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(passage, 'KJV');
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      console.error('Failed to fetch passage text for structural analysis:', error);
    }

    const languageLabel = language === 'es' ? 'Spanish' : 'English';
    const languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
    
    const prompt = `${languageInstruction} You are a biblical scholar analyzing the literary structure of scripture passages.

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

    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.3,
      maxTokens: 1200,
    });

    const parsed = JSON.parse(response);

    return {
      passage,
      literaryGenre: parsed.literaryGenre || 'Unknown',
      structure: parsed.structure || [],
      chiasm: parsed.chiasm,
      parallelism: parsed.parallelism && parsed.parallelism.length > 0 ? parsed.parallelism : undefined,
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
