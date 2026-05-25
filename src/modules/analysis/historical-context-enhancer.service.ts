import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalContextEnhanced } from '../../entities/historical-context-enhanced.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { AnalysisPrompts } from './analysis-prompts';
import {
  composeHistoricalContextOutput,
  detectHistoricalGenre,
  HistoricalContextOutput,
  normalizeHistoricalContextOutput,
  resolveHistoricalContextRange,
  validateHistoricalContextOutput,
} from './historical-context-guidance';

@Injectable()
export class HistoricalContextEnhancerService {
  constructor(
    @InjectRepository(HistoricalContextEnhanced)
    private contextRepository: Repository<HistoricalContextEnhanced>,
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    private llmService: LlmService,
    private scriptureService: ScriptureService,
  ) {}

  async analyze(workspaceId: string, userId: string): Promise<HistoricalContextEnhanced> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    await this.contextRepository.delete({ workspaceId });

    const genre = detectHistoricalGenre(workspace.mainPassage);
    const contextRange = resolveHistoricalContextRange(workspace.mainPassage, genre);
    const [passage, expandedPassage, dossier] = await Promise.all([
      this.scriptureService.getPassage(workspace.mainPassage, 'KJV'),
      this.scriptureService.getPassageWithContext(workspace.mainPassage, 'KJV', contextRange),
      this.scriptureService.getHistoricalContextDossier(workspace.mainPassage),
    ]);

    const passageText = Array.isArray(passage?.verses)
      ? passage.verses.map((verse: any) => `${verse.reference} ${verse.text}`).join('\n')
      : '';
    const expandedPassageText = Array.isArray(expandedPassage?.verses)
      ? expandedPassage.verses.map((verse: any) => `${verse.reference} ${verse.text}`).join('\n')
      : passageText;

    const deterministic = normalizeHistoricalContextOutput(
      composeHistoricalContextOutput({
        reference: workspace.mainPassage,
        passageText,
        expandedPassageText,
        genre,
        bookMetadata: dossier.bookMetadata || {},
        historicalContext: dossier.historicalContext || {},
        culturalContext: dossier.culturalContext || {},
        geographyContext: dossier.geographyContext || {},
      })
    );

    const sourceMetadataText = JSON.stringify({
      bookMetadata: dossier.bookMetadata || {},
      historicalContext: dossier.historicalContext || {},
      culturalContext: dossier.culturalContext || {},
      geographyContext: dossier.geographyContext || {},
    });
    const deterministicValidation = validateHistoricalContextOutput(deterministic, {
      sourceMetadataText,
    });
    if (!deterministicValidation.valid) {
      console.warn('[historical-context] deterministic context failed validation', {
        reference: workspace.mainPassage,
        genre,
        errors: deterministicValidation.errors,
      });
    }

    const prompt = AnalysisPrompts.historicalContextEnhancer({
      mainPassage: workspace.mainPassage,
      genre,
      passageText,
      expandedPassageText,
      bookMetadataJson: JSON.stringify(dossier.bookMetadata || {}),
      historicalContextJson: JSON.stringify(dossier.historicalContext || {}),
      culturalContextJson: JSON.stringify(dossier.culturalContext || {}),
      geographyContextJson: JSON.stringify(dossier.geographyContext || {}),
      genreFocus: this.buildGenreFocus(workspace.mainPassage, genre),
      geographyNote: this.buildGeographyNote(workspace.mainPassage, dossier.geographyContext),
      literaryGuardrails: this.buildLiteraryGuardrails(workspace.mainPassage, genre),
    });

    const normalized = deterministic;

    const context = this.contextRepository.create({
      workspaceId,
      passage: workspace.mainPassage,
      ...normalized,
    });

    return this.contextRepository.save(context);
  }

  async get(workspaceId: string): Promise<HistoricalContextEnhanced | null> {
    const [latest] = await this.contextRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
      take: 1,
    });
    return latest || null;
  }

  private buildGenreFocus(reference: string, genre: ReturnType<typeof detectHistoricalGenre>): string {
    const normalized = reference.toLowerCase();
    if (genre === 'wisdom_poetry' && /psalm\s+37|ps\s+37/.test(normalized)) {
      return 'Wisdom psalm about envying the wicked, trusting the Lord, walking a straight path, and resting in God’s sustaining faithfulness.'
    }
    if (genre === 'gospel_dialogue' && /john\s+3/.test(normalized)) {
      return 'Night conversation with Nicodemus, new birth, belief, and eternal life.'
    }
    if (genre === 'parable' && /luke\s+15/.test(normalized)) {
      return 'Jesus answers grumbling with parables of loss, repentance, homecoming, and welcome.'
    }
    if (genre === 'prophetic_apocalyptic' && /revelation\s+14|rev\s+14/.test(normalized)) {
      return 'Everlasting gospel, worship of the Creator, and faithful endurance under pressure.'
    }
    if (genre === 'covenant_law' && /exodus\s+20|exod\s+20/.test(normalized)) {
      return 'Sabbath as covenant rest rooted in creation and liberation from slavery.'
    }
    return 'Keep the sermon inside the chapter, the book’s genre, and the passage’s pastoral burden.'
  }

  private buildGeographyNote(reference: string, geographyContext: Record<string, any> | null | undefined): string {
    const hasGeography = geographyContext && Object.keys(geographyContext).length > 0;
    if (!hasGeography) {
      return 'Geography is limited or not central here, so the preacher should lean on canonical, literary, and cultural context instead of inventing a location story.';
    }
    return `Geography exists for ${reference}, but it should support the sermon rather than dominate it.`;
  }

  private buildLiteraryGuardrails(reference: string, genre: ReturnType<typeof detectHistoricalGenre>): string[] {
    const guardrails = [
      'Do not expose internal labels or placeholder language.',
      'Use complete, pastor-facing sentences.',
      'Tie each observation back to the chapter and sermon use.',
    ];

    if (genre === 'wisdom_poetry') {
      guardrails.push('Use poetic / wisdom / worship language, not narrative-only framing.');
    }
    if (genre === 'prophetic_apocalyptic') {
      guardrails.push('Keep the tone hopeful, Christ-centered, and non-sensational.');
    }
    if (genre === 'parable') {
      guardrails.push('Lean on honor-shame, household, and welcome language when helpful.');
    }
    if (genre === 'covenant_law') {
      guardrails.push('Frame the command in covenant, creation, and liberation language.');
    }
    if (/psalm\s+37|ps\s+37/.test(reference.toLowerCase())) {
      guardrails.push('Emphasize trust, waiting, the path of the righteous, and God’s sustaining faithfulness.');
    }

    return guardrails;
  }

  private normalizeHistoricalContext(
    parsed: Partial<HistoricalContextOutput>,
  ): HistoricalContextOutput {
    const candidate: HistoricalContextOutput = {
      socialRealities: Array.isArray(parsed?.socialRealities) ? parsed.socialRealities : [],
      powerStructures: Array.isArray(parsed?.powerStructures) ? parsed.powerStructures : [],
      economicContext: Array.isArray(parsed?.economicContext) ? parsed.economicContext : [],
      religiousClimate: Array.isArray(parsed?.religiousClimate) ? parsed.religiousClimate : [],
      audiencePressures: Array.isArray(parsed?.audiencePressures) ? parsed.audiencePressures : [],
      synthesisStatement: typeof parsed?.synthesisStatement === 'string' ? parsed.synthesisStatement : '',
    };
    return candidate;
  }

  private async generateValidatedHistoricalContext(
    prompt: string,
    userId: string,
    reference: string,
    genre: ReturnType<typeof detectHistoricalGenre>,
    passageText: string,
    dossier: { bookMetadata?: Record<string, any> | null; historicalContext?: Record<string, any> | null; culturalContext?: Record<string, any> | null; geographyContext?: Record<string, any> | null; },
  ): Promise<HistoricalContextOutput> {
    throw new BadRequestException('Historical context could not be generated. Please retry.');
  }
}
