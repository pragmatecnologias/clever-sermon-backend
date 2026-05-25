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
exports.SermonApplication = exports.AudienceType = void 0;
var typeorm_1 = require("typeorm");
var sermon_workspace_entity_1 = require("./sermon-workspace.entity");
var AudienceType;
(function (AudienceType) {
    AudienceType["YOUTH"] = "youth";
    AudienceType["NEW_BELIEVERS"] = "new_believers";
    AudienceType["LEADERSHIP"] = "leadership";
    AudienceType["MIXED_CONGREGATION"] = "mixed_congregation";
    AudienceType["PASTORAL_CARE"] = "pastoral_care";
    AudienceType["SMALL_GROUP"] = "small_group";
})(AudienceType || (exports.AudienceType = AudienceType = {}));
var SermonApplication = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('sermon_applications')];
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
    var _audienceType_decorators;
    var _audienceType_initializers = [];
    var _audienceType_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _contentFormat_decorators;
    var _contentFormat_initializers = [];
    var _contentFormat_extraInitializers = [];
    var _orderIndex_decorators;
    var _orderIndex_initializers = [];
    var _orderIndex_extraInitializers = [];
    var _isSelected_decorators;
    var _isSelected_initializers = [];
    var _isSelected_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var SermonApplication = _classThis = /** @class */ (function () {
        function SermonApplication_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.workspaceId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
            this.workspace = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _workspace_initializers, void 0));
            this.audienceType = (__runInitializers(this, _workspace_extraInitializers), __runInitializers(this, _audienceType_initializers, void 0));
            this.content = (__runInitializers(this, _audienceType_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.contentFormat = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _contentFormat_initializers, void 0));
            this.orderIndex = (__runInitializers(this, _contentFormat_extraInitializers), __runInitializers(this, _orderIndex_initializers, void 0));
            this.isSelected = (__runInitializers(this, _orderIndex_extraInitializers), __runInitializers(this, _isSelected_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isSelected_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return SermonApplication_1;
    }());
    __setFunctionName(_classThis, "SermonApplication");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _workspaceId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _workspace_decorators = [(0, typeorm_1.ManyToOne)(function () { return sermon_workspace_entity_1.SermonWorkspace; }, function (workspace) { return workspace.applications; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'workspaceId' })];
        _audienceType_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: AudienceType })];
        _content_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _contentFormat_decorators = [(0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'markdown' })];
        _orderIndex_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 0 })];
        _isSelected_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: false })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
        __esDecorate(null, null, _workspace_decorators, { kind: "field", name: "workspace", static: false, private: false, access: { has: function (obj) { return "workspace" in obj; }, get: function (obj) { return obj.workspace; }, set: function (obj, value) { obj.workspace = value; } }, metadata: _metadata }, _workspace_initializers, _workspace_extraInitializers);
        __esDecorate(null, null, _audienceType_decorators, { kind: "field", name: "audienceType", static: false, private: false, access: { has: function (obj) { return "audienceType" in obj; }, get: function (obj) { return obj.audienceType; }, set: function (obj, value) { obj.audienceType = value; } }, metadata: _metadata }, _audienceType_initializers, _audienceType_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _contentFormat_decorators, { kind: "field", name: "contentFormat", static: false, private: false, access: { has: function (obj) { return "contentFormat" in obj; }, get: function (obj) { return obj.contentFormat; }, set: function (obj, value) { obj.contentFormat = value; } }, metadata: _metadata }, _contentFormat_initializers, _contentFormat_extraInitializers);
        __esDecorate(null, null, _orderIndex_decorators, { kind: "field", name: "orderIndex", static: false, private: false, access: { has: function (obj) { return "orderIndex" in obj; }, get: function (obj) { return obj.orderIndex; }, set: function (obj, value) { obj.orderIndex = value; } }, metadata: _metadata }, _orderIndex_initializers, _orderIndex_extraInitializers);
        __esDecorate(null, null, _isSelected_decorators, { kind: "field", name: "isSelected", static: false, private: false, access: { has: function (obj) { return "isSelected" in obj; }, get: function (obj) { return obj.isSelected; }, set: function (obj, value) { obj.isSelected = value; } }, metadata: _metadata }, _isSelected_initializers, _isSelected_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SermonApplication = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SermonApplication = _classThis;
}();
exports.SermonApplication = SermonApplication;
