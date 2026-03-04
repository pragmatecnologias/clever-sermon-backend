import { Injectable } from '@nestjs/common';
import { ScriptureService } from './scripture.service';

export interface RankedCrossReference {
  reference: string;
  category: 'direct_quote' | 'explicit_fulfillment' | 'thematic_parallel' | 'typological' | 'general_thematic';
  relevanceScore: number;
  explanation: string;
  text?: string;
}

@Injectable()
export class CrossReferenceRankingService {
  constructor(private scriptureService: ScriptureService) {}

  async getRankedCrossReferences(verse: string): Promise<RankedCrossReference[]> {
    // Get raw cross references
    const rawRefs = await this.scriptureService.getCrossReferences(verse);
    
    if (!rawRefs || rawRefs.length === 0) {
      return [];
    }

    // Fetch and analyze each cross reference
    const rankedRefs: RankedCrossReference[] = [];

    for (const refString of rawRefs.slice(0, 20)) { // Limit to top 20 for performance
      try {
        // refString is just a string reference like "John 3:16"
        const reference = typeof refString === 'string' ? refString : (refString as any).reference;
        
        const refData = await this.scriptureService.getPassage(reference);
        const sourceData = await this.scriptureService.getPassage(verse);

        if (refData?.verses && sourceData?.verses) {
          const ranking = this.analyzeRelationship(
            sourceData.verses[0]?.text || '',
            refData.verses[0]?.text || '',
            verse,
            reference
          );

          rankedRefs.push({
            reference: reference,
            category: ranking.category,
            relevanceScore: ranking.score,
            explanation: ranking.explanation,
            text: refData.verses[0]?.text
          });
        }
      } catch (error) {
        // Skip failed references
        continue;
      }
    }

    // Sort by relevance score
    return rankedRefs.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private analyzeRelationship(
    sourceText: string,
    targetText: string,
    sourceRef: string,
    targetRef: string
  ): { category: any; score: number; explanation: string } {
    const sourceLower = sourceText.toLowerCase();
    const targetLower = targetText.toLowerCase();

    // Check for direct quotation (high overlap)
    const overlap = this.calculateTextOverlap(sourceLower, targetLower);
    if (overlap > 0.7) {
      return {
        category: 'direct_quote',
        score: 95,
        explanation: 'Direct quotation or near-identical wording'
      };
    }

    // Check for fulfillment language
    if (this.hasFulfillmentLanguage(targetText, sourceRef)) {
      return {
        category: 'explicit_fulfillment',
        score: 90,
        explanation: 'Explicit fulfillment of prophecy or promise'
      };
    }

    // Check for thematic keywords
    const thematicScore = this.calculateThematicSimilarity(sourceLower, targetLower);
    if (thematicScore > 0.6) {
      return {
        category: 'thematic_parallel',
        score: 75,
        explanation: 'Strong thematic connection'
      };
    }

    // Check for typological patterns (OT -> NT)
    if (this.isTypological(sourceRef, targetRef)) {
      return {
        category: 'typological',
        score: 70,
        explanation: 'Typological pattern or shadow-to-reality relationship'
      };
    }

    // Default to general thematic
    return {
      category: 'general_thematic',
      score: 50,
      explanation: 'General thematic connection'
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

  private hasFulfillmentLanguage(text: string, sourceRef: string): boolean {
    const fulfillmentPhrases = [
      'fulfill', 'fulfilled', 'spoken by', 'written', 'prophet',
      'that it might be fulfilled', 'as it is written', 'according to'
    ];

    const lowerText = text.toLowerCase();
    return fulfillmentPhrases.some(phrase => lowerText.includes(phrase));
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

  async getTopCrossReferences(verse: string, limit: number = 3): Promise<RankedCrossReference[]> {
    const ranked = await this.getRankedCrossReferences(verse);
    return ranked.slice(0, limit);
  }

  async getCrossReferencesByCategory(
    verse: string,
    category: 'direct_quote' | 'explicit_fulfillment' | 'thematic_parallel' | 'typological' | 'general_thematic'
  ): Promise<RankedCrossReference[]> {
    const ranked = await this.getRankedCrossReferences(verse);
    return ranked.filter(ref => ref.category === category);
  }
}
