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
exports.PreachingStrategy = exports.EmotionalArc = exports.PreachingGenre = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var PreachingGenre;
(function (PreachingGenre) {
    PreachingGenre["EXPOSITORY"] = "expository";
    PreachingGenre["NARRATIVE"] = "narrative";
    PreachingGenre["PROPHETIC"] = "prophetic";
    PreachingGenre["APOLOGETIC"] = "apologetic";
    PreachingGenre["REVIVALIST"] = "revivalist";
    PreachingGenre["TEACHING"] = "teaching";
    PreachingGenre["PASTORAL"] = "pastoral";
    PreachingGenre["EVANGELISTIC"] = "evangelistic";
})(PreachingGenre || (exports.PreachingGenre = PreachingGenre = {}));
var EmotionalArc;
(function (EmotionalArc) {
    EmotionalArc["CONVICTION_TO_HOPE"] = "conviction_to_hope";
    EmotionalArc["CRISIS_TO_RESOLUTION"] = "crisis_to_resolution";
    EmotionalArc["QUESTION_TO_DISCOVERY"] = "question_to_discovery";
    EmotionalArc["COMFORT_TO_CHALLENGE"] = "comfort_to_challenge";
    EmotionalArc["LAMENT_TO_PRAISE"] = "lament_to_praise";
})(EmotionalArc || (exports.EmotionalArc = EmotionalArc = {}));
var PreachingStrategy = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('preaching_strategies')];
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
    var _recommendedGenre_decorators;
    var _recommendedGenre_initializers = [];
    var _recommendedGenre_extraInitializers = [];
    var _genreRationale_decorators;
    var _genreRationale_initializers = [];
    var _genreRationale_extraInitializers = [];
    var _emotionalArc_decorators;
    var _emotionalArc_initializers = [];
    var _emotionalArc_extraInitializers = [];
    var _tone_decorators;
    var _tone_initializers = [];
    var _tone_extraInitializers = [];
    var _targetLengthMinutes_decorators;
    var _targetLengthMinutes_initializers = [];
    var _targetLengthMinutes_extraInitializers = [];
    var _tensionLevel_decorators;
    var _tensionLevel_initializers = [];
    var _tensionLevel_extraInitializers = [];
    var _applicationDensity_decorators;
    var _applicationDensity_initializers = [];
    var _applicationDensity_extraInitializers = [];
    var _invitationDriven_decorators;
    var _invitationDriven_initializers = [];
    var _invitationDriven_extraInitializers = [];
    var _structuralGuidance_decorators;
    var _structuralGuidance_initializers = [];
    var _structuralGuidance_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var PreachingStrategy = _classThis = /** @class */ (function () {
        function PreachingStrategy_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workspaceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
            this.workspace = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _workspace_initializers, void 0));
            this.recommendedGenre = (__runInitializers(this, _workspace_extraInitializers), __runInitializers(this, _recommendedGenre_initializers, void 0));
            this.genreRationale = (__runInitializers(this, _recommendedGenre_extraInitializers), __runInitializers(this, _genreRationale_initializers, void 0));
            this.emotionalArc = (__runInitializers(this, _genreRationale_extraInitializers), __runInitializers(this, _emotionalArc_initializers, void 0));
            this.tone = (__runInitializers(this, _emotionalArc_extraInitializers), __runInitializers(this, _tone_initializers, void 0));
            this.targetLengthMinutes = (__runInitializers(this, _tone_extraInitializers), __runInitializers(this, _targetLengthMinutes_initializers, void 0));
            this.tensionLevel = (__runInitializers(this, _targetLengthMinutes_extraInitializers), __runInitializers(this, _tensionLevel_initializers, void 0));
            this.applicationDensity = (__runInitializers(this, _tensionLevel_extraInitializers), __runInitializers(this, _applicationDensity_initializers, void 0));
            this.invitationDriven = (__runInitializers(this, _applicationDensity_extraInitializers), __runInitializers(this, _invitationDriven_initializers, void 0));
            this.structuralGuidance = (__runInitializers(this, _invitationDriven_extraInitializers), __runInitializers(this, _structuralGuidance_initializers, void 0));
            this.createdAt = (__runInitializers(this, _structuralGuidance_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return PreachingStrategy_1;
    }());
    __setFunctionName(_classThis, "PreachingStrategy");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _workspaceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _workspace_decorators = [(0, typeorm_1.ManyToOne)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.preachingStrategies; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'workspaceId' })];
        _recommendedGenre_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: PreachingGenre })];
        _genreRationale_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _emotionalArc_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: EmotionalArc })];
        _tone_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 50 })];
        _targetLengthMinutes_decorators = [(0, typeorm_1.Column)({ type: 'integer' })];
        _tensionLevel_decorators = [(0, typeorm_1.Column)({ type: 'float' })];
        _applicationDensity_decorators = [(0, typeorm_1.Column)({ type: 'float' })];
        _invitationDriven_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _structuralGuidance_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
        __esDecorate(null, null, _workspace_decorators, { kind: "field", name: "workspace", static: false, private: false, access: { has: function (obj) { return "workspace" in obj; }, get: function (obj) { return obj.workspace; }, set: function (obj, value) { obj.workspace = value; } }, metadata: _metadata }, _workspace_initializers, _workspace_extraInitializers);
        __esDecorate(null, null, _recommendedGenre_decorators, { kind: "field", name: "recommendedGenre", static: false, private: false, access: { has: function (obj) { return "recommendedGenre" in obj; }, get: function (obj) { return obj.recommendedGenre; }, set: function (obj, value) { obj.recommendedGenre = value; } }, metadata: _metadata }, _recommendedGenre_initializers, _recommendedGenre_extraInitializers);
        __esDecorate(null, null, _genreRationale_decorators, { kind: "field", name: "genreRationale", static: false, private: false, access: { has: function (obj) { return "genreRationale" in obj; }, get: function (obj) { return obj.genreRationale; }, set: function (obj, value) { obj.genreRationale = value; } }, metadata: _metadata }, _genreRationale_initializers, _genreRationale_extraInitializers);
        __esDecorate(null, null, _emotionalArc_decorators, { kind: "field", name: "emotionalArc", static: false, private: false, access: { has: function (obj) { return "emotionalArc" in obj; }, get: function (obj) { return obj.emotionalArc; }, set: function (obj, value) { obj.emotionalArc = value; } }, metadata: _metadata }, _emotionalArc_initializers, _emotionalArc_extraInitializers);
        __esDecorate(null, null, _tone_decorators, { kind: "field", name: "tone", static: false, private: false, access: { has: function (obj) { return "tone" in obj; }, get: function (obj) { return obj.tone; }, set: function (obj, value) { obj.tone = value; } }, metadata: _metadata }, _tone_initializers, _tone_extraInitializers);
        __esDecorate(null, null, _targetLengthMinutes_decorators, { kind: "field", name: "targetLengthMinutes", static: false, private: false, access: { has: function (obj) { return "targetLengthMinutes" in obj; }, get: function (obj) { return obj.targetLengthMinutes; }, set: function (obj, value) { obj.targetLengthMinutes = value; } }, metadata: _metadata }, _targetLengthMinutes_initializers, _targetLengthMinutes_extraInitializers);
        __esDecorate(null, null, _tensionLevel_decorators, { kind: "field", name: "tensionLevel", static: false, private: false, access: { has: function (obj) { return "tensionLevel" in obj; }, get: function (obj) { return obj.tensionLevel; }, set: function (obj, value) { obj.tensionLevel = value; } }, metadata: _metadata }, _tensionLevel_initializers, _tensionLevel_extraInitializers);
        __esDecorate(null, null, _applicationDensity_decorators, { kind: "field", name: "applicationDensity", static: false, private: false, access: { has: function (obj) { return "applicationDensity" in obj; }, get: function (obj) { return obj.applicationDensity; }, set: function (obj, value) { obj.applicationDensity = value; } }, metadata: _metadata }, _applicationDensity_initializers, _applicationDensity_extraInitializers);
        __esDecorate(null, null, _invitationDriven_decorators, { kind: "field", name: "invitationDriven", static: false, private: false, access: { has: function (obj) { return "invitationDriven" in obj; }, get: function (obj) { return obj.invitationDriven; }, set: function (obj, value) { obj.invitationDriven = value; } }, metadata: _metadata }, _invitationDriven_initializers, _invitationDriven_extraInitializers);
        __esDecorate(null, null, _structuralGuidance_decorators, { kind: "field", name: "structuralGuidance", static: false, private: false, access: { has: function (obj) { return "structuralGuidance" in obj; }, get: function (obj) { return obj.structuralGuidance; }, set: function (obj, value) { obj.structuralGuidance = value; } }, metadata: _metadata }, _structuralGuidance_initializers, _structuralGuidance_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PreachingStrategy = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PreachingStrategy = _classThis;
}();
exports.PreachingStrategy = PreachingStrategy;
