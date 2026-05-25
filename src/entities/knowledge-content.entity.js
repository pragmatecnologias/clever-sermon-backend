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
exports.KnowledgeContent = exports.ContentType = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var ContentType;
(function (ContentType) {
    ContentType["SERMON"] = "sermon";
    ContentType["PDF"] = "pdf";
    ContentType["OUTLINE"] = "outline";
    ContentType["STUDY_NOTE"] = "study_note";
})(ContentType || (exports.ContentType = ContentType = {}));
var KnowledgeContent = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('knowledge_content')];
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
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _contentType_decorators;
    var _contentType_initializers = [];
    var _contentType_extraInitializers = [];
    var _originalFilename_decorators;
    var _originalFilename_initializers = [];
    var _originalFilename_extraInitializers = [];
    var _filePath_decorators;
    var _filePath_initializers = [];
    var _filePath_extraInitializers = [];
    var _extractedText_decorators;
    var _extractedText_initializers = [];
    var _extractedText_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var KnowledgeContent = _classThis = /** @class */ (function () {
        function KnowledgeContent_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.user = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.title = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.contentType = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _contentType_initializers, void 0));
            this.originalFilename = (__runInitializers(this, _contentType_extraInitializers), __runInitializers(this, _originalFilename_initializers, void 0));
            this.filePath = (__runInitializers(this, _originalFilename_extraInitializers), __runInitializers(this, _filePath_initializers, void 0));
            this.extractedText = (__runInitializers(this, _filePath_extraInitializers), __runInitializers(this, _extractedText_initializers, void 0));
            this.metadata = (__runInitializers(this, _extractedText_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return KnowledgeContent_1;
    }());
    __setFunctionName(_classThis, "KnowledgeContent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.knowledgeContent; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _title_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _contentType_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: ContentType })];
        _originalFilename_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _filePath_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _extractedText_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _metadata_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _contentType_decorators, { kind: "field", name: "contentType", static: false, private: false, access: { has: function (obj) { return "contentType" in obj; }, get: function (obj) { return obj.contentType; }, set: function (obj, value) { obj.contentType = value; } }, metadata: _metadata }, _contentType_initializers, _contentType_extraInitializers);
        __esDecorate(null, null, _originalFilename_decorators, { kind: "field", name: "originalFilename", static: false, private: false, access: { has: function (obj) { return "originalFilename" in obj; }, get: function (obj) { return obj.originalFilename; }, set: function (obj, value) { obj.originalFilename = value; } }, metadata: _metadata }, _originalFilename_initializers, _originalFilename_extraInitializers);
        __esDecorate(null, null, _filePath_decorators, { kind: "field", name: "filePath", static: false, private: false, access: { has: function (obj) { return "filePath" in obj; }, get: function (obj) { return obj.filePath; }, set: function (obj, value) { obj.filePath = value; } }, metadata: _metadata }, _filePath_initializers, _filePath_extraInitializers);
        __esDecorate(null, null, _extractedText_decorators, { kind: "field", name: "extractedText", static: false, private: false, access: { has: function (obj) { return "extractedText" in obj; }, get: function (obj) { return obj.extractedText; }, set: function (obj, value) { obj.extractedText = value; } }, metadata: _metadata }, _extractedText_initializers, _extractedText_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KnowledgeContent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KnowledgeContent = _classThis;
}();
exports.KnowledgeContent = KnowledgeContent;
