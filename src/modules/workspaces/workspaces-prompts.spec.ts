import {
  WorkspacePromptEvaluationCases,
  WorkspacePromptRegistry,
  getWorkspacePromptEvaluationCoverage,
} from './workspaces-prompts';

describe('Workspace prompt registry', () => {
  it('covers all prompt families with at least one evaluation case', () => {
    const coverage = getWorkspacePromptEvaluationCoverage();

    expect(coverage.promptCount).toBeGreaterThan(0);
    expect(coverage.evaluationCaseCount).toBeGreaterThanOrEqual(coverage.promptCount);
    expect(coverage.promptIds).toContain('sermon-core');
    expect(coverage.promptIds).toContain('study-report');
    expect(coverage.promptIds).toContain('media-suggestions');
  });

  it('keeps evaluation cases attached to every prompt entry', () => {
    for (const [promptId, entry] of Object.entries(WorkspacePromptRegistry)) {
      expect(entry.promptId).toBe(promptId);
      expect(Array.isArray(entry.evaluationCases)).toBe(true);
      expect(entry.evaluationCases.length).toBeGreaterThan(0);
      for (const evaluationCase of entry.evaluationCases) {
        expect(evaluationCase.promptId).toBe(promptId);
        expect(evaluationCase.description).toBeTruthy();
        expect(Object.keys(evaluationCase.input).length).toBeGreaterThan(0);
        expect(Array.isArray(evaluationCase.expectedTraits)).toBe(true);
        expect(evaluationCase.expectedTraits.length).toBeGreaterThan(0);
      }
    }
  });

  it('exposes a flat evaluation-case index for long-term AI QA', () => {
    const ids = new Set(WorkspacePromptEvaluationCases.map((item) => item.id));
    expect(ids.has('sermon-core-en-simple')).toBe(true);
    expect(ids.has('study-report-exegetical')).toBe(true);
    expect(ids.has('media-suggestions-pack')).toBe(true);
  });
});
