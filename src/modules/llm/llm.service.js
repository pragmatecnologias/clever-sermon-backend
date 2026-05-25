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
exports.LlmService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var llm_provider_enum_1 = require("../../entities/enums/llm-provider.enum");
var llm_prompts_1 = require("./llm-prompts");
var LlmService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LlmService = _classThis = /** @class */ (function () {
        function LlmService_1(configService, llmRequestRepository) {
            this.configService = configService;
            this.llmRequestRepository = llmRequestRepository;
            this.providerHealthCache = new Map();
        }
        LlmService_1.prototype.logLlmPayload = function (stage, data) {
            var _a;
            var truncate = function (value, limit) {
                if (limit === void 0) { limit = 2000; }
                if (!value)
                    return value;
                return value.length > limit ? "".concat(value.slice(0, limit), "...<truncated>") : value;
            };
            var payload = {
                provider: data.provider,
                model: data.model,
                latencyMs: data.latencyMs,
                prompt: truncate(data.prompt, 2000),
                response: truncate((_a = data.response) !== null && _a !== void 0 ? _a : undefined, 4000),
                error: data.error,
            };
            if (stage === 'request') {
                console.log('[LLM][request]', payload);
            }
            else if (stage === 'response') {
                console.log('[LLM][response]', payload);
            }
            else {
                console.warn('[LLM][error]', payload);
            }
        };
        LlmService_1.prototype.inferProviderFailure = function (error) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            var status = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status;
            var code = (_j = (_e = (_d = (_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.base_resp) === null || _d === void 0 ? void 0 : _d.status_code) !== null && _e !== void 0 ? _e : (_h = (_g = (_f = error === null || error === void 0 ? void 0 : error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.error) === null || _h === void 0 ? void 0 : _h.code) !== null && _j !== void 0 ? _j : error === null || error === void 0 ? void 0 : error.code;
            var message = String((error === null || error === void 0 ? void 0 : error.message) || ((_m = (_l = (_k = error === null || error === void 0 ? void 0 : error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.base_resp) === null || _m === void 0 ? void 0 : _m.status_msg) || '').toLowerCase();
            if (status === 401 ||
                status === 403 ||
                code === 2049 ||
                message.includes('invalid api key') ||
                message.includes('unauthorized') ||
                message.includes('authentication') ||
                message.includes('api key is not configured')) {
                return String((error === null || error === void 0 ? void 0 : error.message) || 'Provider authentication failed');
            }
            return null;
        };
        LlmService_1.prototype.setProviderHealth = function (provider, status, message) {
            this.providerHealthCache.set(provider, {
                status: status,
                message: message,
                checkedAt: new Date().toISOString(),
            });
        };
        LlmService_1.prototype.getProviderHealth = function (provider) {
            var cached = this.providerHealthCache.get(provider);
            if (cached) {
                return cached;
            }
            if (provider === llm_provider_enum_1.LlmProvider.LOCAL) {
                var configured_1 = Boolean(this.configService.get('LM_STUDIO_URL'));
                return configured_1
                    ? { status: 'ready', message: 'Local LLM is configured for generation.' }
                    : { status: 'needs_service', message: 'Configure LM_STUDIO_URL to enable local generation.' };
            }
            if (provider === llm_provider_enum_1.LlmProvider.OPENAI) {
                var configured_2 = Boolean(this.configService.get('OPENAI_API_KEY'));
                return configured_2
                    ? { status: 'ready', message: 'OpenAI is configured for generation.' }
                    : { status: 'needs_service', message: 'Configure OPENAI_API_KEY to enable generation.' };
            }
            var configured = Boolean(this.configService.get('MINIMAX_API_KEY'));
            return configured
                ? { status: 'ready', message: 'MiniMax is configured for generation.' }
                : { status: 'needs_service', message: 'Configure MINIMAX_API_KEY to enable generation.' };
        };
        LlmService_1.prototype.getConfiguredProvider = function () {
            if (this.configService.get('LM_STUDIO_URL'))
                return llm_provider_enum_1.LlmProvider.LOCAL;
            if (this.configService.get('OPENAI_API_KEY'))
                return llm_provider_enum_1.LlmProvider.OPENAI;
            if (this.configService.get('MINIMAX_API_KEY'))
                return llm_provider_enum_1.LlmProvider.MINIMAX;
            return null;
        };
        LlmService_1.prototype.getConfiguredProviderLabel = function () {
            var provider = this.getConfiguredProvider();
            if (provider === llm_provider_enum_1.LlmProvider.LOCAL)
                return 'Local LLM';
            if (provider === llm_provider_enum_1.LlmProvider.OPENAI)
                return 'OpenAI';
            if (provider === llm_provider_enum_1.LlmProvider.MINIMAX)
                return 'MiniMax';
            return 'No LLM provider';
        };
        LlmService_1.prototype.generateCompletion = function (prompt_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (prompt, userId, options) {
                var provider, startTime, shouldLog, response, model, result, result, result, latencyMs, error_1, latencyMs, providerFailure;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            provider = options.provider || llm_provider_enum_1.LlmProvider.MINIMAX;
                            startTime = Date.now();
                            shouldLog = this.configService.get('LOG_LLM_REQUESTS') === 'true';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 11, , 14]);
                            response = void 0;
                            model = void 0;
                            if (shouldLog) {
                                this.logLlmPayload('request', {
                                    provider: provider,
                                    model: options.model || 'unknown',
                                    prompt: prompt,
                                });
                            }
                            if (!(provider === llm_provider_enum_1.LlmProvider.LOCAL)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.callLocalLLM(prompt, options)];
                        case 2:
                            result = _a.sent();
                            response = result.response;
                            model = result.model;
                            return [3 /*break*/, 8];
                        case 3:
                            if (!(provider === llm_provider_enum_1.LlmProvider.OPENAI)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.callOpenAI(prompt, options)];
                        case 4:
                            result = _a.sent();
                            response = result.response;
                            model = result.model;
                            return [3 /*break*/, 8];
                        case 5:
                            if (!(provider === llm_provider_enum_1.LlmProvider.MINIMAX)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.callMiniMax(prompt, options)];
                        case 6:
                            result = _a.sent();
                            response = result.response;
                            model = result.model;
                            return [3 /*break*/, 8];
                        case 7: throw new Error("Unsupported provider: ".concat(provider));
                        case 8:
                            latencyMs = Date.now() - startTime;
                            if (!shouldLog) return [3 /*break*/, 10];
                            this.logLlmPayload('response', {
                                provider: provider,
                                model: model,
                                prompt: prompt,
                                response: response,
                                latencyMs: latencyMs,
                            });
                            return [4 /*yield*/, this.llmRequestRepository.save({
                                    userId: userId,
                                    provider: provider,
                                    model: model,
                                    prompt: prompt,
                                    response: response,
                                    tokenCount: this.estimateTokens(prompt + response),
                                    latencyMs: latencyMs,
                                    wasSuccessful: true,
                                })];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10:
                            this.setProviderHealth(provider, 'ready', "".concat(provider, " responded successfully."));
                            return [2 /*return*/, response];
                        case 11:
                            error_1 = _a.sent();
                            latencyMs = Date.now() - startTime;
                            providerFailure = this.inferProviderFailure(error_1);
                            if (!shouldLog) return [3 /*break*/, 13];
                            this.logLlmPayload('error', {
                                provider: provider,
                                model: options.model || 'unknown',
                                prompt: prompt,
                                latencyMs: latencyMs,
                                error: error_1.message,
                            });
                            return [4 /*yield*/, this.llmRequestRepository.save({
                                    userId: userId,
                                    provider: provider,
                                    model: options.model || 'unknown',
                                    prompt: prompt,
                                    response: null,
                                    tokenCount: null,
                                    latencyMs: latencyMs,
                                    wasSuccessful: false,
                                    error: error_1.message,
                                })];
                        case 12:
                            _a.sent();
                            _a.label = 13;
                        case 13:
                            if (providerFailure) {
                                this.setProviderHealth(provider, 'failed', providerFailure);
                            }
                            throw error_1;
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        LlmService_1.prototype.callLocalLLM = function (prompt, options) {
            return __awaiter(this, void 0, void 0, function () {
                var lmStudioUrl, model, baseMaxTokens, timeoutMs, lastError, maxAttempts, attempt, maxTokens, promptLimit, attemptPrompt, response, content, error_2;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            lmStudioUrl = this.configService.get('LM_STUDIO_URL');
                            model = options.model || this.configService.get('LLM_MODEL_NAME') || 'local-model';
                            baseMaxTokens = options.maxTokens || 2000;
                            timeoutMs = options.timeoutMs || Math.max(LlmService.LOCAL_TIMEOUT_MS, baseMaxTokens * 30);
                            maxAttempts = Math.max(1, Math.min(3, Number((options === null || options === void 0 ? void 0 : options.localMaxAttempts) || LlmService.LOCAL_MAX_ATTEMPTS)));
                            attempt = 1;
                            _e.label = 1;
                        case 1:
                            if (!(attempt <= maxAttempts)) return [3 /*break*/, 6];
                            maxTokens = attempt === 1
                                ? baseMaxTokens
                                : attempt === 2
                                    ? Math.max(350, Math.floor(baseMaxTokens * 0.65))
                                    : Math.max(280, Math.floor(baseMaxTokens * 0.5));
                            promptLimit = attempt === 1 ? prompt.length : attempt === 2 ? Math.floor(prompt.length * 0.85) : Math.floor(prompt.length * 0.7);
                            attemptPrompt = promptLimit < prompt.length ? "".concat(prompt.slice(0, promptLimit), "\n\n[Prompt truncated for transport safety]") : prompt;
                            _e.label = 2;
                        case 2:
                            _e.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, axios_1.default.post("".concat(lmStudioUrl, "/chat/completions"), {
                                    model: model,
                                    messages: [{ role: 'user', content: attemptPrompt }],
                                    temperature: options.temperature || 0.7,
                                    max_tokens: maxTokens,
                                    frequency_penalty: 1.2,
                                    presence_penalty: 0.6,
                                    repeat_penalty: 1.3,
                                }, {
                                    timeout: timeoutMs,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })];
                        case 3:
                            response = _e.sent();
                            content = (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
                            if (typeof content !== 'string' || !content.trim()) {
                                throw new Error('Local LLM returned an empty completion payload');
                            }
                            return [2 /*return*/, {
                                    response: content,
                                    model: model,
                                }];
                        case 4:
                            error_2 = _e.sent();
                            lastError = error_2;
                            if (!this.shouldRetryLocalLlm(error_2) || attempt === maxAttempts) {
                                return [3 /*break*/, 6];
                            }
                            return [3 /*break*/, 5];
                        case 5:
                            attempt++;
                            return [3 /*break*/, 1];
                        case 6: throw this.wrapLocalLlmError(lastError, model);
                    }
                });
            });
        };
        LlmService_1.prototype.shouldRetryLocalLlm = function (error) {
            var _a, _b, _c;
            var status = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status;
            var code = error === null || error === void 0 ? void 0 : error.code;
            var bodyText = typeof ((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === 'string'
                ? error.response.data.toLowerCase()
                : JSON.stringify(((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) || '').toLowerCase();
            var retryable400 = status === 400 &&
                (bodyText.includes('context') ||
                    bodyText.includes('max token') ||
                    bodyText.includes('too long') ||
                    bodyText.includes('invalid request'));
            return (status >= 500 ||
                retryable400 ||
                code === 'ECONNABORTED' ||
                code === 'ETIMEDOUT' ||
                code === 'ECONNRESET');
        };
        LlmService_1.prototype.wrapLocalLlmError = function (error, model) {
            var _a, _b;
            var status = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status;
            var code = error === null || error === void 0 ? void 0 : error.code;
            var body = typeof ((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === 'string'
                ? error.response.data.replace(/\s+/g, ' ').trim().slice(0, 180)
                : '';
            var parts = ["Local LLM request failed for model ".concat(model)];
            if (status)
                parts.push("status ".concat(status));
            if (code)
                parts.push("code ".concat(code));
            if (body)
                parts.push(body);
            return new Error(parts.join(' - '));
        };
        LlmService_1.prototype.callOpenAI = function (prompt, options) {
            return __awaiter(this, void 0, void 0, function () {
                var apiKey, model, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            apiKey = this.configService.get('OPENAI_API_KEY');
                            model = options.model || 'gpt-4';
                            return [4 /*yield*/, axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                                    model: model,
                                    messages: [{ role: 'user', content: prompt }],
                                    temperature: options.temperature || 0.7,
                                    max_tokens: options.maxTokens || 2000,
                                }, {
                                    headers: {
                                        'Authorization': "Bearer ".concat(apiKey),
                                        'Content-Type': 'application/json',
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, {
                                    response: response.data.choices[0].message.content,
                                    model: model,
                                }];
                    }
                });
            });
        };
        LlmService_1.prototype.callMiniMax = function (prompt, options) {
            return __awaiter(this, void 0, void 0, function () {
                var apiKey, model, response, rawContent;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            apiKey = this.configService.get('MINIMAX_API_KEY');
                            if (!apiKey) {
                                throw new Error('MINIMAX_API_KEY is not configured. Set it in your .env file.');
                            }
                            model = options.model || 'MiniMax-M2.7';
                            return [4 /*yield*/, axios_1.default.post('https://api.minimax.io/v1/text/chatcompletion_v2', {
                                    model: model,
                                    messages: [{ role: 'user', content: prompt }],
                                    temperature: options.temperature || 0.7,
                                    max_completion_tokens: options.maxTokens || 2000,
                                }, {
                                    timeout: options.timeoutMs || 120000,
                                    headers: {
                                        'Authorization': "Bearer ".concat(apiKey),
                                        'Content-Type': 'application/json',
                                    },
                                })];
                        case 1:
                            response = _c.sent();
                            if (((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.base_resp) === null || _b === void 0 ? void 0 : _b.status_code) !== 0) {
                                throw new Error("MiniMax API error: ".concat(response.data.base_resp.status_msg, " (code ").concat(response.data.base_resp.status_code, ")"));
                            }
                            rawContent = response.data.choices[0].message.content || '';
                            return [2 /*return*/, {
                                    response: rawContent.replace(/^```json\s*/i, '').replace(/\s*```$/, ''),
                                    model: model,
                                }];
                    }
                });
            });
        };
        LlmService_1.prototype.estimateTokens = function (text) {
            return Math.ceil(text.length / 4);
        };
        LlmService_1.prototype.generateSermonOutline = function (passage, theme, style, language, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var languageLabel, prompt, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            languageLabel = language === 'es' ? 'Spanish' : 'English';
                            prompt = llm_prompts_1.LlmPrompts.sermonOutline({
                                passage: passage,
                                theme: theme,
                                style: style,
                                languageLabel: languageLabel,
                            });
                            return [4 /*yield*/, this.generateCompletion(prompt, userId)];
                        case 1:
                            response = _a.sent();
                            try {
                                return [2 /*return*/, JSON.parse(response)];
                            }
                            catch (_b) {
                                return [2 /*return*/, { rawResponse: response }];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        LlmService_1.prototype.generateManuscript = function (outline, passage, language, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var languageLabel, prompt;
                return __generator(this, function (_a) {
                    languageLabel = language === 'es' ? 'Spanish' : 'English';
                    prompt = llm_prompts_1.LlmPrompts.manuscript({
                        outlineJson: JSON.stringify(outline, null, 2),
                        passage: passage,
                        languageLabel: languageLabel,
                    });
                    return [2 /*return*/, this.generateCompletion(prompt, userId)];
                });
            });
        };
        LlmService_1.prototype.generateApplications = function (passage, mainPoints, audienceType, language, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var languageLabel, prompt, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            languageLabel = language === 'es' ? 'Spanish' : 'English';
                            prompt = llm_prompts_1.LlmPrompts.applications({
                                audienceType: audienceType,
                                passage: passage,
                                mainPoints: mainPoints.join(', '),
                                languageLabel: languageLabel,
                            });
                            return [4 /*yield*/, this.generateCompletion(prompt, userId)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.split('\n').filter(function (line) { return line.trim().length > 0; })];
                    }
                });
            });
        };
        LlmService_1.prototype.generateDiscussionQuestions = function (passage, theme, language, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var languageLabel, prompt, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            languageLabel = language === 'es' ? 'Spanish' : 'English';
                            prompt = llm_prompts_1.LlmPrompts.discussionQuestions({
                                passage: passage,
                                theme: theme,
                                languageLabel: languageLabel,
                            });
                            return [4 /*yield*/, this.generateCompletion(prompt, userId)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.split('\n').filter(function (line) { return line.trim().length > 0; })];
                    }
                });
            });
        };
        return LlmService_1;
    }());
    __setFunctionName(_classThis, "LlmService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LlmService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.LOCAL_TIMEOUT_MS = 45000;
    _classThis.LOCAL_MAX_ATTEMPTS = 3;
    (function () {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LlmService = _classThis;
}();
exports.LlmService = LlmService;
