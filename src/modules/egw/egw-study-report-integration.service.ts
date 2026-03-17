import { Injectable } from '@nestjs/common';
import { EGWPassageIntegrationService, PassageEGWInsight } from './egw-passage-integration.service';

export interface EGWStudyReportSection {
  thematicEmphasis?: string;
  devotionalInsight?: string;
  practicalCounsel?: string;
  propheticExpansion?: string;
  quotes: Array<{
    reference: string;
    bookTitle: string;
    text: string; // Verbatim quote
    category: 'thematic' | 'devotional' | 'practical' | 'prophetic';
  }>;
}

@Injectable()
export class EGWStudyReportIntegrationService {
  constructor(
    private egwPassageService: EGWPassageIntegrationService
  ) {}

  /**
   * Generate EGW section for study report
   * RULES:
   * - Direct quotes preserved verbatim
   * - Summaries clearly labeled
   * - Never mix into literary/structural analysis
   * - Scripture sections remain first
   */
  async generateStudyReportSection(
    book: string,
    chapter: number,
    verseStart?: number,
    verseEnd?: number,
    includeEGW: boolean = true,
    language: string = 'en',
  ): Promise<EGWStudyReportSection | null> {
    if (!includeEGW) return null;
    const isSpanish = String(language || '').toLowerCase().startsWith('es');

    const insights = await this.egwPassageService.getPassageInsights(
      book,
      chapter,
      verseStart,
      verseEnd,
      language,
      8 // Get more for categorization
    );

    if (insights.insights.length === 0) {
      return null;
    }

    // Categorize insights
    const categorized = this.categorizeInsights(insights.insights);

    return {
      thematicEmphasis: this.generateThematicEmphasis(categorized.thematic, isSpanish),
      devotionalInsight: this.generateDevotionalInsight(categorized.devotional, isSpanish),
      practicalCounsel: this.generatePracticalCounsel(categorized.practical, isSpanish),
      propheticExpansion: this.generatePropheticExpansion(categorized.prophetic, isSpanish),
      quotes: this.formatQuotes(insights.insights)
    };
  }

  /**
   * Categorize insights by type
   */
  private categorizeInsights(insights: PassageEGWInsight[]): {
    thematic: PassageEGWInsight[];
    devotional: PassageEGWInsight[];
    practical: PassageEGWInsight[];
    prophetic: PassageEGWInsight[];
  } {
    const thematic: PassageEGWInsight[] = [];
    const devotional: PassageEGWInsight[] = [];
    const practical: PassageEGWInsight[] = [];
    const prophetic: PassageEGWInsight[] = [];

    insights.forEach(insight => {
      const content = insight.content.toLowerCase();
      
      // Prophetic indicators
      if (
        content.includes('prophecy') ||
        content.includes('vision') ||
        content.includes('fulfillment') ||
        content.includes('daniel') ||
        content.includes('revelation')
      ) {
        prophetic.push(insight);
      }
      // Practical indicators
      else if (
        content.includes('should') ||
        content.includes('must') ||
        content.includes('duty') ||
        content.includes('responsibility') ||
        content.includes('practice')
      ) {
        practical.push(insight);
      }
      // Devotional indicators
      else if (
        content.includes('love') ||
        content.includes('faith') ||
        content.includes('prayer') ||
        content.includes('trust') ||
        content.includes('heart')
      ) {
        devotional.push(insight);
      }
      // Default to thematic
      else {
        thematic.push(insight);
      }
    });

    return { thematic, devotional, practical, prophetic };
  }

  /**
   * Generate thematic emphasis summary
   */
  private generateThematicEmphasis(insights: PassageEGWInsight[], isSpanish: boolean): string | undefined {
    if (insights.length === 0) return undefined;

    const themes = insights.slice(0, 3);
    let summary = isSpanish
      ? '**Resumen del énfasis del Espíritu de Profecía:**\n\n'
      : '**Summary of Spirit of Prophecy emphasis:**\n\n';
    
    themes.forEach((insight, idx) => {
      summary += isSpanish
        ? `${idx + 1}. ${insight.bookTitle} enfatiza: "${insight.preview}"\n`
        : `${idx + 1}. ${insight.bookTitle} emphasizes: "${insight.preview}"\n`;
    });

    return summary;
  }

  /**
   * Generate devotional insight summary
   */
  private generateDevotionalInsight(insights: PassageEGWInsight[], isSpanish: boolean): string | undefined {
    if (insights.length === 0) return undefined;

    const top = insights[0];
    return isSpanish
      ? `**Perspectiva devocional del Espíritu de Profecía:**\n\n"${top.preview}" — ${top.bookTitle}, ${top.reference}`
      : `**Devotional perspective from Spirit of Prophecy:**\n\n"${top.preview}" — ${top.bookTitle}, ${top.reference}`;
  }

  /**
   * Generate practical counsel summary
   */
  private generatePracticalCounsel(insights: PassageEGWInsight[], isSpanish: boolean): string | undefined {
    if (insights.length === 0) return undefined;

    const top = insights[0];
    return isSpanish
      ? `**Consejo práctico del Espíritu de Profecía:**\n\n"${top.preview}" — ${top.bookTitle}, ${top.reference}`
      : `**Practical counsel from Spirit of Prophecy:**\n\n"${top.preview}" — ${top.bookTitle}, ${top.reference}`;
  }

  /**
   * Generate prophetic expansion summary
   */
  private generatePropheticExpansion(insights: PassageEGWInsight[], isSpanish: boolean): string | undefined {
    if (insights.length === 0) return undefined;

    const top = insights[0];
    return isSpanish
      ? `**Contexto profético del Espíritu de Profecía:**\n\n"${top.preview}" — ${top.bookTitle}, ${top.reference}`
      : `**Prophetic context from Spirit of Prophecy:**\n\n"${top.preview}" — ${top.bookTitle}, ${top.reference}`;
  }

  /**
   * Format quotes with proper attribution
   * INTEGRITY RULE: Preserve exact text, never paraphrase
   */
  private formatQuotes(insights: PassageEGWInsight[]): Array<{
    reference: string;
    bookTitle: string;
    text: string;
    category: 'thematic' | 'devotional' | 'practical' | 'prophetic';
  }> {
    return insights.slice(0, 5).map(insight => {
      const content = insight.content.toLowerCase();
      let category: 'thematic' | 'devotional' | 'practical' | 'prophetic' = 'thematic';

      if (content.includes('prophecy') || content.includes('vision')) {
        category = 'prophetic';
      } else if (content.includes('should') || content.includes('must')) {
        category = 'practical';
      } else if (content.includes('love') || content.includes('faith')) {
        category = 'devotional';
      }

      return {
        reference: insight.reference,
        bookTitle: insight.bookTitle,
        text: insight.content, // VERBATIM - never paraphrased
        category
      };
    });
  }

  /**
   * Format EGW section for study report output
   */
  formatForStudyReport(section: EGWStudyReportSection | null): string {
    if (!section) {
      return '';
    }

    let output = '\n\n## 🕊 Spirit of Prophecy Insight\n\n';
    output += '*The following insights from Ellen G. White\'s writings relate to this passage:*\n\n';

    if (section.thematicEmphasis) {
      output += '### Thematic Emphasis\n\n';
      output += section.thematicEmphasis + '\n\n';
    }

    if (section.devotionalInsight) {
      output += '### Devotional Insight\n\n';
      output += section.devotionalInsight + '\n\n';
    }

    if (section.practicalCounsel) {
      output += '### Practical Counsel\n\n';
      output += section.practicalCounsel + '\n\n';
    }

    if (section.propheticExpansion) {
      output += '### Prophetic Expansion\n\n';
      output += section.propheticExpansion + '\n\n';
    }

    output += '---\n\n';
    output += '*Note: All quotes are preserved verbatim from original sources. Spirit of Prophecy insights complement but do not replace Scripture study.*\n';

    return output;
  }
}
