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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BibleTranslation = void 0;
var typeorm_1 = require("typeorm");
var highlight_entity_1 = require("./highlight.entity");
var BibleTranslation = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('bible_translations')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _language_decorators;
    var _language_initializers = [];
    var _language_extraInitializers = [];
    var _apiId_decorators;
    var _apiId_initializers = [];
    var _apiId_extraInitializers = [];
    var _isPublicDomain_decorators;
    var _isPublicDomain_initializers = [];
    var _isPublicDomain_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _highlights_decorators;
    var _highlights_initializers = [];
    var _highlights_extraInitializers = [];
    var BibleTranslation = _classThis = /** @class */ (function () {
        function BibleTranslation_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.language = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _language_initializers, void 0));
            this.apiId = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _apiId_initializers, void 0));
            this.isPublicDomain = (__runInitializers(this, _apiId_extraInitializers), __runInitializers(this, _isPublicDomain_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isPublicDomain_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.highlights = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _highlights_initializers, void 0));
            __runInitializers(this, _highlights_extraInitializers);
        }
        return BibleTranslation_1;
    }());
    __setFunctionName(_classThis, "BibleTranslation");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _code_decorators = [(0, typeorm_1.Column)({ type: 'text', unique: true })];
        _name_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _language_decorators = [(0, typeorm_1.Column)({ type: 'text', default: 'en' })];
        _apiId_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _isPublicDomain_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        _highlights_decorators = [(0, typeorm_1.OneToMany)(function () { return highlight_entity_1.Highlight; }, function (highlight) { return highlight.translation; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: function (obj) { return "language" in obj; }, get: function (obj) { return obj.language; }, set: function (obj, value) { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
        __esDecorate(null, null, _apiId_decorators, { kind: "field", name: "apiId", static: false, private: false, access: { has: function (obj) { return "apiId" in obj; }, get: function (obj) { return obj.apiId; }, set: function (obj, value) { obj.apiId = value; } }, metadata: _metadata }, _apiId_initializers, _apiId_extraInitializers);
        __esDecorate(null, null, _isPublicDomain_decorators, { kind: "field", name: "isPublicDomain", static: false, private: false, access: { has: function (obj) { return "isPublicDomain" in obj; }, get: function (obj) { return obj.isPublicDomain; }, set: function (obj, value) { obj.isPublicDomain = value; } }, metadata: _metadata }, _isPublicDomain_initializers, _isPublicDomain_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _highlights_decorators, { kind: "field", name: "highlights", static: false, private: false, access: { has: function (obj) { return "highlights" in obj; }, get: function (obj) { return obj.highlights; }, set: function (obj, value) { obj.highlights = value; } }, metadata: _metadata }, _highlights_initializers, _highlights_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BibleTranslation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BibleTranslation = _classThis;
}();
exports.BibleTranslation = BibleTranslation;
