import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalContextEnhanced } from '../../entities/historical-context-enhanced.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';

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

    const prompt = `You are a biblical historian providing SPECIFIC, DEEP historical context - not generic summaries.

PASSAGE: ${workspace.mainPassage}

TASK: Provide historical anchoring with specificity and depth.

1. SOCIAL REALITIES - First-century social structures
   - Not generic: "Christians in Ephesus..."
   - Specific: Artemis worship dominance, imperial cult pressure, patronage system, household codes

2. POWER STRUCTURES - Who held power and how
   - Political dynamics
   - Religious authority
   - Economic control

3. ECONOMIC CONTEXT - Money, trade, class
   - Economic pressures on the audience
   - Financial realities
   - Class tensions

4. RELIGIOUS CLIMATE - Spiritual landscape
   - Competing religious movements
   - Synagogue dynamics
   - Pagan influences
   - Theological debates

5. AUDIENCE PRESSURES - What the original audience faced
   - External pressures (persecution, social ostracism)
   - Internal pressures (false teaching, division)
   - Pastoral response needed

Return JSON:
{
  "socialRealities": [
    {
      "aspect": "Specific social structure",
      "description": "Detailed description",
      "impact": "How this affected the audience"
    }
  ],
  "powerStructures": [
    {
      "structure": "Type of power",
      "dynamics": "How it operated",
      "relevance": "Why it matters for this passage"
    }
  ],
  "economicContext": [
    {
      "factor": "Economic element",
      "description": "Specific details"
    }
  ],
  "religiousClimate": [
    {
      "element": "Religious factor",
      "description": "Details",
      "tension": "Conflict or pressure created"
    }
  ],
  "audiencePressures": [
    {
      "pressure": "Specific pressure",
      "source": "Where it came from",
      "pastoralResponse": "How the text addresses it"
    }
  ],
  "synthesisStatement": "2-3 sentence summary tying it all together"
}

Be SPECIFIC. Avoid generic historical context. Add gravitas through detail.`;

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
