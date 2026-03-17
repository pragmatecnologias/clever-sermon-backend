import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TheologicalCenterAnalysis } from '../../entities/theological-center-analysis.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { WorkspaceHelpers } from '../workspaces/helpers';
import { AnalysisPrompts } from './analysis-prompts';

@Injectable()
export class TheologicalCenterService {
  constructor(
    @InjectRepository(TheologicalCenterAnalysis)
    private analysisRepository: Repository<TheologicalCenterAnalysis>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
    private scriptureService: ScriptureService,
  ) {}

  async analyze(workspaceId: string, userId: string): Promise<TheologicalCenterAnalysis> {
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

    const outline = workspace.outlines?.[0];
    const manuscript = workspace.manuscripts?.[0];
    const outlinePoints = WorkspaceHelpers.extractOutlinePointTexts(outline?.structure || {});

    const prompt = AnalysisPrompts.theologicalCenter({
      mainPassage: workspace.mainPassage,
      passageText,
      theme: workspace.theme || 'Not specified',
      outlinePoints: outlinePoints.join('\n'),
    });

    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.3,
        maxTokens: 2000,
      });

      const parsed = JSON.parse(response);

      const analysis = this.analysisRepository.create({
        workspaceId,
        dominantCenter: parsed.dominantCenter || 'Unable to determine',
        textualWarrant: parsed.textualWarrant || '',
        alignmentScore: parsed.alignmentScore || 50,
        deviations: parsed.deviations || [],
        secondaryThemes: parsed.secondaryThemes || [],
        suppressionSuggestions: parsed.suppressionSuggestions || [],
      });

      return this.analysisRepository.save(analysis);
    } catch (error) {
      const fallback = this.analysisRepository.create({
        workspaceId,
        dominantCenter: 'Analysis failed - manual review needed',
        textualWarrant: passageText.substring(0, 200),
        alignmentScore: 50,
        deviations: [],
        secondaryThemes: [],
        suppressionSuggestions: [],
      });

      return this.analysisRepository.save(fallback);
    }
  }

  async get(workspaceId: string): Promise<TheologicalCenterAnalysis | null> {
    return this.analysisRepository.findOne({ where: { workspaceId } });
  }
}
