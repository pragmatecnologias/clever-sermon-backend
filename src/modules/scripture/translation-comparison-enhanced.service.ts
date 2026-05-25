import { Injectable } from '@nestjs/common';
import { ScriptureService } from './scripture.service';
import { LlmService } from '../llm/llm.service';
import { ScripturePrompts } from './scripture-prompts';
import { cleanVerseText, extractVerseNumber } from './scripture-helpers';
import { GeneratedStudyOutputValidator } from './generated-study-output.validator';

export interface EnhancedTranslationComparison {
  reference: string;
  translations: TranslationText[];
  keyDifferences: KeyDifference[];
  analysis: ComparisonAnalysis;
  status?: 'ready' | 'not_generated' | 'unavailable';
  message?: string;
  warnings?: string[];
  source?: 'llm-generated' | 'computed' | 'scripture' | 'egw' | 'mixed' | 'unavailable';
}

export interface TranslationText {
  code: string;
  name: string;
  text: string;
  verses?: Array<{ number: string; text: string; reference?: string }>;
  type: 'formal' | 'dynamic' | 'paraphrase';
}

export interface KeyDifference {
  category: 'theological_term' | 'verb_difference' | 'literal_vs_dynamic' | 'addition_omission';
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
  constructor(
    private scriptureService: ScriptureService,
    private llmService: LlmService,
    private generatedStudyOutputValidator: GeneratedStudyOutputValidator,
  ) {}

  private tryJsonParse(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  private stripTransportNoise(text: string): string {
    return String(text || '')
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .replace(/<\|[^|>]+?\|>/g, ' ')
      .replace(/\r\n/g, '\n')
      .trim();
  }

  private extractBalancedJsonSegment(text: string): string | null {
    const source = this.stripTransportNoise(text);
    const startIndex = source.search(/[\{\[]/);
    if (startIndex < 0) return null;

    const openChar = source[startIndex];
    const closeChar = openChar === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escapeNext = false;

    for (let index = startIndex; index < source.length; index += 1) {
      const char = source[index];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;

      if (char === openChar) depth += 1;
      if (char === closeChar) {
        depth -= 1;
        if (depth === 0) {
          return source.slice(startIndex, index + 1);
        }
      }
    }

    return null;
  }

  private parseComparisonPayload(rawResponse: string): any | null {
    const cleaned = this.stripTransportNoise(rawResponse);
    if (!cleaned) return null;

    const direct = this.tryJsonParse(cleaned);
    if (direct) return direct;

    const balanced = this.extractBalancedJsonSegment(cleaned);
    if (balanced) {
      const parsedBalanced = this.tryJsonParse(balanced);
      if (parsedBalanced) return parsedBalanced;
    }

    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      const parsedMatch = this.tryJsonParse(objectMatch[0]);
      if (parsedMatch) return parsedMatch;
    }

    return null;
  }

  private async repairComparisonPayload(
    rawResponse: string,
    isSpanish: boolean,
    userId?: string,
  ): Promise<any | null> {
    const prompt = ScripturePrompts.translationComparisonRepair({ rawResponse, isSpanish });

    try {
      const repaired = await this.llmService.generateCompletion(prompt, userId || 'system', {
        temperature: 0.1,
        maxTokens: 1200,
      });
      return this.parseComparisonPayload(repaired);
    } catch {
      return null;
    }
  }

  async getEnhancedComparison(reference: string, language: string = 'en', userId?: string): Promise<EnhancedTranslationComparison | null> {
    const translationCodes = this.getTranslationsForLanguage(language);
    const translations: TranslationText[] = [];

    try {
      if (translationCodes.length < 2) {
        return this.buildUnavailableComparison(reference, language, ['Translation comparison requires at least two translations.']);
      }

      // Fetch passage text from multiple translations
      for (const code of translationCodes) {
        try {
          const result = await this.scriptureService.getPassage(reference, code);
          if (result && result.verses && result.verses.length > 0) {
            const text = result.verses.map((v: any) => cleanVerseText(v.text)).join(' ');
            const verses = result.verses.map((v: any, index: number) => {
              const ref = String(v?.reference || '');
              return {
                number: String(extractVerseNumber(ref) || index + 1),
                text: cleanVerseText(String(v?.text || '')),
                reference: ref || undefined,
              };
            });

            translations.push({
              code,
              name: this.getTranslationName(code),
              text,
              verses,
              type: this.getTranslationType(code)
            });
          }
        } catch (error) {
          console.error(`Failed to fetch ${code} for ${reference}:`, error);
        }
      }

      if (translations.length < 2) {
        return this.buildUnavailableComparison(reference, language, ['Translation comparison could not be generated. Please retry.']);
      }

      // Use LLM to analyze differences
      const analysis = await this.analyzeDifferences(reference, translations, language, userId);

      const comparison: EnhancedTranslationComparison = {
        reference,
        translations,
        keyDifferences: analysis.keyDifferences,
        analysis: analysis.analysis,
        status: 'ready',
        warnings: [],
        source: 'llm-generated',
      };
      const validation = this.generatedStudyOutputValidator.validate('translation-comparison', comparison, { reference, language });
      if (!validation.valid) {
        return this.buildUnavailableComparison(reference, language, validation.errors);
      }
      return comparison;
    } catch (error) {
      console.error('Error generating translation comparison:', error);
      return this.buildUnavailableComparison(reference, language, ['Translation comparison could not be generated. Please retry.']);
    }
  }

  private async buildFallbackTranslations(reference: string, translationCodes: string[]): Promise<TranslationText[]> {
    const codes = translationCodes.length > 0 ? translationCodes : ['KJV', 'WEB'];
    const translated: TranslationText[] = []
    for (const code of codes) {
      try {
        const result = await this.scriptureService.getPassage(reference, code)
        if (result && result.verses && result.verses.length > 0) {
          const verses = result.verses.map((v: any, index: number) => {
            const ref = String(v?.reference || '');
            return {
              number: String(extractVerseNumber(ref) || index + 1),
              text: cleanVerseText(String(v?.text || '')),
              reference: ref || undefined,
            };
          });
          translated.push({
            code,
            name: this.getTranslationName(code),
            text: result.verses.map((v: any) => cleanVerseText(String(v?.text || ''))).join(' '),
            verses,
            type: this.getTranslationType(code),
          });
        }
      } catch {
        // continue
      }
    }
    if (translated.length === 0) {
      translated.push({
        code: codes[0] || 'KJV',
        name: this.getTranslationName(codes[0] || 'KJV'),
        text: reference,
        verses: [{ number: '1', text: reference, reference }],
        type: this.getTranslationType(codes[0] || 'KJV'),
      });
    }
    return translated;
  }

  private getTranslationsForLanguage(language: string): string[] {
    if (language === 'es' || language === 'spanish') {
      // Spanish translations
      return ['NBLA', 'RVR1960', 'NVI'];
    } else {
      // English translations (default): prioritize broadly available providers first.
      return ['KJV', 'WEB', 'ASV', 'NIV', 'ESV', 'NASB'];
    }
  }

  private getTranslationName(code: string): string {
    const names: Record<string, string> = {
      'KJV': 'King James Version',
      'WEB': 'World English Bible',
      'ASV': 'American Standard Version',
      'NIV': 'New International Version',
      'ESV': 'English Standard Version',
      'NASB': 'New American Standard Bible',
      'NLT': 'New Living Translation',
      'NKJV': 'New King James Version',
      'NBLA': 'Nueva Biblia de las Américas',
      'RVR1960': 'Reina-Valera 1960',
      'NVI': 'Nueva Versión Internacional'
    };
    return names[code] || code;
  }

  private getTranslationType(code: string): 'formal' | 'dynamic' | 'paraphrase' {
    const types: Record<string, 'formal' | 'dynamic' | 'paraphrase'> = {
      'KJV': 'formal',
      'WEB': 'formal',
      'ASV': 'formal',
      'NASB': 'formal',
      'ESV': 'formal',
      'NKJV': 'formal',
      'NIV': 'dynamic',
      'NLT': 'paraphrase',
      'NBLA': 'formal',
      'RVR1960': 'formal',
      'NVI': 'dynamic'
    };
    return types[code] || 'formal';
  }

  private async analyzeDifferences(
    reference: string,
    translations: TranslationText[],
    language: string,
    userId?: string
  ): Promise<{ keyDifferences: KeyDifference[]; analysis: ComparisonAnalysis }> {
    try {
      const translationTexts = translations.map(t => `**${t.code} (${t.name})**:\n${t.text}`).join('\n\n');
      const isSpanish = language === 'es' || language === 'spanish';

      const prompt = ScripturePrompts.translationComparisonAnalyze({
        isSpanish,
        reference,
        translationTexts,
      });

      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 1500,
          timeoutMs: 12000,
        }
      );

      let parsed = this.parseComparisonPayload(response);
      if (!parsed) {
        parsed = await this.repairComparisonPayload(response, isSpanish, userId);
      }
      if (!parsed) {
        throw new Error('Unable to parse translation-comparison JSON payload');
      }

      const result = {
        keyDifferences: Array.isArray(parsed.keyDifferences) 
          ? parsed.keyDifferences.slice(0, 5).map((diff: any) => ({
              category: diff.category || 'theological_term',
              translations: Array.isArray(diff.translations) ? diff.translations : [],
              difference: String(diff.difference || '').substring(0, 200),
              explanation: String(diff.explanation || '').substring(0, 500),
              significance: ['high', 'medium', 'low'].includes(diff.significance) ? diff.significance : 'medium'
            }))
          : [],
        analysis: {
          verbDifferences: Array.isArray(parsed.analysis?.verbDifferences) 
            ? parsed.analysis.verbDifferences.slice(0, 5) 
            : [],
          theologicalTermDifferences: Array.isArray(parsed.analysis?.theologicalTermDifferences)
            ? parsed.analysis.theologicalTermDifferences.slice(0, 5)
            : [],
          literalVsDynamic: Array.isArray(parsed.analysis?.literalVsDynamic)
            ? parsed.analysis.literalVsDynamic.slice(0, 5)
            : [],
          overallAssessment: String(parsed.analysis?.overallAssessment || '').substring(0, 500)
        }
      };

      if (
        !result.analysis.overallAssessment ||
        result.keyDifferences.length < 1 ||
        result.analysis.overallAssessment.length < 60
      ) {
        return this.buildUnavailableComparison(reference, language, ['Translation comparison analysis failed validation. Please retry.']);
      }

      if (!result.analysis.overallAssessment) {
        result.analysis.overallAssessment = isSpanish
          ? 'Se identificaron diferencias de traduccion relevantes para la predicacion.'
          : 'Relevant translation differences were identified for preaching and interpretation.';
      }

      if (isSpanish) {
        return this.ensureSpanishResult(result, userId);
      }

      return result;
    } catch (error) {
      console.error('Error analyzing translation differences:', error);
      return this.buildUnavailableComparison(reference, language, ['Translation comparison analysis could not be generated. Please retry.']);
    }
  }

  private buildUnavailableComparison(reference: string, language: string, warnings: string[]): EnhancedTranslationComparison {
    return {
      reference,
      translations: [],
      keyDifferences: [],
      analysis: {
        verbDifferences: [],
        theologicalTermDifferences: [],
        literalVsDynamic: [],
        overallAssessment: '',
      },
      status: 'unavailable',
      message: 'Translation comparison could not be generated. Please retry.',
      warnings,
      source: 'unavailable',
    };
  }

  private async ensureSpanishResult(
    result: { keyDifferences: KeyDifference[]; analysis: ComparisonAnalysis },
    userId?: string,
  ): Promise<{ keyDifferences: KeyDifference[]; analysis: ComparisonAnalysis }> {
    const containsEnglish = (value: string) =>
      /\b(the|and|with|while|this|that|both|difference|explanation|overall|assessment|active|passive)\b/i.test(value || '');

    const hasEnglish =
      result.keyDifferences.some((diff) => containsEnglish(diff.difference) || containsEnglish(diff.explanation)) ||
      result.analysis.verbDifferences.some((item) => containsEnglish(item)) ||
      result.analysis.theologicalTermDifferences.some((item) => containsEnglish(item)) ||
      result.analysis.literalVsDynamic.some((item) => containsEnglish(item)) ||
      containsEnglish(result.analysis.overallAssessment);

    if (!hasEnglish) {
      return result;
    }

    try {
      const prompt = ScripturePrompts.translationComparisonSpanishEnforcer(JSON.stringify(result));

      const response = await this.llmService.generateCompletion(prompt, userId || 'system', {
        temperature: 0.1,
        maxTokens: 1500,
        timeoutMs: 12000,
      });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return result;
      }

      const translated = JSON.parse(jsonMatch[0]);
      return {
        keyDifferences: Array.isArray(translated?.keyDifferences)
          ? translated.keyDifferences.slice(0, 5).map((diff: any) => ({
              category: diff.category || 'theological_term',
              translations: Array.isArray(diff.translations) ? diff.translations : [],
              difference: String(diff.difference || '').substring(0, 200),
              explanation: String(diff.explanation || '').substring(0, 500),
              significance: ['high', 'medium', 'low'].includes(diff.significance) ? diff.significance : 'medium',
            }))
          : result.keyDifferences,
        analysis: {
          verbDifferences: Array.isArray(translated?.analysis?.verbDifferences)
            ? translated.analysis.verbDifferences.slice(0, 5)
            : result.analysis.verbDifferences,
          theologicalTermDifferences: Array.isArray(translated?.analysis?.theologicalTermDifferences)
            ? translated.analysis.theologicalTermDifferences.slice(0, 5)
            : result.analysis.theologicalTermDifferences,
          literalVsDynamic: Array.isArray(translated?.analysis?.literalVsDynamic)
            ? translated.analysis.literalVsDynamic.slice(0, 5)
            : result.analysis.literalVsDynamic,
          overallAssessment: String(translated?.analysis?.overallAssessment || result.analysis.overallAssessment).substring(0, 500),
        },
      };
    } catch {
      return result;
    }
  }
}
