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
exports.CreateAiConversationDto = void 0;
var class_validator_1 = require("class-validator");
var ai_conversation_entity_1 = require("../../../entities/ai-conversation.entity");
var CreateAiConversationDto = function () {
    var _a;
    var _workspaceId_decorators;
    var _workspaceId_initializers = [];
    var _workspaceId_extraInitializers = [];
    var _mode_decorators;
    var _mode_initializers = [];
    var _mode_extraInitializers = [];
    var _messages_decorators;
    var _messages_initializers = [];
    var _messages_extraInitializers = [];
    var _context_decorators;
    var _context_initializers = [];
    var _context_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateAiConversationDto() {
                this.workspaceId = __runInitializers(this, _workspaceId_initializers, void 0);
                this.mode = (__runInitializers(this, _workspaceId_extraInitializers), __runInitializers(this, _mode_initializers, void 0));
                this.messages = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _messages_initializers, void 0));
                this.context = (__runInitializers(this, _messages_extraInitializers), __runInitializers(this, _context_initializers, void 0));
                __runInitializers(this, _context_extraInitializers);
            }
            return CreateAiConversationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _workspaceId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _mode_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ai_conversation_entity_1.AiMode)];
            _messages_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _context_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
            __esDecorate(null, null, _mode_decorators, { kind: "field", name: "mode", static: false, private: false, access: { has: function (obj) { return "mode" in obj; }, get: function (obj) { return obj.mode; }, set: function (obj, value) { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(null, null, _messages_decorators, { kind: "field", name: "messages", static: false, private: false, access: { has: function (obj) { return "messages" in obj; }, get: function (obj) { return obj.messages; }, set: function (obj, value) { obj.messages = value; } }, metadata: _metadata }, _messages_initializers, _messages_extraInitializers);
            __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: function (obj) { return "context" in obj; }, get: function (obj) { return obj.context; }, set: function (obj, value) { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateAiConversationDto = CreateAiConversationDto;
