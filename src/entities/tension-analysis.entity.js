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
exports.TensionAnalysis = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var TensionAnalysis = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('tension_analyses')];
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
    var _tensions_decorators;
    var _tensions_initializers = [];
    var _tensions_extraInitializers = [];
    var _sermonTensionHandling_decorators;
    var _sermonTensionHandling_initializers = [];
    var _sermonTensionHandling_extraInitializers = [];
    var _tensionPreservationScore_decorators;
    var _tensionPreservationScore_initializers = [];
    var _tensionPreservationScore_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var TensionAnalysis = _classThis = /** @class */ (function () {
        function TensionAnalysis_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workspaceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
            this.workspace = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _workspace_initializers, void 0));
            this.tensions = (__runInitializers(this, _workspace_extraInitializers), __runInitializers(this, _tensions_initializers, void 0));
            this.sermonTensionHandling = (__runInitializers(this, _tensions_extraInitializers), __runInitializers(this, _sermonTensionHandling_initializers, void 0));
            this.tensionPreservationScore = (__runInitializers(this, _sermonTensionHandling_extraInitializers), __runInitializers(this, _tensionPreservationScore_initializers, void 0));
            this.createdAt = (__runInitializers(this, _tensionPreservationScore_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return TensionAnalysis_1;
    }());
    __setFunctionName(_classThis, "TensionAnalysis");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _workspaceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _workspace_decorators = [(0, typeorm_1.ManyToOne)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.tensionAnalyses; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'workspaceId' })];
        _tensions_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
        _sermonTensionHandling_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _tensionPreservationScore_decorators = [(0, typeorm_1.Column)({ type: 'float' })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
        __esDecorate(null, null, _workspace_decorators, { kind: "field", name: "workspace", static: false, private: false, access: { has: function (obj) { return "workspace" in obj; }, get: function (obj) { return obj.workspace; }, set: function (obj, value) { obj.workspace = value; } }, metadata: _metadata }, _workspace_initializers, _workspace_extraInitializers);
        __esDecorate(null, null, _tensions_decorators, { kind: "field", name: "tensions", static: false, private: false, access: { has: function (obj) { return "tensions" in obj; }, get: function (obj) { return obj.tensions; }, set: function (obj, value) { obj.tensions = value; } }, metadata: _metadata }, _tensions_initializers, _tensions_extraInitializers);
        __esDecorate(null, null, _sermonTensionHandling_decorators, { kind: "field", name: "sermonTensionHandling", static: false, private: false, access: { has: function (obj) { return "sermonTensionHandling" in obj; }, get: function (obj) { return obj.sermonTensionHandling; }, set: function (obj, value) { obj.sermonTensionHandling = value; } }, metadata: _metadata }, _sermonTensionHandling_initializers, _sermonTensionHandling_extraInitializers);
        __esDecorate(null, null, _tensionPreservationScore_decorators, { kind: "field", name: "tensionPreservationScore", static: false, private: false, access: { has: function (obj) { return "tensionPreservationScore" in obj; }, get: function (obj) { return obj.tensionPreservationScore; }, set: function (obj, value) { obj.tensionPreservationScore = value; } }, metadata: _metadata }, _tensionPreservationScore_initializers, _tensionPreservationScore_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TensionAnalysis = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TensionAnalysis = _classThis;
}();
exports.TensionAnalysis = TensionAnalysis;
