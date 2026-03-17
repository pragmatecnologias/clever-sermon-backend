import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctrinalPrecisionCheck, DoctrinalCategory } from '../../entities/doctrinal-precision-check.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { WorkspaceHelpers } from '../workspaces/helpers';
import { AnalysisPrompts } from './analysis-prompts';

@Injectable()
export class DoctrinalPrecisionService {
  constructor(
    @InjectRepository(DoctrinalPrecisionCheck)
    private checkRepository: Repository<DoctrinalPrecisionCheck>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
    private scriptureService: ScriptureService,
  ) {}

  async analyze(workspaceId: string, userId: string): Promise<DoctrinalPrecisionCheck> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, userId },
      relations: ['outlines', 'manuscripts'],
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    await this.checkRepository.delete({ workspaceId });

    const passage = await this.scriptureService.getPassage(workspace.mainPassage);
    const passageText = Array.isArray(passage?.verses)
      ? passage.verses.map((v: any) => `${v.reference} ${v.text}`).join('\n')
      : '';

    const manuscript = workspace.manuscripts?.[0];
    const manuscriptText = manuscript?.content?.text || '';
    const outline = workspace.outlines?.[0];
    const outlinePoints = WorkspaceHelpers.extractOutlinePointTexts(outline?.structure || {});

    const prompt = AnalysisPrompts.doctrinalPrecision({
      mainPassage: workspace.mainPassage,
      passageText,
      theme: workspace.theme || 'Not specified',
      outline: outlinePoints.join('\n'),
      manuscriptExcerpt: manuscriptText.substring(0, 1200),
    });

    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.2,
        maxTokens: 2000,
      });

      const parsed = JSON.parse(response);

      const check = this.checkRepository.create({
        workspaceId,
        checks: parsed.checks || [],
        overallConsistencyScore: parsed.overallConsistencyScore || 75,
        summary: parsed.summary || 'Doctrinal review completed',
      });

      return this.checkRepository.save(check);
    } catch (error) {
      const fallback = this.checkRepository.create({
        workspaceId,
        checks: [],
        overallConsistencyScore: 75,
        summary: 'Analysis failed - manual doctrinal review recommended',
      });

      return this.checkRepository.save(fallback);
    }
  }

  async get(workspaceId: string): Promise<DoctrinalPrecisionCheck | null> {
    return this.checkRepository.findOne({ where: { workspaceId } });
  }
}
