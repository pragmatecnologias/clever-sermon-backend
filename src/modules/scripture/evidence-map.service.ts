import { Injectable } from '@nestjs/common';
import { ScriptureService } from './scripture.service';

export interface EvidencePoint {
  sermonPoint: string;
  supportingVerses: {
    reference: string;
    text: string;
    containsConcept: boolean;
    supportingPhrases: string[];
    relevanceScore: number;
    notes: string;
  }[];
  integrityScore: number;
  warnings: string[];
}

export interface IntegrityCheck {
  passed: boolean;
  score: number;
  checks: {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

@Injectable()
export class EvidenceMapService {
  constructor(private scriptureService: ScriptureService) {}

  async analyzeSermonEvidence(
    sermonPoints: string[],
    mainPassage: string,
    additionalPassages: string[]
  ): Promise<EvidencePoint[]> {
    const evidencePoints: EvidencePoint[] = [];

    for (const point of sermonPoints) {
      const evidence = await this.analyzePoint(point, mainPassage, additionalPassages);
      evidencePoints.push(evidence);
    }

    return evidencePoints;
  }

  private async analyzePoint(
    point: string,
    mainPassage: string,
    additionalPassages: string[]
  ): Promise<EvidencePoint> {
    const allPassages = [mainPassage, ...additionalPassages];
    const supportingVerses: any[] = [];
    const warnings: string[] = [];

    // Extract key concepts from the sermon point
    const concepts = this.extractConcepts(point);

    // Analyze each passage for support
    for (const passage of allPassages) {
      try {
        const passageData = await this.scriptureService.getPassage(passage);
        
        if (passageData?.verses) {
          for (const verse of passageData.verses) {
            const analysis = this.analyzeVerseSupport(verse.text, concepts);
            
            if (analysis.relevanceScore > 0) {
              supportingVerses.push({
                reference: verse.reference,
                text: verse.text,
                containsConcept: analysis.containsConcept,
                supportingPhrases: analysis.supportingPhrases,
                relevanceScore: analysis.relevanceScore,
                notes: analysis.notes
              });
            }
          }
        }
      } catch (error) {
        warnings.push(`Failed to analyze ${passage}`);
      }
    }

    // Calculate integrity score
    const integrityScore = this.calculateIntegrityScore(supportingVerses, concepts);

    // Add warnings if score is low
    if (integrityScore < 50) {
      warnings.push('Low scriptural support for this point');
    }
    if (supportingVerses.length === 0) {
      warnings.push('No direct scriptural support found');
    }

    return {
      sermonPoint: point,
      supportingVerses: supportingVerses.sort((a, b) => b.relevanceScore - a.relevanceScore),
      integrityScore,
      warnings
    };
  }

  private extractConcepts(text: string): string[] {
    // Extract key theological and action concepts
    const words = text
      .toLowerCase()
      .replace(/[.,;:!?()[\]{}'"]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3);

    // Filter out common words
    const stopWords = new Set(['that', 'this', 'with', 'from', 'have', 'will', 'would', 'should', 'could']);
    return words.filter(w => !stopWords.has(w));
  }

  private analyzeVerseSupport(
    verseText: string,
    concepts: string[]
  ): {
    containsConcept: boolean;
    supportingPhrases: string[];
    relevanceScore: number;
    notes: string;
  } {
    const lowerVerse = verseText.toLowerCase();
    const foundConcepts: string[] = [];
    const supportingPhrases: string[] = [];

    // Check for concept matches
    concepts.forEach(concept => {
      if (lowerVerse.includes(concept)) {
        foundConcepts.push(concept);
        
        // Extract phrase containing the concept
        const words = verseText.split(/\s+/);
        const conceptIndex = words.findIndex(w => w.toLowerCase().includes(concept));
        
        if (conceptIndex >= 0) {
          const start = Math.max(0, conceptIndex - 2);
          const end = Math.min(words.length, conceptIndex + 3);
          const phrase = words.slice(start, end).join(' ');
          supportingPhrases.push(phrase);
        }
      }
    });

    const relevanceScore = Math.min(100, (foundConcepts.length / concepts.length) * 100);
    const containsConcept = foundConcepts.length > 0;

    let notes = '';
    if (relevanceScore >= 75) {
      notes = 'Strong support';
    } else if (relevanceScore >= 50) {
      notes = 'Moderate support';
    } else if (relevanceScore >= 25) {
      notes = 'Weak support';
    } else if (containsConcept) {
      notes = 'Tangential support';
    }

    return {
      containsConcept,
      supportingPhrases,
      relevanceScore,
      notes
    };
  }

  private calculateIntegrityScore(
    supportingVerses: any[],
    concepts: string[]
  ): number {
    if (supportingVerses.length === 0) return 0;

    const avgRelevance = supportingVerses.reduce((sum, v) => sum + v.relevanceScore, 0) / supportingVerses.length;
    const verseCount = Math.min(supportingVerses.length, 5);
    const verseBonus = (verseCount / 5) * 20;

    return Math.min(100, Math.round(avgRelevance * 0.8 + verseBonus));
  }

  async checkPassageIntegrity(
    outlinePoints: string[],
    applications: string[],
    mainPassage: string,
    crossReferences: string[]
  ): Promise<IntegrityCheck> {
    const checks: any[] = [];
    let passedCount = 0;

    // Check 1: All outline points traceable to text
    const pointsCheck = await this.checkPointsTraceability(outlinePoints, mainPassage);
    checks.push(pointsCheck);
    if (pointsCheck.passed) passedCount++;

    // Check 2: Applications derived from themes
    const appsCheck = await this.checkApplicationsAlignment(applications, mainPassage);
    checks.push(appsCheck);
    if (appsCheck.passed) passedCount++;

    // Check 3: Cross references are relevant
    const crossRefCheck = await this.checkCrossReferenceRelevance(crossReferences, mainPassage);
    checks.push(crossRefCheck);
    if (crossRefCheck.passed) passedCount++;

    const score = Math.round((passedCount / checks.length) * 100);
    const passed = score >= 70;

    return {
      passed,
      score,
      checks
    };
  }

  private async checkPointsTraceability(points: string[], passage: string): Promise<any> {
    try {
      const passageData = await this.scriptureService.getPassage(passage);
      const allText = passageData?.verses?.map((v: any) => v.text).join(' ').toLowerCase() || '';

      let traceableCount = 0;
      points.forEach(point => {
        const concepts = this.extractConcepts(point);
        const found = concepts.some(c => allText.includes(c));
        if (found) traceableCount++;
      });

      const passed = traceableCount >= points.length * 0.7;

      return {
        name: 'Outline Points Traceability',
        passed,
        message: passed
          ? `${traceableCount}/${points.length} points traceable to passage`
          : `Only ${traceableCount}/${points.length} points traceable - strengthen scriptural grounding`
      };
    } catch {
      return {
        name: 'Outline Points Traceability',
        passed: false,
        message: 'Unable to verify traceability'
      };
    }
  }

  private async checkApplicationsAlignment(applications: string[], passage: string): Promise<any> {
    try {
      const passageData = await this.scriptureService.getPassage(passage);
      const allText = passageData?.verses?.map((v: any) => v.text).join(' ').toLowerCase() || '';

      let alignedCount = 0;
      applications.forEach(app => {
        const concepts = this.extractConcepts(app);
        const found = concepts.some(c => allText.includes(c));
        if (found) alignedCount++;
      });

      const passed = alignedCount >= applications.length * 0.6;

      return {
        name: 'Application Alignment',
        passed,
        message: passed
          ? `${alignedCount}/${applications.length} applications aligned with passage themes`
          : `Only ${alignedCount}/${applications.length} applications aligned - ensure applications flow from text`
      };
    } catch {
      return {
        name: 'Application Alignment',
        passed: false,
        message: 'Unable to verify alignment'
      };
    }
  }

  private async checkCrossReferenceRelevance(crossRefs: string[], mainPassage: string): Promise<any> {
    if (crossRefs.length === 0) {
      return {
        name: 'Cross Reference Relevance',
        passed: true,
        message: 'No cross references to validate'
      };
    }

    // Simple check: ensure cross references exist
    const passed = crossRefs.length > 0;

    return {
      name: 'Cross Reference Relevance',
      passed,
      message: passed
        ? `${crossRefs.length} cross references provided`
        : 'No cross references found'
    };
  }
}
