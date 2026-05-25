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
exports.ScriptureCacheService = void 0;
var common_1 = require("@nestjs/common");
var ioredis_1 = require("ioredis");
var ScriptureCacheService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ScriptureCacheService = _classThis = /** @class */ (function () {
        function ScriptureCacheService_1(configService) {
            var _this = this;
            this.configService = configService;
            this.redis = null;
            this.TTL = 86400; // 24 hours in seconds
            this.LLM_CONNECTIONS_TTL = 21600; // 6 hours in seconds
            this.enabled = this.configService.get('REDIS_HOST') ? true : false;
            if (this.enabled) {
                try {
                    this.redis = new ioredis_1.default({
                        host: this.configService.get('REDIS_HOST') || 'localhost',
                        port: this.configService.get('REDIS_PORT') || 6379,
                        retryStrategy: function (times) {
                            if (times > 3) {
                                console.warn('[Cache] Redis connection failed, disabling cache');
                                _this.enabled = false;
                                return null;
                            }
                            return Math.min(times * 100, 3000);
                        },
                    });
                    this.redis.on('error', function (err) {
                        console.error('[Cache] Redis error:', err.message);
                    });
                    this.redis.on('connect', function () {
                        console.log('[Cache] Redis connected successfully');
                    });
                }
                catch (error) {
                    console.warn('[Cache] Failed to initialize Redis:', error.message);
                    this.enabled = false;
                }
            }
            else {
                console.log('[Cache] Redis not configured, caching disabled');
            }
        }
        /**
         * Generate cache key for API.Bible passage
         */
        ScriptureCacheService_1.prototype.getPassageKey = function (bibleId, passageId) {
            return "bible:passage:".concat(bibleId, ":").concat(passageId);
        };
        /**
         * Generate cache key for API.Bible search
         */
        ScriptureCacheService_1.prototype.getSearchKey = function (bibleId, query) {
            return "bible:search:".concat(bibleId, ":").concat(query);
        };
        /**
         * Generate cache key for audio Bible
         */
        ScriptureCacheService_1.prototype.getAudioKey = function (audioBibleId, chapterId) {
            return "bible:audio:".concat(audioBibleId, ":").concat(chapterId);
        };
        ScriptureCacheService_1.prototype.getWordStudyKey = function (word, language, responseLanguage) {
            return "scripture:word-study:".concat(String(language || 'greek').toLowerCase(), ":").concat(String(responseLanguage || 'en').toLowerCase(), ":").concat(encodeURIComponent(String(word || '').trim().toLowerCase()));
        };
        ScriptureCacheService_1.prototype.getWordStudyInsightsKey = function (word, language, context, responseLanguage) {
            return "scripture:word-study-insights:".concat(String(language || 'greek').toLowerCase(), ":").concat(String(responseLanguage || 'en').toLowerCase(), ":").concat(encodeURIComponent(String(word || '').trim().toLowerCase()), ":").concat(encodeURIComponent(String(context || '').trim().toLowerCase()));
        };
        ScriptureCacheService_1.prototype.getWordStudySuggestionsKey = function (reference, translationCode, language, responseLanguage) {
            return "scripture:word-study-suggestions:".concat(String(translationCode || 'KJV').toUpperCase(), ":").concat(String(language || 'greek').toLowerCase(), ":").concat(String(responseLanguage || 'en').toLowerCase(), ":").concat(encodeURIComponent(String(reference || '').trim().toLowerCase()));
        };
        ScriptureCacheService_1.prototype.getSanctuaryConnectionsKey = function (passage, language) {
            return "scripture:sanctuary-connections:".concat(String(language || 'en').toLowerCase(), ":").concat(encodeURIComponent(String(passage || '').trim().toLowerCase()));
        };
        ScriptureCacheService_1.prototype.getProphecyConnectionsKey = function (passage, language) {
            return "scripture:prophecy-connections:".concat(String(language || 'en').toLowerCase(), ":").concat(encodeURIComponent(String(passage || '').trim().toLowerCase()));
        };
        /**
         * Get cached passage
         */
        ScriptureCacheService_1.prototype.getPassage = function (bibleId, passageId) {
            return __awaiter(this, void 0, void 0, function () {
                var key, cached, parsed, hasVerses, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            key = this.getPassageKey(bibleId, passageId);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            cached = _a.sent();
                            if (!cached) return [3 /*break*/, 5];
                            parsed = JSON.parse(cached);
                            hasVerses = Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.verses) && parsed.verses.length > 0;
                            if (!!hasVerses) return [3 /*break*/, 4];
                            // Remove poisoned cache entries so future lookups force a fresh API fetch.
                            return [4 /*yield*/, this.redis.del(key)];
                        case 3:
                            // Remove poisoned cache entries so future lookups force a fresh API fetch.
                            _a.sent();
                            console.warn("[Cache] EVICT EMPTY PASSAGE: ".concat(key));
                            return [2 /*return*/, null];
                        case 4:
                            console.log("[Cache] HIT: ".concat(key));
                            return [2 /*return*/, parsed];
                        case 5:
                            console.log("[Cache] MISS: ".concat(key));
                            return [2 /*return*/, null];
                        case 6:
                            error_1 = _a.sent();
                            console.error('[Cache] Get error:', error_1.message);
                            return [2 /*return*/, null];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Cache passage response
         */
        ScriptureCacheService_1.prototype.setPassage = function (bibleId, passageId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getPassageKey(bibleId, passageId);
                            return [4 /*yield*/, this.redis.setex(key, this.TTL, JSON.stringify(data))];
                        case 2:
                            _a.sent();
                            console.log("[Cache] SET: ".concat(key));
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error('[Cache] Set error:', error_2.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get cached search results
         */
        ScriptureCacheService_1.prototype.getSearch = function (bibleId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var key, cached, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getSearchKey(bibleId, query);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            cached = _a.sent();
                            if (cached) {
                                console.log("[Cache] HIT: ".concat(key));
                                return [2 /*return*/, JSON.parse(cached)];
                            }
                            console.log("[Cache] MISS: ".concat(key));
                            return [2 /*return*/, null];
                        case 3:
                            error_3 = _a.sent();
                            console.error('[Cache] Get error:', error_3.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Cache search results
         */
        ScriptureCacheService_1.prototype.setSearch = function (bibleId, query, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getSearchKey(bibleId, query);
                            // Search results cached for 1 hour
                            return [4 /*yield*/, this.redis.setex(key, 3600, JSON.stringify(data))];
                        case 2:
                            // Search results cached for 1 hour
                            _a.sent();
                            console.log("[Cache] SET: ".concat(key));
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            console.error('[Cache] Set error:', error_4.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get cached audio Bible chapter
         */
        ScriptureCacheService_1.prototype.getAudio = function (audioBibleId, chapterId) {
            return __awaiter(this, void 0, void 0, function () {
                var key, cached, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getAudioKey(audioBibleId, chapterId);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            cached = _a.sent();
                            if (cached) {
                                console.log("[Cache] HIT: ".concat(key));
                                return [2 /*return*/, JSON.parse(cached)];
                            }
                            console.log("[Cache] MISS: ".concat(key));
                            return [2 /*return*/, null];
                        case 3:
                            error_5 = _a.sent();
                            console.error('[Cache] Get error:', error_5.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Cache audio Bible chapter
         */
        ScriptureCacheService_1.prototype.setAudio = function (audioBibleId, chapterId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getAudioKey(audioBibleId, chapterId);
                            // Audio URLs cached for 7 days
                            return [4 /*yield*/, this.redis.setex(key, 604800, JSON.stringify(data))];
                        case 2:
                            // Audio URLs cached for 7 days
                            _a.sent();
                            console.log("[Cache] SET: ".concat(key));
                            return [3 /*break*/, 4];
                        case 3:
                            error_6 = _a.sent();
                            console.error('[Cache] Set error:', error_6.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.getWordStudy = function (word, language, responseLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                var key, cached, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getWordStudyKey(word, language, responseLanguage);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            cached = _a.sent();
                            if (!cached)
                                return [2 /*return*/, null];
                            console.log("[Cache] HIT: ".concat(key));
                            return [2 /*return*/, JSON.parse(cached)];
                        case 3:
                            error_7 = _a.sent();
                            console.error('[Cache] WordStudy get error:', error_7.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.setWordStudy = function (word, language, responseLanguage, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getWordStudyKey(word, language, responseLanguage);
                            // Cache lexicon lookups for 7 days.
                            return [4 /*yield*/, this.redis.setex(key, 604800, JSON.stringify(data))];
                        case 2:
                            // Cache lexicon lookups for 7 days.
                            _a.sent();
                            console.log("[Cache] SET: ".concat(key));
                            return [3 /*break*/, 4];
                        case 3:
                            error_8 = _a.sent();
                            console.error('[Cache] WordStudy set error:', error_8.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.getWordStudyInsights = function (word, language, context, responseLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                var key, cached, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getWordStudyInsightsKey(word, language, context, responseLanguage);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            cached = _a.sent();
                            if (!cached)
                                return [2 /*return*/, null];
                            console.log("[Cache] HIT: ".concat(key));
                            return [2 /*return*/, JSON.parse(cached)];
                        case 3:
                            error_9 = _a.sent();
                            console.error('[Cache] WordStudyInsights get error:', error_9.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.setWordStudyInsights = function (word, language, context, responseLanguage, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getWordStudyInsightsKey(word, language, context, responseLanguage);
                            // Cache LLM insights for 3 days.
                            return [4 /*yield*/, this.redis.setex(key, 259200, JSON.stringify(data))];
                        case 2:
                            // Cache LLM insights for 3 days.
                            _a.sent();
                            console.log("[Cache] SET: ".concat(key));
                            return [3 /*break*/, 4];
                        case 3:
                            error_10 = _a.sent();
                            console.error('[Cache] WordStudyInsights set error:', error_10.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.getWordStudySuggestions = function (reference, translationCode, language, responseLanguage) {
            return __awaiter(this, void 0, void 0, function () {
                var key, cached, parsed, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getWordStudySuggestionsKey(reference, translationCode, language, responseLanguage);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            cached = _a.sent();
                            if (!cached)
                                return [2 /*return*/, null];
                            console.log("[Cache] HIT: ".concat(key));
                            parsed = JSON.parse(cached);
                            return [2 /*return*/, Array.isArray(parsed) ? parsed : null];
                        case 3:
                            error_11 = _a.sent();
                            console.error('[Cache] WordStudySuggestions get error:', error_11.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.setWordStudySuggestions = function (reference, translationCode, language, responseLanguage, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getWordStudySuggestionsKey(reference, translationCode, language, responseLanguage);
                            // Cache suggestion extraction for 12 hours.
                            return [4 /*yield*/, this.redis.setex(key, 43200, JSON.stringify(Array.isArray(data) ? data : []))];
                        case 2:
                            // Cache suggestion extraction for 12 hours.
                            _a.sent();
                            console.log("[Cache] SET: ".concat(key));
                            return [3 /*break*/, 4];
                        case 3:
                            error_12 = _a.sent();
                            console.error('[Cache] WordStudySuggestions set error:', error_12.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.getSanctuaryConnections = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var key, cached, parsed, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getSanctuaryConnectionsKey(passage, language);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            cached = _a.sent();
                            if (!cached)
                                return [2 /*return*/, null];
                            console.log("[Cache] HIT: ".concat(key));
                            parsed = JSON.parse(cached);
                            return [2 /*return*/, Array.isArray(parsed) ? parsed : null];
                        case 3:
                            error_13 = _a.sent();
                            console.error('[Cache] SanctuaryConnections get error:', error_13.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.setSanctuaryConnections = function (passage, language, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getSanctuaryConnectionsKey(passage, language);
                            return [4 /*yield*/, this.redis.setex(key, this.LLM_CONNECTIONS_TTL, JSON.stringify(Array.isArray(data) ? data : []))];
                        case 2:
                            _a.sent();
                            console.log("[Cache] SET: ".concat(key));
                            return [3 /*break*/, 4];
                        case 3:
                            error_14 = _a.sent();
                            console.error('[Cache] SanctuaryConnections set error:', error_14.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.getProphecyConnections = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var key, cached, parsed, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/, null];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getProphecyConnectionsKey(passage, language);
                            return [4 /*yield*/, this.redis.get(key)];
                        case 2:
                            cached = _a.sent();
                            if (!cached)
                                return [2 /*return*/, null];
                            console.log("[Cache] HIT: ".concat(key));
                            parsed = JSON.parse(cached);
                            return [2 /*return*/, Array.isArray(parsed) ? parsed : null];
                        case 3:
                            error_15 = _a.sent();
                            console.error('[Cache] ProphecyConnections get error:', error_15.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.setProphecyConnections = function (passage, language, data) {
            return __awaiter(this, void 0, void 0, function () {
                var key, error_16;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            key = this.getProphecyConnectionsKey(passage, language);
                            return [4 /*yield*/, this.redis.setex(key, this.LLM_CONNECTIONS_TTL, JSON.stringify(Array.isArray(data) ? data : []))];
                        case 2:
                            _a.sent();
                            console.log("[Cache] SET: ".concat(key));
                            return [3 /*break*/, 4];
                        case 3:
                            error_16 = _a.sent();
                            console.error('[Cache] ProphecyConnections set error:', error_16.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Invalidate all cache for a specific Bible
         */
        ScriptureCacheService_1.prototype.invalidateBible = function (bibleId) {
            return __awaiter(this, void 0, void 0, function () {
                var pattern, keys, error_17;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            pattern = "bible:*:".concat(bibleId, ":*");
                            return [4 /*yield*/, this.redis.keys(pattern)];
                        case 2:
                            keys = _b.sent();
                            if (!(keys.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, (_a = this.redis).del.apply(_a, keys)];
                        case 3:
                            _b.sent();
                            console.log("[Cache] Invalidated ".concat(keys.length, " keys for ").concat(bibleId));
                            _b.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_17 = _b.sent();
                            console.error('[Cache] Invalidate error:', error_17.message);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get cache statistics
         */
        ScriptureCacheService_1.prototype.getStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                var info, keyspace, dbMatch, keys, memoryMatch, memory, error_18;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis) {
                                return [2 /*return*/, { enabled: false }];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.redis.info('stats')];
                        case 2:
                            info = _a.sent();
                            return [4 /*yield*/, this.redis.info('keyspace')];
                        case 3:
                            keyspace = _a.sent();
                            dbMatch = keyspace.match(/db0:keys=(\d+)/);
                            keys = dbMatch ? parseInt(dbMatch[1]) : 0;
                            memoryMatch = info.match(/used_memory_human:(.+)/);
                            memory = memoryMatch ? memoryMatch[1].trim() : 'unknown';
                            return [2 /*return*/, { enabled: true, keys: keys, memory: memory }];
                        case 4:
                            error_18 = _a.sent();
                            console.error('[Cache] Stats error:', error_18.message);
                            return [2 /*return*/, { enabled: true }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Clear all cache
         */
        ScriptureCacheService_1.prototype.clearAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_19;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.enabled || !this.redis)
                                return [2 /*return*/];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.redis.flushdb()];
                        case 2:
                            _a.sent();
                            console.log('[Cache] All cache cleared');
                            return [3 /*break*/, 4];
                        case 3:
                            error_19 = _a.sent();
                            console.error('[Cache] Clear error:', error_19.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScriptureCacheService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.redis) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.redis.quit()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        return ScriptureCacheService_1;
    }());
    __setFunctionName(_classThis, "ScriptureCacheService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScriptureCacheService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScriptureCacheService = _classThis;
}();
exports.ScriptureCacheService = ScriptureCacheService;
