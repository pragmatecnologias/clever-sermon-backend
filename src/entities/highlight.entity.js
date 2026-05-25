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
exports.Highlight = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var bible_translation_entity_1 = require("./bible-translation.entity");
var Highlight = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('highlights')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _verseReference_decorators;
    var _verseReference_initializers = [];
    var _verseReference_extraInitializers = [];
    var _translationId_decorators;
    var _translationId_initializers = [];
    var _translationId_extraInitializers = [];
    var _translation_decorators;
    var _translation_initializers = [];
    var _translation_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var Highlight = _classThis = /** @class */ (function () {
        function Highlight_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.user = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.verseReference = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _verseReference_initializers, void 0));
            this.translationId = (__runInitializers(this, _verseReference_extraInitializers), __runInitializers(this, _translationId_initializers, void 0));
            this.translation = (__runInitializers(this, _translationId_extraInitializers), __runInitializers(this, _translation_initializers, void 0));
            this.color = (__runInitializers(this, _translation_extraInitializers), __runInitializers(this, _color_initializers, void 0));
            this.tags = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return Highlight_1;
    }());
    __setFunctionName(_classThis, "Highlight");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.highlights; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _verseReference_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _translationId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', nullable: true })];
        _translation_decorators = [(0, typeorm_1.ManyToOne)(function () { return bible_translation_entity_1.BibleTranslation; }, function (translation) { return translation.highlights; }, { onDelete: 'SET NULL' }), (0, typeorm_1.JoinColumn)({ name: 'translationId' })];
        _color_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _tags_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true, nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _verseReference_decorators, { kind: "field", name: "verseReference", static: false, private: false, access: { has: function (obj) { return "verseReference" in obj; }, get: function (obj) { return obj.verseReference; }, set: function (obj, value) { obj.verseReference = value; } }, metadata: _metadata }, _verseReference_initializers, _verseReference_extraInitializers);
        __esDecorate(null, null, _translationId_decorators, { kind: "field", name: "translationId", static: false, private: false, access: { has: function (obj) { return "translationId" in obj; }, get: function (obj) { return obj.translationId; }, set: function (obj, value) { obj.translationId = value; } }, metadata: _metadata }, _translationId_initializers, _translationId_extraInitializers);
        __esDecorate(null, null, _translation_decorators, { kind: "field", name: "translation", static: false, private: false, access: { has: function (obj) { return "translation" in obj; }, get: function (obj) { return obj.translation; }, set: function (obj, value) { obj.translation = value; } }, metadata: _metadata }, _translation_initializers, _translation_extraInitializers);
        __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
        __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Highlight = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Highlight = _classThis;
}();
exports.Highlight = Highlight;
