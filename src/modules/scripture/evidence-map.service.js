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
exports.EvidenceMapService = void 0;
var common_1 = require("@nestjs/common");
var EvidenceMapService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EvidenceMapService = _classThis = /** @class */ (function () {
        function EvidenceMapService_1(scriptureService) {
            this.scriptureService = scriptureService;
        }
        EvidenceMapService_1.prototype.analyzeSermonEvidence = function (sermonPoints, mainPassage, additionalPassages) {
            return __awaiter(this, void 0, void 0, function () {
                var evidencePoints, _i, sermonPoints_1, point, evidence;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            evidencePoints = [];
                            _i = 0, sermonPoints_1 = sermonPoints;
                            _a.label = 1;
                        case 1:
                            if (!(_i < sermonPoints_1.length)) return [3 /*break*/, 4];
                            point = sermonPoints_1[_i];
                            return [4 /*yield*/, this.analyzePoint(point, mainPassage, additionalPassages)];
                        case 2:
                            evidence = _a.sent();
                            evidencePoints.push(evidence);
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, evidencePoints];
                    }
                });
            });
        };
        EvidenceMapService_1.prototype.analyzePoint = function (point, mainPassage, additionalPassages) {
            return __awaiter(this, void 0, void 0, function () {
                var allPassages, supportingVerses, warnings, concepts, _i, allPassages_1, passage, passageData, _a, _b, verse, analysis, error_1, integrityScore;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            allPassages = __spreadArray([mainPassage], additionalPassages, true);
                            supportingVerses = [];
                            warnings = [];
                            concepts = this.extractConcepts(point);
                            _i = 0, allPassages_1 = allPassages;
                            _c.label = 1;
                        case 1:
                            if (!(_i < allPassages_1.length)) return [3 /*break*/, 6];
                            passage = allPassages_1[_i];
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.scriptureService.getPassage(passage)];
                        case 3:
                            passageData = _c.sent();
                            if (passageData === null || passageData === void 0 ? void 0 : passageData.verses) {
                                for (_a = 0, _b = passageData.verses; _a < _b.length; _a++) {
                                    verse = _b[_a];
                                    analysis = this.analyzeVerseSupport(verse.text, concepts);
                                    if (analysis.relevanceScore > 0) {
                                        supportingVerses.push({
                                            reference: verse.reference,
                                            text: verse.text,
                                            containsConcept: analysis.containsConcept,
                                            supportingPhrases: analysis.supportingPhrases,
                                            relevanceScore: analysis.relevanceScore,
                                            notes: analysis.notes
                                        });
                                    }
                                }
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _c.sent();
                            warnings.push("Failed to analyze ".concat(passage));
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6:
                            integrityScore = this.calculateIntegrityScore(supportingVerses, concepts);
                            // Add warnings if score is low
                            if (integrityScore < 50) {
                                warnings.push('Low scriptural support for this point');
                            }
                            if (supportingVerses.length === 0) {
                                warnings.push('No direct scriptural support found');
                            }
                            return [2 /*return*/, {
                                    sermonPoint: point,
                                    supportingVerses: supportingVerses.sort(function (a, b) { return b.relevanceScore - a.relevanceScore; }),
                                    integrityScore: integrityScore,
                                    warnings: warnings
                                }];
                    }
                });
            });
        };
        EvidenceMapService_1.prototype.extractConcepts = function (text) {
            // Extract key theological and action concepts
            var words = text
                .toLowerCase()
                .replace(/[.,;:!?()[\]{}'"]/g, ' ')
                .split(/\s+/)
                .filter(function (w) { return w.length > 3; });
            // Filter out common words
            var stopWords = new Set(['that', 'this', 'with', 'from', 'have', 'will', 'would', 'should', 'could']);
            return words.filter(function (w) { return !stopWords.has(w); });
        };
        EvidenceMapService_1.prototype.analyzeVerseSupport = function (verseText, concepts) {
            var lowerVerse = verseText.toLowerCase();
            var foundConcepts = [];
            var supportingPhrases = [];
            // Check for concept matches
            concepts.forEach(function (concept) {
                if (lowerVerse.includes(concept)) {
                    foundConcepts.push(concept);
                    // Extract phrase containing the concept
                    var words = verseText.split(/\s+/);
                    var conceptIndex = words.findIndex(function (w) { return w.toLowerCase().includes(concept); });
                    if (conceptIndex >= 0) {
                        var start = Math.max(0, conceptIndex - 2);
                        var end = Math.min(words.length, conceptIndex + 3);
                        var phrase = words.slice(start, end).join(' ');
                        supportingPhrases.push(phrase);
                    }
                }
            });
            var relevanceScore = Math.min(100, (foundConcepts.length / concepts.length) * 100);
            var containsConcept = foundConcepts.length > 0;
            var notes = '';
            if (relevanceScore >= 75) {
                notes = 'Strong support';
            }
            else if (relevanceScore >= 50) {
                notes = 'Moderate support';
            }
            else if (relevanceScore >= 25) {
                notes = 'Weak support';
            }
            else if (containsConcept) {
                notes = 'Tangential support';
            }
            return {
                containsConcept: containsConcept,
                supportingPhrases: supportingPhrases,
                relevanceScore: relevanceScore,
                notes: notes
            };
        };
        EvidenceMapService_1.prototype.calculateIntegrityScore = function (supportingVerses, concepts) {
            if (supportingVerses.length === 0)
                return 0;
            var avgRelevance = supportingVerses.reduce(function (sum, v) { return sum + v.relevanceScore; }, 0) / supportingVerses.length;
            var verseCount = Math.min(supportingVerses.length, 5);
            var verseBonus = (verseCount / 5) * 20;
            return Math.min(100, Math.round(avgRelevance * 0.8 + verseBonus));
        };
        EvidenceMapService_1.prototype.checkPassageIntegrity = function (outlinePoints, applications, mainPassage, crossReferences) {
            return __awaiter(this, void 0, void 0, function () {
                var checks, passedCount, pointsCheck, appsCheck, crossRefCheck, score, passed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            checks = [];
                            passedCount = 0;
                            return [4 /*yield*/, this.checkPointsTraceability(outlinePoints, mainPassage)];
                        case 1:
                            pointsCheck = _a.sent();
                            checks.push(pointsCheck);
                            if (pointsCheck.passed)
                                passedCount++;
                            return [4 /*yield*/, this.checkApplicationsAlignment(applications, mainPassage)];
                        case 2:
                            appsCheck = _a.sent();
                            checks.push(appsCheck);
                            if (appsCheck.passed)
                                passedCount++;
                            return [4 /*yield*/, this.checkCrossReferenceRelevance(crossReferences, mainPassage)];
                        case 3:
                            crossRefCheck = _a.sent();
                            checks.push(crossRefCheck);
                            if (crossRefCheck.passed)
                                passedCount++;
                            score = Math.round((passedCount / checks.length) * 100);
                            passed = score >= 70;
                            return [2 /*return*/, {
                                    passed: passed,
                                    score: score,
                                    checks: checks
                                }];
                    }
                });
            });
        };
        EvidenceMapService_1.prototype.checkPointsTraceability = function (points, passage) {
            return __awaiter(this, void 0, void 0, function () {
                var passageData, allText_1, traceableCount_1, passed, _a;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.scriptureService.getPassage(passage)];
                        case 1:
                            passageData = _c.sent();
                            allText_1 = ((_b = passageData === null || passageData === void 0 ? void 0 : passageData.verses) === null || _b === void 0 ? void 0 : _b.map(function (v) { return v.text; }).join(' ').toLowerCase()) || '';
                            traceableCount_1 = 0;
                            points.forEach(function (point) {
                                var concepts = _this.extractConcepts(point);
                                var found = concepts.some(function (c) { return allText_1.includes(c); });
                                if (found)
                                    traceableCount_1++;
                            });
                            passed = traceableCount_1 >= points.length * 0.7;
                            return [2 /*return*/, {
                                    name: 'Outline Points Traceability',
                                    passed: passed,
                                    message: passed
                                        ? "".concat(traceableCount_1, "/").concat(points.length, " points traceable to passage")
                                        : "Only ".concat(traceableCount_1, "/").concat(points.length, " points traceable - strengthen scriptural grounding")
                                }];
                        case 2:
                            _a = _c.sent();
                            return [2 /*return*/, {
                                    name: 'Outline Points Traceability',
                                    passed: false,
                                    message: 'Unable to verify traceability'
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        EvidenceMapService_1.prototype.checkApplicationsAlignment = function (applications, passage) {
            return __awaiter(this, void 0, void 0, function () {
                var passageData, allText_2, alignedCount_1, passed, _a;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.scriptureService.getPassage(passage)];
                        case 1:
                            passageData = _c.sent();
                            allText_2 = ((_b = passageData === null || passageData === void 0 ? void 0 : passageData.verses) === null || _b === void 0 ? void 0 : _b.map(function (v) { return v.text; }).join(' ').toLowerCase()) || '';
                            alignedCount_1 = 0;
                            applications.forEach(function (app) {
                                var concepts = _this.extractConcepts(app);
                                var found = concepts.some(function (c) { return allText_2.includes(c); });
                                if (found)
                                    alignedCount_1++;
                            });
                            passed = alignedCount_1 >= applications.length * 0.6;
                            return [2 /*return*/, {
                                    name: 'Application Alignment',
                                    passed: passed,
                                    message: passed
                                        ? "".concat(alignedCount_1, "/").concat(applications.length, " applications aligned with passage themes")
                                        : "Only ".concat(alignedCount_1, "/").concat(applications.length, " applications aligned - ensure applications flow from text")
                                }];
                        case 2:
                            _a = _c.sent();
                            return [2 /*return*/, {
                                    name: 'Application Alignment',
                                    passed: false,
                                    message: 'Unable to verify alignment'
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        EvidenceMapService_1.prototype.checkCrossReferenceRelevance = function (crossRefs, mainPassage) {
            return __awaiter(this, void 0, void 0, function () {
                var passed;
                return __generator(this, function (_a) {
                    if (crossRefs.length === 0) {
                        return [2 /*return*/, {
                                name: 'Cross Reference Relevance',
                                passed: true,
                                message: 'No cross references to validate'
                            }];
                    }
                    passed = crossRefs.length > 0;
                    return [2 /*return*/, {
                            name: 'Cross Reference Relevance',
                            passed: passed,
                            message: passed
                                ? "".concat(crossRefs.length, " cross references provided")
                                : 'No cross references found'
                        }];
                });
            });
        };
        return EvidenceMapService_1;
    }());
    __setFunctionName(_classThis, "EvidenceMapService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EvidenceMapService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EvidenceMapService = _classThis;
}();
exports.EvidenceMapService = EvidenceMapService;
