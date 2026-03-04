import { Injectable } from '@nestjs/common';
import { ScriptureService } from './scripture.service';

export interface WordDiff {
  word: string;
  type: 'added' | 'removed' | 'changed' | 'same';
  isVerb?: boolean;
  isTheologicalTerm?: boolean;
  isCovenantLanguage?: boolean;
}

export interface VerseDiff {
  reference: string;
  translations: {
    code: string;
    text: string;
    words: WordDiff[];
  }[];
  differences: {
    type: 'verb_change' | 'word_added' | 'word_removed' | 'theological_term' | 'covenant_language';
    description: string;
    translations: string[];
  }[];
}

@Injectable()
export class TranslationComparisonService {
  private theologicalTerms = new Set([
    'grace', 'faith', 'salvation', 'righteousness', 'justification', 'sanctification',
    'redemption', 'atonement', 'propitiation', 'reconciliation', 'covenant', 'testament',
    'kingdom', 'glory', 'holy', 'spirit', 'baptism', 'communion', 'church', 'gospel',
    'sin', 'repentance', 'forgiveness', 'mercy', 'love', 'truth', 'light', 'life',
    'eternal', 'heaven', 'hell', 'judgment', 'resurrection', 'incarnation', 'trinity'
  ]);

  private covenantTerms = new Set([
    'covenant', 'testament', 'promise', 'oath', 'seal', 'sign', 'blood', 'sacrifice',
    'altar', 'temple', 'sanctuary', 'tabernacle', 'ark', 'mercy seat', 'veil',
    'priest', 'high priest', 'offering', 'lamb', 'passover', 'circumcision'
  ]);

  private commonVerbs = new Set([
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'can', 'could'
  ]);

  constructor(private scriptureService: ScriptureService) {}

  async compareTranslations(
    reference: string,
    translations: string[],
    highlightMode?: 'all' | 'verbs' | 'theological' | 'covenant'
  ): Promise<VerseDiff[]> {
    if (translations.length < 2 || translations.length > 3) {
      throw new Error('Must compare 2-3 translations');
    }

    const passages = await Promise.all(
      translations.map(code => this.scriptureService.getPassage(reference, code))
    );

    const verseDiffs: VerseDiff[] = [];

    // Get all unique verse references
    const allVerseRefs = new Set<string>();
    passages.forEach(passage => {
      passage.verses?.forEach((v: any) => allVerseRefs.add(v.reference));
    });

    for (const verseRef of allVerseRefs) {
      const verseTexts = passages.map((passage, idx) => {
        const verse = passage.verses?.find((v: any) => v.reference === verseRef);
        return {
          code: translations[idx],
          text: verse?.text || '',
          words: this.tokenize(verse?.text || '')
        };
      });

      const differences = this.analyzeDifferences(verseTexts, highlightMode);
      const annotatedTranslations = this.annotateWords(verseTexts, differences, highlightMode);

      verseDiffs.push({
        reference: verseRef,
        translations: annotatedTranslations,
        differences
      });
    }

    return verseDiffs;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[.,;:!?()[\]{}'"]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  private analyzeDifferences(
    verseTexts: { code: string; text: string; words: string[] }[],
    highlightMode?: string
  ): any[] {
    const differences: any[] = [];
    const [first, ...rest] = verseTexts;

    // Compare each translation to the first one
    rest.forEach(other => {
      const firstWords = new Set(first.words);
      const otherWords = new Set(other.words);

      // Find added words
      const added = [...otherWords].filter(w => !firstWords.has(w));
      if (added.length > 0) {
        differences.push({
          type: 'word_added',
          description: `${other.code} adds: ${added.slice(0, 3).join(', ')}`,
          translations: [first.code, other.code]
        });
      }

      // Find removed words
      const removed = [...firstWords].filter(w => !otherWords.has(w));
      if (removed.length > 0) {
        differences.push({
          type: 'word_removed',
          description: `${other.code} omits: ${removed.slice(0, 3).join(', ')}`,
          translations: [first.code, other.code]
        });
      }

      // Check for verb changes (simplified)
      const firstVerbs = first.words.filter(w => this.isLikelyVerb(w));
      const otherVerbs = other.words.filter(w => this.isLikelyVerb(w));
      if (firstVerbs.join() !== otherVerbs.join()) {
        differences.push({
          type: 'verb_change',
          description: `Verb difference detected`,
          translations: [first.code, other.code]
        });
      }

      // Check theological terms
      if (highlightMode === 'theological' || highlightMode === 'all') {
        const firstTheological = first.words.filter(w => this.theologicalTerms.has(w));
        const otherTheological = other.words.filter(w => this.theologicalTerms.has(w));
        if (firstTheological.join() !== otherTheological.join()) {
          differences.push({
            type: 'theological_term',
            description: `Theological term variation`,
            translations: [first.code, other.code]
          });
        }
      }

      // Check covenant language
      if (highlightMode === 'covenant' || highlightMode === 'all') {
        const firstCovenant = first.words.filter(w => this.covenantTerms.has(w));
        const otherCovenant = other.words.filter(w => this.covenantTerms.has(w));
        if (firstCovenant.join() !== otherCovenant.join()) {
          differences.push({
            type: 'covenant_language',
            description: `Covenant language variation`,
            translations: [first.code, other.code]
          });
        }
      }
    });

    return differences;
  }

  private annotateWords(
    verseTexts: { code: string; text: string; words: string[] }[],
    differences: any[],
    highlightMode?: string
  ): any[] {
    return verseTexts.map(vt => {
      const words = vt.text.split(/\s+/).map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,;:!?()[\]{}'"]/g, '');
        
        return {
          word,
          type: 'same' as const,
          isVerb: this.isLikelyVerb(cleanWord),
          isTheologicalTerm: this.theologicalTerms.has(cleanWord),
          isCovenantLanguage: this.covenantTerms.has(cleanWord)
        };
      });

      return {
        code: vt.code,
        text: vt.text,
        words
      };
    });
  }

  private isLikelyVerb(word: string): boolean {
    // Simple heuristic - check for common verb endings
    if (this.commonVerbs.has(word)) return true;
    return /ed$|ing$|s$|en$/.test(word) && word.length > 3;
  }

  async getTranslationMetadata(translationCode: string): Promise<any> {
    const metadata: Record<string, any> = {
      'KJV': { style: 'literal', era: '1611', tradition: 'formal' },
      'NKJV': { style: 'literal', era: '1982', tradition: 'formal' },
      'NASB': { style: 'literal', era: '1971', tradition: 'formal' },
      'NIV': { style: 'dynamic', era: '1978', tradition: 'balanced' },
      'NLT': { style: 'dynamic', era: '1996', tradition: 'thought-for-thought' },
      'ESV': { style: 'literal', era: '2001', tradition: 'formal' },
      'WEB': { style: 'literal', era: '2000', tradition: 'public-domain' },
      'NBLA': { style: 'literal', era: '2005', tradition: 'formal-spanish' }
    };

    return metadata[translationCode] || { style: 'unknown', era: 'unknown', tradition: 'unknown' };
  }
}
