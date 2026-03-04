import { Injectable } from '@nestjs/common';

export interface InterpretiveChallenge {
  passage: string;
  challenge: string;
  views: InterpretiveView[];
  sdaPerspective?: SDAPerspective;
  dataSource: 'curated' | 'unavailable';
}

export interface InterpretiveView {
  viewName: string;
  summary: string;
  proponents?: string;
  keyArguments: string[];
}

export interface SDAPerspective {
  position: string;
  reasoning: string;
  supportingTexts?: string[];
}

@Injectable()
export class InterpretiveChallengesDataService {
  private challengeIndex: Map<string, InterpretiveChallenge> = new Map();

  constructor() {
    this.initializeChallengeData();
  }

  getInterpretiveChallenge(passage: string): InterpretiveChallenge | null {
    const normalized = this.normalizePassage(passage);
    const challenge = this.challengeIndex.get(normalized);
    
    if (challenge) {
      return { ...challenge, dataSource: 'curated' };
    }

    return null;
  }

  private normalizePassage(passage: string): string {
    return passage.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private initializeChallengeData() {
    // Romans 9:13 - Jacob I loved, Esau I hated
    this.challengeIndex.set('romans 9:13', {
      passage: 'Romans 9:13',
      challenge: 'Does "Jacob I loved, but Esau I hated" mean God arbitrarily chose to love one and hate the other?',
      views: [
        {
          viewName: 'Corporate Election View',
          summary: 'God chose Israel (Jacob\'s descendants) for a specific role, not individual salvation',
          keyArguments: [
            'Context is about nations (Israel and Edom), not individuals',
            'Election is for service and mission, not eternal destiny',
            'Malachi 1:2-3 refers to nations, not persons'
          ]
        },
        {
          viewName: 'Individual Predestination View',
          summary: 'God sovereignly chose Jacob for salvation and rejected Esau',
          proponents: 'Reformed/Calvinist tradition',
          keyArguments: [
            'Choice made before birth (v. 11)',
            'Not based on works but on God\'s call',
            'Demonstrates God\'s sovereign mercy'
          ]
        },
        {
          viewName: 'Hebraic Idiom View',
          summary: '"Hate" is a Hebrew idiom meaning "loved less" or "not chosen for this role"',
          keyArguments: [
            'Similar usage in Luke 14:26 (hate father and mother)',
            'Comparative language, not absolute hatred',
            'God\'s love for all is affirmed elsewhere (John 3:16)'
          ]
        }
      ],
      sdaPerspective: {
        position: 'Corporate election for mission; God does not arbitrarily hate individuals',
        reasoning: 'God\'s character of love (1 John 4:8) is incompatible with arbitrary hatred. The passage addresses God\'s choice of Israel as a nation for a specific mission, not individual eternal destinies.',
        supportingTexts: ['1 John 4:8', 'Ezekiel 33:11', '2 Peter 3:9']
      },
      dataSource: 'curated'
    });

    // Matthew 24:34 - This generation
    this.challengeIndex.set('matthew 24:34', {
      passage: 'Matthew 24:34',
      challenge: 'What does "this generation will not pass away" mean? Did Jesus predict His return within that generation?',
      views: [
        {
          viewName: 'Preterist View',
          summary: 'Prophecy fulfilled in AD 70 with Jerusalem\'s destruction',
          keyArguments: [
            'Literal generation of Jesus\' contemporaries',
            'Temple destruction fulfilled the prophecy',
            'Matches historical events of first century'
          ]
        },
        {
          viewName: 'Futurist View',
          summary: '"This generation" refers to the generation alive when end-time signs appear',
          keyArguments: [
            'Context includes events beyond AD 70 (v. 29-31)',
            'Generation that sees all these signs',
            'Fig tree parable indicates timing markers'
          ]
        },
        {
          viewName: 'Dual Fulfillment View',
          summary: 'Partial fulfillment in AD 70, complete fulfillment at Second Coming',
          keyArguments: [
            'Prophetic layering common in Scripture',
            'Near and far fulfillments',
            'AD 70 as type of final judgment'
          ]
        }
      ],
      sdaPerspective: {
        position: 'Dual fulfillment: AD 70 as type, final fulfillment at Second Coming',
        reasoning: 'The Olivet Discourse contains both near (AD 70) and far (Second Coming) prophecies. "This generation" in context refers to the generation witnessing the complete fulfillment of all signs.',
        supportingTexts: ['Matthew 24:3', 'Luke 21:20-24', 'Revelation 1:7']
      },
      dataSource: 'curated'
    });

    // 1 Corinthians 15:29 - Baptism for the dead
    this.challengeIndex.set('1 corinthians 15:29', {
      passage: '1 Corinthians 15:29',
      challenge: 'What is "baptism for the dead" and does Paul endorse it?',
      views: [
        {
          viewName: 'Vicarious Baptism View',
          summary: 'Some Corinthians practiced proxy baptism for deceased believers',
          proponents: 'Latter-day Saints',
          keyArguments: [
            'Plain reading suggests literal practice',
            'Paul uses it as argument for resurrection',
            'Historical evidence of early practice'
          ]
        },
        {
          viewName: 'Baptism "Because of" the Dead View',
          summary: 'Baptism motivated by hope of reunion with deceased believers',
          keyArguments: [
            'Greek "hyper" can mean "because of" or "for the sake of"',
            'Inspired by martyrs and faithful dead',
            'No other NT evidence of vicarious baptism'
          ]
        },
        {
          viewName: 'Rhetorical Reference View',
          summary: 'Paul mentions their practice without endorsing it',
          keyArguments: [
            'Paul says "they" not "we" or "you"',
            'Used as ad hominem argument',
            'No instruction about the practice elsewhere'
          ]
        }
      ],
      sdaPerspective: {
        position: 'Paul references a practice without endorsing it; no biblical support for vicarious baptism',
        reasoning: 'Paul uses their practice as a rhetorical argument for resurrection, but does not command or endorse it. Baptism is for living believers making personal decisions (Acts 2:38).',
        supportingTexts: ['Acts 2:38', 'Romans 6:3-4', 'Hebrews 9:27']
      },
      dataSource: 'curated'
    });

    // Hebrews 6:4-6 - Falling away
    this.challengeIndex.set('hebrews 6:4-6', {
      passage: 'Hebrews 6:4-6',
      challenge: 'Can a true believer lose salvation and be unable to return?',
      views: [
        {
          viewName: 'Loss of Salvation View',
          summary: 'True believers can fall away and lose salvation permanently',
          proponents: 'Arminian tradition',
          keyArguments: [
            'Describes genuine believers (enlightened, tasted, partakers)',
            'Impossible to renew them to repentance',
            'Warning is real, not hypothetical'
          ]
        },
        {
          viewName: 'Never Truly Saved View',
          summary: 'Those who fall away were never genuinely saved',
          proponents: 'Reformed/Calvinist tradition',
          keyArguments: [
            'True believers persevere (1 John 2:19)',
            'Describes external experiences, not regeneration',
            'Eternal security doctrine'
          ]
        },
        {
          viewName: 'Hypothetical Warning View',
          summary: 'Warning against apostasy; true believers will heed it',
          keyArguments: [
            'Warning serves to prevent falling away',
            'God preserves His own',
            'Rhetorical device to motivate faithfulness'
          ]
        }
      ],
      sdaPerspective: {
        position: 'Genuine believers can fall away through persistent rejection of Christ',
        reasoning: 'Free will remains throughout Christian life. The warning is real and necessary. However, God desires all to be saved and provides grace for restoration to those who return (Ezekiel 18:21-23).',
        supportingTexts: ['Ezekiel 18:24', '2 Peter 2:20-22', 'Revelation 2:4-5']
      },
      dataSource: 'curated'
    });

    // Daniel 8:14 - 2300 days
    this.challengeIndex.set('daniel 8:14', {
      passage: 'Daniel 8:14',
      challenge: 'What are the 2300 days and when does the sanctuary cleansing occur?',
      views: [
        {
          viewName: 'Antiochus Epiphanes View',
          summary: '2300 days refer to Antiochus\' desecration (167-164 BC)',
          proponents: 'Many modern scholars',
          keyArguments: [
            'Historical fulfillment in Maccabean period',
            'Literal 2300 days (about 6.3 years)',
            'Matches temple desecration period'
          ]
        },
        {
          viewName: 'Futurist/Dispensational View',
          summary: 'Future tribulation period, literal 2300 days',
          keyArguments: [
            'Awaits future fulfillment',
            'Connected to end-time Antichrist',
            'Literal interpretation'
          ]
        },
        {
          viewName: 'Historicist/Day-Year View',
          summary: '2300 prophetic days = 2300 years, ending in 1844',
          proponents: 'Seventh-day Adventist interpretation',
          keyArguments: [
            'Day-year principle (Numbers 14:34, Ezekiel 4:6)',
            'Starts 457 BC (Artaxerxes\' decree)',
            'Cleansing refers to heavenly sanctuary',
            'Connected to Daniel 9:24-27 (70 weeks)'
          ]
        }
      ],
      sdaPerspective: {
        position: '2300 prophetic years (457 BC to AD 1844); cleansing of heavenly sanctuary',
        reasoning: 'Using the day-year principle consistently applied in apocalyptic prophecy, the 2300 days begin with the decree to restore Jerusalem (457 BC) and conclude in 1844, marking the beginning of the investigative judgment in the heavenly sanctuary.',
        supportingTexts: ['Daniel 9:24-27', 'Hebrews 8:1-2', 'Hebrews 9:23-24', 'Leviticus 16']
      },
      dataSource: 'curated'
    });

    // Genesis 1 - Creation days
    this.challengeIndex.set('genesis 1', {
      passage: 'Genesis 1',
      challenge: 'Are the creation days literal 24-hour periods or symbolic ages?',
      views: [
        {
          viewName: 'Literal 24-Hour Days',
          summary: 'Six consecutive 24-hour days of creation',
          proponents: 'Young Earth Creationists, SDA',
          keyArguments: [
            'Evening and morning define literal days',
            'Exodus 20:11 links to Sabbath commandment',
            'Hebrew "yom" with number indicates literal day',
            'Genealogies suggest recent creation'
          ]
        },
        {
          viewName: 'Day-Age Theory',
          summary: 'Each day represents a long geological age',
          proponents: 'Progressive Creationists',
          keyArguments: [
            'Harmonizes with geological evidence',
            '"Day" can mean extended period (Psalm 90:4)',
            'Allows for old earth',
            'Maintains divine creation'
          ]
        },
        {
          viewName: 'Framework Hypothesis',
          summary: 'Literary framework, not chronological sequence',
          keyArguments: [
            'Topical arrangement (days 1-3 parallel 4-6)',
            'Theological message, not scientific account',
            'Ancient Near Eastern literary genre'
          ]
        }
      ],
      sdaPerspective: {
        position: 'Literal six consecutive 24-hour days of creation',
        reasoning: 'The Sabbath commandment (Exodus 20:8-11) explicitly grounds the weekly cycle in creation week. "Evening and morning" define literal days. Recent creation affirms God\'s direct creative power and the biblical timeline.',
        supportingTexts: ['Exodus 20:8-11', 'Mark 2:27', 'Hebrews 4:4']
      },
      dataSource: 'curated'
    });
  }

  hasChallengeData(passage: string): boolean {
    const normalized = this.normalizePassage(passage);
    return this.challengeIndex.has(normalized);
  }

  getAllAvailableChallenges(): string[] {
    return Array.from(this.challengeIndex.keys());
  }
}
