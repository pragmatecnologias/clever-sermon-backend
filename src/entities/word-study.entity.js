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
exports.WordStudy = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var WordStudy = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('word_studies')];
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
    var _word_decorators;
    var _word_initializers = [];
    var _word_extraInitializers = [];
    var _lemma_decorators;
    var _lemma_initializers = [];
    var _lemma_extraInitializers = [];
    var _language_decorators;
    var _language_initializers = [];
    var _language_extraInitializers = [];
    var _transliteration_decorators;
    var _transliteration_initializers = [];
    var _transliteration_extraInitializers = [];
    var _definition_decorators;
    var _definition_initializers = [];
    var _definition_extraInitializers = [];
    var _usageCount_decorators;
    var _usageCount_initializers = [];
    var _usageCount_extraInitializers = [];
    var _verseExamples_decorators;
    var _verseExamples_initializers = [];
    var _verseExamples_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var WordStudy = _classThis = /** @class */ (function () {
        function WordStudy_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.user = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.word = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _word_initializers, void 0));
            this.lemma = (__runInitializers(this, _word_extraInitializers), __runInitializers(this, _lemma_initializers, void 0));
            this.language = (__runInitializers(this, _lemma_extraInitializers), __runInitializers(this, _language_initializers, void 0));
            this.transliteration = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _transliteration_initializers, void 0));
            this.definition = (__runInitializers(this, _transliteration_extraInitializers), __runInitializers(this, _definition_initializers, void 0));
            this.usageCount = (__runInitializers(this, _definition_extraInitializers), __runInitializers(this, _usageCount_initializers, void 0));
            this.verseExamples = (__runInitializers(this, _usageCount_extraInitializers), __runInitializers(this, _verseExamples_initializers, void 0));
            this.notes = (__runInitializers(this, _verseExamples_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return WordStudy_1;
    }());
    __setFunctionName(_classThis, "WordStudy");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.wordStudies; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _word_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _lemma_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _language_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _transliteration_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _definition_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _usageCount_decorators = [(0, typeorm_1.Column)({ type: 'integer', nullable: true })];
        _verseExamples_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true, nullable: true })];
        _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _word_decorators, { kind: "field", name: "word", static: false, private: false, access: { has: function (obj) { return "word" in obj; }, get: function (obj) { return obj.word; }, set: function (obj, value) { obj.word = value; } }, metadata: _metadata }, _word_initializers, _word_extraInitializers);
        __esDecorate(null, null, _lemma_decorators, { kind: "field", name: "lemma", static: false, private: false, access: { has: function (obj) { return "lemma" in obj; }, get: function (obj) { return obj.lemma; }, set: function (obj, value) { obj.lemma = value; } }, metadata: _metadata }, _lemma_initializers, _lemma_extraInitializers);
        __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: function (obj) { return "language" in obj; }, get: function (obj) { return obj.language; }, set: function (obj, value) { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
        __esDecorate(null, null, _transliteration_decorators, { kind: "field", name: "transliteration", static: false, private: false, access: { has: function (obj) { return "transliteration" in obj; }, get: function (obj) { return obj.transliteration; }, set: function (obj, value) { obj.transliteration = value; } }, metadata: _metadata }, _transliteration_initializers, _transliteration_extraInitializers);
        __esDecorate(null, null, _definition_decorators, { kind: "field", name: "definition", static: false, private: false, access: { has: function (obj) { return "definition" in obj; }, get: function (obj) { return obj.definition; }, set: function (obj, value) { obj.definition = value; } }, metadata: _metadata }, _definition_initializers, _definition_extraInitializers);
        __esDecorate(null, null, _usageCount_decorators, { kind: "field", name: "usageCount", static: false, private: false, access: { has: function (obj) { return "usageCount" in obj; }, get: function (obj) { return obj.usageCount; }, set: function (obj, value) { obj.usageCount = value; } }, metadata: _metadata }, _usageCount_initializers, _usageCount_extraInitializers);
        __esDecorate(null, null, _verseExamples_decorators, { kind: "field", name: "verseExamples", static: false, private: false, access: { has: function (obj) { return "verseExamples" in obj; }, get: function (obj) { return obj.verseExamples; }, set: function (obj, value) { obj.verseExamples = value; } }, metadata: _metadata }, _verseExamples_initializers, _verseExamples_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WordStudy = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WordStudy = _classThis;
}();
exports.WordStudy = WordStudy;
