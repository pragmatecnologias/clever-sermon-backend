import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossReferenceNarrative } from '../../entities/cross-reference-narrative.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { AnalysisPrompts } from './analysis-prompts';

@Injectable()
export class CrossReferenceNarrativeService {
  constructor(
    @InjectRepository(CrossReferenceNarrative)
    private narrativeRepository: Repository<CrossReferenceNarrative>,
    private llmService: LlmService,
    private scriptureService: ScriptureService,
  ) {}

  async buildNarrative(verse: string, userId: string): Promise<CrossReferenceNarrative[]> {
    await this.narrativeRepository.delete({ sourceVerse: verse });

    const crossRefs = await this.scriptureService.getCrossReferences(verse);

    if (!crossRefs || crossRefs.length === 0) {
      return [];
    }

    const verseText = await this.scriptureService.getPassage(verse);
    const verseTextStr = Array.isArray(verseText?.verses)
      ? verseText.verses.map((v: any) => v.text).join(' ')
      : '';

    const crossRefTexts = await Promise.all(
      crossRefs.slice(0, 10).map(async (ref) => {
        const passage = await this.scriptureService.getPassage(ref);
        const text = Array.isArray(passage?.verses)
          ? passage.verses.map((v: any) => v.text).join(' ')
          : '';
        return { ref, text };
      })
    );

    const prompt = AnalysisPrompts.crossReferenceNarrative({
      sourceVerse: verse,
      sourceText: verseTextStr,
      crossReferencesText: crossRefTexts.map(cr => `${cr.ref}: ${cr.text.substring(0, 200)}`).join('\n'),
    });

    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.5,
        maxTokens: 2500,
      });

      const parsed = JSON.parse(response);
      const narratives: CrossReferenceNarrative[] = [];

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          const narrative = this.narrativeRepository.create({
            sourceVerse: verse,
            narrativeTitle: item.narrativeTitle || 'Untitled Thread',
            narrativeDescription: item.narrativeDescription || '',
            chain: item.chain || [],
            thematicThread: item.thematicThread || '',
            redemptiveMovement: item.redemptiveMovement || null,
          });

          narratives.push(await this.narrativeRepository.save(narrative));
        }
      }

      return narratives;
    } catch (error) {
      return [];
    }
  }

  async get(verse: string): Promise<CrossReferenceNarrative[]> {
    return this.narrativeRepository.find({
      where: { sourceVerse: verse },
      order: { createdAt: 'DESC' },
    });
  }
}
