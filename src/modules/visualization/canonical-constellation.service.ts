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

export type ConnectionType = 
  | 'direct_quotation'
  | 'prophetic_fulfillment'
  | 'typology'
  | 'thematic_echo'
  | 'covenant_development'
  | 'narrative_continuation';

export type ConnectionStrength = 'strong' | 'moderate' | 'weak';

export interface ConstellationConnection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  strength: ConnectionStrength;
  strengthValue: number; // 0-1 for visual thickness
  explanation: string;
  canonicalSignificance: string;
  direction?: 'forward' | 'backward' | 'bidirectional';
  sourceEra: string;
  targetEra: string;
  color: string;
  visualStyle: {
    lineType: 'solid' | 'dashed' | 'dotted';
    animated: boolean;
    glow: boolean;
  };
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

  private createConnection(
    source: string,
    target: string,
    type: ConnectionType,
    strength: ConnectionStrength,
    explanation: string,
    canonicalSignificance: string,
    sourceEra: string,
    targetEra: string
  ): ConstellationConnection {
    const strengthValues = { strong: 0.9, moderate: 0.6, weak: 0.3 };
    const typeStyles = {
      direct_quotation: { color: '#22d3ee', lineType: 'solid' as const, animated: false, glow: true },
      prophetic_fulfillment: { color: '#ef4444', lineType: 'solid' as const, animated: true, glow: true },
      typology: { color: '#8b5cf6', lineType: 'dashed' as const, animated: false, glow: false },
      thematic_echo: { color: '#10b981', lineType: 'dotted' as const, animated: false, glow: false },
      covenant_development: { color: '#fbbf24', lineType: 'solid' as const, animated: true, glow: true },
      narrative_continuation: { color: '#6b7280', lineType: 'solid' as const, animated: false, glow: false }
    };

    const style = typeStyles[type];
    const direction = this.getCanonicalDirection(sourceEra, targetEra);

    return {
      id: `${source}-${target}-${type}`,
      source,
      target,
      type,
      strength,
      strengthValue: strengthValues[strength],
      explanation,
      canonicalSignificance,
      direction,
      sourceEra,
      targetEra,
      color: style.color,
      visualStyle: {
        lineType: style.lineType,
        animated: style.animated,
        glow: style.glow
      }
    };
  }

  private getCanonicalDirection(sourceEra: string, targetEra: string): 'forward' | 'backward' | 'bidirectional' {
    const eraOrder = ['Torah', 'History', 'Wisdom', 'Prophets', 'Gospels', 'Acts', 'Epistles', 'Revelation'];
    const sourceIdx = eraOrder.indexOf(sourceEra);
    const targetIdx = eraOrder.indexOf(targetEra);
    
    if (sourceIdx < targetIdx) return 'forward';
    if (sourceIdx > targetIdx) return 'backward';
    return 'bidirectional';
  }

  private getBookEra(bookName: string): string {
    const eras: Record<string, string> = {
      'Genesis': 'Torah', 'Exodus': 'Torah', 'Leviticus': 'Torah', 'Numbers': 'Torah', 'Deuteronomy': 'Torah',
      'Joshua': 'History', 'Judges': 'History', 'Ruth': 'History', '1 Samuel': 'History', '2 Samuel': 'History',
      '1 Kings': 'History', '2 Kings': 'History', '1 Chronicles': 'History', '2 Chronicles': 'History',
      'Ezra': 'History', 'Nehemiah': 'History', 'Esther': 'History',
      'Job': 'Wisdom', 'Psalms': 'Wisdom', 'Proverbs': 'Wisdom', 'Ecclesiastes': 'Wisdom', 'Song of Solomon': 'Wisdom',
      'Isaiah': 'Prophets', 'Jeremiah': 'Prophets', 'Lamentations': 'Prophets', 'Ezekiel': 'Prophets', 'Daniel': 'Prophets',
      'Hosea': 'Prophets', 'Joel': 'Prophets', 'Amos': 'Prophets', 'Obadiah': 'Prophets', 'Jonah': 'Prophets',
      'Micah': 'Prophets', 'Nahum': 'Prophets', 'Habakkuk': 'Prophets', 'Zephaniah': 'Prophets', 'Haggai': 'Prophets',
      'Zechariah': 'Prophets', 'Malachi': 'Prophets',
      'Matthew': 'Gospels', 'Mark': 'Gospels', 'Luke': 'Gospels', 'John': 'Gospels',
      'Acts': 'Acts',
      'Romans': 'Epistles', '1 Corinthians': 'Epistles', '2 Corinthians': 'Epistles', 'Galatians': 'Epistles',
      'Ephesians': 'Epistles', 'Philippians': 'Epistles', 'Colossians': 'Epistles', '1 Thessalonians': 'Epistles',
      '2 Thessalonians': 'Epistles', '1 Timothy': 'Epistles', '2 Timothy': 'Epistles', 'Titus': 'Epistles',
      'Philemon': 'Epistles', 'Hebrews': 'Epistles', 'James': 'Epistles', '1 Peter': 'Epistles', '2 Peter': 'Epistles',
      '1 John': 'Epistles', '2 John': 'Epistles', '3 John': 'Epistles', 'Jude': 'Epistles',
      'Revelation': 'Revelation'
    };
    return eras[bookName] || 'Unknown';
  }

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
        connections.push(this.createConnection(
          `focus-${passage}`,
          `ref-${refString}`,
          'thematic_echo',
          'strong',
          `Cross-reference connection from ${passage} to ${refString}`,
          'These passages share thematic or theological connections',
          'Unknown',
          'Unknown'
        ));
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
        connections.push(this.createConnection(
          sourceNode.id,
          targetNode.id,
          'covenant_development',
          'strong',
          `Covenant development from ${source} to ${target}`,
          'This connection traces the progressive revelation of God\'s covenant through redemptive history',
          this.getBookEra(source),
          this.getBookEra(target)
        ));
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
        connections.push(this.createConnection(
          sourceNode.id,
          targetNode.id,
          'prophetic_fulfillment',
          'strong',
          `Prophetic fulfillment: ${source} prophecy fulfilled in ${target}`,
          'Old Testament prophecy finds its fulfillment in the New Testament revelation',
          this.getBookEra(source),
          this.getBookEra(target)
        ));
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
        connections.push(this.createConnection(
          sourceNode.id,
          targetNode.id,
          'typology',
          'moderate',
          `Typological connection: ${source} prefigures truths revealed in ${target}`,
          'Old Testament patterns and types point forward to their fulfillment in Christ',
          this.getBookEra(source),
          this.getBookEra(target)
        ));
      }
    });
  }

  async getBookCluster(bookName: string): Promise<ConstellationData> {
    if (!bookName || !this.bibleStructure[bookName]) {
      return { nodes: [], connections: [], metadata: { totalBooks: 0, totalChapters: 0, totalConnections: 0 } };
    }
    const nodes: ConstellationNode[] = [];
    const connections: ConstellationConnection[] = [];

    const chapterCount = this.bibleStructure[bookName];

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
        const era = this.getBookEra(bookName);
        connections.push(this.createConnection(
          `${bookName}-${i - 1}`,
          `${bookName}-${i}`,
          'narrative_continuation',
          'weak',
          `Sequential chapter progression in ${bookName}`,
          'Narrative flow within the same book',
          era,
          era
        ));
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
