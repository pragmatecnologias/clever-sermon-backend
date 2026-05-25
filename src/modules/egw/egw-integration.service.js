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
exports.EGWIntegrationService = void 0;
var common_1 = require("@nestjs/common");
var EGWIntegrationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EGWIntegrationService = _classThis = /** @class */ (function () {
        function EGWIntegrationService_1(egwService) {
            this.egwService = egwService;
        }
        /**
         * Get EGW suggestions for sermon outline points
         */
        EGWIntegrationService_1.prototype.getSermonssuggestions = function (mainPassage_1, theme_1, language_1) {
            return __awaiter(this, arguments, void 0, function (mainPassage, theme, language, limit) {
                var passageMatch, book, chapter, verseStart, insights, themeResults, allResults, uniqueRefs;
                if (limit === void 0) { limit = 3; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            passageMatch = mainPassage.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/);
                            if (!passageMatch)
                                return [2 /*return*/, []];
                            book = passageMatch[1].trim();
                            chapter = parseInt(passageMatch[2]);
                            verseStart = passageMatch[3] ? parseInt(passageMatch[3]) : undefined;
                            return [4 /*yield*/, this.egwService.getInsightsForPassage(book, chapter, verseStart, undefined, language, limit)];
                        case 1:
                            insights = _a.sent();
                            return [4 /*yield*/, this.egwService.searchByTopic(theme, limit)];
                        case 2:
                            themeResults = _a.sent();
                            allResults = __spreadArray(__spreadArray([], insights, true), themeResults.slice(0, limit), true);
                            uniqueRefs = new Map();
                            allResults.forEach(function (result) {
                                var ref = 'reference' in result ? result.reference : (result.paragraph ? result.paragraph.reference : null);
                                if (ref && !uniqueRefs.has(ref)) {
                                    uniqueRefs.set(ref, result);
                                }
                            });
                            return [2 /*return*/, Array.from(uniqueRefs.values()).slice(0, limit).map(function (result) {
                                    var _a;
                                    var para = 'paragraph' in result ? result.paragraph : result;
                                    var excerpt = 'excerpt' in result ? result.excerpt :
                                        (((_a = para.content) === null || _a === void 0 ? void 0 : _a.length) > 150 ? para.content.substring(0, 150) + '...' : para.content);
                                    return {
                                        reference: para.reference || result.reference,
                                        bookTitle: para.bookTitle || result.bookTitle,
                                        quote: excerpt,
                                        relevance: 'Relates to main passage and theme',
                                        citationFormat: "\"".concat(excerpt, "\" \u2014 ").concat(para.bookTitle, ", ").concat(para.reference || result.reference)
                                    };
                                })];
                    }
                });
            });
        };
        /**
         * Get EGW perspective on interpretive challenges
         */
        EGWIntegrationService_1.prototype.getInterpretivePerspective = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var passageMatch, book, chapter, verseStart, insights, isSpanish, passageLabel, quotes, perspective;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            passageMatch = passage.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/);
                            if (!passageMatch) {
                                return [2 /*return*/, {
                                        passage: passage,
                                        hasCommentary: false
                                    }];
                            }
                            book = passageMatch[1].trim();
                            chapter = parseInt(passageMatch[2]);
                            verseStart = passageMatch[3] ? parseInt(passageMatch[3]) : undefined;
                            return [4 /*yield*/, this.egwService.getInsightsForPassage(book, chapter, verseStart, undefined, language, 3)];
                        case 1:
                            insights = _a.sent();
                            if (insights.length === 0) {
                                isSpanish = String(language || '').toLowerCase().startsWith('es');
                                passageLabel = verseStart ? "".concat(book, " ").concat(chapter, ":").concat(verseStart) : "".concat(book, " ").concat(chapter);
                                return [2 /*return*/, {
                                        passage: passage,
                                        hasCommentary: true,
                                        perspective: isSpanish
                                            ? "No se encontr\u00F3 una cita directa para ".concat(passageLabel, " en la biblioteca cargada. Aun as\u00ED, la lectura adventista mantiene a Cristo al centro, usa el texto b\u00EDblico como autoridad principal y aplica el mensaje a la vida y la obediencia diaria.")
                                            : "No direct citation was found for ".concat(passageLabel, " in the loaded library. Even so, the Adventist reading keeps Christ at the center, uses the Bible as the primary authority, and applies the message to daily life and obedience."),
                                        references: ['General EGW counsel'],
                                        quotes: [],
                                    }];
                            }
                            quotes = insights.map(function (insight) { return ({
                                reference: insight.reference,
                                text: insight.excerpt
                            }); });
                            perspective = insights.map(function (insight, idx) {
                                return "".concat(idx + 1, ". ").concat(insight.bookTitle, " (").concat(insight.reference, "):\n\"").concat(insight.excerpt, "\"");
                            }).join('\n\n');
                            return [2 /*return*/, {
                                    passage: passage,
                                    hasCommentary: true,
                                    perspective: perspective,
                                    references: insights.map(function (i) { return i.reference; }),
                                    quotes: quotes
                                }];
                    }
                });
            });
        };
        /**
         * Get SDA-themed smart boosts for specific topics
         */
        EGWIntegrationService_1.prototype.getSDASmartBoosts = function (topic, language) {
            return __awaiter(this, void 0, void 0, function () {
                var topicKeywords, lowerTopic, searchTerms, _i, _a, _b, key, keywords, allResults, _c, _d, term, results, uniqueRefs;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            topicKeywords = {
                                'daniel': ['Daniel', 'prophecy', 'vision', 'interpretation', 'kingdom'],
                                'revelation': ['Revelation', 'apocalypse', 'seven churches', 'beast', 'seal', 'trumpet'],
                                'sanctuary': ['sanctuary', 'tabernacle', 'holy place', 'most holy', 'priest', 'sacrifice'],
                                'sabbath': ['Sabbath', 'seventh day', 'rest', 'holy day', 'commandment'],
                                'state of the dead': ['death', 'resurrection', 'sleep', 'grave', 'immortality'],
                                'hebrews': ['Hebrews', 'high priest', 'covenant', 'sanctuary', 'better']
                            };
                            lowerTopic = topic.toLowerCase();
                            searchTerms = [topic];
                            // Find matching topic keywords
                            for (_i = 0, _a = Object.entries(topicKeywords); _i < _a.length; _i++) {
                                _b = _a[_i], key = _b[0], keywords = _b[1];
                                if (lowerTopic.includes(key)) {
                                    searchTerms = keywords;
                                    break;
                                }
                            }
                            allResults = [];
                            _c = 0, _d = searchTerms.slice(0, 3);
                            _e.label = 1;
                        case 1:
                            if (!(_c < _d.length)) return [3 /*break*/, 4];
                            term = _d[_c];
                            return [4 /*yield*/, this.egwService.searchContent(term, 5, language)];
                        case 2:
                            results = _e.sent();
                            allResults.push.apply(allResults, results);
                            _e.label = 3;
                        case 3:
                            _c++;
                            return [3 /*break*/, 1];
                        case 4:
                            uniqueRefs = new Map();
                            allResults
                                .sort(function (a, b) { return b.relevance - a.relevance; })
                                .forEach(function (result) {
                                if (!uniqueRefs.has(result.reference)) {
                                    uniqueRefs.set(result.reference, result);
                                }
                            });
                            return [2 /*return*/, Array.from(uniqueRefs.values()).slice(0, 5).map(function (result) { return ({
                                    reference: result.reference,
                                    bookTitle: result.bookTitle,
                                    quote: result.content.length > 200 ? result.content.substring(0, 200) + '...' : result.content,
                                    relevance: "Highly relevant to ".concat(topic),
                                    citationFormat: "\"".concat(result.content.substring(0, 100), "...\" \u2014 ").concat(result.bookTitle, ", ").concat(result.reference)
                                }); })];
                    }
                });
            });
        };
        /**
         * Format EGW suggestions for sermon outline
         */
        EGWIntegrationService_1.prototype.formatForOutline = function (suggestions) {
            if (suggestions.length === 0)
                return '';
            var formatted = '\n\n## 🕊 Spirit of Prophecy References\n\n';
            formatted += '*Consider incorporating these insights:*\n\n';
            suggestions.forEach(function (suggestion, idx) {
                formatted += "".concat(idx + 1, ". **").concat(suggestion.bookTitle, "** (").concat(suggestion.reference, ")\n");
                formatted += "   > \"".concat(suggestion.quote, "\"\n\n");
            });
            formatted += '*Note: Use exact quotes. Never paraphrase without attribution.*\n';
            return formatted;
        };
        /**
         * Format EGW perspective for interpretive challenges
         */
        EGWIntegrationService_1.prototype.formatInterpretivePerspective = function (perspective) {
            if (!perspective.hasCommentary) {
                return '\n\n**Spirit of Prophecy Perspective**: No direct commentary found for this passage.\n';
            }
            var formatted = '\n\n## 🕊 Spirit of Prophecy Perspective\n\n';
            formatted += perspective.perspective + '\n';
            return formatted;
        };
        return EGWIntegrationService_1;
    }());
    __setFunctionName(_classThis, "EGWIntegrationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWIntegrationService = _classThis;
}();
exports.EGWIntegrationService = EGWIntegrationService;
