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
exports.EGWParagraph = void 0;
var typeorm_1 = require("typeorm");
var EGWParagraph = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('egw_paragraphs'), (0, typeorm_1.Index)(['bookCode', 'chapterNumber', 'paragraphNumber']), (0, typeorm_1.Index)(['reference'])];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _bookCode_decorators;
    var _bookCode_initializers = [];
    var _bookCode_extraInitializers = [];
    var _bookTitle_decorators;
    var _bookTitle_initializers = [];
    var _bookTitle_extraInitializers = [];
    var _language_decorators;
    var _language_initializers = [];
    var _language_extraInitializers = [];
    var _chapterNumber_decorators;
    var _chapterNumber_initializers = [];
    var _chapterNumber_extraInitializers = [];
    var _chapterTitle_decorators;
    var _chapterTitle_initializers = [];
    var _chapterTitle_extraInitializers = [];
    var _paragraphNumber_decorators;
    var _paragraphNumber_initializers = [];
    var _paragraphNumber_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _reference_decorators;
    var _reference_initializers = [];
    var _reference_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var EGWParagraph = _classThis = /** @class */ (function () {
        function EGWParagraph_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.bookCode = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _bookCode_initializers, void 0));
            this.bookTitle = (__runInitializers(this, _bookCode_extraInitializers), __runInitializers(this, _bookTitle_initializers, void 0));
            this.language = (__runInitializers(this, _bookTitle_extraInitializers), __runInitializers(this, _language_initializers, void 0));
            this.chapterNumber = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _chapterNumber_initializers, void 0));
            this.chapterTitle = (__runInitializers(this, _chapterNumber_extraInitializers), __runInitializers(this, _chapterTitle_initializers, void 0));
            this.paragraphNumber = (__runInitializers(this, _chapterTitle_extraInitializers), __runInitializers(this, _paragraphNumber_initializers, void 0));
            this.content = (__runInitializers(this, _paragraphNumber_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.reference = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _reference_initializers, void 0)); // e.g., "DA 123.2"
            this.createdAt = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return EGWParagraph_1;
    }());
    __setFunctionName(_classThis, "EGWParagraph");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _bookCode_decorators = [(0, typeorm_1.Column)(), (0, typeorm_1.Index)()];
        _bookTitle_decorators = [(0, typeorm_1.Column)()];
        _language_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 2, default: 'en' }), (0, typeorm_1.Index)()];
        _chapterNumber_decorators = [(0, typeorm_1.Column)({ type: 'int' })];
        _chapterTitle_decorators = [(0, typeorm_1.Column)()];
        _paragraphNumber_decorators = [(0, typeorm_1.Column)({ type: 'int' })];
        _content_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _reference_decorators = [(0, typeorm_1.Column)({ unique: true }), (0, typeorm_1.Index)()];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _bookCode_decorators, { kind: "field", name: "bookCode", static: false, private: false, access: { has: function (obj) { return "bookCode" in obj; }, get: function (obj) { return obj.bookCode; }, set: function (obj, value) { obj.bookCode = value; } }, metadata: _metadata }, _bookCode_initializers, _bookCode_extraInitializers);
        __esDecorate(null, null, _bookTitle_decorators, { kind: "field", name: "bookTitle", static: false, private: false, access: { has: function (obj) { return "bookTitle" in obj; }, get: function (obj) { return obj.bookTitle; }, set: function (obj, value) { obj.bookTitle = value; } }, metadata: _metadata }, _bookTitle_initializers, _bookTitle_extraInitializers);
        __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: function (obj) { return "language" in obj; }, get: function (obj) { return obj.language; }, set: function (obj, value) { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
        __esDecorate(null, null, _chapterNumber_decorators, { kind: "field", name: "chapterNumber", static: false, private: false, access: { has: function (obj) { return "chapterNumber" in obj; }, get: function (obj) { return obj.chapterNumber; }, set: function (obj, value) { obj.chapterNumber = value; } }, metadata: _metadata }, _chapterNumber_initializers, _chapterNumber_extraInitializers);
        __esDecorate(null, null, _chapterTitle_decorators, { kind: "field", name: "chapterTitle", static: false, private: false, access: { has: function (obj) { return "chapterTitle" in obj; }, get: function (obj) { return obj.chapterTitle; }, set: function (obj, value) { obj.chapterTitle = value; } }, metadata: _metadata }, _chapterTitle_initializers, _chapterTitle_extraInitializers);
        __esDecorate(null, null, _paragraphNumber_decorators, { kind: "field", name: "paragraphNumber", static: false, private: false, access: { has: function (obj) { return "paragraphNumber" in obj; }, get: function (obj) { return obj.paragraphNumber; }, set: function (obj, value) { obj.paragraphNumber = value; } }, metadata: _metadata }, _paragraphNumber_initializers, _paragraphNumber_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: function (obj) { return "reference" in obj; }, get: function (obj) { return obj.reference; }, set: function (obj, value) { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWParagraph = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWParagraph = _classThis;
}();
exports.EGWParagraph = EGWParagraph;
