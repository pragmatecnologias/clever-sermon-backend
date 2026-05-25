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
exports.UpdateDiscussionQuestionDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateDiscussionQuestionDto = function () {
    var _a;
    var _question_decorators;
    var _question_initializers = [];
    var _question_extraInitializers = [];
    var _orderIndex_decorators;
    var _orderIndex_initializers = [];
    var _orderIndex_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateDiscussionQuestionDto() {
                this.question = __runInitializers(this, _question_initializers, void 0);
                this.orderIndex = (__runInitializers(this, _question_extraInitializers), __runInitializers(this, _orderIndex_initializers, void 0));
                this.category = (__runInitializers(this, _orderIndex_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                __runInitializers(this, _category_extraInitializers);
            }
            return UpdateDiscussionQuestionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _question_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _orderIndex_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _category_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _question_decorators, { kind: "field", name: "question", static: false, private: false, access: { has: function (obj) { return "question" in obj; }, get: function (obj) { return obj.question; }, set: function (obj, value) { obj.question = value; } }, metadata: _metadata }, _question_initializers, _question_extraInitializers);
            __esDecorate(null, null, _orderIndex_decorators, { kind: "field", name: "orderIndex", static: false, private: false, access: { has: function (obj) { return "orderIndex" in obj; }, get: function (obj) { return obj.orderIndex; }, set: function (obj, value) { obj.orderIndex = value; } }, metadata: _metadata }, _orderIndex_initializers, _orderIndex_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateDiscussionQuestionDto = UpdateDiscussionQuestionDto;
