import { Injectable } from '@nestjs/common';
import {
  WorkspaceClaimSubType,
  WorkspacePastoralRisk,
  WorkspaceClaimSplitSuggestion,
  WorkspaceClaimSummary,
  WorkspaceReviewSummary,
} from './workspace-state.types';

interface ClaimReviewContext {
  selectedRange: string;
  passageText: string;
  externalSourcesExist: boolean;
}

interface HomileticalImaginationResult {
  detected: boolean;
  imaginedDetail: string;
  suggestedRepair: string;
}

interface OutsideRangeResult {
  isOutsideRange: boolean;
  outsideVerses: string[];
  note: string;
}

@Injectable()
export class SermonClaimReviewService {
  // ─── Public API ──────────────────────────────────────────────

  enrichClaims(
    claims: WorkspaceClaimSummary[],
    selectedRange: string,
    passageText: string,
  ): WorkspaceClaimSummary[] {
    if (!claims.length) return claims;

    const context: ClaimReviewContext = { selectedRange, passageText, externalSourcesExist: false };
    const parsedRange = this.parseVerseRange(selectedRange);

    return claims.map((claim) => {
      const enriched = { ...claim };
      const claimText = claim.claimText || '';

      enriched.claimSubType = this.classifyClaimType(claim, claimText);
      enriched.claimSplitSuggestion = this.detectCompoundClaims(claimText, enriched.claimSubType);

      const homiletical = this.detectHomileticalImagination(claimText, passageText);
      const outsideRange = this.detectOutsideRange(claimText, parsedRange);

      enriched.pastoralRisk = this.assessPastoralRisk(
        claimText,
        enriched.claimSubType,
        claim.supportLevel,
        homiletical.detected,
        outsideRange.isOutsideRange,
        !!enriched.claimSplitSuggestion?.length,
      );

      enriched.riskReason = this.buildRiskReason(
        claimText,
        enriched.claimSubType,
        claim.supportLevel,
        homiletical,
        outsideRange,
        enriched.pastoralRisk,
      );

      enriched.suggestedRepair = homiletical.detected
        ? homiletical.suggestedRepair
        : undefined;

      enriched.socraticQuestions = this.generateSocraticQuestions(
        enriched.claimSubType,
        claimText,
      );

      return enriched;
    });
  }

  buildReviewSummary(claims: WorkspaceClaimSummary[]): WorkspaceReviewSummary {
    return {
      totalClaims: claims.length,
      supportedClaims: claims.filter((c) => c.supportLevel === 'supported').length,
      needsReview: claims.filter((c) => ['needs_review', 'partially_supported', 'unsupported'].includes(c.supportLevel)).length,
      highRiskClaims: claims.filter((c) => c.pastoralRisk === 'high').length,
      theologicalExtensions: claims.filter((c) => c.claimSubType === 'theological_extension').length,
      illustrations: claims.filter((c) => c.claimSubType === 'illustration').length,
      outsideRangeClaims: claims.filter((c) => c.riskReason?.includes('outside the selected passage')).length,
      suggestedRepairs: claims.filter((c) => c.suggestedRepair).length,
    };
  }

  // ─── Claim Classification ────────────────────────────────────

  classifyClaimType(claim: WorkspaceClaimSummary, claimText: string): WorkspaceClaimSubType {
    const lower = claimText.toLowerCase().trim();

    if (claim.sourceType === 'external' || /according to (?!the|scripture|luke|john|psalm|genesis|exodus|matthew|mark|acts|romans|corinthians|hebrews|revelation|isaiah|jeremiah|daniel)/i.test(lower)) {
      return 'external_reference';
    }
    if (/^imagine\b|^picture\b|^think of\b|^envision\b/i.test(lower)) return 'illustration';
    if (/\b(should|we must|you need to|you must|let us|go and|do not fail to|we are called to)\b/i.test(lower)) return 'application';
    if (/\b(represents?|symbolizes?|types?|foreshadows?|prefigures?|typifies?|is a type of)\b/i.test(lower)) return 'theological_extension';
    if (/\b(means|indicates|shows that|demonstrates that|reveals that|signifies|implies|suggests that|points to)\b/i.test(lower)) return 'interpretation';
    return 'textual_observation';
  }

  // ─── Homiletical Imagination Detection ───────────────────────

  detectHomileticalImagination(
    claimText: string,
    passageText: string,
  ): HomileticalImaginationResult {
    const passageLower = (passageText || '').toLowerCase();
    const words = claimText
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    const detailWords = ['porch', 'balcony', 'veranda', 'tent', 'cave', 'well', 'inn', 'stable', 'manger', 'throne', 'palace', 'courtyard', 'garden', 'gate', 'wall', 'roof', 'window', 'stairway', 'boat', 'ship', 'market', 'synagogue steps'];

    const missingDetails = detailWords.filter((detail) => {
      return lowerClaimContains(claimText, detail) && !passageLower.includes(detail);
    });

    if (missingDetails.length > 0) {
      const detail = missingDetails[0];
      const sentence = extractSentence(claimText, detail);
      let repair = sentence.replace(new RegExp(`\\b${detail}\\b`, 'i'), '').replace(/\s{2,}/g, ' ').trim();
      repair = repair.replace(/^(the|a|an)\s/i, (m) => m.toLowerCase());
      if (!repair || repair.length < 10) {
        repair = `The text does not mention a ${detail}. Consider rephrasing without this detail.`;
      }
      return { detected: true, imaginedDetail: detail, suggestedRepair: repair };
    }

    return { detected: false, imaginedDetail: '', suggestedRepair: '' };
  }

  // ─── Outside-Range Detection ─────────────────────────────────

  detectOutsideRange(
    claimText: string,
    parsedRange: { book: string; startChapter: number; startVerse: number; endChapter: number; endVerse: number } | null,
  ): OutsideRangeResult {
    if (!parsedRange) return { isOutsideRange: false, outsideVerses: [], note: '' };

    const refs = this.extractVerseReferences(claimText);
    const outsideVerses = refs.filter((ref) => {
      const match = ref.match(/^(\d*)\s*([A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/i);
      if (!match) return false;
      const chapter = parseInt(match[3], 10);
      const verse = parseInt(match[4], 10);

      if (chapter < parsedRange.startChapter) return true;
      if (chapter > parsedRange.endChapter) return true;
      if (chapter === parsedRange.startChapter && verse < parsedRange.startVerse) return true;
      if (chapter === parsedRange.endChapter && verse > parsedRange.endVerse) return true;
      return false;
    });

    if (outsideVerses.length > 0) {
      return {
        isOutsideRange: true,
        outsideVerses,
        note: 'This support comes from outside the selected passage but belongs to the same parable context.',
      };
    }

    return { isOutsideRange: false, outsideVerses: [], note: '' };
  }

  // ─── Compound Claim Detection ────────────────────────────────

  detectCompoundClaims(
    claimText: string,
    subType: WorkspaceClaimSubType,
  ): WorkspaceClaimSplitSuggestion[] {
    const parts: WorkspaceClaimSplitSuggestion[] = [];
    const lower = claimText.toLowerCase();

    const connectorPatterns = [
      /\band\s+this\s+(represents?|means?|shows?|symbolizes?|indicates?|points\s+to|illustrates?)\b/i,
      /\b,?\s*which\s+(represents?|means?|is|symbolizes?)\b/i,
      /\bthe\s+[\w\s]+\s+(represents?|symbolizes?|is\s+a\s+type\s+of)\b/i,
    ];

    const hasConnector = connectorPatterns.some((p) => p.test(lower));

    if (hasConnector && lower.length > 80) {
      const sentences = claimText.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 10);
      if (sentences.length >= 2) {
        sentences.forEach((sentence, index) => {
          const subType = this.classifyClaimType({} as WorkspaceClaimSummary, sentence);
          parts.push({
            claimText: sentence.trim(),
            claimType: subType,
            supportHint: index === 0 ? 'Needs textual verification' : 'Needs theological or study support',
          });
        });
        return parts;
      }
    }

    return [];
  }

  // ─── Socratic Questions ──────────────────────────────────────

  generateSocraticQuestions(
    subType: WorkspaceClaimSubType,
    claimText: string,
  ): string[] {
    const hasQuote = /\b[a-z]+\s+\d+:\d+/i.test(claimText);
    const templates = SOCRATIC_TEMPLATES[subType] || SOCRATIC_TEMPLATES.textual_observation;

    return templates.map((q) => {
      if (hasQuote && q.includes('{verseCheck}')) {
        return q.replace('{verseCheck}', 'Does the cited verse support this claim as stated?');
      }
      if (hasQuote && q.includes('{verseCheck}')) return q;
      return q;
    }).slice(0, 4);
  }

  // ─── Pastoral Risk ───────────────────────────────────────────

  assessPastoralRisk(
    claimText: string,
    subType: WorkspaceClaimSubType,
    supportLevel: string,
    homileticalDetected: boolean,
    outsideRange: boolean,
    isCompound: boolean,
  ): WorkspacePastoralRisk {
    if (homileticalDetected && supportLevel === 'unsupported') return 'high';
    if (homileticalDetected) return 'medium';
    if (isCompound && supportLevel !== 'supported') return 'medium';
    if (outsideRange && subType === 'application') return 'low';
    if (outsideRange) return 'medium';
    if (subType === 'theological_extension' && supportLevel !== 'supported') return 'medium';
    if (supportLevel === 'unsupported') return 'high';
    if (supportLevel === 'needs_review') return 'low';
    if (subType === 'illustration') return 'low';
    return 'none';
  }

  // ─── Helpers ─────────────────────────────────────────────────

  private buildRiskReason(
    claimText: string,
    subType: WorkspaceClaimSubType,
    supportLevel: string,
    homiletical: HomileticalImaginationResult,
    outsideRange: OutsideRangeResult,
    risk: WorkspacePastoralRisk,
  ): string {
    const reasons: string[] = [];
    if (homiletical.detected) reasons.push(`"${homiletical.imaginedDetail}" is not in the passage text.`);
    if (outsideRange.isOutsideRange) reasons.push(outsideRange.note);
    if (subType === 'theological_extension' && supportLevel !== 'supported') {
      reasons.push('Theological extensions need supporting sources.');
    }
    if (supportLevel === 'unsupported') reasons.push('No supporting source found.');
    if (supportLevel === 'needs_review') reasons.push('Claim needs review for accuracy.');
    return reasons.join(' ') || 'No issues detected.';
  }

  private parseVerseRange(range: string) {
    // Supports: "Luke 15:11-24" (same chapter), "Luke 15:11-16:5" (cross-chapter)
    const fullMatch = (range || '').match(/^(\d*\s*[A-Za-z]+)\s+(\d+):(\d+)\s*[-–]\s*(\d+):(\d+)$/i);
    if (fullMatch) {
      return {
        book: fullMatch[1].trim(),
        startChapter: parseInt(fullMatch[2], 10),
        startVerse: parseInt(fullMatch[3], 10),
        endChapter: parseInt(fullMatch[4], 10),
        endVerse: parseInt(fullMatch[5], 10),
      };
    }
    // Abbreviated: "Luke 15:11-24" → same chapter, endVerse is verse number
    const sameChapterMatch = (range || '').match(/^(\d*\s*[A-Za-z]+)\s+(\d+):(\d+)\s*[-–]\s*(\d+)$/i);
    if (sameChapterMatch) {
      const chapter = parseInt(sameChapterMatch[2], 10);
      return {
        book: sameChapterMatch[1].trim(),
        startChapter: chapter,
        startVerse: parseInt(sameChapterMatch[3], 10),
        endChapter: chapter,
        endVerse: parseInt(sameChapterMatch[4], 10),
      };
    }
    return null;
  }

  private extractVerseReferences(text: string): string[] {
    const refRegex = /\b(?:[1-3]\s*)?[A-Z][a-z]+\s+\d+:\d+(?:[-–]\d+)?\b/g;
    return (text.match(refRegex) || []).map((r) => r.trim());
  }
}

// ─── Helpers ────────────────────────────────────────────────────

function lowerClaimContains(claimText: string, word: string): boolean {
  return new RegExp(`\\b${word}\\b`, 'i').test(claimText.toLowerCase());
}

function extractSentence(text: string, word: string): string {
  const idx = text.toLowerCase().indexOf(word.toLowerCase());
  if (idx < 0) return text;
  const start = text.lastIndexOf('.', idx) + 1;
  const end = text.indexOf('.', idx);
  if (end < 0) return text.substring(start).trim();
  return text.substring(start, end + 1).trim();
}

// ─── Socratic Question Templates ───────────────────────────────

const SOCRATIC_TEMPLATES: Record<WorkspaceClaimSubType, string[]> = {
  textual_observation: [
    'What does the text explicitly say?',
    'Is any detail added that the text does not mention?',
    'Is this observation based on the selected passage or wider context?',
  ],
  interpretation: [
    'What other interpretations are possible?',
    'Does this interpretation fit the passage\'s genre and context?',
    'Is the claim too strong for the evidence?',
  ],
  theological_extension: [
    'Is this connection directly taught by the passage or applied from broader theology?',
    'What biblical or Adventist source supports this connection?',
    'Could this be stated more carefully?',
  ],
  application: [
    'Does this application flow from the text?',
    'Could this burden the listener instead of inviting them?',
    'Is the appeal grace-shaped and pastorally wise?',
  ],
  illustration: [
    'Is this clearly marked as illustration rather than textual fact?',
    'Could the illustration distract from the passage?',
    'Is any imagined detail being presented as biblical detail?',
  ],
  external_reference: [
    'Is the quote accurately attributed?',
    'Is the source directly related or only thematically related?',
    'Does the quote support the claim or merely share a theme?',
  ],
};
