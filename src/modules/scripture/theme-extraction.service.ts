import { Injectable } from '@nestjs/common';

export interface ThemeCluster {
  theme: string;
  words: string[];
  frequency: number;
  verses: string[];
  type: 'noun' | 'verb' | 'concept';
}

export interface CovenantThread {
  type: 'covenant' | 'kingdom' | 'sanctuary';
  references: {
    verse: string;
    phrase: string;
    significance: string;
  }[];
}

@Injectable()
export class ThemeExtractionService {
  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'shall', 'should', 'may', 'might', 'can', 'could', 'that',
    'this', 'these', 'those', 'he', 'she', 'it', 'they', 'them', 'their',
    'his', 'her', 'its', 'who', 'whom', 'which', 'what', 'when', 'where',
    'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'said', 'says', 'unto', 'thee', 'thou',
    'thy', 'thine', 'ye'
  ]);

  private covenantTerms = {
    covenant: ['covenant', 'testament', 'promise', 'oath', 'seal', 'sign'],
    kingdom: ['kingdom', 'king', 'throne', 'reign', 'rule', 'dominion', 'authority'],
    sanctuary: ['sanctuary', 'temple', 'tabernacle', 'altar', 'holy', 'priest', 'sacrifice', 'offering', 'blood', 'veil', 'ark']
  };

  extractThemes(verses: { reference: string; text: string }[]): ThemeCluster[] {
    const wordFrequency = new Map<string, { count: number; verses: Set<string> }>();
    const verbFrequency = new Map<string, { count: number; verses: Set<string> }>();

    // Count word frequencies
    verses.forEach(verse => {
      const words = this.tokenize(verse.text);
      const uniqueWords = new Set(words);

      uniqueWords.forEach(word => {
        if (this.stopWords.has(word) || word.length < 3) return;

        const isVerb = this.isLikelyVerb(word);
        const map = isVerb ? verbFrequency : wordFrequency;

        if (!map.has(word)) {
          map.set(word, { count: 0, verses: new Set() });
        }

        const entry = map.get(word)!;
        entry.count += words.filter(w => w === word).length;
        entry.verses.add(verse.reference);
      });
    });

    // Convert to theme clusters
    const themes: ThemeCluster[] = [];

    // Add noun themes
    wordFrequency.forEach((data, word) => {
      if (data.count >= 2) {
        themes.push({
          theme: word,
          words: [word],
          frequency: data.count,
          verses: Array.from(data.verses),
          type: 'noun'
        });
      }
    });

    // Add verb themes
    verbFrequency.forEach((data, word) => {
      if (data.count >= 2) {
        themes.push({
          theme: word,
          words: [word],
          frequency: data.count,
          verses: Array.from(data.verses),
          type: 'verb'
        });
      }
    });

    // Detect concept clusters (e.g., "vine, fruit, abide" in John 15)
    const conceptClusters = this.detectConceptClusters(verses);
    themes.push(...conceptClusters);

    // Sort by frequency
    return themes.sort((a, b) => b.frequency - a.frequency);
  }

  extractCovenantThreads(verses: { reference: string; text: string }[]): CovenantThread[] {
    const threads: CovenantThread[] = [];

    // Check for covenant language
    const covenantRefs = this.findThreadReferences(verses, this.covenantTerms.covenant);
    if (covenantRefs.length > 0) {
      threads.push({
        type: 'covenant',
        references: covenantRefs
      });
    }

    // Check for kingdom language
    const kingdomRefs = this.findThreadReferences(verses, this.covenantTerms.kingdom);
    if (kingdomRefs.length > 0) {
      threads.push({
        type: 'kingdom',
        references: kingdomRefs
      });
    }

    // Check for sanctuary language
    const sanctuaryRefs = this.findThreadReferences(verses, this.covenantTerms.sanctuary);
    if (sanctuaryRefs.length > 0) {
      threads.push({
        type: 'sanctuary',
        references: sanctuaryRefs
      });
    }

    return threads;
  }

  private findThreadReferences(
    verses: { reference: string; text: string }[],
    terms: string[]
  ): { verse: string; phrase: string; significance: string }[] {
    const references: { verse: string; phrase: string; significance: string }[] = [];

    verses.forEach(verse => {
      const lowerText = verse.text.toLowerCase();
      terms.forEach(term => {
        if (lowerText.includes(term)) {
          // Extract phrase containing the term (context window)
          const words = verse.text.split(/\s+/);
          const termIndex = words.findIndex(w => w.toLowerCase().includes(term));
          
          if (termIndex >= 0) {
            const start = Math.max(0, termIndex - 3);
            const end = Math.min(words.length, termIndex + 4);
            const phrase = words.slice(start, end).join(' ');

            references.push({
              verse: verse.reference,
              phrase: phrase,
              significance: this.getSignificance(term)
            });
          }
        }
      });
    });

    return references;
  }

  private getSignificance(term: string): string {
    const significance: Record<string, string> = {
      'covenant': 'Divine agreement or promise',
      'testament': 'Covenant witness or will',
      'kingdom': 'Divine rule and authority',
      'sanctuary': 'Holy dwelling place of God',
      'priest': 'Mediator between God and people',
      'sacrifice': 'Atonement offering',
      'blood': 'Life and covenant ratification',
      'altar': 'Place of sacrifice and worship'
    };

    return significance[term.toLowerCase()] || 'Significant theological term';
  }

  private detectConceptClusters(verses: { reference: string; text: string }[]): ThemeCluster[] {
    // Detect known concept clusters
    const clusters: ThemeCluster[] = [];

    // John 15 cluster: vine, fruit, abide
    const vineWords = ['vine', 'branch', 'fruit', 'abide', 'remain'];
    const vineCluster = this.findCluster(verses, vineWords, 'vine-abiding');
    if (vineCluster) clusters.push(vineCluster);

    // Faith cluster: faith, believe, trust
    const faithWords = ['faith', 'believe', 'trust', 'faithful'];
    const faithCluster = this.findCluster(verses, faithWords, 'faith-belief');
    if (faithCluster) clusters.push(faithCluster);

    // Love cluster: love, beloved, charity
    const loveWords = ['love', 'loved', 'beloved', 'charity'];
    const loveCluster = this.findCluster(verses, loveWords, 'love');
    if (loveCluster) clusters.push(loveCluster);

    return clusters;
  }

  private findCluster(
    verses: { reference: string; text: string }[],
    words: string[],
    themeName: string
  ): ThemeCluster | null {
    const foundWords: string[] = [];
    const foundVerses = new Set<string>();
    let totalCount = 0;

    verses.forEach(verse => {
      const lowerText = verse.text.toLowerCase();
      words.forEach(word => {
        if (lowerText.includes(word)) {
          if (!foundWords.includes(word)) foundWords.push(word);
          foundVerses.add(verse.reference);
          totalCount++;
        }
      });
    });

    if (foundWords.length >= 2) {
      return {
        theme: themeName,
        words: foundWords,
        frequency: totalCount,
        verses: Array.from(foundVerses),
        type: 'concept'
      };
    }

    return null;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[.,;:!?()[\]{}'"]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  private isLikelyVerb(word: string): boolean {
    return /ed$|ing$|s$|en$/.test(word) && word.length > 3;
  }
}
