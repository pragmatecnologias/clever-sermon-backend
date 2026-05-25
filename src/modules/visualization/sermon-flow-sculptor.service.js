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
exports.SermonFlowSculptorService = void 0;
var common_1 = require("@nestjs/common");
var SermonFlowSculptorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SermonFlowSculptorService = _classThis = /** @class */ (function () {
        function SermonFlowSculptorService_1() {
        }
        SermonFlowSculptorService_1.prototype.generateSermonFlow = function (bigIdea, points, applications, supportingVerses, illustrations) {
            return __awaiter(this, void 0, void 0, function () {
                var nodes, connections, integrity;
                var _this = this;
                return __generator(this, function (_a) {
                    nodes = [];
                    connections = [];
                    // Central big idea node
                    nodes.push({
                        id: 'big-idea',
                        type: 'big_idea',
                        label: 'Big Idea',
                        content: bigIdea,
                        position: { x: 0, y: 0, z: 0 },
                        size: 3,
                        color: '#fbbf24',
                        strength: 1
                    });
                    // Points orbit around big idea
                    points.forEach(function (point, idx) {
                        var angle = (idx / points.length) * Math.PI * 2;
                        var radius = 8;
                        var pointId = "point-".concat(idx);
                        nodes.push({
                            id: pointId,
                            type: 'point',
                            label: "Point ".concat(idx + 1),
                            content: point,
                            position: {
                                x: Math.cos(angle) * radius,
                                y: 0,
                                z: Math.sin(angle) * radius
                            },
                            size: 2,
                            color: '#3b82f6',
                            strength: 0.8
                        });
                        // Connect point to big idea
                        connections.push({
                            source: 'big-idea',
                            target: pointId,
                            type: 'supports',
                            strength: 0.8,
                            color: '#3b82f6'
                        });
                        // Add supporting verses for this point
                        var verses = supportingVerses[point] || supportingVerses["point-".concat(idx)] || [];
                        verses.forEach(function (verse, vIdx) {
                            var verseAngle = angle + (vIdx - verses.length / 2) * 0.3;
                            var verseRadius = radius + 4;
                            var verseId = "verse-".concat(idx, "-").concat(vIdx);
                            nodes.push({
                                id: verseId,
                                type: 'verse',
                                label: verse,
                                content: verse,
                                position: {
                                    x: Math.cos(verseAngle) * verseRadius,
                                    y: -2,
                                    z: Math.sin(verseAngle) * verseRadius
                                },
                                size: 0.8,
                                color: '#10b981',
                                strength: 0.9
                            });
                            // Connect verse to point
                            var verseStrength = verses.length > 0 ? 0.9 : 0.3;
                            connections.push({
                                source: pointId,
                                target: verseId,
                                type: 'grounds',
                                strength: verseStrength,
                                color: '#10b981',
                                isWeak: verses.length === 0
                            });
                        });
                        // If no verses, mark as weak
                        if (verses.length === 0) {
                            connections.push({
                                source: pointId,
                                target: 'big-idea',
                                type: 'supports',
                                strength: 0.2,
                                color: '#ef4444',
                                isWeak: true
                            });
                        }
                    });
                    // Applications extend outward
                    applications.forEach(function (app, idx) {
                        var angle = (idx / applications.length) * Math.PI * 2;
                        var radius = 12;
                        var appId = "app-".concat(idx);
                        nodes.push({
                            id: appId,
                            type: 'application',
                            label: "Application ".concat(idx + 1),
                            content: app,
                            position: {
                                x: Math.cos(angle) * radius,
                                y: 3,
                                z: Math.sin(angle) * radius
                            },
                            size: 1.5,
                            color: '#8b5cf6',
                            strength: 0.6
                        });
                        // Try to connect application to relevant point
                        var connectedToPoint = _this.connectApplicationToPoint(app, points, appId, connections);
                        if (!connectedToPoint) {
                            // Weak connection to big idea if no point connection
                            connections.push({
                                source: 'big-idea',
                                target: appId,
                                type: 'applies',
                                strength: 0.3,
                                color: '#ef4444',
                                isWeak: true
                            });
                        }
                    });
                    // Add illustrations if provided
                    if (illustrations) {
                        illustrations.forEach(function (illus, idx) {
                            var angle = (idx / illustrations.length) * Math.PI * 2 + Math.PI / 4;
                            var radius = 10;
                            var illusId = "illus-".concat(idx);
                            nodes.push({
                                id: illusId,
                                type: 'illustration',
                                label: "Illustration ".concat(idx + 1),
                                content: illus,
                                position: {
                                    x: Math.cos(angle) * radius,
                                    y: -3,
                                    z: Math.sin(angle) * radius
                                },
                                size: 1.2,
                                color: '#ec4899',
                                strength: 0.5
                            });
                            // Connect to nearest point
                            var nearestPoint = "point-".concat(idx % points.length);
                            connections.push({
                                source: nearestPoint,
                                target: illusId,
                                type: 'illustrates',
                                strength: 0.6,
                                color: '#ec4899'
                            });
                        });
                    }
                    integrity = this.calculateIntegrity(nodes, connections, points, applications);
                    return [2 /*return*/, {
                            nodes: nodes,
                            connections: connections,
                            integrity: integrity
                        }];
                });
            });
        };
        SermonFlowSculptorService_1.prototype.connectApplicationToPoint = function (application, points, appId, connections) {
            // Simple keyword matching to connect application to relevant point
            var appWords = application.toLowerCase().split(/\s+/);
            var _loop_1 = function (i) {
                var pointWords = points[i].toLowerCase().split(/\s+/);
                var overlap = appWords.filter(function (w) { return pointWords.includes(w) && w.length > 3; }).length;
                if (overlap >= 2) {
                    connections.push({
                        source: "point-".concat(i),
                        target: appId,
                        type: 'applies',
                        strength: 0.7,
                        color: '#8b5cf6'
                    });
                    return { value: true };
                }
            };
            for (var i = 0; i < points.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return false;
        };
        SermonFlowSculptorService_1.prototype.calculateIntegrity = function (nodes, connections, points, applications) {
            var weakConnections = connections.filter(function (c) { return c.isWeak; });
            var weakPoints = [];
            var detachedApplications = [];
            var warnings = [];
            // Check for points without verses
            points.forEach(function (point, idx) {
                var pointId = "point-".concat(idx);
                var hasVerses = connections.some(function (c) { return c.source === pointId && c.type === 'grounds' && !c.isWeak; });
                if (!hasVerses) {
                    weakPoints.push("Point ".concat(idx + 1));
                    warnings.push("Point ".concat(idx + 1, " lacks scriptural grounding"));
                }
            });
            // Check for detached applications
            applications.forEach(function (app, idx) {
                var appId = "app-".concat(idx);
                var hasStrongConnection = connections.some(function (c) { return c.target === appId && c.strength > 0.5; });
                if (!hasStrongConnection) {
                    detachedApplications.push("Application ".concat(idx + 1));
                    warnings.push("Application ".concat(idx + 1, " not clearly derived from points"));
                }
            });
            // Calculate balance
            var pointNodes = nodes.filter(function (n) { return n.type === 'point'; });
            var verseNodes = nodes.filter(function (n) { return n.type === 'verse'; });
            var balanced = pointNodes.length > 0 && verseNodes.length >= pointNodes.length;
            // Calculate score
            var totalElements = points.length + applications.length;
            var weakElements = weakPoints.length + detachedApplications.length;
            var score = Math.max(0, Math.round(((totalElements - weakElements) / totalElements) * 100));
            return {
                score: score,
                balanced: balanced,
                weakPoints: weakPoints,
                detachedApplications: detachedApplications,
                warnings: warnings
            };
        };
        SermonFlowSculptorService_1.prototype.analyzeSermonBalance = function (flowData) {
            return __awaiter(this, void 0, void 0, function () {
                var pointCount, verseCount, appCount;
                return __generator(this, function (_a) {
                    pointCount = flowData.nodes.filter(function (n) { return n.type === 'point'; }).length;
                    verseCount = flowData.nodes.filter(function (n) { return n.type === 'verse'; }).length;
                    appCount = flowData.nodes.filter(function (n) { return n.type === 'application'; }).length;
                    return [2 /*return*/, {
                            pointCount: pointCount,
                            verseCount: verseCount,
                            appCount: appCount,
                            versesPerPoint: pointCount > 0 ? (verseCount / pointCount).toFixed(1) : 0,
                            appsPerPoint: pointCount > 0 ? (appCount / pointCount).toFixed(1) : 0,
                            recommendation: this.getBalanceRecommendation(pointCount, verseCount, appCount)
                        }];
                });
            });
        };
        SermonFlowSculptorService_1.prototype.getBalanceRecommendation = function (points, verses, apps) {
            if (verses < points) {
                return 'Add more scriptural support for your points';
            }
            if (apps < points) {
                return 'Consider adding more practical applications';
            }
            if (points > 5) {
                return 'Consider consolidating points for clarity';
            }
            return 'Sermon structure is well-balanced';
        };
        return SermonFlowSculptorService_1;
    }());
    __setFunctionName(_classThis, "SermonFlowSculptorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SermonFlowSculptorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SermonFlowSculptorService = _classThis;
}();
exports.SermonFlowSculptorService = SermonFlowSculptorService;
