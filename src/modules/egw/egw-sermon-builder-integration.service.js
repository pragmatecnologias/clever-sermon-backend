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
exports.EGWSermonBuilderIntegrationService = void 0;
var common_1 = require("@nestjs/common");
var EGWSermonBuilderIntegrationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EGWSermonBuilderIntegrationService = _classThis = /** @class */ (function () {
        function EGWSermonBuilderIntegrationService_1(egwPassageService) {
            this.egwPassageService = egwPassageService;
        }
        /**
         * Enhance sermon outline with EGW support
         * RULES:
         * - Checkbox option controls inclusion
         * - Never rewrite quotes
         * - Never blend into Bible text
         * - Each point shows: Scripture Support + Spirit of Prophecy Support
         */
        EGWSermonBuilderIntegrationService_1.prototype.enhanceSermonOutline = function (mainPassage_1, outlinePoints_1) {
            return __awaiter(this, arguments, void 0, function (mainPassage, outlinePoints, includeEGW) {
                var parsed, insights, pointSupport, suggestedQuotes;
                if (includeEGW === void 0) { includeEGW = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!includeEGW) {
                                return [2 /*return*/, {
                                        includeEGW: false,
                                        pointSupport: [],
                                        suggestedQuotes: []
                                    }];
                            }
                            parsed = this.parsePassage(mainPassage);
                            if (!parsed) {
                                return [2 /*return*/, {
                                        includeEGW: false,
                                        pointSupport: [],
                                        suggestedQuotes: []
                                    }];
                            }
                            return [4 /*yield*/, this.egwPassageService.getPassageInsights(parsed.book, parsed.chapter, parsed.verseStart, parsed.verseEnd, 'en', 10)];
                        case 1:
                            insights = _a.sent();
                            pointSupport = this.mapInsightsToPoints(outlinePoints, insights.insights);
                            suggestedQuotes = this.generateSuggestedQuotes(insights.insights);
                            return [2 /*return*/, {
                                    includeEGW: true,
                                    pointSupport: pointSupport,
                                    suggestedQuotes: suggestedQuotes
                                }];
                    }
                });
            });
        };
        /**
         * Map EGW insights to sermon outline points
         */
        EGWSermonBuilderIntegrationService_1.prototype.mapInsightsToPoints = function (points, insights) {
            var _this = this;
            return points.map(function (point, index) {
                // Distribute insights across points
                var relevantInsights = insights.slice(index * 2, (index + 1) * 2);
                return {
                    point: point,
                    scriptureSupport: [], // Filled by Scripture service
                    egwSupport: relevantInsights.map(function (insight) { return ({
                        reference: insight.reference,
                        bookTitle: insight.bookTitle,
                        quote: insight.preview, // Verbatim preview
                        citationFormat: "\"".concat(insight.preview, "\" \u2014 ").concat(insight.bookTitle, ", ").concat(insight.reference),
                        relevance: _this.determineRelevance(insight.rankingReason)
                    }); })
                };
            });
        };
        /**
         * Generate suggested quotes for sermon insertion
         */
        EGWSermonBuilderIntegrationService_1.prototype.generateSuggestedQuotes = function (insights) {
            var quotes = [];
            // Best insight for introduction
            if (insights[0]) {
                quotes.push({
                    reference: insights[0].reference,
                    bookTitle: insights[0].bookTitle,
                    quote: insights[0].content, // Full verbatim quote
                    insertionPoint: 'introduction'
                });
            }
            // Distribute remaining across points
            var insertionPoints = ['point_1', 'point_2', 'point_3'];
            insights.slice(1, 4).forEach(function (insight, idx) {
                quotes.push({
                    reference: insight.reference,
                    bookTitle: insight.bookTitle,
                    quote: insight.content, // Full verbatim quote
                    insertionPoint: insertionPoints[idx]
                });
            });
            // Last insight for conclusion
            if (insights.length > 4) {
                var last = insights[insights.length - 1];
                quotes.push({
                    reference: last.reference,
                    bookTitle: last.bookTitle,
                    quote: last.content, // Full verbatim quote
                    insertionPoint: 'conclusion'
                });
            }
            return quotes;
        };
        /**
         * Determine relevance description
         */
        EGWSermonBuilderIntegrationService_1.prototype.determineRelevance = function (reason) {
            switch (reason) {
                case 'exact_verse':
                    return 'Directly comments on this verse';
                case 'same_chapter':
                    return 'Relates to this chapter';
                case 'thematic':
                    return 'Thematically connected';
                case 'doctrinal':
                    return 'Addresses key doctrinal theme';
                default:
                    return 'Related insight';
            }
        };
        /**
         * Parse passage reference
         */
        EGWSermonBuilderIntegrationService_1.prototype.parsePassage = function (passage) {
            var match = passage.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/);
            if (!match)
                return null;
            return {
                book: match[1].trim(),
                chapter: parseInt(match[2]),
                verseStart: match[3] ? parseInt(match[3]) : undefined,
                verseEnd: match[4] ? parseInt(match[4]) : undefined
            };
        };
        /**
         * Format EGW support for outline prompt
         */
        EGWSermonBuilderIntegrationService_1.prototype.formatForOutlinePrompt = function (enhancement) {
            if (!enhancement.includeEGW || enhancement.pointSupport.length === 0) {
                return '';
            }
            var output = '\n\n## 🕊 Spirit of Prophecy Support\n\n';
            output += '*Consider incorporating these insights into your sermon points:*\n\n';
            enhancement.pointSupport.forEach(function (support, idx) {
                if (support.egwSupport && support.egwSupport.length > 0) {
                    output += "### Point ".concat(idx + 1, ": ").concat(support.point, "\n\n");
                    output += '**Scripture Support**: (provided separately)\n\n';
                    output += '**Spirit of Prophecy Support**:\n\n';
                    support.egwSupport.forEach(function (egw) {
                        output += "- \"".concat(egw.quote, "\"\n");
                        output += "  \u2014 ".concat(egw.bookTitle, ", ").concat(egw.reference, "\n");
                        output += "  *(".concat(egw.relevance, ")*\n\n");
                    });
                }
            });
            output += '---\n\n';
            output += '**IMPORTANT RULES**:\n';
            output += '- Use exact quotes. Never paraphrase without attribution.\n';
            output += '- Keep Scripture and Spirit of Prophecy clearly separated.\n';
            output += '- Scripture remains primary; Spirit of Prophecy provides supporting insight.\n';
            return output;
        };
        /**
         * Format suggested quotes for manuscript insertion
         */
        EGWSermonBuilderIntegrationService_1.prototype.formatSuggestedQuotes = function (quotes) {
            var _this = this;
            if (quotes.length === 0)
                return '';
            var output = '\n\n## 📝 Suggested Spirit of Prophecy Quotes for Manuscript\n\n';
            var bySection = {
                introduction: [],
                point_1: [],
                point_2: [],
                point_3: [],
                conclusion: []
            };
            quotes.forEach(function (q) {
                bySection[q.insertionPoint].push(q);
            });
            Object.entries(bySection).forEach(function (_a) {
                var section = _a[0], sectionQuotes = _a[1];
                if (sectionQuotes.length > 0) {
                    output += "### ".concat(_this.formatSectionName(section), "\n\n");
                    sectionQuotes.forEach(function (q) {
                        output += "> \"".concat(q.quote, "\"\n");
                        output += "> \u2014 ".concat(q.bookTitle, ", ").concat(q.reference, "\n\n");
                    });
                }
            });
            return output;
        };
        /**
         * Format section name for display
         */
        EGWSermonBuilderIntegrationService_1.prototype.formatSectionName = function (section) {
            return section
                .replace(/_/g, ' ')
                .split(' ')
                .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); })
                .join(' ');
        };
        return EGWSermonBuilderIntegrationService_1;
    }());
    __setFunctionName(_classThis, "EGWSermonBuilderIntegrationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWSermonBuilderIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWSermonBuilderIntegrationService = _classThis;
}();
exports.EGWSermonBuilderIntegrationService = EGWSermonBuilderIntegrationService;
