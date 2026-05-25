"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceGenerationRegistry = void 0;
var helpers_1 = require("./helpers");
var isRecord = function (value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};
var ensureStringArray = function (value) { return Array.isArray(value) && value.every(function (item) { return typeof item === 'string'; }); };
var ensureStringOrObjectArray = function (value) {
    return Array.isArray(value) &&
        value.every(function (item) { return typeof item === 'string' || isRecord(item); });
};
exports.WorkspaceGenerationRegistry = {
    'study-report': {
        capability: 'study-report',
        description: 'Structured exegetical study report',
        validate: function (parsed) {
            if (!isRecord(parsed))
                return { ok: false, issues: ['study report is not an object'] };
            var issues = ['passageOverview', 'literaryContext', 'exegeticalFlow', 'exegeticalSummary', 'structureOfPassage', 'keyTerms', 'historicalContext', 'canonicalContext', 'crossReferences', 'interpretiveChallenges', 'theologicalThemes', 'mainTheologicalClaim', 'pastoralImplications', 'preachingFocus']
                .filter(function (key) { return parsed[key] === undefined || parsed[key] === null; })
                .map(function (key) { return "".concat(key, " missing"); });
            if (!ensureStringArray(parsed.exegeticalFlow))
                issues.push('exegeticalFlow invalid');
            if (!Array.isArray(parsed.structureOfPassage))
                issues.push('structureOfPassage invalid');
            if (!Array.isArray(parsed.keyTerms))
                issues.push('keyTerms invalid');
            if (!Array.isArray(parsed.crossReferences))
                issues.push('crossReferences invalid');
            if (!Array.isArray(parsed.interpretiveChallenges))
                issues.push('interpretiveChallenges invalid');
            if (!ensureStringArray(parsed.theologicalThemes))
                issues.push('theologicalThemes invalid');
            if (!isRecord(parsed.pastoralImplications))
                issues.push('pastoralImplications invalid');
            return { ok: issues.length === 0, issues: issues };
        },
    },
    'outline-points': {
        capability: 'outline-points',
        description: 'Outline candidate point set',
        validate: function (parsed) {
            if (!Array.isArray(parsed))
                return { ok: false, issues: ['outline points not an array'] };
            var issues = [];
            if (parsed.length < 1)
                issues.push('no outline point variations');
            parsed.forEach(function (entry, index) {
                if (!isRecord(entry)) {
                    issues.push("variation ".concat(index + 1, " not an object"));
                    return;
                }
                var points = Array.isArray(entry.points) ? entry.points : [];
                if (!ensureStringArray(points) || points.length < 3)
                    issues.push("variation ".concat(index + 1, " points invalid"));
                if (typeof entry.angle !== 'string')
                    issues.push("variation ".concat(index + 1, " angle missing"));
            });
            return { ok: issues.length === 0, issues: issues };
        },
    },
    outline: {
        capability: 'outline',
        description: 'Full sermon outline',
        validate: function (parsed) {
            if (!isRecord(parsed))
                return { ok: false, issues: ['outline is not an object'] };
            var issues = [];
            if (typeof parsed.introduction !== 'string')
                issues.push('introduction missing');
            var points = Array.isArray(parsed.points) ? helpers_1.WorkspaceHelpers.asStringArray(parsed.points, 24) : [];
            var pointNodes = Array.isArray(parsed.pointNodes) ? parsed.pointNodes : [];
            var inferredPoints = points.length
                ? points
                : pointNodes.map(function (node) { return helpers_1.WorkspaceHelpers.pointText(node); }).filter(Boolean);
            if (!ensureStringArray(inferredPoints) || inferredPoints.length < 3)
                issues.push('points invalid');
            if (!Array.isArray(pointNodes))
                issues.push('pointNodes invalid');
            if (typeof parsed.conclusion !== 'string')
                issues.push('conclusion missing');
            return { ok: issues.length === 0, issues: issues };
        },
    },
    manuscript: {
        capability: 'manuscript',
        description: 'Generated sermon manuscript',
        validate: function (parsed) {
            if (!isRecord(parsed))
                return { ok: false, issues: ['manuscript is not an object'] };
            var issues = [];
            var content = isRecord(parsed.content) ? parsed.content : null;
            if (!content)
                issues.push('content missing');
            var text = typeof (content === null || content === void 0 ? void 0 : content.text) === 'string' ? content.text.trim() : '';
            if (!text)
                issues.push('content.text missing');
            return { ok: issues.length === 0, issues: issues };
        },
    },
    'sermon-core': {
        capability: 'sermon-core',
        description: 'Sermon core summary',
        validate: function (parsed) {
            if (!isRecord(parsed))
                return { ok: false, issues: ['sermon core is not an object'] };
            var issues = ['bigIdea', 'fallenCondition', 'centralTruth', 'sermonGoal', 'audienceNeed']
                .filter(function (key) { return typeof parsed[key] !== 'string' || !String(parsed[key] || '').trim(); })
                .map(function (key) { return "".concat(key, " missing"); });
            return { ok: issues.length === 0, issues: issues };
        },
    },
    'integrity-check': {
        capability: 'integrity-check',
        description: 'Sermon integrity report',
        validate: function (parsed) {
            if (!isRecord(parsed))
                return { ok: false, issues: ['integrity report is not an object'] };
            var issues = [];
            if (typeof parsed.overallScore !== 'number')
                issues.push('overallScore missing');
            if (typeof parsed.balanced !== 'boolean')
                issues.push('balanced missing');
            if (!Array.isArray(parsed.issues))
                issues.push('issues invalid');
            if (!Array.isArray(parsed.strengths))
                issues.push('strengths invalid');
            if (!Array.isArray(parsed.recommendations))
                issues.push('recommendations invalid');
            if (!Array.isArray(parsed.pointAnalysis))
                issues.push('pointAnalysis invalid');
            if (!Array.isArray(parsed.applicationAnalysis))
                issues.push('applicationAnalysis invalid');
            if (!Array.isArray(parsed.citationAnalysis))
                issues.push('citationAnalysis invalid');
            return { ok: issues.length === 0, issues: issues };
        },
    },
    applications: {
        capability: 'applications',
        description: 'Generated application suggestions',
        validate: function (parsed) {
            if (!Array.isArray(parsed))
                return { ok: false, issues: ['applications is not an array'] };
            var items = parsed.filter(function (item) { return typeof item === 'string' || isRecord(item); });
            var issues = [];
            if (!items.length)
                issues.push('applications empty');
            if (!ensureStringOrObjectArray(items))
                issues.push('applications invalid');
            return { ok: issues.length === 0, issues: issues };
        },
    },
    'discussion-questions': {
        capability: 'discussion-questions',
        description: 'Generated discussion questions',
        validate: function (parsed) {
            if (!Array.isArray(parsed))
                return { ok: false, issues: ['discussion questions is not an array'] };
            var items = parsed.filter(function (item) { return typeof item === 'string' || isRecord(item); });
            var issues = [];
            if (!items.length)
                issues.push('discussion questions empty');
            if (!ensureStringOrObjectArray(items))
                issues.push('discussion questions invalid');
            return { ok: issues.length === 0, issues: issues };
        },
    },
    illustrations: {
        capability: 'illustrations',
        description: 'Generated illustration ideas',
        validate: function (parsed) {
            if (!Array.isArray(parsed))
                return { ok: false, issues: ['illustrations is not an array'] };
            var items = parsed.filter(function (item) { return typeof item === 'string' || isRecord(item); });
            var issues = [];
            if (!items.length)
                issues.push('illustrations empty');
            if (!ensureStringOrObjectArray(items))
                issues.push('illustrations invalid');
            return { ok: issues.length === 0, issues: issues };
        },
    },
    citations: {
        capability: 'citations',
        description: 'Generated citations',
        validate: function (parsed) {
            if (!Array.isArray(parsed))
                return { ok: false, issues: ['citations is not an array'] };
            var items = parsed.filter(function (item) { return typeof item === 'string' || isRecord(item); });
            var issues = [];
            if (!items.length)
                issues.push('citations empty');
            if (!ensureStringOrObjectArray(items))
                issues.push('citations invalid');
            return { ok: issues.length === 0, issues: issues };
        },
    },
    'media-suggestions': {
        capability: 'media-suggestions',
        description: 'Media pack suggestions',
        validate: function (parsed) {
            if (!isRecord(parsed))
                return { ok: false, issues: ['media suggestions are not an object'] };
            var sections = isRecord(parsed.sections) ? parsed.sections : parsed;
            var studyAssets = isRecord(sections.studyAssets)
                ? sections.studyAssets
                : null;
            var categoryAssets = isRecord(studyAssets === null || studyAssets === void 0 ? void 0 : studyAssets.categoryAssets)
                ? studyAssets.categoryAssets
                : null;
            var mediaSuggestions = Array.isArray(sections.mediaSuggestions)
                ? sections.mediaSuggestions
                : Array.isArray(categoryAssets === null || categoryAssets === void 0 ? void 0 : categoryAssets.mediaSuggestions)
                    ? (categoryAssets.mediaSuggestions)
                    : [];
            var issues = [];
            if (!mediaSuggestions.length)
                issues.push('media suggestions empty');
            if (!ensureStringOrObjectArray(mediaSuggestions))
                issues.push('media suggestions invalid');
            return { ok: issues.length === 0, issues: issues };
        },
    },
};
