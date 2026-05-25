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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTopicEdgeDto = void 0;
var class_validator_1 = require("class-validator");
var CreateTopicEdgeDto = function () {
    var _a;
    var _sourceNodeId_decorators;
    var _sourceNodeId_initializers = [];
    var _sourceNodeId_extraInitializers = [];
    var _targetNodeId_decorators;
    var _targetNodeId_initializers = [];
    var _targetNodeId_extraInitializers = [];
    var _relationshipType_decorators;
    var _relationshipType_initializers = [];
    var _relationshipType_extraInitializers = [];
    var _strength_decorators;
    var _strength_initializers = [];
    var _strength_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateTopicEdgeDto() {
                this.sourceNodeId = __runInitializers(this, _sourceNodeId_initializers, void 0);
                this.targetNodeId = (__runInitializers(this, _sourceNodeId_extraInitializers), __runInitializers(this, _targetNodeId_initializers, void 0));
                this.relationshipType = (__runInitializers(this, _targetNodeId_extraInitializers), __runInitializers(this, _relationshipType_initializers, void 0));
                this.strength = (__runInitializers(this, _relationshipType_extraInitializers), __runInitializers(this, _strength_initializers, void 0));
                __runInitializers(this, _strength_extraInitializers);
            }
            return CreateTopicEdgeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sourceNodeId_decorators = [(0, class_validator_1.IsUUID)()];
            _targetNodeId_decorators = [(0, class_validator_1.IsUUID)()];
            _relationshipType_decorators = [(0, class_validator_1.IsString)()];
            _strength_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(10)];
            __esDecorate(null, null, _sourceNodeId_decorators, { kind: "field", name: "sourceNodeId", static: false, private: false, access: { has: function (obj) { return "sourceNodeId" in obj; }, get: function (obj) { return obj.sourceNodeId; }, set: function (obj, value) { obj.sourceNodeId = value; } }, metadata: _metadata }, _sourceNodeId_initializers, _sourceNodeId_extraInitializers);
            __esDecorate(null, null, _targetNodeId_decorators, { kind: "field", name: "targetNodeId", static: false, private: false, access: { has: function (obj) { return "targetNodeId" in obj; }, get: function (obj) { return obj.targetNodeId; }, set: function (obj, value) { obj.targetNodeId = value; } }, metadata: _metadata }, _targetNodeId_initializers, _targetNodeId_extraInitializers);
            __esDecorate(null, null, _relationshipType_decorators, { kind: "field", name: "relationshipType", static: false, private: false, access: { has: function (obj) { return "relationshipType" in obj; }, get: function (obj) { return obj.relationshipType; }, set: function (obj, value) { obj.relationshipType = value; } }, metadata: _metadata }, _relationshipType_initializers, _relationshipType_extraInitializers);
            __esDecorate(null, null, _strength_decorators, { kind: "field", name: "strength", static: false, private: false, access: { has: function (obj) { return "strength" in obj; }, get: function (obj) { return obj.strength; }, set: function (obj, value) { obj.strength = value; } }, metadata: _metadata }, _strength_initializers, _strength_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTopicEdgeDto = CreateTopicEdgeDto;
