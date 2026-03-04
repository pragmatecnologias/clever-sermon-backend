import { Injectable } from '@nestjs/common';

export interface PerVerseContext {
  reference: string;
  historical?: HistoricalNote[];
  cultural?: CulturalNote[];
  geographical?: GeographicalNote[];
  timeline?: TimelineEvent[];
  dataSource: 'curated' | 'unavailable';
}

export interface HistoricalNote {
  note: string;
  period?: string;
  source?: string;
}

export interface CulturalNote {
  note: string;
  category: 'custom' | 'law' | 'practice' | 'belief' | 'social';
  source?: string;
}

export interface GeographicalNote {
  place: string;
  description: string;
  significance: string;
  modernLocation?: string;
}

export interface TimelineEvent {
  event: string;
  date: string;
  significance: string;
}

@Injectable()
export class PerVerseContextService {
  private contextIndex: Map<string, PerVerseContext> = new Map();

  constructor() {
    this.initializeContextData();
  }

  getVerseContext(reference: string): PerVerseContext {
    const normalized = this.normalizeReference(reference);
    const context = this.contextIndex.get(normalized);
    
    if (context) {
      return { ...context, dataSource: 'curated' };
    }

    return {
      reference,
      dataSource: 'unavailable'
    };
  }

  private normalizeReference(ref: string): string {
    return ref.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private initializeContextData() {
    // John 4:9 - Samaritan woman
    this.contextIndex.set('john 4:9', {
      reference: 'John 4:9',
      historical: [
        {
          note: 'Jews and Samaritans had been in conflict since the Assyrian conquest (722 BC) when foreigners were settled in Samaria',
          period: 'Intertestamental Period',
          source: '2 Kings 17:24-41'
        },
        {
          note: 'Samaritans built rival temple on Mount Gerizim (destroyed by John Hyrcanus in 128 BC)',
          period: 'Hasmonean Period'
        }
      ],
      cultural: [
        {
          note: 'Jewish men typically did not speak to women in public, especially not foreign women',
          category: 'social',
          source: 'Rabbinic tradition'
        },
        {
          note: 'Jews considered Samaritans ceremonially unclean; sharing vessels would defile',
          category: 'law'
        }
      ],
      geographical: [
        {
          place: 'Sychar',
          description: 'Samaritan town near Jacob\'s well',
          significance: 'Located near ancient Shechem, site of covenant renewal (Joshua 24)',
          modernLocation: 'Near modern Nablus, West Bank'
        }
      ],
      dataSource: 'curated'
    });

    // Matthew 27:46 - Eli, Eli, lama sabachthani
    this.contextIndex.set('matthew 27:46', {
      reference: 'Matthew 27:46',
      historical: [
        {
          note: 'Crucifixion was Roman method of execution for slaves and non-citizens',
          period: 'Roman Period',
          source: 'Historical records'
        },
        {
          note: 'Darkness from sixth to ninth hour (noon to 3 PM) was supernatural',
          period: 'AD 30 or 33'
        }
      ],
      cultural: [
        {
          note: 'Jews recited Psalms during times of distress; Psalm 22 is messianic',
          category: 'practice'
        },
        {
          note: 'Aramaic was common language of Palestinian Jews in first century',
          category: 'custom'
        }
      ],
      timeline: [
        {
          event: 'Crucifixion of Jesus',
          date: 'Friday, Nisan 14, AD 30 or 33',
          significance: 'Passover preparation day; Jesus as Passover Lamb'
        }
      ],
      dataSource: 'curated'
    });

    // Daniel 8:14 - 2300 days
    this.contextIndex.set('daniel 8:14', {
      reference: 'Daniel 8:14',
      historical: [
        {
          note: 'Daniel received vision in third year of Belshazzar (c. 551 BC)',
          period: 'Neo-Babylonian Period',
          source: 'Daniel 8:1'
        },
        {
          note: 'Vision follows pattern of Daniel 2 and 7: succession of kingdoms',
          period: 'Prophetic'
        }
      ],
      cultural: [
        {
          note: 'Day of Atonement (Yom Kippur) involved sanctuary cleansing annually',
          category: 'practice',
          source: 'Leviticus 16'
        },
        {
          note: 'Sanctuary represented God\'s dwelling and covenant relationship',
          category: 'belief'
        }
      ],
      timeline: [
        {
          event: 'Vision given to Daniel',
          date: 'c. 551 BC',
          significance: 'During Babylonian captivity'
        },
        {
          event: 'Decree of Artaxerxes (starting point)',
          date: '457 BC',
          significance: 'Restoration of Jerusalem (Ezra 7)'
        },
        {
          event: 'End of 2300 years',
          date: 'AD 1844',
          significance: 'Beginning of investigative judgment (SDA interpretation)'
        }
      ],
      dataSource: 'curated'
    });

    // Exodus 20:8 - Remember the Sabbath
    this.contextIndex.set('exodus 20:8', {
      reference: 'Exodus 20:8',
      historical: [
        {
          note: 'Given at Mount Sinai approximately 3 months after Exodus from Egypt',
          period: 'c. 1446 BC (traditional dating)',
          source: 'Exodus 19:1'
        },
        {
          note: 'Sabbath already known before Sinai (Exodus 16:23-30)',
          period: 'Wilderness Period'
        }
      ],
      cultural: [
        {
          note: 'Sabbath observance distinguished Israel from surrounding nations',
          category: 'practice'
        },
        {
          note: 'Sabbath was sign of covenant relationship (Exodus 31:13)',
          category: 'belief'
        },
        {
          note: 'Death penalty for Sabbath breaking showed its importance (Numbers 15:32-36)',
          category: 'law'
        }
      ],
      timeline: [
        {
          event: 'Creation Sabbath',
          date: 'Creation week',
          significance: 'God rested on seventh day (Genesis 2:2-3)'
        },
        {
          event: 'Manna and Sabbath',
          date: 'Wilderness of Sin',
          significance: 'Sabbath observance before Sinai (Exodus 16)'
        },
        {
          event: 'Ten Commandments given',
          date: 'c. 1446 BC',
          significance: 'Sabbath enshrined in moral law'
        }
      ],
      dataSource: 'curated'
    });

    // Acts 2:38 - Baptism and gift of Holy Spirit
    this.contextIndex.set('acts 2:38', {
      reference: 'Acts 2:38',
      historical: [
        {
          note: 'Day of Pentecost, 50 days after Passover/Resurrection',
          period: 'AD 31',
          source: 'Acts 2:1'
        },
        {
          note: 'Jewish pilgrims from many nations present in Jerusalem',
          period: 'Roman Period'
        }
      ],
      cultural: [
        {
          note: 'Pentecost (Feast of Weeks) celebrated wheat harvest and giving of Torah',
          category: 'practice',
          source: 'Leviticus 23:15-21'
        },
        {
          note: 'Baptism was known from John the Baptist and Jewish proselyte baptism',
          category: 'custom'
        },
        {
          note: 'Baptism in Jesus\' name was new, signifying allegiance to Messiah',
          category: 'belief'
        }
      ],
      timeline: [
        {
          event: 'Pentecost outpouring',
          date: 'AD 31 (50 days after resurrection)',
          significance: 'Birth of the church, fulfillment of Joel 2:28-32'
        }
      ],
      dataSource: 'curated'
    });

    // Revelation 14:7 - Hour of judgment
    this.contextIndex.set('revelation 14:7', {
      reference: 'Revelation 14:7',
      historical: [
        {
          note: 'Written during Roman persecution, likely reign of Domitian (AD 81-96)',
          period: 'Late First Century AD',
          source: 'Early church tradition'
        }
      ],
      cultural: [
        {
          note: 'Language echoes Sabbath commandment (Exodus 20:11)',
          category: 'belief',
          source: 'Exodus 20:11'
        },
        {
          note: 'Day of Atonement imagery: judgment hour',
          category: 'practice',
          source: 'Leviticus 16'
        }
      ],
      timeline: [
        {
          event: 'First angel\'s message',
          date: 'Prophetic (1840s onward, SDA interpretation)',
          significance: 'Proclamation of judgment hour beginning'
        }
      ],
      dataSource: 'curated'
    });
  }

  hasContextData(reference: string): boolean {
    const normalized = this.normalizeReference(reference);
    return this.contextIndex.has(normalized);
  }

  getAllAvailableVerses(): string[] {
    return Array.from(this.contextIndex.keys());
  }
}
