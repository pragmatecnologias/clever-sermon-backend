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
exports.WorkspacesController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var sermon_workspace_entity_1 = require("../../entities/sermon-workspace.entity");
var WorkspacesController = function () {
    var _classDecorators = [(0, common_1.Controller)('workspaces'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _prepareDemoSermon_decorators;
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _getState_decorators;
    var _recordClaimReview_decorators;
    var _update_decorators;
    var _updateScriptureCache_decorators;
    var _addReference_decorators;
    var _getScriptureCache_decorators;
    var _remove_decorators;
    var _previewPrompt_decorators;
    var _generateOutlines_decorators;
    var _generateManuscript_decorators;
    var _generateApplications_decorators;
    var _generateDiscussionQuestions_decorators;
    var _generateIllustrations_decorators;
    var _generateCitations_decorators;
    var _generateStudyReport_decorators;
    var _generateSermonCore_decorators;
    var _getGenerationJobStatus_decorators;
    var _generateMediaSuggestions_decorators;
    var _composeMediaPack_decorators;
    var _generateSocraticCoach_decorators;
    var _validateContent_decorators;
    var _checkSermonIntegrity_decorators;
    var _recordIntegrityIssueReview_decorators;
    var _autoFixContent_decorators;
    var _validateCitations_decorators;
    var _updateOutline_decorators;
    var _restoreOutlineHistory_decorators;
    var _updateManuscript_decorators;
    var _restoreManuscriptHistory_decorators;
    var _regenerateManuscriptCues_decorators;
    var _applyManuscriptRepair_decorators;
    var _getManuscriptRepairStatus_decorators;
    var _updateApplication_decorators;
    var _updateIllustration_decorators;
    var _updateDiscussionQuestion_decorators;
    var _updateCitation_decorators;
    var WorkspacesController = _classThis = /** @class */ (function () {
        function WorkspacesController_1(workspacesService, workspaceGenerationService, workspaceTrustService, workspaceMediaPackService, contentValidatorService, scriptureService, passageSummaryService, studySynthesisService, structuralAnalysisDataService, interpretiveChallengesDataService, translationComparisonEnhancedService) {
            this.workspacesService = (__runInitializers(this, _instanceExtraInitializers), workspacesService);
            this.workspaceGenerationService = workspaceGenerationService;
            this.workspaceTrustService = workspaceTrustService;
            this.workspaceMediaPackService = workspaceMediaPackService;
            this.contentValidatorService = contentValidatorService;
            this.scriptureService = scriptureService;
            this.passageSummaryService = passageSummaryService;
            this.studySynthesisService = studySynthesisService;
            this.structuralAnalysisDataService = structuralAnalysisDataService;
            this.interpretiveChallengesDataService = interpretiveChallengesDataService;
            this.translationComparisonEnhancedService = translationComparisonEnhancedService;
            this.demoWorkspaceTitle = 'Demo Sermon: John 3:16';
            this.demoSeriesTitle = 'Demo Sermons';
        }
        WorkspacesController_1.prototype.wantsAsync = function (asyncMode) {
            return asyncMode === 'true' || asyncMode === '1' || asyncMode === 'yes';
        };
        WorkspacesController_1.prototype.isCompleteProgress = function (progress) {
            return Boolean((progress === null || progress === void 0 ? void 0 : progress.themeConfigured) &&
                (progress === null || progress === void 0 ? void 0 : progress.passageExplored) &&
                (progress === null || progress === void 0 ? void 0 : progress.studyGenerated) &&
                (progress === null || progress === void 0 ? void 0 : progress.outlineCreated) &&
                (progress === null || progress === void 0 ? void 0 : progress.manuscriptWritten) &&
                (progress === null || progress === void 0 ? void 0 : progress.refineCompleted) &&
                (progress === null || progress === void 0 ? void 0 : progress.deliverPrepared));
        };
        WorkspacesController_1.prototype.isDemoWorkspace = function (workspace) {
            var _a;
            return /demo sermon:\s*john 3:16/i.test(String((workspace === null || workspace === void 0 ? void 0 : workspace.title) || ''))
                || Boolean((_a = ((workspace === null || workspace === void 0 ? void 0 : workspace.metadata) || {})) === null || _a === void 0 ? void 0 : _a.demo);
        };
        WorkspacesController_1.prototype.buildDemoScriptureCache = function (userId, language) {
            return __awaiter(this, void 0, void 0, function () {
                var translationCode, reference, cache, _a, error_1, safeLoad, _b, _c, _d, _e, _f;
                var _this = this;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            translationCode = language === 'es' ? 'RVR1960' : 'KJV';
                            reference = 'John 3:16';
                            cache = {};
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 3, , 4]);
                            _a = cache;
                            return [4 /*yield*/, this.scriptureService.getPassage(reference, translationCode)];
                        case 2:
                            _a.scriptureResult = _g.sent();
                            cache.scriptureTranslation = translationCode;
                            cache.scriptureLastLookup = "".concat(reference, ":").concat(translationCode);
                            cache.lookupHistory = [
                                {
                                    reference: reference,
                                    translation: translationCode,
                                    lookedUpAt: new Date().toISOString(),
                                },
                            ];
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _g.sent();
                            console.error('Demo scripture lookup failed', error_1);
                            return [3 /*break*/, 4];
                        case 4:
                            safeLoad = function (label, loader) { return __awaiter(_this, void 0, void 0, function () {
                                var error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, loader()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                        case 2:
                                            error_2 = _a.sent();
                                            console.error("Demo ".concat(label, " failed"), error_2);
                                            return [2 /*return*/, null];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); };
                            _b = cache;
                            return [4 /*yield*/, safeLoad('passage summary', function () {
                                    return _this.passageSummaryService.getPassageSummary(reference, userId, language);
                                })];
                        case 5:
                            _b.passageSummary = _g.sent();
                            _c = cache;
                            return [4 /*yield*/, safeLoad('study synthesis', function () {
                                    return _this.studySynthesisService.getStudySynthesis(reference, userId, language);
                                })];
                        case 6:
                            _c.studySynthesis = _g.sent();
                            _d = cache;
                            return [4 /*yield*/, safeLoad('structural analysis', function () {
                                    return _this.structuralAnalysisDataService.getStructuralAnalysis(reference, language);
                                })];
                        case 7:
                            _d.structuralAnalysis = _g.sent();
                            _e = cache;
                            return [4 /*yield*/, safeLoad('interpretive challenges', function () {
                                    return _this.interpretiveChallengesDataService.getInterpretiveChallenge(reference, language);
                                })];
                        case 8:
                            _e.interpretiveChallenges = _g.sent();
                            _f = cache;
                            return [4 /*yield*/, safeLoad('translation comparison', function () {
                                    return _this.translationComparisonEnhancedService.getEnhancedComparison(reference, language, userId);
                                })];
                        case 9:
                            _f.translationComparison = _g.sent();
                            return [2 /*return*/, cache];
                    }
                });
            });
        };
        WorkspacesController_1.prototype.hasRichDemoTranslationComparison = function (scriptureCache) {
            var translationComparison = scriptureCache === null || scriptureCache === void 0 ? void 0 : scriptureCache.translationComparison;
            if (!translationComparison || typeof translationComparison !== 'object') {
                return false;
            }
            var translations = Array.isArray(translationComparison.translations) ? translationComparison.translations : [];
            return translations.length >= 3;
        };
        WorkspacesController_1.prototype.findLatestDemoWorkspace = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspaces, candidates, exactTitleCompleted, exactTitleAny;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspacesService.findAll(userId)];
                        case 1:
                            workspaces = _a.sent();
                            candidates = __spreadArray([], workspaces, true).filter(function (workspace) { return _this.isDemoWorkspace(workspace) && workspace.status !== sermon_workspace_entity_1.WorkspaceStatus.ARCHIVED; })
                                .sort(function (left, right) {
                                var leftTime = new Date(left.createdAt || left.updatedAt || 0).getTime();
                                var rightTime = new Date(right.createdAt || right.updatedAt || 0).getTime();
                                return leftTime - rightTime;
                            });
                            exactTitleCompleted = candidates.filter(function (workspace) { return workspace.status === sermon_workspace_entity_1.WorkspaceStatus.COMPLETED && workspace.title === _this.demoWorkspaceTitle; });
                            if (exactTitleCompleted.length > 0) {
                                return [2 /*return*/, exactTitleCompleted[0]];
                            }
                            exactTitleAny = candidates.filter(function (workspace) { return workspace.title === _this.demoWorkspaceTitle; });
                            if (exactTitleAny.length > 0) {
                                return [2 /*return*/, exactTitleAny[0]];
                            }
                            return [2 /*return*/, candidates[0] || null];
                    }
                });
            });
        };
        WorkspacesController_1.prototype.normalizeDemoWorkspace = function (userId, workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.workspacesService.update(workspaceId, userId, {
                            title: this.demoWorkspaceTitle,
                            seriesTitle: this.demoSeriesTitle,
                            mainPassage: 'John 3:16',
                            additionalPassages: ['Romans 5:8', 'Ephesians 2:8-9'],
                            theme: 'God’s love and salvation',
                            audienceProfile: 'General Sabbath congregation with members, visitors, young people, and people who may feel spiritually distant from God.',
                            sermonGoals: 'Help people see God as a loving Father who welcomes repentant sinners, restores dignity, and invites them back into relationship.',
                            theologicalLens: 'adventist',
                            style: sermon_workspace_entity_1.SermonStyle.EXPOSITORY,
                            storyArc: sermon_workspace_entity_1.StoryArc.PROBLEM_TRUTH_RESPONSE,
                            language: 'en',
                            egwEnabled: true,
                            metadata: {
                                demo: {
                                    enabled: true,
                                    kind: 'john_3_16',
                                },
                                planning: {
                                    sermonDate: '2026-05-18',
                                    targetLengthMinutes: 25,
                                    serviceType: 'sabbath_worship',
                                    appealStyle: 'invitation',
                                    ministryMode: 'evangelistic',
                                    bilingualMode: 'none',
                                },
                            },
                        })];
                });
            });
        };
        WorkspacesController_1.prototype.prepareDemoWorkspaceArtifacts = function (workspaceId, userId, authorization) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, beforeState, scriptureCache, refreshedScriptureCache, outlines, selectedOutline, refreshed, outline, finalWorkspace, finalState;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                return __generator(this, function (_l) {
                    switch (_l.label) {
                        case 0: return [4 /*yield*/, this.workspacesService.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _l.sent();
                            return [4 /*yield*/, this.workspacesService.getWorkspaceState(workspace.id, userId)];
                        case 2:
                            beforeState = _l.sent();
                            scriptureCache = (workspace.scriptureCache || {});
                            if (!(!((_a = beforeState.progress) === null || _a === void 0 ? void 0 : _a.passageExplored) || !this.hasRichDemoTranslationComparison(scriptureCache))) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.buildDemoScriptureCache(userId, workspace.language || 'en')];
                        case 3:
                            refreshedScriptureCache = _l.sent();
                            return [4 /*yield*/, this.workspacesService.updateScriptureCache(workspace.id, userId, refreshedScriptureCache)];
                        case 4:
                            _l.sent();
                            _l.label = 5;
                        case 5:
                            if (!!((_b = beforeState.progress) === null || _b === void 0 ? void 0 : _b.studyGenerated)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.workspacesService.generateStudyReport(workspace.id, userId)];
                        case 6:
                            _l.sent();
                            _l.label = 7;
                        case 7:
                            if (!!((_c = beforeState.progress) === null || _c === void 0 ? void 0 : _c.outlineCreated)) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.workspacesService.generateSermonCore(workspace.id, userId)];
                        case 8:
                            _l.sent();
                            return [4 /*yield*/, this.workspacesService.generateOutlines(workspace.id, userId, 3)];
                        case 9:
                            outlines = _l.sent();
                            selectedOutline = outlines.find(function (outline) { return outline.isSelected; }) || outlines[0] || null;
                            if (!(selectedOutline && !selectedOutline.isSelected)) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.workspacesService.updateOutline(userId, selectedOutline.id, { isSelected: true })];
                        case 10:
                            _l.sent();
                            _l.label = 11;
                        case 11:
                            if (!!((_d = beforeState.progress) === null || _d === void 0 ? void 0 : _d.manuscriptWritten)) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.workspacesService.findOne(workspace.id, userId)];
                        case 12:
                            refreshed = _l.sent();
                            outline = ((_e = refreshed.outlines) === null || _e === void 0 ? void 0 : _e.find(function (item) { return item.isSelected; })) || ((_f = refreshed.outlines) === null || _f === void 0 ? void 0 : _f[0]);
                            if (!outline) {
                                throw new Error('Demo outline is required before drafting the manuscript.');
                            }
                            return [4 /*yield*/, this.workspacesService.generateManuscript(workspace.id, outline.id, userId)];
                        case 13:
                            _l.sent();
                            _l.label = 14;
                        case 14:
                            if (!(!((_g = beforeState.progress) === null || _g === void 0 ? void 0 : _g.refineCompleted) || ((_h = beforeState.artifacts) === null || _h === void 0 ? void 0 : _h.citations) === 0)) return [3 /*break*/, 16];
                            return [4 /*yield*/, this.workspacesService.generateCitations(workspace.id, userId)];
                        case 15:
                            _l.sent();
                            _l.label = 16;
                        case 16:
                            if (!!((_j = beforeState.progress) === null || _j === void 0 ? void 0 : _j.refineCompleted)) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.workspacesService.runIntegrityCheck(workspace.id, userId)];
                        case 17:
                            _l.sent();
                            _l.label = 18;
                        case 18:
                            if (!!((_k = beforeState.progress) === null || _k === void 0 ? void 0 : _k.deliverPrepared)) return [3 /*break*/, 21];
                            return [4 /*yield*/, this.workspaceMediaPackService.composeMediaPack(workspace.id, userId, authorization, {
                                    deckIntent: 'social_summary',
                                    includeDeck: true,
                                })];
                        case 19:
                            _l.sent();
                            return [4 /*yield*/, this.workspaceMediaPackService.composeMediaPack(workspace.id, userId, authorization, {
                                    deckIntent: 'sermon_presentation',
                                    includeDeck: true,
                                    exportTypes: ['pptx', 'pdf'],
                                })];
                        case 20:
                            _l.sent();
                            _l.label = 21;
                        case 21: return [4 /*yield*/, this.workspacesService.update(workspace.id, userId, {
                                status: sermon_workspace_entity_1.WorkspaceStatus.COMPLETED,
                                metadata: __assign(__assign({}, (workspace.metadata || {})), { demo: {
                                        enabled: true,
                                        kind: 'john_3_16',
                                        completedAt: new Date().toISOString(),
                                    } }),
                            })];
                        case 22:
                            finalWorkspace = _l.sent();
                            return [4 /*yield*/, this.workspacesService.getWorkspaceState(finalWorkspace.id, userId)];
                        case 23:
                            finalState = _l.sent();
                            if (!this.isCompleteProgress(finalState.progress)) {
                                throw new Error('Demo preparation finished without reaching 100% progress.');
                            }
                            return [2 /*return*/, finalState];
                    }
                });
            });
        };
        WorkspacesController_1.prototype.prepareDemoSermon = function (req, authorization) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, created, workspace, needsNormalization, beforeState, scriptureCache, needsDemoRefresh, demoPrepStartedAt, demoMetadata;
                var _a, _b, _c;
                var _this = this;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            userId = req.user.userId;
                            created = false;
                            return [4 /*yield*/, this.findLatestDemoWorkspace(userId)];
                        case 1:
                            workspace = _d.sent();
                            if (!!workspace) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.workspacesService.create(userId, {
                                    title: this.demoWorkspaceTitle,
                                    seriesTitle: this.demoSeriesTitle,
                                    mainPassage: 'John 3:16',
                                    additionalPassages: ['Romans 5:8', 'Ephesians 2:8-9'],
                                    theme: 'God’s love and salvation',
                                    audienceProfile: 'General Sabbath congregation with members, visitors, young people, and people who may feel spiritually distant from God.',
                                    sermonGoals: 'Help people see God as a loving Father who welcomes repentant sinners, restores dignity, and invites them back into relationship.',
                                    theologicalLens: 'adventist',
                                    style: sermon_workspace_entity_1.SermonStyle.EXPOSITORY,
                                    storyArc: sermon_workspace_entity_1.StoryArc.PROBLEM_TRUTH_RESPONSE,
                                    language: 'en',
                                    egwEnabled: true,
                                    metadata: {
                                        demo: {
                                            enabled: true,
                                            kind: 'john_3_16',
                                        },
                                        planning: {
                                            sermonDate: '2026-05-18',
                                            targetLengthMinutes: 25,
                                            serviceType: 'sabbath_worship',
                                            appealStyle: 'invitation',
                                            ministryMode: 'evangelistic',
                                            bilingualMode: 'none',
                                        },
                                    },
                                })];
                        case 2:
                            workspace = _d.sent();
                            created = true;
                            return [3 /*break*/, 5];
                        case 3:
                            needsNormalization = workspace.title !== this.demoWorkspaceTitle ||
                                workspace.seriesTitle !== this.demoSeriesTitle ||
                                workspace.mainPassage !== 'John 3:16' ||
                                workspace.language !== 'en' ||
                                workspace.style !== 'expository' ||
                                workspace.storyArc !== 'problem_truth_response' ||
                                workspace.egwEnabled !== true ||
                                workspace.theologicalLens !== 'adventist';
                            if (!needsNormalization) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.normalizeDemoWorkspace(userId, workspace.id)];
                        case 4:
                            workspace = _d.sent();
                            _d.label = 5;
                        case 5: return [4 /*yield*/, this.workspacesService.getWorkspaceState(workspace.id, userId)];
                        case 6:
                            beforeState = _d.sent();
                            scriptureCache = (workspace.scriptureCache || {});
                            needsDemoRefresh = !this.hasRichDemoTranslationComparison(scriptureCache);
                            if (!(this.isCompleteProgress(beforeState.progress) && !needsDemoRefresh)) return [3 /*break*/, 10];
                            if (!(workspace.status !== sermon_workspace_entity_1.WorkspaceStatus.COMPLETED)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.workspacesService.update(workspace.id, userId, {
                                    status: sermon_workspace_entity_1.WorkspaceStatus.COMPLETED,
                                    metadata: __assign(__assign({}, (workspace.metadata || {})), { demo: {
                                            enabled: true,
                                            kind: 'john_3_16',
                                            completedAt: new Date().toISOString(),
                                        } }),
                                })];
                        case 7:
                            workspace = _d.sent();
                            _d.label = 8;
                        case 8:
                            _a = {
                                workspaceId: workspace.id,
                                created: false,
                                prepared: true
                            };
                            return [4 /*yield*/, this.workspacesService.getWorkspaceState(workspace.id, userId)];
                        case 9: return [2 /*return*/, (_a.state = _d.sent(),
                                _a)];
                        case 10:
                            if (!(this.isCompleteProgress(beforeState.progress) && needsDemoRefresh)) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.prepareDemoWorkspaceArtifacts(workspace.id, userId, authorization)];
                        case 11:
                            _d.sent();
                            return [4 /*yield*/, this.workspacesService.update(workspace.id, userId, {
                                    status: sermon_workspace_entity_1.WorkspaceStatus.COMPLETED,
                                    metadata: __assign(__assign({}, (workspace.metadata || {})), { demo: {
                                            enabled: true,
                                            kind: 'john_3_16',
                                            completedAt: new Date().toISOString(),
                                        } }),
                                })];
                        case 12:
                            workspace = _d.sent();
                            _b = {
                                workspaceId: workspace.id,
                                created: false,
                                prepared: true
                            };
                            return [4 /*yield*/, this.workspacesService.getWorkspaceState(workspace.id, userId)];
                        case 13: return [2 /*return*/, (_b.state = _d.sent(),
                                _b)];
                        case 14:
                            demoPrepStartedAt = new Date().toISOString();
                            demoMetadata = __assign(__assign({}, (workspace.metadata || {})), { demo: {
                                    enabled: true,
                                    kind: 'john_3_16',
                                    preparingAt: demoPrepStartedAt,
                                } });
                            return [4 /*yield*/, this.workspacesService.update(workspace.id, userId, {
                                    metadata: demoMetadata,
                                })];
                        case 15:
                            workspace = _d.sent();
                            void this.prepareDemoWorkspaceArtifacts(workspace.id, userId, authorization)
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.workspacesService.update(workspace.id, userId, {
                                                status: sermon_workspace_entity_1.WorkspaceStatus.COMPLETED,
                                            })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function (error) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            console.error('Demo preparation failed', error);
                                            return [4 /*yield*/, this.workspacesService.update(workspace.id, userId, {
                                                    metadata: __assign(__assign({}, (workspace.metadata || {})), { demo: __assign(__assign({}, (_a = workspace.metadata) === null || _a === void 0 ? void 0 : _a.demo), { enabled: true, kind: 'john_3_16', preparingAt: demoPrepStartedAt, preparationFailedAt: new Date().toISOString(), preparationError: (error === null || error === void 0 ? void 0 : error.message) || 'Demo preparation failed.' }) }),
                                                })];
                                        case 1:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            _c = {
                                workspaceId: workspace.id,
                                created: created,
                                prepared: false
                            };
                            return [4 /*yield*/, this.workspacesService.getWorkspaceState(workspace.id, userId)];
                        case 16: return [2 /*return*/, (_c.state = _d.sent(),
                                _c.status = 'preparing',
                                _c)];
                    }
                });
            });
        };
        WorkspacesController_1.prototype.create = function (req, createDto) {
            return this.workspacesService.create(req.user.userId, createDto);
        };
        WorkspacesController_1.prototype.findAll = function (req) {
            return this.workspacesService.findAll(req.user.userId);
        };
        WorkspacesController_1.prototype.findOne = function (req, id) {
            return this.workspacesService.findOne(id, req.user.userId);
        };
        WorkspacesController_1.prototype.getState = function (req, id) {
            return this.workspacesService.getWorkspaceState(id, req.user.userId);
        };
        WorkspacesController_1.prototype.recordClaimReview = function (req, id, body) {
            return this.workspaceTrustService.recordClaimReview(id, req.user.userId, body);
        };
        WorkspacesController_1.prototype.update = function (req, id, updateDto) {
            return this.workspacesService.update(id, req.user.userId, updateDto);
        };
        WorkspacesController_1.prototype.updateScriptureCache = function (req, id, payload, body) {
            var cacheData = {};
            var payloadText = typeof payload === 'string' && payload.length > 0
                ? payload
                : typeof (body === null || body === void 0 ? void 0 : body.payload) === 'string'
                    ? body.payload
                    : null;
            if (payloadText) {
                try {
                    cacheData = JSON.parse(payloadText);
                }
                catch (_a) {
                    cacheData = {};
                }
            }
            else if (req.body && typeof req.body === 'object') {
                cacheData = req.body;
            }
            return this.workspacesService.updateScriptureCache(id, req.user.userId, cacheData);
        };
        WorkspacesController_1.prototype.addReference = function (req, id, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.workspacesService.addReference(id, req.user.userId, body.reference, body.context)];
                });
            });
        };
        WorkspacesController_1.prototype.getScriptureCache = function (req, id) {
            return this.workspacesService.getScriptureCache(id, req.user.userId);
        };
        WorkspacesController_1.prototype.remove = function (req, id) {
            return this.workspacesService.remove(id, req.user.userId);
        };
        WorkspacesController_1.prototype.previewPrompt = function (req, id, type, outlineId) {
            return this.workspacesService.getPromptPreview(id, req.user.userId, type, outlineId);
        };
        WorkspacesController_1.prototype.generateOutlines = function (req, id, promptOverride, asyncMode) {
            if (this.wantsAsync(asyncMode)) {
                return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'outline', promptOverride);
            }
            return this.workspacesService.generateOutlines(id, req.user.userId, 1, promptOverride);
        };
        WorkspacesController_1.prototype.generateManuscript = function (req, id, outlineId, promptOverride, manuscriptOptions, asyncMode) {
            if (this.wantsAsync(asyncMode)) {
                return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'manuscript', promptOverride);
            }
            return this.workspacesService.generateManuscript(id, outlineId, req.user.userId, promptOverride, manuscriptOptions);
        };
        WorkspacesController_1.prototype.generateApplications = function (req, id, promptOverride, asyncMode) {
            if (this.wantsAsync(asyncMode)) {
                return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'applications', promptOverride);
            }
            return this.workspacesService.generateApplications(id, req.user.userId, promptOverride);
        };
        WorkspacesController_1.prototype.generateDiscussionQuestions = function (req, id, promptOverride, asyncMode) {
            if (this.wantsAsync(asyncMode)) {
                return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'discussion-questions', promptOverride);
            }
            return this.workspacesService.generateDiscussionQuestions(id, req.user.userId, promptOverride);
        };
        WorkspacesController_1.prototype.generateIllustrations = function (req, id, promptOverride, asyncMode) {
            if (this.wantsAsync(asyncMode)) {
                return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'illustrations', promptOverride);
            }
            return this.workspacesService.generateIllustrations(id, req.user.userId, promptOverride);
        };
        WorkspacesController_1.prototype.generateCitations = function (req, id, promptOverride, asyncMode) {
            if (this.wantsAsync(asyncMode)) {
                return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'citations', promptOverride);
            }
            return this.workspacesService.generateCitations(id, req.user.userId, promptOverride);
        };
        WorkspacesController_1.prototype.generateStudyReport = function (id, req, promptOverride, includeEGW, asyncMode) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.wantsAsync(asyncMode)) {
                        return [2 /*return*/, this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'study-report', promptOverride, includeEGW === 'true')];
                    }
                    return [2 /*return*/, this.workspacesService.generateStudyReport(id, req.user.userId, promptOverride)];
                });
            });
        };
        WorkspacesController_1.prototype.generateSermonCore = function (id, req, promptOverride, asyncMode) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.wantsAsync(asyncMode)) {
                        return [2 /*return*/, this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'sermon-core', promptOverride)];
                    }
                    return [2 /*return*/, this.workspacesService.generateSermonCore(id, req.user.userId)];
                });
            });
        };
        WorkspacesController_1.prototype.getGenerationJobStatus = function (req, id, jobId) {
            return this.workspaceGenerationService.getWorkspaceGenerationJobStatus(id, jobId, req.user.userId);
        };
        WorkspacesController_1.prototype.generateMediaSuggestions = function (req, id, promptOverride, asyncMode) {
            if (this.wantsAsync(asyncMode)) {
                return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'media-suggestions', promptOverride);
            }
            return this.workspacesService.generateMediaSuggestions(id, req.user.userId, promptOverride);
        };
        WorkspacesController_1.prototype.composeMediaPack = function (req, id, body, payload, authorization) {
            var payloadData = body || {};
            if (typeof payload === 'string' && payload.length > 0) {
                try {
                    payloadData = JSON.parse(payload);
                }
                catch (_a) {
                    payloadData = body || {};
                }
            }
            return this.workspaceMediaPackService.composeMediaPack(id, req.user.userId, authorization, payloadData || {});
        };
        WorkspacesController_1.prototype.generateSocraticCoach = function (id, req, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.workspacesService.generateSocraticCoach(id, req.user.userId, body || {})];
                });
            });
        };
        WorkspacesController_1.prototype.validateContent = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.workspacesService.findOne(id, req.user.userId)];
                        case 1:
                            workspace = _d.sent();
                            return [2 /*return*/, this.contentValidatorService.validateSermonContent({
                                    outline: ((_a = workspace.outlines) === null || _a === void 0 ? void 0 : _a.find(function (o) { return o.isSelected; })) || ((_b = workspace.outlines) === null || _b === void 0 ? void 0 : _b[0]),
                                    manuscript: (_c = workspace.manuscripts) === null || _c === void 0 ? void 0 : _c[0],
                                    applications: workspace.applications,
                                    illustrations: workspace.illustrations
                                })];
                    }
                });
            });
        };
        WorkspacesController_1.prototype.checkSermonIntegrity = function (id, req, asyncMode) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.wantsAsync(asyncMode)) {
                        return [2 /*return*/, this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'integrity-check')];
                    }
                    return [2 /*return*/, this.workspacesService.runIntegrityCheck(id, req.user.userId)];
                });
            });
        };
        WorkspacesController_1.prototype.recordIntegrityIssueReview = function (req, id, body) {
            return this.workspaceTrustService.recordIntegrityIssueReview(id, req.user.userId, body);
        };
        WorkspacesController_1.prototype.autoFixContent = function (id, body, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.contentValidatorService.validateAndTransform(body.content, true)];
                });
            });
        };
        WorkspacesController_1.prototype.validateCitations = function (req, id, translation) {
            return this.workspaceTrustService.validateCitations(id, req.user.userId, translation);
        };
        WorkspacesController_1.prototype.updateOutline = function (req, id, dto) {
            return this.workspacesService.updateOutline(req.user.userId, id, dto);
        };
        WorkspacesController_1.prototype.restoreOutlineHistory = function (req, workspaceId, historyIndex) {
            return this.workspacesService.restoreOutlineHistory(req.user.userId, workspaceId, Number(historyIndex));
        };
        WorkspacesController_1.prototype.updateManuscript = function (req, id, dto) {
            return this.workspacesService.updateManuscript(req.user.userId, id, dto);
        };
        WorkspacesController_1.prototype.restoreManuscriptHistory = function (req, workspaceId, historyIndex) {
            return this.workspacesService.restoreManuscriptHistory(req.user.userId, workspaceId, Number(historyIndex));
        };
        WorkspacesController_1.prototype.regenerateManuscriptCues = function (req, id, manuscriptId) {
            return this.workspacesService.regenerateManuscriptCues(id, manuscriptId, req.user.userId);
        };
        WorkspacesController_1.prototype.applyManuscriptRepair = function (req, id, manuscriptId, body) {
            return this.workspaceGenerationService.enqueueManuscriptRepair(id, manuscriptId, req.user.userId, body || {});
        };
        WorkspacesController_1.prototype.getManuscriptRepairStatus = function (req, id, manuscriptId, jobId) {
            return this.workspaceGenerationService.getManuscriptRepairJobStatus(id, manuscriptId, jobId, req.user.userId);
        };
        WorkspacesController_1.prototype.updateApplication = function (req, id, dto) {
            return this.workspacesService.updateApplication(req.user.userId, id, dto);
        };
        WorkspacesController_1.prototype.updateIllustration = function (req, id, dto) {
            return this.workspacesService.updateIllustration(req.user.userId, id, dto);
        };
        WorkspacesController_1.prototype.updateDiscussionQuestion = function (req, id, dto) {
            return this.workspacesService.updateDiscussionQuestion(req.user.userId, id, dto);
        };
        WorkspacesController_1.prototype.updateCitation = function (req, id, dto) {
            return this.workspacesService.updateCitation(req.user.userId, id, dto);
        };
        return WorkspacesController_1;
    }());
    __setFunctionName(_classThis, "WorkspacesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _prepareDemoSermon_decorators = [(0, common_1.Post)('demo-sermon/prepare')];
        _create_decorators = [(0, common_1.Post)()];
        _findAll_decorators = [(0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _getState_decorators = [(0, common_1.Get)(':id/state')];
        _recordClaimReview_decorators = [(0, common_1.Post)(':id/claim-reviews')];
        _update_decorators = [(0, common_1.Patch)(':id')];
        _updateScriptureCache_decorators = [(0, common_1.Patch)(':id/scripture-cache')];
        _addReference_decorators = [(0, common_1.Post)(':id/references')];
        _getScriptureCache_decorators = [(0, common_1.Get)(':id/scripture-cache')];
        _remove_decorators = [(0, common_1.Delete)(':id')];
        _previewPrompt_decorators = [(0, common_1.Get)(':id/prompts')];
        _generateOutlines_decorators = [(0, common_1.Post)(':id/outlines')];
        _generateManuscript_decorators = [(0, common_1.Post)(':id/manuscript')];
        _generateApplications_decorators = [(0, common_1.Post)(':id/applications')];
        _generateDiscussionQuestions_decorators = [(0, common_1.Post)(':id/discussion-questions')];
        _generateIllustrations_decorators = [(0, common_1.Post)(':id/illustrations')];
        _generateCitations_decorators = [(0, common_1.Post)(':id/citations')];
        _generateStudyReport_decorators = [(0, common_1.Post)(':id/study-report')];
        _generateSermonCore_decorators = [(0, common_1.Post)(':id/sermon-core')];
        _getGenerationJobStatus_decorators = [(0, common_1.Get)(':id/jobs/:jobId')];
        _generateMediaSuggestions_decorators = [(0, common_1.Post)(':id/media-suggestions')];
        _composeMediaPack_decorators = [(0, common_1.Post)(':id/media-pack/compose')];
        _generateSocraticCoach_decorators = [(0, common_1.Post)(':id/socratic-coach')];
        _validateContent_decorators = [(0, common_1.Post)(':id/validate-content')];
        _checkSermonIntegrity_decorators = [(0, common_1.Post)(':id/integrity-check')];
        _recordIntegrityIssueReview_decorators = [(0, common_1.Post)(':id/integrity-issue-reviews')];
        _autoFixContent_decorators = [(0, common_1.Post)(':id/auto-fix-content')];
        _validateCitations_decorators = [(0, common_1.Post)(':id/citations/validate')];
        _updateOutline_decorators = [(0, common_1.Patch)('outlines/:id')];
        _restoreOutlineHistory_decorators = [(0, common_1.Post)(':workspaceId/outlines/history/:historyIndex/restore')];
        _updateManuscript_decorators = [(0, common_1.Patch)('manuscripts/:id')];
        _restoreManuscriptHistory_decorators = [(0, common_1.Post)(':workspaceId/manuscripts/history/:historyIndex/restore')];
        _regenerateManuscriptCues_decorators = [(0, common_1.Post)(':id/manuscripts/:manuscriptId/cues/regenerate')];
        _applyManuscriptRepair_decorators = [(0, common_1.Post)(':id/manuscripts/:manuscriptId/repair/apply')];
        _getManuscriptRepairStatus_decorators = [(0, common_1.Get)(':id/manuscripts/:manuscriptId/repair/jobs/:jobId')];
        _updateApplication_decorators = [(0, common_1.Patch)('applications/:id')];
        _updateIllustration_decorators = [(0, common_1.Patch)('illustrations/:id')];
        _updateDiscussionQuestion_decorators = [(0, common_1.Patch)('discussion-questions/:id')];
        _updateCitation_decorators = [(0, common_1.Patch)('citations/:id')];
        __esDecorate(_classThis, null, _prepareDemoSermon_decorators, { kind: "method", name: "prepareDemoSermon", static: false, private: false, access: { has: function (obj) { return "prepareDemoSermon" in obj; }, get: function (obj) { return obj.prepareDemoSermon; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getState_decorators, { kind: "method", name: "getState", static: false, private: false, access: { has: function (obj) { return "getState" in obj; }, get: function (obj) { return obj.getState; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordClaimReview_decorators, { kind: "method", name: "recordClaimReview", static: false, private: false, access: { has: function (obj) { return "recordClaimReview" in obj; }, get: function (obj) { return obj.recordClaimReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateScriptureCache_decorators, { kind: "method", name: "updateScriptureCache", static: false, private: false, access: { has: function (obj) { return "updateScriptureCache" in obj; }, get: function (obj) { return obj.updateScriptureCache; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addReference_decorators, { kind: "method", name: "addReference", static: false, private: false, access: { has: function (obj) { return "addReference" in obj; }, get: function (obj) { return obj.addReference; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getScriptureCache_decorators, { kind: "method", name: "getScriptureCache", static: false, private: false, access: { has: function (obj) { return "getScriptureCache" in obj; }, get: function (obj) { return obj.getScriptureCache; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _previewPrompt_decorators, { kind: "method", name: "previewPrompt", static: false, private: false, access: { has: function (obj) { return "previewPrompt" in obj; }, get: function (obj) { return obj.previewPrompt; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateOutlines_decorators, { kind: "method", name: "generateOutlines", static: false, private: false, access: { has: function (obj) { return "generateOutlines" in obj; }, get: function (obj) { return obj.generateOutlines; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateManuscript_decorators, { kind: "method", name: "generateManuscript", static: false, private: false, access: { has: function (obj) { return "generateManuscript" in obj; }, get: function (obj) { return obj.generateManuscript; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateApplications_decorators, { kind: "method", name: "generateApplications", static: false, private: false, access: { has: function (obj) { return "generateApplications" in obj; }, get: function (obj) { return obj.generateApplications; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateDiscussionQuestions_decorators, { kind: "method", name: "generateDiscussionQuestions", static: false, private: false, access: { has: function (obj) { return "generateDiscussionQuestions" in obj; }, get: function (obj) { return obj.generateDiscussionQuestions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateIllustrations_decorators, { kind: "method", name: "generateIllustrations", static: false, private: false, access: { has: function (obj) { return "generateIllustrations" in obj; }, get: function (obj) { return obj.generateIllustrations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateCitations_decorators, { kind: "method", name: "generateCitations", static: false, private: false, access: { has: function (obj) { return "generateCitations" in obj; }, get: function (obj) { return obj.generateCitations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateStudyReport_decorators, { kind: "method", name: "generateStudyReport", static: false, private: false, access: { has: function (obj) { return "generateStudyReport" in obj; }, get: function (obj) { return obj.generateStudyReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateSermonCore_decorators, { kind: "method", name: "generateSermonCore", static: false, private: false, access: { has: function (obj) { return "generateSermonCore" in obj; }, get: function (obj) { return obj.generateSermonCore; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGenerationJobStatus_decorators, { kind: "method", name: "getGenerationJobStatus", static: false, private: false, access: { has: function (obj) { return "getGenerationJobStatus" in obj; }, get: function (obj) { return obj.getGenerationJobStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateMediaSuggestions_decorators, { kind: "method", name: "generateMediaSuggestions", static: false, private: false, access: { has: function (obj) { return "generateMediaSuggestions" in obj; }, get: function (obj) { return obj.generateMediaSuggestions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _composeMediaPack_decorators, { kind: "method", name: "composeMediaPack", static: false, private: false, access: { has: function (obj) { return "composeMediaPack" in obj; }, get: function (obj) { return obj.composeMediaPack; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateSocraticCoach_decorators, { kind: "method", name: "generateSocraticCoach", static: false, private: false, access: { has: function (obj) { return "generateSocraticCoach" in obj; }, get: function (obj) { return obj.generateSocraticCoach; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateContent_decorators, { kind: "method", name: "validateContent", static: false, private: false, access: { has: function (obj) { return "validateContent" in obj; }, get: function (obj) { return obj.validateContent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkSermonIntegrity_decorators, { kind: "method", name: "checkSermonIntegrity", static: false, private: false, access: { has: function (obj) { return "checkSermonIntegrity" in obj; }, get: function (obj) { return obj.checkSermonIntegrity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordIntegrityIssueReview_decorators, { kind: "method", name: "recordIntegrityIssueReview", static: false, private: false, access: { has: function (obj) { return "recordIntegrityIssueReview" in obj; }, get: function (obj) { return obj.recordIntegrityIssueReview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _autoFixContent_decorators, { kind: "method", name: "autoFixContent", static: false, private: false, access: { has: function (obj) { return "autoFixContent" in obj; }, get: function (obj) { return obj.autoFixContent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validateCitations_decorators, { kind: "method", name: "validateCitations", static: false, private: false, access: { has: function (obj) { return "validateCitations" in obj; }, get: function (obj) { return obj.validateCitations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateOutline_decorators, { kind: "method", name: "updateOutline", static: false, private: false, access: { has: function (obj) { return "updateOutline" in obj; }, get: function (obj) { return obj.updateOutline; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _restoreOutlineHistory_decorators, { kind: "method", name: "restoreOutlineHistory", static: false, private: false, access: { has: function (obj) { return "restoreOutlineHistory" in obj; }, get: function (obj) { return obj.restoreOutlineHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateManuscript_decorators, { kind: "method", name: "updateManuscript", static: false, private: false, access: { has: function (obj) { return "updateManuscript" in obj; }, get: function (obj) { return obj.updateManuscript; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _restoreManuscriptHistory_decorators, { kind: "method", name: "restoreManuscriptHistory", static: false, private: false, access: { has: function (obj) { return "restoreManuscriptHistory" in obj; }, get: function (obj) { return obj.restoreManuscriptHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _regenerateManuscriptCues_decorators, { kind: "method", name: "regenerateManuscriptCues", static: false, private: false, access: { has: function (obj) { return "regenerateManuscriptCues" in obj; }, get: function (obj) { return obj.regenerateManuscriptCues; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _applyManuscriptRepair_decorators, { kind: "method", name: "applyManuscriptRepair", static: false, private: false, access: { has: function (obj) { return "applyManuscriptRepair" in obj; }, get: function (obj) { return obj.applyManuscriptRepair; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getManuscriptRepairStatus_decorators, { kind: "method", name: "getManuscriptRepairStatus", static: false, private: false, access: { has: function (obj) { return "getManuscriptRepairStatus" in obj; }, get: function (obj) { return obj.getManuscriptRepairStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateApplication_decorators, { kind: "method", name: "updateApplication", static: false, private: false, access: { has: function (obj) { return "updateApplication" in obj; }, get: function (obj) { return obj.updateApplication; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateIllustration_decorators, { kind: "method", name: "updateIllustration", static: false, private: false, access: { has: function (obj) { return "updateIllustration" in obj; }, get: function (obj) { return obj.updateIllustration; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateDiscussionQuestion_decorators, { kind: "method", name: "updateDiscussionQuestion", static: false, private: false, access: { has: function (obj) { return "updateDiscussionQuestion" in obj; }, get: function (obj) { return obj.updateDiscussionQuestion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateCitation_decorators, { kind: "method", name: "updateCitation", static: false, private: false, access: { has: function (obj) { return "updateCitation" in obj; }, get: function (obj) { return obj.updateCitation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkspacesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkspacesController = _classThis;
}();
exports.WorkspacesController = WorkspacesController;
