import { Injectable } from '@nestjs/common';
import { EGWPassageIntegrationService, PassageEGWInsight } from './egw-passage-integration.service';

export interface SermonPointEGWSupport {
  point: string;
  scriptureSupport: string[];
  egwSupport?: Array<{
    reference: string;
    bookTitle: string;
    quote: string; // Verbatim quote
    citationFormat: string;
    relevance: string;
  }>;
}

export interface EGWSermonEnhancement {
  includeEGW: boolean;
  pointSupport: SermonPointEGWSupport[];
  suggestedQuotes: Array<{
    reference: string;
    bookTitle: string;
    quote: string;
    insertionPoint: 'introduction' | 'point_1' | 'point_2' | 'point_3' | 'conclusion';
  }>;
}

@Injectable()
export class EGWSermonBuilderIntegrationService {
  constructor(
    private egwPassageService: EGWPassageIntegrationService
  ) {}

  /**
   * Enhance sermon outline with EGW support
   * RULES:
   * - Checkbox option controls inclusion
   * - Never rewrite quotes
   * - Never blend into Bible text
   * - Each point shows: Scripture Support + Spirit of Prophecy Support
   */
  async enhanceSermonOutline(
    mainPassage: string,
    outlinePoints: string[],
    includeEGW: boolean = false
  ): Promise<EGWSermonEnhancement> {
    if (!includeEGW) {
      return {
        includeEGW: false,
        pointSupport: [],
        suggestedQuotes: []
      };
    }

    // Parse main passage
    const parsed = this.parsePassage(mainPassage);
    if (!parsed) {
      return {
        includeEGW: false,
        pointSupport: [],
        suggestedQuotes: []
      };
    }

    // Get EGW insights for main passage
    const insights = await this.egwPassageService.getPassageInsights(
      parsed.book,
      parsed.chapter,
      parsed.verseStart,
      parsed.verseEnd,
      10
    );

    // Map insights to outline points
    const pointSupport = this.mapInsightsToPoints(outlinePoints, insights.insights);

    // Generate suggested quotes for insertion
    const suggestedQuotes = this.generateSuggestedQuotes(insights.insights);

    return {
      includeEGW: true,
      pointSupport,
      suggestedQuotes
    };
  }

  /**
   * Map EGW insights to sermon outline points
   */
  private mapInsightsToPoints(
    points: string[],
    insights: PassageEGWInsight[]
  ): SermonPointEGWSupport[] {
    return points.map((point, index) => {
      // Distribute insights across points
      const relevantInsights = insights.slice(index * 2, (index + 1) * 2);

      return {
        point,
        scriptureSupport: [], // Filled by Scripture service
        egwSupport: relevantInsights.map(insight => ({
          reference: insight.reference,
          bookTitle: insight.bookTitle,
          quote: insight.preview, // Verbatim preview
          citationFormat: `"${insight.preview}" — ${insight.bookTitle}, ${insight.reference}`,
          relevance: this.determineRelevance(insight.rankingReason)
        }))
      };
    });
  }

  /**
   * Generate suggested quotes for sermon insertion
   */
  private generateSuggestedQuotes(insights: PassageEGWInsight[]): Array<{
    reference: string;
    bookTitle: string;
    quote: string;
    insertionPoint: 'introduction' | 'point_1' | 'point_2' | 'point_3' | 'conclusion';
  }> {
    const quotes: Array<any> = [];

    // Best insight for introduction
    if (insights[0]) {
      quotes.push({
        reference: insights[0].reference,
        bookTitle: insights[0].bookTitle,
        quote: insights[0].content, // Full verbatim quote
        insertionPoint: 'introduction' as const
      });
    }

    // Distribute remaining across points
    const insertionPoints: Array<'point_1' | 'point_2' | 'point_3'> = ['point_1', 'point_2', 'point_3'];
    insights.slice(1, 4).forEach((insight, idx) => {
      quotes.push({
        reference: insight.reference,
        bookTitle: insight.bookTitle,
        quote: insight.content, // Full verbatim quote
        insertionPoint: insertionPoints[idx]
      });
    });

    // Last insight for conclusion
    if (insights.length > 4) {
      const last = insights[insights.length - 1];
      quotes.push({
        reference: last.reference,
        bookTitle: last.bookTitle,
        quote: last.content, // Full verbatim quote
        insertionPoint: 'conclusion' as const
      });
    }

    return quotes;
  }

  /**
   * Determine relevance description
   */
  private determineRelevance(reason: PassageEGWInsight['rankingReason']): string {
    switch (reason) {
      case 'exact_verse':
        return 'Directly comments on this verse';
      case 'same_chapter':
        return 'Relates to this chapter';
      case 'thematic':
        return 'Thematically connected';
      case 'doctrinal':
        return 'Addresses key doctrinal theme';
      default:
        return 'Related insight';
    }
  }

  /**
   * Parse passage reference
   */
  private parsePassage(passage: string): {
    book: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
  } | null {
    const match = passage.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/);
    if (!match) return null;

    return {
      book: match[1].trim(),
      chapter: parseInt(match[2]),
      verseStart: match[3] ? parseInt(match[3]) : undefined,
      verseEnd: match[4] ? parseInt(match[4]) : undefined
    };
  }

  /**
   * Format EGW support for outline prompt
   */
  formatForOutlinePrompt(enhancement: EGWSermonEnhancement): string {
    if (!enhancement.includeEGW || enhancement.pointSupport.length === 0) {
      return '';
    }

    let output = '\n\n## 🕊 Spirit of Prophecy Support\n\n';
    output += '*Consider incorporating these insights into your sermon points:*\n\n';

    enhancement.pointSupport.forEach((support, idx) => {
      if (support.egwSupport && support.egwSupport.length > 0) {
        output += `### Point ${idx + 1}: ${support.point}\n\n`;
        output += '**Scripture Support**: (provided separately)\n\n';
        output += '**Spirit of Prophecy Support**:\n\n';

        support.egwSupport.forEach(egw => {
          output += `- "${egw.quote}"\n`;
          output += `  — ${egw.bookTitle}, ${egw.reference}\n`;
          output += `  *(${egw.relevance})*\n\n`;
        });
      }
    });

    output += '---\n\n';
    output += '**IMPORTANT RULES**:\n';
    output += '- Use exact quotes. Never paraphrase without attribution.\n';
    output += '- Keep Scripture and Spirit of Prophecy clearly separated.\n';
    output += '- Scripture remains primary; Spirit of Prophecy provides supporting insight.\n';

    return output;
  }

  /**
   * Format suggested quotes for manuscript insertion
   */
  formatSuggestedQuotes(quotes: EGWSermonEnhancement['suggestedQuotes']): string {
    if (quotes.length === 0) return '';

    let output = '\n\n## 📝 Suggested Spirit of Prophecy Quotes for Manuscript\n\n';

    const bySection: Record<string, typeof quotes> = {
      introduction: [],
      point_1: [],
      point_2: [],
      point_3: [],
      conclusion: []
    };

    quotes.forEach(q => {
      bySection[q.insertionPoint].push(q);
    });

    Object.entries(bySection).forEach(([section, sectionQuotes]) => {
      if (sectionQuotes.length > 0) {
        output += `### ${this.formatSectionName(section)}\n\n`;
        sectionQuotes.forEach(q => {
          output += `> "${q.quote}"\n`;
          output += `> — ${q.bookTitle}, ${q.reference}\n\n`;
        });
      }
    });

    return output;
  }

  /**
   * Format section name for display
   */
  private formatSectionName(section: string): string {
    return section
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
