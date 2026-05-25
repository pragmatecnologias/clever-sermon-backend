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
exports.CreateNoteDto = void 0;
var class_validator_1 = require("class-validator");
var CreateNoteDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _verseReferences_decorators;
    var _verseReferences_initializers = [];
    var _verseReferences_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _linkedNoteIds_decorators;
    var _linkedNoteIds_initializers = [];
    var _linkedNoteIds_extraInitializers = [];
    var _workspaceId_decorators;
    var _workspaceId_initializers = [];
    var _workspaceId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateNoteDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.verseReferences = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _verseReferences_initializers, void 0));
                this.tags = (__runInitializers(this, _verseReferences_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.linkedNoteIds = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _linkedNoteIds_initializers, void 0));
                this.workspaceId = (__runInitializers(this, _linkedNoteIds_extraInitializers), __runInitializers(this, _workspaceId_initializers, void 0));
                __runInitializers(this, _workspaceId_extraInitializers);
            }
            return CreateNoteDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _content_decorators = [(0, class_validator_1.IsString)()];
            _verseReferences_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _tags_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _linkedNoteIds_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _workspaceId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _verseReferences_decorators, { kind: "field", name: "verseReferences", static: false, private: false, access: { has: function (obj) { return "verseReferences" in obj; }, get: function (obj) { return obj.verseReferences; }, set: function (obj, value) { obj.verseReferences = value; } }, metadata: _metadata }, _verseReferences_initializers, _verseReferences_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _linkedNoteIds_decorators, { kind: "field", name: "linkedNoteIds", static: false, private: false, access: { has: function (obj) { return "linkedNoteIds" in obj; }, get: function (obj) { return obj.linkedNoteIds; }, set: function (obj, value) { obj.linkedNoteIds = value; } }, metadata: _metadata }, _linkedNoteIds_initializers, _linkedNoteIds_extraInitializers);
            __esDecorate(null, null, _workspaceId_decorators, { kind: "field", name: "workspaceId", static: false, private: false, access: { has: function (obj) { return "workspaceId" in obj; }, get: function (obj) { return obj.workspaceId; }, set: function (obj, value) { obj.workspaceId = value; } }, metadata: _metadata }, _workspaceId_initializers, _workspaceId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateNoteDto = CreateNoteDto;
