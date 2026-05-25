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
exports.ProphecyFulfillmentService = void 0;
var common_1 = require("@nestjs/common");
var ProphecyFulfillmentService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProphecyFulfillmentService = _classThis = /** @class */ (function () {
        function ProphecyFulfillmentService_1() {
            this.prophecyData = {
                daniel7: {
                    reference: 'Daniel 7',
                    prophecies: [
                        { verse: 'Daniel 7:13-14', text: 'Son of Man coming with clouds', theme: 'kingdom', symbol: 'son_of_man' },
                        { verse: 'Daniel 7:25', text: 'Time, times, half a time', theme: 'persecution', symbol: 'time_period' },
                        { verse: 'Daniel 7:9-10', text: 'Ancient of Days', theme: 'judgment', symbol: 'throne' }
                    ],
                    fulfillments: [
                        { verse: 'Revelation 1:7', text: 'Coming with clouds', connection: 'Daniel 7:13-14' },
                        { verse: 'Revelation 12:14', text: 'Time, times, half a time', connection: 'Daniel 7:25' },
                        { verse: 'Revelation 20:11-12', text: 'Great white throne', connection: 'Daniel 7:9-10' }
                    ]
                },
                daniel8: {
                    reference: 'Daniel 8',
                    prophecies: [
                        { verse: 'Daniel 8:14', text: '2300 days', theme: 'sanctuary', symbol: 'time_prophecy' },
                        { verse: 'Daniel 8:11', text: 'Daily sacrifice taken away', theme: 'sanctuary', symbol: 'daily' }
                    ],
                    fulfillments: [
                        { verse: 'Hebrews 9:24', text: 'Christ enters heavenly sanctuary', connection: 'Daniel 8:14' }
                    ]
                },
                sanctuary: {
                    reference: 'Sanctuary Theme',
                    prophecies: [
                        { verse: 'Exodus 25:8', text: 'Make me a sanctuary', theme: 'sanctuary', symbol: 'dwelling' },
                        { verse: 'Leviticus 16', text: 'Day of Atonement', theme: 'sanctuary', symbol: 'cleansing' }
                    ],
                    fulfillments: [
                        { verse: 'Hebrews 8:1-2', text: 'True tabernacle', connection: 'Exodus 25:8' },
                        { verse: 'Hebrews 9:11-12', text: 'Christ our high priest', connection: 'Leviticus 16' },
                        { verse: 'Revelation 11:19', text: 'Temple in heaven opened', connection: 'Leviticus 16' }
                    ]
                },
                messiah: {
                    reference: 'Messianic Prophecies',
                    prophecies: [
                        { verse: 'Isaiah 53:5', text: 'Wounded for transgressions', theme: 'messiah', symbol: 'suffering_servant' },
                        { verse: 'Micah 5:2', text: 'Born in Bethlehem', theme: 'messiah', symbol: 'birthplace' },
                        { verse: 'Zechariah 9:9', text: 'King on donkey', theme: 'messiah', symbol: 'humble_king' }
                    ],
                    fulfillments: [
                        { verse: '1 Peter 2:24', text: 'Bore our sins', connection: 'Isaiah 53:5' },
                        { verse: 'Matthew 2:1', text: 'Born in Bethlehem', connection: 'Micah 5:2' },
                        { verse: 'Matthew 21:5', text: 'Enters on donkey', connection: 'Zechariah 9:9' }
                    ]
                }
            };
        }
        ProphecyFulfillmentService_1.prototype.generateProphecyWeb = function (focusTheme) {
            return __awaiter(this, void 0, void 0, function () {
                var nodes, connections, themes, prophecyNodes, fulfillmentNodes, strongConnections;
                return __generator(this, function (_a) {
                    nodes = [];
                    connections = [];
                    themes = [];
                    if (!focusTheme || focusTheme === 'all' || focusTheme === 'daniel') {
                        this.addDanielRevelationWeb(nodes, connections);
                        themes.push({ name: 'Daniel-Revelation', nodes: [], color: '#ef4444' });
                    }
                    if (!focusTheme || focusTheme === 'all' || focusTheme === 'sanctuary') {
                        this.addSanctuaryWeb(nodes, connections);
                        themes.push({ name: 'Sanctuary', nodes: [], color: '#fbbf24' });
                    }
                    if (!focusTheme || focusTheme === 'all' || focusTheme === 'messiah') {
                        this.addMessianicWeb(nodes, connections);
                        themes.push({ name: 'Messianic', nodes: [], color: '#3b82f6' });
                    }
                    prophecyNodes = nodes.filter(function (n) { return n.type === 'prophecy'; });
                    fulfillmentNodes = nodes.filter(function (n) { return n.type === 'fulfillment'; });
                    strongConnections = connections.filter(function (c) { return c.strength >= 0.9; });
                    return [2 /*return*/, {
                            nodes: nodes,
                            connections: connections,
                            themes: themes,
                            metadata: {
                                totalProphecies: prophecyNodes.length,
                                totalFulfillments: fulfillmentNodes.length,
                                strongestConnections: strongConnections.length
                            }
                        }];
                });
            });
        };
        ProphecyFulfillmentService_1.prototype.addDanielRevelationWeb = function (nodes, connections) {
            var _this = this;
            // Daniel 7 prophecies
            this.prophecyData.daniel7.prophecies.forEach(function (prop, idx) {
                var angle = (idx / 3) * Math.PI * 2;
                nodes.push({
                    id: "dan7-prop-".concat(idx),
                    reference: prop.verse,
                    text: prop.text,
                    type: 'prophecy',
                    book: 'Daniel',
                    testament: 'OT',
                    position: {
                        x: Math.cos(angle) * 10,
                        y: -5,
                        z: Math.sin(angle) * 10
                    },
                    size: 1.8,
                    color: '#ef4444',
                    significance: 'Major apocalyptic prophecy'
                });
            });
            // Revelation fulfillments
            this.prophecyData.daniel7.fulfillments.forEach(function (ful, idx) {
                var angle = (idx / 3) * Math.PI * 2;
                nodes.push({
                    id: "rev-ful-".concat(idx),
                    reference: ful.verse,
                    text: ful.text,
                    type: 'fulfillment',
                    book: 'Revelation',
                    testament: 'NT',
                    position: {
                        x: Math.cos(angle) * 10,
                        y: 5,
                        z: Math.sin(angle) * 10
                    },
                    size: 1.8,
                    color: '#8b5cf6',
                    significance: 'Apocalyptic fulfillment'
                });
                // Connect to prophecy
                var propIdx = _this.prophecyData.daniel7.prophecies.findIndex(function (p) { return p.verse === ful.connection; });
                if (propIdx >= 0) {
                    connections.push({
                        source: "dan7-prop-".concat(propIdx),
                        target: "rev-ful-".concat(idx),
                        type: 'fulfills',
                        strength: 0.95,
                        color: '#ef4444',
                        explanation: 'Direct prophetic fulfillment'
                    });
                }
            });
            // Daniel 8 - 2300 days
            nodes.push({
                id: 'dan8-2300',
                reference: 'Daniel 8:14',
                text: '2300 days prophecy',
                type: 'prophecy',
                book: 'Daniel',
                testament: 'OT',
                position: { x: 0, y: -8, z: 0 },
                size: 2.2,
                color: '#fbbf24',
                significance: 'Longest time prophecy'
            });
        };
        ProphecyFulfillmentService_1.prototype.addSanctuaryWeb = function (nodes, connections) {
            var _this = this;
            // OT Sanctuary
            this.prophecyData.sanctuary.prophecies.forEach(function (prop, idx) {
                nodes.push({
                    id: "sanc-ot-".concat(idx),
                    reference: prop.verse,
                    text: prop.text,
                    type: 'prophecy',
                    book: prop.verse.split(' ')[0],
                    testament: 'OT',
                    position: {
                        x: -8 + idx * 4,
                        y: -3,
                        z: -5
                    },
                    size: 1.6,
                    color: '#fbbf24',
                    significance: 'Sanctuary typology'
                });
            });
            // NT Fulfillment
            this.prophecyData.sanctuary.fulfillments.forEach(function (ful, idx) {
                nodes.push({
                    id: "sanc-nt-".concat(idx),
                    reference: ful.verse,
                    text: ful.text,
                    type: 'fulfillment',
                    book: ful.verse.split(' ')[0],
                    testament: 'NT',
                    position: {
                        x: -8 + idx * 4,
                        y: 3,
                        z: -5
                    },
                    size: 1.6,
                    color: '#10b981',
                    significance: 'Heavenly sanctuary reality'
                });
                // Connect
                var propIdx = _this.prophecyData.sanctuary.prophecies.findIndex(function (p) { return p.verse === ful.connection; });
                if (propIdx >= 0) {
                    connections.push({
                        source: "sanc-ot-".concat(propIdx),
                        target: "sanc-nt-".concat(idx),
                        type: 'typology',
                        strength: 0.9,
                        color: '#fbbf24',
                        explanation: 'Type meets antitype'
                    });
                }
            });
        };
        ProphecyFulfillmentService_1.prototype.addMessianicWeb = function (nodes, connections) {
            var _this = this;
            // Messianic prophecies
            this.prophecyData.messiah.prophecies.forEach(function (prop, idx) {
                var angle = (idx / 3) * Math.PI * 2 + Math.PI;
                nodes.push({
                    id: "messiah-prop-".concat(idx),
                    reference: prop.verse,
                    text: prop.text,
                    type: 'prophecy',
                    book: prop.verse.split(' ')[0],
                    testament: 'OT',
                    position: {
                        x: Math.cos(angle) * 8,
                        y: -4,
                        z: Math.sin(angle) * 8
                    },
                    size: 1.5,
                    color: '#3b82f6',
                    significance: 'Messianic prophecy'
                });
            });
            // NT Fulfillments
            this.prophecyData.messiah.fulfillments.forEach(function (ful, idx) {
                var angle = (idx / 3) * Math.PI * 2 + Math.PI;
                nodes.push({
                    id: "messiah-ful-".concat(idx),
                    reference: ful.verse,
                    text: ful.text,
                    type: 'fulfillment',
                    book: ful.verse.split(' ')[0],
                    testament: 'NT',
                    position: {
                        x: Math.cos(angle) * 8,
                        y: 4,
                        z: Math.sin(angle) * 8
                    },
                    size: 1.5,
                    color: '#10b981',
                    significance: 'Christ fulfills prophecy'
                });
                // Connect
                var propIdx = _this.prophecyData.messiah.prophecies.findIndex(function (p) { return p.verse === ful.connection; });
                if (propIdx >= 0) {
                    connections.push({
                        source: "messiah-prop-".concat(propIdx),
                        target: "messiah-ful-".concat(idx),
                        type: 'fulfills',
                        strength: 1.0,
                        color: '#3b82f6',
                        explanation: 'Messianic fulfillment in Christ'
                    });
                }
            });
        };
        ProphecyFulfillmentService_1.prototype.get2300DaysThread = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            prophecy: {
                                reference: 'Daniel 8:14',
                                text: 'Unto two thousand and three hundred days; then shall the sanctuary be cleansed',
                                significance: 'Longest time prophecy in Scripture'
                            },
                            connections: [
                                {
                                    reference: 'Daniel 9:24-27',
                                    text: '70 weeks prophecy',
                                    relationship: 'Starting point determination'
                                },
                                {
                                    reference: 'Ezra 7:7-9',
                                    text: '457 BC decree',
                                    relationship: 'Historical anchor'
                                },
                                {
                                    reference: 'Hebrews 8:1-2',
                                    text: 'Heavenly sanctuary',
                                    relationship: 'Sanctuary location'
                                },
                                {
                                    reference: 'Hebrews 9:23-24',
                                    text: 'Cleansing of heavenly things',
                                    relationship: 'Cleansing fulfillment'
                                }
                            ],
                            timeline: {
                                start: -457,
                                prophetic_end: 1844,
                                significance: 'Beginning of investigative judgment'
                            }
                        }];
                });
            });
        };
        return ProphecyFulfillmentService_1;
    }());
    __setFunctionName(_classThis, "ProphecyFulfillmentService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProphecyFulfillmentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProphecyFulfillmentService = _classThis;
}();
exports.ProphecyFulfillmentService = ProphecyFulfillmentService;
