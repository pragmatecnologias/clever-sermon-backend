"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.StructuralAnalysisDataService = void 0;
var common_1 = require("@nestjs/common");
var json_response_util_1 = require("./json-response.util");
var scripture_prompts_1 = require("./scripture-prompts");
var scripture_fallbacks_1 = require("./scripture-fallbacks");
var StructuralAnalysisDataService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StructuralAnalysisDataService = _classThis = /** @class */ (function () {
        function StructuralAnalysisDataService_1(llmService, scriptureService) {
            this.llmService = llmService;
            this.scriptureService = scriptureService;
            this.structureIndex = new Map();
            this.initializeStructuralData();
        }
        StructuralAnalysisDataService_1.prototype.getStructuralAnalysis = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, analysis, generated, error_1, fallbackPassage, passageText;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            normalized = this.normalizePassage(passage);
                            analysis = this.structureIndex.get(normalized);
                            if (analysis) {
                                return [2 /*return*/, __assign(__assign({}, analysis), { dataSource: 'curated' })];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 5]);
                            console.log("[StructuralAnalysis] Generating for passage: ".concat(passage, ", language: ").concat(language || 'en'));
                            return [4 /*yield*/, this.generateStructuralAnalysis(passage, language || 'en')];
                        case 2:
                            generated = _b.sent();
                            console.log("[StructuralAnalysis] Successfully generated for ".concat(passage));
                            return [2 /*return*/, generated];
                        case 3:
                            error_1 = _b.sent();
                            console.error("[StructuralAnalysis] Failed for passage: ".concat(passage, ", language: ").concat(language), error_1);
                            console.error('[StructuralAnalysis] Error details:', error_1.message, (_a = error_1.stack) === null || _a === void 0 ? void 0 : _a.substring(0, 500));
                            return [4 /*yield*/, this.scriptureService.getPassage(passage, language === 'es' ? 'RVR1960' : 'KJV').catch(function () { return null; })];
                        case 4:
                            fallbackPassage = _b.sent();
                            passageText = fallbackPassage && fallbackPassage.verses ? fallbackPassage.verses.map(function (v) { return "".concat(v.reference, ": ").concat(v.text); }).join('\n') : '';
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackStructuralAnalysis)(passage, passageText, language)];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        StructuralAnalysisDataService_1.prototype.generateStructuralAnalysis = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var analysisTranslation, passageText, result, error_2, languageLabel, languageInstruction, prompt, parsed, lastParseError, attempt, attemptPrompt, response, rawStructure, normalizedStructure, rawChiasm, normalizedChiasm, structuralAnalysis;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
                            passageText = '';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.scriptureService.getPassage(passage, analysisTranslation)];
                        case 2:
                            result = _a.sent();
                            if (result && result.verses && result.verses.length > 0) {
                                passageText = result.verses.map(function (v) { return "".concat(v.reference, ": ").concat(v.text); }).join('\n');
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error('Failed to fetch passage text for structural analysis:', error_2);
                            return [3 /*break*/, 4];
                        case 4:
                            languageLabel = language === 'es' ? 'Spanish' : 'English';
                            languageInstruction = language === 'es'
                                ? "CRITICAL INSTRUCTIONS:\n1. You MUST respond ONLY in Spanish. Every single field in the JSON must be in Spanish.\n2. Do NOT use any English words in the JSON fields.\n3. Return ONLY the JSON object - no explanations, no markdown, no extra text.\n\nINSTRUCCIONES CR\u00CDTICAS:\n1. Debes responder \u00DANICAMENTE en espa\u00F1ol. Todos los campos del JSON deben estar en espa\u00F1ol.\n2. NO uses NINGUNA palabra en ingl\u00E9s en los campos del JSON.\n3. Devuelve SOLAMENTE el objeto JSON - sin explicaciones, sin markdown, sin texto adicional."
                                : 'Respond in English. Return ONLY the JSON object - no markdown, no extra text.';
                            prompt = scripture_prompts_1.ScripturePrompts.structuralAnalysis({
                                languageInstruction: languageInstruction,
                                passage: passage,
                                passageText: passageText || 'Text not available - analyze based on reference only',
                            });
                            parsed = null;
                            lastParseError = null;
                            attempt = 1;
                            _a.label = 5;
                        case 5:
                            if (!(attempt <= 2)) return [3 /*break*/, 8];
                            attemptPrompt = attempt === 1
                                ? prompt
                                : "".concat(prompt, "\n\nCRITICAL: Your previous response was invalid JSON. Return compact valid JSON only. No comments, no prose, no markdown.");
                            console.log("[StructuralAnalysis] Calling LLM for passage: ".concat(passage, " (attempt ").concat(attempt, ")"));
                            return [4 /*yield*/, this.llmService.generateCompletion(attemptPrompt, 'system', {
                                    temperature: 0.2,
                                    maxTokens: 1600,
                                    timeoutMs: 12000,
                                })];
                        case 6:
                            response = _a.sent();
                            console.log("[StructuralAnalysis] LLM response length: ".concat(response.length, " chars"));
                            console.log("[StructuralAnalysis] Response preview: ".concat(response.substring(0, 200), "..."));
                            try {
                                parsed = (0, json_response_util_1.parseJsonObjectFromLlm)(response);
                                console.log('[StructuralAnalysis] Successfully parsed JSON');
                                return [3 /*break*/, 8];
                            }
                            catch (parseError) {
                                lastParseError = parseError;
                                console.error('[StructuralAnalysis] Failed to parse JSON:', parseError.message);
                                console.error('[StructuralAnalysis] Full response:', response);
                            }
                            _a.label = 7;
                        case 7:
                            attempt++;
                            return [3 /*break*/, 5];
                        case 8:
                            if (!parsed) {
                                return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackStructuralAnalysis)(passage, passageText, language)];
                            }
                            rawStructure = parsed.structure || parsed.estructura || [];
                            normalizedStructure = Array.isArray(rawStructure) ? rawStructure.map(function (el) { return ({
                                verses: el.verses || el.versículos || el.versiculos || '',
                                type: el.type || el.tipo || 'body',
                                description: el.description || el.descripción || el.descripcion || '',
                            }); }) : [];
                            rawChiasm = parsed.chiasm || parsed.quiasmo;
                            normalizedChiasm = rawChiasm ? {
                                pattern: rawChiasm.pattern || rawChiasm.patrón || rawChiasm.patron || '',
                                elements: Array.isArray(rawChiasm.elements || rawChiasm.elementos)
                                    ? (rawChiasm.elements || rawChiasm.elementos).map(function (el) { return ({
                                        label: el.label || el.etiqueta || '',
                                        verses: el.verses || el.versículos || el.versiculos || '',
                                        content: el.content || el.contenido || '',
                                    }); })
                                    : [],
                            } : undefined;
                            structuralAnalysis = {
                                passage: passage,
                                literaryGenre: parsed.literaryGenre || parsed.géneroLiterario || parsed.generoLiterario || 'Unknown',
                                structure: normalizedStructure,
                                chiasm: normalizedChiasm,
                                parallelism: (parsed.parallelism || parsed.paralelismo) && (parsed.parallelism || parsed.paralelismo).length > 0 ? (parsed.parallelism || parsed.paralelismo) : undefined,
                                dataSource: 'llm-generated',
                            };
                            if (structuralAnalysis.structure.length < 3 ||
                                structuralAnalysis.structure.some(function (element) { return String(element.description || '').trim().length < 20; })) {
                                return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackStructuralAnalysis)(passage, passageText, language)];
                            }
                            return [2 /*return*/, structuralAnalysis];
                    }
                });
            });
        };
        StructuralAnalysisDataService_1.prototype.normalizePassage = function (passage) {
            if (!passage)
                return '';
            return passage.toLowerCase().replace(/\s+/g, ' ').trim();
        };
        StructuralAnalysisDataService_1.prototype.initializeStructuralData = function () {
            // Reserved for future curated high-priority passages
            // All other passages will be dynamically generated via LLM
        };
        StructuralAnalysisDataService_1.prototype.hasStructuralData = function (passage) {
            var normalized = this.normalizePassage(passage);
            return this.structureIndex.has(normalized);
        };
        StructuralAnalysisDataService_1.prototype.getAllAvailablePassages = function () {
            return Array.from(this.structureIndex.keys());
        };
        return StructuralAnalysisDataService_1;
    }());
    __setFunctionName(_classThis, "StructuralAnalysisDataService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StructuralAnalysisDataService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StructuralAnalysisDataService = _classThis;
}();
exports.StructuralAnalysisDataService = StructuralAnalysisDataService;
