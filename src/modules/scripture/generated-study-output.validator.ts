import { Injectable } from '@nestjs/common';
import { extractVerseNumber, parseScriptureReference } from './scripture-helpers';
import type { GeneratedStudyResult, GeneratedStudyStatus } from '../../../../../shared/generated-study-output.contract';

export type GeneratedStudyModuleKey =
  | 'passage-summary'
  | 'passage-movement'
  | 'historical-context'
  | 'translation-comparison'
  | 'verse-commentary'
  | 'structural-analysis'
  | 'interpretive-challenges'
  | 'canonical-themes'
  | 'study-synthesis'
  | 'study-report'
  | 'verse-context';

export interface GeneratedStudyValidationResult {
  valid: boolean;
  severity: 'none' | 'low' | 'medium' | 'high';
  errors: string[];
  normalized?: GeneratedStudyResult;
}

interface ValidationContext {
  reference?: string;
  language?: string;
}

const forbiddenTokens = [
  'fallback',
  'social',
  'custom',
  'template',
  'placeholder',
  'debug',
  'todo',
  'undefined',
  'null',
];

const forbiddenPhrases = [
  'generated',
  'ready',
  'completed',
  'stored in the workspace',
  'run cross-reference lookup',
  'passage summary is generated and stored in the workspace',
  'generate this section',
  'click generate',
  'this verse summarizes the passage’s central truth',
  "this verse summarizes the passage's central truth",
  'use it to introduce the scene',
  'preach this verse as a clear',
  'move it toward faith response',
  'name one or two key words',
  'if no specific historical data is available',
  'state the passage',
  'show how',
  'explain that',
  'write a summary',
  'the passage is not just a statement of truth',
  'the passage calls for a response of faith',
  'this context helps the preacher distinguish',
  'the passage belongs to the literary setting of',
  'immediate narrative or doctrinal flow',
  'gospel summary',
  'narrative or doctrinal flow',
  'literary setting of psalm',
  'historical context could not be generated',
];

const versePrefixPattern = /^\s*\d+:\d+\s*[:.]\s*…?\s*$/;
const verseReferenceFragmentPattern = /^\s*[A-Za-zÀ-ÿ][\wÀ-ÿ'.-]*\s+\d+:\d+\s*:\s*…?\s*$/;

@Injectable()
export class GeneratedStudyOutputValidator {
  validate(moduleKey: GeneratedStudyModuleKey, output: unknown, context: ValidationContext = {}): GeneratedStudyValidationResult {
    const status = this.readStatus(output);
    const errors: string[] = [];
    const contentOnly = this.stripMetaFields(output);

    if (status === 'not_generated') {
      if (!this.isCleanEmptyState(moduleKey, output)) {
        errors.push('not_generated payload contains pastor-facing content');
      }
      return this.buildResult(errors, moduleKey, output, context, status);
    }

    if (status === 'unavailable') {
      if (!this.isCleanUnavailableState(moduleKey, output)) {
        errors.push('unavailable payload contains pastor-facing content');
      }
      return this.buildResult(errors, moduleKey, output, context, status);
    }

    if (output === null || output === undefined) {
      errors.push('missing generated output');
      return this.buildResult(errors, moduleKey, output, context, 'not_generated');
    }

    const serial = this.flattenText(contentOnly).toLowerCase();
    this.forbidScaffoldText(serial, errors);

    switch (moduleKey) {
      case 'passage-summary':
        this.validatePassageSummary(output, context, errors);
        break;
      case 'study-synthesis':
        this.validateStudySynthesis(output, context, errors);
        break;
      case 'structural-analysis':
        this.validateStructuralAnalysis(output, context, errors);
        break;
      case 'interpretive-challenges':
        this.validateInterpretiveChallenges(output, errors);
        break;
      case 'canonical-themes':
        this.validateCanonicalThemes(output, context, errors);
        break;
      case 'verse-commentary':
        this.validateVerseCommentary(output, errors);
        break;
      case 'translation-comparison':
        this.validateTranslationComparison(output, context, errors);
        break;
      case 'verse-context':
        this.validateVerseContext(output, context, errors);
        break;
      case 'study-report':
        this.validateStudyReport(output, errors);
        break;
      case 'passage-movement':
        this.validatePassageMovement(output, errors);
        break;
      case 'historical-context':
        this.validateHistoricalContext(output, errors);
        break;
      default:
        break;
    }

    return this.buildResult(errors, moduleKey, output, context, status || 'ready');
  }

  buildUnavailableResult(
    moduleKey: GeneratedStudyModuleKey,
    reference: string,
    language: string,
    message: string,
    warnings: string[] = [],
    source: GeneratedStudyResult['source'] = 'llm-generated',
  ): GeneratedStudyResult {
    return {
      status: 'unavailable',
      moduleKey,
      reference,
      language,
      source,
      data: [],
      message,
      warnings,
      internalValidationErrors: [],
    };
  }

  private buildResult(
    errors: string[],
    moduleKey: GeneratedStudyModuleKey,
    output: unknown,
    context: ValidationContext,
    status: GeneratedStudyStatus,
  ): GeneratedStudyValidationResult {
    const severity = errors.length === 0 ? 'none' : errors.some((item) => /forbidden|missing|required|partial|truncated|invalid|misalign|scaffold/i.test(item)) ? 'high' : 'medium';
    return {
      valid: errors.length === 0,
      severity,
      errors,
      normalized: {
        status,
        moduleKey,
        reference: this.cleanReference(context.reference || this.extractReferenceFromOutput(output) || ''),
        language: this.cleanLanguage(context.language || this.extractLanguageFromOutput(output) || 'en'),
        source: this.extractSourceFromOutput(output) || 'llm-generated',
        data: output as GeneratedStudyResult['data'],
        message: status === 'ready' ? undefined : this.cleanText(this.extractMessageFromOutput(output) || 'Historical context could not be generated. Please retry.'),
        warnings: this.extractWarnings(output),
        internalValidationErrors: errors,
      },
    };
  }

  private readStatus(output: unknown): GeneratedStudyStatus | null {
    if (!output || typeof output !== 'object' || Array.isArray(output)) return null;
    const status = (output as Record<string, unknown>).status;
    return status === 'ready' || status === 'not_generated' || status === 'unavailable' ? status : null;
  }

  private isCleanEmptyState(moduleKey: GeneratedStudyModuleKey, output: unknown): boolean {
    if (!output || typeof output !== 'object' || Array.isArray(output)) return true;
    const serial = this.flattenText(this.stripMetaFields(output)).toLowerCase();
    if (serial.trim()) return false;
    switch (moduleKey) {
      case 'translation-comparison':
        return Array.isArray((output as any).translations) ? (output as any).translations.length === 0 : true;
      case 'verse-commentary':
        return Array.isArray((output as any).notes) ? (output as any).notes.length === 0 : true;
      case 'canonical-themes':
        return Array.isArray((output as any).themes) ? (output as any).themes.length === 0 : true;
      case 'structural-analysis':
        return Array.isArray((output as any).structure) ? (output as any).structure.length === 0 : true;
      case 'interpretive-challenges':
        return Array.isArray((output as any).views) ? (output as any).views.length === 0 : true;
      case 'study-synthesis':
        return !this.hasAnyMeaningfulField(output, ['centralClaim', 'canonicalSignificance', 'pastoralTakeaway', 'preachingFocus']);
      case 'passage-summary':
        return !this.hasAnyMeaningfulField(output, ['summary', 'interpretiveCenter', 'mainTension']) && (!Array.isArray((output as any).movement) || (output as any).movement.length === 0);
      case 'verse-context':
        return Array.isArray((output as any).sections) ? (output as any).sections.length === 0 : true;
      case 'study-report':
        return !this.hasAnyMeaningfulField(output, ['passageOverview', 'literaryContext', 'historicalContext', 'canonicalContext', 'exegeticalSummary', 'mainTheologicalClaim']);
      default:
        return true;
    }
  }

  private isCleanUnavailableState(moduleKey: GeneratedStudyModuleKey, output: unknown): boolean {
    if (!output || typeof output !== 'object' || Array.isArray(output)) return true;
    const serial = this.flattenText(this.stripMetaFields(output)).toLowerCase();
    if (forbiddenPhrases.some((phrase) => serial.includes(phrase))) return false;
    if (forbiddenTokens.some((token) => new RegExp(`\\b${token}\\b`, 'i').test(serial))) return false;
    return this.isCleanEmptyState(moduleKey, output);
  }

  private forbidScaffoldText(serialized: string, errors: string[]): void {
    for (const token of forbiddenTokens) {
      if (new RegExp(`\\b${token}\\b`, 'i').test(serialized)) {
        errors.push(`forbidden token: ${token}`);
      }
    }
    for (const phrase of forbiddenPhrases) {
      const isShortStatusWord = ['generated', 'ready', 'completed'].includes(phrase);
      const matched = isShortStatusWord
        ? new RegExp(`\\b${phrase}\\b`, 'i').test(serialized)
        : serialized.includes(phrase);
      if (matched) {
        errors.push(`forbidden scaffold phrase: ${phrase}`);
      }
    }
    if (versePrefixPattern.test(serialized.trim()) || verseReferenceFragmentPattern.test(serialized.trim())) {
      errors.push('partial verse fragment detected');
    }
    if (/:\\s*…$/.test(serialized.trim()) || /:\s*\.\.\.$/.test(serialized.trim())) {
      errors.push('ellipsis fragment detected');
    }
  }

  private validatePassageSummary(output: unknown, context: ValidationContext, errors: string[]): void {
    const summary = this.readField(output, ['summary', 'overview', 'passageOverview']);
    const center = this.readField(output, ['interpretiveCenter', 'center', 'centralTruth']);
    const movement = this.readArray(output, ['movement', 'exegeticalFlow']);
    const expected = this.getExpectedVerseNumbers(this.cleanReference(context.reference || this.extractReferenceFromOutput(output) || ''));
    if (!summary || !center) {
      errors.push('passage summary is missing summary or interpretive center');
    }
    if (summary && this.startsWithReference(summary, context.reference)) {
      errors.push('passage summary starts with raw verse reference');
    }
    if (movement.length < 1) {
      errors.push('passage movement requires at least 1 statement');
    }
    if (expected.length > 2 && movement.length < 3) {
      errors.push('multi-verse passage summary requires semantic movement across the passage');
    }
    if (movement.some((item) => this.isPromptInstruction(item) || this.isRawVerseLike(item))) {
      errors.push('passage movement contains prompt instruction or raw verse text');
    }
    if (this.containsGenericVersePrefix(summary) || this.containsGenericVersePrefix(center)) {
      errors.push('passage summary contains raw verse prefix');
    }
  }

  private validatePassageMovement(output: unknown, errors: string[]): void {
    const movement = this.readArray(output, ['movement', 'exegeticalFlow']);
    const reference = this.cleanReference(this.extractReferenceFromOutput(output));
    const expected = this.getExpectedVerseNumbers(reference);
    if (movement.length < 2) {
      errors.push('passage movement requires at least 2 statements');
      return;
    }
    if (expected.length > 2 && movement.length < 3) {
      errors.push('multi-verse passage movement requires at least 3 semantic statements');
    }
    if (movement.some((item) => this.isPromptInstruction(item) || this.isRawVerseLike(item))) {
      errors.push('passage movement contains prompt instruction or raw verse text');
    }
    if (movement.some((item) => this.isFragmentOnlyText(String(item || '')))) {
      errors.push('passage movement contains fragment-only text');
    }
  }

  private validateStudySynthesis(output: unknown, context: ValidationContext, errors: string[]): void {
    const claim = this.readField(output, ['centralClaim', 'mainTheologicalClaim']);
    const canonical = this.readField(output, ['canonicalSignificance', 'canonicalContext']);
    const takeaway = this.readField(output, ['pastoralTakeaway', 'preachingFocus']);
    const expected = this.getExpectedVerseNumbers(this.cleanReference(context.reference || this.extractReferenceFromOutput(output) || ''));
    if (!claim || !canonical || !takeaway) {
      errors.push('study synthesis missing required fields');
    }
    if (claim && this.startsWithReference(claim, context.reference)) {
      errors.push('study synthesis central claim starts with raw verse reference');
    }
    if (expected.length > 2 && this.isFragmentOnlyText(claim)) {
      errors.push('study synthesis central claim is too thin for a multi-verse passage');
    }
    if (this.containsGenericGospelSummary(this.flattenText(output))) {
      errors.push('study synthesis uses generic gospel summary language');
    }
  }

  private validateStructuralAnalysis(output: unknown, context: ValidationContext, errors: string[]): void {
    const genre = this.readField(output, ['literaryGenre', 'genre']);
    const structure = this.readArray(output, ['structure']);
    const expected = this.getExpectedVerseNumbers(this.cleanReference(context.reference || this.extractReferenceFromOutput(output) || ''));
    if (!genre) {
      errors.push('structural analysis missing genre');
    }
    if (structure.length < 2) {
      errors.push('structural analysis requires at least 2 structural units');
    }
    if (expected.length > 1) {
      const flattened = JSON.stringify(structure).toLowerCase();
      const finalVerse = expected[expected.length - 1];
      if (!new RegExp(`\\b${finalVerse}\\b`).test(flattened)) {
        errors.push('structural analysis omits the final verse or final unit');
      }
    }
    if (structure.some((item) => this.isPromptInstruction(item) || this.isRawVerseLike(item))) {
      errors.push('structural analysis contains prompt instruction or raw verse text');
    }
    if (JSON.stringify(structure).includes('…') || JSON.stringify(structure).includes('...')) {
      errors.push('structural analysis contains ellipsis fragment');
    }
    if (this.isPsalmReference(context.reference) && /narrative|expository/i.test(genre || '')) {
      errors.push('psalm structural analysis misclassifies genre');
    }
  }

  private validateInterpretiveChallenges(output: unknown, errors: string[]): void {
    const challenge = this.readField(output, ['challenge', 'question']);
    const views = this.readArray(output, ['views']);
    if (!challenge || views.length === 0) {
      errors.push('interpretive challenges missing question or views');
    }
    if (views.some((item) => this.isPromptInstruction(item) || this.isRawVerseLike(item))) {
      errors.push('interpretive challenges contain prompt instruction or raw verse text');
    }
  }

  private validateCanonicalThemes(output: unknown, context: ValidationContext, errors: string[]): void {
    const themes = this.readArray(output, ['themes']);
    if (themes.length === 0) {
      errors.push('canonical themes missing theme threads');
    }
    const reference = this.cleanReference(context.reference || this.extractReferenceFromOutput(output) || '');
    const expectedVerses = this.getExpectedVerseNumbers(reference);
    const flattened = this.flattenText(output);
    if (expectedVerses.length > 2 && themes.length < 3) {
      errors.push('canonical themes too thin for multi-verse passage');
    }
    if (themes.some((theme) => !this.readField(theme, ['theme', 'name']) || !this.readField(theme, ['passageAnchor']) || !this.readField(theme, ['preachingUse']))) {
      errors.push('canonical themes missing theme name, passage anchor, or preaching use');
    }
    if (themes.some((theme) => {
      const development = this.readArray(theme, ['development', 'verses']);
      return development.length === 0;
    }) && !this.readArray(output, ['warnings']).length) {
      errors.push('canonical themes missing development steps without warning');
    }
    const genericThemeNames = themes
      .map((theme) => this.readField(theme, ['theme', 'name']).toLowerCase())
      .filter(Boolean)
      .filter((name) => /^(gospel|salvation|grace|faith|response)$/.test(name));
    if (genericThemeNames.length === themes.length && themes.length > 0) {
      errors.push('canonical themes are generic only');
    }
    if (this.containsCanonicalThemeBoilerplate(this.flattenText(output))) {
      errors.push('canonical themes use generic boilerplate language');
    }
    if (this.isPsalmReference(context.reference) && !/steps|righteous|path|trust|wicked|uphold|guidance|stumble/i.test(flattened)) {
      errors.push('canonical themes missing Psalm 37 specific motif language');
    }
    if (/^Luke 15:11-24$/i.test(reference) && !/restor|repent|lost|found|sonship|welcome|shame/i.test(flattened)) {
      errors.push('canonical themes missing Luke 15 restoration motifs');
    }
    if (/^Revelation 14:6-12$/i.test(reference) && (!/everlasting gospel/i.test(flattened) || !/creator worship|worship the creator|creator/i.test(flattened) || !/babylon|deception/i.test(flattened) || !/endurance|saints|faith of jesus|commandments/i.test(flattened))) {
      errors.push('canonical themes missing Revelation 14 motif coverage');
    }
  }

  private validateVerseCommentary(output: unknown, errors: string[]): void {
    const notes = this.readArray(output, ['notes']);
    if (notes.length === 0) {
      errors.push('verse commentary notes missing');
    }
    if (notes.some((item) => this.isPromptInstruction(item) || this.isRawVerseLike(item))) {
      errors.push('verse commentary contains prompt instruction or raw verse text');
    }
  }

  private validateTranslationComparison(output: unknown, context: ValidationContext, errors: string[]): void {
    const translations = this.readArray(output, ['translations']);
    if (translations.length < 2) {
      errors.push('translation comparison needs at least 2 translations');
    }
    const reference = this.cleanReference(context.reference || this.extractReferenceFromOutput(output) || '');
    const expected = this.getExpectedVerseNumbers(reference);
    if (expected.length > 0) {
      for (const translation of translations) {
        const verses = Array.isArray((translation as any)?.verses) ? (translation as any).verses : [];
        const numbers = verses.map((verse: any) => Number(extractVerseNumber(String(verse?.reference || verse?.number || '')) || verse?.number || NaN)).filter(Number.isFinite);
        if (numbers.length && numbers.some((num) => !expected.includes(num))) {
          errors.push(`translation comparison row misaligned for ${String((translation as any)?.code || 'unknown')}`);
        }
        const texts = verses.map((verse: any) => this.cleanText(verse?.text || '')).filter(Boolean);
        if (verses.some((verse: any) => this.isFragmentOnlyText(String(verse?.text || '')))) {
          errors.push('translation comparison contains fragment-only verse text');
        }
        if (texts.length > 1) {
          const uniqueTexts = new Set(texts.map((text) => text.toLowerCase()));
          if (uniqueTexts.size !== texts.length) {
            errors.push(`translation comparison contains repeated verse text for ${String((translation as any)?.code || 'unknown')}`);
          }
        }
      }
    }
  }

  private validateVerseContext(output: unknown, context: ValidationContext, errors: string[]): void {
    const sections = this.readArray(output, ['sections']);
    if (sections.length < 5) {
      errors.push('verse context missing required sections');
    }
    if (sections.some((item) => this.isPromptInstruction(item) || this.isRawVerseLike(item))) {
      errors.push('verse context contains prompt instruction or raw verse text');
    }
    if (this.isPsalmReference(context.reference) && !/wisdom|poetry|worship|trust|wicked|steps|uphold/i.test(this.flattenText(output))) {
      errors.push('psalm verse context missing wisdom-poetry language');
    }
  }

  private validateHistoricalContext(output: unknown, errors: string[]): void {
    const sections = this.readArray(output, ['sections']);
    if (sections.length < 5) {
      errors.push('historical context missing required sections');
    }
    if (this.flattenText(output).match(/\b(post[-\s]?exilic|second temple|persian period|babylonian exile|monarchic period)\b/i)) {
      errors.push('unsupported speculative historical claim');
    }
  }

  private validateStudyReport(output: unknown, errors: string[]): void {
    const required = ['passageOverview', 'literaryContext', 'historicalContext', 'canonicalContext', 'exegeticalSummary', 'mainTheologicalClaim'];
    for (const field of required) {
      if (!this.cleanText((output as Record<string, unknown>)?.[field])) {
        errors.push(`study report missing ${field}`);
      }
    }
    const flow = this.readArray(output, ['exegeticalFlow']);
    const structure = this.readArray(output, ['structureOfPassage']);
    const keyTerms = this.readArray(output, ['keyTerms']);
    const themes = this.readArray(output, ['theologicalThemes']);
    const challenges = this.readArray(output, ['interpretiveChallenges']);
    if (flow.length < 2) errors.push('study report exegeticalFlow too thin');
    if (structure.length < 2) errors.push('study report structureOfPassage too thin');
    if (keyTerms.length < 2) errors.push('study report keyTerms too thin');
    if (themes.length < 2) errors.push('study report theologicalThemes too thin');
    if (challenges.length < 1) errors.push('study report interpretiveChallenges too thin');
  }

  private isPromptInstruction(value: unknown): boolean {
    const text = this.cleanText(value).toLowerCase();
    return [
      'state the passage',
      'show how',
      'explain that',
      'preach this verse',
      'move it toward faith response',
      'name one or two key words',
      'if no specific historical data is available',
      'write a summary',
      'use it to introduce the scene',
      'run cross-reference lookup',
      'passage summary is generated and stored in the workspace',
    ].some((phrase) => text.includes(phrase));
  }

  private isRawVerseLike(value: unknown): boolean {
    const text = this.cleanText(value);
    if (!text) return false;
    return /^\s*[A-Za-zÀ-ÿ][\wÀ-ÿ'.-]*\s+\d+:\d+[:.]?\s*…?\s*$/i.test(text)
      || /verse\s+\d+[:.]?\s*…?/i.test(text)
      || /\.\.\.$/.test(text.trim());
  }

  private containsGenericVersePrefix(text: string): boolean {
    const cleaned = this.cleanText(text);
    if (!cleaned) return false;
    return /^\s*[A-Za-zÀ-ÿ][\wÀ-ÿ'.-]*\s+\d+:\d+[:.]/i.test(cleaned) || /^\s*\d+:\d+[:.]/i.test(cleaned);
  }

  private isFragmentOnlyText(text: string): boolean {
    const cleaned = this.cleanText(text);
    if (!cleaned) return true;
    if (cleaned.length < 10) return true;
    if (/^for\s+the\s+lord\b/i.test(cleaned)) return true;
    if (/^for\s+yahweh\s+holds\s+him\s+up\s+with\s+his\s+hand$/i.test(cleaned)) return true;
    return this.isRawVerseLike(cleaned);
  }

  private containsGenericGospelSummary(serialized: string): boolean {
    return [
      'gospel summary',
      'not just a statement of truth',
      'call to response',
      'response of faith',
      'central truth',
    ].some((phrase) => serialized.includes(phrase));
  }

  private containsCanonicalThemeBoilerplate(serialized: string): boolean {
    return [
      'gospel summary',
      'the canonical movement remains',
      'god’s plan unfolding',
      "god's plan unfolding",
      'canonical themes trace how biblical ideas develop across scripture',
    ].some((phrase) => serialized.includes(phrase));
  }

  private hasAnyMeaningfulField(output: unknown, fields: string[]): boolean {
    if (!output || typeof output !== 'object') return false;
    return fields.some((field) => this.cleanText((output as Record<string, unknown>)[field]));
  }

  private readField(output: unknown, fields: string[]): string {
    if (!output || typeof output !== 'object') return '';
    for (const field of fields) {
      const value = this.cleanText((output as Record<string, unknown>)[field]);
      if (value) return value;
    }
    return '';
  }

  private readArray(output: unknown, fields: string[]): any[] {
    if (!output || typeof output !== 'object') return [];
    for (const field of fields) {
      const value = (output as Record<string, unknown>)[field];
      if (Array.isArray(value)) {
        return value;
      }
    }
    return [];
  }

  private flattenText(value: unknown): string {
    const parts: string[] = [];
    const walk = (input: unknown): void => {
      if (input === null || input === undefined) return;
      if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        parts.push(String(input));
        return;
      }
      if (Array.isArray(input)) {
        input.forEach(walk);
        return;
      }
      if (typeof input === 'object') {
        for (const item of Object.values(input as Record<string, unknown>)) {
          walk(item);
        }
      }
    };
    walk(value);
    return parts.join(' ');
  }

  private stripMetaFields(value: unknown): unknown {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
    const metaKeys = new Set(['status', 'moduleKey', 'reference', 'language', 'source', 'dataSource', 'message', 'warnings', 'internalValidationErrors']);
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (metaKeys.has(key)) continue;
      next[key] = this.stripMetaFields(item);
    }
    return next;
  }

  private cleanText(value: unknown): string {
    return String(value ?? '').replace(/\s+/g, ' ').trim();
  }

  private cleanReference(reference: string): string {
    return this.cleanText(reference).replace(/\u2013|\u2014/g, '-');
  }

  private cleanLanguage(language: string): string {
    return this.cleanText(language).toLowerCase() || 'en';
  }

  private extractReferenceFromOutput(output: unknown): string {
    if (!output || typeof output !== 'object') return '';
    return this.cleanText((output as Record<string, unknown>).reference || (output as Record<string, unknown>).passage || '');
  }

  private extractLanguageFromOutput(output: unknown): string {
    if (!output || typeof output !== 'object') return '';
    return this.cleanText((output as Record<string, unknown>).language || '');
  }

  private extractSourceFromOutput(output: unknown): GeneratedStudyResult['source'] {
    if (!output || typeof output !== 'object') return 'llm-generated';
    const source = this.cleanText((output as Record<string, unknown>).source || '');
    if (source === 'computed' || source === 'scripture' || source === 'egw' || source === 'mixed') {
      return source;
    }
    return 'llm-generated';
  }

  private extractMessageFromOutput(output: unknown): string {
    if (!output || typeof output !== 'object') return '';
    return this.cleanText((output as Record<string, unknown>).message || '');
  }

  private extractWarnings(output: unknown): string[] {
    if (!output || typeof output !== 'object') return [];
    const warnings = (output as Record<string, unknown>).warnings;
    return Array.isArray(warnings) ? warnings.map((item) => this.cleanText(item)).filter(Boolean) : [];
  }

  private startsWithReference(text: string, reference?: string): boolean {
    const ref = this.cleanReference(reference || '');
    if (!ref) return false;
    const cleanedText = this.cleanText(text).toLowerCase();
    if (cleanedText.startsWith(ref.toLowerCase())) return true;
    const parsed = parseScriptureReference(ref);
    if (!parsed) return false;
    const book = this.cleanText(parsed.book).replace(/\s+/g, '\\s+');
    const citationPrefix = new RegExp(`^\\s*${book}\\s+${parsed.chapter}:\\d+`, 'i');
    return citationPrefix.test(this.cleanText(text));
  }

  private isPsalmReference(reference?: string): boolean {
    return /^ps(?:alm)?\s+37/i.test(this.cleanReference(reference || ''));
  }

  private getExpectedVerseNumbers(reference: string): number[] {
    const parsed = parseScriptureReference(reference);
    if (!parsed) return [];
    const start = Number(parsed.verseStart);
    const end = Number(parsed.verseEnd ?? parsed.verseStart);
    if (!Number.isFinite(start)) return [];
    if (!Number.isFinite(end) || end < start) return [start];
    const result: number[] = [];
    for (let verse = start; verse <= end; verse += 1) {
      result.push(verse);
    }
    return result;
  }
}
