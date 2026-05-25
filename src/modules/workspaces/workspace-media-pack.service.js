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
exports.WorkspaceMediaPackService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var deck_composition_contract_1 = require("../../../../../shared/deck-composition.contract");
var WorkspaceMediaPackService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WorkspaceMediaPackService = _classThis = /** @class */ (function () {
        function WorkspaceMediaPackService_1(configService, workspacesService, workspaceRepository) {
            this.configService = configService;
            this.workspacesService = workspacesService;
            this.workspaceRepository = workspaceRepository;
            this.cachedSlidesServiceToken = null;
            this.slidesClient = axios_1.default.create({
                baseURL: this.getSlidesApiBaseUrl(),
                timeout: 120000,
            });
        }
        WorkspaceMediaPackService_1.prototype.getSlidesApiBaseUrl = function () {
            return this.configService.get('SLIDES_API_URL') || 'http://localhost:3001/api/v1';
        };
        WorkspaceMediaPackService_1.prototype.extractToken = function (authorization) {
            var raw = String(authorization || '').trim();
            if (!raw)
                return null;
            return raw.toLowerCase().startsWith('bearer ') ? raw.slice(7).trim() : raw;
        };
        WorkspaceMediaPackService_1.prototype.getSlidesServiceToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                var email, password, churchName, loginResponse, error_1, status_1, loginResponse;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (this.cachedSlidesServiceToken) {
                                return [2 /*return*/, this.cachedSlidesServiceToken];
                            }
                            email = this.configService.get('SLIDES_SERVICE_EMAIL') || 'media-proxy@clever-sermon.local';
                            password = this.configService.get('SLIDES_SERVICE_PASSWORD') || 'media-proxy-password';
                            churchName = this.configService.get('SLIDES_SERVICE_CHURCH_NAME') || 'Clever Sermon Media';
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 3, , 6]);
                            return [4 /*yield*/, this.slidesClient.post('/auth/login', {
                                    email: email,
                                    password: password,
                                })];
                        case 2:
                            loginResponse = _d.sent();
                            this.cachedSlidesServiceToken = ((_a = loginResponse.data) === null || _a === void 0 ? void 0 : _a.access_token) || null;
                            return [2 /*return*/, this.cachedSlidesServiceToken];
                        case 3:
                            error_1 = _d.sent();
                            status_1 = (_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _b === void 0 ? void 0 : _b.status;
                            if (status_1 !== 401 && status_1 !== 404) {
                                throw error_1;
                            }
                            return [4 /*yield*/, this.slidesClient.post('/auth/register', {
                                    email: email,
                                    password: password,
                                    churchName: churchName,
                                })];
                        case 4:
                            _d.sent();
                            return [4 /*yield*/, this.slidesClient.post('/auth/login', {
                                    email: email,
                                    password: password,
                                })];
                        case 5:
                            loginResponse = _d.sent();
                            this.cachedSlidesServiceToken = ((_c = loginResponse.data) === null || _c === void 0 ? void 0 : _c.access_token) || null;
                            return [2 /*return*/, this.cachedSlidesServiceToken];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.requestSlides = function (path, token, body, serviceToken) {
            return __awaiter(this, void 0, void 0, function () {
                var request, error_2, status_2, fallbackToken, _a;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            request = function (authToken) { return __awaiter(_this, void 0, void 0, function () {
                                var response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.slidesClient.request({
                                                url: path,
                                                method: body === undefined ? 'get' : 'post',
                                                data: body,
                                                headers: authToken ? { Authorization: "Bearer ".concat(authToken) } : undefined,
                                            })];
                                        case 1:
                                            response = _a.sent();
                                            return [2 /*return*/, response.data];
                                    }
                                });
                            }); };
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 7]);
                            return [4 /*yield*/, request(token)];
                        case 2: return [2 /*return*/, _c.sent()];
                        case 3:
                            error_2 = _c.sent();
                            status_2 = (_b = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _b === void 0 ? void 0 : _b.status;
                            if (!(status_2 === 401)) return [3 /*break*/, 6];
                            _a = serviceToken;
                            if (_a) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.getSlidesServiceToken()];
                        case 4:
                            _a = (_c.sent());
                            _c.label = 5;
                        case 5:
                            fallbackToken = _a;
                            if (fallbackToken && token !== fallbackToken) {
                                return [2 /*return*/, request(fallbackToken)];
                            }
                            _c.label = 6;
                        case 6: throw error_2;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.getThemes = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/themes', token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.getSermons = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/sermons', token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.getDecks = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/decks', token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.getChurchSettings = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/church-settings', token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.syncWorkspace = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/sermons/from-workspace', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateDeck = function (token, sermonId, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides("/sermons/".concat(sermonId, "/decks"), token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.updateChurchSettings = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.slidesClient.request({
                                url: '/church-settings',
                                method: 'patch',
                                data: body,
                                headers: token ? { Authorization: "Bearer ".concat(token) } : undefined,
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, response.data];
                    }
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateImage = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/images/generate', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.listImages = function (token, workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides("/images/list/".concat(workspaceId), token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateAudio = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/audio/generate', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.listAudio = function (token, workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides("/audio/list/".concat(workspaceId), token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateNarrationScript = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/audio/narration-script', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.getVoices = function (token, provider) {
            return __awaiter(this, void 0, void 0, function () {
                var query;
                return __generator(this, function (_a) {
                    query = provider ? "?provider=".concat(encodeURIComponent(provider)) : '';
                    return [2 /*return*/, this.requestSlides("/audio/voices".concat(query), token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.getGenres = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/music/genres', token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateMusic = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/music/generate', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.listMusic = function (token, workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides("/music/list/".concat(workspaceId), token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateVideo = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/video/generate', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.listVideo = function (token, workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides("/video/list/".concat(workspaceId), token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateSocialKit = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/social/generate', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.listSocial = function (token, workspaceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides("/social/list/".concat(workspaceId), token)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.previewSermonSong = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/music/sermon-song/preview', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.proxyToSlides = function (authorization, method, path, query, body) {
            return __awaiter(this, void 0, void 0, function () {
                var request, error_3, status_3, fallbackToken;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            request = function (token) { return __awaiter(_this, void 0, void 0, function () {
                                var response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.slidesClient.request({
                                                url: path,
                                                method: method.toLowerCase(),
                                                params: query,
                                                data: body,
                                                headers: token ? { Authorization: "Bearer ".concat(token) } : undefined,
                                                responseType: 'arraybuffer',
                                            })];
                                        case 1:
                                            response = _a.sent();
                                            return [2 /*return*/, {
                                                    status: response.status,
                                                    headers: {
                                                        'content-type': response.headers['content-type'],
                                                        'content-disposition': response.headers['content-disposition'],
                                                    },
                                                    data: Buffer.from(response.data),
                                                }];
                                    }
                                });
                            }); };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 6]);
                            return [4 /*yield*/, request(authorization)];
                        case 2: return [2 /*return*/, _b.sent()];
                        case 3:
                            error_3 = _b.sent();
                            status_3 = (_a = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _a === void 0 ? void 0 : _a.status;
                            if (!(status_3 === 401)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.getSlidesServiceToken()];
                        case 4:
                            fallbackToken = _b.sent();
                            if (fallbackToken && fallbackToken !== authorization) {
                                return [2 /*return*/, request(fallbackToken)];
                            }
                            _b.label = 5;
                        case 5: throw error_3;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.proxyToSlidesAsService = function (method, path, query, body) {
            return __awaiter(this, void 0, void 0, function () {
                var serviceToken, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSlidesServiceToken()];
                        case 1:
                            serviceToken = _a.sent();
                            return [4 /*yield*/, this.slidesClient.request({
                                    url: path,
                                    method: method.toLowerCase(),
                                    params: query,
                                    data: body,
                                    headers: serviceToken ? { Authorization: "Bearer ".concat(serviceToken) } : undefined,
                                    responseType: 'arraybuffer',
                                })];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, {
                                    status: response.status,
                                    headers: {
                                        'content-type': response.headers['content-type'],
                                        'content-disposition': response.headers['content-disposition'],
                                    },
                                    data: Buffer.from(response.data),
                                }];
                    }
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.getDeckExports = function (deckId, authorization) {
            return __awaiter(this, void 0, void 0, function () {
                var token, serviceToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            token = this.extractToken(authorization);
                            return [4 /*yield*/, this.getSlidesServiceToken()];
                        case 1:
                            serviceToken = _a.sent();
                            return [2 /*return*/, this.requestSlides("/decks/".concat(deckId, "/exports"), token, undefined, serviceToken)];
                    }
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateSermonSong = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/music/sermon-song/generate', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.generateSermonLyrics = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/music/sermon-song/lyrics', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.updateSermonLyricsDraft = function (token, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.requestSlides('/music/sermon-song/lyrics-draft', token, body)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.getSelectedOutline = function (workspace) {
            var _a, _b;
            return ((_a = workspace.outlines) === null || _a === void 0 ? void 0 : _a.find(function (outline) { return outline.isSelected; })) || ((_b = workspace.outlines) === null || _b === void 0 ? void 0 : _b[0]) || null;
        };
        WorkspaceMediaPackService_1.prototype.getSelectedManuscript = function (workspace) {
            var _a;
            return ((_a = workspace.manuscripts) === null || _a === void 0 ? void 0 : _a[0]) || null;
        };
        WorkspaceMediaPackService_1.prototype.getSelectedStudyReport = function (workspace) {
            var _a;
            return ((_a = workspace.studyReports) === null || _a === void 0 ? void 0 : _a[0]) || null;
        };
        WorkspaceMediaPackService_1.prototype.normalizeWorkspacePlanning = function (metadata) {
            var planningSource = metadata && typeof metadata === 'object' && metadata.planning && typeof metadata.planning === 'object'
                ? metadata.planning
                : metadata || {};
            var targetLength = Number(planningSource === null || planningSource === void 0 ? void 0 : planningSource.targetLengthMinutes);
            var planning = {};
            var sermonDate = String((planningSource === null || planningSource === void 0 ? void 0 : planningSource.sermonDate) || '').trim();
            var serviceType = String((planningSource === null || planningSource === void 0 ? void 0 : planningSource.serviceType) || '').trim();
            var appealStyle = String((planningSource === null || planningSource === void 0 ? void 0 : planningSource.appealStyle) || '').trim();
            var ministryMode = String((planningSource === null || planningSource === void 0 ? void 0 : planningSource.ministryMode) || '').trim();
            var bilingualMode = String((planningSource === null || planningSource === void 0 ? void 0 : planningSource.bilingualMode) || '').trim();
            if (sermonDate)
                planning.sermonDate = sermonDate;
            if (Number.isFinite(targetLength) && targetLength > 0)
                planning.targetLengthMinutes = Math.round(targetLength);
            if (serviceType)
                planning.serviceType = serviceType;
            if (appealStyle)
                planning.appealStyle = appealStyle;
            if (ministryMode)
                planning.ministryMode = ministryMode;
            if (bilingualMode)
                planning.bilingualMode = bilingualMode;
            return planning;
        };
        WorkspaceMediaPackService_1.prototype.normalizeSlidesTone = function (value) {
            var text = String(value || '').toLowerCase();
            if (text.includes('urgent') || text.includes('warning') || text.includes('appeal') || text.includes('decision')) {
                return 'urgent';
            }
            if (text.includes('reflect')) {
                return 'reflective';
            }
            if (text.includes('challenge') || text.includes('confront')) {
                return 'challenging';
            }
            if (text.includes('hope') || text.includes('comfort')) {
                return 'hopeful';
            }
            return 'encouraging';
        };
        WorkspaceMediaPackService_1.prototype.normalizeDeckIntent = function (value) {
            var text = String(value || '').toLowerCase().trim();
            if (text === 'social_summary' ||
                text === 'teaching_study' ||
                text === 'youth_message' ||
                text === 'evangelistic_appeal') {
                return text;
            }
            return 'sermon_presentation';
        };
        WorkspaceMediaPackService_1.prototype.deckModeLabel = function (intent) {
            switch (intent) {
                case 'social_summary':
                    return 'Social Promo / Summary Deck';
                case 'teaching_study':
                    return 'Teaching Study Deck';
                case 'youth_message':
                    return 'Youth Message Deck';
                case 'evangelistic_appeal':
                    return 'Evangelistic Appeal Deck';
                default:
                    return 'Sermon Presentation Deck';
            }
        };
        WorkspaceMediaPackService_1.prototype.buildSyncPayload = function (workspace) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            var selectedOutline = this.getSelectedOutline(workspace);
            var selectedManuscript = this.getSelectedManuscript(workspace);
            var selectedStudyReport = this.getSelectedStudyReport(workspace);
            var planning = this.normalizeWorkspacePlanning(workspace.metadata);
            var outlinePoints = Array.isArray((_a = selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.structure) === null || _a === void 0 ? void 0 : _a.points)
                ? selectedOutline.structure.points
                : [];
            var pointNodes = Array.isArray((_b = selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.structure) === null || _b === void 0 ? void 0 : _b.pointNodes)
                ? selectedOutline.structure.pointNodes
                : [];
            var mainPoints = (outlinePoints.length ? outlinePoints : pointNodes)
                .map(function (point) { return String((point === null || point === void 0 ? void 0 : point.title) || (point === null || point === void 0 ? void 0 : point.summary) || (point === null || point === void 0 ? void 0 : point.text) || (point === null || point === void 0 ? void 0 : point.content) || point || '').trim(); })
                .filter(Boolean);
            var notes = [
                String(((_c = selectedManuscript === null || selectedManuscript === void 0 ? void 0 : selectedManuscript.content) === null || _c === void 0 ? void 0 : _c.text) || (selectedManuscript === null || selectedManuscript === void 0 ? void 0 : selectedManuscript.content) || '').trim(),
                String(((_d = selectedStudyReport === null || selectedStudyReport === void 0 ? void 0 : selectedStudyReport.sections) === null || _d === void 0 ? void 0 : _d.summary) || '').trim(),
                String(((_e = selectedStudyReport === null || selectedStudyReport === void 0 ? void 0 : selectedStudyReport.sections) === null || _e === void 0 ? void 0 : _e.interpretiveCenter) || '').trim(),
                String(((_f = selectedStudyReport === null || selectedStudyReport === void 0 ? void 0 : selectedStudyReport.sections) === null || _f === void 0 ? void 0 : _f.mainTension) || '').trim(),
            ].filter(Boolean).join('\n\n');
            return {
                workspaceId: workspace.id,
                title: workspace.title,
                seriesTitle: workspace.seriesTitle || undefined,
                language: workspace.language || 'en',
                mainScriptureRef: workspace.mainPassage,
                bigIdea: workspace.theme || workspace.sermonGoals || ((_g = workspace.sermonCore) === null || _g === void 0 ? void 0 : _g.bigIdea) || workspace.title,
                mainPoints: mainPoints,
                audienceContext: workspace.audienceProfile || undefined,
                tone: this.normalizeSlidesTone(((_h = workspace.sermonCore) === null || _h === void 0 ? void 0 : _h.sermonGoal) || workspace.theme || workspace.sermonGoals || workspace.title),
                notes: notes,
                outline: selectedOutline || undefined,
                manuscript: selectedManuscript || undefined,
                applications: workspace.applications || [],
                questions: workspace.discussionQuestions || [],
                planning: {
                    title: workspace.title,
                    seriesTitle: workspace.seriesTitle || undefined,
                    mainPassage: workspace.mainPassage,
                    additionalPassages: Array.isArray(workspace.additionalPassages) ? workspace.additionalPassages : [],
                    language: workspace.language || 'en',
                    theologicalLens: workspace.theologicalLens || undefined,
                    style: workspace.style || undefined,
                    storyArc: workspace.storyArc || undefined,
                    theme: workspace.theme || undefined,
                    audienceProfile: workspace.audienceProfile || undefined,
                    sermonGoals: workspace.sermonGoals || undefined,
                    sermonDate: planning.sermonDate || undefined,
                    targetLengthMinutes: planning.targetLengthMinutes || undefined,
                    serviceType: planning.serviceType || undefined,
                    appealStyle: planning.appealStyle || undefined,
                    ministryMode: planning.ministryMode || undefined,
                    bilingualMode: planning.bilingualMode || undefined,
                    egwEnabled: workspace.egwEnabled,
                    guardrailMode: ((_j = workspace.metadata) === null || _j === void 0 ? void 0 : _j.guardrailMode) || undefined,
                    guardrailDetected: Boolean((_k = workspace.metadata) === null || _k === void 0 ? void 0 : _k.guardrailDetected),
                },
            };
        };
        WorkspaceMediaPackService_1.prototype.persistManifest = function (workspace, manifest) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    workspace.metadata = __assign(__assign({}, (workspace.metadata || {})), { mediaPack: manifest, exportPack: manifest, activeSermonDeckId: manifest.activeSermonDeckId || null, activeSocialDeckId: manifest.activeSocialDeckId || null, latestDeckByIntent: manifest.latestDeckByIntent || {}, archivedDeckIds: manifest.archivedDeckIds || [], deliverables: __assign(__assign({}, (((_a = workspace.metadata) === null || _a === void 0 ? void 0 : _a.deliverables) || {})), { mediaPack: manifest, export: manifest }) });
                    return [2 /*return*/, this.workspaceRepository.save(workspace)];
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.composeMediaPack = function (workspaceId_1, userId_1, authorization_1) {
            return __awaiter(this, arguments, void 0, function (workspaceId, userId, authorization, dto) {
                var workspace, token, syncPayload, deckIntent, visualStyle, sermon, planning, resolvedDeckSize, deckResult, _a, deckId, resolvedVisualStyle, metadata, previousMediaPack, previousExportPack, latestDeckByIntent, activeSermonDeckId, activeSocialDeckId, exportArtifacts, _i, _b, type, exportEntity, error_4, message, selectedOutline, selectedManuscript, selectedStudyReport, slideCount, warnings, exportPrepared, mergedArtifacts, nextStatus, manifest;
                var _c;
                var _d, _e, _f, _g;
                if (dto === void 0) { dto = {}; }
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0: return [4 /*yield*/, this.workspacesService.findOne(workspaceId, userId)];
                        case 1:
                            workspace = _h.sent();
                            if (!workspace) {
                                throw new common_1.BadRequestException('Workspace not found');
                            }
                            token = this.extractToken(authorization);
                            syncPayload = this.buildSyncPayload(workspace);
                            deckIntent = this.normalizeDeckIntent(dto.deckIntent);
                            visualStyle = this.normalizeVisualStyle(dto.visualStyle);
                            return [4 /*yield*/, this.requestSlides('/sermons/from-workspace', token, syncPayload)];
                        case 2:
                            sermon = _h.sent();
                            planning = this.normalizeWorkspacePlanning(workspace.metadata);
                            resolvedDeckSize = dto.deckSize ||
                                (deckIntent === 'sermon_presentation'
                                    ? (planning.targetLengthMinutes && planning.targetLengthMinutes >= 35 ? 'long' : 'standard')
                                    : 'short');
                            if (!(dto.includeDeck === false)) return [3 /*break*/, 3];
                            _a = null;
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.requestSlides("/sermons/".concat(String(sermon.id || sermon.sermonId), "/decks"), token, {
                                themeId: dto.themeId,
                                deckSize: resolvedDeckSize,
                                deckIntent: deckIntent,
                                backgroundProvider: dto.backgroundProvider || 'local',
                                backgroundPreset: (0, deck_composition_contract_1.resolveDeckBackgroundPreset)(visualStyle, deckIntent, dto.backgroundPreset || null),
                                visualStyle: visualStyle,
                            })];
                        case 4:
                            _a = _h.sent();
                            _h.label = 5;
                        case 5:
                            deckResult = _a;
                            deckId = String((deckResult === null || deckResult === void 0 ? void 0 : deckResult.id) || (deckResult === null || deckResult === void 0 ? void 0 : deckResult.deckId) || '');
                            resolvedVisualStyle = String(((_d = deckResult === null || deckResult === void 0 ? void 0 : deckResult.composition) === null || _d === void 0 ? void 0 : _d.visualStyle) ||
                                ((_e = deckResult === null || deckResult === void 0 ? void 0 : deckResult.manifest) === null || _e === void 0 ? void 0 : _e.visualStyle) ||
                                visualStyle ||
                                'auto');
                            metadata = (workspace.metadata || {});
                            previousMediaPack = (metadata.mediaPack || {});
                            previousExportPack = (metadata.exportPack || {});
                            latestDeckByIntent = __assign(__assign({}, (metadata.latestDeckByIntent || {})), (_c = {}, _c[deckIntent] = deckId || null, _c));
                            activeSermonDeckId = deckIntent === 'sermon_presentation'
                                ? deckId || metadata.activeSermonDeckId || null
                                : metadata.activeSermonDeckId || latestDeckByIntent.sermon_presentation || null;
                            activeSocialDeckId = deckIntent === 'social_summary'
                                ? deckId || metadata.activeSocialDeckId || null
                                : metadata.activeSocialDeckId || latestDeckByIntent.social_summary || null;
                            exportArtifacts = [];
                            _i = 0, _b = dto.exportTypes || [];
                            _h.label = 6;
                        case 6:
                            if (!(_i < _b.length)) return [3 /*break*/, 11];
                            type = _b[_i];
                            _h.label = 7;
                        case 7:
                            _h.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, this.requestSlides("/decks/".concat(deckId, "/exports"), token, { type: type })];
                        case 8:
                            exportEntity = _h.sent();
                            exportArtifacts.push({
                                type: type,
                                label: type === 'pptx' ? 'Slide deck' : 'Slide deck PDF',
                                status: String((exportEntity === null || exportEntity === void 0 ? void 0 : exportEntity.status) || 'ready'),
                                fileUrl: (exportEntity === null || exportEntity === void 0 ? void 0 : exportEntity.fileUrl) || null,
                            });
                            return [3 /*break*/, 10];
                        case 9:
                            error_4 = _h.sent();
                            message = String(((_g = (_f = error_4 === null || error_4 === void 0 ? void 0 : error_4.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) || (error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'Export unavailable');
                            exportArtifacts.push({
                                type: type,
                                label: type === 'pptx' ? 'Slide deck' : 'Slide deck PDF',
                                status: message.toLowerCase().includes('unsupported export type') ? 'unavailable' : 'failed',
                                fileUrl: null,
                            });
                            return [3 /*break*/, 10];
                        case 10:
                            _i++;
                            return [3 /*break*/, 6];
                        case 11:
                            selectedOutline = this.getSelectedOutline(workspace);
                            selectedManuscript = this.getSelectedManuscript(workspace);
                            selectedStudyReport = this.getSelectedStudyReport(workspace);
                            slideCount = Array.isArray(deckResult === null || deckResult === void 0 ? void 0 : deckResult.slides) ? deckResult.slides.length : undefined;
                            warnings = [];
                            if (deckIntent === 'sermon_presentation' && typeof slideCount === 'number' && slideCount > 0 && slideCount < 8) {
                                warnings.push('Deck is shorter than a typical sermon presentation. Add outline points or mark this as a social_summary deck.');
                            }
                            if (deckIntent === 'social_summary' && typeof slideCount === 'number' && slideCount > 5) {
                                warnings.push('Social summary decks should stay short. Trim to 3-5 slides.');
                            }
                            exportPrepared = exportArtifacts.length > 0
                                ? true
                                : Boolean(previousExportPack.exportPrepared || previousExportPack.status === 'ready');
                            mergedArtifacts = exportArtifacts.length > 0
                                ? exportArtifacts
                                : Array.isArray(previousExportPack.artifacts)
                                    ? previousExportPack.artifacts
                                    : [];
                            nextStatus = exportPrepared ? 'ready' : (previousMediaPack.status || 'draft');
                            manifest = {
                                status: nextStatus,
                                generatedAt: new Date().toISOString(),
                                sourceOutlineId: (selectedOutline === null || selectedOutline === void 0 ? void 0 : selectedOutline.id) || null,
                                sourceManuscriptId: (selectedManuscript === null || selectedManuscript === void 0 ? void 0 : selectedManuscript.id) || null,
                                sourceStudyReportId: (selectedStudyReport === null || selectedStudyReport === void 0 ? void 0 : selectedStudyReport.id) || null,
                                deckIntent: deckIntent,
                                visualStyle: resolvedVisualStyle,
                                deckModeLabel: this.deckModeLabel(deckIntent),
                                activeSermonDeckId: activeSermonDeckId,
                                activeSocialDeckId: activeSocialDeckId,
                                latestDeckByIntent: latestDeckByIntent,
                                archivedDeckIds: Array.isArray(metadata.archivedDeckIds) ? metadata.archivedDeckIds.filter(Boolean).map(String) : [],
                                slideCount: slideCount,
                                deckId: deckId || null,
                                sermonId: String((sermon === null || sermon === void 0 ? void 0 : sermon.id) || (sermon === null || sermon === void 0 ? void 0 : sermon.sermonId) || ''),
                                exportPrepared: exportPrepared,
                                warnings: warnings,
                                artifacts: mergedArtifacts,
                            };
                            return [4 /*yield*/, this.persistManifest(workspace, manifest)];
                        case 12:
                            _h.sent();
                            return [2 /*return*/, {
                                    sermon: sermon,
                                    deck: deckResult,
                                    manifest: manifest,
                                    exports: exportArtifacts,
                                }];
                    }
                });
            });
        };
        WorkspaceMediaPackService_1.prototype.normalizeVisualStyle = function (value) {
            var text = String(value || '').trim();
            var allowed = new Set([
                'auto',
                'reverent_worship',
                'warm_pastoral',
                'evangelistic_invitation',
                'hopeful_prophecy',
                'bible_study_clean',
                'youth_modern',
                'spanish_church_warm',
            ]);
            return allowed.has(text) ? text : 'auto';
        };
        return WorkspaceMediaPackService_1;
    }());
    __setFunctionName(_classThis, "WorkspaceMediaPackService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkspaceMediaPackService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkspaceMediaPackService = _classThis;
}();
exports.WorkspaceMediaPackService = WorkspaceMediaPackService;
