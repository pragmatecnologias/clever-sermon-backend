import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossReferenceNarrative } from '../../entities/cross-reference-narrative.entity';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';

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

    const prompt = `You are a biblical theologian creating NARRATIVE THREADS from cross-references.

SOURCE VERSE: ${verse}
TEXT: ${verseTextStr}

CROSS-REFERENCES:
${crossRefTexts.map(cr => `${cr.ref}: ${cr.text.substring(0, 200)}`).join('\n')}

TASK: Instead of presenting cross-references as a list, create THEMATIC CHAINS that tell a story.

Example:
"Grace transforms identity across covenant history"
Chain: Ephesians 2:1-10 → Romans 5 → Titus 3 → Ezekiel 36 → Jeremiah 31

For each narrative thread:
1. Create a compelling narrative title
2. Describe the story arc
3. Order the references chronologically or thematically
4. Show each reference's contribution to the narrative
5. Identify the redemptive movement

Return JSON array:
[
  {
    "narrativeTitle": "Title of the thematic chain",
    "narrativeDescription": "The story this chain tells",
    "chain": [
      {
        "reference": "Gen 3:15",
        "era": "Creation/Fall",
        "contribution": "What this reference adds to the narrative",
        "order": 1
      }
    ],
    "thematicThread": "One-sentence summary of the thread",
    "redemptiveMovement": "How this moves redemptive history forward"
  }
]

Create 2-3 narrative threads maximum. Make cross-references tell a story, not just be a database output.`;

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
