"use strict";
/**
 * SDA Doctrinal Alignment System
 *
 * Provides doctrinal guardrails for LLM-generated content without being polemical.
 * Ensures theological consistency while maintaining academic respect for other traditions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDAAlignmentService = exports.THEOLOGICAL_LENS_CONTEXTS = exports.SDA_DOCTRINAL_CONTEXT = void 0;
exports.SDA_DOCTRINAL_CONTEXT = "\nYou are generating content for a Seventh-day Adventist Bible study and sermon preparation application.\n\nAll outputs must align with the following doctrinal guidelines unless explicitly asked to compare traditions:\n\n1. The seventh-day Sabbath (Saturday) is the biblical day of worship. Do not default to Sunday worship language.\n2. Avoid assuming the immortality of the soul. The state of the dead is described as unconscious sleep until resurrection.\n3. Avoid eternal conscious torment language. Use biblically grounded phrasing.\n4. Recognize the significance of the sanctuary theme in Scripture.\n5. Treat prophetic books (Daniel and Revelation) as coherent and connected.\n6. Avoid replacement theology framing.\n7. Maintain salvation by grace through faith in Christ alone.\n8. When discussing debated passages, clearly distinguish between interpretations and avoid asserting non-Adventist views as normative.\n9. Maintain respectful and non-polemical tone toward other Christian traditions.\n10. When mentioning worship gatherings, use \"Sabbath\" unless explicitly instructed otherwise.\n11. If a passage is commonly interpreted differently across traditions, present interpretations clearly labeled and avoid asserting one as universally accepted.\n12. All study insights must remain grounded in Scripture.\n\nIMPORTANT TONE GUIDELINES:\n- Be confident but balanced\n- Never say \"Other traditions are wrong\"\n- Instead say \"Many Christian traditions interpret this differently. In Adventist theology...\"\n- Maintain academic respect\n- Avoid sectarian language\n- Do not embed controversial phrasing automatically\n";
exports.THEOLOGICAL_LENS_CONTEXTS = {
    adventist: exports.SDA_DOCTRINAL_CONTEXT,
};
var SDAAlignmentService = /** @class */ (function () {
    function SDAAlignmentService() {
    }
    /**
     * Scan content for problematic language patterns
     */
    SDAAlignmentService.scanContent = function (content) {
        var issues = [];
        // Check for Sunday worship language
        var sundayPatterns = [
            /come to church (this |on )?sunday/i,
            /celebrate (resurrection )?sunday/i,
            /sunday worship/i,
            /lord's day service/i
        ];
        sundayPatterns.forEach(function (pattern) {
            var _a;
            if (pattern.test(content)) {
                issues.push({
                    type: 'sunday_language',
                    text: ((_a = content.match(pattern)) === null || _a === void 0 ? void 0 : _a[0]) || '',
                    suggestion: 'Replace with "Sabbath worship" or "gather in worship this Sabbath"'
                });
            }
        });
        // Check for immortal soul language
        var immortalSoulPatterns = [
            /when you die you(?:'ll| will) (?:immediately )?(?:be in|go to) heaven/i,
            /your soul (?:goes|ascends) to heaven/i,
            /immortal soul/i
        ];
        immortalSoulPatterns.forEach(function (pattern) {
            var _a;
            if (pattern.test(content)) {
                issues.push({
                    type: 'immortal_soul',
                    text: ((_a = content.match(pattern)) === null || _a === void 0 ? void 0 : _a[0]) || '',
                    suggestion: 'Use "resurrection" or "sleep in death until resurrection" language'
                });
            }
        });
        // Check for eternal torment language
        var eternalTormentPatterns = [
            /eternal (?:conscious )?torment/i,
            /burning forever in hell/i,
            /eternal suffering/i
        ];
        eternalTormentPatterns.forEach(function (pattern) {
            var _a;
            if (pattern.test(content)) {
                issues.push({
                    type: 'eternal_torment',
                    text: ((_a = content.match(pattern)) === null || _a === void 0 ? void 0 : _a[0]) || '',
                    suggestion: 'Use biblically grounded language about final judgment'
                });
            }
        });
        // Check for replacement theology
        var replacementTheologyPatterns = [
            /israel (?:has been|was) replaced by the church/i,
            /the church (?:is|has become) the new israel/i
        ];
        replacementTheologyPatterns.forEach(function (pattern) {
            var _a;
            if (pattern.test(content)) {
                issues.push({
                    type: 'replacement_theology',
                    text: ((_a = content.match(pattern)) === null || _a === void 0 ? void 0 : _a[0]) || '',
                    suggestion: 'Use language that respects continuity between Israel and the church'
                });
            }
        });
        return {
            hasIssues: issues.length > 0,
            issues: issues
        };
    };
    /**
     * Apply content transformations for SDA alignment
     */
    SDAAlignmentService.transformContent = function (content) {
        var transformed = content;
        // Transform Sunday language to Sabbath
        transformed = transformed.replace(/come to church (this |on )?sunday/gi, 'gather in worship this Sabbath');
        transformed = transformed.replace(/celebrate (resurrection )?sunday/gi, 'celebrate the resurrection');
        transformed = transformed.replace(/sunday worship/gi, 'Sabbath worship');
        transformed = transformed.replace(/lord's day/gi, 'Sabbath');
        return transformed;
    };
    /**
     * Get SDA-specific cross-reference suggestions
     */
    SDAAlignmentService.getSabbathReferences = function () {
        return [
            'Genesis 2:1-3',
            'Exodus 20:8-11',
            'Isaiah 58:13-14',
            'Mark 2:27-28',
            'Luke 4:16',
            'Hebrews 4:9-10',
            'Revelation 14:12'
        ];
    };
    SDAAlignmentService.getSanctuaryReferences = function () {
        return [
            'Exodus 25:8-9',
            'Leviticus 16:1-34',
            'Hebrews 8:1-5',
            'Hebrews 9:11-12',
            'Hebrews 9:23-24',
            'Daniel 8:14',
            'Revelation 11:19'
        ];
    };
    SDAAlignmentService.getPropheticReferences = function () {
        return [
            'Daniel 2:44',
            'Daniel 7:13-14',
            'Daniel 8:14',
            'Daniel 9:24-27',
            'Revelation 12:17',
            'Revelation 14:6-12',
            'Revelation 20:11-15'
        ];
    };
    /**
     * Build interpretive challenge framing for debated passages
     */
    SDAAlignmentService.buildInterpretiveFrame = function (passage) {
        var debatedPassages = {
            'Luke 16': 'This parable is interpreted differently across Christian traditions. Some view it as literal, while Adventist theology understands it as a parable using contemporary Jewish imagery, not a literal description of the afterlife.',
            'Ecclesiastes 9': 'Different traditions interpret the state of the dead differently. Adventist theology emphasizes the biblical language of "sleep" until resurrection.',
            '1 Thessalonians 4': 'While all Christians affirm the resurrection, traditions differ on the intermediate state. Adventist theology emphasizes the resurrection as the moment of reunion with Christ.',
            'Daniel 8': 'The 2300 days prophecy is understood differently across traditions. Adventist theology connects this to the investigative judgment beginning in 1844.',
            'Hebrews 8-10': 'The sanctuary theme is central to Adventist theology, understanding Christ\'s ministry in the heavenly sanctuary as ongoing.'
        };
        for (var _i = 0, _a = Object.entries(debatedPassages); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], frame = _b[1];
            if (passage.includes(key)) {
                return frame;
            }
        }
        return 'Different Christian traditions may interpret this passage differently. Consider multiple perspectives while remaining grounded in Scripture.';
    };
    /**
     * Get theological lens context for LLM prompts
     */
    SDAAlignmentService.getLensContext = function (_lens) {
        if (_lens === void 0) { _lens = 'adventist'; }
        return exports.THEOLOGICAL_LENS_CONTEXTS.adventist;
    };
    return SDAAlignmentService;
}());
exports.SDAAlignmentService = SDAAlignmentService;
