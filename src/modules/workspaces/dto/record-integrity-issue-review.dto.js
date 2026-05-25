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
exports.RecordIntegrityIssueReviewDto = void 0;
var class_validator_1 = require("class-validator");
var RecordIntegrityIssueReviewDto = function () {
    var _a;
    var _issueId_decorators;
    var _issueId_initializers = [];
    var _issueId_extraInitializers = [];
    var _decision_decorators;
    var _decision_initializers = [];
    var _decision_extraInitializers = [];
    var _note_decorators;
    var _note_initializers = [];
    var _note_extraInitializers = [];
    var _issueMessage_decorators;
    var _issueMessage_initializers = [];
    var _issueMessage_extraInitializers = [];
    var _severity_decorators;
    var _severity_initializers = [];
    var _severity_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _affectedItem_decorators;
    var _affectedItem_initializers = [];
    var _affectedItem_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RecordIntegrityIssueReviewDto() {
                this.issueId = __runInitializers(this, _issueId_initializers, void 0);
                this.decision = (__runInitializers(this, _issueId_extraInitializers), __runInitializers(this, _decision_initializers, void 0));
                this.note = (__runInitializers(this, _decision_extraInitializers), __runInitializers(this, _note_initializers, void 0));
                this.issueMessage = (__runInitializers(this, _note_extraInitializers), __runInitializers(this, _issueMessage_initializers, void 0));
                this.severity = (__runInitializers(this, _issueMessage_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.category = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.affectedItem = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _affectedItem_initializers, void 0));
                __runInitializers(this, _affectedItem_extraInitializers);
            }
            return RecordIntegrityIssueReviewDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _issueId_decorators = [(0, class_validator_1.IsString)()];
            _decision_decorators = [(0, class_validator_1.IsIn)(['repair', 'acknowledge', 'cite'])];
            _note_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _issueMessage_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _severity_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _category_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _affectedItem_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _issueId_decorators, { kind: "field", name: "issueId", static: false, private: false, access: { has: function (obj) { return "issueId" in obj; }, get: function (obj) { return obj.issueId; }, set: function (obj, value) { obj.issueId = value; } }, metadata: _metadata }, _issueId_initializers, _issueId_extraInitializers);
            __esDecorate(null, null, _decision_decorators, { kind: "field", name: "decision", static: false, private: false, access: { has: function (obj) { return "decision" in obj; }, get: function (obj) { return obj.decision; }, set: function (obj, value) { obj.decision = value; } }, metadata: _metadata }, _decision_initializers, _decision_extraInitializers);
            __esDecorate(null, null, _note_decorators, { kind: "field", name: "note", static: false, private: false, access: { has: function (obj) { return "note" in obj; }, get: function (obj) { return obj.note; }, set: function (obj, value) { obj.note = value; } }, metadata: _metadata }, _note_initializers, _note_extraInitializers);
            __esDecorate(null, null, _issueMessage_decorators, { kind: "field", name: "issueMessage", static: false, private: false, access: { has: function (obj) { return "issueMessage" in obj; }, get: function (obj) { return obj.issueMessage; }, set: function (obj, value) { obj.issueMessage = value; } }, metadata: _metadata }, _issueMessage_initializers, _issueMessage_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: function (obj) { return "severity" in obj; }, get: function (obj) { return obj.severity; }, set: function (obj, value) { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _affectedItem_decorators, { kind: "field", name: "affectedItem", static: false, private: false, access: { has: function (obj) { return "affectedItem" in obj; }, get: function (obj) { return obj.affectedItem; }, set: function (obj, value) { obj.affectedItem = value; } }, metadata: _metadata }, _affectedItem_initializers, _affectedItem_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RecordIntegrityIssueReviewDto = RecordIntegrityIssueReviewDto;
