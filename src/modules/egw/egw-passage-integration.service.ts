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
    limit: number = 5
  ): Promise<EGWPanelData> {
    const passage = this.formatPassageReference(book, chapter, verseStart, verseEnd);
    
    // Priority 1: Exact verse citations
    const exactMatches = await this.findExactVerseCitations(book, chapter, verseStart, verseEnd);
    
    // Priority 2: Same chapter citations
    const chapterMatches = await this.findChapterCitations(book, chapter);
    
    // Priority 3: Thematic matches (keyword alignment)
    const thematicMatches = await this.findThematicMatches(book, chapter);
    
    // Combine and rank
    const allInsights = [
      ...this.rankInsights(exactMatches, 'exact_verse', 100),
      ...this.rankInsights(chapterMatches, 'same_chapter', 75),
      ...this.rankInsights(thematicMatches, 'thematic', 50)
    ];

    // Deduplicate by paragraph ID
    const uniqueInsights = this.deduplicateByParagraph(allInsights);
    
    // Sort by ranking score
    const sortedInsights = uniqueInsights.sort((a, b) => b.rankingScore - a.rankingScore);
    
    return {
      passage,
      insights: sortedInsights.slice(0, limit),
      totalAvailable: sortedInsights.length,
      hasMore: sortedInsights.length > limit
    };
  }

  /**
   * Find exact verse citations (Priority 1)
   */
  private async findExactVerseCitations(
    book: string,
    chapter: number,
    verseStart?: number,
    verseEnd?: number
  ): Promise<EGWScriptureReference[]> {
    const query = this.scriptureRefRepository
      .createQueryBuilder('ref')
      .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
      .where('LOWER(ref.book) = LOWER(:book)', { book })
      .andWhere('ref.chapter = :chapter', { chapter });

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
    chapter: number
  ): Promise<EGWScriptureReference[]> {
    return this.scriptureRefRepository
      .createQueryBuilder('ref')
      .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
      .where('LOWER(ref.book) = LOWER(:book)', { book })
      .andWhere('ref.chapter = :chapter', { chapter })
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
    chapter: number
  ): Promise<EGWScriptureReference[]> {
    // Search for paragraphs mentioning the book name
    const paragraphs = await this.paragraphRepository
      .createQueryBuilder('p')
      .where('LOWER(p.content) LIKE LOWER(:bookPattern)', { 
        bookPattern: `%${book}%` 
      })
      .take(10)
      .getMany();

    // Get scripture references for these paragraphs
    if (paragraphs.length === 0) return [];

    const paragraphIds = paragraphs.map(p => p.id);
    
    return this.scriptureRefRepository
      .createQueryBuilder('ref')
      .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
      .where('ref.egwParagraphId IN (:...ids)', { ids: paragraphIds })
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
