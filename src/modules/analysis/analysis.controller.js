"use strict";
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
exports.AnalysisController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var AnalysisController = function () {
    var _classDecorators = [(0, common_1.Controller)('analysis'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _analyzeTheologicalCenter_decorators;
    var _getTheologicalCenter_decorators;
    var _analyzeTensions_decorators;
    var _getTensions_decorators;
    var _checkDoctrinalPrecision_decorators;
    var _getDoctrinalPrecision_decorators;
    var _detectBlindSpots_decorators;
    var _getBlindSpots_decorators;
    var _selectPreachingStrategy_decorators;
    var _getPreachingStrategy_decorators;
    var _enhanceHistoricalContext_decorators;
    var _getHistoricalContext_decorators;
    var _getSermonPatterns_decorators;
    var _analyzeSermonPatterns_decorators;
    var _buildCrossReferenceNarrative_decorators;
    var _getCrossReferenceNarrative_decorators;
    var _runAllAnalyses_decorators;
    var AnalysisController = _classThis = /** @class */ (function () {
        function AnalysisController_1(theologicalCenterService, tensionMappingService, doctrinalPrecisionService, blindSpotDetectorService, preachingStrategySelectorService, historicalContextEnhancerService, sermonPatternTrackerService, crossReferenceNarrativeService) {
            this.theologicalCenterService = (__runInitializers(this, _instanceExtraInitializers), theologicalCenterService);
            this.tensionMappingService = tensionMappingService;
            this.doctrinalPrecisionService = doctrinalPrecisionService;
            this.blindSpotDetectorService = blindSpotDetectorService;
            this.preachingStrategySelectorService = preachingStrategySelectorService;
            this.historicalContextEnhancerService = historicalContextEnhancerService;
            this.sermonPatternTrackerService = sermonPatternTrackerService;
            this.crossReferenceNarrativeService = crossReferenceNarrativeService;
        }
        AnalysisController_1.prototype.analyzeTheologicalCenter = function (workspaceId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.theologicalCenterService.analyze(workspaceId, req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.getTheologicalCenter = function (workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.theologicalCenterService.get(workspaceId)];
                });
            });
        };
        AnalysisController_1.prototype.analyzeTensions = function (workspaceId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tensionMappingService.analyze(workspaceId, req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.getTensions = function (workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tensionMappingService.get(workspaceId)];
                });
            });
        };
        AnalysisController_1.prototype.checkDoctrinalPrecision = function (workspaceId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.doctrinalPrecisionService.analyze(workspaceId, req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.getDoctrinalPrecision = function (workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.doctrinalPrecisionService.get(workspaceId)];
                });
            });
        };
        AnalysisController_1.prototype.detectBlindSpots = function (workspaceId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blindSpotDetectorService.analyze(workspaceId, req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.getBlindSpots = function (workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.blindSpotDetectorService.get(workspaceId)];
                });
            });
        };
        AnalysisController_1.prototype.selectPreachingStrategy = function (workspaceId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.preachingStrategySelectorService.analyze(workspaceId, req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.getPreachingStrategy = function (workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.preachingStrategySelectorService.get(workspaceId)];
                });
            });
        };
        AnalysisController_1.prototype.enhanceHistoricalContext = function (workspaceId, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.historicalContextEnhancerService.analyze(workspaceId, req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.getHistoricalContext = function (workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.historicalContextEnhancerService.get(workspaceId)];
                });
            });
        };
        AnalysisController_1.prototype.getSermonPatterns = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sermonPatternTrackerService.get(req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.analyzeSermonPatterns = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sermonPatternTrackerService.analyzeGrowth(req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.buildCrossReferenceNarrative = function (verse, req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.crossReferenceNarrativeService.buildNarrative(verse, req.user.userId)];
                });
            });
        };
        AnalysisController_1.prototype.getCrossReferenceNarrative = function (verse) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.crossReferenceNarrativeService.get(verse)];
                });
            });
        };
        AnalysisController_1.prototype.runAllAnalyses = function (workspaceId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, _a, theologicalCenter, tensions, doctrinalCheck, blindSpots, strategy, historicalContext;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            userId = req.user.userId;
                            return [4 /*yield*/, Promise.all([
                                    this.theologicalCenterService.analyze(workspaceId, userId),
                                    this.tensionMappingService.analyze(workspaceId, userId),
                                    this.doctrinalPrecisionService.analyze(workspaceId, userId),
                                    this.blindSpotDetectorService.analyze(workspaceId, userId),
                                    this.preachingStrategySelectorService.analyze(workspaceId, userId),
                                    this.historicalContextEnhancerService.analyze(workspaceId, userId),
                                ])];
                        case 1:
                            _a = _b.sent(), theologicalCenter = _a[0], tensions = _a[1], doctrinalCheck = _a[2], blindSpots = _a[3], strategy = _a[4], historicalContext = _a[5];
                            return [4 /*yield*/, this.sermonPatternTrackerService.updatePatterns(userId, workspaceId)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, {
                                    theologicalCenter: theologicalCenter,
                                    tensions: tensions,
                                    doctrinalCheck: doctrinalCheck,
                                    blindSpots: blindSpots,
                                    strategy: strategy,
                                    historicalContext: historicalContext,
                                }];
                    }
                });
            });
        };
        return AnalysisController_1;
    }());
    __setFunctionName(_classThis, "AnalysisController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _analyzeTheologicalCenter_decorators = [(0, common_1.Post)('theological-center/:workspaceId')];
        _getTheologicalCenter_decorators = [(0, common_1.Get)('theological-center/:workspaceId')];
        _analyzeTensions_decorators = [(0, common_1.Post)('tension-mapping/:workspaceId')];
        _getTensions_decorators = [(0, common_1.Get)('tension-mapping/:workspaceId')];
        _checkDoctrinalPrecision_decorators = [(0, common_1.Post)('doctrinal-precision/:workspaceId')];
        _getDoctrinalPrecision_decorators = [(0, common_1.Get)('doctrinal-precision/:workspaceId')];
        _detectBlindSpots_decorators = [(0, common_1.Post)('blind-spots/:workspaceId')];
        _getBlindSpots_decorators = [(0, common_1.Get)('blind-spots/:workspaceId')];
        _selectPreachingStrategy_decorators = [(0, common_1.Post)('preaching-strategy/:workspaceId')];
        _getPreachingStrategy_decorators = [(0, common_1.Get)('preaching-strategy/:workspaceId')];
        _enhanceHistoricalContext_decorators = [(0, common_1.Post)('historical-context/:workspaceId')];
        _getHistoricalContext_decorators = [(0, common_1.Get)('historical-context/:workspaceId')];
        _getSermonPatterns_decorators = [(0, common_1.Get)('sermon-patterns')];
        _analyzeSermonPatterns_decorators = [(0, common_1.Post)('sermon-patterns/analyze')];
        _buildCrossReferenceNarrative_decorators = [(0, common_1.Post)('cross-reference-narrative/:verse')];
        _getCrossReferenceNarrative_decorators = [(0, common_1.Get)('cross-reference-narrative/:verse')];
        _runAllAnalyses_decorators = [(0, common_1.Post)('run-all/:workspaceId')];
        __esDecorate(_classThis, null, _analyzeTheologicalCenter_decorators, { kind: "method", name: "analyzeTheologicalCenter", static: false, private: false, access: { has: function (obj) { return "analyzeTheologicalCenter" in obj; }, get: function (obj) { return obj.analyzeTheologicalCenter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTheologicalCenter_decorators, { kind: "method", name: "getTheologicalCenter", static: false, private: false, access: { has: function (obj) { return "getTheologicalCenter" in obj; }, get: function (obj) { return obj.getTheologicalCenter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _analyzeTensions_decorators, { kind: "method", name: "analyzeTensions", static: false, private: false, access: { has: function (obj) { return "analyzeTensions" in obj; }, get: function (obj) { return obj.analyzeTensions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTensions_decorators, { kind: "method", name: "getTensions", static: false, private: false, access: { has: function (obj) { return "getTensions" in obj; }, get: function (obj) { return obj.getTensions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkDoctrinalPrecision_decorators, { kind: "method", name: "checkDoctrinalPrecision", static: false, private: false, access: { has: function (obj) { return "checkDoctrinalPrecision" in obj; }, get: function (obj) { return obj.checkDoctrinalPrecision; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDoctrinalPrecision_decorators, { kind: "method", name: "getDoctrinalPrecision", static: false, private: false, access: { has: function (obj) { return "getDoctrinalPrecision" in obj; }, get: function (obj) { return obj.getDoctrinalPrecision; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detectBlindSpots_decorators, { kind: "method", name: "detectBlindSpots", static: false, private: false, access: { has: function (obj) { return "detectBlindSpots" in obj; }, get: function (obj) { return obj.detectBlindSpots; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBlindSpots_decorators, { kind: "method", name: "getBlindSpots", static: false, private: false, access: { has: function (obj) { return "getBlindSpots" in obj; }, get: function (obj) { return obj.getBlindSpots; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _selectPreachingStrategy_decorators, { kind: "method", name: "selectPreachingStrategy", static: false, private: false, access: { has: function (obj) { return "selectPreachingStrategy" in obj; }, get: function (obj) { return obj.selectPreachingStrategy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPreachingStrategy_decorators, { kind: "method", name: "getPreachingStrategy", static: false, private: false, access: { has: function (obj) { return "getPreachingStrategy" in obj; }, get: function (obj) { return obj.getPreachingStrategy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _enhanceHistoricalContext_decorators, { kind: "method", name: "enhanceHistoricalContext", static: false, private: false, access: { has: function (obj) { return "enhanceHistoricalContext" in obj; }, get: function (obj) { return obj.enhanceHistoricalContext; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHistoricalContext_decorators, { kind: "method", name: "getHistoricalContext", static: false, private: false, access: { has: function (obj) { return "getHistoricalContext" in obj; }, get: function (obj) { return obj.getHistoricalContext; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSermonPatterns_decorators, { kind: "method", name: "getSermonPatterns", static: false, private: false, access: { has: function (obj) { return "getSermonPatterns" in obj; }, get: function (obj) { return obj.getSermonPatterns; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _analyzeSermonPatterns_decorators, { kind: "method", name: "analyzeSermonPatterns", static: false, private: false, access: { has: function (obj) { return "analyzeSermonPatterns" in obj; }, get: function (obj) { return obj.analyzeSermonPatterns; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _buildCrossReferenceNarrative_decorators, { kind: "method", name: "buildCrossReferenceNarrative", static: false, private: false, access: { has: function (obj) { return "buildCrossReferenceNarrative" in obj; }, get: function (obj) { return obj.buildCrossReferenceNarrative; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCrossReferenceNarrative_decorators, { kind: "method", name: "getCrossReferenceNarrative", static: false, private: false, access: { has: function (obj) { return "getCrossReferenceNarrative" in obj; }, get: function (obj) { return obj.getCrossReferenceNarrative; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _runAllAnalyses_decorators, { kind: "method", name: "runAllAnalyses", static: false, private: false, access: { has: function (obj) { return "runAllAnalyses" in obj; }, get: function (obj) { return obj.runAllAnalyses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalysisController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalysisController = _classThis;
}();
exports.AnalysisController = AnalysisController;
