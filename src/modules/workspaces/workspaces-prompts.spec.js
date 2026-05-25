"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var workspaces_prompts_1 = require("./workspaces-prompts");
describe('Workspace prompt registry', function () {
    it('covers all prompt families with at least one evaluation case', function () {
        var coverage = (0, workspaces_prompts_1.getWorkspacePromptEvaluationCoverage)();
        expect(coverage.promptCount).toBeGreaterThan(0);
        expect(coverage.evaluationCaseCount).toBeGreaterThanOrEqual(coverage.promptCount);
        expect(coverage.promptIds).toContain('sermon-core');
        expect(coverage.promptIds).toContain('study-report');
        expect(coverage.promptIds).toContain('media-suggestions');
    });
    it('keeps evaluation cases attached to every prompt entry', function () {
        for (var _i = 0, _a = Object.entries(workspaces_prompts_1.WorkspacePromptRegistry); _i < _a.length; _i++) {
            var _b = _a[_i], promptId = _b[0], entry = _b[1];
            expect(entry.promptId).toBe(promptId);
            expect(Array.isArray(entry.evaluationCases)).toBe(true);
            expect(entry.evaluationCases.length).toBeGreaterThan(0);
            for (var _c = 0, _d = entry.evaluationCases; _c < _d.length; _c++) {
                var evaluationCase = _d[_c];
                expect(evaluationCase.promptId).toBe(promptId);
                expect(evaluationCase.description).toBeTruthy();
                expect(Object.keys(evaluationCase.input).length).toBeGreaterThan(0);
                expect(Array.isArray(evaluationCase.expectedTraits)).toBe(true);
                expect(evaluationCase.expectedTraits.length).toBeGreaterThan(0);
            }
        }
    });
    it('exposes a flat evaluation-case index for long-term AI QA', function () {
        var ids = new Set(workspaces_prompts_1.WorkspacePromptEvaluationCases.map(function (item) { return item.id; }));
        expect(ids.has('sermon-core-en-simple')).toBe(true);
        expect(ids.has('study-report-exegetical')).toBe(true);
        expect(ids.has('media-suggestions-pack')).toBe(true);
    });
});
