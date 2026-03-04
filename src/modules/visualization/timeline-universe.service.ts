import { Injectable } from '@nestjs/common';

export interface TimelineEvent {
  id: string;
  year: number;
  era: 'BC' | 'AD';
  title: string;
  description: string;
  category: 'biblical' | 'political' | 'cultural' | 'empire';
  position: { x: number; y: number; z: number };
  color: string;
  importance: number;
  references?: string[];
}

export interface TimelineLayer {
  name: string;
  category: 'biblical' | 'political' | 'cultural' | 'empire';
  events: TimelineEvent[];
  yPosition: number;
  color: string;
}

export interface TimelineUniverse {
  layers: TimelineLayer[];
  events: TimelineEvent[];
  eras: {
    name: string;
    startYear: number;
    endYear: number;
    color: string;
  }[];
  metadata: {
    totalEvents: number;
    timeSpan: number;
    startYear: number;
    endYear: number;
  };
}

@Injectable()
export class TimelineUniverseService {
  private biblicalEvents = [
    { year: -4004, title: 'Creation', description: 'Creation of the world', importance: 10, references: ['Genesis 1-2'] },
    { year: -2348, title: 'The Flood', description: 'Global flood in Noah\'s time', importance: 9, references: ['Genesis 6-9'] },
    { year: -2000, title: 'Abraham Called', description: 'God calls Abraham', importance: 9, references: ['Genesis 12'] },
    { year: -1491, title: 'Exodus', description: 'Israel leaves Egypt', importance: 10, references: ['Exodus 12-14'] },
    { year: -1451, title: 'Ten Commandments', description: 'Law given at Sinai', importance: 10, references: ['Exodus 20'] },
    { year: -1010, title: 'David Becomes King', description: 'David anointed king', importance: 8, references: ['2 Samuel 5'] },
    { year: -970, title: 'Temple Built', description: 'Solomon builds temple', importance: 9, references: ['1 Kings 6'] },
    { year: -722, title: 'Israel Falls', description: 'Northern kingdom falls to Assyria', importance: 7, references: ['2 Kings 17'] },
    { year: -586, title: 'Judah Falls', description: 'Jerusalem destroyed by Babylon', importance: 8, references: ['2 Kings 25'] },
    { year: -538, title: 'Return from Exile', description: 'Jews return to Jerusalem', importance: 7, references: ['Ezra 1'] },
    { year: -457, title: 'Ezra Returns', description: 'Ezra leads second return', importance: 6, references: ['Ezra 7'] },
    { year: -4, title: 'Jesus Born', description: 'Birth of Christ', importance: 10, references: ['Matthew 1-2', 'Luke 2'] },
    { year: 27, title: 'Jesus Baptized', description: 'Jesus begins ministry', importance: 9, references: ['Matthew 3', 'Mark 1'] },
    { year: 31, title: 'Crucifixion', description: 'Jesus crucified and resurrected', importance: 10, references: ['Matthew 27-28'] },
    { year: 31, title: 'Pentecost', description: 'Holy Spirit given', importance: 9, references: ['Acts 2'] },
    { year: 34, title: 'Stephen Martyred', description: 'First Christian martyr', importance: 7, references: ['Acts 7'] },
    { year: 49, title: 'Jerusalem Council', description: 'Gentile inclusion decided', importance: 8, references: ['Acts 15'] },
    { year: 70, title: 'Temple Destroyed', description: 'Romans destroy Jerusalem temple', importance: 9, references: ['Matthew 24'] },
    { year: 95, title: 'Revelation Written', description: 'John writes Revelation', importance: 8, references: ['Revelation 1'] }
  ];

  private politicalEvents = [
    { year: -753, title: 'Rome Founded', description: 'Traditional founding of Rome', importance: 6 },
    { year: -586, title: 'Babylonian Empire', description: 'Babylon at peak power', importance: 7 },
    { year: -539, title: 'Persian Empire', description: 'Persia conquers Babylon', importance: 7 },
    { year: -331, title: 'Greek Empire', description: 'Alexander conquers Persia', importance: 7 },
    { year: -63, title: 'Roman Control', description: 'Rome takes Judea', importance: 7 },
    { year: -27, title: 'Roman Empire Begins', description: 'Augustus becomes emperor', importance: 8 },
    { year: 64, title: 'Rome Burns', description: 'Great fire of Rome', importance: 6 },
    { year: 70, title: 'Jerusalem Falls', description: 'Titus destroys Jerusalem', importance: 9 },
    { year: 313, title: 'Edict of Milan', description: 'Christianity legalized', importance: 8 }
  ];

  async generateTimeline(
    startYear?: number,
    endYear?: number,
    categories?: string[]
  ): Promise<TimelineUniverse> {
    const start = startYear || -4004;
    const end = endYear || 100;

    const layers: TimelineLayer[] = [];
    const allEvents: TimelineEvent[] = [];

    // Biblical events layer
    if (!categories || categories.includes('biblical')) {
      const biblicalLayer = this.createLayer(
        'Biblical Events',
        'biblical',
        this.biblicalEvents,
        start,
        end,
        0,
        '#fbbf24'
      );
      layers.push(biblicalLayer);
      allEvents.push(...biblicalLayer.events);
    }

    // Political events layer
    if (!categories || categories.includes('political')) {
      const politicalLayer = this.createLayer(
        'Political Events',
        'political',
        this.politicalEvents,
        start,
        end,
        3,
        '#3b82f6'
      );
      layers.push(politicalLayer);
      allEvents.push(...politicalLayer.events);
    }

    // Empire layer
    if (!categories || categories.includes('empire')) {
      const empireLayer = this.createEmpireLayer(start, end);
      layers.push(empireLayer);
      allEvents.push(...empireLayer.events);
    }

    const eras = this.defineEras();

    return {
      layers,
      events: allEvents,
      eras,
      metadata: {
        totalEvents: allEvents.length,
        timeSpan: Math.abs(start - end),
        startYear: start,
        endYear: end
      }
    };
  }

  private createLayer(
    name: string,
    category: 'biblical' | 'political' | 'cultural' | 'empire',
    events: any[],
    startYear: number,
    endYear: number,
    yPosition: number,
    color: string
  ): TimelineLayer {
    const timelineEvents: TimelineEvent[] = events
      .filter(e => e.year >= startYear && e.year <= endYear)
      .map(e => {
        const normalizedX = this.normalizeYear(e.year, startYear, endYear);
        
        return {
          id: `${category}-${e.year}`,
          year: Math.abs(e.year),
          era: e.year < 0 ? 'BC' : 'AD',
          title: e.title,
          description: e.description,
          category,
          position: {
            x: normalizedX,
            y: yPosition,
            z: 0
          },
          color,
          importance: e.importance,
          references: e.references
        };
      });

    return {
      name,
      category,
      events: timelineEvents,
      yPosition,
      color
    };
  }

  private createEmpireLayer(startYear: number, endYear: number): TimelineLayer {
    const empires = [
      { year: -2000, title: 'Egyptian Empire', description: 'Egypt dominates region', importance: 7 },
      { year: -1200, title: 'Assyrian Empire', description: 'Assyria rises', importance: 7 },
      { year: -605, title: 'Babylonian Empire', description: 'Babylon dominates', importance: 8 },
      { year: -539, title: 'Persian Empire', description: 'Persia conquers', importance: 8 },
      { year: -331, title: 'Greek Empire', description: 'Alexander conquers', importance: 8 },
      { year: -63, title: 'Roman Empire', description: 'Rome dominates', importance: 9 }
    ];

    return this.createLayer('Empires', 'empire', empires, startYear, endYear, 6, '#ef4444');
  }

  private normalizeYear(year: number, startYear: number, endYear: number): number {
    const span = endYear - startYear;
    const position = year - startYear;
    return (position / span) * 100 - 50; // Center at 0, range -50 to 50
  }

  private defineEras(): any[] {
    return [
      { name: 'Patriarchal', startYear: -4004, endYear: -1491, color: '#fbbf24' },
      { name: 'Exodus & Conquest', startYear: -1491, endYear: -1050, color: '#10b981' },
      { name: 'United Kingdom', startYear: -1050, endYear: -930, color: '#3b82f6' },
      { name: 'Divided Kingdom', startYear: -930, endYear: -586, color: '#8b5cf6' },
      { name: 'Exile & Return', startYear: -586, endYear: -4, color: '#ec4899' },
      { name: 'Life of Christ', startYear: -4, endYear: 31, color: '#fbbf24' },
      { name: 'Early Church', startYear: 31, endYear: 100, color: '#10b981' }
    ];
  }

  async getEventDetails(year: number, category?: string): Promise<TimelineEvent[]> {
    const allEvents = [...this.biblicalEvents, ...this.politicalEvents];
    
    return allEvents
      .filter(e => Math.abs(e.year - year) <= 10)
      .filter(e => !category || (e as any).category === category)
      .map(e => ({
        id: `event-${e.year}`,
        year: Math.abs(e.year),
        era: e.year < 0 ? 'BC' : 'AD',
        title: e.title,
        description: e.description,
        category: 'biblical',
        position: { x: 0, y: 0, z: 0 },
        color: '#fbbf24',
        importance: e.importance,
        references: (e as any).references
      }));
  }

  async getContextForYear(year: number): Promise<any> {
    const events = await this.getEventDetails(year);
    const era = this.defineEras().find(e => year >= e.startYear && year <= e.endYear);
    
    return {
      year,
      era: era?.name || 'Unknown',
      events,
      politicalContext: this.getPoliticalContext(year),
      biblicalContext: this.getBiblicalContext(year)
    };
  }

  private getPoliticalContext(year: number): string {
    if (year < -539) return 'Babylonian dominance';
    if (year < -331) return 'Persian Empire';
    if (year < -63) return 'Greek influence';
    if (year < 476) return 'Roman Empire';
    return 'Post-Roman';
  }

  private getBiblicalContext(year: number): string {
    if (year < -1491) return 'Patriarchal period';
    if (year < -1050) return 'Exodus and Judges';
    if (year < -586) return 'Kingdom period';
    if (year < 0) return 'Exile and return';
    if (year < 100) return 'New Testament era';
    return 'Early church';
  }
}
