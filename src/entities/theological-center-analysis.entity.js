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
exports.TheologicalCenterAnalysis = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var TheologicalCenterAnalysis = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('theological_center_analyses')];
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
    var _dominantCenter_decorators;
    var _dominantCenter_initializers = [];
    var _dominantCenter_extraInitializers = [];
    var _textualWarrant_decorators;
    var _textualWarrant_initializers = [];
    var _textualWarrant_extraInitializers = [];
    var _alignmentScore_decorators;
    var _alignmentScore_initializers = [];
    var _alignmentScore_extraInitializers = [];
    var _deviations_decorators;
    var _deviations_initializers = [];
    var _deviations_extraInitializers = [];
    var _secondaryThemes_decorators;
    var _secondaryThemes_initializers = [];
    var _secondaryThemes_extraInitializers = [];
    var _suppressionSuggestions_decorators;
    var _suppressionSuggestions_initializers = [];
    var _suppressionSuggestions_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var TheologicalCenterAnalysis = _classThis = /** @class */ (function () {
        function TheologicalCenterAnalysis_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workspaceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
            this.workspace = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _workspace_initializers, void 0));
            this.dominantCenter = (__runInitializers(this, _workspace_extraInitializers), __runInitializers(this, _dominantCenter_initializers, void 0));
            this.textualWarrant = (__runInitializers(this, _dominantCenter_extraInitializers), __runInitializers(this, _textualWarrant_initializers, void 0));
            this.alignmentScore = (__runInitializers(this, _textualWarrant_extraInitializers), __runInitializers(this, _alignmentScore_initializers, void 0));
            this.deviations = (__runInitializers(this, _alignmentScore_extraInitializers), __runInitializers(this, _deviations_initializers, void 0));
            this.secondaryThemes = (__runInitializers(this, _deviations_extraInitializers), __runInitializers(this, _secondaryThemes_initializers, void 0));
            this.suppressionSuggestions = (__runInitializers(this, _secondaryThemes_extraInitializers), __runInitializers(this, _suppressionSuggestions_initializers, void 0));
            this.createdAt = (__runInitializers(this, _suppressionSuggestions_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return TheologicalCenterAnalysis_1;
    }());
    __setFunctionName(_classThis, "TheologicalCenterAnalysis");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _workspaceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _workspace_decorators = [(0, typeorm_1.ManyToOne)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.theologicalCenterAnalyses; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'workspaceId' })];
        _dominantCenter_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _textualWarrant_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _alignmentScore_decorators = [(0, typeorm_1.Column)({ type: 'float' })];
        _deviations_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _secondaryThemes_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true, nullable: true })];
        _suppressionSuggestions_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
        __esDecorate(null, null, _workspace_decorators, { kind: "field", name: "workspace", static: false, private: false, access: { has: function (obj) { return "workspace" in obj; }, get: function (obj) { return obj.workspace; }, set: function (obj, value) { obj.workspace = value; } }, metadata: _metadata }, _workspace_initializers, _workspace_extraInitializers);
        __esDecorate(null, null, _dominantCenter_decorators, { kind: "field", name: "dominantCenter", static: false, private: false, access: { has: function (obj) { return "dominantCenter" in obj; }, get: function (obj) { return obj.dominantCenter; }, set: function (obj, value) { obj.dominantCenter = value; } }, metadata: _metadata }, _dominantCenter_initializers, _dominantCenter_extraInitializers);
        __esDecorate(null, null, _textualWarrant_decorators, { kind: "field", name: "textualWarrant", static: false, private: false, access: { has: function (obj) { return "textualWarrant" in obj; }, get: function (obj) { return obj.textualWarrant; }, set: function (obj, value) { obj.textualWarrant = value; } }, metadata: _metadata }, _textualWarrant_initializers, _textualWarrant_extraInitializers);
        __esDecorate(null, null, _alignmentScore_decorators, { kind: "field", name: "alignmentScore", static: false, private: false, access: { has: function (obj) { return "alignmentScore" in obj; }, get: function (obj) { return obj.alignmentScore; }, set: function (obj, value) { obj.alignmentScore = value; } }, metadata: _metadata }, _alignmentScore_initializers, _alignmentScore_extraInitializers);
        __esDecorate(null, null, _deviations_decorators, { kind: "field", name: "deviations", static: false, private: false, access: { has: function (obj) { return "deviations" in obj; }, get: function (obj) { return obj.deviations; }, set: function (obj, value) { obj.deviations = value; } }, metadata: _metadata }, _deviations_initializers, _deviations_extraInitializers);
        __esDecorate(null, null, _secondaryThemes_decorators, { kind: "field", name: "secondaryThemes", static: false, private: false, access: { has: function (obj) { return "secondaryThemes" in obj; }, get: function (obj) { return obj.secondaryThemes; }, set: function (obj, value) { obj.secondaryThemes = value; } }, metadata: _metadata }, _secondaryThemes_initializers, _secondaryThemes_extraInitializers);
        __esDecorate(null, null, _suppressionSuggestions_decorators, { kind: "field", name: "suppressionSuggestions", static: false, private: false, access: { has: function (obj) { return "suppressionSuggestions" in obj; }, get: function (obj) { return obj.suppressionSuggestions; }, set: function (obj, value) { obj.suppressionSuggestions = value; } }, metadata: _metadata }, _suppressionSuggestions_initializers, _suppressionSuggestions_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TheologicalCenterAnalysis = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TheologicalCenterAnalysis = _classThis;
}();
exports.TheologicalCenterAnalysis = TheologicalCenterAnalysis;
