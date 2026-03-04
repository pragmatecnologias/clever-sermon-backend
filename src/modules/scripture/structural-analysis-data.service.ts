import { Injectable } from '@nestjs/common';

export interface StructuralAnalysis {
  passage: string;
  literaryGenre: string;
  structure: StructuralElement[];
  chiasm?: ChiasmStructure;
  parallelism?: ParallelismPattern[];
  dataSource: 'curated' | 'unavailable';
}

export interface StructuralElement {
  verses: string;
  type: 'introduction' | 'body' | 'conclusion' | 'transition' | 'climax' | 'inclusio';
  description: string;
}

export interface ChiasmStructure {
  pattern: string;
  elements: Array<{ label: string; verses: string; content: string }>;
}

export interface ParallelismPattern {
  type: 'synonymous' | 'antithetic' | 'synthetic' | 'emblematic';
  verses: string;
  lineA: string;
  lineB: string;
}

@Injectable()
export class StructuralAnalysisDataService {
  private structureIndex: Map<string, StructuralAnalysis> = new Map();

  constructor() {
    this.initializeStructuralData();
  }

  getStructuralAnalysis(passage: string): StructuralAnalysis {
    const normalized = this.normalizePassage(passage);
    const analysis = this.structureIndex.get(normalized);
    
    if (analysis) {
      return { ...analysis, dataSource: 'curated' };
    }

    return {
      passage,
      literaryGenre: 'Unknown',
      structure: [],
      dataSource: 'unavailable'
    };
  }

  private normalizePassage(passage: string): string {
    if (!passage) return '';
    return passage.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private initializeStructuralData() {
    // Psalm 23 - Chiastic structure
    this.structureIndex.set('psalm 23', {
      passage: 'Psalm 23',
      literaryGenre: 'Psalm of Trust',
      structure: [
        { verses: '1-3', type: 'introduction', description: 'The Lord as Shepherd (third person)' },
        { verses: '4', type: 'transition', description: 'Shift to direct address (second person)' },
        { verses: '5-6', type: 'conclusion', description: 'The Lord as Host' }
      ],
      chiasm: {
        pattern: 'A-B-C-B\'-A\'',
        elements: [
          { label: 'A', verses: '1', content: 'The LORD is my shepherd' },
          { label: 'B', verses: '2-3a', content: 'He makes me lie down, leads me, restores me' },
          { label: 'C', verses: '3b-4', content: 'Central: Even in death valley, You are with me' },
          { label: 'B\'', verses: '5', content: 'You prepare, anoint, fill my cup' },
          { label: 'A\'', verses: '6', content: 'I will dwell in the house of the LORD' }
        ]
      },
      dataSource: 'curated'
    });

    // Romans 3:21-26 - Theological argument structure
    this.structureIndex.set('romans 3:21-26', {
      passage: 'Romans 3:21-26',
      literaryGenre: 'Theological Exposition',
      structure: [
        { verses: '21-22', type: 'introduction', description: 'Righteousness apart from law revealed' },
        { verses: '23', type: 'body', description: 'Universal problem: all have sinned' },
        { verses: '24-25a', type: 'climax', description: 'Solution: justification through Christ\'s sacrifice' },
        { verses: '25b-26', type: 'conclusion', description: 'Purpose: demonstrate God\'s justice' }
      ],
      dataSource: 'curated'
    });

    // John 1:1-18 - Prologue structure
    this.structureIndex.set('john 1:1-18', {
      passage: 'John 1:1-18',
      literaryGenre: 'Theological Prologue',
      structure: [
        { verses: '1-5', type: 'introduction', description: 'The eternal Word and creation' },
        { verses: '6-8', type: 'body', description: 'John the Baptist\'s testimony' },
        { verses: '9-13', type: 'body', description: 'The Word\'s coming and reception' },
        { verses: '14-18', type: 'climax', description: 'The Word became flesh' }
      ],
      chiasm: {
        pattern: 'A-B-C-B\'-A\'',
        elements: [
          { label: 'A', verses: '1-2', content: 'The Word with God in the beginning' },
          { label: 'B', verses: '3-5', content: 'Life and light through the Word' },
          { label: 'C', verses: '14', content: 'Central: The Word became flesh' },
          { label: 'B\'', verses: '16-17', content: 'Grace and truth through Jesus Christ' },
          { label: 'A\'', verses: '18', content: 'The Son who is at the Father\'s side' }
        ]
      },
      dataSource: 'curated'
    });

    // Hebrews 8 - Sanctuary comparison
    this.structureIndex.set('hebrews 8', {
      passage: 'Hebrews 8',
      literaryGenre: 'Theological Argument',
      structure: [
        { verses: '1-2', type: 'introduction', description: 'Main point: Christ ministers in true sanctuary' },
        { verses: '3-5', type: 'body', description: 'Earthly sanctuary as copy and shadow' },
        { verses: '6', type: 'transition', description: 'Christ\'s superior ministry and covenant' },
        { verses: '7-13', type: 'climax', description: 'New covenant prophecy from Jeremiah' }
      ],
      dataSource: 'curated'
    });

    // Matthew 5-7 - Sermon on the Mount structure
    this.structureIndex.set('matthew 5', {
      passage: 'Matthew 5',
      literaryGenre: 'Sermon/Teaching Discourse',
      structure: [
        { verses: '1-2', type: 'introduction', description: 'Setting: Jesus teaches on mountain' },
        { verses: '3-12', type: 'body', description: 'The Beatitudes' },
        { verses: '13-16', type: 'body', description: 'Salt and light metaphors' },
        { verses: '17-20', type: 'transition', description: 'Fulfillment of Law and Prophets' },
        { verses: '21-48', type: 'body', description: 'Six antitheses: You have heard...but I say' }
      ],
      dataSource: 'curated'
    });

    // Daniel 2 - Narrative with prophetic vision
    this.structureIndex.set('daniel 2', {
      passage: 'Daniel 2',
      literaryGenre: 'Apocalyptic Narrative',
      structure: [
        { verses: '1-13', type: 'introduction', description: 'Crisis: King\'s dream and wise men\'s failure' },
        { verses: '14-23', type: 'body', description: 'Daniel\'s prayer and God\'s revelation' },
        { verses: '24-30', type: 'transition', description: 'Daniel brought before the king' },
        { verses: '31-45', type: 'climax', description: 'The dream and interpretation' },
        { verses: '46-49', type: 'conclusion', description: 'King\'s response and Daniel\'s promotion' }
      ],
      dataSource: 'curated'
    });

    // Revelation 12 - Apocalyptic vision
    this.structureIndex.set('revelation 12', {
      passage: 'Revelation 12',
      literaryGenre: 'Apocalyptic Vision',
      structure: [
        { verses: '1-2', type: 'introduction', description: 'Sign 1: Woman clothed with sun' },
        { verses: '3-4', type: 'body', description: 'Sign 2: Great red dragon' },
        { verses: '5-6', type: 'body', description: 'Birth of male child and woman\'s flight' },
        { verses: '7-9', type: 'climax', description: 'War in heaven, Satan cast down' },
        { verses: '10-12', type: 'body', description: 'Victory proclamation' },
        { verses: '13-17', type: 'conclusion', description: 'Dragon persecutes woman and remnant' }
      ],
      dataSource: 'curated'
    });

    // Exodus 20 - Ten Commandments structure
    this.structureIndex.set('exodus 20', {
      passage: 'Exodus 20',
      literaryGenre: 'Legal/Covenant Text',
      structure: [
        { verses: '1-2', type: 'introduction', description: 'Preamble: I am the LORD your God' },
        { verses: '3-11', type: 'body', description: 'First table: Duties to God (commands 1-4)' },
        { verses: '12-17', type: 'body', description: 'Second table: Duties to neighbor (commands 5-10)' },
        { verses: '18-21', type: 'conclusion', description: 'People\'s response and Moses\' mediation' }
      ],
      dataSource: 'curated'
    });
  }

  hasStructuralData(passage: string): boolean {
    const normalized = this.normalizePassage(passage);
    return this.structureIndex.has(normalized);
  }

  getAllAvailablePassages(): string[] {
    return Array.from(this.structureIndex.keys());
  }
}
