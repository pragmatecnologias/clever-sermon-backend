import { Injectable } from '@nestjs/common';
import { ScriptureService } from '../scripture/scripture.service';
import { VisualizationContractService } from './visualization-contract.service';

type NarrativeStage =
  | 'Creation'
  | 'Fall'
  | 'Patriarchs'
  | 'Israel'
  | 'Kingdom'
  | 'Exile'
  | 'Messiah'
  | 'Church'
  | 'New Creation';

const STAGE_ORDER: NarrativeStage[] = [
  'Creation',
  'Fall',
  'Patriarchs',
  'Israel',
  'Kingdom',
  'Exile',
  'Messiah',
  'Church',
  'New Creation',
];

const THEME_PRESETS: Record<string, string[]> = {
  grace: ['Genesis 6:8', 'Psalm 103:8', 'John 1:16', 'Romans 3:24', 'Ephesians 2:8-10'],
  covenant: ['Genesis 12:1-3', 'Exodus 24:8', 'Jeremiah 31:31', 'Luke 22:20', 'Hebrews 9:15'],
  kingdom: ['2 Samuel 7:12-16', 'Isaiah 9:6-7', 'Matthew 4:17', 'Luke 17:21', 'Revelation 11:15'],
  redemption: ['Exodus 12:13', 'Isaiah 53:5', 'Mark 10:45', 'Ephesians 1:7', 'Revelation 5:9'],
  new_creation: ['Genesis 1:1', 'Ezekiel 36:26', 'John 3:3', '2 Corinthians 5:17', 'Revelation 21:5'],
};

@Injectable()
export class BiblicalNarrativeMapService {
  constructor(
    private readonly scriptureService: ScriptureService,
    private readonly contractService: VisualizationContractService,
  ) {}

  async buildNarrativeMap(focusPassage: string, theme?: string) {
    const focusStage = this.resolveStage(focusPassage);
    const focusIndex = STAGE_ORDER.indexOf(focusStage);
    const nodes: any[] = [];
    const connections: any[] = [];
    const usedRefs = new Set<string>();

    const focusNodeId = `focus:${focusPassage}`;
    nodes.push({
      id: focusNodeId,
      kind: 'focus_passage',
      type: 'focus_passage',
      reference: focusPassage,
      label: focusPassage,
      stage: focusStage,
      stageIndex: focusIndex,
      lane: 1,
      x: focusIndex * 2,
      y: 0,
      themes: theme ? [theme] : [],
      warningLevel: null,
      sermonLinks: [],
    });
    usedRefs.add(this.normalizeRef(focusPassage));

    const scriptureRefs = await this.getScriptureConnections(focusPassage, theme);
    scriptureRefs.forEach((ref, index) => {
      const norm = this.normalizeRef(ref);
      if (usedRefs.has(norm)) return;
      usedRefs.add(norm);

      const stage = this.resolveStage(ref);
      const stageIndex = STAGE_ORDER.indexOf(stage);
      const lane = stageIndex < focusIndex ? 0 : stageIndex > focusIndex ? 2 : 1;
      const relationType =
        stageIndex < focusIndex
          ? 'narrative_continuation'
          : stageIndex > focusIndex
            ? 'prophetic_fulfillment'
            : 'thematic';
      const id = `ref:${index}:${ref}`;
      nodes.push({
        id,
        kind: 'cross_reference',
        type: 'cross_reference',
        reference: ref,
        label: ref,
        stage,
        stageIndex,
        lane,
        x: stageIndex * 2,
        y: lane === 0 ? -1.2 : lane === 2 ? 1.2 : 0,
        themes: theme ? [theme] : [],
        warningLevel: null,
      });

      connections.push({
        id: `${focusNodeId}->${id}`,
        source: focusNodeId,
        target: id,
        type: relationType,
        relationType,
        strengthScore: lane === 1 ? 0.9 : 0.68,
        explanation: this.buildExplanation(ref, stage, focusPassage, focusStage),
        evidence: {
          stage,
          focusStage,
          sourceType: 'bible',
        },
      });
    });

    return this.contractService.enrichGraph({
      nodes,
      connections,
      timeline: STAGE_ORDER.map((stage, index) => ({
        stage,
        index,
        isFocusStage: stage === focusStage,
      })),
      metadata: {
        focusPassage,
        focusStage,
        theme: theme || null,
        totalNodes: nodes.length,
        totalConnections: connections.length,
      },
    });
  }

  private async getScriptureConnections(focusPassage: string, theme?: string): Promise<string[]> {
    try {
      const refs = await this.scriptureService.getCrossReferences(focusPassage);
      const clean = Array.from(new Set((refs || []).filter(Boolean))).slice(0, 24);
      if (clean.length > 0) return clean;
    } catch (error) {
      console.error('[BiblicalNarrativeMap] Failed to fetch cross references:', error);
    }

    const key = String(theme || 'grace').toLowerCase().replace(/\s+/g, '_');
    return THEME_PRESETS[key] || THEME_PRESETS.grace;
  }

  private buildExplanation(reference: string, stage: NarrativeStage, focusPassage: string, focusStage: NarrativeStage): string {
    if (stage === focusStage) {
      return `${reference} reinforces the same narrative stage as ${focusPassage}.`;
    }
    if (STAGE_ORDER.indexOf(stage) < STAGE_ORDER.indexOf(focusStage)) {
      return `${reference} provides an earlier canonical foundation leading toward ${focusPassage}.`;
    }
    return `${reference} extends the trajectory of ${focusPassage} into later canonical development.`;
  }

  private resolveStage(reference: string): NarrativeStage {
    const book = this.extractBook(reference);
    if (!book) return 'Church';

    const name = book.toLowerCase();
    if (/(genesis|g[eé]nesis)/.test(name)) return 'Creation';
    if (/(job|salmos|psalm|proverbs|ecclesiastes)/.test(name)) return 'Fall';
    if (/(exodus|leviticus|numbers|deuteronomy|joshua)/.test(name)) return 'Israel';
    if (/(samuel|kings|chronicles|reyes|cr[oó]nicas)/.test(name)) return 'Kingdom';
    if (/(isaiah|jeremiah|ezekiel|daniel|oseas|joel|amos|micah|nahum|habakkuk|zephaniah|haggai|zechariah|malachi)/.test(name)) {
      return 'Exile';
    }
    if (/(matthew|mark|luke|john|mateo|marcos|lucas|juan)/.test(name)) return 'Messiah';
    if (/(acts|hechos|romans|corinthians|galatians|ephesians|philippians|colossians|thessalonians|timothy|titus|philemon|hebrews|james|peter|jude|apocalipsis|revelation)/.test(name)) {
      if (/(revelation|apocalipsis)/.test(name)) return 'New Creation';
      return 'Church';
    }
    if (/(abraham|isaac|jacob|patriarch)/.test(name)) return 'Patriarchs';
    return 'Church';
  }

  private extractBook(reference: string): string {
    const clean = String(reference || '').trim();
    if (!clean) return '';
    const match = clean.match(/^[1-3]?\s*[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*/);
    return match ? match[0].trim() : clean.split(/[.:]/)[0].trim();
  }

  private normalizeRef(reference: string): string {
    return String(reference || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[–—]/g, '-');
  }
}

