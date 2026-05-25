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
exports.BlindSpotAnalysis = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var BlindSpotAnalysis = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('blind_spot_analyses')];
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
    var _themesNotAddressed_decorators;
    var _themesNotAddressed_initializers = [];
    var _themesNotAddressed_extraInitializers = [];
    var _hardVersesAvoided_decorators;
    var _hardVersesAvoided_initializers = [];
    var _hardVersesAvoided_extraInitializers = [];
    var _doctrinalTensionsMinimized_decorators;
    var _doctrinalTensionsMinimized_initializers = [];
    var _doctrinalTensionsMinimized_extraInitializers = [];
    var _applicationImbalance_decorators;
    var _applicationImbalance_initializers = [];
    var _applicationImbalance_extraInitializers = [];
    var _overallAssessment_decorators;
    var _overallAssessment_initializers = [];
    var _overallAssessment_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var BlindSpotAnalysis = _classThis = /** @class */ (function () {
        function BlindSpotAnalysis_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workspaceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
            this.workspace = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _workspace_initializers, void 0));
            this.themesNotAddressed = (__runInitializers(this, _workspace_extraInitializers), __runInitializers(this, _themesNotAddressed_initializers, void 0));
            this.hardVersesAvoided = (__runInitializers(this, _themesNotAddressed_extraInitializers), __runInitializers(this, _hardVersesAvoided_initializers, void 0));
            this.doctrinalTensionsMinimized = (__runInitializers(this, _hardVersesAvoided_extraInitializers), __runInitializers(this, _doctrinalTensionsMinimized_initializers, void 0));
            this.applicationImbalance = (__runInitializers(this, _doctrinalTensionsMinimized_extraInitializers), __runInitializers(this, _applicationImbalance_initializers, void 0));
            this.overallAssessment = (__runInitializers(this, _applicationImbalance_extraInitializers), __runInitializers(this, _overallAssessment_initializers, void 0));
            this.createdAt = (__runInitializers(this, _overallAssessment_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return BlindSpotAnalysis_1;
    }());
    __setFunctionName(_classThis, "BlindSpotAnalysis");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _workspaceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _workspace_decorators = [(0, typeorm_1.ManyToOne)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.blindSpotAnalyses; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'workspaceId' })];
        _themesNotAddressed_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true })];
        _hardVersesAvoided_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true })];
        _doctrinalTensionsMinimized_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _applicationImbalance_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _overallAssessment_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
        __esDecorate(null, null, _workspace_decorators, { kind: "field", name: "workspace", static: false, private: false, access: { has: function (obj) { return "workspace" in obj; }, get: function (obj) { return obj.workspace; }, set: function (obj, value) { obj.workspace = value; } }, metadata: _metadata }, _workspace_initializers, _workspace_extraInitializers);
        __esDecorate(null, null, _themesNotAddressed_decorators, { kind: "field", name: "themesNotAddressed", static: false, private: false, access: { has: function (obj) { return "themesNotAddressed" in obj; }, get: function (obj) { return obj.themesNotAddressed; }, set: function (obj, value) { obj.themesNotAddressed = value; } }, metadata: _metadata }, _themesNotAddressed_initializers, _themesNotAddressed_extraInitializers);
        __esDecorate(null, null, _hardVersesAvoided_decorators, { kind: "field", name: "hardVersesAvoided", static: false, private: false, access: { has: function (obj) { return "hardVersesAvoided" in obj; }, get: function (obj) { return obj.hardVersesAvoided; }, set: function (obj, value) { obj.hardVersesAvoided = value; } }, metadata: _metadata }, _hardVersesAvoided_initializers, _hardVersesAvoided_extraInitializers);
        __esDecorate(null, null, _doctrinalTensionsMinimized_decorators, { kind: "field", name: "doctrinalTensionsMinimized", static: false, private: false, access: { has: function (obj) { return "doctrinalTensionsMinimized" in obj; }, get: function (obj) { return obj.doctrinalTensionsMinimized; }, set: function (obj, value) { obj.doctrinalTensionsMinimized = value; } }, metadata: _metadata }, _doctrinalTensionsMinimized_initializers, _doctrinalTensionsMinimized_extraInitializers);
        __esDecorate(null, null, _applicationImbalance_decorators, { kind: "field", name: "applicationImbalance", static: false, private: false, access: { has: function (obj) { return "applicationImbalance" in obj; }, get: function (obj) { return obj.applicationImbalance; }, set: function (obj, value) { obj.applicationImbalance = value; } }, metadata: _metadata }, _applicationImbalance_initializers, _applicationImbalance_extraInitializers);
        __esDecorate(null, null, _overallAssessment_decorators, { kind: "field", name: "overallAssessment", static: false, private: false, access: { has: function (obj) { return "overallAssessment" in obj; }, get: function (obj) { return obj.overallAssessment; }, set: function (obj, value) { obj.overallAssessment = value; } }, metadata: _metadata }, _overallAssessment_initializers, _overallAssessment_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BlindSpotAnalysis = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BlindSpotAnalysis = _classThis;
}();
exports.BlindSpotAnalysis = BlindSpotAnalysis;
