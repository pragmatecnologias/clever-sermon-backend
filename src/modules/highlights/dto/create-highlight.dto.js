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
exports.CreateHighlightDto = void 0;
var class_validator_1 = require("class-validator");
var CreateHighlightDto = function () {
    var _a;
    var _verseReference_decorators;
    var _verseReference_initializers = [];
    var _verseReference_extraInitializers = [];
    var _translationId_decorators;
    var _translationId_initializers = [];
    var _translationId_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateHighlightDto() {
                this.verseReference = __runInitializers(this, _verseReference_initializers, void 0);
                this.translationId = (__runInitializers(this, _verseReference_extraInitializers), __runInitializers(this, _translationId_initializers, void 0));
                this.color = (__runInitializers(this, _translationId_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.tags = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
            return CreateHighlightDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _verseReference_decorators = [(0, class_validator_1.IsString)()];
            _translationId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _color_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tags_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            __esDecorate(null, null, _verseReference_decorators, { kind: "field", name: "verseReference", static: false, private: false, access: { has: function (obj) { return "verseReference" in obj; }, get: function (obj) { return obj.verseReference; }, set: function (obj, value) { obj.verseReference = value; } }, metadata: _metadata }, _verseReference_initializers, _verseReference_extraInitializers);
            __esDecorate(null, null, _translationId_decorators, { kind: "field", name: "translationId", static: false, private: false, access: { has: function (obj) { return "translationId" in obj; }, get: function (obj) { return obj.translationId; }, set: function (obj, value) { obj.translationId = value; } }, metadata: _metadata }, _translationId_initializers, _translationId_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateHighlightDto = CreateHighlightDto;
