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
    const rawReference = (reference || '').trim();
    const lookupReference = this.normalizeReferenceForLookup(rawReference);
    const normalizedReference = this.normalizeReferenceForApi(lookupReference);
    const requestedTranslation = (translationCode || 'KJV').trim().toUpperCase();
    const requiresApiBible = ['RVR1960', 'RVR60', 'NBLA', 'NVI'].includes(requestedTranslation);

    if ((!apiKey || !apiUrl) && requiresApiBible) {
      return {
        reference: lookupReference || normalizedReference,
        translation: requestedTranslation,
        verses: [],
        error: `Translation ${requestedTranslation} requires API.Bible. Configure BIBLE_API_KEY to fetch Spanish passages without fallback.`,
      };
    }

    if (apiKey && apiUrl) {
      try {
        const translation = await this.resolveTranslationForApi(requestedTranslation);

        if (translation?.apiId) {
          // Use API.Bible passages endpoint
          const passageId = convertToApiBiblePassageId(normalizedReference);
          
          // Check cache first
          const cached = await this.cacheService.getPassage(translation.apiId, passageId);
          if (cached && Array.isArray(cached?.verses) && cached.verses.length > 0) {
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
          const formatted = formatApiBibleResponse(response.data, lookupReference || reference, requestedTranslation);
          
          // Cache only non-empty results to avoid stale empty payloads being reused.
          if (Array.isArray(formatted?.verses) && formatted.verses.length > 0) {
            await this.cacheService.setPassage(translation.apiId, passageId, formatted);
          }
          
          return formatted;
        }
      } catch (error) {
        console.error('[Scripture] API.Bible error:', error.response?.data || error.message);
        return this.fetchBibleApiPassage(lookupReference, requestedTranslation, normalizedReference);
      }
    }

    return this.fetchBibleApiPassage(lookupReference, requestedTranslation, normalizedReference);
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

    const lookupKeys = this.buildCrossReferenceLookupKeys(verseReference, normalized);
    const merged = new Set<string>();
    for (const key of lookupKeys) {
      const entries = index.get(key) || [];
      for (const entry of entries) merged.add(entry);
    }

    const results = Array.from(merged);
    console.log(`[CrossRef] Lookup keys tried: ${lookupKeys.join(', ') || '(none)'}`);
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

  async getWordStudy(word: string, language: string, responseLanguage: string = 'en'): Promise<any> {
    const index = await this.loadWordStudyIndex();
    const occurrences = await this.loadWordOccurrences();
    const key = word.toLowerCase();
    const entry = index?.[key];
    const occurrenceEntry = occurrences?.[key];
    const distributionByBook = this.buildDistributionByBook(occurrenceEntry?.verses || []);
    const targetLanguage = this.resolveResponseLanguage(responseLanguage);
    const cached = await this.cacheService.getWordStudy(word, language, targetLanguage);
    if (cached) {
      return cached;
    }
    if (entry) {
      const originalScript = this.resolveOriginalScript(entry?.lemma || key, word, language);
      const transliteration = this.resolveTransliteration(
        entry.transliteration || '',
        entry.lemma || key,
        word,
        language,
      );
      const baseResult = {
        word,
        language,
        lemma: entry.lemma || key,
        originalScript,
        transliteration,
        definition: entry.definition || null,
        usageCount: occurrenceEntry?.count || entry.usageCount || null,
        examples: entry.examples || entry.verseExamples || occurrenceEntry?.verses || [],
        strongs: entry.strongs || null,
        partOfSpeech: entry.partOfSpeech || null,
        verseOccurrences: occurrenceEntry?.verses || [],
        distributionByBook,
      };
      const localized = this.localizeWordStudyResult(baseResult, targetLanguage);
      await this.cacheService.setWordStudy(word, language, targetLanguage, localized);
      return localized;
    }

    const fallbackResult = {
      word,
      language,
      lemma: word.toLowerCase(),
      originalScript: this.resolveOriginalScript(word.toLowerCase(), word, language),
      transliteration: this.resolveTransliteration('', word.toLowerCase(), word, language),
      definition: null,
      usageCount: occurrenceEntry?.count || null,
      examples: occurrenceEntry?.verses || [],
      strongs: null,
      partOfSpeech: null,
      verseOccurrences: occurrenceEntry?.verses || [],
      distributionByBook,
    };
    const localizedFallback = this.localizeWordStudyResult(fallbackResult, targetLanguage);
    await this.cacheService.setWordStudy(word, language, targetLanguage, localizedFallback);
    return localizedFallback;
  }

  async getWordStudyInsights(word: string, language: string, context?: string, responseLanguage: string = 'en') {
    const targetLanguage = this.resolveResponseLanguage(responseLanguage);
    const normalizedContext = String(context || '').trim();
    const cached = await this.cacheService.getWordStudyInsights(word, language, normalizedContext, targetLanguage);
    if (cached) {
      return cached;
    }
    const outputLanguageLabel = targetLanguage === 'es' ? 'Spanish' : 'English';
    const prompt = `Provide advanced word study insights as JSON only.

Word: ${word}
Language: ${language}
Context: ${context || 'N/A'}
Output Language: ${outputLanguageLabel}

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
- All human-readable values must be written in ${outputLanguageLabel}.
- No markdown, no extra commentary.`;
    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.4,
      maxTokens: 700,
    });
    this.logWordStudyLlmOutput('word-study-insights', response);
    const parsed = this.safeJson(response, { raw: response });
    const index = await this.loadWordStudyIndex();
    const wordKey = String(word || '').toLowerCase();
    const partOfSpeech = String(index?.[wordKey]?.partOfSpeech || '').trim();
    if (targetLanguage !== 'es') {
      const ensured = this.ensureGrammarInsights(parsed, partOfSpeech, targetLanguage);
      await this.cacheService.setWordStudyInsights(word, language, normalizedContext, targetLanguage, ensured);
      return ensured;
    }
    const localized = await this.localizeWordStudyInsights(parsed, targetLanguage);
    const ensuredLocalized = this.ensureGrammarInsights(localized, partOfSpeech, targetLanguage);
    await this.cacheService.setWordStudyInsights(word, language, normalizedContext, targetLanguage, ensuredLocalized);
    return ensuredLocalized;
  }

  async getWordStudySuggestions(
    reference: string,
    translationCode: string = 'KJV',
    language: string = 'greek',
    responseLanguage: string = 'en',
  ): Promise<Array<{ term: string; transliteration?: string; gloss?: string; reason?: string; language: string }>> {
    const targetLanguage = this.resolveResponseLanguage(responseLanguage);
    const cached = await this.cacheService.getWordStudySuggestions(
      reference,
      translationCode,
      language,
      targetLanguage,
    );
    if (cached) {
      return cached as Array<{ term: string; transliteration?: string; gloss?: string; reason?: string; language: string }>;
    }

    const passage = await this.getPassage(reference, translationCode);
    const passageText = this.getPassageText(passage);
    if (!passageText) {
      console.warn(
        `[WordStudySuggestions] Empty passage text for reference="${reference}" translation="${translationCode}"`,
      );
      return [];
    }

    const sourceLanguage = String(language || 'greek').toLowerCase();
    const outputLanguageLabel = targetLanguage === 'es' ? 'Spanish' : 'English';
    const sourceLanguageLabel = sourceLanguage === 'hebrew' ? 'Hebrew' : sourceLanguage === 'aramaic' ? 'Aramaic' : 'Greek';

    const prompt = `Extract the most important ${sourceLanguageLabel} study words for this Bible passage.

Reference: ${reference}
Passage Text:
${passageText.slice(0, 2600)}
Output language for gloss/reason: ${outputLanguageLabel}

Return JSON only:
[
  {
    "term": "string",
    "transliteration": "string",
    "gloss": "string",
    "reason": "short reason this term matters for interpreting the passage",
    "language": "${sourceLanguage}"
  }
]

Rules:
- Return 5-8 terms max.
- Prioritize doctrinally central and structurally central terms.
- Do not return duplicates.
- No markdown, no commentary.`;

    try {
      const response = await this.llmService.generateCompletion(prompt, 'system', {
        temperature: 0.2,
        maxTokens: 700,
      });
      this.logWordStudyLlmOutput('word-study-suggestions', response);
      const parsed = this.safeJson(response, []);
      if (!Array.isArray(parsed)) return [];
      const normalized = parsed
        .map((item: any) => ({
          term: String(item?.term || '').trim(),
          transliteration: String(item?.transliteration || '').trim(),
          gloss: String(item?.gloss || '').trim(),
          reason: String(item?.reason || '').trim(),
          language: sourceLanguage,
        }))
        .filter((item: any) => item.term)
        .slice(0, 8);
      await this.cacheService.setWordStudySuggestions(
        reference,
        translationCode,
        language,
        targetLanguage,
        normalized,
      );
      return normalized;
    } catch (error) {
      console.error('[WordStudySuggestions] Failed:', error?.message || error);
      return [];
    }
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

  private async fetchBibleApiPassage(reference: string, translationCode: string, alternateReference?: string): Promise<any> {
    const fallbackCodes = this.getFallbackTranslationCodes(translationCode);
    const references = Array.from(
      new Set(
        [reference, alternateReference]
          .filter((item): item is string => Boolean(item && item.trim()))
          .map((item) => item.trim()),
      ),
    );

    for (const ref of references) {
      for (const code of fallbackCodes) {
        try {
          const response = await axios.get(`https://bible-api.com/${encodeURIComponent(ref)}`, {
            params: { translation: code },
          });
          const data = response.data;
          const verses = (data.verses || []).map((verse: any) => ({
            reference: verse.reference || `${verse.book_name} ${verse.chapter}:${verse.verse}`,
            text: verse.text,
          }));

          if (verses.length > 0) {
            return {
              reference: data.reference || ref,
              translation: data.translation_id || translationCode,
              verses,
            };
          }
        } catch {
          // Try the next translation/reference combination.
        }
      }
    }

    return {
      reference,
      translation: translationCode,
      verses: [],
      error: `No verses found for ${translationCode}. Fallback provider could not resolve this translation for the requested reference.`,
    };
  }

  private async resolveTranslationForApi(requestedCode: string): Promise<BibleTranslation | null> {
    const translation = await this.translationRepository.findOne({ where: { code: requestedCode } });
    if (translation?.apiId) {
      return translation;
    }
    return null;
  }

  private getFallbackTranslationCodes(translationCode: string): string[] {
    const code = (translationCode || 'KJV').trim().toUpperCase();
    const map: Record<string, string[]> = {
      RVR1960: ['rvr1960', 'rvr'],
      RVR60: ['rvr1960', 'rvr'],
      NBLA: ['nbla'],
      NVI: ['nvi'],
    };
    return map[code] || [code.toLowerCase()];
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
    const objectStart = payload.indexOf('{');
    const objectEnd = payload.lastIndexOf('}');
    const arrayStart = payload.indexOf('[');
    const arrayEnd = payload.lastIndexOf(']');

    let jsonText = payload;
    if (arrayStart !== -1 && arrayEnd !== -1 && (objectStart === -1 || arrayStart < objectStart)) {
      jsonText = payload.slice(arrayStart, arrayEnd + 1);
    } else if (objectStart !== -1 && objectEnd !== -1) {
      jsonText = payload.slice(objectStart, objectEnd + 1);
    }

    try {
      return JSON.parse(jsonText);
    } catch {
      return fallback;
    }
  }

  private async localizeWordStudyResult(result: any, targetLanguage: string): Promise<any> {
    if (targetLanguage !== 'es') {
      return result;
    }
    const definition = typeof result?.definition === 'string' ? result.definition : '';
    const partOfSpeech = typeof result?.partOfSpeech === 'string' ? result.partOfSpeech : '';
    const examples = Array.isArray(result?.examples) ? result.examples : [];

    if (!definition && !partOfSpeech && examples.length === 0) {
      return result;
    }

    try {
      const translatedDefinition = definition
        ? await this.translateTextToSpanish(definition)
        : result?.definition;
      const translatedPartOfSpeech = partOfSpeech
        ? await this.translateTextToSpanish(partOfSpeech)
        : result?.partOfSpeech;
      const translatedExamples = examples.length
        ? await Promise.all(
            examples.map(async (example: string) => {
              // Keep raw verse references unchanged.
              if (this.looksLikeVerseReference(example)) return example;
              return this.translateTextToSpanish(example);
            }),
          )
        : result?.examples;

      return {
        ...result,
        definition: translatedDefinition ?? result.definition,
        partOfSpeech: translatedPartOfSpeech ?? result.partOfSpeech,
        examples: Array.isArray(translatedExamples) ? translatedExamples : result.examples,
      };
    } catch {
      return result;
    }
  }

  private async localizeWordStudyInsights(insights: any, targetLanguage: string): Promise<any> {
    if (targetLanguage !== 'es') {
      return insights;
    }
    if (!insights || typeof insights !== 'object' || Array.isArray(insights)) {
      return insights;
    }

    try {
      const localized: any = { ...insights };
      if (typeof localized.rootWord === 'string') {
        localized.rootWord = await this.translateTextToSpanish(localized.rootWord);
      }
      if (Array.isArray(localized.semanticRange)) {
        localized.semanticRange = await Promise.all(
          localized.semanticRange.map((item: string) => this.translateTextToSpanish(String(item))),
        );
      }
      if (localized.grammarInsights && typeof localized.grammarInsights === 'object') {
        const translatedGrammar: Record<string, any> = {};
        for (const [key, value] of Object.entries(localized.grammarInsights)) {
          if (typeof value === 'string') {
            translatedGrammar[key] = await this.translateTextToSpanish(value);
          } else {
            translatedGrammar[key] = value;
          }
        }
        localized.grammarInsights = translatedGrammar;
      }
      if (Array.isArray(localized.nuanceNotes)) {
        localized.nuanceNotes = await Promise.all(
          localized.nuanceNotes.map((item: string) => this.translateTextToSpanish(String(item))),
        );
      }
      if (Array.isArray(localized.commonTranslations)) {
        localized.commonTranslations = await Promise.all(
          localized.commonTranslations.map((item: string) => this.translateTextToSpanish(String(item))),
        );
      }
      // exampleReferences are references and should remain unchanged
      return localized;
    } catch {
      return insights;
    }
  }

  private looksLikeVerseReference(value: string): boolean {
    if (!value) return false;
    return /[A-Za-zÁÉÍÓÚáéíóúñÑ]+\s+\d+:\d+/.test(value) || /^[A-Z0-9]{2,5}\.\d+\.\d+/.test(value);
  }

  private async translateTextToSpanish(text: string): Promise<string> {
    const input = String(text || '').trim();
    if (!input) return input;
    const prompt = `Translate to Spanish.

Rules:
- Keep Greek/Hebrew words, Strong's identifiers, and Bible references unchanged.
- Return only the translated text, no quotes, no markdown.

Text:
${input}`;
    try {
      const response = await this.llmService.generateCompletion(prompt, 'system', {
        temperature: 0.1,
        maxTokens: 220,
      });
      this.logWordStudyLlmOutput('word-study-translate', response);
      const normalized = String(response || '').trim();
      return normalized || input;
    } catch {
      return input;
    }
  }

  private ensureGrammarInsights(payload: any, partOfSpeech: string, targetLanguage: 'en' | 'es'): any {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return payload;
    }

    const grammar = payload.grammarInsights && typeof payload.grammarInsights === 'object'
      ? { ...payload.grammarInsights }
      : {};

    const isNoun = /noun|sustantivo/i.test(partOfSpeech || '');
    const notApplicable = targetLanguage === 'es' ? 'No aplica (sustantivo)' : 'Not applicable (noun)';
    const unknown = targetLanguage === 'es' ? 'No especificado' : 'Not specified';

    const normalized = {
      tense: this.normalizeGrammarValue(grammar.tense, isNoun ? notApplicable : unknown),
      voice: this.normalizeGrammarValue(grammar.voice, isNoun ? notApplicable : unknown),
      mood: this.normalizeGrammarValue(grammar.mood, isNoun ? notApplicable : unknown),
      case: this.normalizeGrammarValue(grammar.case, unknown),
      number: this.normalizeGrammarValue(grammar.number, unknown),
      gender: this.normalizeGrammarValue(grammar.gender, unknown),
      notes: this.normalizeGrammarValue(grammar.notes, unknown),
    };

    return {
      ...payload,
      grammarInsights: normalized,
    };
  }

  private normalizeGrammarValue(value: any, fallback: string): string {
    const normalized = String(value ?? '').trim();
    if (!normalized || normalized.toLowerCase() === 'n/a') {
      return fallback;
    }
    return normalized;
  }

  private logWordStudyLlmOutput(tag: string, output: string): void {
    if (process.env.LOG_LLM_REQUESTS === 'true' || process.env.LOG_WORD_STUDY_LLM === 'true') {
      console.log(`[LLM ${tag}]`, String(output || '').slice(0, 2000));
    }
  }

  private resolveResponseLanguage(value?: string): 'en' | 'es' {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return 'en';
    if (
      normalized.startsWith('es') ||
      normalized.includes('spanish') ||
      normalized.includes('espanol') ||
      normalized.includes('español')
    ) {
      return 'es';
    }
    return 'en';
  }

  private resolveOriginalScript(lemma: string, word: string, language: string): string | null {
    const normalizedLanguage = String(language || '').toLowerCase();
    const lemmaValue = String(lemma || '').trim();
    const wordValue = String(word || '').trim();
    const source = lemmaValue || wordValue;
    if (!source) return null;

    if (normalizedLanguage === 'greek') {
      if (this.containsGreek(source)) return source;
      if (this.containsGreek(wordValue)) return wordValue;
      return this.transliterateLatinToGreekApprox(source);
    }

    return null;
  }

  private resolveTransliteration(
    current: string,
    lemma: string,
    word: string,
    language: string,
  ): string {
    const existing = String(current || '').trim();
    if (existing && existing !== word) {
      return existing;
    }

    const normalizedLanguage = String(language || '').toLowerCase();
    const seed = String(lemma || word || '').trim();
    if (!seed) return existing || word;

    if (normalizedLanguage === 'greek' || this.containsGreek(seed)) {
      const greekSource = this.containsGreek(seed) ? seed : String(word || '');
      const transliterated = this.transliterateGreekToLatin(greekSource);
      return transliterated || existing || word;
    }

    return existing || word;
  }

  private containsGreek(value: string): boolean {
    return /[\u0370-\u03FF\u1F00-\u1FFF]/.test(String(value || ''));
  }

  private transliterateGreekToLatin(value: string): string {
    const map: Record<string, string> = {
      α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'e', θ: 'th',
      ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', π: 'p',
      ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'u', φ: 'ph', χ: 'ch', ψ: 'ps',
      ω: 'o', Α: 'A', Β: 'B', Γ: 'G', Δ: 'D', Ε: 'E', Ζ: 'Z', Η: 'E',
      Θ: 'Th', Ι: 'I', Κ: 'K', Λ: 'L', Μ: 'M', Ν: 'N', Ξ: 'X', Ο: 'O',
      Π: 'P', Ρ: 'R', Σ: 'S', Τ: 'T', Υ: 'U', Φ: 'Ph', Χ: 'Ch', Ψ: 'Ps', Ω: 'O',
      ά: 'a', έ: 'e', ή: 'e', ί: 'i', ό: 'o', ύ: 'u', ώ: 'o',
      ϊ: 'i', ϋ: 'u', ΐ: 'i', ΰ: 'u',
      ἀ: 'a', ἁ: 'ha', ἄ: 'a', ἅ: 'ha', ἆ: 'a', ἇ: 'ha',
      ἐ: 'e', ἑ: 'he', ἔ: 'e', ἕ: 'he',
      ἠ: 'e', ἡ: 'he', ἤ: 'e', ἥ: 'he', ἦ: 'e', ἧ: 'he',
      ἰ: 'i', ἱ: 'hi', ἴ: 'i', ἵ: 'hi', ἶ: 'i', ἷ: 'hi',
      ὀ: 'o', ὁ: 'ho', ὄ: 'o', ὅ: 'ho',
      ὐ: 'u', ὑ: 'hu', ὔ: 'u', ὕ: 'hu', ὖ: 'u', ὗ: 'hu',
      ὠ: 'o', ὡ: 'ho', ὤ: 'o', ὥ: 'ho', ὦ: 'o', ὧ: 'ho',
    };

    const source = String(value || '').trim();
    if (!source) return '';

    const normalized = source.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let out = '';
    for (let i = 0; i < normalized.length; i++) {
      const ch = normalized[i];
      const next = normalized[i + 1];
      const digraph = `${ch}${next || ''}`;
      const lowerDigraph = digraph.toLowerCase();
      if (lowerDigraph === 'αι') { out += ch === ch.toUpperCase() ? 'Ai' : 'ai'; i++; continue; }
      if (lowerDigraph === 'ει') { out += ch === ch.toUpperCase() ? 'Ei' : 'ei'; i++; continue; }
      if (lowerDigraph === 'οι') { out += ch === ch.toUpperCase() ? 'Oi' : 'oi'; i++; continue; }
      if (lowerDigraph === 'ου') { out += ch === ch.toUpperCase() ? 'Ou' : 'ou'; i++; continue; }
      if (lowerDigraph === 'υι') { out += ch === ch.toUpperCase() ? 'Ui' : 'ui'; i++; continue; }
      if (lowerDigraph === 'ευ') { out += ch === ch.toUpperCase() ? 'Eu' : 'eu'; i++; continue; }
      if (lowerDigraph === 'αυ') { out += ch === ch.toUpperCase() ? 'Au' : 'au'; i++; continue; }

      out += map[ch] ?? ch;
    }

    return out.trim();
  }

  private transliterateLatinToGreekApprox(value: string): string {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';

    // Keep letters only for transliteration heuristics.
    const source = raw.replace(/[^a-z]/g, '');
    if (!source) return '';

    let result = '';
    let i = 0;
    while (i < source.length) {
      const pair = source.slice(i, i + 2);
      const tri = source.slice(i, i + 3);

      if (tri === 'psa' || pair === 'ps') { result += 'ψ'; i += 2; continue; }
      if (pair === 'ph') { result += 'φ'; i += 2; continue; }
      if (pair === 'th') { result += 'θ'; i += 2; continue; }
      if (pair === 'ch') { result += 'χ'; i += 2; continue; }
      if (pair === 'ou') { result += 'ου'; i += 2; continue; }
      if (pair === 'ei') { result += 'ει'; i += 2; continue; }
      if (pair === 'oi') { result += 'οι'; i += 2; continue; }
      if (pair === 'ai') { result += 'αι'; i += 2; continue; }

      const ch = source[i];
      const mapped: Record<string, string> = {
        a: 'α', b: 'β', c: 'κ', d: 'δ', e: 'ε', f: 'φ', g: 'γ', h: 'η',
        i: 'ι', j: 'ι', k: 'κ', l: 'λ', m: 'μ', n: 'ν', o: 'ο', p: 'π',
        q: 'κ', r: 'ρ', s: 'σ', t: 'τ', u: 'υ', v: 'β', w: 'ω', x: 'ξ',
        y: 'υ', z: 'ζ',
      };
      result += mapped[ch] ?? ch;
      i += 1;
    }

    // Prefer final sigma at end.
    result = result.replace(/σ$/g, 'ς');
    return result;
  }

  private normalizeReferenceForLookup(reference: string): string {
    const value = String(reference || '').trim().replace(/\u2013|\u2014/g, '-');
    if (!value) return value;

    // Already standard "Book 1:1-2"
    if (/\s+\d+(?::\d+(?:-\d+)?)?$/.test(value)) {
      return value;
    }

    // Dot formats in cross-reference dataset, e.g. Ps.4.3 or Isa.2.3-Isa.2.5
    const dottedSingle = value.match(/^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)$/);
    const dottedRange = value.match(/^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)-([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)$/);

    const bookMap: Record<string, string> = {
      Gen: 'Genesis',
      Exod: 'Exodus',
      Lev: 'Leviticus',
      Num: 'Numbers',
      Deut: 'Deuteronomy',
      Josh: 'Joshua',
      Judg: 'Judges',
      Ruth: 'Ruth',
      '1Sam': '1 Samuel',
      '2Sam': '2 Samuel',
      '1Kgs': '1 Kings',
      '2Kgs': '2 Kings',
      '1Chr': '1 Chronicles',
      '2Chr': '2 Chronicles',
      Ezra: 'Ezra',
      Neh: 'Nehemiah',
      Esth: 'Esther',
      Job: 'Job',
      Ps: 'Psalms',
      Prov: 'Proverbs',
      Eccl: 'Ecclesiastes',
      Song: 'Song of Songs',
      Isa: 'Isaiah',
      Jer: 'Jeremiah',
      Lam: 'Lamentations',
      Ezek: 'Ezekiel',
      Dan: 'Daniel',
      Hos: 'Hosea',
      Joel: 'Joel',
      Amos: 'Amos',
      Obad: 'Obadiah',
      Jonah: 'Jonah',
      Mic: 'Micah',
      Nah: 'Nahum',
      Hab: 'Habakkuk',
      Zeph: 'Zephaniah',
      Hag: 'Haggai',
      Zech: 'Zechariah',
      Mal: 'Malachi',
      Matt: 'Matthew',
      Mark: 'Mark',
      Luke: 'Luke',
      John: 'John',
      Acts: 'Acts',
      Rom: 'Romans',
      '1Cor': '1 Corinthians',
      '2Cor': '2 Corinthians',
      Gal: 'Galatians',
      Eph: 'Ephesians',
      Phil: 'Philippians',
      Col: 'Colossians',
      '1Thess': '1 Thessalonians',
      '2Thess': '2 Thessalonians',
      '1Tim': '1 Timothy',
      '2Tim': '2 Timothy',
      Titus: 'Titus',
      Phlm: 'Philemon',
      Heb: 'Hebrews',
      Jas: 'James',
      '1Pet': '1 Peter',
      '2Pet': '2 Peter',
      '1John': '1 John',
      '2John': '2 John',
      '3John': '3 John',
      Jude: 'Jude',
      Rev: 'Revelation',
    };

    if (dottedSingle) {
      const [, bookAbbr, chapter, verse] = dottedSingle;
      const book = bookMap[bookAbbr] || bookAbbr;
      return `${book} ${chapter}:${verse}`;
    }

    if (dottedRange) {
      const [, startBook, startChapter, startVerse, endBook, endChapter, endVerse] = dottedRange;
      const startBookName = bookMap[startBook] || startBook;
      const endBookName = bookMap[endBook] || endBook;
      if (startBook === endBook && startChapter === endChapter) {
        return `${startBookName} ${startChapter}:${startVerse}-${endVerse}`;
      }
      return `${startBookName} ${startChapter}:${startVerse}-${endBookName} ${endChapter}:${endVerse}`;
    }

    return value;
  }

  private getPassageText(passage: any): string {
    if (!Array.isArray(passage?.verses)) return '';
    return passage.verses.map((verse: any) => String(verse?.text || '')).join(' ').trim();
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

  private buildCrossReferenceLookupKeys(rawReference: string, normalizedReference: string): string[] {
    const keys = new Set<string>();
    const raw = String(rawReference || '').trim();
    const normalized = String(normalizedReference || '').trim();
    if (raw) keys.add(raw);
    if (normalized) keys.add(normalized);

    // If range (e.g. Eph.2.1-Eph.2.10), also query each verse key and the range start.
    const rangeMatch = normalized.match(/^([A-Za-z0-9]+)\.(\d+)\.(\d+)-([A-Za-z0-9]+)\.(\d+)\.(\d+)$/);
    if (rangeMatch) {
      const startBook = rangeMatch[1];
      const startChapter = Number(rangeMatch[2]);
      const startVerse = Number(rangeMatch[3]);
      const endBook = rangeMatch[4];
      const endChapter = Number(rangeMatch[5]);
      const endVerse = Number(rangeMatch[6]);

      // Only expand straightforward single-book/single-chapter ranges.
      if (
        startBook === endBook &&
        Number.isFinite(startChapter) &&
        Number.isFinite(startVerse) &&
        Number.isFinite(endChapter) &&
        Number.isFinite(endVerse) &&
        startChapter === endChapter &&
        endVerse >= startVerse &&
        endVerse - startVerse <= 60
      ) {
        for (let v = startVerse; v <= endVerse; v += 1) {
          keys.add(`${startBook}.${startChapter}.${v}`);
        }
      }
      keys.add(`${startBook}.${startChapter}.${startVerse}`);
      keys.add(`${startBook}.${startChapter}`);
    }

    // If single verse, also try chapter key.
    const singleVerseMatch = normalized.match(/^([A-Za-z0-9]+)\.(\d+)\.(\d+)$/);
    if (singleVerseMatch) {
      keys.add(`${singleVerseMatch[1]}.${singleVerseMatch[2]}`);
    }

    return Array.from(keys);
  }
}
