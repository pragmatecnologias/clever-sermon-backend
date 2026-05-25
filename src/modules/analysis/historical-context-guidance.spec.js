"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var historical_context_guidance_1 = require("./historical-context-guidance");
describe('historical-context-guidance', function () {
    var passages = [
        {
            reference: 'Psalm 37:23-24',
            genre: 'wisdom_poetry',
            text: 'The steps of a good man are ordered by the Lord: and he delighteth in his way. Though he fall, he shall not be utterly cast down: for the Lord upholdeth him with his hand.',
            checks: ['envy', 'steps', 'fall', 'upholds'],
        },
        {
            reference: 'John 3:16',
            genre: 'gospel_dialogue',
            text: 'For God so loved the world, that he gave his only begotten Son...',
            checks: ['Nicodemus', 'new birth', 'eternal life'],
        },
        {
            reference: 'Luke 15:11-24',
            genre: 'parable',
            text: 'And he said, A certain man had two sons...',
            checks: ['grumbling', 'homecoming', 'inheritance'],
        },
        {
            reference: 'Revelation 14:6-12',
            genre: 'prophetic_apocalyptic',
            text: 'Fear God, and give glory to him; for the hour of his judgment is come...',
            checks: ['everlasting gospel', 'worship', 'faithful endurance'],
        },
        {
            reference: 'Exodus 20:8-11',
            genre: 'covenant_law',
            text: 'Remember the sabbath day, to keep it holy...',
            checks: ['covenant', 'liberation', 'Sabbath'],
        },
    ];
    it.each(passages)('builds passage-aware context for %s', function (_a) {
        var reference = _a.reference, genre = _a.genre, text = _a.text, checks = _a.checks;
        var output = (0, historical_context_guidance_1.composeHistoricalContextOutput)({
            reference: reference,
            passageText: text,
            expandedPassageText: text,
            genre: genre,
        });
        var serialized = JSON.stringify(output).toLowerCase();
        expect(serialized).not.toMatch(/fallback|template|custom|placeholder|narrative or doctrinal flow|literary setting of psalm|social realities/);
        expect(serialized).toContain(String(reference).split(':')[0].toLowerCase());
        checks.forEach(function (check) {
            expect(serialized).toContain(check.toLowerCase());
        });
    });
    it('detects genre correctly for the tested passages', function () {
        expect((0, historical_context_guidance_1.detectHistoricalGenre)('Psalm 37:23-24')).toBe('wisdom_poetry');
        expect((0, historical_context_guidance_1.detectHistoricalGenre)('John 3:16')).toBe('gospel_dialogue');
        expect((0, historical_context_guidance_1.detectHistoricalGenre)('Luke 15:11-24')).toBe('parable');
        expect((0, historical_context_guidance_1.detectHistoricalGenre)('Revelation 14:6-12')).toBe('prophetic_apocalyptic');
        expect((0, historical_context_guidance_1.detectHistoricalGenre)('Exodus 20:8-11')).toBe('covenant_law');
    });
    it('flags weak generic output', function () {
        expect((0, historical_context_guidance_1.isWeakHistoricalContextOutput)({
            socialRealities: [{ description: 'fallback template social realities' }],
            powerStructures: [],
            economicContext: [],
            religiousClimate: [],
            audiencePressures: [],
            synthesisStatement: 'Historical context analysis pending',
        })).toBe(true);
    });
    it('accepts passage-aware Psalm 37 context and rejects fallback language', function () {
        var output = (0, historical_context_guidance_1.composeHistoricalContextOutput)({
            reference: 'Psalm 37:23-24',
            passageText: 'The steps of a good man are ordered by the Lord...',
            expandedPassageText: 'The steps of a good man are ordered by the Lord...',
            genre: 'wisdom_poetry',
        });
        var validation = (0, historical_context_guidance_1.validateHistoricalContextOutput)(output);
        expect(validation.valid).toBe(true);
        expect(JSON.stringify(output).toLowerCase()).not.toMatch(/fallback|template|custom|placeholder|literary setting of psalm|narrative or doctrinal flow|helps move from background to sermon/);
    });
    it('rejects generic historical context content with fallback labels', function () {
        var validation = (0, historical_context_guidance_1.validateHistoricalContextOutput)({
            socialRealities: [{ description: 'fallback template social realities' }],
            powerStructures: [{ description: 'generic literary setting of Psalm', dynamics: 'generic literary setting of Psalm' }],
            economicContext: [],
            religiousClimate: [],
            audiencePressures: [],
            synthesisStatement: 'Helps move from background to sermon',
        });
        expect(validation.valid).toBe(false);
        expect(validation.errors.join(' ')).toMatch(/forbidden|missing|required|weak|generic/i);
    });
});
