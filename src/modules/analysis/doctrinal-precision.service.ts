import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctrinalPrecisionCheck, DoctrinalCategory } from '../../entities/doctrinal-precision-check.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';

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
    const outlinePoints = Array.isArray(outline?.structure?.points) 
      ? outline.structure.points 
      : [];

    const prompt = `You are a Seventh-day Adventist theological guard, ensuring doctrinal precision and consistency.

PASSAGE: ${workspace.mainPassage}
TEXT: ${passageText}

SERMON THEME: ${workspace.theme || 'Not specified'}
OUTLINE: ${outlinePoints.map((p: any) => typeof p === 'string' ? p : p.title || p.text).join('\n')}
MANUSCRIPT EXCERPT: ${manuscriptText.substring(0, 1200)}

TASK: Check doctrinal consistency in these categories:

1. GRACE - Is it framed as forensic only, or does it include transformative power?
2. SANCTIFICATION - Is it reduced to moral effort, or properly understood as Spirit-empowered growth?
3. SABBATH - Is it framed as covenant sign or mere obligation?
4. STATE OF THE DEAD - Is it consistent with soul sleep and resurrection?
5. SANCTUARY - If mentioned, is the heavenly sanctuary doctrine clear?
6. SECOND COMING - Is it presented with biblical urgency and hope?
7. COVENANT - Is the relationship between old and new covenant clear?
8. LAW AND GOSPEL - Is the proper relationship maintained?

For each relevant category:
- isConsistent: true/false
- concern: What's the issue (if any)
- recommendation: How to fix it
- severity: "info" / "warning" / "critical"

Return JSON:
{
  "checks": [
    {
      "category": "grace",
      "isConsistent": true,
      "concern": null,
      "recommendation": null,
      "severity": "info"
    }
  ],
  "overallConsistencyScore": 90,
  "summary": "Brief assessment of doctrinal alignment"
}

This is not about being theologically correct in general - it's about consistency with SDA doctrinal system.`;

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
