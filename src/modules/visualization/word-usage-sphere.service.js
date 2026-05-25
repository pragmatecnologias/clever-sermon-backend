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
exports.WordUsageSphereService = void 0;
var common_1 = require("@nestjs/common");
var WordUsageSphereService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WordUsageSphereService = _classThis = /** @class */ (function () {
        function WordUsageSphereService_1() {
            this.bookPositions = {
                // OT books - positioned in one hemisphere
                'Genesis': { angle: 0, radius: 10, hemisphere: 'OT' },
                'Exodus': { angle: 0.5, radius: 10, hemisphere: 'OT' },
                'Psalms': { angle: 1.5, radius: 10, hemisphere: 'OT' },
                'Isaiah': { angle: 2.5, radius: 10, hemisphere: 'OT' },
                'Daniel': { angle: 3, radius: 10, hemisphere: 'OT' },
                // NT books - positioned in other hemisphere
                'Matthew': { angle: 0, radius: 10, hemisphere: 'NT' },
                'John': { angle: 0.8, radius: 10, hemisphere: 'NT' },
                'Romans': { angle: 1.5, radius: 10, hemisphere: 'NT' },
                'Hebrews': { angle: 2.2, radius: 10, hemisphere: 'NT' },
                'Revelation': { angle: 3, radius: 10, hemisphere: 'NT' }
            };
        }
        WordUsageSphereService_1.prototype.generateWordSphere = function (lemma, strongs) {
            return __awaiter(this, void 0, void 0, function () {
                var mockOccurrences, occurrences, clusters, metadata;
                var _this = this;
                return __generator(this, function (_a) {
                    mockOccurrences = this.generateMockOccurrences(lemma, strongs);
                    occurrences = mockOccurrences.map(function (occ, idx) {
                        var bookPos = _this.bookPositions[occ.book] || { angle: 0, radius: 10, hemisphere: 'NT' };
                        var hemisphere = bookPos.hemisphere === 'OT' ? -1 : 1;
                        // Add some variation within book cluster
                        var variation = (Math.random() - 0.5) * 2;
                        return {
                            id: "".concat(lemma, "-").concat(idx),
                            reference: occ.reference,
                            text: occ.text,
                            book: occ.book,
                            testament: bookPos.hemisphere,
                            position: {
                                x: Math.cos(bookPos.angle) * bookPos.radius + variation,
                                y: hemisphere * 5 + variation,
                                z: Math.sin(bookPos.angle) * bookPos.radius + variation
                            },
                            size: occ.frequency,
                            color: _this.getNuanceColor(occ.nuance),
                            nuance: occ.nuance
                        };
                    });
                    clusters = this.identifyClusters(occurrences);
                    metadata = this.calculateMetadata(occurrences);
                    return [2 /*return*/, {
                            lemma: lemma,
                            strongs: strongs,
                            occurrences: occurrences,
                            clusters: clusters,
                            metadata: metadata
                        }];
                });
            });
        };
        WordUsageSphereService_1.prototype.generateMockOccurrences = function (lemma, strongs) {
            // Mock data for common words
            var mockData = {
                'ἀγαπάω': [
                    { reference: 'John 3:16', text: 'For God so loved the world', book: 'John', frequency: 1.5, nuance: 'divine_love' },
                    { reference: 'John 14:21', text: 'He who loves me', book: 'John', frequency: 1.2, nuance: 'reciprocal_love' },
                    { reference: '1 John 4:8', text: 'God is love', book: 'Revelation', frequency: 1.8, nuance: 'essential_love' },
                    { reference: 'Romans 5:8', text: 'God demonstrates his love', book: 'Romans', frequency: 1.4, nuance: 'demonstrated_love' },
                    { reference: 'Ephesians 5:25', text: 'Husbands, love your wives', book: 'Romans', frequency: 1.0, nuance: 'marital_love' }
                ],
                'πιστεύω': [
                    { reference: 'John 3:16', text: 'whoever believes in him', book: 'John', frequency: 1.6, nuance: 'saving_faith' },
                    { reference: 'Romans 10:9', text: 'if you believe in your heart', book: 'Romans', frequency: 1.5, nuance: 'heart_belief' },
                    { reference: 'Hebrews 11:6', text: 'without faith impossible', book: 'Hebrews', frequency: 1.7, nuance: 'essential_faith' },
                    { reference: 'James 2:19', text: 'demons also believe', book: 'Hebrews', frequency: 1.0, nuance: 'intellectual_assent' }
                ],
                'λόγος': [
                    { reference: 'John 1:1', text: 'In the beginning was the Word', book: 'John', frequency: 2.0, nuance: 'divine_word' },
                    { reference: 'John 1:14', text: 'The Word became flesh', book: 'John', frequency: 1.9, nuance: 'incarnate_word' },
                    { reference: 'Hebrews 4:12', text: 'word of God is living', book: 'Hebrews', frequency: 1.6, nuance: 'active_word' },
                    { reference: 'Matthew 4:4', text: 'every word from God', book: 'Matthew', frequency: 1.3, nuance: 'sustaining_word' }
                ]
            };
            return mockData[lemma] || [
                { reference: 'John 1:1', text: 'Sample occurrence', book: 'John', frequency: 1.0, nuance: 'general' }
            ];
        };
        WordUsageSphereService_1.prototype.getNuanceColor = function (nuance) {
            var colors = {
                'divine_love': '#fbbf24',
                'reciprocal_love': '#8b5cf6',
                'essential_love': '#ef4444',
                'demonstrated_love': '#10b981',
                'marital_love': '#ec4899',
                'saving_faith': '#3b82f6',
                'heart_belief': '#8b5cf6',
                'essential_faith': '#fbbf24',
                'intellectual_assent': '#6b7280',
                'divine_word': '#fbbf24',
                'incarnate_word': '#ef4444',
                'active_word': '#10b981',
                'sustaining_word': '#3b82f6'
            };
            return colors[nuance || 'general'] || '#6b7280';
        };
        WordUsageSphereService_1.prototype.identifyClusters = function (occurrences) {
            var bookCounts = {};
            occurrences.forEach(function (occ) {
                bookCounts[occ.book] = (bookCounts[occ.book] || 0) + 1;
            });
            return Object.entries(bookCounts)
                .map(function (_a) {
                var _b;
                var book = _a[0], count = _a[1];
                return ({
                    name: book,
                    books: [book],
                    count: count,
                    color: ((_b = occurrences.find(function (o) { return o.book === book; })) === null || _b === void 0 ? void 0 : _b.color) || '#6b7280'
                });
            })
                .sort(function (a, b) { return b.count - a.count; });
        };
        WordUsageSphereService_1.prototype.calculateMetadata = function (occurrences) {
            var _a;
            var otCount = occurrences.filter(function (o) { return o.testament === 'OT'; }).length;
            var ntCount = occurrences.filter(function (o) { return o.testament === 'NT'; }).length;
            var bookCounts = {};
            occurrences.forEach(function (occ) {
                bookCounts[occ.book] = (bookCounts[occ.book] || 0) + 1;
            });
            var mostFrequentBook = ((_a = Object.entries(bookCounts)
                .sort(function (_a, _b) {
                var a = _a[1];
                var b = _b[1];
                return b - a;
            })[0]) === null || _a === void 0 ? void 0 : _a[0]) || 'Unknown';
            return {
                totalOccurrences: occurrences.length,
                otCount: otCount,
                ntCount: ntCount,
                mostFrequentBook: mostFrequentBook
            };
        };
        return WordUsageSphereService_1;
    }());
    __setFunctionName(_classThis, "WordUsageSphereService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WordUsageSphereService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WordUsageSphereService = _classThis;
}();
exports.WordUsageSphereService = WordUsageSphereService;
