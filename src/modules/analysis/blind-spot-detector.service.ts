import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlindSpotAnalysis } from '../../entities/blind-spot-analysis.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';

@Injectable()
export class BlindSpotDetectorService {
  constructor(
    @InjectRepository(BlindSpotAnalysis)
    private analysisRepository: Repository<BlindSpotAnalysis>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
    private scriptureService: ScriptureService,
  ) {}

  async analyze(workspaceId: string, userId: string): Promise<BlindSpotAnalysis> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, userId },
      relations: ['outlines', 'manuscripts', 'applications'],
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    await this.analysisRepository.delete({ workspaceId });

    const passage = await this.scriptureService.getPassage(workspace.mainPassage);
    const passageText = Array.isArray(passage?.verses)
      ? passage.verses.map((v: any) => `${v.reference} ${v.text}`).join('\n')
      : '';

    const outline = workspace.outlines?.[0];
    const outlinePoints = Array.isArray(outline?.structure?.points) 
      ? outline.structure.points 
      : [];

    const applications = workspace.applications || [];
    const applicationTexts = applications.map(a => a.content).join('\n');

    const prompt = `You are a preaching mentor conducting a BLIND SPOT ANALYSIS. This adds intellectual honesty by revealing what the sermon is NOT saying.

PASSAGE: ${workspace.mainPassage}
TEXT: ${passageText}

SERMON OUTLINE: ${outlinePoints.map((p: any) => typeof p === 'string' ? p : p.title || p.text).join('\n')}
APPLICATIONS: ${applicationTexts.substring(0, 800)}

TASK: Identify what this sermon is NOT addressing:

1. THEMES NOT ADDRESSED - What themes are present in the passage but missing from the sermon?
2. HARD VERSES AVOIDED - Which difficult/challenging verses in the passage are being skipped?
3. DOCTRINAL TENSIONS MINIMIZED - What theological tensions are being smoothed over?
4. APPLICATION IMBALANCE - Are applications skewed toward one category?
   Categories: personal, communal, missional, doctrinal

Return JSON:
{
  "themesNotAddressed": ["Theme 1", "Theme 2"],
  "hardVersesAvoided": ["Verse ref 1", "Verse ref 2"],
  "doctrinalTensionsMinimized": [
    {
      "tension": "Description of tension",
      "howMinimized": "How the sermon avoids it"
    }
  ],
  "applicationImbalance": [
    {
      "category": "personal",
      "count": 5,
      "recommendation": "Too heavy on personal, add communal applications"
    }
  ],
  "overallAssessment": "Summary of blind spots and their impact"
}

Be honest. This section exists to expose weaknesses, not validate the sermon.`;

    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.3,
        maxTokens: 2000,
      });

      const parsed = JSON.parse(response);

      const analysis = this.analysisRepository.create({
        workspaceId,
        themesNotAddressed: parsed.themesNotAddressed || [],
        hardVersesAvoided: parsed.hardVersesAvoided || [],
        doctrinalTensionsMinimized: parsed.doctrinalTensionsMinimized || [],
        applicationImbalance: parsed.applicationImbalance || [],
        overallAssessment: parsed.overallAssessment || 'No major blind spots detected',
      });

      return this.analysisRepository.save(analysis);
    } catch (error) {
      const fallback = this.analysisRepository.create({
        workspaceId,
        themesNotAddressed: [],
        hardVersesAvoided: [],
        doctrinalTensionsMinimized: [],
        applicationImbalance: [],
        overallAssessment: 'Analysis incomplete - manual review recommended',
      });

      return this.analysisRepository.save(fallback);
    }
  }

  async get(workspaceId: string): Promise<BlindSpotAnalysis | null> {
    return this.analysisRepository.findOne({ where: { workspaceId } });
  }
}
