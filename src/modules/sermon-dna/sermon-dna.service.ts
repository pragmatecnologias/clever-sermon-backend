import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonDnaAnalysis } from '../../entities/sermon-dna-analysis.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class SermonDnaService {
  constructor(
    @InjectRepository(SermonDnaAnalysis)
    private dnaRepository: Repository<SermonDnaAnalysis>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
  ) {}

  async analyze(userId: string, workspaceId: string) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, userId },
      relations: ['outlines', 'manuscripts'],
    });

    if (!workspace) {
      return null;
    }

    // Delete existing analyses before generating new one
    await this.dnaRepository.delete({ userId, workspaceId });

    const outline = workspace.outlines?.[0];
    const manuscriptText = workspace.manuscripts?.[0]?.content?.text || '';
    const outlinePoints = Array.isArray(outline?.structure?.points) ? outline.structure.points : [];
    const wordCount = manuscriptText.split(/\s+/).filter(Boolean).length;

    let summary = 'Analysis pending.';
    let themes: string[] = [];
    let scores: Record<string, number> = {
      clarity: 6,
      structure: 7,
      scriptureFocus: 6,
      applicationDepth: 6,
    };

    try {
      const prompt = `Analyze this sermon for its DNA profile.
Passage: ${workspace.mainPassage}
Theme: ${workspace.theme}
Outline Points: ${outlinePoints.join(' | ')}
Manuscript (excerpt): ${manuscriptText.slice(0, 1200)}

Return JSON with:
summary (string), themes (array of strings), scores (object with clarity, structure, scriptureFocus, applicationDepth 1-10).`;

      const response = await this.llmService.generateCompletion(prompt, userId);
      const parsed = JSON.parse(response);
      summary = parsed.summary || summary;
      themes = parsed.themes || themes;
      scores = parsed.scores || scores;
    } catch {
      themes = outlinePoints.slice(0, 4);
      scores = {
        clarity: Math.min(9, Math.max(4, Math.round((outlinePoints.length + 2)))) ,
        structure: Math.min(9, Math.max(4, Math.round((outlinePoints.length + 3)))) ,
        scriptureFocus: wordCount > 900 ? 7 : 6,
        applicationDepth: outlinePoints.length > 2 ? 7 : 6,
      };
      summary = `Summary based on outline depth (${outlinePoints.length} points) and manuscript length (${wordCount} words).`;
    }

    const analysis = this.dnaRepository.create({
      userId,
      workspaceId,
      summary,
      themes,
      scores,
    });

    return this.dnaRepository.save(analysis);
  }

  list(userId: string, workspaceId: string) {
    return this.dnaRepository.find({
      where: { userId, workspaceId },
      order: { createdAt: 'DESC' },
    });
  }
}
