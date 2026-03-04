import { Injectable } from '@nestjs/common';

export interface EnhancedTranslationComparison {
  reference: string;
  translations: TranslationText[];
  keyDifferences: KeyDifference[];
  analysis: ComparisonAnalysis;
}

export interface TranslationText {
  code: string;
  name: string;
  text: string;
  type: 'formal' | 'dynamic' | 'paraphrase';
}

export interface KeyDifference {
  category: 'verb' | 'theological_term' | 'literal_vs_dynamic' | 'textual_variant';
  translations: string[];
  difference: string;
  explanation: string;
  significance: 'high' | 'medium' | 'low';
}

export interface ComparisonAnalysis {
  verbDifferences: string[];
  theologicalTermDifferences: string[];
  literalVsDynamic: string[];
  overallAssessment: string;
}

@Injectable()
export class TranslationComparisonEnhancedService {
  private comparisonIndex: Map<string, EnhancedTranslationComparison> = new Map();

  constructor() {
    this.initializeComparisonData();
  }

  getEnhancedComparison(reference: string): EnhancedTranslationComparison | null {
    const normalized = this.normalizeReference(reference);
    return this.comparisonIndex.get(normalized) || null;
  }

  private normalizeReference(ref: string): string {
    return ref.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private initializeComparisonData() {
    // John 3:16 - Famous verse with key differences
    this.comparisonIndex.set('john 3:16', {
      reference: 'John 3:16',
      translations: [
        {
          code: 'KJV',
          name: 'King James Version',
          text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
          type: 'formal'
        },
        {
          code: 'NIV',
          name: 'New International Version',
          text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
          type: 'dynamic'
        },
        {
          code: 'NASB',
          name: 'New American Standard Bible',
          text: 'For God so loved the world, that He gave His only begotten Son, that whoever believes in Him shall not perish, but have eternal life.',
          type: 'formal'
        }
      ],
      keyDifferences: [
        {
          category: 'theological_term',
          translations: ['KJV: only begotten', 'NIV: one and only', 'NASB: only begotten'],
          difference: 'Greek "monogenēs" translated differently',
          explanation: 'KJV/NASB use "only begotten" emphasizing unique generation; NIV uses "one and only" emphasizing uniqueness without generation language',
          significance: 'medium'
        },
        {
          category: 'verb',
          translations: ['KJV: should not perish', 'NIV/NASB: shall not perish'],
          difference: 'Modal verb choice',
          explanation: 'KJV "should" is older English; modern "shall" expresses certainty',
          significance: 'low'
        }
      ],
      analysis: {
        verbDifferences: ['believeth vs. believes (archaic vs. modern)'],
        theologicalTermDifferences: ['only begotten vs. one and only (monogenēs)'],
        literalVsDynamic: ['KJV/NASB more literal; NIV more dynamic in phrasing'],
        overallAssessment: 'Core meaning preserved across translations; main difference is "only begotten" vs "one and only"'
      }
    });

    // Romans 3:23 - Sin and glory
    this.comparisonIndex.set('romans 3:23', {
      reference: 'Romans 3:23',
      translations: [
        {
          code: 'KJV',
          name: 'King James Version',
          text: 'For all have sinned, and come short of the glory of God',
          type: 'formal'
        },
        {
          code: 'NIV',
          name: 'New International Version',
          text: 'for all have sinned and fall short of the glory of God',
          type: 'dynamic'
        },
        {
          code: 'ESV',
          name: 'English Standard Version',
          text: 'for all have sinned and fall short of the glory of God',
          type: 'formal'
        }
      ],
      keyDifferences: [
        {
          category: 'verb',
          translations: ['KJV: come short', 'NIV/ESV: fall short'],
          difference: 'Verb tense and phrasing',
          explanation: 'Greek "husterountai" (present tense) - KJV uses older "come short"; modern versions use "fall short" maintaining present tense',
          significance: 'low'
        }
      ],
      analysis: {
        verbDifferences: ['come short vs. fall short (same meaning, modern phrasing)'],
        theologicalTermDifferences: [],
        literalVsDynamic: ['Minimal difference; all fairly literal'],
        overallAssessment: 'Virtually identical meaning; only stylistic differences'
      }
    });

    // Hebrews 4:9 - Sabbath rest
    this.comparisonIndex.set('hebrews 4:9', {
      reference: 'Hebrews 4:9',
      translations: [
        {
          code: 'KJV',
          name: 'King James Version',
          text: 'There remaineth therefore a rest to the people of God.',
          type: 'formal'
        },
        {
          code: 'NIV',
          name: 'New International Version',
          text: 'There remains, then, a Sabbath-rest for the people of God',
          type: 'dynamic'
        },
        {
          code: 'NASB',
          name: 'New American Standard Bible',
          text: 'So there remains a Sabbath rest for the people of God.',
          type: 'formal'
        }
      ],
      keyDifferences: [
        {
          category: 'theological_term',
          translations: ['KJV: rest', 'NIV: Sabbath-rest', 'NASB: Sabbath rest'],
          difference: 'Greek "sabbatismos" (Sabbath-keeping) vs. generic "rest"',
          explanation: 'KJV obscures the specific Greek word for Sabbath-keeping; NIV/NASB preserve the Sabbath connection',
          significance: 'high'
        }
      ],
      analysis: {
        verbDifferences: [],
        theologicalTermDifferences: ['sabbatismos: KJV "rest" vs. NIV/NASB "Sabbath rest" - significant theological difference'],
        literalVsDynamic: ['NIV/NASB more literal to Greek; KJV less specific'],
        overallAssessment: 'Significant difference: KJV loses Sabbath connection; NIV/NASB preserve it'
      }
    });

    // Daniel 8:14 - Sanctuary cleansing
    this.comparisonIndex.set('daniel 8:14', {
      reference: 'Daniel 8:14',
      translations: [
        {
          code: 'KJV',
          name: 'King James Version',
          text: 'And he said unto me, Unto two thousand and three hundred days; then shall the sanctuary be cleansed.',
          type: 'formal'
        },
        {
          code: 'NIV',
          name: 'New International Version',
          text: 'He said to me, "It will take 2,300 evenings and mornings; then the sanctuary will be reconsecrated."',
          type: 'dynamic'
        },
        {
          code: 'NASB',
          name: 'New American Standard Bible',
          text: 'He said to me, "For 2,300 evenings and mornings; then the holy place will be properly restored."',
          type: 'formal'
        }
      ],
      keyDifferences: [
        {
          category: 'theological_term',
          translations: ['KJV: cleansed', 'NIV: reconsecrated', 'NASB: properly restored'],
          difference: 'Hebrew "tsadaq" (Niphal) translated differently',
          explanation: 'KJV "cleansed" connects to Day of Atonement; NIV "reconsecrated" emphasizes restoration; NASB "properly restored" emphasizes vindication',
          significance: 'high'
        },
        {
          category: 'literal_vs_dynamic',
          translations: ['KJV: days', 'NIV/NASB: evenings and mornings'],
          difference: 'Hebrew "erev boqer" (evening morning)',
          explanation: 'NIV/NASB more literal to Hebrew; KJV interprets as "days"',
          significance: 'medium'
        }
      ],
      analysis: {
        verbDifferences: [],
        theologicalTermDifferences: [
          'tsadaq: cleansed vs. reconsecrated vs. restored - affects interpretation',
          'erev boqer: days vs. evenings and mornings - affects prophetic calculation'
        ],
        literalVsDynamic: ['NIV/NASB more literal to Hebrew text; KJV more interpretive'],
        overallAssessment: 'Significant differences affecting prophetic interpretation; KJV favored by SDA for "cleansed" and Day of Atonement connection'
      }
    });
  }

  highlightDifferences(text1: string, text2: string): { text1Highlights: string[]; text2Highlights: string[] } {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const text1Highlights: string[] = [];
    const text2Highlights: string[] = [];

    // Simple word-by-word comparison
    const maxLength = Math.max(words1.length, words2.length);
    for (let i = 0; i < maxLength; i++) {
      if (words1[i] !== words2[i]) {
        if (words1[i]) text1Highlights.push(words1[i]);
        if (words2[i]) text2Highlights.push(words2[i]);
      }
    }

    return { text1Highlights, text2Highlights };
  }
}
