"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitationValidatorService = void 0;
var common_1 = require("@nestjs/common");
var CitationValidatorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CitationValidatorService = _classThis = /** @class */ (function () {
        function CitationValidatorService_1(scriptureService) {
            this.scriptureService = scriptureService;
        }
        CitationValidatorService_1.prototype.validateCitation = function (statement_1, verseReference_1) {
            return __awaiter(this, arguments, void 0, function (statement, verseReference, translationCode) {
                var passage, verseText, overlap, score, supportLevel, explanation, error_1;
                var _a;
                if (translationCode === void 0) { translationCode = 'KJV'; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.scriptureService.getPassage(verseReference, translationCode)];
                        case 1:
                            passage = _b.sent();
                            if (!passage || !((_a = passage.verses) === null || _a === void 0 ? void 0 : _a.length)) {
                                return [2 /*return*/, {
                                        verseReference: verseReference,
                                        statement: statement,
                                        verseText: '',
                                        supportLevel: 'not_supported',
                                        phraseOverlap: [],
                                        matchScore: 0,
                                        explanation: 'Verse not found or invalid reference'
                                    }];
                            }
                            verseText = passage.verses.map(function (v) { return v.text || ''; }).join(' ');
                            overlap = this.findPhraseOverlap(statement, verseText);
                            score = this.calculateMatchScore(statement, verseText, overlap);
                            supportLevel = void 0;
                            explanation = void 0;
                            if (score >= 0.6) {
                                supportLevel = 'supported';
                                explanation = 'Strong textual support with clear phrase overlap';
                            }
                            else if (score >= 0.3) {
                                supportLevel = 'weak';
                                explanation = 'Partial support; some thematic connection but limited direct overlap';
                            }
                            else {
                                supportLevel = 'not_supported';
                                explanation = 'Minimal textual support; claim may be interpretive or unsupported';
                            }
                            return [2 /*return*/, {
                                    verseReference: verseReference,
                                    statement: statement,
                                    verseText: verseText,
                                    supportLevel: supportLevel,
                                    phraseOverlap: overlap,
                                    matchScore: score,
                                    explanation: explanation
                                }];
                        case 2:
                            error_1 = _b.sent();
                            return [2 /*return*/, {
                                    verseReference: verseReference,
                                    statement: statement,
                                    verseText: '',
                                    supportLevel: 'not_supported',
                                    phraseOverlap: [],
                                    matchScore: 0,
                                    explanation: "Error validating citation: ".concat(error_1.message)
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CitationValidatorService_1.prototype.validateMultipleCitations = function (citations_1) {
            return __awaiter(this, arguments, void 0, function (citations, translationCode) {
                var results, _i, citations_2, citation, _a, _b, ref, result;
                if (translationCode === void 0) { translationCode = 'KJV'; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            results = [];
                            _i = 0, citations_2 = citations;
                            _c.label = 1;
                        case 1:
                            if (!(_i < citations_2.length)) return [3 /*break*/, 6];
                            citation = citations_2[_i];
                            _a = 0, _b = citation.verseReferences;
                            _c.label = 2;
                        case 2:
                            if (!(_a < _b.length)) return [3 /*break*/, 5];
                            ref = _b[_a];
                            return [4 /*yield*/, this.validateCitation(citation.statement, ref, translationCode)];
                        case 3:
                            result = _c.sent();
                            results.push(result);
                            _c.label = 4;
                        case 4:
                            _a++;
                            return [3 /*break*/, 2];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, results];
                    }
                });
            });
        };
        CitationValidatorService_1.prototype.findPhraseOverlap = function (statement, verseText) {
            var overlap = [];
            var statementLower = statement.toLowerCase();
            var verseLower = verseText.toLowerCase();
            // Extract phrases (2-5 words)
            var statementWords = statementLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
            for (var phraseLength = 5; phraseLength >= 2; phraseLength--) {
                for (var i = 0; i <= statementWords.length - phraseLength; i++) {
                    var phrase = statementWords.slice(i, i + phraseLength).join(' ');
                    if (phrase.length > 5 && verseLower.includes(phrase)) {
                        overlap.push(phrase);
                    }
                }
            }
            return __spreadArray([], new Set(overlap), true);
        };
        CitationValidatorService_1.prototype.calculateMatchScore = function (statement, verseText, overlap) {
            var statementWords = statement.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(/\s+/)
                .filter(Boolean);
            var verseWords = verseText.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(/\s+/)
                .filter(Boolean);
            var stopWords = new Set([
                'the', 'and', 'for', 'that', 'with', 'from', 'this', 'these', 'those',
                'are', 'was', 'were', 'has', 'have', 'had', 'not', 'but', 'you', 'your',
                'his', 'her', 'their', 'they', 'them', 'our', 'its', 'into', 'over'
            ]);
            var meaningfulStatementWords = statementWords.filter(function (w) { return !stopWords.has(w) && w.length > 2; });
            var meaningfulVerseWords = new Set(verseWords.filter(function (w) { return !stopWords.has(w) && w.length > 2; }));
            if (meaningfulStatementWords.length === 0)
                return 0;
            var matchedWords = meaningfulStatementWords.filter(function (w) { return meaningfulVerseWords.has(w); });
            var wordMatchRatio = matchedWords.length / meaningfulStatementWords.length;
            // Phrase overlap bonus
            var phraseBonus = Math.min(overlap.length * 0.15, 0.4);
            return Math.min(wordMatchRatio + phraseBonus, 1);
        };
        return CitationValidatorService_1;
    }());
    __setFunctionName(_classThis, "CitationValidatorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CitationValidatorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CitationValidatorService = _classThis;
}();
exports.CitationValidatorService = CitationValidatorService;
