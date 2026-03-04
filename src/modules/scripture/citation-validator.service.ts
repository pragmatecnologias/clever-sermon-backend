import { Injectable } from '@nestjs/common';
import { ScriptureService } from './scripture.service';

export interface CitationValidationResult {
  citationId?: string;
  verseReference: string;
  statement: string;
  verseText: string;
  supportLevel: 'supported' | 'weak' | 'not_supported';
  phraseOverlap: string[];
  matchScore: number;
  explanation: string;
}

@Injectable()
export class CitationValidatorService {
  constructor(private scriptureService: ScriptureService) {}

  async validateCitation(
    statement: string,
    verseReference: string,
    translationCode: string = 'KJV'
  ): Promise<CitationValidationResult> {
    try {
      const passage = await this.scriptureService.getPassage(verseReference, translationCode);
      
      if (!passage || !passage.verses?.length) {
        return {
          verseReference,
          statement,
          verseText: '',
          supportLevel: 'not_supported',
          phraseOverlap: [],
          matchScore: 0,
          explanation: 'Verse not found or invalid reference'
        };
      }

      const verseText = passage.verses.map((v: any) => v.text || '').join(' ');
      const overlap = this.findPhraseOverlap(statement, verseText);
      const score = this.calculateMatchScore(statement, verseText, overlap);
      
      let supportLevel: 'supported' | 'weak' | 'not_supported';
      let explanation: string;

      if (score >= 0.6) {
        supportLevel = 'supported';
        explanation = 'Strong textual support with clear phrase overlap';
      } else if (score >= 0.3) {
        supportLevel = 'weak';
        explanation = 'Partial support; some thematic connection but limited direct overlap';
      } else {
        supportLevel = 'not_supported';
        explanation = 'Minimal textual support; claim may be interpretive or unsupported';
      }

      return {
        verseReference,
        statement,
        verseText,
        supportLevel,
        phraseOverlap: overlap,
        matchScore: score,
        explanation
      };
    } catch (error) {
      return {
        verseReference,
        statement,
        verseText: '',
        supportLevel: 'not_supported',
        phraseOverlap: [],
        matchScore: 0,
        explanation: `Error validating citation: ${error.message}`
      };
    }
  }

  async validateMultipleCitations(
    citations: Array<{ statement: string; verseReferences: string[] }>,
    translationCode: string = 'KJV'
  ): Promise<CitationValidationResult[]> {
    const results: CitationValidationResult[] = [];
    
    for (const citation of citations) {
      for (const ref of citation.verseReferences) {
        const result = await this.validateCitation(citation.statement, ref, translationCode);
        results.push(result);
      }
    }
    
    return results;
  }

  private findPhraseOverlap(statement: string, verseText: string): string[] {
    const overlap: string[] = [];
    const statementLower = statement.toLowerCase();
    const verseLower = verseText.toLowerCase();
    
    // Extract phrases (2-5 words)
    const statementWords = statementLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    
    for (let phraseLength = 5; phraseLength >= 2; phraseLength--) {
      for (let i = 0; i <= statementWords.length - phraseLength; i++) {
        const phrase = statementWords.slice(i, i + phraseLength).join(' ');
        if (phrase.length > 5 && verseLower.includes(phrase)) {
          overlap.push(phrase);
        }
      }
    }
    
    return [...new Set(overlap)];
  }

  private calculateMatchScore(statement: string, verseText: string, overlap: string[]): number {
    const statementWords = statement.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    
    const verseWords = verseText.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    
    const stopWords = new Set([
      'the', 'and', 'for', 'that', 'with', 'from', 'this', 'these', 'those',
      'are', 'was', 'were', 'has', 'have', 'had', 'not', 'but', 'you', 'your',
      'his', 'her', 'their', 'they', 'them', 'our', 'its', 'into', 'over'
    ]);
    
    const meaningfulStatementWords = statementWords.filter(w => !stopWords.has(w) && w.length > 2);
    const meaningfulVerseWords = new Set(verseWords.filter(w => !stopWords.has(w) && w.length > 2));
    
    if (meaningfulStatementWords.length === 0) return 0;
    
    const matchedWords = meaningfulStatementWords.filter(w => meaningfulVerseWords.has(w));
    const wordMatchRatio = matchedWords.length / meaningfulStatementWords.length;
    
    // Phrase overlap bonus
    const phraseBonus = Math.min(overlap.length * 0.15, 0.4);
    
    return Math.min(wordMatchRatio + phraseBonus, 1);
  }
}
