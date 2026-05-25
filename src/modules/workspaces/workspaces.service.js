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
exports.WorkspacesService = void 0;
var common_1 = require("@nestjs/common");
var sermon_outline_entity_1 = require("../../entities/sermon-outline.entity");
var sermon_application_entity_1 = require("../../entities/sermon-application.entity");
var sermon_citation_entity_1 = require("../../entities/sermon-citation.entity");
var sermon_dna_analysis_entity_1 = require("../../entities/sermon-dna-analysis.entity");
var sda_alignment_1 = require("../llm/sda-alignment");
var helpers_1 = require("./helpers");
var workspace_state_service_1 = require("./workspace-state.service");
var workspace_generation_registry_1 = require("./workspace-generation.registry");
var workspaces_prompts_1 = require("./workspaces-prompts");
var theological_lens_util_1 = require("./theological-lens.util");
var WorkspacesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WorkspacesService = _classThis = /** @class */ (function () {
        function WorkspacesService_1(workspaceRepository, outlineRepository, manuscriptRepository, applicationRepository, illustrationRepository, questionRepository, citationRepository, studyReportRepository, llmService, scriptureService, egwService, egwStudyReportService, egwSermonBuilderService, sermonIntegrityService, manuscriptRepairQueue, workspaceGenerationQueue, workspaceStateService) {
            this.workspaceRepository = workspaceRepository;
            this.outlineRepository = outlineRepository;
            this.manuscriptRepository = manuscriptRepository;
            this.applicationRepository = applicationRepository;
            this.illustrationRepository = illustrationRepository;
            this.questionRepository = questionRepository;
            this.citationRepository = citationRepository;
            this.studyReportRepository = studyReportRepository;
            this.llmService = llmService;
            this.scriptureService = scriptureService;
            this.egwService = egwService;
            this.egwStudyReportService = egwStudyReportService;
            this.egwSermonBuilderService = egwSermonBuilderService;
            this.sermonIntegrityService = sermonIntegrityService;
            this.manuscriptRepairQueue = manuscriptRepairQueue;
            this.workspaceGenerationQueue = workspaceGenerationQueue;
            this.workspaceStateService = workspaceStateService;
            this.manuscriptWpm = 145;
            this.manuscriptSoftGateSaveCount = 0;
            this.parseJsonSafe = helpers_1.WorkspaceHelpers.parseJsonSafe;
            this.parseListFromResponse = helpers_1.WorkspaceHelpers.parseListFromResponse;
            this.parseOutlinePointsResponse = helpers_1.WorkspaceHelpers.parseOutlinePointsResponse;
            this.parseOutlineFromResponse = helpers_1.WorkspaceHelpers.parseOutlineFromResponse;
            this.normalizeOutlineData = helpers_1.WorkspaceHelpers.normalizeOutlineData;
            this.parseIllustrationsFromResponse = helpers_1.WorkspaceHelpers.parseIllustrationsFromResponse;
            this.parseCitationsFromResponse = helpers_1.WorkspaceHelpers.parseCitationsFromResponse;
            this.logLlmOutput = helpers_1.WorkspaceHelpers.logLlmOutput;
            this.extractOutlinePointTexts = helpers_1.WorkspaceHelpers.extractOutlinePointTexts;
            this.extractMalformedManuscriptPayload = helpers_1.WorkspaceHelpers.extractMalformedManuscriptPayload;
        }
        WorkspacesService_1.prototype.getPrimaryStudyReport = function (workspace) {
            var _this = this;
            var reports = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) ? workspace.studyReports.filter(Boolean) : [];
            if (!reports.length)
                return null;
            var passage = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.mainPassage) || '').trim().toLowerCase();
            var sortByRecent = function (left, right) {
                var leftTime = new Date(_this.asString((right === null || right === void 0 ? void 0 : right.updatedAt) || (right === null || right === void 0 ? void 0 : right.createdAt) || '')).getTime();
                var rightTime = new Date(_this.asString((left === null || left === void 0 ? void 0 : left.updatedAt) || (left === null || left === void 0 ? void 0 : left.createdAt) || '')).getTime();
                return leftTime - rightTime;
            };
            var matchingPassage = reports.filter(function (report) {
                var sections = (report === null || report === void 0 ? void 0 : report.sections) || {};
                var haystack = [
                    sections === null || sections === void 0 ? void 0 : sections.passageOverview,
                    sections === null || sections === void 0 ? void 0 : sections.exegeticalSummary,
                    sections === null || sections === void 0 ? void 0 : sections.literaryContext,
                    sections === null || sections === void 0 ? void 0 : sections.historicalContext,
                    sections === null || sections === void 0 ? void 0 : sections.canonicalContext,
                    sections === null || sections === void 0 ? void 0 : sections.mainTheologicalClaim,
                ]
                    .map(function (value) { return _this.asString(value).toLowerCase(); })
                    .join(' ');
                return passage ? haystack.includes(passage) : false;
            });
            var pool = matchingPassage.length ? matchingPassage : reports;
            return __spreadArray([], pool, true).sort(sortByRecent)[0] || null;
        };
        WorkspacesService_1.prototype.buildSocraticCoachPrompt = function (workspace, payload) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var mode = payload.mode === 'self_reflection' ? 'self_reflection' : 'refine';
            var listenerProfile = this.asString(payload.listenerProfile || 'general_congregation').toLowerCase();
            var selectedOutline = ((_a = workspace.outlines) === null || _a === void 0 ? void 0 : _a.find(function (o) { return o.isSelected; })) || ((_b = workspace.outlines) === null || _b === void 0 ? void 0 : _b[0]);
            var outlinePoints = this.extractOutlinePointTexts((selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.structure) || {}).slice(0, 8);
            var manuscriptText = this.asString(((_e = (_d = (_c = workspace.manuscripts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.text) || '');
            var reportSections = ((_f = this.getPrimaryStudyReport(workspace)) === null || _f === void 0 ? void 0 : _f.sections) || {};
            var cache = workspace.scriptureCache || {};
            var integritySignals = {
                latestDnaSummary: this.asString(((_h = (_g = workspace.dnaAnalyses) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.summary) || ''),
                lastIntegrityIssues: Array.isArray((_k = (_j = (workspace.metadata || {})) === null || _j === void 0 ? void 0 : _j.dnaIntegrity) === null || _k === void 0 ? void 0 : _k.issues)
                    ? (workspace.metadata || {}).dnaIntegrity.issues.slice(0, 8)
                    : [],
            };
            var context = this.compactJsonForPrompt({
                workspace: {
                    title: workspace.title,
                    mainPassage: workspace.mainPassage,
                    theme: workspace.theme || '',
                    audienceProfile: workspace.audienceProfile || '',
                    sermonGoals: workspace.sermonGoals || '',
                    language: workspace.language || 'en',
                },
                mode: mode,
                listenerProfile: listenerProfile,
                outline: {
                    title: (selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.title) || '',
                    points: outlinePoints,
                    introduction: this.asString(((_l = selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.structure) === null || _l === void 0 ? void 0 : _l.introduction) || ''),
                    conclusion: this.asString(((_m = selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.structure) === null || _m === void 0 ? void 0 : _m.conclusion) || ''),
                },
                manuscript: {
                    excerpt: manuscriptText.slice(0, 2600),
                    wordCount: manuscriptText ? manuscriptText.split(/\s+/).filter(Boolean).length : 0,
                },
                studyReport: {
                    passageOverview: this.asString((reportSections === null || reportSections === void 0 ? void 0 : reportSections.passageOverview) || ''),
                    exegeticalFlow: Array.isArray(reportSections === null || reportSections === void 0 ? void 0 : reportSections.exegeticalFlow) ? reportSections.exegeticalFlow : [],
                    mainTheologicalClaim: this.asString((reportSections === null || reportSections === void 0 ? void 0 : reportSections.mainTheologicalClaim) || ''),
                    structureOfPassage: Array.isArray(reportSections === null || reportSections === void 0 ? void 0 : reportSections.structureOfPassage)
                        ? reportSections.structureOfPassage
                        : [],
                    interpretiveChallenges: Array.isArray(reportSections === null || reportSections === void 0 ? void 0 : reportSections.interpretiveChallenges)
                        ? reportSections.interpretiveChallenges
                        : [],
                },
                scriptureCache: {
                    passageSummary: (cache === null || cache === void 0 ? void 0 : cache.passageSummary) || null,
                    crossReferences: ((_o = cache === null || cache === void 0 ? void 0 : cache.crossReferences) === null || _o === void 0 ? void 0 : _o.ranked) || [],
                    canonicalThemes: (cache === null || cache === void 0 ? void 0 : cache.canonicalThemes) || null,
                },
                integritySignals: integritySignals,
            }, 10000);
            if (payload.questionId && payload.answer) {
                return workspaces_prompts_1.WorkspacesPrompts.socraticCoachQuestion({
                    languageLabel: languageLabel,
                    context: context,
                    questionId: payload.questionId,
                    answer: payload.answer,
                });
            }
            return workspaces_prompts_1.WorkspacesPrompts.socraticCoachList({
                promptOverride: payload.promptOverride || '',
                languageLabel: languageLabel,
                mode: mode,
                listenerProfile: listenerProfile,
                context: context,
            });
        };
        WorkspacesService_1.prototype.buildSocraticCoachRepairPrompt = function (workspace, payload, rawResponse) {
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var mode = payload.mode === 'self_reflection' ? 'self_reflection' : 'refine';
            var listenerProfile = this.asString(payload.listenerProfile || 'general_congregation').toLowerCase();
            var compactRaw = this.compactJsonForPrompt({ rawResponse: rawResponse }, 8000);
            return "Repair this Socratic Sermon Coach output into clean structured JSON.\n\nLanguage: ".concat(languageLabel, "\nMode: ").concat(mode, "\nListener profile: ").concat(listenerProfile, "\nMain passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\n\nRaw output to normalize:\n").concat(compactRaw, "\n\nReturn ONLY valid JSON:\n{\n  \"mode\": \"refine|self_reflection\",\n  \"listenerProfile\": \"string\",\n  \"summary\": \"1-2 sentence coaching summary\",\n  \"weakAreas\": [\"string\"],\n  \"questions\": [\n    {\n      \"id\": \"Q1\",\n      \"dimension\": \"text_fidelity|theological_clarity|audience_relevance|gospel_focus|structure_flow|application_strength|cross_reference_grounding|self_reflection\",\n      \"question\": \"string\",\n      \"purpose\": \"why this matters\",\n      \"sourceAnchor\": \"passage anchor\",\n      \"severity\": \"high|medium|low\",\n      \"listenerAngle\": \"listener challenge\",\n      \"suggestedFollowUp\": \"optional follow-up\"\n    }\n  ],\n  \"nextStepSuggestion\": \"one concrete refinement step\"\n}\n\nRules:\n- Produce exactly 8 questions.\n- Use at least 4 distinct dimensions.\n- Keep text clean: no leading/trailing quote artifacts.\n- Keep all content in ").concat(languageLabel, ".\n- No markdown, no prose outside JSON.");
        };
        WorkspacesService_1.prototype.cleanCoachText = function (value) {
            var text = this.asString(value)
                .replace(/[\u0000-\u001F]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            text = text.replace(/^[`"'“”‘’«»]+/, '').replace(/[`"'“”‘’«»]+$/, '').trim();
            text = text.replace(/\s*["'”’]+\s*$/g, '').trim();
            return text;
        };
        WorkspacesService_1.prototype.normalizeCoachDimension = function (value) {
            var raw = this.asString(value).toLowerCase().trim();
            var allowed = new Set([
                'text_fidelity',
                'theological_clarity',
                'audience_relevance',
                'gospel_focus',
                'structure_flow',
                'application_strength',
                'cross_reference_grounding',
                'self_reflection',
            ]);
            var mapped = raw.includes('application') ? 'application_strength' :
                raw.includes('structure') || raw.includes('flow') ? 'structure_flow' :
                    raw.includes('gospel') ? 'gospel_focus' :
                        raw.includes('theolog') ? 'theological_clarity' :
                            raw.includes('audience') || raw.includes('listener') ? 'audience_relevance' :
                                raw.includes('cross') || raw.includes('reference') ? 'cross_reference_grounding' :
                                    raw.includes('self') || raw.includes('reflect') ? 'self_reflection' :
                                        'text_fidelity';
            return allowed.has(mapped) ? mapped : 'text_fidelity';
        };
        WorkspacesService_1.prototype.normalizeCoachSeverity = function (value) {
            var raw = this.asString(value).toLowerCase().trim();
            if (raw === 'high' || raw === 'medium' || raw === 'low')
                return raw;
            if (raw.includes('alto') || raw.includes('urgent'))
                return 'high';
            if (raw.includes('bajo'))
                return 'low';
            return 'medium';
        };
        WorkspacesService_1.prototype.isCoachSessionLowQuality = function (session) {
            var _this = this;
            var questionCount = Array.isArray(session.questions) ? session.questions.length : 0;
            if (questionCount < 4)
                return true;
            var dimensionSet = new Set((session.questions || []).map(function (item) { return _this.asString(item.dimension); }));
            if (dimensionSet.size < 2)
                return true;
            if (!this.asString(session.summary))
                return true;
            return false;
        };
        WorkspacesService_1.prototype.normalizeSocraticCoachQuestions = function (parsed, response, fallbackAnchor) {
            var _this = this;
            var candidateCollections = [
                parsed === null || parsed === void 0 ? void 0 : parsed.questions,
                parsed === null || parsed === void 0 ? void 0 : parsed.coachQuestions,
                parsed === null || parsed === void 0 ? void 0 : parsed.items,
                parsed === null || parsed === void 0 ? void 0 : parsed.questionList,
                parsed === null || parsed === void 0 ? void 0 : parsed.preguntas,
            ];
            var normalizedFromObjects = candidateCollections
                .filter(function (value) { return Array.isArray(value); })
                .flatMap(function (value) { return value; })
                .map(function (item, idx) {
                var questionText = _this.asString((item === null || item === void 0 ? void 0 : item.question) ||
                    (item === null || item === void 0 ? void 0 : item.text) ||
                    (item === null || item === void 0 ? void 0 : item.prompt) ||
                    (item === null || item === void 0 ? void 0 : item.pregunta) ||
                    (typeof item === 'string' ? item : ''));
                return {
                    id: _this.cleanCoachText((item === null || item === void 0 ? void 0 : item.id) || "Q".concat(idx + 1)),
                    dimension: _this.normalizeCoachDimension((item === null || item === void 0 ? void 0 : item.dimension) || (item === null || item === void 0 ? void 0 : item.category) || (item === null || item === void 0 ? void 0 : item.type) || 'text_fidelity'),
                    question: _this.cleanCoachText(questionText),
                    purpose: _this.cleanCoachText((item === null || item === void 0 ? void 0 : item.purpose) || (item === null || item === void 0 ? void 0 : item.why) || (item === null || item === void 0 ? void 0 : item.reason) || ''),
                    sourceAnchor: _this.cleanCoachText((item === null || item === void 0 ? void 0 : item.sourceAnchor) || (item === null || item === void 0 ? void 0 : item.anchor) || fallbackAnchor),
                    severity: _this.normalizeCoachSeverity((item === null || item === void 0 ? void 0 : item.severity) || 'medium'),
                    listenerAngle: _this.cleanCoachText((item === null || item === void 0 ? void 0 : item.listenerAngle) || (item === null || item === void 0 ? void 0 : item.angle) || ''),
                    suggestedFollowUp: _this.cleanCoachText((item === null || item === void 0 ? void 0 : item.suggestedFollowUp) || (item === null || item === void 0 ? void 0 : item.followUp) || ''),
                };
            })
                .filter(function (item) { return item.question; });
            if (normalizedFromObjects.length) {
                return normalizedFromObjects.slice(0, 10);
            }
            var listFromText = this.parseListFromResponse(response)
                .map(function (line, idx) { return ({
                id: "Q".concat(idx + 1),
                dimension: 'text_fidelity',
                question: _this.cleanCoachText(line),
                purpose: '',
                sourceAnchor: fallbackAnchor,
                severity: 'medium',
                listenerAngle: '',
                suggestedFollowUp: '',
            }); })
                .filter(function (item) { return item.question; })
                .slice(0, 10);
            return listFromText;
        };
        WorkspacesService_1.prototype.normalizeSocraticCoachWeakAreas = function (parsed, response) {
            var _this = this;
            if (Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.weakAreas)) {
                return parsed.weakAreas.map(function (item) { return _this.cleanCoachText(item); }).filter(Boolean).slice(0, 8);
            }
            if (Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.areasToImprove)) {
                return parsed.areasToImprove.map(function (item) { return _this.cleanCoachText(item); }).filter(Boolean).slice(0, 8);
            }
            var extracted = this.parseListFromResponse(this.asString((parsed === null || parsed === void 0 ? void 0 : parsed.summary) || response))
                .map(function (item) { return _this.cleanCoachText(item); })
                .filter(Boolean)
                .slice(0, 4);
            return extracted;
        };
        WorkspacesService_1.prototype.inferRepairIssueTypeFromDimension = function (dimension) {
            var normalized = this.asString(dimension).toLowerCase();
            if (normalized.includes('structure'))
                return 'structure_flow';
            if (normalized.includes('application'))
                return 'application_strength';
            if (normalized.includes('theolog'))
                return 'theological_clarity';
            if (normalized.includes('language'))
                return 'language_consistency';
            if (normalized.includes('gospel'))
                return 'gospel_focus';
            return 'text_fidelity';
        };
        WorkspacesService_1.prototype.inferRepairAnchor = function (question, workspace) {
            var explicit = this.cleanCoachText((question === null || question === void 0 ? void 0 : question.sourceAnchor) || '');
            if (explicit)
                return explicit;
            var q = this.asString((question === null || question === void 0 ? void 0 : question.question) || '').toLowerCase();
            if (q.includes('introduc'))
                return workspace.language === 'es' ? 'Introducción' : 'Introduction';
            if (q.includes('conclus'))
                return workspace.language === 'es' ? 'Conclusión' : 'Conclusion';
            if (q.includes('punto 1') || q.includes('point 1'))
                return workspace.language === 'es' ? 'Punto 1' : 'Point 1';
            if (q.includes('punto 2') || q.includes('point 2'))
                return workspace.language === 'es' ? 'Punto 2' : 'Point 2';
            if (q.includes('punto 3') || q.includes('point 3'))
                return workspace.language === 'es' ? 'Punto 3' : 'Point 3';
            return workspace.mainPassage || 'Manuscript';
        };
        WorkspacesService_1.prototype.buildRepairPlanFromCoachQuestions = function (workspace, questions) {
            var _this = this;
            var plan = (questions || [])
                .map(function (question, index) {
                var issueType = _this.inferRepairIssueTypeFromDimension(question.dimension);
                var targetAnchor = _this.inferRepairAnchor(question, workspace);
                var baseAction = issueType === 'text_fidelity'
                    ? 'Align this section more directly with the passage argument and immediate context.'
                    : issueType === 'structure_flow'
                        ? 'Add an explicit transition to connect this section with the next movement.'
                        : issueType === 'application_strength'
                            ? 'Add concrete, audience-specific application examples tied to the text.'
                            : issueType === 'theological_clarity'
                                ? 'Clarify doctrinal statements and remove ambiguous theological language.'
                                : issueType === 'language_consistency'
                                    ? 'Normalize language and labels to match workspace language.'
                                    : 'Strengthen gospel clarity and Christ-centered emphasis.';
                var expectedOutcome = workspace.language === 'es'
                    ? 'Mayor claridad, fidelidad bíblica y aplicación práctica sin reescribir todo el manuscrito.'
                    : 'Improved clarity, biblical fidelity, and practical application without rewriting the full manuscript.';
                return {
                    issueId: "issue-".concat(index + 1, "-").concat(_this.cleanCoachText(question.id || "Q".concat(index + 1))),
                    questionId: _this.cleanCoachText(question.id || "Q".concat(index + 1)),
                    issueType: issueType,
                    severity: _this.normalizeCoachSeverity(question.severity || 'medium'),
                    targetAnchor: targetAnchor,
                    proposedAction: baseAction,
                    expectedOutcome: expectedOutcome,
                    selected: true,
                };
            })
                .slice(0, 12);
            return plan;
        };
        WorkspacesService_1.prototype.generateSocraticCoach = function (workspaceId, userId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, prompt, response, parsed, now, feedback, questions, weakAreas, summaryFromParsed, summaryFromQuestions, summary, nextStepSuggestion, repairPrompt, repairedResponse, repairedParsed, repairedQuestions, repairedWeakAreas, repairedSummary, repairedNextStep, error_1, repairPlan, coachSession, normalizedCoachSession;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _a.sent();
                            prompt = this.buildSocraticCoachPrompt(workspace, payload || {});
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId, {
                                    temperature: 0.5,
                                    maxTokens: 1600,
                                })];
                        case 2:
                            response = _a.sent();
                            this.logLlmOutput('socratic-coach', response);
                            parsed = this.parseJsonSafe(response) || {};
                            now = new Date().toISOString();
                            if (!((payload === null || payload === void 0 ? void 0 : payload.questionId) && (payload === null || payload === void 0 ? void 0 : payload.answer))) return [3 /*break*/, 4];
                            feedback = {
                                questionId: this.cleanCoachText((parsed === null || parsed === void 0 ? void 0 : parsed.questionId) || payload.questionId),
                                affirmation: this.cleanCoachText((parsed === null || parsed === void 0 ? void 0 : parsed.affirmation) || ''),
                                coachFeedback: this.cleanCoachText((parsed === null || parsed === void 0 ? void 0 : parsed.coachFeedback) || ''),
                                improvementSuggestion: this.cleanCoachText((parsed === null || parsed === void 0 ? void 0 : parsed.improvementSuggestion) || ''),
                                rewriteHint: this.cleanCoachText((parsed === null || parsed === void 0 ? void 0 : parsed.rewriteHint) || ''),
                                nextQuestion: this.cleanCoachText((parsed === null || parsed === void 0 ? void 0 : parsed.nextQuestion) || ''),
                            };
                            workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { socraticCoachLastFeedback: __assign(__assign({}, (workspace.language === 'es' ? this.normalizeSpanishValueDeep(feedback) : feedback)), { listenerProfile: payload.listenerProfile || 'general_congregation', mode: payload.mode || 'refine', updatedAt: now }) });
                            return [4 /*yield*/, this.workspaceRepository.save(workspace)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, __assign(__assign({}, (workspace.language === 'es' ? this.normalizeSpanishValueDeep(feedback) : feedback)), { updatedAt: now })];
                        case 4:
                            questions = this.normalizeSocraticCoachQuestions(parsed, response, workspace.mainPassage);
                            weakAreas = this.normalizeSocraticCoachWeakAreas(parsed, response);
                            summaryFromParsed = this.cleanCoachText((parsed === null || parsed === void 0 ? void 0 : parsed.summary) || (parsed === null || parsed === void 0 ? void 0 : parsed.coachSummary) || (parsed === null || parsed === void 0 ? void 0 : parsed.resumen) || '');
                            summaryFromQuestions = questions.length
                                ? (workspace.language === 'es'
                                    ? "Se detectaron ".concat(questions.length, " preguntas de mejora para refinar fidelidad b\u00EDblica, claridad y aplicaci\u00F3n.")
                                    : "Identified ".concat(questions.length, " coaching questions to refine text fidelity, clarity, and application."))
                                : '';
                            summary = summaryFromParsed || summaryFromQuestions;
                            nextStepSuggestion = this.cleanCoachText((parsed === null || parsed === void 0 ? void 0 : parsed.nextStepSuggestion) || (parsed === null || parsed === void 0 ? void 0 : parsed.nextStep) || (parsed === null || parsed === void 0 ? void 0 : parsed.siguientePaso) || '');
                            if (!this.isCoachSessionLowQuality({ summary: summary, questions: questions })) return [3 /*break*/, 8];
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            repairPrompt = this.buildSocraticCoachRepairPrompt(workspace, payload || {}, response);
                            return [4 /*yield*/, this.llmService.generateCompletion(repairPrompt, userId, {
                                    temperature: 0.3,
                                    maxTokens: 1800,
                                })];
                        case 6:
                            repairedResponse = _a.sent();
                            this.logLlmOutput('socratic-coach:repair', repairedResponse);
                            repairedParsed = this.parseJsonSafe(repairedResponse) || {};
                            repairedQuestions = this.normalizeSocraticCoachQuestions(repairedParsed, repairedResponse, workspace.mainPassage);
                            repairedWeakAreas = this.normalizeSocraticCoachWeakAreas(repairedParsed, repairedResponse);
                            repairedSummary = this.cleanCoachText((repairedParsed === null || repairedParsed === void 0 ? void 0 : repairedParsed.summary) || (repairedParsed === null || repairedParsed === void 0 ? void 0 : repairedParsed.coachSummary) || (repairedParsed === null || repairedParsed === void 0 ? void 0 : repairedParsed.resumen) || '');
                            repairedNextStep = this.cleanCoachText((repairedParsed === null || repairedParsed === void 0 ? void 0 : repairedParsed.nextStepSuggestion) || (repairedParsed === null || repairedParsed === void 0 ? void 0 : repairedParsed.nextStep) || (repairedParsed === null || repairedParsed === void 0 ? void 0 : repairedParsed.siguientePaso) || '');
                            if (!this.isCoachSessionLowQuality({ summary: repairedSummary || summaryFromQuestions, questions: repairedQuestions })) {
                                questions = repairedQuestions;
                                weakAreas = repairedWeakAreas;
                                summary = repairedSummary || summaryFromQuestions;
                                nextStepSuggestion = repairedNextStep || nextStepSuggestion;
                            }
                            return [3 /*break*/, 8];
                        case 7:
                            error_1 = _a.sent();
                            console.warn("[socratic-coach:repair] skipped: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'unknown error'));
                            return [3 /*break*/, 8];
                        case 8:
                            repairPlan = this.buildRepairPlanFromCoachQuestions(workspace, questions);
                            coachSession = {
                                mode: this.asString((parsed === null || parsed === void 0 ? void 0 : parsed.mode) || (payload === null || payload === void 0 ? void 0 : payload.mode) || 'refine').toLowerCase(),
                                listenerProfile: this.asString((parsed === null || parsed === void 0 ? void 0 : parsed.listenerProfile) || (payload === null || payload === void 0 ? void 0 : payload.listenerProfile) || 'general_congregation'),
                                summary: summary,
                                weakAreas: weakAreas,
                                questions: questions,
                                repairPlan: repairPlan,
                                nextStepSuggestion: nextStepSuggestion,
                                generatedAt: now,
                            };
                            normalizedCoachSession = workspace.language === 'es' ? this.normalizeSpanishValueDeep(coachSession) : coachSession;
                            workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { socraticCoachLastSession: normalizedCoachSession });
                            return [4 /*yield*/, this.workspaceRepository.save(workspace)];
                        case 9:
                            _a.sent();
                            return [2 /*return*/, normalizedCoachSession];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.enqueueManuscriptRepair = function (workspaceId, manuscriptId, userId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, manuscript, mode, session, repairPlan, selectedIssueIds, effectiveIssueIds, queuePayload, job;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _b.sent();
                            manuscript = (workspace.manuscripts || []).find(function (item) { return item.id === manuscriptId; });
                            if (!manuscript) {
                                throw new common_1.BadRequestException('Manuscript not found in this workspace.');
                            }
                            mode = (payload === null || payload === void 0 ? void 0 : payload.mode) === 'targeted' ? 'targeted' : 'targeted';
                            session = ((_a = workspace.metadata) === null || _a === void 0 ? void 0 : _a.socraticCoachLastSession) || {};
                            repairPlan = Array.isArray(session === null || session === void 0 ? void 0 : session.repairPlan) ? session.repairPlan : [];
                            if (!repairPlan.length) {
                                throw new common_1.BadRequestException('No Socratic repair plan found. Generate coach questions first.');
                            }
                            selectedIssueIds = (Array.isArray(payload === null || payload === void 0 ? void 0 : payload.selectedIssueIds) ? payload.selectedIssueIds : [])
                                .map(function (item) { return _this.asString(item); })
                                .filter(Boolean);
                            effectiveIssueIds = selectedIssueIds.length
                                ? selectedIssueIds
                                : repairPlan
                                    .filter(function (item) { return (item === null || item === void 0 ? void 0 : item.selected) !== false; })
                                    .map(function (item) { return _this.asString(item === null || item === void 0 ? void 0 : item.issueId); })
                                    .filter(Boolean);
                            if (!effectiveIssueIds.length) {
                                throw new common_1.BadRequestException('Select at least one repair issue to apply.');
                            }
                            queuePayload = {
                                workspaceId: workspaceId,
                                manuscriptId: manuscriptId,
                                userId: userId,
                                selectedIssueIds: Array.from(new Set(effectiveIssueIds)),
                                doNotTouchAnchors: (Array.isArray(payload === null || payload === void 0 ? void 0 : payload.doNotTouchAnchors) ? payload.doNotTouchAnchors : [])
                                    .map(function (item) { return _this.cleanCoachText(item); })
                                    .filter(Boolean),
                                conversationSummary: this.cleanCoachText((payload === null || payload === void 0 ? void 0 : payload.conversationSummary) || ''),
                                mode: mode,
                            };
                            return [4 /*yield*/, this.manuscriptRepairQueue.add('apply-targeted', queuePayload, {
                                    attempts: 1,
                                    removeOnComplete: 50,
                                    removeOnFail: 50,
                                })];
                        case 2:
                            job = _b.sent();
                            return [2 /*return*/, {
                                    jobId: String(job.id),
                                    status: 'queued',
                                    workspaceId: workspaceId,
                                    manuscriptId: manuscriptId,
                                    mode: mode,
                                    selectedIssueIds: queuePayload.selectedIssueIds,
                                }];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.getManuscriptRepairJobStatus = function (workspaceId, manuscriptId, jobId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, data, state, progress, latestManuscript;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.manuscriptRepairQueue.getJob(jobId)];
                        case 2:
                            job = _a.sent();
                            if (!job) {
                                throw new common_1.BadRequestException('Repair job not found.');
                            }
                            data = (job.data || {});
                            if (data.workspaceId !== workspaceId || data.manuscriptId !== manuscriptId || data.userId !== userId) {
                                throw new common_1.BadRequestException('Repair job does not belong to this manuscript.');
                            }
                            return [4 /*yield*/, job.getState()];
                        case 3:
                            state = _a.sent();
                            progress = (job.progress() || {});
                            if (!(state === 'completed')) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.manuscriptRepository.findOne({ where: { id: manuscriptId } })];
                        case 4:
                            latestManuscript = _a.sent();
                            return [2 /*return*/, {
                                    jobId: jobId,
                                    status: 'completed',
                                    state: 'completed',
                                    result: job.returnvalue || null,
                                    manuscript: latestManuscript || null,
                                }];
                        case 5:
                            if (state === 'failed') {
                                return [2 /*return*/, {
                                        jobId: jobId,
                                        status: 'failed',
                                        state: 'failed',
                                        error: job.failedReason || 'Repair job failed.',
                                    }];
                            }
                            return [2 /*return*/, {
                                    jobId: jobId,
                                    status: state === 'active' ? (progress.state || 'patching') : 'queued',
                                    state: progress.state || (state === 'active' ? 'patching' : 'queued'),
                                    message: progress.message || '',
                                    touchedAnchors: progress.touchedAnchors || [],
                                }];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.queueWorkspaceGeneration = function (workspaceId_1, userId_1, capability_1, promptOverride_1) {
            return __awaiter(this, arguments, void 0, function (workspaceId, userId, capability, promptOverride, includeEGW) {
                var job;
                if (includeEGW === void 0) { includeEGW = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.workspaceGenerationQueue.add('generate', {
                                    workspaceId: workspaceId,
                                    userId: userId,
                                    capability: capability,
                                    promptOverride: promptOverride,
                                    includeEGW: includeEGW,
                                }, {
                                    attempts: 2,
                                    removeOnComplete: 50,
                                    removeOnFail: 50,
                                })];
                        case 2:
                            job = _a.sent();
                            return [2 /*return*/, {
                                    jobId: String(job.id),
                                    status: 'queued',
                                    workspaceId: workspaceId,
                                    capability: capability,
                                }];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.getWorkspaceGenerationJobStatus = function (workspaceId, jobId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, data, state, progress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.workspaceGenerationQueue.getJob(jobId)];
                        case 2:
                            job = _a.sent();
                            if (!job) {
                                throw new common_1.BadRequestException('Generation job not found.');
                            }
                            data = (job.data || {});
                            if (data.workspaceId !== workspaceId || data.userId !== userId) {
                                throw new common_1.BadRequestException('Generation job does not belong to this workspace.');
                            }
                            return [4 /*yield*/, job.getState()];
                        case 3:
                            state = _a.sent();
                            progress = (job.progress() || {});
                            if (state === 'completed') {
                                return [2 /*return*/, {
                                        jobId: jobId,
                                        status: 'completed',
                                        state: 'completed',
                                        result: job.returnvalue || null,
                                    }];
                            }
                            if (state === 'failed') {
                                return [2 /*return*/, {
                                        jobId: jobId,
                                        status: 'failed',
                                        state: 'failed',
                                        error: job.failedReason || 'Generation job failed.',
                                    }];
                            }
                            return [2 /*return*/, {
                                    jobId: jobId,
                                    status: state === 'active' ? (progress.state || 'running') : 'queued',
                                    state: progress.state || (state === 'active' ? 'running' : 'queued'),
                                    message: progress.message || '',
                                }];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.validateGenerationResult = function (capability, parsed) {
            var registryEntry = workspace_generation_registry_1.WorkspaceGenerationRegistry[capability];
            var validation = registryEntry.validate(parsed);
            if (!validation.ok) {
                throw new common_1.BadRequestException("".concat(registryEntry.description, " validation failed: ").concat(validation.issues.join('; ')));
            }
            return validation;
        };
        WorkspacesService_1.prototype.processWorkspaceGenerationJob = function (payload, job) {
            return __awaiter(this, void 0, void 0, function () {
                var setStage, report, result, _a, result, result, result, result, result, result, result;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            setStage = function (state, message) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!job) return [3 /*break*/, 2];
                                            return [4 /*yield*/, job.progress({ state: state, message: message })];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, setStage('loading', 'Loading workspace.')];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, this.findOne(payload.workspaceId, payload.userId)];
                        case 2:
                            _c.sent();
                            if (!(payload.capability === 'study-report')) return [3 /*break*/, 6];
                            return [4 /*yield*/, setStage('study-report', 'Generating study report.')];
                        case 3:
                            _c.sent();
                            return [4 /*yield*/, this.generateStudyReport(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 4:
                            report = _c.sent();
                            this.validateGenerationResult('study-report', (report === null || report === void 0 ? void 0 : report.sections) || report);
                            return [4 /*yield*/, setStage('completed', 'Study report completed.')];
                        case 5:
                            _c.sent();
                            return [2 /*return*/, report];
                        case 6:
                            if (!(payload.capability === 'outline-points' || payload.capability === 'outline')) return [3 /*break*/, 13];
                            return [4 /*yield*/, setStage('outline', 'Generating outlines.')];
                        case 7:
                            _c.sent();
                            if (!(payload.capability === 'outline-points')) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.generateOutlines(payload.workspaceId, payload.userId, 3, payload.promptOverride)];
                        case 8:
                            _a = _c.sent();
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, this.generateOutlines(payload.workspaceId, payload.userId, 3, payload.promptOverride)];
                        case 10:
                            _a = _c.sent();
                            _c.label = 11;
                        case 11:
                            result = _a;
                            if (payload.capability === 'outline-points') {
                                this.validateGenerationResult('outline-points', result.map(function (outline) {
                                    var _a;
                                    return ((_a = outline.structure) === null || _a === void 0 ? void 0 : _a.outlineType) ? {
                                        points: _this.extractOutlinePointTexts(outline.structure || {}),
                                        angle: outline.title,
                                    } : {
                                        points: _this.extractOutlinePointTexts(outline.structure || {}),
                                        angle: outline.title,
                                    };
                                }));
                            }
                            else {
                                this.validateGenerationResult('outline', ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.structure) || {});
                            }
                            return [4 /*yield*/, setStage('completed', 'Outline generation completed.')];
                        case 12:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 13:
                            if (!(payload.capability === 'sermon-core')) return [3 /*break*/, 17];
                            return [4 /*yield*/, setStage('sermon-core', 'Generating sermon core.')];
                        case 14:
                            _c.sent();
                            return [4 /*yield*/, this.generateSermonCore(payload.workspaceId, payload.userId)];
                        case 15:
                            result = _c.sent();
                            this.validateGenerationResult('sermon-core', result);
                            return [4 /*yield*/, setStage('completed', 'Sermon core completed.')];
                        case 16:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 17:
                            if (!(payload.capability === 'integrity-check')) return [3 /*break*/, 21];
                            return [4 /*yield*/, setStage('integrity-check', 'Running integrity review.')];
                        case 18:
                            _c.sent();
                            return [4 /*yield*/, this.runIntegrityCheck(payload.workspaceId, payload.userId)];
                        case 19:
                            result = _c.sent();
                            this.validateGenerationResult('integrity-check', result);
                            return [4 /*yield*/, setStage('completed', 'Integrity review completed.')];
                        case 20:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 21:
                            if (!(payload.capability === 'applications')) return [3 /*break*/, 25];
                            return [4 /*yield*/, setStage('applications', 'Generating applications.')];
                        case 22:
                            _c.sent();
                            return [4 /*yield*/, this.generateApplications(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 23:
                            result = _c.sent();
                            this.validateGenerationResult('applications', result);
                            return [4 /*yield*/, setStage('completed', 'Applications completed.')];
                        case 24:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 25:
                            if (!(payload.capability === 'discussion-questions')) return [3 /*break*/, 29];
                            return [4 /*yield*/, setStage('discussion-questions', 'Generating discussion questions.')];
                        case 26:
                            _c.sent();
                            return [4 /*yield*/, this.generateDiscussionQuestions(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 27:
                            result = _c.sent();
                            this.validateGenerationResult('discussion-questions', result);
                            return [4 /*yield*/, setStage('completed', 'Discussion questions completed.')];
                        case 28:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 29:
                            if (!(payload.capability === 'illustrations')) return [3 /*break*/, 33];
                            return [4 /*yield*/, setStage('illustrations', 'Generating illustration ideas.')];
                        case 30:
                            _c.sent();
                            return [4 /*yield*/, this.generateIllustrations(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 31:
                            result = _c.sent();
                            this.validateGenerationResult('illustrations', result);
                            return [4 /*yield*/, setStage('completed', 'Illustrations completed.')];
                        case 32:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 33:
                            if (!(payload.capability === 'citations')) return [3 /*break*/, 37];
                            return [4 /*yield*/, setStage('citations', 'Generating citations.')];
                        case 34:
                            _c.sent();
                            return [4 /*yield*/, this.generateCitations(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 35:
                            result = _c.sent();
                            this.validateGenerationResult('citations', result);
                            return [4 /*yield*/, setStage('completed', 'Citations completed.')];
                        case 36:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 37:
                            if (!(payload.capability === 'media-suggestions')) return [3 /*break*/, 41];
                            return [4 /*yield*/, setStage('media-suggestions', 'Generating media suggestions.')];
                        case 38:
                            _c.sent();
                            return [4 /*yield*/, this.generateMediaSuggestions(payload.workspaceId, payload.userId, payload.promptOverride)];
                        case 39:
                            result = _c.sent();
                            this.validateGenerationResult('media-suggestions', result);
                            return [4 /*yield*/, setStage('completed', 'Media suggestions completed.')];
                        case 40:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 41: return [4 /*yield*/, setStage('failed', "Unsupported capability: ".concat(payload.capability))];
                        case 42:
                            _c.sent();
                            throw new common_1.BadRequestException("Unsupported generation capability: ".concat(payload.capability));
                    }
                });
            });
        };
        WorkspacesService_1.prototype.processManuscriptRepairJob = function (payload, job) {
            return __awaiter(this, void 0, void 0, function () {
                var setStage, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setStage = function (state_1, message_1) {
                                var args_1 = [];
                                for (var _i = 2; _i < arguments.length; _i++) {
                                    args_1[_i - 2] = arguments[_i];
                                }
                                return __awaiter(_this, __spreadArray([state_1, message_1], args_1, true), void 0, function (state, message, touchedAnchors) {
                                    if (touchedAnchors === void 0) { touchedAnchors = []; }
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!job) return [3 /*break*/, 2];
                                                return [4 /*yield*/, job.progress({ state: state, message: message, touchedAnchors: touchedAnchors })];
                                            case 1:
                                                _a.sent();
                                                _a.label = 2;
                                            case 2:
                                                console.info('[manuscript-repair]', JSON.stringify({
                                                    tag: 'manuscript_repair_stage',
                                                    workspaceId: payload.workspaceId,
                                                    manuscriptId: payload.manuscriptId,
                                                    state: state,
                                                    message: message,
                                                    touchedAnchors: touchedAnchors,
                                                }));
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            };
                            return [4 /*yield*/, setStage('planning', 'Preparing targeted repair plan.')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.applyTargetedManuscriptRepair(payload, setStage)];
                        case 2:
                            result = _a.sent();
                            return [4 /*yield*/, setStage('completed', 'Targeted repair completed.', (result === null || result === void 0 ? void 0 : result.touchedAnchors) || [])];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.extractAnchorSnippet = function (html, anchor) {
            var source = this.asString(html || '');
            var marker = this.cleanCoachText(anchor || '').toLowerCase();
            if (!source || !marker)
                return '';
            var plain = this.stripHtmlForWordCount(source);
            var idx = plain.toLowerCase().indexOf(marker);
            if (idx < 0)
                return '';
            var start = Math.max(0, idx - 240);
            var end = Math.min(plain.length, idx + Math.max(marker.length, 220));
            var snippet = plain.slice(start, end).replace(/\s+/g, ' ').trim();
            return snippet;
        };
        WorkspacesService_1.prototype.buildTargetedRepairPatchPrompt = function (workspace, issue, manuscriptHtml, snippet, conversationSummary) {
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var theologicalLens = (0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens);
            return workspaces_prompts_1.WorkspacesPrompts.targetedRepairPatch({
                languageLabel: languageLabel,
                theologicalLens: theologicalLens,
                mainPassage: workspace.mainPassage,
                theme: workspace.theme || '',
                audience: workspace.audienceProfile || '',
                issueId: issue.issueId,
                issueType: issue.issueType,
                severity: issue.severity,
                targetAnchor: issue.targetAnchor,
                proposedAction: issue.proposedAction,
                expectedOutcome: issue.expectedOutcome,
                conversationSummary: conversationSummary || 'N/A',
                manuscriptHtmlJson: this.compactJsonForPrompt({ manuscriptHtml: manuscriptHtml }, 7000),
                snippet: snippet,
            });
        };
        WorkspacesService_1.prototype.hasAdventistDrift = function (text) {
            var normalized = this.asString(text || '').toLowerCase();
            return /\bdomingo\b|\bsunday\b/.test(normalized);
        };
        WorkspacesService_1.prototype.stripLeadingDuplicateAnchorTitle = function (replacementHtml, anchorText, headingContext) {
            if (headingContext === void 0) { headingContext = false; }
            var normalizedAnchor = this.cleanCoachText(anchorText || '');
            if (!replacementHtml || !normalizedAnchor)
                return replacementHtml;
            var cleaned = this.asString(replacementHtml);
            var escapedAnchor = normalizedAnchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            cleaned = cleaned.replace(new RegExp("^\\s*<h[1-4][^>]*>\\s*".concat(escapedAnchor, "\\s*<\\/h[1-4]>\\s*"), 'i'), '');
            cleaned = cleaned.replace(new RegExp("^\\s*<p[^>]*>\\s*".concat(escapedAnchor, "\\s*[\\.:\\-\u2013\u2014]?\\s*<\\/p>\\s*"), 'i'), '');
            cleaned = cleaned.replace(new RegExp("^\\s*<p([^>]*)>\\s*".concat(escapedAnchor, "\\s*[\\.:\\-\u2013\u2014]?\\s*"), 'i'), '<p$1>');
            if (headingContext) {
                cleaned = cleaned.replace(new RegExp("^\\s*<p([^>]*)>\\s*(?:".concat(escapedAnchor, "\\s*[\\.:\\-\u2013\u2014]?\\s*)+"), 'i'), '<p$1>');
                cleaned = cleaned.replace(new RegExp("^\\s*(?:".concat(escapedAnchor, "\\s*[\\.:\\-\u2013\u2014]?\\s*)+"), 'i'), '');
            }
            else {
                cleaned = cleaned.replace(new RegExp("^\\s*<p([^>]*)>\\s*(".concat(escapedAnchor, "\\s*[\\.:\\-\u2013\u2014]?\\s*)(?:").concat(escapedAnchor, "\\s*[\\.:\\-\u2013\u2014]?\\s*)+"), 'i'), '<p$1>$2');
                cleaned = cleaned.replace(new RegExp("^\\s*(".concat(escapedAnchor, "\\s*[\\.:\\-\u2013\u2014]?\\s*)(?:").concat(escapedAnchor, "\\s*[\\.:\\-\u2013\u2014]?\\s*)+"), 'i'), '$1');
            }
            return cleaned.trim() || replacementHtml;
        };
        WorkspacesService_1.prototype.applyFirstSnippetReplacement = function (html, anchor, beforeSnippet, replacement) {
            var source = this.asString(html || '');
            var anchorText = this.cleanCoachText(anchor || '');
            var before = this.cleanCoachText(beforeSnippet || '');
            if (!source)
                return source;
            var replacementHtml = this.sanitizeGeneratedManuscriptHtml(/<\/?(p|h2|h3|h4|ul|ol|li|blockquote|strong|em|br)\b/i.test(replacement)
                ? replacement
                : this.markdownLikeToHtml(replacement));
            if (!replacementHtml)
                return source;
            var headingMatch = !!anchorText &&
                new RegExp("(<h[2-4][^>]*>[\\s\\S]*?".concat(anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "[\\s\\S]*?<\\/h[2-4]>)"), 'i')
                    .test(source);
            var normalizedReplacementHtml = this.stripLeadingDuplicateAnchorTitle(replacementHtml, anchorText, headingMatch);
            if (anchorText) {
                var escapedAnchor = anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                var headingRegex = new RegExp("(<h[2-4][^>]*>[\\s\\S]*?".concat(escapedAnchor, "[\\s\\S]*?<\\/h[2-4]>)"), 'i');
                if (headingRegex.test(source)) {
                    return source.replace(headingRegex, "$1\n".concat(normalizedReplacementHtml));
                }
            }
            var escapedBefore = before.slice(0, 120).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            if (escapedBefore) {
                var paragraphRegex = new RegExp("(<p[^>]*>[\\s\\S]{0,400}?".concat(escapedBefore, "[\\s\\S]{0,400}?<\\/p>)"), 'i');
                if (paragraphRegex.test(source)) {
                    return source.replace(paragraphRegex, normalizedReplacementHtml);
                }
            }
            return "".concat(source, "\n<h3>Repair \u00B7 ").concat(anchorText || 'Target Section', "</h3>\n").concat(normalizedReplacementHtml).trim();
        };
        WorkspacesService_1.prototype.applyTargetedManuscriptRepair = function (payload, setStage) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, manuscript, session, repairPlan, selectedIssues, lockSet, touchedAnchors, auditTrail, currentHtml, repairAttempts, repairedIssues, remainingIssues, _i, selectedIssues_1, issue, anchor, fallbackSnippet, lockedSnippet, beforeSnippet, missingAnchorSnippet, patched, afterSnippet, attempt, patchPrompt, patchResponse, patchParsed, candidateReplacement, patchedHtml, cues_1, safeAfterSnippet, failedAfterSnippet, normalizedOptions, quality, cues, cuePrompt, cueResponse, parsedCuePayload, error_2, plainText, wordCount, estimatedMinutes, unresolvedQualityIssues, metadata;
                var _this = this;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                return __generator(this, function (_q) {
                    switch (_q.label) {
                        case 0: return [4 /*yield*/, this.findOne(payload.workspaceId, payload.userId)];
                        case 1:
                            workspace = _q.sent();
                            manuscript = (workspace.manuscripts || []).find(function (item) { return item.id === payload.manuscriptId; });
                            if (!manuscript) {
                                throw new common_1.BadRequestException('Manuscript not found for targeted repair.');
                            }
                            session = ((_a = ((workspace.metadata || {}))) === null || _a === void 0 ? void 0 : _a.socraticCoachLastSession) || {};
                            repairPlan = (Array.isArray(session === null || session === void 0 ? void 0 : session.repairPlan) ? session.repairPlan : []);
                            selectedIssues = repairPlan.filter(function (item) { return payload.selectedIssueIds.includes(_this.asString(item === null || item === void 0 ? void 0 : item.issueId)); });
                            if (!selectedIssues.length) {
                                throw new common_1.BadRequestException('No matching repair issues selected.');
                            }
                            lockSet = new Set((payload.doNotTouchAnchors || []).map(function (item) { return _this.cleanCoachText(item).toLowerCase(); }));
                            touchedAnchors = new Set();
                            auditTrail = [];
                            currentHtml = this.asString(((_b = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _b === void 0 ? void 0 : _b.text) || '');
                            repairAttempts = 0;
                            repairedIssues = [];
                            remainingIssues = [];
                            _i = 0, selectedIssues_1 = selectedIssues;
                            _q.label = 2;
                        case 2:
                            if (!(_i < selectedIssues_1.length)) return [3 /*break*/, 9];
                            issue = selectedIssues_1[_i];
                            anchor = this.cleanCoachText(issue.targetAnchor || '');
                            if (!anchor) {
                                fallbackSnippet = 'No target anchor was provided for this repair action.';
                                remainingIssues.push(issue.issueId);
                                auditTrail.push({
                                    issueId: issue.issueId,
                                    anchor: '',
                                    beforeSnippet: fallbackSnippet,
                                    afterSnippet: fallbackSnippet,
                                    result: 'skipped',
                                });
                                return [3 /*break*/, 8];
                            }
                            if (lockSet.has(anchor.toLowerCase())) {
                                lockedSnippet = this.extractAnchorSnippet(currentHtml, anchor) ||
                                    "Anchor \"".concat(anchor, "\" is locked. No manuscript section was modified.");
                                remainingIssues.push(issue.issueId);
                                auditTrail.push({
                                    issueId: issue.issueId,
                                    anchor: anchor,
                                    beforeSnippet: lockedSnippet,
                                    afterSnippet: lockedSnippet,
                                    result: 'locked',
                                });
                                return [3 /*break*/, 8];
                            }
                            beforeSnippet = this.extractAnchorSnippet(currentHtml, anchor);
                            if (!beforeSnippet) {
                                missingAnchorSnippet = "No manuscript section matched anchor \"".concat(anchor, "\".");
                                remainingIssues.push(issue.issueId);
                                auditTrail.push({
                                    issueId: issue.issueId,
                                    anchor: anchor,
                                    beforeSnippet: missingAnchorSnippet,
                                    afterSnippet: missingAnchorSnippet,
                                    result: 'skipped',
                                });
                                return [3 /*break*/, 8];
                            }
                            return [4 /*yield*/, setStage('patching', "Repairing ".concat(issue.questionId, " (").concat(issue.issueType, ")"), Array.from(touchedAnchors))];
                        case 3:
                            _q.sent();
                            patched = false;
                            afterSnippet = '';
                            attempt = 0;
                            _q.label = 4;
                        case 4:
                            if (!(attempt < 2)) return [3 /*break*/, 7];
                            repairAttempts += 1;
                            patchPrompt = this.buildTargetedRepairPatchPrompt(workspace, issue, currentHtml, beforeSnippet, payload.conversationSummary || '');
                            return [4 /*yield*/, this.llmService.generateCompletion(patchPrompt, payload.userId, {
                                    temperature: 0.2,
                                    maxTokens: 1200,
                                })];
                        case 5:
                            patchResponse = _q.sent();
                            this.logLlmOutput("manuscript:targeted-repair:".concat(issue.issueId, ":").concat(attempt + 1), patchResponse);
                            patchParsed = this.parseJsonSafe(patchResponse) || {};
                            candidateReplacement = this.cleanCoachText((patchParsed === null || patchParsed === void 0 ? void 0 : patchParsed.replacement) || (patchParsed === null || patchParsed === void 0 ? void 0 : patchParsed.patch) || (patchParsed === null || patchParsed === void 0 ? void 0 : patchParsed.text) || patchResponse);
                            if (!candidateReplacement) {
                                return [3 /*break*/, 6];
                            }
                            if ((0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens) === 'adventist' && this.hasAdventistDrift(candidateReplacement)) {
                                return [3 /*break*/, 6];
                            }
                            patchedHtml = this.applyFirstSnippetReplacement(currentHtml, anchor, beforeSnippet, candidateReplacement);
                            if (patchedHtml === currentHtml) {
                                return [3 /*break*/, 6];
                            }
                            cues_1 = this.sanitizeCueObject(((_c = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _c === void 0 ? void 0 : _c.cues) || {});
                            if (workspace.language === 'es' && this.hasEnglishLeakInSpanishManuscript(patchedHtml, cues_1)) {
                                return [3 /*break*/, 6];
                            }
                            currentHtml = patchedHtml;
                            touchedAnchors.add(anchor);
                            afterSnippet = this.extractAnchorSnippet(currentHtml, anchor);
                            patched = true;
                            return [3 /*break*/, 7];
                        case 6:
                            attempt += 1;
                            return [3 /*break*/, 4];
                        case 7:
                            if (patched) {
                                safeAfterSnippet = afterSnippet || beforeSnippet;
                                repairedIssues.push(issue.issueId);
                                auditTrail.push({
                                    issueId: issue.issueId,
                                    anchor: anchor,
                                    beforeSnippet: beforeSnippet,
                                    afterSnippet: safeAfterSnippet,
                                    result: 'repaired',
                                });
                            }
                            else {
                                failedAfterSnippet = this.extractAnchorSnippet(currentHtml, anchor) || beforeSnippet;
                                remainingIssues.push(issue.issueId);
                                auditTrail.push({
                                    issueId: issue.issueId,
                                    anchor: anchor,
                                    beforeSnippet: beforeSnippet,
                                    afterSnippet: failedAfterSnippet,
                                    result: 'failed',
                                });
                            }
                            _q.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 2];
                        case 9: return [4 /*yield*/, setStage('validating', 'Validating repaired manuscript.', Array.from(touchedAnchors))];
                        case 10:
                            _q.sent();
                            normalizedOptions = this.normalizeManuscriptOptions(workspace, ((_e = (_d = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _d === void 0 ? void 0 : _d.metadata) === null || _e === void 0 ? void 0 : _e.options) || {});
                            quality = this.assessManuscriptQuality(currentHtml, normalizedOptions);
                            cues = this.sanitizeCueObject(((_f = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _f === void 0 ? void 0 : _f.cues) || {});
                            if (!(touchedAnchors.size > 0)) return [3 /*break*/, 14];
                            _q.label = 11;
                        case 11:
                            _q.trys.push([11, 13, , 14]);
                            cuePrompt = this.buildManuscriptCueRefreshPrompt(workspace, currentHtml);
                            return [4 /*yield*/, this.llmService.generateCompletion(cuePrompt, payload.userId, {
                                    temperature: 0.2,
                                    maxTokens: 1400,
                                })];
                        case 12:
                            cueResponse = _q.sent();
                            this.logLlmOutput('manuscript:targeted-repair:cues-refresh', cueResponse);
                            parsedCuePayload = this.parseJsonSafe(cueResponse);
                            cues = this.sanitizeCueObject((parsedCuePayload === null || parsedCuePayload === void 0 ? void 0 : parsedCuePayload.cues) || parsedCuePayload || cues);
                            if (workspace.language === 'es') {
                                cues = {
                                    slide: cues.slide.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    keyLine: cues.keyLine.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    transition: cues.transition.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    pause: cues.pause.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    read: cues.read.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    quote: cues.quote.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    cta: cues.cta.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                };
                            }
                            return [3 /*break*/, 14];
                        case 13:
                            error_2 = _q.sent();
                            console.warn("[manuscript:targeted-repair:cues-refresh] skipped: ".concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'unknown error'));
                            return [3 /*break*/, 14];
                        case 14:
                            if (!this.hasUsableManuscriptText(currentHtml)) {
                                throw new common_1.BadRequestException('Targeted repair produced unusable manuscript content.');
                            }
                            if ((0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens) === 'adventist' && this.hasAdventistDrift(currentHtml)) {
                                throw new common_1.BadRequestException('Targeted repair violated Adventist guardrails.');
                            }
                            if (workspace.language === 'es' && this.hasEnglishLeakInSpanishManuscript(currentHtml, cues)) {
                                throw new common_1.BadRequestException('Targeted repair violated Spanish language lock.');
                            }
                            plainText = this.stripHtmlForWordCount(currentHtml);
                            wordCount = this.countWords(plainText);
                            estimatedMinutes = Math.max(1, Math.ceil(wordCount / this.manuscriptWpm));
                            unresolvedQualityIssues = quality.issues.filter(function (item) { return !repairedIssues.includes(item); });
                            metadata = __assign(__assign({}, (((_g = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _g === void 0 ? void 0 : _g.metadata) || {})), { quality: __assign(__assign({}, (((_j = (_h = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _h === void 0 ? void 0 : _h.metadata) === null || _j === void 0 ? void 0 : _j.quality) || {})), { wordCount: wordCount, targetWords: quality.targets.targetWords, minWords: quality.targets.minWords, maxWords: quality.targets.maxWords, finalIssues: quality.issues, status: quality.issues.length ? 'needs_review' : 'ok', repairAttempts: repairAttempts, warningMessage: this.buildManuscriptQualityWarningMessage(quality.issues, workspace.language || 'en'), repairedIssues: repairedIssues, remainingIssues: Array.from(new Set(__spreadArray(__spreadArray([], remainingIssues, true), unresolvedQualityIssues, true))) }), repair: {
                                    lastRepairedAt: new Date().toISOString(),
                                    mode: 'targeted',
                                    conversationSummary: payload.conversationSummary || '',
                                    touchedAnchors: Array.from(touchedAnchors),
                                    cueAnchors: Array.from(touchedAnchors).reduce(function (acc, anchor, index) {
                                        var _a;
                                        return (__assign(__assign({}, acc), (_a = {}, _a["anchor-".concat(index + 1)] = anchor, _a)));
                                    }, {}),
                                    auditTrail: auditTrail,
                                } });
                            manuscript.content = __assign(__assign({}, ((manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) || {})), { formatVersion: ((_k = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _k === void 0 ? void 0 : _k.formatVersion) || 'v2', text: currentHtml, cues: cues, metadata: metadata });
                            manuscript.wordCount = wordCount;
                            manuscript.estimatedMinutes = estimatedMinutes;
                            return [4 /*yield*/, this.manuscriptRepository.save(manuscript)];
                        case 15:
                            _q.sent();
                            console.warn('[manuscript-targeted-repair]', JSON.stringify({
                                tag: 'manuscript_targeted_repair',
                                workspaceId: payload.workspaceId,
                                manuscriptId: payload.manuscriptId,
                                selectedIssues: payload.selectedIssueIds,
                                repairedIssues: repairedIssues,
                                remainingIssues: ((_l = metadata === null || metadata === void 0 ? void 0 : metadata.quality) === null || _l === void 0 ? void 0 : _l.remainingIssues) || [],
                                repairAttempts: repairAttempts,
                                wordCount: wordCount,
                            }));
                            return [2 /*return*/, {
                                    manuscriptId: manuscript.id,
                                    repairedIssues: repairedIssues,
                                    remainingIssues: ((_m = metadata === null || metadata === void 0 ? void 0 : metadata.quality) === null || _m === void 0 ? void 0 : _m.remainingIssues) || [],
                                    touchedAnchors: Array.from(touchedAnchors),
                                    repairAttempts: repairAttempts,
                                    qualityStatus: ((_o = metadata === null || metadata === void 0 ? void 0 : metadata.quality) === null || _o === void 0 ? void 0 : _o.status) || 'needs_review',
                                    warningMessage: ((_p = metadata === null || metadata === void 0 ? void 0 : metadata.quality) === null || _p === void 0 ? void 0 : _p.warningMessage) || '',
                                    changeSummary: workspace.language === 'es'
                                        ? "Se repararon ".concat(repairedIssues.length, " elementos y quedaron ").concat(remainingIssues.length, " pendientes.")
                                        : "Repaired ".concat(repairedIssues.length, " items with ").concat(remainingIssues.length, " remaining."),
                                }];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.normalizePointTextForSimilarity = function (text) {
            return (text || '')
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        };
        WorkspacesService_1.prototype.buildPointSignature = function (points) {
            var _this = this;
            if (!Array.isArray(points) || points.length === 0)
                return '';
            return points
                .map(function (point) { return _this.normalizePointTextForSimilarity(point); })
                .filter(Boolean)
                .join(' | ');
        };
        WorkspacesService_1.prototype.isSignatureTooSimilar = function (candidateSignature, existingSignatures) {
            if (!candidateSignature)
                return false;
            var candidateTokens = new Set(candidateSignature.split(/\s+/).filter(Boolean));
            if (candidateTokens.size === 0)
                return false;
            var _loop_1 = function (existing) {
                var existingTokens = new Set(existing.split(/\s+/).filter(Boolean));
                if (existingTokens.size === 0)
                    return "continue";
                var overlap = __spreadArray([], candidateTokens, true).filter(function (token) { return existingTokens.has(token); }).length;
                var union = new Set(__spreadArray(__spreadArray([], candidateTokens, true), existingTokens, true)).size || 1;
                var jaccard = overlap / union;
                if (jaccard >= 0.72) {
                    return { value: true };
                }
            };
            for (var _i = 0, existingSignatures_1 = existingSignatures; _i < existingSignatures_1.length; _i++) {
                var existing = existingSignatures_1[_i];
                var state_1 = _loop_1(existing);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return false;
        };
        WorkspacesService_1.prototype.getWorkspaceUiState = function (workspace) {
            var _a;
            var rawState = ((_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.uiState) || {};
            var phaseCandidate = this.asString((rawState === null || rawState === void 0 ? void 0 : rawState.phase) || '').toUpperCase();
            var sectionCandidate = this.asString((rawState === null || rawState === void 0 ? void 0 : rawState.section) || '').toLowerCase();
            var phase = ['THEME', 'PASSAGE', 'STUDY', 'OUTLINE', 'WRITE', 'REFINE', 'DELIVER'].includes(phaseCandidate)
                ? phaseCandidate
                : this.inferWorkspacePhase(workspace);
            var section = ['workspace', 'scripture', 'study-report', 'outlines', 'manuscript', 'citations', 'dna', 'media'].includes(sectionCandidate)
                ? sectionCandidate
                : this.inferWorkspaceSection(phase);
            return { phase: phase, section: section };
        };
        WorkspacesService_1.prototype.inferWorkspacePhase = function (workspace) {
            var progress = this.getWorkspaceProgress(workspace);
            if (progress.deliverPrepared)
                return 'DELIVER';
            if (progress.refineCompleted)
                return 'REFINE';
            if (progress.manuscriptWritten)
                return 'WRITE';
            if (progress.outlineCreated)
                return 'OUTLINE';
            if (progress.studyGenerated)
                return 'STUDY';
            if (progress.passageExplored)
                return 'PASSAGE';
            return 'THEME';
        };
        WorkspacesService_1.prototype.inferWorkspaceSection = function (phase) {
            switch (phase) {
                case 'PASSAGE':
                    return 'scripture';
                case 'STUDY':
                    return 'study-report';
                case 'OUTLINE':
                    return 'outlines';
                case 'WRITE':
                    return 'manuscript';
                case 'REFINE':
                    return 'dna';
                case 'DELIVER':
                    return 'media';
                case 'THEME':
                default:
                    return 'workspace';
            }
        };
        WorkspacesService_1.prototype.getWorkspaceArtifactCounts = function (workspace) {
            return {
                outlines: Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.outlines) ? workspace.outlines.length : 0,
                manuscripts: Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.manuscripts) ? workspace.manuscripts.length : 0,
                studyReports: Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) ? workspace.studyReports.length : 0,
                applications: Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.applications) ? workspace.applications.length : 0,
                illustrations: Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.illustrations) ? workspace.illustrations.length : 0,
                citations: Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.citations) ? workspace.citations.length : 0,
            };
        };
        WorkspacesService_1.prototype.getWorkspaceSourceLedger = function (workspace) {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var citationSources = ((workspace === null || workspace === void 0 ? void 0 : workspace.citations) || []).flatMap(function (citation) {
                var _a, _b;
                var verses = Array.isArray(citation === null || citation === void 0 ? void 0 : citation.verseReferences) ? citation.verseReferences : [];
                if (!verses.length) {
                    return [{
                            id: "citation-source-".concat(citation.id),
                            sourceType: ((_a = citation === null || citation === void 0 ? void 0 : citation.externalSources) === null || _a === void 0 ? void 0 : _a.length) ? 'external' : 'generated',
                            label: _this.asString((citation === null || citation === void 0 ? void 0 : citation.statement) || 'Citation'),
                            reference: ((_b = citation === null || citation === void 0 ? void 0 : citation.externalSources) === null || _b === void 0 ? void 0 : _b[0]) || '',
                            verified: Boolean(citation === null || citation === void 0 ? void 0 : citation.isVerified),
                        }];
                }
                return verses.map(function (verse, index) { return ({
                    id: "citation-source-".concat(citation.id, "-").concat(index),
                    sourceType: 'bible',
                    label: verse,
                    reference: verse,
                    verified: Boolean(citation === null || citation === void 0 ? void 0 : citation.isVerified),
                }); });
            });
            var studyReportSource = (((_e = (_d = (_c = (_b = (_a = workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.sections) === null || _c === void 0 ? void 0 : _c.studyAssets) === null || _d === void 0 ? void 0 : _d.categoryAssets) === null || _e === void 0 ? void 0 : _e.mediaSuggestionCards) || []).length
                ? [{
                        id: "study-report-".concat(((_g = (_f = workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.id) || 'latest'),
                        sourceType: 'generated',
                        label: 'Study report',
                        reference: ((_j = (_h = workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.createdAt) || '',
                        verified: true,
                    }]
                : [];
            return __spreadArray(__spreadArray([], citationSources, true), studyReportSource, true).slice(0, 100);
        };
        WorkspacesService_1.prototype.getWorkspaceMediaPack = function (workspace) {
            var _this = this;
            var _a, _b;
            var metadata = ((workspace === null || workspace === void 0 ? void 0 : workspace.metadata) || {});
            var mediaPack = (metadata === null || metadata === void 0 ? void 0 : metadata.mediaPack) || ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.deliverables) === null || _a === void 0 ? void 0 : _a.mediaPack) || null;
            if (!mediaPack || typeof mediaPack !== 'object') {
                return null;
            }
            return {
                status: this.asString(mediaPack.status || (mediaPack.generatedAt ? 'ready' : 'draft')),
                generatedAt: mediaPack.generatedAt ? this.asString(mediaPack.generatedAt) : undefined,
                deckIntent: this.asString(mediaPack.deckIntent || '') || undefined,
                deckModeLabel: this.asString(mediaPack.deckModeLabel || '') || undefined,
                sourceOutlineId: mediaPack.sourceOutlineId ? this.asString(mediaPack.sourceOutlineId) : null,
                sourceManuscriptId: mediaPack.sourceManuscriptId ? this.asString(mediaPack.sourceManuscriptId) : null,
                sourceStudyReportId: mediaPack.sourceStudyReportId ? this.asString(mediaPack.sourceStudyReportId) : null,
                activeSermonDeckId: mediaPack.activeSermonDeckId ? this.asString(mediaPack.activeSermonDeckId) : null,
                activeSocialDeckId: mediaPack.activeSocialDeckId ? this.asString(mediaPack.activeSocialDeckId) : null,
                latestDeckByIntent: mediaPack.latestDeckByIntent && typeof mediaPack.latestDeckByIntent === 'object'
                    ? Object.fromEntries(Object.entries(mediaPack.latestDeckByIntent).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return [key, value ? _this.asString(value) : null];
                    }))
                    : undefined,
                archivedDeckIds: Array.isArray(mediaPack.archivedDeckIds)
                    ? mediaPack.archivedDeckIds.map(function (item) { return _this.asString(item); }).filter(Boolean)
                    : undefined,
                slideCount: typeof mediaPack.slideCount === 'number' ? mediaPack.slideCount : undefined,
                audioEnabled: typeof mediaPack.audioEnabled === 'boolean' ? mediaPack.audioEnabled : undefined,
                musicEnabled: typeof mediaPack.musicEnabled === 'boolean' ? mediaPack.musicEnabled : undefined,
                videoEnabled: typeof mediaPack.videoEnabled === 'boolean' ? mediaPack.videoEnabled : undefined,
                exportPrepared: typeof mediaPack.exportPrepared === 'boolean'
                    ? mediaPack.exportPrepared
                    : Boolean((_b = metadata === null || metadata === void 0 ? void 0 : metadata.deliverables) === null || _b === void 0 ? void 0 : _b.export),
            };
        };
        WorkspacesService_1.prototype.getWorkspaceExportPack = function (workspace) {
            var _this = this;
            var _a;
            var metadata = ((workspace === null || workspace === void 0 ? void 0 : workspace.metadata) || {});
            var exportPack = (metadata === null || metadata === void 0 ? void 0 : metadata.exportPack) || ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.deliverables) === null || _a === void 0 ? void 0 : _a.export) || null;
            if (!exportPack || typeof exportPack !== 'object') {
                return null;
            }
            var artifacts = Array.isArray(exportPack.artifacts) ? exportPack.artifacts : [];
            return {
                status: this.asString(exportPack.status || (exportPack.generatedAt ? 'ready' : 'draft')),
                generatedAt: exportPack.generatedAt ? this.asString(exportPack.generatedAt) : undefined,
                sourceOutlineId: exportPack.sourceOutlineId ? this.asString(exportPack.sourceOutlineId) : null,
                sourceManuscriptId: exportPack.sourceManuscriptId ? this.asString(exportPack.sourceManuscriptId) : null,
                sourceStudyReportId: exportPack.sourceStudyReportId ? this.asString(exportPack.sourceStudyReportId) : null,
                artifacts: artifacts
                    .map(function (artifact) { return ({
                    type: _this.asString((artifact === null || artifact === void 0 ? void 0 : artifact.type) || 'study-report'),
                    label: _this.asString((artifact === null || artifact === void 0 ? void 0 : artifact.label) || (artifact === null || artifact === void 0 ? void 0 : artifact.type) || 'Export'),
                    status: _this.asString((artifact === null || artifact === void 0 ? void 0 : artifact.status) || 'pending'),
                    filename: (artifact === null || artifact === void 0 ? void 0 : artifact.filename) ? _this.asString(artifact.filename) : undefined,
                    sourceOutlineId: (artifact === null || artifact === void 0 ? void 0 : artifact.sourceOutlineId) ? _this.asString(artifact.sourceOutlineId) : null,
                    sourceManuscriptId: (artifact === null || artifact === void 0 ? void 0 : artifact.sourceManuscriptId) ? _this.asString(artifact.sourceManuscriptId) : null,
                    sourceStudyReportId: (artifact === null || artifact === void 0 ? void 0 : artifact.sourceStudyReportId) ? _this.asString(artifact.sourceStudyReportId) : null,
                    url: (artifact === null || artifact === void 0 ? void 0 : artifact.url) ? _this.asString(artifact.url) : null,
                }); })
                    .filter(function (artifact) { return artifact.label; }),
            };
        };
        WorkspacesService_1.prototype.featureReadinessItem = function (status, requiredItems, recommendedItems, message, extras) {
            if (extras === void 0) { extras = {}; }
            return __assign({ status: status, requiredItems: requiredItems, recommendedItems: recommendedItems, message: message }, extras);
        };
        WorkspacesService_1.prototype.latestDateFrom = function (items) {
            var timestamps = items
                .map(function (item) { return item ? (item.updatedAt || item.createdAt) : null; })
                .filter(Boolean)
                .map(function (value) { return new Date(value); })
                .filter(function (value) { return !Number.isNaN(value.getTime()); })
                .map(function (value) { return value.toISOString(); });
            return timestamps.sort().at(-1);
        };
        WorkspacesService_1.prototype.getWorkspaceFeatureReadiness = function (workspace) {
            return __awaiter(this, void 0, void 0, function () {
                var mainPassage, studyReport, selectedOutline, selectedManuscript, latestCitation, latestIntegrityReport, latestDna, latestTheologicalCenter, latestTension, latestDoctrinal, latestBlindSpot, latestStrategy, scriptureCache, lookupHistory, scriptureReady, scriptureGenerated, crossReferenceSeed, _a, egwLibrary, _b, configuredLlmProvider, llmProviderHealth, llmConfigured, llmProviderLabel, llmProviderStatus, llmProviderMessage, outlineExists, manuscriptExists, studyReportExists, citationsCount, hasAdvancedAnalysis, mediaPack, exportPack, readiness;
                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
                return __generator(this, function (_3) {
                    switch (_3.label) {
                        case 0:
                            mainPassage = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.mainPassage) || '').trim();
                            studyReport = ((_c = workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) === null || _c === void 0 ? void 0 : _c[0]) || null;
                            selectedOutline = this.getActiveOutline(workspace);
                            selectedManuscript = this.getActiveManuscript(workspace);
                            latestCitation = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.citations) ? workspace.citations[0] || null : null;
                            latestIntegrityReport = this.getLatestIntegrityReport(workspace);
                            latestDna = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.dnaAnalyses) ? workspace.dnaAnalyses[0] || null : null;
                            latestTheologicalCenter = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.theologicalCenterAnalyses) ? workspace.theologicalCenterAnalyses[0] || null : null;
                            latestTension = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.tensionAnalyses) ? workspace.tensionAnalyses[0] || null : null;
                            latestDoctrinal = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.doctrinalChecks) ? workspace.doctrinalChecks[0] || null : null;
                            latestBlindSpot = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.blindSpotAnalyses) ? workspace.blindSpotAnalyses[0] || null : null;
                            latestStrategy = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.preachingStrategies) ? workspace.preachingStrategies[0] || null : null;
                            scriptureCache = ((workspace === null || workspace === void 0 ? void 0 : workspace.scriptureCache) || {});
                            lookupHistory = Array.isArray(scriptureCache.lookupHistory) ? scriptureCache.lookupHistory : [];
                            scriptureReady = Boolean(mainPassage);
                            scriptureGenerated = Boolean(scriptureCache.scriptureResult || scriptureCache.scriptureLastLookup || lookupHistory.length > 0);
                            if (!((_d = this.scriptureService) === null || _d === void 0 ? void 0 : _d.getCrossReferenceSeedStats)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.scriptureService.getCrossReferenceSeedStats()];
                        case 1:
                            _a = _3.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = { loaded: false, entries: 0 };
                            _3.label = 3;
                        case 3:
                            crossReferenceSeed = _a;
                            if (!(workspace.egwEnabled && ((_e = this.egwService) === null || _e === void 0 ? void 0 : _e.getLibraryStats))) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.egwService.getLibraryStats()];
                        case 4:
                            _b = _3.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _b = null;
                            _3.label = 6;
                        case 6:
                            egwLibrary = _b;
                            configuredLlmProvider = ((_f = this.llmService) === null || _f === void 0 ? void 0 : _f.getConfiguredProvider) ? this.llmService.getConfiguredProvider() : null;
                            llmProviderHealth = configuredLlmProvider && ((_g = this.llmService) === null || _g === void 0 ? void 0 : _g.getProviderHealth)
                                ? this.llmService.getProviderHealth(configuredLlmProvider)
                                : null;
                            llmConfigured = Boolean(configuredLlmProvider);
                            llmProviderLabel = ((_h = this.llmService) === null || _h === void 0 ? void 0 : _h.getConfiguredProviderLabel) ? this.llmService.getConfiguredProviderLabel() : 'LLM provider';
                            llmProviderStatus = (llmProviderHealth === null || llmProviderHealth === void 0 ? void 0 : llmProviderHealth.status) || 'needs_service';
                            llmProviderMessage = (llmProviderHealth === null || llmProviderHealth === void 0 ? void 0 : llmProviderHealth.message) || 'Configure an LLM provider to enable generation.';
                            outlineExists = Boolean(selectedOutline);
                            manuscriptExists = Boolean(selectedManuscript);
                            studyReportExists = Boolean(studyReport);
                            citationsCount = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.citations) ? workspace.citations.length : 0;
                            hasAdvancedAnalysis = Boolean(latestDna || latestTheologicalCenter || latestTension || latestDoctrinal || latestBlindSpot || latestStrategy);
                            mediaPack = this.getWorkspaceMediaPack(workspace);
                            exportPack = this.getWorkspaceExportPack(workspace);
                            readiness = {
                                scripture: scriptureReady
                                    ? this.featureReadinessItem(scriptureGenerated ? 'generated' : 'ready', ['mainPassage'], ['translation'], scriptureGenerated
                                        ? 'A scripture snapshot exists for this workspace.'
                                        : 'Use the selected passage to look up Scripture and save a snapshot.', {
                                        lastGeneratedAt: this.asString(scriptureCache.cachedAt || ((_j = lookupHistory === null || lookupHistory === void 0 ? void 0 : lookupHistory[0]) === null || _j === void 0 ? void 0 : _j.cachedAt) || ''),
                                        artifactId: scriptureCache.scriptureLastLookup || mainPassage || undefined,
                                        count: lookupHistory.length,
                                    })
                                    : this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['translation'], 'Add a main passage before looking up Scripture.'),
                                passageSummary: mainPassage
                                    ? this.featureReadinessItem(scriptureCache.passageSummary ? 'generated' : 'ready', ['mainPassage'], ['scripture lookup'], scriptureCache.passageSummary
                                        ? 'Passage summary is generated and stored in the workspace.'
                                        : 'Generate a passage summary from the current passage.', {
                                        lastGeneratedAt: this.asString(scriptureCache.cachedAt || ''),
                                        artifactId: scriptureCache.passageSummary ? mainPassage : undefined,
                                        count: scriptureCache.passageSummary ? 1 : 0,
                                    })
                                    : this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['scripture lookup'], 'Add a main passage before generating a passage summary.'),
                                translationComparison: mainPassage
                                    ? this.featureReadinessItem(scriptureCache.translationComparison ? 'generated' : 'ready', ['mainPassage'], ['scripture lookup', 'multiple translations'], scriptureCache.translationComparison
                                        ? 'Translation comparison is saved for this workspace.'
                                        : 'Compare translations from the current passage.', {
                                        lastGeneratedAt: this.asString(scriptureCache.cachedAt || ''),
                                        artifactId: scriptureCache.translationComparison ? mainPassage : undefined,
                                        count: scriptureCache.translationComparison ? 1 : 0,
                                    })
                                    : this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['scripture lookup'], 'Add a main passage before comparing translations.'),
                                wordStudy: mainPassage
                                    ? this.featureReadinessItem(scriptureCache.wordStudy ? 'generated' : 'ready', ['word', 'language'], ['current passage'], scriptureCache.wordStudy
                                        ? 'Word study is saved for the current workspace.'
                                        : 'Pick a key term to study in the current passage.', {
                                        lastGeneratedAt: this.asString(((_k = scriptureCache.wordStudy) === null || _k === void 0 ? void 0 : _k.cachedAt) || ''),
                                        artifactId: ((_l = scriptureCache.wordStudy) === null || _l === void 0 ? void 0 : _l.word) ? String(scriptureCache.wordStudy.word) : undefined,
                                        count: scriptureCache.wordStudy ? 1 : 0,
                                    })
                                    : this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['word', 'language'], 'Add a main passage before running word study.'),
                                crossReferences: !mainPassage
                                    ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['cross-reference seed data'], 'Add a main passage before exploring cross references.')
                                    : !crossReferenceSeed.loaded
                                        ? this.featureReadinessItem('needs_data', ['cross-reference seed data'], ['mainPassage'], 'Cross-reference seed data has not been loaded yet.', {
                                            count: 0,
                                        })
                                        : this.featureReadinessItem(((_o = (_m = scriptureCache.crossReferences) === null || _m === void 0 ? void 0 : _m.ranked) === null || _o === void 0 ? void 0 : _o.length) ? 'generated' : 'ready', ['mainPassage'], ['cross-reference seed data'], ((_q = (_p = scriptureCache.crossReferences) === null || _p === void 0 ? void 0 : _p.ranked) === null || _q === void 0 ? void 0 : _q.length)
                                            ? 'Cross references are saved for this workspace.'
                                            : 'Run cross-reference lookup for the selected passage.', {
                                            lastGeneratedAt: this.asString(((_r = scriptureCache.crossReferences) === null || _r === void 0 ? void 0 : _r.cachedAt) || ''),
                                            artifactId: ((_s = scriptureCache.crossReferences) === null || _s === void 0 ? void 0 : _s.verse) || mainPassage,
                                            count: Array.isArray((_t = scriptureCache.crossReferences) === null || _t === void 0 ? void 0 : _t.ranked) ? scriptureCache.crossReferences.ranked.length : 0,
                                        }),
                                egw: !workspace.egwEnabled
                                    ? this.featureReadinessItem('needs_prerequisite', ['EGW enabled'], ['main passage'], 'Enable EGW in Setup to surface Spirit of Prophecy insights.')
                                    : !egwLibrary || egwLibrary.books === 0
                                        ? this.featureReadinessItem('needs_data', ['EGW library'], ['main passage'], 'EGW library is not loaded yet.', {
                                            count: (egwLibrary === null || egwLibrary === void 0 ? void 0 : egwLibrary.books) || 0,
                                        })
                                        : this.featureReadinessItem(((_v = (_u = scriptureCache.verseCommentary) === null || _u === void 0 ? void 0 : _u.notes) === null || _v === void 0 ? void 0 : _v.length) ? 'generated' : 'ready', ['EGW enabled', 'main passage'], ['EGW seed data'], ((_x = (_w = scriptureCache.verseCommentary) === null || _w === void 0 ? void 0 : _w.notes) === null || _x === void 0 ? void 0 : _x.length)
                                            ? 'Spirit of Prophecy commentary exists for this workspace.'
                                            : 'Use EGW tools on the current passage to generate insights.', {
                                            count: egwLibrary.books,
                                        }),
                                studyReport: !mainPassage
                                    ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['LLM provider'], 'Add a main passage before generating a study report.')
                                    : llmProviderStatus === 'needs_service'
                                        ? this.featureReadinessItem('needs_service', ['LLM provider'], ['mainPassage'], llmProviderMessage)
                                        : llmProviderStatus === 'failed'
                                            ? this.featureReadinessItem('failed', ['LLM provider'], ['mainPassage'], llmProviderMessage)
                                            : this.featureReadinessItem(studyReportExists ? 'generated' : 'ready', ['mainPassage'], ['LLM provider', 'scripture lookup'], studyReportExists
                                                ? 'Study report is stored in the workspace.'
                                                : 'Generate a study report from the current passage.', {
                                                lastGeneratedAt: (studyReport === null || studyReport === void 0 ? void 0 : studyReport.createdAt) ? this.asString(studyReport.createdAt) : undefined,
                                                artifactId: studyReport === null || studyReport === void 0 ? void 0 : studyReport.id,
                                                count: studyReportExists ? 1 : 0,
                                            }),
                                sermonCore: !mainPassage
                                    ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['study report'], 'Add a main passage before generating sermon core.')
                                    : llmProviderStatus === 'needs_service'
                                        ? this.featureReadinessItem('needs_service', ['LLM provider'], ['study report'], llmProviderMessage)
                                        : llmProviderStatus === 'failed'
                                            ? this.featureReadinessItem('failed', ['LLM provider'], ['study report'], llmProviderMessage)
                                            : this.featureReadinessItem((workspace === null || workspace === void 0 ? void 0 : workspace.sermonCore) ? 'generated' : 'ready', ['mainPassage'], ['study report'], (workspace === null || workspace === void 0 ? void 0 : workspace.sermonCore)
                                                ? 'Sermon core is saved on the workspace.'
                                                : 'Generate a sermon core before outlining.', {
                                                artifactId: (workspace === null || workspace === void 0 ? void 0 : workspace.sermonCore) ? "".concat(workspace.id, ":sermon-core") : undefined,
                                                count: (workspace === null || workspace === void 0 ? void 0 : workspace.sermonCore) ? 1 : 0,
                                            }),
                                outline: !mainPassage
                                    ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['sermon core', 'study report'], 'Add a main passage before generating an outline.')
                                    : llmProviderStatus === 'needs_service'
                                        ? this.featureReadinessItem('needs_service', ['LLM provider'], ['sermon core', 'study report'], llmProviderMessage)
                                        : llmProviderStatus === 'failed'
                                            ? this.featureReadinessItem('failed', ['LLM provider'], ['sermon core', 'study report'], llmProviderMessage)
                                            : this.featureReadinessItem(outlineExists ? 'generated' : 'ready', ['mainPassage'], ['sermon core', 'study report'], outlineExists ? 'Outline exists for the workspace.' : 'Generate an outline from the passage or sermon core.', {
                                                lastGeneratedAt: (selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.createdAt) ? this.asString(selectedOutline.createdAt) : undefined,
                                                artifactId: selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.id,
                                                count: Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.outlines) ? workspace.outlines.length : 0,
                                            }),
                                manuscript: !outlineExists
                                    ? this.featureReadinessItem('needs_prerequisite', ['selected outline'], ['study report', 'sermon core'], 'Select or create an outline before drafting the manuscript.')
                                    : llmProviderStatus === 'needs_service'
                                        ? this.featureReadinessItem('needs_service', ['LLM provider'], ['selected outline'], llmProviderMessage)
                                        : llmProviderStatus === 'failed'
                                            ? this.featureReadinessItem('failed', ['LLM provider'], ['selected outline'], llmProviderMessage)
                                            : this.featureReadinessItem(manuscriptExists ? 'generated' : 'ready', ['selected outline'], ['study report'], manuscriptExists ? 'Manuscript exists for the current workspace.' : 'Draft the manuscript from the selected outline.', {
                                                lastGeneratedAt: (selectedManuscript === null || selectedManuscript === void 0 ? void 0 : selectedManuscript.updatedAt) ? this.asString(selectedManuscript.updatedAt) : undefined,
                                                artifactId: selectedManuscript === null || selectedManuscript === void 0 ? void 0 : selectedManuscript.id,
                                                count: Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.manuscripts) ? workspace.manuscripts.length : 0,
                                            }),
                                citations: !manuscriptExists && !outlineExists
                                    ? this.featureReadinessItem('needs_prerequisite', ['manuscript or outline'], ['study report'], 'Generate a manuscript or outline before reviewing citations.')
                                    : llmProviderStatus === 'needs_service'
                                        ? this.featureReadinessItem('needs_service', ['LLM provider'], ['manuscript', 'outline'], llmProviderMessage)
                                        : llmProviderStatus === 'failed'
                                            ? this.featureReadinessItem('failed', ['LLM provider'], ['manuscript', 'outline'], llmProviderMessage)
                                            : this.featureReadinessItem(citationsCount > 0 ? 'generated' : 'ready', ['manuscript or outline'], ['study report'], citationsCount > 0 ? 'Citation entries exist for this workspace.' : 'Generate citations from the current sermon draft.', {
                                                lastGeneratedAt: this.latestDateFrom((workspace === null || workspace === void 0 ? void 0 : workspace.citations) || []),
                                                artifactId: latestCitation === null || latestCitation === void 0 ? void 0 : latestCitation.id,
                                                count: citationsCount,
                                            }),
                                integrityReview: !manuscriptExists
                                    ? this.featureReadinessItem('needs_prerequisite', ['manuscript'], ['citations'], 'Generate a manuscript before running the integrity review.')
                                    : this.featureReadinessItem(latestIntegrityReport ? 'generated' : 'ready', ['manuscript'], ['citations', 'outline'], latestIntegrityReport
                                        ? 'Integrity review exists for this workspace.'
                                        : 'Run the integrity review after drafting the manuscript.', {
                                        lastGeneratedAt: (latestIntegrityReport === null || latestIntegrityReport === void 0 ? void 0 : latestIntegrityReport.updatedAt) ? this.asString(latestIntegrityReport.updatedAt) : undefined,
                                        artifactId: latestIntegrityReport ? "".concat(workspace.id, ":integrity-report") : undefined,
                                        count: latestIntegrityReport ? 1 : 0,
                                    }),
                                visualExploration: !mainPassage
                                    ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['outline', 'manuscript'], 'Add a main passage before opening visual exploration.')
                                    : this.featureReadinessItem(hasAdvancedAnalysis ? 'generated' : 'ready', ['mainPassage'], ['outline', 'manuscript'], hasAdvancedAnalysis
                                        ? 'At least one visual analysis exists for this workspace.'
                                        : 'Use the current sermon to explore theology, evidence, and narrative maps.', {
                                        lastGeneratedAt: this.latestDateFrom([
                                            latestDna,
                                            latestTheologicalCenter,
                                            latestTension,
                                            latestDoctrinal,
                                            latestBlindSpot,
                                            latestStrategy,
                                        ]),
                                        artifactId: (latestDna === null || latestDna === void 0 ? void 0 : latestDna.id) || (latestTheologicalCenter === null || latestTheologicalCenter === void 0 ? void 0 : latestTheologicalCenter.id) || (latestTension === null || latestTension === void 0 ? void 0 : latestTension.id) || (latestDoctrinal === null || latestDoctrinal === void 0 ? void 0 : latestDoctrinal.id) || (latestBlindSpot === null || latestBlindSpot === void 0 ? void 0 : latestBlindSpot.id) || (latestStrategy === null || latestStrategy === void 0 ? void 0 : latestStrategy.id),
                                        count: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.dnaAnalyses) ? workspace.dnaAnalyses : []), true), (Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.theologicalCenterAnalyses) ? workspace.theologicalCenterAnalyses : []), true), (Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.tensionAnalyses) ? workspace.tensionAnalyses : []), true), (Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.doctrinalChecks) ? workspace.doctrinalChecks : []), true), (Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.blindSpotAnalyses) ? workspace.blindSpotAnalyses : []), true), (Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.preachingStrategies) ? workspace.preachingStrategies : []), true).length,
                                    }),
                                media: llmProviderStatus === 'needs_service'
                                    ? this.featureReadinessItem('needs_service', ['LLM provider'], ['outline', 'manuscript'], llmProviderMessage)
                                    : llmProviderStatus === 'failed'
                                        ? this.featureReadinessItem('failed', ['LLM provider'], ['outline', 'manuscript'], llmProviderMessage)
                                        : !outlineExists && !manuscriptExists && !studyReportExists
                                            ? this.featureReadinessItem('needs_prerequisite', ['outline or manuscript'], ['study report'], 'Create an outline or manuscript before composing media assets.')
                                            : this.featureReadinessItem(mediaPack ? 'generated' : 'ready', ['outline or manuscript'], ['study report', 'slides service'], mediaPack
                                                ? 'Media pack is saved for this workspace.'
                                                : 'Compose media assets from the current sermon workspace.', {
                                                lastGeneratedAt: mediaPack === null || mediaPack === void 0 ? void 0 : mediaPack.generatedAt,
                                                artifactId: (mediaPack === null || mediaPack === void 0 ? void 0 : mediaPack.sourceOutlineId) || (mediaPack === null || mediaPack === void 0 ? void 0 : mediaPack.sourceManuscriptId) || (mediaPack === null || mediaPack === void 0 ? void 0 : mediaPack.sourceStudyReportId) || workspace.id,
                                                count: (mediaPack === null || mediaPack === void 0 ? void 0 : mediaPack.slideCount) || 0,
                                            }),
                                slides: llmProviderStatus === 'needs_service'
                                    ? this.featureReadinessItem('needs_service', ['LLM provider'], ['media pack', 'slides service'], llmProviderMessage)
                                    : llmProviderStatus === 'failed'
                                        ? this.featureReadinessItem('failed', ['LLM provider'], ['media pack', 'slides service'], llmProviderMessage)
                                        : !outlineExists && !manuscriptExists && !studyReportExists
                                            ? this.featureReadinessItem('needs_prerequisite', ['outline or manuscript'], ['study report'], 'Create an outline or manuscript before generating slides.')
                                            : this.featureReadinessItem(((_y = exportPack === null || exportPack === void 0 ? void 0 : exportPack.artifacts) === null || _y === void 0 ? void 0 : _y.length) ? 'generated' : 'ready', ['outline or manuscript'], ['media pack', 'slides service'], ((_z = exportPack === null || exportPack === void 0 ? void 0 : exportPack.artifacts) === null || _z === void 0 ? void 0 : _z.length)
                                                ? 'Slide export artifacts are available for this workspace.'
                                                : 'Generate or compose slides from the workspace media pack.', {
                                                lastGeneratedAt: exportPack === null || exportPack === void 0 ? void 0 : exportPack.generatedAt,
                                                artifactId: ((_1 = (_0 = exportPack === null || exportPack === void 0 ? void 0 : exportPack.artifacts) === null || _0 === void 0 ? void 0 : _0[0]) === null || _1 === void 0 ? void 0 : _1.filename) || (exportPack === null || exportPack === void 0 ? void 0 : exportPack.sourceOutlineId) || workspace.id,
                                                count: ((_2 = exportPack === null || exportPack === void 0 ? void 0 : exportPack.artifacts) === null || _2 === void 0 ? void 0 : _2.length) || 0,
                                            }),
                                llmProvider: llmConfigured
                                    ? this.featureReadinessItem(llmProviderStatus === 'failed' ? 'failed' : 'ready', ['LLM provider'], ['main passage', 'study report'], llmProviderStatus === 'failed'
                                        ? llmProviderMessage
                                        : "".concat(llmProviderLabel, " is configured for generation."), llmProviderStatus === 'failed' ? { checkedAt: llmProviderHealth === null || llmProviderHealth === void 0 ? void 0 : llmProviderHealth.checkedAt } : {})
                                    : this.featureReadinessItem('needs_service', ['LLM provider'], ['main passage', 'study report'], 'Configure LM_STUDIO_URL, OPENAI_API_KEY, or MINIMAX_API_KEY to enable generation.'),
                            };
                            return [2 /*return*/, readiness];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.getWorkspaceClaimLedger = function (workspace) {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var claimsFromCitations = ((workspace === null || workspace === void 0 ? void 0 : workspace.citations) || []).map(function (citation) {
                var _a;
                var verified = Boolean(citation === null || citation === void 0 ? void 0 : citation.isVerified);
                var supportLevel = verified
                    ? 'supported'
                    : Array.isArray(citation === null || citation === void 0 ? void 0 : citation.verseReferences) && citation.verseReferences.length
                        ? 'partially_supported'
                        : 'needs_review';
                var sourceType = Array.isArray(citation === null || citation === void 0 ? void 0 : citation.verseReferences) && citation.verseReferences.length
                    ? 'bible'
                    : (((_a = citation === null || citation === void 0 ? void 0 : citation.externalSources) === null || _a === void 0 ? void 0 : _a.length) ? 'external' : 'generated');
                return {
                    id: citation.id,
                    claimText: _this.asString((citation === null || citation === void 0 ? void 0 : citation.statement) || ''),
                    claimType: _this.asString((citation === null || citation === void 0 ? void 0 : citation.statementType) || 'claim'),
                    supportLevel: supportLevel,
                    sourceType: sourceType,
                    sourceIds: Array.isArray(citation === null || citation === void 0 ? void 0 : citation.verseReferences)
                        ? citation.verseReferences.map(function (verse) { return _this.cleanCoachText(verse); }).filter(Boolean)
                        : [],
                    location: 'citations',
                    verified: verified,
                };
            });
            var outline = this.getActiveOutline(workspace);
            var outlineClaims = outline
                ? [{
                        id: "outline-".concat(outline.id),
                        claimText: this.asString(((_b = (_a = workspace === null || workspace === void 0 ? void 0 : workspace.outlines) === null || _a === void 0 ? void 0 : _a.find(function (item) { return item.id === outline.id; })) === null || _b === void 0 ? void 0 : _b.title) || ''),
                        claimType: 'outline',
                        supportLevel: 'needs_review',
                        sourceType: 'generated',
                        sourceIds: [outline.id],
                        location: 'outline',
                        verified: false,
                    }]
                : [];
            var studyReportClaim = this.asString(((_e = (_d = (_c = workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.sections) === null || _e === void 0 ? void 0 : _e.mainTheologicalClaim) || '');
            var studyReportClaims = studyReportClaim
                ? [{
                        id: "study-report-claim-".concat(((_g = (_f = workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.id) || 'latest'),
                        claimText: studyReportClaim,
                        claimType: 'study-report',
                        supportLevel: 'needs_review',
                        sourceType: 'generated',
                        sourceIds: ((_j = (_h = workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.id) ? [workspace.studyReports[0].id] : [],
                        location: 'study-report',
                        verified: false,
                    }]
                : [];
            return __spreadArray(__spreadArray(__spreadArray([], claimsFromCitations, true), outlineClaims, true), studyReportClaims, true).slice(0, 100);
        };
        WorkspacesService_1.prototype.getWorkspaceClaimReviews = function (workspace) {
            var _this = this;
            var _a;
            var claimReviews = (_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.claimReviews;
            if (!Array.isArray(claimReviews)) {
                return [];
            }
            return claimReviews
                .map(function (review) { return ({
                claimId: _this.asString((review === null || review === void 0 ? void 0 : review.claimId) || ''),
                decision: _this.asString((review === null || review === void 0 ? void 0 : review.decision) || ''),
                note: (review === null || review === void 0 ? void 0 : review.note) ? _this.asString(review.note) : undefined,
                updatedAt: _this.asString((review === null || review === void 0 ? void 0 : review.updatedAt) || ''),
                claimText: (review === null || review === void 0 ? void 0 : review.claimText) ? _this.asString(review.claimText) : undefined,
                claimType: (review === null || review === void 0 ? void 0 : review.claimType) ? _this.asString(review.claimType) : undefined,
                supportLevel: (review === null || review === void 0 ? void 0 : review.supportLevel) ? _this.asString(review.supportLevel) : undefined,
                sourceType: (review === null || review === void 0 ? void 0 : review.sourceType) ? _this.asString(review.sourceType) : undefined,
                sourceIds: Array.isArray(review === null || review === void 0 ? void 0 : review.sourceIds) ? review.sourceIds.map(function (item) { return _this.asString(item); }).filter(Boolean) : undefined,
                location: (review === null || review === void 0 ? void 0 : review.location) ? _this.asString(review.location) : undefined,
            }); })
                .filter(function (review) { return review.claimId && ['repair', 'acknowledge', 'cite'].includes(review.decision); });
        };
        WorkspacesService_1.prototype.recordClaimReview = function (workspaceId, userId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, claimId, claimLedger, claim, updatedAt, review, metadata, claimReviews, filtered;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _a.sent();
                            claimId = this.asString((payload === null || payload === void 0 ? void 0 : payload.claimId) || '');
                            if (!claimId) {
                                throw new common_1.BadRequestException('Claim id is required.');
                            }
                            claimLedger = this.getWorkspaceClaimLedger(workspace);
                            claim = claimLedger.find(function (item) { return item.id === claimId; });
                            if (!claim) {
                                throw new common_1.BadRequestException('Claim not found in this workspace.');
                            }
                            updatedAt = new Date().toISOString();
                            review = {
                                claimId: claimId,
                                decision: payload.decision,
                                note: payload.note ? this.asString(payload.note) : undefined,
                                updatedAt: updatedAt,
                                claimText: payload.claimText ? this.asString(payload.claimText) : claim.claimText,
                                claimType: payload.claimType ? this.asString(payload.claimType) : claim.claimType,
                                supportLevel: payload.supportLevel || claim.supportLevel,
                                sourceType: payload.sourceType || claim.sourceType,
                                sourceIds: Array.isArray(payload.sourceIds) && payload.sourceIds.length
                                    ? payload.sourceIds.map(function (item) { return _this.cleanCoachText(item); }).filter(Boolean)
                                    : claim.sourceIds,
                                location: payload.location ? this.asString(payload.location) : claim.location,
                            };
                            metadata = (workspace.metadata || {});
                            claimReviews = Array.isArray(metadata.claimReviews) ? metadata.claimReviews : [];
                            filtered = claimReviews.filter(function (item) { return _this.asString((item === null || item === void 0 ? void 0 : item.claimId) || '') !== claimId; });
                            metadata.claimReviews = __spreadArray(__spreadArray([], filtered, true), [review], false).slice(-100);
                            workspace.metadata = metadata;
                            return [4 /*yield*/, this.workspaceRepository.save(workspace)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, review];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.buildIntegrityIssueId = function (issue, index) {
            var raw = [
                issue.severity || 'issue',
                issue.category || 'general',
                issue.message || issue.affectedItem || 'integrity',
                String(index + 1),
            ]
                .join('-')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .slice(0, 72);
            return raw ? "issue-".concat(raw) : "issue-".concat(index + 1);
        };
        WorkspacesService_1.prototype.getWorkspaceIntegrityIssueLedger = function (workspace) {
            var _this = this;
            var _a;
            var report = (_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.integrityReport;
            var reviews = this.getWorkspaceIntegrityIssueReviews(workspace);
            var reviewMap = new Map(reviews.map(function (review) { return [
                review.issueId,
                review,
            ]; }));
            var issues = Array.isArray(report === null || report === void 0 ? void 0 : report.issues) ? report.issues : [];
            return issues.map(function (issue, index) {
                var issueId = _this.buildIntegrityIssueId(issue, index);
                var review = reviewMap.get(issueId);
                return {
                    id: issueId,
                    severity: _this.asString((issue === null || issue === void 0 ? void 0 : issue.severity) || 'warning'),
                    category: _this.asString((issue === null || issue === void 0 ? void 0 : issue.category) || 'general'),
                    message: _this.asString((issue === null || issue === void 0 ? void 0 : issue.message) || ''),
                    affectedItem: (issue === null || issue === void 0 ? void 0 : issue.affectedItem) ? _this.asString(issue.affectedItem) : undefined,
                    decision: review === null || review === void 0 ? void 0 : review.decision,
                    note: review === null || review === void 0 ? void 0 : review.note,
                    updatedAt: (review === null || review === void 0 ? void 0 : review.updatedAt) || _this.asString((report === null || report === void 0 ? void 0 : report.updatedAt) || ''),
                    status: review ? 'reviewed' : 'open',
                };
            });
        };
        WorkspacesService_1.prototype.getWorkspaceIntegrityIssueReviews = function (workspace) {
            var _this = this;
            var _a;
            var reviews = (_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.integrityIssueReviews;
            if (!Array.isArray(reviews)) {
                return [];
            }
            return reviews
                .map(function (review) { return ({
                issueId: _this.asString((review === null || review === void 0 ? void 0 : review.issueId) || ''),
                decision: _this.asString((review === null || review === void 0 ? void 0 : review.decision) || ''),
                note: (review === null || review === void 0 ? void 0 : review.note) ? _this.asString(review.note) : undefined,
                updatedAt: _this.asString((review === null || review === void 0 ? void 0 : review.updatedAt) || ''),
                issueMessage: (review === null || review === void 0 ? void 0 : review.issueMessage) ? _this.asString(review.issueMessage) : undefined,
                severity: (review === null || review === void 0 ? void 0 : review.severity) ? _this.asString(review.severity) : undefined,
                category: (review === null || review === void 0 ? void 0 : review.category) ? _this.asString(review.category) : undefined,
                affectedItem: (review === null || review === void 0 ? void 0 : review.affectedItem) ? _this.asString(review.affectedItem) : undefined,
            }); })
                .filter(function (review) { return review.issueId && ['repair', 'acknowledge', 'cite'].includes(review.decision); });
        };
        WorkspacesService_1.prototype.recordIntegrityIssueReview = function (workspaceId, userId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, issueId, ledger, issue, updatedAt, review, metadata, existing, filtered;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _a.sent();
                            issueId = this.asString((payload === null || payload === void 0 ? void 0 : payload.issueId) || '');
                            if (!issueId) {
                                throw new common_1.BadRequestException('Issue id is required.');
                            }
                            ledger = this.getWorkspaceIntegrityIssueLedger(workspace);
                            issue = ledger.find(function (item) { return item.id === issueId; });
                            if (!issue) {
                                throw new common_1.BadRequestException('Issue not found in this workspace.');
                            }
                            updatedAt = new Date().toISOString();
                            review = {
                                issueId: issueId,
                                decision: payload.decision,
                                note: payload.note ? this.asString(payload.note) : undefined,
                                updatedAt: updatedAt,
                                issueMessage: payload.issueMessage ? this.asString(payload.issueMessage) : issue.message,
                                severity: payload.severity || issue.severity,
                                category: payload.category ? this.asString(payload.category) : issue.category,
                                affectedItem: payload.affectedItem ? this.asString(payload.affectedItem) : issue.affectedItem,
                            };
                            metadata = (workspace.metadata || {});
                            existing = Array.isArray(metadata.integrityIssueReviews) ? metadata.integrityIssueReviews : [];
                            filtered = existing.filter(function (item) { return _this.asString((item === null || item === void 0 ? void 0 : item.issueId) || '') !== issueId; });
                            metadata.integrityIssueReviews = __spreadArray(__spreadArray([], filtered, true), [review], false).slice(-100);
                            workspace.metadata = metadata;
                            return [4 /*yield*/, this.workspaceRepository.save(workspace)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, review];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.getActiveOutline = function (workspace) {
            var _a, _b;
            var activeOutlineId = this.asString(((_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.activeOutlineId) || '');
            var selectedOutline = (activeOutlineId
                ? ((workspace === null || workspace === void 0 ? void 0 : workspace.outlines) || []).find(function (outline) { return (outline === null || outline === void 0 ? void 0 : outline.id) === activeOutlineId; })
                : null) ||
                ((workspace === null || workspace === void 0 ? void 0 : workspace.outlines) || []).find(function (outline) { return outline === null || outline === void 0 ? void 0 : outline.isSelected; }) ||
                ((_b = workspace === null || workspace === void 0 ? void 0 : workspace.outlines) === null || _b === void 0 ? void 0 : _b[0]);
            if (!selectedOutline)
                return null;
            return {
                id: selectedOutline.id,
                title: this.asString(selectedOutline.title || ''),
                isSelected: Boolean(selectedOutline.isSelected),
                createdAt: selectedOutline.createdAt,
                pointCount: this.extractOutlinePointTexts(selectedOutline.structure || {}).length,
            };
        };
        WorkspacesService_1.prototype.getWorkspaceOutlineHistory = function (workspace) {
            var _this = this;
            var _a, _b;
            var history = Array.isArray((_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.outlineHistory)
                ? (_b = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _b === void 0 ? void 0 : _b.outlineHistory
                : [];
            var snapshots = history
                .map(function (item, index) { return ({
                id: _this.asString((item === null || item === void 0 ? void 0 : item.id) || "history-outline-".concat(index + 1)),
                title: _this.asString((item === null || item === void 0 ? void 0 : item.title) || "Outline Version ".concat(index + 1)),
                isSelected: false,
                createdAt: _this.asString((item === null || item === void 0 ? void 0 : item.createdAt) || (item === null || item === void 0 ? void 0 : item.archivedAt) || ''),
                pointCount: typeof (item === null || item === void 0 ? void 0 : item.pointCount) === 'number' ? item.pointCount : Array.isArray(item === null || item === void 0 ? void 0 : item.points) ? item.points.length : 0,
                revisionLabel: _this.asString((item === null || item === void 0 ? void 0 : item.revisionLabel) || "Version ".concat(index + 1)),
                archivedAt: _this.asString((item === null || item === void 0 ? void 0 : item.archivedAt) || (item === null || item === void 0 ? void 0 : item.createdAt) || ''),
            }); })
                .filter(function (item) { return item.id && item.title; });
            var currentOutline = this.getActiveOutline(workspace);
            if (!currentOutline)
                return snapshots.slice(0, 10);
            var hasCurrent = snapshots.some(function (item) { return item.id === currentOutline.id; });
            var currentEntry = __assign(__assign({}, currentOutline), { revisionLabel: 'Current', archivedAt: this.asString(currentOutline.createdAt || '') });
            return __spreadArray([currentEntry], snapshots.filter(function (item) { return !hasCurrent || item.id !== currentOutline.id; }), true).slice(0, 10);
        };
        WorkspacesService_1.prototype.getActiveManuscript = function (workspace) {
            var _a;
            var activeManuscriptId = this.asString(((_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.activeManuscriptId) || '');
            var manuscript = (activeManuscriptId
                ? ((workspace === null || workspace === void 0 ? void 0 : workspace.manuscripts) || []).find(function (item) { return (item === null || item === void 0 ? void 0 : item.id) === activeManuscriptId; })
                : null) ||
                ((workspace === null || workspace === void 0 ? void 0 : workspace.manuscripts) || [])[0];
            if (!manuscript)
                return null;
            return {
                id: manuscript.id,
                outlineId: manuscript.outlineId || null,
                wordCount: typeof manuscript.wordCount === 'number' ? manuscript.wordCount : null,
                estimatedMinutes: typeof manuscript.estimatedMinutes === 'number' ? manuscript.estimatedMinutes : null,
                createdAt: manuscript.createdAt,
                updatedAt: manuscript.updatedAt,
            };
        };
        WorkspacesService_1.prototype.getWorkspaceManuscriptHistory = function (workspace) {
            var _this = this;
            var _a, _b;
            var history = Array.isArray((_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.manuscriptHistory)
                ? (_b = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _b === void 0 ? void 0 : _b.manuscriptHistory
                : [];
            var snapshots = history
                .map(function (item, index) { return ({
                id: _this.asString((item === null || item === void 0 ? void 0 : item.id) || "history-manuscript-".concat(index + 1)),
                outlineId: (item === null || item === void 0 ? void 0 : item.outlineId) ? _this.asString(item.outlineId) : null,
                wordCount: typeof (item === null || item === void 0 ? void 0 : item.wordCount) === 'number' ? item.wordCount : null,
                estimatedMinutes: typeof (item === null || item === void 0 ? void 0 : item.estimatedMinutes) === 'number' ? item.estimatedMinutes : null,
                createdAt: _this.asString((item === null || item === void 0 ? void 0 : item.createdAt) || (item === null || item === void 0 ? void 0 : item.archivedAt) || ''),
                updatedAt: _this.asString((item === null || item === void 0 ? void 0 : item.updatedAt) || (item === null || item === void 0 ? void 0 : item.archivedAt) || ''),
                revisionLabel: _this.asString((item === null || item === void 0 ? void 0 : item.revisionLabel) || "Version ".concat(index + 1)),
                archivedAt: _this.asString((item === null || item === void 0 ? void 0 : item.archivedAt) || (item === null || item === void 0 ? void 0 : item.updatedAt) || (item === null || item === void 0 ? void 0 : item.createdAt) || ''),
            }); })
                .filter(function (item) { return item.id; });
            var currentManuscript = this.getActiveManuscript(workspace);
            if (!currentManuscript)
                return snapshots.slice(0, 10);
            var hasCurrent = snapshots.some(function (item) { return item.id === currentManuscript.id; });
            var currentEntry = __assign(__assign({}, currentManuscript), { revisionLabel: 'Current', archivedAt: this.asString(currentManuscript.updatedAt || currentManuscript.createdAt || '') });
            return __spreadArray([currentEntry], snapshots.filter(function (item) { return !hasCurrent || item.id !== currentManuscript.id; }), true).slice(0, 10);
        };
        WorkspacesService_1.prototype.getWorkspaceOutlineComparison = function (workspace, history) {
            var active = this.getActiveOutline(workspace);
            if (!active)
                return null;
            var previous = history.find(function (item) { return item.id !== active.id; }) || null;
            if (!previous)
                return null;
            return {
                previousRevisionLabel: previous.revisionLabel || null,
                pointDelta: active.pointCount - previous.pointCount,
                titleChanged: active.title !== previous.title,
            };
        };
        WorkspacesService_1.prototype.getWorkspaceManuscriptComparison = function (workspace, history) {
            var active = this.getActiveManuscript(workspace);
            if (!active)
                return null;
            var previous = history.find(function (item) { return item.id !== active.id; }) || null;
            if (!previous)
                return null;
            return {
                previousRevisionLabel: previous.revisionLabel || null,
                wordDelta: (active.wordCount || 0) - (previous.wordCount || 0),
                minuteDelta: (active.estimatedMinutes || 0) - (previous.estimatedMinutes || 0),
                outlineChanged: (active.outlineId || null) !== (previous.outlineId || null),
            };
        };
        WorkspacesService_1.prototype.appendWorkspaceHistory = function (workspace, key, entry, limit) {
            var _a;
            if (limit === void 0) { limit = 10; }
            var metadata = (workspace.metadata || {});
            var existing = Array.isArray(metadata[key]) ? metadata[key] : [];
            var next = __spreadArray(__spreadArray([], existing, true), [entry], false).slice(-limit);
            workspace.metadata = __assign(__assign({}, metadata), (_a = {}, _a[key] = next, _a));
        };
        WorkspacesService_1.prototype.snapshotOutlineForHistory = function (outline, revisionLabel) {
            var _a, _b;
            return {
                id: outline.id,
                title: outline.title,
                isSelected: Boolean(outline.isSelected),
                createdAt: ((_b = (_a = outline.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString) === null || _b === void 0 ? void 0 : _b.call(_a)) || outline.createdAt || new Date().toISOString(),
                archivedAt: new Date().toISOString(),
                revisionLabel: revisionLabel,
                pointCount: this.extractOutlinePointTexts(outline.structure || {}).length,
                structure: outline.structure || {},
            };
        };
        WorkspacesService_1.prototype.snapshotManuscriptForHistory = function (manuscript, revisionLabel) {
            var _a, _b, _c, _d;
            return {
                id: manuscript.id,
                outlineId: manuscript.outlineId || null,
                wordCount: typeof manuscript.wordCount === 'number' ? manuscript.wordCount : null,
                estimatedMinutes: typeof manuscript.estimatedMinutes === 'number' ? manuscript.estimatedMinutes : null,
                createdAt: ((_b = (_a = manuscript.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString) === null || _b === void 0 ? void 0 : _b.call(_a)) || manuscript.createdAt || new Date().toISOString(),
                updatedAt: ((_d = (_c = manuscript.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString) === null || _d === void 0 ? void 0 : _d.call(_c)) || manuscript.updatedAt || new Date().toISOString(),
                archivedAt: new Date().toISOString(),
                revisionLabel: revisionLabel,
                content: manuscript.content || {},
                transitions: manuscript.transitions || null,
            };
        };
        WorkspacesService_1.prototype.getLatestIntegrityReport = function (workspace) {
            var _this = this;
            var _a;
            var metadataReport = ((_a = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _a === void 0 ? void 0 : _a.integrityReport) || null;
            if (!metadataReport)
                return null;
            var issues = Array.isArray(metadataReport.issues) ? metadataReport.issues : [];
            var reviewedIssueCount = this.getWorkspaceIntegrityIssueReviews(workspace).length;
            return {
                overallScore: typeof metadataReport.overallScore === 'number' ? metadataReport.overallScore : undefined,
                balanced: typeof metadataReport.balanced === 'boolean' ? metadataReport.balanced : undefined,
                issueCount: issues.length,
                criticalIssueCount: issues.filter(function (item) { return _this.asString((item === null || item === void 0 ? void 0 : item.severity) || '').toLowerCase() === 'critical'; }).length,
                warningIssueCount: issues.filter(function (item) { return _this.asString((item === null || item === void 0 ? void 0 : item.severity) || '').toLowerCase() === 'warning'; }).length,
                reviewedIssueCount: reviewedIssueCount,
                strengthCount: Array.isArray(metadataReport.strengths) ? metadataReport.strengths.length : undefined,
                updatedAt: this.asString(metadataReport.updatedAt || ''),
            };
        };
        WorkspacesService_1.prototype.getWorkspaceProgress = function (workspace) {
            var _a, _b;
            var scriptureCache = (workspace === null || workspace === void 0 ? void 0 : workspace.scriptureCache) || {};
            var metadata = ((workspace === null || workspace === void 0 ? void 0 : workspace.metadata) || {});
            var planning = this.normalizeWorkspacePlanning(metadata);
            var latestStudyReport = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) ? workspace.studyReports[0] : null;
            var selectedOutline = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.outlines)
                ? workspace.outlines.find(function (outline) { return outline === null || outline === void 0 ? void 0 : outline.isSelected; }) || workspace.outlines[0] || null
                : null;
            var latestManuscript = Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.manuscripts) ? workspace.manuscripts[0] : null;
            return {
                themeConfigured: Boolean((workspace === null || workspace === void 0 ? void 0 : workspace.title) &&
                    (workspace === null || workspace === void 0 ? void 0 : workspace.mainPassage) &&
                    (workspace === null || workspace === void 0 ? void 0 : workspace.language) &&
                    (workspace === null || workspace === void 0 ? void 0 : workspace.style) &&
                    (workspace === null || workspace === void 0 ? void 0 : workspace.storyArc) &&
                    ((workspace === null || workspace === void 0 ? void 0 : workspace.theme) || (workspace === null || workspace === void 0 ? void 0 : workspace.sermonGoals) || (workspace === null || workspace === void 0 ? void 0 : workspace.audienceProfile) || planning.serviceType || planning.ministryMode || planning.appealStyle)),
                passageExplored: Boolean((scriptureCache === null || scriptureCache === void 0 ? void 0 : scriptureCache.scriptureResult) || (scriptureCache === null || scriptureCache === void 0 ? void 0 : scriptureCache.passageSummary) || (scriptureCache === null || scriptureCache === void 0 ? void 0 : scriptureCache.translationComparison)),
                studyGenerated: Boolean(latestStudyReport),
                outlineCreated: Boolean(selectedOutline),
                manuscriptWritten: Boolean(latestManuscript),
                refineCompleted: Boolean((metadata === null || metadata === void 0 ? void 0 : metadata.socraticCoachLastSession) || (metadata === null || metadata === void 0 ? void 0 : metadata.dnaIntegrity) || (metadata === null || metadata === void 0 ? void 0 : metadata.integrityReport)),
                deliverPrepared: Boolean((metadata === null || metadata === void 0 ? void 0 : metadata.mediaPack) || ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.deliverables) === null || _a === void 0 ? void 0 : _a.mediaPack) || ((_b = metadata === null || metadata === void 0 ? void 0 : metadata.deliverables) === null || _b === void 0 ? void 0 : _b.export)),
            };
        };
        WorkspacesService_1.prototype.getWorkspaceNextAction = function (workspace) {
            var progress = this.getWorkspaceProgress(workspace);
            var uiState = this.getWorkspaceUiState(workspace);
            if (!progress.themeConfigured) {
                return {
                    phase: 'THEME',
                    section: 'workspace',
                    action: 'define-theme',
                    label: 'Define sermon direction',
                    description: 'Confirm the sermon theme, audience, and goals before generating study artifacts.',
                };
            }
            if (!progress.passageExplored) {
                return {
                    phase: 'PASSAGE',
                    section: 'scripture',
                    action: 'lookup-passage',
                    label: 'Study the passage',
                    description: 'Load the main passage, compare translations, and confirm the textual context.',
                };
            }
            if (!progress.studyGenerated) {
                return {
                    phase: 'STUDY',
                    section: 'study-report',
                    action: 'generate-study-report',
                    label: 'Generate a study report',
                    description: 'Turn passage research into a structured study report before outlining.',
                };
            }
            if (!progress.outlineCreated) {
                return {
                    phase: 'OUTLINE',
                    section: 'outlines',
                    action: 'create-outline',
                    label: 'Generate sermon outlines',
                    description: 'Create outline candidates and choose the strongest structure for the sermon.',
                };
            }
            if (!progress.manuscriptWritten) {
                return {
                    phase: 'WRITE',
                    section: 'manuscript',
                    action: 'write-manuscript',
                    label: 'Draft the manuscript',
                    description: 'Generate the first manuscript draft from the selected outline.',
                };
            }
            if (!progress.refineCompleted) {
                return {
                    phase: 'REFINE',
                    section: 'dna',
                    action: 'analyze-sermon',
                    label: 'Run integrity review',
                    description: 'Validate citations, theology, and sermon balance before delivery.',
                };
            }
            if (!progress.deliverPrepared) {
                return {
                    phase: 'DELIVER',
                    section: 'media',
                    action: 'generate-media-pack',
                    label: 'Prepare delivery assets',
                    description: 'Generate slides, audio, and supporting media from the approved manuscript.',
                };
            }
            return {
                phase: uiState.phase,
                section: uiState.section,
                action: 'export-final',
                label: 'Export or present',
                description: 'The sermon is ready for export, delivery, or further refinement.',
            };
        };
        WorkspacesService_1.prototype.buildWorkspaceState = function (workspace) {
            return __awaiter(this, void 0, void 0, function () {
                var uiState, progress, artifacts, activeOutline, activeManuscript, outlineHistory, manuscriptHistory, outlineComparison, manuscriptComparison, latestIntegrityReport, integrityIssueLedger, integrityIssueReviews, mediaPack, exportPack, claimLedger, sourceLedger, claimReviewDecisions, nextAction, featureReadiness, workspaceSnapshot, stateBuilder;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            uiState = this.getWorkspaceUiState(workspace);
                            progress = this.getWorkspaceProgress(workspace);
                            artifacts = this.getWorkspaceArtifactCounts(workspace);
                            activeOutline = this.getActiveOutline(workspace);
                            activeManuscript = this.getActiveManuscript(workspace);
                            outlineHistory = this.getWorkspaceOutlineHistory(workspace);
                            manuscriptHistory = this.getWorkspaceManuscriptHistory(workspace);
                            outlineComparison = this.getWorkspaceOutlineComparison(workspace, outlineHistory);
                            manuscriptComparison = this.getWorkspaceManuscriptComparison(workspace, manuscriptHistory);
                            latestIntegrityReport = this.getLatestIntegrityReport(workspace);
                            integrityIssueLedger = this.getWorkspaceIntegrityIssueLedger(workspace);
                            integrityIssueReviews = this.getWorkspaceIntegrityIssueReviews(workspace);
                            mediaPack = this.getWorkspaceMediaPack(workspace);
                            exportPack = this.getWorkspaceExportPack(workspace);
                            claimLedger = this.getWorkspaceClaimLedger(workspace);
                            sourceLedger = this.getWorkspaceSourceLedger(workspace);
                            claimReviewDecisions = this.getWorkspaceClaimReviews(workspace);
                            nextAction = this.getWorkspaceNextAction(workspace);
                            return [4 /*yield*/, this.getWorkspaceFeatureReadiness(workspace)];
                        case 1:
                            featureReadiness = _c.sent();
                            workspaceSnapshot = __assign(__assign({}, workspace), { planning: this.normalizeWorkspacePlanning(workspace.metadata), guardrail: this.buildGuardrailProfile(workspace), guardrailMode: (_a = workspace.metadata) === null || _a === void 0 ? void 0 : _a.guardrailMode, guardrailDetected: Boolean((_b = workspace.metadata) === null || _b === void 0 ? void 0 : _b.guardrailDetected) });
                            stateBuilder = this.workspaceStateService || new workspace_state_service_1.WorkspaceStateService();
                            return [2 /*return*/, stateBuilder.buildWorkspaceState({
                                    workspace: workspaceSnapshot,
                                    activePhase: uiState.phase,
                                    activeSection: uiState.section,
                                    progress: progress,
                                    featureReadiness: featureReadiness,
                                    artifacts: artifacts,
                                    activeOutline: activeOutline,
                                    activeManuscript: activeManuscript,
                                    outlineHistory: outlineHistory,
                                    manuscriptHistory: manuscriptHistory,
                                    outlineComparison: outlineComparison,
                                    manuscriptComparison: manuscriptComparison,
                                    latestIntegrityReport: latestIntegrityReport,
                                    integrityIssueLedger: integrityIssueLedger,
                                    integrityIssueReviews: integrityIssueReviews,
                                    mediaPack: mediaPack,
                                    exportPack: exportPack,
                                    claimLedger: claimLedger,
                                    sourceLedger: sourceLedger,
                                    claimReviewDecisions: claimReviewDecisions,
                                    nextAction: nextAction,
                                    uiState: uiState,
                                })];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.create = function (userId, createDto) {
            return __awaiter(this, void 0, void 0, function () {
                var metadata, workspace;
                return __generator(this, function (_a) {
                    metadata = this.buildWorkspaceMetadataPayload({
                        mainPassage: createDto.mainPassage,
                        language: createDto.language,
                        theologicalLens: createDto.theologicalLens,
                        metadata: createDto.metadata,
                    });
                    workspace = this.workspaceRepository.create(__assign(__assign({}, createDto), { metadata: metadata, theologicalLens: (0, theological_lens_util_1.normalizeTheologicalLens)(createDto.theologicalLens), userId: userId }));
                    return [2 /*return*/, this.workspaceRepository.save(workspace)];
                });
            });
        };
        WorkspacesService_1.prototype.addReference = function (workspaceId, userId, reference, context) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, refExists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _a.sent();
                            // Initialize references array if it doesn't exist
                            if (!workspace.references) {
                                workspace.references = [];
                            }
                            refExists = workspace.references.some(function (ref) {
                                return typeof ref === 'string' ? ref === reference : ref.reference === reference;
                            });
                            if (!!refExists) return [3 /*break*/, 3];
                            workspace.references.push({
                                reference: reference,
                                context: context || 'Added from 3D exploration',
                                addedAt: new Date().toISOString()
                            });
                            return [4 /*yield*/, this.workspaceRepository.save(workspace)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, workspace];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.buildIllustrationsPrompt = function (workspace, mainPoints, seededIdeas) {
            if (seededIdeas === void 0) { seededIdeas = []; }
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            return "".concat(doctrinalContext, "\n\nGenerate 8-12 high-quality sermon illustrations based on:\nTitle: ").concat(workspace.title, "\nMain Passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\nMain Points: ").concat(mainPoints.join(', ') || 'N/A', "\n").concat(seededIdeas.length ? "Existing study illustration ideas (use only as inspiration, do not copy wording): ".concat(seededIdeas.join(' | ')) : '', "\n\nWrite in ").concat(languageLabel, ".\n\nReturn a JSON array with items containing:\ntitle, content, verseReference, source (optional), relatedPoint (optional), tags (array, optional).\n\nRules:\n- Include a relevant Bible verse reference for each illustration in verseReference.\n- Return at least 8 DISTINCT items.\n- Make each illustration concrete, realistic, and preacher-usable in a live sermon.\n- Prioritize real-life scenarios (family, work, community, discipleship, conflict, restoration) over abstract allegories.\n- Do not overuse repetitive bridge/garden/lighthouse metaphors unless uniquely developed.\n- Keep each content field to 2-4 sentences max.\n- Each item must include:\n  1) a vivid scenario,\n  2) the spiritual insight tied to the passage,\n  3) a clear transition line the preacher can say.\n- Vary the illustration type mix:\n  - at least 3 everyday contemporary examples,\n  - at least 2 pastoral/church-life examples,\n  - at least 2 biblical-history/cultural-context analogies.\n- Keep theological fidelity to ").concat(workspace.mainPassage, " and avoid doctrinal drift.\n- If language is Spanish, use natural pastoral Spanish (not literal machine-translation style).\n- No markdown, no prose outside JSON, no code fences.");
        };
        WorkspacesService_1.prototype.buildCitationsPrompt = function (workspace) {
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            var guardrail = this.buildGuardrailProfile(workspace);
            var guardrailRule = guardrail.active
                ? "Prophetic guardrail: use verseReferences only from ".concat(this.asString(workspace.mainPassage), " and the listed anchors. If a statement is theological inference, keep verseReferences empty or use only clearly relevant anchors. Do not invent unrelated proof texts.")
                : '';
            return "".concat(doctrinalContext, "\n\nGenerate 5-8 supporting citations and statements for the sermon:\nTitle: ").concat(workspace.title, "\nMain Passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\nTheological Lens: ").concat((0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens), "\n").concat(guardrailRule ? "".concat(guardrailRule, "\n") : '', "\n\nWrite in ").concat(languageLabel, ".\n\nReturn a JSON array with items containing:\nstatementType (observation, interpretation, application, illustration, external_reference),\nstatement, verseReferences (array), externalSources (array, optional).");
        };
        WorkspacesService_1.prototype.buildOutlinePrompt = function (workspace) {
            var _a;
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            return "".concat(doctrinalContext, "\n\nGenerate a sermon outline for the following:\nTitle: ").concat(workspace.title, "\nSeries: ").concat(workspace.seriesTitle || 'N/A', "\nMain Passage: ").concat(workspace.mainPassage, "\nAdditional Passages: ").concat(((_a = workspace.additionalPassages) === null || _a === void 0 ? void 0 : _a.length)
                ? workspace.additionalPassages.join(', ')
                : 'None', "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\nSermon Goals: ").concat(workspace.sermonGoals || 'N/A', "\nTheological Lens: ").concat((0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens), "\nStyle: ").concat(workspace.style || 'N/A', "\nStory Arc: ").concat(workspace.storyArc || 'N/A', "\n\nWrite in ").concat(languageLabel, ".\n\nReturn the outline in this EXACT format with clear section markers:\n\nINTRODUCTION:\n[Write a complete introduction paragraph explaining the sermon topic and context]\n\nPOINT 1:\n[First main point with full explanation]\n\nPOINT 2:\n[Second main point with full explanation]\n\nPOINT 3:\n[Third main point with full explanation]\n\nCONCLUSION:\n[Write a complete conclusion paragraph summarizing the message]\n\nCALL TO ACTION:\n[Write a specific call to action for the congregation]\n\nRules:\n- In Adventist context, never use Sunday/Domingo worship framing.\n- If weekly worship timing is mentioned, use Sabbath/S\u00E1bado language.\n- DO NOT include metadata, JSON, or any other format. Use only the section markers shown above.");
        };
        WorkspacesService_1.prototype.buildOutlinePointsPrompt = function (workspace, count, reportText) {
            var _a;
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            var guardrail = this.buildGuardrailProfile(workspace);
            var guardrailRule = guardrail.active
                ? "Prophetic guardrail: keep the outline tightly inside ".concat(this.asString(workspace.mainPassage), " and the listed anchors. Do not create generic filler points, and do not invent unrelated proof texts or speculative claims.")
                : '';
            return "".concat(doctrinalContext, "\n\nGenerate ").concat(count, " DISTINCT variations of 3-5 concise main points for a sermon on:\nTitle: ").concat(workspace.title, "\nSeries: ").concat(workspace.seriesTitle || 'N/A', "\nMain Passage: ").concat(workspace.mainPassage, "\nAdditional Passages: ").concat(((_a = workspace.additionalPassages) === null || _a === void 0 ? void 0 : _a.length)
                ? workspace.additionalPassages.join(', ')
                : 'None', "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\nSermon Goals: ").concat(workspace.sermonGoals || 'N/A', "\nTheological Lens: ").concat((0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens), "\nStyle: ").concat(workspace.style || 'N/A', "\nStory Arc: ").concat(workspace.storyArc || 'N/A', "\n").concat(reportText ? "\nStudy Report Context:\n".concat(reportText) : '', "\n").concat(guardrailRule ? "\n".concat(guardrailRule) : '', "\n\nWrite in ").concat(languageLabel, ".\n\nRules:\n- Each variation must be substantively different in framing, emphasis, and wording.\n- Make each variation distinct across these axes:\n  1) Narrative approach\n  2) Theological emphasis\n  3) Audience focus\n  4) Sermon structure style (expository, narrative, thematic, problem-solution, story-driven)\n- Do NOT reuse sentences or phrases across variations.\n\nReturn ONLY valid JSON as an array of objects with this shape:\n[\n  {\n    \"angle\": \"<short angle label>\",\n    \"style\": \"<style label>\",\n    \"theologicalEmphasis\": \"<short emphasis label>\",\n    \"audienceFocus\": \"<short audience focus label>\",\n    \"sermonStructure\": \"<structure type label>\",\n    \"points\": [\"Point 1\", \"Point 2\", \"Point 3\"]\n  }\n]\n\nOnly include ").concat(count, " variations and no extra text.");
        };
        WorkspacesService_1.prototype.buildOutlineFromPointsPrompt = function (workspace, points, variation, reportText) {
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            var guardrail = this.buildGuardrailProfile(workspace);
            var guardrailRule = guardrail.active
                ? "Prophetic guardrail: every point and supporting verse must stay text-grounded in ".concat(this.asString(workspace.mainPassage), " or the listed anchors. Avoid generic filler, fear language, and unsupported cross references.")
                : '';
            return "".concat(doctrinalContext, "\n\nGenerate a complete sermon outline using these main points:\n").concat(points.map(function (p, i) { return "".concat(i + 1, ". ").concat(p); }).join('\n'), "\n\n").concat(variation, "\n\nTitle: ").concat(workspace.title, "\nMain Passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\n").concat(reportText ? "\nStudy Report Context:\n".concat(reportText) : '', "\n").concat(guardrailRule ? "\n".concat(guardrailRule) : '', "\n\nWrite in ").concat(languageLabel, ".\n\nReturn ONLY valid JSON with this exact top-level shape:\n{\n  \"introduction\": \"string\",\n  \"points\": [\"Point 1\", \"Point 2\", \"Point 3\"],\n  \"outlineType\": \"string\",\n  \"sermonMovement\": \"string\",\n  \"conclusion\": \"string\",\n  \"callToAction\": \"string\"\n}\n\nCRITICAL for slideTitle:\n- slideTitle must be SHORT and PUNCHY (2-4 words, max 25 characters)\n- Examples: \"Muerte espiritual\", \"Obra redentora\", \"Nueva vida\", \"Fe viva\"\n- The full point description goes in \"title\", the short slide-friendly version goes in \"slideTitle\"\n- Keep each summary to 1-2 short paragraphs max.\n- Keep each array to 3 items or fewer.\n- Do not generate pointNodes in this step. Those are generated separately from the canonical points.\n- Do not generate applications, discussion questions, illustration ideas, media suggestions, or EGW support here. Those are attached later from study assets.\n\nRules:\n- \"points\" is required and canonical; it must contain 3-5 concise points.\n- \"pointNodes\" is optional enrichment aligned by index to \"points\".\n- Use study assets from the Study Report Context when present.\n- Ensure each point remains faithful to the passage and avoids drift.\n- In Adventist context, never use Sunday/Domingo worship framing. Use Sabbath/S\u00E1bado.\n- Do not include markdown, prose outside JSON, or code fences.");
        };
        WorkspacesService_1.prototype.buildOutlinePointNodesPrompt = function (workspace, points, reportText) {
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            return "".concat(doctrinalContext, "\n\nGenerate point metadata for this sermon outline. Keep the canonical point titles exactly as provided.\n\nTitle: ").concat(workspace.title, "\nMain Passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\n").concat(reportText ? "\nStudy Report Context:\n".concat(reportText) : '', "\n\nCanonical Points:\n").concat(points.map(function (point, index) { return "".concat(index + 1, ". ").concat(point); }).join('\n'), "\n\nWrite in ").concat(languageLabel, ".\n\nReturn ONLY valid JSON as an array aligned by index to the canonical points:\n[\n  {\n    \"title\": \"string (must match the canonical point text exactly)\",\n    \"slideTitle\": \"string (SHORT 2-4 word title for slides, max 25 characters)\",\n    \"summary\": \"string\",\n    \"supportingVerses\": [\"Book 1:1\"],\n    \"references\": [\"Book 1:1\"]\n  }\n]\n\nRules:\n- Return exactly ").concat(points.length, " items in the same order as the canonical points.\n- Do not rewrite or shorten the \"title\" field; copy the canonical point text exactly.\n- \"slideTitle\" must be punchy, meaningful, and not a truncation of the first words.\n- Keep all metadata tightly related to its point.\n- If a field is unknown, return an empty string or empty array instead of inventing unrelated content.\n- Keep the summary brief. Do not exceed 3 short sentences.\n- Do not generate applications, discussion questions, or illustration ideas here; those come from study assets later.\n- In Adventist context, never use Sunday/Domingo worship framing. Use Sabbath/S\u00E1bado.\n- Do not include markdown, prose outside JSON, or code fences.");
        };
        WorkspacesService_1.prototype.normalizeGeneratedPointNodes = function (rawPointNodes, points) {
            var _this = this;
            var sourceNodes = Array.isArray(rawPointNodes)
                ? rawPointNodes
                : Array.isArray(rawPointNodes === null || rawPointNodes === void 0 ? void 0 : rawPointNodes.pointNodes)
                    ? rawPointNodes.pointNodes
                    : [];
            var normalized = this.normalizeOutlineData({
                points: points,
                pointNodes: sourceNodes,
            });
            var normalizedNodes = Array.isArray(normalized === null || normalized === void 0 ? void 0 : normalized.pointNodes) ? normalized.pointNodes : [];
            return points.map(function (point, index) {
                var _a;
                var node = normalizedNodes[index] || {};
                var pointText = _this.asString(point);
                var pointParts = pointText.split(/\s[-–—]\s/);
                var fallbackSummary = _this.asString((node === null || node === void 0 ? void 0 : node.summary) ||
                    (pointParts.length > 1 ? pointParts.slice(1).join(' - ') : pointText) ||
                    pointText);
                var fallbackSlideTitle = _this.asString((node === null || node === void 0 ? void 0 : node.slideTitle) ||
                    ((_a = pointText
                        .split(/\s[-–—:]\s/)
                        .shift()) === null || _a === void 0 ? void 0 : _a.split(/\s+/).slice(0, 4).join(' ')) ||
                    "Point ".concat(index + 1));
                return {
                    id: _this.asString((node === null || node === void 0 ? void 0 : node.id) || "point-".concat(index + 1)),
                    level: Number(node === null || node === void 0 ? void 0 : node.level) || 1,
                    title: pointText,
                    slideTitle: fallbackSlideTitle,
                    summary: fallbackSummary,
                    movement: _this.asString((node === null || node === void 0 ? void 0 : node.movement) || fallbackSummary),
                    supportingVerses: _this.asStringArray(node === null || node === void 0 ? void 0 : node.supportingVerses, 10),
                    canonicalThemes: _this.asStringArray(node === null || node === void 0 ? void 0 : node.canonicalThemes, 8),
                    crossReferences: _this.asStringArray(node === null || node === void 0 ? void 0 : node.crossReferences, 10),
                    subpoints: _this.asStringArray(node === null || node === void 0 ? void 0 : node.subpoints, 10),
                    applications: _this.asStringArray(node === null || node === void 0 ? void 0 : node.applications, 16),
                    discussionQuestions: _this.asStringArray(node === null || node === void 0 ? void 0 : node.discussionQuestions, 16),
                    illustrationIdeas: _this.asStringArray(node === null || node === void 0 ? void 0 : node.illustrationIdeas, 16),
                    mediaSuggestions: _this.asStringArray(node === null || node === void 0 ? void 0 : node.mediaSuggestions, 16),
                    egwSupport: Array.isArray(node === null || node === void 0 ? void 0 : node.egwSupport) ? node.egwSupport : [],
                    references: _this.asStringArray(node === null || node === void 0 ? void 0 : node.references, 8),
                    notes: _this.asString(node === null || node === void 0 ? void 0 : node.notes),
                };
            }).filter(function (node) { return node.title; });
        };
        WorkspacesService_1.prototype.ensureOutlinePointNodes = function (workspace, userId, outlineData, reportText) {
            return __awaiter(this, void 0, void 0, function () {
                var canonicalPoints, existingNodes, hasAlignedSlideTitles, pointNodesPrompt, pointNodesResponse, parsedPointNodes, normalizedPointNodes;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            canonicalPoints = this.extractOutlinePointTexts(outlineData || {});
                            if (!canonicalPoints.length)
                                return [2 /*return*/, outlineData];
                            existingNodes = Array.isArray(outlineData === null || outlineData === void 0 ? void 0 : outlineData.pointNodes) ? outlineData.pointNodes : [];
                            hasAlignedSlideTitles = existingNodes.length === canonicalPoints.length &&
                                existingNodes.every(function (node, index) {
                                    var title = _this.asString((node === null || node === void 0 ? void 0 : node.title) || (node === null || node === void 0 ? void 0 : node.text) || (node === null || node === void 0 ? void 0 : node.content));
                                    var slideTitle = _this.asString(node === null || node === void 0 ? void 0 : node.slideTitle);
                                    return title && slideTitle && title === canonicalPoints[index];
                                });
                            if (hasAlignedSlideTitles) {
                                return [2 /*return*/, __assign(__assign({}, outlineData), { pointNodes: this.normalizeGeneratedPointNodes(existingNodes, canonicalPoints) })];
                            }
                            pointNodesPrompt = this.buildOutlinePointNodesPrompt(workspace, canonicalPoints, reportText);
                            return [4 /*yield*/, this.llmService.generateCompletion(pointNodesPrompt, userId, {
                                    temperature: 0.2,
                                    maxTokens: 500,
                                })];
                        case 1:
                            pointNodesResponse = _a.sent();
                            parsedPointNodes = this.parseJsonSafe(pointNodesResponse);
                            normalizedPointNodes = this.normalizeGeneratedPointNodes(parsedPointNodes, canonicalPoints);
                            return [2 /*return*/, __assign(__assign({}, (outlineData || {})), { points: canonicalPoints, pointNodes: normalizedPointNodes })];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.normalizeManuscriptOptions = function (workspace, options) {
            var targetMinutesRaw = Number(options === null || options === void 0 ? void 0 : options.targetMinutes);
            var targetMinutes = Number.isFinite(targetMinutesRaw) && targetMinutesRaw > 0
                ? Math.min(60, Math.max(8, Math.round(targetMinutesRaw)))
                : 22;
            var tone = this.asString((options === null || options === void 0 ? void 0 : options.tone) || workspace.style || 'teaching').toLowerCase();
            var format = this.asString((options === null || options === void 0 ? void 0 : options.format) || 'full').toLowerCase();
            var audienceMode = this.asString((options === null || options === void 0 ? void 0 : options.audienceMode) || workspace.audienceProfile || 'general congregation');
            return {
                tone: tone || 'teaching',
                targetMinutes: targetMinutes,
                format: format === 'notes' ? 'notes' : 'full',
                audienceMode: audienceMode || 'general congregation',
                includeSlideCues: (options === null || options === void 0 ? void 0 : options.includeSlideCues) !== false,
                includeKeyLines: (options === null || options === void 0 ? void 0 : options.includeKeyLines) !== false,
                includeStudyInsights: (options === null || options === void 0 ? void 0 : options.includeStudyInsights) !== false,
            };
        };
        WorkspacesService_1.prototype.manuscriptCueTemplate = function () {
            return {
                slide: [],
                keyLine: [],
                transition: [],
                pause: [],
                read: [],
                quote: [],
                cta: [],
            };
        };
        WorkspacesService_1.prototype.extractCuesFromLegacyText = function (rawText) {
            var cues = this.manuscriptCueTemplate();
            var cueMap = {
                slide: 'slide',
                keyline: 'keyLine',
                transition: 'transition',
                pause: 'pause',
                read: 'read',
                quote: 'quote',
                cta: 'cta',
                calltoaction: 'cta',
            };
            var stripped = String(rawText || '').replace(/\[(Slide|Key\s*Line|Transition|Pause|Read|Quote|CTA|Call\s*to\s*Action)\]\s*([^\n]*)/gi, function (_match, cueType, cueText) {
                var key = String(cueType || '').toLowerCase().replace(/\s+/g, '');
                var cueBucket = cueMap[key];
                var cleanText = String(cueText || '').trim();
                if (cueBucket && cleanText) {
                    cues[cueBucket].push(cleanText);
                }
                return cleanText;
            });
            return {
                text: stripped,
                cues: cues,
            };
        };
        WorkspacesService_1.prototype.escapeHtml = function (value) {
            return String(value || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
        WorkspacesService_1.prototype.formatManuscriptInline = function (value) {
            var output = this.escapeHtml(value);
            output = output.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            output = output.replace(/(^|[\s(])\*(.+?)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
            output = output.replace(/(^|[\s(])_(.+?)_(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
            return output;
        };
        WorkspacesService_1.prototype.markdownLikeToHtml = function (rawText) {
            var _this = this;
            var _a;
            var text = String(rawText || '').replace(/\r\n/g, '\n').trim();
            if (!text)
                return '<p></p>';
            var lines = text.split('\n');
            var htmlBlocks = [];
            var paragraphBuffer = [];
            var listBuffer = null;
            var scriptureBuffer = [];
            var inBlockquote = false;
            var lastSectionWasHeading = false;
            var flushParagraph = function () {
                if (!paragraphBuffer.length)
                    return;
                var paragraph = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
                if (paragraph) {
                    htmlBlocks.push("<p>".concat(_this.formatManuscriptInline(paragraph), "</p>"));
                }
                paragraphBuffer = [];
            };
            var flushList = function () {
                if (!listBuffer || !listBuffer.items.length) {
                    listBuffer = null;
                    return;
                }
                var items = listBuffer.items
                    .map(function (item) { return "<li>".concat(_this.formatManuscriptInline(item), "</li>"); })
                    .join('');
                htmlBlocks.push("<".concat(listBuffer.type, ">").concat(items, "</").concat(listBuffer.type, ">"));
                listBuffer = null;
            };
            var flushScripture = function () {
                if (!scriptureBuffer.length)
                    return;
                var content = scriptureBuffer
                    .map(function (item) { return item.trim(); })
                    .filter(Boolean)
                    .map(function (item) { return "<p>".concat(_this.formatManuscriptInline(item), "</p>"); })
                    .join('');
                if (content) {
                    htmlBlocks.push("<blockquote>".concat(content, "</blockquote>"));
                }
                scriptureBuffer = [];
                inBlockquote = false;
            };
            var sectionHeadingPattern = /^(introducci[oó]n|lectura del pasaje principal|lectura b[ií]blica|contexto(?: literario| hist[oó]rico| literario y hist[oó]rico)?|trasfondo(?: hist[oó]rico)?|movimiento \d+|punto \d+|aplicaci[oó]n(?: pr[aá]ctica)?|ilustraci[oó]n|conclusi[oó]n|llamado(?: final)?|invitaci[oó]n|oraci[oó]n final|preguntas de reflexi[oó]n|explicaci[oó]n|transici[oó]n)$/i;
            var scriptureReferencePattern = /^([1-3]?\s?[A-Za-zÁÉÍÓÚÑáéíóúñ.]+(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ.]+)*)\s+\d+:\d+(?:[-–]\d+)?(?:\s*\([^)]+\))?$/;
            var numberedHeadingPattern = /^\d+[\.\)]\s+.+$/;
            var scriptureLinePattern = /^\d+\s+.+/;
            var labelPattern = /^(Explicaci[oó]n|Aplicaci[oó]n|Ilustraci[oó]n|Transici[oó]n|Conclusi[oó]n|Invitaci[oó]n|Oraci[oó]n final)\s*:\s*(.+)$/i;
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var rawLine = lines_1[_i];
                var line = rawLine.trim();
                if (!line) {
                    flushParagraph();
                    flushList();
                    flushScripture();
                    lastSectionWasHeading = false;
                    continue;
                }
                var markdownHeading = line.match(/^(#{1,3})\s+(.+)$/);
                if (markdownHeading) {
                    flushParagraph();
                    flushList();
                    flushScripture();
                    var level = Math.min(3, Math.max(1, markdownHeading[1].length));
                    var headingTag = level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4';
                    htmlBlocks.push("<".concat(headingTag, ">").concat(this.formatManuscriptInline(markdownHeading[2]), "</").concat(headingTag, ">"));
                    lastSectionWasHeading = true;
                    continue;
                }
                if (sectionHeadingPattern.test(line)) {
                    flushParagraph();
                    flushList();
                    flushScripture();
                    htmlBlocks.push("<h2>".concat(this.formatManuscriptInline(line), "</h2>"));
                    lastSectionWasHeading = true;
                    continue;
                }
                if (numberedHeadingPattern.test(line)) {
                    flushParagraph();
                    flushList();
                    flushScripture();
                    htmlBlocks.push("<h3>".concat(this.formatManuscriptInline(line), "</h3>"));
                    lastSectionWasHeading = true;
                    continue;
                }
                var scriptureReference = line.match(scriptureReferencePattern);
                if (scriptureReference) {
                    flushParagraph();
                    flushList();
                    flushScripture();
                    htmlBlocks.push("<p><em>".concat(this.formatManuscriptInline(line), "</em></p>"));
                    lastSectionWasHeading = false;
                    continue;
                }
                var labelMatch = line.match(labelPattern);
                if (labelMatch) {
                    flushParagraph();
                    flushList();
                    flushScripture();
                    htmlBlocks.push("<p><strong>".concat(this.formatManuscriptInline(labelMatch[1]), ":</strong> ").concat(this.formatManuscriptInline(labelMatch[2]), "</p>"));
                    lastSectionWasHeading = false;
                    continue;
                }
                if (/^[-*]\s+/.test(line) || /^\d+[\.\)]\s+/.test(line)) {
                    flushParagraph();
                    flushScripture();
                    var nextType = /^\d+[\.\)]\s+/.test(line) ? 'ol' : 'ul';
                    var itemText = line.replace(/^[-*]\s+/, '').replace(/^\d+[\.\)]\s+/, '').trim();
                    if (!listBuffer || listBuffer.type !== nextType) {
                        flushList();
                        listBuffer = { type: nextType, items: [] };
                    }
                    listBuffer.items.push(itemText);
                    lastSectionWasHeading = false;
                    continue;
                }
                if (scriptureLinePattern.test(line) && (inBlockquote || lastSectionWasHeading || ((_a = htmlBlocks.at(-1)) === null || _a === void 0 ? void 0 : _a.includes('<em>')))) {
                    flushParagraph();
                    flushList();
                    inBlockquote = true;
                    scriptureBuffer.push(line);
                    lastSectionWasHeading = false;
                    continue;
                }
                flushList();
                flushScripture();
                paragraphBuffer.push(line);
                lastSectionWasHeading = false;
            }
            flushParagraph();
            flushList();
            flushScripture();
            return htmlBlocks.join('\n');
        };
        WorkspacesService_1.prototype.sanitizeCueObject = function (raw) {
            var _this = this;
            var cues = this.manuscriptCueTemplate();
            if (!raw || typeof raw !== 'object')
                return cues;
            var map = {
                slide: 'slide',
                keyline: 'keyLine',
                key_line: 'keyLine',
                transition: 'transition',
                pause: 'pause',
                read: 'read',
                quote: 'quote',
                cta: 'cta',
                calltoaction: 'cta',
                call_to_action: 'cta',
            };
            Object.entries(raw).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var normalized = map[String(key).toLowerCase().replace(/\s+/g, '')] || map[String(key).toLowerCase()];
                if (!normalized)
                    return;
                cues[normalized] = _this.asStringArray(value, 20);
            });
            return cues;
        };
        WorkspacesService_1.prototype.normalizeCueSearchText = function (value) {
            return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
        };
        WorkspacesService_1.prototype.scoreCueMatch = function (cueText, candidateText) {
            var cueNorm = this.normalizeCueSearchText(cueText);
            var candNorm = this.normalizeCueSearchText(candidateText);
            if (!cueNorm || !candNorm)
                return 0;
            if (candNorm.includes(cueNorm))
                return 1;
            var probe = cueNorm.slice(0, Math.min(90, cueNorm.length));
            if (probe && candNorm.includes(probe))
                return 0.92;
            var cueTokens = cueNorm.split(' ').filter(Boolean);
            var candTokens = new Set(candNorm.split(' ').filter(Boolean));
            if (!cueTokens.length || !candTokens.size)
                return 0;
            var overlap = cueTokens.filter(function (token) { return candTokens.has(token); }).length;
            return overlap / cueTokens.length;
        };
        WorkspacesService_1.prototype.buildCueAnchorsFromManuscriptHtml = function (html, cues) {
            var _this = this;
            var segments = String(html || '')
                .replace(/<[^>]+>/g, '\n')
                .split(/\n+/)
                .map(function (item) { return _this.asString(item).trim(); })
                .filter(Boolean);
            var anchors = {};
            ['slide', 'keyLine', 'transition', 'pause', 'read', 'quote', 'cta'].forEach(function (cueType) {
                cues[cueType].forEach(function (cueText, cueIndex) {
                    var cueNorm = _this.normalizeCueSearchText(cueText);
                    if (!cueNorm)
                        return;
                    var bestIndex = -1;
                    var bestScore = 0;
                    var bestText = '';
                    segments.forEach(function (segment, index) {
                        var score = _this.scoreCueMatch(cueText, segment);
                        if (score > bestScore) {
                            bestScore = score;
                            bestIndex = index;
                            bestText = segment;
                        }
                    });
                    if (bestIndex >= 0 && bestScore >= 0.35) {
                        anchors["".concat(cueType, ":").concat(cueIndex)] = {
                            cueType: cueType,
                            cueIndex: cueIndex,
                            excerpt: bestText.slice(0, 240),
                            paragraphIndex: bestIndex,
                            paragraphHash: _this.normalizeCueSearchText(bestText),
                            confidence: Number(bestScore.toFixed(3)),
                        };
                    }
                });
            });
            return anchors;
        };
        WorkspacesService_1.prototype.stripModelTransportArtifacts = function (value) {
            return String(value || '')
                .replace(/<\|[^|>]+?\|>/g, ' ')
                .replace(/```(?:json)?/gi, '')
                .replace(/```/g, '')
                .replace(/^\s*(assistant|final|response)\s*[:\-]\s*/i, '')
                .replace(/\r\n/g, '\n')
                .trim();
        };
        WorkspacesService_1.prototype.sanitizeGeneratedManuscriptHtml = function (htmlText) {
            return String(htmlText || '')
                .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
                .replace(/\son\w+="[^"]*"/gi, '')
                .replace(/\son\w+='[^']*'/gi, '')
                .replace(/\s(href|src)=("|\')\s*javascript:[\s\S]*?\2/gi, '')
                .trim();
        };
        WorkspacesService_1.prototype.normalizeRecoveredManuscriptContent = function (text) {
            var normalized = this.normalizeGeneratedManuscriptText(text);
            if (!normalized)
                return '<p></p>';
            var htmlText = /<\/?(p|h2|h3|h4|ul|ol|li|blockquote|strong|em|br)\b/i.test(normalized)
                ? normalized
                : this.markdownLikeToHtml(normalized);
            return this.sanitizeGeneratedManuscriptHtml(htmlText) || '<p></p>';
        };
        WorkspacesService_1.prototype.logManuscriptRecoveryMode = function (mode) {
            console.info("[manuscript-parse] recovery_mode=".concat(mode));
        };
        WorkspacesService_1.prototype.normalizeGeneratedManuscriptText = function (text) {
            var normalized = this.stripModelTransportArtifacts(text)
                .replace(/\\n/g, '\n')
                .trim();
            var embedded = this.parseJsonSafe(normalized);
            if (embedded && typeof embedded === 'object' && typeof embedded.text === 'string') {
                normalized = this.stripModelTransportArtifacts(String(embedded.text || ''))
                    .replace(/\\n/g, '\n')
                    .trim();
            }
            return normalized;
        };
        WorkspacesService_1.prototype.parseGeneratedManuscriptResponse = function (rawResponse, options) {
            var cleanedResponse = this.stripModelTransportArtifacts(rawResponse);
            var parsed = this.parseJsonSafe(cleanedResponse) || this.parseJsonSafe(rawResponse);
            if (parsed && typeof parsed === 'object' && typeof parsed.text === 'string') {
                var textFromModel = this.normalizeRecoveredManuscriptContent(String(parsed.text || ''));
                var cueObject = this.sanitizeCueObject(parsed.cues);
                this.logManuscriptRecoveryMode('json');
                return {
                    text: textFromModel || '<p></p>',
                    cues: __assign(__assign({}, cueObject), { slide: options.includeSlideCues ? cueObject.slide : [], keyLine: options.includeKeyLines ? cueObject.keyLine : [] }),
                };
            }
            var malformedPayload = this.extractMalformedManuscriptPayload(cleanedResponse || rawResponse);
            if (malformedPayload === null || malformedPayload === void 0 ? void 0 : malformedPayload.text) {
                this.logManuscriptRecoveryMode(malformedPayload.source);
                return {
                    text: this.normalizeRecoveredManuscriptContent(malformedPayload.text),
                    cues: this.manuscriptCueTemplate(),
                };
            }
            this.logManuscriptRecoveryMode('plain-text');
            var extracted = this.extractCuesFromLegacyText(this.normalizeGeneratedManuscriptText(cleanedResponse || rawResponse));
            return {
                text: this.normalizeRecoveredManuscriptContent(extracted.text),
                cues: __assign(__assign({}, extracted.cues), { slide: options.includeSlideCues ? extracted.cues.slide : [], keyLine: options.includeKeyLines ? extracted.cues.keyLine : [] }),
            };
        };
        WorkspacesService_1.prototype.hasEnglishLeakInSpanishManuscript = function (text, cues) {
            var normalized = this.stripHtmlForWordCount(String(text || '')).toLowerCase();
            var cueText = Object.values(cues || {})
                .flat()
                .join(' ')
                .toLowerCase();
            var combined = "".concat(normalized, " ").concat(cueText);
            var structuralMarkers = [
                /\bintroduction\b/i,
                /\bpoint\s+\d+\b/i,
                /\bconclusion\b/i,
                /\bcall to action\b/i,
                /\bscripture readings?\b/i,
                /\bkey quotes?\b/i,
                /\bkey lines?\b/i,
                /\bappeals?\b/i,
                /\bexplanation\b/i,
                /\bapplication\b/i,
                /\billustration\b/i,
                /\bcontext\b/i,
            ];
            var markerHits = structuralMarkers.reduce(function (sum, rx) { return sum + (rx.test(combined) ? 1 : 0); }, 0);
            var englishLeakPatterns = [
                /\bhe will impart life\b/i,
                /\bdead in trespasses\b/i,
                /\bbelieve his word\b/i,
                /\bput your will\b/i,
                /\bchrist is able\b/i,
                /\bthe soul\b/i,
                /\bby nature we are\b/i,
            ];
            var hasSentenceLeak = englishLeakPatterns.some(function (rx) { return rx.test(combined); });
            var commonEnglishWords = combined.match(/\b(the|and|with|from|that|this|will|would|should|before|after|through|because|therefore|where|when|while|dead|trespasses)\b/gi);
            var englishWordHits = (commonEnglishWords === null || commonEnglishWords === void 0 ? void 0 : commonEnglishWords.length) || 0;
            return markerHits >= 1 || hasSentenceLeak || englishWordHits >= 6;
        };
        WorkspacesService_1.prototype.normalizeSpanishManuscriptLabels = function (text) {
            return String(text || '')
                .replace(/\bIntroduction\b/gi, 'Introducción')
                .replace(/\bPoint\s+(\d+)\b/gi, 'Punto $1')
                .replace(/\bConclusion\b/gi, 'Conclusión')
                .replace(/\bCall to Action\b/gi, 'Llamado a la acción')
                .replace(/\bScripture Readings?\b/gi, 'Lecturas bíblicas')
                .replace(/\bKey Quotes?\b/gi, 'Citas clave')
                .replace(/\bKey Lines?\b/gi, 'Líneas clave')
                .replace(/\bAppeals?\b/gi, 'Llamado')
                .replace(/\bExplanation\b/gi, 'Explicación')
                .replace(/\bApplication\b/gi, 'Aplicación')
                .replace(/\bIllustration\b/gi, 'Ilustración')
                .replace(/\bContext\b/gi, 'Contexto')
                .replace(/\bLeyenda:\b/gi, 'Literatura:')
                .replace(/He will impart life to the soul that is ['"`“”]?dead in trespasses['"`“”]?\.?/gi, 'Él impartirá vida al alma que está «muerta en delitos y pecados».')
                .replace(/Believe His word, and put your will on the side of Christ[^.]*\./gi, 'Cree su Palabra y pon tu voluntad del lado de Cristo.');
        };
        WorkspacesService_1.prototype.normalizeSpanishGeneratedText = function (text) {
            return this.translateEnglishBibleBooksToSpanish(this.normalizeSpanishManuscriptLabels(String(text || ''))
                .replace(/\(\s*Verse\s*:\s*/gi, '(Versículo: ')
                .replace(/\bVerse\s*:\s*/gi, 'Versículo: ')
                .replace(/\bBook\s+([1-3]?\s*[A-Za-zÁÉÍÓÚÑáéíóúñ]+)\s+(\d+:\d+(?:[-–]\d+)?)\b/gi, '$1 $2')
                .replace(/This passage supports the same theme or doctrinal movement in the study\./gi, 'Este pasaje refuerza el mismo tema o movimiento doctrinal del estudio.'));
        };
        WorkspacesService_1.prototype.translateEnglishBibleBooksToSpanish = function (text) {
            var replacements = [
                [/\bGenesis\b/gi, 'Génesis'],
                [/\bExodus\b/gi, 'Éxodo'],
                [/\bLeviticus\b/gi, 'Levítico'],
                [/\bNumbers\b/gi, 'Números'],
                [/\bDeuteronomy\b/gi, 'Deuteronomio'],
                [/\bJoshua\b/gi, 'Josué'],
                [/\bJudges\b/gi, 'Jueces'],
                [/\bRuth\b/gi, 'Rut'],
                [/\b1\s*Samuel\b/gi, '1 Samuel'],
                [/\b2\s*Samuel\b/gi, '2 Samuel'],
                [/\b1\s*Kings\b/gi, '1 Reyes'],
                [/\b2\s*Kings\b/gi, '2 Reyes'],
                [/\b1\s*Chronicles\b/gi, '1 Crónicas'],
                [/\b2\s*Chronicles\b/gi, '2 Crónicas'],
                [/\bEzra\b/gi, 'Esdras'],
                [/\bNehemiah\b/gi, 'Nehemías'],
                [/\bEsther\b/gi, 'Ester'],
                [/\bJob\b/gi, 'Job'],
                [/\bPsalms?\b/gi, 'Salmos'],
                [/\bProverbs\b/gi, 'Proverbios'],
                [/\bEcclesiastes\b/gi, 'Eclesiastés'],
                [/\bSong of Solomon\b/gi, 'Cantares'],
                [/\bIsaiah\b/gi, 'Isaías'],
                [/\bJeremiah\b/gi, 'Jeremías'],
                [/\bLamentations\b/gi, 'Lamentaciones'],
                [/\bEzekiel\b/gi, 'Ezequiel'],
                [/\bDaniel\b/gi, 'Daniel'],
                [/\bHosea\b/gi, 'Oseas'],
                [/\bJoel\b/gi, 'Joel'],
                [/\bAmos\b/gi, 'Amós'],
                [/\bObadiah\b/gi, 'Abdías'],
                [/\bJonah\b/gi, 'Jonás'],
                [/\bMicah\b/gi, 'Miqueas'],
                [/\bNahum\b/gi, 'Nahúm'],
                [/\bHabakkuk\b/gi, 'Habacuc'],
                [/\bZephaniah\b/gi, 'Sofonías'],
                [/\bHaggai\b/gi, 'Hageo'],
                [/\bZechariah\b/gi, 'Zacarías'],
                [/\bMalachi\b/gi, 'Malaquías'],
                [/\bMatthew\b/gi, 'Mateo'],
                [/\bMark\b/gi, 'Marcos'],
                [/\bLuke\b/gi, 'Lucas'],
                [/\bJohn\b/gi, 'Juan'],
                [/\bActs\b/gi, 'Hechos'],
                [/\bRomans\b/gi, 'Romanos'],
                [/\b1\s*Corinthians\b/gi, '1 Corintios'],
                [/\b2\s*Corinthians\b/gi, '2 Corintios'],
                [/\bGalatians\b/gi, 'Gálatas'],
                [/\bEphesians\b/gi, 'Efesios'],
                [/\bPhilippians\b/gi, 'Filipenses'],
                [/\bColossians\b/gi, 'Colosenses'],
                [/\b1\s*Thessalonians\b/gi, '1 Tesalonicenses'],
                [/\b2\s*Thessalonians\b/gi, '2 Tesalonicenses'],
                [/\b1\s*Timothy\b/gi, '1 Timoteo'],
                [/\b2\s*Timothy\b/gi, '2 Timoteo'],
                [/\bTitus\b/gi, 'Tito'],
                [/\bPhilemon\b/gi, 'Filemón'],
                [/\bHebrews\b/gi, 'Hebreos'],
                [/\bJames\b/gi, 'Santiago'],
                [/\b1\s*Peter\b/gi, '1 Pedro'],
                [/\b2\s*Peter\b/gi, '2 Pedro'],
                [/\b1\s*John\b/gi, '1 Juan'],
                [/\b2\s*John\b/gi, '2 Juan'],
                [/\b3\s*John\b/gi, '3 Juan'],
                [/\bJude\b/gi, 'Judas'],
                [/\bRevelation\b/gi, 'Apocalipsis'],
            ];
            return replacements.reduce(function (acc, _a) {
                var pattern = _a[0], replacement = _a[1];
                return acc.replace(pattern, replacement);
            }, String(text || ''));
        };
        WorkspacesService_1.prototype.normalizeSpanishValueDeep = function (value) {
            var _this = this;
            var walk = function (input) {
                if (typeof input === 'string')
                    return _this.normalizeSpanishGeneratedText(input);
                if (Array.isArray(input))
                    return input.map(function (item) { return walk(item); });
                if (input && typeof input === 'object') {
                    var next = {};
                    for (var _i = 0, _a = Object.entries(input); _i < _a.length; _i++) {
                        var _b = _a[_i], key = _b[0], val = _b[1];
                        next[key] = walk(val);
                    }
                    return next;
                }
                return input;
            };
            return walk(value);
        };
        WorkspacesService_1.prototype.normalizeStatementType = function (value) {
            var raw = this.asString(value).trim().toLowerCase();
            if (!raw)
                return sermon_citation_entity_1.StatementType.OBSERVATION;
            if (raw === 'observation')
                return sermon_citation_entity_1.StatementType.OBSERVATION;
            if (raw === 'interpretation')
                return sermon_citation_entity_1.StatementType.INTERPRETATION;
            if (raw === 'application')
                return sermon_citation_entity_1.StatementType.APPLICATION;
            if (raw === 'illustration')
                return sermon_citation_entity_1.StatementType.ILLUSTRATION;
            if (raw === 'external_reference' ||
                raw === 'external reference' ||
                raw === 'exterior_reference' ||
                raw === 'exterior reference' ||
                raw === 'reference') {
                return sermon_citation_entity_1.StatementType.EXTERNAL_REFERENCE;
            }
            return sermon_citation_entity_1.StatementType.OBSERVATION;
        };
        WorkspacesService_1.prototype.buildSpanishManuscriptRewritePrompt = function (text, cues) {
            var payload = this.compactJsonForPrompt({ text: text, cues: cues }, 24000);
            return "Convierte y normaliza este manuscrito al espa\u00F1ol completo.\n\nReglas:\n- Todo el contenido debe quedar en espa\u00F1ol natural ministerial.\n- No dejes encabezados ni frases en ingl\u00E9s.\n- Traduce tambi\u00E9n las citas de EGW al espa\u00F1ol (mant\u00E9n la referencia/citaci\u00F3n).\n- Mant\u00E9n estructura, sentido teol\u00F3gico, referencias b\u00EDblicas y HTML.\n- Mant\u00E9n claves de cues (slide, keyLine, transition, pause, read, quote, cta), pero su contenido debe estar en espa\u00F1ol.\n\nEntrada:\n".concat(payload, "\n\nDevuelve SOLO JSON v\u00E1lido:\n{\n  \"text\": \"<HTML>\",\n  \"cues\": {\n    \"slide\": [\"string\"],\n    \"keyLine\": [\"string\"],\n    \"transition\": [\"string\"],\n    \"pause\": [\"string\"],\n    \"read\": [\"string\"],\n    \"quote\": [\"string\"],\n    \"cta\": [\"string\"]\n  }\n}");
        };
        WorkspacesService_1.prototype.stripHtmlForWordCount = function (htmlText) {
            return String(htmlText || '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        };
        WorkspacesService_1.prototype.manuscriptWordTargets = function (options) {
            var baseTarget = Math.round((options.targetMinutes || 22) * this.manuscriptWpm);
            if (options.format === 'notes') {
                var notesTarget = Math.round(baseTarget * 0.65);
                return {
                    minWords: Math.max(420, Math.round(notesTarget * 0.78)),
                    targetWords: notesTarget,
                    maxWords: Math.round(notesTarget * 1.35),
                };
            }
            return {
                minWords: Math.max(650, Math.round(baseTarget * 0.82)),
                targetWords: baseTarget,
                maxWords: Math.round(baseTarget * 1.3),
            };
        };
        WorkspacesService_1.prototype.countWords = function (text) {
            return this.asString(text).split(/\s+/).filter(Boolean).length;
        };
        WorkspacesService_1.prototype.sentenceRepetitionSignals = function (plainText) {
            var _this = this;
            var sentences = plainText
                .split(/(?<=[.!?])\s+/)
                .map(function (item) {
                return item
                    .toLowerCase()
                    .replace(/\b\d+\b/g, ' ')
                    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
            })
                .filter(function (item) { return _this.countWords(item) >= 8; });
            var counts = new Map();
            var maxRepeat = 0;
            var repeatedSentence = '';
            for (var _i = 0, sentences_1 = sentences; _i < sentences_1.length; _i++) {
                var sentence = sentences_1[_i];
                var next = (counts.get(sentence) || 0) + 1;
                counts.set(sentence, next);
                if (next > maxRepeat) {
                    maxRepeat = next;
                    repeatedSentence = sentence;
                }
            }
            return { maxRepeat: maxRepeat, repeatedSentence: repeatedSentence };
        };
        WorkspacesService_1.prototype.assessManuscriptQuality = function (htmlText, options) {
            var plainText = this.stripHtmlForWordCount(htmlText);
            var wordTargets = this.manuscriptWordTargets(options);
            var wordCount = this.countWords(plainText);
            var repetition = this.sentenceRepetitionSignals(plainText);
            var repeatedSequence = /(?:\b\d+\s+)?por eso,\s+en cristo jes[uú]s somos la obra de su mano; los que antes estaban muertos son ahora vivos/gi.test(plainText.toLowerCase());
            var issues = [];
            if (wordCount < wordTargets.minWords)
                issues.push('too_short');
            if (wordCount > wordTargets.maxWords)
                issues.push('too_long');
            if (repetition.maxRepeat >= 4 || repeatedSequence)
                issues.push('repetitive');
            return {
                wordCount: wordCount,
                targets: wordTargets,
                issues: issues,
                repetition: repetition,
                needsRepair: issues.length > 0,
            };
        };
        WorkspacesService_1.prototype.manuscriptQualityScore = function (quality) {
            var issuePenalty = quality.issues.reduce(function (sum, issue) {
                if (issue === 'repetitive')
                    return sum + 4;
                if (issue === 'too_long')
                    return sum + 3;
                if (issue === 'too_short')
                    return sum + 2;
                return sum + 1;
            }, 0);
            var distancePenalty = Math.abs(quality.wordCount - quality.targets.targetWords) / Math.max(quality.targets.targetWords, 1);
            return Number((issuePenalty + distancePenalty).toFixed(4));
        };
        WorkspacesService_1.prototype.isQualityImprovement = function (baseline, candidate) {
            var baselineScore = this.manuscriptQualityScore(baseline);
            var candidateScore = this.manuscriptQualityScore(candidate);
            if (candidateScore + 0.01 < baselineScore)
                return true;
            var fewerIssues = candidate.issues.length < baseline.issues.length;
            var closerToTarget = Math.abs(candidate.wordCount - candidate.targets.targetWords) <
                Math.abs(baseline.wordCount - baseline.targets.targetWords);
            return fewerIssues || closerToTarget;
        };
        WorkspacesService_1.prototype.hasUsableManuscriptText = function (htmlText) {
            var plainText = this.stripHtmlForWordCount(htmlText);
            var words = this.countWords(plainText);
            return words >= 40 && plainText.length >= 220;
        };
        WorkspacesService_1.prototype.buildManuscriptQualityWarningMessage = function (issues, language) {
            if (!issues.length)
                return '';
            var isSpanish = language === 'es';
            var labels = issues.map(function (issue) {
                if (issue === 'too_short')
                    return isSpanish ? 'demasiado corto' : 'too short';
                if (issue === 'too_long')
                    return isSpanish ? 'demasiado largo' : 'too long';
                if (issue === 'repetitive')
                    return isSpanish ? 'repetitivo' : 'repetitive';
                return issue;
            });
            return isSpanish
                ? "Borrador guardado con observaciones de calidad: ".concat(labels.join(', '), ".")
                : "Draft saved with quality warnings: ".concat(labels.join(', '), ".");
        };
        WorkspacesService_1.prototype.buildManuscriptQualityRepairPrompt = function (workspace, draftHtml, cues, options, issues, repetitionSample) {
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var targets = this.manuscriptWordTargets(options);
            var draftText = this.stripHtmlForWordCount(draftHtml).slice(0, 22000);
            var cuesJson = this.compactJsonForPrompt(cues, 4000);
            var issueList = issues.join(', ');
            var repetitionHint = repetitionSample
                ? "Detected repeated sentence to remove: \"".concat(repetitionSample.slice(0, 220), "\"")
                : '';
            return "Repair this sermon manuscript output for quality and length.\n\nLanguage: ".concat(languageLabel, "\nMain Passage: ").concat(workspace.mainPassage, "\nTarget words: around ").concat(targets.targetWords, " (minimum ").concat(targets.minWords, ", maximum ").concat(targets.maxWords, ")\nDetected issues: ").concat(issueList, "\n").concat(repetitionHint, "\n\nHard rules:\n- Keep all content in ").concat(languageLabel, ".\n- Remove loops/repetition and keep prose natural.\n- Keep the same theological direction and structure.\n- Do not invent Greek/Hebrew/Aramaic words, lexical claims, or historical facts.\n- Do not invent Bible references or EGW references.\n- Preserve cues shape and intent.\n\nCurrent draft text:\n").concat(draftText, "\n\nCurrent cues:\n").concat(cuesJson, "\n\nReturn ONLY valid JSON:\n{\n  \"text\": \"<HTML using p,h2,h3,ul,ol,li,strong,em,br tags>\",\n  \"cues\": {\n    \"slide\": [\"string\"],\n    \"keyLine\": [\"string\"],\n    \"transition\": [\"string\"],\n    \"pause\": [\"string\"],\n    \"read\": [\"string\"],\n    \"quote\": [\"string\"],\n    \"cta\": [\"string\"]\n  }\n}");
        };
        WorkspacesService_1.prototype.buildManuscriptLengthRescuePrompt = function (workspace, outline, options) {
            var basePrompt = this.buildManuscriptPrompt(workspace, outline, options);
            var targets = this.manuscriptWordTargets(options);
            return "".concat(basePrompt, "\n\nLENGTH ENFORCEMENT:\n- Output must contain between ").concat(targets.minWords, " and ").concat(targets.maxWords, " words.\n- Outputs below ").concat(targets.minWords, " words are invalid.\n- Expand each section with substantive exposition, transitions, and concrete application.");
        };
        WorkspacesService_1.prototype.normalizeManuscriptForWorkspace = function (workspace, parsed) {
            var _this = this;
            var next = {
                text: parsed.text,
                cues: parsed.cues,
            };
            if (workspace.language === 'es') {
                next = __assign(__assign({}, next), { text: this.normalizeSpanishManuscriptLabels(next.text), cues: {
                        slide: next.cues.slide.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                        keyLine: next.cues.keyLine.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                        transition: next.cues.transition.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                        pause: next.cues.pause.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                        read: next.cues.read.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                        quote: next.cues.quote.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                        cta: next.cues.cta.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                    } });
            }
            return this.sanitizeOutputForLens(next, workspace);
        };
        WorkspacesService_1.prototype.buildUnderLengthExpansionBlock = function (workspace, outline, neededWords, passIndex) {
            var _this = this;
            var _a;
            if (passIndex === void 0) { passIndex = 0; }
            var isSpanish = workspace.language === 'es';
            var studyReportRaw = ((_a = this.getPrimaryStudyReport(workspace)) === null || _a === void 0 ? void 0 : _a.sections) || {};
            var structure = this.normalizeOutlineData((outline === null || outline === void 0 ? void 0 : outline.structure) || {}) || {};
            var pointNodes = Array.isArray(structure.pointNodes) ? structure.pointNodes : [];
            var points = this.extractOutlinePointTexts(structure).slice(0, 4);
            var audience = this.asString(workspace.audienceProfile || '');
            var goal = this.asString(workspace.sermonGoals || '');
            var theme = this.asString(workspace.theme || '');
            var studyAssets = ((studyReportRaw === null || studyReportRaw === void 0 ? void 0 : studyReportRaw.studyAssets) || {});
            var categoryAssets = (studyAssets.categoryAssets || {});
            var movementAssets = Array.isArray(studyAssets.movementAssets) ? studyAssets.movementAssets : [];
            var blocks = [];
            blocks.push(isSpanish
                ? "<h2>Profundizaci\u00F3n Pastoral</h2><p>Antes de concluir, ampliemos c\u00F3mo este pasaje transforma la vida diaria de la iglesia. Este desarrollo adicional conecta la verdad b\u00EDblica con decisiones concretas para ".concat(this.formatManuscriptInline(audience || 'la congregación'), " y retoma el hilo del estudio ya realizado.</p><p><strong>Resumen de estudio:</strong> ").concat(this.formatManuscriptInline(this.asString(studyReportRaw.exegeticalSummary || studyReportRaw.passageOverview || '')), "</p><p><strong>Contexto literario:</strong> ").concat(this.formatManuscriptInline(this.asString(studyReportRaw.literaryContext || '')), "</p><p><strong>Contexto hist\u00F3rico:</strong> ").concat(this.formatManuscriptInline(this.asString(studyReportRaw.historicalContext || '')), "</p><p><strong>Contexto can\u00F3nico:</strong> ").concat(this.formatManuscriptInline(this.asString(studyReportRaw.canonicalContext || '')), "</p>")
                : "<h2>Pastoral Deepening</h2><p>Before concluding, we deepen how this passage transforms everyday church life. This additional development connects biblical truth with concrete decisions for ".concat(this.formatManuscriptInline(audience || 'the congregation'), " and reuses the study work already completed.</p><p><strong>Study summary:</strong> ").concat(this.formatManuscriptInline(this.asString(studyReportRaw.exegeticalSummary || studyReportRaw.passageOverview || '')), "</p><p><strong>Literary context:</strong> ").concat(this.formatManuscriptInline(this.asString(studyReportRaw.literaryContext || '')), "</p><p><strong>Historical context:</strong> ").concat(this.formatManuscriptInline(this.asString(studyReportRaw.historicalContext || '')), "</p><p><strong>Canonical context:</strong> ").concat(this.formatManuscriptInline(this.asString(studyReportRaw.canonicalContext || '')), "</p>"));
            points.forEach(function (point, index) {
                var _a, _b, _c, _d, _e, _f;
                var node = pointNodes[index] || {};
                var title = _this.asString((node === null || node === void 0 ? void 0 : node.title) || point || (isSpanish ? "Punto ".concat(index + 1) : "Point ".concat(index + 1)));
                var summary = _this.asString((node === null || node === void 0 ? void 0 : node.summary) || point || '');
                var refs = _this.asStringArray((node === null || node === void 0 ? void 0 : node.supportingVerses) || (node === null || node === void 0 ? void 0 : node.crossReferences) || [], 4);
                var refsText = refs.join(', ');
                var applications = _this.asStringArray((node === null || node === void 0 ? void 0 : node.applications) || [], 3);
                var questions = _this.asStringArray((node === null || node === void 0 ? void 0 : node.discussionQuestions) || [], 2);
                var illustrations = _this.asStringArray((node === null || node === void 0 ? void 0 : node.illustrationIdeas) || [], 2);
                var themes = _this.asStringArray((node === null || node === void 0 ? void 0 : node.canonicalThemes) || [], 2);
                var studyThemes = _this.asStringArray((studyReportRaw === null || studyReportRaw === void 0 ? void 0 : studyReportRaw.theologicalThemes) || [], 4);
                var keyTerms = Array.isArray(studyReportRaw === null || studyReportRaw === void 0 ? void 0 : studyReportRaw.keyTerms)
                    ? studyReportRaw.keyTerms.slice(0, 2).map(function (item) { return _this.asString((item === null || item === void 0 ? void 0 : item.term) || (item === null || item === void 0 ? void 0 : item.word) || ''); }).filter(Boolean)
                    : [];
                var crossRefs = Array.isArray(studyReportRaw === null || studyReportRaw === void 0 ? void 0 : studyReportRaw.crossReferences)
                    ? studyReportRaw.crossReferences.slice(0, 2).map(function (item) { return _this.asString((item === null || item === void 0 ? void 0 : item.reference) || (item === null || item === void 0 ? void 0 : item.verse) || ''); }).filter(Boolean)
                    : [];
                if (isSpanish) {
                    blocks.push("<h3>".concat(_this.formatManuscriptInline(title), "</h3>") +
                        "<p><strong>Desarrollo:</strong> ".concat(_this.formatManuscriptInline(summary || 'Este punto llama a una respuesta espiritual profunda y constante.'), "</p>") +
                        "<p><strong>Conexi\u00F3n con el estudio:</strong> ".concat(_this.formatManuscriptInline(_this.asString(studyReportRaw.mainTheologicalClaim || theme || '')), ".</p>") +
                        "<p><strong>\u00C9nfasis doctrinal:</strong> ".concat(_this.formatManuscriptInline(studyThemes.join('; ') || 'La gracia de Dios, la fe respondida y la nueva vida en Cristo.'), "</p>") +
                        "<p><strong>Aplicaci\u00F3n congregacional:</strong> Como iglesia, necesitamos llevar esta verdad al hogar, al servicio y a la misi\u00F3n semanal. " +
                        "Esto implica oraci\u00F3n intencional, discipulado activo y testimonio pr\u00E1ctico para que la gracia de Cristo se vea en nuestras relaciones.</p>" +
                        "<p><strong>Acompa\u00F1amiento b\u00EDblico:</strong> ".concat(_this.formatManuscriptInline(refsText || workspace.mainPassage), " nos recuerda que la obediencia nace de la gracia y se expresa en obras preparadas por Dios.</p>") +
                        (movementAssets[index]
                            ? "<p><strong>Apoyo del estudio:</strong> ".concat(_this.formatManuscriptInline(_this.asString(((_a = movementAssets[index]) === null || _a === void 0 ? void 0 : _a.summary) || '')), " ") +
                                "".concat(_this.formatManuscriptInline(_this.asStringArray(((_b = movementAssets[index]) === null || _b === void 0 ? void 0 : _b.applications) || [], 4).join(' ')), " ") +
                                "".concat(_this.formatManuscriptInline(_this.asStringArray(((_c = movementAssets[index]) === null || _c === void 0 ? void 0 : _c.discussionQuestions) || [], 3).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.applications) && categoryAssets.applications.length
                            ? "<p><strong>Aplicaciones extendidas:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.applications, 4).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.discussionQuestions) && categoryAssets.discussionQuestions.length
                            ? "<p><strong>Preguntas pastorales:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.discussionQuestions, 3).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.illustrationIdeas) && categoryAssets.illustrationIdeas.length
                            ? "<p><strong>Ilustraciones:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.illustrationIdeas, 3).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.mediaSuggestions) && categoryAssets.mediaSuggestions.length
                            ? "<p><strong>Sugerencias de medios:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.mediaSuggestions, 3).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.egwSupport) && categoryAssets.egwSupport.length
                            ? "<p><strong>Apoyo de Esp\u00EDritu de Profec\u00EDa:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.egwSupport.slice(0, 3).map(function (item) { return (item === null || item === void 0 ? void 0 : item.quote) || (item === null || item === void 0 ? void 0 : item.citation) || ''; }), 3).join(' ')), "</p>")
                            : '') +
                        (keyTerms.length
                            ? "<p><strong>T\u00E9rminos clave:</strong> ".concat(_this.formatManuscriptInline(keyTerms.join('; ')), "</p>")
                            : '') +
                        (crossRefs.length
                            ? "<p><strong>Referencias de apoyo:</strong> ".concat(_this.formatManuscriptInline(crossRefs.join(', ')), "</p>")
                            : '') +
                        (themes.length
                            ? "<p><strong>Enfoque tem\u00E1tico:</strong> ".concat(_this.formatManuscriptInline(themes.join('; ')), ".</p>")
                            : '') +
                        (illustrations.length
                            ? "<p><strong>Apoyo ilustrativo:</strong> ".concat(_this.formatManuscriptInline(illustrations.join(' ')), "</p>")
                            : '') +
                        (questions.length
                            ? "<p><strong>Puente pastoral:</strong> ".concat(_this.formatManuscriptInline(questions.join(' ')), "</p>")
                            : '') +
                        (applications.length
                            ? "<p><strong>Paso concreto:</strong> ".concat(_this.formatManuscriptInline(applications.join(' ')), "</p>")
                            : ''));
                }
                else {
                    blocks.push("<h3>".concat(_this.formatManuscriptInline(title), "</h3>") +
                        "<p><strong>Development:</strong> ".concat(_this.formatManuscriptInline(summary || 'This point calls for deep and sustained spiritual response.'), "</p>") +
                        "<p><strong>Study connection:</strong> ".concat(_this.formatManuscriptInline(_this.asString(studyReportRaw.mainTheologicalClaim || theme || '')), ".</p>") +
                        "<p><strong>Doctrinal emphasis:</strong> ".concat(_this.formatManuscriptInline(studyThemes.join('; ') || 'God’s grace, responsive faith, and new life in Christ.'), "</p>") +
                        "<p><strong>Congregational application:</strong> As a church we bring this truth into home life, service, and weekly mission through intentional prayer, active discipleship, and practical witness.</p>" +
                        "<p><strong>Biblical grounding:</strong> ".concat(_this.formatManuscriptInline(refsText || workspace.mainPassage), " reminds us that obedience flows from grace and is expressed in works prepared by God.</p>") +
                        (movementAssets[index]
                            ? "<p><strong>Study support:</strong> ".concat(_this.formatManuscriptInline(_this.asString(((_d = movementAssets[index]) === null || _d === void 0 ? void 0 : _d.summary) || '')), " ") +
                                "".concat(_this.formatManuscriptInline(_this.asStringArray(((_e = movementAssets[index]) === null || _e === void 0 ? void 0 : _e.applications) || [], 4).join(' ')), " ") +
                                "".concat(_this.formatManuscriptInline(_this.asStringArray(((_f = movementAssets[index]) === null || _f === void 0 ? void 0 : _f.discussionQuestions) || [], 3).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.applications) && categoryAssets.applications.length
                            ? "<p><strong>Extended applications:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.applications, 4).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.discussionQuestions) && categoryAssets.discussionQuestions.length
                            ? "<p><strong>Pastoral questions:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.discussionQuestions, 3).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.illustrationIdeas) && categoryAssets.illustrationIdeas.length
                            ? "<p><strong>Illustrative support:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.illustrationIdeas, 3).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.mediaSuggestions) && categoryAssets.mediaSuggestions.length
                            ? "<p><strong>Media suggestions:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.mediaSuggestions, 3).join(' ')), "</p>")
                            : '') +
                        (Array.isArray(categoryAssets.egwSupport) && categoryAssets.egwSupport.length
                            ? "<p><strong>Spirit of Prophecy support:</strong> ".concat(_this.formatManuscriptInline(_this.asStringArray(categoryAssets.egwSupport.slice(0, 3).map(function (item) { return (item === null || item === void 0 ? void 0 : item.quote) || (item === null || item === void 0 ? void 0 : item.citation) || ''; }), 3).join(' ')), "</p>")
                            : '') +
                        (keyTerms.length
                            ? "<p><strong>Key terms:</strong> ".concat(_this.formatManuscriptInline(keyTerms.join('; ')), "</p>")
                            : '') +
                        (crossRefs.length
                            ? "<p><strong>Supporting references:</strong> ".concat(_this.formatManuscriptInline(crossRefs.join(', ')), "</p>")
                            : '') +
                        (themes.length
                            ? "<p><strong>Thematic focus:</strong> ".concat(_this.formatManuscriptInline(themes.join('; ')), ".</p>")
                            : '') +
                        (illustrations.length
                            ? "<p><strong>Illustrative support:</strong> ".concat(_this.formatManuscriptInline(illustrations.join(' ')), "</p>")
                            : '') +
                        (questions.length
                            ? "<p><strong>Pastoral bridge:</strong> ".concat(_this.formatManuscriptInline(questions.join(' ')), "</p>")
                            : '') +
                        (applications.length
                            ? "<p><strong>Concrete step:</strong> ".concat(_this.formatManuscriptInline(applications.join(' ')), "</p>")
                            : ''));
                }
            });
            if (isSpanish) {
                blocks.push("<p><strong>Enfoque final:</strong> ".concat(this.formatManuscriptInline(goal || 'Respondamos con fe, obediencia y gratitud.'), " ") +
                    "".concat(this.formatManuscriptInline(theme || ''), "</p>"));
            }
            else {
                blocks.push("<p><strong>Final focus:</strong> ".concat(this.formatManuscriptInline(goal || 'Let us respond with faith, obedience, and gratitude.'), " ").concat(this.formatManuscriptInline(theme || ''), "</p>"));
            }
            var html = blocks.join('\n');
            var minReasonableWords = Math.max(650, Math.min(3600, neededWords));
            var dynamicPointTitles = points.map(function (item, idx) { var _a; return _this.asString(((_a = pointNodes[idx]) === null || _a === void 0 ? void 0 : _a.title) || item); }).filter(Boolean);
            var safetyCounter = 0;
            while (this.countWords(this.stripHtmlForWordCount(html)) < minReasonableWords && dynamicPointTitles.length) {
                var title = dynamicPointTitles[(passIndex + safetyCounter) % dynamicPointTitles.length];
                html += isSpanish
                    ? "<p><strong>Profundizaci\u00F3n adicional:</strong> Retoma el \u00E9nfasis de ".concat(this.formatManuscriptInline(title), " y desarrolla c\u00F3mo esta verdad cambia las decisiones del hogar, la iglesia y la misi\u00F3n. Conecta nuevamente el resumen del estudio, el contexto literario, el contexto hist\u00F3rico y el \u00E9nfasis can\u00F3nico para mostrar por qu\u00E9 este punto importa para ").concat(this.formatManuscriptInline(audience || 'la congregación'), ". Luego vuelve a mencionar la gracia de Dios, la respuesta de fe y el llamado pastoral a vivir con obediencia, gratitud y esperanza.</p>")
                    : "<p><strong>Additional deepening:</strong> Revisit ".concat(this.formatManuscriptInline(title), " and show how this truth reshapes home life, church life, and mission. Reconnect the study summary, literary context, historical setting, and canonical significance so the congregation sees why this point matters for ").concat(this.formatManuscriptInline(audience || 'the congregation'), ". Then restate the grace of God, the human response of faith, and the pastoral call to live with obedience, gratitude, and hope.</p>");
                safetyCounter += 1;
                if (safetyCounter > 12)
                    break;
            }
            return html;
        };
        WorkspacesService_1.prototype.buildManuscriptGuardrailFallback = function (workspace, outline, options) {
            var _this = this;
            var isSpanish = workspace.language === 'es';
            var guardrail = this.buildGuardrailProfile(workspace);
            var normalizedStructure = this.normalizeOutlineData((outline === null || outline === void 0 ? void 0 : outline.structure) || {}) || {};
            var pointNodes = Array.isArray(normalizedStructure.pointNodes) ? normalizedStructure.pointNodes : [];
            var pointTitles = this.extractOutlinePointTexts(normalizedStructure).slice(0, 4);
            var targetWords = Math.max(options.targetMinutes * this.manuscriptWpm, 220);
            var expandedBody = this.buildUnderLengthExpansionBlock(workspace, outline, targetWords, 0);
            var intro = isSpanish
                ? guardrail.active
                    ? "<h2>Manuscrito con guardrail prof\u00E9tico</h2><p>Este borrador mantiene el pasaje en primer lugar, conserva a Cristo en el centro y evita especulaci\u00F3n. Est\u00E1 dise\u00F1ado para ayudar a predicar el mensaje con claridad pastoral y fidelidad b\u00EDblica.</p>"
                    : "<h2>Manuscrito pastoral</h2><p>Este borrador desarrolla con amplitud el mensaje del pasaje, usa el estudio ya generado y mantiene un tono pastoral, b\u00EDblico y claro. Est\u00E1 dise\u00F1ado para que la congregaci\u00F3n vea el flujo completo del serm\u00F3n sin perder la conexi\u00F3n con el estudio previo.</p>"
                : guardrail.active
                    ? "<h2>Prophetic guardrail manuscript</h2><p>This draft keeps the passage first, keeps Christ at the center, and avoids speculation. It is designed to help preach the message with pastoral clarity and biblical fidelity.</p>"
                    : "<h2>Pastoral manuscript</h2><p>This draft develops the passage in full, reuses the study already generated, and keeps a pastoral, biblical, and clear tone. It is designed so the congregation can follow the full sermon flow without losing the study work completed earlier.</p>";
            var conclusion = isSpanish
                ? "<h2>Conclusi\u00F3n y llamado</h2><p>Invitemos a la congregaci\u00F3n a responder al evangelio eterno con fe, adoraci\u00F3n fiel y confianza en Jesucristo, el \u00FAnico que salva, sostiene y env\u00EDa a su pueblo.</p>"
                : "<h2>Conclusion and appeal</h2><p>Invite the congregation to respond to the everlasting gospel with faith, faithful worship, and confidence in Jesus Christ, the only One who saves, sustains, and sends His people.</p>";
            var fallbackText = "".concat(intro, "\n").concat(expandedBody, "\n").concat(conclusion);
            var cues = {
                slide: pointTitles.length ? pointTitles.map(function (title) { return _this.formatManuscriptInline(title); }).slice(0, 8) : this.manuscriptCueTemplate().slide,
                keyLine: isSpanish
                    ? [
                        'El evangelio eterno llama a responder con fe y adoración.',
                        'Cristo permanece al centro del mensaje profético.',
                    ]
                    : [
                        'The everlasting gospel calls for faith and worship.',
                        'Christ remains at the center of the prophetic message.',
                    ],
                transition: pointNodes.length
                    ? pointNodes.map(function (point, index) {
                        return isSpanish
                            ? "Transici\u00F3n hacia ".concat(_this.asString((point === null || point === void 0 ? void 0 : point.title) || pointTitles[index] || "Punto ".concat(index + 1)))
                            : "Transition to ".concat(_this.asString((point === null || point === void 0 ? void 0 : point.title) || pointTitles[index] || "Point ".concat(index + 1)));
                    })
                    : [],
                pause: isSpanish
                    ? ['Pausa pastoral: deje que la congregación escuche la invitación del evangelio.']
                    : ['Pastoral pause: let the congregation hear the gospel invitation.'],
                read: [this.asString(workspace.mainPassage || '')].filter(Boolean),
                quote: [],
                cta: isSpanish
                    ? ['Invite a la congregación a responder con fe y obediencia.']
                    : ['Invite the congregation to respond with faith and obedience.'],
            };
            return this.normalizeManuscriptForWorkspace(workspace, { text: fallbackText, cues: cues });
        };
        WorkspacesService_1.prototype.buildManuscriptExpansionPrompt = function (workspace, draftHtml, cues, options) {
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var targets = this.manuscriptWordTargets(options);
            var draftText = this.stripHtmlForWordCount(draftHtml).slice(0, 20000);
            var cuesJson = this.compactJsonForPrompt(cues, 4000);
            return "Revise and expand this sermon manuscript to reach the requested length while preserving theological accuracy and structure.\n\nLanguage: ".concat(languageLabel, "\nMain Passage: ").concat(workspace.mainPassage, "\nTarget minutes: ").concat(options.targetMinutes, "\nTarget words: around ").concat(targets.targetWords, " (minimum ").concat(targets.minWords, ", maximum ").concat(targets.maxWords, ")\nFormat: ").concat(options.format, "\n\nHard rules:\n- Keep all content in ").concat(languageLabel, ".\n- Return between ").concat(targets.minWords, " and ").concat(targets.maxWords, " words. Responses below ").concat(targets.minWords, " words are rejected.\n- Do not invent Greek/Hebrew/Aramaic words, lexical claims, or historical facts not in the draft.\n- Do not invent Bible references or EGW references.\n- Keep doctrinal alignment Adventist and Scripture-grounded.\n- If uncertain about a detail, simplify instead of fabricating.\n- Preserve cue intent and return cues in same structure.\n- Expand each major section with concrete explanation, biblical grounding, and practical application.\n- Do not include meta comments about word count, timing, or generation instructions inside the sermon text.\n\nCurrent draft text:\n").concat(draftText, "\n\nCurrent cues:\n").concat(cuesJson, "\n\nReturn ONLY valid JSON:\n{\n  \"text\": \"<HTML using p,h2,h3,ul,ol,li,strong,em,br tags>\",\n  \"cues\": {\n    \"slide\": [\"string\"],\n    \"keyLine\": [\"string\"],\n    \"transition\": [\"string\"],\n    \"pause\": [\"string\"],\n    \"read\": [\"string\"],\n    \"quote\": [\"string\"],\n    \"cta\": [\"string\"]\n  }\n}");
        };
        WorkspacesService_1.prototype.buildManuscriptContext = function (workspace, outline, options) {
            var _this = this;
            var _a, _b, _c, _d, _e;
            var cache = workspace.scriptureCache || {};
            var outlineStructure = (outline === null || outline === void 0 ? void 0 : outline.structure) || {};
            var cacheAny = cache;
            // ============================================
            // STUDY REPORT - Background intelligence layer
            // ============================================
            var studyReportRaw = ((_a = this.getPrimaryStudyReport(workspace)) === null || _a === void 0 ? void 0 : _a.sections) || {};
            var studyReport = {
                passageOverview: this.asString(studyReportRaw.passageOverview || ''),
                literaryContext: this.asString(studyReportRaw.literaryContext || ''),
                historicalContext: this.asString(studyReportRaw.historicalContext || ''),
                canonicalContext: this.asString(studyReportRaw.canonicalContext || ''),
                exegeticalSummary: this.asString(studyReportRaw.exegeticalSummary || ''),
                mainTheologicalClaim: this.asString(studyReportRaw.mainTheologicalClaim || ''),
                theologicalThemes: this.asStringArray(studyReportRaw.theologicalThemes || [], 6),
                interpretiveChallenges: Array.isArray(studyReportRaw.interpretiveChallenges)
                    ? studyReportRaw.interpretiveChallenges.slice(0, 3)
                    : [],
                pastoralImplications: {
                    personalLife: this.asStringArray(((_b = studyReportRaw === null || studyReportRaw === void 0 ? void 0 : studyReportRaw.pastoralImplications) === null || _b === void 0 ? void 0 : _b.personalLife) || [], 4),
                    churchLife: this.asStringArray(((_c = studyReportRaw === null || studyReportRaw === void 0 ? void 0 : studyReportRaw.pastoralImplications) === null || _c === void 0 ? void 0 : _c.churchLife) || [], 4),
                    mission: this.asStringArray(((_d = studyReportRaw === null || studyReportRaw === void 0 ? void 0 : studyReportRaw.pastoralImplications) === null || _d === void 0 ? void 0 : _d.mission) || [], 4),
                },
                structureOfPassage: Array.isArray(studyReportRaw.structureOfPassage)
                    ? studyReportRaw.structureOfPassage.slice(0, 4).map(function (item) { return ({
                        movement: _this.asString((item === null || item === void 0 ? void 0 : item.movement) || ''),
                        verses: _this.asString((item === null || item === void 0 ? void 0 : item.verses) || ''),
                        summary: _this.asString((item === null || item === void 0 ? void 0 : item.summary) || ''),
                    }); })
                    : [],
                keyTerms: Array.isArray(studyReportRaw.keyTerms)
                    ? studyReportRaw.keyTerms.slice(0, 6).map(function (item) { return ({
                        term: _this.asString((item === null || item === void 0 ? void 0 : item.term) || (item === null || item === void 0 ? void 0 : item.word) || ''),
                        language: _this.asString((item === null || item === void 0 ? void 0 : item.language) || ''),
                        transliteration: _this.asString((item === null || item === void 0 ? void 0 : item.transliteration) || ''),
                        definition: _this.asString((item === null || item === void 0 ? void 0 : item.definition) || (item === null || item === void 0 ? void 0 : item.meaning) || ''),
                        nuance: _this.asString((item === null || item === void 0 ? void 0 : item.nuance) || (item === null || item === void 0 ? void 0 : item.significance) || ''),
                    }); })
                    : [],
                crossReferences: Array.isArray(studyReportRaw.crossReferences)
                    ? studyReportRaw.crossReferences.slice(0, 6).map(function (item) { return ({
                        reference: _this.asString((item === null || item === void 0 ? void 0 : item.reference) || (item === null || item === void 0 ? void 0 : item.verse) || ''),
                        connection: _this.asString((item === null || item === void 0 ? void 0 : item.connection) || (item === null || item === void 0 ? void 0 : item.explanation) || (item === null || item === void 0 ? void 0 : item.reason) || ''),
                        category: _this.asString((item === null || item === void 0 ? void 0 : item.category) || ''),
                        tier: _this.asString((item === null || item === void 0 ? void 0 : item.tier) || ''),
                    }); }).filter(function (item) { return item.reference; })
                    : [],
            };
            // ============================================
            // WORD STUDIES - Original language insights (global, for context)
            // ============================================
            var wordStudyData = (cacheAny === null || cacheAny === void 0 ? void 0 : cacheAny.wordStudy) || (cacheAny === null || cacheAny === void 0 ? void 0 : cacheAny.wordStudies) || [];
            var keyTermsFromStudy = Array.isArray(studyReportRaw.keyTerms) ? studyReportRaw.keyTerms : [];
            var wordStudies = __spreadArray(__spreadArray([], keyTermsFromStudy.map(function (kt) { return ({
                word: _this.asString((kt === null || kt === void 0 ? void 0 : kt.term) || (kt === null || kt === void 0 ? void 0 : kt.word) || ''),
                originalLanguage: _this.asString((kt === null || kt === void 0 ? void 0 : kt.language) || ''),
                transliteration: _this.asString((kt === null || kt === void 0 ? void 0 : kt.transliteration) || ''),
                meaning: _this.asString((kt === null || kt === void 0 ? void 0 : kt.definition) || (kt === null || kt === void 0 ? void 0 : kt.meaning) || ''),
                significance: _this.asString((kt === null || kt === void 0 ? void 0 : kt.nuance) || (kt === null || kt === void 0 ? void 0 : kt.significance) || ''),
            }); }), true), (Array.isArray(wordStudyData) ? wordStudyData.slice(0, 6).map(function (ws) { return ({
                word: _this.asString((ws === null || ws === void 0 ? void 0 : ws.word) || (ws === null || ws === void 0 ? void 0 : ws.originalWord) || ''),
                originalLanguage: _this.asString((ws === null || ws === void 0 ? void 0 : ws.language) || ''),
                transliteration: _this.asString((ws === null || ws === void 0 ? void 0 : ws.transliteration) || ''),
                meaning: _this.asString((ws === null || ws === void 0 ? void 0 : ws.meaning) || (ws === null || ws === void 0 ? void 0 : ws.definition) || ''),
                significance: _this.asString((ws === null || ws === void 0 ? void 0 : ws.significance) || (ws === null || ws === void 0 ? void 0 : ws.theologicalSignificance) || ''),
            }); }) : []), true).filter(function (ws) { return ws.word; }).slice(0, 10);
            // ============================================
            // OUTLINE AS AUTHORITY - Each point carries its own assets
            // ============================================
            var rawPointNodes = Array.isArray(outlineStructure === null || outlineStructure === void 0 ? void 0 : outlineStructure.pointNodes) ? outlineStructure.pointNodes.slice(0, 8) : [];
            var outlinePoints = this.extractOutlinePointTexts(outlineStructure).slice(0, 8);
            // Normalize each point node with its attached assets
            var enrichedPointNodes = rawPointNodes.map(function (point, index) { return ({
                // Point identity
                title: _this.asString((point === null || point === void 0 ? void 0 : point.title) || outlinePoints[index] || "Point ".concat(index + 1)),
                summary: _this.asString((point === null || point === void 0 ? void 0 : point.summary) || ''),
                subpoints: _this.asStringArray((point === null || point === void 0 ? void 0 : point.subpoints) || [], 5),
                // Scripture support for THIS point
                supportingVerses: _this.asStringArray((point === null || point === void 0 ? void 0 : point.supportingVerses) || (point === null || point === void 0 ? void 0 : point.verses) || [], 6),
                crossReferences: _this.asStringArray((point === null || point === void 0 ? void 0 : point.crossReferences) || (point === null || point === void 0 ? void 0 : point.references) || [], 6),
                // Preaching assets for THIS point (not global!)
                applications: _this.asStringArray((point === null || point === void 0 ? void 0 : point.applications) || [], 12),
                illustrationIdeas: _this.asStringArray((point === null || point === void 0 ? void 0 : point.illustrationIdeas) || [], 12),
                discussionQuestions: _this.asStringArray((point === null || point === void 0 ? void 0 : point.discussionQuestions) || [], 12),
                // Theological anchors for THIS point
                canonicalThemes: _this.asStringArray((point === null || point === void 0 ? void 0 : point.canonicalThemes) || [], 4),
                // EGW support for THIS point
                egwSupport: Array.isArray(point === null || point === void 0 ? void 0 : point.egwSupport)
                    ? point.egwSupport.slice(0, 3).map(function (e) { return ({
                        citation: _this.asString((e === null || e === void 0 ? void 0 : e.citation) || (e === null || e === void 0 ? void 0 : e.reference) || ''),
                        quote: _this.asString((e === null || e === void 0 ? void 0 : e.quote) || (e === null || e === void 0 ? void 0 : e.text) || ''),
                        relevance: _this.asString((e === null || e === void 0 ? void 0 : e.relevance) || (e === null || e === void 0 ? void 0 : e.summary) || ''),
                    }); }).filter(function (e) { return e.citation || e.quote; })
                    : [],
            }); });
            // ============================================
            // GLOBAL EGW QUOTES - For intro/conclusion
            // ============================================
            var egwQuotesData = (cacheAny === null || cacheAny === void 0 ? void 0 : cacheAny.egwQuotes) || (cacheAny === null || cacheAny === void 0 ? void 0 : cacheAny.egwSupport) || [];
            var globalEgwQuotes = Array.isArray(egwQuotesData)
                ? egwQuotesData.slice(0, 4).map(function (q) { return ({
                    text: _this.asString((q === null || q === void 0 ? void 0 : q.text) || (q === null || q === void 0 ? void 0 : q.quote) || (q === null || q === void 0 ? void 0 : q.content) || ''),
                    source: _this.asString((q === null || q === void 0 ? void 0 : q.source) || (q === null || q === void 0 ? void 0 : q.reference) || (q === null || q === void 0 ? void 0 : q.book) || ''),
                    theme: _this.asString((q === null || q === void 0 ? void 0 : q.theme) || (q === null || q === void 0 ? void 0 : q.topic) || ''),
                }); }).filter(function (q) { return q.text; })
                : [];
            // ============================================
            // GLOBAL CROSS REFERENCES - For intro/conclusion
            // ============================================
            var studyCrossRefs = Array.isArray(studyReportRaw.crossReferences)
                ? studyReportRaw.crossReferences.slice(0, 8)
                : [];
            var cachedCrossRefs = Array.isArray((_e = cache === null || cache === void 0 ? void 0 : cache.crossReferences) === null || _e === void 0 ? void 0 : _e.ranked)
                ? cache.crossReferences.ranked.slice(0, 8)
                : [];
            var crossRefMap = new Map();
            __spreadArray(__spreadArray([], studyCrossRefs, true), cachedCrossRefs, true).forEach(function (ref) {
                var key = _this.asString((ref === null || ref === void 0 ? void 0 : ref.reference) || (ref === null || ref === void 0 ? void 0 : ref.verse) || '');
                if (key && !crossRefMap.has(key)) {
                    crossRefMap.set(key, {
                        reference: key,
                        connection: _this.asString((ref === null || ref === void 0 ? void 0 : ref.connection) || (ref === null || ref === void 0 ? void 0 : ref.explanation) || (ref === null || ref === void 0 ? void 0 : ref.reason) || ''),
                    });
                }
            });
            var globalCrossReferences = Array.from(crossRefMap.values()).slice(0, 12);
            // ============================================
            // CITATIONS - External references (global)
            // ============================================
            var citations = (workspace.citations || [])
                .slice(0, 6)
                .map(function (c) { return ({
                source: _this.asString((c === null || c === void 0 ? void 0 : c.source) || (c === null || c === void 0 ? void 0 : c.author) || ''),
                quote: _this.asString((c === null || c === void 0 ? void 0 : c.quote) || (c === null || c === void 0 ? void 0 : c.text) || (c === null || c === void 0 ? void 0 : c.content) || ''),
                context: _this.asString((c === null || c === void 0 ? void 0 : c.context) || ''),
            }); })
                .filter(function (c) { return c.quote; });
            // ============================================
            // PREACHING INSIGHTS - From scripture cache
            // ============================================
            var preachingInsights = {
                passageSummary: this.asString((cache === null || cache === void 0 ? void 0 : cache.passageSummary) || ''),
                studySynthesis: this.asString((cache === null || cache === void 0 ? void 0 : cache.studySynthesis) || ''),
                structuralAnalysis: (cache === null || cache === void 0 ? void 0 : cache.structuralAnalysis) || null,
                verseCommentary: (cache === null || cache === void 0 ? void 0 : cache.verseCommentary) || null,
            };
            var includeStudyInsights = (options === null || options === void 0 ? void 0 : options.includeStudyInsights) === true;
            return {
                // ============================================
                // OUTLINE IS THE AUTHORITY
                // Each point carries its own assets - no global pools
                // ============================================
                outline: {
                    title: this.asString(outline === null || outline === void 0 ? void 0 : outline.title),
                    introduction: this.asString(outlineStructure === null || outlineStructure === void 0 ? void 0 : outlineStructure.introduction),
                    // pointNodes ARE the source of truth for manuscript generation
                    pointNodes: enrichedPointNodes,
                    conclusion: this.asString(outlineStructure === null || outlineStructure === void 0 ? void 0 : outlineStructure.conclusion),
                    callToAction: this.asString(outlineStructure === null || outlineStructure === void 0 ? void 0 : outlineStructure.callToAction),
                },
                // Passage data
                passage: {
                    main: workspace.mainPassage,
                    additional: workspace.additionalPassages || [],
                },
                // Study intelligence (background context, not primary)
                studyReport: includeStudyInsights
                    ? studyReport
                    : {
                        passageOverview: studyReport.passageOverview,
                        mainTheologicalClaim: studyReport.mainTheologicalClaim,
                    },
                preachingInsights: preachingInsights,
                wordStudies: includeStudyInsights ? wordStudies : [],
                // Global assets (for intro/conclusion only)
                globalCrossReferences: globalCrossReferences,
                globalEgwQuotes: globalEgwQuotes,
                citations: citations,
                // Workspace settings
                settings: {
                    title: workspace.title,
                    seriesTitle: workspace.seriesTitle || '',
                    theme: workspace.theme || '',
                    sermonGoals: workspace.sermonGoals || '',
                    audienceProfile: workspace.audienceProfile || '',
                    storyArc: workspace.storyArc || '',
                    theologicalLens: (0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens),
                    style: workspace.style || '',
                },
            };
        };
        WorkspacesService_1.prototype.buildManuscriptPrompt = function (workspace, outline, options) {
            var _a;
            var isSpanish = workspace.language === 'es';
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            var normalizedOptions = this.normalizeManuscriptOptions(workspace, options);
            var wordTargets = this.manuscriptWordTargets(normalizedOptions);
            var manuscriptContext = this.buildManuscriptContext(workspace, outline, normalizedOptions);
            var contextJson = this.compactJsonForPrompt(manuscriptContext, 24000);
            // Extract point nodes - THE AUTHORITY for manuscript structure
            var pointNodes = ((_a = manuscriptContext === null || manuscriptContext === void 0 ? void 0 : manuscriptContext.outline) === null || _a === void 0 ? void 0 : _a.pointNodes) || [];
            // Build point-by-point instructions showing each point's attached assets
            var pointInstructions = pointNodes.map(function (point, index) {
                var _a, _b, _c, _d, _e;
                var apps = ((_a = point.applications) === null || _a === void 0 ? void 0 : _a.length) ? point.applications.join('; ') : 'none provided';
                var illus = ((_b = point.illustrationIdeas) === null || _b === void 0 ? void 0 : _b.length) ? point.illustrationIdeas.join('; ') : 'none provided';
                var refs = ((_c = point.crossReferences) === null || _c === void 0 ? void 0 : _c.length) ? point.crossReferences.join(', ') : 'none provided';
                var egw = ((_d = point.egwSupport) === null || _d === void 0 ? void 0 : _d.length) ? point.egwSupport.map(function (e) { return e.citation || e.quote; }).join('; ') : 'none provided';
                return "".concat(isSpanish ? 'PUNTO' : 'POINT', " ").concat(index + 1, ": \"").concat(point.title, "\"\n   Summary: ").concat(point.summary || 'Expand from title', "\n   Supporting Verses: ").concat(((_e = point.supportingVerses) === null || _e === void 0 ? void 0 : _e.join(', ')) || 'Use main passage', "\n   Cross-References FOR THIS POINT: ").concat(refs, "\n   Applications FOR THIS POINT: ").concat(apps, "\n   Illustrations FOR THIS POINT: ").concat(illus, "\n   EGW Support FOR THIS POINT: ").concat(egw, "\n   \n   \u2192 Write a SUBSTANTIAL section that:\n     - Explains the biblical truth deeply\n     - Uses the cross-references listed above\n     - Includes the illustration(s) listed above\n     - Ends with the application(s) listed above\n     - Cites EGW if provided above");
            }).join('\n\n');
            return workspaces_prompts_1.WorkspacesPrompts.manuscriptGeneration({
                doctrinalContext: doctrinalContext,
                metadataBlock: "".concat(this.buildWorkspacePlanningSummary(workspace) ? "Planning: ".concat(this.buildWorkspacePlanningSummary(workspace), "\n") : '', "Title: ").concat(workspace.title, "\nSeries: ").concat(workspace.seriesTitle || 'N/A', "\nMain Passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\nSermon Goals: ").concat(workspace.sermonGoals || 'N/A', "\nTone: ").concat(normalizedOptions.tone, "\nTarget Length: ").concat(normalizedOptions.targetMinutes, " minutes (~").concat(Math.round(normalizedOptions.targetMinutes * this.manuscriptWpm), " words)"),
                contextJson: contextJson,
                languageLabel: languageLabel,
                spanishRule: isSpanish ? 'Spanish-only requirement: do not output any section title, sentence, or cue in English.' : '',
                pointInstructions: pointInstructions || 'Use outline.pointNodes from the study data above.',
                mainPassage: workspace.mainPassage,
                pointCount: pointNodes.length,
                targetMinutes: normalizedOptions.targetMinutes,
                wordTarget: wordTargets.targetWords,
                wordMin: wordTargets.minWords,
                wordMax: wordTargets.maxWords,
                includeSlideCuesLine: normalizedOptions.includeSlideCues
                    ? 'Populate cues.slide with presenter prompts.'
                    : 'Leave cues.slide empty.',
                includeKeyLinesLine: normalizedOptions.includeKeyLines
                    ? 'Populate cues.keyLine with memorable statements.'
                    : 'Leave cues.keyLine empty.',
                formatLine: normalizedOptions.format === 'notes'
                    ? 'Use concise preaching-note style.'
                    : 'Use full spoken manuscript style.',
            });
        };
        WorkspacesService_1.prototype.buildManuscriptCueRefreshPrompt = function (workspace, manuscriptHtml) {
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var plainText = this.stripHtmlForWordCount(manuscriptHtml).slice(0, 16000);
            return "Extract preaching cues from this sermon manuscript.\n\nLanguage: ".concat(languageLabel, "\nMain Passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\n\nRules:\n- Return ONLY valid JSON.\n- Use manuscript wording (do not invent unrelated content).\n- Keep each cue concise.\n- Provide 2-8 items per cue type when available.\n- Keep all cue content in ").concat(languageLabel, ".\n\nManuscript Text:\n").concat(plainText, "\n\nOutput shape:\n{\n  \"slide\": [\"string\"],\n  \"keyLine\": [\"string\"],\n  \"transition\": [\"string\"],\n  \"pause\": [\"string\"],\n  \"read\": [\"string\"],\n  \"quote\": [\"string\"],\n  \"cta\": [\"string\"]\n}");
        };
        WorkspacesService_1.prototype.buildApplicationsPrompt = function (workspace, mainPoints, audienceType, seededApplications) {
            if (seededApplications === void 0) { seededApplications = []; }
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            return "".concat(doctrinalContext, "\n\nGenerate practical applications for ").concat(audienceType, " based on:\nMain Passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\nSermon Goals: ").concat(workspace.sermonGoals || 'N/A', "\nMain Points: ").concat(mainPoints.join(', ') || 'N/A', "\n").concat(seededApplications.length ? "Existing study applications to refine: ".concat(seededApplications.join(' | ')) : '', "\n\nWrite in ").concat(languageLabel, ".\n\nProvide 8-12 specific, actionable applications.\n\nRules:\n- Return ONLY a numbered list (1., 2., 3., etc.).\n- Each line must be a single sentence starting with a verb.\n- End each line with a verse reference in the format \"(Verse: Book 1:1)\".\n- No tables, no pipes, no markdown, no headings, no extra commentary.");
        };
        WorkspacesService_1.prototype.resolveApplicationAudienceTypes = function (workspace) {
            var profile = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.audienceProfile) || '').toLowerCase();
            if (!profile) {
                return [
                    sermon_application_entity_1.AudienceType.YOUTH,
                    sermon_application_entity_1.AudienceType.NEW_BELIEVERS,
                    sermon_application_entity_1.AudienceType.LEADERSHIP,
                    sermon_application_entity_1.AudienceType.MIXED_CONGREGATION,
                    sermon_application_entity_1.AudienceType.PASTORAL_CARE,
                    sermon_application_entity_1.AudienceType.SMALL_GROUP,
                ];
            }
            var matches = new Set();
            var hasAny = function (terms) { return terms.some(function (term) { return profile.includes(term); }); };
            if (hasAny(['youth', 'young', 'teen', 'teens', 'student', 'students', 'joven', 'jóven', 'jóvenes', 'juventud'])) {
                matches.add(sermon_application_entity_1.AudienceType.YOUTH);
            }
            if (hasAny(['new believer', 'new believers', 'new convert', 'new converts', 'nuevo creyente', 'nuevos creyentes', 'recien convertido', 'recién convertido'])) {
                matches.add(sermon_application_entity_1.AudienceType.NEW_BELIEVERS);
            }
            if (hasAny(['leader', 'leaders', 'leadership', 'elder', 'elders', 'deacon', 'deacons', 'lider', 'líder', 'líderes', 'liderazgo', 'anciano', 'ancianos', 'diacono', 'diácono'])) {
                matches.add(sermon_application_entity_1.AudienceType.LEADERSHIP);
            }
            if (hasAny(['pastoral care', 'care', 'grief', 'counsel', 'healing', 'broken', 'sick', 'hospital', 'cuidado pastoral', 'duelo', 'consejeria', 'consejería', 'sanidad', 'enfermo', 'enfermos'])) {
                matches.add(sermon_application_entity_1.AudienceType.PASTORAL_CARE);
            }
            if (hasAny(['small group', 'small groups', 'cell group', 'bible class', 'home group', 'grupo pequeno', 'grupo pequeño', 'grupos pequenos', 'grupos pequeños', 'celula', 'célula', 'escuela sabatica', 'escuela sabática'])) {
                matches.add(sermon_application_entity_1.AudienceType.SMALL_GROUP);
            }
            if (hasAny(['mixed', 'general congregation', 'all ages', 'families', 'family', 'congregation', 'multigenerational', 'multi-generational', 'mixto', 'congregacion', 'congregación', 'familias', 'multigeneracional'])) {
                matches.add(sermon_application_entity_1.AudienceType.MIXED_CONGREGATION);
            }
            if (!matches.size) {
                matches.add(sermon_application_entity_1.AudienceType.MIXED_CONGREGATION);
            }
            return Array.from(matches);
        };
        WorkspacesService_1.prototype.buildDiscussionPrompt = function (workspace, seededQuestions) {
            if (seededQuestions === void 0) { seededQuestions = []; }
            var languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            return "".concat(doctrinalContext, "\n\nGenerate discussion questions for a small group study on:\nMain Passage: ").concat(workspace.mainPassage, "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\nSermon Goals: ").concat(workspace.sermonGoals || 'N/A', "\n\nWrite in ").concat(languageLabel, ".\n\nProvide 10-14 thought-provoking questions that encourage deep reflection and application.\n").concat(seededQuestions.length ? "\nUse and sharpen these existing study questions when helpful:\n".concat(seededQuestions.map(function (item, idx) { return "".concat(idx + 1, ". ").concat(item); }).join('\n')) : '', "\n\nRules:\n- Return ONLY a numbered list (1., 2., 3., etc.).\n- End each question with a verse reference in the format \"(Verse: Book 1:1)\".\n- No tables, no pipes, no markdown, no headings, no extra commentary.");
        };
        WorkspacesService_1.prototype.buildDiscussionQuestionFallbacks = function (workspace, seededQuestions) {
            var _this = this;
            if (seededQuestions === void 0) { seededQuestions = []; }
            var passage = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.mainPassage) || '').trim() || 'the selected passage';
            var theme = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.theme) || 'God’s grace and invitation').trim();
            var audience = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.audienceProfile) || 'the congregation').trim();
            var sermonGoals = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.sermonGoals) || 'respond in faith').trim();
            var verseReference = "(Verse: ".concat(passage, ")");
            var baseQuestions = [
                "What does ".concat(passage, " reveal about God\u2019s character, and how should that shape the way ").concat(audience.toLowerCase(), " approaches Him? ").concat(verseReference),
                "How does this passage call us to trust ".concat(theme.toLowerCase(), " more deeply in our daily lives? ").concat(verseReference),
                "What response of faith is being invited in this passage, and how can we practice it this week? ".concat(verseReference),
                "How does the promise in ".concat(passage, " speak to people who feel distant, ashamed, or unworthy? ").concat(verseReference),
                "What does believing in Christ look like in concrete choices, habits, and relationships? ".concat(verseReference),
                "How does this passage help us understand salvation as a gift rather than something earned? ".concat(verseReference),
                "What would it look like for our church to live out the ".concat(sermonGoals.toLowerCase(), " in this passage? ").concat(verseReference),
                "How does this passage challenge us to share hope with others without becoming judgmental or defensive? ".concat(verseReference),
                "Which words or ideas in this passage deserve a closer look during group discussion, and why? ".concat(verseReference),
                "How does this passage reshape our understanding of identity, dignity, and belonging in Christ? ".concat(verseReference),
                "What practical step can you take this week to respond more fully to God\u2019s invitation here? ".concat(verseReference),
                "Where do you most need to receive the good news of this passage personally before you can share it with others? ".concat(verseReference),
            ];
            var combined = Array.from(new Set(__spreadArray(__spreadArray([], this.asStringArray(seededQuestions, 12), true), baseQuestions, true).map(function (item) { return _this.asString(item).trim(); }).filter(Boolean)));
            var normalized = workspace.language === 'es'
                ? combined.map(function (item) { return _this.normalizeSpanishGeneratedText(item); })
                : combined;
            return normalized.slice(0, 12);
        };
        WorkspacesService_1.prototype.buildIllustrationFallbackItems = function (workspace, mainPoints, seededIllustrations) {
            var _this = this;
            if (mainPoints === void 0) { mainPoints = []; }
            if (seededIllustrations === void 0) { seededIllustrations = []; }
            var passage = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.mainPassage) || '').trim() || 'the selected passage';
            var theme = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.theme) || 'God’s grace and invitation').trim();
            var audience = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.audienceProfile) || 'the congregation').trim();
            var points = Array.isArray(mainPoints) ? mainPoints.filter(Boolean) : [];
            var sources = Array.from(new Set(__spreadArray([passage], points, true).filter(Boolean)));
            var ideas = [
                {
                    title: 'Storm and rescue',
                    content: "Picture a person being pulled from rough water at the last moment, mirroring how ".concat(passage, " presents rescue as a gift rather than a reward."),
                },
                {
                    title: 'Open door',
                    content: "An open door with warm light spilling into the room can illustrate how ".concat(theme.toLowerCase(), " invites ").concat(audience.toLowerCase(), " home."),
                },
                {
                    title: 'Wrapped gift',
                    content: "A costly, carefully wrapped gift waiting on a table helps explain that God\u2019s love in ".concat(passage, " is given, not earned."),
                },
                {
                    title: 'Father on the porch',
                    content: "A father waiting on the porch for a returning child can help the congregation feel the welcome embedded in ".concat(passage, "."),
                },
                {
                    title: 'Lighthouse in the storm',
                    content: "A lighthouse cutting through storm-dark waves works well for the way ".concat(passage, " offers direction and hope in chaos."),
                },
                {
                    title: 'Seed and new growth',
                    content: "A seed breaking open into new life can help show how faith receives life and begins a new way of living.",
                },
                {
                    title: 'Courtroom grace',
                    content: "A judge paying the penalty himself can help the audience grasp the costliness of God\u2019s gift in ".concat(passage, "."),
                },
                {
                    title: 'Bridge home',
                    content: "A bridge spanning a gap can illustrate how ".concat(passage, " moves people from distance into relationship with God."),
                },
            ];
            var seedIdeas = Array.from(new Set(seededIllustrations.map(function (item) { return _this.asString(item).trim(); }).filter(Boolean)));
            var built = __spreadArray(__spreadArray([], seedIdeas.map(function (content, index) { return ({
                title: "Illustration ".concat(index + 1),
                content: content,
                source: sources[index % sources.length] || passage,
            }); }), true), ideas.map(function (item, index) { return (__assign(__assign({}, item), { source: sources[index % sources.length] || passage })); }), true);
            return built.slice(0, 8).map(function (item, index) { return (__assign(__assign({}, item), { relatedPoint: points[index % points.length] || null, tags: [theme, passage].filter(Boolean).slice(0, 4) })); });
        };
        WorkspacesService_1.prototype.buildMediaSuggestionsPrompt = function (workspace, passageText, studyInputs, reportSections, existingPrompts) {
            if (existingPrompts === void 0) { existingPrompts = []; }
            var isSpanish = workspace.language === 'es';
            var languageLabel = isSpanish ? 'Spanish' : 'English';
            var typeOptions = isSpanish
                ? 'Imagen · Hero|Imagen · Punto 1|Imagen · Punto 2|Imagen · Punto 3|Imagen · Aplicación|Imagen · Cierre|Video · Intro Loop|Video · Transición|Voz · Reflexión Inicial|Voz · Llamado Final|Música · Tema Principal|Música · Base Instrumental|Social · Instagram Post|Social · Instagram Story|Social · Facebook Post|Social · WhatsApp Status|Social · YouTube Thumbnail|Social · X Post'
                : 'Image · Hero|Image · Point 1|Image · Point 2|Image · Point 3|Image · Application|Image · Closing|Video · Intro Loop|Video · Transition|Voice · Opening Reflection|Voice · Closing Appeal|Music · Theme Song|Music · Instrumental Bed|Social · Instagram Post|Social · Instagram Story|Social · Facebook Post|Social · WhatsApp Status|Social · YouTube Thumbnail|Social · X Post';
            var localeRules = isSpanish
                ? "Regla cr\u00EDtica de idioma:\n- Responde \u00DANICAMENTE en espa\u00F1ol.\n- No uses ingl\u00E9s en \"type\", \"intent\", \"useCase\" ni \"prompt\".\n- Usa terminolog\u00EDa ministerial natural en espa\u00F1ol."
                : "Language rule:\n- Respond ONLY in English.\n- Do not use Spanish in \"type\", \"intent\", \"useCase\", or \"prompt\".";
            var contextJson = this.compactJsonForPrompt({
                workspace: {
                    title: workspace.title,
                    mainPassage: workspace.mainPassage,
                    theme: workspace.theme || '',
                    audienceProfile: workspace.audienceProfile || '',
                    sermonGoals: workspace.sermonGoals || '',
                    language: workspace.language || 'en',
                },
                passageText: passageText,
                reportSections: {
                    passageOverview: this.asString(reportSections === null || reportSections === void 0 ? void 0 : reportSections.passageOverview),
                    exegeticalFlow: Array.isArray(reportSections === null || reportSections === void 0 ? void 0 : reportSections.exegeticalFlow) ? reportSections.exegeticalFlow : [],
                    theologicalThemes: Array.isArray(reportSections === null || reportSections === void 0 ? void 0 : reportSections.theologicalThemes) ? reportSections.theologicalThemes : [],
                    pastoralImplications: (reportSections === null || reportSections === void 0 ? void 0 : reportSections.pastoralImplications) || null,
                    structureOfPassage: Array.isArray(reportSections === null || reportSections === void 0 ? void 0 : reportSections.structureOfPassage)
                        ? reportSections.structureOfPassage
                        : [],
                },
                studyInputs: {
                    cachedStudySections: (studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) || {},
                    referenceData: (studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.referenceData) || {},
                },
                existingPrompts: existingPrompts,
            }, 7000);
            return workspaces_prompts_1.WorkspacesPrompts.mediaSuggestions({
                languageLabel: languageLabel,
                contextJson: contextJson,
                typeOptions: typeOptions,
                localeRules: localeRules,
            });
        };
        WorkspacesService_1.prototype.compactJsonForPrompt = function (value, maxChars) {
            if (maxChars === void 0) { maxChars = 6000; }
            try {
                var text = JSON.stringify(value, null, 2);
                if (text.length <= maxChars)
                    return text;
                return "".concat(text.slice(0, maxChars), "\n...TRUNCATED...");
            }
            catch (_a) {
                return '{}';
            }
        };
        WorkspacesService_1.prototype.extractBookFromReference = function (reference) {
            var _a;
            var match = String(reference || '').trim().match(/^(.*?)\s+\d+/);
            return ((_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.trim()) || String(reference || '').trim();
        };
        WorkspacesService_1.prototype.isSpanishLanguage = function (language) {
            return this.asString(language || '')
                .toLowerCase()
                .startsWith('es');
        };
        WorkspacesService_1.prototype.describeCrossReferenceCategory = function (category, language) {
            if (language === void 0) { language = 'en'; }
            var normalized = this.asString(category).toLowerCase();
            var isSpanish = this.isSpanishLanguage(language);
            if (normalized === 'quotation') {
                return isSpanish
                    ? 'Este pasaje se vincula por cita directa o fuerte coincidencia verbal.'
                    : 'This passage is linked by direct quotation or strong verbal overlap.';
            }
            if (normalized === 'typology') {
                return isSpanish
                    ? 'Este pasaje refleja el mismo patrón o tipo bíblico.'
                    : 'This passage mirrors the same pattern or biblical type.';
            }
            if (normalized === 'prophetic_fulfillment') {
                return isSpanish
                    ? 'Este pasaje desarrolla una conexión de profecía y cumplimiento.'
                    : 'This passage advances a prophecy-to-fulfillment connection.';
            }
            if (normalized === 'narrative_continuation') {
                return isSpanish
                    ? 'Este pasaje continúa la misma línea narrativa o movimiento redentor.'
                    : 'This passage continues the same storyline or redemptive movement.';
            }
            if (normalized === 'interpretive_tension') {
                return isSpanish
                    ? 'Este pasaje agudiza la misma tensión teológica o cuestión interpretativa.'
                    : 'This passage sharpens the same theological tension or interpretive issue.';
            }
            if (normalized === 'lexical') {
                return isSpanish
                    ? 'Este pasaje comparte vocabulario importante o términos clave con el texto principal.'
                    : 'This passage shares important wording or key terms with the main text.';
            }
            if (normalized === 'thematic') {
                return isSpanish
                    ? 'Este pasaje desarrolla el mismo tema teológico desde otro ángulo.'
                    : 'This passage develops the same theological theme from another angle.';
            }
            return isSpanish
                ? 'Este pasaje apoya el mismo tema o movimiento doctrinal del estudio.'
                : 'This passage supports the same theme or doctrinal movement in the study.';
        };
        WorkspacesService_1.prototype.buildStudyReportInputContext = function (workspace, passageText) {
            return __awaiter(this, void 0, void 0, function () {
                var reference, book, cache, egwReference, includeEgw, reportLanguage, additionalPassages, _a, bookMetadata, historicalContext, culturalContext, timeline, crossReferences, crossReferenceDetails, xrefCategoryMap, cachedRankedMap, normalizedCrossReferences, additionalPassageReferences, mergedCrossReferences, egwSection, _b;
                var _this = this;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            reference = workspace.mainPassage;
                            book = this.extractBookFromReference(reference);
                            cache = workspace.scriptureCache || {};
                            egwReference = this.parseReferenceForEgw(reference);
                            includeEgw = Boolean((workspace === null || workspace === void 0 ? void 0 : workspace.egwEnabled) || ((_c = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _c === void 0 ? void 0 : _c.egwEnabled));
                            reportLanguage = this.isSpanishLanguage(workspace.language) ? 'es' : 'en';
                            additionalPassages = this.asStringArray(workspace.additionalPassages, 24).filter(function (item) { return item && item !== reference; });
                            return [4 /*yield*/, Promise.all([
                                    this.scriptureService.getBookMetadata(book).catch(function () { return null; }),
                                    this.scriptureService.getHistoricalContext(book).catch(function () { return null; }),
                                    this.scriptureService.getCulturalContext(book).catch(function () { return null; }),
                                    this.scriptureService.getTimeline(book).catch(function () { return null; }),
                                    this.scriptureService.getCrossReferences(reference).catch(function () { return []; }),
                                    this.scriptureService.getCrossReferenceDetails(reference).catch(function () { return []; }),
                                ])];
                        case 1:
                            _a = _e.sent(), bookMetadata = _a[0], historicalContext = _a[1], culturalContext = _a[2], timeline = _a[3], crossReferences = _a[4], crossReferenceDetails = _a[5];
                            xrefCategoryMap = new Map((Array.isArray(crossReferenceDetails) ? crossReferenceDetails : []).map(function (item) { return [
                                String((item === null || item === void 0 ? void 0 : item.reference) || ''),
                                {
                                    category: String((item === null || item === void 0 ? void 0 : item.category) || ''),
                                    connection: String((item === null || item === void 0 ? void 0 : item.connection) || (item === null || item === void 0 ? void 0 : item.explanation) || (item === null || item === void 0 ? void 0 : item.reason) || ''),
                                },
                            ]; }));
                            cachedRankedMap = new Map((Array.isArray((_d = cache === null || cache === void 0 ? void 0 : cache.crossReferences) === null || _d === void 0 ? void 0 : _d.ranked) ? cache.crossReferences.ranked : []).map(function (item) { return [
                                String((item === null || item === void 0 ? void 0 : item.reference) || ''),
                                {
                                    category: String((item === null || item === void 0 ? void 0 : item.category) || ''),
                                    connection: String((item === null || item === void 0 ? void 0 : item.explanation) || (item === null || item === void 0 ? void 0 : item.connection) || (item === null || item === void 0 ? void 0 : item.reason) || ''),
                                },
                            ]; }));
                            normalizedCrossReferences = (Array.isArray(crossReferences) ? crossReferences : [])
                                .slice(0, 20)
                                .map(function (ref) {
                                var detailed = xrefCategoryMap.get(ref);
                                var cached = cachedRankedMap.get(ref);
                                var category = _this.asString((detailed === null || detailed === void 0 ? void 0 : detailed.category) || (cached === null || cached === void 0 ? void 0 : cached.category) || '');
                                var connection = _this.asString((detailed === null || detailed === void 0 ? void 0 : detailed.connection) || (cached === null || cached === void 0 ? void 0 : cached.connection) || _this.describeCrossReferenceCategory(category, reportLanguage));
                                return {
                                    reference: ref,
                                    category: category,
                                    connection: connection,
                                };
                            });
                            additionalPassageReferences = additionalPassages.map(function (ref) { return ({
                                reference: ref,
                                category: 'thematic',
                                connection: reportLanguage === 'es'
                                    ? "Conecta con ".concat(workspace.mainPassage, " y ampl\u00EDa el tema central del estudio.")
                                    : "Connects with ".concat(workspace.mainPassage, " and expands the study's central theme."),
                            }); });
                            mergedCrossReferences = new Map();
                            __spreadArray(__spreadArray([], additionalPassageReferences, true), normalizedCrossReferences, true).forEach(function (item) {
                                if (!item.reference)
                                    return;
                                if (!mergedCrossReferences.has(item.reference)) {
                                    mergedCrossReferences.set(item.reference, item);
                                }
                            });
                            if (!(includeEgw && egwReference)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.egwStudyReportService
                                    .generateStudyReportSection(egwReference.book, egwReference.chapter, egwReference.verseStart, egwReference.verseEnd, true, reportLanguage)
                                    .catch(function () { return null; })];
                        case 2:
                            _b = _e.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _b = null;
                            _e.label = 4;
                        case 4:
                            egwSection = _b;
                            return [2 /*return*/, {
                                    passage: {
                                        reference: reference,
                                        text: passageText,
                                    },
                                    workspace: {
                                        title: workspace.title,
                                        seriesTitle: workspace.seriesTitle || '',
                                        theme: workspace.theme || '',
                                        audienceProfile: workspace.audienceProfile || '',
                                        sermonGoals: workspace.sermonGoals || '',
                                        style: workspace.style || '',
                                        storyArc: workspace.storyArc || '',
                                        additionalPassages: additionalPassages,
                                        includeEgw: includeEgw,
                                        language: reportLanguage,
                                        theologicalLens: (0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens),
                                    },
                                    cachedStudySections: {
                                        passageSummary: (cache === null || cache === void 0 ? void 0 : cache.passageSummary) || null,
                                        verseContext: (cache === null || cache === void 0 ? void 0 : cache.perVerseContext) || null,
                                        translationComparison: (cache === null || cache === void 0 ? void 0 : cache.translationComparison) || null,
                                        verseCommentary: (cache === null || cache === void 0 ? void 0 : cache.verseCommentary) || null,
                                        structuralAnalysis: (cache === null || cache === void 0 ? void 0 : cache.structuralAnalysis) || null,
                                        interpretiveChallenges: (cache === null || cache === void 0 ? void 0 : cache.interpretiveChallenges) || null,
                                        canonicalThemes: (cache === null || cache === void 0 ? void 0 : cache.canonicalThemes) || null,
                                        studySynthesis: (cache === null || cache === void 0 ? void 0 : cache.studySynthesis) || null,
                                        contextData: (cache === null || cache === void 0 ? void 0 : cache.contextData) || null,
                                        wordStudy: (cache === null || cache === void 0 ? void 0 : cache.wordStudy) || null,
                                        crossReferencesLookup: (cache === null || cache === void 0 ? void 0 : cache.crossReferences) || null,
                                    },
                                    referenceData: {
                                        crossReferences: Array.from(mergedCrossReferences.values()).slice(0, 24),
                                        savedReferences: this.normalizeReferenceEntries(workspace.references || [], 20),
                                        bookMetadata: bookMetadata,
                                        historicalContext: historicalContext,
                                        culturalContext: culturalContext,
                                        timeline: timeline,
                                    },
                                    egwSection: egwSection,
                                }];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.buildStudyReportPrompt = function (workspace, passageText, studyInputs) {
            var _a, _b, _c;
            var isSpanish = this.isSpanishLanguage(workspace.language || ((_a = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.workspace) === null || _a === void 0 ? void 0 : _a.language));
            var languageLabel = isSpanish ? 'Spanish' : 'English';
            var languageInstruction = isSpanish
                ? 'CRITICAL LANGUAGE LOCK: Produce ALL text fields in Spanish only. Do not output English in any generated field.'
                : 'Produce ALL text fields in English only.';
            var doctrinalContext = this.buildWorkspacePromptContext(workspace);
            var inputJson = this.compactJsonForPrompt(studyInputs, 12000);
            return "".concat(doctrinalContext, "\n\nGenerate a structured exegetical study report for:\nMain Passage: ").concat(workspace.mainPassage, "\nPassage Text:\n").concat(passageText, "\n\nWorkspace Metadata (all fields are intentional constraints, do not ignore):\nTitle: ").concat(workspace.title || 'N/A', "\nSeries: ").concat(workspace.seriesTitle || 'N/A', "\nTheme: ").concat(workspace.theme || 'N/A', "\nAudience: ").concat(workspace.audienceProfile || 'N/A', "\nSermon Goals: ").concat(workspace.sermonGoals || 'N/A', "\nStyle: ").concat(workspace.style || 'N/A', "\nStory Arc: ").concat(workspace.storyArc || 'N/A', "\nAdditional Passages: ").concat(((_b = workspace.additionalPassages) === null || _b === void 0 ? void 0 : _b.length) ? workspace.additionalPassages.join(', ') : 'None', "\nInclude EGW: ").concat(((workspace === null || workspace === void 0 ? void 0 : workspace.egwEnabled) || ((_c = workspace === null || workspace === void 0 ? void 0 : workspace.metadata) === null || _c === void 0 ? void 0 : _c.egwEnabled)) ? 'Yes' : 'No', "\nTheological Lens: ").concat((0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens), "\nPlanning: ").concat(this.buildWorkspacePlanningSummary(workspace) || 'N/A', "\n\nStudy Data Inputs (use these as primary evidence; do not ignore them):\n").concat(inputJson, "\n\nWrite in ").concat(languageLabel, ".\n").concat(languageInstruction, "\n\nReturn ONLY valid JSON with this exact shape:\n{\n  \"passageOverview\": \"string\",\n  \"literaryContext\": \"string\",\n  \"exegeticalFlow\": [\"string\"],\n  \"exegeticalSummary\": \"string\",\n  \"structureOfPassage\": [\n    {\n      \"movement\": \"string\",\n      \"verses\": \"string\",\n      \"summary\": \"string\"\n    }\n  ],\n  \"keyTerms\": [\n    {\n      \"term\": \"string\",\n      \"language\": \"Greek|Hebrew|Aramaic\",\n      \"transliteration\": \"string\",\n      \"definition\": \"string\",\n      \"nuance\": \"string\"\n    }\n  ],\n  \"historicalContext\": \"string\",\n  \"canonicalContext\": \"string\",\n  \"crossReferences\": [\n    {\n      \"reference\": \"Book 1:1\",\n      \"connection\": \"why it connects\",\n      \"category\": \"thematic|quotation|typology|prophetic_fulfillment|narrative_continuation|interpretive_tension|lexical\",\n      \"tier\": \"primary|secondary|illustrative\"\n    }\n  ],\n  \"interpretiveChallenges\": [\n    {\n      \"question\": \"string\",\n      \"interpretationOptions\": [\"string\"],\n      \"preachingGuidance\": \"string\"\n    }\n  ],\n  \"theologicalThemes\": [\"string\"],\n  \"mainTheologicalClaim\": \"one-sentence doctrinal claim\",\n  \"pastoralImplications\": {\n    \"personalLife\": [\"string\"],\n    \"churchLife\": [\"string\"],\n    \"mission\": [\"string\"]\n  },\n  \"studyAssets\": {\n    \"movementAssets\": [\n      {\n        \"movement\": \"string\",\n        \"verses\": \"string\",\n        \"summary\": \"string\",\n        \"applications\": [\"string\"],\n        \"discussionQuestions\": [\"string\"],\n        \"illustrationIdeas\": [\"string\"],\n        \"mediaSuggestions\": [\"string\"],\n        \"egwSupport\": [\n          {\n            \"citation\": \"string\",\n            \"quote\": \"string\",\n            \"relevance\": \"string\"\n          }\n        ],\n        \"references\": [\"string\"]\n      }\n    ],\n    \"categoryAssets\": {\n      \"applications\": [\"string\"],\n      \"discussionQuestions\": [\"string\"],\n      \"illustrationIdeas\": [\"string\"],\n      \"mediaSuggestions\": [\"string\"],\n      \"egwSupport\": [\n        {\n          \"citation\": \"string\",\n          \"quote\": \"string\",\n          \"relevance\": \"string\"\n        }\n      ],\n      \"references\": [\n        {\n          \"reference\": \"Book 1:1\",\n          \"context\": \"string\"\n        }\n      ]\n    }\n  }\n}\n\nRules:\n- This is exegetical analysis, not a sermon draft.\n- Keep each section concise, concrete, and passage-grounded.\n- \"mainTheologicalClaim\" must be one sentence and explicit.\n- \"exegeticalFlow\" must describe argument progression (not just outline labels).\n- \"structureOfPassage\" must include visible verse anchoring in \"verses\".\n- \"studyAssets\" must organize sermon material already grounded in the passage for later outline work.\n- Use Additional Passages, saved references, and EGW input when available instead of inventing generic assets.\n- For \"crossReferences\", always explain connection with a concrete reason.\n- For \"interpretiveChallenges\", provide at least 2 interpretationOptions when possible.\n- In \"canonicalContext\", show storyline movement (OT -> Christ/NT -> consummation) when applicable.\n- \"pastoralImplications\" must be categorized by personalLife, churchLife, and mission.\n- Prioritize supplied Study Data Inputs over generic assumptions.\n- If a required field has insufficient evidence, explicitly return \"Insufficient data available\" in that field.\n- No markdown, no prose outside JSON, no code fences.");
        };
        WorkspacesService_1.prototype.asString = function (value) {
            if (typeof value === 'string')
                return value.trim();
            if (value === null || value === undefined)
                return '';
            return String(value).trim();
        };
        WorkspacesService_1.prototype.asNumber = function (value) {
            var parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : undefined;
        };
        WorkspacesService_1.prototype.isPropheticAdventistPassage = function (reference) {
            var normalized = this.asString(reference).toLowerCase();
            if (!normalized)
                return false;
            return (/revelation\s*14(?::\s*6\s*-\s*12)?/.test(normalized) ||
                /revelation\s*(?:12\s*-\s*14|12|13|18)/.test(normalized) ||
                /daniel\s*(?:7|8)/.test(normalized) ||
                /matthew\s*24/.test(normalized) ||
                /exodus\s*20/.test(normalized));
        };
        WorkspacesService_1.prototype.normalizeWorkspacePlanning = function (metadata) {
            var planningSource = metadata && typeof metadata === 'object' && metadata.planning && typeof metadata.planning === 'object'
                ? metadata.planning
                : {};
            var targetLength = this.asNumber(planningSource === null || planningSource === void 0 ? void 0 : planningSource.targetLengthMinutes);
            var profile = {};
            var sermonDate = this.asString(planningSource === null || planningSource === void 0 ? void 0 : planningSource.sermonDate);
            var serviceType = this.asString(planningSource === null || planningSource === void 0 ? void 0 : planningSource.serviceType);
            var appealStyle = this.asString(planningSource === null || planningSource === void 0 ? void 0 : planningSource.appealStyle);
            var ministryMode = this.asString(planningSource === null || planningSource === void 0 ? void 0 : planningSource.ministryMode);
            var bilingualMode = this.asString(planningSource === null || planningSource === void 0 ? void 0 : planningSource.bilingualMode);
            if (sermonDate)
                profile.sermonDate = sermonDate;
            if (Number.isFinite(targetLength || NaN) && (targetLength || 0) > 0)
                profile.targetLengthMinutes = Math.round(targetLength);
            if (serviceType)
                profile.serviceType = serviceType;
            if (appealStyle)
                profile.appealStyle = appealStyle;
            if (ministryMode)
                profile.ministryMode = ministryMode;
            if (bilingualMode)
                profile.bilingualMode = bilingualMode;
            return profile;
        };
        WorkspacesService_1.prototype.buildGuardrailProfile = function (workspace) {
            var metadata = (workspace.metadata || {});
            var planning = this.normalizeWorkspacePlanning(metadata);
            var passage = this.asString(workspace.mainPassage);
            var manualMode = this.asString(metadata.guardrailMode).toLowerCase();
            var isProphetic = this.isPropheticAdventistPassage(passage);
            var explicitlyProphetic = planning.ministryMode === 'prophetic' || manualMode.includes('prophetic');
            var active = isProphetic || explicitlyProphetic;
            if (!active) {
                return { active: false, label: '' };
            }
            var scriptureAnchors = Array.from(new Set(__spreadArray(__spreadArray([], sda_alignment_1.SDAAlignmentService.getPropheticReferences(), true), sda_alignment_1.SDAAlignmentService.getSanctuaryReferences(), true)));
            var focus = [
                'Scripture first',
                'Christ-centered',
                'Adventist-aware',
                'historically responsible',
                'non-sensational',
                'hopeful and pastoral',
                'Distinguish Bible, EGW, generated interpretation, and pastoral inference',
            ];
            return {
                active: true,
                label: 'Prophetic / Adventist Guardrail Mode',
                mode: 'prophetic_adventist',
                reason: isProphetic
                    ? "".concat(passage, " is a prophetic or Adventist-heavy passage that benefits from stronger guardrails.")
                    : 'Prophetic ministry mode was selected in workspace planning.',
                message: 'Scripture first. Christ-centered. Non-sensational. Historically responsible. EGW stays secondary.',
                focus: focus,
                scriptureAnchors: scriptureAnchors,
            };
        };
        WorkspacesService_1.prototype.buildWorkspacePlanningSummary = function (workspace) {
            var planning = this.normalizeWorkspacePlanning(workspace.metadata);
            var items = [
                planning.sermonDate ? "Date: ".concat(planning.sermonDate) : '',
                planning.targetLengthMinutes ? "Length: ".concat(planning.targetLengthMinutes, " min") : '',
                planning.serviceType ? "Service: ".concat(planning.serviceType) : '',
                planning.appealStyle ? "Appeal: ".concat(planning.appealStyle) : '',
                planning.ministryMode ? "Mode: ".concat(planning.ministryMode) : '',
                planning.bilingualMode ? "Language mode: ".concat(planning.bilingualMode) : '',
            ].filter(Boolean);
            return items.join(' • ');
        };
        WorkspacesService_1.prototype.getGuardrailReferenceAllowList = function (workspace) {
            var _this = this;
            var guardrail = this.buildGuardrailProfile(workspace);
            return Array.from(new Set(__spreadArray([
                this.asString(workspace.mainPassage)
            ], (guardrail.scriptureAnchors || []), true).map(function (item) { return _this.asString(item); }).filter(Boolean)));
        };
        WorkspacesService_1.prototype.referenceBaseKey = function (reference) {
            var value = this.asString(reference).toLowerCase();
            var match = value.match(/^([1-3]?\s*[a-záéíóúñ]+)\s+(\d+)/i);
            if (!match) {
                return value.replace(/[^a-z0-9]/g, '');
            }
            return "".concat(match[1].replace(/[^a-z0-9]/g, '')).concat(match[2]);
        };
        WorkspacesService_1.prototype.isAllowedGuardrailReference = function (reference, workspace) {
            var _this = this;
            var candidate = this.asString(reference);
            if (!candidate)
                return false;
            var current = this.referenceBaseKey(candidate);
            var allowList = this.getGuardrailReferenceAllowList(workspace);
            return allowList.some(function (allowed) {
                var allowedKey = _this.referenceBaseKey(allowed);
                return allowedKey && current.startsWith(allowedKey);
            });
        };
        WorkspacesService_1.prototype.sanitizeGuardrailedReferenceList = function (value, workspace, fallbackReference) {
            var _this = this;
            var items = this.asStringArray(value, 12).filter(Boolean);
            var filtered = items.filter(function (item) { return _this.isAllowedGuardrailReference(item, workspace); });
            if (filtered.length) {
                return Array.from(new Set(filtered));
            }
            var fallback = this.asString(fallbackReference || workspace.mainPassage);
            return fallback ? [fallback] : [];
        };
        WorkspacesService_1.prototype.sanitizePropheticOutlineReferences = function (outlineData, workspace) {
            var _this = this;
            if (!outlineData || !this.buildGuardrailProfile(workspace).active) {
                return outlineData;
            }
            var fallbackSeeds = this.buildPropheticGuardrailOutlineSeeds(workspace);
            var safePoints = Array.isArray(outlineData.points)
                ? outlineData.points.map(function (point, index) {
                    var cleaned = _this.asString(point).replace(/\bjson\b[:\s-]*/gi, '').trim();
                    if (cleaned && cleaned.toLowerCase() !== 'json') {
                        return cleaned;
                    }
                    return fallbackSeeds[index] || fallbackSeeds[fallbackSeeds.length - 1] || _this.asString(workspace.mainPassage);
                })
                : outlineData.points;
            var safePointNodes = Array.isArray(outlineData.pointNodes)
                ? outlineData.pointNodes.map(function (node, index) { return (__assign(__assign({}, node), { title: _this.asString((node === null || node === void 0 ? void 0 : node.title) || (node === null || node === void 0 ? void 0 : node.slideTitle) || '').replace(/\bjson\b[:\s-]*/gi, '').trim() ||
                        (safePoints === null || safePoints === void 0 ? void 0 : safePoints[index]) ||
                        _this.asString((node === null || node === void 0 ? void 0 : node.title) || (node === null || node === void 0 ? void 0 : node.slideTitle) || workspace.mainPassage), supportingVerses: _this.sanitizeGuardrailedReferenceList((node === null || node === void 0 ? void 0 : node.supportingVerses) || (node === null || node === void 0 ? void 0 : node.verses), workspace), crossReferences: _this.sanitizeGuardrailedReferenceList((node === null || node === void 0 ? void 0 : node.crossReferences) || (node === null || node === void 0 ? void 0 : node.references), workspace), egwSupport: Array.isArray(node === null || node === void 0 ? void 0 : node.egwSupport)
                        ? node.egwSupport.map(function (support) { return (__assign(__assign({}, support), { reference: _this.isAllowedGuardrailReference(support === null || support === void 0 ? void 0 : support.reference, workspace)
                                ? _this.asString(support === null || support === void 0 ? void 0 : support.reference)
                                : _this.asString(workspace.mainPassage) })); })
                        : node === null || node === void 0 ? void 0 : node.egwSupport })); })
                : [];
            return __assign(__assign({}, outlineData), { pointNodes: safePointNodes, points: safePoints });
        };
        WorkspacesService_1.prototype.buildPropheticGuardrailOutlineSeeds = function (workspace) {
            var passage = this.asString(workspace.mainPassage).toLowerCase();
            if (passage.includes('revelation 14')) {
                return [
                    'The everlasting gospel calls every person to fear God, give glory to Him, and worship the Creator.',
                    'The second angel announces that Babylon is fallen.',
                    'The saints endure by keeping God\'s commandments and holding the faith of Jesus.',
                ];
            }
            if (passage.includes('daniel 7')) {
                return [
                    'The Ancient of Days rules with authority over every earthly kingdom.',
                    'The Son of Man receives the kingdom that will never pass away.',
                    'God\'s people are called to endurance and hope because His kingdom will stand.',
                ];
            }
            if (passage.includes('daniel 8')) {
                return [
                    'The vision reveals a conflict over truth, worship, and holiness.',
                    'God\'s sanctuary and timing remain central to understanding the message.',
                    'Faithfulness waits on God with hope rather than speculation.',
                ];
            }
            if (passage.includes('revelation 12')) {
                return [
                    'Christ defeats the dragon and preserves His people through conflict.',
                    'The church overcomes by the blood of the Lamb and faithful testimony.',
                    'Hope remains because God protects His remnant in the final struggle.',
                ];
            }
            if (passage.includes('revelation 18')) {
                return [
                    'God exposes Babylon\'s collapse and calls His people to come out.',
                    'True worship and loyalty belong to Christ, not to corrupt systems.',
                    'The gospel invitation remains open even in the warning.',
                ];
            }
            if (passage.includes('matthew 24')) {
                return [
                    'Jesus warns His disciples not to be deceived.',
                    'Watchfulness and endurance matter as the church waits on Christ.',
                    'Hope rests in the coming Son of Man rather than in fear.',
                ];
            }
            if (passage.includes('exodus 20')) {
                return [
                    'God speaks covenant truth rooted in His character and grace.',
                    'The Sabbath command calls His people to remember the Creator and Redeemer.',
                    'Obedience becomes a covenant response to the God who saves.',
                ];
            }
            return [
                "".concat(this.asString(workspace.mainPassage), " centers on Christ and faithful response."),
                'The passage exposes the tension between truth and compromise.',
                'God calls His people to hopeful, Scripture-shaped obedience.',
            ];
        };
        WorkspacesService_1.prototype.buildCitationFallbackItems = function (workspace) {
            var _this = this;
            var _a, _b, _c;
            var selectedOutline = ((_a = workspace.outlines) === null || _a === void 0 ? void 0 : _a.find(function (item) { return item.isSelected; })) || ((_b = workspace.outlines) === null || _b === void 0 ? void 0 : _b[0]) || null;
            var pointNodes = Array.isArray((_c = selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.structure) === null || _c === void 0 ? void 0 : _c.pointNodes)
                ? selectedOutline.structure.pointNodes
                : [];
            var fallbackReferences = [workspace.mainPassage].filter(Boolean);
            var items = pointNodes
                .slice(0, 4)
                .map(function (point, index) {
                var references = _this.asStringArray((point === null || point === void 0 ? void 0 : point.supportingVerses) || [], 4);
                return {
                    statementType: index === 0 ? sermon_citation_entity_1.StatementType.OBSERVATION : sermon_citation_entity_1.StatementType.INTERPRETATION,
                    statement: _this.asString((point === null || point === void 0 ? void 0 : point.summary) || (point === null || point === void 0 ? void 0 : point.title) || workspace.mainPassage || ''),
                    verseReferences: references.length ? references : fallbackReferences,
                    externalSources: _this.asStringArray(Array.isArray(point === null || point === void 0 ? void 0 : point.egwSupport)
                        ? point.egwSupport.map(function (support) { return support === null || support === void 0 ? void 0 : support.citation; }).filter(Boolean)
                        : [], 4),
                };
            })
                .filter(function (item) { return item.statement && Array.isArray(item.verseReferences) && item.verseReferences.length; });
            if (items.length) {
                return items;
            }
            return [
                {
                    statementType: sermon_citation_entity_1.StatementType.OBSERVATION,
                    statement: this.asString(workspace.mainPassage || 'Scripture-based claim'),
                    verseReferences: fallbackReferences,
                    externalSources: [],
                },
            ];
        };
        WorkspacesService_1.prototype.buildWorkspacePromptContext = function (workspace) {
            var theologicalLens = (0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens);
            var doctrinalContext = sda_alignment_1.SDAAlignmentService.getLensContext(theologicalLens);
            var guardrail = this.buildGuardrailProfile(workspace);
            var planning = this.normalizeWorkspacePlanning(workspace.metadata);
            var blocks = [doctrinalContext.trim()];
            if (guardrail.active) {
                blocks.push([
                    'Prophetic / Adventist Guardrail Mode:',
                    "- Passage: ".concat(this.asString(workspace.mainPassage)),
                    "- Guardrails: ".concat(guardrail.message),
                    "- Why: ".concat(guardrail.reason),
                    '- Keep Scripture primary and Christ central.',
                    '- Avoid fear-based, alarmist, or speculative claims.',
                    '- Keep historical grounding explicit and distinguish it from inference.',
                    '- Use EGW only as secondary support, never as a replacement for Scripture.',
                    '- For citations and supporting verses, prefer the current passage and the listed anchors below. Do not invent unrelated proof texts.',
                    '- If you mention another Bible passage, label it clearly as a supporting cross-reference or Adventist theological connection.',
                    "- Helpful anchors: ".concat((guardrail.scriptureAnchors || []).slice(0, 8).join(', ')),
                ].join('\n'));
            }
            if (Object.keys(planning).length > 0) {
                blocks.push([
                    'Pastor planning context:',
                    planning.sermonDate ? "- Sermon date: ".concat(planning.sermonDate) : '',
                    planning.targetLengthMinutes ? "- Target length: ".concat(planning.targetLengthMinutes, " minutes") : '',
                    planning.serviceType ? "- Service type: ".concat(planning.serviceType) : '',
                    planning.appealStyle ? "- Appeal style: ".concat(planning.appealStyle) : '',
                    planning.ministryMode ? "- Ministry mode: ".concat(planning.ministryMode) : '',
                    planning.bilingualMode ? "- Bilingual mode: ".concat(planning.bilingualMode) : '',
                ].filter(Boolean).join('\n'));
            }
            return blocks.filter(Boolean).join('\n\n');
        };
        WorkspacesService_1.prototype.buildGuardrailPromptBlock = function (workspace) {
            var guardrail = this.buildGuardrailProfile(workspace);
            if (!guardrail.active) {
                return '';
            }
            return [
                "Prophetic / Adventist Guardrail Mode: ".concat(guardrail.label),
                "- Passage: ".concat(this.asString(workspace.mainPassage)),
                "- Why: ".concat(guardrail.reason),
                "- Use Scripture first and keep Christ central.",
                "- Keep the tone hopeful, pastoral, and historically responsible.",
                "- Avoid fear-based or sensational claims.",
                "- Distinguish Bible text, EGW support, generated interpretation, and pastoral inference.",
                "- For supporting verses, prefer the main passage and guardrail anchors; do not invent unrelated proof texts.",
                "- Useful anchors: ".concat((guardrail.scriptureAnchors || []).slice(0, 8).join(', ')),
            ].join('\n');
        };
        WorkspacesService_1.prototype.buildWorkspaceMetadataPayload = function (input) {
            var sourceMetadata = input.metadata && typeof input.metadata === 'object' ? __assign({}, input.metadata) : {};
            var planning = this.normalizeWorkspacePlanning(sourceMetadata);
            var guardrail = this.buildGuardrailProfile({
                mainPassage: this.asString(input.mainPassage || ''),
                language: this.asString(input.language || 'en') || 'en',
                theologicalLens: this.asString(input.theologicalLens || 'adventist'),
                metadata: sourceMetadata,
            });
            var normalizedPlanning = {};
            if (planning.sermonDate)
                normalizedPlanning.sermonDate = planning.sermonDate;
            if (planning.targetLengthMinutes)
                normalizedPlanning.targetLengthMinutes = planning.targetLengthMinutes;
            if (planning.serviceType)
                normalizedPlanning.serviceType = planning.serviceType;
            if (planning.appealStyle)
                normalizedPlanning.appealStyle = planning.appealStyle;
            if (planning.ministryMode)
                normalizedPlanning.ministryMode = planning.ministryMode;
            if (planning.bilingualMode)
                normalizedPlanning.bilingualMode = planning.bilingualMode;
            return __assign(__assign({}, sourceMetadata), { planning: normalizedPlanning, guardrailMode: guardrail.active ? guardrail.mode || sourceMetadata.guardrailMode : sourceMetadata.guardrailMode, guardrail: guardrail, guardrailDetected: guardrail.active });
        };
        WorkspacesService_1.prototype.buildSermonCoreFallback = function (workspace, studyReport) {
            var guardrail = this.buildGuardrailProfile(workspace);
            var languageIsSpanish = workspace.language === 'es';
            var mainClaim = this.asString((studyReport === null || studyReport === void 0 ? void 0 : studyReport.mainTheologicalClaim) || (studyReport === null || studyReport === void 0 ? void 0 : studyReport.exegeticalSummary) || workspace.theme || '');
            if (guardrail.active) {
                return languageIsSpanish
                    ? {
                        bigIdea: 'El evangelio eterno llama a adorar al Creador, confiar en Cristo y permanecer fieles en el conflicto final.',
                        fallenCondition: 'El corazón humano se inclina a la confusión, el compromiso y el miedo cuando oye el llamado profético de Dios.',
                        centralTruth: 'Cristo y su evangelio eterno sostienen el mensaje de Apocalipsis 14 y llaman a una adoración leal y esperanzada.',
                        sermonGoal: 'Invitar a la congregación a responder con fe, obediencia fiel y esperanza en Jesús.',
                        audienceNeed: 'La congregación necesita un mensaje adventista claro, centrado en Cristo, pastoral y sin sensacionalismo.',
                    }
                    : {
                        bigIdea: 'The everlasting gospel calls people to worship the Creator, trust Christ, and remain faithful in the final conflict.',
                        fallenCondition: 'The human heart drifts toward compromise, fear, and counterfeit worship when confronted with prophetic warning.',
                        centralTruth: 'Christ and His everlasting gospel anchor Revelation 14 in hope, worship, and faithful endurance.',
                        sermonGoal: 'Call the congregation to respond with faith, faithful obedience, and confident witness in Jesus.',
                        audienceNeed: 'The congregation needs a clear Adventist message that is Christ-centered, pastoral, historically grounded, and free from sensationalism.',
                    };
            }
            return languageIsSpanish
                ? {
                    bigIdea: mainClaim || 'Dios nos llama a una fe viva que produce esperanza y obediencia.',
                    fallenCondition: 'La humanidad necesita la gracia de Dios porque el pecado distorsiona nuestra visión y nuestra respuesta.',
                    centralTruth: 'En Cristo, la verdad bíblica conduce a vida nueva, esperanza y fidelidad.',
                    sermonGoal: 'Responder con fe y obediencia a la verdad de Dios.',
                    audienceNeed: 'La congregación necesita seguridad, dirección y una respuesta práctica al evangelio.',
                }
                : {
                    bigIdea: mainClaim || 'God calls us to a living faith that produces hope and obedience.',
                    fallenCondition: 'Humanity needs God’s grace because sin distorts our vision and our response.',
                    centralTruth: 'In Christ, biblical truth leads to new life, hope, and faithfulness.',
                    sermonGoal: 'Respond with faith and obedience to God’s truth.',
                    audienceNeed: 'The congregation needs assurance, direction, and a practical response to the gospel.',
                };
        };
        WorkspacesService_1.prototype.buildStudyReportFallbackSections = function (workspace) {
            var isSpanish = workspace.language === 'es';
            var guardrail = this.buildGuardrailProfile(workspace);
            var mainPassage = this.asString(workspace.mainPassage || '');
            var theme = this.asString(workspace.theme || '');
            var claimFallback = guardrail.active
                ? (isSpanish
                    ? 'El evangelio eterno llama a adorar al Creador, confiar en Cristo y permanecer fieles en el conflicto final.'
                    : 'The everlasting gospel calls people to worship the Creator, trust Christ, and remain faithful in the final conflict.')
                : (theme || (isSpanish
                    ? 'Dios nos salva por gracia y nos llama a vivir en obediencia.'
                    : 'God saves us by grace and calls us to live in obedience.'));
            if (guardrail.active) {
                return {
                    passageOverview: isSpanish
                        ? "Apocalipsis 14:6-12 presenta el evangelio eterno, el llamado a adorar al Creador y el contraste entre la lealtad a Cristo y la adoraci\u00F3n falsa."
                        : "Revelation 14:6-12 presents the everlasting gospel, the call to worship the Creator, and the contrast between loyalty to Christ and false worship.",
                    literaryContext: isSpanish
                        ? 'Visión apocalíptica con lenguaje simbólico, llamada profética y énfasis pastoral para un pueblo que necesita perseverar.'
                        : 'An apocalyptic vision with symbolic language, prophetic summons, and pastoral urgency for a people who must persevere.',
                    historicalContext: isSpanish
                        ? 'El mensaje surge en un contexto de conflicto de lealtad, presión religiosa y necesidad de testimonio fiel.'
                        : 'The message arises in a context of loyalty conflict, religious pressure, and the need for faithful witness.',
                    canonicalContext: isSpanish
                        ? 'El pasaje conecta con la adoración del Creador, el sello de obediencia, el juicio de Dios y la victoria final de Cristo.'
                        : 'The passage connects with Creator worship, the seal of obedience, divine judgment, and Christ’s final victory.',
                    exegeticalSummary: isSpanish
                        ? 'Juan presenta un triple llamado que exalta el evangelio, advierte contra Babilonia y llama a la perseverancia de los santos.'
                        : 'John presents a threefold call that exalts the gospel, warns against Babylon, and calls the saints to persevering faithfulness.',
                    mainTheologicalClaim: claimFallback,
                    preachingFocus: claimFallback,
                    exegeticalFlow: isSpanish
                        ? ['El evangelio eterno se proclama a toda nación.', 'La adoración al Creador se contrasta con la adoración falsa.', 'Los santos perseveran guardando los mandamientos de Dios y la fe de Jesús.']
                        : ['The everlasting gospel is proclaimed to every nation.', 'Worship of the Creator is contrasted with false worship.', 'The saints persevere by keeping the commandments of God and the faith of Jesus.'],
                    structureOfPassage: isSpanish
                        ? [
                            { movement: 'Proclamación del evangelio eterno', verses: "".concat(mainPassage), summary: 'El mensaje comienza con buenas noticias para toda la humanidad.' },
                            { movement: 'Llamado a adorar al Creador', verses: "".concat(mainPassage), summary: 'La adoración verdadera se centra en Dios, no en el poder humano.' },
                            { movement: 'Advertencia y perseverancia', verses: "".concat(mainPassage), summary: 'La fidelidad se mantiene en medio de la presión y el engaño.' },
                        ]
                        : [
                            { movement: 'Proclamation of the everlasting gospel', verses: "".concat(mainPassage), summary: 'The message begins with good news for all humanity.' },
                            { movement: 'Call to worship the Creator', verses: "".concat(mainPassage), summary: 'True worship centers on God, not human power.' },
                            { movement: 'Warning and perseverance', verses: "".concat(mainPassage), summary: 'Faithfulness remains under pressure and deception.' },
                        ],
                    keyTerms: isSpanish
                        ? [
                            { term: 'evangelio eterno', language: 'griego', transliteration: 'euangelion aiōnion', definition: 'buenas noticias permanentes de Dios', nuance: 'centro del mensaje' },
                            { term: 'adorar', language: 'griego', transliteration: 'proskuneō', definition: 'rendir honra y lealtad', nuance: 'tema de conflicto' },
                            { term: 'fe de Jesús', language: 'griego', transliteration: 'pistis Iēsou', definition: 'confianza y fidelidad a Cristo', nuance: 'perseverancia de los santos' },
                        ]
                        : [
                            { term: 'everlasting gospel', language: 'greek', transliteration: 'euangelion aiōnion', definition: 'God’s enduring good news', nuance: 'center of the message' },
                            { term: 'worship', language: 'greek', transliteration: 'proskuneō', definition: 'to render honor and allegiance', nuance: 'conflict theme' },
                            { term: 'faith of Jesus', language: 'greek', transliteration: 'pistis Iēsou', definition: 'trust and fidelity to Christ', nuance: 'saints’ perseverance' },
                        ],
                    theologicalThemes: isSpanish
                        ? ['Evangelio eterno', 'Adoración al Creador', 'Juicio y gracia', 'Fidelidad y perseverancia', 'Cristo en el centro']
                        : ['Everlasting gospel', 'Creator worship', 'Judgment and grace', 'Faithful perseverance', 'Christ at the center'],
                    interpretiveChallenges: isSpanish
                        ? [
                            {
                                question: '¿Cómo predicar el juicio sin caer en miedo o sensacionalismo?',
                                interpretationOptions: ['Presentarlo como una obra justa y esperanzadora de Dios.', 'Conectarlo con la victoria de Cristo y la adoración verdadera.'],
                                preachingGuidance: 'Mantener el tono pastoral, mostrar a Cristo como el centro y evitar especulación cronológica.',
                            },
                        ]
                        : [
                            {
                                question: 'How should judgment be preached without fear or sensationalism?',
                                interpretationOptions: ['Present it as God’s just and hopeful work.', 'Connect it to Christ’s victory and true worship.'],
                                preachingGuidance: 'Keep the tone pastoral, show Christ at the center, and avoid speculative timelines.',
                            },
                        ],
                };
            }
            var genericFallback = {
                passageOverview: isSpanish
                    ? "El pasaje ".concat(mainPassage, " muestra el paso de muerte espiritual a vida en Cristo por la gracia de Dios.")
                    : "The passage ".concat(mainPassage, " shows the transition from spiritual death to life in Christ by God\u2019s grace."),
                literaryContext: isSpanish
                    ? 'Unidad epistolar de Pablo: argumento doctrinal seguido de exhortación práctica para la iglesia.'
                    : 'Pauline epistolary unit: doctrinal argument followed by practical exhortation for the church.',
                historicalContext: isSpanish
                    ? 'La audiencia original vivía en un contexto urbano plural, con tensiones religiosas y morales que hacen urgente el llamado a una nueva vida.'
                    : 'The original audience lived in a plural urban context with religious and moral tensions that made the call to new life urgent.',
                canonicalContext: isSpanish
                    ? 'El tema se conecta con la narrativa bíblica de caída, redención en Cristo y restauración del pueblo de Dios.'
                    : 'This theme connects to the biblical storyline of fall, redemption in Christ, and restoration of God’s people.',
                exegeticalSummary: isSpanish
                    ? 'Pablo contrasta la antigua condición de pecado con la nueva identidad en Cristo, enfatizando que la salvación es por gracia y produce buenas obras.'
                    : 'Paul contrasts the former condition of sin with the new identity in Christ, emphasizing salvation by grace that produces good works.',
                mainTheologicalClaim: claimFallback,
                exegeticalFlow: isSpanish
                    ? ['Condición previa: muerte espiritual.', 'Intervención divina: gracia y vida en Cristo.', 'Respuesta visible: obediencia y buenas obras.']
                    : ['Former condition: spiritual death.', 'Divine intervention: grace and life in Christ.', 'Visible response: obedience and good works.'],
                structureOfPassage: isSpanish
                    ? [
                        { movement: 'Condición humana sin Cristo', verses: "".concat(mainPassage, " (secci\u00F3n inicial)"), summary: 'Diagnóstico de muerte espiritual y esclavitud al pecado.' },
                        { movement: 'Intervención de la gracia', verses: "".concat(mainPassage, " (secci\u00F3n central)"), summary: 'Dios da vida con Cristo por pura gracia.' },
                        { movement: 'Nueva vida y misión', verses: "".concat(mainPassage, " (secci\u00F3n final)"), summary: 'El creyente vive para obras preparadas por Dios.' },
                    ]
                    : [
                        { movement: 'Human condition apart from Christ', verses: "".concat(mainPassage, " (opening section)"), summary: 'Diagnosis of spiritual death and bondage to sin.' },
                        { movement: 'Intervention of grace', verses: "".concat(mainPassage, " (middle section)"), summary: 'God gives life with Christ by pure grace.' },
                        { movement: 'New life and mission', verses: "".concat(mainPassage, " (final section)"), summary: 'Believers live for works prepared by God.' },
                    ],
                keyTerms: isSpanish
                    ? [
                        { term: 'gracia', language: 'griego', transliteration: 'charis', definition: 'favor inmerecido de Dios', nuance: 'base de la salvación' },
                        { term: 'fe', language: 'griego', transliteration: 'pistis', definition: 'confianza en Dios', nuance: 'respuesta del creyente' },
                        { term: 'obras', language: 'griego', transliteration: 'erga', definition: 'acciones concretas', nuance: 'fruto de la nueva vida' },
                    ]
                    : [
                        { term: 'grace', language: 'greek', transliteration: 'charis', definition: 'undeserved favor of God', nuance: 'basis of salvation' },
                        { term: 'faith', language: 'greek', transliteration: 'pistis', definition: 'trust in God', nuance: 'believer response' },
                        { term: 'works', language: 'greek', transliteration: 'erga', definition: 'concrete actions', nuance: 'fruit of new life' },
                    ],
                theologicalThemes: isSpanish
                    ? ['Gracia salvadora', 'Nueva creación en Cristo', 'Obediencia como fruto', 'Unidad del pueblo de Dios']
                    : ['Saving grace', 'New creation in Christ', 'Obedience as fruit', 'Unity of God’s people'],
                preachingFocus: claimFallback,
                interpretiveChallenges: isSpanish
                    ? [
                        {
                            question: '¿Cómo se relacionan gracia y buenas obras sin contradicción?',
                            interpretationOptions: ['Las obras no causan la salvación.', 'Las obras confirman una fe viva.'],
                            preachingGuidance: 'Presentar la obediencia como fruto del nuevo nacimiento, no como mérito.',
                        },
                    ]
                    : [
                        {
                            question: 'How do grace and good works relate without contradiction?',
                            interpretationOptions: ['Works do not cause salvation.', 'Works confirm living faith.'],
                            preachingGuidance: 'Present obedience as fruit of new birth, not human merit.',
                        },
                    ],
            };
            return genericFallback;
        };
        WorkspacesService_1.prototype.asStringArray = function (value, limit) {
            var _this = this;
            if (limit === void 0) { limit = 12; }
            if (Array.isArray(value)) {
                return value.map(function (item) { return _this.asString(item); }).filter(Boolean).slice(0, limit);
            }
            if (typeof value === 'string') {
                return this.parseListFromResponse(value).slice(0, limit);
            }
            return [];
        };
        WorkspacesService_1.prototype.sanitizeAdventistWorshipLanguage = function (text, language) {
            var transformed = sda_alignment_1.SDAAlignmentService.transformContent(String(text || ''));
            var isSpanish = String(language || '').toLowerCase().startsWith('es');
            if (isSpanish) {
                transformed = transformed
                    .replace(/\best[ea]\s+domingo\b/gi, 'este sábado')
                    .replace(/\bel\s+domingo\b/gi, 'el sábado')
                    .replace(/\bde\s+domingo\b/gi, 'de sábado')
                    .replace(/\bculto\s+dominical\b/gi, 'culto de sábado')
                    .replace(/\bdominical\b/gi, 'de sábado')
                    .replace(/\bdomingo\b/gi, 'sábado');
                return transformed;
            }
            transformed = transformed
                .replace(/\bthis\s+Sunday\b/gi, 'this Sabbath')
                .replace(/\bon\s+Sunday\b/gi, 'on Sabbath')
                .replace(/\bSunday\b/gi, 'Sabbath');
            return transformed;
        };
        WorkspacesService_1.prototype.sanitizeOutputForLens = function (value, workspace) {
            var _this = this;
            var lens = (0, theological_lens_util_1.normalizeTheologicalLens)(workspace === null || workspace === void 0 ? void 0 : workspace.theologicalLens);
            if (lens !== 'adventist' || value === null || value === undefined) {
                return value;
            }
            var language = this.asString((workspace === null || workspace === void 0 ? void 0 : workspace.language) || 'en');
            var sanitizeRecursive = function (input) {
                if (typeof input === 'string') {
                    return _this.sanitizeAdventistWorshipLanguage(input, language);
                }
                if (Array.isArray(input)) {
                    return input.map(function (item) { return sanitizeRecursive(item); });
                }
                if (input && typeof input === 'object') {
                    var next = {};
                    for (var _i = 0, _a = Object.entries(input); _i < _a.length; _i++) {
                        var _b = _a[_i], key = _b[0], val = _b[1];
                        next[key] = sanitizeRecursive(val);
                    }
                    return next;
                }
                return input;
            };
            return sanitizeRecursive(value);
        };
        WorkspacesService_1.prototype.normalizeReferenceEntries = function (value, limit) {
            var _this = this;
            if (limit === void 0) { limit = 12; }
            if (!Array.isArray(value))
                return [];
            return value
                .map(function (item) {
                if (typeof item === 'string') {
                    return { reference: _this.asString(item), context: '', addedAt: '' };
                }
                return {
                    reference: _this.asString((item === null || item === void 0 ? void 0 : item.reference) || (item === null || item === void 0 ? void 0 : item.label) || (item === null || item === void 0 ? void 0 : item.id)),
                    context: _this.asString((item === null || item === void 0 ? void 0 : item.context) || (item === null || item === void 0 ? void 0 : item.connection) || (item === null || item === void 0 ? void 0 : item.relevance)),
                    addedAt: _this.asString((item === null || item === void 0 ? void 0 : item.addedAt) || ''),
                };
            })
                .filter(function (item) { return item.reference; })
                .slice(0, limit);
        };
        WorkspacesService_1.prototype.buildStudyReportBaseSections = function (studyInputs, language) {
            var _this = this;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            if (language === void 0) { language = 'en'; }
            var summary = ((_a = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _a === void 0 ? void 0 : _a.passageSummary) || {};
            var verseContext = ((_b = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _b === void 0 ? void 0 : _b.verseContext) || {};
            var structural = ((_c = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _c === void 0 ? void 0 : _c.structuralAnalysis) || {};
            var challenges = ((_d = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _d === void 0 ? void 0 : _d.interpretiveChallenges) || {};
            var canonical = ((_e = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _e === void 0 ? void 0 : _e.canonicalThemes) || {};
            var synthesis = ((_f = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _f === void 0 ? void 0 : _f.studySynthesis) || {};
            var wordStudy = ((_g = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _g === void 0 ? void 0 : _g.wordStudy) || {};
            var referenceData = (studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.referenceData) || {};
            var preachingFocus = this.asString(((_h = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.workspace) === null || _h === void 0 ? void 0 : _h.sermonGoals) ||
                ((_j = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.workspace) === null || _j === void 0 ? void 0 : _j.theme) ||
                (summary === null || summary === void 0 ? void 0 : summary.applicationFocus) ||
                (synthesis === null || synthesis === void 0 ? void 0 : synthesis.summary) ||
                '');
            var historicalNotes = Array.isArray(verseContext === null || verseContext === void 0 ? void 0 : verseContext.historical)
                ? verseContext.historical.map(function (item) { return _this.asString(item === null || item === void 0 ? void 0 : item.note); }).filter(Boolean)
                : [];
            var culturalNotes = Array.isArray(verseContext === null || verseContext === void 0 ? void 0 : verseContext.cultural)
                ? verseContext.cultural.map(function (item) { return _this.asString(item === null || item === void 0 ? void 0 : item.note); }).filter(Boolean)
                : [];
            var crossReferences = Array.isArray(referenceData === null || referenceData === void 0 ? void 0 : referenceData.crossReferences)
                ? referenceData.crossReferences.slice(0, 8).map(function (item) { return ({
                    reference: _this.asString(item === null || item === void 0 ? void 0 : item.reference),
                    connection: _this.asString((item === null || item === void 0 ? void 0 : item.connection) || _this.describeCrossReferenceCategory(item === null || item === void 0 ? void 0 : item.category, language)),
                    category: _this.asString((item === null || item === void 0 ? void 0 : item.category) || 'thematic'),
                    tier: 'secondary',
                }); })
                : [];
            var interpretiveChallenges = (challenges === null || challenges === void 0 ? void 0 : challenges.challenge)
                ? [
                    {
                        question: this.asString(challenges.challenge),
                        interpretationOptions: Array.isArray(challenges === null || challenges === void 0 ? void 0 : challenges.views)
                            ? challenges.views.map(function (item) { return _this.asString((item === null || item === void 0 ? void 0 : item.summary) || (item === null || item === void 0 ? void 0 : item.viewName)); }).filter(Boolean).slice(0, 4)
                            : [],
                        preachingGuidance: this.asString(((_k = challenges === null || challenges === void 0 ? void 0 : challenges.sdaPerspective) === null || _k === void 0 ? void 0 : _k.reasoning) || ''),
                    },
                ]
                : [];
            var canonicalThemes = Array.isArray(canonical === null || canonical === void 0 ? void 0 : canonical.themes)
                ? canonical.themes.map(function (item) { return _this.asString(item === null || item === void 0 ? void 0 : item.theme); }).filter(Boolean).slice(0, 8)
                : [];
            var keyTerms = Array.isArray(wordStudy === null || wordStudy === void 0 ? void 0 : wordStudy.insights)
                ? wordStudy.insights.slice(0, 6).map(function (item) { return ({
                    term: _this.asString((item === null || item === void 0 ? void 0 : item.term) || (item === null || item === void 0 ? void 0 : item.word)),
                    language: _this.asString((item === null || item === void 0 ? void 0 : item.language) || ''),
                    transliteration: _this.asString((item === null || item === void 0 ? void 0 : item.transliteration) || ''),
                    definition: _this.asString((item === null || item === void 0 ? void 0 : item.definition) || (item === null || item === void 0 ? void 0 : item.gloss) || ''),
                    nuance: _this.asString((item === null || item === void 0 ? void 0 : item.nuance) || (item === null || item === void 0 ? void 0 : item.summary) || ''),
                }); })
                : [];
            var allImplications = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], this.asStringArray((synthesis === null || synthesis === void 0 ? void 0 : synthesis.personalApplication) || [], 4), true), this.asStringArray((synthesis === null || synthesis === void 0 ? void 0 : synthesis.churchApplication) || [], 4), true), this.asStringArray((synthesis === null || synthesis === void 0 ? void 0 : synthesis.missionApplication) || [], 4), true), this.asStringArray((synthesis === null || synthesis === void 0 ? void 0 : synthesis.applications) || [], 8), true), culturalNotes, true).map(function (item) { return item.trim(); }).filter(Boolean))).slice(0, 9);
            var personalLife = this.asStringArray((synthesis === null || synthesis === void 0 ? void 0 : synthesis.personalApplication) || [], 4);
            var churchLife = this.asStringArray((synthesis === null || synthesis === void 0 ? void 0 : synthesis.churchApplication) || [], 4);
            var mission = this.asStringArray((synthesis === null || synthesis === void 0 ? void 0 : synthesis.missionApplication) || culturalNotes, 4);
            var distributedImplications = {
                personalLife: personalLife.length ? personalLife : allImplications.slice(0, 3),
                churchLife: churchLife.length ? churchLife : allImplications.slice(3, 6),
                mission: mission.length ? mission : allImplications.slice(6, 9),
            };
            return {
                passageOverview: this.asString((summary === null || summary === void 0 ? void 0 : summary.summary) || (synthesis === null || synthesis === void 0 ? void 0 : synthesis.summary) || ''),
                literaryContext: this.asString(((_l = referenceData === null || referenceData === void 0 ? void 0 : referenceData.bookMetadata) === null || _l === void 0 ? void 0 : _l.literaryType) || ((_m = referenceData === null || referenceData === void 0 ? void 0 : referenceData.bookMetadata) === null || _m === void 0 ? void 0 : _m.genre) || ''),
                exegeticalFlow: this.asStringArray((summary === null || summary === void 0 ? void 0 : summary.movement) || (synthesis === null || synthesis === void 0 ? void 0 : synthesis.movement) || [], 8),
                exegeticalSummary: this.asString((synthesis === null || synthesis === void 0 ? void 0 : synthesis.summary) || (summary === null || summary === void 0 ? void 0 : summary.interpretiveCenter) || ''),
                structureOfPassage: Array.isArray(structural === null || structural === void 0 ? void 0 : structural.structure)
                    ? structural.structure.map(function (item) { return ({
                        movement: _this.asString((item === null || item === void 0 ? void 0 : item.description) || (item === null || item === void 0 ? void 0 : item.type)),
                        verses: _this.asString(item === null || item === void 0 ? void 0 : item.verses),
                        summary: _this.asString((item === null || item === void 0 ? void 0 : item.description) || (item === null || item === void 0 ? void 0 : item.type)),
                    }); })
                    : [],
                keyTerms: keyTerms,
                historicalContext: __spreadArray([this.asString(((_o = referenceData === null || referenceData === void 0 ? void 0 : referenceData.historicalContext) === null || _o === void 0 ? void 0 : _o.summary) || '')], historicalNotes, true).filter(Boolean).join(' '),
                canonicalContext: this.asString((synthesis === null || synthesis === void 0 ? void 0 : synthesis.canonicalContext) ||
                    (Array.isArray(canonical === null || canonical === void 0 ? void 0 : canonical.themes)
                        ? canonical.themes
                            .map(function (item) { return _this.asString(item === null || item === void 0 ? void 0 : item.canonicalMovement); })
                            .filter(Boolean)
                            .slice(0, 2)
                            .join(' | ')
                        : '')),
                crossReferences: crossReferences,
                interpretiveChallenges: interpretiveChallenges,
                theologicalThemes: canonicalThemes,
                mainTheologicalClaim: this.asString((synthesis === null || synthesis === void 0 ? void 0 : synthesis.mainClaim) || (summary === null || summary === void 0 ? void 0 : summary.interpretiveCenter) || ''),
                pastoralImplications: distributedImplications,
                preachingFocus: preachingFocus,
            };
        };
        WorkspacesService_1.prototype.assessStudyReportCompleteness = function (sections) {
            var _this = this;
            var requiredTextFields = [
                'passageOverview',
                'literaryContext',
                'historicalContext',
                'canonicalContext',
                'exegeticalSummary',
                'mainTheologicalClaim',
            ];
            var missingText = requiredTextFields.filter(function (field) { return !_this.asString(sections === null || sections === void 0 ? void 0 : sections[field]); });
            var listChecks = [
                { field: 'exegeticalFlow', min: 2 },
                { field: 'structureOfPassage', min: 2 },
                { field: 'keyTerms', min: 2 },
                { field: 'theologicalThemes', min: 2 },
                { field: 'interpretiveChallenges', min: 1 },
            ];
            var missingLists = listChecks
                .filter(function (check) { return !Array.isArray(sections === null || sections === void 0 ? void 0 : sections[check.field]) || sections[check.field].length < check.min; })
                .map(function (check) { return check.field; });
            return {
                missingText: missingText,
                missingLists: missingLists,
                isSparse: missingText.length >= 2 || missingLists.length >= 2,
            };
        };
        WorkspacesService_1.prototype.hydrateSparseStudyReportSections = function (workspace, sections) {
            var source = sections || {};
            var fallback = this.buildStudyReportFallbackSections(workspace);
            return __assign(__assign({}, source), { passageOverview: this.asString(source.passageOverview || fallback.passageOverview), literaryContext: this.asString(source.literaryContext || fallback.literaryContext), historicalContext: this.asString(source.historicalContext || fallback.historicalContext), canonicalContext: this.asString(source.canonicalContext || fallback.canonicalContext), exegeticalSummary: this.asString(source.exegeticalSummary || fallback.exegeticalSummary), mainTheologicalClaim: this.asString(source.mainTheologicalClaim || fallback.mainTheologicalClaim), preachingFocus: this.asString(source.preachingFocus || fallback.preachingFocus || fallback.mainTheologicalClaim), exegeticalFlow: Array.isArray(source.exegeticalFlow) && source.exegeticalFlow.length ? source.exegeticalFlow : fallback.exegeticalFlow, structureOfPassage: Array.isArray(source.structureOfPassage) && source.structureOfPassage.length
                    ? source.structureOfPassage
                    : fallback.structureOfPassage, keyTerms: Array.isArray(source.keyTerms) && source.keyTerms.length ? source.keyTerms : fallback.keyTerms, theologicalThemes: Array.isArray(source.theologicalThemes) && source.theologicalThemes.length
                    ? source.theologicalThemes
                    : fallback.theologicalThemes, interpretiveChallenges: Array.isArray(source.interpretiveChallenges) && source.interpretiveChallenges.length
                    ? source.interpretiveChallenges
                    : fallback.interpretiveChallenges });
        };
        WorkspacesService_1.prototype.parseReferenceForEgw = function (reference) {
            var normalized = this.asString(reference).replace(/\u2013|\u2014/g, '-');
            var match = normalized.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
            if (!match)
                return null;
            var chapter = Number(match[2]);
            if (!Number.isFinite(chapter))
                return null;
            var verseStart = match[3] ? Number(match[3]) : undefined;
            var verseEnd = match[4] ? Number(match[4]) : undefined;
            return {
                book: this.asString(match[1]),
                chapter: chapter,
                verseStart: Number.isFinite(verseStart) ? verseStart : undefined,
                verseEnd: Number.isFinite(verseEnd) ? verseEnd : undefined,
            };
        };
        WorkspacesService_1.prototype.normalizeMediaSuggestionCards = function (value, limit) {
            var _this = this;
            if (limit === void 0) { limit = 24; }
            if (!Array.isArray(value))
                return [];
            var cards = [];
            var isLikelyJsonNoise = function (text) {
                var trimmed = _this.asString(text);
                if (!trimmed)
                    return true;
                if (/^[\{\}\[\],]+$/.test(trimmed))
                    return true;
                if (trimmed.startsWith('"') && trimmed.includes('":'))
                    return true;
                if (/^[A-Za-z0-9_]+\s*:\s*[\[{]?\s*$/.test(trimmed))
                    return true;
                if (/^["']?mediaSuggestions["']?\s*:/.test(trimmed))
                    return true;
                return false;
            };
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var item = value_1[_i];
                if (typeof item === 'string') {
                    var prompt_1 = this.asString(item);
                    if (!prompt_1 || isLikelyJsonNoise(prompt_1))
                        continue;
                    cards.push({
                        type: 'Media',
                        intent: 'Study prompt',
                        prompt: prompt_1,
                    });
                    continue;
                }
                var type = this.asString((item === null || item === void 0 ? void 0 : item.type) || (item === null || item === void 0 ? void 0 : item.label) || (item === null || item === void 0 ? void 0 : item.name));
                var lowerType = type.toLowerCase();
                if (lowerType.includes('presentación') ||
                    lowerType.includes('presentation') ||
                    lowerType.includes('slide') ||
                    lowerType.includes('deck')) {
                    continue;
                }
                var intent = this.asString((item === null || item === void 0 ? void 0 : item.intent) || (item === null || item === void 0 ? void 0 : item.category) || (item === null || item === void 0 ? void 0 : item.purpose));
                var useCase = this.asString((item === null || item === void 0 ? void 0 : item.useCase) || (item === null || item === void 0 ? void 0 : item.usage) || (item === null || item === void 0 ? void 0 : item.howToUse));
                var prompt_2 = this.asString((item === null || item === void 0 ? void 0 : item.prompt) || (item === null || item === void 0 ? void 0 : item.text) || (item === null || item === void 0 ? void 0 : item.content) || (item === null || item === void 0 ? void 0 : item.description));
                if (!prompt_2)
                    continue;
                cards.push(__assign(__assign({ type: type || 'Media', intent: intent || 'Study prompt' }, (useCase ? { useCase: useCase } : {})), { prompt: prompt_2 }));
            }
            return cards.slice(0, limit);
        };
        WorkspacesService_1.prototype.extractMediaSuggestionCardsFromLooseResponse = function (rawText, limit) {
            if (limit === void 0) { limit = 24; }
            var source = String(rawText || '')
                .replace(/[\u201c\u201d]/g, '"')
                .replace(/[\u2018\u2019]/g, "'");
            if (!source.trim())
                return [];
            var decoded = function (value) {
                return String(value || '')
                    .replace(/\\"/g, '"')
                    .replace(/\\n/g, '\n')
                    .replace(/\\t/g, '\t')
                    .trim();
            };
            var cards = [];
            // First, extract complete-ish object blocks if present.
            var objectBlocks = source.match(/\{[\s\S]*?\}/g) || [];
            for (var _i = 0, objectBlocks_1 = objectBlocks; _i < objectBlocks_1.length; _i++) {
                var block = objectBlocks_1[_i];
                var promptMatch = block.match(/"prompt"\s*:\s*"((?:\\.|[^"\\])*)"/i);
                if (!promptMatch)
                    continue;
                var prompt_3 = decoded(promptMatch[1]);
                if (!prompt_3)
                    continue;
                var typeMatch = block.match(/"type"\s*:\s*"((?:\\.|[^"\\])*)"/i);
                var intentMatch = block.match(/"intent"\s*:\s*"((?:\\.|[^"\\])*)"/i);
                var useCaseMatch = block.match(/"useCase"\s*:\s*"((?:\\.|[^"\\])*)"/i);
                cards.push(__assign(__assign({ type: decoded((typeMatch === null || typeMatch === void 0 ? void 0 : typeMatch[1]) || '') || 'Media', intent: decoded((intentMatch === null || intentMatch === void 0 ? void 0 : intentMatch[1]) || '') || 'Study prompt' }, (decoded((useCaseMatch === null || useCaseMatch === void 0 ? void 0 : useCaseMatch[1]) || '') ? { useCase: decoded((useCaseMatch === null || useCaseMatch === void 0 ? void 0 : useCaseMatch[1]) || '') } : {})), { prompt: prompt_3 }));
                if (cards.length >= limit)
                    return cards.slice(0, limit);
            }
            // If still empty, salvage every prompt key occurrence as a card.
            if (!cards.length) {
                var promptRegex = /"prompt"\s*:\s*"((?:\\.|[^"\\])*)"/gi;
                var match = null;
                while ((match = promptRegex.exec(source)) !== null) {
                    var prompt_4 = decoded(match[1]);
                    if (!prompt_4)
                        continue;
                    cards.push({
                        type: 'Media',
                        intent: 'Study prompt',
                        prompt: prompt_4,
                    });
                    if (cards.length >= limit)
                        break;
                }
            }
            return cards.slice(0, limit);
        };
        WorkspacesService_1.prototype.normalizeStudyAssets = function (source, structureOfPassage, workspace) {
            var _this = this;
            var _a, _b, _c;
            var movementSource = Array.isArray((_a = source === null || source === void 0 ? void 0 : source.studyAssets) === null || _a === void 0 ? void 0 : _a.movementAssets)
                ? source.studyAssets.movementAssets
                : Array.isArray(source === null || source === void 0 ? void 0 : source.movementAssets)
                    ? source.movementAssets
                    : [];
            var categorySource = ((_b = source === null || source === void 0 ? void 0 : source.studyAssets) === null || _b === void 0 ? void 0 : _b.categoryAssets) && typeof source.studyAssets.categoryAssets === 'object'
                ? source.studyAssets.categoryAssets
                : (source === null || source === void 0 ? void 0 : source.categoryAssets) && typeof source.categoryAssets === 'object'
                    ? source.categoryAssets
                    : {};
            var categoryEgw = Array.isArray(categorySource === null || categorySource === void 0 ? void 0 : categorySource.egwSupport)
                ? categorySource.egwSupport
                : Array.isArray(source === null || source === void 0 ? void 0 : source.egwSupport)
                    ? source.egwSupport
                    : [];
            var normalizedEgw = categoryEgw
                .map(function (item) { return ({
                citation: _this.asString((item === null || item === void 0 ? void 0 : item.citation) || (item === null || item === void 0 ? void 0 : item.reference) || (item === null || item === void 0 ? void 0 : item.bookTitle)),
                quote: _this.asString((item === null || item === void 0 ? void 0 : item.quote) || (item === null || item === void 0 ? void 0 : item.text)),
                relevance: _this.asString((item === null || item === void 0 ? void 0 : item.relevance) || (item === null || item === void 0 ? void 0 : item.summary) || (item === null || item === void 0 ? void 0 : item.connection)),
            }); })
                .filter(function (item) { return item.citation || item.quote || item.relevance; })
                .slice(0, 8);
            if (Array.isArray((_c = source === null || source === void 0 ? void 0 : source.egw) === null || _c === void 0 ? void 0 : _c.quotes)) {
                for (var _i = 0, _d = source.egw.quotes.slice(0, 8); _i < _d.length; _i++) {
                    var quote = _d[_i];
                    var normalizedQuote = {
                        citation: this.asString((quote === null || quote === void 0 ? void 0 : quote.reference) || (quote === null || quote === void 0 ? void 0 : quote.bookTitle)),
                        quote: this.asString(quote === null || quote === void 0 ? void 0 : quote.text),
                        relevance: this.asString((quote === null || quote === void 0 ? void 0 : quote.category) || ''),
                    };
                    if (normalizedQuote.citation || normalizedQuote.quote) {
                        normalizedEgw.push(normalizedQuote);
                    }
                }
            }
            var normalizedReferences = this.normalizeReferenceEntries((categorySource === null || categorySource === void 0 ? void 0 : categorySource.references) || (source === null || source === void 0 ? void 0 : source.references) || (workspace === null || workspace === void 0 ? void 0 : workspace.references) || [], 12);
            var movementAssets = movementSource
                .map(function (item, index) {
                var _a, _b, _c;
                return ({
                    movement: _this.asString((item === null || item === void 0 ? void 0 : item.movement) || (item === null || item === void 0 ? void 0 : item.title) || ((_a = structureOfPassage === null || structureOfPassage === void 0 ? void 0 : structureOfPassage[index]) === null || _a === void 0 ? void 0 : _a.movement)),
                    verses: _this.asString((item === null || item === void 0 ? void 0 : item.verses) || ((_b = structureOfPassage === null || structureOfPassage === void 0 ? void 0 : structureOfPassage[index]) === null || _b === void 0 ? void 0 : _b.verses)),
                    summary: _this.asString((item === null || item === void 0 ? void 0 : item.summary) || (item === null || item === void 0 ? void 0 : item.description) || ((_c = structureOfPassage === null || structureOfPassage === void 0 ? void 0 : structureOfPassage[index]) === null || _c === void 0 ? void 0 : _c.summary)),
                    applications: _this.asStringArray(item === null || item === void 0 ? void 0 : item.applications, 12),
                    discussionQuestions: _this.asStringArray((item === null || item === void 0 ? void 0 : item.discussionQuestions) || (item === null || item === void 0 ? void 0 : item.questions), 12),
                    illustrationIdeas: _this.asStringArray((item === null || item === void 0 ? void 0 : item.illustrationIdeas) || (item === null || item === void 0 ? void 0 : item.illustrations), 12),
                    mediaSuggestions: _this.asStringArray((item === null || item === void 0 ? void 0 : item.mediaSuggestions) || (item === null || item === void 0 ? void 0 : item.media), 12),
                    egwSupport: Array.isArray(item === null || item === void 0 ? void 0 : item.egwSupport)
                        ? item.egwSupport
                            .map(function (egw) { return ({
                            citation: _this.asString((egw === null || egw === void 0 ? void 0 : egw.citation) || (egw === null || egw === void 0 ? void 0 : egw.reference)),
                            quote: _this.asString((egw === null || egw === void 0 ? void 0 : egw.quote) || (egw === null || egw === void 0 ? void 0 : egw.text)),
                            relevance: _this.asString((egw === null || egw === void 0 ? void 0 : egw.relevance) || (egw === null || egw === void 0 ? void 0 : egw.summary)),
                        }); })
                            .filter(function (egw) { return egw.citation || egw.quote || egw.relevance; })
                            .slice(0, 4)
                        : [],
                    references: _this.asStringArray((item === null || item === void 0 ? void 0 : item.references) || (item === null || item === void 0 ? void 0 : item.explorationReferences), 6),
                });
            })
                .filter(function (item) { return item.movement || item.summary || item.verses; });
            if (!movementAssets.length && Array.isArray(structureOfPassage)) {
                for (var _e = 0, _f = structureOfPassage.slice(0, 8); _e < _f.length; _e++) {
                    var item = _f[_e];
                    var movement = this.asString(item === null || item === void 0 ? void 0 : item.movement);
                    var verses = this.asString(item === null || item === void 0 ? void 0 : item.verses);
                    var summary = this.asString(item === null || item === void 0 ? void 0 : item.summary);
                    if (movement || verses || summary) {
                        movementAssets.push({
                            movement: movement,
                            verses: verses,
                            summary: summary,
                            applications: [],
                            discussionQuestions: [],
                            illustrationIdeas: [],
                            mediaSuggestions: [],
                            egwSupport: [],
                            references: [],
                        });
                    }
                }
            }
            var mediaSuggestionCards = this.normalizeMediaSuggestionCards((categorySource === null || categorySource === void 0 ? void 0 : categorySource.mediaSuggestionCards) || (source === null || source === void 0 ? void 0 : source.mediaSuggestionCards) || (categorySource === null || categorySource === void 0 ? void 0 : categorySource.mediaSuggestions) || (source === null || source === void 0 ? void 0 : source.mediaSuggestions), 24);
            var mediaSuggestions = this.asStringArray((categorySource === null || categorySource === void 0 ? void 0 : categorySource.mediaSuggestions) || (categorySource === null || categorySource === void 0 ? void 0 : categorySource.media) || (source === null || source === void 0 ? void 0 : source.mediaSuggestions), 24);
            return {
                movementAssets: movementAssets,
                categoryAssets: {
                    applications: this.asStringArray((categorySource === null || categorySource === void 0 ? void 0 : categorySource.applications) || (source === null || source === void 0 ? void 0 : source.applications), 12),
                    discussionQuestions: this.asStringArray((categorySource === null || categorySource === void 0 ? void 0 : categorySource.discussionQuestions) || (categorySource === null || categorySource === void 0 ? void 0 : categorySource.questions) || (source === null || source === void 0 ? void 0 : source.discussionQuestions), 12),
                    illustrationIdeas: this.asStringArray((categorySource === null || categorySource === void 0 ? void 0 : categorySource.illustrationIdeas) || (categorySource === null || categorySource === void 0 ? void 0 : categorySource.illustrations) || (source === null || source === void 0 ? void 0 : source.illustrationIdeas), 12),
                    mediaSuggestions: mediaSuggestions.length ? mediaSuggestions : mediaSuggestionCards.map(function (item) { return item.prompt; }).slice(0, 24),
                    mediaSuggestionCards: mediaSuggestionCards,
                    egwSupport: normalizedEgw.slice(0, 10),
                    references: normalizedReferences,
                },
            };
        };
        WorkspacesService_1.prototype.buildOutlineStudyContext = function (studyReport, workspace) {
            var sections = (studyReport === null || studyReport === void 0 ? void 0 : studyReport.sections) || {};
            return {
                structureOfPassage: Array.isArray(sections === null || sections === void 0 ? void 0 : sections.structureOfPassage) ? sections.structureOfPassage : [],
                theologicalThemes: Array.isArray(sections === null || sections === void 0 ? void 0 : sections.theologicalThemes) ? sections.theologicalThemes : [],
                interpretiveChallenges: Array.isArray(sections === null || sections === void 0 ? void 0 : sections.interpretiveChallenges) ? sections.interpretiveChallenges : [],
                pastoralImplications: (sections === null || sections === void 0 ? void 0 : sections.pastoralImplications) || null,
                references: this.normalizeReferenceEntries((workspace === null || workspace === void 0 ? void 0 : workspace.references) || [], 12),
            };
        };
        WorkspacesService_1.prototype.findBestMovementAsset = function (point, movementAssets) {
            var title = "".concat(this.asString(point === null || point === void 0 ? void 0 : point.title), " ").concat(this.asString(point === null || point === void 0 ? void 0 : point.summary), " ").concat(this.asString(point === null || point === void 0 ? void 0 : point.movement)).toLowerCase();
            var verses = this.asStringArray((point === null || point === void 0 ? void 0 : point.supportingVerses) || (point === null || point === void 0 ? void 0 : point.verses), 8).join(' ').toLowerCase();
            var bestAsset = null;
            var bestScore = 0;
            for (var _i = 0, movementAssets_1 = movementAssets; _i < movementAssets_1.length; _i++) {
                var asset = movementAssets_1[_i];
                var movement = this.asString(asset === null || asset === void 0 ? void 0 : asset.movement).toLowerCase();
                var assetVerses = this.asString(asset === null || asset === void 0 ? void 0 : asset.verses).toLowerCase();
                var assetSummary = this.asString(asset === null || asset === void 0 ? void 0 : asset.summary).toLowerCase();
                var score = 0;
                if (movement && title.includes(movement))
                    score += 4;
                if (movement && movement.includes(title))
                    score += 2;
                if (assetVerses && verses && (assetVerses.includes(verses) || verses.includes(assetVerses)))
                    score += 4;
                if (assetSummary && title && (title.includes(assetSummary) || assetSummary.includes(title)))
                    score += 1;
                if (score > bestScore) {
                    bestScore = score;
                    bestAsset = asset;
                }
            }
            return bestAsset;
        };
        WorkspacesService_1.prototype.mergeUniqueStrings = function (primary, secondary, limit) {
            var _this = this;
            if (limit === void 0) { limit = 8; }
            var merged = __spreadArray(__spreadArray([], this.asStringArray(primary, limit), true), this.asStringArray(secondary, limit), true).map(function (item) { return _this.asString(item); })
                .filter(Boolean);
            return Array.from(new Set(merged)).slice(0, limit);
        };
        WorkspacesService_1.prototype.attachStudyAssetsToOutline = function (outlineData, studyAssets) {
            var _this = this;
            if (!outlineData || !studyAssets || !Array.isArray(outlineData.pointNodes))
                return outlineData;
            var movementAssets = Array.isArray(studyAssets === null || studyAssets === void 0 ? void 0 : studyAssets.movementAssets) ? studyAssets.movementAssets : [];
            var categoryAssets = (studyAssets === null || studyAssets === void 0 ? void 0 : studyAssets.categoryAssets) || {};
            outlineData.pointNodes = outlineData.pointNodes.map(function (point) {
                var _a;
                var movementAsset = _this.findBestMovementAsset(point, movementAssets);
                var mergedEgw = __spreadArray(__spreadArray(__spreadArray([], (Array.isArray(point === null || point === void 0 ? void 0 : point.egwSupport) ? point.egwSupport : []), true), (Array.isArray(movementAsset === null || movementAsset === void 0 ? void 0 : movementAsset.egwSupport) ? movementAsset.egwSupport : []), true), (Array.isArray(categoryAssets === null || categoryAssets === void 0 ? void 0 : categoryAssets.egwSupport) ? categoryAssets.egwSupport.slice(0, 2) : []), true).map(function (item) { return ({
                    citation: _this.asString((item === null || item === void 0 ? void 0 : item.citation) || (item === null || item === void 0 ? void 0 : item.reference)),
                    quote: _this.asString((item === null || item === void 0 ? void 0 : item.quote) || (item === null || item === void 0 ? void 0 : item.text)),
                    relevance: _this.asString((item === null || item === void 0 ? void 0 : item.relevance) || (item === null || item === void 0 ? void 0 : item.summary)),
                }); })
                    .filter(function (item) { return item.citation || item.quote || item.relevance; })
                    .slice(0, 4);
                return __assign(__assign({}, point), { applications: _this.mergeUniqueStrings(point === null || point === void 0 ? void 0 : point.applications, (movementAsset === null || movementAsset === void 0 ? void 0 : movementAsset.applications) || (categoryAssets === null || categoryAssets === void 0 ? void 0 : categoryAssets.applications), 12), discussionQuestions: _this.mergeUniqueStrings(point === null || point === void 0 ? void 0 : point.discussionQuestions, (movementAsset === null || movementAsset === void 0 ? void 0 : movementAsset.discussionQuestions) || (categoryAssets === null || categoryAssets === void 0 ? void 0 : categoryAssets.discussionQuestions), 12), illustrationIdeas: _this.mergeUniqueStrings(point === null || point === void 0 ? void 0 : point.illustrationIdeas, (movementAsset === null || movementAsset === void 0 ? void 0 : movementAsset.illustrationIdeas) || (categoryAssets === null || categoryAssets === void 0 ? void 0 : categoryAssets.illustrationIdeas), 12), mediaSuggestions: _this.mergeUniqueStrings(point === null || point === void 0 ? void 0 : point.mediaSuggestions, (movementAsset === null || movementAsset === void 0 ? void 0 : movementAsset.mediaSuggestions) || (categoryAssets === null || categoryAssets === void 0 ? void 0 : categoryAssets.mediaSuggestions), 12), references: _this.mergeUniqueStrings(point === null || point === void 0 ? void 0 : point.references, (movementAsset === null || movementAsset === void 0 ? void 0 : movementAsset.references) || ((_a = categoryAssets === null || categoryAssets === void 0 ? void 0 : categoryAssets.references) === null || _a === void 0 ? void 0 : _a.map(function (item) { return (item === null || item === void 0 ? void 0 : item.reference) || item; })), 6), egwSupport: mergedEgw });
            });
            return outlineData;
        };
        WorkspacesService_1.prototype.upgradeWorkspaceContracts = function (workspace) {
            return __awaiter(this, void 0, void 0, function () {
                var touched, primaryStudyReport, normalizedStudySections, upgradedStudyAssets, nextSections, before, after, studyAssets, _i, _a, outline, normalizedStructure, enrichedStructure, sanitizedStructure, before, after;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            if (!workspace)
                                return [2 /*return*/, workspace];
                            workspace.theologicalLens = (0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens);
                            touched = false;
                            primaryStudyReport = ((_b = workspace.studyReports) === null || _b === void 0 ? void 0 : _b[0]) || null;
                            normalizedStudySections = (primaryStudyReport === null || primaryStudyReport === void 0 ? void 0 : primaryStudyReport.sections)
                                ? this.normalizeStudyReportSections(primaryStudyReport.sections)
                                : null;
                            upgradedStudyAssets = normalizedStudySections && (!((_c = primaryStudyReport === null || primaryStudyReport === void 0 ? void 0 : primaryStudyReport.sections) === null || _c === void 0 ? void 0 : _c.studyAssets) || !primaryStudyReport.sections.studyAssets.categoryAssets)
                                ? this.normalizeStudyAssets(primaryStudyReport.sections, normalizedStudySections.structureOfPassage || [], workspace)
                                : ((_d = primaryStudyReport === null || primaryStudyReport === void 0 ? void 0 : primaryStudyReport.sections) === null || _d === void 0 ? void 0 : _d.studyAssets) || null;
                            if (!(primaryStudyReport && normalizedStudySections)) return [3 /*break*/, 2];
                            nextSections = __assign(__assign(__assign({}, primaryStudyReport.sections), normalizedStudySections), { studyAssets: upgradedStudyAssets });
                            before = JSON.stringify(primaryStudyReport.sections || {});
                            after = JSON.stringify(nextSections);
                            if (!(before !== after)) return [3 /*break*/, 2];
                            primaryStudyReport.sections = nextSections;
                            return [4 /*yield*/, this.studyReportRepository.save(primaryStudyReport)];
                        case 1:
                            _f.sent();
                            touched = true;
                            _f.label = 2;
                        case 2:
                            studyAssets = upgradedStudyAssets || ((_e = primaryStudyReport === null || primaryStudyReport === void 0 ? void 0 : primaryStudyReport.sections) === null || _e === void 0 ? void 0 : _e.studyAssets) || null;
                            _i = 0, _a = workspace.outlines || [];
                            _f.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            outline = _a[_i];
                            if (!(outline === null || outline === void 0 ? void 0 : outline.structure))
                                return [3 /*break*/, 5];
                            normalizedStructure = this.normalizeOutlineData(outline.structure);
                            enrichedStructure = this.attachStudyAssetsToOutline(__assign(__assign({}, (normalizedStructure || {})), { pointNodes: Array.isArray(normalizedStructure === null || normalizedStructure === void 0 ? void 0 : normalizedStructure.pointNodes) ? normalizedStructure.pointNodes : [] }), studyAssets);
                            sanitizedStructure = this.sanitizeOutputForLens(enrichedStructure, workspace);
                            before = JSON.stringify(outline.structure || {});
                            after = JSON.stringify(sanitizedStructure || {});
                            if (!(before !== after)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.outlineRepository.update({ id: outline.id }, { structure: sanitizedStructure })];
                        case 4:
                            _f.sent();
                            outline.structure = sanitizedStructure;
                            touched = true;
                            _f.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6: return [2 /*return*/, workspace];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.normalizeStudyReportSections = function (raw) {
            var _this = this;
            var source = raw && typeof raw === 'object' ? raw : {};
            var structureOfPassage = Array.isArray(source.structureOfPassage)
                ? source.structureOfPassage
                    .map(function (item) { return ({
                    movement: _this.asString((item === null || item === void 0 ? void 0 : item.movement) || (item === null || item === void 0 ? void 0 : item.title) || (item === null || item === void 0 ? void 0 : item.section)),
                    verses: _this.asString((item === null || item === void 0 ? void 0 : item.verses) || (item === null || item === void 0 ? void 0 : item.reference)),
                    summary: _this.asString((item === null || item === void 0 ? void 0 : item.summary) || (item === null || item === void 0 ? void 0 : item.description) || (item === null || item === void 0 ? void 0 : item.content)),
                }); })
                    .filter(function (item) { return item.movement || item.summary; })
                : [];
            var keyTerms = Array.isArray(source.keyTerms)
                ? source.keyTerms
                    .map(function (item) { return ({
                    term: _this.asString((item === null || item === void 0 ? void 0 : item.term) || (item === null || item === void 0 ? void 0 : item.word)),
                    language: _this.asString((item === null || item === void 0 ? void 0 : item.language) || ''),
                    transliteration: _this.asString((item === null || item === void 0 ? void 0 : item.transliteration) || ''),
                    definition: _this.asString((item === null || item === void 0 ? void 0 : item.definition) || ''),
                    nuance: _this.asString((item === null || item === void 0 ? void 0 : item.nuance) || (item === null || item === void 0 ? void 0 : item.notes) || ''),
                }); })
                    .filter(function (item) { return item.term; })
                : [];
            var crossReferences = Array.isArray(source.crossReferences)
                ? source.crossReferences
                    .map(function (item) { return ({
                    reference: _this.asString((item === null || item === void 0 ? void 0 : item.reference) || (item === null || item === void 0 ? void 0 : item.verse)),
                    connection: _this.asString((item === null || item === void 0 ? void 0 : item.connection) || (item === null || item === void 0 ? void 0 : item.explanation) || (item === null || item === void 0 ? void 0 : item.reason)),
                    category: _this.asString((item === null || item === void 0 ? void 0 : item.category) || 'thematic').toLowerCase(),
                    tier: _this.asString((item === null || item === void 0 ? void 0 : item.tier) || 'secondary').toLowerCase(),
                }); })
                    .filter(function (item) { return item.reference; })
                : [];
            var interpretiveChallenges = Array.isArray(source.interpretiveChallenges)
                ? source.interpretiveChallenges
                    .map(function (item) { return ({
                    question: _this.asString((item === null || item === void 0 ? void 0 : item.question) || (item === null || item === void 0 ? void 0 : item.challenge)),
                    interpretationOptions: _this.asStringArray((item === null || item === void 0 ? void 0 : item.interpretationOptions) || (item === null || item === void 0 ? void 0 : item.options) || [], 5),
                    preachingGuidance: _this.asString((item === null || item === void 0 ? void 0 : item.preachingGuidance) || (item === null || item === void 0 ? void 0 : item.guidance) || (item === null || item === void 0 ? void 0 : item.note)),
                }); })
                    .filter(function (item) { return item.question; })
                : [];
            var pastoralImplicationsRaw = source.pastoralImplications || source.practicalApplications || source.applications;
            var pastoralImplications = (function () {
                var pickFirstList = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i] = arguments[_i];
                    }
                    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
                        var value = values_1[_a];
                        var parsed = _this.asStringArray(value, 6);
                        if (parsed.length)
                            return parsed;
                    }
                    return [];
                };
                if (pastoralImplicationsRaw && typeof pastoralImplicationsRaw === 'object' && !Array.isArray(pastoralImplicationsRaw)) {
                    var personalLife = pickFirstList(pastoralImplicationsRaw.personalLife, pastoralImplicationsRaw.personal, pastoralImplicationsRaw.vidaPersonal, pastoralImplicationsRaw.individualLife);
                    var churchLife = pickFirstList(pastoralImplicationsRaw.churchLife, pastoralImplicationsRaw.churchApplication, pastoralImplicationsRaw.communityLife, pastoralImplicationsRaw.congregationalLife, pastoralImplicationsRaw.communalLife, pastoralImplicationsRaw.vidaIglesia, pastoralImplicationsRaw.iglesia);
                    var mission = pickFirstList(pastoralImplicationsRaw.mission, pastoralImplicationsRaw.missional, pastoralImplicationsRaw.missionApplication, pastoralImplicationsRaw.outreach, pastoralImplicationsRaw.evangelism, pastoralImplicationsRaw.mision);
                    var combined_1 = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], _this.asStringArray(pastoralImplicationsRaw.implications, 12), true), _this.asStringArray(pastoralImplicationsRaw.applications, 12), true), personalLife, true), churchLife, true), mission, true)));
                    var fillMissing = function (items, used) {
                        if (items.length) {
                            items.forEach(function (item) { return used.add(item); });
                            return items.slice(0, 6);
                        }
                        var fill = combined_1.filter(function (item) { return !used.has(item); }).slice(0, 6);
                        if (!fill.length && combined_1.length) {
                            fill = combined_1.slice(0, 6);
                        }
                        fill.forEach(function (item) { return used.add(item); });
                        return fill;
                    };
                    var used = new Set();
                    return {
                        personalLife: fillMissing(personalLife, used),
                        churchLife: fillMissing(churchLife, used),
                        mission: fillMissing(mission, used),
                    };
                }
                var flat = _this.asStringArray(pastoralImplicationsRaw, 12);
                return {
                    personalLife: flat.slice(0, 4),
                    churchLife: flat.slice(4, 8),
                    mission: flat.slice(8, 12),
                };
            })();
            // Legacy key fallback mapping
            var fallbackThemes = this.asStringArray(source.theologicalThemes || source.keyThemes || source.themes, 10);
            var fallbackCanonical = this.asString(source.canonicalContext || source.canonicalConnections || source.canonicalThemes || '');
            var fallbackClaim = this.asString(source.mainTheologicalClaim || source.theologicalInsights || source.mainClaim || '');
            var fallbackFlow = this.asStringArray(source.exegeticalFlow || source.argumentFlow || source.flow || [], 8);
            var fallbackSummary = this.asString(source.exegeticalSummary || source.summaryStatement || '');
            var fallbackPreachingFocus = this.asString(source.preachingFocus || source.sermonFocus || source.homileticFocus || source.mainTheologicalClaim || source.mainClaim || '');
            return {
                passageOverview: this.asString(source.passageOverview || source.overview || source.summary || ''),
                literaryContext: this.asString(source.literaryContext || ''),
                exegeticalFlow: fallbackFlow,
                exegeticalSummary: fallbackSummary,
                structureOfPassage: structureOfPassage,
                keyTerms: keyTerms,
                historicalContext: this.asString(source.historicalContext || ''),
                canonicalContext: fallbackCanonical,
                crossReferences: crossReferences,
                interpretiveChallenges: interpretiveChallenges,
                theologicalThemes: fallbackThemes,
                mainTheologicalClaim: fallbackClaim,
                preachingFocus: fallbackPreachingFocus || fallbackClaim,
                pastoralImplications: pastoralImplications,
                studyAssets: this.normalizeStudyAssets(source, structureOfPassage),
            };
        };
        WorkspacesService_1.prototype.flattenStudyAssetStrings = function (studyAssets, key, limit) {
            var _this = this;
            if (limit === void 0) { limit = 12; }
            var categoryAssets = (studyAssets === null || studyAssets === void 0 ? void 0 : studyAssets.categoryAssets) || {};
            var movementAssets = Array.isArray(studyAssets === null || studyAssets === void 0 ? void 0 : studyAssets.movementAssets) ? studyAssets.movementAssets : [];
            var direct = this.asStringArray(categoryAssets === null || categoryAssets === void 0 ? void 0 : categoryAssets[key], limit);
            var movement = movementAssets.flatMap(function (item) { return _this.asStringArray(item === null || item === void 0 ? void 0 : item[key], limit); });
            return Array.from(new Set(__spreadArray(__spreadArray([], direct, true), movement, true).map(function (item) { return item.trim(); }).filter(Boolean))).slice(0, limit);
        };
        WorkspacesService_1.prototype.syncStudyAssetRecords = function (workspaceId, studyAssets) {
            return __awaiter(this, void 0, void 0, function () {
                var applications, discussionQuestions, illustrationIdeas;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            applications = this.flattenStudyAssetStrings(studyAssets, 'applications', 18);
                            discussionQuestions = this.flattenStudyAssetStrings(studyAssets, 'discussionQuestions', 18);
                            illustrationIdeas = this.flattenStudyAssetStrings(studyAssets, 'illustrationIdeas', 18);
                            if (!applications.length) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.applicationRepository.delete({ workspaceId: workspaceId })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.applicationRepository.save(applications.map(function (content, index) {
                                    return _this.applicationRepository.create({
                                        workspaceId: workspaceId,
                                        audienceType: sermon_application_entity_1.AudienceType.MIXED_CONGREGATION,
                                        content: content,
                                        orderIndex: index,
                                    });
                                }))];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            if (!discussionQuestions.length) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.questionRepository.delete({ workspaceId: workspaceId })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.questionRepository.save(discussionQuestions.map(function (question, index) {
                                    return _this.questionRepository.create({
                                        workspaceId: workspaceId,
                                        question: question,
                                        orderIndex: index,
                                        category: 'study',
                                    });
                                }))];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            if (!illustrationIdeas.length) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.illustrationRepository.delete({ workspaceId: workspaceId })];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, this.illustrationRepository.save(illustrationIdeas.map(function (content, index) {
                                    return _this.illustrationRepository.create({
                                        workspaceId: workspaceId,
                                        title: "Illustration ".concat(index + 1),
                                        content: content,
                                    });
                                }))];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateOutlines = function (workspaceId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (workspaceId, userId, count, promptOverride) {
                var workspace, outlineCount, outlineHistoryBase_1, guardrailProfile, seedPoints_1, introduction, conclusion, callToAction, outlineData, insertResult, outlineId, savedOutline, _a, outlines, studyReport, studyContext, reportText, pointsPrompt, pointsResponse, pointsVariations, fallbackPoints, guardrailActive, seedPoints, generatedPointSignatures, i, variationData, points, variation, prompt_5, response, outlineData, currentPoints, currentSignature, diversityPrompt, retriedOutlineData, retriedPoints, outlineSeedPoints, insertResult, outlineId, savedOutline, _b, activeOutlineId;
                var _this = this;
                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                if (count === void 0) { count = 3; }
                return __generator(this, function (_u) {
                    switch (_u.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _u.sent();
                            outlineCount = 1;
                            if (!(Array.isArray(workspace.outlines) && workspace.outlines.length)) return [3 /*break*/, 3];
                            outlineHistoryBase_1 = Array.isArray((_c = workspace.metadata) === null || _c === void 0 ? void 0 : _c.outlineHistory)
                                ? ((_d = workspace.metadata) === null || _d === void 0 ? void 0 : _d.outlineHistory).length
                                : 0;
                            workspace.outlines.forEach(function (outline, index) {
                                _this.appendWorkspaceHistory(workspace, 'outlineHistory', _this.snapshotOutlineForHistory(outline, "Version ".concat(outlineHistoryBase_1 + index + 1)));
                            });
                            return [4 /*yield*/, this.workspaceRepository.save(workspace)];
                        case 2:
                            _u.sent();
                            _u.label = 3;
                        case 3: 
                        // Delete existing outlines before regenerating
                        return [4 /*yield*/, this.outlineRepository.delete({ workspaceId: workspaceId })];
                        case 4:
                            // Delete existing outlines before regenerating
                            _u.sent();
                            guardrailProfile = this.buildGuardrailProfile(workspace);
                            if (!guardrailProfile.active) return [3 /*break*/, 10];
                            seedPoints_1 = this.buildPropheticGuardrailOutlineSeeds(workspace);
                            introduction = workspace.language === 'es'
                                ? "Este pasaje llama a la iglesia a escuchar el evangelio eterno, adorar al Creador y responder con fidelidad a Cristo."
                                : "This passage calls the church to hear the everlasting gospel, worship the Creator, and respond with faithful trust in Christ.";
                            conclusion = workspace.language === 'es'
                                ? "La respuesta pastoral a este mensaje es confiar en Jes\u00FAs, adorar a Dios con reverencia y vivir con esperanza fiel."
                                : "The pastoral response to this message is to trust Jesus, worship God with reverence, and live with faithful hope.";
                            callToAction = workspace.language === 'es'
                                ? "Conf\u00EDa en Cristo, adora al Creador y camina con perseverancia como testigo fiel del evangelio eterno."
                                : "Trust Christ, worship the Creator, and walk with endurance as a faithful witness to the everlasting gospel.";
                            outlineData = this.sanitizePropheticOutlineReferences(this.sanitizeOutputForLens(this.normalizeOutlineData({
                                introduction: introduction,
                                points: seedPoints_1,
                                pointNodes: this.normalizeGeneratedPointNodes([], seedPoints_1).map(function (node, index) { return (__assign(__assign({}, node), { slideTitle: node.slideTitle || _this.asString(seedPoints_1[index]).split(/\s+/).slice(0, 4).join(' '), summary: node.summary || _this.asString(seedPoints_1[index]), supportingVerses: node.supportingVerses.length ? node.supportingVerses : [workspace.mainPassage], crossReferences: node.crossReferences.length ? node.crossReferences : [workspace.mainPassage] })); }),
                                conclusion: conclusion,
                                callToAction: callToAction,
                            }), workspace), workspace);
                            this.validateGenerationResult('outline', outlineData);
                            return [4 /*yield*/, this.outlineRepository.insert({
                                    workspaceId: workspaceId,
                                    title: 'Outline Option 1',
                                    structure: outlineData,
                                    isSelected: true,
                                })];
                        case 5:
                            insertResult = _u.sent();
                            outlineId = (_f = (_e = insertResult.identifiers) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.id;
                            if (!outlineId) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.outlineRepository.findOne({ where: { id: outlineId } })];
                        case 6:
                            _a = _u.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            _a = null;
                            _u.label = 8;
                        case 8:
                            savedOutline = _a;
                            if (!savedOutline) {
                                throw new common_1.BadRequestException('Outline creation succeeded but the saved outline could not be reloaded.');
                            }
                            workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { activeOutlineId: savedOutline.id });
                            return [4 /*yield*/, this.workspaceRepository.update(workspace.id, {
                                    metadata: workspace.metadata,
                                })];
                        case 9:
                            _u.sent();
                            return [2 /*return*/, [savedOutline]];
                        case 10:
                            outlines = [];
                            studyReport = (_g = workspace.studyReports) === null || _g === void 0 ? void 0 : _g[0];
                            studyContext = this.buildOutlineStudyContext(studyReport, workspace);
                            reportText = (studyReport === null || studyReport === void 0 ? void 0 : studyReport.sections) ? JSON.stringify(studyContext, null, 2) : '';
                            pointsPrompt = promptOverride || this.buildOutlinePointsPrompt(workspace, outlineCount, reportText);
                            return [4 /*yield*/, this.llmService.generateCompletion(pointsPrompt, userId, {
                                    temperature: 0.6,
                                    maxTokens: 700,
                                })];
                        case 11:
                            pointsResponse = _u.sent();
                            this.logLlmOutput('outline:points', pointsResponse);
                            pointsVariations = this.parseOutlinePointsResponse(pointsResponse, count);
                            fallbackPoints = this.parseListFromResponse(pointsResponse).slice(0, 5);
                            guardrailActive = this.buildGuardrailProfile(workspace).active;
                            if (!pointsVariations.length) {
                                seedPoints = fallbackPoints.length > 0
                                    ? fallbackPoints
                                    : guardrailActive
                                        ? this.buildPropheticGuardrailOutlineSeeds(workspace)
                                        : [
                                            this.asString(workspace.theme || ((_h = workspace.sermonCore) === null || _h === void 0 ? void 0 : _h.bigIdea) || workspace.mainPassage || 'Passage focus'),
                                            'Biblical tension',
                                            'Gospel restoration',
                                            'Call to response',
                                        ].filter(Boolean);
                                pointsVariations = [
                                    {
                                        angle: 'Passage-centered outline',
                                        style: 'expository',
                                        theologicalEmphasis: this.asString(((_j = workspace.sermonCore) === null || _j === void 0 ? void 0 : _j.centralTruth) || workspace.theme || ''),
                                        audienceFocus: this.asString(workspace.audienceProfile || 'general congregation'),
                                        sermonStructure: this.asString(workspace.storyArc || ''),
                                        points: seedPoints,
                                    },
                                ];
                            }
                            pointsVariations = pointsVariations
                                .map(function (variation, index) {
                                var _a, _b;
                                var cleanPoints = _this.asStringArray(variation === null || variation === void 0 ? void 0 : variation.points, 10).map(function (item) { return _this.cleanCoachText(item); }).filter(Boolean);
                                var recoveredPoints = guardrailActive
                                    ? _this.buildPropheticGuardrailOutlineSeeds(workspace)
                                    : cleanPoints.length >= 3
                                        ? cleanPoints
                                        : fallbackPoints.length >= 3
                                            ? fallbackPoints
                                            : [
                                                _this.asString(workspace.theme || ((_a = workspace.sermonCore) === null || _a === void 0 ? void 0 : _a.bigIdea) || workspace.mainPassage || 'Passage focus'),
                                                'Biblical tension',
                                                'Gospel restoration',
                                                'Call to response',
                                            ].filter(Boolean);
                                return {
                                    angle: _this.cleanCoachText((variation === null || variation === void 0 ? void 0 : variation.angle) || "Passage-centered outline ".concat(index + 1)),
                                    style: _this.cleanCoachText((variation === null || variation === void 0 ? void 0 : variation.style) || 'expository'),
                                    theologicalEmphasis: _this.cleanCoachText((variation === null || variation === void 0 ? void 0 : variation.theologicalEmphasis) || workspace.theme || ((_b = workspace.sermonCore) === null || _b === void 0 ? void 0 : _b.centralTruth) || ''),
                                    audienceFocus: _this.cleanCoachText((variation === null || variation === void 0 ? void 0 : variation.audienceFocus) || workspace.audienceProfile || ''),
                                    sermonStructure: _this.cleanCoachText((variation === null || variation === void 0 ? void 0 : variation.sermonStructure) || workspace.storyArc || ''),
                                    points: recoveredPoints,
                                };
                            })
                                .filter(function (variation) { return Array.isArray(variation.points) && variation.points.length >= 3; });
                            if (!pointsVariations.length) {
                                pointsVariations = [
                                    {
                                        angle: 'Passage-centered outline',
                                        style: 'expository',
                                        theologicalEmphasis: this.asString(((_k = workspace.sermonCore) === null || _k === void 0 ? void 0 : _k.centralTruth) || workspace.theme || ''),
                                        audienceFocus: this.asString(workspace.audienceProfile || 'general congregation'),
                                        sermonStructure: this.asString(workspace.storyArc || ''),
                                        points: guardrailActive ? this.buildPropheticGuardrailOutlineSeeds(workspace) : fallbackPoints.length >= 3
                                            ? fallbackPoints
                                            : [
                                                this.asString(workspace.theme || ((_l = workspace.sermonCore) === null || _l === void 0 ? void 0 : _l.bigIdea) || workspace.mainPassage || 'Passage focus'),
                                                'Biblical tension',
                                                'Gospel restoration',
                                            ].filter(Boolean),
                                    },
                                ];
                            }
                            this.validateGenerationResult('outline-points', pointsVariations);
                            generatedPointSignatures = new Set();
                            i = 0;
                            _u.label = 12;
                        case 12:
                            if (!(i < outlineCount)) return [3 /*break*/, 22];
                            variationData = pointsVariations[i];
                            points = ((_m = variationData === null || variationData === void 0 ? void 0 : variationData.points) === null || _m === void 0 ? void 0 : _m.length) ? variationData.points : fallbackPoints;
                            variation = (variationData === null || variationData === void 0 ? void 0 : variationData.angle)
                                ? "Angle: ".concat(variationData.angle, ". Style: ").concat(variationData.style || 'N/A', ". Theological Emphasis: ").concat(variationData.theologicalEmphasis || 'N/A', ". Audience Focus: ").concat(variationData.audienceFocus || 'N/A', ". Structure: ").concat(variationData.sermonStructure || 'N/A', ". Keep this outline distinct in tone and structure.")
                                : "Outline variation ".concat(i + 1, " with a distinct angle and tone.");
                            prompt_5 = this.buildOutlineFromPointsPrompt(workspace, points, variation, reportText);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt_5, userId, {
                                    temperature: 0.9,
                                    maxTokens: 1200,
                                })];
                        case 13:
                            response = _u.sent();
                            this.logLlmOutput('outline', response);
                            outlineData = this.parseJsonSafe(response);
                            outlineData = outlineData ? this.normalizeOutlineData(outlineData) : null;
                            if (!outlineData) {
                                outlineData = this.parseOutlineFromResponse(response);
                            }
                            if (!outlineData) {
                                outlineData = this.normalizeOutlineData({
                                    introduction: '',
                                    points: points,
                                    conclusion: '',
                                    callToAction: '',
                                });
                            }
                            currentPoints = this.extractOutlinePointTexts(outlineData || {});
                            currentSignature = this.buildPointSignature(currentPoints);
                            if (!(currentSignature && this.isSignatureTooSimilar(currentSignature, generatedPointSignatures))) return [3 /*break*/, 15];
                            diversityPrompt = "".concat(prompt_5, "\n\nIMPORTANT: Previous options are too similar. Regenerate with significantly different point wording, progression, and framing.");
                            return [4 /*yield*/, this.llmService.generateCompletion(diversityPrompt, userId, {
                                    temperature: 1.0,
                                    maxTokens: 1200,
                                })];
                        case 14:
                            response = _u.sent();
                            this.logLlmOutput('outline:diversity-regenerate', response);
                            retriedOutlineData = this.parseJsonSafe(response);
                            retriedOutlineData = retriedOutlineData ? this.normalizeOutlineData(retriedOutlineData) : null;
                            if (!retriedOutlineData) {
                                retriedOutlineData = this.parseOutlineFromResponse(response);
                            }
                            if (!retriedOutlineData) {
                                retriedOutlineData = this.normalizeOutlineData({
                                    introduction: '',
                                    points: points,
                                    conclusion: '',
                                    callToAction: '',
                                });
                            }
                            if (retriedOutlineData) {
                                outlineData = retriedOutlineData;
                                retriedPoints = this.extractOutlinePointTexts(outlineData || {});
                                currentSignature = this.buildPointSignature(retriedPoints);
                            }
                            _u.label = 15;
                        case 15: return [4 /*yield*/, this.ensureOutlinePointNodes(workspace, userId, outlineData, reportText)];
                        case 16:
                            outlineData = _u.sent();
                            outlineData = this.attachStudyAssetsToOutline(outlineData, (_o = studyReport === null || studyReport === void 0 ? void 0 : studyReport.sections) === null || _o === void 0 ? void 0 : _o.studyAssets);
                            outlineData = this.sanitizeOutputForLens(outlineData, workspace);
                            outlineData = this.sanitizePropheticOutlineReferences(outlineData || {}, workspace);
                            outlineSeedPoints = Array.isArray(points) ? points.map(function (item) { return _this.asString(item); }).filter(Boolean) : [];
                            if (!Array.isArray(outlineData === null || outlineData === void 0 ? void 0 : outlineData.points) || outlineData.points.length < 3) {
                                outlineData.points = outlineSeedPoints.length >= 3
                                    ? outlineSeedPoints
                                    : [
                                        this.asString(workspace.theme || ((_p = workspace.sermonCore) === null || _p === void 0 ? void 0 : _p.bigIdea) || workspace.mainPassage || 'Passage focus'),
                                        'Biblical tension',
                                        'Gospel response',
                                    ];
                            }
                            if (!Array.isArray(outlineData === null || outlineData === void 0 ? void 0 : outlineData.pointNodes) || outlineData.pointNodes.length < outlineData.points.length) {
                                outlineData.pointNodes = this.normalizeGeneratedPointNodes({
                                    pointNodes: Array.isArray(outlineData === null || outlineData === void 0 ? void 0 : outlineData.pointNodes) ? outlineData.pointNodes : [],
                                }, outlineData.points);
                            }
                            this.validateGenerationResult('outline', outlineData);
                            if (currentSignature) {
                                generatedPointSignatures.add(currentSignature);
                            }
                            return [4 /*yield*/, this.outlineRepository.insert({
                                    workspaceId: workspaceId,
                                    title: "Outline Option ".concat(i + 1),
                                    structure: outlineData,
                                    isSelected: i === 0,
                                })];
                        case 17:
                            insertResult = _u.sent();
                            outlineId = (_r = (_q = insertResult.identifiers) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.id;
                            if (!outlineId) return [3 /*break*/, 19];
                            return [4 /*yield*/, this.outlineRepository.findOne({ where: { id: outlineId } })];
                        case 18:
                            _b = _u.sent();
                            return [3 /*break*/, 20];
                        case 19:
                            _b = null;
                            _u.label = 20;
                        case 20:
                            savedOutline = _b;
                            if (!savedOutline) {
                                throw new common_1.BadRequestException('Outline creation succeeded but the saved outline could not be reloaded.');
                            }
                            outlines.push(savedOutline);
                            _u.label = 21;
                        case 21:
                            i++;
                            return [3 /*break*/, 12];
                        case 22:
                            activeOutlineId = ((_s = outlines.find(function (outline) { return outline === null || outline === void 0 ? void 0 : outline.isSelected; })) === null || _s === void 0 ? void 0 : _s.id) || ((_t = outlines[0]) === null || _t === void 0 ? void 0 : _t.id) || null;
                            if (!activeOutlineId) return [3 /*break*/, 24];
                            workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { activeOutlineId: activeOutlineId });
                            return [4 /*yield*/, this.workspaceRepository.update(workspace.id, {
                                    metadata: workspace.metadata,
                                })];
                        case 23:
                            _u.sent();
                            _u.label = 24;
                        case 24: return [2 /*return*/, outlines];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateManuscript = function (workspaceId, outlineId, userId, promptOverride, manuscriptOptions) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, manuscriptHistoryBase_1, outlineFromWorkspace, outline, _a, selectedOutline, normalizedOptions, prompt, targetTokens, manuscriptTimeoutMs, useGuardrailFallback, parsedManuscript, usedFallback, manuscriptResponse, error_3, rewritePrompt, rewrittenResponse, quality, repairAttemptsExecuted, currentQuality, shouldPrioritizeLength, repairPrompt, repairedResponse, candidateManuscript, rewritePrompt, rewrittenResponse, candidateQuality, plainText, wordCount, estimatedMinutes, cueCount, cueAnchors, refreshPrompt, refreshResponse, refreshedCues, error_4, manuscript, insertResult, saved, _b;
                var _this = this;
                var _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _g.sent();
                            if (!(Array.isArray(workspace.manuscripts) && workspace.manuscripts.length)) return [3 /*break*/, 3];
                            manuscriptHistoryBase_1 = Array.isArray((_c = workspace.metadata) === null || _c === void 0 ? void 0 : _c.manuscriptHistory)
                                ? ((_d = workspace.metadata) === null || _d === void 0 ? void 0 : _d.manuscriptHistory).length
                                : 0;
                            workspace.manuscripts.forEach(function (manuscript, index) {
                                _this.appendWorkspaceHistory(workspace, 'manuscriptHistory', _this.snapshotManuscriptForHistory(manuscript, "Version ".concat(manuscriptHistoryBase_1 + index + 1)));
                            });
                            return [4 /*yield*/, this.workspaceRepository.save(workspace)];
                        case 2:
                            _g.sent();
                            _g.label = 3;
                        case 3:
                            outlineFromWorkspace = Array.isArray(workspace.outlines)
                                ? workspace.outlines.find(function (item) { return (item === null || item === void 0 ? void 0 : item.id) === outlineId || (item === null || item === void 0 ? void 0 : item.isSelected); }) || workspace.outlines[0]
                                : null;
                            if (!outlineId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.outlineRepository.findOne({ where: { id: outlineId } })];
                        case 4:
                            _a = _g.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _a = null;
                            _g.label = 6;
                        case 6:
                            outline = _a;
                            selectedOutline = outline || outlineFromWorkspace;
                            if (!selectedOutline) {
                                throw new Error('Outline not found');
                            }
                            // Keep only the newest manuscript draft per workspace.
                            return [4 /*yield*/, this.manuscriptRepository.delete({ workspaceId: workspaceId })];
                        case 7:
                            // Keep only the newest manuscript draft per workspace.
                            _g.sent();
                            normalizedOptions = this.normalizeManuscriptOptions(workspace, manuscriptOptions);
                            prompt = promptOverride || this.buildManuscriptPrompt(workspace, selectedOutline, normalizedOptions);
                            targetTokens = Math.max(4500, Math.ceil((normalizedOptions.targetMinutes || 22) * 200));
                            manuscriptTimeoutMs = 60000;
                            useGuardrailFallback = this.buildGuardrailProfile(workspace).active;
                            usedFallback = useGuardrailFallback;
                            if (!useGuardrailFallback) return [3 /*break*/, 8];
                            console.warn('[manuscript] guardrail fallback activated for prophetic passage');
                            parsedManuscript = this.buildManuscriptGuardrailFallback(workspace, selectedOutline, normalizedOptions);
                            return [3 /*break*/, 11];
                        case 8:
                            _g.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId, {
                                    maxTokens: targetTokens,
                                    temperature: 0.65, // Slightly lower for more coherent long-form content
                                    timeoutMs: manuscriptTimeoutMs,
                                })];
                        case 9:
                            manuscriptResponse = _g.sent();
                            this.logLlmOutput('manuscript', manuscriptResponse);
                            parsedManuscript = this.normalizeManuscriptForWorkspace(workspace, this.parseGeneratedManuscriptResponse(manuscriptResponse, normalizedOptions));
                            return [3 /*break*/, 11];
                        case 10:
                            error_3 = _g.sent();
                            usedFallback = true;
                            console.warn("[manuscript] fallback activated: ".concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'unknown error'));
                            parsedManuscript = this.buildManuscriptGuardrailFallback(workspace, selectedOutline, normalizedOptions);
                            return [3 /*break*/, 11];
                        case 11:
                            if (!(!usedFallback &&
                                workspace.language === 'es' &&
                                this.hasEnglishLeakInSpanishManuscript(parsedManuscript.text, parsedManuscript.cues))) return [3 /*break*/, 13];
                            rewritePrompt = this.buildSpanishManuscriptRewritePrompt(parsedManuscript.text, parsedManuscript.cues);
                            return [4 /*yield*/, this.llmService.generateCompletion(rewritePrompt, userId, {
                                    maxTokens: targetTokens,
                                    temperature: 0.2,
                                    timeoutMs: manuscriptTimeoutMs,
                                })];
                        case 12:
                            rewrittenResponse = _g.sent();
                            this.logLlmOutput('manuscript:spanish-rewrite', rewrittenResponse);
                            parsedManuscript = this.normalizeManuscriptForWorkspace(workspace, this.parseGeneratedManuscriptResponse(rewrittenResponse, normalizedOptions));
                            _g.label = 13;
                        case 13:
                            if (!this.hasUsableManuscriptText(parsedManuscript.text)) {
                                if (!usedFallback) {
                                    throw new common_1.BadRequestException('Unable to generate a usable manuscript draft. Please regenerate.');
                                }
                                parsedManuscript = this.buildManuscriptGuardrailFallback(workspace, selectedOutline, normalizedOptions);
                            }
                            quality = this.assessManuscriptQuality(parsedManuscript.text, normalizedOptions);
                            repairAttemptsExecuted = 0;
                            _g.label = 14;
                        case 14:
                            if (!(!usedFallback && quality.needsRepair && repairAttemptsExecuted < 2)) return [3 /*break*/, 18];
                            currentQuality = quality;
                            shouldPrioritizeLength = currentQuality.issues.includes('too_short');
                            repairPrompt = shouldPrioritizeLength
                                ? this.buildManuscriptExpansionPrompt(workspace, parsedManuscript.text, parsedManuscript.cues, normalizedOptions)
                                : this.buildManuscriptQualityRepairPrompt(workspace, parsedManuscript.text, parsedManuscript.cues, normalizedOptions, currentQuality.issues, currentQuality.repetition.repeatedSentence);
                            return [4 /*yield*/, this.llmService.generateCompletion(repairPrompt, userId, {
                                    maxTokens: targetTokens,
                                    temperature: shouldPrioritizeLength ? 0.4 : 0.35,
                                    timeoutMs: manuscriptTimeoutMs,
                                })];
                        case 15:
                            repairedResponse = _g.sent();
                            repairAttemptsExecuted += 1;
                            this.logLlmOutput("manuscript:quality-repair:".concat(repairAttemptsExecuted), repairedResponse);
                            candidateManuscript = this.normalizeManuscriptForWorkspace(workspace, this.parseGeneratedManuscriptResponse(repairedResponse, normalizedOptions));
                            if (!this.hasUsableManuscriptText(candidateManuscript.text)) {
                                return [3 /*break*/, 18];
                            }
                            if (!(workspace.language === 'es' && this.hasEnglishLeakInSpanishManuscript(candidateManuscript.text, candidateManuscript.cues))) return [3 /*break*/, 17];
                            rewritePrompt = this.buildSpanishManuscriptRewritePrompt(candidateManuscript.text, candidateManuscript.cues);
                            return [4 /*yield*/, this.llmService.generateCompletion(rewritePrompt, userId, {
                                    maxTokens: targetTokens,
                                    temperature: 0.2,
                                    timeoutMs: manuscriptTimeoutMs,
                                })];
                        case 16:
                            rewrittenResponse = _g.sent();
                            this.logLlmOutput("manuscript:quality-repair:".concat(repairAttemptsExecuted, ":spanish-rewrite"), rewrittenResponse);
                            candidateManuscript = this.normalizeManuscriptForWorkspace(workspace, this.parseGeneratedManuscriptResponse(rewrittenResponse, normalizedOptions));
                            if (!this.hasUsableManuscriptText(candidateManuscript.text)) {
                                return [3 /*break*/, 18];
                            }
                            _g.label = 17;
                        case 17:
                            candidateQuality = this.assessManuscriptQuality(candidateManuscript.text, normalizedOptions);
                            if (!this.isQualityImprovement(currentQuality, candidateQuality)) {
                                return [3 /*break*/, 18];
                            }
                            parsedManuscript = candidateManuscript;
                            quality = candidateQuality;
                            return [3 /*break*/, 14];
                        case 18:
                            if (!this.hasUsableManuscriptText(parsedManuscript.text)) {
                                throw new common_1.BadRequestException('Unable to generate a usable manuscript draft. Please regenerate.');
                            }
                            plainText = this.stripHtmlForWordCount(parsedManuscript.text);
                            wordCount = this.countWords(plainText);
                            estimatedMinutes = Math.max(1, Math.ceil(wordCount / this.manuscriptWpm));
                            cueCount = Object.values(parsedManuscript.cues || {}).reduce(function (sum, list) { return sum + (Array.isArray(list) ? list.length : 0); }, 0);
                            cueAnchors = this.buildCueAnchorsFromManuscriptHtml(parsedManuscript.text, parsedManuscript.cues);
                            if (!((normalizedOptions.includeSlideCues || normalizedOptions.includeKeyLines) && cueCount < 2)) return [3 /*break*/, 22];
                            _g.label = 19;
                        case 19:
                            _g.trys.push([19, 21, , 22]);
                            refreshPrompt = this.buildManuscriptCueRefreshPrompt(workspace, parsedManuscript.text);
                            return [4 /*yield*/, this.llmService.generateCompletion(refreshPrompt, userId, {
                                    temperature: 0.2,
                                    maxTokens: 1400,
                                    timeoutMs: manuscriptTimeoutMs,
                                })];
                        case 20:
                            refreshResponse = _g.sent();
                            this.logLlmOutput('manuscript:cues-auto-refresh', refreshResponse);
                            refreshedCues = this.sanitizeCueObject(this.parseJsonSafe(refreshResponse) || {});
                            if (workspace.language === 'es') {
                                refreshedCues = {
                                    slide: refreshedCues.slide.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    keyLine: refreshedCues.keyLine.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    transition: refreshedCues.transition.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    pause: refreshedCues.pause.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    read: refreshedCues.read.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    quote: refreshedCues.quote.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    cta: refreshedCues.cta.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                };
                            }
                            parsedManuscript = __assign(__assign({}, parsedManuscript), { cues: __assign(__assign({}, refreshedCues), { slide: normalizedOptions.includeSlideCues ? refreshedCues.slide : [], keyLine: normalizedOptions.includeKeyLines ? refreshedCues.keyLine : [] }) });
                            return [3 /*break*/, 22];
                        case 21:
                            error_4 = _g.sent();
                            console.warn("[manuscript:cues-auto-refresh] skipped: ".concat((error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'unknown error'));
                            return [3 /*break*/, 22];
                        case 22:
                            manuscript = this.manuscriptRepository.create({
                                workspaceId: workspaceId,
                                outlineId: outlineId,
                                content: {
                                    formatVersion: 'v2',
                                    text: parsedManuscript.text,
                                    cues: parsedManuscript.cues,
                                    metadata: {
                                        title: this.asString((outline === null || outline === void 0 ? void 0 : outline.title) || (workspace === null || workspace === void 0 ? void 0 : workspace.title) || 'Manuscript'),
                                        options: normalizedOptions,
                                        generatedFromOutlineId: outlineId,
                                        cueAnchors: cueAnchors,
                                        cueAnchorUpdatedAt: new Date().toISOString(),
                                        quality: {
                                            wordCount: wordCount,
                                            targetWords: quality.targets.targetWords,
                                            minWords: quality.targets.minWords,
                                            maxWords: quality.targets.maxWords,
                                            finalIssues: quality.issues,
                                            status: quality.issues.length ? 'needs_review' : 'ok',
                                            repairAttempts: repairAttemptsExecuted,
                                            warningMessage: this.buildManuscriptQualityWarningMessage(quality.issues, workspace.language || 'en'),
                                        },
                                    },
                                },
                                contentFormat: 'html',
                                wordCount: wordCount,
                                estimatedMinutes: estimatedMinutes,
                            });
                            if (quality.issues.length) {
                                this.manuscriptSoftGateSaveCount += 1;
                                console.warn('[manuscript-soft-gate]', JSON.stringify({
                                    tag: 'manuscript_soft_gate_save',
                                    counter: this.manuscriptSoftGateSaveCount,
                                    workspaceId: workspaceId,
                                    outlineId: outlineId,
                                    issues: quality.issues,
                                    wordCount: wordCount,
                                    targetWords: quality.targets.targetWords,
                                    minWords: quality.targets.minWords,
                                    maxWords: quality.targets.maxWords,
                                    repairAttempts: repairAttemptsExecuted,
                                }));
                            }
                            return [4 /*yield*/, this.manuscriptRepository.insert(manuscript)];
                        case 23:
                            insertResult = _g.sent();
                            if (!((_f = (_e = insertResult.identifiers) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.id)) return [3 /*break*/, 25];
                            return [4 /*yield*/, this.manuscriptRepository.findOne({ where: { id: insertResult.identifiers[0].id } })];
                        case 24:
                            _b = _g.sent();
                            return [3 /*break*/, 26];
                        case 25:
                            _b = null;
                            _g.label = 26;
                        case 26:
                            saved = _b;
                            if (!saved) {
                                throw new common_1.BadRequestException('Manuscript generation succeeded but the saved manuscript could not be reloaded.');
                            }
                            workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { activeOutlineId: outlineId, activeManuscriptId: saved.id });
                            return [4 /*yield*/, this.workspaceRepository.update(workspace.id, {
                                    metadata: workspace.metadata,
                                })];
                        case 27:
                            _g.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.regenerateManuscriptCues = function (workspaceId, manuscriptId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, manuscript, manuscriptHtml, prompt, response, parsed, cues;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _d.sent();
                            manuscript = (workspace.manuscripts || []).find(function (item) { return item.id === manuscriptId; });
                            if (!manuscript) {
                                throw new common_1.BadRequestException('Manuscript not found in this workspace.');
                            }
                            manuscriptHtml = this.asString(((_a = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _a === void 0 ? void 0 : _a.text) || '');
                            if (!manuscriptHtml) {
                                throw new common_1.BadRequestException('Manuscript has no content to extract cues from.');
                            }
                            prompt = this.buildManuscriptCueRefreshPrompt(workspace, manuscriptHtml);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId, {
                                    temperature: 0.2,
                                    maxTokens: 1400,
                                })];
                        case 2:
                            response = _d.sent();
                            this.logLlmOutput('manuscript:cues-regenerate', response);
                            parsed = this.parseJsonSafe(response);
                            cues = this.sanitizeCueObject((parsed === null || parsed === void 0 ? void 0 : parsed.cues) || parsed || {});
                            if (workspace.language === 'es') {
                                cues = {
                                    slide: cues.slide.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    keyLine: cues.keyLine.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    transition: cues.transition.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    pause: cues.pause.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    read: cues.read.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    quote: cues.quote.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                    cta: cues.cta.map(function (item) { return _this.normalizeSpanishManuscriptLabels(item); }),
                                };
                            }
                            cues = this.sanitizeOutputForLens(cues, workspace);
                            manuscript.content = __assign(__assign({}, (manuscript.content || {})), { formatVersion: ((_b = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _b === void 0 ? void 0 : _b.formatVersion) || 'v2', text: manuscriptHtml, cues: cues, metadata: __assign(__assign({}, (((_c = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _c === void 0 ? void 0 : _c.metadata) || {})), { cuesRegeneratedAt: new Date().toISOString() }) });
                            return [2 /*return*/, this.manuscriptRepository.save(manuscript)];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateApplications = function (workspaceId, userId, promptOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, outline, mainPoints, pointNodes, seededApplications, audienceTypes, applications, _i, audienceTypes_1, audienceType, prompt_6, response, appTexts, i, application, _a, _b;
                var _this = this;
                var _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _f.sent();
                            if (!Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) || workspace.studyReports.length === 0) {
                                throw new common_1.BadRequestException('Generate the Study Report first before creating applications.');
                            }
                            return [4 /*yield*/, this.applicationRepository.delete({ workspaceId: workspaceId })];
                        case 2:
                            _f.sent();
                            outline = ((_c = workspace.outlines) === null || _c === void 0 ? void 0 : _c.find(function (item) { return item.isSelected; })) || ((_d = workspace.outlines) === null || _d === void 0 ? void 0 : _d[0]);
                            mainPoints = this.extractOutlinePointTexts((outline === null || outline === void 0 ? void 0 : outline.structure) || {});
                            pointNodes = Array.isArray((_e = outline === null || outline === void 0 ? void 0 : outline.structure) === null || _e === void 0 ? void 0 : _e.pointNodes) ? outline.structure.pointNodes : [];
                            seededApplications = Array.from(new Set(pointNodes.flatMap(function (point) { return _this.asStringArray(point === null || point === void 0 ? void 0 : point.applications, 4); }))).slice(0, 12);
                            audienceTypes = this.resolveApplicationAudienceTypes(workspace);
                            applications = [];
                            _i = 0, audienceTypes_1 = audienceTypes;
                            _f.label = 3;
                        case 3:
                            if (!(_i < audienceTypes_1.length)) return [3 /*break*/, 9];
                            audienceType = audienceTypes_1[_i];
                            prompt_6 = promptOverride
                                ? this.applyAudiencePrompt(promptOverride, audienceType)
                                : this.buildApplicationsPrompt(workspace, mainPoints, audienceType, seededApplications);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt_6, userId)];
                        case 4:
                            response = _f.sent();
                            this.logLlmOutput("applications:".concat(audienceType), response);
                            appTexts = this.parseListFromResponse(response);
                            i = 0;
                            _f.label = 5;
                        case 5:
                            if (!(i < appTexts.length)) return [3 /*break*/, 8];
                            application = this.applicationRepository.create({
                                workspaceId: workspaceId,
                                audienceType: audienceType,
                                content: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(appTexts[i]) : appTexts[i],
                                orderIndex: i,
                            });
                            _b = (_a = applications).push;
                            return [4 /*yield*/, this.applicationRepository.save(application)];
                        case 6:
                            _b.apply(_a, [_f.sent()]);
                            _f.label = 7;
                        case 7:
                            i++;
                            return [3 /*break*/, 5];
                        case 8:
                            _i++;
                            return [3 /*break*/, 3];
                        case 9: return [2 /*return*/, applications];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateDiscussionQuestions = function (workspaceId, userId, promptOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, outline, pointNodes, seededQuestions, prompt, response, parsed, parsedQuestions, fallbackQuestions, questionTexts, finalQuestionTexts, questions, i, question, _a, _b, latestReport, latestSections, latestStudyAssets, latestCategoryAssets;
                var _this = this;
                var _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _g.sent();
                            if (!Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) || workspace.studyReports.length === 0) {
                                throw new common_1.BadRequestException('Generate the Study Report first before creating discussion questions.');
                            }
                            return [4 /*yield*/, this.questionRepository.delete({ workspaceId: workspaceId })];
                        case 2:
                            _g.sent();
                            outline = ((_c = workspace.outlines) === null || _c === void 0 ? void 0 : _c.find(function (item) { return item.isSelected; })) || ((_d = workspace.outlines) === null || _d === void 0 ? void 0 : _d[0]);
                            pointNodes = Array.isArray((_e = outline === null || outline === void 0 ? void 0 : outline.structure) === null || _e === void 0 ? void 0 : _e.pointNodes) ? outline.structure.pointNodes : [];
                            seededQuestions = Array.from(new Set(pointNodes.flatMap(function (point) { return _this.asStringArray(point === null || point === void 0 ? void 0 : point.discussionQuestions, 4); }))).slice(0, 12);
                            prompt = promptOverride || this.buildDiscussionPrompt(workspace, seededQuestions);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId)];
                        case 3:
                            response = _g.sent();
                            this.logLlmOutput('questions', response);
                            parsed = this.parseJsonSafe(response);
                            parsedQuestions = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray([], this.parseListFromResponse(response), true), (Array.isArray(parsed)
                                ? parsed
                                : Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.discussionQuestions)
                                    ? parsed.discussionQuestions
                                    : Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.questions)
                                        ? parsed.questions
                                        : []), true), seededQuestions, true).map(function (item) { return _this.asString(item).trim(); }).filter(Boolean))).slice(0, 12);
                            fallbackQuestions = this.buildDiscussionQuestionFallbacks(workspace, seededQuestions);
                            questionTexts = parsedQuestions.filter(function (item) { return item.split(/\s+/).filter(Boolean).length >= 5; });
                            finalQuestionTexts = questionTexts.length >= 6 ? questionTexts : fallbackQuestions;
                            questions = [];
                            i = 0;
                            _g.label = 4;
                        case 4:
                            if (!(i < finalQuestionTexts.length)) return [3 /*break*/, 7];
                            question = this.questionRepository.create({
                                workspaceId: workspaceId,
                                question: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(finalQuestionTexts[i]) : finalQuestionTexts[i],
                                orderIndex: i,
                            });
                            _b = (_a = questions).push;
                            return [4 /*yield*/, this.questionRepository.save(question)];
                        case 5:
                            _b.apply(_a, [_g.sent()]);
                            _g.label = 6;
                        case 6:
                            i++;
                            return [3 /*break*/, 4];
                        case 7:
                            latestReport = ((_f = workspace.studyReports) === null || _f === void 0 ? void 0 : _f[0]) || null;
                            if (!latestReport) return [3 /*break*/, 9];
                            latestSections = latestReport.sections || {};
                            latestStudyAssets = latestSections.studyAssets || {};
                            latestCategoryAssets = latestStudyAssets.categoryAssets || {};
                            latestReport.sections = __assign(__assign({}, latestSections), { studyAssets: __assign(__assign({}, latestStudyAssets), { categoryAssets: __assign(__assign({}, latestCategoryAssets), { discussionQuestions: finalQuestionTexts }), discussionQuestions: finalQuestionTexts }) });
                            return [4 /*yield*/, this.studyReportRepository.save(latestReport)];
                        case 8:
                            _g.sent();
                            _g.label = 9;
                        case 9: return [2 /*return*/, questions];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateIllustrations = function (workspaceId, userId, promptOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, outline, mainPoints, pointNodes, seededIllustrations, prompt, response, parsed, fallbackItems, items, illustrations, decodeLooseField, cleanIllustrationText, _i, items_1, item, rawItem, title, looseContent, content, source, tags, tagsRaw, verseMatch, illustration, _a, _b, fallbackIllustrations, _c, fallbackIllustrations_1, item, illustration, _d, _e;
                var _this = this;
                var _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _k.sent();
                            if (!Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) || workspace.studyReports.length === 0) {
                                throw new common_1.BadRequestException('Generate the Study Report first before creating illustration ideas.');
                            }
                            return [4 /*yield*/, this.illustrationRepository.delete({ workspaceId: workspaceId })];
                        case 2:
                            _k.sent();
                            outline = ((_f = workspace.outlines) === null || _f === void 0 ? void 0 : _f.find(function (item) { return item.isSelected; })) || ((_g = workspace.outlines) === null || _g === void 0 ? void 0 : _g[0]);
                            mainPoints = this.extractOutlinePointTexts((outline === null || outline === void 0 ? void 0 : outline.structure) || {});
                            pointNodes = Array.isArray((_h = outline === null || outline === void 0 ? void 0 : outline.structure) === null || _h === void 0 ? void 0 : _h.pointNodes) ? outline.structure.pointNodes : [];
                            seededIllustrations = Array.from(new Set(pointNodes.flatMap(function (point) { return _this.asStringArray(point === null || point === void 0 ? void 0 : point.illustrationIdeas, 4); }))).slice(0, 12);
                            prompt = promptOverride || this.buildIllustrationsPrompt(workspace, mainPoints, seededIllustrations);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId)];
                        case 3:
                            response = _k.sent();
                            this.logLlmOutput('illustrations', response);
                            parsed = this.parseJsonSafe(response);
                            fallbackItems = this.parseIllustrationsFromResponse(response);
                            items = Array.isArray(parsed)
                                ? parsed
                                : parsed && typeof parsed === 'object'
                                    ? ((Array.isArray(parsed.illustrations) && parsed.illustrations) ||
                                        (Array.isArray(parsed.items) && parsed.items) ||
                                        (Array.isArray(parsed.data) && parsed.data) ||
                                        fallbackItems)
                                    : fallbackItems;
                            illustrations = [];
                            decodeLooseField = function (source, key) {
                                var value = _this.asString(source);
                                if (!value)
                                    return '';
                                var pattern = new RegExp("[\"'`]?".concat(key, "[\"'`]?\\s*[:=]\\s*[\"\u201C]?([\\s\\S]*?)[\"\u201D]?(?=\\n\\s*[\"'`]?(?:title|content|description|text|verseReference|source|tags)[\"'`]?\\s*[:=]|\\n{2,}|$)"), 'i');
                                var match = value.match(pattern);
                                return _this.asString((match === null || match === void 0 ? void 0 : match[1]) || '').trim();
                            };
                            cleanIllustrationText = function (value) {
                                return _this.asString(value)
                                    .replace(/\r/g, '')
                                    .replace(/^\s*["'`]?((title|content|description|text))["'`]?\s*[:=]\s*["'`]?/i, '')
                                    .replace(/\n+\s*["'`]?(verseReference|source|tags)["'`]?\s*[:=][\s\S]*$/i, '')
                                    .replace(/\s*["'`]?(verseReference|source|tags)["'`]?\s*[:=][\s\S]*$/i, '')
                                    .replace(/^[`"'“”]+|[`"',“”\]]+$/g, '')
                                    .trim();
                            };
                            _i = 0, items_1 = items;
                            _k.label = 4;
                        case 4:
                            if (!(_i < items_1.length)) return [3 /*break*/, 7];
                            item = items_1[_i];
                            rawItem = typeof item === 'string' ? this.asString(item) : this.asString(JSON.stringify(item));
                            title = this.asString((item === null || item === void 0 ? void 0 : item.title) || decodeLooseField(rawItem, 'title'));
                            looseContent = decodeLooseField(rawItem, 'content') || decodeLooseField(rawItem, 'description');
                            content = cleanIllustrationText((item === null || item === void 0 ? void 0 : item.content) || (item === null || item === void 0 ? void 0 : item.text) || (item === null || item === void 0 ? void 0 : item.description) || looseContent || rawItem);
                            source = this.asString((item === null || item === void 0 ? void 0 : item.source) ||
                                (item === null || item === void 0 ? void 0 : item.verseReference) ||
                                ((_j = item === null || item === void 0 ? void 0 : item.verseReferences) === null || _j === void 0 ? void 0 : _j[0]) ||
                                decodeLooseField(rawItem, 'verseReference') ||
                                decodeLooseField(rawItem, 'source'));
                            tags = Array.isArray(item === null || item === void 0 ? void 0 : item.tags)
                                ? item.tags.map(function (tag) { return _this.asString(tag); }).filter(Boolean).slice(0, 8)
                                : [];
                            if (!tags.length) {
                                tagsRaw = decodeLooseField(rawItem, 'tags');
                                if (tagsRaw) {
                                    tags = tagsRaw
                                        .replace(/^\[|\]$/g, '')
                                        .split(/[,\|]/)
                                        .map(function (tag) { return _this.asString(tag).replace(/^["'`]+|["'`]+$/g, ''); })
                                        .filter(Boolean)
                                        .slice(0, 8);
                                }
                            }
                            if (!source) {
                                verseMatch = content.match(/\b(?:[1-3]\s*)?[A-Za-zÁÉÍÓÚáéíóúñÑ]+\s+\d+:\d+(?:-\d+)?\b/);
                                if (verseMatch === null || verseMatch === void 0 ? void 0 : verseMatch[0]) {
                                    source = verseMatch[0];
                                    content = cleanIllustrationText(content.replace(verseMatch[0], ''));
                                }
                            }
                            if (!content)
                                return [3 /*break*/, 6];
                            illustration = this.illustrationRepository.create({
                                workspaceId: workspaceId,
                                title: title || null,
                                content: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(content) : content,
                                source: source || null,
                                relatedPoint: item.relatedPoint || null,
                                tags: tags.length ? tags : null,
                            });
                            _b = (_a = illustrations).push;
                            return [4 /*yield*/, this.illustrationRepository.save(illustration)];
                        case 5:
                            _b.apply(_a, [_k.sent()]);
                            _k.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7:
                            if (!!illustrations.length) return [3 /*break*/, 11];
                            fallbackIllustrations = this.buildIllustrationFallbackItems(workspace, mainPoints, seededIllustrations);
                            _c = 0, fallbackIllustrations_1 = fallbackIllustrations;
                            _k.label = 8;
                        case 8:
                            if (!(_c < fallbackIllustrations_1.length)) return [3 /*break*/, 11];
                            item = fallbackIllustrations_1[_c];
                            illustration = this.illustrationRepository.create({
                                workspaceId: workspaceId,
                                title: item.title || null,
                                content: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(item.content) : item.content,
                                source: item.source || null,
                                relatedPoint: item.relatedPoint || null,
                                tags: Array.isArray(item.tags) && item.tags.length ? item.tags : null,
                            });
                            _e = (_d = illustrations).push;
                            return [4 /*yield*/, this.illustrationRepository.save(illustration)];
                        case 9:
                            _e.apply(_d, [_k.sent()]);
                            _k.label = 10;
                        case 10:
                            _c++;
                            return [3 /*break*/, 8];
                        case 11: return [2 /*return*/, illustrations];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateCitations = function (workspaceId, userId, promptOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, prompt, response, error_5, parsed, items, citations, _i, items_2, item, verseReferences, citation, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _c.sent();
                            return [4 /*yield*/, this.citationRepository.delete({ workspaceId: workspaceId })];
                        case 2:
                            _c.sent();
                            prompt = promptOverride || this.buildCitationsPrompt(workspace);
                            response = '';
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId)];
                        case 4:
                            response = _c.sent();
                            this.logLlmOutput('citations', response);
                            return [3 /*break*/, 6];
                        case 5:
                            error_5 = _c.sent();
                            console.warn('Citations generation failed, using fallback citations.', error_5);
                            return [3 /*break*/, 6];
                        case 6:
                            parsed = this.parseJsonSafe(response) || this.parseCitationsFromResponse(response);
                            items = Array.isArray(parsed) && parsed.length ? parsed : this.buildCitationFallbackItems(workspace);
                            citations = [];
                            _i = 0, items_2 = items;
                            _c.label = 7;
                        case 7:
                            if (!(_i < items_2.length)) return [3 /*break*/, 10];
                            item = items_2[_i];
                            verseReferences = this.buildGuardrailProfile(workspace).active
                                ? this.sanitizeGuardrailedReferenceList(item.verseReferences, workspace)
                                : Array.isArray(item.verseReferences)
                                    ? item.verseReferences
                                    : null;
                            citation = this.citationRepository.create({
                                workspaceId: workspaceId,
                                statementType: this.normalizeStatementType(item.statementType),
                                statement: workspace.language === 'es'
                                    ? this.normalizeSpanishGeneratedText(item.statement || item.text || '')
                                    : item.statement || item.text || '',
                                verseReferences: verseReferences,
                                externalSources: Array.isArray(item.externalSources) ? item.externalSources : null,
                                isVerified: false,
                            });
                            _b = (_a = citations).push;
                            return [4 /*yield*/, this.citationRepository.save(citation)];
                        case 8:
                            _b.apply(_a, [_c.sent()]);
                            _c.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 7];
                        case 10: return [2 /*return*/, citations];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateStudyReport = function (workspaceId, userId, promptOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, mainPassage, passageText, studyInputs, prompt, response, parsed, error_6, baseSections, normalizedSections, completeness, hasRichStudyInputs, repairPrompt, repairResponse, repairedParsed, error_7, mergedSections, report, savedReport;
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return __generator(this, function (_p) {
                    switch (_p.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _p.sent();
                            return [4 /*yield*/, this.scriptureService.getPassage(workspace.mainPassage)];
                        case 2:
                            mainPassage = _p.sent();
                            passageText = Array.isArray(mainPassage === null || mainPassage === void 0 ? void 0 : mainPassage.verses)
                                ? mainPassage.verses.map(function (verse) { return "".concat(verse.reference, " ").concat(verse.text); }).join('\n')
                                : JSON.stringify(mainPassage || {});
                            return [4 /*yield*/, this.buildStudyReportInputContext(workspace, passageText)];
                        case 3:
                            studyInputs = _p.sent();
                            prompt = promptOverride || this.buildStudyReportPrompt(workspace, passageText, studyInputs);
                            response = null;
                            parsed = null;
                            _p.label = 4;
                        case 4:
                            _p.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId, {
                                    temperature: 0.35,
                                    maxTokens: 1600,
                                    timeoutMs: 40000,
                                    localMaxAttempts: 1,
                                })];
                        case 5:
                            response = _p.sent();
                            this.logLlmOutput('study-report', response);
                            parsed = this.parseJsonSafe(response);
                            return [3 /*break*/, 7];
                        case 6:
                            error_6 = _p.sent();
                            console.warn("[study-report] LLM fallback activated: ".concat((error_6 === null || error_6 === void 0 ? void 0 : error_6.message) || 'unknown error'));
                            response = null;
                            parsed = null;
                            return [3 /*break*/, 7];
                        case 7:
                            baseSections = this.buildStudyReportBaseSections(studyInputs, workspace.language || 'en');
                            normalizedSections = this.normalizeStudyReportSections(__assign(__assign({}, baseSections), (parsed && typeof parsed === 'object' ? parsed : {})));
                            completeness = this.assessStudyReportCompleteness(normalizedSections);
                            hasRichStudyInputs = !!((_a = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _a === void 0 ? void 0 : _a.passageSummary) ||
                                !!((_b = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _b === void 0 ? void 0 : _b.structuralAnalysis) ||
                                !!((_c = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _c === void 0 ? void 0 : _c.interpretiveChallenges) ||
                                !!((_d = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _d === void 0 ? void 0 : _d.studySynthesis) ||
                                !!((_e = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _e === void 0 ? void 0 : _e.wordStudy);
                            if (!(completeness.isSparse && hasRichStudyInputs)) return [3 /*break*/, 11];
                            repairPrompt = "".concat(this.buildStudyReportPrompt(workspace, passageText, studyInputs), "\n\nCRITICAL FIX:\n- Previous result left required fields empty.\n- Fill every required field with concrete passage-grounded content.\n- Do not leave required sections blank.");
                            _p.label = 8;
                        case 8:
                            _p.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, this.llmService.generateCompletion(repairPrompt, userId, {
                                    temperature: 0.3,
                                    maxTokens: 1200,
                                    timeoutMs: 30000,
                                    localMaxAttempts: 1,
                                })];
                        case 9:
                            repairResponse = _p.sent();
                            this.logLlmOutput('study-report:repair', repairResponse);
                            repairedParsed = this.parseJsonSafe(repairResponse);
                            normalizedSections = this.normalizeStudyReportSections(__assign(__assign({}, baseSections), (repairedParsed && typeof repairedParsed === 'object' ? repairedParsed : {})));
                            completeness = this.assessStudyReportCompleteness(normalizedSections);
                            return [3 /*break*/, 11];
                        case 10:
                            error_7 = _p.sent();
                            console.warn("[study-report:repair] fallback activated: ".concat((error_7 === null || error_7 === void 0 ? void 0 : error_7.message) || 'unknown error'));
                            return [3 /*break*/, 11];
                        case 11:
                            if (completeness.isSparse) {
                                normalizedSections = this.hydrateSparseStudyReportSections(workspace, normalizedSections);
                            }
                            this.validateGenerationResult('study-report', normalizedSections);
                            mergedSections = __assign(__assign({}, normalizedSections), { egw: (studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.egwSection) || (normalizedSections === null || normalizedSections === void 0 ? void 0 : normalizedSections.egw) || null, studyAssets: this.normalizeStudyAssets(__assign(__assign({}, (parsed && typeof parsed === 'object' ? parsed : {})), { egw: (studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.egwSection) || null }), (normalizedSections === null || normalizedSections === void 0 ? void 0 : normalizedSections.structureOfPassage) || [], workspace) });
                            if (this.isSpanishLanguage(workspace.language)) {
                                mergedSections = this.normalizeSpanishValueDeep(mergedSections);
                            }
                            report = this.studyReportRepository.create({
                                workspaceId: workspaceId,
                                sections: __assign(__assign({}, mergedSections), { _sources: {
                                        crossReferencesCount: Array.isArray((_f = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.referenceData) === null || _f === void 0 ? void 0 : _f.crossReferences)
                                            ? studyInputs.referenceData.crossReferences.length
                                            : 0,
                                        hasPassageSummary: !!((_g = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _g === void 0 ? void 0 : _g.passageSummary),
                                        hasStructuralAnalysis: !!((_h = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _h === void 0 ? void 0 : _h.structuralAnalysis),
                                        hasInterpretiveChallenges: !!((_j = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _j === void 0 ? void 0 : _j.interpretiveChallenges),
                                        hasCanonicalThemes: !!((_k = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _k === void 0 ? void 0 : _k.canonicalThemes),
                                        hasStudySynthesis: !!((_l = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _l === void 0 ? void 0 : _l.studySynthesis),
                                        hasWordStudy: !!((_m = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _m === void 0 ? void 0 : _m.wordStudy),
                                        hasCrossReferencesLookup: !!((_o = studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.cachedStudySections) === null || _o === void 0 ? void 0 : _o.crossReferencesLookup),
                                    } }),
                                rawResponse: parsed ? null : response,
                            });
                            return [4 /*yield*/, this.studyReportRepository.save(report)];
                        case 12:
                            savedReport = _p.sent();
                            return [4 /*yield*/, this.syncStudyAssetRecords(workspaceId, mergedSections.studyAssets)];
                        case 13:
                            _p.sent();
                            return [2 /*return*/, savedReport];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateSermonCore = function (workspaceId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, studyReport, languageLabel, theologicalLens, doctrinalContext, useGuardrailFallback, planningSummary, prompt, response, parsed, sermonCore, normalizedSermonCore;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _c.sent();
                            studyReport = ((_b = (_a = workspace.studyReports) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.sections) || {};
                            languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
                            theologicalLens = (0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens);
                            doctrinalContext = sda_alignment_1.SDAAlignmentService.getLensContext(theologicalLens);
                            useGuardrailFallback = this.buildGuardrailProfile(workspace).active;
                            planningSummary = this.buildWorkspacePlanningSummary(workspace);
                            prompt = workspaces_prompts_1.WorkspacesPrompts.sermonCore({
                                doctrinalContext: doctrinalContext,
                                guardrailBlock: useGuardrailFallback ? this.buildGuardrailPromptBlock(workspace) : undefined,
                                planningBlock: planningSummary ? "Planning: ".concat(planningSummary) : undefined,
                                mainPassage: workspace.mainPassage,
                                theme: workspace.theme || 'N/A',
                                sermonGoals: workspace.sermonGoals || 'N/A',
                                audienceProfile: workspace.audienceProfile || 'N/A',
                                mainTheologicalClaim: studyReport.mainTheologicalClaim || 'N/A',
                                theologicalThemesJson: JSON.stringify(studyReport.theologicalThemes || []),
                                pastoralImplicationsJson: JSON.stringify(studyReport.pastoralImplications || {}),
                                exegeticalSummary: studyReport.exegeticalSummary || 'N/A',
                                languageLabel: languageLabel,
                            });
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId, {
                                    temperature: 0.5,
                                    maxTokens: 800,
                                })];
                        case 2:
                            response = _c.sent();
                            parsed = this.parseJsonSafe(response);
                            sermonCore = {
                                bigIdea: this.asString((parsed === null || parsed === void 0 ? void 0 : parsed.bigIdea) || ''),
                                fallenCondition: this.asString((parsed === null || parsed === void 0 ? void 0 : parsed.fallenCondition) || ''),
                                centralTruth: this.asString((parsed === null || parsed === void 0 ? void 0 : parsed.centralTruth) || ''),
                                sermonGoal: this.asString((parsed === null || parsed === void 0 ? void 0 : parsed.sermonGoal) || ''),
                                audienceNeed: this.asString((parsed === null || parsed === void 0 ? void 0 : parsed.audienceNeed) || ''),
                            };
                            normalizedSermonCore = workspace.language === 'es' ? this.normalizeSpanishValueDeep(sermonCore) : sermonCore;
                            try {
                                this.validateGenerationResult('sermon-core', normalizedSermonCore);
                            }
                            catch (error) {
                                console.warn("[sermon-core] fallback activated: ".concat((error === null || error === void 0 ? void 0 : error.message) || 'unknown error'));
                                normalizedSermonCore = this.buildSermonCoreFallback(workspace, studyReport);
                                normalizedSermonCore =
                                    workspace.language === 'es' ? this.normalizeSpanishValueDeep(normalizedSermonCore) : normalizedSermonCore;
                                this.validateGenerationResult('sermon-core', normalizedSermonCore);
                            }
                            // Save to workspace
                            return [4 /*yield*/, this.workspaceRepository.update(workspaceId, {
                                    sermonCore: normalizedSermonCore,
                                })];
                        case 3:
                            // Save to workspace
                            _c.sent();
                            return [2 /*return*/, normalizedSermonCore];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.runIntegrityCheck = function (workspaceId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, selectedOutline, outlinePoints, applications, citations, report, updatedAt, integrityIssueLedger;
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _d.sent();
                            selectedOutline = ((_a = workspace.outlines) === null || _a === void 0 ? void 0 : _a.find(function (o) { return o.isSelected; })) || ((_b = workspace.outlines) === null || _b === void 0 ? void 0 : _b[0]);
                            outlinePoints = ((_c = selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.structure) === null || _c === void 0 ? void 0 : _c.points) || [];
                            applications = (workspace.applications || []).map(function (a) { return a.content; });
                            citations = (workspace.citations || []).map(function (c) { return ({
                                statement: c.statement,
                                verseReferences: c.verseReferences || [],
                            }); });
                            return [4 /*yield*/, this.sermonIntegrityService.analyzeSermonIntegrity({
                                    mainPassage: workspace.mainPassage,
                                    outlinePoints: outlinePoints,
                                    applications: applications,
                                    citations: citations,
                                    language: workspace.language || 'en',
                                })];
                        case 2:
                            report = _d.sent();
                            this.validateGenerationResult('integrity-check', report);
                            updatedAt = new Date().toISOString();
                            integrityIssueLedger = report.issues.map(function (issue, index) { return ({
                                id: _this.buildIntegrityIssueId(issue, index),
                                severity: issue.severity,
                                category: issue.category,
                                message: issue.message,
                                affectedItem: issue.affectedItem,
                                status: 'open',
                                updatedAt: updatedAt,
                            }); });
                            workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { integrityReport: __assign(__assign({}, report), { updatedAt: updatedAt }), integrityIssueLedger: integrityIssueLedger });
                            return [4 /*yield*/, this.workspaceRepository.save(workspace)];
                        case 3:
                            _d.sent();
                            return [2 /*return*/, report];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.generateMediaSuggestions = function (workspaceId, userId, promptOverride) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, mainPassage, passageText, studyInputs, latestReport, latestSections, normalizedSections, existingAssets, existingPrompts, prompt, parsed, rawResponse, response, error_8, rawSuggestions, mediaSuggestionCards, mergedAssets, mergedSections, selectedOutline, selectedManuscript, mediaPackGeneratedAt, mediaPack, persistedReport, created, nextMetadata;
                var _this = this;
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _j.sent();
                            if (!Array.isArray(workspace === null || workspace === void 0 ? void 0 : workspace.studyReports) || workspace.studyReports.length === 0) {
                                throw new common_1.BadRequestException('Generate the Study Report first before creating media suggestions.');
                            }
                            return [4 /*yield*/, this.scriptureService.getPassage(workspace.mainPassage)];
                        case 2:
                            mainPassage = _j.sent();
                            passageText = Array.isArray(mainPassage === null || mainPassage === void 0 ? void 0 : mainPassage.verses)
                                ? mainPassage.verses.map(function (verse) { return "".concat(verse.reference, " ").concat(verse.text); }).join('\n')
                                : JSON.stringify(mainPassage || {});
                            return [4 /*yield*/, this.buildStudyReportInputContext(workspace, passageText)];
                        case 3:
                            studyInputs = _j.sent();
                            latestReport = ((_a = workspace.studyReports) === null || _a === void 0 ? void 0 : _a[0]) || null;
                            latestSections = (latestReport === null || latestReport === void 0 ? void 0 : latestReport.sections) || {};
                            normalizedSections = this.normalizeStudyReportSections(Object.keys(latestSections).length ? latestSections : this.buildStudyReportBaseSections(studyInputs));
                            existingAssets = this.normalizeStudyAssets(__assign(__assign({}, normalizedSections), { studyAssets: (latestSections === null || latestSections === void 0 ? void 0 : latestSections.studyAssets) || null }), (normalizedSections === null || normalizedSections === void 0 ? void 0 : normalizedSections.structureOfPassage) || [], workspace);
                            existingPrompts = workspace.language === 'es'
                                ? []
                                : this.asStringArray((_b = existingAssets === null || existingAssets === void 0 ? void 0 : existingAssets.categoryAssets) === null || _b === void 0 ? void 0 : _b.mediaSuggestions, 24);
                            prompt = promptOverride ||
                                this.buildMediaSuggestionsPrompt(workspace, passageText, studyInputs, normalizedSections, existingPrompts);
                            parsed = null;
                            rawResponse = '';
                            _j.label = 4;
                        case 4:
                            _j.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId, {
                                    temperature: 0.3,
                                    maxTokens: 1700,
                                    timeoutMs: 40000,
                                    localMaxAttempts: 1,
                                })];
                        case 5:
                            response = _j.sent();
                            this.logLlmOutput('media-suggestions', response);
                            rawResponse = response;
                            parsed = this.parseJsonSafe(response);
                            return [3 /*break*/, 7];
                        case 6:
                            error_8 = _j.sent();
                            console.warn("[media-suggestions] LLM fallback activated: ".concat((error_8 === null || error_8 === void 0 ? void 0 : error_8.message) || 'unknown error'));
                            parsed = null;
                            return [3 /*break*/, 7];
                        case 7:
                            rawSuggestions = Array.isArray(parsed)
                                ? parsed
                                : Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.mediaSuggestions)
                                    ? parsed.mediaSuggestions
                                    : Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.suggestions)
                                        ? parsed.suggestions
                                        : [];
                            mediaSuggestionCards = this.normalizeMediaSuggestionCards(rawSuggestions, 24);
                            if (!mediaSuggestionCards.length) {
                                mediaSuggestionCards = this.extractMediaSuggestionCardsFromLooseResponse(rawResponse, 24);
                            }
                            if (!mediaSuggestionCards.length) {
                                mediaSuggestionCards = this.normalizeMediaSuggestionCards(((_c = existingAssets === null || existingAssets === void 0 ? void 0 : existingAssets.categoryAssets) === null || _c === void 0 ? void 0 : _c.mediaSuggestionCards) || [], 24);
                                if (!mediaSuggestionCards.length) {
                                    mediaSuggestionCards = this.asStringArray(((_d = existingAssets === null || existingAssets === void 0 ? void 0 : existingAssets.categoryAssets) === null || _d === void 0 ? void 0 : _d.mediaSuggestions) || [], 24)
                                        .map(function (item) { return ({
                                        type: 'Media',
                                        intent: workspace.language === 'es' ? 'Recurso sugerido' : 'Study prompt',
                                        prompt: _this.asString(item),
                                    }); })
                                        .filter(function (item) { return item.prompt; })
                                        .slice(0, 24);
                                }
                            }
                            if (workspace.language === 'es') {
                                mediaSuggestionCards = mediaSuggestionCards.map(function (item) { return (__assign(__assign({}, item), { intent: _this.normalizeSpanishGeneratedText(item.intent), useCase: _this.normalizeSpanishGeneratedText(item.useCase || ''), prompt: _this.normalizeSpanishGeneratedText(item.prompt) })); });
                            }
                            mergedAssets = __assign(__assign({}, existingAssets), { categoryAssets: __assign(__assign({}, ((existingAssets === null || existingAssets === void 0 ? void 0 : existingAssets.categoryAssets) || {})), { mediaSuggestionCards: mediaSuggestionCards, mediaSuggestions: mediaSuggestionCards.map(function (item) { return item.prompt; }).slice(0, 24) }) });
                            mergedSections = __assign(__assign({}, normalizedSections), { mediaSuggestionCards: mediaSuggestionCards, mediaSuggestions: mediaSuggestionCards.map(function (item) { return item.prompt; }).slice(0, 24), egw: (studyInputs === null || studyInputs === void 0 ? void 0 : studyInputs.egwSection) || (normalizedSections === null || normalizedSections === void 0 ? void 0 : normalizedSections.egw) || null, studyAssets: mergedAssets });
                            selectedOutline = ((_e = workspace.outlines) === null || _e === void 0 ? void 0 : _e.find(function (item) { return item.isSelected; })) || ((_f = workspace.outlines) === null || _f === void 0 ? void 0 : _f[0]) || null;
                            selectedManuscript = ((_g = workspace.manuscripts) === null || _g === void 0 ? void 0 : _g[0]) || null;
                            mediaPackGeneratedAt = new Date().toISOString();
                            mediaPack = {
                                status: 'ready',
                                generatedAt: mediaPackGeneratedAt,
                                sourceOutlineId: (selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.id) || null,
                                sourceManuscriptId: (selectedManuscript === null || selectedManuscript === void 0 ? void 0 : selectedManuscript.id) || null,
                                sourceStudyReportId: (latestReport === null || latestReport === void 0 ? void 0 : latestReport.id) || null,
                                slideCount: Array.isArray(mediaSuggestionCards) ? mediaSuggestionCards.length : 0,
                                audioEnabled: mediaSuggestionCards.length > 0,
                                musicEnabled: mediaSuggestionCards.length > 0,
                                videoEnabled: mediaSuggestionCards.length > 0,
                                exportPrepared: true,
                            };
                            if (!latestReport) return [3 /*break*/, 9];
                            latestReport.sections = mergedSections;
                            latestReport.rawResponse = null;
                            return [4 /*yield*/, this.studyReportRepository.save(latestReport)];
                        case 8:
                            persistedReport = _j.sent();
                            return [3 /*break*/, 11];
                        case 9:
                            created = this.studyReportRepository.create({
                                workspaceId: workspaceId,
                                sections: mergedSections,
                                rawResponse: null,
                            });
                            return [4 /*yield*/, this.studyReportRepository.save(created)];
                        case 10:
                            persistedReport = _j.sent();
                            _j.label = 11;
                        case 11:
                            nextMetadata = __assign(__assign({}, (workspace.metadata || {})), { mediaPack: mediaPack, exportPack: {
                                    status: 'ready',
                                    generatedAt: mediaPack.generatedAt,
                                    sourceOutlineId: mediaPack.sourceOutlineId,
                                    sourceManuscriptId: mediaPack.sourceManuscriptId,
                                    sourceStudyReportId: mediaPack.sourceStudyReportId,
                                    artifacts: [
                                        {
                                            type: 'pptx',
                                            label: 'Slide deck (PPTX)',
                                            status: 'ready',
                                            filename: "sermon-deck-".concat(workspaceId, ".pptx"),
                                            sourceOutlineId: mediaPack.sourceOutlineId,
                                            sourceManuscriptId: mediaPack.sourceManuscriptId,
                                            sourceStudyReportId: mediaPack.sourceStudyReportId,
                                        },
                                        {
                                            type: 'pdf',
                                            label: 'Slide deck (PDF)',
                                            status: 'ready',
                                            filename: "sermon-deck-".concat(workspaceId, ".pdf"),
                                            sourceOutlineId: mediaPack.sourceOutlineId,
                                            sourceManuscriptId: mediaPack.sourceManuscriptId,
                                            sourceStudyReportId: mediaPack.sourceStudyReportId,
                                        },
                                        {
                                            type: 'docx',
                                            label: 'Manuscript (DOCX)',
                                            status: 'ready',
                                            filename: "sermon-manuscript-".concat(workspaceId, ".docx"),
                                            sourceOutlineId: mediaPack.sourceOutlineId,
                                            sourceManuscriptId: mediaPack.sourceManuscriptId,
                                            sourceStudyReportId: mediaPack.sourceStudyReportId,
                                        },
                                        {
                                            type: 'study-report',
                                            label: 'Study report export',
                                            status: 'ready',
                                            filename: "study-report-".concat(workspaceId, ".md"),
                                            sourceOutlineId: mediaPack.sourceOutlineId,
                                            sourceManuscriptId: mediaPack.sourceManuscriptId,
                                            sourceStudyReportId: mediaPack.sourceStudyReportId,
                                        },
                                    ],
                                }, deliverables: __assign(__assign({}, (((_h = workspace.metadata) === null || _h === void 0 ? void 0 : _h.deliverables) || {})), { mediaPack: mediaPack, export: {
                                        status: 'ready',
                                        sourceOutlineId: mediaPack.sourceOutlineId,
                                        sourceManuscriptId: mediaPack.sourceManuscriptId,
                                        sourceStudyReportId: mediaPack.sourceStudyReportId,
                                        generatedAt: mediaPack.generatedAt,
                                    } }) });
                            workspace.metadata = nextMetadata;
                            return [4 /*yield*/, this.workspaceRepository.update(workspaceId, { metadata: nextMetadata })];
                        case 12:
                            _j.sent();
                            return [2 /*return*/, persistedReport];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.validateCitations = function (workspaceId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (workspaceId, userId, translationCode) {
                var workspace, citations, results, stopWords, _i, citations_1, citation, verseRefs, errors, _loop_2, this_1, _a, verseRefs_1, verseRef, isVerified;
                var _b;
                if (translationCode === void 0) { translationCode = 'KJV'; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _c.sent();
                            citations = (workspace === null || workspace === void 0 ? void 0 : workspace.citations) || [];
                            results = [];
                            stopWords = new Set([
                                'the', 'and', 'for', 'that', 'with', 'from', 'this', 'these', 'those', 'are', 'was', 'were', 'has', 'have',
                                'had', 'not', 'but', 'you', 'your', 'his', 'her', 'their', 'they', 'them', 'our', 'its', 'into', 'over',
                                'under', 'upon', 'within', 'about', 'after', 'before', 'through', 'because', 'while', 'when', 'then',
                            ]);
                            _i = 0, citations_1 = citations;
                            _c.label = 2;
                        case 2:
                            if (!(_i < citations_1.length)) return [3 /*break*/, 9];
                            citation = citations_1[_i];
                            verseRefs = Array.isArray(citation.verseReferences) ? citation.verseReferences : [];
                            errors = [];
                            _loop_2 = function (verseRef) {
                                var passage, passageTranslation, passageText_1, statementTokens, matched, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            _e.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this_1.scriptureService.getPassage(verseRef, translationCode)];
                                        case 1:
                                            passage = _e.sent();
                                            if (!passage || !((_b = passage.verses) === null || _b === void 0 ? void 0 : _b.length)) {
                                                errors.push("Missing verse: ".concat(verseRef));
                                            }
                                            else if (citation.statement) {
                                                passageTranslation = (passage.translation || passage.translation_id || passage.translationId || '').toString();
                                                if (passageTranslation && passageTranslation.toLowerCase() !== translationCode.toLowerCase()) {
                                                    errors.push("Translation mismatch for ".concat(verseRef));
                                                }
                                                passageText_1 = passage.verses.map(function (verse) { return verse.text || ''; }).join(' ').toLowerCase();
                                                statementTokens = citation.statement
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9\s]/g, '')
                                                    .split(/\s+/)
                                                    .filter(Boolean)
                                                    .filter(function (token) { return !stopWords.has(token); });
                                                matched = statementTokens.filter(function (token) { return passageText_1.includes(token); });
                                                if (statementTokens.length && matched.length === 0) {
                                                    errors.push("Unsupported claim for ".concat(verseRef));
                                                }
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _d = _e.sent();
                                            errors.push("Lookup failed: ".concat(verseRef));
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _a = 0, verseRefs_1 = verseRefs;
                            _c.label = 3;
                        case 3:
                            if (!(_a < verseRefs_1.length)) return [3 /*break*/, 6];
                            verseRef = verseRefs_1[_a];
                            return [5 /*yield**/, _loop_2(verseRef)];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5:
                            _a++;
                            return [3 /*break*/, 3];
                        case 6:
                            isVerified = errors.length === 0 && verseRefs.length > 0;
                            return [4 /*yield*/, this.citationRepository.update({ id: citation.id }, { isVerified: isVerified })];
                        case 7:
                            _c.sent();
                            results.push({ id: citation.id, isVerified: isVerified, errors: errors.length ? errors : undefined });
                            _c.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 2];
                        case 9: return [2 /*return*/, results];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.findAll = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspaces, _i, workspaces_1, workspace;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspaceRepository.find({
                                where: { userId: userId },
                                order: { createdAt: 'DESC' },
                            })];
                        case 1:
                            workspaces = _a.sent();
                            for (_i = 0, workspaces_1 = workspaces; _i < workspaces_1.length; _i++) {
                                workspace = workspaces_1[_i];
                                workspace.theologicalLens = (0, theological_lens_util_1.normalizeTheologicalLens)(workspace.theologicalLens);
                            }
                            return [2 /*return*/, workspaces];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.updateScriptureCache = function (id, userId, cacheData) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspaceRepository.findOne({
                                where: { id: id, userId: userId },
                            })];
                        case 1:
                            workspace = _a.sent();
                            if (!workspace) {
                                throw new Error('Workspace not found');
                            }
                            workspace.scriptureCache = __assign(__assign(__assign({}, (workspace.scriptureCache || {})), (cacheData || {})), { cachedAt: new Date() });
                            return [2 /*return*/, this.workspaceRepository.save(workspace)];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.getScriptureCache = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspaceRepository.findOne({
                                where: { id: id, userId: userId },
                                select: ['id', 'scriptureCache'],
                            })];
                        case 1:
                            workspace = _a.sent();
                            if (!workspace) {
                                throw new Error('Workspace not found');
                            }
                            return [2 /*return*/, workspace.scriptureCache || null];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.findOne = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, _a, outlines, manuscripts, applications, illustrations, discussionQuestions, citations, dnaAnalyses, studyReports;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.workspaceRepository.findOne({
                                where: { id: id, userId: userId },
                            })];
                        case 1:
                            workspace = _b.sent();
                            if (!workspace) {
                                return [2 /*return*/, workspace];
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.outlineRepository.find({
                                        where: { workspaceId: workspace.id },
                                        order: { createdAt: 'DESC' },
                                    }),
                                    this.manuscriptRepository.find({
                                        where: { workspaceId: workspace.id },
                                        order: { createdAt: 'DESC' },
                                    }),
                                    this.applicationRepository.find({
                                        where: { workspaceId: workspace.id },
                                        order: { orderIndex: 'ASC', createdAt: 'ASC' },
                                    }),
                                    this.illustrationRepository.find({
                                        where: { workspaceId: workspace.id },
                                        order: { createdAt: 'ASC' },
                                    }),
                                    this.questionRepository.find({
                                        where: { workspaceId: workspace.id },
                                        order: { orderIndex: 'ASC', createdAt: 'ASC' },
                                    }),
                                    this.citationRepository.find({
                                        where: { workspaceId: workspace.id },
                                        order: { createdAt: 'DESC' },
                                    }),
                                    this.workspaceRepository.manager.getRepository(sermon_dna_analysis_entity_1.SermonDnaAnalysis).find({
                                        where: { workspaceId: workspace.id },
                                        order: { createdAt: 'DESC' },
                                    }),
                                    this.studyReportRepository.find({
                                        where: { workspaceId: workspace.id },
                                        order: { createdAt: 'DESC' },
                                    }),
                                ])];
                        case 2:
                            _a = _b.sent(), outlines = _a[0], manuscripts = _a[1], applications = _a[2], illustrations = _a[3], discussionQuestions = _a[4], citations = _a[5], dnaAnalyses = _a[6], studyReports = _a[7];
                            workspace.outlines = outlines || [];
                            workspace.manuscripts = manuscripts || [];
                            workspace.applications = applications || [];
                            workspace.illustrations = illustrations || [];
                            workspace.discussionQuestions = discussionQuestions || [];
                            workspace.citations = citations || [];
                            workspace.dnaAnalyses = dnaAnalyses || [];
                            workspace.studyReports = studyReports || [];
                            return [2 /*return*/, this.upgradeWorkspaceContracts(workspace)];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.getWorkspaceState = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, userId)];
                        case 1:
                            workspace = _a.sent();
                            if (!workspace) {
                                throw new common_1.BadRequestException('Workspace not found');
                            }
                            return [2 /*return*/, this.buildWorkspaceState(workspace)];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.update = function (id, userId, updateDto) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, nextMetadata, normalizedUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id, userId)];
                        case 1:
                            workspace = _a.sent();
                            if (!workspace) {
                                throw new common_1.BadRequestException('Workspace not found');
                            }
                            nextMetadata = this.buildWorkspaceMetadataPayload({
                                mainPassage: updateDto.mainPassage || workspace.mainPassage,
                                language: updateDto.language || workspace.language,
                                theologicalLens: updateDto.theologicalLens || workspace.theologicalLens,
                                metadata: __assign(__assign({}, (workspace.metadata || {})), (updateDto.metadata || {})),
                            });
                            normalizedUpdate = __assign({}, updateDto);
                            if (updateDto.theologicalLens !== undefined) {
                                normalizedUpdate.theologicalLens = (0, theological_lens_util_1.normalizeTheologicalLens)(updateDto.theologicalLens);
                            }
                            else {
                                delete normalizedUpdate.theologicalLens;
                            }
                            return [4 /*yield*/, this.workspaceRepository.update({ id: id, userId: userId }, __assign(__assign({}, normalizedUpdate), { metadata: nextMetadata }))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.findOne(id, userId)];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.remove = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspaceRepository.delete({ id: id, userId: userId })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.applyAudiencePrompt = function (prompt, audienceType) {
            return prompt
                .replace(/\{\{\s*audienceType\s*\}\}/gi, audienceType)
                .replace(/\{\{\s*AUDIENCE\s*\}\}/g, audienceType);
        };
        WorkspacesService_1.prototype.getPromptPreview = function (workspaceId, userId, type, outlineId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, selectedOutline, _a, outline_1, mainPoints, pointNodes_1, seededApplications, outline_2, mainPoints, pointNodes_2, seededIllustrations, passage, passageText, studyInputs, outline, pointNodes, seededQuestions;
                var _this = this;
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _o.sent();
                            if (!workspace) {
                                return [2 /*return*/, null];
                            }
                            if (type === 'outline') {
                                return [2 /*return*/, this.buildOutlinePrompt(workspace)];
                            }
                            if (!(type === 'manuscript')) return [3 /*break*/, 5];
                            if (!outlineId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.outlineRepository.findOne({ where: { id: outlineId } })];
                        case 2:
                            _a = _o.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = ((_b = workspace.outlines) === null || _b === void 0 ? void 0 : _b.find(function (item) { return item.isSelected; })) || ((_c = workspace.outlines) === null || _c === void 0 ? void 0 : _c[0]);
                            _o.label = 4;
                        case 4:
                            selectedOutline = _a;
                            return [2 /*return*/, this.buildManuscriptPrompt(workspace, selectedOutline)];
                        case 5:
                            if (type === 'applications') {
                                outline_1 = ((_d = workspace.outlines) === null || _d === void 0 ? void 0 : _d.find(function (item) { return item.isSelected; })) || ((_e = workspace.outlines) === null || _e === void 0 ? void 0 : _e[0]);
                                mainPoints = this.extractOutlinePointTexts((outline_1 === null || outline_1 === void 0 ? void 0 : outline_1.structure) || {});
                                pointNodes_1 = Array.isArray((_f = outline_1 === null || outline_1 === void 0 ? void 0 : outline_1.structure) === null || _f === void 0 ? void 0 : _f.pointNodes) ? outline_1.structure.pointNodes : [];
                                seededApplications = Array.from(new Set(pointNodes_1.flatMap(function (point) { return _this.asStringArray(point === null || point === void 0 ? void 0 : point.applications, 4); }))).slice(0, 12);
                                return [2 /*return*/, this.buildApplicationsPrompt(workspace, mainPoints, '{{audienceType}}', seededApplications)];
                            }
                            if (type === 'illustrations') {
                                outline_2 = ((_g = workspace.outlines) === null || _g === void 0 ? void 0 : _g.find(function (item) { return item.isSelected; })) || ((_h = workspace.outlines) === null || _h === void 0 ? void 0 : _h[0]);
                                mainPoints = this.extractOutlinePointTexts((outline_2 === null || outline_2 === void 0 ? void 0 : outline_2.structure) || {});
                                pointNodes_2 = Array.isArray((_j = outline_2 === null || outline_2 === void 0 ? void 0 : outline_2.structure) === null || _j === void 0 ? void 0 : _j.pointNodes) ? outline_2.structure.pointNodes : [];
                                seededIllustrations = Array.from(new Set(pointNodes_2.flatMap(function (point) { return _this.asStringArray(point === null || point === void 0 ? void 0 : point.illustrationIdeas, 4); }))).slice(0, 12);
                                return [2 /*return*/, this.buildIllustrationsPrompt(workspace, mainPoints, seededIllustrations)];
                            }
                            if (type === 'citations') {
                                return [2 /*return*/, this.buildCitationsPrompt(workspace)];
                            }
                            if (!(type === 'study-report')) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.scriptureService.getPassage(workspace.mainPassage)];
                        case 6:
                            passage = _o.sent();
                            passageText = Array.isArray(passage === null || passage === void 0 ? void 0 : passage.verses)
                                ? passage.verses.map(function (verse) { return "".concat(verse.reference, " ").concat(verse.text); }).join('\n')
                                : JSON.stringify(passage || {});
                            return [4 /*yield*/, this.buildStudyReportInputContext(workspace, passageText)];
                        case 7:
                            studyInputs = _o.sent();
                            return [2 /*return*/, this.buildStudyReportPrompt(workspace, passageText, studyInputs)];
                        case 8:
                            outline = ((_k = workspace.outlines) === null || _k === void 0 ? void 0 : _k.find(function (item) { return item.isSelected; })) || ((_l = workspace.outlines) === null || _l === void 0 ? void 0 : _l[0]);
                            pointNodes = Array.isArray((_m = outline === null || outline === void 0 ? void 0 : outline.structure) === null || _m === void 0 ? void 0 : _m.pointNodes) ? outline.structure.pointNodes : [];
                            seededQuestions = Array.from(new Set(pointNodes.flatMap(function (point) { return _this.asStringArray(point === null || point === void 0 ? void 0 : point.discussionQuestions, 4); }))).slice(0, 12);
                            return [2 /*return*/, this.buildDiscussionPrompt(workspace, seededQuestions)];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.updateOutline = function (userId, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var outline, shouldSnapshot, outlineHistoryBase;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.outlineRepository.findOne({ where: { id: id }, relations: ['workspace'] })];
                        case 1:
                            outline = _c.sent();
                            if (!outline || outline.workspace.userId !== userId) {
                                return [2 /*return*/, null];
                            }
                            shouldSnapshot = typeof (dto === null || dto === void 0 ? void 0 : dto.title) === 'string' || (dto === null || dto === void 0 ? void 0 : dto.structure) !== undefined;
                            if (!shouldSnapshot) return [3 /*break*/, 3];
                            outlineHistoryBase = Array.isArray((_a = outline.workspace.metadata) === null || _a === void 0 ? void 0 : _a.outlineHistory)
                                ? ((_b = outline.workspace.metadata) === null || _b === void 0 ? void 0 : _b.outlineHistory).length
                                : 0;
                            this.appendWorkspaceHistory(outline.workspace, 'outlineHistory', this.snapshotOutlineForHistory(outline, "Version ".concat(outlineHistoryBase + 1)));
                            return [4 /*yield*/, this.workspaceRepository.save(outline.workspace)];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            if (!dto.isSelected) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.outlineRepository
                                    .createQueryBuilder()
                                    .update(sermon_outline_entity_1.SermonOutline)
                                    .set({ isSelected: false })
                                    .where('workspaceId = :workspaceId', { workspaceId: outline.workspaceId })
                                    .andWhere('id <> :id', { id: id })
                                    .execute()];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, this.workspaceRepository.update({ id: outline.workspaceId, userId: userId }, {
                                    metadata: __assign(__assign({}, (outline.workspace.metadata || {})), { activeOutlineId: id }),
                                })];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6: return [4 /*yield*/, this.outlineRepository.update({ id: id }, dto)];
                        case 7:
                            _c.sent();
                            return [2 /*return*/, this.outlineRepository.findOne({ where: { id: id } })];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.restoreOutlineHistory = function (userId, workspaceId, historyIndex) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, history, snapshot, insertResult, saved, _a;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _f.sent();
                            history = Array.isArray((_b = workspace.metadata) === null || _b === void 0 ? void 0 : _b.outlineHistory)
                                ? (_c = workspace.metadata) === null || _c === void 0 ? void 0 : _c.outlineHistory
                                : [];
                            snapshot = history[historyIndex];
                            if (!snapshot) {
                                throw new common_1.BadRequestException('Outline history entry not found.');
                            }
                            return [4 /*yield*/, this.outlineRepository.insert({
                                    workspaceId: workspaceId,
                                    title: this.asString(snapshot.title || "Restored Outline ".concat(historyIndex + 1)),
                                    structure: snapshot.structure || {},
                                    contentFormat: 'markdown',
                                    isSelected: true,
                                })];
                        case 2:
                            insertResult = _f.sent();
                            if (!((_e = (_d = insertResult.identifiers) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.id)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.outlineRepository.findOne({ where: { id: insertResult.identifiers[0].id } })];
                        case 3:
                            _a = _f.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = null;
                            _f.label = 5;
                        case 5:
                            saved = _a;
                            if (!saved) {
                                throw new common_1.BadRequestException('Outline restoration succeeded but the saved outline could not be reloaded.');
                            }
                            workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { activeOutlineId: saved.id });
                            return [4 /*yield*/, this.workspaceRepository.update(workspace.id, {
                                    metadata: workspace.metadata,
                                })];
                        case 6:
                            _f.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.updateManuscript = function (userId, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var manuscript, shouldSnapshot, manuscriptHistoryBase, updatePayload, text, incomingContent, incomingMetadata, existingMetadata, safeContent, plainText;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.manuscriptRepository.findOne({ where: { id: id }, relations: ['workspace'] })];
                        case 1:
                            manuscript = _g.sent();
                            if (!manuscript || manuscript.workspace.userId !== userId) {
                                return [2 /*return*/, null];
                            }
                            shouldSnapshot = (dto === null || dto === void 0 ? void 0 : dto.content) !== undefined || (dto === null || dto === void 0 ? void 0 : dto.transitions) !== undefined;
                            if (!shouldSnapshot) return [3 /*break*/, 3];
                            manuscriptHistoryBase = Array.isArray((_a = manuscript.workspace.metadata) === null || _a === void 0 ? void 0 : _a.manuscriptHistory)
                                ? ((_b = manuscript.workspace.metadata) === null || _b === void 0 ? void 0 : _b.manuscriptHistory).length
                                : 0;
                            this.appendWorkspaceHistory(manuscript.workspace, 'manuscriptHistory', this.snapshotManuscriptForHistory(manuscript, "Version ".concat(manuscriptHistoryBase + 1)));
                            return [4 /*yield*/, this.workspaceRepository.save(manuscript.workspace)];
                        case 2:
                            _g.sent();
                            _g.label = 3;
                        case 3:
                            updatePayload = {};
                            if (dto.transitions) {
                                updatePayload.transitions = dto.transitions;
                            }
                            text = typeof (dto === null || dto === void 0 ? void 0 : dto.content) === 'string' ? dto.content : (_c = dto === null || dto === void 0 ? void 0 : dto.content) === null || _c === void 0 ? void 0 : _c.text;
                            if (typeof text === 'string') {
                                incomingContent = typeof dto.content === 'string' ? { text: text } : dto.content;
                                incomingMetadata = ((incomingContent === null || incomingContent === void 0 ? void 0 : incomingContent.metadata) || {});
                                existingMetadata = (((_d = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _d === void 0 ? void 0 : _d.metadata) || {});
                                safeContent = __assign(__assign({}, (incomingContent || {})), { formatVersion: (incomingContent === null || incomingContent === void 0 ? void 0 : incomingContent.formatVersion) || ((_e = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _e === void 0 ? void 0 : _e.formatVersion) || 'v2', cues: this.sanitizeCueObject((incomingContent === null || incomingContent === void 0 ? void 0 : incomingContent.cues) || ((_f = manuscript === null || manuscript === void 0 ? void 0 : manuscript.content) === null || _f === void 0 ? void 0 : _f.cues)), metadata: __assign(__assign(__assign({}, existingMetadata), incomingMetadata), { cueAnchors: incomingMetadata.cueAnchors || existingMetadata.cueAnchors || {}, cueAnchorUpdatedAt: incomingMetadata.cueAnchorUpdatedAt || existingMetadata.cueAnchorUpdatedAt }) });
                                updatePayload.content = safeContent;
                                plainText = this.stripHtmlForWordCount(text);
                                updatePayload.wordCount = plainText.split(' ').filter(Boolean).length;
                                updatePayload.estimatedMinutes = Math.ceil(updatePayload.wordCount / 150);
                                updatePayload.contentFormat = safeContent.formatVersion === 'v2' ? 'html' : manuscript.contentFormat;
                            }
                            return [4 /*yield*/, this.manuscriptRepository.update({ id: id }, updatePayload)];
                        case 4:
                            _g.sent();
                            manuscript.workspace.metadata = __assign(__assign({}, (manuscript.workspace.metadata || {})), { activeManuscriptId: id });
                            return [4 /*yield*/, this.workspaceRepository.update(manuscript.workspace.id, {
                                    metadata: manuscript.workspace.metadata,
                                })];
                        case 5:
                            _g.sent();
                            return [2 /*return*/, this.manuscriptRepository.findOne({ where: { id: id } })];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.restoreManuscriptHistory = function (userId, workspaceId, historyIndex) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, history, snapshot, manuscript, insertResult, saved, _a;
                var _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _g.sent();
                            history = Array.isArray((_b = workspace.metadata) === null || _b === void 0 ? void 0 : _b.manuscriptHistory)
                                ? (_c = workspace.metadata) === null || _c === void 0 ? void 0 : _c.manuscriptHistory
                                : [];
                            snapshot = history[historyIndex];
                            if (!snapshot) {
                                throw new common_1.BadRequestException('Manuscript history entry not found.');
                            }
                            manuscript = this.manuscriptRepository.create({
                                workspaceId: workspaceId,
                                outlineId: snapshot.outlineId || null,
                                content: snapshot.content || {},
                                transitions: snapshot.transitions || null,
                                contentFormat: 'html',
                                wordCount: typeof snapshot.wordCount === 'number' ? snapshot.wordCount : null,
                                estimatedMinutes: typeof snapshot.estimatedMinutes === 'number' ? snapshot.estimatedMinutes : null,
                            });
                            return [4 /*yield*/, this.manuscriptRepository.insert(manuscript)];
                        case 2:
                            insertResult = _g.sent();
                            if (!((_e = (_d = insertResult.identifiers) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.id)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.manuscriptRepository.findOne({ where: { id: insertResult.identifiers[0].id } })];
                        case 3:
                            _a = _g.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a = null;
                            _g.label = 5;
                        case 5:
                            saved = _a;
                            if (!saved) {
                                throw new common_1.BadRequestException('Manuscript restoration succeeded but the saved manuscript could not be reloaded.');
                            }
                            workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { activeManuscriptId: saved.id, activeOutlineId: saved.outlineId || ((_f = workspace.metadata) === null || _f === void 0 ? void 0 : _f.activeOutlineId) });
                            return [4 /*yield*/, this.workspaceRepository.update(workspace.id, {
                                    metadata: workspace.metadata,
                                })];
                        case 6:
                            _g.sent();
                            return [2 /*return*/, saved];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.updateApplication = function (userId, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var application;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.applicationRepository.findOne({ where: { id: id }, relations: ['workspace'] })];
                        case 1:
                            application = _a.sent();
                            if (!application || application.workspace.userId !== userId) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.applicationRepository.update({ id: id }, dto)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.applicationRepository.findOne({ where: { id: id } })];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.updateIllustration = function (userId, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var illustration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.illustrationRepository.findOne({ where: { id: id }, relations: ['workspace'] })];
                        case 1:
                            illustration = _a.sent();
                            if (!illustration || illustration.workspace.userId !== userId) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.illustrationRepository.update({ id: id }, dto)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.illustrationRepository.findOne({ where: { id: id } })];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.updateDiscussionQuestion = function (userId, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var question;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionRepository.findOne({ where: { id: id }, relations: ['workspace'] })];
                        case 1:
                            question = _a.sent();
                            if (!question || question.workspace.userId !== userId) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.questionRepository.update({ id: id }, dto)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.questionRepository.findOne({ where: { id: id } })];
                    }
                });
            });
        };
        WorkspacesService_1.prototype.updateCitation = function (userId, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var citation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.citationRepository.findOne({ where: { id: id }, relations: ['workspace'] })];
                        case 1:
                            citation = _a.sent();
                            if (!citation || citation.workspace.userId !== userId) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.citationRepository.update({ id: id }, dto)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, this.citationRepository.findOne({ where: { id: id } })];
                    }
                });
            });
        };
        return WorkspacesService_1;
    }());
    __setFunctionName(_classThis, "WorkspacesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkspacesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkspacesService = _classThis;
}();
exports.WorkspacesService = WorkspacesService;
