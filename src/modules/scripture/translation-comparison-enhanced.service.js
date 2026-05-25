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
exports.TranslationComparisonEnhancedService = void 0;
var common_1 = require("@nestjs/common");
var scripture_prompts_1 = require("./scripture-prompts");
var scripture_fallbacks_1 = require("./scripture-fallbacks");
var TranslationComparisonEnhancedService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TranslationComparisonEnhancedService = _classThis = /** @class */ (function () {
        function TranslationComparisonEnhancedService_1(scriptureService, llmService) {
            this.scriptureService = scriptureService;
            this.llmService = llmService;
        }
        TranslationComparisonEnhancedService_1.prototype.tryJsonParse = function (text) {
            try {
                return JSON.parse(text);
            }
            catch (_a) {
                return null;
            }
        };
        TranslationComparisonEnhancedService_1.prototype.stripTransportNoise = function (text) {
            return String(text || '')
                .replace(/```(?:json)?/gi, '')
                .replace(/```/g, '')
                .replace(/<\|[^|>]+?\|>/g, ' ')
                .replace(/\r\n/g, '\n')
                .trim();
        };
        TranslationComparisonEnhancedService_1.prototype.extractBalancedJsonSegment = function (text) {
            var source = this.stripTransportNoise(text);
            var startIndex = source.search(/[\{\[]/);
            if (startIndex < 0)
                return null;
            var openChar = source[startIndex];
            var closeChar = openChar === '{' ? '}' : ']';
            var depth = 0;
            var inString = false;
            var escapeNext = false;
            for (var index = startIndex; index < source.length; index += 1) {
                var char = source[index];
                if (escapeNext) {
                    escapeNext = false;
                    continue;
                }
                if (char === '\\') {
                    escapeNext = true;
                    continue;
                }
                if (char === '"') {
                    inString = !inString;
                    continue;
                }
                if (inString)
                    continue;
                if (char === openChar)
                    depth += 1;
                if (char === closeChar) {
                    depth -= 1;
                    if (depth === 0) {
                        return source.slice(startIndex, index + 1);
                    }
                }
            }
            return null;
        };
        TranslationComparisonEnhancedService_1.prototype.parseComparisonPayload = function (rawResponse) {
            var cleaned = this.stripTransportNoise(rawResponse);
            if (!cleaned)
                return null;
            var direct = this.tryJsonParse(cleaned);
            if (direct)
                return direct;
            var balanced = this.extractBalancedJsonSegment(cleaned);
            if (balanced) {
                var parsedBalanced = this.tryJsonParse(balanced);
                if (parsedBalanced)
                    return parsedBalanced;
            }
            var objectMatch = cleaned.match(/\{[\s\S]*\}/);
            if (objectMatch) {
                var parsedMatch = this.tryJsonParse(objectMatch[0]);
                if (parsedMatch)
                    return parsedMatch;
            }
            return null;
        };
        TranslationComparisonEnhancedService_1.prototype.repairComparisonPayload = function (rawResponse, isSpanish, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prompt, repaired, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prompt = scripture_prompts_1.ScripturePrompts.translationComparisonRepair({ rawResponse: rawResponse, isSpanish: isSpanish });
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, userId || 'system', {
                                    temperature: 0.1,
                                    maxTokens: 1200,
                                })];
                        case 2:
                            repaired = _b.sent();
                            return [2 /*return*/, this.parseComparisonPayload(repaired)];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        TranslationComparisonEnhancedService_1.prototype.getEnhancedComparison = function (reference_1) {
            return __awaiter(this, arguments, void 0, function (reference, language, userId) {
                var translationCodes, translations, fallbackTranslations, _i, translationCodes_1, code, result, text, verses, error_1, fallbackTranslations, _a, analysis, error_2, fallbackTranslations, _b;
                if (language === void 0) { language = 'en'; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            translationCodes = this.getTranslationsForLanguage(language);
                            translations = [];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 15, , 19]);
                            if (!(translationCodes.length < 2)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.buildFallbackTranslations(reference, translationCodes.slice(0, 2))];
                        case 2:
                            fallbackTranslations = _c.sent();
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackTranslationComparison)(reference, fallbackTranslations, language)];
                        case 3:
                            _i = 0, translationCodes_1 = translationCodes;
                            _c.label = 4;
                        case 4:
                            if (!(_i < translationCodes_1.length)) return [3 /*break*/, 9];
                            code = translationCodes_1[_i];
                            _c.label = 5;
                        case 5:
                            _c.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.scriptureService.getPassage(reference, code)];
                        case 6:
                            result = _c.sent();
                            if (result && result.verses && result.verses.length > 0) {
                                text = result.verses.map(function (v) { return v.text; }).join(' ');
                                verses = result.verses.map(function (v, index) {
                                    var ref = String((v === null || v === void 0 ? void 0 : v.reference) || '');
                                    var verseMatch = ref.match(/:(\d+)\b/);
                                    return {
                                        number: (verseMatch === null || verseMatch === void 0 ? void 0 : verseMatch[1]) || String(index + 1),
                                        text: String((v === null || v === void 0 ? void 0 : v.text) || '').trim(),
                                        reference: ref || undefined,
                                    };
                                });
                                translations.push({
                                    code: code,
                                    name: this.getTranslationName(code),
                                    text: text,
                                    verses: verses,
                                    type: this.getTranslationType(code)
                                });
                            }
                            return [3 /*break*/, 8];
                        case 7:
                            error_1 = _c.sent();
                            console.error("Failed to fetch ".concat(code, " for ").concat(reference, ":"), error_1);
                            return [3 /*break*/, 8];
                        case 8:
                            _i++;
                            return [3 /*break*/, 4];
                        case 9:
                            if (!(translations.length < 2)) return [3 /*break*/, 13];
                            if (!(translations.length > 0)) return [3 /*break*/, 10];
                            _a = translations;
                            return [3 /*break*/, 12];
                        case 10: return [4 /*yield*/, this.buildFallbackTranslations(reference, translationCodes.slice(0, 3))];
                        case 11:
                            _a = _c.sent();
                            _c.label = 12;
                        case 12:
                            fallbackTranslations = _a;
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackTranslationComparison)(reference, fallbackTranslations, language)];
                        case 13: return [4 /*yield*/, this.analyzeDifferences(reference, translations, language, userId)];
                        case 14:
                            analysis = _c.sent();
                            return [2 /*return*/, {
                                    reference: reference,
                                    translations: translations,
                                    keyDifferences: analysis.keyDifferences,
                                    analysis: analysis.analysis
                                }];
                        case 15:
                            error_2 = _c.sent();
                            console.error('Error generating translation comparison:', error_2);
                            if (!(translations.length > 0)) return [3 /*break*/, 16];
                            _b = translations;
                            return [3 /*break*/, 18];
                        case 16: return [4 /*yield*/, this.buildFallbackTranslations(reference, translationCodes.slice(0, 3))];
                        case 17:
                            _b = _c.sent();
                            _c.label = 18;
                        case 18:
                            fallbackTranslations = _b;
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackTranslationComparison)(reference, fallbackTranslations, language)];
                        case 19: return [2 /*return*/];
                    }
                });
            });
        };
        TranslationComparisonEnhancedService_1.prototype.buildFallbackTranslations = function (reference, translationCodes) {
            return __awaiter(this, void 0, void 0, function () {
                var codes, translated, _i, codes_1, code, result, verses, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            codes = translationCodes.length > 0 ? translationCodes : ['KJV', 'WEB'];
                            translated = [];
                            _i = 0, codes_1 = codes;
                            _b.label = 1;
                        case 1:
                            if (!(_i < codes_1.length)) return [3 /*break*/, 6];
                            code = codes_1[_i];
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.scriptureService.getPassage(reference, code)];
                        case 3:
                            result = _b.sent();
                            if (result && result.verses && result.verses.length > 0) {
                                verses = result.verses.map(function (v, index) {
                                    var ref = String((v === null || v === void 0 ? void 0 : v.reference) || '');
                                    var verseMatch = ref.match(/:(\d+)\b/);
                                    return {
                                        number: (verseMatch === null || verseMatch === void 0 ? void 0 : verseMatch[1]) || String(index + 1),
                                        text: String((v === null || v === void 0 ? void 0 : v.text) || '').trim(),
                                        reference: ref || undefined,
                                    };
                                });
                                translated.push({
                                    code: code,
                                    name: this.getTranslationName(code),
                                    text: result.verses.map(function (v) { return String((v === null || v === void 0 ? void 0 : v.text) || '').trim(); }).join(' '),
                                    verses: verses,
                                    type: this.getTranslationType(code),
                                });
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6:
                            if (translated.length === 0) {
                                translated.push({
                                    code: codes[0] || 'KJV',
                                    name: this.getTranslationName(codes[0] || 'KJV'),
                                    text: reference,
                                    verses: [{ number: '1', text: reference, reference: reference }],
                                    type: this.getTranslationType(codes[0] || 'KJV'),
                                });
                            }
                            return [2 /*return*/, translated];
                    }
                });
            });
        };
        TranslationComparisonEnhancedService_1.prototype.getTranslationsForLanguage = function (language) {
            if (language === 'es' || language === 'spanish') {
                // Spanish translations
                return ['NBLA', 'RVR1960', 'NVI'];
            }
            else {
                // English translations (default): prioritize broadly available providers first.
                return ['KJV', 'WEB', 'ASV', 'NIV', 'ESV', 'NASB'];
            }
        };
        TranslationComparisonEnhancedService_1.prototype.getTranslationName = function (code) {
            var names = {
                'KJV': 'King James Version',
                'WEB': 'World English Bible',
                'ASV': 'American Standard Version',
                'NIV': 'New International Version',
                'ESV': 'English Standard Version',
                'NASB': 'New American Standard Bible',
                'NLT': 'New Living Translation',
                'NKJV': 'New King James Version',
                'NBLA': 'Nueva Biblia de las Américas',
                'RVR1960': 'Reina-Valera 1960',
                'NVI': 'Nueva Versión Internacional'
            };
            return names[code] || code;
        };
        TranslationComparisonEnhancedService_1.prototype.getTranslationType = function (code) {
            var types = {
                'KJV': 'formal',
                'WEB': 'formal',
                'ASV': 'formal',
                'NASB': 'formal',
                'ESV': 'formal',
                'NKJV': 'formal',
                'NIV': 'dynamic',
                'NLT': 'paraphrase',
                'NBLA': 'formal',
                'RVR1960': 'formal',
                'NVI': 'dynamic'
            };
            return types[code] || 'formal';
        };
        TranslationComparisonEnhancedService_1.prototype.analyzeDifferences = function (reference, translations, language, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var translationTexts, isSpanish, prompt_1, response, parsed, result, fallbackTranslations, _a, error_3, fallbackTranslations, _b;
                var _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            _g.trys.push([0, 8, , 12]);
                            translationTexts = translations.map(function (t) { return "**".concat(t.code, " (").concat(t.name, ")**:\n").concat(t.text); }).join('\n\n');
                            isSpanish = language === 'es' || language === 'spanish';
                            prompt_1 = scripture_prompts_1.ScripturePrompts.translationComparisonAnalyze({
                                isSpanish: isSpanish,
                                reference: reference,
                                translationTexts: translationTexts,
                            });
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt_1, userId || 'system', {
                                    temperature: 0.3,
                                    maxTokens: 1500,
                                    timeoutMs: 12000,
                                })];
                        case 1:
                            response = _g.sent();
                            parsed = this.parseComparisonPayload(response);
                            if (!!parsed) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.repairComparisonPayload(response, isSpanish, userId)];
                        case 2:
                            parsed = _g.sent();
                            _g.label = 3;
                        case 3:
                            if (!parsed) {
                                throw new Error('Unable to parse translation-comparison JSON payload');
                            }
                            result = {
                                keyDifferences: Array.isArray(parsed.keyDifferences)
                                    ? parsed.keyDifferences.slice(0, 5).map(function (diff) { return ({
                                        category: diff.category || 'theological_term',
                                        translations: Array.isArray(diff.translations) ? diff.translations : [],
                                        difference: String(diff.difference || '').substring(0, 200),
                                        explanation: String(diff.explanation || '').substring(0, 500),
                                        significance: ['high', 'medium', 'low'].includes(diff.significance) ? diff.significance : 'medium'
                                    }); })
                                    : [],
                                analysis: {
                                    verbDifferences: Array.isArray((_c = parsed.analysis) === null || _c === void 0 ? void 0 : _c.verbDifferences)
                                        ? parsed.analysis.verbDifferences.slice(0, 5)
                                        : [],
                                    theologicalTermDifferences: Array.isArray((_d = parsed.analysis) === null || _d === void 0 ? void 0 : _d.theologicalTermDifferences)
                                        ? parsed.analysis.theologicalTermDifferences.slice(0, 5)
                                        : [],
                                    literalVsDynamic: Array.isArray((_e = parsed.analysis) === null || _e === void 0 ? void 0 : _e.literalVsDynamic)
                                        ? parsed.analysis.literalVsDynamic.slice(0, 5)
                                        : [],
                                    overallAssessment: String(((_f = parsed.analysis) === null || _f === void 0 ? void 0 : _f.overallAssessment) || '').substring(0, 500)
                                }
                            };
                            if (!(!result.analysis.overallAssessment ||
                                result.keyDifferences.length < 1 ||
                                result.analysis.overallAssessment.length < 60)) return [3 /*break*/, 7];
                            if (!(translations.length > 0)) return [3 /*break*/, 4];
                            _a = translations;
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.buildFallbackTranslations(reference, this.getTranslationsForLanguage(language).slice(0, 3))];
                        case 5:
                            _a = _g.sent();
                            _g.label = 6;
                        case 6:
                            fallbackTranslations = _a;
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackTranslationComparison)(reference, fallbackTranslations, language)];
                        case 7:
                            if (!result.analysis.overallAssessment) {
                                result.analysis.overallAssessment = isSpanish
                                    ? 'Se identificaron diferencias de traduccion relevantes para la predicacion.'
                                    : 'Relevant translation differences were identified for preaching and interpretation.';
                            }
                            if (isSpanish) {
                                return [2 /*return*/, this.ensureSpanishResult(result, userId)];
                            }
                            return [2 /*return*/, result];
                        case 8:
                            error_3 = _g.sent();
                            console.error('Error analyzing translation differences:', error_3);
                            if (!(translations.length > 0)) return [3 /*break*/, 9];
                            _b = translations;
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, this.buildFallbackTranslations(reference, this.getTranslationsForLanguage(language).slice(0, 3))];
                        case 10:
                            _b = _g.sent();
                            _g.label = 11;
                        case 11:
                            fallbackTranslations = _b;
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackTranslationComparison)(reference, fallbackTranslations, language)];
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        TranslationComparisonEnhancedService_1.prototype.ensureSpanishResult = function (result, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var containsEnglish, hasEnglish, prompt_2, response, jsonMatch, translated, _a;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            containsEnglish = function (value) {
                                return /\b(the|and|with|while|this|that|both|difference|explanation|overall|assessment|active|passive)\b/i.test(value || '');
                            };
                            hasEnglish = result.keyDifferences.some(function (diff) { return containsEnglish(diff.difference) || containsEnglish(diff.explanation); }) ||
                                result.analysis.verbDifferences.some(function (item) { return containsEnglish(item); }) ||
                                result.analysis.theologicalTermDifferences.some(function (item) { return containsEnglish(item); }) ||
                                result.analysis.literalVsDynamic.some(function (item) { return containsEnglish(item); }) ||
                                containsEnglish(result.analysis.overallAssessment);
                            if (!hasEnglish) {
                                return [2 /*return*/, result];
                            }
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 3, , 4]);
                            prompt_2 = scripture_prompts_1.ScripturePrompts.translationComparisonSpanishEnforcer(JSON.stringify(result));
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt_2, userId || 'system', {
                                    temperature: 0.1,
                                    maxTokens: 1500,
                                    timeoutMs: 12000,
                                })];
                        case 2:
                            response = _f.sent();
                            jsonMatch = response.match(/\{[\s\S]*\}/);
                            if (!jsonMatch) {
                                return [2 /*return*/, result];
                            }
                            translated = JSON.parse(jsonMatch[0]);
                            return [2 /*return*/, {
                                    keyDifferences: Array.isArray(translated === null || translated === void 0 ? void 0 : translated.keyDifferences)
                                        ? translated.keyDifferences.slice(0, 5).map(function (diff) { return ({
                                            category: diff.category || 'theological_term',
                                            translations: Array.isArray(diff.translations) ? diff.translations : [],
                                            difference: String(diff.difference || '').substring(0, 200),
                                            explanation: String(diff.explanation || '').substring(0, 500),
                                            significance: ['high', 'medium', 'low'].includes(diff.significance) ? diff.significance : 'medium',
                                        }); })
                                        : result.keyDifferences,
                                    analysis: {
                                        verbDifferences: Array.isArray((_b = translated === null || translated === void 0 ? void 0 : translated.analysis) === null || _b === void 0 ? void 0 : _b.verbDifferences)
                                            ? translated.analysis.verbDifferences.slice(0, 5)
                                            : result.analysis.verbDifferences,
                                        theologicalTermDifferences: Array.isArray((_c = translated === null || translated === void 0 ? void 0 : translated.analysis) === null || _c === void 0 ? void 0 : _c.theologicalTermDifferences)
                                            ? translated.analysis.theologicalTermDifferences.slice(0, 5)
                                            : result.analysis.theologicalTermDifferences,
                                        literalVsDynamic: Array.isArray((_d = translated === null || translated === void 0 ? void 0 : translated.analysis) === null || _d === void 0 ? void 0 : _d.literalVsDynamic)
                                            ? translated.analysis.literalVsDynamic.slice(0, 5)
                                            : result.analysis.literalVsDynamic,
                                        overallAssessment: String(((_e = translated === null || translated === void 0 ? void 0 : translated.analysis) === null || _e === void 0 ? void 0 : _e.overallAssessment) || result.analysis.overallAssessment).substring(0, 500),
                                    },
                                }];
                        case 3:
                            _a = _f.sent();
                            return [2 /*return*/, result];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return TranslationComparisonEnhancedService_1;
    }());
    __setFunctionName(_classThis, "TranslationComparisonEnhancedService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TranslationComparisonEnhancedService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TranslationComparisonEnhancedService = _classThis;
}();
exports.TranslationComparisonEnhancedService = TranslationComparisonEnhancedService;
