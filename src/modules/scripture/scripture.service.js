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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptureService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var path_1 = require("path");
var fs_1 = require("fs");
var scripture_helpers_1 = require("./scripture-helpers");
var scripture_prompts_1 = require("./scripture-prompts");
var ScriptureService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ScriptureService = _classThis = /** @class */ (function () {
        function ScriptureService_1(configService, translationRepository, llmService, cacheService) {
            this.configService = configService;
            this.translationRepository = translationRepository;
            this.llmService = llmService;
            this.cacheService = cacheService;
            this.crossReferenceIndex = null;
            this.wordStudyIndex = null;
            this.wordOccurrenceIndex = null;
            this.crossReferenceCategoryIndex = null;
            this.bookMetadataIndex = null;
            this.historicalContextIndex = null;
            this.culturalContextIndex = null;
            this.timelineIndex = null;
            this.geographyIndex = null;
            this.spanishBookKeyMap = new Map([
                ['genesis', 'genesis'],
                ['exodo', 'exodus'],
                ['levitico', 'leviticus'],
                ['numeros', 'numbers'],
                ['deuteronomio', 'deuteronomy'],
                ['josue', 'joshua'],
                ['jueces', 'judges'],
                ['rut', 'ruth'],
                ['1samuel', '1samuel'],
                ['2samuel', '2samuel'],
                ['1reyes', '1kings'],
                ['2reyes', '2kings'],
                ['1cronicas', '1chronicles'],
                ['2cronicas', '2chronicles'],
                ['esdras', 'ezra'],
                ['nehemias', 'nehemiah'],
                ['ester', 'esther'],
                ['job', 'job'],
                ['salmos', 'psalms'],
                ['proverbios', 'proverbs'],
                ['eclesiastes', 'ecclesiastes'],
                ['cantares', 'songofsolomon'],
                ['isaias', 'isaiah'],
                ['jeremias', 'jeremiah'],
                ['lamentaciones', 'lamentations'],
                ['ezequiel', 'ezekiel'],
                ['daniel', 'daniel'],
                ['oseas', 'hosea'],
                ['abdias', 'obadiah'],
                ['jonas', 'jonah'],
                ['miqueas', 'micah'],
                ['habacuc', 'habakkuk'],
                ['sofonias', 'zephaniah'],
                ['hageo', 'haggai'],
                ['zacarias', 'zechariah'],
                ['malaquias', 'malachi'],
                ['mateo', 'matthew'],
                ['marcos', 'mark'],
                ['lucas', 'luke'],
                ['juan', 'john'],
                ['hechos', 'acts'],
                ['romanos', 'romans'],
                ['1corintios', '1corinthians'],
                ['2corintios', '2corinthians'],
                ['galatas', 'galatians'],
                ['efesios', 'ephesians'],
                ['filipenses', 'philippians'],
                ['colosenses', 'colossians'],
                ['1tesalonicenses', '1thessalonians'],
                ['2tesalonicenses', '2thessalonians'],
                ['1timoteo', '1timothy'],
                ['2timoteo', '2timothy'],
                ['tito', 'titus'],
                ['filemon', 'philemon'],
                ['hebreos', 'hebrews'],
                ['santiago', 'james'],
                ['1pedro', '1peter'],
                ['2pedro', '2peter'],
                ['1juan', '1john'],
                ['2juan', '2john'],
                ['3juan', '3john'],
                ['judas', 'jude'],
                ['apocalipsis', 'revelation'],
            ]);
            this.verseBookMap = new Map([
                ['gen', 'Gen'],
                ['genesis', 'Gen'],
                ['exodo', 'Exod'],
                ['levitico', 'Lev'],
                ['numeros', 'Num'],
                ['deuteronomio', 'Deut'],
                ['josue', 'Josh'],
                ['jueces', 'Judg'],
                ['rut', 'Ruth'],
                ['1samuel', '1Sam'],
                ['2samuel', '2Sam'],
                ['1reyes', '1Kgs'],
                ['2reyes', '2Kgs'],
                ['1cronicas', '1Chr'],
                ['2cronicas', '2Chr'],
                ['esdras', 'Ezra'],
                ['nehemias', 'Neh'],
                ['ester', 'Esth'],
                ['salmos', 'Ps'],
                ['proverbios', 'Prov'],
                ['eclesiastes', 'Eccl'],
                ['cantares', 'Song'],
                ['isaias', 'Isa'],
                ['jeremias', 'Jer'],
                ['lamentaciones', 'Lam'],
                ['ezequiel', 'Ezek'],
                ['oseas', 'Hos'],
                ['abdias', 'Obad'],
                ['jonas', 'Jonah'],
                ['miqueas', 'Mic'],
                ['habacuc', 'Hab'],
                ['sofonias', 'Zeph'],
                ['hageo', 'Hag'],
                ['zacarias', 'Zech'],
                ['malaquias', 'Mal'],
                ['mateo', 'Matt'],
                ['marcos', 'Mark'],
                ['lucas', 'Luke'],
                ['juan', 'John'],
                ['hechos', 'Acts'],
                ['romanos', 'Rom'],
                ['1corintios', '1Cor'],
                ['2corintios', '2Cor'],
                ['galatas', 'Gal'],
                ['efesios', 'Eph'],
                ['filipenses', 'Phil'],
                ['colosenses', 'Col'],
                ['1tesalonicenses', '1Thess'],
                ['2tesalonicenses', '2Thess'],
                ['1timoteo', '1Tim'],
                ['2timoteo', '2Tim'],
                ['filemon', 'Phlm'],
                ['hebreos', 'Heb'],
                ['santiago', 'Jas'],
                ['1pedro', '1Pet'],
                ['2pedro', '2Pet'],
                ['1juan', '1John'],
                ['2juan', '2John'],
                ['3juan', '3John'],
                ['judas', 'Jude'],
                ['apocalipsis', 'Rev'],
                ['exod', 'Exod'],
                ['exodus', 'Exod'],
                ['lev', 'Lev'],
                ['leviticus', 'Lev'],
                ['num', 'Num'],
                ['numbers', 'Num'],
                ['deut', 'Deut'],
                ['deuteronomy', 'Deut'],
                ['josh', 'Josh'],
                ['joshua', 'Josh'],
                ['judg', 'Judg'],
                ['judges', 'Judg'],
                ['ruth', 'Ruth'],
                ['1sam', '1Sam'],
                ['1 sam', '1Sam'],
                ['2sam', '2Sam'],
                ['2 sam', '2Sam'],
                ['1kings', '1Kgs'],
                ['1kgs', '1Kgs'],
                ['2kings', '2Kgs'],
                ['2kgs', '2Kgs'],
                ['1chron', '1Chr'],
                ['1chr', '1Chr'],
                ['2chron', '2Chr'],
                ['2chr', '2Chr'],
                ['ezra', 'Ezra'],
                ['neh', 'Neh'],
                ['nehemiah', 'Neh'],
                ['esth', 'Esth'],
                ['esther', 'Esth'],
                ['job', 'Job'],
                ['ps', 'Ps'],
                ['psalm', 'Ps'],
                ['psalms', 'Ps'],
                ['prov', 'Prov'],
                ['proverbs', 'Prov'],
                ['eccl', 'Eccl'],
                ['ecclesiastes', 'Eccl'],
                ['song', 'Song'],
                ['songofsolomon', 'Song'],
                ['songofsongs', 'Song'],
                ['isa', 'Isa'],
                ['isaiah', 'Isa'],
                ['jer', 'Jer'],
                ['jeremiah', 'Jer'],
                ['lam', 'Lam'],
                ['lamentations', 'Lam'],
                ['ezek', 'Ezek'],
                ['ezekiel', 'Ezek'],
                ['dan', 'Dan'],
                ['daniel', 'Dan'],
                ['hos', 'Hos'],
                ['hosea', 'Hos'],
                ['joel', 'Joel'],
                ['amos', 'Amos'],
                ['obad', 'Obad'],
                ['obadiah', 'Obad'],
                ['jonah', 'Jonah'],
                ['mic', 'Mic'],
                ['micah', 'Mic'],
                ['nah', 'Nah'],
                ['nahum', 'Nah'],
                ['hab', 'Hab'],
                ['habakkuk', 'Hab'],
                ['zeph', 'Zeph'],
                ['zephaniah', 'Zeph'],
                ['hag', 'Hag'],
                ['haggai', 'Hag'],
                ['zech', 'Zech'],
                ['zechariah', 'Zech'],
                ['mal', 'Mal'],
                ['malachi', 'Mal'],
                ['matt', 'Matt'],
                ['matthew', 'Matt'],
                ['mark', 'Mark'],
                ['luke', 'Luke'],
                ['john', 'John'],
                ['acts', 'Acts'],
                ['rom', 'Rom'],
                ['romans', 'Rom'],
                ['1cor', '1Cor'],
                ['1 cor', '1Cor'],
                ['2cor', '2Cor'],
                ['2 cor', '2Cor'],
                ['gal', 'Gal'],
                ['galatians', 'Gal'],
                ['eph', 'Eph'],
                ['ephesians', 'Eph'],
                ['phil', 'Phil'],
                ['philippians', 'Phil'],
                ['col', 'Col'],
                ['colossians', 'Col'],
                ['1thess', '1Thess'],
                ['1 thess', '1Thess'],
                ['2thess', '2Thess'],
                ['2 thess', '2Thess'],
                ['1tim', '1Tim'],
                ['1 tim', '1Tim'],
                ['2tim', '2Tim'],
                ['2 tim', '2Tim'],
                ['titus', 'Titus'],
                ['phlm', 'Phlm'],
                ['philemon', 'Phlm'],
                ['heb', 'Heb'],
                ['hebrews', 'Heb'],
                ['jas', 'Jas'],
                ['james', 'Jas'],
                ['1pet', '1Pet'],
                ['1 pet', '1Pet'],
                ['2pet', '2Pet'],
                ['2 pet', '2Pet'],
                ['1john', '1John'],
                ['1 john', '1John'],
                ['2john', '2John'],
                ['2 john', '2John'],
                ['3john', '3John'],
                ['3 john', '3John'],
                ['jude', 'Jude'],
                ['rev', 'Rev'],
                ['revelation', 'Rev'],
            ]);
        }
        ScriptureService_1.prototype.getPassage = function (reference_1) {
            return __awaiter(this, arguments, void 0, function (reference, translationCode) {
                var apiKey, apiUrl, rawReference, lookupReference, normalizedReference, requestedTranslation, translation, passageId, cached, response, formatted, error_1;
                var _a;
                if (translationCode === void 0) { translationCode = 'KJV'; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            apiKey = this.configService.get('BIBLE_API_KEY');
                            apiUrl = this.configService.get('BIBLE_API_URL');
                            rawReference = (reference || '').trim();
                            lookupReference = this.normalizeReferenceForLookup(rawReference);
                            normalizedReference = this.normalizeReferenceForApi(lookupReference);
                            requestedTranslation = (translationCode || 'KJV').trim().toUpperCase();
                            if (!(apiKey && apiUrl)) return [3 /*break*/, 9];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, this.resolveTranslationForApi(requestedTranslation)];
                        case 2:
                            translation = _b.sent();
                            if (!(translation === null || translation === void 0 ? void 0 : translation.apiId)) return [3 /*break*/, 7];
                            passageId = (0, scripture_helpers_1.convertToApiBiblePassageId)(normalizedReference);
                            return [4 /*yield*/, this.cacheService.getPassage(translation.apiId, passageId)];
                        case 3:
                            cached = _b.sent();
                            if (cached && Array.isArray(cached === null || cached === void 0 ? void 0 : cached.verses) && cached.verses.length > 0) {
                                return [2 /*return*/, cached];
                            }
                            return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/bibles/").concat(translation.apiId, "/passages/").concat(passageId), {
                                    params: {
                                        'content-type': 'text',
                                        'include-verse-numbers': true,
                                        'include-notes': true
                                    },
                                    headers: { 'api-key': apiKey },
                                })];
                        case 4:
                            response = _b.sent();
                            formatted = (0, scripture_helpers_1.formatApiBibleResponse)(response.data, lookupReference || reference, requestedTranslation);
                            if (!(Array.isArray(formatted === null || formatted === void 0 ? void 0 : formatted.verses) && formatted.verses.length > 0)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.cacheService.setPassage(translation.apiId, passageId, formatted)];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6: return [2 /*return*/, formatted];
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            error_1 = _b.sent();
                            console.error('[Scripture] API.Bible error:', ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                            return [2 /*return*/, this.fetchBibleApiPassage(lookupReference, requestedTranslation, normalizedReference)];
                        case 9: return [2 /*return*/, this.fetchBibleApiPassage(lookupReference, requestedTranslation, normalizedReference)];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getStructuralAnalysis = function (reference_1) {
            return __awaiter(this, arguments, void 0, function (reference, translationCode) {
                var passage, passageText, prompt, response, _a;
                if (translationCode === void 0) { translationCode = 'KJV'; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getPassage(reference, translationCode)];
                        case 1:
                            passage = _b.sent();
                            passageText = Array.isArray(passage === null || passage === void 0 ? void 0 : passage.verses)
                                ? passage.verses.map(function (verse) { return "".concat(verse.reference, " ").concat(verse.text); }).join('\n')
                                : JSON.stringify(passage || {});
                            prompt = scripture_prompts_1.ScripturePrompts.basicStructuralAnalysis({
                                reference: reference,
                                passageText: passageText,
                            });
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, 'system', {
                                    temperature: 0.3,
                                    maxTokens: 900,
                                })];
                        case 3:
                            response = _b.sent();
                            return [2 /*return*/, this.safeJson(response, { raw: response })];
                        case 4:
                            _a = _b.sent();
                            return [2 /*return*/, {
                                    repeatedPhrases: [],
                                    imperatives: [],
                                    promises: [],
                                    conditions: [],
                                    narrativeShifts: [],
                                    literaryMarkers: [],
                                    chiasticStructure: '',
                                    outline: [],
                                    error: 'LLM unavailable. Check LM_STUDIO_URL/LLM_MODEL_NAME or configure OPENAI_API_KEY.',
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getInterpretiveChallenges = function (reference_1) {
            return __awaiter(this, arguments, void 0, function (reference, translationCode) {
                var passage, passageText, prompt, response, _a;
                if (translationCode === void 0) { translationCode = 'KJV'; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getPassage(reference, translationCode)];
                        case 1:
                            passage = _b.sent();
                            passageText = Array.isArray(passage === null || passage === void 0 ? void 0 : passage.verses)
                                ? passage.verses.map(function (verse) { return "".concat(verse.reference, " ").concat(verse.text); }).join('\n')
                                : JSON.stringify(passage || {});
                            prompt = scripture_prompts_1.ScripturePrompts.basicInterpretiveChallenges({
                                reference: reference,
                                passageText: passageText,
                            });
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, 'system', {
                                    temperature: 0.3,
                                    maxTokens: 800,
                                })];
                        case 3:
                            response = _b.sent();
                            return [2 /*return*/, this.safeJson(response, { raw: response })];
                        case 4:
                            _a = _b.sent();
                            return [2 /*return*/, {
                                    challenges: [],
                                    error: 'LLM unavailable. Check LM_STUDIO_URL/LLM_MODEL_NAME or configure OPENAI_API_KEY.',
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getParallelPassages = function (reference, translations, contextRange) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _i, translations_1, translation, passage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            results = [];
                            _i = 0, translations_1 = translations;
                            _a.label = 1;
                        case 1:
                            if (!(_i < translations_1.length)) return [3 /*break*/, 4];
                            translation = translations_1[_i];
                            return [4 /*yield*/, this.getPassageWithContext(reference, translation, contextRange)];
                        case 2:
                            passage = _a.sent();
                            results.push({ translation: translation, passage: passage });
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, {
                                reference: reference,
                                translations: results,
                            }];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getPassageWithContext = function (reference, translationCode, contextRange) {
            return __awaiter(this, void 0, void 0, function () {
                var expanded;
                return __generator(this, function (_a) {
                    expanded = this.expandReference(reference, contextRange);
                    return [2 /*return*/, this.getPassage(expanded, translationCode)];
                });
            });
        };
        ScriptureService_1.prototype.getHistoricalContextDossier = function (reference) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedReference, match, rawBook, bookKey, _a, historicalContext, culturalContext, geographyContext, bookMetadata;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            normalizedReference = this.normalizeReferenceForLookup((reference || '').trim());
                            match = normalizedReference.match(/^(.*?)\s+\d+/);
                            rawBook = match ? match[1].trim() : normalizedReference;
                            bookKey = this.normalizeBookKey(rawBook);
                            return [4 /*yield*/, Promise.all([
                                    this.loadHistoricalContext(),
                                    this.loadCulturalContext(),
                                    this.loadGeography(),
                                    this.loadBookMetadata(),
                                ])];
                        case 1:
                            _a = _b.sent(), historicalContext = _a[0], culturalContext = _a[1], geographyContext = _a[2], bookMetadata = _a[3];
                            return [2 /*return*/, {
                                    reference: normalizedReference,
                                    bookKey: bookKey,
                                    bookMetadata: bookMetadata[bookKey] || null,
                                    historicalContext: historicalContext[bookKey] || null,
                                    culturalContext: culturalContext[bookKey] || null,
                                    geographyContext: geographyContext[bookKey] || null,
                                }];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getCrossReferences = function (verseReference) {
            return __awaiter(this, void 0, void 0, function () {
                var index, normalized, lookupKeys, merged, _i, lookupKeys_1, key, entries, _a, entries_1, entry, results;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.loadCrossReferences()];
                        case 1:
                            index = _b.sent();
                            normalized = this.normalizeVerseReference(verseReference);
                            console.log("[CrossRef] Looking up: \"".concat(verseReference, "\" -> normalized: \"").concat(normalized, "\""));
                            lookupKeys = this.buildCrossReferenceLookupKeys(verseReference, normalized);
                            merged = new Set();
                            for (_i = 0, lookupKeys_1 = lookupKeys; _i < lookupKeys_1.length; _i++) {
                                key = lookupKeys_1[_i];
                                entries = index.get(key) || [];
                                for (_a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
                                    entry = entries_1[_a];
                                    merged.add(entry);
                                }
                            }
                            results = Array.from(merged);
                            console.log("[CrossRef] Lookup keys tried: ".concat(lookupKeys.join(', ') || '(none)'));
                            console.log("[CrossRef] Found ".concat(results.length, " references"));
                            return [2 /*return*/, results];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getCrossReferenceDetails = function (verseReference, category) {
            return __awaiter(this, void 0, void 0, function () {
                var refs, categoryIndex, normalizedSource, details;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getCrossReferences(verseReference)];
                        case 1:
                            refs = _a.sent();
                            return [4 /*yield*/, this.loadCrossReferenceCategories()];
                        case 2:
                            categoryIndex = _a.sent();
                            normalizedSource = this.normalizeVerseReference(verseReference);
                            details = refs.map(function (ref) {
                                var normalizedTarget = _this.normalizeVerseReference(ref);
                                var key = "".concat(normalizedSource, "|").concat(normalizedTarget);
                                return {
                                    reference: ref,
                                    category: (categoryIndex === null || categoryIndex === void 0 ? void 0 : categoryIndex[key]) || null,
                                };
                            });
                            if (category) {
                                return [2 /*return*/, details.filter(function (item) { return item.category === category; })];
                            }
                            return [2 /*return*/, details];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getWordStudy = function (word_1, language_1) {
            return __awaiter(this, arguments, void 0, function (word, language, responseLanguage) {
                var index, occurrences, key, strongsLookup, strongsEntry, entry, occurrenceEntry, distributionByBook, targetLanguage, cached, originalScript, transliteration, baseResult, localized, fallbackResult, localizedFallback;
                if (responseLanguage === void 0) { responseLanguage = 'en'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!word)
                                return [2 /*return*/, { error: 'word parameter is required' }];
                            return [4 /*yield*/, this.loadWordStudyIndex()];
                        case 1:
                            index = _a.sent();
                            return [4 /*yield*/, this.loadWordOccurrences()];
                        case 2:
                            occurrences = _a.sent();
                            key = word.toLowerCase();
                            strongsLookup = key.match(/^[gh]\d+$/i)
                                ? "".concat(key[0].toUpperCase()).concat(String(Number(key.slice(1))).padStart(4, '0'))
                                : null;
                            strongsEntry = strongsLookup
                                ? Object.values(index || {}).find(function (item) { return String((item === null || item === void 0 ? void 0 : item.strongs) || '').toUpperCase() === strongsLookup; })
                                : null;
                            entry = (index === null || index === void 0 ? void 0 : index[key]) || strongsEntry;
                            occurrenceEntry = occurrences === null || occurrences === void 0 ? void 0 : occurrences[key];
                            distributionByBook = this.buildDistributionByBook((occurrenceEntry === null || occurrenceEntry === void 0 ? void 0 : occurrenceEntry.verses) || []);
                            targetLanguage = this.resolveResponseLanguage(responseLanguage);
                            return [4 /*yield*/, this.cacheService.getWordStudy(word, language, targetLanguage)];
                        case 3:
                            cached = _a.sent();
                            if (cached) {
                                return [2 /*return*/, cached];
                            }
                            if (!entry) return [3 /*break*/, 5];
                            originalScript = this.resolveOriginalScript((entry === null || entry === void 0 ? void 0 : entry.lemma) || key, word, language);
                            transliteration = this.resolveTransliteration(entry.transliteration || '', entry.lemma || key, word, language);
                            baseResult = {
                                word: word,
                                language: language,
                                lemma: entry.lemma || key,
                                originalScript: originalScript,
                                transliteration: transliteration,
                                definition: entry.definition || null,
                                usageCount: (occurrenceEntry === null || occurrenceEntry === void 0 ? void 0 : occurrenceEntry.count) || entry.usageCount || null,
                                examples: entry.examples || entry.verseExamples || (occurrenceEntry === null || occurrenceEntry === void 0 ? void 0 : occurrenceEntry.verses) || [],
                                strongs: entry.strongs || null,
                                partOfSpeech: entry.partOfSpeech || null,
                                verseOccurrences: (occurrenceEntry === null || occurrenceEntry === void 0 ? void 0 : occurrenceEntry.verses) || [],
                                distributionByBook: distributionByBook,
                            };
                            localized = this.localizeWordStudyResult(baseResult, targetLanguage);
                            return [4 /*yield*/, this.cacheService.setWordStudy(word, language, targetLanguage, localized)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, localized];
                        case 5:
                            fallbackResult = {
                                word: word,
                                language: language,
                                lemma: word.toLowerCase(),
                                originalScript: this.resolveOriginalScript(word.toLowerCase(), word, language),
                                transliteration: this.resolveTransliteration('', word.toLowerCase(), word, language),
                                definition: null,
                                usageCount: (occurrenceEntry === null || occurrenceEntry === void 0 ? void 0 : occurrenceEntry.count) || null,
                                examples: (occurrenceEntry === null || occurrenceEntry === void 0 ? void 0 : occurrenceEntry.verses) || [],
                                strongs: null,
                                partOfSpeech: null,
                                verseOccurrences: (occurrenceEntry === null || occurrenceEntry === void 0 ? void 0 : occurrenceEntry.verses) || [],
                                distributionByBook: distributionByBook,
                            };
                            localizedFallback = this.localizeWordStudyResult(fallbackResult, targetLanguage);
                            return [4 /*yield*/, this.cacheService.setWordStudy(word, language, targetLanguage, localizedFallback)];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, localizedFallback];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getWordStudyInsights = function (word_1, language_1, context_1) {
            return __awaiter(this, arguments, void 0, function (word, language, context, responseLanguage) {
                var targetLanguage, normalizedContext, cached, outputLanguageLabel, prompt, response, parsed, index, wordKey, partOfSpeech, ensured, localized, ensuredLocalized;
                var _a;
                if (responseLanguage === void 0) { responseLanguage = 'en'; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            targetLanguage = this.resolveResponseLanguage(responseLanguage);
                            normalizedContext = String(context || '').trim();
                            return [4 /*yield*/, this.cacheService.getWordStudyInsights(word, language, normalizedContext, targetLanguage)];
                        case 1:
                            cached = _b.sent();
                            if (cached) {
                                return [2 /*return*/, cached];
                            }
                            outputLanguageLabel = targetLanguage === 'es' ? 'Spanish' : 'English';
                            prompt = scripture_prompts_1.ScripturePrompts.wordStudyInsights({
                                word: word,
                                language: language,
                                context: context || 'N/A',
                                outputLanguageLabel: outputLanguageLabel,
                            });
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, 'system', {
                                    temperature: 0.4,
                                    maxTokens: 700,
                                })];
                        case 2:
                            response = _b.sent();
                            this.logWordStudyLlmOutput('word-study-insights', response);
                            parsed = this.safeJson(response, { raw: response });
                            return [4 /*yield*/, this.loadWordStudyIndex()];
                        case 3:
                            index = _b.sent();
                            wordKey = String(word || '').toLowerCase();
                            partOfSpeech = String(((_a = index === null || index === void 0 ? void 0 : index[wordKey]) === null || _a === void 0 ? void 0 : _a.partOfSpeech) || '').trim();
                            if (!(targetLanguage !== 'es')) return [3 /*break*/, 5];
                            ensured = this.ensureGrammarInsights(parsed, partOfSpeech, targetLanguage);
                            return [4 /*yield*/, this.cacheService.setWordStudyInsights(word, language, normalizedContext, targetLanguage, ensured)];
                        case 4:
                            _b.sent();
                            return [2 /*return*/, ensured];
                        case 5: return [4 /*yield*/, this.localizeWordStudyInsights(parsed, targetLanguage)];
                        case 6:
                            localized = _b.sent();
                            ensuredLocalized = this.ensureGrammarInsights(localized, partOfSpeech, targetLanguage);
                            return [4 /*yield*/, this.cacheService.setWordStudyInsights(word, language, normalizedContext, targetLanguage, ensuredLocalized)];
                        case 7:
                            _b.sent();
                            return [2 /*return*/, ensuredLocalized];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getWordStudySuggestions = function (reference_1) {
            return __awaiter(this, arguments, void 0, function (reference, translationCode, language, responseLanguage) {
                var targetLanguage, cached, passage, passageText, sourceLanguage, outputLanguageLabel, sourceLanguageLabel, prompt, response, parsed, normalized, error_2;
                if (translationCode === void 0) { translationCode = 'KJV'; }
                if (language === void 0) { language = 'greek'; }
                if (responseLanguage === void 0) { responseLanguage = 'en'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            targetLanguage = this.resolveResponseLanguage(responseLanguage);
                            return [4 /*yield*/, this.cacheService.getWordStudySuggestions(reference, translationCode, language, targetLanguage)];
                        case 1:
                            cached = _a.sent();
                            if (cached) {
                                return [2 /*return*/, cached];
                            }
                            return [4 /*yield*/, this.getPassage(reference, translationCode)];
                        case 2:
                            passage = _a.sent();
                            passageText = this.getPassageText(passage);
                            if (!passageText) {
                                console.warn("[WordStudySuggestions] Empty passage text for reference=\"".concat(reference, "\" translation=\"").concat(translationCode, "\""));
                                return [2 /*return*/, []];
                            }
                            sourceLanguage = String(language || 'greek').toLowerCase();
                            outputLanguageLabel = targetLanguage === 'es' ? 'Spanish' : 'English';
                            sourceLanguageLabel = sourceLanguage === 'hebrew' ? 'Hebrew' : sourceLanguage === 'aramaic' ? 'Aramaic' : 'Greek';
                            prompt = scripture_prompts_1.ScripturePrompts.wordStudySuggestions({
                                sourceLanguageLabel: sourceLanguageLabel,
                                reference: reference,
                                passageText: passageText.slice(0, 2600),
                                outputLanguageLabel: outputLanguageLabel,
                                sourceLanguage: sourceLanguage,
                            });
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 6, , 7]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, 'system', {
                                    temperature: 0.2,
                                    maxTokens: 700,
                                })];
                        case 4:
                            response = _a.sent();
                            this.logWordStudyLlmOutput('word-study-suggestions', response);
                            parsed = this.safeJson(response, []);
                            if (!Array.isArray(parsed))
                                return [2 /*return*/, []];
                            normalized = parsed
                                .map(function (item) { return ({
                                term: String((item === null || item === void 0 ? void 0 : item.term) || '').trim(),
                                transliteration: String((item === null || item === void 0 ? void 0 : item.transliteration) || '').trim(),
                                gloss: String((item === null || item === void 0 ? void 0 : item.gloss) || '').trim(),
                                reason: String((item === null || item === void 0 ? void 0 : item.reason) || '').trim(),
                                language: sourceLanguage,
                            }); })
                                .filter(function (item) { return item.term; })
                                .slice(0, 8);
                            return [4 /*yield*/, this.cacheService.setWordStudySuggestions(reference, translationCode, language, targetLanguage, normalized)];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, normalized];
                        case 6:
                            error_2 = _a.sent();
                            console.error('[WordStudySuggestions] Failed:', (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || error_2);
                            return [2 /*return*/, []];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureService_1.prototype.searchScripture = function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, translationCode) {
                var apiKey, apiUrl, translation, cached, response, results, error_3;
                var _a, _b, _c;
                if (translationCode === void 0) { translationCode = 'KJV'; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            apiKey = this.configService.get('BIBLE_API_KEY');
                            apiUrl = this.configService.get('BIBLE_API_URL');
                            if (!(apiKey && apiUrl)) return [3 /*break*/, 8];
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 7, , 8]);
                            return [4 /*yield*/, this.translationRepository.findOne({ where: { code: translationCode } })];
                        case 2:
                            translation = _d.sent();
                            if (!(translation === null || translation === void 0 ? void 0 : translation.apiId)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.cacheService.getSearch(translation.apiId, query)];
                        case 3:
                            cached = _d.sent();
                            if (cached) {
                                return [2 /*return*/, cached];
                            }
                            return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/bibles/").concat(translation.apiId, "/search"), {
                                    params: { query: query, limit: 50 },
                                    headers: { 'api-key': apiKey },
                                })];
                        case 4:
                            response = _d.sent();
                            results = ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.verses) || [];
                            // Cache the results
                            return [4 /*yield*/, this.cacheService.setSearch(translation.apiId, query, results)];
                        case 5:
                            // Cache the results
                            _d.sent();
                            return [2 /*return*/, results];
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            error_3 = _d.sent();
                            console.error('[Scripture] Search error:', ((_c = error_3.response) === null || _c === void 0 ? void 0 : _c.data) || error_3.message);
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/, []];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getTranslations = function () {
            return __awaiter(this, void 0, void 0, function () {
                var translations;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.translationRepository.find()];
                        case 1:
                            translations = _a.sent();
                            if (translations.length > 0) {
                                return [2 /*return*/, translations];
                            }
                            return [2 /*return*/, [
                                    { code: 'KJV', name: 'King James Version', language: 'en', apiId: null, isPublicDomain: true },
                                    { code: 'WEB', name: 'World English Bible', language: 'en', apiId: null, isPublicDomain: true },
                                ]];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getBookMetadata = function (book) {
            return __awaiter(this, void 0, void 0, function () {
                var index, normalized;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadBookMetadata()];
                        case 1:
                            index = _a.sent();
                            normalized = this.normalizeBookKey(book);
                            return [2 /*return*/, (index === null || index === void 0 ? void 0 : index[normalized]) || null];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getHistoricalContext = function (book) {
            return __awaiter(this, void 0, void 0, function () {
                var index, normalized;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadHistoricalContext()];
                        case 1:
                            index = _a.sent();
                            normalized = this.normalizeBookKey(book);
                            return [2 /*return*/, (index === null || index === void 0 ? void 0 : index[normalized]) || null];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getCulturalContext = function (book) {
            return __awaiter(this, void 0, void 0, function () {
                var index, normalized;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadCulturalContext()];
                        case 1:
                            index = _a.sent();
                            normalized = this.normalizeBookKey(book);
                            return [2 /*return*/, (index === null || index === void 0 ? void 0 : index[normalized]) || null];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getTimeline = function (book) {
            return __awaiter(this, void 0, void 0, function () {
                var index, normalized;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadTimeline()];
                        case 1:
                            index = _a.sent();
                            normalized = this.normalizeBookKey(book);
                            return [2 /*return*/, (index === null || index === void 0 ? void 0 : index[normalized]) || null];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getGeography = function (book) {
            return __awaiter(this, void 0, void 0, function () {
                var index, normalized;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadGeography()];
                        case 1:
                            index = _a.sent();
                            normalized = this.normalizeBookKey(book);
                            return [2 /*return*/, (index === null || index === void 0 ? void 0 : index[normalized]) || null];
                    }
                });
            });
        };
        ScriptureService_1.prototype.fetchBibleApiPassage = function (reference, translationCode, alternateReference) {
            return __awaiter(this, void 0, void 0, function () {
                var references, _i, references_1, ref, bibleGateway, _a, _b, code, response, data, verses, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            references = Array.from(new Set([reference, alternateReference]
                                .filter(function (item) { return Boolean(item && item.trim()); })
                                .map(function (item) { return item.trim(); })));
                            _i = 0, references_1 = references;
                            _d.label = 1;
                        case 1:
                            if (!(_i < references_1.length)) return [3 /*break*/, 9];
                            ref = references_1[_i];
                            return [4 /*yield*/, this.fetchBibleGatewayPassage(ref, translationCode)];
                        case 2:
                            bibleGateway = _d.sent();
                            if (Array.isArray(bibleGateway === null || bibleGateway === void 0 ? void 0 : bibleGateway.verses) && bibleGateway.verses.length > 0) {
                                return [2 /*return*/, bibleGateway];
                            }
                            _a = 0, _b = this.getFallbackTranslationCodes(translationCode);
                            _d.label = 3;
                        case 3:
                            if (!(_a < _b.length)) return [3 /*break*/, 8];
                            code = _b[_a];
                            _d.label = 4;
                        case 4:
                            _d.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, axios_1.default.get("https://bible-api.com/".concat(encodeURIComponent(ref)), {
                                    params: { translation: code },
                                    headers: {
                                        'User-Agent': 'Mozilla/5.0 (compatible; CleverSermon/1.0)',
                                        Accept: 'application/json,text/plain,*/*',
                                    },
                                })];
                        case 5:
                            response = _d.sent();
                            data = response.data;
                            verses = (data.verses || []).map(function (verse) { return ({
                                reference: verse.reference || "".concat(verse.book_name, " ").concat(verse.chapter, ":").concat(verse.verse),
                                text: verse.text,
                            }); });
                            if (verses.length > 0) {
                                return [2 /*return*/, {
                                        reference: data.reference || ref,
                                        translation: data.translation_id || translationCode,
                                        verses: verses,
                                    }];
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            _c = _d.sent();
                            return [3 /*break*/, 7];
                        case 7:
                            _a++;
                            return [3 /*break*/, 3];
                        case 8:
                            _i++;
                            return [3 /*break*/, 1];
                        case 9: return [2 /*return*/, {
                                reference: reference,
                                translation: translationCode,
                                verses: [],
                                error: "No verses found for ".concat(translationCode, ". Public passage sources could not resolve this translation for the requested reference."),
                            }];
                    }
                });
            });
        };
        ScriptureService_1.prototype.fetchBibleGatewayPassage = function (reference, translationCode) {
            return __awaiter(this, void 0, void 0, function () {
                var version, encodedReference, url, response, html, passageHtml, verseMatches, verses, error_4;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            version = (translationCode || 'KJV').trim().toUpperCase();
                            encodedReference = encodeURIComponent(reference);
                            url = "https://www.biblegateway.com/passage/?search=".concat(encodedReference, "&version=").concat(encodeURIComponent(version));
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, axios_1.default.get(url, {
                                    headers: {
                                        'User-Agent': 'Mozilla/5.0 (compatible; CleverSermon/1.0)',
                                        Accept: 'text/html,application/xhtml+xml',
                                    },
                                    timeout: 15000,
                                })];
                        case 2:
                            response = _c.sent();
                            html = String(response.data || '');
                            passageHtml = ((_a = html.match(/<div class="passage-text">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i)) === null || _a === void 0 ? void 0 : _a[1]) || html;
                            verseMatches = Array.from(passageHtml.matchAll(/<span[^>]*class="text [^"]*"[^>]*>([\s\S]*?)<\/span>/g));
                            verses = verseMatches
                                .map(function (match) { return _this.parseBibleGatewayVerse(match[1], reference); })
                                .filter(function (verse) { return Boolean(verse === null || verse === void 0 ? void 0 : verse.text); });
                            return [2 /*return*/, {
                                    reference: reference,
                                    translation: version,
                                    verses: verses,
                                }];
                        case 3:
                            error_4 = _c.sent();
                            console.error('[Scripture] BibleGateway fallback error:', ((_b = error_4 === null || error_4 === void 0 ? void 0 : error_4.response) === null || _b === void 0 ? void 0 : _b.status) || (error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || error_4);
                            return [2 /*return*/, {
                                    reference: reference,
                                    translation: version,
                                    verses: [],
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureService_1.prototype.parseBibleGatewayVerse = function (verseHtml, reference) {
            var _a;
            var verseNumber = ((_a = verseHtml.match(/<sup class="versenum">\s*(\d+)/i)) === null || _a === void 0 ? void 0 : _a[1]) || '';
            var cleanedText = this.decodeHtmlEntities(verseHtml
                .replace(/<sup class="versenum">[\s\S]*?<\/sup>/i, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim());
            if (!cleanedText) {
                return null;
            }
            var baseReference = reference.match(/^(.+?)\s+(\d+)(?::.*)?$/);
            var bookAndChapter = baseReference ? "".concat(baseReference[1], " ").concat(baseReference[2]) : reference;
            var verseReference = verseNumber ? "".concat(bookAndChapter, ":").concat(verseNumber) : reference;
            return {
                reference: verseReference,
                text: cleanedText,
            };
        };
        ScriptureService_1.prototype.decodeHtmlEntities = function (value) {
            return value
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'")
                .replace(/&ldquo;/g, '“')
                .replace(/&rdquo;/g, '”')
                .replace(/&lsquo;/g, '‘')
                .replace(/&rsquo;/g, '’')
                .replace(/&ndash;/g, '–')
                .replace(/&mdash;/g, '—');
        };
        ScriptureService_1.prototype.resolveTranslationForApi = function (requestedCode) {
            return __awaiter(this, void 0, void 0, function () {
                var translation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.translationRepository.findOne({ where: { code: requestedCode } })];
                        case 1:
                            translation = _a.sent();
                            if (translation === null || translation === void 0 ? void 0 : translation.apiId) {
                                return [2 /*return*/, translation];
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getFallbackTranslationCodes = function (translationCode) {
            var code = (translationCode || 'KJV').trim().toUpperCase();
            var map = {
                RVR1960: ['rvr1960', 'rvr'],
                RVR60: ['rvr1960', 'rvr'],
                NBLA: ['nbla'],
                NVI: ['nvi'],
            };
            return map[code] || [code.toLowerCase()];
        };
        ScriptureService_1.prototype.loadCrossReferences = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, index, content, lines, _i, lines_1, line, _a, source, target, normalizedSource, existing, existingOrig, error_5;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.crossReferenceIndex) {
                                return [2 /*return*/, this.crossReferenceIndex];
                            }
                            path = this.configService.get('CROSS_REFERENCES_PATH') || (0, path_1.resolve)('data/cross-references-enhanced.txt');
                            index = new Map();
                            if (!path) {
                                this.crossReferenceIndex = index;
                                return [2 /*return*/, index];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            lines = content.split('\n').map(function (line) { return line.trim(); }).filter(Boolean);
                            console.log("[CrossRef] Loading ".concat(lines.length, " lines from ").concat(path));
                            for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                                line = lines_1[_i];
                                _a = line.split(/\s+/), source = _a[0], target = _a[1];
                                if (!source || !target)
                                    continue;
                                normalizedSource = this.normalizeVerseReference(source);
                                existing = index.get(normalizedSource) || [];
                                existing.push(target);
                                index.set(normalizedSource, existing);
                                existingOrig = index.get(source) || [];
                                existingOrig.push(target);
                                index.set(source, existingOrig);
                            }
                            console.log("[CrossRef] Loaded ".concat(index.size, " unique verse keys"));
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _b.sent();
                            console.error('[CrossRef] Failed to load cross references:', error_5);
                            return [3 /*break*/, 4];
                        case 4:
                            this.crossReferenceIndex = index;
                            return [2 /*return*/, index];
                    }
                });
            });
        };
        ScriptureService_1.prototype.getCrossReferenceSeedStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var index, entryCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadCrossReferences()];
                        case 1:
                            index = _a.sent();
                            entryCount = 0;
                            index.forEach(function (value) {
                                entryCount += Array.isArray(value) ? value.length : 0;
                            });
                            return [2 /*return*/, {
                                    loaded: entryCount > 0,
                                    entries: entryCount,
                                }];
                    }
                });
            });
        };
        ScriptureService_1.prototype.loadWordStudyIndex = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.wordStudyIndex) {
                                return [2 /*return*/, this.wordStudyIndex];
                            }
                            path = this.configService.get('WORD_STUDY_DATA_PATH') || (0, path_1.resolve)('data/strongs-word-study.json');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            this.wordStudyIndex = JSON.parse(content);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            this.wordStudyIndex = {};
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.wordStudyIndex];
                    }
                });
            });
        };
        ScriptureService_1.prototype.loadWordOccurrences = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.wordOccurrenceIndex) {
                                return [2 /*return*/, this.wordOccurrenceIndex];
                            }
                            path = this.configService.get('WORD_OCCURRENCES_PATH') || (0, path_1.resolve)('data/word-occurrences.json');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            this.wordOccurrenceIndex = JSON.parse(content);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            this.wordOccurrenceIndex = {};
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.wordOccurrenceIndex];
                    }
                });
            });
        };
        ScriptureService_1.prototype.loadCrossReferenceCategories = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.crossReferenceCategoryIndex) {
                                return [2 /*return*/, this.crossReferenceCategoryIndex];
                            }
                            path = this.configService.get('CROSS_REFERENCE_CATEGORIES_PATH')
                                || (0, path_1.resolve)('data/cross-reference-categories.json');
                            if (!path) {
                                this.crossReferenceCategoryIndex = {};
                                return [2 /*return*/, this.crossReferenceCategoryIndex];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            this.crossReferenceCategoryIndex = JSON.parse(content);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            this.crossReferenceCategoryIndex = {};
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.crossReferenceCategoryIndex];
                    }
                });
            });
        };
        ScriptureService_1.prototype.loadBookMetadata = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.bookMetadataIndex) {
                                return [2 /*return*/, this.bookMetadataIndex];
                            }
                            path = this.configService.get('BOOK_METADATA_PATH') || (0, path_1.resolve)('data/book-metadata.json');
                            if (!path) {
                                this.bookMetadataIndex = {};
                                return [2 /*return*/, this.bookMetadataIndex];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            this.bookMetadataIndex = JSON.parse(content);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            this.bookMetadataIndex = {};
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.bookMetadataIndex];
                    }
                });
            });
        };
        ScriptureService_1.prototype.loadHistoricalContext = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.historicalContextIndex) {
                                return [2 /*return*/, this.historicalContextIndex];
                            }
                            path = this.configService.get('HISTORICAL_CONTEXT_PATH') || (0, path_1.resolve)('data/historical-context.json');
                            if (!path) {
                                this.historicalContextIndex = {};
                                return [2 /*return*/, this.historicalContextIndex];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            this.historicalContextIndex = JSON.parse(content);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            this.historicalContextIndex = {};
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.historicalContextIndex];
                    }
                });
            });
        };
        ScriptureService_1.prototype.loadCulturalContext = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.culturalContextIndex) {
                                return [2 /*return*/, this.culturalContextIndex];
                            }
                            path = this.configService.get('CULTURAL_CONTEXT_PATH') || (0, path_1.resolve)('data/cultural-context.json');
                            if (!path) {
                                this.culturalContextIndex = {};
                                return [2 /*return*/, this.culturalContextIndex];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            this.culturalContextIndex = JSON.parse(content);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            this.culturalContextIndex = {};
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.culturalContextIndex];
                    }
                });
            });
        };
        ScriptureService_1.prototype.loadTimeline = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.timelineIndex) {
                                return [2 /*return*/, this.timelineIndex];
                            }
                            path = this.configService.get('TIMELINE_PATH') || (0, path_1.resolve)('data/timeline.json');
                            if (!path) {
                                this.timelineIndex = {};
                                return [2 /*return*/, this.timelineIndex];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            this.timelineIndex = JSON.parse(content);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            this.timelineIndex = {};
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.timelineIndex];
                    }
                });
            });
        };
        ScriptureService_1.prototype.loadGeography = function () {
            return __awaiter(this, void 0, void 0, function () {
                var path, content, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.geographyIndex) {
                                return [2 /*return*/, this.geographyIndex];
                            }
                            path = this.configService.get('GEOGRAPHY_PATH') || (0, path_1.resolve)('data/geography.json');
                            if (!path) {
                                this.geographyIndex = {};
                                return [2 /*return*/, this.geographyIndex];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, fs_1.promises.readFile(path, 'utf-8')];
                        case 2:
                            content = _b.sent();
                            this.geographyIndex = JSON.parse(content);
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            this.geographyIndex = {};
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, this.geographyIndex];
                    }
                });
            });
        };
        ScriptureService_1.prototype.expandReference = function (reference, contextRange) {
            if (!contextRange || contextRange <= 0)
                return reference;
            var match = reference.match(/^(.*?)\s+(\d+)(?::(\d+))?$/);
            if (!match)
                return reference;
            var book = match[1].trim();
            var chapter = Number(match[2]);
            var verse = match[3] ? Number(match[3]) : null;
            if (!verse)
                return reference;
            var start = Math.max(1, verse - contextRange);
            var end = verse + contextRange;
            return "".concat(book, " ").concat(chapter, ":").concat(start, "-").concat(end);
        };
        ScriptureService_1.prototype.normalizeBookKey = function (book) {
            if (!book)
                return '';
            var cleaned = book.toLowerCase().replace(/[^a-z0-9]/g, '');
            return this.spanishBookKeyMap.get(cleaned) || cleaned;
        };
        ScriptureService_1.prototype.normalizeReferenceForApi = function (reference) {
            if (!reference)
                return reference;
            var cleaned = reference.trim();
            var match = cleaned.match(/^(.*?)\s+(\d+)(?::([\d\-–—]+))?$/);
            if (!match)
                return cleaned;
            var rawBook = match[1].trim();
            var chapter = match[2];
            var verses = match[3];
            var bookKey = rawBook.toLowerCase().replace(/[^a-z0-9]/g, '');
            var englishBook = this.spanishBookKeyMap.get(bookKey) || rawBook;
            var normalizedVerses = verses ? verses.replace(/[–—]/g, '-') : '';
            return normalizedVerses ? "".concat(englishBook, " ").concat(chapter, ":").concat(normalizedVerses) : "".concat(englishBook, " ").concat(chapter);
        };
        ScriptureService_1.prototype.buildDistributionByBook = function (verses) {
            var counts = {};
            verses.forEach(function (verse) {
                var match = verse.match(/^(.*?)\s+\d+/);
                var book = match ? match[1].trim() : null;
                if (!book)
                    return;
                counts[book] = (counts[book] || 0) + 1;
            });
            return Object.entries(counts)
                .map(function (_a) {
                var book = _a[0], count = _a[1];
                return ({ book: book, count: count });
            })
                .sort(function (a, b) { return b.count - a.count; });
        };
        ScriptureService_1.prototype.safeJson = function (raw, fallback) {
            if (!raw)
                return fallback;
            var fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
            var payload = (fenced === null || fenced === void 0 ? void 0 : fenced[1]) || raw;
            var objectStart = payload.indexOf('{');
            var objectEnd = payload.lastIndexOf('}');
            var arrayStart = payload.indexOf('[');
            var arrayEnd = payload.lastIndexOf(']');
            var jsonText = payload;
            if (arrayStart !== -1 && arrayEnd !== -1 && (objectStart === -1 || arrayStart < objectStart)) {
                jsonText = payload.slice(arrayStart, arrayEnd + 1);
            }
            else if (objectStart !== -1 && objectEnd !== -1) {
                jsonText = payload.slice(objectStart, objectEnd + 1);
            }
            try {
                return JSON.parse(jsonText);
            }
            catch (_a) {
                return fallback;
            }
        };
        ScriptureService_1.prototype.localizeWordStudyResult = function (result, targetLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                var definition, partOfSpeech, examples, translatedDefinition, _a, translatedPartOfSpeech, _b, translatedExamples, _c, _d;
                var _this = this;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (targetLanguage !== 'es') {
                                return [2 /*return*/, result];
                            }
                            definition = typeof (result === null || result === void 0 ? void 0 : result.definition) === 'string' ? result.definition : '';
                            partOfSpeech = typeof (result === null || result === void 0 ? void 0 : result.partOfSpeech) === 'string' ? result.partOfSpeech : '';
                            examples = Array.isArray(result === null || result === void 0 ? void 0 : result.examples) ? result.examples : [];
                            if (!definition && !partOfSpeech && examples.length === 0) {
                                return [2 /*return*/, result];
                            }
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 11, , 12]);
                            if (!definition) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.translateTextToSpanish(definition)];
                        case 2:
                            _a = _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = result === null || result === void 0 ? void 0 : result.definition;
                            _e.label = 4;
                        case 4:
                            translatedDefinition = _a;
                            if (!partOfSpeech) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.translateTextToSpanish(partOfSpeech)];
                        case 5:
                            _b = _e.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            _b = result === null || result === void 0 ? void 0 : result.partOfSpeech;
                            _e.label = 7;
                        case 7:
                            translatedPartOfSpeech = _b;
                            if (!examples.length) return [3 /*break*/, 9];
                            return [4 /*yield*/, Promise.all(examples.map(function (example) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        // Keep raw verse references unchanged.
                                        if (this.looksLikeVerseReference(example))
                                            return [2 /*return*/, example];
                                        return [2 /*return*/, this.translateTextToSpanish(example)];
                                    });
                                }); }))];
                        case 8:
                            _c = _e.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            _c = result === null || result === void 0 ? void 0 : result.examples;
                            _e.label = 10;
                        case 10:
                            translatedExamples = _c;
                            return [2 /*return*/, __assign(__assign({}, result), { definition: translatedDefinition !== null && translatedDefinition !== void 0 ? translatedDefinition : result.definition, partOfSpeech: translatedPartOfSpeech !== null && translatedPartOfSpeech !== void 0 ? translatedPartOfSpeech : result.partOfSpeech, examples: Array.isArray(translatedExamples) ? translatedExamples : result.examples })];
                        case 11:
                            _d = _e.sent();
                            return [2 /*return*/, result];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureService_1.prototype.localizeWordStudyInsights = function (insights, targetLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                var localized, _a, _b, translatedGrammar, _i, _c, _d, key, value, _e, _f, _g, _h, _j;
                var _this = this;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            if (targetLanguage !== 'es') {
                                return [2 /*return*/, insights];
                            }
                            if (!insights || typeof insights !== 'object' || Array.isArray(insights)) {
                                return [2 /*return*/, insights];
                            }
                            _k.label = 1;
                        case 1:
                            _k.trys.push([1, 16, , 17]);
                            localized = __assign({}, insights);
                            if (!(typeof localized.rootWord === 'string')) return [3 /*break*/, 3];
                            _a = localized;
                            return [4 /*yield*/, this.translateTextToSpanish(localized.rootWord)];
                        case 2:
                            _a.rootWord = _k.sent();
                            _k.label = 3;
                        case 3:
                            if (!Array.isArray(localized.semanticRange)) return [3 /*break*/, 5];
                            _b = localized;
                            return [4 /*yield*/, Promise.all(localized.semanticRange.map(function (item) { return _this.translateTextToSpanish(String(item)); }))];
                        case 4:
                            _b.semanticRange = _k.sent();
                            _k.label = 5;
                        case 5:
                            if (!(localized.grammarInsights && typeof localized.grammarInsights === 'object')) return [3 /*break*/, 11];
                            translatedGrammar = {};
                            _i = 0, _c = Object.entries(localized.grammarInsights);
                            _k.label = 6;
                        case 6:
                            if (!(_i < _c.length)) return [3 /*break*/, 10];
                            _d = _c[_i], key = _d[0], value = _d[1];
                            if (!(typeof value === 'string')) return [3 /*break*/, 8];
                            _e = translatedGrammar;
                            _f = key;
                            return [4 /*yield*/, this.translateTextToSpanish(value)];
                        case 7:
                            _e[_f] = _k.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            translatedGrammar[key] = value;
                            _k.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 6];
                        case 10:
                            localized.grammarInsights = translatedGrammar;
                            _k.label = 11;
                        case 11:
                            if (!Array.isArray(localized.nuanceNotes)) return [3 /*break*/, 13];
                            _g = localized;
                            return [4 /*yield*/, Promise.all(localized.nuanceNotes.map(function (item) { return _this.translateTextToSpanish(String(item)); }))];
                        case 12:
                            _g.nuanceNotes = _k.sent();
                            _k.label = 13;
                        case 13:
                            if (!Array.isArray(localized.commonTranslations)) return [3 /*break*/, 15];
                            _h = localized;
                            return [4 /*yield*/, Promise.all(localized.commonTranslations.map(function (item) { return _this.translateTextToSpanish(String(item)); }))];
                        case 14:
                            _h.commonTranslations = _k.sent();
                            _k.label = 15;
                        case 15: 
                        // exampleReferences are references and should remain unchanged
                        return [2 /*return*/, localized];
                        case 16:
                            _j = _k.sent();
                            return [2 /*return*/, insights];
                        case 17: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureService_1.prototype.looksLikeVerseReference = function (value) {
            if (!value)
                return false;
            return /[A-Za-zÁÉÍÓÚáéíóúñÑ]+\s+\d+:\d+/.test(value) || /^[A-Z0-9]{2,5}\.\d+\.\d+/.test(value);
        };
        ScriptureService_1.prototype.translateTextToSpanish = function (text) {
            return __awaiter(this, void 0, void 0, function () {
                var input, prompt, response, normalized, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            input = String(text || '').trim();
                            if (!input)
                                return [2 /*return*/, input];
                            prompt = scripture_prompts_1.ScripturePrompts.translateTextToSpanish(input);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, 'system', {
                                    temperature: 0.1,
                                    maxTokens: 220,
                                })];
                        case 2:
                            response = _b.sent();
                            this.logWordStudyLlmOutput('word-study-translate', response);
                            normalized = String(response || '').trim();
                            return [2 /*return*/, normalized || input];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, input];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureService_1.prototype.ensureGrammarInsights = function (payload, partOfSpeech, targetLanguage) {
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
                return payload;
            }
            var grammar = payload.grammarInsights && typeof payload.grammarInsights === 'object'
                ? __assign({}, payload.grammarInsights) : {};
            var isNoun = /noun|sustantivo/i.test(partOfSpeech || '');
            var notApplicable = targetLanguage === 'es' ? 'No aplica (sustantivo)' : 'Not applicable (noun)';
            var unknown = targetLanguage === 'es' ? 'No especificado' : 'Not specified';
            var normalized = {
                tense: this.normalizeGrammarValue(grammar.tense, isNoun ? notApplicable : unknown),
                voice: this.normalizeGrammarValue(grammar.voice, isNoun ? notApplicable : unknown),
                mood: this.normalizeGrammarValue(grammar.mood, isNoun ? notApplicable : unknown),
                case: this.normalizeGrammarValue(grammar.case, unknown),
                number: this.normalizeGrammarValue(grammar.number, unknown),
                gender: this.normalizeGrammarValue(grammar.gender, unknown),
                notes: this.normalizeGrammarValue(grammar.notes, unknown),
            };
            return __assign(__assign({}, payload), { grammarInsights: normalized });
        };
        ScriptureService_1.prototype.normalizeGrammarValue = function (value, fallback) {
            var normalized = String(value !== null && value !== void 0 ? value : '').trim();
            if (!normalized || normalized.toLowerCase() === 'n/a') {
                return fallback;
            }
            return normalized;
        };
        ScriptureService_1.prototype.logWordStudyLlmOutput = function (tag, output) {
            if (process.env.LOG_LLM_REQUESTS === 'true' || process.env.LOG_WORD_STUDY_LLM === 'true') {
                console.log("[LLM ".concat(tag, "]"), String(output || '').slice(0, 2000));
            }
        };
        ScriptureService_1.prototype.resolveResponseLanguage = function (value) {
            var normalized = String(value || '').trim().toLowerCase();
            if (!normalized)
                return 'en';
            if (normalized.startsWith('es') ||
                normalized.includes('spanish') ||
                normalized.includes('espanol') ||
                normalized.includes('español')) {
                return 'es';
            }
            return 'en';
        };
        ScriptureService_1.prototype.resolveOriginalScript = function (lemma, word, language) {
            var normalizedLanguage = String(language || '').toLowerCase();
            var lemmaValue = String(lemma || '').trim();
            var wordValue = String(word || '').trim();
            var source = lemmaValue || wordValue;
            if (!source)
                return null;
            if (normalizedLanguage === 'greek') {
                if (this.containsGreek(source))
                    return source;
                if (this.containsGreek(wordValue))
                    return wordValue;
                return this.transliterateLatinToGreekApprox(source);
            }
            return null;
        };
        ScriptureService_1.prototype.resolveTransliteration = function (current, lemma, word, language) {
            var existing = String(current || '').trim();
            if (existing && existing !== word) {
                return existing;
            }
            var normalizedLanguage = String(language || '').toLowerCase();
            var seed = String(lemma || word || '').trim();
            if (!seed)
                return existing || word;
            if (normalizedLanguage === 'greek' || this.containsGreek(seed)) {
                var greekSource = this.containsGreek(seed) ? seed : String(word || '');
                var transliterated = this.transliterateGreekToLatin(greekSource);
                return transliterated || existing || word;
            }
            return existing || word;
        };
        ScriptureService_1.prototype.containsGreek = function (value) {
            return /[\u0370-\u03FF\u1F00-\u1FFF]/.test(String(value || ''));
        };
        ScriptureService_1.prototype.transliterateGreekToLatin = function (value) {
            var _a;
            var map = {
                α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'e', θ: 'th',
                ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', π: 'p',
                ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'u', φ: 'ph', χ: 'ch', ψ: 'ps',
                ω: 'o', Α: 'A', Β: 'B', Γ: 'G', Δ: 'D', Ε: 'E', Ζ: 'Z', Η: 'E',
                Θ: 'Th', Ι: 'I', Κ: 'K', Λ: 'L', Μ: 'M', Ν: 'N', Ξ: 'X', Ο: 'O',
                Π: 'P', Ρ: 'R', Σ: 'S', Τ: 'T', Υ: 'U', Φ: 'Ph', Χ: 'Ch', Ψ: 'Ps', Ω: 'O',
                ά: 'a', έ: 'e', ή: 'e', ί: 'i', ό: 'o', ύ: 'u', ώ: 'o',
                ϊ: 'i', ϋ: 'u', ΐ: 'i', ΰ: 'u',
                ἀ: 'a', ἁ: 'ha', ἄ: 'a', ἅ: 'ha', ἆ: 'a', ἇ: 'ha',
                ἐ: 'e', ἑ: 'he', ἔ: 'e', ἕ: 'he',
                ἠ: 'e', ἡ: 'he', ἤ: 'e', ἥ: 'he', ἦ: 'e', ἧ: 'he',
                ἰ: 'i', ἱ: 'hi', ἴ: 'i', ἵ: 'hi', ἶ: 'i', ἷ: 'hi',
                ὀ: 'o', ὁ: 'ho', ὄ: 'o', ὅ: 'ho',
                ὐ: 'u', ὑ: 'hu', ὔ: 'u', ὕ: 'hu', ὖ: 'u', ὗ: 'hu',
                ὠ: 'o', ὡ: 'ho', ὤ: 'o', ὥ: 'ho', ὦ: 'o', ὧ: 'ho',
            };
            var source = String(value || '').trim();
            if (!source)
                return '';
            var normalized = source.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            var out = '';
            for (var i = 0; i < normalized.length; i++) {
                var ch = normalized[i];
                var next = normalized[i + 1];
                var digraph = "".concat(ch).concat(next || '');
                var lowerDigraph = digraph.toLowerCase();
                if (lowerDigraph === 'αι') {
                    out += ch === ch.toUpperCase() ? 'Ai' : 'ai';
                    i++;
                    continue;
                }
                if (lowerDigraph === 'ει') {
                    out += ch === ch.toUpperCase() ? 'Ei' : 'ei';
                    i++;
                    continue;
                }
                if (lowerDigraph === 'οι') {
                    out += ch === ch.toUpperCase() ? 'Oi' : 'oi';
                    i++;
                    continue;
                }
                if (lowerDigraph === 'ου') {
                    out += ch === ch.toUpperCase() ? 'Ou' : 'ou';
                    i++;
                    continue;
                }
                if (lowerDigraph === 'υι') {
                    out += ch === ch.toUpperCase() ? 'Ui' : 'ui';
                    i++;
                    continue;
                }
                if (lowerDigraph === 'ευ') {
                    out += ch === ch.toUpperCase() ? 'Eu' : 'eu';
                    i++;
                    continue;
                }
                if (lowerDigraph === 'αυ') {
                    out += ch === ch.toUpperCase() ? 'Au' : 'au';
                    i++;
                    continue;
                }
                out += (_a = map[ch]) !== null && _a !== void 0 ? _a : ch;
            }
            return out.trim();
        };
        ScriptureService_1.prototype.transliterateLatinToGreekApprox = function (value) {
            var _a;
            var raw = String(value || '').trim().toLowerCase();
            if (!raw)
                return '';
            // Keep letters only for transliteration heuristics.
            var source = raw.replace(/[^a-z]/g, '');
            if (!source)
                return '';
            var result = '';
            var i = 0;
            while (i < source.length) {
                var pair = source.slice(i, i + 2);
                var tri = source.slice(i, i + 3);
                if (tri === 'psa' || pair === 'ps') {
                    result += 'ψ';
                    i += 2;
                    continue;
                }
                if (pair === 'ph') {
                    result += 'φ';
                    i += 2;
                    continue;
                }
                if (pair === 'th') {
                    result += 'θ';
                    i += 2;
                    continue;
                }
                if (pair === 'ch') {
                    result += 'χ';
                    i += 2;
                    continue;
                }
                if (pair === 'ou') {
                    result += 'ου';
                    i += 2;
                    continue;
                }
                if (pair === 'ei') {
                    result += 'ει';
                    i += 2;
                    continue;
                }
                if (pair === 'oi') {
                    result += 'οι';
                    i += 2;
                    continue;
                }
                if (pair === 'ai') {
                    result += 'αι';
                    i += 2;
                    continue;
                }
                var ch = source[i];
                var mapped = {
                    a: 'α', b: 'β', c: 'κ', d: 'δ', e: 'ε', f: 'φ', g: 'γ', h: 'η',
                    i: 'ι', j: 'ι', k: 'κ', l: 'λ', m: 'μ', n: 'ν', o: 'ο', p: 'π',
                    q: 'κ', r: 'ρ', s: 'σ', t: 'τ', u: 'υ', v: 'β', w: 'ω', x: 'ξ',
                    y: 'υ', z: 'ζ',
                };
                result += (_a = mapped[ch]) !== null && _a !== void 0 ? _a : ch;
                i += 1;
            }
            // Prefer final sigma at end.
            result = result.replace(/σ$/g, 'ς');
            return result;
        };
        ScriptureService_1.prototype.normalizeReferenceForLookup = function (reference) {
            var value = String(reference || '').trim().replace(/\u2013|\u2014/g, '-');
            if (!value)
                return value;
            // Already standard "Book 1:1-2"
            if (/\s+\d+(?::\d+(?:-\d+)?)?$/.test(value)) {
                return value;
            }
            // Dot formats in cross-reference dataset, e.g. Ps.4.3 or Isa.2.3-Isa.2.5
            var dottedSingle = value.match(/^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)$/);
            var dottedRange = value.match(/^([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)-([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)$/);
            var bookMap = {
                Gen: 'Genesis',
                Exod: 'Exodus',
                Lev: 'Leviticus',
                Num: 'Numbers',
                Deut: 'Deuteronomy',
                Josh: 'Joshua',
                Judg: 'Judges',
                Ruth: 'Ruth',
                '1Sam': '1 Samuel',
                '2Sam': '2 Samuel',
                '1Kgs': '1 Kings',
                '2Kgs': '2 Kings',
                '1Chr': '1 Chronicles',
                '2Chr': '2 Chronicles',
                Ezra: 'Ezra',
                Neh: 'Nehemiah',
                Esth: 'Esther',
                Job: 'Job',
                Ps: 'Psalms',
                Prov: 'Proverbs',
                Eccl: 'Ecclesiastes',
                Song: 'Song of Songs',
                Isa: 'Isaiah',
                Jer: 'Jeremiah',
                Lam: 'Lamentations',
                Ezek: 'Ezekiel',
                Dan: 'Daniel',
                Hos: 'Hosea',
                Joel: 'Joel',
                Amos: 'Amos',
                Obad: 'Obadiah',
                Jonah: 'Jonah',
                Mic: 'Micah',
                Nah: 'Nahum',
                Hab: 'Habakkuk',
                Zeph: 'Zephaniah',
                Hag: 'Haggai',
                Zech: 'Zechariah',
                Mal: 'Malachi',
                Matt: 'Matthew',
                Mark: 'Mark',
                Luke: 'Luke',
                John: 'John',
                Acts: 'Acts',
                Rom: 'Romans',
                '1Cor': '1 Corinthians',
                '2Cor': '2 Corinthians',
                Gal: 'Galatians',
                Eph: 'Ephesians',
                Phil: 'Philippians',
                Col: 'Colossians',
                '1Thess': '1 Thessalonians',
                '2Thess': '2 Thessalonians',
                '1Tim': '1 Timothy',
                '2Tim': '2 Timothy',
                Titus: 'Titus',
                Phlm: 'Philemon',
                Heb: 'Hebrews',
                Jas: 'James',
                '1Pet': '1 Peter',
                '2Pet': '2 Peter',
                '1John': '1 John',
                '2John': '2 John',
                '3John': '3 John',
                Jude: 'Jude',
                Rev: 'Revelation',
            };
            if (dottedSingle) {
                var bookAbbr = dottedSingle[1], chapter = dottedSingle[2], verse = dottedSingle[3];
                var book = bookMap[bookAbbr] || bookAbbr;
                return "".concat(book, " ").concat(chapter, ":").concat(verse);
            }
            if (dottedRange) {
                var startBook = dottedRange[1], startChapter = dottedRange[2], startVerse = dottedRange[3], endBook = dottedRange[4], endChapter = dottedRange[5], endVerse = dottedRange[6];
                var startBookName = bookMap[startBook] || startBook;
                var endBookName = bookMap[endBook] || endBook;
                if (startBook === endBook && startChapter === endChapter) {
                    return "".concat(startBookName, " ").concat(startChapter, ":").concat(startVerse, "-").concat(endVerse);
                }
                return "".concat(startBookName, " ").concat(startChapter, ":").concat(startVerse, "-").concat(endBookName, " ").concat(endChapter, ":").concat(endVerse);
            }
            return value;
        };
        ScriptureService_1.prototype.getPassageText = function (passage) {
            if (!Array.isArray(passage === null || passage === void 0 ? void 0 : passage.verses))
                return '';
            return passage.verses.map(function (verse) { return String((verse === null || verse === void 0 ? void 0 : verse.text) || ''); }).join(' ').trim();
        };
        ScriptureService_1.prototype.normalizeVerseReference = function (reference) {
            if (!reference)
                return reference;
            var cleaned = reference.replace(/\u2013|\u2014/g, '-').trim();
            if (!cleaned)
                return reference;
            // If already in dot format (Gen.1.1), just clean spaces
            if (cleaned.includes('.') && /\d/.test(cleaned)) {
                return cleaned.replace(/\s+/g, '');
            }
            // Parse "Book Chapter:Verse" or "Book Chapter" format
            var match = cleaned.match(/^(.*?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
            if (!match) {
                // Fallback: replace spaces and colons with dots
                return cleaned.replace(/\s+/g, '').replace(/:/g, '.');
            }
            var rawBook = match[1].trim();
            var chapter = match[2];
            var verse = match[3];
            var verseEnd = match[4];
            // Normalize book name using the map
            var normalizedBookKey = rawBook.toLowerCase().replace(/[^a-z0-9]/g, '');
            var book = this.verseBookMap.get(normalizedBookKey) || rawBook.replace(/\s+/g, '');
            // Build reference in dot format
            if (verseEnd) {
                return "".concat(book, ".").concat(chapter, ".").concat(verse, "-").concat(book, ".").concat(chapter, ".").concat(verseEnd);
            }
            else if (verse) {
                return "".concat(book, ".").concat(chapter, ".").concat(verse);
            }
            else {
                return "".concat(book, ".").concat(chapter);
            }
        };
        ScriptureService_1.prototype.buildCrossReferenceLookupKeys = function (rawReference, normalizedReference) {
            var keys = new Set();
            var raw = String(rawReference || '').trim();
            var normalized = String(normalizedReference || '').trim();
            if (raw)
                keys.add(raw);
            if (normalized)
                keys.add(normalized);
            // If range (e.g. Eph.2.1-Eph.2.10), also query each verse key and the range start.
            var rangeMatch = normalized.match(/^([A-Za-z0-9]+)\.(\d+)\.(\d+)-([A-Za-z0-9]+)\.(\d+)\.(\d+)$/);
            if (rangeMatch) {
                var startBook = rangeMatch[1];
                var startChapter = Number(rangeMatch[2]);
                var startVerse = Number(rangeMatch[3]);
                var endBook = rangeMatch[4];
                var endChapter = Number(rangeMatch[5]);
                var endVerse = Number(rangeMatch[6]);
                // Only expand straightforward single-book/single-chapter ranges.
                if (startBook === endBook &&
                    Number.isFinite(startChapter) &&
                    Number.isFinite(startVerse) &&
                    Number.isFinite(endChapter) &&
                    Number.isFinite(endVerse) &&
                    startChapter === endChapter &&
                    endVerse >= startVerse &&
                    endVerse - startVerse <= 60) {
                    for (var v = startVerse; v <= endVerse; v += 1) {
                        keys.add("".concat(startBook, ".").concat(startChapter, ".").concat(v));
                    }
                }
                keys.add("".concat(startBook, ".").concat(startChapter, ".").concat(startVerse));
                keys.add("".concat(startBook, ".").concat(startChapter));
            }
            // If single verse, also try chapter key.
            var singleVerseMatch = normalized.match(/^([A-Za-z0-9]+)\.(\d+)\.(\d+)$/);
            if (singleVerseMatch) {
                keys.add("".concat(singleVerseMatch[1], ".").concat(singleVerseMatch[2]));
            }
            return Array.from(keys);
        };
        return ScriptureService_1;
    }());
    __setFunctionName(_classThis, "ScriptureService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScriptureService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScriptureService = _classThis;
}();
exports.ScriptureService = ScriptureService;
