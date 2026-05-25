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
exports.AudioBibleService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var AudioBibleService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AudioBibleService = _classThis = /** @class */ (function () {
        function AudioBibleService_1(configService, cacheService) {
            this.configService = configService;
            this.cacheService = cacheService;
        }
        /**
         * Get available audio Bibles
         */
        AudioBibleService_1.prototype.getAudioBibles = function (language) {
            return __awaiter(this, void 0, void 0, function () {
                var apiKey, apiUrl, params, response, error_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            apiKey = this.configService.get('BIBLE_API_KEY');
                            apiUrl = this.configService.get('BIBLE_API_URL');
                            if (!apiKey || !apiUrl) {
                                return [2 /*return*/, []];
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            params = {};
                            if (language) {
                                params.language = language;
                            }
                            return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/audio-bibles"), {
                                    params: params,
                                    headers: { 'api-key': apiKey },
                                })];
                        case 2:
                            response = _c.sent();
                            return [2 /*return*/, ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || []];
                        case 3:
                            error_1 = _c.sent();
                            console.error('[AudioBible] Failed to fetch audio Bibles:', ((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) || error_1.message);
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get audio Bible details
         */
        AudioBibleService_1.prototype.getAudioBible = function (audioBibleId) {
            return __awaiter(this, void 0, void 0, function () {
                var apiKey, apiUrl, response, error_2;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            apiKey = this.configService.get('BIBLE_API_KEY');
                            apiUrl = this.configService.get('BIBLE_API_URL');
                            if (!apiKey || !apiUrl) {
                                return [2 /*return*/, null];
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/audio-bibles/").concat(audioBibleId), {
                                    headers: { 'api-key': apiKey },
                                })];
                        case 2:
                            response = _c.sent();
                            return [2 /*return*/, ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || null];
                        case 3:
                            error_2 = _c.sent();
                            console.error('[AudioBible] Failed to fetch audio Bible:', ((_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data) || error_2.message);
                            return [2 /*return*/, null];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get audio chapter
         */
        AudioBibleService_1.prototype.getAudioChapter = function (audioBibleId, chapterId) {
            return __awaiter(this, void 0, void 0, function () {
                var apiKey, apiUrl, cached, response, data, error_3;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            apiKey = this.configService.get('BIBLE_API_KEY');
                            apiUrl = this.configService.get('BIBLE_API_URL');
                            if (!apiKey || !apiUrl) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.cacheService.getAudio(audioBibleId, chapterId)];
                        case 1:
                            cached = _c.sent();
                            if (cached) {
                                return [2 /*return*/, cached];
                            }
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 6, , 7]);
                            return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/audio-bibles/").concat(audioBibleId, "/chapters/").concat(chapterId), {
                                    headers: { 'api-key': apiKey },
                                })];
                        case 3:
                            response = _c.sent();
                            data = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || null;
                            if (!data) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.cacheService.setAudio(audioBibleId, chapterId, data)];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5: return [2 /*return*/, data];
                        case 6:
                            error_3 = _c.sent();
                            console.error('[AudioBible] Failed to fetch audio chapter:', ((_b = error_3.response) === null || _b === void 0 ? void 0 : _b.data) || error_3.message);
                            return [2 /*return*/, null];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get audio chapters for a book
         */
        AudioBibleService_1.prototype.getAudioChapters = function (audioBibleId, bookId) {
            return __awaiter(this, void 0, void 0, function () {
                var apiKey, apiUrl, response, error_4;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            apiKey = this.configService.get('BIBLE_API_KEY');
                            apiUrl = this.configService.get('BIBLE_API_URL');
                            if (!apiKey || !apiUrl) {
                                return [2 /*return*/, []];
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/audio-bibles/").concat(audioBibleId, "/books/").concat(bookId, "/chapters"), {
                                    headers: { 'api-key': apiKey },
                                })];
                        case 2:
                            response = _c.sent();
                            return [2 /*return*/, ((_a = response.data) === null || _a === void 0 ? void 0 : _a.data) || []];
                        case 3:
                            error_4 = _c.sent();
                            console.error('[AudioBible] Failed to fetch audio chapters:', ((_b = error_4.response) === null || _b === void 0 ? void 0 : _b.data) || error_4.message);
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Convert scripture reference to audio chapter ID
         * Example: "John 3:16" -> { audioBibleId, bookId: "JHN", chapterId: "JHN.3" }
         */
        AudioBibleService_1.prototype.parseReferenceForAudio = function (reference) {
            var match = reference.match(/^(.*?)\s+(\d+)(?::(\d+))?/);
            if (!match) {
                return null;
            }
            var bookName = match[1].toLowerCase().replace(/\s+/g, '');
            var chapter = match[2];
            // Simple book name to ID mapping (extend as needed)
            var bookMap = {
                'john': 'JHN',
                'matthew': 'MAT',
                'mark': 'MRK',
                'luke': 'LUK',
                'genesis': 'GEN',
                'exodus': 'EXO',
                'psalms': 'PSA',
                'psalm': 'PSA',
                // Add more as needed
            };
            var bookId = bookMap[bookName];
            if (!bookId) {
                return null;
            }
            return {
                bookId: bookId,
                chapterId: "".concat(bookId, ".").concat(chapter),
            };
        };
        return AudioBibleService_1;
    }());
    __setFunctionName(_classThis, "AudioBibleService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AudioBibleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AudioBibleService = _classThis;
}();
exports.AudioBibleService = AudioBibleService;
