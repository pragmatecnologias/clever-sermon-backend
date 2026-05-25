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
exports.HistoricalContextEnhancerService = void 0;
var common_1 = require("@nestjs/common");
var analysis_prompts_1 = require("./analysis-prompts");
var historical_context_guidance_1 = require("./historical-context-guidance");
var HistoricalContextEnhancerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var HistoricalContextEnhancerService = _classThis = /** @class */ (function () {
        function HistoricalContextEnhancerService_1(contextRepository, workspaceRepository, llmService, scriptureService) {
            this.contextRepository = contextRepository;
            this.workspaceRepository = workspaceRepository;
            this.llmService = llmService;
            this.scriptureService = scriptureService;
        }
        HistoricalContextEnhancerService_1.prototype.analyze = function (workspaceId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var workspace, genre, contextRange, _a, passage, expandedPassage, dossier, passageText, expandedPassageText, deterministic, deterministicValidation, prompt, normalized, context;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.workspaceRepository.findOne({
                                where: { id: workspaceId, userId: userId },
                            })];
                        case 1:
                            workspace = _b.sent();
                            if (!workspace) {
                                throw new Error('Workspace not found');
                            }
                            return [4 /*yield*/, this.contextRepository.delete({ workspaceId: workspaceId })];
                        case 2:
                            _b.sent();
                            genre = (0, historical_context_guidance_1.detectHistoricalGenre)(workspace.mainPassage);
                            contextRange = (0, historical_context_guidance_1.resolveHistoricalContextRange)(workspace.mainPassage, genre);
                            return [4 /*yield*/, Promise.all([
                                    this.scriptureService.getPassage(workspace.mainPassage, 'KJV'),
                                    this.scriptureService.getPassageWithContext(workspace.mainPassage, 'KJV', contextRange),
                                    this.scriptureService.getHistoricalContextDossier(workspace.mainPassage),
                                ])];
                        case 3:
                            _a = _b.sent(), passage = _a[0], expandedPassage = _a[1], dossier = _a[2];
                            passageText = Array.isArray(passage === null || passage === void 0 ? void 0 : passage.verses)
                                ? passage.verses.map(function (verse) { return "".concat(verse.reference, " ").concat(verse.text); }).join('\n')
                                : '';
                            expandedPassageText = Array.isArray(expandedPassage === null || expandedPassage === void 0 ? void 0 : expandedPassage.verses)
                                ? expandedPassage.verses.map(function (verse) { return "".concat(verse.reference, " ").concat(verse.text); }).join('\n')
                                : passageText;
                            deterministic = (0, historical_context_guidance_1.normalizeHistoricalContextOutput)((0, historical_context_guidance_1.composeHistoricalContextOutput)({
                                reference: workspace.mainPassage,
                                passageText: passageText,
                                expandedPassageText: expandedPassageText,
                                genre: genre,
                                bookMetadata: dossier.bookMetadata || {},
                                historicalContext: dossier.historicalContext || {},
                                culturalContext: dossier.culturalContext || {},
                                geographyContext: dossier.geographyContext || {},
                            }));
                            deterministicValidation = (0, historical_context_guidance_1.validateHistoricalContextOutput)(deterministic);
                            if (!deterministicValidation.valid) {
                                console.warn('[historical-context] deterministic context failed validation', {
                                    reference: workspace.mainPassage,
                                    genre: genre,
                                    errors: deterministicValidation.errors,
                                });
                            }
                            prompt = analysis_prompts_1.AnalysisPrompts.historicalContextEnhancer({
                                mainPassage: workspace.mainPassage,
                                genre: genre,
                                passageText: passageText,
                                expandedPassageText: expandedPassageText,
                                bookMetadataJson: JSON.stringify(dossier.bookMetadata || {}),
                                historicalContextJson: JSON.stringify(dossier.historicalContext || {}),
                                culturalContextJson: JSON.stringify(dossier.culturalContext || {}),
                                geographyContextJson: JSON.stringify(dossier.geographyContext || {}),
                                genreFocus: this.buildGenreFocus(workspace.mainPassage, genre),
                                geographyNote: this.buildGeographyNote(workspace.mainPassage, dossier.geographyContext),
                                literaryGuardrails: this.buildLiteraryGuardrails(workspace.mainPassage, genre),
                            });
                            normalized = deterministic;
                            context = this.contextRepository.create(__assign({ workspaceId: workspaceId, passage: workspace.mainPassage }, normalized));
                            return [2 /*return*/, this.contextRepository.save(context)];
                    }
                });
            });
        };
        HistoricalContextEnhancerService_1.prototype.get = function (workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.contextRepository.findOne({ where: { workspaceId: workspaceId } })];
                });
            });
        };
        HistoricalContextEnhancerService_1.prototype.buildGenreFocus = function (reference, genre) {
            var normalized = reference.toLowerCase();
            if (genre === 'wisdom_poetry' && /psalm\s+37|ps\s+37/.test(normalized)) {
                return 'Wisdom psalm about envying the wicked, trusting the Lord, walking a straight path, and resting in God’s sustaining faithfulness.';
            }
            if (genre === 'gospel_dialogue' && /john\s+3/.test(normalized)) {
                return 'Night conversation with Nicodemus, new birth, belief, and eternal life.';
            }
            if (genre === 'parable' && /luke\s+15/.test(normalized)) {
                return 'Jesus answers grumbling with parables of loss, repentance, homecoming, and welcome.';
            }
            if (genre === 'prophetic_apocalyptic' && /revelation\s+14|rev\s+14/.test(normalized)) {
                return 'Everlasting gospel, worship of the Creator, and faithful endurance under pressure.';
            }
            if (genre === 'covenant_law' && /exodus\s+20|exod\s+20/.test(normalized)) {
                return 'Sabbath as covenant rest rooted in creation and liberation from slavery.';
            }
            return 'Keep the sermon inside the chapter, the book’s genre, and the passage’s pastoral burden.';
        };
        HistoricalContextEnhancerService_1.prototype.buildGeographyNote = function (reference, geographyContext) {
            var hasGeography = geographyContext && Object.keys(geographyContext).length > 0;
            if (!hasGeography) {
                return 'Geography is limited or not central here, so the preacher should lean on canonical, literary, and cultural context instead of inventing a location story.';
            }
            return "Geography exists for ".concat(reference, ", but it should support the sermon rather than dominate it.");
        };
        HistoricalContextEnhancerService_1.prototype.buildLiteraryGuardrails = function (reference, genre) {
            var guardrails = [
                'Do not expose internal labels or placeholder language.',
                'Use complete, pastor-facing sentences.',
                'Tie each observation back to the chapter and sermon use.',
            ];
            if (genre === 'wisdom_poetry') {
                guardrails.push('Use poetic / wisdom / worship language, not narrative-only framing.');
            }
            if (genre === 'prophetic_apocalyptic') {
                guardrails.push('Keep the tone hopeful, Christ-centered, and non-sensational.');
            }
            if (genre === 'parable') {
                guardrails.push('Lean on honor-shame, household, and welcome language when helpful.');
            }
            if (genre === 'covenant_law') {
                guardrails.push('Frame the command in covenant, creation, and liberation language.');
            }
            if (/psalm\s+37|ps\s+37/.test(reference.toLowerCase())) {
                guardrails.push('Emphasize trust, waiting, the path of the righteous, and God’s sustaining faithfulness.');
            }
            return guardrails;
        };
        HistoricalContextEnhancerService_1.prototype.normalizeHistoricalContext = function (parsed) {
            var candidate = {
                socialRealities: Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.socialRealities) ? parsed.socialRealities : [],
                powerStructures: Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.powerStructures) ? parsed.powerStructures : [],
                economicContext: Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.economicContext) ? parsed.economicContext : [],
                religiousClimate: Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.religiousClimate) ? parsed.religiousClimate : [],
                audiencePressures: Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.audiencePressures) ? parsed.audiencePressures : [],
                synthesisStatement: typeof (parsed === null || parsed === void 0 ? void 0 : parsed.synthesisStatement) === 'string' ? parsed.synthesisStatement : '',
            };
            return candidate;
        };
        HistoricalContextEnhancerService_1.prototype.generateValidatedHistoricalContext = function (prompt, userId, reference, genre, passageText, dossier) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new common_1.BadRequestException('Historical context could not be generated. Please retry.');
                });
            });
        };
        return HistoricalContextEnhancerService_1;
    }());
    __setFunctionName(_classThis, "HistoricalContextEnhancerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HistoricalContextEnhancerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HistoricalContextEnhancerService = _classThis;
}();
exports.HistoricalContextEnhancerService = HistoricalContextEnhancerService;
