import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreachingStrategy, PreachingGenre, EmotionalArc } from '../../entities/preaching-strategy.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { AnalysisPrompts } from './analysis-prompts';

@Injectable()
export class PreachingStrategySelectorService {
  constructor(
    @InjectRepository(PreachingStrategy)
    private strategyRepository: Repository<PreachingStrategy>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
    private scriptureService: ScriptureService,
  ) {}

  async analyze(workspaceId: string, userId: string): Promise<PreachingStrategy> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, userId },
      relations: ['outlines'],
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    await this.strategyRepository.delete({ workspaceId });

    const passage = await this.scriptureService.getPassage(workspace.mainPassage);
    const passageText = Array.isArray(passage?.verses)
      ? passage.verses.map((v: any) => `${v.reference} ${v.text}`).join('\n')
      : '';

    const prompt = AnalysisPrompts.preachingStrategy({
      mainPassage: workspace.mainPassage,
      passageText,
      theme: workspace.theme || 'Not specified',
      audience: workspace.audienceProfile || 'General congregation',
      goals: workspace.sermonGoals || 'Not specified',
    });

    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.4,
        maxTokens: 1500,
      });

      const parsed = JSON.parse(response);

      const strategy = this.strategyRepository.create({
        workspaceId,
        recommendedGenre: parsed.recommendedGenre || PreachingGenre.EXPOSITORY,
        genreRationale: parsed.genreRationale || 'Default expository approach',
        emotionalArc: parsed.emotionalArc || EmotionalArc.QUESTION_TO_DISCOVERY,
        tone: parsed.tone || 'balanced',
        targetLengthMinutes: parsed.targetLengthMinutes || 30,
        tensionLevel: parsed.tensionLevel || 50,
        applicationDensity: parsed.applicationDensity || 50,
        invitationDriven: parsed.invitationDriven || false,
        structuralGuidance: parsed.structuralGuidance || null,
      });

      return this.strategyRepository.save(strategy);
    } catch (error) {
      const fallback = this.strategyRepository.create({
        workspaceId,
        recommendedGenre: PreachingGenre.EXPOSITORY,
        genreRationale: 'Default strategy - analysis failed',
        emotionalArc: EmotionalArc.QUESTION_TO_DISCOVERY,
        tone: 'balanced',
        targetLengthMinutes: 30,
        tensionLevel: 50,
        applicationDensity: 50,
        invitationDriven: false,
        structuralGuidance: null,
      });

      return this.strategyRepository.save(fallback);
    }
  }

  async get(workspaceId: string): Promise<PreachingStrategy | null> {
    return this.strategyRepository.findOne({ where: { workspaceId } });
  }
}
