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
exports.ChurchSettingsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var fs = require("fs");
var path = require("path");
var crypto_1 = require("crypto");
var CHURCH_LOGOS_DIR = path.join(process.cwd(), 'uploads', 'church-logos');
var ChurchSettingsController = function () {
    var _classDecorators = [(0, common_1.Controller)('church-settings'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMine_decorators;
    var _updateMine_decorators;
    var _uploadLogo_decorators;
    var ChurchSettingsController = _classThis = /** @class */ (function () {
        function ChurchSettingsController_1(churchSettingsService) {
            this.churchSettingsService = (__runInitializers(this, _instanceExtraInitializers), churchSettingsService);
        }
        ChurchSettingsController_1.prototype.getMine = function (req) {
            return this.churchSettingsService.getByUserId(req.user.userId);
        };
        ChurchSettingsController_1.prototype.updateMine = function (req, dto) {
            return this.churchSettingsService.updateByUserId(req.user.userId, dto);
        };
        ChurchSettingsController_1.prototype.uploadLogo = function (req, file) {
            return __awaiter(this, void 0, void 0, function () {
                var relativePath;
                return __generator(this, function (_a) {
                    if (!file) {
                        throw new common_1.BadRequestException('Logo file is required');
                    }
                    relativePath = "/uploads/church-logos/".concat(file.filename);
                    return [2 /*return*/, this.churchSettingsService.updateLogoByUserId(req.user.userId, relativePath)];
                });
            });
        };
        return ChurchSettingsController_1;
    }());
    __setFunctionName(_classThis, "ChurchSettingsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMine_decorators = [(0, common_1.Get)('me')];
        _updateMine_decorators = [(0, common_1.Patch)('me')];
        _uploadLogo_decorators = [(0, common_1.Post)('me/logo'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
                storage: (0, multer_1.diskStorage)({
                    destination: function (_req, _file, cb) {
                        fs.mkdirSync(CHURCH_LOGOS_DIR, { recursive: true });
                        cb(null, CHURCH_LOGOS_DIR);
                    },
                    filename: function (_req, file, cb) {
                        var ext = path.extname(file.originalname || '').toLowerCase() || '.png';
                        cb(null, "".concat((0, crypto_1.randomUUID)()).concat(ext));
                    },
                }),
                limits: { fileSize: 5 * 1024 * 1024 },
                fileFilter: function (_req, file, cb) {
                    var accepted = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
                    if (!accepted.includes(file.mimetype)) {
                        return cb(new common_1.BadRequestException('Invalid logo file type'), false);
                    }
                    cb(null, true);
                },
            }))];
        __esDecorate(_classThis, null, _getMine_decorators, { kind: "method", name: "getMine", static: false, private: false, access: { has: function (obj) { return "getMine" in obj; }, get: function (obj) { return obj.getMine; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMine_decorators, { kind: "method", name: "updateMine", static: false, private: false, access: { has: function (obj) { return "updateMine" in obj; }, get: function (obj) { return obj.updateMine; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadLogo_decorators, { kind: "method", name: "uploadLogo", static: false, private: false, access: { has: function (obj) { return "uploadLogo" in obj; }, get: function (obj) { return obj.uploadLogo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChurchSettingsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChurchSettingsController = _classThis;
}();
exports.ChurchSettingsController = ChurchSettingsController;
