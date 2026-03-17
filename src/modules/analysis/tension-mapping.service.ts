import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TensionAnalysis } from '../../entities/tension-analysis.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { AnalysisPrompts } from './analysis-prompts';

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

    const prompt = AnalysisPrompts.tensionMapping({
      mainPassage: workspace.mainPassage,
      passageText,
      manuscriptExcerpt: manuscriptText.substring(0, 1500),
    });

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
