"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
describe('WorkspaceHelpers manuscript recovery', function () {
    it('extracts malformed truncated JSON text payloads', function () {
        var payload = 'assistant: {"text":"<h2>Introduction</h2><p>Grace restores us.</p>';
        expect(helpers_1.WorkspaceHelpers.extractMalformedManuscriptPayload(payload)).toEqual({
            text: '<h2>Introduction</h2><p>Grace restores us.</p>',
            source: 'html-fragment',
        });
    });
    it('extracts plain text payloads when no HTML is present', function () {
        var payload = 'response: {"text":"Introduction\\nGod meets us in mercy.';
        expect(helpers_1.WorkspaceHelpers.extractMalformedManuscriptPayload(payload)).toEqual({
            text: 'Introduction\nGod meets us in mercy.',
            source: 'text-field',
        });
    });
    it('returns null for low-confidence wrapper remnants', function () {
        var payload = '{"text": ';
        expect(helpers_1.WorkspaceHelpers.extractMalformedManuscriptPayload(payload)).toBeNull();
    });
});
