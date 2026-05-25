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
exports.TopicGraphEdge = void 0;
var typeorm_1 = require("typeorm");
var topic_graph_node_entity_1 = require("./topic-graph-node.entity");
var TopicGraphEdge = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('topic_graph_edges')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sourceNodeId_decorators;
    var _sourceNodeId_initializers = [];
    var _sourceNodeId_extraInitializers = [];
    var _sourceNode_decorators;
    var _sourceNode_initializers = [];
    var _sourceNode_extraInitializers = [];
    var _targetNodeId_decorators;
    var _targetNodeId_initializers = [];
    var _targetNodeId_extraInitializers = [];
    var _targetNode_decorators;
    var _targetNode_initializers = [];
    var _targetNode_extraInitializers = [];
    var _relationshipType_decorators;
    var _relationshipType_initializers = [];
    var _relationshipType_extraInitializers = [];
    var _strength_decorators;
    var _strength_initializers = [];
    var _strength_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var TopicGraphEdge = _classThis = /** @class */ (function () {
        function TopicGraphEdge_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sourceNodeId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sourceNodeId_initializers, void 0));
            this.sourceNode = (__runInitializers(this, _sourceNodeId_extraInitializers), __runInitializers(this, _sourceNode_initializers, void 0));
            this.targetNodeId = (__runInitializers(this, _sourceNode_extraInitializers), __runInitializers(this, _targetNodeId_initializers, void 0));
            this.targetNode = (__runInitializers(this, _targetNodeId_extraInitializers), __runInitializers(this, _targetNode_initializers, void 0));
            this.relationshipType = (__runInitializers(this, _targetNode_extraInitializers), __runInitializers(this, _relationshipType_initializers, void 0));
            this.strength = (__runInitializers(this, _relationshipType_extraInitializers), __runInitializers(this, _strength_initializers, void 0));
            this.createdAt = (__runInitializers(this, _strength_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return TopicGraphEdge_1;
    }());
    __setFunctionName(_classThis, "TopicGraphEdge");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _sourceNodeId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _sourceNode_decorators = [(0, typeorm_1.ManyToOne)(function () { return topic_graph_node_entity_1.TopicGraphNode; }, function (node) { return node.outgoingEdges; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'sourceNodeId' })];
        _targetNodeId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _targetNode_decorators = [(0, typeorm_1.ManyToOne)(function () { return topic_graph_node_entity_1.TopicGraphNode; }, function (node) { return node.incomingEdges; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'targetNodeId' })];
        _relationshipType_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _strength_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 5 })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sourceNodeId_decorators, { kind: "field", name: "sourceNodeId", static: false, private: false, access: { has: function (obj) { return "sourceNodeId" in obj; }, get: function (obj) { return obj.sourceNodeId; }, set: function (obj, value) { obj.sourceNodeId = value; } }, metadata: _metadata }, _sourceNodeId_initializers, _sourceNodeId_extraInitializers);
        __esDecorate(null, null, _sourceNode_decorators, { kind: "field", name: "sourceNode", static: false, private: false, access: { has: function (obj) { return "sourceNode" in obj; }, get: function (obj) { return obj.sourceNode; }, set: function (obj, value) { obj.sourceNode = value; } }, metadata: _metadata }, _sourceNode_initializers, _sourceNode_extraInitializers);
        __esDecorate(null, null, _targetNodeId_decorators, { kind: "field", name: "targetNodeId", static: false, private: false, access: { has: function (obj) { return "targetNodeId" in obj; }, get: function (obj) { return obj.targetNodeId; }, set: function (obj, value) { obj.targetNodeId = value; } }, metadata: _metadata }, _targetNodeId_initializers, _targetNodeId_extraInitializers);
        __esDecorate(null, null, _targetNode_decorators, { kind: "field", name: "targetNode", static: false, private: false, access: { has: function (obj) { return "targetNode" in obj; }, get: function (obj) { return obj.targetNode; }, set: function (obj, value) { obj.targetNode = value; } }, metadata: _metadata }, _targetNode_initializers, _targetNode_extraInitializers);
        __esDecorate(null, null, _relationshipType_decorators, { kind: "field", name: "relationshipType", static: false, private: false, access: { has: function (obj) { return "relationshipType" in obj; }, get: function (obj) { return obj.relationshipType; }, set: function (obj, value) { obj.relationshipType = value; } }, metadata: _metadata }, _relationshipType_initializers, _relationshipType_extraInitializers);
        __esDecorate(null, null, _strength_decorators, { kind: "field", name: "strength", static: false, private: false, access: { has: function (obj) { return "strength" in obj; }, get: function (obj) { return obj.strength; }, set: function (obj, value) { obj.strength = value; } }, metadata: _metadata }, _strength_initializers, _strength_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TopicGraphEdge = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TopicGraphEdge = _classThis;
}();
exports.TopicGraphEdge = TopicGraphEdge;
