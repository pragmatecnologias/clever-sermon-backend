import { Injectable } from '@nestjs/common';
import { ScriptureService } from './scripture.service';
import { LlmService } from '../llm/llm.service';
import { EGWPassageIntegrationService } from '../egw/egw-passage-integration.service';
import { ScripturePrompts } from './scripture-prompts';

export type CrossReferenceCategory =
  | 'thematic'
  | 'quotation'
  | 'typology'
  | 'prophetic_fulfillment'
  | 'narrative_continuation'
  | 'interpretive_tension'
  | 'lexical';

export type CrossReferenceTier = 'primary' | 'secondary' | 'illustrative';

export interface RankedCrossReference {
  reference: string;
  category: CrossReferenceCategory;
  tier: CrossReferenceTier;
  relevanceScore: number;
  connectionExplanation: string;
  explanation: string; // Backward compatibility for existing clients
  themes: string[];
  sourceType: 'bible' | 'sop';
  lexicalSignal: number;
  relatedPassages: string[];
  text?: string;
}

@Injectable()
export class CrossReferenceRankingService {
  constructor(
    private scriptureService: ScriptureService,
    private llmService: LlmService,
    private egwPassageIntegrationService: EGWPassageIntegrationService,
  ) {}

  async getRankedCrossReferences(verse: string): Promise<RankedCrossReference[]> {
    const sourceData = await this.scriptureService.getPassage(verse);
    const sourceText = this.getPassageText(sourceData);

    let rawRefs = await this.scriptureService.getCrossReferences(verse);
    if (!rawRefs || rawRefs.length === 0) {
      rawRefs = await this.generateFallbackReferences(verse, sourceText);
    }
    if (!rawRefs || rawRefs.length === 0) return [];

    const details = await this.scriptureService.getCrossReferenceDetails(verse);
    const detailMap = new Map(
      (Array.isArray(details) ? details : []).map((item: any) => [String(item.reference), String(item.category || '')]),
    );

    const rankedRefs: RankedCrossReference[] = [];
    for (const refString of rawRefs.slice(0, 20)) {
      try {
        const reference = typeof refString === 'string' ? refString : (refString as any).reference;
        const refData = await this.scriptureService.getPassage(reference);
        const targetText = this.getPassageText(refData);
        if (!targetText || !sourceText) continue;

        const ranking = this.analyzeRelationship(
          sourceText,
          targetText,
          verse,
          reference,
          detailMap.get(reference) || '',
        );
        rankedRefs.push({
          reference,
          category: ranking.category,
          tier: ranking.tier,
          relevanceScore: ranking.score,
          connectionExplanation: ranking.explanation,
          explanation: ranking.explanation,
          themes: ranking.themes,
          sourceType: 'bible',
          lexicalSignal: ranking.lexicalSignal,
          relatedPassages: [verse],
          text: refData?.verses?.[0]?.text || '',
        });
      } catch {
        continue;
      }
    }

    const llmRefined = await this.refineWithLlm(verse, sourceText, rankedRefs);
    return llmRefined.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async getSOPLinkedCrossReferences(verse: string, language: string = 'en'): Promise<RankedCrossReference[]> {
    const parsed = this.parseReferenceForEGW(verse);
    if (!parsed) return [];

    const panel = await this.egwPassageIntegrationService.getPassageInsights(
      parsed.book,
      parsed.chapter,
      parsed.verseStart,
      parsed.verseEnd,
      language || 'en',
      8,
    );

    return (panel?.insights || []).map((insight) => {
      const category = this.mapEGWReasonToCategory(insight.rankingReason);
      const tier = this.mapEGWScoreToTier(insight.rankingScore || 0);
      const explanation = `EGW ${insight.reference} links ${insight.scriptureReference} to ${verse} (${insight.rankingReason.replace('_', ' ')}).`;
      return {
        reference: insight.reference,
        category,
        tier,
        relevanceScore: Math.max(0, Math.min(100, insight.rankingScore || 40)),
        connectionExplanation: explanation,
        explanation,
        themes: ['spirit_of_prophecy', insight.rankingReason || 'thematic'],
        sourceType: 'sop',
        lexicalSignal: 0,
        relatedPassages: [verse, insight.scriptureReference],
        text: insight.preview,
        bookTitle: insight.bookTitle,
        chapterTitle: insight.chapterTitle,
        scriptureReference: insight.scriptureReference,
        rankingReason: insight.rankingReason,
      } as RankedCrossReference & Record<string, any>;
    });
  }

  async mapCrossReferencesToOutlinePoints(
    verse: string,
    points: Array<{ id?: string; text: string; supportingVerses?: string[] }>,
  ): Promise<Array<{ pointId: string; pointText: string; suggestedReferences: RankedCrossReference[] }>> {
    const ranked = await this.getRankedCrossReferences(verse);
    return (Array.isArray(points) ? points : []).map((point, index) => {
      const pointText = String(point?.text || '').trim();
      const pointTokens = this.tokenize(pointText.toLowerCase());
      const supporting = Array.isArray(point?.supportingVerses) ? point.supportingVerses : [];
      const scored = ranked
        .map((item) => {
          const explanationTokens = this.tokenize(
            `${item.connectionExplanation || ''} ${item.text || ''}`.toLowerCase(),
          );
          const overlap = pointTokens.filter((token) => explanationTokens.includes(token)).length;
          const verseBoost = supporting.some((ref) => ref.toLowerCase() === item.reference.toLowerCase()) ? 0.2 : 0;
          return {
            ...item,
            relevanceScore: Math.min(1, item.relevanceScore / 100 + overlap * 0.03 + verseBoost) * 100,
          };
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 4);

      return {
        pointId: String(point?.id || `point-${index + 1}`),
        pointText,
        suggestedReferences: scored,
      };
    });
  }

  private analyzeRelationship(
    sourceText: string,
    targetText: string,
    sourceRef: string,
    targetRef: string,
    categoryHint: string,
  ): { category: CrossReferenceCategory; tier: CrossReferenceTier; score: number; explanation: string; themes: string[]; lexicalSignal: number } {
    const sourceLower = sourceText.toLowerCase();
    const targetLower = targetText.toLowerCase();
    const mappedHint = this.normalizeCategoryHint(categoryHint);
    const lexicalSignal = this.calculateLexicalSignal(sourceText, targetText);
    const themes = this.extractThemes(sourceLower, targetLower);
    const tension = this.hasInterpretiveTension(sourceLower, targetLower);

    const overlap = this.calculateTextOverlap(sourceLower, targetLower);
    if (overlap > 0.7) {
      return {
        category: 'quotation',
        tier: 'primary',
        score: 95,
        explanation: 'Direct quotation or near-identical wording with strong textual overlap.',
        themes,
        lexicalSignal,
      };
    }

    if (this.hasFulfillmentLanguage(targetText, sourceRef)) {
      return {
        category: 'prophetic_fulfillment',
        tier: 'primary',
        score: 90,
        explanation: 'This passage functions as an explicit prophetic fulfillment or promise realization.',
        themes,
        lexicalSignal,
      };
    }

    if (lexicalSignal >= 0.65) {
      return {
        category: 'lexical',
        tier: 'primary',
        score: 86,
        explanation: 'Strong lexical continuity signal between the passages.',
        themes,
        lexicalSignal,
      };
    }

    const thematicScore = this.calculateThematicSimilarity(sourceLower, targetLower);
    if (thematicScore > 0.6) {
      return {
        category: mappedHint === 'narrative_continuation' ? 'narrative_continuation' : 'thematic',
        tier: 'primary',
        score: 75,
        explanation: tension
          ? 'Strong thematic overlap with interpretive tension that sharpens doctrinal balance.'
          : 'Strong thematic connection around shared theological claims.',
        themes,
        lexicalSignal,
      };
    }

    if (this.isTypological(sourceRef, targetRef)) {
      return {
        category: 'typology',
        tier: 'secondary',
        score: 70,
        explanation: 'Typological pattern (shadow-to-reality movement across covenants).',
        themes,
        lexicalSignal,
      };
    }

    if (mappedHint) {
      return {
        category: mappedHint,
        tier: 'secondary',
        score: 62,
        explanation: 'Dataset-classified relationship with meaningful contextual support.',
        themes,
        lexicalSignal,
      };
    }

    return {
      category: tension ? 'interpretive_tension' : 'thematic',
      tier: 'illustrative',
      score: 50,
      explanation: tension
        ? 'Useful cross reference that introduces interpretive tension for preaching clarity.'
        : 'General thematic connection that can serve as supporting illustration.',
      themes,
      lexicalSignal,
    };
  }

  private calculateTextOverlap(text1: string, text2: string): number {
    const words1 = new Set(this.tokenize(text1));
    const words2 = new Set(this.tokenize(text2));

    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  private calculateThematicSimilarity(text1: string, text2: string): number {
    const theologicalTerms = [
      'faith', 'grace', 'salvation', 'righteousness', 'covenant', 'kingdom',
      'love', 'mercy', 'justice', 'holy', 'spirit', 'lord', 'god', 'christ',
      'sin', 'redemption', 'forgiveness', 'eternal', 'life', 'death', 'resurrection'
    ];

    const terms1 = theologicalTerms.filter(t => text1.includes(t));
    const terms2 = theologicalTerms.filter(t => text2.includes(t));

    if (terms1.length === 0 && terms2.length === 0) return 0;

    const commonTerms = terms1.filter(t => terms2.includes(t));
    return commonTerms.length / Math.max(terms1.length, terms2.length);
  }

  private extractThemes(sourceText: string, targetText: string): string[] {
    const themeLexicon: Record<string, string[]> = {
      grace: ['grace', 'mercy', 'gift', 'favor'],
      faith: ['faith', 'believe', 'trust'],
      salvation: ['salvation', 'save', 'redeem', 'justif'],
      covenant: ['covenant', 'promise', 'testament'],
      spirit: ['spirit', 'holy spirit'],
      resurrection: ['resurrection', 'raised', 'rise'],
      new_creation: ['new', 'renew', 'transform'],
      kingdom: ['kingdom', 'reign', 'throne'],
    };
    const combined = `${sourceText} ${targetText}`;
    return Object.entries(themeLexicon)
      .filter(([, terms]) => terms.some((term) => combined.includes(term)))
      .map(([theme]) => theme);
  }

  private hasFulfillmentLanguage(text: string, sourceRef: string): boolean {
    const fulfillmentPhrases = [
      'fulfill', 'fulfilled', 'spoken by', 'written', 'prophet',
      'that it might be fulfilled', 'as it is written', 'according to'
    ];

    const lowerText = text.toLowerCase();
    return fulfillmentPhrases.some(phrase => lowerText.includes(phrase));
  }

  private hasInterpretiveTension(sourceText: string, targetText: string): boolean {
    const tensionPairs: Array<[string, string]> = [
      ['faith', 'works'],
      ['law', 'grace'],
      ['judgment', 'mercy'],
    ];
    return tensionPairs.some(
      ([a, b]) =>
        (sourceText.includes(a) && targetText.includes(b)) ||
        (sourceText.includes(b) && targetText.includes(a)),
    );
  }

  private normalizeCategoryHint(raw: string): CrossReferenceCategory | null {
    const normalized = String(raw || '').toLowerCase().trim();
    if (!normalized) return null;
    const map: Record<string, CrossReferenceCategory> = {
      direct_quote: 'quotation',
      direct_quotation: 'quotation',
      thematic_parallel: 'thematic',
      thematic_echo: 'thematic',
      general_thematic: 'thematic',
      parallel_narrative: 'narrative_continuation',
      narrative_continuation: 'narrative_continuation',
      explicit_fulfillment: 'prophetic_fulfillment',
      prophetic_fulfillment: 'prophetic_fulfillment',
      typological: 'typology',
      typological_pattern: 'typology',
      interpretive_tension: 'interpretive_tension',
      lexical: 'lexical',
    };
    return map[normalized] || null;
  }

  private calculateLexicalSignal(sourceText: string, targetText: string): number {
    const sGreek = (sourceText.match(/[\u0370-\u03FF\u1F00-\u1FFF]+/g) || []).join(' ');
    const tGreek = (targetText.match(/[\u0370-\u03FF\u1F00-\u1FFF]+/g) || []).join(' ');
    const sHeb = (sourceText.match(/[\u0590-\u05FF]+/g) || []).join(' ');
    const tHeb = (targetText.match(/[\u0590-\u05FF]+/g) || []).join(' ');
    if (!sGreek && !tGreek && !sHeb && !tHeb) return 0;
    const sharedScriptTokens = this.calculateTextOverlap(`${sGreek} ${sHeb}`.toLowerCase(), `${tGreek} ${tHeb}`.toLowerCase());
    return Math.max(0, Math.min(1, sharedScriptTokens));
  }

  private isTypological(sourceRef: string, targetRef: string): boolean {
    // Simple heuristic: OT reference -> NT reference
    const otBooks = [
      'gen', 'exod', 'lev', 'num', 'deut', 'josh', 'judg', 'ruth',
      '1sam', '2sam', '1kgs', '2kgs', '1chr', '2chr', 'ezra', 'neh',
      'esth', 'job', 'ps', 'prov', 'eccl', 'song', 'isa', 'jer',
      'lam', 'ezek', 'dan', 'hos', 'joel', 'amos', 'obad', 'jonah',
      'mic', 'nah', 'hab', 'zeph', 'hag', 'zech', 'mal'
    ];

    const ntBooks = [
      'matt', 'mark', 'luke', 'john', 'acts', 'rom', '1cor', '2cor',
      'gal', 'eph', 'phil', 'col', '1thess', '2thess', '1tim', '2tim',
      'titus', 'phlm', 'heb', 'jas', '1pet', '2pet', '1john', '2john',
      '3john', 'jude', 'rev'
    ];

    const sourceBook = sourceRef.toLowerCase().split(/\s+/)[0];
    const targetBook = targetRef.toLowerCase().split(/\s+/)[0];

    const sourceIsOT = otBooks.some(b => sourceBook.includes(b));
    const targetIsNT = ntBooks.some(b => targetBook.includes(b));

    return sourceIsOT && targetIsNT;
  }

  private tokenize(text: string): string[] {
    return text
      .replace(/[.,;:!?()[\]{}'"]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  private getPassageText(passage: any): string {
    if (!Array.isArray(passage?.verses)) return '';
    return passage.verses.map((v: any) => String(v?.text || '')).join(' ').trim();
  }

  private async generateFallbackReferences(verse: string, sourceText: string): Promise<string[]> {
    const terms = this.extractFallbackTerms(sourceText).slice(0, 3);
    const found: string[] = [];
    for (const term of terms) {
      try {
        const results = await this.scriptureService.searchScripture(term, 'KJV');
        if (!Array.isArray(results)) continue;
        for (const item of results) {
          const reference = String(item?.reference || '').trim();
          if (!reference) continue;
          if (reference.toLowerCase() === verse.toLowerCase()) continue;
          found.push(reference);
          if (found.length >= 18) break;
        }
      } catch {
        continue;
      }
      if (found.length >= 18) break;
    }
    return Array.from(new Set(found)).slice(0, 18);
  }

  private extractFallbackTerms(sourceText: string): string[] {
    const text = String(sourceText || '').toLowerCase();
    const dictionary: Array<{ term: string; weight: number }> = [
      { term: 'grace', weight: text.includes('grace') ? 3 : 0 },
      { term: 'faith', weight: text.includes('faith') ? 3 : 0 },
      { term: 'salvation', weight: text.includes('salvation') ? 3 : 0 },
      { term: 'justification', weight: text.includes('justify') ? 3 : 0 },
      { term: 'mercy', weight: text.includes('mercy') ? 2 : 0 },
      { term: 'redemption', weight: text.includes('redeem') ? 2 : 0 },
      { term: 'covenant', weight: text.includes('covenant') ? 2 : 0 },
      { term: 'new life', weight: text.includes('new') && text.includes('life') ? 2 : 0 },
      { term: 'works', weight: text.includes('works') ? 2 : 0 },
      { term: 'christ', weight: text.includes('christ') ? 2 : 0 },
    ];
    const sorted = dictionary.sort((a, b) => b.weight - a.weight).filter((item) => item.weight > 0);
    if (!sorted.length) return ['grace', 'faith', 'salvation'];
    return sorted.map((item) => item.term);
  }

  private async refineWithLlm(
    sourceVerse: string,
    sourceText: string,
    refs: RankedCrossReference[],
  ): Promise<RankedCrossReference[]> {
    if (!refs.length) return refs;
    const candidates = refs.slice(0, 10).map((item) => ({
      reference: item.reference,
      category: item.category,
      tier: item.tier,
      relevanceScore: Math.round(item.relevanceScore),
      connectionExplanation: item.connectionExplanation,
      themes: item.themes,
    }));

    const prompt = ScripturePrompts.crossReferenceRefine({
      sourceVerse,
      sourceText: sourceText.slice(0, 800),
      candidatesJson: JSON.stringify(candidates, null, 2),
    });

    try {
      const response = await this.llmService.generateCompletion(prompt, 'system', {
        temperature: 0.2,
        maxTokens: 1400,
      });
      const parsed = this.parseJsonArray(response);
      if (!Array.isArray(parsed) || parsed.length !== candidates.length) {
        return refs;
      }
      const byRef = new Map(parsed.map((item: any) => [String(item.reference), item]));
      return refs.map((item) => {
        const refined = byRef.get(item.reference);
        if (!refined) return item;
        const category = this.normalizeCategoryHint(refined.category) || item.category;
        const tier: CrossReferenceTier =
          refined.tier === 'primary' || refined.tier === 'secondary' || refined.tier === 'illustrative'
            ? refined.tier
            : item.tier;
        const score = Number(refined.relevanceScore);
        return {
          ...item,
          category,
          tier,
          relevanceScore: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : item.relevanceScore,
          connectionExplanation: String(refined.connectionExplanation || item.connectionExplanation),
          explanation: String(refined.connectionExplanation || item.connectionExplanation),
          themes: Array.isArray(refined.themes) ? refined.themes.map((t: any) => String(t)) : item.themes,
        };
      });
    } catch {
      return refs;
    }
  }

  private parseJsonArray(raw: string): any[] | null {
    const payload = String(raw || '');
    const fenced = payload.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const content = fenced?.[1] || payload;
    const start = content.indexOf('[');
    const end = content.lastIndexOf(']');
    const json = start !== -1 && end !== -1 ? content.slice(start, end + 1) : content;
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  private parseReferenceForEGW(reference: string): { book: string; chapter: number; verseStart?: number; verseEnd?: number } | null {
    const value = String(reference || '').trim().replace(/\u2013|\u2014/g, '-');
    if (!value) return null;

    const dotted = value.match(/^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)(?:-([1-3]?[A-Za-z]+)\.(\d+)\.(\d+))?$/);
    if (dotted) {
      const map: Record<string, string> = {
        Gen: 'Genesis', Exod: 'Exodus', Lev: 'Leviticus', Num: 'Numbers', Deut: 'Deuteronomy',
        Josh: 'Joshua', Judg: 'Judges', Ruth: 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
        '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
        Ezra: 'Ezra', Neh: 'Nehemiah', Esth: 'Esther', Job: 'Job', Ps: 'Psalms', Prov: 'Proverbs',
        Eccl: 'Ecclesiastes', Song: 'Song of Solomon', Isa: 'Isaiah', Jer: 'Jeremiah', Lam: 'Lamentations',
        Ezek: 'Ezekiel', Dan: 'Daniel', Hos: 'Hosea', Joel: 'Joel', Amos: 'Amos', Obad: 'Obadiah',
        Jonah: 'Jonah', Mic: 'Micah', Nah: 'Nahum', Hab: 'Habakkuk', Zeph: 'Zephaniah', Hag: 'Haggai',
        Zech: 'Zechariah', Mal: 'Malachi', Matt: 'Matthew', Mark: 'Mark', Luke: 'Luke', John: 'John',
        Acts: 'Acts', Rom: 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians', Gal: 'Galatians',
        Eph: 'Ephesians', Phil: 'Philippians', Col: 'Colossians', '1Thess': '1 Thessalonians',
        '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy', Titus: 'Titus',
        Phlm: 'Philemon', Heb: 'Hebrews', Jas: 'James', '1Pet': '1 Peter', '2Pet': '2 Peter',
        '1John': '1 John', '2John': '2 John', '3John': '3 John', Jude: 'Jude', Rev: 'Revelation',
      };
      const book = map[dotted[1]] || dotted[1];
      const chapter = Number(dotted[2]);
      const verseStart = Number(dotted[3]);
      const verseEnd = dotted[6] ? Number(dotted[6]) : undefined;
      if (!Number.isFinite(chapter) || !Number.isFinite(verseStart)) return null;
      return { book, chapter, verseStart, verseEnd };
    }

    const standard = value.match(/^(.*?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!standard) return null;
    return {
      book: standard[1].trim(),
      chapter: Number(standard[2]),
      verseStart: standard[3] ? Number(standard[3]) : undefined,
      verseEnd: standard[4] ? Number(standard[4]) : undefined,
    };
  }

  private mapEGWReasonToCategory(reason?: string): CrossReferenceCategory {
    switch (String(reason || '').toLowerCase()) {
      case 'exact_verse':
        return 'quotation';
      case 'same_chapter':
        return 'narrative_continuation';
      case 'doctrinal':
        return 'interpretive_tension';
      default:
        return 'thematic';
    }
  }

  private mapEGWScoreToTier(score: number): CrossReferenceTier {
    if (score >= 85) return 'primary';
    if (score >= 60) return 'secondary';
    return 'illustrative';
  }

  async getTopCrossReferences(verse: string, limit: number = 3): Promise<RankedCrossReference[]> {
    const ranked = await this.getRankedCrossReferences(verse);
    return ranked.slice(0, limit);
  }

  async getCrossReferenceEdges(verse: string) {
    const ranked = await this.getRankedCrossReferences(verse);
    return ranked.map((item) => ({
      source: verse,
      target: item.reference,
      category: item.category,
      tier: item.tier,
      score: item.relevanceScore,
      sourceType: item.sourceType,
    }));
  }

  async getCrossReferencesByCategory(
    verse: string,
    category: CrossReferenceCategory
  ): Promise<RankedCrossReference[]> {
    const ranked = await this.getRankedCrossReferences(verse);
    return ranked.filter(ref => ref.category === category);
  }
}
