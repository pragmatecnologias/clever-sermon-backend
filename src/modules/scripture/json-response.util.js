"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonObjectFromLlm = parseJsonObjectFromLlm;
function parseJsonObjectFromLlm(raw) {
    var candidates = buildCandidates(raw);
    var lastError = null;
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        try {
            return JSON.parse(candidate);
        }
        catch (error) {
            lastError = error;
        }
    }
    // Last attempt: trim to largest parsable prefix ending with "}".
    var base = candidates[candidates.length - 1] || '';
    for (var i = base.lastIndexOf('}'); i > 1; i = base.lastIndexOf('}', i - 1)) {
        var prefix = base.slice(0, i + 1);
        var repaired = repairJson(prefix, true);
        try {
            return JSON.parse(repaired);
        }
        catch (error) {
            lastError = error;
        }
    }
    throw new Error("Invalid JSON response from LLM".concat(lastError ? ": ".concat(lastError.message) : ''));
}
function buildCandidates(raw) {
    var extracted = extractLikelyJson(raw);
    var sanitized = sanitizeJson(extracted);
    var repaired = repairJson(sanitized, false);
    var repairedWithQuotedKeys = repairJson(repaired
        .replace(/([{,]\s*)([A-Za-z_][\w]*)(\s*:)/g, '$1"$2"$3')
        .replace(/:\s*'([^']*)'/g, ': "$1"'), true);
    return uniqueNonEmpty([extracted, sanitized, repaired, repairedWithQuotedKeys]);
}
function extractLikelyJson(raw) {
    var text = (raw || '').trim();
    if (!text)
        return '{}';
    var codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlock === null || codeBlock === void 0 ? void 0 : codeBlock[1]) {
        return codeBlock[1].trim();
    }
    var firstBrace = text.indexOf('{');
    if (firstBrace === -1)
        return text;
    var lastBrace = text.lastIndexOf('}');
    if (lastBrace > firstBrace)
        return text.slice(firstBrace, lastBrace + 1);
    return text.slice(firstBrace);
}
function sanitizeJson(input) {
    return (input || '')
        .replace(/^\uFEFF/, '')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/([\[,]\s*)\{\s*\{/g, '$1{')
        .replace(/}\s*,\s*{\s*{/g, '},{')
        .replace(/}\s*}\s*,/g, '},')
        .trim();
}
function repairJson(input, closeStructures) {
    var out = input;
    if (closeStructures) {
        var quoteCount = (out.match(/(?<!\\)"/g) || []).length;
        if (quoteCount % 2 !== 0) {
            out += '"';
        }
        var openBrackets = (out.match(/\[/g) || []).length;
        var closeBrackets = (out.match(/\]/g) || []).length;
        for (var i = 0; i < openBrackets - closeBrackets; i++)
            out += ']';
        var openBraces = (out.match(/\{/g) || []).length;
        var closeBraces = (out.match(/\}/g) || []).length;
        for (var i = 0; i < openBraces - closeBraces; i++)
            out += '}';
    }
    return out
        .replace(/,\s*,/g, ',')
        .replace(/,\s*([}\]])/g, '$1')
        .trim();
}
function uniqueNonEmpty(values) {
    var seen = new Set();
    var out = [];
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        var trimmed = (value || '').trim();
        if (!trimmed || seen.has(trimmed))
            continue;
        seen.add(trimmed);
        out.push(trimmed);
    }
    return out;
}
