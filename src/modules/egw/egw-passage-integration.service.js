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
exports.EGWPassageIntegrationService = void 0;
var common_1 = require("@nestjs/common");
var EGWPassageIntegrationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EGWPassageIntegrationService = _classThis = /** @class */ (function () {
        function EGWPassageIntegrationService_1(paragraphRepository, scriptureRefRepository) {
            this.paragraphRepository = paragraphRepository;
            this.scriptureRefRepository = scriptureRefRepository;
            this.spanishBookKeyMap = new Map([
                ['genesis', 'genesis'], ['exodo', 'exodus'], ['levitico', 'leviticus'], ['numeros', 'numbers'], ['deuteronomio', 'deuteronomy'],
                ['josue', 'joshua'], ['jueces', 'judges'], ['rut', 'ruth'], ['1samuel', '1samuel'], ['2samuel', '2samuel'],
                ['1reyes', '1kings'], ['2reyes', '2kings'], ['1cronicas', '1chronicles'], ['2cronicas', '2chronicles'], ['esdras', 'ezra'],
                ['nehemias', 'nehemiah'], ['ester', 'esther'], ['job', 'job'], ['salmos', 'psalms'], ['proverbios', 'proverbs'],
                ['eclesiastes', 'ecclesiastes'], ['cantares', 'songofsolomon'], ['isaias', 'isaiah'], ['jeremias', 'jeremiah'], ['lamentaciones', 'lamentations'],
                ['ezequiel', 'ezekiel'], ['daniel', 'daniel'], ['oseas', 'hosea'], ['joel', 'joel'], ['amos', 'amos'],
                ['abdias', 'obadiah'], ['jonas', 'jonah'], ['miqueas', 'micah'], ['nahum', 'nahum'], ['habacuc', 'habakkuk'],
                ['sofonias', 'zephaniah'], ['hageo', 'haggai'], ['zacarias', 'zechariah'], ['malaquias', 'malachi'], ['mateo', 'matthew'],
                ['marcos', 'mark'], ['lucas', 'luke'], ['juan', 'john'], ['hechos', 'acts'], ['romanos', 'romans'],
                ['1corintios', '1corinthians'], ['2corintios', '2corinthians'], ['galatas', 'galatians'], ['efesios', 'ephesians'], ['filipenses', 'philippians'],
                ['colosenses', 'colossians'], ['1tesalonicenses', '1thessalonians'], ['2tesalonicenses', '2thessalonians'], ['1timoteo', '1timothy'], ['2timoteo', '2timothy'],
                ['tito', 'titus'], ['filemon', 'philemon'], ['hebreos', 'hebrews'], ['santiago', 'james'], ['1pedro', '1peter'],
                ['2pedro', '2peter'], ['1juan', '1john'], ['2juan', '2john'], ['3juan', '3john'], ['judas', 'jude'], ['apocalipsis', 'revelation'],
            ]);
        }
        /**
         * Get EGW insights for a Bible passage with intelligent ranking
         * This is the PRIMARY integration point for passage-level study
         */
        EGWPassageIntegrationService_1.prototype.getPassageInsights = function (book_1, chapter_1, verseStart_1, verseEnd_1) {
            return __awaiter(this, arguments, void 0, function (book, chapter, verseStart, verseEnd, language, limit) {
                var passage, collectRankedInsights, sortedInsights, bookLevelMatches, bookLevelEnglish, error_1, fallbackInsights, fallbackError_1;
                var _this = this;
                if (language === void 0) { language = 'en'; }
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 9, , 14]);
                            passage = this.formatPassageReference(book, chapter, verseStart, verseEnd);
                            collectRankedInsights = function (lang) { return __awaiter(_this, void 0, void 0, function () {
                                var exactMatches, chapterMatches, thematicMatches, allInsights;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.findExactVerseCitations(book, chapter, verseStart, verseEnd, lang)];
                                        case 1:
                                            exactMatches = _a.sent();
                                            return [4 /*yield*/, this.findChapterCitations(book, chapter, lang)];
                                        case 2:
                                            chapterMatches = _a.sent();
                                            return [4 /*yield*/, this.findThematicMatches(book, chapter, lang)];
                                        case 3:
                                            thematicMatches = _a.sent();
                                            allInsights = __spreadArray(__spreadArray(__spreadArray([], this.rankInsights(exactMatches, 'exact_verse', 100), true), this.rankInsights(chapterMatches, 'same_chapter', 75), true), this.rankInsights(thematicMatches, 'thematic', 50), true);
                                            return [2 /*return*/, this.deduplicateByParagraph(allInsights).sort(function (a, b) { return b.rankingScore - a.rankingScore; })];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, collectRankedInsights(language)];
                        case 1:
                            sortedInsights = _a.sent();
                            if (!(sortedInsights.length === 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.findBookCitations(book, language)];
                        case 2:
                            bookLevelMatches = _a.sent();
                            sortedInsights = this
                                .deduplicateByParagraph(this.rankInsights(bookLevelMatches, 'thematic', 40))
                                .sort(function (a, b) { return b.rankingScore - a.rankingScore; });
                            _a.label = 3;
                        case 3:
                            if (!(sortedInsights.length === 0 && language !== 'en')) return [3 /*break*/, 6];
                            return [4 /*yield*/, collectRankedInsights('en')];
                        case 4:
                            sortedInsights = _a.sent();
                            if (!(sortedInsights.length === 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.findBookCitations(book, 'en')];
                        case 5:
                            bookLevelEnglish = _a.sent();
                            sortedInsights = this
                                .deduplicateByParagraph(this.rankInsights(bookLevelEnglish, 'thematic', 40))
                                .sort(function (a, b) { return b.rankingScore - a.rankingScore; });
                            _a.label = 6;
                        case 6:
                            if (!(sortedInsights.length === 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.findGeneralFallbackInsights(language, limit)];
                        case 7:
                            sortedInsights = _a.sent();
                            _a.label = 8;
                        case 8: return [2 /*return*/, {
                                passage: passage,
                                insights: sortedInsights.slice(0, limit),
                                totalAvailable: sortedInsights.length,
                                hasMore: sortedInsights.length > limit
                            }];
                        case 9:
                            error_1 = _a.sent();
                            console.warn("EGW passage panel unavailable for ".concat(book, " ").concat(chapter, ": ").concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            _a.label = 10;
                        case 10:
                            _a.trys.push([10, 12, , 13]);
                            return [4 /*yield*/, this.findGeneralFallbackInsights(language, limit)];
                        case 11:
                            fallbackInsights = _a.sent();
                            return [2 /*return*/, {
                                    passage: this.formatPassageReference(book, chapter, verseStart, verseEnd),
                                    insights: fallbackInsights.slice(0, limit),
                                    totalAvailable: fallbackInsights.length,
                                    hasMore: fallbackInsights.length > limit,
                                }];
                        case 12:
                            fallbackError_1 = _a.sent();
                            console.warn("EGW general fallback unavailable for ".concat(book, " ").concat(chapter, ": ").concat((fallbackError_1 === null || fallbackError_1 === void 0 ? void 0 : fallbackError_1.message) || 'unknown error'));
                            return [3 /*break*/, 13];
                        case 13: return [2 /*return*/, {
                                passage: this.formatPassageReference(book, chapter, verseStart, verseEnd),
                                insights: [],
                                totalAvailable: 0,
                                hasMore: false,
                            }];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        EGWPassageIntegrationService_1.prototype.normalizeBookKey = function (book) {
            return (book || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '');
        };
        EGWPassageIntegrationService_1.prototype.resolveBookAliases = function (book) {
            var raw = (book || '').trim().toLowerCase();
            var key = this.normalizeBookKey(book);
            var canonical = this.spanishBookKeyMap.get(key) || key;
            var variants = new Set([raw, key, canonical]);
            var addSpacingVariant = function (value) {
                if (/^[123][a-z]/.test(value)) {
                    variants.add("".concat(value[0], " ").concat(value.slice(1)));
                }
            };
            addSpacingVariant(key);
            addSpacingVariant(canonical);
            if (canonical === 'songofsolomon') {
                variants.add('song of solomon');
                variants.add('song of songs');
            }
            return Array.from(variants).filter(Boolean);
        };
        EGWPassageIntegrationService_1.prototype.findBookCitations = function (book_1) {
            return __awaiter(this, arguments, void 0, function (book, language) {
                var bookAliases;
                if (language === void 0) { language = 'en'; }
                return __generator(this, function (_a) {
                    bookAliases = this.resolveBookAliases(book);
                    return [2 /*return*/, this.scriptureRefRepository
                            .createQueryBuilder('ref')
                            .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
                            .where('LOWER(ref.book) IN (:...bookAliases)', { bookAliases: bookAliases })
                            .andWhere('ref.language = :language', { language: language })
                            .orderBy('ref.chapter', 'ASC')
                            .addOrderBy('ref.verseStart', 'ASC')
                            .take(25)
                            .getMany()];
                });
            });
        };
        EGWPassageIntegrationService_1.prototype.findGeneralFallbackInsights = function (language, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var paragraphs, error_2, isSpanish, generalReference, fallbackContent;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            paragraphs = [];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.paragraphRepository
                                    .createQueryBuilder('p')
                                    .where('p.language = :language', { language: language })
                                    .take(limit)
                                    .getMany()];
                        case 2:
                            paragraphs = _a.sent();
                            if (!(!paragraphs.length && language !== 'en')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.paragraphRepository
                                    .createQueryBuilder('p')
                                    .where('p.language = :language', { language: 'en' })
                                    .take(limit)
                                    .getMany()];
                        case 3:
                            paragraphs = _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            console.warn("EGW fallback paragraph lookup unavailable for ".concat(language, ": ").concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'unknown error'));
                            paragraphs = [];
                            return [3 /*break*/, 6];
                        case 6:
                            if (!paragraphs.length) {
                                isSpanish = String(language || '').toLowerCase().startsWith('es');
                                generalReference = isSpanish ? 'Consejo general del Espíritu de Profecía' : 'General Spirit of Prophecy counsel';
                                fallbackContent = isSpanish
                                    ? 'No se encontró una cita directa para este pasaje en la biblioteca cargada. Use este resumen general del Espíritu de Profecía: mantenga la Escritura en el centro, presente a Cristo como el foco del mensaje, y conduzca a la congregación a una respuesta de fe concreta. No reduzca el pasaje a una línea; exponga su peso devocional, doctrinal y pastoral.'
                                    : 'No direct citation was found for this passage in the loaded library. Use this general Spirit of Prophecy counsel: keep Scripture at the center, present Christ as the focus of the message, and lead the congregation toward a concrete response of faith. Do not shrink the passage into a single line; preach its devotional, doctrinal, and pastoral weight.';
                                return [2 /*return*/, [
                                        {
                                            paragraphId: "fallback-general-1-".concat(language),
                                            bookCode: 'general',
                                            bookTitle: isSpanish ? 'Consejo general' : 'General counsel',
                                            chapterTitle: isSpanish ? 'Resumen pastoral' : 'Pastoral summary',
                                            reference: generalReference,
                                            content: fallbackContent,
                                            preview: fallbackContent,
                                            scriptureReference: 'General EGW insight',
                                            rankingScore: 20,
                                            rankingReason: 'doctrinal',
                                        },
                                        {
                                            paragraphId: "fallback-general-2-".concat(language),
                                            bookCode: 'general',
                                            bookTitle: isSpanish ? 'Consejo general' : 'General counsel',
                                            chapterTitle: isSpanish ? 'Aplicación práctica' : 'Practical application',
                                            reference: generalReference,
                                            content: isSpanish
                                                ? 'Predique la gracia de Dios con claridad, pero no deje fuera el llamado a la obediencia. La verdad bíblica debe llegar al corazón y a la vida diaria, no quedarse como dato religioso.'
                                                : 'Preach God’s grace clearly, but do not leave out the call to obedience. Biblical truth should reach the heart and daily life, not remain as a religious data point.',
                                            preview: isSpanish
                                                ? 'Predique la gracia de Dios con claridad, pero no deje fuera el llamado a la obediencia.'
                                                : 'Preach God’s grace clearly, but do not leave out the call to obedience.',
                                            scriptureReference: 'General EGW insight',
                                            rankingScore: 19,
                                            rankingReason: 'thematic',
                                        },
                                        {
                                            paragraphId: "fallback-general-3-".concat(language),
                                            bookCode: 'general',
                                            bookTitle: isSpanish ? 'Consejo general' : 'General counsel',
                                            chapterTitle: isSpanish ? 'Centro en Cristo' : 'Christ-centered center',
                                            reference: generalReference,
                                            content: isSpanish
                                                ? 'Toda aplicación de Spirit of Prophecy debe mantenerse secundaria respecto a la Escritura. Sirve para reforzar el punto bíblico, no para reemplazarlo ni volverlo sensacionalista.'
                                                : 'Every Spirit of Prophecy application must remain secondary to Scripture. It should reinforce the biblical point, not replace it or turn it sensational.',
                                            preview: isSpanish
                                                ? 'Toda aplicación de Spirit of Prophecy debe mantenerse secundaria respecto a la Escritura.'
                                                : 'Every Spirit of Prophecy application must remain secondary to Scripture.',
                                            scriptureReference: 'General EGW insight',
                                            rankingScore: 18,
                                            rankingReason: 'doctrinal',
                                        },
                                    ].slice(0, limit)];
                            }
                            return [2 /*return*/, paragraphs.map(function (p, index) { return ({
                                    paragraphId: p.id,
                                    bookCode: p.bookCode,
                                    bookTitle: p.bookTitle,
                                    chapterTitle: p.chapterTitle,
                                    reference: p.reference,
                                    content: p.content,
                                    preview: _this.createPreview(p.content),
                                    scriptureReference: 'General EGW insight',
                                    rankingScore: 20 - index,
                                    rankingReason: 'doctrinal',
                                }); })];
                    }
                });
            });
        };
        /**
         * Find exact verse citations (Priority 1)
         */
        EGWPassageIntegrationService_1.prototype.findExactVerseCitations = function (book_1, chapter_1, verseStart_1, verseEnd_1) {
            return __awaiter(this, arguments, void 0, function (book, chapter, verseStart, verseEnd, language) {
                var bookAliases, query, end;
                if (language === void 0) { language = 'en'; }
                return __generator(this, function (_a) {
                    bookAliases = this.resolveBookAliases(book);
                    query = this.scriptureRefRepository
                        .createQueryBuilder('ref')
                        .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
                        .where('LOWER(ref.book) IN (:...bookAliases)', { bookAliases: bookAliases })
                        .andWhere('ref.chapter = :chapter', { chapter: chapter })
                        .andWhere('ref.language = :language', { language: language });
                    if (verseStart !== undefined) {
                        end = verseEnd || verseStart;
                        query.andWhere('(ref.verseStart <= :end AND (ref.verseEnd >= :start OR ref.verseEnd IS NULL))', { start: verseStart, end: end });
                    }
                    return [2 /*return*/, query
                            .orderBy('ref.verseStart', 'ASC')
                            .take(20)
                            .getMany()];
                });
            });
        };
        /**
         * Find same chapter citations (Priority 2)
         */
        EGWPassageIntegrationService_1.prototype.findChapterCitations = function (book_1, chapter_1) {
            return __awaiter(this, arguments, void 0, function (book, chapter, language) {
                var bookAliases;
                if (language === void 0) { language = 'en'; }
                return __generator(this, function (_a) {
                    bookAliases = this.resolveBookAliases(book);
                    return [2 /*return*/, this.scriptureRefRepository
                            .createQueryBuilder('ref')
                            .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
                            .where('LOWER(ref.book) IN (:...bookAliases)', { bookAliases: bookAliases })
                            .andWhere('ref.chapter = :chapter', { chapter: chapter })
                            .andWhere('ref.language = :language', { language: language })
                            .orderBy('ref.verseStart', 'ASC')
                            .take(15)
                            .getMany()];
                });
            });
        };
        /**
         * Find thematic matches (Priority 3)
         * Based on book name appearing in paragraph content
         */
        EGWPassageIntegrationService_1.prototype.findThematicMatches = function (book_1, chapter_1) {
            return __awaiter(this, arguments, void 0, function (book, chapter, language) {
                var bookAliases, paragraphs, paragraphIds;
                if (language === void 0) { language = 'en'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            bookAliases = this.resolveBookAliases(book);
                            return [4 /*yield*/, this.paragraphRepository
                                    .createQueryBuilder('p')
                                    .where('LOWER(p.content) LIKE LOWER(:bookPattern)', {
                                    bookPattern: "%".concat(book, "%")
                                })
                                    .andWhere('p.language = :language', { language: language })
                                    .take(10)
                                    .getMany()];
                        case 1:
                            paragraphs = _a.sent();
                            // Get scripture references for these paragraphs
                            if (paragraphs.length === 0)
                                return [2 /*return*/, []];
                            paragraphIds = paragraphs.map(function (p) { return p.id; });
                            return [2 /*return*/, this.scriptureRefRepository
                                    .createQueryBuilder('ref')
                                    .leftJoinAndSelect('ref.egwParagraph', 'paragraph')
                                    .where('ref.egwParagraphId IN (:...ids)', { ids: paragraphIds })
                                    .andWhere('LOWER(ref.book) IN (:...bookAliases)', { bookAliases: bookAliases })
                                    .andWhere('ref.language = :language', { language: language })
                                    .take(10)
                                    .getMany()];
                    }
                });
            });
        };
        /**
         * Rank insights with score and reason
         */
        EGWPassageIntegrationService_1.prototype.rankInsights = function (references, reason, baseScore) {
            var _this = this;
            return references
                .filter(function (ref) { return ref.egwParagraph; }) // Ensure paragraph is loaded
                .map(function (ref, index) {
                var paragraph = ref.egwParagraph;
                var score = baseScore - (index * 2); // Slight decay for ordering
                return {
                    paragraphId: paragraph.id,
                    bookCode: paragraph.bookCode,
                    bookTitle: paragraph.bookTitle,
                    chapterTitle: paragraph.chapterTitle,
                    reference: paragraph.reference,
                    content: paragraph.content, // Full text preserved verbatim
                    preview: _this.createPreview(paragraph.content),
                    scriptureReference: ref.reference,
                    rankingScore: score,
                    rankingReason: reason
                };
            });
        };
        /**
         * Create 2-4 line preview (approximately 150-200 characters)
         */
        EGWPassageIntegrationService_1.prototype.createPreview = function (content) {
            if (content.length <= 200)
                return content;
            // Find natural break point (sentence end) near 200 chars
            var truncated = content.substring(0, 200);
            var lastPeriod = truncated.lastIndexOf('.');
            var lastQuestion = truncated.lastIndexOf('?');
            var lastExclamation = truncated.lastIndexOf('!');
            var breakPoint = Math.max(lastPeriod, lastQuestion, lastExclamation);
            if (breakPoint > 100) {
                return content.substring(0, breakPoint + 1);
            }
            return truncated + '...';
        };
        /**
         * Deduplicate insights by paragraph ID
         */
        EGWPassageIntegrationService_1.prototype.deduplicateByParagraph = function (insights) {
            var seen = new Set();
            return insights.filter(function (insight) {
                if (seen.has(insight.paragraphId))
                    return false;
                seen.add(insight.paragraphId);
                return true;
            });
        };
        /**
         * Format passage reference for display
         */
        EGWPassageIntegrationService_1.prototype.formatPassageReference = function (book, chapter, verseStart, verseEnd) {
            var ref = "".concat(book, " ").concat(chapter);
            if (verseStart !== undefined) {
                ref += ":".concat(verseStart);
                if (verseEnd !== undefined && verseEnd !== verseStart) {
                    ref += "-".concat(verseEnd);
                }
            }
            return ref;
        };
        /**
         * Get SDA Smart Boost for key doctrinal passages
         * Automatically surfaces frequently cited EGW passages for specific doctrinal areas
         */
        EGWPassageIntegrationService_1.prototype.getSDASmartBoost = function (passage) {
            return __awaiter(this, void 0, void 0, function () {
                var doctrinalPatterns, _i, doctrinalPatterns_1, _a, pattern, theme, insights, error_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, , 6]);
                            doctrinalPatterns = [
                                { pattern: /daniel\s+[2789]/i, theme: 'Prophecy - Daniel' },
                                { pattern: /revelation\s+[1-14]/i, theme: 'Prophecy - Revelation' },
                                { pattern: /hebrews\s+[89]/i, theme: 'Sanctuary - Heavenly Ministry' },
                                { pattern: /exodus\s+20/i, theme: 'Law - Ten Commandments' },
                                { pattern: /genesis\s+[12]/i, theme: 'Creation - Sabbath' },
                                { pattern: /ecclesiastes\s+[912]/i, theme: 'State of the Dead' },
                                { pattern: /malachi\s+[34]/i, theme: 'Final Judgment' }
                            ];
                            _i = 0, doctrinalPatterns_1 = doctrinalPatterns;
                            _b.label = 1;
                        case 1:
                            if (!(_i < doctrinalPatterns_1.length)) return [3 /*break*/, 4];
                            _a = doctrinalPatterns_1[_i], pattern = _a.pattern, theme = _a.theme;
                            if (!pattern.test(passage)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getFrequentlyCitedForTheme(theme)];
                        case 2:
                            insights = _b.sent();
                            return [2 /*return*/, {
                                    isDoctrinalPassage: true,
                                    theme: theme,
                                    frequentlyCited: insights.slice(0, 5)
                                }];
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, { isDoctrinalPassage: false }];
                        case 5:
                            error_3 = _b.sent();
                            console.warn("EGW SDA smart boost unavailable for ".concat(passage, ": ").concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'unknown error'));
                            return [2 /*return*/, { isDoctrinalPassage: false }];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get frequently cited EGW passages for a doctrinal theme
         */
        EGWPassageIntegrationService_1.prototype.getFrequentlyCitedForTheme = function (theme) {
            return __awaiter(this, void 0, void 0, function () {
                var themeKeywords, keywords, allResults, _i, _a, keyword, paragraphs;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            themeKeywords = {
                                'Prophecy - Daniel': ['Daniel', 'prophecy', 'vision', 'interpretation'],
                                'Prophecy - Revelation': ['Revelation', 'apocalypse', 'seven churches', 'beast'],
                                'Sanctuary - Heavenly Ministry': ['sanctuary', 'most holy', 'high priest', 'intercession'],
                                'Law - Ten Commandments': ['commandments', 'law', 'Sabbath', 'moral law'],
                                'Creation - Sabbath': ['creation', 'Sabbath', 'seventh day', 'rest'],
                                'State of the Dead': ['death', 'resurrection', 'sleep', 'unconscious'],
                                'Final Judgment': ['judgment', 'investigative', 'cleansing', 'sanctuary']
                            };
                            keywords = themeKeywords[theme] || [theme];
                            allResults = [];
                            _i = 0, _a = keywords.slice(0, 2);
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            keyword = _a[_i];
                            return [4 /*yield*/, this.paragraphRepository
                                    .createQueryBuilder('p')
                                    .where('LOWER(p.content) LIKE LOWER(:keyword)', {
                                    keyword: "%".concat(keyword, "%")
                                })
                                    .take(5)
                                    .getMany()];
                        case 2:
                            paragraphs = _b.sent();
                            paragraphs.forEach(function (p) {
                                allResults.push({
                                    paragraphId: p.id,
                                    bookCode: p.bookCode,
                                    bookTitle: p.bookTitle,
                                    chapterTitle: p.chapterTitle,
                                    reference: p.reference,
                                    content: p.content,
                                    preview: _this.createPreview(p.content),
                                    scriptureReference: theme,
                                    rankingScore: 90,
                                    rankingReason: 'doctrinal'
                                });
                            });
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, this.deduplicateByParagraph(allResults)];
                    }
                });
            });
        };
        return EGWPassageIntegrationService_1;
    }());
    __setFunctionName(_classThis, "EGWPassageIntegrationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWPassageIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWPassageIntegrationService = _classThis;
}();
exports.EGWPassageIntegrationService = EGWPassageIntegrationService;
