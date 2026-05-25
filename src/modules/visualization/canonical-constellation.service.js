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
exports.CanonicalConstellationService = void 0;
var common_1 = require("@nestjs/common");
var CanonicalConstellationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CanonicalConstellationService = _classThis = /** @class */ (function () {
        function CanonicalConstellationService_1(scriptureService) {
            this.scriptureService = scriptureService;
            this.bibleStructure = {
                'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
                'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
                '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
                'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
                'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
                'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12,
                'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4,
                'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2,
                'Zechariah': 14, 'Malachi': 4,
                'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28,
                'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6,
                'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5,
                '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3,
                'Philemon': 1, 'Hebrews': 13, 'James': 5, '1 Peter': 5, '2 Peter': 3,
                '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
            };
        }
        CanonicalConstellationService_1.prototype.createConnection = function (source, target, type, strength, explanation, canonicalSignificance, sourceEra, targetEra) {
            var strengthValues = { strong: 0.9, moderate: 0.6, weak: 0.3 };
            var typeStyles = {
                direct_quotation: { color: '#22d3ee', lineType: 'solid', animated: false, glow: true },
                prophetic_fulfillment: { color: '#ef4444', lineType: 'solid', animated: true, glow: true },
                typology: { color: '#8b5cf6', lineType: 'dashed', animated: false, glow: false },
                thematic_echo: { color: '#10b981', lineType: 'dotted', animated: false, glow: false },
                covenant_development: { color: '#fbbf24', lineType: 'solid', animated: true, glow: true },
                narrative_continuation: { color: '#6b7280', lineType: 'solid', animated: false, glow: false }
            };
            var style = typeStyles[type];
            var direction = this.getCanonicalDirection(sourceEra, targetEra);
            return {
                id: "".concat(source, "-").concat(target, "-").concat(type),
                source: source,
                target: target,
                type: type,
                strength: strength,
                strengthValue: strengthValues[strength],
                explanation: explanation,
                canonicalSignificance: canonicalSignificance,
                direction: direction,
                sourceEra: sourceEra,
                targetEra: targetEra,
                color: style.color,
                visualStyle: {
                    lineType: style.lineType,
                    animated: style.animated,
                    glow: style.glow
                }
            };
        };
        CanonicalConstellationService_1.prototype.getCanonicalDirection = function (sourceEra, targetEra) {
            var eraOrder = ['Torah', 'History', 'Wisdom', 'Prophets', 'Gospels', 'Acts', 'Epistles', 'Revelation'];
            var sourceIdx = eraOrder.indexOf(sourceEra);
            var targetIdx = eraOrder.indexOf(targetEra);
            if (sourceIdx < targetIdx)
                return 'forward';
            if (sourceIdx > targetIdx)
                return 'backward';
            return 'bidirectional';
        };
        CanonicalConstellationService_1.prototype.getBookEra = function (bookName) {
            var eras = {
                'Genesis': 'Torah', 'Exodus': 'Torah', 'Leviticus': 'Torah', 'Numbers': 'Torah', 'Deuteronomy': 'Torah',
                'Joshua': 'History', 'Judges': 'History', 'Ruth': 'History', '1 Samuel': 'History', '2 Samuel': 'History',
                '1 Kings': 'History', '2 Kings': 'History', '1 Chronicles': 'History', '2 Chronicles': 'History',
                'Ezra': 'History', 'Nehemiah': 'History', 'Esther': 'History',
                'Job': 'Wisdom', 'Psalms': 'Wisdom', 'Proverbs': 'Wisdom', 'Ecclesiastes': 'Wisdom', 'Song of Solomon': 'Wisdom',
                'Isaiah': 'Prophets', 'Jeremiah': 'Prophets', 'Lamentations': 'Prophets', 'Ezekiel': 'Prophets', 'Daniel': 'Prophets',
                'Hosea': 'Prophets', 'Joel': 'Prophets', 'Amos': 'Prophets', 'Obadiah': 'Prophets', 'Jonah': 'Prophets',
                'Micah': 'Prophets', 'Nahum': 'Prophets', 'Habakkuk': 'Prophets', 'Zephaniah': 'Prophets', 'Haggai': 'Prophets',
                'Zechariah': 'Prophets', 'Malachi': 'Prophets',
                'Matthew': 'Gospels', 'Mark': 'Gospels', 'Luke': 'Gospels', 'John': 'Gospels',
                'Acts': 'Acts',
                'Romans': 'Epistles', '1 Corinthians': 'Epistles', '2 Corinthians': 'Epistles', 'Galatians': 'Epistles',
                'Ephesians': 'Epistles', 'Philippians': 'Epistles', 'Colossians': 'Epistles', '1 Thessalonians': 'Epistles',
                '2 Thessalonians': 'Epistles', '1 Timothy': 'Epistles', '2 Timothy': 'Epistles', 'Titus': 'Epistles',
                'Philemon': 'Epistles', 'Hebrews': 'Epistles', 'James': 'Epistles', '1 Peter': 'Epistles', '2 Peter': 'Epistles',
                '1 John': 'Epistles', '2 John': 'Epistles', '3 John': 'Epistles', 'Jude': 'Epistles',
                'Revelation': 'Revelation'
            };
            return eras[bookName] || 'Unknown';
        };
        CanonicalConstellationService_1.prototype.generateConstellation = function (focusPassage, includeTypes) {
            return __awaiter(this, void 0, void 0, function () {
                var nodes, connections, books, otBooks, ntBooks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            nodes = [];
                            connections = [];
                            books = Object.keys(this.bibleStructure);
                            otBooks = books.slice(0, 39);
                            ntBooks = books.slice(39);
                            // Position OT books in one hemisphere, NT in another
                            otBooks.forEach(function (book, idx) {
                                var angle = (idx / otBooks.length) * Math.PI * 2;
                                var radius = 15;
                                nodes.push({
                                    id: "book-".concat(book),
                                    type: 'book',
                                    label: book,
                                    reference: book,
                                    position: {
                                        x: Math.cos(angle) * radius,
                                        y: -5,
                                        z: Math.sin(angle) * radius
                                    },
                                    size: 1.5,
                                    color: '#3b82f6' // Blue for OT
                                });
                            });
                            ntBooks.forEach(function (book, idx) {
                                var angle = (idx / ntBooks.length) * Math.PI * 2;
                                var radius = 12;
                                nodes.push({
                                    id: "book-".concat(book),
                                    type: 'book',
                                    label: book,
                                    reference: book,
                                    position: {
                                        x: Math.cos(angle) * radius,
                                        y: 5,
                                        z: Math.sin(angle) * radius
                                    },
                                    size: 1.5,
                                    color: '#8b5cf6' // Purple for NT
                                });
                            });
                            if (!focusPassage) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.addFocusPassageNodes(focusPassage, nodes, connections)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            // Add thematic connections
                            this.addThematicConnections(nodes, connections, includeTypes);
                            return [2 /*return*/, {
                                    nodes: nodes,
                                    connections: connections,
                                    metadata: {
                                        totalBooks: books.length,
                                        totalChapters: Object.values(this.bibleStructure).reduce(function (a, b) { return a + b; }, 0),
                                        totalConnections: connections.length
                                    }
                                }];
                    }
                });
            });
        };
        CanonicalConstellationService_1.prototype.addFocusPassageNodes = function (passage, nodes, connections) {
            return __awaiter(this, void 0, void 0, function () {
                var crossRefs_1, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.scriptureService.getCrossReferences(passage)];
                        case 1:
                            crossRefs_1 = _a.sent();
                            // Add focus passage as glowing node
                            nodes.push({
                                id: "focus-".concat(passage),
                                type: 'verse',
                                label: passage,
                                reference: passage,
                                position: { x: 0, y: 0, z: 0 },
                                size: 2.5,
                                color: '#fbbf24', // Gold
                                isSelected: true
                            });
                            // Add cross reference nodes
                            crossRefs_1.slice(0, 20).forEach(function (ref, idx) {
                                var angle = (idx / crossRefs_1.length) * Math.PI * 2;
                                var radius = 8;
                                var refString = typeof ref === 'string' ? ref : ref.reference;
                                nodes.push({
                                    id: "ref-".concat(refString),
                                    type: 'verse',
                                    label: refString,
                                    reference: refString,
                                    position: {
                                        x: Math.cos(angle) * radius,
                                        y: Math.sin(idx) * 2,
                                        z: Math.sin(angle) * radius
                                    },
                                    size: 1.2,
                                    color: '#10b981' // Green
                                });
                                // Add connection
                                connections.push(_this.createConnection("focus-".concat(passage), "ref-".concat(refString), 'thematic_echo', 'strong', "Cross-reference connection from ".concat(passage, " to ").concat(refString), 'These passages share thematic or theological connections', 'Unknown', 'Unknown'));
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error('[Constellation] Error adding focus passage:', error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CanonicalConstellationService_1.prototype.addThematicConnections = function (nodes, connections, includeTypes) {
            // Covenant connections
            if (!includeTypes || includeTypes.includes('covenant')) {
                this.addCovenantConnections(nodes, connections);
            }
            // Prophetic connections
            if (!includeTypes || includeTypes.includes('prophetic')) {
                this.addPropheticConnections(nodes, connections);
            }
            // Typological connections
            if (!includeTypes || includeTypes.includes('typological')) {
                this.addTypologicalConnections(nodes, connections);
            }
        };
        CanonicalConstellationService_1.prototype.addCovenantConnections = function (nodes, connections) {
            var _this = this;
            var covenantBooks = [
                { source: 'Genesis', target: 'Exodus', type: 'covenant' },
                { source: 'Exodus', target: 'Deuteronomy', type: 'covenant' },
                { source: 'Deuteronomy', target: '2 Samuel', type: 'covenant' },
                { source: '2 Samuel', target: 'Jeremiah', type: 'covenant' },
                { source: 'Jeremiah', target: 'Hebrews', type: 'covenant' },
                { source: 'Hebrews', target: 'Revelation', type: 'covenant' }
            ];
            covenantBooks.forEach(function (_a) {
                var source = _a.source, target = _a.target;
                var sourceNode = nodes.find(function (n) { return n.label === source; });
                var targetNode = nodes.find(function (n) { return n.label === target; });
                if (sourceNode && targetNode) {
                    connections.push(_this.createConnection(sourceNode.id, targetNode.id, 'covenant_development', 'strong', "Covenant development from ".concat(source, " to ").concat(target), 'This connection traces the progressive revelation of God\'s covenant through redemptive history', _this.getBookEra(source), _this.getBookEra(target)));
                }
            });
        };
        CanonicalConstellationService_1.prototype.addPropheticConnections = function (nodes, connections) {
            var _this = this;
            var propheticPairs = [
                { source: 'Daniel', target: 'Revelation' },
                { source: 'Isaiah', target: 'Matthew' },
                { source: 'Jeremiah', target: 'Hebrews' },
                { source: 'Ezekiel', target: 'Revelation' },
                { source: 'Zechariah', target: 'Revelation' }
            ];
            propheticPairs.forEach(function (_a) {
                var source = _a.source, target = _a.target;
                var sourceNode = nodes.find(function (n) { return n.label === source; });
                var targetNode = nodes.find(function (n) { return n.label === target; });
                if (sourceNode && targetNode) {
                    connections.push(_this.createConnection(sourceNode.id, targetNode.id, 'prophetic_fulfillment', 'strong', "Prophetic fulfillment: ".concat(source, " prophecy fulfilled in ").concat(target), 'Old Testament prophecy finds its fulfillment in the New Testament revelation', _this.getBookEra(source), _this.getBookEra(target)));
                }
            });
        };
        CanonicalConstellationService_1.prototype.addTypologicalConnections = function (nodes, connections) {
            var _this = this;
            var typologicalPairs = [
                { source: 'Exodus', target: 'John' },
                { source: 'Leviticus', target: 'Hebrews' },
                { source: 'Numbers', target: '1 Corinthians' },
                { source: 'Joshua', target: 'Hebrews' },
                { source: '1 Samuel', target: 'Luke' }
            ];
            typologicalPairs.forEach(function (_a) {
                var source = _a.source, target = _a.target;
                var sourceNode = nodes.find(function (n) { return n.label === source; });
                var targetNode = nodes.find(function (n) { return n.label === target; });
                if (sourceNode && targetNode) {
                    connections.push(_this.createConnection(sourceNode.id, targetNode.id, 'typology', 'moderate', "Typological connection: ".concat(source, " prefigures truths revealed in ").concat(target), 'Old Testament patterns and types point forward to their fulfillment in Christ', _this.getBookEra(source), _this.getBookEra(target)));
                }
            });
        };
        CanonicalConstellationService_1.prototype.getBookCluster = function (bookName) {
            return __awaiter(this, void 0, void 0, function () {
                var nodes, connections, chapterCount, i, angle, radius, era;
                return __generator(this, function (_a) {
                    if (!bookName || !this.bibleStructure[bookName]) {
                        return [2 /*return*/, { nodes: [], connections: [], metadata: { totalBooks: 0, totalChapters: 0, totalConnections: 0 } }];
                    }
                    nodes = [];
                    connections = [];
                    chapterCount = this.bibleStructure[bookName];
                    // Create chapter nodes in a spiral
                    for (i = 1; i <= chapterCount; i++) {
                        angle = (i / chapterCount) * Math.PI * 4;
                        radius = 5 + (i / chapterCount) * 3;
                        nodes.push({
                            id: "".concat(bookName, "-").concat(i),
                            type: 'chapter',
                            label: "".concat(bookName, " ").concat(i),
                            reference: "".concat(bookName, " ").concat(i),
                            position: {
                                x: Math.cos(angle) * radius,
                                y: i * 0.3,
                                z: Math.sin(angle) * radius
                            },
                            size: 1,
                            color: '#8b5cf6'
                        });
                        // Connect sequential chapters
                        if (i > 1) {
                            era = this.getBookEra(bookName);
                            connections.push(this.createConnection("".concat(bookName, "-").concat(i - 1), "".concat(bookName, "-").concat(i), 'narrative_continuation', 'weak', "Sequential chapter progression in ".concat(bookName), 'Narrative flow within the same book', era, era));
                        }
                    }
                    return [2 /*return*/, {
                            nodes: nodes,
                            connections: connections,
                            metadata: {
                                totalBooks: 1,
                                totalChapters: chapterCount,
                                totalConnections: connections.length
                            }
                        }];
                });
            });
        };
        return CanonicalConstellationService_1;
    }());
    __setFunctionName(_classThis, "CanonicalConstellationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CanonicalConstellationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CanonicalConstellationService = _classThis;
}();
exports.CanonicalConstellationService = CanonicalConstellationService;
