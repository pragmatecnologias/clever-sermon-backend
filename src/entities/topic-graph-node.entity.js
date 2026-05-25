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
exports.TopicGraphNode = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var topic_graph_edge_entity_1 = require("./topic-graph-edge.entity");
var TopicGraphNode = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('topic_graph_nodes')];
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
    var _topic_decorators;
    var _topic_initializers = [];
    var _topic_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _relatedVerses_decorators;
    var _relatedVerses_initializers = [];
    var _relatedVerses_extraInitializers = [];
    var _relatedNotes_decorators;
    var _relatedNotes_initializers = [];
    var _relatedNotes_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _outgoingEdges_decorators;
    var _outgoingEdges_initializers = [];
    var _outgoingEdges_extraInitializers = [];
    var _incomingEdges_decorators;
    var _incomingEdges_initializers = [];
    var _incomingEdges_extraInitializers = [];
    var TopicGraphNode = _classThis = /** @class */ (function () {
        function TopicGraphNode_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.user = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.topic = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _topic_initializers, void 0));
            this.description = (__runInitializers(this, _topic_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.relatedVerses = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _relatedVerses_initializers, void 0));
            this.relatedNotes = (__runInitializers(this, _relatedVerses_extraInitializers), __runInitializers(this, _relatedNotes_initializers, void 0));
            this.metadata = (__runInitializers(this, _relatedNotes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.outgoingEdges = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _outgoingEdges_initializers, void 0));
            this.incomingEdges = (__runInitializers(this, _outgoingEdges_extraInitializers), __runInitializers(this, _incomingEdges_initializers, void 0));
            __runInitializers(this, _incomingEdges_extraInitializers);
        }
        return TopicGraphNode_1;
    }());
    __setFunctionName(_classThis, "TopicGraphNode");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.topicNodes; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _topic_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _description_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _relatedVerses_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true, nullable: true })];
        _relatedNotes_decorators = [(0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true })];
        _metadata_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' })];
        _outgoingEdges_decorators = [(0, typeorm_1.OneToMany)(function () { return topic_graph_edge_entity_1.TopicGraphEdge; }, function (edge) { return edge.sourceNode; })];
        _incomingEdges_decorators = [(0, typeorm_1.OneToMany)(function () { return topic_graph_edge_entity_1.TopicGraphEdge; }, function (edge) { return edge.targetNode; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _topic_decorators, { kind: "field", name: "topic", static: false, private: false, access: { has: function (obj) { return "topic" in obj; }, get: function (obj) { return obj.topic; }, set: function (obj, value) { obj.topic = value; } }, metadata: _metadata }, _topic_initializers, _topic_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _relatedVerses_decorators, { kind: "field", name: "relatedVerses", static: false, private: false, access: { has: function (obj) { return "relatedVerses" in obj; }, get: function (obj) { return obj.relatedVerses; }, set: function (obj, value) { obj.relatedVerses = value; } }, metadata: _metadata }, _relatedVerses_initializers, _relatedVerses_extraInitializers);
        __esDecorate(null, null, _relatedNotes_decorators, { kind: "field", name: "relatedNotes", static: false, private: false, access: { has: function (obj) { return "relatedNotes" in obj; }, get: function (obj) { return obj.relatedNotes; }, set: function (obj, value) { obj.relatedNotes = value; } }, metadata: _metadata }, _relatedNotes_initializers, _relatedNotes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _outgoingEdges_decorators, { kind: "field", name: "outgoingEdges", static: false, private: false, access: { has: function (obj) { return "outgoingEdges" in obj; }, get: function (obj) { return obj.outgoingEdges; }, set: function (obj, value) { obj.outgoingEdges = value; } }, metadata: _metadata }, _outgoingEdges_initializers, _outgoingEdges_extraInitializers);
        __esDecorate(null, null, _incomingEdges_decorators, { kind: "field", name: "incomingEdges", static: false, private: false, access: { has: function (obj) { return "incomingEdges" in obj; }, get: function (obj) { return obj.incomingEdges; }, set: function (obj, value) { obj.incomingEdges = value; } }, metadata: _metadata }, _incomingEdges_initializers, _incomingEdges_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TopicGraphNode = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TopicGraphNode = _classThis;
}();
exports.TopicGraphNode = TopicGraphNode;
