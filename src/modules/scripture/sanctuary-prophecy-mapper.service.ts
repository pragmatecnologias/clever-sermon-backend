import { Injectable } from '@nestjs/common';

export interface SanctuaryConnection {
  sourcePassage: string;
  targetPassages: string[];
  connectionType: 'type_antitype' | 'parallel' | 'fulfillment' | 'thematic';
  description: string;
}

export interface ProphecyConnection {
  passage: string;
  connectedPassages: string[];
  theme: string;
  description: string;
}

@Injectable()
export class SanctuaryProphecyMapperService {
  private sanctuaryMap: Map<string, SanctuaryConnection> = new Map();
  private prophecyMap: Map<string, ProphecyConnection> = new Map();

  constructor() {
    this.initializeSanctuaryConnections();
    this.initializeProphecyConnections();
  }

  getSanctuaryConnections(passage: string): SanctuaryConnection[] {
    const results: SanctuaryConnection[] = [];
    const bookChapter = this.extractBookChapter(passage);
    
    for (const [key, connection] of this.sanctuaryMap.entries()) {
      if (key.includes(bookChapter) || connection.targetPassages.some(p => p.includes(bookChapter))) {
        results.push(connection);
      }
    }
    
    return results;
  }

  getProphecyConnections(passage: string): ProphecyConnection[] {
    const results: ProphecyConnection[] = [];
    const bookChapter = this.extractBookChapter(passage);
    
    for (const connection of this.prophecyMap.values()) {
      if (connection.passage.includes(bookChapter) || 
          connection.connectedPassages.some(p => p.includes(bookChapter))) {
        results.push(connection);
      }
    }
    
    return results;
  }

  getAllSanctuaryThreads(): SanctuaryConnection[] {
    return Array.from(this.sanctuaryMap.values());
  }

  getAllProphecyThreads(): ProphecyConnection[] {
    return Array.from(this.prophecyMap.values());
  }

  private extractBookChapter(passage: string): string {
    const match = passage.match(/^([\w\s]+)\s+(\d+)/);
    return match ? `${match[1]} ${match[2]}` : passage;
  }

  private initializeSanctuaryConnections() {
    // Hebrews 8 → Sanctuary connections
    this.sanctuaryMap.set('hebrews-8', {
      sourcePassage: 'Hebrews 8:1-5',
      targetPassages: [
        'Exodus 25:8-9',
        'Exodus 25:40',
        'Leviticus 16:2',
        'Numbers 24:5-6',
        'Revelation 11:19',
        'Revelation 15:5'
      ],
      connectionType: 'type_antitype',
      description: 'Heavenly sanctuary as the true tabernacle, earthly sanctuary as copy and shadow'
    });

    // Hebrews 9 → Day of Atonement
    this.sanctuaryMap.set('hebrews-9', {
      sourcePassage: 'Hebrews 9:11-28',
      targetPassages: [
        'Leviticus 16:1-34',
        'Leviticus 23:27-32',
        'Daniel 8:14',
        'Revelation 11:19'
      ],
      connectionType: 'type_antitype',
      description: 'Christ\'s ministry in heavenly sanctuary fulfills Day of Atonement typology'
    });

    // Daniel 8:14 → Sanctuary cleansing
    this.sanctuaryMap.set('daniel-8-14', {
      sourcePassage: 'Daniel 8:14',
      targetPassages: [
        'Leviticus 16:16',
        'Leviticus 16:30',
        'Hebrews 9:23',
        'Revelation 11:19',
        'Revelation 14:6-7'
      ],
      connectionType: 'fulfillment',
      description: 'Cleansing of sanctuary connects to investigative judgment and Day of Atonement'
    });

    // Exodus 25 → Sanctuary pattern
    this.sanctuaryMap.set('exodus-25', {
      sourcePassage: 'Exodus 25:8-9',
      targetPassages: [
        'Exodus 25:40',
        'Hebrews 8:5',
        'Hebrews 9:23-24',
        'Revelation 11:19',
        'Revelation 15:5'
      ],
      connectionType: 'type_antitype',
      description: 'Earthly sanctuary built according to heavenly pattern'
    });

    // Leviticus 16 → Day of Atonement
    this.sanctuaryMap.set('leviticus-16', {
      sourcePassage: 'Leviticus 16:1-34',
      targetPassages: [
        'Daniel 8:14',
        'Hebrews 9:7-12',
        'Hebrews 9:23-28',
        'Revelation 11:19'
      ],
      connectionType: 'type_antitype',
      description: 'Day of Atonement ritual as type of final judgment'
    });

    // Revelation 11:19 → Heavenly temple
    this.sanctuaryMap.set('revelation-11-19', {
      sourcePassage: 'Revelation 11:19',
      targetPassages: [
        'Exodus 25:16',
        'Exodus 40:20',
        'Deuteronomy 10:5',
        'Hebrews 9:4',
        'Revelation 15:5'
      ],
      connectionType: 'fulfillment',
      description: 'Ark of covenant visible in heavenly temple, connecting to law and judgment'
    });
  }

  private initializeProphecyConnections() {
    // Daniel 2 → Kingdom prophecy
    this.prophecyMap.set('daniel-2', {
      passage: 'Daniel 2:31-45',
      connectedPassages: [
        'Daniel 7:1-28',
        'Daniel 8:1-27',
        'Revelation 13:1-18',
        'Revelation 17:1-18'
      ],
      theme: 'Succession of world kingdoms',
      description: 'Image of kingdoms from Babylon to God\'s eternal kingdom'
    });

    // Daniel 7 → Beasts and judgment
    this.prophecyMap.set('daniel-7', {
      passage: 'Daniel 7:1-28',
      connectedPassages: [
        'Daniel 2:31-45',
        'Daniel 8:1-27',
        'Revelation 13:1-18',
        'Revelation 14:6-12',
        'Revelation 17:1-18'
      ],
      theme: 'Beasts, little horn, and investigative judgment',
      description: 'Four beasts parallel Daniel 2, judgment scene, and little horn power'
    });

    // Daniel 8 → 2300 days
    this.prophecyMap.set('daniel-8', {
      passage: 'Daniel 8:1-27',
      connectedPassages: [
        'Daniel 9:24-27',
        'Leviticus 16:1-34',
        'Hebrews 9:23-28',
        'Revelation 14:6-7'
      ],
      theme: '2300 days and sanctuary cleansing',
      description: 'Ram, goat, little horn, and 2300 days prophecy'
    });

    // Daniel 9 → 70 weeks
    this.prophecyMap.set('daniel-9', {
      passage: 'Daniel 9:24-27',
      connectedPassages: [
        'Daniel 8:14',
        'Ezra 7:7-26',
        'Nehemiah 2:1-8',
        'Matthew 3:13-17',
        'Luke 3:1-23'
      ],
      theme: '70 weeks and Messiah',
      description: 'Prophetic timeline to Messiah and starting point for 2300 days'
    });

    // Revelation 12 → Woman and dragon
    this.prophecyMap.set('revelation-12', {
      passage: 'Revelation 12:1-17',
      connectedPassages: [
        'Genesis 3:15',
        'Daniel 7:25',
        'Revelation 13:1-18',
        'Revelation 14:12'
      ],
      theme: 'Church through ages and remnant',
      description: 'Pure woman (church), dragon (Satan), 1260 days persecution, remnant'
    });

    // Revelation 13 → Beasts
    this.prophecyMap.set('revelation-13', {
      passage: 'Revelation 13:1-18',
      connectedPassages: [
        'Daniel 7:1-28',
        'Daniel 8:9-14',
        'Revelation 12:17',
        'Revelation 14:9-12',
        'Revelation 17:1-18'
      ],
      theme: 'Sea beast and earth beast',
      description: 'Beast from sea (papacy), beast from earth (USA), mark of the beast'
    });

    // Revelation 14 → Three angels
    this.prophecyMap.set('revelation-14', {
      passage: 'Revelation 14:6-12',
      connectedPassages: [
        'Daniel 8:14',
        'Exodus 20:8-11',
        'Revelation 13:15-17',
        'Revelation 18:1-4'
      ],
      theme: 'Three angels\' messages',
      description: 'Everlasting gospel, judgment hour, Babylon fallen, mark warning'
    });

    // Revelation 17 → Babylon
    this.prophecyMap.set('revelation-17', {
      passage: 'Revelation 17:1-18',
      connectedPassages: [
        'Daniel 2:31-45',
        'Daniel 7:1-28',
        'Revelation 13:1-18',
        'Revelation 14:8',
        'Revelation 18:1-24'
      ],
      theme: 'Mystery Babylon',
      description: 'Woman on scarlet beast, seven heads and ten horns, fall of Babylon'
    });
  }
}
