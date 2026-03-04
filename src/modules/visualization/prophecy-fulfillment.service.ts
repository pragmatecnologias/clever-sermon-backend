import { Injectable } from '@nestjs/common';

export interface ProphecyNode {
  id: string;
  reference: string;
  text: string;
  type: 'prophecy' | 'fulfillment' | 'theme' | 'symbol';
  book: string;
  testament: 'OT' | 'NT';
  position: { x: number; y: number; z: number };
  size: number;
  color: string;
  significance: string;
}

export interface ProphecyConnection {
  source: string;
  target: string;
  type: 'fulfills' | 'parallels' | 'typology' | 'theme_connection';
  strength: number;
  color: string;
  explanation: string;
}

export interface ProphecyWeb {
  nodes: ProphecyNode[];
  connections: ProphecyConnection[];
  themes: {
    name: string;
    nodes: string[];
    color: string;
  }[];
  metadata: {
    totalProphecies: number;
    totalFulfillments: number;
    strongestConnections: number;
  };
}

@Injectable()
export class ProphecyFulfillmentService {
  private prophecyData = {
    daniel7: {
      reference: 'Daniel 7',
      prophecies: [
        { verse: 'Daniel 7:13-14', text: 'Son of Man coming with clouds', theme: 'kingdom', symbol: 'son_of_man' },
        { verse: 'Daniel 7:25', text: 'Time, times, half a time', theme: 'persecution', symbol: 'time_period' },
        { verse: 'Daniel 7:9-10', text: 'Ancient of Days', theme: 'judgment', symbol: 'throne' }
      ],
      fulfillments: [
        { verse: 'Revelation 1:7', text: 'Coming with clouds', connection: 'Daniel 7:13-14' },
        { verse: 'Revelation 12:14', text: 'Time, times, half a time', connection: 'Daniel 7:25' },
        { verse: 'Revelation 20:11-12', text: 'Great white throne', connection: 'Daniel 7:9-10' }
      ]
    },
    daniel8: {
      reference: 'Daniel 8',
      prophecies: [
        { verse: 'Daniel 8:14', text: '2300 days', theme: 'sanctuary', symbol: 'time_prophecy' },
        { verse: 'Daniel 8:11', text: 'Daily sacrifice taken away', theme: 'sanctuary', symbol: 'daily' }
      ],
      fulfillments: [
        { verse: 'Hebrews 9:24', text: 'Christ enters heavenly sanctuary', connection: 'Daniel 8:14' }
      ]
    },
    sanctuary: {
      reference: 'Sanctuary Theme',
      prophecies: [
        { verse: 'Exodus 25:8', text: 'Make me a sanctuary', theme: 'sanctuary', symbol: 'dwelling' },
        { verse: 'Leviticus 16', text: 'Day of Atonement', theme: 'sanctuary', symbol: 'cleansing' }
      ],
      fulfillments: [
        { verse: 'Hebrews 8:1-2', text: 'True tabernacle', connection: 'Exodus 25:8' },
        { verse: 'Hebrews 9:11-12', text: 'Christ our high priest', connection: 'Leviticus 16' },
        { verse: 'Revelation 11:19', text: 'Temple in heaven opened', connection: 'Leviticus 16' }
      ]
    },
    messiah: {
      reference: 'Messianic Prophecies',
      prophecies: [
        { verse: 'Isaiah 53:5', text: 'Wounded for transgressions', theme: 'messiah', symbol: 'suffering_servant' },
        { verse: 'Micah 5:2', text: 'Born in Bethlehem', theme: 'messiah', symbol: 'birthplace' },
        { verse: 'Zechariah 9:9', text: 'King on donkey', theme: 'messiah', symbol: 'humble_king' }
      ],
      fulfillments: [
        { verse: '1 Peter 2:24', text: 'Bore our sins', connection: 'Isaiah 53:5' },
        { verse: 'Matthew 2:1', text: 'Born in Bethlehem', connection: 'Micah 5:2' },
        { verse: 'Matthew 21:5', text: 'Enters on donkey', connection: 'Zechariah 9:9' }
      ]
    }
  };

  async generateProphecyWeb(
    focusTheme?: 'daniel' | 'sanctuary' | 'messiah' | 'all'
  ): Promise<ProphecyWeb> {
    const nodes: ProphecyNode[] = [];
    const connections: ProphecyConnection[] = [];
    const themes: any[] = [];

    if (!focusTheme || focusTheme === 'all' || focusTheme === 'daniel') {
      this.addDanielRevelationWeb(nodes, connections);
      themes.push({ name: 'Daniel-Revelation', nodes: [], color: '#ef4444' });
    }

    if (!focusTheme || focusTheme === 'all' || focusTheme === 'sanctuary') {
      this.addSanctuaryWeb(nodes, connections);
      themes.push({ name: 'Sanctuary', nodes: [], color: '#fbbf24' });
    }

    if (!focusTheme || focusTheme === 'all' || focusTheme === 'messiah') {
      this.addMessianicWeb(nodes, connections);
      themes.push({ name: 'Messianic', nodes: [], color: '#3b82f6' });
    }

    // Calculate metadata
    const prophecyNodes = nodes.filter(n => n.type === 'prophecy');
    const fulfillmentNodes = nodes.filter(n => n.type === 'fulfillment');
    const strongConnections = connections.filter(c => c.strength >= 0.9);

    return {
      nodes,
      connections,
      themes,
      metadata: {
        totalProphecies: prophecyNodes.length,
        totalFulfillments: fulfillmentNodes.length,
        strongestConnections: strongConnections.length
      }
    };
  }

  private addDanielRevelationWeb(nodes: ProphecyNode[], connections: ProphecyConnection[]): void {
    // Daniel 7 prophecies
    this.prophecyData.daniel7.prophecies.forEach((prop, idx) => {
      const angle = (idx / 3) * Math.PI * 2;
      nodes.push({
        id: `dan7-prop-${idx}`,
        reference: prop.verse,
        text: prop.text,
        type: 'prophecy',
        book: 'Daniel',
        testament: 'OT',
        position: {
          x: Math.cos(angle) * 10,
          y: -5,
          z: Math.sin(angle) * 10
        },
        size: 1.8,
        color: '#ef4444',
        significance: 'Major apocalyptic prophecy'
      });
    });

    // Revelation fulfillments
    this.prophecyData.daniel7.fulfillments.forEach((ful, idx) => {
      const angle = (idx / 3) * Math.PI * 2;
      nodes.push({
        id: `rev-ful-${idx}`,
        reference: ful.verse,
        text: ful.text,
        type: 'fulfillment',
        book: 'Revelation',
        testament: 'NT',
        position: {
          x: Math.cos(angle) * 10,
          y: 5,
          z: Math.sin(angle) * 10
        },
        size: 1.8,
        color: '#8b5cf6',
        significance: 'Apocalyptic fulfillment'
      });

      // Connect to prophecy
      const propIdx = this.prophecyData.daniel7.prophecies.findIndex(
        p => p.verse === ful.connection
      );
      if (propIdx >= 0) {
        connections.push({
          source: `dan7-prop-${propIdx}`,
          target: `rev-ful-${idx}`,
          type: 'fulfills',
          strength: 0.95,
          color: '#ef4444',
          explanation: 'Direct prophetic fulfillment'
        });
      }
    });

    // Daniel 8 - 2300 days
    nodes.push({
      id: 'dan8-2300',
      reference: 'Daniel 8:14',
      text: '2300 days prophecy',
      type: 'prophecy',
      book: 'Daniel',
      testament: 'OT',
      position: { x: 0, y: -8, z: 0 },
      size: 2.2,
      color: '#fbbf24',
      significance: 'Longest time prophecy'
    });
  }

  private addSanctuaryWeb(nodes: ProphecyNode[], connections: ProphecyConnection[]): void {
    // OT Sanctuary
    this.prophecyData.sanctuary.prophecies.forEach((prop, idx) => {
      nodes.push({
        id: `sanc-ot-${idx}`,
        reference: prop.verse,
        text: prop.text,
        type: 'prophecy',
        book: prop.verse.split(' ')[0],
        testament: 'OT',
        position: {
          x: -8 + idx * 4,
          y: -3,
          z: -5
        },
        size: 1.6,
        color: '#fbbf24',
        significance: 'Sanctuary typology'
      });
    });

    // NT Fulfillment
    this.prophecyData.sanctuary.fulfillments.forEach((ful, idx) => {
      nodes.push({
        id: `sanc-nt-${idx}`,
        reference: ful.verse,
        text: ful.text,
        type: 'fulfillment',
        book: ful.verse.split(' ')[0],
        testament: 'NT',
        position: {
          x: -8 + idx * 4,
          y: 3,
          z: -5
        },
        size: 1.6,
        color: '#10b981',
        significance: 'Heavenly sanctuary reality'
      });

      // Connect
      const propIdx = this.prophecyData.sanctuary.prophecies.findIndex(
        p => p.verse === ful.connection
      );
      if (propIdx >= 0) {
        connections.push({
          source: `sanc-ot-${propIdx}`,
          target: `sanc-nt-${idx}`,
          type: 'typology',
          strength: 0.9,
          color: '#fbbf24',
          explanation: 'Type meets antitype'
        });
      }
    });
  }

  private addMessianicWeb(nodes: ProphecyNode[], connections: ProphecyConnection[]): void {
    // Messianic prophecies
    this.prophecyData.messiah.prophecies.forEach((prop, idx) => {
      const angle = (idx / 3) * Math.PI * 2 + Math.PI;
      nodes.push({
        id: `messiah-prop-${idx}`,
        reference: prop.verse,
        text: prop.text,
        type: 'prophecy',
        book: prop.verse.split(' ')[0],
        testament: 'OT',
        position: {
          x: Math.cos(angle) * 8,
          y: -4,
          z: Math.sin(angle) * 8
        },
        size: 1.5,
        color: '#3b82f6',
        significance: 'Messianic prophecy'
      });
    });

    // NT Fulfillments
    this.prophecyData.messiah.fulfillments.forEach((ful, idx) => {
      const angle = (idx / 3) * Math.PI * 2 + Math.PI;
      nodes.push({
        id: `messiah-ful-${idx}`,
        reference: ful.verse,
        text: ful.text,
        type: 'fulfillment',
        book: ful.verse.split(' ')[0],
        testament: 'NT',
        position: {
          x: Math.cos(angle) * 8,
          y: 4,
          z: Math.sin(angle) * 8
        },
        size: 1.5,
        color: '#10b981',
        significance: 'Christ fulfills prophecy'
      });

      // Connect
      const propIdx = this.prophecyData.messiah.prophecies.findIndex(
        p => p.verse === ful.connection
      );
      if (propIdx >= 0) {
        connections.push({
          source: `messiah-prop-${propIdx}`,
          target: `messiah-ful-${idx}`,
          type: 'fulfills',
          strength: 1.0,
          color: '#3b82f6',
          explanation: 'Messianic fulfillment in Christ'
        });
      }
    });
  }

  async get2300DaysThread(): Promise<any> {
    return {
      prophecy: {
        reference: 'Daniel 8:14',
        text: 'Unto two thousand and three hundred days; then shall the sanctuary be cleansed',
        significance: 'Longest time prophecy in Scripture'
      },
      connections: [
        {
          reference: 'Daniel 9:24-27',
          text: '70 weeks prophecy',
          relationship: 'Starting point determination'
        },
        {
          reference: 'Ezra 7:7-9',
          text: '457 BC decree',
          relationship: 'Historical anchor'
        },
        {
          reference: 'Hebrews 8:1-2',
          text: 'Heavenly sanctuary',
          relationship: 'Sanctuary location'
        },
        {
          reference: 'Hebrews 9:23-24',
          text: 'Cleansing of heavenly things',
          relationship: 'Cleansing fulfillment'
        }
      ],
      timeline: {
        start: -457,
        prophetic_end: 1844,
        significance: 'Beginning of investigative judgment'
      }
    };
  }
}
