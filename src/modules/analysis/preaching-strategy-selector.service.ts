import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreachingStrategy, PreachingGenre, EmotionalArc } from '../../entities/preaching-strategy.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';

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

    const prompt = `You are a preaching strategist. Help select the optimal PREACHING GENRE and STRATEGY for this sermon.

PASSAGE: ${workspace.mainPassage}
TEXT: ${passageText}

THEME: ${workspace.theme || 'Not specified'}
AUDIENCE: ${workspace.audienceProfile || 'General congregation'}
GOALS: ${workspace.sermonGoals || 'Not specified'}

TASK: Recommend the best preaching approach.

GENRES (choose one):
- expository: Verse-by-verse explanation
- narrative: Story-driven, following biblical narrative
- prophetic: Calling to repentance/action, urgent tone
- apologetic: Defending faith, answering objections
- revivalist: Stirring hearts, emotional appeal
- teaching: Doctrinal instruction, concept-heavy
- pastoral: Comforting, healing, shepherding
- evangelistic: Gospel presentation, invitation-focused

EMOTIONAL ARCS (choose one):
- conviction_to_hope: Start with sin/need, end with grace
- crisis_to_resolution: Present problem, offer solution
- question_to_discovery: Raise questions, journey to answers
- comfort_to_challenge: Start gentle, build to action
- lament_to_praise: Acknowledge pain, move to worship

Also determine:
- Tone (e.g., "urgent", "contemplative", "celebratory", "pastoral")
- Target length in minutes
- Tension level (0-100, how much discomfort to create)
- Application density (0-100, how application-heavy)
- Invitation driven (true/false)

Return JSON:
{
  "recommendedGenre": "prophetic",
  "genreRationale": "Why this genre fits the passage and goals",
  "emotionalArc": "conviction_to_hope",
  "tone": "urgent yet hopeful",
  "targetLengthMinutes": 35,
  "tensionLevel": 75,
  "applicationDensity": 60,
  "invitationDriven": true,
  "structuralGuidance": {
    "introduction": "How to open",
    "bodyStructure": "How to organize the body",
    "conclusion": "How to close"
  }
}`;

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
