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
exports.SermonCitation = exports.StatementType = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var StatementType;
(function (StatementType) {
    StatementType["OBSERVATION"] = "observation";
    StatementType["INTERPRETATION"] = "interpretation";
    StatementType["APPLICATION"] = "application";
    StatementType["ILLUSTRATION"] = "illustration";
    StatementType["EXTERNAL_REFERENCE"] = "external_reference";
})(StatementType || (exports.StatementType = StatementType = {}));
var SermonCitation = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('sermon_citations')];
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
    var _statementType_decorators;
    var _statementType_initializers = [];
    var _statementType_extraInitializers = [];
    var _statement_decorators;
    var _statement_initializers = [];
    var _statement_extraInitializers = [];
    var _verseReferences_decorators;
    var _verseReferences_initializers = [];
    var _verseReferences_extraInitializers = [];
    var _externalSources_decorators;
    var _externalSources_initializers = [];
    var _externalSources_extraInitializers = [];
    var _isVerified_decorators;
    var _isVerified_initializers = [];
    var _isVerified_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var SermonCitation = _classThis = /** @class */ (function () {
        function SermonCitation_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workspaceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
            this.workspace = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _workspace_initializers, void 0));
            this.statementType = (__runInitializers(this, _workspace_extraInitializers), __runInitializers(this, _statementType_initializers, void 0));
            this.statement = (__runInitializers(this, _statementType_extraInitializers), __runInitializers(this, _statement_initializers, void 0));
            this.verseReferences = (__runInitializers(this, _statement_extraInitializers), __runInitializers(this, _verseReferences_initializers, void 0));
            this.externalSources = (__runInitializers(this, _verseReferences_extraInitializers), __runInitializers(this, _externalSources_initializers, void 0));
            this.isVerified = (__runInitializers(this, _externalSources_extraInitializers), __runInitializers(this, _isVerified_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isVerified_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return SermonCitation_1;
    }());
    __setFunctionName(_classThis, "SermonCitation");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _workspaceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _workspace_decorators = [(0, typeorm_1.ManyToOne)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.citations; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'workspaceId' })];
        _statementType_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: StatementType })];
        _statement_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _verseReferences_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true, nullable: true })];
        _externalSources_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true, nullable: true })];
        _isVerified_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
        __esDecorate(null, null, _workspace_decorators, { kind: "field", name: "workspace", static: false, private: false, access: { has: function (obj) { return "workspace" in obj; }, get: function (obj) { return obj.workspace; }, set: function (obj, value) { obj.workspace = value; } }, metadata: _metadata }, _workspace_initializers, _workspace_extraInitializers);
        __esDecorate(null, null, _statementType_decorators, { kind: "field", name: "statementType", static: false, private: false, access: { has: function (obj) { return "statementType" in obj; }, get: function (obj) { return obj.statementType; }, set: function (obj, value) { obj.statementType = value; } }, metadata: _metadata }, _statementType_initializers, _statementType_extraInitializers);
        __esDecorate(null, null, _statement_decorators, { kind: "field", name: "statement", static: false, private: false, access: { has: function (obj) { return "statement" in obj; }, get: function (obj) { return obj.statement; }, set: function (obj, value) { obj.statement = value; } }, metadata: _metadata }, _statement_initializers, _statement_extraInitializers);
        __esDecorate(null, null, _verseReferences_decorators, { kind: "field", name: "verseReferences", static: false, private: false, access: { has: function (obj) { return "verseReferences" in obj; }, get: function (obj) { return obj.verseReferences; }, set: function (obj, value) { obj.verseReferences = value; } }, metadata: _metadata }, _verseReferences_initializers, _verseReferences_extraInitializers);
        __esDecorate(null, null, _externalSources_decorators, { kind: "field", name: "externalSources", static: false, private: false, access: { has: function (obj) { return "externalSources" in obj; }, get: function (obj) { return obj.externalSources; }, set: function (obj, value) { obj.externalSources = value; } }, metadata: _metadata }, _externalSources_initializers, _externalSources_extraInitializers);
        __esDecorate(null, null, _isVerified_decorators, { kind: "field", name: "isVerified", static: false, private: false, access: { has: function (obj) { return "isVerified" in obj; }, get: function (obj) { return obj.isVerified; }, set: function (obj, value) { obj.isVerified = value; } }, metadata: _metadata }, _isVerified_initializers, _isVerified_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SermonCitation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SermonCitation = _classThis;
}();
exports.SermonCitation = SermonCitation;
