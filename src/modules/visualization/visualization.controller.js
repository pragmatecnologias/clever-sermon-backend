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
exports.VisualizationController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var VisualizationController = function () {
    var _classDecorators = [(0, common_1.Controller)('visualization'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getCanonicalConstellation_decorators;
    var _getBookCluster_decorators;
    var _getWordSphere_decorators;
    var _generateSermonFlow_decorators;
    var _analyzeSermonBalance_decorators;
    var _getTimeline_decorators;
    var _getTimelineEvents_decorators;
    var _getTimelineContext_decorators;
    var _getProphecyWeb_decorators;
    var _getBiblicalNarrativeMap_decorators;
    var _get2300DaysThread_decorators;
    var _getThemeGalaxy_decorators;
    var _getThemeProgression_decorators;
    var VisualizationController = _classThis = /** @class */ (function () {
        function VisualizationController_1(canonicalConstellationService, wordUsageSphereService, sermonFlowSculptorService, timelineUniverseService, prophecyFulfillmentService, theologicalThemeGalaxyService, visualizationContractService, biblicalNarrativeMapService) {
            this.canonicalConstellationService = (__runInitializers(this, _instanceExtraInitializers), canonicalConstellationService);
            this.wordUsageSphereService = wordUsageSphereService;
            this.sermonFlowSculptorService = sermonFlowSculptorService;
            this.timelineUniverseService = timelineUniverseService;
            this.prophecyFulfillmentService = prophecyFulfillmentService;
            this.theologicalThemeGalaxyService = theologicalThemeGalaxyService;
            this.visualizationContractService = visualizationContractService;
            this.biblicalNarrativeMapService = biblicalNarrativeMapService;
        }
        VisualizationController_1.prototype.getCanonicalConstellation = function (focusPassage, types) {
            return __awaiter(this, void 0, void 0, function () {
                var includeTypes, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            includeTypes = types ? types.split(',') : undefined;
                            return [4 /*yield*/, this.canonicalConstellationService.generateConstellation(focusPassage, includeTypes)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, this.visualizationContractService.enrichGraph(data)];
                    }
                });
            });
        };
        VisualizationController_1.prototype.getBookCluster = function (book) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.canonicalConstellationService.getBookCluster(book)];
                });
            });
        };
        VisualizationController_1.prototype.getWordSphere = function (lemma, strongs) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.wordUsageSphereService.generateWordSphere(lemma, strongs)];
                });
            });
        };
        VisualizationController_1.prototype.generateSermonFlow = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.sermonFlowSculptorService.generateSermonFlow(body.bigIdea, body.points, body.applications, body.supportingVerses, body.illustrations)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, this.visualizationContractService.enrichGraph(data)];
                    }
                });
            });
        };
        VisualizationController_1.prototype.analyzeSermonBalance = function (flowData) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sermonFlowSculptorService.analyzeSermonBalance(flowData)];
                });
            });
        };
        VisualizationController_1.prototype.getTimeline = function (startYear, endYear, categories) {
            return __awaiter(this, void 0, void 0, function () {
                var start, end, cats;
                return __generator(this, function (_a) {
                    start = startYear ? parseInt(startYear) : undefined;
                    end = endYear ? parseInt(endYear) : undefined;
                    cats = categories ? categories.split(',') : undefined;
                    return [2 /*return*/, this.timelineUniverseService.generateTimeline(start, end, cats)];
                });
            });
        };
        VisualizationController_1.prototype.getTimelineEvents = function (year, category) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.timelineUniverseService.getEventDetails(parseInt(year), category)];
                });
            });
        };
        VisualizationController_1.prototype.getTimelineContext = function (year) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.timelineUniverseService.getContextForYear(parseInt(year))];
                });
            });
        };
        VisualizationController_1.prototype.getProphecyWeb = function (theme) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prophecyFulfillmentService.generateProphecyWeb(theme)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, this.visualizationContractService.enrichGraph(data)];
                    }
                });
            });
        };
        VisualizationController_1.prototype.getBiblicalNarrativeMap = function (focusPassage, theme) {
            return __awaiter(this, void 0, void 0, function () {
                var passage;
                return __generator(this, function (_a) {
                    passage = String(focusPassage || '').trim();
                    if (!passage) {
                        return [2 /*return*/, {
                                nodes: [],
                                connections: [],
                                timeline: [],
                                metadata: {
                                    focusPassage: null,
                                    focusStage: null,
                                    theme: theme || null,
                                    totalNodes: 0,
                                    totalConnections: 0,
                                },
                            }];
                    }
                    return [2 /*return*/, this.biblicalNarrativeMapService.buildNarrativeMap(passage, theme)];
                });
            });
        };
        VisualizationController_1.prototype.get2300DaysThread = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prophecyFulfillmentService.get2300DaysThread()];
                });
            });
        };
        VisualizationController_1.prototype.getThemeGalaxy = function (theme) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.theologicalThemeGalaxyService.generateThemeGalaxy(theme)];
                });
            });
        };
        VisualizationController_1.prototype.getThemeProgression = function (theme) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.theologicalThemeGalaxyService.getThemeProgression(theme)];
                });
            });
        };
        return VisualizationController_1;
    }());
    __setFunctionName(_classThis, "VisualizationController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCanonicalConstellation_decorators = [(0, common_1.Get)('canonical-constellation')];
        _getBookCluster_decorators = [(0, common_1.Get)('book-cluster')];
        _getWordSphere_decorators = [(0, common_1.Get)('word-sphere')];
        _generateSermonFlow_decorators = [(0, common_1.Post)('sermon-flow')];
        _analyzeSermonBalance_decorators = [(0, common_1.Post)('sermon-balance')];
        _getTimeline_decorators = [(0, common_1.Get)('timeline')];
        _getTimelineEvents_decorators = [(0, common_1.Get)('timeline-events')];
        _getTimelineContext_decorators = [(0, common_1.Get)('timeline-context')];
        _getProphecyWeb_decorators = [(0, common_1.Get)('prophecy-web')];
        _getBiblicalNarrativeMap_decorators = [(0, common_1.Get)('biblical-narrative-map')];
        _get2300DaysThread_decorators = [(0, common_1.Get)('prophecy-2300-days')];
        _getThemeGalaxy_decorators = [(0, common_1.Get)('theme-galaxy')];
        _getThemeProgression_decorators = [(0, common_1.Get)('theme-progression')];
        __esDecorate(_classThis, null, _getCanonicalConstellation_decorators, { kind: "method", name: "getCanonicalConstellation", static: false, private: false, access: { has: function (obj) { return "getCanonicalConstellation" in obj; }, get: function (obj) { return obj.getCanonicalConstellation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBookCluster_decorators, { kind: "method", name: "getBookCluster", static: false, private: false, access: { has: function (obj) { return "getBookCluster" in obj; }, get: function (obj) { return obj.getBookCluster; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWordSphere_decorators, { kind: "method", name: "getWordSphere", static: false, private: false, access: { has: function (obj) { return "getWordSphere" in obj; }, get: function (obj) { return obj.getWordSphere; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateSermonFlow_decorators, { kind: "method", name: "generateSermonFlow", static: false, private: false, access: { has: function (obj) { return "generateSermonFlow" in obj; }, get: function (obj) { return obj.generateSermonFlow; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _analyzeSermonBalance_decorators, { kind: "method", name: "analyzeSermonBalance", static: false, private: false, access: { has: function (obj) { return "analyzeSermonBalance" in obj; }, get: function (obj) { return obj.analyzeSermonBalance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTimeline_decorators, { kind: "method", name: "getTimeline", static: false, private: false, access: { has: function (obj) { return "getTimeline" in obj; }, get: function (obj) { return obj.getTimeline; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTimelineEvents_decorators, { kind: "method", name: "getTimelineEvents", static: false, private: false, access: { has: function (obj) { return "getTimelineEvents" in obj; }, get: function (obj) { return obj.getTimelineEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTimelineContext_decorators, { kind: "method", name: "getTimelineContext", static: false, private: false, access: { has: function (obj) { return "getTimelineContext" in obj; }, get: function (obj) { return obj.getTimelineContext; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProphecyWeb_decorators, { kind: "method", name: "getProphecyWeb", static: false, private: false, access: { has: function (obj) { return "getProphecyWeb" in obj; }, get: function (obj) { return obj.getProphecyWeb; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBiblicalNarrativeMap_decorators, { kind: "method", name: "getBiblicalNarrativeMap", static: false, private: false, access: { has: function (obj) { return "getBiblicalNarrativeMap" in obj; }, get: function (obj) { return obj.getBiblicalNarrativeMap; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _get2300DaysThread_decorators, { kind: "method", name: "get2300DaysThread", static: false, private: false, access: { has: function (obj) { return "get2300DaysThread" in obj; }, get: function (obj) { return obj.get2300DaysThread; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getThemeGalaxy_decorators, { kind: "method", name: "getThemeGalaxy", static: false, private: false, access: { has: function (obj) { return "getThemeGalaxy" in obj; }, get: function (obj) { return obj.getThemeGalaxy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getThemeProgression_decorators, { kind: "method", name: "getThemeProgression", static: false, private: false, access: { has: function (obj) { return "getThemeProgression" in obj; }, get: function (obj) { return obj.getThemeProgression; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VisualizationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VisualizationController = _classThis;
}();
exports.VisualizationController = VisualizationController;
