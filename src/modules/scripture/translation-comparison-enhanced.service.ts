import { Injectable } from '@nestjs/common';
import { ScriptureService } from './scripture.service';
import { LlmService } from '../llm/llm.service';

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
    private llmService: LlmService
  ) {}

  async getEnhancedComparison(reference: string, language: string = 'en', userId?: string): Promise<EnhancedTranslationComparison | null> {
    try {
      // Select translations based on language
      const translationCodes = this.getTranslationsForLanguage(language);
      
      if (translationCodes.length < 2) {
        return null; // Need at least 2 translations to compare
      }

      // Fetch passage text from multiple translations
      const translations: TranslationText[] = [];
      for (const code of translationCodes) {
        try {
          const result = await this.scriptureService.getPassage(reference, code);
          if (result && result.verses && result.verses.length > 0) {
            const text = result.verses.map((v: any) => v.text).join(' ');
            translations.push({
              code,
              name: this.getTranslationName(code),
              text,
              type: this.getTranslationType(code)
            });
          }
        } catch (error) {
          console.error(`Failed to fetch ${code} for ${reference}:`, error);
        }
      }

      if (translations.length < 2) {
        return null; // Not enough translations fetched successfully
      }

      // Use LLM to analyze differences
      const analysis = await this.analyzeDifferences(reference, translations, language, userId);

      return {
        reference,
        translations,
        keyDifferences: analysis.keyDifferences,
        analysis: analysis.analysis
      };
    } catch (error) {
      console.error('Error generating translation comparison:', error);
      return null;
    }
  }

  private getTranslationsForLanguage(language: string): string[] {
    if (language === 'es' || language === 'spanish') {
      // Spanish translations
      return ['NBLA', 'RVR1960', 'NVI'];
    } else {
      // English translations (default)
      return ['KJV', 'NIV', 'ESV', 'NASB'];
    }
  }

  private getTranslationName(code: string): string {
    const names: Record<string, string> = {
      'KJV': 'King James Version',
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
      
      const languageInstruction = language === 'es' || language === 'spanish'
        ? 'Respond in Spanish. Analyze these Spanish Bible translations.'
        : 'Respond in English. Analyze these English Bible translations.';

      const prompt = `You are a biblical scholar analyzing translation differences for pastors.

${languageInstruction}

**Passage**: ${reference}

**Translations**:
${translationTexts}

Analyze the key differences between these translations and provide:

1. **Key Differences**: 3-5 significant differences (theological terms, verb choices, additions/omissions, literal vs dynamic)
2. **Analysis**: 
   - Verb differences
   - Theological term differences
   - Literal vs dynamic translation approaches
   - Overall assessment

Format as JSON:
{
  "keyDifferences": [
    {
      "category": "theological_term" | "verb_difference" | "literal_vs_dynamic" | "addition_omission",
      "translations": ["KJV: text", "NIV: text"],
      "difference": "Brief description",
      "explanation": "Detailed explanation",
      "significance": "high" | "medium" | "low"
    }
  ],
  "analysis": {
    "verbDifferences": ["difference 1", "difference 2"],
    "theologicalTermDifferences": ["difference 1"],
    "literalVsDynamic": ["observation 1"],
    "overallAssessment": "Summary of main differences and their significance"
  }
}

Be concise, practical, and pastor-focused. Highlight differences that affect interpretation or application.`;

      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.3,
          maxTokens: 1500,
        }
      );

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in LLM response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
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
    } catch (error) {
      console.error('Error analyzing translation differences:', error);
      // Return empty analysis on error
      return {
        keyDifferences: [],
        analysis: {
          verbDifferences: [],
          theologicalTermDifferences: [],
          literalVsDynamic: [],
          overallAssessment: 'Unable to analyze differences at this time.'
        }
      };
    }
  }
}
