import { Injectable } from '@nestjs/common';
import {
  WorkspaceClaimSubType,
  WorkspacePastoralRisk,
  WorkspaceClaimSplitSuggestion,
  WorkspaceClaimSummary,
  WorkspaceReviewSummary,
} from './workspace-state.types';

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

interface TheologicalOverreachResult {
  detected: boolean;
  theme: string;
  riskLevel: WorkspacePastoralRisk;
  reason: string;
  suggestedRepair: string;
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

    const parsedRange = this.parseVerseRange(selectedRange);

    return claims.map((claim) => {
      const enriched = { ...claim };
      const claimText = claim.claimText || '';

      // Re-classify support level more intelligently
      enriched.supportLevel = this.refineSupportLevel(claimText, claim);

      // Classification
      const outsideRange = this.detectOutsideRange(claimText, parsedRange);
      if (outsideRange.isOutsideRange) {
        enriched.claimSubType = 'wider_context';
      } else {
        enriched.claimSubType = this.classifyClaimType(claim, claimText);
      }

      // Flags
      const homiletical = this.detectHomileticalImagination(claimText, passageText);
      const overreach = this.detectTheologicalOverreach(claimText, passageText, enriched.claimSubType);

      enriched.homileticalImagination = homiletical.detected;
      enriched.outsideSelectedRange = outsideRange.isOutsideRange;
      enriched.outsideRangeReason = outsideRange.isOutsideRange ? outsideRange.note : undefined;
      enriched.theologicalExtension = enriched.claimSubType === 'theological_extension' || overreach.detected;

      // Compound detection
      enriched.claimSplitSuggestion = this.detectCompoundClaims(claimText, enriched.claimSubType);

      // Risk
      enriched.pastoralRisk = this.assessPastoralRisk(
        claimText,
        enriched.claimSubType,
        enriched.supportLevel,
        homiletical.detected,
        outsideRange.isOutsideRange,
        !!enriched.claimSplitSuggestion?.length,
        overreach,
      );

      // Risk reason
      enriched.riskReason = this.buildRiskReason(
        enriched.claimSubType,
        enriched.supportLevel,
        homiletical,
        outsideRange,
        overreach,
        enriched.pastoralRisk,
      );

      // Repair
      if (homiletical.detected) {
        enriched.suggestedRepair = homiletical.suggestedRepair;
      } else if (overreach.detected) {
        enriched.suggestedRepair = overreach.suggestedRepair;
      }

      // Questions
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
      outsideRangeClaims: claims.filter((c) => c.outsideSelectedRange).length,
      suggestedRepairs: claims.filter((c) => c.suggestedRepair).length,
    };
  }

  // ─── Support Level Refinement ────────────────────────────────

  refineSupportLevel(claimText: string, claim: WorkspaceClaimSummary): WorkspaceClaimSummary['supportLevel'] {
    const lower = claimText.toLowerCase();

    // Contradiction markers → unsupported
    if (/\b(contradicts|misrepresents|fabricates|invents)\b/i.test(lower)) {
      return 'unsupported';
    }
    // Homiletical imagination detected early → needs_review
    if (/\bporch\b|\bscanning the horizon\b|\bwith tears in his eyes\b|\brehearsed all night\b/i.test(lower)) {
      return 'needs_review';
    }
    // Has verified sources → supported
    if (claim.verified && claim.sourceIds.length > 0) {
      return 'supported';
    }
    // Has source refs but not verified → partial
    if (claim.sourceIds.length > 0) {
      return 'partially_supported';
    }
    // External references need review
    if (claim.sourceType === 'external') {
      return 'needs_review';
    }
    // Has compound / theological language → needs_review
    if (/\b(represents?|symbolizes?|types?|foreshadows?|doctrine|teaches that)\b/i.test(lower)) {
      return 'needs_review';
    }
    return claim.supportLevel;
  }

  // ─── Claim Classification ────────────────────────────────────

  classifyClaimType(claim: WorkspaceClaimSummary, claimText: string): WorkspaceClaimSubType {
    const lower = claimText.toLowerCase().trim();

    if (claim.sourceType === 'external' || /\b(?:egw|ellen white|spirit of prophecy|commentary|according to (?!the|scripture|luke|matthew|mark|john|acts|romans|psalm|genesis|exodus))\b/i.test(lower)) {
      return 'external_reference';
    }
    if (/^imagine\b|^picture\b|^think of\b|^envision\b/i.test(lower)) return 'illustration';
    if (/\b(should|we must|you need to|you must|let us|go and|do not fail to|we are called to)\b/i.test(lower)) return 'application';
    if (/\b(represents?|symbolizes?|types?|foreshadows?|prefigures?|typifies?|is a type of|doctrine of|teaches that)\b/i.test(lower)) return 'theological_extension';
    if (/\b(means|indicates|shows that|demonstrates that|reveals that|signifies|implies|suggests that|points to)\b/i.test(lower)) return 'interpretation';
    return 'textual_observation';
  }

  // ─── Homiletical Imagination Detection ───────────────────────

  detectHomileticalImagination(
    claimText: string,
    passageText: string,
  ): HomileticalImaginationResult {
    const passageLower = (passageText || '').toLowerCase();

    const detailWords = [
      'porch', 'balcony', 'veranda', 'scanning the horizon',
      'with tears in his eyes', 'tears in his eyes',
      'rehearsed all night', 'rehearsed',
      'tent', 'cave', 'well', 'inn', 'stable', 'manger',
      'throne', 'palace', 'courtyard', 'garden', 'gate',
      'wall', 'roof', 'window', 'stairway', 'boat', 'ship',
      'market', 'synagogue steps', 'synagogue',
    ];

    for (const detail of detailWords) {
      if (lowerClaimContains(claimText, detail) && !passageLower.includes(detail.toLowerCase())) {
        return {
          detected: true,
          imaginedDetail: detail,
          suggestedRepair: this.buildHomileticalRepair(claimText, detail, passageText),
        };
      }
    }

    return { detected: false, imaginedDetail: '', suggestedRepair: '' };
  }

  private buildHomileticalRepair(claimText: string, detail: string, passageText: string): string {
    // For the well-known Luke 15 porch case
    if (detail === 'porch' && /great way off|still a great way|far off/i.test(passageText)) {
      return 'While the son was still a great way off, the father saw him and had compassion (Luke 15:20).';
    }
    // Generic: remove the detail and suggest checking the text
    const repaired = claimText.replace(new RegExp(`\\b${detail.replace(/\s/g, '\\s')}\\b`, 'i'), '').replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',').trim();
    if (repaired.length > 15) return repaired;
    return `The text does not mention "${detail}". Consider using only details present in the passage.`;
  }

  // ─── Theological Overreach Detection ─────────────────────────

  detectTheologicalOverreach(
    claimText: string,
    passageText: string,
    subType: WorkspaceClaimSubType,
  ): TheologicalOverreachResult {
    const lower = claimText.toLowerCase();
    const patterns = THEOLOGICAL_OVERREACH_PATTERNS;

    for (const pattern of patterns) {
      if (pattern.regex.test(lower)) {
        return {
          detected: true,
          theme: pattern.theme,
          riskLevel: pattern.defaultRisk,
          reason: pattern.reason,
          suggestedRepair: pattern.repair,
        };
      }
    }

    return { detected: false, theme: '', riskLevel: 'none', reason: '', suggestedRepair: '' };
  }

  // ─── Outside-Range Detection ─────────────────────────────────

  detectOutsideRange(
    claimText: string,
    parsedRange: { book: string; startChapter: number; startVerse: number; endChapter: number; endVerse: number } | null,
  ): OutsideRangeResult {
    if (!parsedRange) return { isOutsideRange: false, outsideVerses: [], note: '' };

    const refs = this.extractVerseReferences(claimText);
    const outsideVerses = refs.filter((ref) => {
      const parsed = this.parseSingleRef(ref);
      if (!parsed) return false;
      if (parsed.book !== parsedRange.book) return false; // different book, not "outside range"
      if (parsed.chapter < parsedRange.startChapter) return true;
      if (parsed.chapter > parsedRange.endChapter) return true;
      if (parsed.chapter === parsedRange.startChapter && parsed.verse < parsedRange.startVerse) return true;
      if (parsed.chapter === parsedRange.endChapter && parsed.verse > parsedRange.endVerse) return true;
      return false;
    });

    if (outsideVerses.length > 0) {
      return {
        isOutsideRange: true,
        outsideVerses,
        note: 'This support comes from outside the selected passage but belongs to the same literary unit.',
      };
    }

    return { isOutsideRange: false, outsideVerses: [], note: '' };
  }

  // ─── Compound Claim Detection ────────────────────────────────

  detectCompoundClaims(
    claimText: string,
    subType: WorkspaceClaimSubType,
  ): WorkspaceClaimSplitSuggestion[] {
    const lower = claimText.toLowerCase();

    // Connector patterns that indicate a compound claim
    const connectorPatterns = [
      /\band\s+this\s+(represents?|means?|shows?|symbolizes?|indicates?|points\s+to|illustrates?|is\s+a\s+type)\b/i,
      /\b,?\s*which\s+(represents?|means?|is|symbolizes?)\b/i,
    ];

    const hasSplitConnector = connectorPatterns.some((p) => p.test(lower));
    if (!hasSplitConnector && claimText.length <= 120) return [];

    // Split by sentences first
    const sentences = claimText.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 10);
    if (sentences.length >= 2) {
      return sentences.map((sentence, index) => ({
        claimText: sentence.trim(),
        claimType: this.classifyClaimType({} as WorkspaceClaimSummary, sentence),
        supportHint: index === 0
          ? 'Needs textual verification'
          : 'Needs theological or study support',
      }));
    }

    // Connector-based split within a single sentence
    if (hasSplitConnector && lower.length > 80) {
      const parts = claimText.split(/\s+(?:,?\s*and\s+this\s+|,?\s*which\s+)(?:represents?|means?|shows?|symbolizes?|indicates?|points\s+to|illustrates?)\s+/i);
      if (parts.length >= 2) {
        return [
          {
            claimText: parts[0].trim(),
            claimType: 'textual_observation',
            supportHint: 'Needs textual verification',
          },
          {
            claimText: parts.slice(1).join('; ').trim(),
            claimType: 'theological_extension',
            supportHint: 'Needs theological or study support',
          },
        ];
      }
    }

    return [];
  }

  // ─── Socratic Questions ──────────────────────────────────────

  generateSocraticQuestions(
    subType: WorkspaceClaimSubType,
    _claimText: string,
  ): string[] {
    return (SOCRATIC_TEMPLATES[subType] || SOCRATIC_TEMPLATES.textual_observation).slice(0, 4);
  }

  // ─── Pastoral Risk ───────────────────────────────────────────

  assessPastoralRisk(
    _claimText: string,
    subType: WorkspaceClaimSubType,
    supportLevel: string,
    homileticalDetected: boolean,
    outsideRange: boolean,
    isCompound: boolean,
    overreach?: TheologicalOverreachResult,
  ): WorkspacePastoralRisk {
    if (overreach?.detected && overreach.riskLevel === 'high') return 'high';
    if (homileticalDetected && supportLevel === 'unsupported') return 'high';
    if (supportLevel === 'unsupported') return 'high';
    if (overreach?.detected) return 'medium';
    if (homileticalDetected) return 'medium';
    if (isCompound && supportLevel !== 'supported') return 'medium';
    if (outsideRange) return 'medium';
    if (subType === 'theological_extension' && supportLevel !== 'supported') return 'medium';
    if (supportLevel === 'needs_review') return 'low';
    if (subType === 'illustration') return 'low';
    if (subType === 'application' && supportLevel === 'partially_supported') return 'low';
    return 'none';
  }

  // ─── Helpers ─────────────────────────────────────────────────

  private buildRiskReason(
    subType: WorkspaceClaimSubType,
    supportLevel: string,
    homiletical: HomileticalImaginationResult,
    outsideRange: OutsideRangeResult,
    overreach: TheologicalOverreachResult,
    _risk: WorkspacePastoralRisk,
  ): string {
    const reasons: string[] = [];
    if (homiletical.detected) reasons.push(`"${homiletical.imaginedDetail}" is not mentioned in the passage text.`);
    if (overreach.detected) reasons.push(overreach.reason);
    if (outsideRange.isOutsideRange) reasons.push(outsideRange.note);
    if (subType === 'theological_extension' && supportLevel !== 'supported') {
      reasons.push('Theological extensions require additional supporting sources.');
    }
    if (supportLevel === 'unsupported') reasons.push('No supporting source found for this claim.');
    if (supportLevel === 'needs_review') reasons.push('Claim should be reviewed for accuracy.');
    return reasons.join(' ') || 'No issues detected.';
  }

  private parseVerseRange(range: string) {
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

  private parseSingleRef(ref: string) {
    // Handle "Luke 15:25-32" or "Luke 15:25"
    const match = ref.match(/^(\d*\s*[A-Za-z]+)\s+(\d+):(\d+)(?:[-–]\d+)?$/i);
    if (!match) return null;
    return {
      book: match[1].trim(),
      chapter: parseInt(match[2], 10),
      verse: parseInt(match[3], 10),
    };
  }

  private extractVerseReferences(text: string): string[] {
    const refRegex = /\b(?:[1-3]\s*)?[A-Z][a-z]+\s+\d+:\d+(?:[-–]\d+)?\b/g;
    return (text.match(refRegex) || []).map((r) => r.trim());
  }
}

// ─── Helpers ────────────────────────────────────────────────────

function lowerClaimContains(claimText: string, word: string): boolean {
  return new RegExp(`\\b${word.replace(/\s/g, '\\s')}\\b`, 'i').test(claimText.toLowerCase());
}

// ─── Theological Overreach Patterns ────────────────────────────

interface OverreachPattern {
  regex: RegExp;
  theme: string;
  defaultRisk: WorkspacePastoralRisk;
  reason: string;
  repair: string;
}

const THEOLOGICAL_OVERREACH_PATTERNS: OverreachPattern[] = [
  {
    regex: /\b(state of the dead|soul.?sleep|sleep in death|unconscious death|dead know nothing|conditional immortality|soul is mortal)\b/i,
    theme: 'State of the Dead',
    defaultRisk: 'high',
    reason: 'Death/life imagery in parables describes relational or spiritual restoration, not anthropological doctrine. Using this passage to support state-of-the-dead may be forced.',
    repair: 'Keep the claim focused on spiritual lostness/restoration unless the sermon explicitly develops state-of-the-dead doctrine with stronger texts such as Ecclesiastes 9:5-6 or 1 Thessalonians 4:13-17.',
  },
  {
    regex: /\b(sanctuary|heavenly sanctuary|priestly ministry|heavenly priest|sanctuary model|sanctuary doctrine|heavenly temple)\b.*\b(?:robe|ring|sandal|father|prodigal|luke\s*15)|(?:robe|ring|sandal|father|prodigal|luke\s*15).*\b(sanctuary|heavenly sanctuary|priestly ministry)\b/i,
    theme: 'Sanctuary Model',
    defaultRisk: 'high',
    reason: 'Connecting the parable details to sanctuary typology is a theological extension. The passage does not establish this connection. This should be stated as application or illustration, not direct meaning.',
    repair: 'Frame this as a theological application: "This restoration can illustrate..." rather than "This represents..." Add Adventist sources that explicitly make this connection.',
  },
  {
    regex: /\b(great controversy|cosmic conflict|satan[\s']*s?(?:attack|role|part)|war in heaven)\b.*\b(?:father|welcome|robe|ring|prodigal|luke\s*15)|(?:father|welcome|robe|ring|prodigal|luke\s*15).*\b(great controversy|cosmic conflict)\b/i,
    theme: 'Great Controversy',
    defaultRisk: 'medium',
    reason: 'Applying Great Controversy themes to the parable is a theological extension. While the father\'s welcome reflects God\'s character, the GC framework is not taught by this passage itself.',
    repair: 'Consider whether the Great Controversy theme adds to or distracts from the parable\'s own pastoral message. If included, label as theological application, not textual meaning.',
  },
  {
    regex: /\b(imparted righteousness|imputed righteousness|righteousness of christ|christ\'s righteousness).*\b(?:robe|ring|prodigal|luke\s*15)|(?:robe|ring|prodigal|luke\s*15).*\b(imparted|imputed|righteousness of christ)\b/i,
    theme: 'Righteousness by Faith',
    defaultRisk: 'medium',
    reason: 'The robe, ring, and sandals are signs of restored status and honor. Reading imputed/imparted righteousness doctrine into these objects is a theological extension beyond the text\'s own categories.',
    repair: 'Frame as theological application rather than direct exegesis. Note that Luke 15:22 describes visible signs of restoration and honor—the doctrinal application is a secondary move.',
  },
];

// ─── Socratic Question Templates ───────────────────────────────

const SOCRATIC_TEMPLATES: Record<WorkspaceClaimSubType, string[]> = {
  textual_observation: [
    'What does the text explicitly say?',
    'Is any detail added that the passage does not mention?',
    'Does the cited verse directly support this observation?',
  ],
  interpretation: [
    'What other interpretations are possible?',
    'Does this interpretation fit the passage\'s genre and context?',
    'Is the claim too strong for the evidence?',
  ],
  theological_extension: [
    'Is this connection directly taught by the passage or applied from broader theology?',
    'What additional Scripture or Adventist source supports this connection?',
    'Would the listener understand this as application rather than original meaning?',
  ],
  application: [
    'Does this application flow naturally from the text?',
    'Could this burden the listener instead of inviting them?',
    'Is the appeal shaped by grace and truth?',
  ],
  illustration: [
    'Is this clearly marked as illustration rather than textual fact?',
    'Could the illustration distract from the passage?',
    'Is any imagined detail being presented as biblical detail?',
  ],
  external_reference: [
    'Is the quotation accurately sourced?',
    'Does the source directly support the claim or only share a theme?',
    'Should this be quoted, summarized, or removed?',
  ],
  wider_context: [
    'Is this outside the selected passage range?',
    'Does the wider context clarify or distract from the selected passage?',
    'Should this be labeled as wider literary context rather than direct support?',
  ],
};
