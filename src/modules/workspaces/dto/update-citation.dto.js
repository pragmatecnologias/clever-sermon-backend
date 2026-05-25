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
exports.UpdateCitationDto = void 0;
var class_validator_1 = require("class-validator");
var sermon_citation_entity_1 = require("../../../entities/sermon-citation.entity");
var UpdateCitationDto = function () {
    var _a;
    var _statementType_decorators;
    var _statementType_initializers = [];
    var _statementType_extraInitializers = [];
    var _statement_decorators;
    var _statement_initializers = [];
    var _statement_extraInitializers = [];
    var _verseReferences_decorators;
    var _verseReferences_initializers = [];
    var _verseReferences_extraInitializers = [];
    var _externalSources_decorators;
    var _externalSources_initializers = [];
    var _externalSources_extraInitializers = [];
    var _isVerified_decorators;
    var _isVerified_initializers = [];
    var _isVerified_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateCitationDto() {
                this.statementType = __runInitializers(this, _statementType_initializers, void 0);
                this.statement = (__runInitializers(this, _statementType_extraInitializers), __runInitializers(this, _statement_initializers, void 0));
                this.verseReferences = (__runInitializers(this, _statement_extraInitializers), __runInitializers(this, _verseReferences_initializers, void 0));
                this.externalSources = (__runInitializers(this, _verseReferences_extraInitializers), __runInitializers(this, _externalSources_initializers, void 0));
                this.isVerified = (__runInitializers(this, _externalSources_extraInitializers), __runInitializers(this, _isVerified_initializers, void 0));
                __runInitializers(this, _isVerified_extraInitializers);
            }
            return UpdateCitationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _statementType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(sermon_citation_entity_1.StatementType)];
            _statement_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _verseReferences_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _externalSources_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _isVerified_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _statementType_decorators, { kind: "field", name: "statementType", static: false, private: false, access: { has: function (obj) { return "statementType" in obj; }, get: function (obj) { return obj.statementType; }, set: function (obj, value) { obj.statementType = value; } }, metadata: _metadata }, _statementType_initializers, _statementType_extraInitializers);
            __esDecorate(null, null, _statement_decorators, { kind: "field", name: "statement", static: false, private: false, access: { has: function (obj) { return "statement" in obj; }, get: function (obj) { return obj.statement; }, set: function (obj, value) { obj.statement = value; } }, metadata: _metadata }, _statement_initializers, _statement_extraInitializers);
            __esDecorate(null, null, _verseReferences_decorators, { kind: "field", name: "verseReferences", static: false, private: false, access: { has: function (obj) { return "verseReferences" in obj; }, get: function (obj) { return obj.verseReferences; }, set: function (obj, value) { obj.verseReferences = value; } }, metadata: _metadata }, _verseReferences_initializers, _verseReferences_extraInitializers);
            __esDecorate(null, null, _externalSources_decorators, { kind: "field", name: "externalSources", static: false, private: false, access: { has: function (obj) { return "externalSources" in obj; }, get: function (obj) { return obj.externalSources; }, set: function (obj, value) { obj.externalSources = value; } }, metadata: _metadata }, _externalSources_initializers, _externalSources_extraInitializers);
            __esDecorate(null, null, _isVerified_decorators, { kind: "field", name: "isVerified", static: false, private: false, access: { has: function (obj) { return "isVerified" in obj; }, get: function (obj) { return obj.isVerified; }, set: function (obj, value) { obj.isVerified = value; } }, metadata: _metadata }, _isVerified_initializers, _isVerified_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateCitationDto = UpdateCitationDto;
