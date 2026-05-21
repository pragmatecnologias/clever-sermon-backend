import { Injectable } from '@nestjs/common';
import { EGWService } from './egw.service';

export interface EGWSermonSuggestion {
  reference: string;
  bookTitle: string;
  quote: string;
  relevance: string;
  citationFormat: string;
}

export interface EGWInterpretivePerspective {
  passage: string;
  hasCommentary: boolean;
  perspective?: string;
  references?: string[];
  quotes?: { reference: string; text: string }[];
}

@Injectable()
export class EGWIntegrationService {
  constructor(private egwService: EGWService) {}

  /**
   * Get EGW suggestions for sermon outline points
   */
  async getSermonssuggestions(
    mainPassage: string,
    theme: string,
    language: string,
    limit: number = 3
  ): Promise<EGWSermonSuggestion[]> {
    // Parse passage
    const passageMatch = mainPassage.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/);
    if (!passageMatch) return [];

    const book = passageMatch[1].trim();
    const chapter = parseInt(passageMatch[2]);
    const verseStart = passageMatch[3] ? parseInt(passageMatch[3]) : undefined;

    // Get insights for the passage
    const insights = await this.egwService.getInsightsForPassage(
      book,
      chapter,
      verseStart,
      undefined,
      language,
      limit
    );

    // Also search by theme
    const themeResults = await this.egwService.searchByTopic(theme, limit);

    // Combine and deduplicate
    const allResults = [...insights, ...themeResults.slice(0, limit)];
    const uniqueRefs = new Map<string, any>();
    
    allResults.forEach((result: any) => {
      const ref = 'reference' in result ? result.reference : (result.paragraph ? result.paragraph.reference : null);
      if (ref && !uniqueRefs.has(ref)) {
        uniqueRefs.set(ref, result);
      }
    });

    return Array.from(uniqueRefs.values()).slice(0, limit).map(result => {
      const para = 'paragraph' in result ? result.paragraph : result;
      const excerpt = 'excerpt' in result ? result.excerpt : 
        (para.content?.length > 150 ? para.content.substring(0, 150) + '...' : para.content);
      
      return {
        reference: para.reference || result.reference,
        bookTitle: para.bookTitle || result.bookTitle,
        quote: excerpt,
        relevance: 'Relates to main passage and theme',
        citationFormat: `"${excerpt}" — ${para.bookTitle}, ${para.reference || result.reference}`
      };
    });
  }

  /**
   * Get EGW perspective on interpretive challenges
   */
  async getInterpretivePerspective(
    passage: string,
    language: string
  ): Promise<EGWInterpretivePerspective> {
    const passageMatch = passage.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/);
    if (!passageMatch) {
      return {
        passage,
        hasCommentary: false
      };
    }

    const book = passageMatch[1].trim();
    const chapter = parseInt(passageMatch[2]);
    const verseStart = passageMatch[3] ? parseInt(passageMatch[3]) : undefined;

    const insights = await this.egwService.getInsightsForPassage(
      book,
      chapter,
      verseStart,
      undefined,
      language,
      3
    );

    if (insights.length === 0) {
      const isSpanish = String(language || '').toLowerCase().startsWith('es');
      const passageLabel = verseStart ? `${book} ${chapter}:${verseStart}` : `${book} ${chapter}`;
      return {
        passage,
        hasCommentary: true,
        perspective: isSpanish
          ? `No se encontró una cita directa para ${passageLabel} en la biblioteca cargada. Aun así, la lectura adventista mantiene a Cristo al centro, usa el texto bíblico como autoridad principal y aplica el mensaje a la vida y la obediencia diaria.`
          : `No direct citation was found for ${passageLabel} in the loaded library. Even so, the Adventist reading keeps Christ at the center, uses the Bible as the primary authority, and applies the message to daily life and obedience.`,
        references: ['General EGW counsel'],
        quotes: [],
      };
    }

    // Format the perspective
    const quotes = insights.map(insight => ({
      reference: insight.reference,
      text: insight.excerpt
    }));

    const perspective = insights.map((insight, idx) => 
      `${idx + 1}. ${insight.bookTitle} (${insight.reference}):\n"${insight.excerpt}"`
    ).join('\n\n');

    return {
      passage,
      hasCommentary: true,
      perspective,
      references: insights.map(i => i.reference),
      quotes
    };
  }

  /**
   * Get SDA-themed smart boosts for specific topics
   */
  async getSDASmartBoosts(topic: string, language: string): Promise<EGWSermonSuggestion[]> {
    const topicKeywords: Record<string, string[]> = {
      'daniel': ['Daniel', 'prophecy', 'vision', 'interpretation', 'kingdom'],
      'revelation': ['Revelation', 'apocalypse', 'seven churches', 'beast', 'seal', 'trumpet'],
      'sanctuary': ['sanctuary', 'tabernacle', 'holy place', 'most holy', 'priest', 'sacrifice'],
      'sabbath': ['Sabbath', 'seventh day', 'rest', 'holy day', 'commandment'],
      'state of the dead': ['death', 'resurrection', 'sleep', 'grave', 'immortality'],
      'hebrews': ['Hebrews', 'high priest', 'covenant', 'sanctuary', 'better']
    };

    const lowerTopic = topic.toLowerCase();
    let searchTerms: string[] = [topic];

    // Find matching topic keywords
    for (const [key, keywords] of Object.entries(topicKeywords)) {
      if (lowerTopic.includes(key)) {
        searchTerms = keywords;
        break;
      }
    }

    // Search for each term and aggregate results
    const allResults: any[] = [];
    for (const term of searchTerms.slice(0, 3)) {
      const results = await this.egwService.searchContent(term, 5, language);
      allResults.push(...results);
    }

    // Sort by relevance and deduplicate
    const uniqueRefs = new Map<string, any>();
    allResults
      .sort((a, b) => b.relevance - a.relevance)
      .forEach(result => {
        if (!uniqueRefs.has(result.reference)) {
          uniqueRefs.set(result.reference, result);
        }
      });

    return Array.from(uniqueRefs.values()).slice(0, 5).map(result => ({
      reference: result.reference,
      bookTitle: result.bookTitle,
      quote: result.content.length > 200 ? result.content.substring(0, 200) + '...' : result.content,
      relevance: `Highly relevant to ${topic}`,
      citationFormat: `"${result.content.substring(0, 100)}..." — ${result.bookTitle}, ${result.reference}`
    }));
  }

  /**
   * Format EGW suggestions for sermon outline
   */
  formatForOutline(suggestions: EGWSermonSuggestion[]): string {
    if (suggestions.length === 0) return '';

    let formatted = '\n\n## 🕊 Spirit of Prophecy References\n\n';
    formatted += '*Consider incorporating these insights:*\n\n';

    suggestions.forEach((suggestion, idx) => {
      formatted += `${idx + 1}. **${suggestion.bookTitle}** (${suggestion.reference})\n`;
      formatted += `   > "${suggestion.quote}"\n\n`;
    });

    formatted += '*Note: Use exact quotes. Never paraphrase without attribution.*\n';

    return formatted;
  }

  /**
   * Format EGW perspective for interpretive challenges
   */
  formatInterpretivePerspective(perspective: EGWInterpretivePerspective): string {
    if (!perspective.hasCommentary) {
      return '\n\n**Spirit of Prophecy Perspective**: No direct commentary found for this passage.\n';
    }

    let formatted = '\n\n## 🕊 Spirit of Prophecy Perspective\n\n';
    formatted += perspective.perspective + '\n';
    
    return formatted;
  }
}
