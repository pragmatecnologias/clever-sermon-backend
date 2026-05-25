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
exports.StudySynthesisService = void 0;
var common_1 = require("@nestjs/common");
var scripture_prompts_1 = require("./scripture-prompts");
var scripture_fallbacks_1 = require("./scripture-fallbacks");
var StudySynthesisService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StudySynthesisService = _classThis = /** @class */ (function () {
        function StudySynthesisService_1(llmService, scriptureService) {
            this.llmService = llmService;
            this.scriptureService = scriptureService;
        }
        StudySynthesisService_1.prototype.getStudySynthesis = function (reference, userId, language) {
            return __awaiter(this, void 0, void 0, function () {
                var passageText, analysisTranslation, result, error_1, prompt_1, response, parsed, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            passageText = '';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 7, , 8]);
                            analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.scriptureService.getPassage(reference, analysisTranslation)];
                        case 3:
                            result = _a.sent();
                            if (result && result.verses && result.verses.length > 0) {
                                passageText = result.verses.map(function (v) { return "".concat(v.reference, ": ").concat(v.text); }).join('\n');
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error('Failed to fetch passage text for study synthesis:', error_1);
                            return [3 /*break*/, 5];
                        case 5:
                            prompt_1 = this.buildPrompt(reference, passageText, language || 'en');
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt_1, userId || 'system', {
                                    temperature: 0.3,
                                    maxTokens: 1200,
                                    timeoutMs: 12000,
                                })];
                        case 6:
                            response = _a.sent();
                            parsed = this.parseResponse(response, reference);
                            if (!String(parsed.centralClaim || '').trim() ||
                                !String(parsed.canonicalSignificance || '').trim() ||
                                !String(parsed.pastoralTakeaway || '').trim() ||
                                !String(parsed.preachingFocus || '').trim() ||
                                String(parsed.centralClaim || '').trim().length < 90 ||
                                String(parsed.canonicalSignificance || '').trim().length < 70 ||
                                String(parsed.pastoralTakeaway || '').trim().length < 70 ||
                                String(parsed.preachingFocus || '').trim().length < 70) {
                                return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackStudySynthesis)(reference, passageText, language)];
                            }
                            return [2 /*return*/, parsed];
                        case 7:
                            error_2 = _a.sent();
                            console.error('Error generating study synthesis:', error_2);
                            return [2 /*return*/, (0, scripture_fallbacks_1.buildFallbackStudySynthesis)(reference, passageText, language)];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        StudySynthesisService_1.prototype.buildPrompt = function (reference, passageText, language) {
            var languageLabel = language === 'es' ? 'Spanish' : 'English';
            var languageInstruction = language === 'es'
                ? 'Responde únicamente en español. No uses inglés en ningún campo de texto de la respuesta.'
                : 'Respond in English.';
            return scripture_prompts_1.ScripturePrompts.studySynthesis({
                languageInstruction: languageInstruction,
                reference: reference,
                passageText: passageText || 'Text not available',
            });
        };
        StudySynthesisService_1.prototype.parseResponse = function (response, reference) {
            try {
                // Try to extract JSON from response
                var jsonMatch = response.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('No JSON found in response');
                }
                var parsed = JSON.parse(jsonMatch[0]);
                return {
                    passage: reference,
                    centralClaim: parsed.centralClaim || '',
                    canonicalSignificance: parsed.canonicalSignificance || '',
                    pastoralTakeaway: parsed.pastoralTakeaway || '',
                    preachingFocus: parsed.preachingFocus || '',
                    dataSource: 'llm-generated',
                };
            }
            catch (error) {
                console.error('Error parsing study synthesis response:', error);
                return {
                    passage: reference,
                    centralClaim: '',
                    canonicalSignificance: '',
                    pastoralTakeaway: '',
                    preachingFocus: '',
                    dataSource: 'unavailable',
                };
            }
        };
        return StudySynthesisService_1;
    }());
    __setFunctionName(_classThis, "StudySynthesisService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StudySynthesisService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StudySynthesisService = _classThis;
}();
exports.StudySynthesisService = StudySynthesisService;
