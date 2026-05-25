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
exports.EGWScriptureReference = void 0;
var typeorm_1 = require("typeorm");
var egw_paragraph_entity_1 = require("./egw-paragraph.entity");
var EGWScriptureReference = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('egw_scripture_references'), (0, typeorm_1.Index)(['book', 'chapter', 'verseStart']), (0, typeorm_1.Index)(['egwParagraphId'])];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _egwParagraphId_decorators;
    var _egwParagraphId_initializers = [];
    var _egwParagraphId_extraInitializers = [];
    var _egwParagraph_decorators;
    var _egwParagraph_initializers = [];
    var _egwParagraph_extraInitializers = [];
    var _book_decorators;
    var _book_initializers = [];
    var _book_extraInitializers = [];
    var _chapter_decorators;
    var _chapter_initializers = [];
    var _chapter_extraInitializers = [];
    var _verseStart_decorators;
    var _verseStart_initializers = [];
    var _verseStart_extraInitializers = [];
    var _verseEnd_decorators;
    var _verseEnd_initializers = [];
    var _verseEnd_extraInitializers = [];
    var _reference_decorators;
    var _reference_initializers = [];
    var _reference_extraInitializers = [];
    var _language_decorators;
    var _language_initializers = [];
    var _language_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var EGWScriptureReference = _classThis = /** @class */ (function () {
        function EGWScriptureReference_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.egwParagraphId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _egwParagraphId_initializers, void 0));
            this.egwParagraph = (__runInitializers(this, _egwParagraphId_extraInitializers), __runInitializers(this, _egwParagraph_initializers, void 0));
            // Bible reference details
            this.book = (__runInitializers(this, _egwParagraph_extraInitializers), __runInitializers(this, _book_initializers, void 0)); // e.g., "John", "Genesis"
            this.chapter = (__runInitializers(this, _book_extraInitializers), __runInitializers(this, _chapter_initializers, void 0));
            this.verseStart = (__runInitializers(this, _chapter_extraInitializers), __runInitializers(this, _verseStart_initializers, void 0));
            this.verseEnd = (__runInitializers(this, _verseStart_extraInitializers), __runInitializers(this, _verseEnd_initializers, void 0));
            this.reference = (__runInitializers(this, _verseEnd_extraInitializers), __runInitializers(this, _reference_initializers, void 0)); // e.g., "John 3:16", "Genesis 1:1-3"
            this.language = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _language_initializers, void 0));
            this.createdAt = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return EGWScriptureReference_1;
    }());
    __setFunctionName(_classThis, "EGWScriptureReference");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _egwParagraphId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' }), (0, typeorm_1.Index)()];
        _egwParagraph_decorators = [(0, typeorm_1.ManyToOne)(function () { return egw_paragraph_entity_1.EGWParagraph; }), (0, typeorm_1.JoinColumn)({ name: 'egwParagraphId' })];
        _book_decorators = [(0, typeorm_1.Column)(), (0, typeorm_1.Index)()];
        _chapter_decorators = [(0, typeorm_1.Column)({ type: 'int' }), (0, typeorm_1.Index)()];
        _verseStart_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true })];
        _verseEnd_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true })];
        _reference_decorators = [(0, typeorm_1.Column)(), (0, typeorm_1.Index)()];
        _language_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 2, default: 'en' }), (0, typeorm_1.Index)()];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _egwParagraphId_decorators, { kind: "field", name: "egwParagraphId", static: false, private: false, access: { has: function (obj) { return "egwParagraphId" in obj; }, get: function (obj) { return obj.egwParagraphId; }, set: function (obj, value) { obj.egwParagraphId = value; } }, metadata: _metadata }, _egwParagraphId_initializers, _egwParagraphId_extraInitializers);
        __esDecorate(null, null, _egwParagraph_decorators, { kind: "field", name: "egwParagraph", static: false, private: false, access: { has: function (obj) { return "egwParagraph" in obj; }, get: function (obj) { return obj.egwParagraph; }, set: function (obj, value) { obj.egwParagraph = value; } }, metadata: _metadata }, _egwParagraph_initializers, _egwParagraph_extraInitializers);
        __esDecorate(null, null, _book_decorators, { kind: "field", name: "book", static: false, private: false, access: { has: function (obj) { return "book" in obj; }, get: function (obj) { return obj.book; }, set: function (obj, value) { obj.book = value; } }, metadata: _metadata }, _book_initializers, _book_extraInitializers);
        __esDecorate(null, null, _chapter_decorators, { kind: "field", name: "chapter", static: false, private: false, access: { has: function (obj) { return "chapter" in obj; }, get: function (obj) { return obj.chapter; }, set: function (obj, value) { obj.chapter = value; } }, metadata: _metadata }, _chapter_initializers, _chapter_extraInitializers);
        __esDecorate(null, null, _verseStart_decorators, { kind: "field", name: "verseStart", static: false, private: false, access: { has: function (obj) { return "verseStart" in obj; }, get: function (obj) { return obj.verseStart; }, set: function (obj, value) { obj.verseStart = value; } }, metadata: _metadata }, _verseStart_initializers, _verseStart_extraInitializers);
        __esDecorate(null, null, _verseEnd_decorators, { kind: "field", name: "verseEnd", static: false, private: false, access: { has: function (obj) { return "verseEnd" in obj; }, get: function (obj) { return obj.verseEnd; }, set: function (obj, value) { obj.verseEnd = value; } }, metadata: _metadata }, _verseEnd_initializers, _verseEnd_extraInitializers);
        __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: function (obj) { return "reference" in obj; }, get: function (obj) { return obj.reference; }, set: function (obj, value) { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
        __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: function (obj) { return "language" in obj; }, get: function (obj) { return obj.language; }, set: function (obj, value) { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWScriptureReference = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWScriptureReference = _classThis;
}();
exports.EGWScriptureReference = EGWScriptureReference;
