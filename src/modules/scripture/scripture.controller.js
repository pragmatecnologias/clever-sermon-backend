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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.ScriptureController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var ScriptureController = function () {
    var _classDecorators = [(0, common_1.Controller)('scripture'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getPassage_decorators;
    var _getPassageWithContext_decorators;
    var _getParallelPassages_decorators;
    var _getCrossReferences_decorators;
    var _getAudioBibles_decorators;
    var _getAudioBible_decorators;
    var _getAudioChapter_decorators;
    var _getAudioChapters_decorators;
    var _getCrossReferenceDetails_decorators;
    var _getWordStudy_decorators;
    var _getWordStudyInsights_decorators;
    var _getWordStudySuggestions_decorators;
    var _searchScripture_decorators;
    var _getTranslations_decorators;
    var _getContext_decorators;
    var _compareTranslations_decorators;
    var _getMorphology_decorators;
    var _extractThemes_decorators;
    var _analyzeEvidence_decorators;
    var _checkIntegrity_decorators;
    var _getRankedCrossReferences_decorators;
    var _getSOPLinkedCrossReferences_decorators;
    var _getOutlineCrossReferenceMap_decorators;
    var _getTopCrossReferences_decorators;
    var _getCrossReferenceEdges_decorators;
    var _getInterpretiveHighlights_decorators;
    var _getFormattedHighlights_decorators;
    var _getSDAContextualReferences_decorators;
    var _getSDAInterpretiveFrame_decorators;
    var _validateCitation_decorators;
    var _validateCitationsBulk_decorators;
    var _getVerseCommentary_decorators;
    var _getMorphologyData_decorators;
    var _getCanonicalThemes_decorators;
    var _getSanctuaryConnections_decorators;
    var _getProphecyConnections_decorators;
    var _getAllSanctuaryThreads_decorators;
    var _getAllProphecyThreads_decorators;
    var _getStructuralAnalysis_decorators;
    var _getInterpretiveChallenge_decorators;
    var _getInterpretiveChallenges_decorators;
    var _getWordStudyEnhanced_decorators;
    var _searchWordByLemma_decorators;
    var _getVerseContext_decorators;
    var _getPassageSummary_decorators;
    var _getStudySynthesis_decorators;
    var _getEnhancedTranslationComparison_decorators;
    var _getScriptureHtmlPage_decorators;
    var ScriptureController = _classThis = /** @class */ (function () {
        function ScriptureController_1(scriptureService, audioBibleService, translationComparisonService, morphologyService, themeExtractionService, evidenceMapService, crossReferenceRankingService, interpretiveHighlightsService, sdaCrossReferencesService, citationValidatorService, verseCommentaryService, morphologyDataService, canonicalThemeTracerService, sanctuaryProphecyMapperService, structuralAnalysisDataService, interpretiveChallengesDataService, wordStudyEnhancedService, perVerseContextService, translationComparisonEnhancedService, passageSummaryService, studySynthesisService) {
            this.scriptureService = (__runInitializers(this, _instanceExtraInitializers), scriptureService);
            this.audioBibleService = audioBibleService;
            this.translationComparisonService = translationComparisonService;
            this.morphologyService = morphologyService;
            this.themeExtractionService = themeExtractionService;
            this.evidenceMapService = evidenceMapService;
            this.crossReferenceRankingService = crossReferenceRankingService;
            this.interpretiveHighlightsService = interpretiveHighlightsService;
            this.sdaCrossReferencesService = sdaCrossReferencesService;
            this.citationValidatorService = citationValidatorService;
            this.verseCommentaryService = verseCommentaryService;
            this.morphologyDataService = morphologyDataService;
            this.canonicalThemeTracerService = canonicalThemeTracerService;
            this.sanctuaryProphecyMapperService = sanctuaryProphecyMapperService;
            this.structuralAnalysisDataService = structuralAnalysisDataService;
            this.interpretiveChallengesDataService = interpretiveChallengesDataService;
            this.wordStudyEnhancedService = wordStudyEnhancedService;
            this.perVerseContextService = perVerseContextService;
            this.translationComparisonEnhancedService = translationComparisonEnhancedService;
            this.passageSummaryService = passageSummaryService;
            this.studySynthesisService = studySynthesisService;
        }
        ScriptureController_1.prototype.getPassage = function (reference, translation) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.scriptureService.getPassage(reference, translation)];
                });
            });
        };
        ScriptureController_1.prototype.getPassageWithContext = function (reference, translation, contextRange) {
            return __awaiter(this, void 0, void 0, function () {
                var range;
                return __generator(this, function (_a) {
                    range = contextRange ? Number(contextRange) : undefined;
                    return [2 /*return*/, this.scriptureService.getPassageWithContext(reference, translation, range)];
                });
            });
        };
        ScriptureController_1.prototype.getParallelPassages = function (reference, translations, contextRange) {
            return __awaiter(this, void 0, void 0, function () {
                var list, range;
                return __generator(this, function (_a) {
                    list = translations ? translations.split(',').map(function (item) { return item.trim(); }).filter(Boolean) : [];
                    range = contextRange ? Number(contextRange) : undefined;
                    return [2 /*return*/, this.scriptureService.getParallelPassages(reference, list, range)];
                });
            });
        };
        ScriptureController_1.prototype.getCrossReferences = function (verse) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.scriptureService.getCrossReferences(verse)];
                });
            });
        };
        ScriptureController_1.prototype.getAudioBibles = function (language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.audioBibleService.getAudioBibles(language)];
                });
            });
        };
        ScriptureController_1.prototype.getAudioBible = function (audioBibleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.audioBibleService.getAudioBible(audioBibleId)];
                });
            });
        };
        ScriptureController_1.prototype.getAudioChapter = function (audioBibleId, chapterId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.audioBibleService.getAudioChapter(audioBibleId, chapterId)];
                });
            });
        };
        ScriptureController_1.prototype.getAudioChapters = function (audioBibleId, bookId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.audioBibleService.getAudioChapters(audioBibleId, bookId)];
                });
            });
        };
        ScriptureController_1.prototype.getCrossReferenceDetails = function (verse, category) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.scriptureService.getCrossReferenceDetails(verse, category)];
                });
            });
        };
        ScriptureController_1.prototype.getWordStudy = function (word, language, responseLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.scriptureService.getWordStudy(word, language, responseLanguage)];
                });
            });
        };
        ScriptureController_1.prototype.getWordStudyInsights = function (word, language, context, responseLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.scriptureService.getWordStudyInsights(word, language, context, responseLanguage)];
                });
            });
        };
        ScriptureController_1.prototype.getWordStudySuggestions = function (reference, translation, language, responseLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.scriptureService.getWordStudySuggestions(reference, translation || 'KJV', language || 'greek', responseLanguage)];
                });
            });
        };
        ScriptureController_1.prototype.searchScripture = function (query, translation) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.scriptureService.searchScripture(query, translation)];
                });
            });
        };
        ScriptureController_1.prototype.getTranslations = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.scriptureService.getTranslations()];
                });
            });
        };
        ScriptureController_1.prototype.getContext = function (book, reference) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            target = book || (reference ? reference.split(' ')[0] : null);
                            if (!target)
                                return [2 /*return*/, { book: null, metadata: null, historical: null, cultural: null, timeline: null, geography: null }];
                            _a = {
                                book: target
                            };
                            return [4 /*yield*/, this.scriptureService.getBookMetadata(target)];
                        case 1:
                            _a.metadata = _b.sent();
                            return [4 /*yield*/, this.scriptureService.getHistoricalContext(target)];
                        case 2:
                            _a.historical = _b.sent();
                            return [4 /*yield*/, this.scriptureService.getCulturalContext(target)];
                        case 3:
                            _a.cultural = _b.sent();
                            return [4 /*yield*/, this.scriptureService.getTimeline(target)];
                        case 4:
                            _a.timeline = _b.sent();
                            return [4 /*yield*/, this.scriptureService.getGeography(target)];
                        case 5: return [2 /*return*/, (_a.geography = _b.sent(),
                                _a)];
                    }
                });
            });
        };
        ScriptureController_1.prototype.compareTranslations = function (reference, translations, highlightMode) {
            return __awaiter(this, void 0, void 0, function () {
                var translationList;
                return __generator(this, function (_a) {
                    translationList = translations.split(',').map(function (t) { return t.trim(); });
                    return [2 /*return*/, this.translationComparisonService.compareTranslations(reference, translationList, highlightMode)];
                });
            });
        };
        ScriptureController_1.prototype.getMorphology = function (word, language) {
            return __awaiter(this, void 0, void 0, function () {
                var morphology, explanation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.morphologyService.getMorphology(word, language)];
                        case 1:
                            morphology = _a.sent();
                            if (!morphology) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.morphologyService.getParsingExplanation(morphology.parsing)];
                        case 2:
                            explanation = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, morphology), { parsingExplanation: explanation })];
                        case 3: return [2 /*return*/, null];
                    }
                });
            });
        };
        ScriptureController_1.prototype.extractThemes = function (reference, translation) {
            return __awaiter(this, void 0, void 0, function () {
                var passage, themes, covenantThreads;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.scriptureService.getPassage(reference, translation)];
                        case 1:
                            passage = _a.sent();
                            if (!(passage === null || passage === void 0 ? void 0 : passage.verses))
                                return [2 /*return*/, { themes: [], covenantThreads: [] }];
                            themes = this.themeExtractionService.extractThemes(passage.verses);
                            covenantThreads = this.themeExtractionService.extractCovenantThreads(passage.verses);
                            return [2 /*return*/, { themes: themes, covenantThreads: covenantThreads }];
                    }
                });
            });
        };
        ScriptureController_1.prototype.analyzeEvidence = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.evidenceMapService.analyzeSermonEvidence(body.sermonPoints, body.mainPassage, body.additionalPassages || [])];
                });
            });
        };
        ScriptureController_1.prototype.checkIntegrity = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.evidenceMapService.checkPassageIntegrity(body.outlinePoints, body.applications, body.mainPassage, body.crossReferences)];
                });
            });
        };
        ScriptureController_1.prototype.getRankedCrossReferences = function (verse) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.crossReferenceRankingService.getRankedCrossReferences(verse)];
                });
            });
        };
        ScriptureController_1.prototype.getSOPLinkedCrossReferences = function (verse, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.crossReferenceRankingService.getSOPLinkedCrossReferences(verse, language || 'en')];
                });
            });
        };
        ScriptureController_1.prototype.getOutlineCrossReferenceMap = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.crossReferenceRankingService.mapCrossReferencesToOutlinePoints((body === null || body === void 0 ? void 0 : body.verse) || '', Array.isArray(body === null || body === void 0 ? void 0 : body.points) ? body.points : [])];
                });
            });
        };
        ScriptureController_1.prototype.getTopCrossReferences = function (verse, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var limitNum;
                return __generator(this, function (_a) {
                    limitNum = limit ? parseInt(limit) : 3;
                    return [2 /*return*/, this.crossReferenceRankingService.getTopCrossReferences(verse, limitNum)];
                });
            });
        };
        ScriptureController_1.prototype.getCrossReferenceEdges = function (verse) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.crossReferenceRankingService.getCrossReferenceEdges(verse)];
                });
            });
        };
        ScriptureController_1.prototype.getInterpretiveHighlights = function (reference, text) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.interpretiveHighlightsService.getInterpretiveHighlights(reference, text)];
                });
            });
        };
        ScriptureController_1.prototype.getFormattedHighlights = function (reference, text) {
            return __awaiter(this, void 0, void 0, function () {
                var highlights;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.interpretiveHighlightsService.getInterpretiveHighlights(reference, text)];
                        case 1:
                            highlights = _a.sent();
                            return [2 /*return*/, this.interpretiveHighlightsService.formatHighlightedText(text, highlights)];
                    }
                });
            });
        };
        ScriptureController_1.prototype.getSDAContextualReferences = function (passage, text) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sdaCrossReferencesService.getContextualReferences(passage, text)];
                });
            });
        };
        ScriptureController_1.prototype.getSDAInterpretiveFrame = function (passage) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            passage: passage,
                            frame: this.sdaCrossReferencesService.getInterpretiveFrame(passage)
                        }];
                });
            });
        };
        ScriptureController_1.prototype.validateCitation = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.citationValidatorService.validateCitation(body.statement, body.verseReference, body.translation || 'KJV')];
                });
            });
        };
        ScriptureController_1.prototype.validateCitationsBulk = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.citationValidatorService.validateMultipleCitations(body.citations, body.translation || 'KJV')];
                });
            });
        };
        ScriptureController_1.prototype.getVerseCommentary = function (reference, force, language, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, forceRegenerate;
                var _a, _b;
                return __generator(this, function (_c) {
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                    forceRegenerate = force === 'true';
                    return [2 /*return*/, this.verseCommentaryService.getCommentary(reference, userId, forceRegenerate, language || 'en')];
                });
            });
        };
        ScriptureController_1.prototype.getMorphologyData = function (word, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.morphologyDataService.getMorphology(word, language)];
                });
            });
        };
        ScriptureController_1.prototype.getCanonicalThemes = function (reference, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.canonicalThemeTracerService.getThemesForPassage(reference, language)];
                });
            });
        };
        ScriptureController_1.prototype.getSanctuaryConnections = function (passage, language, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, error_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!passage || !String(passage).trim()) {
                                throw new common_1.BadRequestException('Missing required passage parameter');
                            }
                            userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || 'system';
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.sanctuaryProphecyMapperService.getSanctuaryConnections(passage, language || 'en', userId)];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            error_1 = _c.sent();
                            throw new common_1.InternalServerErrorException((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unable to generate sanctuary connections');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureController_1.prototype.getProphecyConnections = function (passage, language, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, error_2;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!passage || !String(passage).trim()) {
                                throw new common_1.BadRequestException('Missing required passage parameter');
                            }
                            userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || 'system';
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.sanctuaryProphecyMapperService.getProphecyConnections(passage, language || 'en', userId)];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            error_2 = _c.sent();
                            throw new common_1.InternalServerErrorException((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'Unable to generate prophecy connections');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureController_1.prototype.getAllSanctuaryThreads = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sanctuaryProphecyMapperService.getAllSanctuaryThreads()];
                });
            });
        };
        ScriptureController_1.prototype.getAllProphecyThreads = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sanctuaryProphecyMapperService.getAllProphecyThreads()];
                });
            });
        };
        ScriptureController_1.prototype.getStructuralAnalysis = function (reference, passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var ref;
                return __generator(this, function (_a) {
                    ref = reference || passage;
                    if (!ref) {
                        throw new Error('Missing reference or passage parameter');
                    }
                    return [2 /*return*/, this.structuralAnalysisDataService.getStructuralAnalysis(ref, language || 'en')];
                });
            });
        };
        ScriptureController_1.prototype.getInterpretiveChallenge = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.interpretiveChallengesDataService.getInterpretiveChallenge(passage, language || 'en')];
                });
            });
        };
        ScriptureController_1.prototype.getInterpretiveChallenges = function (reference, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.interpretiveChallengesDataService.getInterpretiveChallenge(reference, language || 'en')];
                });
            });
        };
        ScriptureController_1.prototype.getWordStudyEnhanced = function (strongs) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.wordStudyEnhancedService.getWordStudy(strongs)];
                });
            });
        };
        ScriptureController_1.prototype.searchWordByLemma = function (lemma, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.wordStudyEnhancedService.searchByLemma(lemma, language)];
                });
            });
        };
        ScriptureController_1.prototype.getVerseContext = function (reference, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.perVerseContextService.getVerseContext(reference, language || 'en')];
                });
            });
        };
        ScriptureController_1.prototype.getPassageSummary = function (reference, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.passageSummaryService.getPassageSummary(reference, undefined, language || 'en')];
                });
            });
        };
        ScriptureController_1.prototype.getStudySynthesis = function (reference, language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.studySynthesisService.getStudySynthesis(reference, undefined, language || 'en')];
                });
            });
        };
        ScriptureController_1.prototype.getEnhancedTranslationComparison = function (reference, req, language) {
            return __awaiter(this, void 0, void 0, function () {
                var userId;
                var _a, _b;
                return __generator(this, function (_c) {
                    userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                    return [2 /*return*/, this.translationComparisonEnhancedService.getEnhancedComparison(reference, language || 'en', userId)];
                });
            });
        };
        // IMPORTANT: This wildcard route MUST be last to avoid catching other routes
        ScriptureController_1.prototype.getScriptureHtmlPage = function (reference_1) {
            return __awaiter(this, arguments, void 0, function (reference, translation, res) {
                var decodedReference, normalizedReference, passage, html;
                if (translation === void 0) { translation = 'KJV'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            decodedReference = decodeURIComponent(reference);
                            normalizedReference = /\d/.test(decodedReference)
                                ? decodedReference
                                : "".concat(decodedReference, " 1");
                            return [4 /*yield*/, this.scriptureService.getPassage(normalizedReference, translation)];
                        case 1:
                            passage = _a.sent();
                            html = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>".concat(normalizedReference, " - ").concat(translation, "</title>\n  <style>\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n    body {\n      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);\n      color: #e0e0e0;\n      font-family: 'Georgia', serif;\n      padding: 2rem;\n      min-height: 100vh;\n    }\n    .container {\n      max-width: 900px;\n      margin: 0 auto;\n      background: rgba(0, 0, 0, 0.6);\n      border: 1px solid rgba(34, 211, 238, 0.3);\n      border-radius: 1rem;\n      padding: 3rem;\n      backdrop-filter: blur(10px);\n      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n    }\n    .header {\n      border-bottom: 2px solid rgba(34, 211, 238, 0.4);\n      padding-bottom: 1.5rem;\n      margin-bottom: 2rem;\n    }\n    h1 {\n      color: #22d3ee;\n      font-size: 2.5rem;\n      margin-bottom: 0.5rem;\n      text-shadow: 0 0 20px rgba(34, 211, 238, 0.5);\n    }\n    .translation {\n      color: #a78bfa;\n      font-size: 1rem;\n      text-transform: uppercase;\n      letter-spacing: 0.2em;\n      font-weight: 600;\n    }\n    .verse {\n      margin-bottom: 1.5rem;\n      padding: 1rem;\n      background: rgba(34, 211, 238, 0.05);\n      border-left: 3px solid rgba(34, 211, 238, 0.4);\n      border-radius: 0.5rem;\n      transition: all 0.3s ease;\n    }\n    .verse:hover {\n      background: rgba(34, 211, 238, 0.1);\n      border-left-color: #22d3ee;\n      transform: translateX(4px);\n    }\n    .verse-ref {\n      color: #22d3ee;\n      font-weight: bold;\n      font-size: 0.9rem;\n      margin-bottom: 0.5rem;\n      display: block;\n      font-family: 'Courier New', monospace;\n    }\n    .verse-text {\n      color: #e0e0e0;\n      line-height: 1.8;\n      font-size: 1.1rem;\n    }\n    .footer {\n      margin-top: 3rem;\n      padding-top: 1.5rem;\n      border-top: 1px solid rgba(34, 211, 238, 0.2);\n      text-align: center;\n      color: #888;\n      font-size: 0.9rem;\n    }\n    .error {\n      background: rgba(239, 68, 68, 0.1);\n      border: 1px solid rgba(239, 68, 68, 0.3);\n      color: #fca5a5;\n      padding: 2rem;\n      border-radius: 0.5rem;\n      text-align: center;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    ").concat(passage && passage.verses && passage.verses.length > 0 ? "\n    <div class=\"header\">\n      <h1>".concat(normalizedReference, "</h1>\n      <div class=\"translation\">").concat(translation, "</div>\n    </div>\n    <div class=\"verses\">\n      ").concat(passage.verses.map(function (verse) { return "\n        <div class=\"verse\">\n          <span class=\"verse-ref\">".concat(verse.reference, "</span>\n          <div class=\"verse-text\">").concat(verse.text, "</div>\n        </div>\n      "); }).join(''), "\n    </div>\n    <div class=\"footer\">\n      Clever Sermon - Scripture Study Platform\n    </div>\n    ") : "\n    <div class=\"error\">\n      <h2>Passage Not Found</h2>\n      <p>Could not retrieve: ".concat(normalizedReference, "</p>\n    </div>\n    "), "\n  </div>\n</body>\n</html>\n    ");
                            res.setHeader('Content-Type', 'text/html');
                            res.send(html);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ScriptureController_1;
    }());
    __setFunctionName(_classThis, "ScriptureController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getPassage_decorators = [(0, common_1.Get)('passage')];
        _getPassageWithContext_decorators = [(0, common_1.Get)('passage-with-context')];
        _getParallelPassages_decorators = [(0, common_1.Get)('parallel')];
        _getCrossReferences_decorators = [(0, common_1.Get)('cross-references')];
        _getAudioBibles_decorators = [(0, common_1.Get)('audio-bibles')];
        _getAudioBible_decorators = [(0, common_1.Get)('audio-bibles/:audioBibleId')];
        _getAudioChapter_decorators = [(0, common_1.Get)('audio-bibles/:audioBibleId/chapters/:chapterId')];
        _getAudioChapters_decorators = [(0, common_1.Get)('audio-bibles/:audioBibleId/books/:bookId/chapters')];
        _getCrossReferenceDetails_decorators = [(0, common_1.Get)('cross-reference-details')];
        _getWordStudy_decorators = [(0, common_1.Get)('word-study')];
        _getWordStudyInsights_decorators = [(0, common_1.Get)('word-study-insights')];
        _getWordStudySuggestions_decorators = [(0, common_1.Get)('word-study-suggestions')];
        _searchScripture_decorators = [(0, common_1.Get)('search')];
        _getTranslations_decorators = [(0, common_1.Get)('translations')];
        _getContext_decorators = [(0, common_1.Get)('context')];
        _compareTranslations_decorators = [(0, common_1.Get)('translation-comparison')];
        _getMorphology_decorators = [(0, common_1.Get)('morphology')];
        _extractThemes_decorators = [(0, common_1.Get)('theme-extraction')];
        _analyzeEvidence_decorators = [(0, common_1.Post)('evidence-map')];
        _checkIntegrity_decorators = [(0, common_1.Post)('passage-integrity')];
        _getRankedCrossReferences_decorators = [(0, common_1.Get)('cross-references-ranked')];
        _getSOPLinkedCrossReferences_decorators = [(0, common_1.Get)('cross-references-sop-linked')];
        _getOutlineCrossReferenceMap_decorators = [(0, common_1.Post)('cross-references-outline-map')];
        _getTopCrossReferences_decorators = [(0, common_1.Get)('cross-references-top')];
        _getCrossReferenceEdges_decorators = [(0, common_1.Get)('cross-references-edges')];
        _getInterpretiveHighlights_decorators = [(0, common_1.Get)('interpretive-highlights')];
        _getFormattedHighlights_decorators = [(0, common_1.Get)('interpretive-highlights-formatted')];
        _getSDAContextualReferences_decorators = [(0, common_1.Get)('sda-contextual-references')];
        _getSDAInterpretiveFrame_decorators = [(0, common_1.Get)('sda-interpretive-frame')];
        _validateCitation_decorators = [(0, common_1.Post)('validate-citation')];
        _validateCitationsBulk_decorators = [(0, common_1.Post)('validate-citations-bulk')];
        _getVerseCommentary_decorators = [(0, common_1.Get)('verse-commentary')];
        _getMorphologyData_decorators = [(0, common_1.Get)('morphology-data')];
        _getCanonicalThemes_decorators = [(0, common_1.Get)('canonical-themes')];
        _getSanctuaryConnections_decorators = [(0, common_1.Get)('sanctuary-connections')];
        _getProphecyConnections_decorators = [(0, common_1.Get)('prophecy-connections')];
        _getAllSanctuaryThreads_decorators = [(0, common_1.Get)('sanctuary-threads')];
        _getAllProphecyThreads_decorators = [(0, common_1.Get)('prophecy-threads')];
        _getStructuralAnalysis_decorators = [(0, common_1.Get)('structural-analysis')];
        _getInterpretiveChallenge_decorators = [(0, common_1.Get)('interpretive-challenge')];
        _getInterpretiveChallenges_decorators = [(0, common_1.Get)('interpretive-challenges')];
        _getWordStudyEnhanced_decorators = [(0, common_1.Get)('word-study-enhanced')];
        _searchWordByLemma_decorators = [(0, common_1.Get)('word-study-by-lemma')];
        _getVerseContext_decorators = [(0, common_1.Get)('verse-context')];
        _getPassageSummary_decorators = [(0, common_1.Get)('passage-summary')];
        _getStudySynthesis_decorators = [(0, common_1.Get)('study-synthesis')];
        _getEnhancedTranslationComparison_decorators = [(0, common_1.Get)('translation-comparison-enhanced')];
        _getScriptureHtmlPage_decorators = [(0, common_1.Get)(':reference')];
        __esDecorate(_classThis, null, _getPassage_decorators, { kind: "method", name: "getPassage", static: false, private: false, access: { has: function (obj) { return "getPassage" in obj; }, get: function (obj) { return obj.getPassage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPassageWithContext_decorators, { kind: "method", name: "getPassageWithContext", static: false, private: false, access: { has: function (obj) { return "getPassageWithContext" in obj; }, get: function (obj) { return obj.getPassageWithContext; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getParallelPassages_decorators, { kind: "method", name: "getParallelPassages", static: false, private: false, access: { has: function (obj) { return "getParallelPassages" in obj; }, get: function (obj) { return obj.getParallelPassages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCrossReferences_decorators, { kind: "method", name: "getCrossReferences", static: false, private: false, access: { has: function (obj) { return "getCrossReferences" in obj; }, get: function (obj) { return obj.getCrossReferences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAudioBibles_decorators, { kind: "method", name: "getAudioBibles", static: false, private: false, access: { has: function (obj) { return "getAudioBibles" in obj; }, get: function (obj) { return obj.getAudioBibles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAudioBible_decorators, { kind: "method", name: "getAudioBible", static: false, private: false, access: { has: function (obj) { return "getAudioBible" in obj; }, get: function (obj) { return obj.getAudioBible; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAudioChapter_decorators, { kind: "method", name: "getAudioChapter", static: false, private: false, access: { has: function (obj) { return "getAudioChapter" in obj; }, get: function (obj) { return obj.getAudioChapter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAudioChapters_decorators, { kind: "method", name: "getAudioChapters", static: false, private: false, access: { has: function (obj) { return "getAudioChapters" in obj; }, get: function (obj) { return obj.getAudioChapters; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCrossReferenceDetails_decorators, { kind: "method", name: "getCrossReferenceDetails", static: false, private: false, access: { has: function (obj) { return "getCrossReferenceDetails" in obj; }, get: function (obj) { return obj.getCrossReferenceDetails; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWordStudy_decorators, { kind: "method", name: "getWordStudy", static: false, private: false, access: { has: function (obj) { return "getWordStudy" in obj; }, get: function (obj) { return obj.getWordStudy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWordStudyInsights_decorators, { kind: "method", name: "getWordStudyInsights", static: false, private: false, access: { has: function (obj) { return "getWordStudyInsights" in obj; }, get: function (obj) { return obj.getWordStudyInsights; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWordStudySuggestions_decorators, { kind: "method", name: "getWordStudySuggestions", static: false, private: false, access: { has: function (obj) { return "getWordStudySuggestions" in obj; }, get: function (obj) { return obj.getWordStudySuggestions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchScripture_decorators, { kind: "method", name: "searchScripture", static: false, private: false, access: { has: function (obj) { return "searchScripture" in obj; }, get: function (obj) { return obj.searchScripture; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTranslations_decorators, { kind: "method", name: "getTranslations", static: false, private: false, access: { has: function (obj) { return "getTranslations" in obj; }, get: function (obj) { return obj.getTranslations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getContext_decorators, { kind: "method", name: "getContext", static: false, private: false, access: { has: function (obj) { return "getContext" in obj; }, get: function (obj) { return obj.getContext; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _compareTranslations_decorators, { kind: "method", name: "compareTranslations", static: false, private: false, access: { has: function (obj) { return "compareTranslations" in obj; }, get: function (obj) { return obj.compareTranslations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMorphology_decorators, { kind: "method", name: "getMorphology", static: false, private: false, access: { has: function (obj) { return "getMorphology" in obj; }, get: function (obj) { return obj.getMorphology; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _extractThemes_decorators, { kind: "method", name: "extractThemes", static: false, private: false, access: { has: function (obj) { return "extractThemes" in obj; }, get: function (obj) { return obj.extractThemes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _analyzeEvidence_decorators, { kind: "method", name: "analyzeEvidence", static: false, private: false, access: { has: function (obj) { return "analyzeEvidence" in obj; }, get: function (obj) { return obj.analyzeEvidence; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkIntegrity_decorators, { kind: "method", name: "checkIntegrity", static: false, private: false, access: { has: function (obj) { return "checkIntegrity" in obj; }, get: function (obj) { return obj.checkIntegrity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRankedCrossReferences_decorators, { kind: "method", name: "getRankedCrossReferences", static: false, private: false, access: { has: function (obj) { return "getRankedCrossReferences" in obj; }, get: function (obj) { return obj.getRankedCrossReferences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSOPLinkedCrossReferences_decorators, { kind: "method", name: "getSOPLinkedCrossReferences", static: false, private: false, access: { has: function (obj) { return "getSOPLinkedCrossReferences" in obj; }, get: function (obj) { return obj.getSOPLinkedCrossReferences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOutlineCrossReferenceMap_decorators, { kind: "method", name: "getOutlineCrossReferenceMap", static: false, private: false, access: { has: function (obj) { return "getOutlineCrossReferenceMap" in obj; }, get: function (obj) { return obj.getOutlineCrossReferenceMap; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTopCrossReferences_decorators, { kind: "method", name: "getTopCrossReferences", static: false, private: false, access: { has: function (obj) { return "getTopCrossReferences" in obj; }, get: function (obj) { return obj.getTopCrossReferences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCrossReferenceEdges_decorators, { kind: "method", name: "getCrossReferenceEdges", static: false, private: false, access: { has: function (obj) { return "getCrossReferenceEdges" in obj; }, get: function (obj) { return obj.getCrossReferenceEdges; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInterpretiveHighlights_decorators, { kind: "method", name: "getInterpretiveHighlights", static: false, private: false, access: { has: function (obj) { return "getInterpretiveHighlights" in obj; }, get: function (obj) { return obj.getInterpretiveHighlights; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFormattedHighlights_decorators, { kind: "method", name: "getFormattedHighlights", static: false, private: false, access: { has: function (obj) { return "getFormattedHighlights" in obj; }, get: function (obj) { return obj.getFormattedHighlights; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSDAContextualReferences_decorators, { kind: "method", name: "getSDAContextualReferences", static: false, private: false, access: { has: function (obj) { return "getSDAContextualReferences" in obj; }, get: function (obj) { return obj.getSDAContextualReferences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSDAInterpretiveFrame_decorators, { kind: "method", name: "getSDAInterpretiveFrame", static: false, private: false, access: { has: function (obj) { return "getSDAInterpretiveFrame" in obj; }, get: function (obj) { return obj.getSDAInterpretiveFrame; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateCitation_decorators, { kind: "method", name: "validateCitation", static: false, private: false, access: { has: function (obj) { return "validateCitation" in obj; }, get: function (obj) { return obj.validateCitation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateCitationsBulk_decorators, { kind: "method", name: "validateCitationsBulk", static: false, private: false, access: { has: function (obj) { return "validateCitationsBulk" in obj; }, get: function (obj) { return obj.validateCitationsBulk; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVerseCommentary_decorators, { kind: "method", name: "getVerseCommentary", static: false, private: false, access: { has: function (obj) { return "getVerseCommentary" in obj; }, get: function (obj) { return obj.getVerseCommentary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMorphologyData_decorators, { kind: "method", name: "getMorphologyData", static: false, private: false, access: { has: function (obj) { return "getMorphologyData" in obj; }, get: function (obj) { return obj.getMorphologyData; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCanonicalThemes_decorators, { kind: "method", name: "getCanonicalThemes", static: false, private: false, access: { has: function (obj) { return "getCanonicalThemes" in obj; }, get: function (obj) { return obj.getCanonicalThemes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSanctuaryConnections_decorators, { kind: "method", name: "getSanctuaryConnections", static: false, private: false, access: { has: function (obj) { return "getSanctuaryConnections" in obj; }, get: function (obj) { return obj.getSanctuaryConnections; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProphecyConnections_decorators, { kind: "method", name: "getProphecyConnections", static: false, private: false, access: { has: function (obj) { return "getProphecyConnections" in obj; }, get: function (obj) { return obj.getProphecyConnections; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllSanctuaryThreads_decorators, { kind: "method", name: "getAllSanctuaryThreads", static: false, private: false, access: { has: function (obj) { return "getAllSanctuaryThreads" in obj; }, get: function (obj) { return obj.getAllSanctuaryThreads; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllProphecyThreads_decorators, { kind: "method", name: "getAllProphecyThreads", static: false, private: false, access: { has: function (obj) { return "getAllProphecyThreads" in obj; }, get: function (obj) { return obj.getAllProphecyThreads; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStructuralAnalysis_decorators, { kind: "method", name: "getStructuralAnalysis", static: false, private: false, access: { has: function (obj) { return "getStructuralAnalysis" in obj; }, get: function (obj) { return obj.getStructuralAnalysis; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInterpretiveChallenge_decorators, { kind: "method", name: "getInterpretiveChallenge", static: false, private: false, access: { has: function (obj) { return "getInterpretiveChallenge" in obj; }, get: function (obj) { return obj.getInterpretiveChallenge; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInterpretiveChallenges_decorators, { kind: "method", name: "getInterpretiveChallenges", static: false, private: false, access: { has: function (obj) { return "getInterpretiveChallenges" in obj; }, get: function (obj) { return obj.getInterpretiveChallenges; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWordStudyEnhanced_decorators, { kind: "method", name: "getWordStudyEnhanced", static: false, private: false, access: { has: function (obj) { return "getWordStudyEnhanced" in obj; }, get: function (obj) { return obj.getWordStudyEnhanced; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchWordByLemma_decorators, { kind: "method", name: "searchWordByLemma", static: false, private: false, access: { has: function (obj) { return "searchWordByLemma" in obj; }, get: function (obj) { return obj.searchWordByLemma; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVerseContext_decorators, { kind: "method", name: "getVerseContext", static: false, private: false, access: { has: function (obj) { return "getVerseContext" in obj; }, get: function (obj) { return obj.getVerseContext; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPassageSummary_decorators, { kind: "method", name: "getPassageSummary", static: false, private: false, access: { has: function (obj) { return "getPassageSummary" in obj; }, get: function (obj) { return obj.getPassageSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStudySynthesis_decorators, { kind: "method", name: "getStudySynthesis", static: false, private: false, access: { has: function (obj) { return "getStudySynthesis" in obj; }, get: function (obj) { return obj.getStudySynthesis; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEnhancedTranslationComparison_decorators, { kind: "method", name: "getEnhancedTranslationComparison", static: false, private: false, access: { has: function (obj) { return "getEnhancedTranslationComparison" in obj; }, get: function (obj) { return obj.getEnhancedTranslationComparison; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getScriptureHtmlPage_decorators, { kind: "method", name: "getScriptureHtmlPage", static: false, private: false, access: { has: function (obj) { return "getScriptureHtmlPage" in obj; }, get: function (obj) { return obj.getScriptureHtmlPage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScriptureController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScriptureController = _classThis;
}();
exports.ScriptureController = ScriptureController;
