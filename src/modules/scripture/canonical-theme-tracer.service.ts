import { Injectable } from '@nestjs/common';

export interface ThemeThread {
  theme: string;
  description: string;
  verses: ThemeVerse[];
  category: 'covenant' | 'sanctuary' | 'kingdom' | 'sacrifice' | 'sabbath' | 'remnant' | 'prophecy' | 'gospel';
}

export interface ThemeVerse {
  reference: string;
  snippet: string;
  role: 'foundation' | 'development' | 'fulfillment' | 'application';
}

@Injectable()
export class CanonicalThemeTracerService {
  private themeIndex: Map<string, ThemeThread> = new Map();

  constructor() {
    this.initializeThemeData();
  }

  getThemesForPassage(reference: string): ThemeThread[] {
    const results: ThemeThread[] = [];
    
    for (const thread of this.themeIndex.values()) {
      if (thread.verses.some(v => this.referencesMatch(v.reference, reference))) {
        results.push(thread);
      }
    }
    
    return results;
  }

  getThemeByName(themeName: string): ThemeThread | null {
    return this.themeIndex.get(themeName.toLowerCase()) || null;
  }

  getAllThemes(): ThemeThread[] {
    return Array.from(this.themeIndex.values());
  }

  getThemesByCategory(category: ThemeThread['category']): ThemeThread[] {
    return Array.from(this.themeIndex.values()).filter(t => t.category === category);
  }

  private referencesMatch(ref1: string, ref2: string): boolean {
    // Simple book-chapter match for now
    const book1 = ref1.split(/\s+\d/)[0];
    const book2 = ref2.split(/\s+\d/)[0];
    return book1.toLowerCase() === book2.toLowerCase();
  }

  private initializeThemeData() {
    // Covenant Theme
    this.themeIndex.set('covenant', {
      theme: 'Covenant',
      description: 'God\'s covenant relationship with His people throughout Scripture',
      category: 'covenant',
      verses: [
        { reference: 'Genesis 12:1-3', snippet: 'Abrahamic covenant', role: 'foundation' },
        { reference: 'Exodus 19:5-6', snippet: 'Sinai covenant', role: 'development' },
        { reference: 'Jeremiah 31:31-34', snippet: 'New covenant promise', role: 'development' },
        { reference: 'Hebrews 8:6-13', snippet: 'New covenant fulfillment', role: 'fulfillment' },
        { reference: 'Revelation 21:3', snippet: 'Eternal covenant consummation', role: 'fulfillment' }
      ]
    });

    // Sanctuary Theme
    this.themeIndex.set('sanctuary', {
      theme: 'Sanctuary',
      description: 'The sanctuary system revealing God\'s plan of salvation',
      category: 'sanctuary',
      verses: [
        { reference: 'Exodus 25:8-9', snippet: 'Earthly sanctuary commanded', role: 'foundation' },
        { reference: 'Leviticus 16:29-34', snippet: 'Day of Atonement ritual', role: 'development' },
        { reference: 'Hebrews 8:1-2', snippet: 'Christ in heavenly sanctuary', role: 'fulfillment' },
        { reference: 'Hebrews 9:11-12', snippet: 'Christ\'s superior ministry', role: 'fulfillment' },
        { reference: 'Daniel 8:14', snippet: 'Cleansing of sanctuary', role: 'development' },
        { reference: 'Revelation 11:19', snippet: 'Heavenly temple opened', role: 'fulfillment' }
      ]
    });

    // Sabbath Theme
    this.themeIndex.set('sabbath', {
      theme: 'Sabbath',
      description: 'The seventh-day Sabbath as memorial of Creation and sign of sanctification',
      category: 'sabbath',
      verses: [
        { reference: 'Genesis 2:2-3', snippet: 'Sabbath instituted at Creation', role: 'foundation' },
        { reference: 'Exodus 20:8-11', snippet: 'Sabbath commandment', role: 'development' },
        { reference: 'Isaiah 58:13-14', snippet: 'Sabbath delight', role: 'development' },
        { reference: 'Ezekiel 20:12', snippet: 'Sabbath as sign', role: 'development' },
        { reference: 'Mark 2:27-28', snippet: 'Jesus as Lord of Sabbath', role: 'fulfillment' },
        { reference: 'Hebrews 4:9-10', snippet: 'Sabbath rest remains', role: 'application' }
      ]
    });

    // Prophecy - 2300 Days
    this.themeIndex.set('2300-days', {
      theme: '2300 Days Prophecy',
      description: 'The prophetic timeline pointing to the investigative judgment',
      category: 'prophecy',
      verses: [
        { reference: 'Daniel 8:14', snippet: '2300 days prophecy', role: 'foundation' },
        { reference: 'Daniel 9:24-27', snippet: '70 weeks prophecy (starting point)', role: 'development' },
        { reference: 'Leviticus 16:29-30', snippet: 'Day of Atonement type', role: 'foundation' },
        { reference: 'Hebrews 9:23-24', snippet: 'Heavenly things cleansed', role: 'fulfillment' },
        { reference: 'Revelation 14:6-7', snippet: 'Judgment hour message', role: 'application' }
      ]
    });

    // Remnant Theme
    this.themeIndex.set('remnant', {
      theme: 'Remnant',
      description: 'God\'s faithful remnant people in the last days',
      category: 'remnant',
      verses: [
        { reference: '1 Kings 19:18', snippet: '7000 who have not bowed to Baal', role: 'foundation' },
        { reference: 'Isaiah 10:20-22', snippet: 'Remnant will return', role: 'development' },
        { reference: 'Romans 11:5', snippet: 'Remnant according to grace', role: 'development' },
        { reference: 'Revelation 12:17', snippet: 'Remnant keeps commandments', role: 'fulfillment' },
        { reference: 'Revelation 14:12', snippet: 'Patience of the saints', role: 'application' }
      ]
    });

    // Gospel Theme
    this.themeIndex.set('gospel', {
      theme: 'Gospel',
      description: 'The good news of salvation through Jesus Christ',
      category: 'gospel',
      verses: [
        { reference: 'Genesis 3:15', snippet: 'First gospel promise', role: 'foundation' },
        { reference: 'Isaiah 53:5-6', snippet: 'Suffering servant prophecy', role: 'development' },
        { reference: 'John 3:16', snippet: 'God\'s love and gift', role: 'fulfillment' },
        { reference: 'Romans 1:16-17', snippet: 'Power of the gospel', role: 'application' },
        { reference: 'Revelation 14:6', snippet: 'Everlasting gospel', role: 'application' }
      ]
    });

    // Kingdom Theme
    this.themeIndex.set('kingdom', {
      theme: 'Kingdom of God',
      description: 'God\'s eternal kingdom and its establishment',
      category: 'kingdom',
      verses: [
        { reference: 'Daniel 2:44', snippet: 'Kingdom that shall never be destroyed', role: 'foundation' },
        { reference: 'Daniel 7:13-14', snippet: 'Son of Man receives kingdom', role: 'development' },
        { reference: 'Matthew 6:33', snippet: 'Seek first the kingdom', role: 'application' },
        { reference: 'Luke 17:20-21', snippet: 'Kingdom within you', role: 'development' },
        { reference: 'Revelation 11:15', snippet: 'Kingdoms become Christ\'s', role: 'fulfillment' }
      ]
    });

    // Sacrifice Theme
    this.themeIndex.set('sacrifice', {
      theme: 'Sacrifice',
      description: 'The sacrificial system pointing to Christ\'s atonement',
      category: 'sacrifice',
      verses: [
        { reference: 'Genesis 22:8', snippet: 'God will provide the lamb', role: 'foundation' },
        { reference: 'Exodus 12:5-7', snippet: 'Passover lamb', role: 'development' },
        { reference: 'Leviticus 17:11', snippet: 'Blood makes atonement', role: 'development' },
        { reference: 'Isaiah 53:7', snippet: 'Led as lamb to slaughter', role: 'development' },
        { reference: 'John 1:29', snippet: 'Lamb of God', role: 'fulfillment' },
        { reference: 'Hebrews 9:26', snippet: 'Once for all sacrifice', role: 'fulfillment' }
      ]
    });
  }
}
