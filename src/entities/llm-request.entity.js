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
exports.LlmRequest = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var llm_provider_enum_1 = require("./enums/llm-provider.enum");
var LlmRequest = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('llm_requests')];
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
    var _provider_decorators;
    var _provider_initializers = [];
    var _provider_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _prompt_decorators;
    var _prompt_initializers = [];
    var _prompt_extraInitializers = [];
    var _response_decorators;
    var _response_initializers = [];
    var _response_extraInitializers = [];
    var _tokenCount_decorators;
    var _tokenCount_initializers = [];
    var _tokenCount_extraInitializers = [];
    var _latencyMs_decorators;
    var _latencyMs_initializers = [];
    var _latencyMs_extraInitializers = [];
    var _wasSuccessful_decorators;
    var _wasSuccessful_initializers = [];
    var _wasSuccessful_extraInitializers = [];
    var _error_decorators;
    var _error_initializers = [];
    var _error_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var LlmRequest = _classThis = /** @class */ (function () {
        function LlmRequest_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.user = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.provider = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
            this.model = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _model_initializers, void 0));
            this.prompt = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _prompt_initializers, void 0));
            this.response = (__runInitializers(this, _prompt_extraInitializers), __runInitializers(this, _response_initializers, void 0));
            this.tokenCount = (__runInitializers(this, _response_extraInitializers), __runInitializers(this, _tokenCount_initializers, void 0));
            this.latencyMs = (__runInitializers(this, _tokenCount_extraInitializers), __runInitializers(this, _latencyMs_initializers, void 0));
            this.wasSuccessful = (__runInitializers(this, _latencyMs_extraInitializers), __runInitializers(this, _wasSuccessful_initializers, void 0));
            this.error = (__runInitializers(this, _wasSuccessful_extraInitializers), __runInitializers(this, _error_initializers, void 0));
            this.createdAt = (__runInitializers(this, _error_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return LlmRequest_1;
    }());
    __setFunctionName(_classThis, "LlmRequest");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.llmRequests; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _provider_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: llm_provider_enum_1.LlmProvider })];
        _model_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _prompt_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _response_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _tokenCount_decorators = [(0, typeorm_1.Column)({ type: 'integer', nullable: true })];
        _latencyMs_decorators = [(0, typeorm_1.Column)({ type: 'integer', nullable: true })];
        _wasSuccessful_decorators = [(0, typeorm_1.Column)({ type: 'boolean', default: true })];
        _error_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: function (obj) { return "provider" in obj; }, get: function (obj) { return obj.provider; }, set: function (obj, value) { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
        __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
        __esDecorate(null, null, _prompt_decorators, { kind: "field", name: "prompt", static: false, private: false, access: { has: function (obj) { return "prompt" in obj; }, get: function (obj) { return obj.prompt; }, set: function (obj, value) { obj.prompt = value; } }, metadata: _metadata }, _prompt_initializers, _prompt_extraInitializers);
        __esDecorate(null, null, _response_decorators, { kind: "field", name: "response", static: false, private: false, access: { has: function (obj) { return "response" in obj; }, get: function (obj) { return obj.response; }, set: function (obj, value) { obj.response = value; } }, metadata: _metadata }, _response_initializers, _response_extraInitializers);
        __esDecorate(null, null, _tokenCount_decorators, { kind: "field", name: "tokenCount", static: false, private: false, access: { has: function (obj) { return "tokenCount" in obj; }, get: function (obj) { return obj.tokenCount; }, set: function (obj, value) { obj.tokenCount = value; } }, metadata: _metadata }, _tokenCount_initializers, _tokenCount_extraInitializers);
        __esDecorate(null, null, _latencyMs_decorators, { kind: "field", name: "latencyMs", static: false, private: false, access: { has: function (obj) { return "latencyMs" in obj; }, get: function (obj) { return obj.latencyMs; }, set: function (obj, value) { obj.latencyMs = value; } }, metadata: _metadata }, _latencyMs_initializers, _latencyMs_extraInitializers);
        __esDecorate(null, null, _wasSuccessful_decorators, { kind: "field", name: "wasSuccessful", static: false, private: false, access: { has: function (obj) { return "wasSuccessful" in obj; }, get: function (obj) { return obj.wasSuccessful; }, set: function (obj, value) { obj.wasSuccessful = value; } }, metadata: _metadata }, _wasSuccessful_initializers, _wasSuccessful_extraInitializers);
        __esDecorate(null, null, _error_decorators, { kind: "field", name: "error", static: false, private: false, access: { has: function (obj) { return "error" in obj; }, get: function (obj) { return obj.error; }, set: function (obj, value) { obj.error = value; } }, metadata: _metadata }, _error_initializers, _error_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LlmRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LlmRequest = _classThis;
}();
exports.LlmRequest = LlmRequest;
