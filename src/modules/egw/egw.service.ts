import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { EGWBook } from '../../entities/egw-book.entity';
import { EGWParagraph } from '../../entities/egw-paragraph.entity';
import { EGWScriptureReference } from '../../entities/egw-scripture-reference.entity';

export interface EGWSearchResult {
  reference: string;
  bookCode: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  paragraphNumber: number;
  content: string;
  relevance: number;
}

export interface EGWQuote {
  reference: string;
  text: string;
  bookTitle: string;
  context?: string;
}

@Injectable()
export class EGWService {
  constructor(
    @InjectRepository(EGWBook)
    private bookRepository: Repository<EGWBook>,
    @InjectRepository(EGWParagraph)
    private paragraphRepository: Repository<EGWParagraph>,
    @InjectRepository(EGWScriptureReference)
    private scriptureRefRepository: Repository<EGWScriptureReference>
  ) {}

  async getAllBooks(language?: string): Promise<EGWBook[]> {
    const where = language ? { language } : {};
    return this.bookRepository.find({
      where,
      order: { category: 'ASC', title: 'ASC' }
    });
  }

  async getBookByCode(code: string): Promise<EGWBook> {
    return this.bookRepository.findOne({ where: { code } });
  }

  async getBooksByCategory(category: string): Promise<EGWBook[]> {
    return this.bookRepository.find({
      where: { category },
      order: { title: 'ASC' }
    });
  }

  async getParagraphByReference(reference: string): Promise<EGWParagraph> {
    return this.paragraphRepository.findOne({ where: { reference } });
  }

  async getChapter(bookCode: string, chapterNumber: number): Promise<EGWParagraph[]> {
    return this.paragraphRepository.find({
      where: { bookCode, chapterNumber },
      order: { paragraphNumber: 'ASC' }
    });
  }

  async searchContent(query: string, limit: number = 20, language?: string): Promise<EGWSearchResult[]> {
    const where: any = { content: ILike(`%${query}%`) };
    if (language) {
      where.language = language;
    }
    
    const paragraphs = await this.paragraphRepository.find({
      where,
      take: limit,
      order: { bookCode: 'ASC', chapterNumber: 'ASC', paragraphNumber: 'ASC' }
    });

    return paragraphs.map(p => ({
      reference: p.reference,
      bookCode: p.bookCode,
      bookTitle: p.bookTitle,
      chapterNumber: p.chapterNumber,
      chapterTitle: p.chapterTitle,
      paragraphNumber: p.paragraphNumber,
      content: p.content,
      relevance: this.calculateRelevance(p.content, query)
    })).sort((a, b) => b.relevance - a.relevance);
  }

  async searchByTopic(topic: string, limit: number = 10): Promise<EGWSearchResult[]> {
    // Topic-based search with keyword expansion
    const keywords = this.expandTopicKeywords(topic);
    const results: EGWSearchResult[] = [];

    for (const keyword of keywords) {
      const matches = await this.searchContent(keyword, Math.ceil(limit / keywords.length));
      results.push(...matches);
    }

    // Deduplicate and sort by relevance
    const uniqueResults = Array.from(
      new Map(results.map(r => [r.reference, r])).values()
    );

    return uniqueResults
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  }

  async getRelevantQuotes(
    scriptureReference: string,
    topic?: string,
    limit: number = 5
  ): Promise<EGWQuote[]> {
    // Parse scripture reference (e.g., "1 Samuel 16:18-23" -> book: "1 Samuel", chapter: 16)
    const refParts = scriptureReference.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!refParts) {
      return [];
    }

    const [, book, chapterStr] = refParts;
    const chapter = parseInt(chapterStr);

    // Find scripture references matching this passage
    const scriptureRefs = await this.scriptureRefRepository
      .createQueryBuilder('ref')
      .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
      .where('ref.book = :book', { book })
      .andWhere('ref.chapter = :chapter', { chapter })
      .andWhere('ref.language = :language', { language: 'en' })
      .take(limit)
      .getMany();

    // Map to EGWQuote format
    return scriptureRefs
      .filter(ref => ref.egwParagraph)
      .map(ref => ({
        reference: ref.egwParagraph.reference,
        text: ref.egwParagraph.content,
        bookTitle: ref.egwParagraph.bookTitle,
        context: ref.egwParagraph.chapterTitle
      }));
  }

  async getSuggestedReading(topic: string): Promise<{
    books: EGWBook[];
    chapters: { bookCode: string; chapterNumber: number; title: string }[];
  }> {
    // Get relevant books and chapters for a topic
    const results = await this.searchByTopic(topic, 20);
    
    const bookCodes = [...new Set(results.map(r => r.bookCode))];
    const books = await this.bookRepository.find({
      where: bookCodes.map(code => ({ code }))
    });

    const chapterMap = new Map<string, { bookCode: string; chapterNumber: number; title: string }>();
    results.forEach(r => {
      const key = `${r.bookCode}-${r.chapterNumber}`;
      if (!chapterMap.has(key)) {
        chapterMap.set(key, {
          bookCode: r.bookCode,
          chapterNumber: r.chapterNumber,
          title: r.chapterTitle
        });
      }
    });

    return {
      books,
      chapters: Array.from(chapterMap.values()).slice(0, 10)
    };
  }

  async getInsightsForPassage(
    book: string,
    chapter: number,
    verseStart?: number,
    verseEnd?: number,
    language?: string,
    limit: number = 5
  ): Promise<{
    paragraph: EGWParagraph;
    bookTitle: string;
    reference: string;
    excerpt: string;
  }[]> {
    // Find scripture references matching this passage
    const where: any = { book, chapter };
    if (language) {
      where.language = language;
    }
    if (verseStart) {
      // Find references that overlap with the requested verse range
      where.verseStart = verseStart;
    }

    const scriptureRefs = await this.scriptureRefRepository.find({
      where,
      relations: ['egwParagraph'],
      take: limit
    });

    return scriptureRefs.map(ref => {
      const para = ref.egwParagraph;
      // Create excerpt (first 200 chars)
      const excerpt = para.content.length > 200 
        ? para.content.substring(0, 200) + '...'
        : para.content;

      return {
        paragraph: para,
        bookTitle: para.bookTitle,
        reference: para.reference,
        excerpt
      };
    });
  }

  private calculateRelevance(content: string, query: string): number {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/);

    let score = 0;

    // Exact phrase match
    if (lowerContent.includes(lowerQuery)) {
      score += 10;
    }

    // Word matches
    queryWords.forEach(word => {
      if (word.length < 3) return;
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        score += matches.length;
      }
    });

    // Proximity bonus (words appear close together)
    if (queryWords.length > 1) {
      const firstIndex = lowerContent.indexOf(queryWords[0]);
      const lastIndex = lowerContent.indexOf(queryWords[queryWords.length - 1]);
      if (firstIndex !== -1 && lastIndex !== -1) {
        const distance = Math.abs(lastIndex - firstIndex);
        if (distance < 100) {
          score += 5;
        }
      }
    }

    return score;
  }

  private expandTopicKeywords(topic: string): string[] {
    const topicMap: Record<string, string[]> = {
      'sabbath': ['sabbath', 'seventh day', 'rest', 'holy day'],
      'sanctuary': ['sanctuary', 'temple', 'tabernacle', 'holy place', 'most holy'],
      'prophecy': ['prophecy', 'vision', 'revelation', 'daniel', 'end time'],
      'salvation': ['salvation', 'redemption', 'justification', 'sanctification'],
      'prayer': ['prayer', 'intercession', 'supplication', 'communion with God'],
      'faith': ['faith', 'trust', 'belief', 'confidence in God'],
      'love': ['love', 'charity', 'compassion', 'kindness'],
      'grace': ['grace', 'mercy', 'forgiveness', 'pardon'],
      'obedience': ['obedience', 'commandments', 'law', 'submission'],
      'second coming': ['second coming', 'advent', 'return of Christ', 'parousia']
    };

    const lowerTopic = topic.toLowerCase();
    
    // Check if topic matches a predefined category
    for (const [key, keywords] of Object.entries(topicMap)) {
      if (lowerTopic.includes(key)) {
        return keywords;
      }
    }

    // Default: use the topic itself
    return [topic];
  }
}
