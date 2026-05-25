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
exports.TimelineUniverseService = void 0;
var common_1 = require("@nestjs/common");
var TimelineUniverseService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TimelineUniverseService = _classThis = /** @class */ (function () {
        function TimelineUniverseService_1() {
            this.biblicalEvents = [
                { year: -4004, title: 'Creation', description: 'Creation of the world', importance: 10, references: ['Genesis 1-2'] },
                { year: -2348, title: 'The Flood', description: 'Global flood in Noah\'s time', importance: 9, references: ['Genesis 6-9'] },
                { year: -2000, title: 'Abraham Called', description: 'God calls Abraham', importance: 9, references: ['Genesis 12'] },
                { year: -1491, title: 'Exodus', description: 'Israel leaves Egypt', importance: 10, references: ['Exodus 12-14'] },
                { year: -1451, title: 'Ten Commandments', description: 'Law given at Sinai', importance: 10, references: ['Exodus 20'] },
                { year: -1010, title: 'David Becomes King', description: 'David anointed king', importance: 8, references: ['2 Samuel 5'] },
                { year: -970, title: 'Temple Built', description: 'Solomon builds temple', importance: 9, references: ['1 Kings 6'] },
                { year: -722, title: 'Israel Falls', description: 'Northern kingdom falls to Assyria', importance: 7, references: ['2 Kings 17'] },
                { year: -586, title: 'Judah Falls', description: 'Jerusalem destroyed by Babylon', importance: 8, references: ['2 Kings 25'] },
                { year: -538, title: 'Return from Exile', description: 'Jews return to Jerusalem', importance: 7, references: ['Ezra 1'] },
                { year: -457, title: 'Ezra Returns', description: 'Ezra leads second return', importance: 6, references: ['Ezra 7'] },
                { year: -4, title: 'Jesus Born', description: 'Birth of Christ', importance: 10, references: ['Matthew 1-2', 'Luke 2'] },
                { year: 27, title: 'Jesus Baptized', description: 'Jesus begins ministry', importance: 9, references: ['Matthew 3', 'Mark 1'] },
                { year: 31, title: 'Crucifixion', description: 'Jesus crucified and resurrected', importance: 10, references: ['Matthew 27-28'] },
                { year: 31, title: 'Pentecost', description: 'Holy Spirit given', importance: 9, references: ['Acts 2'] },
                { year: 34, title: 'Stephen Martyred', description: 'First Christian martyr', importance: 7, references: ['Acts 7'] },
                { year: 49, title: 'Jerusalem Council', description: 'Gentile inclusion decided', importance: 8, references: ['Acts 15'] },
                { year: 70, title: 'Temple Destroyed', description: 'Romans destroy Jerusalem temple', importance: 9, references: ['Matthew 24'] },
                { year: 95, title: 'Revelation Written', description: 'John writes Revelation', importance: 8, references: ['Revelation 1'] }
            ];
            this.politicalEvents = [
                { year: -753, title: 'Rome Founded', description: 'Traditional founding of Rome', importance: 6 },
                { year: -586, title: 'Babylonian Empire', description: 'Babylon at peak power', importance: 7 },
                { year: -539, title: 'Persian Empire', description: 'Persia conquers Babylon', importance: 7 },
                { year: -331, title: 'Greek Empire', description: 'Alexander conquers Persia', importance: 7 },
                { year: -63, title: 'Roman Control', description: 'Rome takes Judea', importance: 7 },
                { year: -27, title: 'Roman Empire Begins', description: 'Augustus becomes emperor', importance: 8 },
                { year: 64, title: 'Rome Burns', description: 'Great fire of Rome', importance: 6 },
                { year: 70, title: 'Jerusalem Falls', description: 'Titus destroys Jerusalem', importance: 9 },
                { year: 313, title: 'Edict of Milan', description: 'Christianity legalized', importance: 8 }
            ];
        }
        TimelineUniverseService_1.prototype.generateTimeline = function (startYear, endYear, categories) {
            return __awaiter(this, void 0, void 0, function () {
                var start, end, layers, allEvents, biblicalLayer, politicalLayer, empireLayer, eras;
                return __generator(this, function (_a) {
                    start = startYear || -4004;
                    end = endYear || 100;
                    layers = [];
                    allEvents = [];
                    // Biblical events layer
                    if (!categories || categories.includes('biblical')) {
                        biblicalLayer = this.createLayer('Biblical Events', 'biblical', this.biblicalEvents, start, end, 0, '#fbbf24');
                        layers.push(biblicalLayer);
                        allEvents.push.apply(allEvents, biblicalLayer.events);
                    }
                    // Political events layer
                    if (!categories || categories.includes('political')) {
                        politicalLayer = this.createLayer('Political Events', 'political', this.politicalEvents, start, end, 3, '#3b82f6');
                        layers.push(politicalLayer);
                        allEvents.push.apply(allEvents, politicalLayer.events);
                    }
                    // Empire layer
                    if (!categories || categories.includes('empire')) {
                        empireLayer = this.createEmpireLayer(start, end);
                        layers.push(empireLayer);
                        allEvents.push.apply(allEvents, empireLayer.events);
                    }
                    eras = this.defineEras();
                    return [2 /*return*/, {
                            layers: layers,
                            events: allEvents,
                            eras: eras,
                            metadata: {
                                totalEvents: allEvents.length,
                                timeSpan: Math.abs(start - end),
                                startYear: start,
                                endYear: end
                            }
                        }];
                });
            });
        };
        TimelineUniverseService_1.prototype.createLayer = function (name, category, events, startYear, endYear, yPosition, color) {
            var _this = this;
            var timelineEvents = events
                .filter(function (e) { return e.year >= startYear && e.year <= endYear; })
                .map(function (e) {
                var normalizedX = _this.normalizeYear(e.year, startYear, endYear);
                return {
                    id: "".concat(category, "-").concat(e.year),
                    year: Math.abs(e.year),
                    era: e.year < 0 ? 'BC' : 'AD',
                    title: e.title,
                    description: e.description,
                    category: category,
                    position: {
                        x: normalizedX,
                        y: yPosition,
                        z: 0
                    },
                    color: color,
                    importance: e.importance,
                    references: e.references
                };
            });
            return {
                name: name,
                category: category,
                events: timelineEvents,
                yPosition: yPosition,
                color: color
            };
        };
        TimelineUniverseService_1.prototype.createEmpireLayer = function (startYear, endYear) {
            var empires = [
                { year: -2000, title: 'Egyptian Empire', description: 'Egypt dominates region', importance: 7 },
                { year: -1200, title: 'Assyrian Empire', description: 'Assyria rises', importance: 7 },
                { year: -605, title: 'Babylonian Empire', description: 'Babylon dominates', importance: 8 },
                { year: -539, title: 'Persian Empire', description: 'Persia conquers', importance: 8 },
                { year: -331, title: 'Greek Empire', description: 'Alexander conquers', importance: 8 },
                { year: -63, title: 'Roman Empire', description: 'Rome dominates', importance: 9 }
            ];
            return this.createLayer('Empires', 'empire', empires, startYear, endYear, 6, '#ef4444');
        };
        TimelineUniverseService_1.prototype.normalizeYear = function (year, startYear, endYear) {
            var span = endYear - startYear;
            var position = year - startYear;
            return (position / span) * 100 - 50; // Center at 0, range -50 to 50
        };
        TimelineUniverseService_1.prototype.defineEras = function () {
            return [
                { name: 'Patriarchal', startYear: -4004, endYear: -1491, color: '#fbbf24' },
                { name: 'Exodus & Conquest', startYear: -1491, endYear: -1050, color: '#10b981' },
                { name: 'United Kingdom', startYear: -1050, endYear: -930, color: '#3b82f6' },
                { name: 'Divided Kingdom', startYear: -930, endYear: -586, color: '#8b5cf6' },
                { name: 'Exile & Return', startYear: -586, endYear: -4, color: '#ec4899' },
                { name: 'Life of Christ', startYear: -4, endYear: 31, color: '#fbbf24' },
                { name: 'Early Church', startYear: 31, endYear: 100, color: '#10b981' }
            ];
        };
        TimelineUniverseService_1.prototype.getEventDetails = function (year, category) {
            return __awaiter(this, void 0, void 0, function () {
                var allEvents;
                return __generator(this, function (_a) {
                    allEvents = __spreadArray(__spreadArray([], this.biblicalEvents, true), this.politicalEvents, true);
                    return [2 /*return*/, allEvents
                            .filter(function (e) { return Math.abs(e.year - year) <= 10; })
                            .filter(function (e) { return !category || e.category === category; })
                            .map(function (e) { return ({
                            id: "event-".concat(e.year),
                            year: Math.abs(e.year),
                            era: e.year < 0 ? 'BC' : 'AD',
                            title: e.title,
                            description: e.description,
                            category: 'biblical',
                            position: { x: 0, y: 0, z: 0 },
                            color: '#fbbf24',
                            importance: e.importance,
                            references: e.references
                        }); })];
                });
            });
        };
        TimelineUniverseService_1.prototype.getContextForYear = function (year) {
            return __awaiter(this, void 0, void 0, function () {
                var events, era;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getEventDetails(year)];
                        case 1:
                            events = _a.sent();
                            era = this.defineEras().find(function (e) { return year >= e.startYear && year <= e.endYear; });
                            return [2 /*return*/, {
                                    year: year,
                                    era: (era === null || era === void 0 ? void 0 : era.name) || 'Unknown',
                                    events: events,
                                    politicalContext: this.getPoliticalContext(year),
                                    biblicalContext: this.getBiblicalContext(year)
                                }];
                    }
                });
            });
        };
        TimelineUniverseService_1.prototype.getPoliticalContext = function (year) {
            if (year < -539)
                return 'Babylonian dominance';
            if (year < -331)
                return 'Persian Empire';
            if (year < -63)
                return 'Greek influence';
            if (year < 476)
                return 'Roman Empire';
            return 'Post-Roman';
        };
        TimelineUniverseService_1.prototype.getBiblicalContext = function (year) {
            if (year < -1491)
                return 'Patriarchal period';
            if (year < -1050)
                return 'Exodus and Judges';
            if (year < -586)
                return 'Kingdom period';
            if (year < 0)
                return 'Exile and return';
            if (year < 100)
                return 'New Testament era';
            return 'Early church';
        };
        return TimelineUniverseService_1;
    }());
    __setFunctionName(_classThis, "TimelineUniverseService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TimelineUniverseService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TimelineUniverseService = _classThis;
}();
exports.TimelineUniverseService = TimelineUniverseService;
