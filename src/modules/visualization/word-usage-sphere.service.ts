import { Injectable } from '@nestjs/common';

export interface WordOccurrence {
  id: string;
  reference: string;
  text: string;
  book: string;
  testament: 'OT' | 'NT';
  position: { x: number; y: number; z: number };
  size: number;
  color: string;
  nuance?: string;
}

export interface WordUsageSphere {
  lemma: string;
  strongs: string;
  occurrences: WordOccurrence[];
  clusters: {
    name: string;
    books: string[];
    count: number;
    color: string;
  }[];
  metadata: {
    totalOccurrences: number;
    otCount: number;
    ntCount: number;
    mostFrequentBook: string;
  };
}

@Injectable()
export class WordUsageSphereService {
  private bookPositions = {
    // OT books - positioned in one hemisphere
    'Genesis': { angle: 0, radius: 10, hemisphere: 'OT' },
    'Exodus': { angle: 0.5, radius: 10, hemisphere: 'OT' },
    'Psalms': { angle: 1.5, radius: 10, hemisphere: 'OT' },
    'Isaiah': { angle: 2.5, radius: 10, hemisphere: 'OT' },
    'Daniel': { angle: 3, radius: 10, hemisphere: 'OT' },
    
    // NT books - positioned in other hemisphere
    'Matthew': { angle: 0, radius: 10, hemisphere: 'NT' },
    'John': { angle: 0.8, radius: 10, hemisphere: 'NT' },
    'Romans': { angle: 1.5, radius: 10, hemisphere: 'NT' },
    'Hebrews': { angle: 2.2, radius: 10, hemisphere: 'NT' },
    'Revelation': { angle: 3, radius: 10, hemisphere: 'NT' }
  };

  async generateWordSphere(lemma: string, strongs: string): Promise<WordUsageSphere> {
    // Mock data - in production, this would query a morphology database
    const mockOccurrences = this.generateMockOccurrences(lemma, strongs);
    
    const occurrences = mockOccurrences.map((occ, idx) => {
      const bookPos = this.bookPositions[occ.book] || { angle: 0, radius: 10, hemisphere: 'NT' };
      const hemisphere = bookPos.hemisphere === 'OT' ? -1 : 1;
      
      // Add some variation within book cluster
      const variation = (Math.random() - 0.5) * 2;
      
      return {
        id: `${lemma}-${idx}`,
        reference: occ.reference,
        text: occ.text,
        book: occ.book,
        testament: bookPos.hemisphere,
        position: {
          x: Math.cos(bookPos.angle) * bookPos.radius + variation,
          y: hemisphere * 5 + variation,
          z: Math.sin(bookPos.angle) * bookPos.radius + variation
        },
        size: occ.frequency,
        color: this.getNuanceColor(occ.nuance),
        nuance: occ.nuance
      };
    });

    const clusters = this.identifyClusters(occurrences);
    const metadata = this.calculateMetadata(occurrences);

    return {
      lemma,
      strongs,
      occurrences,
      clusters,
      metadata
    };
  }

  private generateMockOccurrences(lemma: string, strongs: string): any[] {
    // Mock data for common words
    const mockData: Record<string, any[]> = {
      'ἀγαπάω': [
        { reference: 'John 3:16', text: 'For God so loved the world', book: 'John', frequency: 1.5, nuance: 'divine_love' },
        { reference: 'John 14:21', text: 'He who loves me', book: 'John', frequency: 1.2, nuance: 'reciprocal_love' },
        { reference: '1 John 4:8', text: 'God is love', book: 'Revelation', frequency: 1.8, nuance: 'essential_love' },
        { reference: 'Romans 5:8', text: 'God demonstrates his love', book: 'Romans', frequency: 1.4, nuance: 'demonstrated_love' },
        { reference: 'Ephesians 5:25', text: 'Husbands, love your wives', book: 'Romans', frequency: 1.0, nuance: 'marital_love' }
      ],
      'πιστεύω': [
        { reference: 'John 3:16', text: 'whoever believes in him', book: 'John', frequency: 1.6, nuance: 'saving_faith' },
        { reference: 'Romans 10:9', text: 'if you believe in your heart', book: 'Romans', frequency: 1.5, nuance: 'heart_belief' },
        { reference: 'Hebrews 11:6', text: 'without faith impossible', book: 'Hebrews', frequency: 1.7, nuance: 'essential_faith' },
        { reference: 'James 2:19', text: 'demons also believe', book: 'Hebrews', frequency: 1.0, nuance: 'intellectual_assent' }
      ],
      'λόγος': [
        { reference: 'John 1:1', text: 'In the beginning was the Word', book: 'John', frequency: 2.0, nuance: 'divine_word' },
        { reference: 'John 1:14', text: 'The Word became flesh', book: 'John', frequency: 1.9, nuance: 'incarnate_word' },
        { reference: 'Hebrews 4:12', text: 'word of God is living', book: 'Hebrews', frequency: 1.6, nuance: 'active_word' },
        { reference: 'Matthew 4:4', text: 'every word from God', book: 'Matthew', frequency: 1.3, nuance: 'sustaining_word' }
      ]
    };

    return mockData[lemma] || [
      { reference: 'John 1:1', text: 'Sample occurrence', book: 'John', frequency: 1.0, nuance: 'general' }
    ];
  }

  private getNuanceColor(nuance?: string): string {
    const colors: Record<string, string> = {
      'divine_love': '#fbbf24',
      'reciprocal_love': '#8b5cf6',
      'essential_love': '#ef4444',
      'demonstrated_love': '#10b981',
      'marital_love': '#ec4899',
      'saving_faith': '#3b82f6',
      'heart_belief': '#8b5cf6',
      'essential_faith': '#fbbf24',
      'intellectual_assent': '#6b7280',
      'divine_word': '#fbbf24',
      'incarnate_word': '#ef4444',
      'active_word': '#10b981',
      'sustaining_word': '#3b82f6'
    };

    return colors[nuance || 'general'] || '#6b7280';
  }

  private identifyClusters(occurrences: WordOccurrence[]): any[] {
    const bookCounts: Record<string, number> = {};
    
    occurrences.forEach(occ => {
      bookCounts[occ.book] = (bookCounts[occ.book] || 0) + 1;
    });

    return Object.entries(bookCounts)
      .map(([book, count]) => ({
        name: book,
        books: [book],
        count,
        color: occurrences.find(o => o.book === book)?.color || '#6b7280'
      }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateMetadata(occurrences: WordOccurrence[]): any {
    const otCount = occurrences.filter(o => o.testament === 'OT').length;
    const ntCount = occurrences.filter(o => o.testament === 'NT').length;
    
    const bookCounts: Record<string, number> = {};
    occurrences.forEach(occ => {
      bookCounts[occ.book] = (bookCounts[occ.book] || 0) + 1;
    });

    const mostFrequentBook = Object.entries(bookCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown';

    return {
      totalOccurrences: occurrences.length,
      otCount,
      ntCount,
      mostFrequentBook
    };
  }
}
