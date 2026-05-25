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
exports.SermonOutline = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var sermon_manuscript_entity_1 = require("./sermon-manuscript.entity");
var llm_provider_enum_1 = require("./enums/llm-provider.enum");
var SermonOutline = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('sermon_outlines')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _workspaceId_decorators;
    var _workspaceId_initializers = [];
    var _workspaceId_extraInitializers = [];
    var _workspace_decorators;
    var _workspace_initializers = [];
    var _workspace_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _structure_decorators;
    var _structure_initializers = [];
    var _structure_extraInitializers = [];
    var _contentFormat_decorators;
    var _contentFormat_initializers = [];
    var _contentFormat_extraInitializers = [];
    var _isSelected_decorators;
    var _isSelected_initializers = [];
    var _isSelected_extraInitializers = [];
    var _generatedBy_decorators;
    var _generatedBy_initializers = [];
    var _generatedBy_extraInitializers = [];
    var _generatedModel_decorators;
    var _generatedModel_initializers = [];
    var _generatedModel_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _manuscripts_decorators;
    var _manuscripts_initializers = [];
    var _manuscripts_extraInitializers = [];
    var SermonOutline = _classThis = /** @class */ (function () {
        function SermonOutline_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workspaceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
            this.workspace = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _workspace_initializers, void 0));
            this.title = (__runInitializers(this, _workspace_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.structure = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _structure_initializers, void 0));
            this.contentFormat = (__runInitializers(this, _structure_extraInitializers), __runInitializers(this, _contentFormat_initializers, void 0));
            this.isSelected = (__runInitializers(this, _contentFormat_extraInitializers), __runInitializers(this, _isSelected_initializers, void 0));
            this.generatedBy = (__runInitializers(this, _isSelected_extraInitializers), __runInitializers(this, _generatedBy_initializers, void 0));
            this.generatedModel = (__runInitializers(this, _generatedBy_extraInitializers), __runInitializers(this, _generatedModel_initializers, void 0));
            this.createdAt = (__runInitializers(this, _generatedModel_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.manuscripts = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _manuscripts_initializers, void 0));
            __runInitializers(this, _manuscripts_extraInitializers);
        }
        return SermonOutline_1;
    }());
    __setFunctionName(_classThis, "SermonOutline");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _workspaceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _workspace_decorators = [(0, typeorm_1.ManyToOne)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.outlines; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'workspaceId' })];
        _title_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _structure_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
        _contentFormat_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'markdown' })];
        _isSelected_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _generatedBy_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: llm_provider_enum_1.LlmProvider, nullable: true })];
        _generatedModel_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        _manuscripts_decorators = [(0, typeorm_1.OneToMany)(function () { return sermon_manuscript_entity_1.SermonManuscript; }, function (manuscript) { return manuscript.outline; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
        __esDecorate(null, null, _workspace_decorators, { kind: "field", name: "workspace", static: false, private: false, access: { has: function (obj) { return "workspace" in obj; }, get: function (obj) { return obj.workspace; }, set: function (obj, value) { obj.workspace = value; } }, metadata: _metadata }, _workspace_initializers, _workspace_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _structure_decorators, { kind: "field", name: "structure", static: false, private: false, access: { has: function (obj) { return "structure" in obj; }, get: function (obj) { return obj.structure; }, set: function (obj, value) { obj.structure = value; } }, metadata: _metadata }, _structure_initializers, _structure_extraInitializers);
        __esDecorate(null, null, _contentFormat_decorators, { kind: "field", name: "contentFormat", static: false, private: false, access: { has: function (obj) { return "contentFormat" in obj; }, get: function (obj) { return obj.contentFormat; }, set: function (obj, value) { obj.contentFormat = value; } }, metadata: _metadata }, _contentFormat_initializers, _contentFormat_extraInitializers);
        __esDecorate(null, null, _isSelected_decorators, { kind: "field", name: "isSelected", static: false, private: false, access: { has: function (obj) { return "isSelected" in obj; }, get: function (obj) { return obj.isSelected; }, set: function (obj, value) { obj.isSelected = value; } }, metadata: _metadata }, _isSelected_initializers, _isSelected_extraInitializers);
        __esDecorate(null, null, _generatedBy_decorators, { kind: "field", name: "generatedBy", static: false, private: false, access: { has: function (obj) { return "generatedBy" in obj; }, get: function (obj) { return obj.generatedBy; }, set: function (obj, value) { obj.generatedBy = value; } }, metadata: _metadata }, _generatedBy_initializers, _generatedBy_extraInitializers);
        __esDecorate(null, null, _generatedModel_decorators, { kind: "field", name: "generatedModel", static: false, private: false, access: { has: function (obj) { return "generatedModel" in obj; }, get: function (obj) { return obj.generatedModel; }, set: function (obj, value) { obj.generatedModel = value; } }, metadata: _metadata }, _generatedModel_initializers, _generatedModel_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _manuscripts_decorators, { kind: "field", name: "manuscripts", static: false, private: false, access: { has: function (obj) { return "manuscripts" in obj; }, get: function (obj) { return obj.manuscripts; }, set: function (obj, value) { obj.manuscripts = value; } }, metadata: _metadata }, _manuscripts_initializers, _manuscripts_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SermonOutline = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SermonOutline = _classThis;
}();
exports.SermonOutline = SermonOutline;
