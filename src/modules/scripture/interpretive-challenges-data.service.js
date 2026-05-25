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
exports.InterpretiveChallengesDataService = void 0;
var common_1 = require("@nestjs/common");
var scripture_prompts_1 = require("./scripture-prompts");
var scripture_fallbacks_1 = require("./scripture-fallbacks");
var InterpretiveChallengesDataService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InterpretiveChallengesDataService = _classThis = /** @class */ (function () {
        function InterpretiveChallengesDataService_1(llmService, scriptureService) {
            this.llmService = llmService;
            this.scriptureService = scriptureService;
            this.logger = new common_1.Logger(InterpretiveChallengesDataService.name);
            this.challengeIndex = new Map();
            this.initializeChallengeData();
        }
        InterpretiveChallengesDataService_1.prototype.getInterpretiveChallenge = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var normalized, challenge, generated, error_1, message;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!passage || !passage.trim()) {
                                this.logger.warn("Missing passage parameter for interpretive challenge request (language=".concat(language || 'en', ")"));
                                return [2 /*return*/, this.buildUnavailableChallenge(passage || '', language || 'en', 'missing_passage')];
                            }
                            normalized = this.normalizePassage(passage);
                            challenge = this.challengeIndex.get(normalized);
                            if (challenge) {
                                return [2 /*return*/, __assign(__assign({}, challenge), { dataSource: 'curated' })];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.generateInterpretiveChallenge(passage, language || 'en')];
                        case 2:
                            generated = _a.sent();
                            if (!generated || !Array.isArray(generated.views) || generated.views.length === 0) {
                                this.logger.warn("Interpretive challenge unavailable for \"".concat(passage, "\" (language=").concat(language || 'en', "): empty generated views"));
                                return [2 /*return*/, this.buildFallbackChallenge(passage, language || 'en')];
                            }
                            return [2 /*return*/, generated];
                        case 3:
                            error_1 = _a.sent();
                            message = error_1 instanceof Error ? error_1.message : String(error_1);
                            this.logger.error("Failed to generate interpretive challenge for \"".concat(passage, "\" (language=").concat(language || 'en', "): ").concat(message), error_1 instanceof Error ? error_1.stack : undefined);
                            return [2 /*return*/, this.buildFallbackChallenge(passage, language || 'en')];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        InterpretiveChallengesDataService_1.prototype.generateInterpretiveChallenge = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var analysisTranslation, passageText, result, error_2, message, languageInstruction, prompt, response, parsed, message, salvaged, challenge, views, sdaPerspective, normalizedViews, normalizedSdaPerspective;
                var _this = this;
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
                            message = error_2 instanceof Error ? error_2.message : String(error_2);
                            this.logger.warn("Failed to fetch passage text for interpretive challenges (".concat(passage, ", ").concat(analysisTranslation, "): ").concat(message));
                            return [3 /*break*/, 4];
                        case 4:
                            languageInstruction = language === 'es'
                                ? 'Responde únicamente en español. No uses inglés en ningún campo de texto de la respuesta.'
                                : 'Respond in English.';
                            prompt = scripture_prompts_1.ScripturePrompts.interpretiveChallengesData({
                                languageInstruction: languageInstruction,
                                passage: passage,
                                passageText: passageText || 'Text not available',
                            });
                            return [4 /*yield*/, this.llmService.generateCompletion(prompt, 'system', {
                                    temperature: 0.3,
                                    maxTokens: 3000,
                                    timeoutMs: 12000,
                                })];
                        case 5:
                            response = _a.sent();
                            if (!response || !response.trim()) {
                                throw new Error('LLM returned empty response');
                            }
                            try {
                                parsed = this.parseInterpretiveChallengeJson(response);
                            }
                            catch (error) {
                                message = error instanceof Error ? error.message : String(error);
                                this.logger.warn("Failed to parse interpretive challenge JSON for \"".concat(passage, "\": ").concat(message));
                                salvaged = this.salvageInterpretiveChallengeFromRaw(response);
                                if (salvaged) {
                                    this.logger.warn("Using salvaged interpretive challenge payload for \"".concat(passage, "\""));
                                    parsed = salvaged;
                                }
                                else {
                                    throw new Error('Invalid JSON response from LLM');
                                }
                            }
                            challenge = parsed.challenge || parsed.desafío || parsed.desafio;
                            views = parsed.views || parsed.vistas || [];
                            sdaPerspective = parsed.sdaPerspective || parsed.perspectivaSDA;
                            normalizedViews = views
                                .map(function (view) { return ({
                                viewName: view.viewName || view.nombreVista || view.nombre || '',
                                summary: view.summary || view.resumen || '',
                                proponents: view.proponents || view.proponentes || '',
                                keyArguments: _this.normalizeKeyArguments(view.keyArguments || view.argumentosClave || view.argumentos || []),
                            }); })
                                .filter(function (view) { return view.viewName && view.summary && view.keyArguments.length > 0; });
                            if (!challenge || normalizedViews.length === 0) {
                                throw new Error('LLM response missing required challenge/views content');
                            }
                            normalizedSdaPerspective = sdaPerspective ? {
                                position: sdaPerspective.position || sdaPerspective.posición || sdaPerspective.posicion || '',
                                reasoning: sdaPerspective.reasoning || sdaPerspective.razonamiento || '',
                                supportingTexts: sdaPerspective.supportingTexts || sdaPerspective.textosDeApoyo || sdaPerspective.textos || [],
                            } : undefined;
                            if (!challenge ||
                                normalizedViews.length < 3 ||
                                normalizedViews.some(function (view) { return String(view.summary || '').trim().length < 20 || view.keyArguments.length < 2; })) {
                                throw new Error('LLM response too thin for interpretive challenge');
                            }
                            return [2 /*return*/, {
                                    passage: passage,
                                    challenge: challenge,
                                    views: normalizedViews,
                                    sdaPerspective: normalizedSdaPerspective,
                                    dataSource: 'llm-generated',
                                }];
                    }
                });
            });
        };
        InterpretiveChallengesDataService_1.prototype.normalizePassage = function (passage) {
            return passage.toLowerCase().replace(/\s+/g, ' ').trim();
        };
        InterpretiveChallengesDataService_1.prototype.parseInterpretiveChallengeJson = function (raw) {
            var jsonStr = raw.trim();
            var codeBlockMatch = jsonStr.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
            if (codeBlockMatch) {
                jsonStr = codeBlockMatch[1];
            }
            else {
                var jsonMatch = jsonStr.match(/{[\s\S]*}/);
                if (jsonMatch) {
                    jsonStr = jsonMatch[0];
                }
            }
            var sanitize = function (input) {
                return input
                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                    .replace(/^\uFEFF/, '')
                    // Fix malformed sequence seen in logs: ...],"},{"viewName...
                    .replace(/,\s*"\s*}/g, '}')
                    .replace(/\],\s*"\s*}\s*,\s*{/g, ']},{')
                    .replace(/\],\s*"\s*}\s*,\s*{\s*"viewName"/g, ']},{"viewName"')
                    .replace(/\],\s*}\s*,\s*{/g, ']},{')
                    .replace(/\],\s*}\s*,\s*"/g, ']},"')
                    .replace(/}\s*,\s*"\s*viewName"/g, '},{"viewName"')
                    .replace(/}\s*,\s*,\s*{/g, '},{')
                    .replace(/\},\s*\]/g, '}]')
                    .replace(/,\s*([}\]])/g, '$1')
                    .replace(/,\s*"sdaPerspective"\s*:/g, ',"sdaPerspective":')
                    .replace(/,\s*"perspectivaSDA"\s*:/g, ',"perspectivaSDA":')
                    .trim();
            };
            var primary = sanitize(jsonStr);
            try {
                return JSON.parse(primary);
            }
            catch (_a) {
                var repaired = sanitize(primary
                    .replace(/([{,]\s*)([A-Za-z_][\w]*)(\s*:)/g, '$1"$2"$3')
                    .replace(/:\s*'([^']*)'/g, ': "$1"'));
                try {
                    return JSON.parse(repaired);
                }
                catch (_b) {
                    // Last pass: aggressively normalize broken object boundaries in views arrays.
                    var aggressive = sanitize(repaired
                        .replace(/\],\s*"\s*}\s*,\s*{\s*"/g, ']},{"')
                        .replace(/\],\s*}\s*,\s*{\s*"/g, ']},{"')
                        .replace(/}\s*,\s*"\s*}\s*,\s*{/g, '}},{')
                        .replace(/"\s*}\s*,\s*{\s*"/g, '"},{"')
                        .replace(/"\s*}\s*,\s*"sdaPerspective"/g, '"},"sdaPerspective"')
                        .replace(/"\s*}\s*,\s*"perspectivaSDA"/g, '"},"perspectivaSDA"')
                        .replace(/,\s*,/g, ','));
                    return JSON.parse(aggressive);
                }
            }
        };
        InterpretiveChallengesDataService_1.prototype.salvageInterpretiveChallengeFromRaw = function (raw) {
            var _this = this;
            var _a, _b;
            var payloadMatch = raw.match(/{[\s\S]*}/);
            if (!payloadMatch)
                return null;
            var payload = payloadMatch[0];
            var repaired = payload
                .replace(/\],"\},\{"viewName"/g, ']},{"viewName"')
                .replace(/\],"\},\s*\{/g, ']},{')
                .replace(/"\}\],\s*"sdaPerspective"/g, '"]},"sdaPerspective"')
                .replace(/,\s*,/g, ',');
            var challenge = this.extractJsonStringField(repaired, 'challenge') ||
                this.extractJsonStringField(repaired, 'desafío') ||
                this.extractJsonStringField(repaired, 'desafio');
            if (!challenge)
                return null;
            var viewRegex = /\{\s*"viewName"\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*"summary"\s*:\s*"((?:\\.|[^"\\])*)"(?:\s*,\s*"proponents"\s*:\s*"((?:\\.|[^"\\])*)")?[\s\S]*?"keyArguments"\s*:\s*\[([\s\S]*?)\]\s*\}/g;
            var views = [];
            var match;
            while ((match = viewRegex.exec(repaired)) !== null) {
                var keyArgumentsRaw = match[4] || '';
                var keyArguments = this.normalizeKeyArguments(Array.from(keyArgumentsRaw.matchAll(/"((?:\\.|[^"\\])*)"/g))
                    .map(function (item) { return _this.unescapeJsonString(item[1]); })
                    .filter(Boolean));
                views.push({
                    viewName: this.unescapeJsonString(match[1]),
                    summary: this.unescapeJsonString(match[2]),
                    proponents: this.unescapeJsonString(match[3] || ''),
                    keyArguments: keyArguments,
                });
            }
            var supportingTextsRaw = ((_a = repaired.match(/"supportingTexts"\s*:\s*\[([\s\S]*?)\]/)) === null || _a === void 0 ? void 0 : _a[1]) ||
                ((_b = repaired.match(/"textosDeApoyo"\s*:\s*\[([\s\S]*?)\]/)) === null || _b === void 0 ? void 0 : _b[1]) ||
                '';
            var supportingTexts = Array.from(supportingTextsRaw.matchAll(/"((?:\\.|[^"\\])*)"/g))
                .map(function (item) { return _this.unescapeJsonString(item[1]); })
                .filter(Boolean);
            var sdaPerspective = {
                position: this.extractJsonStringField(repaired, 'position') ||
                    this.extractJsonStringField(repaired, 'posición') ||
                    this.extractJsonStringField(repaired, 'posicion') ||
                    '',
                reasoning: this.extractJsonStringField(repaired, 'reasoning') ||
                    this.extractJsonStringField(repaired, 'razonamiento') ||
                    '',
                supportingTexts: supportingTexts,
            };
            return {
                challenge: challenge,
                views: views,
                sdaPerspective: sdaPerspective.position || sdaPerspective.reasoning || supportingTexts.length ? sdaPerspective : undefined,
            };
        };
        InterpretiveChallengesDataService_1.prototype.extractJsonStringField = function (input, fieldName) {
            var escapedField = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var regex = new RegExp("\"".concat(escapedField, "\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\""));
            var match = input.match(regex);
            if (!match)
                return '';
            return this.unescapeJsonString(match[1]);
        };
        InterpretiveChallengesDataService_1.prototype.unescapeJsonString = function (input) {
            if (!input)
                return '';
            try {
                return JSON.parse("\"".concat(input, "\""));
            }
            catch (_a) {
                return input
                    .replace(/\\"/g, '"')
                    .replace(/\\n/g, '\n')
                    .replace(/\\t/g, '\t')
                    .replace(/\\\\/g, '\\');
            }
        };
        InterpretiveChallengesDataService_1.prototype.normalizeKeyArguments = function (input) {
            var rawValues = [];
            if (Array.isArray(input)) {
                for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
                    var item = input_1[_i];
                    if (typeof item === 'string') {
                        rawValues.push(item);
                        continue;
                    }
                    if (item && typeof item === 'object') {
                        for (var _a = 0, _b = Object.values(item); _a < _b.length; _a++) {
                            var value = _b[_a];
                            if (typeof value === 'string') {
                                rawValues.push(value);
                            }
                        }
                    }
                }
            }
            else if (typeof input === 'string') {
                rawValues.push(input);
            }
            var cleaned = rawValues
                .map(function (value) { return String(value || '').trim(); })
                .filter(Boolean)
                .filter(function (value) { return !/^(argument|argumento)s?:?$/i.test(value); });
            return Array.from(new Set(cleaned));
        };
        InterpretiveChallengesDataService_1.prototype.initializeChallengeData = function () {
            // Reserved for future curated high-priority passages
            // All other passages will be dynamically generated via LLM
        };
        InterpretiveChallengesDataService_1.prototype.hasInterpretiveChallenge = function (passage) {
            var normalized = this.normalizePassage(passage);
            return this.challengeIndex.has(normalized);
        };
        InterpretiveChallengesDataService_1.prototype.getAllAvailablePassages = function () {
            return Array.from(this.challengeIndex.keys());
        };
        InterpretiveChallengesDataService_1.prototype.buildUnavailableChallenge = function (passage, language, reason) {
            var fallbackChallenge = language === 'es'
                ? 'No se identificaron desafíos interpretativos confiables para este pasaje.'
                : 'No reliable interpretive challenges were identified for this passage.';
            return {
                passage: passage,
                challenge: fallbackChallenge,
                views: [],
                dataSource: 'unavailable',
                sdaPerspective: undefined,
            };
        };
        InterpretiveChallengesDataService_1.prototype.buildFallbackChallenge = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var analysisTranslation, passageText, result, _a, fallback;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
                            passageText = '';
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.scriptureService.getPassage(passage, analysisTranslation)];
                        case 2:
                            result = _b.sent();
                            if (result && result.verses && result.verses.length > 0) {
                                passageText = result.verses.map(function (v) { return "".concat(v.reference, ": ").concat(v.text); }).join('\n');
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            fallback = (0, scripture_fallbacks_1.buildFallbackInterpretiveChallenge)(passage, passageText, language);
                            return [2 /*return*/, fallback];
                    }
                });
            });
        };
        return InterpretiveChallengesDataService_1;
    }());
    __setFunctionName(_classThis, "InterpretiveChallengesDataService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InterpretiveChallengesDataService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InterpretiveChallengesDataService = _classThis;
}();
exports.InterpretiveChallengesDataService = InterpretiveChallengesDataService;
