import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { resolve } from 'path';
import { promises as fs } from 'fs';
import { BibleTranslation } from '../../entities/bible-translation.entity';
import { LlmService } from '../llm/llm.service';
import { convertToApiBiblePassageId, formatApiBibleResponse } from './scripture-helpers';
import { ScriptureCacheService } from './scripture-cache.service';

@Injectable()
export class ScriptureService {
  private crossReferenceIndex: Map<string, string[]> | null = null;
  private wordStudyIndex: Record<string, any> | null = null;
  private wordOccurrenceIndex: Record<string, any> | null = null;
  private crossReferenceCategoryIndex: Record<string, string> | null = null;
  private bookMetadataIndex: Record<string, any> | null = null;
  private historicalContextIndex: Record<string, any> | null = null;
  private culturalContextIndex: Record<string, any> | null = null;
  private timelineIndex: Record<string, any> | null = null;
  private geographyIndex: Record<string, any> | null = null;
  private spanishBookKeyMap = new Map<string, string>([
    ['genesis', 'genesis'],
    ['exodo', 'exodus'],
    ['levitico', 'leviticus'],
    ['numeros', 'numbers'],
    ['deuteronomio', 'deuteronomy'],
    ['josue', 'joshua'],
    ['jueces', 'judges'],
    ['rut', 'ruth'],
    ['1samuel', '1samuel'],
    ['2samuel', '2samuel'],
    ['1reyes', '1kings'],
    ['2reyes', '2kings'],
    ['1cronicas', '1chronicles'],
    ['2cronicas', '2chronicles'],
    ['esdras', 'ezra'],
    ['nehemias', 'nehemiah'],
    ['ester', 'esther'],
    ['job', 'job'],
    ['salmos', 'psalms'],
    ['proverbios', 'proverbs'],
    ['eclesiastes', 'ecclesiastes'],
    ['cantares', 'songofsolomon'],
    ['isaias', 'isaiah'],
    ['jeremias', 'jeremiah'],
    ['lamentaciones', 'lamentations'],
    ['ezequiel', 'ezekiel'],
    ['daniel', 'daniel'],
    ['oseas', 'hosea'],
    ['abdias', 'obadiah'],
    ['jonas', 'jonah'],
    ['miqueas', 'micah'],
    ['habacuc', 'habakkuk'],
    ['sofonias', 'zephaniah'],
    ['hageo', 'haggai'],
    ['zacarias', 'zechariah'],
    ['malaquias', 'malachi'],
    ['mateo', 'matthew'],
    ['marcos', 'mark'],
    ['lucas', 'luke'],
    ['juan', 'john'],
    ['hechos', 'acts'],
    ['romanos', 'romans'],
    ['1corintios', '1corinthians'],
    ['2corintios', '2corinthians'],
    ['galatas', 'galatians'],
    ['efesios', 'ephesians'],
    ['filipenses', 'philippians'],
    ['colosenses', 'colossians'],
    ['1tesalonicenses', '1thessalonians'],
    ['2tesalonicenses', '2thessalonians'],
    ['1timoteo', '1timothy'],
    ['2timoteo', '2timothy'],
    ['tito', 'titus'],
    ['filemon', 'philemon'],
    ['hebreos', 'hebrews'],
    ['santiago', 'james'],
    ['1pedro', '1peter'],
    ['2pedro', '2peter'],
    ['1juan', '1john'],
    ['2juan', '2john'],
    ['3juan', '3john'],
    ['judas', 'jude'],
    ['apocalipsis', 'revelation'],
  ]);
  private verseBookMap = new Map<string, string>([
    ['gen', 'Gen'],
    ['genesis', 'Gen'],
    ['exodo', 'Exod'],
    ['levitico', 'Lev'],
    ['numeros', 'Num'],
    ['deuteronomio', 'Deut'],
    ['josue', 'Josh'],
    ['jueces', 'Judg'],
    ['rut', 'Ruth'],
    ['1samuel', '1Sam'],
    ['2samuel', '2Sam'],
    ['1reyes', '1Kgs'],
    ['2reyes', '2Kgs'],
    ['1cronicas', '1Chr'],
    ['2cronicas', '2Chr'],
    ['esdras', 'Ezra'],
    ['nehemias', 'Neh'],
    ['ester', 'Esth'],
    ['salmos', 'Ps'],
    ['proverbios', 'Prov'],
    ['eclesiastes', 'Eccl'],
    ['cantares', 'Song'],
    ['isaias', 'Isa'],
    ['jeremias', 'Jer'],
    ['lamentaciones', 'Lam'],
    ['ezequiel', 'Ezek'],
    ['oseas', 'Hos'],
    ['abdias', 'Obad'],
    ['jonas', 'Jonah'],
    ['miqueas', 'Mic'],
    ['habacuc', 'Hab'],
    ['sofonias', 'Zeph'],
    ['hageo', 'Hag'],
    ['zacarias', 'Zech'],
    ['malaquias', 'Mal'],
    ['mateo', 'Matt'],
    ['marcos', 'Mark'],
    ['lucas', 'Luke'],
    ['juan', 'John'],
    ['hechos', 'Acts'],
    ['romanos', 'Rom'],
    ['1corintios', '1Cor'],
    ['2corintios', '2Cor'],
    ['galatas', 'Gal'],
    ['efesios', 'Eph'],
    ['filipenses', 'Phil'],
    ['colosenses', 'Col'],
    ['1tesalonicenses', '1Thess'],
    ['2tesalonicenses', '2Thess'],
    ['1timoteo', '1Tim'],
    ['2timoteo', '2Tim'],
    ['filemon', 'Phlm'],
    ['hebreos', 'Heb'],
    ['santiago', 'Jas'],
    ['1pedro', '1Pet'],
    ['2pedro', '2Pet'],
    ['1juan', '1John'],
    ['2juan', '2John'],
    ['3juan', '3John'],
    ['judas', 'Jude'],
    ['apocalipsis', 'Rev'],
    ['exod', 'Exod'],
    ['exodus', 'Exod'],
    ['lev', 'Lev'],
    ['leviticus', 'Lev'],
    ['num', 'Num'],
    ['numbers', 'Num'],
    ['deut', 'Deut'],
    ['deuteronomy', 'Deut'],
    ['josh', 'Josh'],
    ['joshua', 'Josh'],
    ['judg', 'Judg'],
    ['judges', 'Judg'],
    ['ruth', 'Ruth'],
    ['1sam', '1Sam'],
    ['1 sam', '1Sam'],
    ['2sam', '2Sam'],
    ['2 sam', '2Sam'],
    ['1kings', '1Kgs'],
    ['1kgs', '1Kgs'],
    ['2kings', '2Kgs'],
    ['2kgs', '2Kgs'],
    ['1chron', '1Chr'],
    ['1chr', '1Chr'],
    ['2chron', '2Chr'],
    ['2chr', '2Chr'],
    ['ezra', 'Ezra'],
    ['neh', 'Neh'],
    ['nehemiah', 'Neh'],
    ['esth', 'Esth'],
    ['esther', 'Esth'],
    ['job', 'Job'],
    ['ps', 'Ps'],
    ['psalm', 'Ps'],
    ['psalms', 'Ps'],
    ['prov', 'Prov'],
    ['proverbs', 'Prov'],
    ['eccl', 'Eccl'],
    ['ecclesiastes', 'Eccl'],
    ['song', 'Song'],
    ['songofsolomon', 'Song'],
    ['songofsongs', 'Song'],
    ['isa', 'Isa'],
    ['isaiah', 'Isa'],
    ['jer', 'Jer'],
    ['jeremiah', 'Jer'],
    ['lam', 'Lam'],
    ['lamentations', 'Lam'],
    ['ezek', 'Ezek'],
    ['ezekiel', 'Ezek'],
    ['dan', 'Dan'],
    ['daniel', 'Dan'],
    ['hos', 'Hos'],
    ['hosea', 'Hos'],
    ['joel', 'Joel'],
    ['amos', 'Amos'],
    ['obad', 'Obad'],
    ['obadiah', 'Obad'],
    ['jonah', 'Jonah'],
    ['mic', 'Mic'],
    ['micah', 'Mic'],
    ['nah', 'Nah'],
    ['nahum', 'Nah'],
    ['hab', 'Hab'],
    ['habakkuk', 'Hab'],
    ['zeph', 'Zeph'],
    ['zephaniah', 'Zeph'],
    ['hag', 'Hag'],
    ['haggai', 'Hag'],
    ['zech', 'Zech'],
    ['zechariah', 'Zech'],
    ['mal', 'Mal'],
    ['malachi', 'Mal'],
    ['matt', 'Matt'],
    ['matthew', 'Matt'],
    ['mark', 'Mark'],
    ['luke', 'Luke'],
    ['john', 'John'],
    ['acts', 'Acts'],
    ['rom', 'Rom'],
    ['romans', 'Rom'],
    ['1cor', '1Cor'],
    ['1 cor', '1Cor'],
    ['2cor', '2Cor'],
    ['2 cor', '2Cor'],
    ['gal', 'Gal'],
    ['galatians', 'Gal'],
    ['eph', 'Eph'],
    ['ephesians', 'Eph'],
    ['phil', 'Phil'],
    ['philippians', 'Phil'],
    ['col', 'Col'],
    ['colossians', 'Col'],
    ['1thess', '1Thess'],
    ['1 thess', '1Thess'],
    ['2thess', '2Thess'],
    ['2 thess', '2Thess'],
    ['1tim', '1Tim'],
    ['1 tim', '1Tim'],
    ['2tim', '2Tim'],
    ['2 tim', '2Tim'],
    ['titus', 'Titus'],
    ['phlm', 'Phlm'],
    ['philemon', 'Phlm'],
    ['heb', 'Heb'],
    ['hebrews', 'Heb'],
    ['jas', 'Jas'],
    ['james', 'Jas'],
    ['1pet', '1Pet'],
    ['1 pet', '1Pet'],
    ['2pet', '2Pet'],
    ['2 pet', '2Pet'],
    ['1john', '1John'],
    ['1 john', '1John'],
    ['2john', '2John'],
    ['2 john', '2John'],
    ['3john', '3John'],
    ['3 john', '3John'],
    ['jude', 'Jude'],
    ['rev', 'Rev'],
    ['revelation', 'Rev'],
  ]);

  constructor(
    private configService: ConfigService,
    @InjectRepository(BibleTranslation)
    private translationRepository: Repository<BibleTranslation>,
    private llmService: LlmService,
    private cacheService: ScriptureCacheService,
  ) {}

  async getPassage(reference: string, translationCode: string = 'KJV'): Promise<any> {
    const apiKey = this.configService.get('BIBLE_API_KEY');
    const apiUrl = this.configService.get('BIBLE_API_URL');
    const normalizedReference = this.normalizeReferenceForApi(reference);

    if (apiKey && apiUrl) {
      try {
        const translation = await this.translationRepository.findOne({
          where: { code: translationCode },
        });

        if (translation?.apiId) {
          // Use API.Bible passages endpoint
          const passageId = convertToApiBiblePassageId(normalizedReference);
          
          // Check cache first
          const cached = await this.cacheService.getPassage(translation.apiId, passageId);
          if (cached) {
            return cached;
          }
          
          const response = await axios.get(
            `${apiUrl}/bibles/${translation.apiId}/passages/${passageId}`,
            {
              params: { 
                'content-type': 'text',
                'include-verse-numbers': true,
                'include-notes': true 
              },
              headers: { 'api-key': apiKey },
            },
          );

          // Format response to match expected structure
          const formatted = formatApiBibleResponse(response.data, reference, translationCode);
          
          // Cache the result
          await this.cacheService.setPassage(translation.apiId, passageId, formatted);
          
          return formatted;
        }
      } catch (error) {
        console.error('[Scripture] API.Bible error:', error.response?.data || error.message);
        return this.fetchBibleApiPassage(normalizedReference, translationCode);
      }
    }

    return this.fetchBibleApiPassage(normalizedReference, translationCode);
  }

  async getStructuralAnalysis(reference: string, translationCode: string = 'KJV') {
    const passage = await this.getPassage(reference, translationCode);
    const passageText = Array.isArray(passage?.verses)
      ? passage.verses.map((verse: any) => `${verse.reference} ${verse.text}`).join('\n')
      : JSON.stringify(passage || {});
    const prompt = `Analyze the passage structure and return JSON only.

Passage: ${reference}

Text:
${passageText}

Return JSON with keys:
{
  "repeatedPhrases": ["..."],
  "imperatives": ["..."],
  "promises": ["..."],
  "conditions": ["..."],
  "narrativeShifts": ["..."],
  "literaryMarkers": ["..."],
  "chiasticStructure": "...",
  "outline": ["Verse: Summary"]
}

Rules:
- Ground all points in verses.
- If unsure, say so in the relevant field.
- No markdown.`;
    try {
      const response = await this.llmService.generateCompletion(prompt, 'system', {
        temperature: 0.3,
        maxTokens: 900,
      });
      return this.safeJson(response, { raw: response });
    } catch {
      return {
        repeatedPhrases: [],
        imperatives: [],
        promises: [],
        conditions: [],
        narrativeShifts: [],
        literaryMarkers: [],
        chiasticStructure: '',
        outline: [],
        error: 'LLM unavailable. Check LM_STUDIO_URL/LLM_MODEL_NAME or configure OPENAI_API_KEY.',
      };
    }
  }

  async getInterpretiveChallenges(reference: string, translationCode: string = 'KJV') {
    const passage = await this.getPassage(reference, translationCode);
    const passageText = Array.isArray(passage?.verses)
      ? passage.verses.map((verse: any) => `${verse.reference} ${verse.text}`).join('\n')
      : JSON.stringify(passage || {});
    const prompt = `Identify interpretive challenges or debated phrases in this passage.

Passage: ${reference}
Text:
${passageText}

Return ONLY JSON:
{
  "challenges": [
    {
      "phrase": "...",
      "issue": "...",
      "views": ["...", "..."],
      "verses": ["Book 1:1"]
    }
  ]
}

Rules:
- Include verses for each challenge.
- If none, return an empty array.
- No markdown.`;
    try {
      const response = await this.llmService.generateCompletion(prompt, 'system', {
        temperature: 0.3,
        maxTokens: 800,
      });
      return this.safeJson(response, { raw: response });
    } catch {
      return {
        challenges: [],
        error: 'LLM unavailable. Check LM_STUDIO_URL/LLM_MODEL_NAME or configure OPENAI_API_KEY.',
      };
    }
  }

  async getParallelPassages(reference: string, translations: string[], contextRange?: number) {
    const results = [];
    for (const translation of translations) {
      const passage = await this.getPassageWithContext(reference, translation, contextRange);
      results.push({ translation, passage });
    }
    return {
      reference,
      translations: results,
    };
  }

  async getPassageWithContext(reference: string, translationCode: string, contextRange?: number) {
    const expanded = this.expandReference(reference, contextRange);
    return this.getPassage(expanded, translationCode);
  }

  async getCrossReferences(verseReference: string): Promise<string[]> {
    const index = await this.loadCrossReferences();
    const normalized = this.normalizeVerseReference(verseReference);
    console.log(`[CrossRef] Looking up: "${verseReference}" -> normalized: "${normalized}"`);
    
    // Try multiple formats
    const results = index.get(normalized) || index.get(verseReference) || [];
    console.log(`[CrossRef] Found ${results.length} references`);
    
    return results;
  }

  async getCrossReferenceDetails(verseReference: string, category?: string) {
    const refs = await this.getCrossReferences(verseReference);
    const categoryIndex = await this.loadCrossReferenceCategories();
    const normalizedSource = this.normalizeVerseReference(verseReference);
    const details = refs.map((ref) => {
      const normalizedTarget = this.normalizeVerseReference(ref);
      const key = `${normalizedSource}|${normalizedTarget}`;
      return {
        reference: ref,
        category: categoryIndex?.[key] || null,
      };
    });
    if (category) {
      return details.filter((item) => item.category === category);
    }
    return details;
  }

  async getWordStudy(word: string, language: string): Promise<any> {
    const index = await this.loadWordStudyIndex();
    const occurrences = await this.loadWordOccurrences();
    const key = word.toLowerCase();
    const entry = index?.[key];
    const occurrenceEntry = occurrences?.[key];
    const distributionByBook = this.buildDistributionByBook(occurrenceEntry?.verses || []);
    if (entry) {
      return {
        word,
        language,
        lemma: entry.lemma || key,
        transliteration: entry.transliteration || word,
        definition: entry.definition || null,
        usageCount: occurrenceEntry?.count || entry.usageCount || null,
        examples: entry.examples || entry.verseExamples || occurrenceEntry?.verses || [],
        strongs: entry.strongs || null,
        partOfSpeech: entry.partOfSpeech || null,
        verseOccurrences: occurrenceEntry?.verses || [],
        distributionByBook,
      };
    }

    return {
      word,
      language,
      lemma: word.toLowerCase(),
      transliteration: word,
      definition: null,
      usageCount: occurrenceEntry?.count || null,
      examples: occurrenceEntry?.verses || [],
      strongs: null,
      partOfSpeech: null,
      verseOccurrences: occurrenceEntry?.verses || [],
      distributionByBook,
    };
  }

  async getWordStudyInsights(word: string, language: string, context?: string) {
    const prompt = `Provide advanced word study insights as JSON only.

Word: ${word}
Language: ${language}
Context: ${context || 'N/A'}

Return JSON:
{
  "rootWord": "...",
  "semanticRange": ["..."],
  "grammarInsights": {
    "tense": "...",
    "voice": "...",
    "mood": "...",
    "case": "...",
    "number": "...",
    "gender": "...",
    "notes": "..."
  },
  "nuanceNotes": ["..."],
  "commonTranslations": ["..."],
  "exampleReferences": ["Book 1:1"]
}

Rules:
- If unsure, say so in the relevant field.
- No markdown, no extra commentary.`;
    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.4,
      maxTokens: 700,
    });
    return this.safeJson(response, { raw: response });
  }

  async searchScripture(query: string, translationCode: string = 'KJV'): Promise<any[]> {
    const apiKey = this.configService.get('BIBLE_API_KEY');
    const apiUrl = this.configService.get('BIBLE_API_URL');
    if (apiKey && apiUrl) {
      try {
        const translation = await this.translationRepository.findOne({ where: { code: translationCode } });
        if (translation?.apiId) {
          // Check cache first
          const cached = await this.cacheService.getSearch(translation.apiId, query);
          if (cached) {
            return cached;
          }
          
          const response = await axios.get(
            `${apiUrl}/bibles/${translation.apiId}/search`,
            {
              params: { query, limit: 50 },
              headers: { 'api-key': apiKey },
            },
          );
          
          const results = response.data?.data?.verses || [];
          
          // Cache the results
          await this.cacheService.setSearch(translation.apiId, query, results);
          
          return results;
        }
      } catch (error) {
        console.error('[Scripture] Search error:', error.response?.data || error.message);
      }
    }

    return [];
  }

  async getTranslations(): Promise<BibleTranslation[]> {
    const translations = await this.translationRepository.find();
    if (translations.length > 0) {
      return translations;
    }

    return [
      { code: 'KJV', name: 'King James Version', language: 'en', apiId: null, isPublicDomain: true } as BibleTranslation,
      { code: 'WEB', name: 'World English Bible', language: 'en', apiId: null, isPublicDomain: true } as BibleTranslation,
    ];
  }

  async getBookMetadata(book: string) {
    const index = await this.loadBookMetadata();
    const normalized = this.normalizeBookKey(book);
    return index?.[normalized] || null;
  }

  async getHistoricalContext(book: string) {
    const index = await this.loadHistoricalContext();
    const normalized = this.normalizeBookKey(book);
    return index?.[normalized] || null;
  }

  async getCulturalContext(book: string) {
    const index = await this.loadCulturalContext();
    const normalized = this.normalizeBookKey(book);
    return index?.[normalized] || null;
  }

  async getTimeline(book: string) {
    const index = await this.loadTimeline();
    const normalized = this.normalizeBookKey(book);
    return index?.[normalized] || null;
  }

  async getGeography(book: string) {
    const index = await this.loadGeography();
    const normalized = this.normalizeBookKey(book);
    return index?.[normalized] || null;
  }

  private async fetchBibleApiPassage(reference: string, translationCode: string): Promise<any> {
    try {
      const response = await axios.get(`https://bible-api.com/${encodeURIComponent(reference)}`, {
        params: { translation: translationCode.toLowerCase() },
      });
      const data = response.data;
      return {
        reference: data.reference || reference,
        translation: data.translation_id || translationCode,
        verses: (data.verses || []).map((verse: any) => ({
          reference: verse.reference,
          text: verse.text,
        })),
      };
    } catch {
      return {
        reference,
        translation: translationCode,
        verses: [],
      };
    }
  }

  private async loadCrossReferences(): Promise<Map<string, string[]>> {
    if (this.crossReferenceIndex) {
      return this.crossReferenceIndex;
    }
    const path = this.configService.get('CROSS_REFERENCES_PATH') || resolve('data/cross-references-enhanced.txt');
    const index = new Map<string, string[]>();
    if (!path) {
      this.crossReferenceIndex = index;
      return index;
    }

    try {
      const content = await fs.readFile(path, 'utf-8');
      const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);
      console.log(`[CrossRef] Loading ${lines.length} lines from ${path}`);
      for (const line of lines) {
        const [source, target] = line.split(/\s+/);
        if (!source || !target) continue;
        const normalizedSource = this.normalizeVerseReference(source);
        const existing = index.get(normalizedSource) || [];
        existing.push(target);
        index.set(normalizedSource, existing);
        // Also store with original format
        const existingOrig = index.get(source) || [];
        existingOrig.push(target);
        index.set(source, existingOrig);
      }
      console.log(`[CrossRef] Loaded ${index.size} unique verse keys`);
    } catch (error) {
      console.error('[CrossRef] Failed to load cross references:', error);
    }

    this.crossReferenceIndex = index;
    return index;
  }

  private async loadWordStudyIndex(): Promise<Record<string, any>> {
    if (this.wordStudyIndex) {
      return this.wordStudyIndex;
    }
    const path = this.configService.get('WORD_STUDY_DATA_PATH') || resolve('data/strongs-word-study.json');

    try {
      const content = await fs.readFile(path, 'utf-8');
      this.wordStudyIndex = JSON.parse(content);
    } catch {
      this.wordStudyIndex = {};
    }

    return this.wordStudyIndex;
  }

  private async loadWordOccurrences(): Promise<Record<string, any>> {
    if (this.wordOccurrenceIndex) {
      return this.wordOccurrenceIndex;
    }
    const path = this.configService.get('WORD_OCCURRENCES_PATH') || resolve('data/word-occurrences.json');
    try {
      const content = await fs.readFile(path, 'utf-8');
      this.wordOccurrenceIndex = JSON.parse(content);
    } catch {
      this.wordOccurrenceIndex = {};
    }
    return this.wordOccurrenceIndex;
  }

  private async loadCrossReferenceCategories(): Promise<Record<string, string>> {
    if (this.crossReferenceCategoryIndex) {
      return this.crossReferenceCategoryIndex;
    }
    const path = this.configService.get('CROSS_REFERENCE_CATEGORIES_PATH')
      || resolve('data/cross-reference-categories.json');
    if (!path) {
      this.crossReferenceCategoryIndex = {};
      return this.crossReferenceCategoryIndex;
    }
    try {
      const content = await fs.readFile(path, 'utf-8');
      this.crossReferenceCategoryIndex = JSON.parse(content);
    } catch {
      this.crossReferenceCategoryIndex = {};
    }
    return this.crossReferenceCategoryIndex;
  }

  private async loadBookMetadata(): Promise<Record<string, any>> {
    if (this.bookMetadataIndex) {
      return this.bookMetadataIndex;
    }
    const path = this.configService.get('BOOK_METADATA_PATH') || resolve('data/book-metadata.json');
    if (!path) {
      this.bookMetadataIndex = {};
      return this.bookMetadataIndex;
    }
    try {
      const content = await fs.readFile(path, 'utf-8');
      this.bookMetadataIndex = JSON.parse(content);
    } catch {
      this.bookMetadataIndex = {};
    }
    return this.bookMetadataIndex;
  }

  private async loadHistoricalContext(): Promise<Record<string, any>> {
    if (this.historicalContextIndex) {
      return this.historicalContextIndex;
    }
    const path = this.configService.get('HISTORICAL_CONTEXT_PATH') || resolve('data/historical-context.json');
    if (!path) {
      this.historicalContextIndex = {};
      return this.historicalContextIndex;
    }
    try {
      const content = await fs.readFile(path, 'utf-8');
      this.historicalContextIndex = JSON.parse(content);
    } catch {
      this.historicalContextIndex = {};
    }
    return this.historicalContextIndex;
  }

  private async loadCulturalContext(): Promise<Record<string, any>> {
    if (this.culturalContextIndex) {
      return this.culturalContextIndex;
    }
    const path = this.configService.get('CULTURAL_CONTEXT_PATH') || resolve('data/cultural-context.json');
    if (!path) {
      this.culturalContextIndex = {};
      return this.culturalContextIndex;
    }
    try {
      const content = await fs.readFile(path, 'utf-8');
      this.culturalContextIndex = JSON.parse(content);
    } catch {
      this.culturalContextIndex = {};
    }
    return this.culturalContextIndex;
  }

  private async loadTimeline(): Promise<Record<string, any>> {
    if (this.timelineIndex) {
      return this.timelineIndex;
    }
    const path = this.configService.get('TIMELINE_PATH') || resolve('data/timeline.json');
    if (!path) {
      this.timelineIndex = {};
      return this.timelineIndex;
    }
    try {
      const content = await fs.readFile(path, 'utf-8');
      this.timelineIndex = JSON.parse(content);
    } catch {
      this.timelineIndex = {};
    }
    return this.timelineIndex;
  }

  private async loadGeography(): Promise<Record<string, any>> {
    if (this.geographyIndex) {
      return this.geographyIndex;
    }
    const path = this.configService.get('GEOGRAPHY_PATH') || resolve('data/geography.json');
    if (!path) {
      this.geographyIndex = {};
      return this.geographyIndex;
    }
    try {
      const content = await fs.readFile(path, 'utf-8');
      this.geographyIndex = JSON.parse(content);
    } catch {
      this.geographyIndex = {};
    }
    return this.geographyIndex;
  }

  private expandReference(reference: string, contextRange?: number) {
    if (!contextRange || contextRange <= 0) return reference;
    const match = reference.match(/^(.*?)\s+(\d+)(?::(\d+))?$/);
    if (!match) return reference;
    const book = match[1].trim();
    const chapter = Number(match[2]);
    const verse = match[3] ? Number(match[3]) : null;
    if (!verse) return reference;
    const start = Math.max(1, verse - contextRange);
    const end = verse + contextRange;
    return `${book} ${chapter}:${start}-${end}`;
  }

  private normalizeBookKey(book: string) {
    if (!book) return '';
    const cleaned = book.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.spanishBookKeyMap.get(cleaned) || cleaned;
  }

  private normalizeReferenceForApi(reference: string) {
    if (!reference) return reference;
    const cleaned = reference.trim();
    const match = cleaned.match(/^(.*?)\s+(\d+)(?::([\d\-–—]+))?$/);
    if (!match) return cleaned;
    const rawBook = match[1].trim();
    const chapter = match[2];
    const verses = match[3];
    const bookKey = rawBook.toLowerCase().replace(/[^a-z0-9]/g, '');
    const englishBook = this.spanishBookKeyMap.get(bookKey) || rawBook;
    const normalizedVerses = verses ? verses.replace(/[–—]/g, '-') : '';
    return normalizedVerses ? `${englishBook} ${chapter}:${normalizedVerses}` : `${englishBook} ${chapter}`;
  }

  private buildDistributionByBook(verses: string[]) {
    const counts: Record<string, number> = {};
    verses.forEach((verse) => {
      const match = verse.match(/^(.*?)\s+\d+/);
      const book = match ? match[1].trim() : null;
      if (!book) return;
      counts[book] = (counts[book] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([book, count]) => ({ book, count }))
      .sort((a, b) => b.count - a.count);
  }

  private safeJson(raw: string, fallback: any) {
    if (!raw) return fallback;
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const payload = fenced?.[1] || raw;
    const start = payload.indexOf('{');
    const end = payload.lastIndexOf('}');
    const jsonText = start !== -1 && end !== -1 ? payload.slice(start, end + 1) : payload;
    try {
      return JSON.parse(jsonText);
    } catch {
      return fallback;
    }
  }

  private normalizeVerseReference(reference: string): string {
    if (!reference) return reference;
    const cleaned = reference.replace(/\u2013|\u2014/g, '-').trim();
    if (!cleaned) return reference;
    
    // If already in dot format (Gen.1.1), just clean spaces
    if (cleaned.includes('.') && /\d/.test(cleaned)) {
      return cleaned.replace(/\s+/g, '');
    }
    
    // Parse "Book Chapter:Verse" or "Book Chapter" format
    const match = cleaned.match(/^(.*?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!match) {
      // Fallback: replace spaces and colons with dots
      return cleaned.replace(/\s+/g, '').replace(/:/g, '.');
    }
    
    const rawBook = match[1].trim();
    const chapter = match[2];
    const verse = match[3];
    const verseEnd = match[4];
    
    // Normalize book name using the map
    const normalizedBookKey = rawBook.toLowerCase().replace(/[^a-z0-9]/g, '');
    const book = this.verseBookMap.get(normalizedBookKey) || rawBook.replace(/\s+/g, '');
    
    // Build reference in dot format
    if (verseEnd) {
      return `${book}.${chapter}.${verse}-${book}.${chapter}.${verseEnd}`;
    } else if (verse) {
      return `${book}.${chapter}.${verse}`;
    } else {
      return `${book}.${chapter}`;
    }
  }
}
