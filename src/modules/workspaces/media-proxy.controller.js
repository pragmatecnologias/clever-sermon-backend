"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.MediaProxyController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var MediaProxyController = function () {
    var _classDecorators = [(0, common_1.Controller)('media'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getThemes_decorators;
    var _getSermons_decorators;
    var _getDecks_decorators;
    var _getImages_decorators;
    var _getAudio_decorators;
    var _getMusic_decorators;
    var _getVideo_decorators;
    var _getSocial_decorators;
    var _getChurchSettings_decorators;
    var _updateChurchSettings_decorators;
    var _syncWorkspace_decorators;
    var _generateDeck_decorators;
    var _generateImage_decorators;
    var _generateAudio_decorators;
    var _generateNarrationScript_decorators;
    var _getVoices_decorators;
    var _getGenres_decorators;
    var _generateMusic_decorators;
    var _generateSermonSong_decorators;
    var _previewSermonSong_decorators;
    var _generateSermonLyrics_decorators;
    var _updateSermonLyricsDraft_decorators;
    var _generateVideo_decorators;
    var _generateSocialKit_decorators;
    var _getDeckExports_decorators;
    var _exportDeck_decorators;
    var _downloadExport_decorators;
    var _proxyRemaining_decorators;
    var MediaProxyController = _classThis = /** @class */ (function () {
        function MediaProxyController_1(workspaceMediaPackService) {
            this.workspaceMediaPackService = (__runInitializers(this, _instanceExtraInitializers), workspaceMediaPackService);
        }
        MediaProxyController_1.prototype.getThemes = function (authorization) {
            return this.workspaceMediaPackService.getThemes(this.extractToken(authorization));
        };
        MediaProxyController_1.prototype.getSermons = function (authorization) {
            return this.workspaceMediaPackService.getSermons(this.extractToken(authorization));
        };
        MediaProxyController_1.prototype.getDecks = function (authorization) {
            return this.workspaceMediaPackService.getDecks(this.extractToken(authorization));
        };
        MediaProxyController_1.prototype.getImages = function (workspaceId, authorization) {
            return this.workspaceMediaPackService.listImages(this.extractToken(authorization), workspaceId);
        };
        MediaProxyController_1.prototype.getAudio = function (workspaceId, authorization) {
            return this.workspaceMediaPackService.listAudio(this.extractToken(authorization), workspaceId);
        };
        MediaProxyController_1.prototype.getMusic = function (workspaceId, authorization) {
            return this.workspaceMediaPackService.listMusic(this.extractToken(authorization), workspaceId);
        };
        MediaProxyController_1.prototype.getVideo = function (workspaceId, authorization) {
            return this.workspaceMediaPackService.listVideo(this.extractToken(authorization), workspaceId);
        };
        MediaProxyController_1.prototype.getSocial = function (workspaceId, authorization) {
            return this.workspaceMediaPackService.listSocial(this.extractToken(authorization), workspaceId);
        };
        MediaProxyController_1.prototype.getChurchSettings = function (authorization) {
            return this.workspaceMediaPackService.getChurchSettings(this.extractToken(authorization));
        };
        MediaProxyController_1.prototype.updateChurchSettings = function (authorization, body) {
            return this.workspaceMediaPackService.updateChurchSettings(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.syncWorkspace = function (authorization, body) {
            return this.workspaceMediaPackService.syncWorkspace(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.generateDeck = function (sermonId, authorization, body) {
            return this.workspaceMediaPackService.generateDeck(this.extractToken(authorization), sermonId, body || {});
        };
        MediaProxyController_1.prototype.generateImage = function (authorization, body) {
            return this.workspaceMediaPackService.generateImage(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.generateAudio = function (authorization, body) {
            return this.workspaceMediaPackService.generateAudio(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.generateNarrationScript = function (authorization, body) {
            return this.workspaceMediaPackService.generateNarrationScript(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.getVoices = function (authorization, provider) {
            return this.workspaceMediaPackService.getVoices(this.extractToken(authorization), provider);
        };
        MediaProxyController_1.prototype.getGenres = function (authorization) {
            return this.workspaceMediaPackService.getGenres(this.extractToken(authorization));
        };
        MediaProxyController_1.prototype.generateMusic = function (authorization, body) {
            return this.workspaceMediaPackService.generateMusic(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.generateSermonSong = function (authorization, body) {
            return this.workspaceMediaPackService.generateSermonSong(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.previewSermonSong = function (authorization, body) {
            return this.workspaceMediaPackService.previewSermonSong(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.generateSermonLyrics = function (authorization, body) {
            return this.workspaceMediaPackService.generateSermonLyrics(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.updateSermonLyricsDraft = function (authorization, body) {
            return this.workspaceMediaPackService.updateSermonLyricsDraft(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.generateVideo = function (authorization, body) {
            return this.workspaceMediaPackService.generateVideo(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.generateSocialKit = function (authorization, body) {
            return this.workspaceMediaPackService.generateSocialKit(this.extractToken(authorization), body || {});
        };
        MediaProxyController_1.prototype.getDeckExports = function (deckId, authorization) {
            return this.workspaceMediaPackService.getDeckExports(deckId, authorization);
        };
        MediaProxyController_1.prototype.exportDeck = function (deckId_1, res_1, body_1) {
            return __awaiter(this, arguments, void 0, function (deckId, res, body, query, authorization) {
                var proxied;
                if (query === void 0) { query = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspaceMediaPackService.proxyToSlides(this.extractToken(authorization), 'post', "/decks/".concat(deckId, "/exports"), query || {}, body || {})];
                        case 1:
                            proxied = _a.sent();
                            return [2 /*return*/, this.sendProxiedResponse(res, proxied)];
                    }
                });
            });
        };
        MediaProxyController_1.prototype.downloadExport = function (id_1, res_1) {
            return __awaiter(this, arguments, void 0, function (id, res, query, authorization) {
                var proxied;
                if (query === void 0) { query = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.workspaceMediaPackService.proxyToSlides(this.extractToken(authorization), 'get', "/exports/".concat(id, "/download"), query || {})];
                        case 1:
                            proxied = _a.sent();
                            return [2 /*return*/, this.sendProxiedResponse(res, proxied)];
                    }
                });
            });
        };
        MediaProxyController_1.prototype.proxyRemaining = function (req, res, authorization) {
            return __awaiter(this, void 0, void 0, function () {
                var url, path, proxied, contentType;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            url = new URL(req.originalUrl, 'http://localhost');
                            path = url.pathname.replace(/^\/api\/v1\/media/, '') || '/';
                            return [4 /*yield*/, this.workspaceMediaPackService.proxyToSlides(this.extractToken(authorization), req.method, path, Object.fromEntries(url.searchParams.entries()), req.body)];
                        case 1:
                            proxied = _c.sent();
                            res.status(proxied.status);
                            Object.entries(proxied.headers || {}).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                var lower = key.toLowerCase();
                                if (['content-length', 'transfer-encoding', 'connection'].includes(lower))
                                    return;
                                if (Array.isArray(value)) {
                                    res.setHeader(key, value.join(', '));
                                }
                                else if (value !== undefined) {
                                    res.setHeader(key, String(value));
                                }
                            });
                            contentType = String(((_a = proxied.headers) === null || _a === void 0 ? void 0 : _a['content-type']) || ((_b = proxied.headers) === null || _b === void 0 ? void 0 : _b['Content-Type']) || '');
                            if (contentType.includes('application/json')) {
                                try {
                                    return [2 /*return*/, res.json(JSON.parse(Buffer.from(proxied.data).toString('utf8')))];
                                }
                                catch (_d) {
                                    return [2 /*return*/, res.send(Buffer.from(proxied.data).toString('utf8'))];
                                }
                            }
                            return [2 /*return*/, res.send(Buffer.from(proxied.data))];
                    }
                });
            });
        };
        MediaProxyController_1.prototype.extractToken = function (authorization) {
            var raw = String(authorization || '').trim();
            if (!raw)
                return null;
            return raw.toLowerCase().startsWith('bearer ') ? raw.slice(7).trim() : raw;
        };
        MediaProxyController_1.prototype.sendProxiedResponse = function (res, proxied) {
            res.status(proxied.status);
            Object.entries(proxied.headers || {}).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var lower = key.toLowerCase();
                if (['content-length', 'transfer-encoding', 'connection'].includes(lower))
                    return;
                if (Array.isArray(value)) {
                    res.setHeader(key, value.join(', '));
                }
                else if (value !== undefined) {
                    res.setHeader(key, String(value));
                }
            });
            return res.send(proxied.data);
        };
        return MediaProxyController_1;
    }());
    __setFunctionName(_classThis, "MediaProxyController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getThemes_decorators = [(0, common_1.Get)('themes')];
        _getSermons_decorators = [(0, common_1.Get)('sermons')];
        _getDecks_decorators = [(0, common_1.Get)('decks')];
        _getImages_decorators = [(0, common_1.Get)('images/list/:workspaceId')];
        _getAudio_decorators = [(0, common_1.Get)('audio/list/:workspaceId')];
        _getMusic_decorators = [(0, common_1.Get)('music/list/:workspaceId')];
        _getVideo_decorators = [(0, common_1.Get)('video/list/:workspaceId')];
        _getSocial_decorators = [(0, common_1.Get)('social/list/:workspaceId')];
        _getChurchSettings_decorators = [(0, common_1.Get)('church-settings')];
        _updateChurchSettings_decorators = [(0, common_1.Patch)('church-settings')];
        _syncWorkspace_decorators = [(0, common_1.Post)('sync-workspace')];
        _generateDeck_decorators = [(0, common_1.Post)('sermons/:sermonId/decks')];
        _generateImage_decorators = [(0, common_1.Post)('images/generate')];
        _generateAudio_decorators = [(0, common_1.Post)('audio/generate')];
        _generateNarrationScript_decorators = [(0, common_1.Post)('audio/narration-script')];
        _getVoices_decorators = [(0, common_1.Get)('audio/voices')];
        _getGenres_decorators = [(0, common_1.Get)('music/genres')];
        _generateMusic_decorators = [(0, common_1.Post)('music/generate')];
        _generateSermonSong_decorators = [(0, common_1.Post)('music/sermon-song/generate')];
        _previewSermonSong_decorators = [(0, common_1.Post)('music/sermon-song/preview')];
        _generateSermonLyrics_decorators = [(0, common_1.Post)('music/sermon-song/lyrics')];
        _updateSermonLyricsDraft_decorators = [(0, common_1.Post)('music/sermon-song/lyrics-draft')];
        _generateVideo_decorators = [(0, common_1.Post)('video/generate')];
        _generateSocialKit_decorators = [(0, common_1.Post)('social/generate')];
        _getDeckExports_decorators = [(0, common_1.Get)('decks/:deckId/exports')];
        _exportDeck_decorators = [(0, common_1.Post)('decks/:deckId/exports')];
        _downloadExport_decorators = [(0, common_1.Get)('exports/:id/download')];
        _proxyRemaining_decorators = [(0, common_1.All)('*')];
        __esDecorate(_classThis, null, _getThemes_decorators, { kind: "method", name: "getThemes", static: false, private: false, access: { has: function (obj) { return "getThemes" in obj; }, get: function (obj) { return obj.getThemes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSermons_decorators, { kind: "method", name: "getSermons", static: false, private: false, access: { has: function (obj) { return "getSermons" in obj; }, get: function (obj) { return obj.getSermons; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDecks_decorators, { kind: "method", name: "getDecks", static: false, private: false, access: { has: function (obj) { return "getDecks" in obj; }, get: function (obj) { return obj.getDecks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getImages_decorators, { kind: "method", name: "getImages", static: false, private: false, access: { has: function (obj) { return "getImages" in obj; }, get: function (obj) { return obj.getImages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAudio_decorators, { kind: "method", name: "getAudio", static: false, private: false, access: { has: function (obj) { return "getAudio" in obj; }, get: function (obj) { return obj.getAudio; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMusic_decorators, { kind: "method", name: "getMusic", static: false, private: false, access: { has: function (obj) { return "getMusic" in obj; }, get: function (obj) { return obj.getMusic; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVideo_decorators, { kind: "method", name: "getVideo", static: false, private: false, access: { has: function (obj) { return "getVideo" in obj; }, get: function (obj) { return obj.getVideo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSocial_decorators, { kind: "method", name: "getSocial", static: false, private: false, access: { has: function (obj) { return "getSocial" in obj; }, get: function (obj) { return obj.getSocial; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getChurchSettings_decorators, { kind: "method", name: "getChurchSettings", static: false, private: false, access: { has: function (obj) { return "getChurchSettings" in obj; }, get: function (obj) { return obj.getChurchSettings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateChurchSettings_decorators, { kind: "method", name: "updateChurchSettings", static: false, private: false, access: { has: function (obj) { return "updateChurchSettings" in obj; }, get: function (obj) { return obj.updateChurchSettings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _syncWorkspace_decorators, { kind: "method", name: "syncWorkspace", static: false, private: false, access: { has: function (obj) { return "syncWorkspace" in obj; }, get: function (obj) { return obj.syncWorkspace; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateDeck_decorators, { kind: "method", name: "generateDeck", static: false, private: false, access: { has: function (obj) { return "generateDeck" in obj; }, get: function (obj) { return obj.generateDeck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateImage_decorators, { kind: "method", name: "generateImage", static: false, private: false, access: { has: function (obj) { return "generateImage" in obj; }, get: function (obj) { return obj.generateImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateAudio_decorators, { kind: "method", name: "generateAudio", static: false, private: false, access: { has: function (obj) { return "generateAudio" in obj; }, get: function (obj) { return obj.generateAudio; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateNarrationScript_decorators, { kind: "method", name: "generateNarrationScript", static: false, private: false, access: { has: function (obj) { return "generateNarrationScript" in obj; }, get: function (obj) { return obj.generateNarrationScript; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVoices_decorators, { kind: "method", name: "getVoices", static: false, private: false, access: { has: function (obj) { return "getVoices" in obj; }, get: function (obj) { return obj.getVoices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGenres_decorators, { kind: "method", name: "getGenres", static: false, private: false, access: { has: function (obj) { return "getGenres" in obj; }, get: function (obj) { return obj.getGenres; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateMusic_decorators, { kind: "method", name: "generateMusic", static: false, private: false, access: { has: function (obj) { return "generateMusic" in obj; }, get: function (obj) { return obj.generateMusic; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateSermonSong_decorators, { kind: "method", name: "generateSermonSong", static: false, private: false, access: { has: function (obj) { return "generateSermonSong" in obj; }, get: function (obj) { return obj.generateSermonSong; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _previewSermonSong_decorators, { kind: "method", name: "previewSermonSong", static: false, private: false, access: { has: function (obj) { return "previewSermonSong" in obj; }, get: function (obj) { return obj.previewSermonSong; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateSermonLyrics_decorators, { kind: "method", name: "generateSermonLyrics", static: false, private: false, access: { has: function (obj) { return "generateSermonLyrics" in obj; }, get: function (obj) { return obj.generateSermonLyrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSermonLyricsDraft_decorators, { kind: "method", name: "updateSermonLyricsDraft", static: false, private: false, access: { has: function (obj) { return "updateSermonLyricsDraft" in obj; }, get: function (obj) { return obj.updateSermonLyricsDraft; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateVideo_decorators, { kind: "method", name: "generateVideo", static: false, private: false, access: { has: function (obj) { return "generateVideo" in obj; }, get: function (obj) { return obj.generateVideo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateSocialKit_decorators, { kind: "method", name: "generateSocialKit", static: false, private: false, access: { has: function (obj) { return "generateSocialKit" in obj; }, get: function (obj) { return obj.generateSocialKit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDeckExports_decorators, { kind: "method", name: "getDeckExports", static: false, private: false, access: { has: function (obj) { return "getDeckExports" in obj; }, get: function (obj) { return obj.getDeckExports; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportDeck_decorators, { kind: "method", name: "exportDeck", static: false, private: false, access: { has: function (obj) { return "exportDeck" in obj; }, get: function (obj) { return obj.exportDeck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _downloadExport_decorators, { kind: "method", name: "downloadExport", static: false, private: false, access: { has: function (obj) { return "downloadExport" in obj; }, get: function (obj) { return obj.downloadExport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _proxyRemaining_decorators, { kind: "method", name: "proxyRemaining", static: false, private: false, access: { has: function (obj) { return "proxyRemaining" in obj; }, get: function (obj) { return obj.proxyRemaining; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MediaProxyController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MediaProxyController = _classThis;
}();
exports.MediaProxyController = MediaProxyController;
