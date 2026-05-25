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
exports.RecordClaimReviewDto = void 0;
var class_validator_1 = require("class-validator");
var RecordClaimReviewDto = function () {
    var _a;
    var _claimId_decorators;
    var _claimId_initializers = [];
    var _claimId_extraInitializers = [];
    var _decision_decorators;
    var _decision_initializers = [];
    var _decision_extraInitializers = [];
    var _note_decorators;
    var _note_initializers = [];
    var _note_extraInitializers = [];
    var _claimText_decorators;
    var _claimText_initializers = [];
    var _claimText_extraInitializers = [];
    var _claimType_decorators;
    var _claimType_initializers = [];
    var _claimType_extraInitializers = [];
    var _supportLevel_decorators;
    var _supportLevel_initializers = [];
    var _supportLevel_extraInitializers = [];
    var _sourceType_decorators;
    var _sourceType_initializers = [];
    var _sourceType_extraInitializers = [];
    var _sourceIds_decorators;
    var _sourceIds_initializers = [];
    var _sourceIds_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RecordClaimReviewDto() {
                this.claimId = __runInitializers(this, _claimId_initializers, void 0);
                this.decision = (__runInitializers(this, _claimId_extraInitializers), __runInitializers(this, _decision_initializers, void 0));
                this.note = (__runInitializers(this, _decision_extraInitializers), __runInitializers(this, _note_initializers, void 0));
                this.claimText = (__runInitializers(this, _note_extraInitializers), __runInitializers(this, _claimText_initializers, void 0));
                this.claimType = (__runInitializers(this, _claimText_extraInitializers), __runInitializers(this, _claimType_initializers, void 0));
                this.supportLevel = (__runInitializers(this, _claimType_extraInitializers), __runInitializers(this, _supportLevel_initializers, void 0));
                this.sourceType = (__runInitializers(this, _supportLevel_extraInitializers), __runInitializers(this, _sourceType_initializers, void 0));
                this.sourceIds = (__runInitializers(this, _sourceType_extraInitializers), __runInitializers(this, _sourceIds_initializers, void 0));
                this.location = (__runInitializers(this, _sourceIds_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                __runInitializers(this, _location_extraInitializers);
            }
            return RecordClaimReviewDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _claimId_decorators = [(0, class_validator_1.IsString)()];
            _decision_decorators = [(0, class_validator_1.IsIn)(['repair', 'acknowledge', 'cite'])];
            _note_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _claimText_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _claimType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _supportLevel_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['supported', 'partially_supported', 'needs_review', 'unsupported'])];
            _sourceType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sourceIds_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _location_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _claimId_decorators, { kind: "field", name: "claimId", static: false, private: false, access: { has: function (obj) { return "claimId" in obj; }, get: function (obj) { return obj.claimId; }, set: function (obj, value) { obj.claimId = value; } }, metadata: _metadata }, _claimId_initializers, _claimId_extraInitializers);
            __esDecorate(null, null, _decision_decorators, { kind: "field", name: "decision", static: false, private: false, access: { has: function (obj) { return "decision" in obj; }, get: function (obj) { return obj.decision; }, set: function (obj, value) { obj.decision = value; } }, metadata: _metadata }, _decision_initializers, _decision_extraInitializers);
            __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: function (obj) { return "note" in obj; }, get: function (obj) { return obj.note; }, set: function (obj, value) { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
            __esDecorate(null, null, _claimText_decorators, { kind: "field", name: "claimText", static: false, private: false, access: { has: function (obj) { return "claimText" in obj; }, get: function (obj) { return obj.claimText; }, set: function (obj, value) { obj.claimText = value; } }, metadata: _metadata }, _claimText_initializers, _claimText_extraInitializers);
            __esDecorate(null, null, _claimType_decorators, { kind: "field", name: "claimType", static: false, private: false, access: { has: function (obj) { return "claimType" in obj; }, get: function (obj) { return obj.claimType; }, set: function (obj, value) { obj.claimType = value; } }, metadata: _metadata }, _claimType_initializers, _claimType_extraInitializers);
            __esDecorate(null, null, _supportLevel_decorators, { kind: "field", name: "supportLevel", static: false, private: false, access: { has: function (obj) { return "supportLevel" in obj; }, get: function (obj) { return obj.supportLevel; }, set: function (obj, value) { obj.supportLevel = value; } }, metadata: _metadata }, _supportLevel_initializers, _supportLevel_extraInitializers);
            __esDecorate(null, null, _sourceType_decorators, { kind: "field", name: "sourceType", static: false, private: false, access: { has: function (obj) { return "sourceType" in obj; }, get: function (obj) { return obj.sourceType; }, set: function (obj, value) { obj.sourceType = value; } }, metadata: _metadata }, _sourceType_initializers, _sourceType_extraInitializers);
            __esDecorate(null, null, _sourceIds_decorators, { kind: "field", name: "sourceIds", static: false, private: false, access: { has: function (obj) { return "sourceIds" in obj; }, get: function (obj) { return obj.sourceIds; }, set: function (obj, value) { obj.sourceIds = value; } }, metadata: _metadata }, _sourceIds_initializers, _sourceIds_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RecordClaimReviewDto = RecordClaimReviewDto;
