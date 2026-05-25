import { GeneratedStudyOutputValidator } from './generated-study-output.validator';

describe('GeneratedStudyOutputValidator', () => {
  const validator = new GeneratedStudyOutputValidator();

  it('rejects scaffold text in passage summaries', () => {
    const result = validator.validate('passage-summary', {
      passage: 'Psalm 37:23-24',
      summary: 'Passage summary is generated and stored in the workspace.',
      interpretiveCenter: 'This verse summarizes the passage’s central truth...',
      mainTension: 'Run cross-reference lookup for the selected passage.',
      movement: ['State the passage', 'Show how'],
    }, { reference: 'Psalm 37:23-24', language: 'en' });

    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/forbidden|missing|prompt|movement/i);
  });

  it('rejects multi-verse passage summaries that stay too thin', () => {
    const result = validator.validate('passage-summary', {
      passage: 'Revelation 14:6-12',
      summary: 'Revelation 14:6: And I saw another angel fly in the midst of heaven...',
      interpretiveCenter: 'The passage speaks to worship and allegiance.',
      mainTension: 'The passage raises the question of loyalty.',
      movement: ['The first verse introduces the message.'],
    }, { reference: 'Revelation 14:6-12', language: 'en' });

    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/multi-verse passage summary|raw verse prefix/i);
  });

  it('accepts a clean passage movement payload', () => {
    const result = validator.validate('passage-movement', {
      movement: [
        'The Lord establishes the path of the righteous.',
        'The righteous may still stumble.',
        'The Lord upholds them so the fall is not final.',
      ],
    }, { reference: 'Psalm 37:23-24', language: 'en' });

    expect(result.valid).toBe(true);
  });

  it('accepts a clean unavailable study report payload', () => {
    const result = validator.validate('study-report', {
      status: 'unavailable',
      message: 'Study report could not be generated. Please retry.',
      passageOverview: '',
      literaryContext: '',
      historicalContext: '',
      canonicalContext: '',
      exegeticalSummary: '',
      mainTheologicalClaim: '',
      preachingFocus: '',
      exegeticalFlow: [],
      structureOfPassage: [],
      keyTerms: [],
      theologicalThemes: [],
      interpretiveChallenges: [],
      pastoralImplications: {
        personalLife: [],
        churchLife: [],
        mission: [],
      },
      studyAssets: {
        movementAssets: [],
        categoryAssets: {
          applications: [],
          discussionQuestions: [],
          illustrationIdeas: [],
          mediaSuggestions: [],
          egwSupport: [],
          references: [],
        },
      },
    }, { reference: 'Revelation 14:6-12', language: 'en' });

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('none');
  });

  it('rejects a translated comparison row that is only a trailing fragment', () => {
    const result = validator.validate('translation-comparison', {
      reference: 'Psalm 37:23-24',
      translations: [
        {
          code: 'KJV',
          name: 'King James Version',
          text: 'The steps of a good man are ordered by the LORD',
          verses: [
            { number: '23', text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.', reference: 'Psalm 37:23' },
            { number: '24', text: 'Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.', reference: 'Psalm 37:24' },
          ],
          type: 'formal',
        },
        {
          code: 'WEB',
          name: 'World English Bible',
          text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way. Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.',
          verses: [
            { number: '23', text: 'for Yahweh holds him up with his hand.', reference: 'Psalm 37:23' },
            { number: '24', text: 'for Yahweh holds him up with his hand.', reference: 'Psalm 37:24' },
          ],
          type: 'formal',
        },
      ],
      keyDifferences: [],
      analysis: {
        verbDifferences: [],
        theologicalTermDifferences: [],
        literalVsDynamic: [],
        overallAssessment: 'The comparison is aligned.',
      },
    }, { reference: 'Psalm 37:23-24', language: 'en' });

    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/fragment|misaligned|repeated verse text/i);
  });

  it('rejects central claims that start with raw verse references', () => {
    const result = validator.validate('study-synthesis', {
      passage: 'Psalm 37:23-24',
      centralClaim: 'Psalm 37:23: God directs and sustains the life of the righteous.',
      canonicalSignificance: 'The psalm belongs to wisdom literature and trusts God’s sustaining hand.',
      pastoralTakeaway: 'Believers may stumble, but God keeps them from final ruin.',
      preachingFocus: 'Preach God’s faithful guidance and sustaining care.',
      dataSource: 'llm-generated',
    }, { reference: 'Psalm 37:23-24', language: 'en' });

    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/raw verse reference|forbidden scaffold phrase/i);
  });

  it('rejects structural analysis that omits the final verse and uses ellipses', () => {
    const result = validator.validate('structural-analysis', {
      passage: 'Revelation 14:6-12',
      literaryGenre: 'Prophetic apocalyptic',
      structure: [
        { verses: 'Revelation 14:6', type: 'transition', description: 'Worldwide gospel proclamation' },
        { verses: 'Revelation 14:7', type: 'body', description: 'Call to worship the Creator in the hour of judgment' },
        { verses: 'Revelation 14:8', type: 'body', description: 'Announcement of Babylon’s fall' },
        { verses: 'Revelation 14:9-11', type: 'climax', description: 'Warning against false worship and allegiance to the beast' },
      ],
      chiasm: null,
      parallelism: [],
    }, { reference: 'Revelation 14:6-12', language: 'en' });

    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/final verse|ellipsis/i);
  });

  it('accepts a clean unavailable payload for verse context', () => {
    const result = validator.validate('verse-context', {
      status: 'unavailable',
      moduleKey: 'verse-context',
      reference: 'Psalm 37:23-24',
      language: 'en',
      source: 'llm-generated',
      data: [],
      message: 'Historical context could not be generated. Please retry.',
      warnings: ['Historical context generation failed validation'],
      internalValidationErrors: [],
    }, { reference: 'Psalm 37:23-24', language: 'en' });

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('none');
  });

  it('rejects canonical themes that are too thin for a multi-verse passage', () => {
    const result = validator.validate('canonical-themes', {
      passage: 'Luke 15:11-24',
      themes: [
        {
          theme: 'Grace',
          description: 'Grace appears in the passage.',
          explanation: 'The passage mentions mercy.',
          canonicalMovement: 'Grace appears across Scripture.',
          category: 'grace',
          verses: [],
        },
      ],
      warnings: [],
    }, { reference: 'Luke 15:11-24', language: 'en' });

    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/too thin|generic only|missing theme name, passage anchor, or preaching use|missing development/i);
  });

  it('accepts rich canonical themes for Revelation 14:6-12', () => {
    const result = validator.validate('canonical-themes', {
      passage: 'Revelation 14:6-12',
      themes: [
        {
          theme: 'The everlasting gospel',
          passageAnchor: 'Revelation 14:6',
          preachingUse: 'Keeps the passage hopeful.',
          description: 'A worldwide gospel proclamation opens the passage.',
          explanation: 'The message begins with good news.',
          canonicalMovement: 'Mission to the nations culminates in final proclamation.',
          development: [{ reference: 'Matthew 24:14', contribution: 'Global proclamation', explanation: 'Global proclamation', stage: 'expansion', testament: 'NT', era: 'Gospels' }],
        },
        {
          theme: 'Creator worship',
          passageAnchor: 'Revelation 14:7',
          preachingUse: 'Connects gospel and worship.',
          description: 'Humanity is called to worship the Creator.',
          explanation: 'The passage defines true worship.',
          canonicalMovement: 'Creation grounds worship.',
          development: [{ reference: 'Exodus 20:11', contribution: 'Creation rationale', explanation: 'Creation rationale', stage: 'foundation', testament: 'OT', era: 'Torah' }],
        },
        {
          theme: 'Babylon and deception',
          passageAnchor: 'Revelation 14:8',
          preachingUse: 'Names spiritual corruption without spectacle.',
          description: 'Babylon’s fall exposes deceptive corruption.',
          explanation: 'The passage unmasks a seducing system.',
          canonicalMovement: 'Babel to Babylon forms a canonical contrast.',
          development: [{ reference: 'Isaiah 21:9', contribution: 'Babylon falls', explanation: 'Babylon falls', stage: 'echo', testament: 'OT', era: 'Prophets' }],
        },
        {
          theme: 'Endurance of the saints',
          passageAnchor: 'Revelation 14:12',
          preachingUse: 'Lands the passage in faithful endurance.',
          description: 'The faithful are marked by endurance and obedience.',
          explanation: 'Verse 12 defines the saints.',
          canonicalMovement: 'Perseverance marks God’s people under pressure.',
          development: [{ reference: 'Hebrews 10:36', contribution: 'Need of patience', explanation: 'Need of patience', stage: 'expansion', testament: 'NT', era: 'Epistles' }],
        },
      ],
      warnings: [],
    }, { reference: 'Revelation 14:6-12', language: 'en' });

    expect(result.valid).toBe(true);
  });

  it('accepts passage-specific canonical themes for John 3:16', () => {
    const result = validator.validate('canonical-themes', {
      passage: 'John 3:16',
      themes: [
        {
          theme: 'God’s initiating love',
          passageAnchor: 'John 3:16',
          preachingUse: 'Keep divine initiative in front before turning to human response.',
          description: 'John 3:16 presents salvation as the initiative of God’s love.',
          explanation: 'The passage begins with God’s love and gift, not with human worthiness.',
          canonicalMovement: 'From covenant love to gospel fulfillment, Scripture shows God moving first to save.',
          development: [{ reference: 'Deuteronomy 7:7-8', contribution: 'Covenant love provides the earlier canonical pattern.', explanation: 'Covenant love provides the earlier canonical pattern.', stage: 'foundation', testament: 'OT', era: 'Torah' }],
        },
        {
          theme: 'The gift of the Son',
          passageAnchor: 'John 3:16',
          preachingUse: 'Keep the passage explicitly Christ-centered rather than reducing it to a slogan.',
          description: 'The giving of the Son reveals the Father’s heart and the cost of salvation.',
          explanation: 'John 3:16 offers the concrete gift of the only begotten Son.',
          canonicalMovement: 'The biblical line of sacrifice and promised sonship centers in Christ given by the Father.',
          development: [{ reference: 'Genesis 22:8', contribution: 'The provision motif anticipates the greater gift.', explanation: 'The provision motif anticipates the greater gift.', stage: 'foundation', testament: 'OT', era: 'Torah' }],
        },
        {
          theme: 'Faith receiving eternal life',
          passageAnchor: 'John 3:16',
          preachingUse: 'Keep together the universal offer and the necessary response of faith.',
          description: 'Faith receives the life God gives in the Son.',
          explanation: 'Eternal life is received by believing, not earned by moral effort.',
          canonicalMovement: 'The promise of life narrows toward the Son and is received by faith.',
          development: [{ reference: 'John 20:31', contribution: 'John’s stated purpose reinforces the same theme.', explanation: 'John’s stated purpose reinforces the same theme.', stage: 'echo', testament: 'NT', era: 'Gospels' }],
        },
      ],
      warnings: [],
    }, { reference: 'John 3:16', language: 'en' });

    expect(result.valid).toBe(true);
  });
});
