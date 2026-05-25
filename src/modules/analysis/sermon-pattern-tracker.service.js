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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SermonPatternTrackerService = void 0;
var common_1 = require("@nestjs/common");
var analysis_prompts_1 = require("./analysis-prompts");
var SermonPatternTrackerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SermonPatternTrackerService = _classThis = /** @class */ (function () {
        function SermonPatternTrackerService_1(trackerRepository, workspaceRepository, llmService) {
            this.trackerRepository = trackerRepository;
            this.workspaceRepository = workspaceRepository;
            this.llmService = llmService;
        }
        SermonPatternTrackerService_1.prototype.updatePatterns = function (userId, workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                var tracker, workspace, themeKey, applications;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.trackerRepository.findOne({ where: { userId: userId } })];
                        case 1:
                            tracker = _a.sent();
                            if (!tracker) {
                                tracker = this.trackerRepository.create({
                                    userId: userId,
                                    totalSermons: 0,
                                    styleFrequency: {},
                                    themeFrequency: {},
                                    applicationCategoryBalance: {
                                        personal: 0,
                                        communal: 0,
                                        missional: 0,
                                        doctrinal: 0,
                                    },
                                    avoidedTexts: [],
                                    overusedIllustrations: [],
                                    growthInsights: [],
                                });
                            }
                            return [4 /*yield*/, this.workspaceRepository.findOne({
                                    where: { id: workspaceId, userId: userId },
                                    relations: ['applications'],
                                })];
                        case 2:
                            workspace = _a.sent();
                            if (!workspace) {
                                return [2 /*return*/, tracker];
                            }
                            tracker.totalSermons += 1;
                            if (workspace.style) {
                                tracker.styleFrequency[workspace.style] = (tracker.styleFrequency[workspace.style] || 0) + 1;
                            }
                            if (workspace.theme) {
                                themeKey = workspace.theme.toLowerCase().substring(0, 50);
                                tracker.themeFrequency[themeKey] = (tracker.themeFrequency[themeKey] || 0) + 1;
                            }
                            applications = workspace.applications || [];
                            applications.forEach(function (app) {
                                var category = _this.categorizeApplication(app.content);
                                if (category && tracker.applicationCategoryBalance) {
                                    tracker.applicationCategoryBalance[category]++;
                                }
                            });
                            return [2 /*return*/, this.trackerRepository.save(tracker)];
                    }
                });
            });
        };
        SermonPatternTrackerService_1.prototype.analyzeGrowth = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var tracker, workspaces, allPassages, allThemes, prompt, response, parsed, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.trackerRepository.findOne({ where: { userId: userId } })];
                        case 1:
                            tracker = _a.sent();
                            if (!tracker || tracker.totalSermons < 3) {
                                return [2 /*return*/, tracker || this.trackerRepository.create({
                                        userId: userId,
                                        totalSermons: 0,
                                        styleFrequency: {},
                                        themeFrequency: {},
                                        applicationCategoryBalance: { personal: 0, communal: 0, missional: 0, doctrinal: 0 },
                                        growthInsights: [{ strength: 'Not enough data', weakness: 'Need at least 3 sermons', recommendation: 'Keep preaching!' }],
                                    })];
                            }
                            return [4 /*yield*/, this.workspaceRepository.find({
                                    where: { userId: userId },
                                    relations: ['outlines', 'manuscripts', 'applications'],
                                    order: { createdAt: 'DESC' },
                                    take: 20,
                                })];
                        case 2:
                            workspaces = _a.sent();
                            allPassages = workspaces.map(function (w) { return w.mainPassage; }).filter(Boolean);
                            allThemes = workspaces.map(function (w) { return w.theme; }).filter(Boolean);
                            prompt = analysis_prompts_1.AnalysisPrompts.sermonPatternGrowth({
                                totalSermons: tracker.totalSermons,
                                styleFrequencyJson: JSON.stringify(tracker.styleFrequency),
                                themeFrequencyJson: JSON.stringify(tracker.themeFrequency),
                                applicationBalanceJson: JSON.stringify(tracker.applicationCategoryBalance),
                                recentPassages: allPassages.slice(0, 10).join(', '),
                                recentThemes: allThemes.slice(0, 10).join(', '),
                            });
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId, {
                                    temperature: 0.4,
                                    maxTokens: 1500,
                                })];
                        case 4:
                            response = _a.sent();
                            parsed = JSON.parse(response);
                            tracker.avgChristCentrality = parsed.avgChristCentrality || null;
                            tracker.avgApplicationDepth = parsed.avgApplicationDepth || null;
                            tracker.avoidedTexts = parsed.avoidedTexts || [];
                            tracker.overusedIllustrations = parsed.overusedIllustrations || [];
                            tracker.growthInsights = parsed.growthInsights || [];
                            return [2 /*return*/, this.trackerRepository.save(tracker)];
                        case 5:
                            error_1 = _a.sent();
                            return [2 /*return*/, tracker];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        SermonPatternTrackerService_1.prototype.get = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.trackerRepository.findOne({ where: { userId: userId } })];
                });
            });
        };
        SermonPatternTrackerService_1.prototype.categorizeApplication = function (content) {
            var lower = content.toLowerCase();
            if (lower.includes('you') || lower.includes('your') || lower.includes('personal')) {
                return 'personal';
            }
            if (lower.includes('we') || lower.includes('church') || lower.includes('community')) {
                return 'communal';
            }
            if (lower.includes('mission') || lower.includes('evangelism') || lower.includes('witness')) {
                return 'missional';
            }
            if (lower.includes('doctrine') || lower.includes('theology') || lower.includes('believe')) {
                return 'doctrinal';
            }
            return 'personal';
        };
        return SermonPatternTrackerService_1;
    }());
    __setFunctionName(_classThis, "SermonPatternTrackerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SermonPatternTrackerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SermonPatternTrackerService = _classThis;
}();
exports.SermonPatternTrackerService = SermonPatternTrackerService;
