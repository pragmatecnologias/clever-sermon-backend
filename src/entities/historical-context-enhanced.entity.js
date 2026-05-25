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
exports.HistoricalContextEnhanced = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var HistoricalContextEnhanced = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('historical_contexts_enhanced')];
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
    var _passage_decorators;
    var _passage_initializers = [];
    var _passage_extraInitializers = [];
    var _socialRealities_decorators;
    var _socialRealities_initializers = [];
    var _socialRealities_extraInitializers = [];
    var _powerStructures_decorators;
    var _powerStructures_initializers = [];
    var _powerStructures_extraInitializers = [];
    var _economicContext_decorators;
    var _economicContext_initializers = [];
    var _economicContext_extraInitializers = [];
    var _religiousClimate_decorators;
    var _religiousClimate_initializers = [];
    var _religiousClimate_extraInitializers = [];
    var _audiencePressures_decorators;
    var _audiencePressures_initializers = [];
    var _audiencePressures_extraInitializers = [];
    var _synthesisStatement_decorators;
    var _synthesisStatement_initializers = [];
    var _synthesisStatement_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var HistoricalContextEnhanced = _classThis = /** @class */ (function () {
        function HistoricalContextEnhanced_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workspaceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
            this.workspace = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _workspace_initializers, void 0));
            this.passage = (__runInitializers(this, _workspace_extraInitializers), __runInitializers(this, _passage_initializers, void 0));
            this.socialRealities = (__runInitializers(this, _passage_extraInitializers), __runInitializers(this, _socialRealities_initializers, void 0));
            this.powerStructures = (__runInitializers(this, _socialRealities_extraInitializers), __runInitializers(this, _powerStructures_initializers, void 0));
            this.economicContext = (__runInitializers(this, _powerStructures_extraInitializers), __runInitializers(this, _economicContext_initializers, void 0));
            this.religiousClimate = (__runInitializers(this, _economicContext_extraInitializers), __runInitializers(this, _religiousClimate_initializers, void 0));
            this.audiencePressures = (__runInitializers(this, _religiousClimate_extraInitializers), __runInitializers(this, _audiencePressures_initializers, void 0));
            this.synthesisStatement = (__runInitializers(this, _audiencePressures_extraInitializers), __runInitializers(this, _synthesisStatement_initializers, void 0));
            this.createdAt = (__runInitializers(this, _synthesisStatement_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return HistoricalContextEnhanced_1;
    }());
    __setFunctionName(_classThis, "HistoricalContextEnhanced");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _workspaceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _workspace_decorators = [(0, typeorm_1.ManyToOne)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.historicalContexts; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'workspaceId' })];
        _passage_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _socialRealities_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
        _powerStructures_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _economicContext_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _religiousClimate_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _audiencePressures_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _synthesisStatement_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
        __esDecorate(null, null, _workspace_decorators, { kind: "field", name: "workspace", static: false, private: false, access: { has: function (obj) { return "workspace" in obj; }, get: function (obj) { return obj.workspace; }, set: function (obj, value) { obj.workspace = value; } }, metadata: _metadata }, _workspace_initializers, _workspace_extraInitializers);
        __esDecorate(null, null, _passage_decorators, { kind: "field", name: "passage", static: false, private: false, access: { has: function (obj) { return "passage" in obj; }, get: function (obj) { return obj.passage; }, set: function (obj, value) { obj.passage = value; } }, metadata: _metadata }, _passage_initializers, _passage_extraInitializers);
        __esDecorate(null, null, _socialRealities_decorators, { kind: "field", name: "socialRealities", static: false, private: false, access: { has: function (obj) { return "socialRealities" in obj; }, get: function (obj) { return obj.socialRealities; }, set: function (obj, value) { obj.socialRealities = value; } }, metadata: _metadata }, _socialRealities_initializers, _socialRealities_extraInitializers);
        __esDecorate(null, null, _powerStructures_decorators, { kind: "field", name: "powerStructures", static: false, private: false, access: { has: function (obj) { return "powerStructures" in obj; }, get: function (obj) { return obj.powerStructures; }, set: function (obj, value) { obj.powerStructures = value; } }, metadata: _metadata }, _powerStructures_initializers, _powerStructures_extraInitializers);
        __esDecorate(null, null, _economicContext_decorators, { kind: "field", name: "economicContext", static: false, private: false, access: { has: function (obj) { return "economicContext" in obj; }, get: function (obj) { return obj.economicContext; }, set: function (obj, value) { obj.economicContext = value; } }, metadata: _metadata }, _economicContext_initializers, _economicContext_extraInitializers);
        __esDecorate(null, null, _religiousClimate_decorators, { kind: "field", name: "religiousClimate", static: false, private: false, access: { has: function (obj) { return "religiousClimate" in obj; }, get: function (obj) { return obj.religiousClimate; }, set: function (obj, value) { obj.religiousClimate = value; } }, metadata: _metadata }, _religiousClimate_initializers, _religiousClimate_extraInitializers);
        __esDecorate(null, null, _audiencePressures_decorators, { kind: "field", name: "audiencePressures", static: false, private: false, access: { has: function (obj) { return "audiencePressures" in obj; }, get: function (obj) { return obj.audiencePressures; }, set: function (obj, value) { obj.audiencePressures = value; } }, metadata: _metadata }, _audiencePressures_initializers, _audiencePressures_extraInitializers);
        __esDecorate(null, null, _synthesisStatement_decorators, { kind: "field", name: "synthesisStatement", static: false, private: false, access: { has: function (obj) { return "synthesisStatement" in obj; }, get: function (obj) { return obj.synthesisStatement; }, set: function (obj, value) { obj.synthesisStatement = value; } }, metadata: _metadata }, _synthesisStatement_initializers, _synthesisStatement_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HistoricalContextEnhanced = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HistoricalContextEnhanced = _classThis;
}();
exports.HistoricalContextEnhanced = HistoricalContextEnhanced;
