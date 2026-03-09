import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TensionAnalysis } from '../../entities/tension-analysis.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';

@Injectable()
export class TensionMappingService {
  constructor(
    @InjectRepository(TensionAnalysis)
    private analysisRepository: Repository<TensionAnalysis>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
    private scriptureService: ScriptureService,
  ) {}

  async analyze(workspaceId: string, userId: string): Promise<TensionAnalysis> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, userId },
      relations: ['outlines', 'manuscripts'],
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    await this.analysisRepository.delete({ workspaceId });

    const passage = await this.scriptureService.getPassage(workspace.mainPassage);
    const passageText = Array.isArray(passage?.verses)
      ? passage.verses.map((v: any) => `${v.reference} ${v.text}`).join('\n')
      : '';

    const manuscript = workspace.manuscripts?.[0];
    const manuscriptText = manuscript?.content?.text || '';

    const prompt = `You are a preaching mentor specializing in TENSION MAPPING. Preaching thrives on tension, not quick resolution.

PASSAGE: ${workspace.mainPassage}
TEXT: ${passageText}

MANUSCRIPT EXCERPT: ${manuscriptText.substring(0, 1500)}

TASK:
Identify TEXTUAL TENSIONS in the passage:
1. PARADOXES - Apparent contradictions ("dead yet alive", "saved by grace yet created for works")
2. UNRESOLVED PHRASES - Questions or statements left hanging
3. THEOLOGICAL FRICTION - Concepts that create productive discomfort

For each tension:
- Quote the exact text
- Explain the tension
- Suggest how to PRESERVE it before resolving
- Check if the sermon resolves it too quickly

Analyze SERMON TENSION HANDLING:
- Does the sermon preserve tension before resolving?
- Does it resolve too quickly?
- Rate timing: "too_early" / "appropriate" / "unresolved"

Give TENSION PRESERVATION SCORE (0-100).

Return JSON:
{
  "tensions": [
    {
      "type": "paradox",
      "text": "Exact quote from passage",
      "verseReference": "Verse ref",
      "explanation": "What creates the tension",
      "preservationStrategy": "How to hold this tension before resolving"
    }
  ],
  "sermonTensionHandling": [
    {
      "tension": "The tension being addressed",
      "isPreserved": false,
      "resolutionTiming": "too_early",
      "recommendation": "Specific advice"
    }
  ],
  "tensionPreservationScore": 65
}

Remember: Tension creates weight. Quick resolution creates shallowness.`;

    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.4,
        maxTokens: 2500,
      });

      const parsed = JSON.parse(response);

      const analysis = this.analysisRepository.create({
        workspaceId,
        tensions: parsed.tensions || [],
        sermonTensionHandling: parsed.sermonTensionHandling || [],
        tensionPreservationScore: parsed.tensionPreservationScore || 50,
      });

      return this.analysisRepository.save(analysis);
    } catch (error) {
      const fallback = this.analysisRepository.create({
        workspaceId,
        tensions: [],
        sermonTensionHandling: [],
        tensionPreservationScore: 50,
      });

      return this.analysisRepository.save(fallback);
    }
  }

  async get(workspaceId: string): Promise<TensionAnalysis | null> {
    return this.analysisRepository.findOne({ where: { workspaceId } });
  }
}
