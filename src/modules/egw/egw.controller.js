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
exports.EGWController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var EGWController = function () {
    var _classDecorators = [(0, common_1.Controller)('egw'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getAllBooks_decorators;
    var _getBook_decorators;
    var _getBooksByCategory_decorators;
    var _getChapter_decorators;
    var _getParagraph_decorators;
    var _search_decorators;
    var _searchByTopic_decorators;
    var _getRelevantQuotes_decorators;
    var _getSuggestedReading_decorators;
    var _getPassageInsights_decorators;
    var _getSermonSuggestions_decorators;
    var _getInterpretivePerspective_decorators;
    var _getSDASmartBoosts_decorators;
    var _getPassagePanel_decorators;
    var _checkSDASmartBoost_decorators;
    var EGWController = _classThis = /** @class */ (function () {
        function EGWController_1(egwService, egwIntegrationService, egwPassageIntegrationService) {
            this.egwService = (__runInitializers(this, _instanceExtraInitializers), egwService);
            this.egwIntegrationService = egwIntegrationService;
            this.egwPassageIntegrationService = egwPassageIntegrationService;
        }
        EGWController_1.prototype.getAllBooks = function (language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.egwService.getAllBooks(language)];
                });
            });
        };
        EGWController_1.prototype.getBook = function (code) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.egwService.getBookByCode(code)];
                });
            });
        };
        EGWController_1.prototype.getBooksByCategory = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.egwService.getBooksByCategory(category)];
                });
            });
        };
        EGWController_1.prototype.getChapter = function (bookCode, chapterNumber) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.egwService.getChapter(bookCode, parseInt(chapterNumber))];
                });
            });
        };
        EGWController_1.prototype.getParagraph = function (reference) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.egwService.getParagraphByReference(reference)];
                });
            });
        };
        EGWController_1.prototype.search = function (query, limit, language) {
            return __awaiter(this, void 0, void 0, function () {
                var limitNum;
                return __generator(this, function (_a) {
                    limitNum = limit ? parseInt(limit) : 20;
                    return [2 /*return*/, this.egwService.searchContent(query, limitNum, language)];
                });
            });
        };
        EGWController_1.prototype.searchByTopic = function (topic, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var limitNum;
                return __generator(this, function (_a) {
                    limitNum = limit ? parseInt(limit) : 10;
                    return [2 /*return*/, this.egwService.searchByTopic(topic, limitNum)];
                });
            });
        };
        EGWController_1.prototype.getRelevantQuotes = function (scripture, topic, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var limitNum;
                return __generator(this, function (_a) {
                    limitNum = limit ? parseInt(limit) : 5;
                    return [2 /*return*/, this.egwService.getRelevantQuotes(scripture, topic, limitNum)];
                });
            });
        };
        EGWController_1.prototype.getSuggestedReading = function (topic) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.egwService.getSuggestedReading(topic)];
                });
            });
        };
        EGWController_1.prototype.getPassageInsights = function (book, chapter, verseStart, verseEnd, language, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var chapterNum, verseStartNum, verseEndNum, limitNum;
                return __generator(this, function (_a) {
                    chapterNum = parseInt(chapter);
                    verseStartNum = verseStart ? parseInt(verseStart) : undefined;
                    verseEndNum = verseEnd ? parseInt(verseEnd) : undefined;
                    limitNum = limit ? parseInt(limit) : 5;
                    return [2 /*return*/, this.egwService.getInsightsForPassage(book, chapterNum, verseStartNum, verseEndNum, language, limitNum)];
                });
            });
        };
        EGWController_1.prototype.getSermonSuggestions = function (passage, theme, language, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var lang, limitNum;
                return __generator(this, function (_a) {
                    lang = language || 'en';
                    limitNum = limit ? parseInt(limit) : 3;
                    return [2 /*return*/, this.egwIntegrationService.getSermonssuggestions(passage, theme, lang, limitNum)];
                });
            });
        };
        EGWController_1.prototype.getInterpretivePerspective = function (passage, language) {
            return __awaiter(this, void 0, void 0, function () {
                var lang;
                return __generator(this, function (_a) {
                    lang = language || 'en';
                    return [2 /*return*/, this.egwIntegrationService.getInterpretivePerspective(passage, lang)];
                });
            });
        };
        EGWController_1.prototype.getSDASmartBoosts = function (topic, language) {
            return __awaiter(this, void 0, void 0, function () {
                var lang;
                return __generator(this, function (_a) {
                    lang = language || 'en';
                    return [2 /*return*/, this.egwIntegrationService.getSDASmartBoosts(topic, lang)];
                });
            });
        };
        EGWController_1.prototype.getPassagePanel = function (book, chapter, verseStart, verseEnd, language, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var chapterNum, verseStartNum, verseEndNum, lang, limitNum;
                return __generator(this, function (_a) {
                    chapterNum = parseInt(chapter);
                    verseStartNum = verseStart ? parseInt(verseStart) : undefined;
                    verseEndNum = verseEnd ? parseInt(verseEnd) : undefined;
                    lang = language || 'en';
                    limitNum = limit ? parseInt(limit) : 5;
                    return [2 /*return*/, this.egwPassageIntegrationService.getPassageInsights(book, chapterNum, verseStartNum, verseEndNum, lang, limitNum)];
                });
            });
        };
        EGWController_1.prototype.checkSDASmartBoost = function (passage) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.egwPassageIntegrationService.getSDASmartBoost(passage)];
                });
            });
        };
        return EGWController_1;
    }());
    __setFunctionName(_classThis, "EGWController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAllBooks_decorators = [(0, common_1.Get)('books')];
        _getBook_decorators = [(0, common_1.Get)('books/:code')];
        _getBooksByCategory_decorators = [(0, common_1.Get)('books/category/:category')];
        _getChapter_decorators = [(0, common_1.Get)('chapter/:bookCode/:chapterNumber')];
        _getParagraph_decorators = [(0, common_1.Get)('paragraph/:reference')];
        _search_decorators = [(0, common_1.Get)('search')];
        _searchByTopic_decorators = [(0, common_1.Get)('search/topic')];
        _getRelevantQuotes_decorators = [(0, common_1.Get)('quotes')];
        _getSuggestedReading_decorators = [(0, common_1.Get)('suggested-reading')];
        _getPassageInsights_decorators = [(0, common_1.Get)('insights/passage')];
        _getSermonSuggestions_decorators = [(0, common_1.Get)('sermon-suggestions')];
        _getInterpretivePerspective_decorators = [(0, common_1.Get)('interpretive-perspective')];
        _getSDASmartBoosts_decorators = [(0, common_1.Get)('smart-boosts')];
        _getPassagePanel_decorators = [(0, common_1.Get)('passage-panel')];
        _checkSDASmartBoost_decorators = [(0, common_1.Get)('sda-smart-boost-check')];
        __esDecorate(_classThis, null, _getAllBooks_decorators, { kind: "method", name: "getAllBooks", static: false, private: false, access: { has: function (obj) { return "getAllBooks" in obj; }, get: function (obj) { return obj.getAllBooks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBook_decorators, { kind: "method", name: "getBook", static: false, private: false, access: { has: function (obj) { return "getBook" in obj; }, get: function (obj) { return obj.getBook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBooksByCategory_decorators, { kind: "method", name: "getBooksByCategory", static: false, private: false, access: { has: function (obj) { return "getBooksByCategory" in obj; }, get: function (obj) { return obj.getBooksByCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getChapter_decorators, { kind: "method", name: "getChapter", static: false, private: false, access: { has: function (obj) { return "getChapter" in obj; }, get: function (obj) { return obj.getChapter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getParagraph_decorators, { kind: "method", name: "getParagraph", static: false, private: false, access: { has: function (obj) { return "getParagraph" in obj; }, get: function (obj) { return obj.getParagraph; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchByTopic_decorators, { kind: "method", name: "searchByTopic", static: false, private: false, access: { has: function (obj) { return "searchByTopic" in obj; }, get: function (obj) { return obj.searchByTopic; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRelevantQuotes_decorators, { kind: "method", name: "getRelevantQuotes", static: false, private: false, access: { has: function (obj) { return "getRelevantQuotes" in obj; }, get: function (obj) { return obj.getRelevantQuotes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSuggestedReading_decorators, { kind: "method", name: "getSuggestedReading", static: false, private: false, access: { has: function (obj) { return "getSuggestedReading" in obj; }, get: function (obj) { return obj.getSuggestedReading; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPassageInsights_decorators, { kind: "method", name: "getPassageInsights", static: false, private: false, access: { has: function (obj) { return "getPassageInsights" in obj; }, get: function (obj) { return obj.getPassageInsights; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSermonSuggestions_decorators, { kind: "method", name: "getSermonSuggestions", static: false, private: false, access: { has: function (obj) { return "getSermonSuggestions" in obj; }, get: function (obj) { return obj.getSermonSuggestions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInterpretivePerspective_decorators, { kind: "method", name: "getInterpretivePerspective", static: false, private: false, access: { has: function (obj) { return "getInterpretivePerspective" in obj; }, get: function (obj) { return obj.getInterpretivePerspective; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSDASmartBoosts_decorators, { kind: "method", name: "getSDASmartBoosts", static: false, private: false, access: { has: function (obj) { return "getSDASmartBoosts" in obj; }, get: function (obj) { return obj.getSDASmartBoosts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPassagePanel_decorators, { kind: "method", name: "getPassagePanel", static: false, private: false, access: { has: function (obj) { return "getPassagePanel" in obj; }, get: function (obj) { return obj.getPassagePanel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkSDASmartBoost_decorators, { kind: "method", name: "checkSDASmartBoost", static: false, private: false, access: { has: function (obj) { return "checkSDASmartBoost" in obj; }, get: function (obj) { return obj.checkSDASmartBoost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWController = _classThis;
}();
exports.EGWController = EGWController;
