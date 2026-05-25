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
exports.CreateTopicNodeDto = void 0;
var class_validator_1 = require("class-validator");
var CreateTopicNodeDto = function () {
    var _a;
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
    return _a = /** @class */ (function () {
            function CreateTopicNodeDto() {
                this.topic = __runInitializers(this, _topic_initializers, void 0);
                this.description = (__runInitializers(this, _topic_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.relatedVerses = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _relatedVerses_initializers, void 0));
                this.relatedNotes = (__runInitializers(this, _relatedVerses_extraInitializers), __runInitializers(this, _relatedNotes_initializers, void 0));
                this.metadata = (__runInitializers(this, _relatedNotes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
            return CreateTopicNodeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _topic_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _relatedVerses_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _relatedNotes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _metadata_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _topic_decorators, { kind: "field", name: "topic", static: false, private: false, access: { has: function (obj) { return "topic" in obj; }, get: function (obj) { return obj.topic; }, set: function (obj, value) { obj.topic = value; } }, metadata: _metadata }, _topic_initializers, _topic_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _relatedVerses_decorators, { kind: "field", name: "relatedVerses", static: false, private: false, access: { has: function (obj) { return "relatedVerses" in obj; }, get: function (obj) { return obj.relatedVerses; }, set: function (obj, value) { obj.relatedVerses = value; } }, metadata: _metadata }, _relatedVerses_initializers, _relatedVerses_extraInitializers);
            __esDecorate(null, null, _relatedNotes_decorators, { kind: "field", name: "relatedNotes", static: false, private: false, access: { has: function (obj) { return "relatedNotes" in obj; }, get: function (obj) { return obj.relatedNotes; }, set: function (obj, value) { obj.relatedNotes = value; } }, metadata: _metadata }, _relatedNotes_initializers, _relatedNotes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTopicNodeDto = CreateTopicNodeDto;
