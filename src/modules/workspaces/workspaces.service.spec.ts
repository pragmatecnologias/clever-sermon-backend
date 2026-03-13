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
    expect(consoleInfoSpy).toHaveBeenCalledWith('[manuscript-parse] recovery_mode=text-field');
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
});
