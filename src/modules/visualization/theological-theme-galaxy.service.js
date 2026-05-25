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
exports.TheologicalThemeGalaxyService = void 0;
var common_1 = require("@nestjs/common");
var TheologicalThemeGalaxyService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TheologicalThemeGalaxyService = _classThis = /** @class */ (function () {
        function TheologicalThemeGalaxyService_1() {
            this.themeData = {
                covenant: {
                    abrahamic: [
                        { ref: 'Genesis 12:1-3', text: 'I will make you a great nation', importance: 10 },
                        { ref: 'Genesis 15:5', text: 'Your descendants as stars', importance: 9 },
                        { ref: 'Genesis 17:7', text: 'Everlasting covenant', importance: 10 },
                        { ref: 'Galatians 3:8', text: 'Gospel preached to Abraham', importance: 9 },
                        { ref: 'Galatians 3:29', text: 'Abraham\'s seed', importance: 8 }
                    ],
                    mosaic: [
                        { ref: 'Exodus 19:5-6', text: 'Kingdom of priests', importance: 10 },
                        { ref: 'Exodus 24:7-8', text: 'Blood of covenant', importance: 9 },
                        { ref: 'Deuteronomy 29:1', text: 'Covenant in Moab', importance: 8 },
                        { ref: 'Hebrews 8:6-7', text: 'First covenant had faults', importance: 8 }
                    ],
                    davidic: [
                        { ref: '2 Samuel 7:12-13', text: 'Throne forever', importance: 10 },
                        { ref: 'Psalm 89:3-4', text: 'Covenant with David', importance: 9 },
                        { ref: 'Luke 1:32-33', text: 'Throne of David', importance: 10 },
                        { ref: 'Acts 2:30', text: 'Christ from David', importance: 9 }
                    ],
                    new: [
                        { ref: 'Jeremiah 31:31-33', text: 'New covenant promised', importance: 10 },
                        { ref: 'Luke 22:20', text: 'New covenant in blood', importance: 10 },
                        { ref: 'Hebrews 8:8-10', text: 'New covenant established', importance: 10 },
                        { ref: 'Hebrews 9:15', text: 'Mediator of new covenant', importance: 9 }
                    ],
                    fulfillment: [
                        { ref: 'Revelation 21:3', text: 'God dwelling with people', importance: 10 },
                        { ref: 'Revelation 22:3-5', text: 'No more curse', importance: 9 }
                    ]
                },
                kingdom: {
                    promised: [
                        { ref: 'Daniel 2:44', text: 'Kingdom never destroyed', importance: 10 },
                        { ref: 'Daniel 7:13-14', text: 'Everlasting dominion', importance: 10 }
                    ],
                    present: [
                        { ref: 'Matthew 4:17', text: 'Kingdom at hand', importance: 9 },
                        { ref: 'Luke 17:21', text: 'Kingdom within you', importance: 8 },
                        { ref: 'Colossians 1:13', text: 'Transferred to kingdom', importance: 9 }
                    ],
                    future: [
                        { ref: 'Matthew 25:31-34', text: 'Inherit the kingdom', importance: 9 },
                        { ref: 'Revelation 11:15', text: 'Kingdom of our Lord', importance: 10 },
                        { ref: 'Revelation 21:1', text: 'New heaven and earth', importance: 10 }
                    ]
                },
                salvation: {
                    promised: [
                        { ref: 'Genesis 3:15', text: 'Seed of woman', importance: 10 },
                        { ref: 'Isaiah 53:5', text: 'Wounded for us', importance: 10 }
                    ],
                    accomplished: [
                        { ref: 'John 3:16', text: 'God so loved', importance: 10 },
                        { ref: 'Romans 5:8', text: 'Christ died for us', importance: 10 },
                        { ref: 'Ephesians 2:8-9', text: 'By grace through faith', importance: 10 }
                    ],
                    applied: [
                        { ref: 'Romans 10:9-10', text: 'Confess and believe', importance: 9 },
                        { ref: '1 John 1:9', text: 'Confess and cleansed', importance: 9 }
                    ]
                }
            };
        }
        TheologicalThemeGalaxyService_1.prototype.generateThemeGalaxy = function (theme) {
            return __awaiter(this, void 0, void 0, function () {
                var nodes, connections, clusters;
                return __generator(this, function (_a) {
                    nodes = [];
                    connections = [];
                    clusters = [];
                    switch (theme.toLowerCase()) {
                        case 'covenant':
                            this.buildCovenantGalaxy(nodes, connections, clusters);
                            break;
                        case 'kingdom':
                            this.buildKingdomGalaxy(nodes, connections, clusters);
                            break;
                        case 'salvation':
                            this.buildSalvationGalaxy(nodes, connections, clusters);
                            break;
                        default:
                            this.buildCovenantGalaxy(nodes, connections, clusters);
                    }
                    return [2 /*return*/, {
                            nodes: nodes,
                            connections: connections,
                            clusters: clusters,
                            metadata: {
                                totalNodes: nodes.length,
                                totalConnections: connections.length,
                                primaryTheme: theme
                            }
                        }];
                });
            });
        };
        TheologicalThemeGalaxyService_1.prototype.buildCovenantGalaxy = function (nodes, connections, clusters) {
            // Abrahamic cluster
            var abrahamicNodes = this.createCluster('abrahamic', this.themeData.covenant.abrahamic, { x: -15, y: 0, z: 0 }, '#fbbf24', 'covenant');
            nodes.push.apply(nodes, abrahamicNodes);
            clusters.push({
                name: 'Abrahamic Covenant',
                theme: 'covenant',
                nodes: abrahamicNodes.map(function (n) { return n.id; }),
                center: { x: -15, y: 0, z: 0 },
                color: '#fbbf24'
            });
            // Mosaic cluster
            var mosaicNodes = this.createCluster('mosaic', this.themeData.covenant.mosaic, { x: -7, y: -5, z: 0 }, '#3b82f6', 'covenant');
            nodes.push.apply(nodes, mosaicNodes);
            clusters.push({
                name: 'Mosaic Covenant',
                theme: 'covenant',
                nodes: mosaicNodes.map(function (n) { return n.id; }),
                center: { x: -7, y: -5, z: 0 },
                color: '#3b82f6'
            });
            // Davidic cluster
            var davidicNodes = this.createCluster('davidic', this.themeData.covenant.davidic, { x: 0, y: 0, z: 0 }, '#8b5cf6', 'covenant');
            nodes.push.apply(nodes, davidicNodes);
            clusters.push({
                name: 'Davidic Covenant',
                theme: 'covenant',
                nodes: davidicNodes.map(function (n) { return n.id; }),
                center: { x: 0, y: 0, z: 0 },
                color: '#8b5cf6'
            });
            // New Covenant cluster
            var newNodes = this.createCluster('new', this.themeData.covenant.new, { x: 7, y: 5, z: 0 }, '#10b981', 'covenant');
            nodes.push.apply(nodes, newNodes);
            clusters.push({
                name: 'New Covenant',
                theme: 'covenant',
                nodes: newNodes.map(function (n) { return n.id; }),
                center: { x: 7, y: 5, z: 0 },
                color: '#10b981'
            });
            // Fulfillment cluster
            var fulfillmentNodes = this.createCluster('fulfillment', this.themeData.covenant.fulfillment, { x: 15, y: 0, z: 0 }, '#ef4444', 'covenant');
            nodes.push.apply(nodes, fulfillmentNodes);
            clusters.push({
                name: 'Covenant Fulfillment',
                theme: 'covenant',
                nodes: fulfillmentNodes.map(function (n) { return n.id; }),
                center: { x: 15, y: 0, z: 0 },
                color: '#ef4444'
            });
            // Connect clusters showing progression
            this.connectClusters(abrahamicNodes, mosaicNodes, connections, 'develops', '#fbbf24');
            this.connectClusters(mosaicNodes, davidicNodes, connections, 'develops', '#3b82f6');
            this.connectClusters(davidicNodes, newNodes, connections, 'fulfills', '#8b5cf6');
            this.connectClusters(newNodes, fulfillmentNodes, connections, 'fulfills', '#10b981');
        };
        TheologicalThemeGalaxyService_1.prototype.buildKingdomGalaxy = function (nodes, connections, clusters) {
            // Promised Kingdom
            var promisedNodes = this.createCluster('promised', this.themeData.kingdom.promised, { x: -10, y: 0, z: 0 }, '#fbbf24', 'kingdom');
            nodes.push.apply(nodes, promisedNodes);
            clusters.push({
                name: 'Promised Kingdom',
                theme: 'kingdom',
                nodes: promisedNodes.map(function (n) { return n.id; }),
                center: { x: -10, y: 0, z: 0 },
                color: '#fbbf24'
            });
            // Present Kingdom
            var presentNodes = this.createCluster('present', this.themeData.kingdom.present, { x: 0, y: 0, z: 0 }, '#3b82f6', 'kingdom');
            nodes.push.apply(nodes, presentNodes);
            clusters.push({
                name: 'Present Kingdom',
                theme: 'kingdom',
                nodes: presentNodes.map(function (n) { return n.id; }),
                center: { x: 0, y: 0, z: 0 },
                color: '#3b82f6'
            });
            // Future Kingdom
            var futureNodes = this.createCluster('future', this.themeData.kingdom.future, { x: 10, y: 0, z: 0 }, '#10b981', 'kingdom');
            nodes.push.apply(nodes, futureNodes);
            clusters.push({
                name: 'Future Kingdom',
                theme: 'kingdom',
                nodes: futureNodes.map(function (n) { return n.id; }),
                center: { x: 10, y: 0, z: 0 },
                color: '#10b981'
            });
            // Connect progression
            this.connectClusters(promisedNodes, presentNodes, connections, 'fulfills', '#fbbf24');
            this.connectClusters(presentNodes, futureNodes, connections, 'develops', '#3b82f6');
        };
        TheologicalThemeGalaxyService_1.prototype.buildSalvationGalaxy = function (nodes, connections, clusters) {
            // Promised Salvation
            var promisedNodes = this.createCluster('promised', this.themeData.salvation.promised, { x: -10, y: 0, z: 0 }, '#fbbf24', 'salvation');
            nodes.push.apply(nodes, promisedNodes);
            // Accomplished Salvation
            var accomplishedNodes = this.createCluster('accomplished', this.themeData.salvation.accomplished, { x: 0, y: 0, z: 0 }, '#10b981', 'salvation');
            nodes.push.apply(nodes, accomplishedNodes);
            // Applied Salvation
            var appliedNodes = this.createCluster('applied', this.themeData.salvation.applied, { x: 10, y: 0, z: 0 }, '#3b82f6', 'salvation');
            nodes.push.apply(nodes, appliedNodes);
            // Connect
            this.connectClusters(promisedNodes, accomplishedNodes, connections, 'fulfills', '#fbbf24');
            this.connectClusters(accomplishedNodes, appliedNodes, connections, 'develops', '#10b981');
        };
        TheologicalThemeGalaxyService_1.prototype.createCluster = function (clusterName, data, center, color, category) {
            var _this = this;
            return data.map(function (item, idx) {
                var angle = (idx / data.length) * Math.PI * 2;
                var radius = 3;
                return {
                    id: "".concat(clusterName, "-").concat(idx),
                    theme: clusterName,
                    reference: item.ref,
                    text: item.text,
                    testament: _this.getTestament(item.ref),
                    category: category,
                    position: {
                        x: center.x + Math.cos(angle) * radius,
                        y: center.y + Math.sin(idx) * 1.5,
                        z: center.z + Math.sin(angle) * radius
                    },
                    size: item.importance / 10,
                    color: color,
                    importance: item.importance
                };
            });
        };
        TheologicalThemeGalaxyService_1.prototype.connectClusters = function (source, target, connections, type, color) {
            // Connect central nodes of each cluster
            if (source.length > 0 && target.length > 0) {
                var sourceCenter = source[Math.floor(source.length / 2)];
                var targetCenter = target[Math.floor(target.length / 2)];
                connections.push({
                    source: sourceCenter.id,
                    target: targetCenter.id,
                    type: type,
                    strength: 0.9,
                    color: color
                });
            }
        };
        TheologicalThemeGalaxyService_1.prototype.getTestament = function (reference) {
            var otBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua',
                'Judges', 'Ruth', 'Samuel', 'Kings', 'Chronicles', 'Ezra', 'Nehemiah',
                'Esther', 'Job', 'Psalm', 'Proverbs', 'Ecclesiastes', 'Song', 'Isaiah',
                'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
                'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
                'Zechariah', 'Malachi'];
            var book = reference.split(' ')[0];
            return otBooks.some(function (b) { return book.includes(b); }) ? 'OT' : 'NT';
        };
        TheologicalThemeGalaxyService_1.prototype.getThemeProgression = function (theme) {
            return __awaiter(this, void 0, void 0, function () {
                var galaxy;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.generateThemeGalaxy(theme)];
                        case 1:
                            galaxy = _a.sent();
                            return [2 /*return*/, {
                                    theme: theme,
                                    progression: galaxy.clusters.map(function (c) { return ({
                                        stage: c.name,
                                        nodeCount: c.nodes.length,
                                        color: c.color
                                    }); }),
                                    totalNodes: galaxy.metadata.totalNodes,
                                    connections: galaxy.metadata.totalConnections
                                }];
                    }
                });
            });
        };
        return TheologicalThemeGalaxyService_1;
    }());
    __setFunctionName(_classThis, "TheologicalThemeGalaxyService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TheologicalThemeGalaxyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TheologicalThemeGalaxyService = _classThis;
}();
exports.TheologicalThemeGalaxyService = TheologicalThemeGalaxyService;
