"use strict";
/**
 * Helper methods for parsing LLM responses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceHelpers = void 0;
var WorkspaceHelpers = /** @class */ (function () {
    function WorkspaceHelpers() {
    }
    WorkspaceHelpers.cleanGeneratedString = function (value) {
        if (value === null || value === undefined)
            return '';
        var cleaned = String(value)
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
            .replace(/\r\n/g, '\n')
            .trim();
        cleaned = cleaned
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\`/g, '`')
            .replace(/\s+/g, ' ')
            .trim();
        cleaned = cleaned.replace(/^[`"'“”‘’]+/, '').replace(/[`"'“”‘’]+$/, '').trim();
        cleaned = cleaned.replace(/\\+$/, '').replace(/,\s*$/, '').trim();
        return cleaned;
    };
    WorkspaceHelpers.tryJsonParse = function (text) {
        try {
            return JSON.parse(text);
        }
        catch (_a) {
            return null;
        }
    };
    WorkspaceHelpers.extractBalancedJsonSegment = function (text) {
        var source = String(text || '');
        var startIndex = source.search(/[\{\[]/);
        if (startIndex < 0)
            return null;
        var openChar = source[startIndex];
        var closeChar = openChar === '{' ? '}' : ']';
        var depth = 0;
        var inString = false;
        var escapeNext = false;
        for (var index = startIndex; index < source.length; index += 1) {
            var char = source[index];
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            if (char === '"') {
                inString = !inString;
                continue;
            }
            if (inString)
                continue;
            if (char === openChar)
                depth += 1;
            if (char === closeChar) {
                depth -= 1;
                if (depth === 0) {
                    return source.slice(startIndex, index + 1);
                }
            }
        }
        return null;
    };
    WorkspaceHelpers.stripTransportNoise = function (text) {
        return String(text || '')
            .replace(/```(?:json)?/gi, '')
            .replace(/```/g, '')
            .replace(/<\|[^|>]+?\|>/g, ' ')
            .replace(/^\s*(assistant|final|response)\s*[:\-]\s*/i, '')
            .replace(/\r\n/g, '\n')
            .trim();
    };
    WorkspaceHelpers.decodeSerializedText = function (text) {
        return String(text || '')
            .replace(/\\r\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\')
            .replace(/\\u([0-9a-fA-F]{4})/g, function (_match, hex) { return String.fromCharCode(parseInt(hex, 16)); })
            .trim();
    };
    WorkspaceHelpers.extractQuotedJsonStringField = function (text, key) {
        var source = WorkspaceHelpers.stripTransportNoise(text);
        if (!source)
            return null;
        var keyPattern = new RegExp("\"".concat(key, "\"\\s*:\\s*\""), 'i');
        var match = keyPattern.exec(source);
        if (!match)
            return null;
        var index = match.index + match[0].length;
        var escaped = false;
        var output = '';
        while (index < source.length) {
            var char = source[index];
            if (escaped) {
                output += "\\".concat(char);
                escaped = false;
                index += 1;
                continue;
            }
            if (char === '\\') {
                escaped = true;
                index += 1;
                continue;
            }
            if (char === '"') {
                return { value: WorkspaceHelpers.decodeSerializedText(output), closed: true };
            }
            output += char;
            index += 1;
        }
        return { value: WorkspaceHelpers.decodeSerializedText(output), closed: false };
    };
    WorkspaceHelpers.extractLeadingHtmlFragment = function (text) {
        var source = WorkspaceHelpers.decodeSerializedText(WorkspaceHelpers.stripTransportNoise(text));
        if (!source)
            return null;
        var tagMatch = source.match(/<(h2|h3|h4|p|ul|ol|li|blockquote|strong|em|br)\b/i);
        if (!tagMatch || typeof tagMatch.index !== 'number')
            return null;
        var fragment = source.slice(tagMatch.index).trim();
        fragment = fragment.replace(/(?:["']?\s*,\s*["']cues["']\s*:)[\s\S]*$/i, '').trim();
        fragment = fragment.replace(/["'}\]]+\s*$/, '').trim();
        return /<\/?(h2|h3|h4|p|ul|ol|li|blockquote|strong|em|br)\b/i.test(fragment) ? fragment : null;
    };
    WorkspaceHelpers.extractMalformedManuscriptPayload = function (text) {
        var source = WorkspaceHelpers.stripTransportNoise(text);
        if (!source)
            return null;
        // Prefer full HTML fragment recovery first. This avoids early truncation when
        // malformed JSON contains unescaped quotes inside HTML attributes.
        var htmlFragment = WorkspaceHelpers.extractLeadingHtmlFragment(source);
        if (htmlFragment) {
            return {
                text: htmlFragment,
                source: 'html-fragment',
            };
        }
        var extractedTextField = WorkspaceHelpers.extractQuotedJsonStringField(source, 'text');
        if (extractedTextField === null || extractedTextField === void 0 ? void 0 : extractedTextField.value) {
            var value = extractedTextField.value.trim();
            if (value.length >= 24 || /<\/?(h2|h3|p|ul|ol|li|strong|em|br)\b/i.test(value)) {
                return {
                    text: value,
                    source: 'text-field',
                };
            }
        }
        var plainText = WorkspaceHelpers.decodeSerializedText(source)
            .replace(/^\s*\{\s*"text"\s*:\s*/i, '')
            .replace(/^"\s*/, '')
            .replace(/"\s*,\s*"cues"[\s\S]*$/i, '')
            .replace(/"\s*\}\s*$/i, '')
            .replace(/^\s*text\s*:\s*/i, '')
            .trim();
        if (!plainText || /^[{\[]/.test(plainText)) {
            return null;
        }
        return {
            text: plainText,
            source: 'plain-text',
        };
    };
    WorkspaceHelpers.pointText = function (point) {
        if (typeof point === 'string')
            return WorkspaceHelpers.cleanGeneratedString(point);
        if (!point || typeof point !== 'object')
            return '';
        return WorkspaceHelpers.cleanGeneratedString(point.title || point.text || point.content || '');
    };
    WorkspaceHelpers.asStringArray = function (value, limit) {
        if (limit === void 0) { limit = 20; }
        if (!Array.isArray(value))
            return [];
        return value
            .map(function (item) { return WorkspaceHelpers.pointText(item); })
            .map(function (item) { return item.trim(); })
            .filter(Boolean)
            .slice(0, limit);
    };
    WorkspaceHelpers.extractOutlinePointTexts = function (structure) {
        if (!structure || typeof structure !== 'object')
            return [];
        var points = WorkspaceHelpers.asStringArray(structure.points, 24);
        if (points.length > 0)
            return points;
        if (Array.isArray(structure.pointNodes)) {
            var fromNodes = WorkspaceHelpers.asStringArray(structure.pointNodes.map(function (node) { return (node === null || node === void 0 ? void 0 : node.title) || (node === null || node === void 0 ? void 0 : node.text) || (node === null || node === void 0 ? void 0 : node.content) || ''; }), 24);
            if (fromNodes.length > 0)
                return fromNodes;
        }
        return WorkspaceHelpers.asStringArray(structure.mainPoints, 24);
    };
    WorkspaceHelpers.parseJsonSafe = function (text) {
        var raw = WorkspaceHelpers.stripTransportNoise(text);
        if (!raw)
            return null;
        var candidates = new Set();
        candidates.add(raw);
        var withoutCodeFence = raw
            .replace(/```(?:json)?/gi, '')
            .replace(/```/g, '')
            .trim();
        if (withoutCodeFence)
            candidates.add(withoutCodeFence);
        var withoutModelTags = withoutCodeFence.replace(/<\|[^|>]+?\|>/g, '').trim();
        if (withoutModelTags)
            candidates.add(withoutModelTags);
        var withoutPrefixNoise = withoutModelTags
            .replace(/^\s*(assistant|final|response)\s*[:\-]\s*/i, '')
            .trim();
        if (withoutPrefixNoise)
            candidates.add(withoutPrefixNoise);
        // Some providers/models return JSON-like payloads with smart quotes.
        // Normalize quote punctuation so JSON parsing still succeeds.
        var smartQuoteNormalized = withoutPrefixNoise
            .replace(/[\u201c\u201d]/g, '"')
            .replace(/[\u2018\u2019]/g, "'")
            .trim();
        if (smartQuoteNormalized)
            candidates.add(smartQuoteNormalized);
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var candidate = candidates_1[_i];
            var parsed = WorkspaceHelpers.tryJsonParse(candidate);
            if (parsed)
                return parsed;
        }
        for (var _a = 0, candidates_2 = candidates; _a < candidates_2.length; _a++) {
            var candidate = candidates_2[_a];
            var segment = WorkspaceHelpers.extractBalancedJsonSegment(candidate);
            if (!segment)
                continue;
            var parsed = WorkspaceHelpers.tryJsonParse(segment);
            if (parsed)
                return parsed;
        }
        return null;
    };
    WorkspaceHelpers.parseListFromResponse = function (text) {
        var lines = text.split('\n').filter(function (line) { return line.trim(); });
        var items = [];
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var trimmed = line.trim();
            // Skip obvious JSON/object noise so malformed JSON does not become fake list items.
            if (/^[\{\}\[\],]+$/.test(trimmed))
                continue;
            // Match numbered lists: 1. , 1) , or just lines
            var match = line.match(/^\s*(?:\d+[\.\)]\s*)?(.+)$/);
            var candidate = WorkspaceHelpers.cleanGeneratedString((match === null || match === void 0 ? void 0 : match[1]) || '');
            if (!candidate)
                continue;
            // Skip JSON-style key/value fragments such as:
            // "mediaSuggestions": [
            // "type": "Image"
            if (trimmed.startsWith('"') && trimmed.includes('":'))
                continue;
            if (/^[A-Za-z0-9_]+\s*:\s*[\[{]?\s*$/.test(candidate))
                continue;
            if (candidate) {
                items.push(candidate);
            }
        }
        return items;
    };
    WorkspaceHelpers.parseOutlinePointsResponse = function (text, count) {
        var parsed = WorkspaceHelpers.parseJsonSafe(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, count).map(function (variation, idx) { return ({
                angle: (variation === null || variation === void 0 ? void 0 : variation.angle) || "Variation ".concat(idx + 1),
                style: (variation === null || variation === void 0 ? void 0 : variation.style) || (variation === null || variation === void 0 ? void 0 : variation.outlineType) || '',
                theologicalEmphasis: (variation === null || variation === void 0 ? void 0 : variation.theologicalEmphasis) || '',
                audienceFocus: (variation === null || variation === void 0 ? void 0 : variation.audienceFocus) || '',
                sermonStructure: (variation === null || variation === void 0 ? void 0 : variation.sermonStructure) || '',
                points: WorkspaceHelpers.asStringArray((variation === null || variation === void 0 ? void 0 : variation.points) || (variation === null || variation === void 0 ? void 0 : variation.mainPoints), 8),
            }); });
        }
        // Fallback: try to parse variations manually
        var variations = [];
        var sections = text.split(/Variation \d+:|Option \d+:/i);
        for (var i = 1; i < Math.min(sections.length, count + 1); i++) {
            var points = WorkspaceHelpers.parseListFromResponse(sections[i]).slice(0, 5);
            if (points.length > 0) {
                variations.push({
                    angle: "Variation ".concat(i),
                    style: '',
                    theologicalEmphasis: '',
                    audienceFocus: '',
                    sermonStructure: '',
                    points: points
                });
            }
        }
        return variations;
    };
    WorkspaceHelpers.parseOutlineFromResponse = function (text) {
        var structure = {
            introduction: '',
            points: [],
            conclusion: '',
            callToAction: ''
        };
        var introMatch = text.match(/INTRODUCTION:\s*([\s\S]*?)(?=POINT 1:|$)/i);
        if (introMatch)
            structure.introduction = introMatch[1].trim();
        var pointMatches = text.matchAll(/POINT (\d+):\s*([\s\S]*?)(?=POINT \d+:|CONCLUSION:|$)/gi);
        for (var _i = 0, pointMatches_1 = pointMatches; _i < pointMatches_1.length; _i++) {
            var match = pointMatches_1[_i];
            structure.points.push(match[2].trim());
        }
        var conclusionMatch = text.match(/CONCLUSION:\s*([\s\S]*?)(?=CALL TO ACTION:|$)/i);
        if (conclusionMatch)
            structure.conclusion = conclusionMatch[1].trim();
        var callMatch = text.match(/CALL TO ACTION:\s*([\s\S]*?)$/i);
        if (callMatch)
            structure.callToAction = callMatch[1].trim();
        return structure.points.length > 0 ? structure : null;
    };
    WorkspaceHelpers.normalizeOutlineData = function (data) {
        if (!data)
            return null;
        var normalizedPoints = WorkspaceHelpers.extractOutlinePointTexts(data);
        var pointNodes = Array.isArray(data.pointNodes)
            ? data.pointNodes
                .map(function (point, idx) { return ({
                id: String((point === null || point === void 0 ? void 0 : point.id) || "point-".concat(idx + 1)),
                level: Number(point === null || point === void 0 ? void 0 : point.level) || 1,
                title: WorkspaceHelpers.pointText(point),
                slideTitle: typeof (point === null || point === void 0 ? void 0 : point.slideTitle) === 'string' ? point.slideTitle.replace(/^"|"$/g, '').trim() : '',
                summary: typeof (point === null || point === void 0 ? void 0 : point.summary) === 'string' ? point.summary.trim() : '',
                movement: typeof (point === null || point === void 0 ? void 0 : point.movement) === 'string' ? point.movement.trim() : '',
                supportingVerses: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.supportingVerses) || (point === null || point === void 0 ? void 0 : point.verses), 10),
                canonicalThemes: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.canonicalThemes) || (point === null || point === void 0 ? void 0 : point.themes), 8),
                crossReferences: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.crossReferences) || (point === null || point === void 0 ? void 0 : point.crossRefs), 10),
                subpoints: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.subpoints) || (point === null || point === void 0 ? void 0 : point.children), 10),
                applications: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.applications) || (point === null || point === void 0 ? void 0 : point.applicationIdeas), 16),
                discussionQuestions: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.discussionQuestions) || (point === null || point === void 0 ? void 0 : point.questions), 16),
                illustrationIdeas: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.illustrationIdeas) || (point === null || point === void 0 ? void 0 : point.illustrations), 16),
                mediaSuggestions: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.mediaSuggestions) || (point === null || point === void 0 ? void 0 : point.media), 16),
                egwSupport: Array.isArray(point === null || point === void 0 ? void 0 : point.egwSupport)
                    ? point.egwSupport
                        .map(function (item) { return ({
                        citation: typeof (item === null || item === void 0 ? void 0 : item.citation) === 'string' ? item.citation.trim() : '',
                        quote: typeof (item === null || item === void 0 ? void 0 : item.quote) === 'string' ? item.quote.trim() : '',
                        relevance: typeof (item === null || item === void 0 ? void 0 : item.relevance) === 'string' ? item.relevance.trim() : '',
                    }); })
                        .filter(function (item) { return item.citation || item.quote || item.relevance; })
                        .slice(0, 6)
                    : [],
                references: WorkspaceHelpers.asStringArray((point === null || point === void 0 ? void 0 : point.references) || (point === null || point === void 0 ? void 0 : point.explorationReferences), 8),
                notes: typeof (point === null || point === void 0 ? void 0 : point.notes) === 'string' ? point.notes.trim() : '',
            }); })
                .filter(function (point) { return point.title; })
            : [];
        return {
            introduction: data.introduction || data.intro || '',
            points: normalizedPoints,
            pointNodes: pointNodes,
            outlineType: data.outlineType || data.style || '',
            sermonMovement: data.sermonMovement || data.movement || '',
            slidePlan: WorkspaceHelpers.asStringArray(data.slidePlan || data.slides, 20),
            workflowTags: WorkspaceHelpers.asStringArray(data.workflowTags || data.pipelineTags, 12),
            conclusion: data.conclusion || '',
            callToAction: data.callToAction || data.call_to_action || data.cta || ''
        };
    };
    WorkspaceHelpers.parseIllustrationsFromResponse = function (text) {
        var parsed = WorkspaceHelpers.parseJsonSafe(text);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        if (parsed && typeof parsed === 'object') {
            var fromObject = (Array.isArray(parsed.illustrations) && parsed.illustrations) ||
                (Array.isArray(parsed.items) && parsed.items) ||
                (Array.isArray(parsed.data) && parsed.data) ||
                [];
            if (fromObject.length > 0) {
                return fromObject;
            }
        }
        var items = [];
        var sections = text.split(/(?:Illustration|Example) \d+:/i);
        for (var i = 1; i < sections.length; i++) {
            var section = sections[i].trim();
            var titleMatch = section.match(/^([^\n]+)/);
            var verseMatch = section.match(/\(([^)]+\d+:\d+[^)]*)\)/);
            items.push({
                title: titleMatch ? titleMatch[1].trim() : "Illustration ".concat(i),
                content: section,
                verseReference: verseMatch ? verseMatch[1] : null
            });
        }
        if (items.length > 0)
            return items;
        var listItems = WorkspaceHelpers.parseListFromResponse(text);
        if (listItems.length > 0) {
            return listItems.map(function (entry, index) {
                var verseMatch = entry.match(/\(([^)]+\d+:\d+[^)]*)\)/);
                var content = entry.replace(/\(([^)]+\d+:\d+[^)]*)\)/, '').trim();
                return {
                    title: "Illustration ".concat(index + 1),
                    content: content || entry,
                    verseReference: verseMatch ? verseMatch[1] : null,
                };
            });
        }
        return [];
    };
    WorkspaceHelpers.parseCitationsFromResponse = function (text) {
        var items = [];
        var lines = text.split('\n').filter(function (line) { return line.trim(); });
        for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
            var line = lines_2[_i];
            var verseMatch = line.match(/\(([^)]+\d+:\d+[^)]*)\)/);
            var statement = line.replace(/^\s*\d+[\.\)]\s*/, '').replace(/\([^)]+\)/, '').trim();
            if (statement) {
                items.push({
                    statementType: 'observation',
                    statement: statement,
                    verseReferences: verseMatch ? [verseMatch[1]] : []
                });
            }
        }
        return items;
    };
    WorkspaceHelpers.logLlmOutput = function (type, output) {
        if (process.env.LOG_LLM_REQUESTS === 'true') {
            console.log("[LLM ".concat(type, "]:"), output.substring(0, 500));
        }
    };
    return WorkspaceHelpers;
}());
exports.WorkspaceHelpers = WorkspaceHelpers;
