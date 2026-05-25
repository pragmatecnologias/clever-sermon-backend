import { WorkspacesService } from './workspaces.service';
import { GeneratedStudyOutputValidator } from '../scripture/generated-study-output.validator';

describe('WorkspacesService manuscript parsing', () => {
  const options = {
    tone: 'teaching',
    targetMinutes: 22,
    format: 'full',
    audienceMode: 'general congregation',
    includeSlideCues: true,
    includeKeyLines: true,
  } as const;

  let service: WorkspacesService;
  let generatedStudyOutputValidator: GeneratedStudyOutputValidator;
  let consoleInfoSpy: jest.SpyInstance;

  beforeEach(() => {
    const llmService = {
      getConfiguredProvider: () => 'local',
      getProviderHealth: () => ({ status: 'ready', message: 'Local LLM ready', checkedAt: '2026-01-01T00:00:00.000Z' }),
      getConfiguredProviderLabel: () => 'Local LLM',
    } as any;

    service = new WorkspacesService(
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      llmService,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
    );
    generatedStudyOutputValidator = new GeneratedStudyOutputValidator();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleInfoSpy.mockRestore();
  });

  it('uses the JSON path for valid manuscript payloads', () => {
    const response = JSON.stringify({
      text: '<h2>Introduction</h2><p onclick="alert(1)">Grace restores us.</p><script>alert(1)</script>',
      cues: {
        slide: ['Open with testimony'],
        keyLine: ['Grace still reaches dead hearts.'],
      },
    });

    const parsed = (service as any).parseGeneratedManuscriptResponse(response, options);

    expect(parsed.text).toContain('<h2>Introduction</h2>');
    expect(parsed.text).toContain('<p>Grace restores us.</p>');
    expect(parsed.text).not.toContain('onclick=');
    expect(parsed.text).not.toContain('<script>');
    expect(parsed.cues.slide).toEqual(['Open with testimony']);
    expect(parsed.cues.keyLine).toEqual(['Grace still reaches dead hearts.']);
    expect(consoleInfoSpy).toHaveBeenCalledWith('[manuscript-parse] recovery_mode=json');
  });

  it('recovers malformed truncated JSON wrappers that contain HTML', () => {
    const response =
      'assistant: {"text":"<h2>Introduction</h2><p>En Efesios 2 vemos la gracia de Dios.</p><p>Nos levantó con Cristo.</p>';

    const parsed = (service as any).parseGeneratedManuscriptResponse(response, options);

    expect(parsed.text).toContain('<h2>Introduction</h2>');
    expect(parsed.text).toContain('<p>En Efesios 2 vemos la gracia de Dios.</p>');
    expect(parsed.cues).toEqual({
      slide: [],
      keyLine: [],
      transition: [],
      pause: [],
      read: [],
      quote: [],
      cta: [],
    });
    const recoveryModes = consoleInfoSpy.mock.calls.map((call) => String(call[0] || ''));
    expect(
      recoveryModes.some((value) =>
        value === '[manuscript-parse] recovery_mode=text-field' ||
        value === '[manuscript-parse] recovery_mode=html-fragment',
      ),
    ).toBe(true);
  });

  it('converts malformed plain-text payloads into HTML paragraphs', () => {
    const response = 'response: {"text":"Introduction\\nGrace meets dead hearts and makes them alive in Christ.';

    const parsed = (service as any).parseGeneratedManuscriptResponse(response, options);

    expect(parsed.text).toBe('<p>Introduction Grace meets dead hearts and makes them alive in Christ.</p>');
    expect(parsed.text).not.toContain('{"text"');
    expect(consoleInfoSpy).toHaveBeenCalledWith('[manuscript-parse] recovery_mode=text-field');
  });

  it('accepts raw HTML responses without wrapping syntax', () => {
    const response = '<h2>Introduction</h2><p>Christ saves by grace.</p>';

    const parsed = (service as any).parseGeneratedManuscriptResponse(response, options);

    expect(parsed.text).toBe('<h2>Introduction</h2><p>Christ saves by grace.</p>');
    expect(consoleInfoSpy).toHaveBeenCalledWith('[manuscript-parse] recovery_mode=html-fragment');
  });

  it('drops malformed cues while preserving recovered text', () => {
    const response = JSON.stringify({
      text: '<h2>Introduction</h2><p>Hope is alive.</p>',
      cues: {
        slide: 'not-an-array',
        keyLine: null,
      },
    });

    const parsed = (service as any).parseGeneratedManuscriptResponse(response, {
      ...options,
      includeSlideCues: false,
      includeKeyLines: false,
    });

    expect(parsed.cues).toEqual({
      slide: [],
      keyLine: [],
      transition: [],
      pause: [],
      read: [],
      quote: [],
      cta: [],
    });
  });

  it('marks quality improvement when candidate has fewer issues and better word fit', () => {
    const baseline = {
      wordCount: 700,
      targets: { minWords: 1000, targetWords: 1200, maxWords: 1500 },
      issues: ['too_short', 'repetitive'],
    };
    const candidate = {
      wordCount: 980,
      targets: { minWords: 1000, targetWords: 1200, maxWords: 1500 },
      issues: ['too_short'],
    };

    const improved = (service as any).isQualityImprovement(baseline, candidate);
    expect(improved).toBe(true);
  });

  it('builds localized quality warning messages', () => {
    const esMessage = (service as any).buildManuscriptQualityWarningMessage(['too_short', 'repetitive'], 'es');
    const enMessage = (service as any).buildManuscriptQualityWarningMessage(['too_long'], 'en');

    expect(esMessage).toContain('observaciones de calidad');
    expect(esMessage).toContain('demasiado corto');
    expect(enMessage).toContain('Draft saved with quality warnings');
    expect(enMessage).toContain('too long');
  });

  it('treats tiny manuscript fragments as unusable', () => {
    const unusable = (service as any).hasUsableManuscriptText('<p>Hola mundo.</p>');
    const usable = (service as any).hasUsableManuscriptText(
      '<p>' +
        'La gracia de Dios transforma la vida humana con poder redentor y produce obediencia visible en el hogar y en la iglesia. '.repeat(3) +
      '</p>',
    );

    expect(unusable).toBe(false);
    expect(usable).toBe(true);
  });

  it('builds a non-empty targeted repair plan from coach questions', () => {
    const workspace = {
      language: 'es',
      mainPassage: 'Efesios 2:1-10',
      theologicalLens: 'adventist',
      theme: 'Gracia transformadora',
      audienceProfile: 'Familias y jóvenes',
    } as any;

    const questions = [
      {
        id: 'Q1',
        dimension: 'text_fidelity',
        question: '¿Cómo conecta esta metáfora con Efesios 2:1-10?',
        severity: 'medium',
        sourceAnchor: 'Introducción',
        purpose: 'Alinear con el texto',
      },
      {
        id: 'Q2',
        dimension: 'application_strength',
        question: '¿Dónde aterriza esto para familias y jóvenes?',
        severity: 'high',
        sourceAnchor: 'Punto 3',
        purpose: 'Aplicación concreta',
      },
    ];

    const plan = (service as any).buildRepairPlanFromCoachQuestions(workspace, questions);
    expect(Array.isArray(plan)).toBe(true);
    expect(plan.length).toBeGreaterThan(0);
    expect(plan[0].issueId).toContain('issue-');
    expect(plan[0].targetAnchor).toBeTruthy();
    expect(plan[0].proposedAction).toBeTruthy();
  });

  it('normalizes paragraph-style study report flow into multiple executable units', () => {
    const rawStudyReport = {
      passageOverview: 'Luke 15:11-24 presents the parable of the prodigal son.',
      literaryContext: 'Parable within Luke 15.',
      historicalContext: 'Jesus is responding to criticism of his welcome to sinners.',
      canonicalContext: 'Repentance, restoration, and sonship develop across Scripture.',
      exegeticalSummary: 'The father receives the returning son with compassion and restores him to sonship.',
      mainTheologicalClaim: 'God restores repentant sinners as sons and daughters.',
      preachingFocus: 'Preach grace that restores rather than merely excuses.',
      exegeticalFlow:
        'The son leaves home and wastes his inheritance. A famine exposes his ruin. He comes to himself and returns in repentance. The father runs to receive him. The father restores him publicly and the household rejoices.',
      structureOfPassage: [
        { movement: 'Departure', verses: 'Luke 15:11-13', summary: 'The son leaves home.' },
        { movement: 'Ruin', verses: 'Luke 15:14-16', summary: 'The son is brought low.' },
      ],
      keyTerms: [
        { term: 'repent', language: 'Greek', transliteration: 'metanoeō', definition: 'To turn back', nuance: 'Inner change that leads home.' },
        { term: 'compassion', language: 'Greek', transliteration: 'splagchnizomai', definition: 'Deep mercy', nuance: 'The father’s heart toward the lost.' },
      ],
      theologicalThemes: ['Restoring mercy', 'Repentance and return'],
      interpretiveChallenges: [
        { question: 'How does repentance work here?', interpretationOptions: ['Confession', 'Return'], preachingGuidance: 'Keep repentance concrete.' },
      ],
      pastoralImplications: {
        personalLife: ['Repent and return to the Father.'],
        churchLife: ['Receive repentant people with grace.'],
        mission: ['Run toward the lost with welcome.'],
      },
    } as any;

    const normalized = (service as any).normalizeStudyReportSections(rawStudyReport);
    const completeness = (service as any).assessStudyReportCompleteness(normalized);

    expect(Array.isArray(normalized.exegeticalFlow)).toBe(true);
    expect(normalized.exegeticalFlow.length).toBeGreaterThanOrEqual(3);
    expect(normalized.exegeticalFlow[0]).toContain('son leaves home');
    expect(normalized.mainTheologicalClaim).toContain('God restores repentant sinners');
    expect(completeness.isSparse).toBe(false);
  });

  it('preserves base study report sections when parsed fields are blank', () => {
    const baseSections = {
      passageOverview: 'Base overview',
      exegeticalFlow: ['Base flow 1', 'Base flow 2'],
      mainTheologicalClaim: 'Base claim',
    } as any;
    const parsedSections = {
      passageOverview: '',
      exegeticalFlow: '',
      mainTheologicalClaim: '',
      structureOfPassage: [],
    } as any;

    const merged = (service as any).mergeStudyReportSections(baseSections, parsedSections);

    expect(merged.passageOverview).toBe('Base overview');
    expect(merged.exegeticalFlow).toEqual(['Base flow 1', 'Base flow 2']);
    expect(merged.mainTheologicalClaim).toBe('Base claim');
  });

  it('fills historical context and key terms from cached study data when word study is absent', () => {
    const studyInputs = {
      workspace: {
        mainPassage: 'Luke 15:11-24',
        language: 'en',
      },
      cachedStudySections: {
        passageSummary: {
          summary: 'The parable follows the son through departure, ruin, repentance, and return.',
          movement: [
            'The son leaves home and moves toward ruin.',
            'The turning point comes in repentance and honest return.',
          ],
          interpretiveCenter: 'God’s restoring grace receives the repentant.',
        },
        structuralAnalysis: {
          literaryGenre: 'Parable',
          structure: [
            { description: 'Departure from the father’s house', verses: '11-12' },
            { description: 'Restoration through the father’s welcome', verses: '20-24' },
          ],
        },
        interpretiveChallenges: {
          challenge: 'Does the parable center on the lost son, the welcoming father, or the resentful brother?',
          views: [
            { summary: 'The story moves from distance to return.' },
            { summary: 'Grace confronts both the lost and the proud.' },
          ],
          sdaPerspective: { reasoning: 'Christ-centered and Scripture-based' },
        },
        canonicalThemes: {
          themes: [
            { theme: 'Restoring mercy', summary: 'The father receives the repentant son with restoring compassion.', canonicalMovement: 'Scripture presents God as merciful and restorative.' },
            { theme: 'Repentance and return', summary: 'The son returns in repentance and humility.', canonicalMovement: 'Scripture repeatedly calls sinners to return to the Lord.' },
          ],
        },
        studySynthesis: {
          summary: 'The father’s grace receives the repentant and brings him home.',
          mainClaim: 'God restores repentant sinners as sons and daughters.',
        },
        wordStudy: null,
      },
      referenceData: {
        bookMetadata: {
          literaryType: 'Parable',
          summary: 'Jesus teaches in Luke 15 to answer criticism of his welcome to sinners.',
        },
        historicalContext: {
          summary: 'Jesus is responding to criticism of his welcome to sinners.',
        },
        culturalContext: {
          summary: 'Honor-shame and family restoration shape the story.',
        },
      },
    } as any;

    const base = (service as any).buildStudyReportBaseSections(studyInputs, 'en');

    expect(base.historicalContext).toContain('Jesus is responding to criticism');
    expect(base.keyTerms.length).toBeGreaterThanOrEqual(2);
    expect(base.keyTerms[0].term).toBeTruthy();
  });

  it('derives study report context from section-based verse context data', () => {
    const studyInputs = {
      workspace: {
        mainPassage: 'Luke 15:11-24',
        language: 'en',
      },
      cachedStudySections: {
        passageSummary: {
          summary: 'The parable follows the son through departure, ruin, repentance, and return.',
          movement: [
            'The son leaves home and moves toward ruin.',
            'The turning point comes in repentance and honest return.',
            'The father runs to receive the lost child.',
            'Restoration is marked by welcome, joy, and renewed belonging.',
          ],
          interpretiveCenter: 'God’s restoring grace receives the repentant.',
        },
        verseContext: {
          status: 'ready',
          genre: 'Parable',
          sections: [
            {
              title: 'Historical Context',
              content: 'Jesus is responding to criticism of his welcome to sinners.',
            },
            {
              title: 'Cultural Context',
              content: 'Honor and shame shaped the son’s return and the father’s public welcome.',
            },
            {
              title: 'Geographical / Literary Setting',
              content: 'Luke places the parable in a teaching setting after conflict with the Pharisees.',
            },
          ],
        },
        structuralAnalysis: {
          literaryGenre: 'Parable',
          structure: [
            { description: 'Departure from the father’s house', verses: '11-12' },
            { description: 'Restoration through the father’s welcome', verses: '20-24' },
          ],
        },
        interpretiveChallenges: {
          challenge: 'Does the parable center on the lost son, the welcoming father, or the resentful brother?',
          views: [
            { summary: 'The story moves from distance to return.' },
            { summary: 'Grace confronts both the lost and the proud.' },
          ],
          sdaPerspective: { reasoning: 'Christ-centered and Scripture-based' },
        },
        canonicalThemes: {
          themes: [
            { theme: 'Restoring mercy', summary: 'The father receives the repentant son with restoring compassion.', canonicalMovement: 'Scripture presents God as merciful and restorative.' },
            { theme: 'Repentance and return', summary: 'The son returns in repentance and humility.', canonicalMovement: 'Scripture repeatedly calls sinners to return to the Lord.' },
            { theme: 'Sonship restored', summary: 'The father restores identity, not merely access.', canonicalMovement: 'Scripture frames restoration as renewed belonging.' },
          ],
        },
        studySynthesis: {
          summary: 'The father’s grace receives the repentant and brings him home.',
          mainClaim: 'God restores repentant sinners as sons and daughters.',
        },
        wordStudy: null,
      },
      referenceData: {
        bookMetadata: {
          literaryType: 'Parable',
          summary: 'Jesus teaches in Luke 15 to answer criticism of his welcome to sinners.',
        },
        historicalContext: {
          summary: 'Jesus is responding to criticism of his welcome to sinners.',
        },
        culturalContext: {
          summary: 'Honor-shame and family restoration shape the story.',
        },
      },
    } as any;

    const base = (service as any).buildStudyReportBaseSections(studyInputs, 'en');
    const validation = generatedStudyOutputValidator.validate('study-report', base, {
      reference: 'Luke 15:11-24',
      language: 'en',
    });

    expect(base.historicalContext).toContain('Jesus is responding to criticism');
    expect(base.literaryContext).toBe('Parable');
    expect(base.keyTerms.length).toBeGreaterThanOrEqual(2);
    expect(validation.valid).toBe(true);
  });

  it('applies anchored targeted replacements without rewriting full manuscript', () => {
    const html = '<h2>Introducción</h2><p>Texto original de introducción.</p><h2>Punto 1</h2><p>Contenido punto uno.</p>';
    const patched = (service as any).applyFirstSnippetReplacement(
      html,
      'Introducción',
      'Texto original de introducción.',
      '<p>Texto mejorado y más fiel al pasaje.</p>',
    );

    expect(patched).toContain('<h2>Introducción</h2>');
    expect(patched).toContain('Texto mejorado y más fiel al pasaje.');
    expect(patched).toContain('<h2>Punto 1</h2>');
    expect(patched).toContain('Contenido punto uno.');
  });

  it('removes duplicated anchor title text from heading-context repair patches', () => {
    const html =
      '<h2>Introducción: La noche sin luna</h2><p>Aquí comienza nuestro viaje.</p><h2>Punto 1</h2><p>Contenido punto uno.</p>';
    const patched = (service as any).applyFirstSnippetReplacement(
      html,
      'Introducción: La noche sin luna',
      'Aquí comienza nuestro viaje.',
      '<p>Introducción: La noche sin luna Introducción: La noche sin luna Aquí comienza nuestro viaje con claridad.</p>',
    );

    expect(patched).toContain('<h2>Introducción: La noche sin luna</h2>');
    expect(patched).toContain('Aquí comienza nuestro viaje con claridad.');
    expect(patched).not.toContain('Introducción: La noche sin luna Introducción: La noche sin luna');
    expect(patched).toContain('<h2>Punto 1</h2>');
  });

  it('flags adventist drift when sunday language appears', () => {
    expect((service as any).hasAdventistDrift('En este domingo celebramos...')).toBe(true);
    expect((service as any).hasAdventistDrift('En este sábado adoramos al Señor.')).toBe(false);
  });

  it('builds workspace state with history and compare summaries', async () => {
    const workspace = {
      title: 'Hope in Christ',
      mainPassage: 'John 3:16',
      language: 'en',
      status: 'in_progress',
      metadata: {
        activeOutlineId: 'outline-current',
        activeManuscriptId: 'manuscript-current',
        mediaPack: {
          status: 'ready',
          generatedAt: '2026-01-04T00:00:00.000Z',
          sourceOutlineId: 'outline-current',
          sourceManuscriptId: 'manuscript-current',
          sourceStudyReportId: 'study-1',
          slideCount: 6,
          audioEnabled: true,
          musicEnabled: false,
          videoEnabled: true,
          exportPrepared: true,
        },
        exportPack: {
          status: 'ready',
          generatedAt: '2026-01-04T00:00:00.000Z',
          sourceOutlineId: 'outline-current',
          sourceManuscriptId: 'manuscript-current',
          sourceStudyReportId: 'study-1',
          artifacts: [
            { type: 'pptx', label: 'Slide deck (PPTX)', status: 'ready', filename: 'sermon-deck-workspace.pptx' },
            { type: 'docx', label: 'Manuscript (DOCX)', status: 'ready', filename: 'sermon-manuscript-workspace.docx' },
          ],
        },
        outlineHistory: [
          {
            id: 'outline-previous',
            title: 'Outline Version 1',
            createdAt: '2026-01-01T00:00:00.000Z',
            archivedAt: '2026-01-02T00:00:00.000Z',
            revisionLabel: 'Version 1',
            pointCount: 2,
            structure: { points: ['a', 'b'] },
          },
        ],
        manuscriptHistory: [
          {
            id: 'manuscript-previous',
            outlineId: 'outline-previous',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-02T00:00:00.000Z',
            archivedAt: '2026-01-02T00:00:00.000Z',
            revisionLabel: 'Version 1',
            wordCount: 900,
            estimatedMinutes: 7,
            content: { text: '<p>old</p>' },
            transitions: {},
          },
        ],
      },
      outlines: [
        {
          id: 'outline-current',
          title: 'Outline Version 2',
          isSelected: true,
          createdAt: '2026-01-03T00:00:00.000Z',
          structure: { points: ['a', 'b', 'c', 'd'] },
        },
      ],
      manuscripts: [
        {
          id: 'manuscript-current',
          outlineId: 'outline-current',
          wordCount: 1200,
          estimatedMinutes: 9,
          createdAt: '2026-01-03T00:00:00.000Z',
          updatedAt: '2026-01-04T00:00:00.000Z',
          content: { text: '<p>new</p>' },
        },
      ],
      studyReports: [{ id: 'study-1' }],
      applications: [],
      illustrations: [],
      citations: [],
      scriptureCache: {
        scriptureResult: { verses: [{ reference: 'John 3:16', text: 'For God so loved the world' }] },
      },
    } as any;

    const state = await (service as any).buildWorkspaceState(workspace);

    expect(state.activeOutline?.id).toBe('outline-current');
    expect(state.activeManuscript?.id).toBe('manuscript-current');
    expect(state.outlineHistory.length).toBeGreaterThanOrEqual(1);
    expect(state.manuscriptHistory.length).toBeGreaterThanOrEqual(1);
    expect(state.outlineComparison?.pointDelta).toBe(2);
    expect(state.manuscriptComparison?.wordDelta).toBe(300);
    expect(state.manuscriptComparison?.minuteDelta).toBe(2);
    expect(state.mediaPack?.status).toBe('ready');
    expect(state.mediaPack?.exportPrepared).toBe(true);
    expect(state.mediaPack?.slideCount).toBe(6);
    expect(state.exportPack?.status).toBe('ready');
    expect(state.exportPack?.artifacts.length).toBeGreaterThan(0);
    expect(state.featureReadiness?.outline.status).toBe('generated');
    expect(state.featureReadiness?.scripture.status).toBe('generated');
    expect(state.nextAction.label).toBeTruthy();
  });
});

describe('WorkspacesService scripture cache normalization', () => {
  let service: WorkspacesService;
  let workspaceRepository: { findOne: jest.Mock; save: jest.Mock };
  let scriptureService: { getPassage: jest.Mock };

  beforeEach(() => {
    workspaceRepository = {
      findOne: jest.fn(),
      save: jest.fn(async (workspace) => workspace),
    };
    scriptureService = {
      getPassage: jest.fn(),
    };

    service = new WorkspacesService(
      workspaceRepository as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      scriptureService as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
    );
  });

  it('refreshes truncated scripture cache before saving', async () => {
    workspaceRepository.findOne.mockResolvedValue({
      id: 'workspace-1',
      userId: 'user-1',
      mainPassage: 'Psalm 37:23-24',
      language: 'en',
      scriptureCache: {
        scriptureLastLookup: 'Psalm 37:23-24:KJV',
        scriptureQuery: 'Psalm 37:23-24',
        scriptureTranslation: 'KJV',
        scriptureResult: {
          reference: 'Psalm 37:23-24',
          translation: 'KJV',
          verses: [
            { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord' },
            { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the Lord' },
          ],
        },
        lookupHistory: [
          {
            scriptureLastLookup: 'Psalm 37:23-24:KJV',
            scriptureTranslation: 'KJV',
            scriptureResult: {
              reference: 'Psalm 37:23-24',
              translation: 'KJV',
              verses: [
                { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord' },
                { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the Lord' },
              ],
            },
          },
        ],
      },
    });

    scriptureService.getPassage.mockResolvedValue({
      reference: 'Psalm 37:23-24',
      translation: 'KJV',
      verses: [
        { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.' },
        { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.' },
      ],
    });

    await service.updateScriptureCache('workspace-1', 'user-1', {});

    expect(scriptureService.getPassage).toHaveBeenCalledWith('Psalm 37:23-24', 'KJV');
    const saved = workspaceRepository.save.mock.calls[0][0];
    expect(saved.scriptureCache.scriptureResult.verses[0].text).toContain('and he delighteth in his way');
    expect(saved.scriptureCache.scriptureResult.verses[1].text).toContain('upholdeth him with his hand');
    expect(saved.scriptureCache.lookupHistory[0].scriptureResult.verses[1].text).toContain('upholdeth him with his hand');
  });

  it('normalizes cached scripture on read and persists refreshed text', async () => {
    workspaceRepository.findOne.mockResolvedValueOnce({
      id: 'workspace-2',
      userId: 'user-1',
      mainPassage: 'Psalm 37:23-24',
      language: 'en',
      scriptureCache: {
        scriptureLastLookup: 'Psalm 37:23-24:KJV',
        scriptureQuery: 'Psalm 37:23-24',
        scriptureTranslation: 'KJV',
        scriptureResult: {
          reference: 'Psalm 37:23-24',
          translation: 'KJV',
          verses: [
            { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the Lord' },
            { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the Lord' },
          ],
        },
      },
    });

    scriptureService.getPassage.mockResolvedValue({
      reference: 'Psalm 37:23-24',
      translation: 'KJV',
      verses: [
        { reference: 'Psalm 37:23', text: 'The steps of a good man are ordered by the LORD: and he delighteth in his way.' },
        { reference: 'Psalm 37:24', text: 'Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand.' },
      ],
    });

    const cache = await service.getScriptureCache('workspace-2', 'user-1');

    expect(cache.scriptureResult.verses[0].text).toContain('and he delighteth in his way');
    expect(cache.scriptureResult.verses[1].text).toContain('upholdeth him with his hand');
    expect(workspaceRepository.save).toHaveBeenCalled();
  });
});
