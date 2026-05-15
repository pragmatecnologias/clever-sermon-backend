import { WorkspacesService } from './workspaces.service';

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
  let consoleInfoSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new WorkspacesService(
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
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
    );
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

  it('builds workspace state with history and compare summaries', () => {
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

    const state = (service as any).buildWorkspaceState(workspace);

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
    expect(state.nextAction.label).toBeTruthy();
  });
});
