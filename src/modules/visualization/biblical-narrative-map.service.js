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
exports.BiblicalNarrativeMapService = void 0;
var common_1 = require("@nestjs/common");
var STAGE_ORDER = [
    'Creation',
    'Fall',
    'Patriarchs',
    'Israel',
    'Kingdom',
    'Exile',
    'Messiah',
    'Church',
    'New Creation',
];
var THEME_PRESETS = {
    grace: ['Genesis 6:8', 'Psalm 103:8', 'John 1:16', 'Romans 3:24', 'Ephesians 2:8-10'],
    covenant: ['Genesis 12:1-3', 'Exodus 24:8', 'Jeremiah 31:31', 'Luke 22:20', 'Hebrews 9:15'],
    kingdom: ['2 Samuel 7:12-16', 'Isaiah 9:6-7', 'Matthew 4:17', 'Luke 17:21', 'Revelation 11:15'],
    redemption: ['Exodus 12:13', 'Isaiah 53:5', 'Mark 10:45', 'Ephesians 1:7', 'Revelation 5:9'],
    new_creation: ['Genesis 1:1', 'Ezekiel 36:26', 'John 3:3', '2 Corinthians 5:17', 'Revelation 21:5'],
};
var BiblicalNarrativeMapService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BiblicalNarrativeMapService = _classThis = /** @class */ (function () {
        function BiblicalNarrativeMapService_1(scriptureService, contractService) {
            this.scriptureService = scriptureService;
            this.contractService = contractService;
        }
        BiblicalNarrativeMapService_1.prototype.buildNarrativeMap = function (focusPassage, theme) {
            return __awaiter(this, void 0, void 0, function () {
                var focusStage, focusIndex, nodes, connections, usedRefs, focusNodeId, scriptureRefs;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            focusStage = this.resolveStage(focusPassage);
                            focusIndex = STAGE_ORDER.indexOf(focusStage);
                            nodes = [];
                            connections = [];
                            usedRefs = new Set();
                            focusNodeId = "focus:".concat(focusPassage);
                            nodes.push({
                                id: focusNodeId,
                                kind: 'focus_passage',
                                type: 'focus_passage',
                                reference: focusPassage,
                                label: focusPassage,
                                stage: focusStage,
                                stageIndex: focusIndex,
                                lane: 1,
                                x: focusIndex * 2,
                                y: 0,
                                themes: theme ? [theme] : [],
                                warningLevel: null,
                                sermonLinks: [],
                            });
                            usedRefs.add(this.normalizeRef(focusPassage));
                            return [4 /*yield*/, this.getScriptureConnections(focusPassage, theme)];
                        case 1:
                            scriptureRefs = _a.sent();
                            scriptureRefs.forEach(function (ref, index) {
                                var norm = _this.normalizeRef(ref);
                                if (usedRefs.has(norm))
                                    return;
                                usedRefs.add(norm);
                                var stage = _this.resolveStage(ref);
                                var stageIndex = STAGE_ORDER.indexOf(stage);
                                var lane = stageIndex < focusIndex ? 0 : stageIndex > focusIndex ? 2 : 1;
                                var relationType = stageIndex < focusIndex
                                    ? 'narrative_continuation'
                                    : stageIndex > focusIndex
                                        ? 'prophetic_fulfillment'
                                        : 'thematic';
                                var id = "ref:".concat(index, ":").concat(ref);
                                nodes.push({
                                    id: id,
                                    kind: 'cross_reference',
                                    type: 'cross_reference',
                                    reference: ref,
                                    label: ref,
                                    stage: stage,
                                    stageIndex: stageIndex,
                                    lane: lane,
                                    x: stageIndex * 2,
                                    y: lane === 0 ? -1.2 : lane === 2 ? 1.2 : 0,
                                    themes: theme ? [theme] : [],
                                    warningLevel: null,
                                });
                                connections.push({
                                    id: "".concat(focusNodeId, "->").concat(id),
                                    source: focusNodeId,
                                    target: id,
                                    type: relationType,
                                    relationType: relationType,
                                    strengthScore: lane === 1 ? 0.9 : 0.68,
                                    explanation: _this.buildExplanation(ref, stage, focusPassage, focusStage),
                                    evidence: {
                                        stage: stage,
                                        focusStage: focusStage,
                                        sourceType: 'bible',
                                    },
                                });
                            });
                            return [2 /*return*/, this.contractService.enrichGraph({
                                    nodes: nodes,
                                    connections: connections,
                                    timeline: STAGE_ORDER.map(function (stage, index) { return ({
                                        stage: stage,
                                        index: index,
                                        isFocusStage: stage === focusStage,
                                    }); }),
                                    metadata: {
                                        focusPassage: focusPassage,
                                        focusStage: focusStage,
                                        theme: theme || null,
                                        totalNodes: nodes.length,
                                        totalConnections: connections.length,
                                    },
                                })];
                    }
                });
            });
        };
        BiblicalNarrativeMapService_1.prototype.getScriptureConnections = function (focusPassage, theme) {
            return __awaiter(this, void 0, void 0, function () {
                var refs, clean, error_1, key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.scriptureService.getCrossReferences(focusPassage)];
                        case 1:
                            refs = _a.sent();
                            clean = Array.from(new Set((refs || []).filter(Boolean))).slice(0, 24);
                            if (clean.length > 0)
                                return [2 /*return*/, clean];
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error('[BiblicalNarrativeMap] Failed to fetch cross references:', error_1);
                            return [3 /*break*/, 3];
                        case 3:
                            key = String(theme || 'grace').toLowerCase().replace(/\s+/g, '_');
                            return [2 /*return*/, THEME_PRESETS[key] || THEME_PRESETS.grace];
                    }
                });
            });
        };
        BiblicalNarrativeMapService_1.prototype.buildExplanation = function (reference, stage, focusPassage, focusStage) {
            if (stage === focusStage) {
                return "".concat(reference, " reinforces the same narrative stage as ").concat(focusPassage, ".");
            }
            if (STAGE_ORDER.indexOf(stage) < STAGE_ORDER.indexOf(focusStage)) {
                return "".concat(reference, " provides an earlier canonical foundation leading toward ").concat(focusPassage, ".");
            }
            return "".concat(reference, " extends the trajectory of ").concat(focusPassage, " into later canonical development.");
        };
        BiblicalNarrativeMapService_1.prototype.resolveStage = function (reference) {
            var book = this.extractBook(reference);
            if (!book)
                return 'Church';
            var name = book.toLowerCase();
            if (/(genesis|g[eé]nesis)/.test(name))
                return 'Creation';
            if (/(job|salmos|psalm|proverbs|ecclesiastes)/.test(name))
                return 'Fall';
            if (/(exodus|leviticus|numbers|deuteronomy|joshua)/.test(name))
                return 'Israel';
            if (/(samuel|kings|chronicles|reyes|cr[oó]nicas)/.test(name))
                return 'Kingdom';
            if (/(isaiah|jeremiah|ezekiel|daniel|oseas|joel|amos|micah|nahum|habakkuk|zephaniah|haggai|zechariah|malachi)/.test(name)) {
                return 'Exile';
            }
            if (/(matthew|mark|luke|john|mateo|marcos|lucas|juan)/.test(name))
                return 'Messiah';
            if (/(acts|hechos|romans|corinthians|galatians|ephesians|philippians|colossians|thessalonians|timothy|titus|philemon|hebrews|james|peter|jude|apocalipsis|revelation)/.test(name)) {
                if (/(revelation|apocalipsis)/.test(name))
                    return 'New Creation';
                return 'Church';
            }
            if (/(abraham|isaac|jacob|patriarch)/.test(name))
                return 'Patriarchs';
            return 'Church';
        };
        BiblicalNarrativeMapService_1.prototype.extractBook = function (reference) {
            var clean = String(reference || '').trim();
            if (!clean)
                return '';
            var match = clean.match(/^[1-3]?\s*[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*/);
            return match ? match[0].trim() : clean.split(/[.:]/)[0].trim();
        };
        BiblicalNarrativeMapService_1.prototype.normalizeRef = function (reference) {
            return String(reference || '')
                .toLowerCase()
                .replace(/\s+/g, '')
                .replace(/[–—]/g, '-');
        };
        return BiblicalNarrativeMapService_1;
    }());
    __setFunctionName(_classThis, "BiblicalNarrativeMapService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BiblicalNarrativeMapService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BiblicalNarrativeMapService = _classThis;
}();
exports.BiblicalNarrativeMapService = BiblicalNarrativeMapService;
