import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TheologicalCenterAnalysis } from '../../entities/theological-center-analysis.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { WorkspaceHelpers } from '../workspaces/helpers';

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

    const prompt = `You are a seasoned preaching mentor analyzing sermon alignment with the theological center of the passage.

PASSAGE: ${workspace.mainPassage}
TEXT: ${passageText}

SERMON THEME: ${workspace.theme || 'Not specified'}
OUTLINE POINTS: ${outlinePoints.join('\n')}

TASK:
1. Identify the DOMINANT THEOLOGICAL CENTER of this passage - the central claim, the main point God is making.
2. Provide clear TEXTUAL WARRANT - which verses/phrases establish this center.
3. Analyze if the sermon is ORBITING this center or deviating from it.
4. Identify DEVIATIONS - points that drift from the center (rate severity: minor/moderate/major).
5. Identify SECONDARY THEMES that should be suppressed or removed.
6. Give an ALIGNMENT SCORE (0-100).

Return JSON:
{
  "dominantCenter": "Clear statement of the passage's theological center",
  "textualWarrant": "Specific verses and phrases that establish this",
  "alignmentScore": 85,
  "deviations": [
    {
      "point": "Outline point that deviates",
      "severity": "moderate",
      "explanation": "Why this deviates from the center"
    }
  ],
  "secondaryThemes": ["Theme 1", "Theme 2"],
  "suppressionSuggestions": [
    {
      "theme": "Secondary theme to remove",
      "reason": "Why it weakens the sermon",
      "impact": "What removing it accomplishes"
    }
  ]
}

Be DECISIVE. Say "This is weak" or "This is the strongest thread" or "This is distracting."`;

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
