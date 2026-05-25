import { TranslationComparisonService } from './translation-comparison.service';
import { PerVerseContextService } from './per-verse-context.service';
import { PassageSummaryService } from './passage-summary.service';
import { StudySynthesisService } from './study-synthesis.service';
import { StructuralAnalysisDataService } from './structural-analysis-data.service';
import { InterpretiveChallengesDataService } from './interpretive-challenges-data.service';
import { CanonicalThemeTracerService } from './canonical-theme-tracer.service';
import {
  buildFallbackCanonicalThemes,
  buildFallbackPassageSummary,
  buildFallbackStudySynthesis,
  buildFallbackStructuralAnalysis,
  detectStudyGenre,
} from './scripture-fallbacks';
import { cleanVerseText, formatApiBibleResponse, parseScriptureReference, validateVerseIntegrity } from './scripture-helpers';
import { GeneratedStudyOutputValidator } from './generated-study-output.validator';
import { EGWPassageIntegrationService } from '../egw/egw-passage-integration.service';
import { validateHistoricalContextOutput } from '../analysis/historical-context-guidance';

describe('scripture regression coverage', () => {
  it('parses Psalm 37:23-24 reference ranges and validates complete verse text', () => {
    expect(parseScriptureReference('Psalm 37:23–24')).toEqual({
      book: 'Psalm',
      chapter: 37,
      verseStart: 23,
      verseEnd: 24,
    });

    const integrity = validateVerseIntegrity('Psalm 37:23-24', [
      { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord: and he delighteth in his way.' },
      { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the Lord upholdeth him with his hand.' },
    ]);

    expect(integrity.valid).toBe(true);
    expect(integrity.errors).toEqual([]);
  });

  it('rejects footnote noise and truncated verse text', () => {
    const cleaned = cleanVerseText('Though he fall, he shall not be utterly cast down: for the Lord [a]');
    expect(cleaned).toBe('Though he fall, he shall not be utterly cast down: for the Lord');

    const integrity = validateVerseIntegrity('Psalm 37:23-24', [
      { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord: and he delighteth in his way.' },
      { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the Lord [a]' },
    ]);

    expect(integrity.valid).toBe(false);
    expect(integrity.errors.join(' | ')).toMatch(/Footnote markers|truncated/i);

    const truncatedOnly = validateVerseIntegrity('Psalm 37:23-24', [
      { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord: and he delighteth in his way.' },
      { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the Lord' },
    ]);

    expect(truncatedOnly.valid).toBe(false);
    expect(truncatedOnly.errors.join(' | ')).toMatch(/truncated/i);
  });

  it('formats verse markers without splitting Psalm 37 fragments into duplicate rows', () => {
    const formatted = formatApiBibleResponse(
      {
        data: {
          reference: 'Psalm 37:23-24',
          content: '[23] The steps of a good man are ordered by the LORD: and he delighteth in his way.\n[24] Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.',
          notes: [],
        },
      },
      'Psalm 37:23-24',
      'WEB',
    );

    expect(formatted.verses).toHaveLength(2);
    expect(formatted.verses[0].reference).toBe('Psalm 37:23');
    expect(formatted.verses[0].text).toContain('ordered by the LORD');
    expect(formatted.verses[1].reference).toBe('Psalm 37:24');
    expect(formatted.verses[1].text).toContain('upholdeth him with his hand');
  });

  it('detects genre by passage type', () => {
    expect(detectStudyGenre('Psalm 37:23-24')).toBe('wisdom_poetry');
    expect(detectStudyGenre('John 3:16')).toBe('gospel_dialogue');
    expect(detectStudyGenre('Luke 15:11-24')).toBe('parable');
    expect(detectStudyGenre('Revelation 14:6-12')).toBe('prophetic_apocalyptic');
    expect(detectStudyGenre('Exodus 20:8-11')).toBe('covenant_law');
  });

  it('produces Psalm 37 study output without generic gospel-summary filler', () => {
    const passageText = [
      'Psalm 37:23: The steps of a good man are ordered by the Lord: and he delighteth in his way.',
      'Psalm 37:24: Though he fall, he shall not be utterly cast down: for the Lord upholdeth him with his hand.',
    ].join('\n');

    const summary = buildFallbackPassageSummary('Psalm 37:23-24', passageText, 'en');
    expect(JSON.stringify(summary).toLowerCase()).not.toContain('state the passage');
    expect(JSON.stringify(summary).toLowerCase()).not.toContain('gospel invitation');
    expect(summary.movement).toEqual([
      'The Lord establishes the path of the righteous.',
      'The righteous may still stumble.',
      'The Lord upholds them so the fall is not final.',
    ]);
    expect(JSON.stringify(summary).toLowerCase()).toContain('steps');
    expect(JSON.stringify(summary).toLowerCase()).toContain('righteous');

    const synthesis = buildFallbackStudySynthesis('Psalm 37:23-24', passageText, 'en');
    const serializedSynthesis = JSON.stringify(synthesis).toLowerCase();
    expect(serializedSynthesis).not.toContain('gospel summary');
    expect(synthesis.centralClaim).toBe('God directs and sustains the life of the righteous; even when they stumble, His hand keeps them from final ruin.');
    expect(serializedSynthesis).toContain('sustaining');
    expect(serializedSynthesis).toContain('stumble');

    const structural = buildFallbackStructuralAnalysis('Psalm 37:23-24', passageText, 'en');
    expect(structural.literaryGenre).toContain('Wisdom psalm');
    expect(JSON.stringify(structural).toLowerCase()).not.toContain('narrative / expository');
    expect(structural.structure.map((item) => item.description)).toEqual([
      'Divine guidance — the Lord establishes the path of the righteous.',
      'Divine delight — the Lord delights in the way of the righteous.',
      'Human weakness — the righteous may stumble.',
      'Divine support — the Lord upholds them so the fall is not final.',
    ]);

    const themes = buildFallbackCanonicalThemes('Psalm 37:23-24', passageText, 'en');
    const serializedThemes = JSON.stringify(themes).toLowerCase();
    expect(serializedThemes).not.toContain('gospel summary');
    expect(serializedThemes).toContain('guidance');
    expect(serializedThemes).toContain('perseverance');
  });

  it('summarizes Revelation 14:6-12 by semantic movement rather than verse copying', () => {
    const passageText = [
      'Revelation 14:6: And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth, and to every nation, and kindred, and tongue, and people.',
      'Revelation 14:7: Saying with a loud voice, Fear God, and give glory to him; for the hour of his judgment is come: and worship him that made heaven, and earth, and the sea, and the fountains of waters.',
      'Revelation 14:8: And there followed another angel, saying, Babylon is fallen, is fallen, that great city, because she made all nations drink of the wine of the wrath of her fornication.',
      'Revelation 14:9: And the third angel followed them, saying with a loud voice, If any man worship the beast and his image, and receive his mark in his forehead, or in his hand,',
      'Revelation 14:10: The same shall drink of the wine of the wrath of God, which is poured out without mixture into the cup of his indignation; and he shall be tormented with fire and brimstone in the presence of the holy angels, and in the presence of the Lamb:',
      'Revelation 14:11: And the smoke of their torment ascendeth up for ever and ever: and they have no rest day nor night, who worship the beast and his image, and whosoever receiveth the mark of his name.',
      'Revelation 14:12: Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.',
    ].join('\n');

    const summary = buildFallbackPassageSummary('Revelation 14:6-12', passageText, 'en');
    const structural = buildFallbackStructuralAnalysis('Revelation 14:6-12', passageText, 'en');
    const synthesis = buildFallbackStudySynthesis('Revelation 14:6-12', passageText, 'en');

    expect(summary.summary).toContain('everlasting gospel');
    expect(summary.summary).toContain('Babylon');
    expect(summary.summary).not.toMatch(/^Revelation 14:6:/i);
    expect(summary.movement).toEqual([
      'The everlasting gospel is proclaimed to every nation.',
      'Humanity is called to fear God, give Him glory, and worship the Creator.',
      'Babylon’s deception is announced as fallen.',
      'False worship and allegiance to the beast are warned against.',
      'The saints are identified by endurance, obedience, and the faith of Jesus.',
    ]);
    expect(structural.structure.map((item) => item.description)).toEqual([
      'Worldwide gospel proclamation',
      'Call to worship the Creator in the hour of judgment',
      'Announcement of Babylon’s fall',
      'Warning against false worship and allegiance to the beast',
      'Identity and endurance of the saints',
    ]);
    expect(JSON.stringify(structural)).toContain('12');
    expect(JSON.stringify(structural)).not.toContain('…');
    expect(synthesis.centralClaim).toContain('final worldwide gospel appeal');
    expect(synthesis.centralClaim).toContain('worship the Creator');
    expect(synthesis.centralClaim).toContain('Babylon');
    expect(synthesis.centralClaim).not.toMatch(/^Revelation 14:6:/i);
  });

  it('flags speculative historical claims without source support', () => {
    const validation = validateHistoricalContextOutput(
      {
        socialRealities: [
          {
            aspect: 'Worshiping community',
            description: 'The psalm was likely employed in Israel’s post-exilic community.',
            impact: 'That setting shaped the sermon.',
          },
        ],
        powerStructures: [{ structure: 'Community', description: 'The worshiping community', relevance: 'Context' }],
        economicContext: [{ factor: 'Land', description: 'Covenant security.' }],
        religiousClimate: [{ element: 'Trust', description: 'Faithful trust.', tension: 'Tension' }],
        audiencePressures: [{ pressure: 'Fear', description: 'Fear of making unsupported historical claims.', source: 'Fear', pastoralResponse: 'Trust God.' }],
        synthesisStatement: 'God sustains the righteous.',
      },
      { sourceMetadataText: '' },
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors.join(' ')).toMatch(/speculative historical claim/i);
  });

  it('aligns translation comparison rows by verse number instead of shifting fragments', async () => {
    const scriptureService = {
      getPassage: jest.fn(async (_reference: string, code: string) => {
        if (code === 'KJV') {
          return {
            reference: 'Psalm 37:23-24',
            translation: 'KJV',
            verses: [
              { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord: and he delighteth in his way.' },
              { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the Lord upholdeth him with his hand.' },
            ],
          };
        }

        return {
          reference: 'Psalm 37:23-24',
          translation: code,
          verses: [
            { reference: 'Psalm 37:23', text: 'The steps of a good man are established by the Lord, and he delights in his way.' },
            { reference: 'Psalm 37:24', text: 'Though he stumble, he will not be thrown down, for the Lord holds him by the hand.' },
          ],
        };
      }),
    } as any;

    const service = new TranslationComparisonService(scriptureService);
    const diffs = await service.compareTranslations('Psalm 37:23-24', ['KJV', 'WEB']);

    expect(diffs).toHaveLength(2);
    expect(diffs[0].reference).toBe('Psalm 37:23');
    expect(diffs[1].reference).toBe('Psalm 37:24');
    expect(diffs[0].translations[0].text).toContain('ordered by the Lord');
    expect(diffs[1].translations[0].text).toContain('upholdeth him with his hand');
    expect(diffs[0].translations[1].text).toContain('established by the Lord');
    expect(diffs[1].translations[1].text).toContain('holds him by the hand');
  });

  it('recovers passage summary with computed passage-aware content when the LLM response is invalid', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => 'not valid json'),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'John 3:16',
        translation: 'KJV',
        verses: [
          { reference: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
        ],
      })),
    } as any;

    const service = new PassageSummaryService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getPassageSummary('John 3:16', 'system', 'en');

    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('computed');
    expect(result.summary).toContain('Nicodemus');
    expect(result.summary).toContain('new birth');
    expect(result.movement.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(result).toLowerCase()).not.toContain('passage summary could not be generated');
  });

  it('recovers passage summary with computed passage-aware content when the LLM times out', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => {
        throw new Error('timeout');
      }),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Revelation 14:6-12',
        translation: 'KJV',
        verses: [
          { reference: 'Revelation 14:6', text: 'And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth, and to every nation, and kindred, and tongue, and people.' },
          { reference: 'Revelation 14:7', text: 'Saying with a loud voice, Fear God, and give glory to him; for the hour of his judgment is come: and worship him that made heaven, and earth, and the sea, and the fountains of waters.' },
          { reference: 'Revelation 14:12', text: 'Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.' },
        ],
      })),
    } as any;

    const service = new PassageSummaryService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getPassageSummary('Revelation 14:6-12', 'system', 'en');

    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('computed');
    expect(result.summary).toContain('everlasting gospel');
    expect(result.movement.length).toBeGreaterThanOrEqual(3);
  });

  it('recovers study synthesis with computed passage-aware content when the LLM response is invalid', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => 'not valid json'),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Revelation 14:6-12',
        translation: 'KJV',
        verses: [
          { reference: 'Revelation 14:6', text: 'And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth, and to every nation, and kindred, and tongue, and people.' },
          { reference: 'Revelation 14:7', text: 'Saying with a loud voice, Fear God, and give glory to him; for the hour of his judgment is come: and worship him that made heaven, and earth, and the sea, and the fountains of waters.' },
          { reference: 'Revelation 14:12', text: 'Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.' },
        ],
      })),
    } as any;

    const service = new StudySynthesisService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getStudySynthesis('Revelation 14:6-12', 'system', 'en');

    expect(llmService.generateCompletion).toHaveBeenCalled();
    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('computed');
    expect(result.centralClaim).toContain('final worldwide gospel appeal');
    expect(result.pastoralTakeaway).toContain('hope');
    expect(result.centralClaim).not.toContain('And I saw another angel');
    expect(JSON.stringify(result).toLowerCase()).not.toContain('study synthesis could not be generated');
  });

  it('recovers study synthesis with computed passage-aware content when the LLM times out', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => {
        throw new Error('timeout');
      }),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Psalm 37:23-24',
        translation: 'KJV',
        verses: [
          { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.' },
          { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.' },
        ],
      })),
    } as any;

    const service = new StudySynthesisService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getStudySynthesis('Psalm 37:23-24', 'system', 'en');

    expect(llmService.generateCompletion).toHaveBeenCalled();
    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('computed');
    expect(result.centralClaim).toContain('God directs and sustains the life of the righteous');
    expect(JSON.stringify(result).toLowerCase()).not.toContain('gospel summary');
  });

  it('recovers structural analysis with computed poetic units when the LLM fails', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => 'not valid json'),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Psalm 37:23-24',
        translation: 'KJV',
        verses: [
          { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.' },
          { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.' },
        ],
      })),
    } as any;

    const service = new StructuralAnalysisDataService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getStructuralAnalysis('Psalm 37:23-24', 'en');

    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('curated');
    expect(result.literaryGenre).toContain('Wisdom psalm');
    expect(result.structure.map((item) => item.description)).toEqual([
      'Divine guidance — the Lord establishes the path of the righteous.',
      'Divine delight — the Lord delights in the way of the righteous.',
      'Human weakness — the righteous may stumble.',
      'Divine support — the Lord upholds them so the fall is not final.',
    ]);
  });

  it('recovers structural analysis with computed poetic units when the LLM times out', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => {
        throw new Error('timeout');
      }),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Revelation 14:6-12',
        translation: 'KJV',
        verses: [
          { reference: 'Revelation 14:6', text: 'And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth, and to every nation, and kindred, and tongue, and people.' },
          { reference: 'Revelation 14:7', text: 'Saying with a loud voice, Fear God, and give glory to him; for the hour of his judgment is come: and worship him that made heaven, and earth, and the sea, and the fountains of waters.' },
          { reference: 'Revelation 14:12', text: 'Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.' },
        ],
      })),
    } as any;

    const service = new StructuralAnalysisDataService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getStructuralAnalysis('Revelation 14:6-12', 'en');

    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('curated');
    expect(result.literaryGenre).toContain('Prophetic apocalyptic');
    expect(result.structure.length).toBeGreaterThanOrEqual(3);
    expect(result.structure.map((item) => item.description)).toEqual([
      'Worldwide gospel proclamation',
      'Call to worship the Creator in the hour of judgment',
      'Announcement of Babylon’s fall',
      'Warning against false worship and allegiance to the beast',
      'Identity and endurance of the saints',
    ]);
  });

  it('recovers interpretive challenges with computed views when the LLM fails', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => 'not valid json'),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Revelation 14:6-12',
        translation: 'KJV',
        verses: [
          { reference: 'Revelation 14:6', text: 'And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach unto them that dwell on the earth, and to every nation, and kindred, and tongue, and people.' },
          { reference: 'Revelation 14:7', text: 'Saying with a loud voice, Fear God, and give glory to him; for the hour of his judgment is come: and worship him that made heaven, and earth, and the sea, and the fountains of waters.' },
          { reference: 'Revelation 14:12', text: 'Here is the patience of the saints: here are they that keep the commandments of God, and the faith of Jesus.' },
        ],
      })),
    } as any;

    const service = new InterpretiveChallengesDataService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getInterpretiveChallenge('Revelation 14:6-12', 'en');

    expect(result).toBeTruthy();
    expect(result?.status).toBe('ready');
    expect(result?.dataSource).toBe('curated');
    expect(result?.views.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(result).toLowerCase()).toContain('everlasting gospel');
  });

  it('recovers canonical themes with computed threads when the LLM fails', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => 'not valid json'),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Psalm 37:23-24',
        translation: 'KJV',
        verses: [
          { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.' },
          { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.' },
        ],
      })),
    } as any;

    const service = new CanonicalThemeTracerService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getThemesForPassage('Psalm 37:23-24', 'en', 'system');

    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('curated');
    expect(result.themes.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(result).toLowerCase()).toContain('steps');
    expect(JSON.stringify(result).toLowerCase()).toContain('righteous');
  });

  it('returns multiple rich canonical themes for Luke 15:11-24 when the LLM fails', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => 'not valid json'),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Luke 15:11-24',
        translation: 'KJV',
        verses: [
          { reference: 'Luke 15:11', text: 'A certain man had two sons:' },
          { reference: 'Luke 15:12', text: 'And the younger of them said to his father...' },
          { reference: 'Luke 15:17', text: 'And when he came to himself, he said...' },
          { reference: 'Luke 15:20', text: 'And he arose, and came to his father...' },
          { reference: 'Luke 15:24', text: 'For this my son was dead, and is alive again; he was lost, and is found.' },
        ],
      })),
    } as any;

    const service = new CanonicalThemeTracerService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getThemesForPassage('Luke 15:11-24', 'en', 'system');

    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('curated');
    expect(result.themes.length).toBeGreaterThanOrEqual(4);
    expect(JSON.stringify(result).toLowerCase()).toContain('restoring mercy');
    expect(JSON.stringify(result).toLowerCase()).toContain('repentance and return');
    expect(JSON.stringify(result).toLowerCase()).toContain('lost and found');
    expect(JSON.stringify(result).toLowerCase()).toContain('passageanchor');
    expect(JSON.stringify(result).toLowerCase()).toContain('preachinguse');
  });

  it('returns multiple rich canonical themes for Revelation 14:6-12 when the LLM fails', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () => 'not valid json'),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Revelation 14:6-12',
        translation: 'KJV',
        verses: [
          { reference: 'Revelation 14:6', text: 'And I saw another angel fly in the midst of heaven, having the everlasting gospel to preach...' },
          { reference: 'Revelation 14:7', text: 'Fear God, and give glory to him...' },
          { reference: 'Revelation 14:8', text: 'Babylon is fallen, is fallen...' },
          { reference: 'Revelation 14:9', text: 'If any man worship the beast and his image...' },
          { reference: 'Revelation 14:12', text: 'Here is the patience of the saints...' },
        ],
      })),
    } as any;

    const service = new CanonicalThemeTracerService(llmService, scriptureService, new GeneratedStudyOutputValidator());
    const result = await service.getThemesForPassage('Revelation 14:6-12', 'en', 'system');

    expect(result.status).toBe('ready');
    expect(result.dataSource).toBe('curated');
    expect(result.themes.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(result).toLowerCase()).toContain('everlasting gospel');
    expect(JSON.stringify(result).toLowerCase()).toContain('creator worship');
    expect(JSON.stringify(result).toLowerCase()).toContain('babylon and deception');
    expect(JSON.stringify(result).toLowerCase()).toContain('endurance of the saints');
  });

  it('uses exact verse matching for EGW passage citations', async () => {
    const andWhere = jest.fn().mockReturnThis();
    const queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere,
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    } as any;

    const scriptureRefRepository = {
      createQueryBuilder: jest.fn(() => queryBuilder),
    } as any;

    const service = new EGWPassageIntegrationService({} as any, scriptureRefRepository);

    await (service as any).findExactVerseCitations('Psalm', 37, 23, 24, 'en');
    expect(andWhere).toHaveBeenCalledWith(
      'ref.verseStart = :start AND COALESCE(ref.verseEnd, ref.verseStart) = :end',
      { start: 23, end: 24 },
    );

    andWhere.mockClear();
    await (service as any).findExactVerseCitations('Psalm', 37, 23, undefined, 'en');
    expect(andWhere).toHaveBeenCalledWith(
      'ref.verseStart = :start AND (ref.verseEnd = :start OR ref.verseEnd IS NULL)',
      { start: 23 },
    );
  });

  it('calls the LLM path for Psalm 37 verse context instead of a curated fast path', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () =>
        JSON.stringify({
          status: 'ready',
          reference: 'Psalm 37:23-24',
          language: 'en',
          genre: 'Wisdom psalm',
          sections: [
            { title: 'Historical Context', content: 'Psalm 37 addresses envy of the wicked.' },
            { title: 'Cultural Context', content: 'Steps and way language pictures a life path.' },
            { title: 'Geographical / Literary Setting', content: 'The psalm is literary, not geographic.' },
            { title: 'Significance for Preaching', content: 'God sustains the righteous when they fall.' },
            { title: 'Pastoral Application', content: 'Believers can trust God in weakness.' },
          ],
          warnings: [],
          source: 'llm-generated',
        }),
      ),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Psalm 37:23-24',
        translation: 'KJV',
        verses: [
          { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.' },
          { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.' },
        ],
      })),
    } as any;

    const service = new PerVerseContextService(llmService, scriptureService);
    const result = await service.getVerseContext('Psalm 37:23-24', 'en');

    expect(llmService.generateCompletion).toHaveBeenCalled();
    expect(result.status).toBe('ready');
    expect(result.source).toBe('llm-generated');
    expect(result.sections).toHaveLength(5);
  });

  it('falls back to curated Psalm 37 verse context when the live LLM path fails validation', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () =>
        JSON.stringify({
          status: 'ready',
          reference: 'Psalm 37:23-24',
          language: 'en',
          genre: 'Wisdom psalm',
          sections: [],
          warnings: [],
          source: 'llm-generated',
        }),
      ),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Psalm 37:23-24',
        translation: 'KJV',
        verses: [
          { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.' },
          { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.' },
        ],
      })),
    } as any;

    const service = new PerVerseContextService(llmService, scriptureService);
    const result = await service.getVerseContext('Psalm 37:23-24', 'en');

    expect(llmService.generateCompletion).toHaveBeenCalled();
    expect(result.status).toBe('ready');
    expect(result.source).toBe('curated');
    expect(result.sections).toHaveLength(5);
    expect(result.sections[0].content).toContain('temptation to envy the wicked');
    expect(JSON.stringify(result).toLowerCase()).not.toContain('fallback');
  });

  it('accepts en dash verse ranges in verse-context references', async () => {
    const llmService = {
      generateCompletion: jest.fn(async () =>
        JSON.stringify({
          status: 'ready',
          reference: 'Revelation 14:6-12',
          language: 'en',
          genre: 'Prophetic apocalyptic',
          sections: [
            { title: 'Historical Context', content: 'Revelation 14 is a prophetic-apocalyptic passage.' },
            { title: 'Cultural Context', content: 'Worship and allegiance are under pressure.' },
            { title: 'Geographical / Literary Setting', content: 'The setting is literary and apocalyptic.' },
            { title: 'Significance for Preaching', content: 'The everlasting gospel is central.' },
            { title: 'Pastoral Application', content: 'Remain faithful and hopeful.' },
          ],
          warnings: [],
          source: 'llm-generated',
        }),
      ),
    } as any;

    const scriptureService = {
      getPassage: jest.fn(async () => ({
        reference: 'Revelation 14:6-12',
        translation: 'KJV',
        verses: [
          { reference: 'Revelation 14:6', text: 'And I saw another angel...' },
          { reference: 'Revelation 14:7', text: 'Saying with a loud voice...' },
          { reference: 'Revelation 14:8', text: 'And there followed another angel...' },
          { reference: 'Revelation 14:9', text: 'And the third angel followed them...' },
          { reference: 'Revelation 14:10', text: 'The same shall drink of the wine...' },
          { reference: 'Revelation 14:11', text: 'And the smoke of their torment...' },
          { reference: 'Revelation 14:12', text: 'Here is the patience of the saints...' },
        ],
      })),
    } as any;

    const service = new PerVerseContextService(llmService, scriptureService);
    const result = await service.getVerseContext('Revelation 14:6–12', 'en');

    expect(llmService.generateCompletion).toHaveBeenCalled();
    expect(result.status).toBe('ready');
    expect(result.reference).toBe('Revelation 14:6-12');
  });
});
