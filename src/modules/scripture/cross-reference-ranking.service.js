"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.CrossReferenceRankingService = void 0;
var common_1 = require("@nestjs/common");
var scripture_prompts_1 = require("./scripture-prompts");
var CrossReferenceRankingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CrossReferenceRankingService = _classThis = /** @class */ (function () {
        function CrossReferenceRankingService_1(scriptureService, llmService, egwPassageIntegrationService) {
            this.scriptureService = scriptureService;
            this.llmService = llmService;
            this.egwPassageIntegrationService = egwPassageIntegrationService;
        }
        CrossReferenceRankingService_1.prototype.getRankedCrossReferences = function (verse) {
            return __awaiter(this, void 0, void 0, function () {
                var sourceData, sourceText, rawRefs, details, detailMap, rankedRefs, _i, _a, refString, reference, refData, targetText, ranking, _b, llmRefined;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.scriptureService.getPassage(verse)];
                        case 1:
                            sourceData = _e.sent();
                            sourceText = this.getPassageText(sourceData);
                            return [4 /*yield*/, this.scriptureService.getCrossReferences(verse)];
                        case 2:
                            rawRefs = _e.sent();
                            if (!(!rawRefs || rawRefs.length === 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.generateFallbackReferences(verse, sourceText)];
                        case 3:
                            rawRefs = _e.sent();
                            _e.label = 4;
                        case 4:
                            if (!rawRefs || rawRefs.length === 0)
                                return [2 /*return*/, []];
                            return [4 /*yield*/, this.scriptureService.getCrossReferenceDetails(verse)];
                        case 5:
                            details = _e.sent();
                            detailMap = new Map((Array.isArray(details) ? details : []).map(function (item) { return [String(item.reference), String(item.category || '')]; }));
                            rankedRefs = [];
                            _i = 0, _a = rawRefs.slice(0, 20);
                            _e.label = 6;
                        case 6:
                            if (!(_i < _a.length)) return [3 /*break*/, 11];
                            refString = _a[_i];
                            _e.label = 7;
                        case 7:
                            _e.trys.push([7, 9, , 10]);
                            reference = typeof refString === 'string' ? refString : refString.reference;
                            return [4 /*yield*/, this.scriptureService.getPassage(reference)];
                        case 8:
                            refData = _e.sent();
                            targetText = this.getPassageText(refData);
                            if (!targetText || !sourceText)
                                return [3 /*break*/, 10];
                            ranking = this.analyzeRelationship(sourceText, targetText, verse, reference, detailMap.get(reference) || '');
                            rankedRefs.push({
                                reference: reference,
                                category: ranking.category,
                                tier: ranking.tier,
                                relevanceScore: ranking.score,
                                connectionExplanation: ranking.explanation,
                                explanation: ranking.explanation,
                                themes: ranking.themes,
                                sourceType: 'bible',
                                lexicalSignal: ranking.lexicalSignal,
                                relatedPassages: [verse],
                                text: ((_d = (_c = refData === null || refData === void 0 ? void 0 : refData.verses) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) || '',
                            });
                            return [3 /*break*/, 10];
                        case 9:
                            _b = _e.sent();
                            return [3 /*break*/, 10];
                        case 10:
                            _i++;
                            return [3 /*break*/, 6];
                        case 11: return [4 /*yield*/, this.refineWithLlmWithTimeout(verse, sourceText, rankedRefs)];
                        case 12:
                            llmRefined = _e.sent();
                            return [2 /*return*/, llmRefined.sort(function (a, b) { return b.relevanceScore - a.relevanceScore; })];
                    }
                });
            });
        };
        CrossReferenceRankingService_1.prototype.getSOPLinkedCrossReferences = function (verse_1) {
            return __awaiter(this, arguments, void 0, function (verse, language) {
                var parsed, panel;
                var _this = this;
                if (language === void 0) { language = 'en'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            parsed = this.parseReferenceForEGW(verse);
                            if (!parsed)
                                return [2 /*return*/, []];
                            return [4 /*yield*/, this.egwPassageIntegrationService.getPassageInsights(parsed.book, parsed.chapter, parsed.verseStart, parsed.verseEnd, language || 'en', 8)];
                        case 1:
                            panel = _a.sent();
                            return [2 /*return*/, ((panel === null || panel === void 0 ? void 0 : panel.insights) || []).map(function (insight) {
                                    var category = _this.mapEGWReasonToCategory(insight.rankingReason);
                                    var tier = _this.mapEGWScoreToTier(insight.rankingScore || 0);
                                    var explanation = "EGW ".concat(insight.reference, " links ").concat(insight.scriptureReference, " to ").concat(verse, " (").concat(insight.rankingReason.replace('_', ' '), ").");
                                    return {
                                        reference: insight.reference,
                                        category: category,
                                        tier: tier,
                                        relevanceScore: Math.max(0, Math.min(100, insight.rankingScore || 40)),
                                        connectionExplanation: explanation,
                                        explanation: explanation,
                                        themes: ['spirit_of_prophecy', insight.rankingReason || 'thematic'],
                                        sourceType: 'sop',
                                        lexicalSignal: 0,
                                        relatedPassages: [verse, insight.scriptureReference],
                                        text: insight.preview,
                                        bookTitle: insight.bookTitle,
                                        chapterTitle: insight.chapterTitle,
                                        scriptureReference: insight.scriptureReference,
                                        rankingReason: insight.rankingReason,
                                    };
                                })];
                    }
                });
            });
        };
        CrossReferenceRankingService_1.prototype.mapCrossReferencesToOutlinePoints = function (verse, points) {
            return __awaiter(this, void 0, void 0, function () {
                var ranked;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getRankedCrossReferences(verse)];
                        case 1:
                            ranked = _a.sent();
                            return [2 /*return*/, (Array.isArray(points) ? points : []).map(function (point, index) {
                                    var pointText = String((point === null || point === void 0 ? void 0 : point.text) || '').trim();
                                    var pointTokens = _this.tokenize(pointText.toLowerCase());
                                    var supporting = Array.isArray(point === null || point === void 0 ? void 0 : point.supportingVerses) ? point.supportingVerses : [];
                                    var scored = ranked
                                        .map(function (item) {
                                        var explanationTokens = _this.tokenize("".concat(item.connectionExplanation || '', " ").concat(item.text || '').toLowerCase());
                                        var overlap = pointTokens.filter(function (token) { return explanationTokens.includes(token); }).length;
                                        var verseBoost = supporting.some(function (ref) { return ref.toLowerCase() === item.reference.toLowerCase(); }) ? 0.2 : 0;
                                        return __assign(__assign({}, item), { relevanceScore: Math.min(1, item.relevanceScore / 100 + overlap * 0.03 + verseBoost) * 100 });
                                    })
                                        .sort(function (a, b) { return b.relevanceScore - a.relevanceScore; })
                                        .slice(0, 4);
                                    return {
                                        pointId: String((point === null || point === void 0 ? void 0 : point.id) || "point-".concat(index + 1)),
                                        pointText: pointText,
                                        suggestedReferences: scored,
                                    };
                                })];
                    }
                });
            });
        };
        CrossReferenceRankingService_1.prototype.analyzeRelationship = function (sourceText, targetText, sourceRef, targetRef, categoryHint) {
            var sourceLower = sourceText.toLowerCase();
            var targetLower = targetText.toLowerCase();
            var mappedHint = this.normalizeCategoryHint(categoryHint);
            var lexicalSignal = this.calculateLexicalSignal(sourceText, targetText);
            var themes = this.extractThemes(sourceLower, targetLower);
            var tension = this.hasInterpretiveTension(sourceLower, targetLower);
            var overlap = this.calculateTextOverlap(sourceLower, targetLower);
            if (overlap > 0.7) {
                return {
                    category: 'quotation',
                    tier: 'primary',
                    score: 95,
                    explanation: 'Direct quotation or near-identical wording with strong textual overlap.',
                    themes: themes,
                    lexicalSignal: lexicalSignal,
                };
            }
            if (this.hasFulfillmentLanguage(targetText, sourceRef)) {
                return {
                    category: 'prophetic_fulfillment',
                    tier: 'primary',
                    score: 90,
                    explanation: 'This passage functions as an explicit prophetic fulfillment or promise realization.',
                    themes: themes,
                    lexicalSignal: lexicalSignal,
                };
            }
            if (lexicalSignal >= 0.65) {
                return {
                    category: 'lexical',
                    tier: 'primary',
                    score: 86,
                    explanation: 'Strong lexical continuity signal between the passages.',
                    themes: themes,
                    lexicalSignal: lexicalSignal,
                };
            }
            var thematicScore = this.calculateThematicSimilarity(sourceLower, targetLower);
            if (thematicScore > 0.6) {
                return {
                    category: mappedHint === 'narrative_continuation' ? 'narrative_continuation' : 'thematic',
                    tier: 'primary',
                    score: 75,
                    explanation: tension
                        ? 'Strong thematic overlap with interpretive tension that sharpens doctrinal balance.'
                        : 'Strong thematic connection around shared theological claims.',
                    themes: themes,
                    lexicalSignal: lexicalSignal,
                };
            }
            if (this.isTypological(sourceRef, targetRef)) {
                return {
                    category: 'typology',
                    tier: 'secondary',
                    score: 70,
                    explanation: 'Typological pattern (shadow-to-reality movement across covenants).',
                    themes: themes,
                    lexicalSignal: lexicalSignal,
                };
            }
            if (mappedHint) {
                return {
                    category: mappedHint,
                    tier: 'secondary',
                    score: 62,
                    explanation: 'Dataset-classified relationship with meaningful contextual support.',
                    themes: themes,
                    lexicalSignal: lexicalSignal,
                };
            }
            return {
                category: tension ? 'interpretive_tension' : 'thematic',
                tier: 'illustrative',
                score: 50,
                explanation: tension
                    ? 'Useful cross reference that introduces interpretive tension for preaching clarity.'
                    : 'General thematic connection that can serve as supporting illustration.',
                themes: themes,
                lexicalSignal: lexicalSignal,
            };
        };
        CrossReferenceRankingService_1.prototype.calculateTextOverlap = function (text1, text2) {
            var words1 = new Set(this.tokenize(text1));
            var words2 = new Set(this.tokenize(text2));
            var intersection = new Set(__spreadArray([], words1, true).filter(function (w) { return words2.has(w); }));
            var union = new Set(__spreadArray(__spreadArray([], words1, true), words2, true));
            return intersection.size / union.size;
        };
        CrossReferenceRankingService_1.prototype.calculateThematicSimilarity = function (text1, text2) {
            var theologicalTerms = [
                'faith', 'grace', 'salvation', 'righteousness', 'covenant', 'kingdom',
                'love', 'mercy', 'justice', 'holy', 'spirit', 'lord', 'god', 'christ',
                'sin', 'redemption', 'forgiveness', 'eternal', 'life', 'death', 'resurrection'
            ];
            var terms1 = theologicalTerms.filter(function (t) { return text1.includes(t); });
            var terms2 = theologicalTerms.filter(function (t) { return text2.includes(t); });
            if (terms1.length === 0 && terms2.length === 0)
                return 0;
            var commonTerms = terms1.filter(function (t) { return terms2.includes(t); });
            return commonTerms.length / Math.max(terms1.length, terms2.length);
        };
        CrossReferenceRankingService_1.prototype.extractThemes = function (sourceText, targetText) {
            var themeLexicon = {
                grace: ['grace', 'mercy', 'gift', 'favor'],
                faith: ['faith', 'believe', 'trust'],
                salvation: ['salvation', 'save', 'redeem', 'justif'],
                covenant: ['covenant', 'promise', 'testament'],
                spirit: ['spirit', 'holy spirit'],
                resurrection: ['resurrection', 'raised', 'rise'],
                new_creation: ['new', 'renew', 'transform'],
                kingdom: ['kingdom', 'reign', 'throne'],
            };
            var combined = "".concat(sourceText, " ").concat(targetText);
            return Object.entries(themeLexicon)
                .filter(function (_a) {
                var terms = _a[1];
                return terms.some(function (term) { return combined.includes(term); });
            })
                .map(function (_a) {
                var theme = _a[0];
                return theme;
            });
        };
        CrossReferenceRankingService_1.prototype.hasFulfillmentLanguage = function (text, sourceRef) {
            var fulfillmentPhrases = [
                'fulfill', 'fulfilled', 'spoken by', 'written', 'prophet',
                'that it might be fulfilled', 'as it is written', 'according to'
            ];
            var lowerText = text.toLowerCase();
            return fulfillmentPhrases.some(function (phrase) { return lowerText.includes(phrase); });
        };
        CrossReferenceRankingService_1.prototype.hasInterpretiveTension = function (sourceText, targetText) {
            var tensionPairs = [
                ['faith', 'works'],
                ['law', 'grace'],
                ['judgment', 'mercy'],
            ];
            return tensionPairs.some(function (_a) {
                var a = _a[0], b = _a[1];
                return (sourceText.includes(a) && targetText.includes(b)) ||
                    (sourceText.includes(b) && targetText.includes(a));
            });
        };
        CrossReferenceRankingService_1.prototype.normalizeCategoryHint = function (raw) {
            var normalized = String(raw || '').toLowerCase().trim();
            if (!normalized)
                return null;
            var map = {
                direct_quote: 'quotation',
                direct_quotation: 'quotation',
                thematic_parallel: 'thematic',
                thematic_echo: 'thematic',
                general_thematic: 'thematic',
                parallel_narrative: 'narrative_continuation',
                narrative_continuation: 'narrative_continuation',
                explicit_fulfillment: 'prophetic_fulfillment',
                prophetic_fulfillment: 'prophetic_fulfillment',
                typological: 'typology',
                typological_pattern: 'typology',
                interpretive_tension: 'interpretive_tension',
                lexical: 'lexical',
            };
            return map[normalized] || null;
        };
        CrossReferenceRankingService_1.prototype.calculateLexicalSignal = function (sourceText, targetText) {
            var sGreek = (sourceText.match(/[\u0370-\u03FF\u1F00-\u1FFF]+/g) || []).join(' ');
            var tGreek = (targetText.match(/[\u0370-\u03FF\u1F00-\u1FFF]+/g) || []).join(' ');
            var sHeb = (sourceText.match(/[\u0590-\u05FF]+/g) || []).join(' ');
            var tHeb = (targetText.match(/[\u0590-\u05FF]+/g) || []).join(' ');
            if (!sGreek && !tGreek && !sHeb && !tHeb)
                return 0;
            var sharedScriptTokens = this.calculateTextOverlap("".concat(sGreek, " ").concat(sHeb).toLowerCase(), "".concat(tGreek, " ").concat(tHeb).toLowerCase());
            return Math.max(0, Math.min(1, sharedScriptTokens));
        };
        CrossReferenceRankingService_1.prototype.isTypological = function (sourceRef, targetRef) {
            // Simple heuristic: OT reference -> NT reference
            var otBooks = [
                'gen', 'exod', 'lev', 'num', 'deut', 'josh', 'judg', 'ruth',
                '1sam', '2sam', '1kgs', '2kgs', '1chr', '2chr', 'ezra', 'neh',
                'esth', 'job', 'ps', 'prov', 'eccl', 'song', 'isa', 'jer',
                'lam', 'ezek', 'dan', 'hos', 'joel', 'amos', 'obad', 'jonah',
                'mic', 'nah', 'hab', 'zeph', 'hag', 'zech', 'mal'
            ];
            var ntBooks = [
                'matt', 'mark', 'luke', 'john', 'acts', 'rom', '1cor', '2cor',
                'gal', 'eph', 'phil', 'col', '1thess', '2thess', '1tim', '2tim',
                'titus', 'phlm', 'heb', 'jas', '1pet', '2pet', '1john', '2john',
                '3john', 'jude', 'rev'
            ];
            var sourceBook = sourceRef.toLowerCase().split(/\s+/)[0];
            var targetBook = targetRef.toLowerCase().split(/\s+/)[0];
            var sourceIsOT = otBooks.some(function (b) { return sourceBook.includes(b); });
            var targetIsNT = ntBooks.some(function (b) { return targetBook.includes(b); });
            return sourceIsOT && targetIsNT;
        };
        CrossReferenceRankingService_1.prototype.tokenize = function (text) {
            return text
                .replace(/[.,;:!?()[\]{}'"]/g, ' ')
                .split(/\s+/)
                .filter(function (w) { return w.length > 2; });
        };
        CrossReferenceRankingService_1.prototype.getPassageText = function (passage) {
            if (!Array.isArray(passage === null || passage === void 0 ? void 0 : passage.verses))
                return '';
            return passage.verses.map(function (v) { return String((v === null || v === void 0 ? void 0 : v.text) || ''); }).join(' ').trim();
        };
        CrossReferenceRankingService_1.prototype.generateFallbackReferences = function (verse, sourceText) {
            return __awaiter(this, void 0, void 0, function () {
                var terms, found, _i, terms_1, term, results, _a, results_1, item, reference, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            terms = this.extractFallbackTerms(sourceText).slice(0, 3);
                            found = [];
                            _i = 0, terms_1 = terms;
                            _c.label = 1;
                        case 1:
                            if (!(_i < terms_1.length)) return [3 /*break*/, 7];
                            term = terms_1[_i];
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.scriptureService.searchScripture(term, 'KJV')];
                        case 3:
                            results = _c.sent();
                            if (!Array.isArray(results))
                                return [3 /*break*/, 6];
                            for (_a = 0, results_1 = results; _a < results_1.length; _a++) {
                                item = results_1[_a];
                                reference = String((item === null || item === void 0 ? void 0 : item.reference) || '').trim();
                                if (!reference)
                                    continue;
                                if (reference.toLowerCase() === verse.toLowerCase())
                                    continue;
                                found.push(reference);
                                if (found.length >= 18)
                                    break;
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            _b = _c.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            if (found.length >= 18)
                                return [3 /*break*/, 7];
                            _c.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/, Array.from(new Set(found)).slice(0, 18)];
                    }
                });
            });
        };
        CrossReferenceRankingService_1.prototype.extractFallbackTerms = function (sourceText) {
            var text = String(sourceText || '').toLowerCase();
            var dictionary = [
                { term: 'grace', weight: text.includes('grace') ? 3 : 0 },
                { term: 'faith', weight: text.includes('faith') ? 3 : 0 },
                { term: 'salvation', weight: text.includes('salvation') ? 3 : 0 },
                { term: 'justification', weight: text.includes('justify') ? 3 : 0 },
                { term: 'mercy', weight: text.includes('mercy') ? 2 : 0 },
                { term: 'redemption', weight: text.includes('redeem') ? 2 : 0 },
                { term: 'covenant', weight: text.includes('covenant') ? 2 : 0 },
                { term: 'new life', weight: text.includes('new') && text.includes('life') ? 2 : 0 },
                { term: 'works', weight: text.includes('works') ? 2 : 0 },
                { term: 'christ', weight: text.includes('christ') ? 2 : 0 },
            ];
            var sorted = dictionary.sort(function (a, b) { return b.weight - a.weight; }).filter(function (item) { return item.weight > 0; });
            if (!sorted.length)
                return ['grace', 'faith', 'salvation'];
            return sorted.map(function (item) { return item.term; });
        };
        CrossReferenceRankingService_1.prototype.refineWithLlm = function (sourceVerse, sourceText, refs) {
            return __awaiter(this, void 0, void 0, function () {
                var candidates, prompt, response, parsed, byRef_1, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!refs.length)
                                return [2 /*return*/, refs];
                            candidates = refs.slice(0, 10).map(function (item) { return ({
                                reference: item.reference,
                                category: item.category,
                                tier: item.tier,
                                relevanceScore: Math.round(item.relevanceScore),
                                connectionExplanation: item.connectionExplanation,
                                themes: item.themes,
                            }); });
                            prompt = scripture_prompts_1.ScripturePrompts.crossReferenceRefine({
                                sourceVerse: sourceVerse,
                                sourceText: sourceText.slice(0, 800),
                                candidatesJson: JSON.stringify(candidates, null, 2),
                            });
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, 'system', {
                                    temperature: 0.2,
                                    maxTokens: 1400,
                                })];
                        case 2:
                            response = _b.sent();
                            parsed = this.parseJsonArray(response);
                            if (!Array.isArray(parsed) || parsed.length !== candidates.length) {
                                return [2 /*return*/, refs];
                            }
                            byRef_1 = new Map(parsed.map(function (item) { return [String(item.reference), item]; }));
                            return [2 /*return*/, refs.map(function (item) {
                                    var refined = byRef_1.get(item.reference);
                                    if (!refined)
                                        return item;
                                    var category = _this.normalizeCategoryHint(refined.category) || item.category;
                                    var tier = refined.tier === 'primary' || refined.tier === 'secondary' || refined.tier === 'illustrative'
                                        ? refined.tier
                                        : item.tier;
                                    var score = Number(refined.relevanceScore);
                                    return __assign(__assign({}, item), { category: category, tier: tier, relevanceScore: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : item.relevanceScore, connectionExplanation: String(refined.connectionExplanation || item.connectionExplanation), explanation: String(refined.connectionExplanation || item.connectionExplanation), themes: Array.isArray(refined.themes) ? refined.themes.map(function (t) { return String(t); }) : item.themes });
                                })];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, refs];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CrossReferenceRankingService_1.prototype.refineWithLlmWithTimeout = function (sourceVerse, sourceText, refs) {
            return __awaiter(this, void 0, void 0, function () {
                var timeoutMs, timeout, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!refs.length)
                                return [2 /*return*/, refs];
                            if (refs.length > 18)
                                return [2 /*return*/, refs];
                            timeoutMs = 6000;
                            timeout = new Promise(function (resolve) {
                                setTimeout(function () { return resolve(refs); }, timeoutMs);
                            });
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.race([
                                    this.refineWithLlm(sourceVerse, sourceText, refs),
                                    timeout,
                                ])];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, refs];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CrossReferenceRankingService_1.prototype.parseJsonArray = function (raw) {
            var payload = String(raw || '');
            var fenced = payload.match(/```(?:json)?\s*([\s\S]*?)```/i);
            var content = (fenced === null || fenced === void 0 ? void 0 : fenced[1]) || payload;
            var start = content.indexOf('[');
            var end = content.lastIndexOf(']');
            var json = start !== -1 && end !== -1 ? content.slice(start, end + 1) : content;
            try {
                return JSON.parse(json);
            }
            catch (_a) {
                return null;
            }
        };
        CrossReferenceRankingService_1.prototype.parseReferenceForEGW = function (reference) {
            var value = String(reference || '').trim().replace(/\u2013|\u2014/g, '-');
            if (!value)
                return null;
            var dotted = value.match(/^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)(?:-([1-3]?[A-Za-z]+)\.(\d+)\.(\d+))?$/);
            if (dotted) {
                var map = {
                    Gen: 'Genesis', Exod: 'Exodus', Lev: 'Leviticus', Num: 'Numbers', Deut: 'Deuteronomy',
                    Josh: 'Joshua', Judg: 'Judges', Ruth: 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
                    '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
                    Ezra: 'Ezra', Neh: 'Nehemiah', Esth: 'Esther', Job: 'Job', Ps: 'Psalms', Prov: 'Proverbs',
                    Eccl: 'Ecclesiastes', Song: 'Song of Solomon', Isa: 'Isaiah', Jer: 'Jeremiah', Lam: 'Lamentations',
                    Ezek: 'Ezekiel', Dan: 'Daniel', Hos: 'Hosea', Joel: 'Joel', Amos: 'Amos', Obad: 'Obadiah',
                    Jonah: 'Jonah', Mic: 'Micah', Nah: 'Nahum', Hab: 'Habakkuk', Zeph: 'Zephaniah', Hag: 'Haggai',
                    Zech: 'Zechariah', Mal: 'Malachi', Matt: 'Matthew', Mark: 'Mark', Luke: 'Luke', John: 'John',
                    Acts: 'Acts', Rom: 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians', Gal: 'Galatians',
                    Eph: 'Ephesians', Phil: 'Philippians', Col: 'Colossians', '1Thess': '1 Thessalonians',
                    '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy', Titus: 'Titus',
                    Phlm: 'Philemon', Heb: 'Hebrews', Jas: 'James', '1Pet': '1 Peter', '2Pet': '2 Peter',
                    '1John': '1 John', '2John': '2 John', '3John': '3 John', Jude: 'Jude', Rev: 'Revelation',
                };
                var book = map[dotted[1]] || dotted[1];
                var chapter = Number(dotted[2]);
                var verseStart = Number(dotted[3]);
                var verseEnd = dotted[6] ? Number(dotted[6]) : undefined;
                if (!Number.isFinite(chapter) || !Number.isFinite(verseStart))
                    return null;
                return { book: book, chapter: chapter, verseStart: verseStart, verseEnd: verseEnd };
            }
            var standard = value.match(/^(.*?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
            if (!standard)
                return null;
            return {
                book: standard[1].trim(),
                chapter: Number(standard[2]),
                verseStart: standard[3] ? Number(standard[3]) : undefined,
                verseEnd: standard[4] ? Number(standard[4]) : undefined,
            };
        };
        CrossReferenceRankingService_1.prototype.mapEGWReasonToCategory = function (reason) {
            switch (String(reason || '').toLowerCase()) {
                case 'exact_verse':
                    return 'quotation';
                case 'same_chapter':
                    return 'narrative_continuation';
                case 'doctrinal':
                    return 'interpretive_tension';
                default:
                    return 'thematic';
            }
        };
        CrossReferenceRankingService_1.prototype.mapEGWScoreToTier = function (score) {
            if (score >= 85)
                return 'primary';
            if (score >= 60)
                return 'secondary';
            return 'illustrative';
        };
        CrossReferenceRankingService_1.prototype.getTopCrossReferences = function (verse_1) {
            return __awaiter(this, arguments, void 0, function (verse, limit) {
                var ranked;
                if (limit === void 0) { limit = 3; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getRankedCrossReferences(verse)];
                        case 1:
                            ranked = _a.sent();
                            return [2 /*return*/, ranked.slice(0, limit)];
                    }
                });
            });
        };
        CrossReferenceRankingService_1.prototype.getCrossReferenceEdges = function (verse) {
            return __awaiter(this, void 0, void 0, function () {
                var ranked;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getRankedCrossReferences(verse)];
                        case 1:
                            ranked = _a.sent();
                            return [2 /*return*/, ranked.map(function (item) { return ({
                                    source: verse,
                                    target: item.reference,
                                    category: item.category,
                                    tier: item.tier,
                                    score: item.relevanceScore,
                                    sourceType: item.sourceType,
                                }); })];
                    }
                });
            });
        };
        CrossReferenceRankingService_1.prototype.getCrossReferencesByCategory = function (verse, category) {
            return __awaiter(this, void 0, void 0, function () {
                var ranked;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getRankedCrossReferences(verse)];
                        case 1:
                            ranked = _a.sent();
                            return [2 /*return*/, ranked.filter(function (ref) { return ref.category === category; })];
                    }
                });
            });
        };
        return CrossReferenceRankingService_1;
    }());
    __setFunctionName(_classThis, "CrossReferenceRankingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CrossReferenceRankingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CrossReferenceRankingService = _classThis;
}();
exports.CrossReferenceRankingService = CrossReferenceRankingService;
