import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalContextEnhanced } from '../../entities/historical-context-enhanced.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { AnalysisPrompts } from './analysis-prompts';

@Injectable()
export class HistoricalContextEnhancerService {
  constructor(
    @InjectRepository(HistoricalContextEnhanced)
    private contextRepository: Repository<HistoricalContextEnhanced>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
  ) {}

  async analyze(workspaceId: string, userId: string): Promise<HistoricalContextEnhanced> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    await this.contextRepository.delete({ workspaceId });

    const prompt = AnalysisPrompts.historicalContextEnhancer(workspace.mainPassage);

    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.3,
        maxTokens: 2500,
      });

      const parsed = JSON.parse(response);

      const context = this.contextRepository.create({
        workspaceId,
        passage: workspace.mainPassage,
        socialRealities: parsed.socialRealities || [],
        powerStructures: parsed.powerStructures || [],
        economicContext: parsed.economicContext || [],
        religiousClimate: parsed.religiousClimate || [],
        audiencePressures: parsed.audiencePressures || [],
        synthesisStatement: parsed.synthesisStatement || 'Historical context analysis pending',
      });

      return this.contextRepository.save(context);
    } catch (error) {
      const fallback = this.contextRepository.create({
        workspaceId,
        passage: workspace.mainPassage,
        socialRealities: [],
        powerStructures: [],
        economicContext: [],
        religiousClimate: [],
        audiencePressures: [],
        synthesisStatement: 'Historical context analysis failed - manual research recommended',
      });

      return this.contextRepository.save(fallback);
    }
  }

  async get(workspaceId: string): Promise<HistoricalContextEnhanced | null> {
    return this.contextRepository.findOne({ where: { workspaceId } });
  }
}
