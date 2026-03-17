import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlindSpotAnalysis } from '../../entities/blind-spot-analysis.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { WorkspaceHelpers } from '../workspaces/helpers';
import { AnalysisPrompts } from './analysis-prompts';

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
    const outlinePoints = WorkspaceHelpers.extractOutlinePointTexts(outline?.structure || {});

    const applications = workspace.applications || [];
    const applicationTexts = applications.map(a => a.content).join('\n');

    const prompt = AnalysisPrompts.blindSpotDetector({
      mainPassage: workspace.mainPassage,
      passageText,
      outlinePoints: outlinePoints.join('\n'),
      applicationTexts: applicationTexts.substring(0, 800),
    });

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
