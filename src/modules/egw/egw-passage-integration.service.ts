import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EGWParagraph } from '../../entities/egw-paragraph.entity';
import { EGWScriptureReference } from '../../entities/egw-scripture-reference.entity';

export interface PassageEGWInsight {
  paragraphId: string;
  bookCode: string;
  bookTitle: string;
  chapterTitle: string;
  reference: string; // EGW reference (e.g., "DA 123.2")
  content: string; // Full paragraph text (verbatim)
  preview: string; // 2-4 line preview
  scriptureReference: string; // Bible reference
  rankingScore: number;
  rankingReason: 'exact_verse' | 'same_chapter' | 'thematic' | 'doctrinal';
}

export interface EGWPanelData {
  passage: string;
  insights: PassageEGWInsight[];
  totalAvailable: number;
  hasMore: boolean;
}

@Injectable()
export class EGWPassageIntegrationService {
  private spanishBookKeyMap = new Map<string, string>([
    ['genesis', 'genesis'], ['exodo', 'exodus'], ['levitico', 'leviticus'], ['numeros', 'numbers'], ['deuteronomio', 'deuteronomy'],
    ['josue', 'joshua'], ['jueces', 'judges'], ['rut', 'ruth'], ['1samuel', '1samuel'], ['2samuel', '2samuel'],
    ['1reyes', '1kings'], ['2reyes', '2kings'], ['1cronicas', '1chronicles'], ['2cronicas', '2chronicles'], ['esdras', 'ezra'],
    ['nehemias', 'nehemiah'], ['ester', 'esther'], ['job', 'job'], ['salmos', 'psalms'], ['proverbios', 'proverbs'],
    ['eclesiastes', 'ecclesiastes'], ['cantares', 'songofsolomon'], ['isaias', 'isaiah'], ['jeremias', 'jeremiah'], ['lamentaciones', 'lamentations'],
    ['ezequiel', 'ezekiel'], ['daniel', 'daniel'], ['oseas', 'hosea'], ['joel', 'joel'], ['amos', 'amos'],
    ['abdias', 'obadiah'], ['jonas', 'jonah'], ['miqueas', 'micah'], ['nahum', 'nahum'], ['habacuc', 'habakkuk'],
    ['sofonias', 'zephaniah'], ['hageo', 'haggai'], ['zacarias', 'zechariah'], ['malaquias', 'malachi'], ['mateo', 'matthew'],
    ['marcos', 'mark'], ['lucas', 'luke'], ['juan', 'john'], ['hechos', 'acts'], ['romanos', 'romans'],
    ['1corintios', '1corinthians'], ['2corintios', '2corinthians'], ['galatas', 'galatians'], ['efesios', 'ephesians'], ['filipenses', 'philippians'],
    ['colosenses', 'colossians'], ['1tesalonicenses', '1thessalonians'], ['2tesalonicenses', '2thessalonians'], ['1timoteo', '1timothy'], ['2timoteo', '2timothy'],
    ['tito', 'titus'], ['filemon', 'philemon'], ['hebreos', 'hebrews'], ['santiago', 'james'], ['1pedro', '1peter'],
    ['2pedro', '2peter'], ['1juan', '1john'], ['2juan', '2john'], ['3juan', '3john'], ['judas', 'jude'], ['apocalipsis', 'revelation'],
  ]);

  constructor(
    @InjectRepository(EGWParagraph)
    private paragraphRepository: Repository<EGWParagraph>,
    @InjectRepository(EGWScriptureReference)
    private scriptureRefRepository: Repository<EGWScriptureReference>
  ) {}

  /**
   * Get EGW insights for a Bible passage with intelligent ranking
   * This is the PRIMARY integration point for passage-level study
   */
  async getPassageInsights(
    book: string,
    chapter: number,
    verseStart?: number,
    verseEnd?: number,
    language: string = 'en',
    limit: number = 5
  ): Promise<EGWPanelData> {
    try {
      const passage = this.formatPassageReference(book, chapter, verseStart, verseEnd);
      const collectRankedInsights = async (lang: string): Promise<PassageEGWInsight[]> => {
        const exactMatches = await this.findExactVerseCitations(book, chapter, verseStart, verseEnd, lang);
        const chapterMatches = await this.findChapterCitations(book, chapter, lang);
        const thematicMatches = await this.findThematicMatches(book, chapter, lang);

        const allInsights = [
          ...this.rankInsights(exactMatches, 'exact_verse', 100),
          ...this.rankInsights(chapterMatches, 'same_chapter', 75),
          ...this.rankInsights(thematicMatches, 'thematic', 50),
        ];

        return this.deduplicateByParagraph(allInsights).sort((a, b) => b.rankingScore - a.rankingScore);
      };

      let sortedInsights = await collectRankedInsights(language);

      if (sortedInsights.length === 0) {
        const bookLevelMatches = await this.findBookCitations(book, language);
        sortedInsights = this
          .deduplicateByParagraph(this.rankInsights(bookLevelMatches, 'thematic', 40))
          .sort((a, b) => b.rankingScore - a.rankingScore);
      }

      // Fallback 2: retry in English if locale dataset is sparse
      if (sortedInsights.length === 0 && language !== 'en') {
        sortedInsights = await collectRankedInsights('en');
        if (sortedInsights.length === 0) {
          const bookLevelEnglish = await this.findBookCitations(book, 'en');
          sortedInsights = this
            .deduplicateByParagraph(this.rankInsights(bookLevelEnglish, 'thematic', 40))
            .sort((a, b) => b.rankingScore - a.rankingScore);
        }
      }

      if (sortedInsights.length === 0) {
        sortedInsights = await this.findGeneralFallbackInsights(language, limit);
      }

      return {
        passage,
        insights: sortedInsights.slice(0, limit),
        totalAvailable: sortedInsights.length,
        hasMore: sortedInsights.length > limit
      };
    } catch (error) {
      console.warn(`EGW passage panel unavailable for ${book} ${chapter}: ${(error as Error)?.message || 'unknown error'}`);
      try {
        const fallbackInsights = await this.findGeneralFallbackInsights(language, limit);
        return {
          passage: this.formatPassageReference(book, chapter, verseStart, verseEnd),
          insights: fallbackInsights.slice(0, limit),
          totalAvailable: fallbackInsights.length,
          hasMore: fallbackInsights.length > limit,
        };
      } catch (fallbackError) {
        console.warn(`EGW general fallback unavailable for ${book} ${chapter}: ${(fallbackError as Error)?.message || 'unknown error'}`);
      }
      return {
        passage: this.formatPassageReference(book, chapter, verseStart, verseEnd),
        insights: [],
        totalAvailable: 0,
        hasMore: false,
      };
    }
  }

  private normalizeBookKey(book: string): string {
    return (book || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  private resolveBookAliases(book: string): string[] {
    const raw = (book || '').trim().toLowerCase();
    const key = this.normalizeBookKey(book);
    const canonical = this.spanishBookKeyMap.get(key) || key;
    const variants = new Set<string>([raw, key, canonical]);

    const addSpacingVariant = (value: string) => {
      if (/^[123][a-z]/.test(value)) {
        variants.add(`${value[0]} ${value.slice(1)}`);
      }
    };

    addSpacingVariant(key);
    addSpacingVariant(canonical);

    if (canonical === 'songofsolomon') {
      variants.add('song of solomon');
      variants.add('song of songs');
    }

    return Array.from(variants).filter(Boolean);
  }

  private async findBookCitations(
    book: string,
    language: string = 'en',
  ): Promise<EGWScriptureReference[]> {
    const bookAliases = this.resolveBookAliases(book);
    return this.scriptureRefRepository
      .createQueryBuilder('ref')
      .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
      .where('LOWER(ref.book) IN (:...bookAliases)', { bookAliases })
      .andWhere('ref.language = :language', { language })
      .orderBy('ref.chapter', 'ASC')
      .addOrderBy('ref.verseStart', 'ASC')
      .take(25)
      .getMany();
  }

  private async findGeneralFallbackInsights(
    language: string,
    limit: number,
  ): Promise<PassageEGWInsight[]> {
    let paragraphs: EGWParagraph[] = [];
    try {
      paragraphs = await this.paragraphRepository
        .createQueryBuilder('p')
        .where('p.language = :language', { language })
        .take(limit)
        .getMany();

      if (!paragraphs.length && language !== 'en') {
        paragraphs = await this.paragraphRepository
          .createQueryBuilder('p')
          .where('p.language = :language', { language: 'en' })
          .take(limit)
          .getMany();
      }
    } catch (error) {
      console.warn(`EGW fallback paragraph lookup unavailable for ${language}: ${(error as Error)?.message || 'unknown error'}`);
      paragraphs = [];
    }

    if (!paragraphs.length) {
      const isSpanish = String(language || '').toLowerCase().startsWith('es');
      const generalReference = isSpanish ? 'Consejo general del Espíritu de Profecía' : 'General Spirit of Prophecy counsel';
      const fallbackContent = isSpanish
        ? 'No se encontró una cita directa para este pasaje en la biblioteca cargada. Use este resumen general del Espíritu de Profecía: mantenga la Escritura en el centro, presente a Cristo como el foco del mensaje, y conduzca a la congregación a una respuesta de fe concreta. No reduzca el pasaje a una línea; exponga su peso devocional, doctrinal y pastoral.'
        : 'No direct citation was found for this passage in the loaded library. Use this general Spirit of Prophecy counsel: keep Scripture at the center, present Christ as the focus of the message, and lead the congregation toward a concrete response of faith. Do not shrink the passage into a single line; preach its devotional, doctrinal, and pastoral weight.';

      return [
        {
          paragraphId: `fallback-general-1-${language}`,
          bookCode: 'general',
          bookTitle: isSpanish ? 'Consejo general' : 'General counsel',
          chapterTitle: isSpanish ? 'Resumen pastoral' : 'Pastoral summary',
          reference: generalReference,
          content: fallbackContent,
          preview: fallbackContent,
          scriptureReference: 'General EGW insight',
          rankingScore: 20,
          rankingReason: 'doctrinal' as const,
        },
        {
          paragraphId: `fallback-general-2-${language}`,
          bookCode: 'general',
          bookTitle: isSpanish ? 'Consejo general' : 'General counsel',
          chapterTitle: isSpanish ? 'Aplicación práctica' : 'Practical application',
          reference: generalReference,
          content: isSpanish
            ? 'Predique la gracia de Dios con claridad, pero no deje fuera el llamado a la obediencia. La verdad bíblica debe llegar al corazón y a la vida diaria, no quedarse como dato religioso.'
            : 'Preach God’s grace clearly, but do not leave out the call to obedience. Biblical truth should reach the heart and daily life, not remain as a religious data point.',
          preview: isSpanish
            ? 'Predique la gracia de Dios con claridad, pero no deje fuera el llamado a la obediencia.'
            : 'Preach God’s grace clearly, but do not leave out the call to obedience.',
          scriptureReference: 'General EGW insight',
          rankingScore: 19,
          rankingReason: 'thematic' as const,
        },
        {
          paragraphId: `fallback-general-3-${language}`,
          bookCode: 'general',
          bookTitle: isSpanish ? 'Consejo general' : 'General counsel',
          chapterTitle: isSpanish ? 'Centro en Cristo' : 'Christ-centered center',
          reference: generalReference,
          content: isSpanish
            ? 'Toda aplicación de Spirit of Prophecy debe mantenerse secundaria respecto a la Escritura. Sirve para reforzar el punto bíblico, no para reemplazarlo ni volverlo sensacionalista.'
            : 'Every Spirit of Prophecy application must remain secondary to Scripture. It should reinforce the biblical point, not replace it or turn it sensational.',
          preview: isSpanish
            ? 'Toda aplicación de Spirit of Prophecy debe mantenerse secundaria respecto a la Escritura.'
            : 'Every Spirit of Prophecy application must remain secondary to Scripture.',
          scriptureReference: 'General EGW insight',
          rankingScore: 18,
          rankingReason: 'doctrinal' as const,
        },
      ].slice(0, limit);
    }

    return paragraphs.map((p, index) => ({
      paragraphId: p.id,
      bookCode: p.bookCode,
      bookTitle: p.bookTitle,
      chapterTitle: p.chapterTitle,
      reference: p.reference,
      content: p.content,
      preview: this.createPreview(p.content),
      scriptureReference: 'General EGW insight',
      rankingScore: 20 - index,
      rankingReason: 'doctrinal',
    }));
  }

  /**
   * Find exact verse citations (Priority 1)
   */
  private async findExactVerseCitations(
    book: string,
    chapter: number,
    verseStart?: number,
    verseEnd?: number,
    language: string = 'en'
  ): Promise<EGWScriptureReference[]> {
    const bookAliases = this.resolveBookAliases(book);
    const query = this.scriptureRefRepository
      .createQueryBuilder('ref')
      .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
      .where('LOWER(ref.book) IN (:...bookAliases)', { bookAliases })
      .andWhere('ref.chapter = :chapter', { chapter })
      .andWhere('ref.language = :language', { language });

    if (verseStart !== undefined) {
      // Find references that overlap with the requested verse range
      const end = verseEnd || verseStart;
      query.andWhere(
        '(ref.verseStart <= :end AND (ref.verseEnd >= :start OR ref.verseEnd IS NULL))',
        { start: verseStart, end }
      );
    }

    return query
      .orderBy('ref.verseStart', 'ASC')
      .take(20)
      .getMany();
  }

  /**
   * Find same chapter citations (Priority 2)
   */
  private async findChapterCitations(
    book: string,
    chapter: number,
    language: string = 'en'
  ): Promise<EGWScriptureReference[]> {
    const bookAliases = this.resolveBookAliases(book);
    return this.scriptureRefRepository
      .createQueryBuilder('ref')
      .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
      .where('LOWER(ref.book) IN (:...bookAliases)', { bookAliases })
      .andWhere('ref.chapter = :chapter', { chapter })
      .andWhere('ref.language = :language', { language })
      .orderBy('ref.verseStart', 'ASC')
      .take(15)
      .getMany();
  }

  /**
   * Find thematic matches (Priority 3)
   * Based on book name appearing in paragraph content
   */
  private async findThematicMatches(
    book: string,
    chapter: number,
    language: string = 'en'
  ): Promise<EGWScriptureReference[]> {
    const bookAliases = this.resolveBookAliases(book);
    // Search for paragraphs mentioning the book name
    const paragraphs = await this.paragraphRepository
      .createQueryBuilder('p')
      .where('LOWER(p.content) LIKE LOWER(:bookPattern)', { 
        bookPattern: `%${book}%` 
      })
      .andWhere('p.language = :language', { language })
      .take(10)
      .getMany();

    // Get scripture references for these paragraphs
    if (paragraphs.length === 0) return [];

    const paragraphIds = paragraphs.map(p => p.id);
    
    return this.scriptureRefRepository
      .createQueryBuilder('ref')
      .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
      .where('ref.egwParagraphId IN (:...ids)', { ids: paragraphIds })
      .andWhere('LOWER(ref.book) IN (:...bookAliases)', { bookAliases })
      .andWhere('ref.language = :language', { language })
      .take(10)
      .getMany();
  }

  /**
   * Rank insights with score and reason
   */
  private rankInsights(
    references: EGWScriptureReference[],
    reason: PassageEGWInsight['rankingReason'],
    baseScore: number
  ): PassageEGWInsight[] {
    return references
      .filter(ref => ref.egwParagraph) // Ensure paragraph is loaded
      .map((ref, index) => {
        const paragraph = ref.egwParagraph;
        const score = baseScore - (index * 2); // Slight decay for ordering

        return {
          paragraphId: paragraph.id,
          bookCode: paragraph.bookCode,
          bookTitle: paragraph.bookTitle,
          chapterTitle: paragraph.chapterTitle,
          reference: paragraph.reference,
          content: paragraph.content, // Full text preserved verbatim
          preview: this.createPreview(paragraph.content),
          scriptureReference: ref.reference,
          rankingScore: score,
          rankingReason: reason
        };
      });
  }

  /**
   * Create 2-4 line preview (approximately 150-200 characters)
   */
  private createPreview(content: string): string {
    if (content.length <= 200) return content;
    
    // Find natural break point (sentence end) near 200 chars
    const truncated = content.substring(0, 200);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastQuestion = truncated.lastIndexOf('?');
    const lastExclamation = truncated.lastIndexOf('!');
    
    const breakPoint = Math.max(lastPeriod, lastQuestion, lastExclamation);
    
    if (breakPoint > 100) {
      return content.substring(0, breakPoint + 1);
    }
    
    return truncated + '...';
  }

  /**
   * Deduplicate insights by paragraph ID
   */
  private deduplicateByParagraph(insights: PassageEGWInsight[]): PassageEGWInsight[] {
    const seen = new Set<string>();
    return insights.filter(insight => {
      if (seen.has(insight.paragraphId)) return false;
      seen.add(insight.paragraphId);
      return true;
    });
  }

  /**
   * Format passage reference for display
   */
  private formatPassageReference(
    book: string,
    chapter: number,
    verseStart?: number,
    verseEnd?: number
  ): string {
    let ref = `${book} ${chapter}`;
    if (verseStart !== undefined) {
      ref += `:${verseStart}`;
      if (verseEnd !== undefined && verseEnd !== verseStart) {
        ref += `-${verseEnd}`;
      }
    }
    return ref;
  }

  /**
   * Get SDA Smart Boost for key doctrinal passages
   * Automatically surfaces frequently cited EGW passages for specific doctrinal areas
   */
  async getSDASmartBoost(passage: string): Promise<{
    isDoctrinalPassage: boolean;
    theme?: string;
    frequentlyCited?: PassageEGWInsight[];
  }> {
    try {
      const doctrinalPatterns = [
        { pattern: /daniel\s+[2789]/i, theme: 'Prophecy - Daniel' },
        { pattern: /revelation\s+[1-14]/i, theme: 'Prophecy - Revelation' },
        { pattern: /hebrews\s+[89]/i, theme: 'Sanctuary - Heavenly Ministry' },
        { pattern: /exodus\s+20/i, theme: 'Law - Ten Commandments' },
        { pattern: /genesis\s+[12]/i, theme: 'Creation - Sabbath' },
        { pattern: /ecclesiastes\s+[912]/i, theme: 'State of the Dead' },
        { pattern: /malachi\s+[34]/i, theme: 'Final Judgment' }
      ];

      for (const { pattern, theme } of doctrinalPatterns) {
        if (pattern.test(passage)) {
          // This is a key doctrinal passage - surface frequently cited EGW
          const insights = await this.getFrequentlyCitedForTheme(theme);

          return {
            isDoctrinalPassage: true,
            theme,
            frequentlyCited: insights.slice(0, 5)
          };
        }
      }

      return { isDoctrinalPassage: false };
    } catch (error) {
      console.warn(`EGW SDA smart boost unavailable for ${passage}: ${(error as Error)?.message || 'unknown error'}`);
      return { isDoctrinalPassage: false };
    }
  }

  /**
   * Get frequently cited EGW passages for a doctrinal theme
   */
  private async getFrequentlyCitedForTheme(theme: string): Promise<PassageEGWInsight[]> {
    const themeKeywords: Record<string, string[]> = {
      'Prophecy - Daniel': ['Daniel', 'prophecy', 'vision', 'interpretation'],
      'Prophecy - Revelation': ['Revelation', 'apocalypse', 'seven churches', 'beast'],
      'Sanctuary - Heavenly Ministry': ['sanctuary', 'most holy', 'high priest', 'intercession'],
      'Law - Ten Commandments': ['commandments', 'law', 'Sabbath', 'moral law'],
      'Creation - Sabbath': ['creation', 'Sabbath', 'seventh day', 'rest'],
      'State of the Dead': ['death', 'resurrection', 'sleep', 'unconscious'],
      'Final Judgment': ['judgment', 'investigative', 'cleansing', 'sanctuary']
    };

    const keywords = themeKeywords[theme] || [theme];
    const allResults: PassageEGWInsight[] = [];

    for (const keyword of keywords.slice(0, 2)) {
      const paragraphs = await this.paragraphRepository
        .createQueryBuilder('p')
        .where('LOWER(p.content) LIKE LOWER(:keyword)', { 
          keyword: `%${keyword}%` 
        })
        .take(5)
        .getMany();

      paragraphs.forEach(p => {
        allResults.push({
          paragraphId: p.id,
          bookCode: p.bookCode,
          bookTitle: p.bookTitle,
          chapterTitle: p.chapterTitle,
          reference: p.reference,
          content: p.content,
          preview: this.createPreview(p.content),
          scriptureReference: theme,
          rankingScore: 90,
          rankingReason: 'doctrinal'
        });
      });
    }

    return this.deduplicateByParagraph(allResults);
  }
}
