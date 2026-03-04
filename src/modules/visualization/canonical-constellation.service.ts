import { Injectable } from '@nestjs/common';
import { ScriptureService } from '../scripture/scripture.service';

export interface ConstellationNode {
  id: string;
  type: 'book' | 'chapter' | 'verse';
  label: string;
  reference: string;
  position: { x: number; y: number; z: number };
  size: number;
  color: string;
  isSelected?: boolean;
}

export interface ConstellationConnection {
  source: string;
  target: string;
  type: 'cross_reference' | 'thematic' | 'covenant' | 'prophetic' | 'typological';
  strength: number;
  color: string;
}

export interface ConstellationData {
  nodes: ConstellationNode[];
  connections: ConstellationConnection[];
  metadata: {
    totalBooks: number;
    totalChapters: number;
    totalConnections: number;
  };
}

@Injectable()
export class CanonicalConstellationService {
  private bibleStructure = {
    'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
    'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
    '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
    'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
    'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
    'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12,
    'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4,
    'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2,
    'Zechariah': 14, 'Malachi': 4,
    'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28,
    'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6,
    'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5,
    '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3,
    'Philemon': 1, 'Hebrews': 13, 'James': 5, '1 Peter': 5, '2 Peter': 3,
    '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
  };

  constructor(private scriptureService: ScriptureService) {}

  async generateConstellation(
    focusPassage?: string,
    includeTypes?: string[]
  ): Promise<ConstellationData> {
    const nodes: ConstellationNode[] = [];
    const connections: ConstellationConnection[] = [];

    // Generate book nodes in 3D space
    const books = Object.keys(this.bibleStructure);
    const otBooks = books.slice(0, 39);
    const ntBooks = books.slice(39);

    // Position OT books in one hemisphere, NT in another
    otBooks.forEach((book, idx) => {
      const angle = (idx / otBooks.length) * Math.PI * 2;
      const radius = 15;
      nodes.push({
        id: `book-${book}`,
        type: 'book',
        label: book,
        reference: book,
        position: {
          x: Math.cos(angle) * radius,
          y: -5,
          z: Math.sin(angle) * radius
        },
        size: 1.5,
        color: '#3b82f6' // Blue for OT
      });
    });

    ntBooks.forEach((book, idx) => {
      const angle = (idx / ntBooks.length) * Math.PI * 2;
      const radius = 12;
      nodes.push({
        id: `book-${book}`,
        type: 'book',
        label: book,
        reference: book,
        position: {
          x: Math.cos(angle) * radius,
          y: 5,
          z: Math.sin(angle) * radius
        },
        size: 1.5,
        color: '#8b5cf6' // Purple for NT
      });
    });

    // If focus passage provided, add detailed nodes
    if (focusPassage) {
      await this.addFocusPassageNodes(focusPassage, nodes, connections);
    }

    // Add thematic connections
    this.addThematicConnections(nodes, connections, includeTypes);

    return {
      nodes,
      connections,
      metadata: {
        totalBooks: books.length,
        totalChapters: Object.values(this.bibleStructure).reduce((a, b) => a + b, 0),
        totalConnections: connections.length
      }
    };
  }

  private async addFocusPassageNodes(
    passage: string,
    nodes: ConstellationNode[],
    connections: ConstellationConnection[]
  ): Promise<void> {
    try {
      // Get cross references for the passage
      const crossRefs = await this.scriptureService.getCrossReferences(passage);
      
      // Add focus passage as glowing node
      nodes.push({
        id: `focus-${passage}`,
        type: 'verse',
        label: passage,
        reference: passage,
        position: { x: 0, y: 0, z: 0 },
        size: 2.5,
        color: '#fbbf24', // Gold
        isSelected: true
      });

      // Add cross reference nodes
      crossRefs.slice(0, 20).forEach((ref, idx) => {
        const angle = (idx / crossRefs.length) * Math.PI * 2;
        const radius = 8;
        
        const refString = typeof ref === 'string' ? ref : (ref as any).reference;
        
        nodes.push({
          id: `ref-${refString}`,
          type: 'verse',
          label: refString,
          reference: refString,
          position: {
            x: Math.cos(angle) * radius,
            y: Math.sin(idx) * 2,
            z: Math.sin(angle) * radius
          },
          size: 1.2,
          color: '#10b981' // Green
        });

        // Add connection
        connections.push({
          source: `focus-${passage}`,
          target: `ref-${refString}`,
          type: 'cross_reference',
          strength: 0.8,
          color: '#10b981'
        });
      });
    } catch (error) {
      console.error('[Constellation] Error adding focus passage:', error);
    }
  }

  private addThematicConnections(
    nodes: ConstellationNode[],
    connections: ConstellationConnection[],
    includeTypes?: string[]
  ): void {
    // Covenant connections
    if (!includeTypes || includeTypes.includes('covenant')) {
      this.addCovenantConnections(nodes, connections);
    }

    // Prophetic connections
    if (!includeTypes || includeTypes.includes('prophetic')) {
      this.addPropheticConnections(nodes, connections);
    }

    // Typological connections
    if (!includeTypes || includeTypes.includes('typological')) {
      this.addTypologicalConnections(nodes, connections);
    }
  }

  private addCovenantConnections(nodes: ConstellationNode[], connections: ConstellationConnection[]): void {
    const covenantBooks = [
      { source: 'Genesis', target: 'Exodus', type: 'covenant' as const },
      { source: 'Exodus', target: 'Deuteronomy', type: 'covenant' as const },
      { source: 'Deuteronomy', target: '2 Samuel', type: 'covenant' as const },
      { source: '2 Samuel', target: 'Jeremiah', type: 'covenant' as const },
      { source: 'Jeremiah', target: 'Hebrews', type: 'covenant' as const },
      { source: 'Hebrews', target: 'Revelation', type: 'covenant' as const }
    ];

    covenantBooks.forEach(({ source, target }) => {
      const sourceNode = nodes.find(n => n.label === source);
      const targetNode = nodes.find(n => n.label === target);
      
      if (sourceNode && targetNode) {
        connections.push({
          source: sourceNode.id,
          target: targetNode.id,
          type: 'covenant',
          strength: 0.9,
          color: '#fbbf24' // Gold
        });
      }
    });
  }

  private addPropheticConnections(nodes: ConstellationNode[], connections: ConstellationConnection[]): void {
    const propheticPairs = [
      { source: 'Daniel', target: 'Revelation' },
      { source: 'Isaiah', target: 'Matthew' },
      { source: 'Jeremiah', target: 'Hebrews' },
      { source: 'Ezekiel', target: 'Revelation' },
      { source: 'Zechariah', target: 'Revelation' }
    ];

    propheticPairs.forEach(({ source, target }) => {
      const sourceNode = nodes.find(n => n.label === source);
      const targetNode = nodes.find(n => n.label === target);
      
      if (sourceNode && targetNode) {
        connections.push({
          source: sourceNode.id,
          target: targetNode.id,
          type: 'prophetic',
          strength: 0.85,
          color: '#ef4444' // Red
        });
      }
    });
  }

  private addTypologicalConnections(nodes: ConstellationNode[], connections: ConstellationConnection[]): void {
    const typologicalPairs = [
      { source: 'Exodus', target: 'John' },
      { source: 'Leviticus', target: 'Hebrews' },
      { source: 'Numbers', target: '1 Corinthians' },
      { source: 'Joshua', target: 'Hebrews' },
      { source: '1 Samuel', target: 'Luke' }
    ];

    typologicalPairs.forEach(({ source, target }) => {
      const sourceNode = nodes.find(n => n.label === source);
      const targetNode = nodes.find(n => n.label === target);
      
      if (sourceNode && targetNode) {
        connections.push({
          source: sourceNode.id,
          target: targetNode.id,
          type: 'typological',
          strength: 0.7,
          color: '#3b82f6' // Blue
        });
      }
    });
  }

  async getBookCluster(bookName: string): Promise<ConstellationData> {
    const nodes: ConstellationNode[] = [];
    const connections: ConstellationConnection[] = [];

    const chapterCount = this.bibleStructure[bookName];
    if (!chapterCount) {
      throw new Error(`Book ${bookName} not found`);
    }

    // Create chapter nodes in a spiral
    for (let i = 1; i <= chapterCount; i++) {
      const angle = (i / chapterCount) * Math.PI * 4;
      const radius = 5 + (i / chapterCount) * 3;
      
      nodes.push({
        id: `${bookName}-${i}`,
        type: 'chapter',
        label: `${bookName} ${i}`,
        reference: `${bookName} ${i}`,
        position: {
          x: Math.cos(angle) * radius,
          y: i * 0.3,
          z: Math.sin(angle) * radius
        },
        size: 1,
        color: '#8b5cf6'
      });

      // Connect sequential chapters
      if (i > 1) {
        connections.push({
          source: `${bookName}-${i - 1}`,
          target: `${bookName}-${i}`,
          type: 'thematic',
          strength: 0.5,
          color: '#6b7280'
        });
      }
    }

    return {
      nodes,
      connections,
      metadata: {
        totalBooks: 1,
        totalChapters: chapterCount,
        totalConnections: connections.length
      }
    };
  }
}
