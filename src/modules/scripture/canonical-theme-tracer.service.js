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
exports.CanonicalThemeTracerService = void 0;
var common_1 = require("@nestjs/common");
var json_response_util_1 = require("./json-response.util");
var scripture_prompts_1 = require("./scripture-prompts");
var scripture_fallbacks_1 = require("./scripture-fallbacks");
var CanonicalThemeTracerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CanonicalThemeTracerService = _classThis = /** @class */ (function () {
        function CanonicalThemeTracerService_1(llmService, scriptureService) {
            this.llmService = llmService;
            this.scriptureService = scriptureService;
        }
        CanonicalThemeTracerService_1.prototype.getThemesForPassage = function (reference, language, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var passageText, translationCode, result, error_1, prompt_1, lastParseError, attempt, attemptPrompt, response, parsed, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            passageText = '';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 10, , 11]);
                            translationCode = language === 'es' ? 'RVR1960' : 'KJV';
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.scriptureService.getPassage(reference, translationCode)];
                        case 3:
                            result = _a.sent();
                            if (result && result.verses && result.verses.length > 0) {
                                passageText = result.verses.map(function (v) { return "".concat(v.reference, ": ").concat(v.text); }).join('\n');
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error('Failed to fetch passage text for canonical themes:', error_1);
                            return [3 /*break*/, 5];
                        case 5:
                            prompt_1 = this.buildPrompt(reference, passageText, language);
                            lastParseError = null;
                            attempt = 1;
                            _a.label = 6;
                        case 6:
                            if (!(attempt <= 2)) return [3 /*break*/, 9];
                            attemptPrompt = attempt === 1
                                ? prompt_1
                                : "".concat(prompt_1, "\n\nCRITICAL: Your previous response was invalid or truncated JSON. Return compact valid JSON only.");
                            return [4 /*yield*/, this.llmService.generateCompletion(attemptPrompt, userId || 'system', {
                                    temperature: 0.3,
                                    maxTokens: 4000,
                                    timeoutMs: 12000,
                                })];
                        case 7:
                            response = _a.sent();
                            try {
                                parsed = this.parseResponse(response, reference);
                                if (parsed.dataSource === 'llm-generated' && parsed.themes.length > 0) {
                                    return [2 /*return*/, parsed];
                                }
                            }
                            catch (error) {
                                lastParseError = error;
                            }
                            _a.label = 8;
                        case 8:
                            attempt++;
                            return [3 /*break*/, 6];
                        case 9:
                            if (lastParseError) {
                                console.error('Canonical themes parse failed after retries:', lastParseError.message);
                            }
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackCanonicalThemes)(reference, passageText, language)];
                        case 10:
                            error_2 = _a.sent();
                            console.error('Error generating canonical themes:', error_2);
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackCanonicalThemes)(reference, passageText, language)];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        CanonicalThemeTracerService_1.prototype.buildPrompt = function (reference, passageText, language) {
            var languageInstruction = language === 'es'
                ? 'Responde únicamente en español. Todos los campos del JSON deben estar en español. Devuelve solo JSON válido.\n\n'
                : 'Respond in English and return only valid JSON.\n\n';
            return scripture_prompts_1.ScripturePrompts.canonicalThemes({
                languageInstruction: languageInstruction,
                reference: reference,
                passageText: passageText || 'Text not available',
            });
        };
        CanonicalThemeTracerService_1.prototype.parseResponse = function (response, reference) {
            try {
                var parsed = (0, json_response_util_1.parseJsonObjectFromLlm)(response);
                // Handle both "themes" and Spanish "temas" field names
                var themesArray = parsed.themes || parsed.temas;
                // If themes is not an array directly, check if it's wrapped in another object
                if (!Array.isArray(themesArray) && parsed.themes && typeof parsed.themes === 'object') {
                    themesArray = parsed.themes.themes || parsed.themes.temas || parsed.themes;
                }
                if (!themesArray || !Array.isArray(themesArray)) {
                    throw new Error('Invalid themes structure - missing or invalid themes array');
                }
                // Mark first theme as primary and validate structure
                var themes = themesArray
                    .filter(function (theme) { return theme && typeof theme === 'object'; })
                    .map(function (theme, index) { return ({
                    theme: String(theme.theme || theme.tema || '').substring(0, 200),
                    description: String(theme.description || theme.descripción || theme.descripcion || '').substring(0, 500),
                    explanation: String(theme.explanation || theme.explicación || theme.explicacion || '').substring(0, 1000),
                    canonicalMovement: String(theme.canonicalMovement || theme.movimientoCanónico || theme.movimientoCanonico || '').substring(0, 1000),
                    verses: Array.isArray(theme.verses || theme.versículos || theme.versiculos)
                        ? (theme.verses || theme.versículos || theme.versiculos).slice(0, 10).map(function (v) { return ({
                            reference: String(v.reference || v.referencia || '').substring(0, 100),
                            snippet: String(v.snippet || v.fragmento || '').substring(0, 200),
                            era: String(v.era || '').substring(0, 100),
                        }); })
                        : [],
                    category: ['gospel', 'sanctuary', 'prophecy', 'covenant', 'law', 'salvation', 'gracia', 'grace'].includes(theme.category || theme.categoría || theme.categoria)
                        ? (theme.category || theme.categoría || theme.categoria)
                        : 'gospel',
                    isPrimary: index === 0,
                }); })
                    .filter(function (theme) { return theme.theme && theme.description; }); // Only keep themes with required fields
                if (themes.length === 0) {
                    throw new Error('No valid themes extracted from response');
                }
                if (themes.length < 2 || themes.some(function (theme) { return String(theme.description || '').trim().length < 30; })) {
                    throw new Error('Canonical themes response too thin');
                }
                return {
                    passage: reference,
                    themes: themes.slice(0, 6), // Limit to 6 themes
                    dataSource: 'llm-generated',
                };
            }
            catch (error) {
                console.error('Error parsing canonical themes response:', error);
                console.error('Raw response:', response.substring(0, 500));
                throw error;
            }
        };
        CanonicalThemeTracerService_1.prototype.getThemeByName = function (themeName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // This method is no longer supported with LLM approach
                    return [2 /*return*/, null];
                });
            });
        };
        CanonicalThemeTracerService_1.prototype.getAllThemes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // This method is no longer supported with LLM approach
                    return [2 /*return*/, []];
                });
            });
        };
        return CanonicalThemeTracerService_1;
    }());
    __setFunctionName(_classThis, "CanonicalThemeTracerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CanonicalThemeTracerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CanonicalThemeTracerService = _classThis;
}();
exports.CanonicalThemeTracerService = CanonicalThemeTracerService;
