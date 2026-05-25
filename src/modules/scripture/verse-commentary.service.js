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
exports.VerseCommentaryService = void 0;
var common_1 = require("@nestjs/common");
var scripture_prompts_1 = require("./scripture-prompts");
var scripture_fallbacks_1 = require("./scripture-fallbacks");
var VerseCommentaryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VerseCommentaryService = _classThis = /** @class */ (function () {
        function VerseCommentaryService_1(egwService, llmService) {
            this.egwService = egwService;
            this.llmService = llmService;
        }
        VerseCommentaryService_1.prototype.getCommentary = function (verseReference, userId, force, language) {
            return __awaiter(this, void 0, void 0, function () {
                var notes, requestedLanguage, egwQuotes, _i, egwQuotes_1, quote, contextualNote, llmNotes, fallback, fallback, _loop_1, _a, _b, item, state_1, error_1, fallback;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 6, , 7]);
                            notes = [];
                            requestedLanguage = language || 'en';
                            return [4 /*yield*/, this.egwService.getRelevantQuotes(verseReference, undefined, 5, requestedLanguage)];
                        case 1:
                            egwQuotes = _c.sent();
                            for (_i = 0, egwQuotes_1 = egwQuotes; _i < egwQuotes_1.length; _i++) {
                                quote = egwQuotes_1[_i];
                                notes.push({
                                    type: 'egw',
                                    content: quote.text,
                                    source: "".concat(quote.bookTitle, " - ").concat(quote.reference)
                                });
                            }
                            if (!(notes.length > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.generateContextualCommentary(verseReference, userId, requestedLanguage)];
                        case 2:
                            contextualNote = _c.sent();
                            if (contextualNote) {
                                notes.unshift(contextualNote); // Add at beginning
                            }
                            _c.label = 3;
                        case 3:
                            if (!(notes.length === 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.generateLLMCommentary(verseReference, userId, requestedLanguage)];
                        case 4:
                            llmNotes = _c.sent();
                            notes.push.apply(notes, llmNotes);
                            _c.label = 5;
                        case 5:
                            if (notes.length === 0) {
                                fallback = (0, scripture_fallbacks_1.buildFallbackVerseCommentary)(verseReference, '', requestedLanguage);
                                notes.push.apply(notes, fallback.notes);
                            }
                            if (notes.length < 4) {
                                fallback = (0, scripture_fallbacks_1.buildFallbackVerseCommentary)(verseReference, '', requestedLanguage);
                                _loop_1 = function (item) {
                                    if (notes.length >= 4)
                                        return "break";
                                    if (!notes.some(function (existing) { return existing.type === item.type; })) {
                                        notes.push(item);
                                    }
                                };
                                for (_a = 0, _b = fallback.notes; _a < _b.length; _a++) {
                                    item = _b[_a];
                                    state_1 = _loop_1(item);
                                    if (state_1 === "break")
                                        break;
                                }
                            }
                            return [2 /*return*/, {
                                    verseReference: verseReference,
                                    notes: notes,
                                    dataSource: egwQuotes.length > 0 ? 'egw' : (notes.length > 0 ? 'llm-generated' : 'unavailable')
                                }];
                        case 6:
                            error_1 = _c.sent();
                            console.error('Error generating verse commentary:', error_1);
                            fallback = (0, scripture_fallbacks_1.buildFallbackVerseCommentary)(verseReference, '', language);
                            return [2 /*return*/, fallback];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        VerseCommentaryService_1.prototype.generateContextualCommentary = function (reference, userId, language) {
            return __awaiter(this, void 0, void 0, function () {
                var languageLabel, languageInstruction, prompt_1, response, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            languageLabel = language === 'es' ? 'Spanish' : 'English';
                            languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
                            prompt_1 = scripture_prompts_1.ScripturePrompts.verseContextualCommentary({
                                languageInstruction: languageInstruction,
                                reference: reference,
                                languageLabel: languageLabel,
                            });
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt_1, userId || 'system', {
                                    temperature: 0.3,
                                    maxTokens: 1000,
                                    timeoutMs: 12000,
                                })];
                        case 1:
                            response = _a.sent();
                            if (!response || response.trim().length === 0) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    type: 'context',
                                    content: response.trim(),
                                    source: 'Contextual Analysis'
                                }];
                        case 2:
                            error_2 = _a.sent();
                            console.error('Error generating contextual commentary:', error_2);
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        VerseCommentaryService_1.prototype.generateLLMCommentary = function (reference, userId, language) {
            return __awaiter(this, void 0, void 0, function () {
                var languageLabel, languageInstruction, prompt_2, response, jsonMatch, parsed, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            languageLabel = language === 'es' ? 'Spanish' : 'English';
                            languageInstruction = language === 'es' ? 'Responde en español.' : 'Respond in English.';
                            prompt_2 = scripture_prompts_1.ScripturePrompts.verseLlmCommentary({
                                languageInstruction: languageInstruction,
                                reference: reference,
                                languageLabel: languageLabel,
                            });
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt_2, userId || 'system', {
                                    temperature: 0.3,
                                    maxTokens: 800,
                                    timeoutMs: 12000,
                                })];
                        case 1:
                            response = _a.sent();
                            jsonMatch = response.match(/\{[\s\S]*\}/);
                            if (!jsonMatch) {
                                return [2 /*return*/, []];
                            }
                            parsed = JSON.parse(jsonMatch[0]);
                            return [2 /*return*/, Array.isArray(parsed.notes) ? parsed.notes : []];
                        case 2:
                            error_3 = _a.sent();
                            console.error('Error generating LLM commentary:', error_3);
                            return [2 /*return*/, []];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return VerseCommentaryService_1;
    }());
    __setFunctionName(_classThis, "VerseCommentaryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VerseCommentaryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VerseCommentaryService = _classThis;
}();
exports.VerseCommentaryService = VerseCommentaryService;
