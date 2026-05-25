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
exports.EGWStudyReportIntegrationService = void 0;
var common_1 = require("@nestjs/common");
var EGWStudyReportIntegrationService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EGWStudyReportIntegrationService = _classThis = /** @class */ (function () {
        function EGWStudyReportIntegrationService_1(egwPassageService) {
            this.egwPassageService = egwPassageService;
        }
        /**
         * Generate EGW section for study report
         * RULES:
         * - Direct quotes preserved verbatim
         * - Summaries clearly labeled
         * - Never mix into literary/structural analysis
         * - Scripture sections remain first
         */
        EGWStudyReportIntegrationService_1.prototype.generateStudyReportSection = function (book_1, chapter_1, verseStart_1, verseEnd_1) {
            return __awaiter(this, arguments, void 0, function (book, chapter, verseStart, verseEnd, includeEGW, language) {
                var isSpanish, insights, categorized;
                if (includeEGW === void 0) { includeEGW = true; }
                if (language === void 0) { language = 'en'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!includeEGW)
                                return [2 /*return*/, null];
                            isSpanish = String(language || '').toLowerCase().startsWith('es');
                            return [4 /*yield*/, this.egwPassageService.getPassageInsights(book, chapter, verseStart, verseEnd, language, 8 // Get more for categorization
                                )];
                        case 1:
                            insights = _a.sent();
                            if (insights.insights.length === 0) {
                                return [2 /*return*/, null];
                            }
                            categorized = this.categorizeInsights(insights.insights);
                            return [2 /*return*/, {
                                    thematicEmphasis: this.generateThematicEmphasis(categorized.thematic, isSpanish),
                                    devotionalInsight: this.generateDevotionalInsight(categorized.devotional, isSpanish),
                                    practicalCounsel: this.generatePracticalCounsel(categorized.practical, isSpanish),
                                    propheticExpansion: this.generatePropheticExpansion(categorized.prophetic, isSpanish),
                                    quotes: this.formatQuotes(insights.insights)
                                }];
                    }
                });
            });
        };
        /**
         * Categorize insights by type
         */
        EGWStudyReportIntegrationService_1.prototype.categorizeInsights = function (insights) {
            var thematic = [];
            var devotional = [];
            var practical = [];
            var prophetic = [];
            insights.forEach(function (insight) {
                var content = insight.content.toLowerCase();
                // Prophetic indicators
                if (content.includes('prophecy') ||
                    content.includes('vision') ||
                    content.includes('fulfillment') ||
                    content.includes('daniel') ||
                    content.includes('revelation')) {
                    prophetic.push(insight);
                }
                // Practical indicators
                else if (content.includes('should') ||
                    content.includes('must') ||
                    content.includes('duty') ||
                    content.includes('responsibility') ||
                    content.includes('practice')) {
                    practical.push(insight);
                }
                // Devotional indicators
                else if (content.includes('love') ||
                    content.includes('faith') ||
                    content.includes('prayer') ||
                    content.includes('trust') ||
                    content.includes('heart')) {
                    devotional.push(insight);
                }
                // Default to thematic
                else {
                    thematic.push(insight);
                }
            });
            return { thematic: thematic, devotional: devotional, practical: practical, prophetic: prophetic };
        };
        /**
         * Generate thematic emphasis summary
         */
        EGWStudyReportIntegrationService_1.prototype.generateThematicEmphasis = function (insights, isSpanish) {
            if (insights.length === 0)
                return undefined;
            var themes = insights.slice(0, 3);
            var summary = isSpanish
                ? '**Resumen del énfasis del Espíritu de Profecía:**\n\n'
                : '**Summary of Spirit of Prophecy emphasis:**\n\n';
            themes.forEach(function (insight, idx) {
                summary += isSpanish
                    ? "".concat(idx + 1, ". ").concat(insight.bookTitle, " enfatiza: \"").concat(insight.preview, "\"\n")
                    : "".concat(idx + 1, ". ").concat(insight.bookTitle, " emphasizes: \"").concat(insight.preview, "\"\n");
            });
            return summary;
        };
        /**
         * Generate devotional insight summary
         */
        EGWStudyReportIntegrationService_1.prototype.generateDevotionalInsight = function (insights, isSpanish) {
            if (insights.length === 0)
                return undefined;
            var top = insights[0];
            return isSpanish
                ? "**Perspectiva devocional del Esp\u00EDritu de Profec\u00EDa:**\n\n\"".concat(top.preview, "\" \u2014 ").concat(top.bookTitle, ", ").concat(top.reference)
                : "**Devotional perspective from Spirit of Prophecy:**\n\n\"".concat(top.preview, "\" \u2014 ").concat(top.bookTitle, ", ").concat(top.reference);
        };
        /**
         * Generate practical counsel summary
         */
        EGWStudyReportIntegrationService_1.prototype.generatePracticalCounsel = function (insights, isSpanish) {
            if (insights.length === 0)
                return undefined;
            var top = insights[0];
            return isSpanish
                ? "**Consejo pr\u00E1ctico del Esp\u00EDritu de Profec\u00EDa:**\n\n\"".concat(top.preview, "\" \u2014 ").concat(top.bookTitle, ", ").concat(top.reference)
                : "**Practical counsel from Spirit of Prophecy:**\n\n\"".concat(top.preview, "\" \u2014 ").concat(top.bookTitle, ", ").concat(top.reference);
        };
        /**
         * Generate prophetic expansion summary
         */
        EGWStudyReportIntegrationService_1.prototype.generatePropheticExpansion = function (insights, isSpanish) {
            if (insights.length === 0)
                return undefined;
            var top = insights[0];
            return isSpanish
                ? "**Contexto prof\u00E9tico del Esp\u00EDritu de Profec\u00EDa:**\n\n\"".concat(top.preview, "\" \u2014 ").concat(top.bookTitle, ", ").concat(top.reference)
                : "**Prophetic context from Spirit of Prophecy:**\n\n\"".concat(top.preview, "\" \u2014 ").concat(top.bookTitle, ", ").concat(top.reference);
        };
        /**
         * Format quotes with proper attribution
         * INTEGRITY RULE: Preserve exact text, never paraphrase
         */
        EGWStudyReportIntegrationService_1.prototype.formatQuotes = function (insights) {
            return insights.slice(0, 5).map(function (insight) {
                var content = insight.content.toLowerCase();
                var category = 'thematic';
                if (content.includes('prophecy') || content.includes('vision')) {
                    category = 'prophetic';
                }
                else if (content.includes('should') || content.includes('must')) {
                    category = 'practical';
                }
                else if (content.includes('love') || content.includes('faith')) {
                    category = 'devotional';
                }
                return {
                    reference: insight.reference,
                    bookTitle: insight.bookTitle,
                    text: insight.content, // VERBATIM - never paraphrased
                    category: category
                };
            });
        };
        /**
         * Format EGW section for study report output
         */
        EGWStudyReportIntegrationService_1.prototype.formatForStudyReport = function (section) {
            if (!section) {
                return '';
            }
            var output = '\n\n## 🕊 Spirit of Prophecy Insight\n\n';
            output += '*The following insights from Ellen G. White\'s writings relate to this passage:*\n\n';
            if (section.thematicEmphasis) {
                output += '### Thematic Emphasis\n\n';
                output += section.thematicEmphasis + '\n\n';
            }
            if (section.devotionalInsight) {
                output += '### Devotional Insight\n\n';
                output += section.devotionalInsight + '\n\n';
            }
            if (section.practicalCounsel) {
                output += '### Practical Counsel\n\n';
                output += section.practicalCounsel + '\n\n';
            }
            if (section.propheticExpansion) {
                output += '### Prophetic Expansion\n\n';
                output += section.propheticExpansion + '\n\n';
            }
            output += '---\n\n';
            output += '*Note: All quotes are preserved verbatim from original sources. Spirit of Prophecy insights complement but do not replace Scripture study.*\n';
            return output;
        };
        return EGWStudyReportIntegrationService_1;
    }());
    __setFunctionName(_classThis, "EGWStudyReportIntegrationService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWStudyReportIntegrationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWStudyReportIntegrationService = _classThis;
}();
exports.EGWStudyReportIntegrationService = EGWStudyReportIntegrationService;
