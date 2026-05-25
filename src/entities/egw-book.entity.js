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
exports.EGWBook = void 0;
var typeorm_1 = require("typeorm");
var EGWBook = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('egw_books')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _language_decorators;
    var _language_initializers = [];
    var _language_extraInitializers = [];
    var _chapterCount_decorators;
    var _chapterCount_initializers = [];
    var _chapterCount_extraInitializers = [];
    var _paragraphCount_decorators;
    var _paragraphCount_initializers = [];
    var _paragraphCount_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var EGWBook = _classThis = /** @class */ (function () {
        function EGWBook_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.code = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _code_initializers, void 0));
            this.title = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.category = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.language = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _language_initializers, void 0));
            this.chapterCount = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _chapterCount_initializers, void 0));
            this.paragraphCount = (__runInitializers(this, _chapterCount_extraInitializers), __runInitializers(this, _paragraphCount_initializers, void 0));
            this.description = (__runInitializers(this, _paragraphCount_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.createdAt = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return EGWBook_1;
    }());
    __setFunctionName(_classThis, "EGWBook");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _code_decorators = [(0, typeorm_1.Column)({ unique: true }), (0, typeorm_1.Index)()];
        _title_decorators = [(0, typeorm_1.Column)()];
        _category_decorators = [(0, typeorm_1.Column)()];
        _language_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 2, default: 'en' }), (0, typeorm_1.Index)()];
        _chapterCount_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _paragraphCount_decorators = [(0, typeorm_1.Column)({ type: 'int', default: 0 })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: function (obj) { return "language" in obj; }, get: function (obj) { return obj.language; }, set: function (obj, value) { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
        __esDecorate(null, null, _chapterCount_decorators, { kind: "field", name: "chapterCount", static: false, private: false, access: { has: function (obj) { return "chapterCount" in obj; }, get: function (obj) { return obj.chapterCount; }, set: function (obj, value) { obj.chapterCount = value; } }, metadata: _metadata }, _chapterCount_initializers, _chapterCount_extraInitializers);
        __esDecorate(null, null, _paragraphCount_decorators, { kind: "field", name: "paragraphCount", static: false, private: false, access: { has: function (obj) { return "paragraphCount" in obj; }, get: function (obj) { return obj.paragraphCount; }, set: function (obj, value) { obj.paragraphCount = value; } }, metadata: _metadata }, _paragraphCount_initializers, _paragraphCount_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWBook = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWBook = _classThis;
}();
exports.EGWBook = EGWBook;
