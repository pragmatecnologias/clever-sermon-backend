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
exports.SanctuaryProphecyMapperService = void 0;
var common_1 = require("@nestjs/common");
var json_response_util_1 = require("./json-response.util");
var scripture_prompts_1 = require("./scripture-prompts");
var SanctuaryProphecyMapperService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SanctuaryProphecyMapperService = _classThis = /** @class */ (function () {
        function SanctuaryProphecyMapperService_1(llmService, scriptureService, cacheService) {
            this.llmService = llmService;
            this.scriptureService = scriptureService;
            this.cacheService = cacheService;
            this.bookAliasMap = new Map([
                ['efesios', 'ephesians'],
                ['hebreos', 'hebrews'],
                ['apocalipsis', 'revelation'],
                ['levitico', 'leviticus'],
                ['éxodo', 'exodus'],
                ['exodo', 'exodus'],
                ['daniel', 'daniel'],
            ]);
        }
        SanctuaryProphecyMapperService_1.prototype.getSanctuaryConnections = function (passage_1) {
            return __awaiter(this, arguments, void 0, function (passage, language, userId) {
                var normalizedPassage, cached, sanitizedCached, response, connections;
                var _this = this;
                if (language === void 0) { language = 'en'; }
                if (userId === void 0) { userId = 'system'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedPassage = this.normalizePassageForCache(passage);
                            return [4 /*yield*/, this.cacheService.getSanctuaryConnections(normalizedPassage, language)];
                        case 1:
                            cached = _a.sent();
                            if (Array.isArray(cached)) {
                                sanitizedCached = cached
                                    .map(function (item) { return _this.sanitizeSanctuaryConnection(item); })
                                    .filter(function (item) { return !!item; });
                                if (sanitizedCached.length > 0) {
                                    return [2 /*return*/, sanitizedCached];
                                }
                            }
                            return [4 /*yield*/, this.getConnectionsFromLlm('sanctuary', passage, language, userId)];
                        case 2:
                            response = _a.sent();
                            connections = this.parseSanctuaryConnectionsResponse(response);
                            if (connections.length === 0) {
                                throw new Error('No valid sanctuary connections were generated for this passage.');
                            }
                            return [4 /*yield*/, this.cacheService.setSanctuaryConnections(normalizedPassage, language, connections)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, connections];
                    }
                });
            });
        };
        SanctuaryProphecyMapperService_1.prototype.getProphecyConnections = function (passage_1) {
            return __awaiter(this, arguments, void 0, function (passage, language, userId) {
                var normalizedPassage, cached, sanitizedCached, response, connections;
                var _this = this;
                if (language === void 0) { language = 'en'; }
                if (userId === void 0) { userId = 'system'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedPassage = this.normalizePassageForCache(passage);
                            return [4 /*yield*/, this.cacheService.getProphecyConnections(normalizedPassage, language)];
                        case 1:
                            cached = _a.sent();
                            if (Array.isArray(cached)) {
                                sanitizedCached = cached
                                    .map(function (item) { return _this.sanitizeProphecyConnection(item); })
                                    .filter(function (item) { return !!item; });
                                if (sanitizedCached.length > 0) {
                                    return [2 /*return*/, sanitizedCached];
                                }
                            }
                            return [4 /*yield*/, this.getConnectionsFromLlm('prophecy', passage, language, userId)];
                        case 2:
                            response = _a.sent();
                            connections = this.parseProphecyConnectionsResponse(response);
                            if (connections.length === 0) {
                                throw new Error('No valid prophecy connections were generated for this passage.');
                            }
                            return [4 /*yield*/, this.cacheService.setProphecyConnections(normalizedPassage, language, connections)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, connections];
                    }
                });
            });
        };
        SanctuaryProphecyMapperService_1.prototype.getAllSanctuaryThreads = function () {
            return [];
        };
        SanctuaryProphecyMapperService_1.prototype.getAllProphecyThreads = function () {
            return [];
        };
        SanctuaryProphecyMapperService_1.prototype.normalizeBookName = function (book) {
            var cleaned = String(book || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            return this.bookAliasMap.get(cleaned) || cleaned;
        };
        SanctuaryProphecyMapperService_1.prototype.toCanonicalBookChapter = function (passage) {
            var match = String(passage || '').match(/^([\wÀ-ÿ\s]+)\s+(\d+)/);
            if (!match) {
                return this.normalizeBookName(passage).replace(/\s+/g, '-');
            }
            var book = this.normalizeBookName(match[1]);
            var chapter = match[2];
            return "".concat(book, "-").concat(chapter);
        };
        SanctuaryProphecyMapperService_1.prototype.normalizePassageForCache = function (passage) {
            var canonical = this.toCanonicalBookChapter(passage);
            return canonical || String(passage || '').trim().toLowerCase();
        };
        SanctuaryProphecyMapperService_1.prototype.getConnectionsFromLlm = function (mode, passage, language, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var translationCode, passageText, result, error_1, prompt, lastParseError, attempt, attemptPrompt, response, parsed, parsed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            translationCode = language === 'es' ? 'RVR1960' : 'KJV';
                            passageText = '';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.scriptureService.getPassage(passage, translationCode)];
                        case 2:
                            result = _a.sent();
                            if (result && Array.isArray(result.verses) && result.verses.length > 0) {
                                passageText = result.verses.map(function (v) { return "".concat(v.reference, ": ").concat(v.text); }).join('\n');
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error("[SanctuaryProphecyMapper] Failed to fetch passage text for ".concat(passage, ":"), (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || error_1);
                            return [3 /*break*/, 4];
                        case 4:
                            prompt = this.buildPrompt(mode, passage, passageText, language);
                            lastParseError = null;
                            attempt = 1;
                            _a.label = 5;
                        case 5:
                            if (!(attempt <= 2)) return [3 /*break*/, 8];
                            attemptPrompt = attempt === 1
                                ? prompt
                                : "".concat(prompt, "\n\nCRITICAL: Your previous response was invalid or truncated. Return strict valid JSON only, no markdown.");
                            return [4 /*yield*/, this.llmService.generateCompletion(attemptPrompt, userId || 'system', {
                                    temperature: 0.25,
                                    maxTokens: 1600,
                                })];
                        case 6:
                            response = _a.sent();
                            try {
                                if (mode === 'sanctuary') {
                                    parsed = this.parseSanctuaryConnectionsResponse(response);
                                    if (parsed.length > 0)
                                        return [2 /*return*/, response];
                                }
                                else {
                                    parsed = this.parseProphecyConnectionsResponse(response);
                                    if (parsed.length > 0)
                                        return [2 /*return*/, response];
                                }
                            }
                            catch (error) {
                                lastParseError = error;
                            }
                            _a.label = 7;
                        case 7:
                            attempt++;
                            return [3 /*break*/, 5];
                        case 8:
                            if (lastParseError) {
                                throw new Error("LLM response parsing failed: ".concat(lastParseError.message));
                            }
                            throw new Error('LLM did not return usable connection data.');
                    }
                });
            });
        };
        SanctuaryProphecyMapperService_1.prototype.buildPrompt = function (mode, passage, passageText, language) {
            var languageInstruction = language === 'es'
                ? 'Responde solo en español, con JSON válido y sin markdown.'
                : 'Respond in English only, with valid JSON and no markdown.';
            return scripture_prompts_1.ScripturePrompts.sanctuaryOrProphecyConnections({
                mode: mode,
                languageInstruction: languageInstruction,
                passage: passage,
                passageText: passageText || 'Text not available',
            });
        };
        SanctuaryProphecyMapperService_1.prototype.parseSanctuaryConnectionsResponse = function (response) {
            var _this = this;
            var parsed = (0, json_response_util_1.parseJsonObjectFromLlm)(response);
            var items = Array.isArray(parsed)
                ? parsed
                : Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.connections)
                    ? parsed.connections
                    : Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.data)
                        ? parsed.data
                        : [];
            if (!Array.isArray(items))
                return [];
            return items
                .map(function (item) { return _this.sanitizeSanctuaryConnection(item); })
                .filter(function (item) { return !!item; })
                .slice(0, 5);
        };
        SanctuaryProphecyMapperService_1.prototype.parseProphecyConnectionsResponse = function (response) {
            var _this = this;
            var parsed = (0, json_response_util_1.parseJsonObjectFromLlm)(response);
            var items = Array.isArray(parsed)
                ? parsed
                : Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.connections)
                    ? parsed.connections
                    : Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.data)
                        ? parsed.data
                        : [];
            if (!Array.isArray(items))
                return [];
            return items
                .map(function (item) { return _this.sanitizeProphecyConnection(item); })
                .filter(function (item) { return !!item; })
                .slice(0, 5);
        };
        SanctuaryProphecyMapperService_1.prototype.sanitizeSanctuaryConnection = function (raw) {
            if (!raw || typeof raw !== 'object')
                return null;
            var sourcePassage = String(raw.sourcePassage || raw.passage || '').trim().slice(0, 120);
            var targetPassages = Array.isArray(raw.targetPassages)
                ? raw.targetPassages.map(function (x) { return String(x || '').trim(); }).filter(Boolean).slice(0, 12)
                : [];
            var description = String(raw.description || '').trim().slice(0, 600);
            var allowedTypes = new Set(['type_antitype', 'parallel', 'fulfillment', 'thematic']);
            var connectionTypeRaw = String(raw.connectionType || '').trim();
            var connectionType = allowedTypes.has(connectionTypeRaw) ? connectionTypeRaw : 'thematic';
            if (!sourcePassage || !description)
                return null;
            return {
                sourcePassage: sourcePassage,
                targetPassages: targetPassages,
                connectionType: connectionType,
                description: description,
            };
        };
        SanctuaryProphecyMapperService_1.prototype.sanitizeProphecyConnection = function (raw) {
            if (!raw || typeof raw !== 'object')
                return null;
            var passage = String(raw.passage || raw.sourcePassage || '').trim().slice(0, 120);
            var connectedPassages = Array.isArray(raw.connectedPassages)
                ? raw.connectedPassages.map(function (x) { return String(x || '').trim(); }).filter(Boolean).slice(0, 12)
                : [];
            var theme = String(raw.theme || '').trim().slice(0, 160);
            var description = String(raw.description || '').trim().slice(0, 600);
            if (!passage || !theme || !description)
                return null;
            return {
                passage: passage,
                connectedPassages: connectedPassages,
                theme: theme,
                description: description,
            };
        };
        return SanctuaryProphecyMapperService_1;
    }());
    __setFunctionName(_classThis, "SanctuaryProphecyMapperService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SanctuaryProphecyMapperService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SanctuaryProphecyMapperService = _classThis;
}();
exports.SanctuaryProphecyMapperService = SanctuaryProphecyMapperService;
