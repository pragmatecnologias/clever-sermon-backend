import { WorkspaceHelpers } from './helpers';

describe('WorkspaceHelpers manuscript recovery', () => {
  it('extracts malformed truncated JSON text payloads', () => {
    const payload = 'assistant: {"text":"<h2>Introduction</h2><p>Grace restores us.</p>';

    expect(WorkspaceHelpers.extractMalformedManuscriptPayload(payload)).toEqual({
      text: '<h2>Introduction</h2><p>Grace restores us.</p>',
      source: 'html-fragment',
    });
  });

  it('extracts plain text payloads when no HTML is present', () => {
    const payload = 'response: {"text":"Introduction\\nGod meets us in mercy.';

    expect(WorkspaceHelpers.extractMalformedManuscriptPayload(payload)).toEqual({
      text: 'Introduction\nGod meets us in mercy.',
      source: 'text-field',
    });
  });

  it('returns null for low-confidence wrapper remnants', () => {
    const payload = '{"text": ';

    expect(WorkspaceHelpers.extractMalformedManuscriptPayload(payload)).toBeNull();
  });
});
