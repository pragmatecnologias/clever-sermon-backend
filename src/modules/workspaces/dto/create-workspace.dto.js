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
exports.CreateWorkspaceDto = void 0;
var class_validator_1 = require("class-validator");
var sermon_workspace_entity_1 = require("../../../entities/sermon-workspace.entity");
var CreateWorkspaceDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _seriesTitle_decorators;
    var _seriesTitle_initializers = [];
    var _seriesTitle_extraInitializers = [];
    var _mainPassage_decorators;
    var _mainPassage_initializers = [];
    var _mainPassage_extraInitializers = [];
    var _additionalPassages_decorators;
    var _additionalPassages_initializers = [];
    var _additionalPassages_extraInitializers = [];
    var _theme_decorators;
    var _theme_initializers = [];
    var _theme_extraInitializers = [];
    var _audienceProfile_decorators;
    var _audienceProfile_initializers = [];
    var _audienceProfile_extraInitializers = [];
    var _sermonGoals_decorators;
    var _sermonGoals_initializers = [];
    var _sermonGoals_extraInitializers = [];
    var _theologicalLens_decorators;
    var _theologicalLens_initializers = [];
    var _theologicalLens_extraInitializers = [];
    var _style_decorators;
    var _style_initializers = [];
    var _style_extraInitializers = [];
    var _storyArc_decorators;
    var _storyArc_initializers = [];
    var _storyArc_extraInitializers = [];
    var _language_decorators;
    var _language_initializers = [];
    var _language_extraInitializers = [];
    var _egwEnabled_decorators;
    var _egwEnabled_initializers = [];
    var _egwEnabled_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateWorkspaceDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.seriesTitle = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _seriesTitle_initializers, void 0));
                this.mainPassage = (__runInitializers(this, _seriesTitle_extraInitializers), __runInitializers(this, _mainPassage_initializers, void 0));
                this.additionalPassages = (__runInitializers(this, _mainPassage_extraInitializers), __runInitializers(this, _additionalPassages_initializers, void 0));
                this.theme = (__runInitializers(this, _additionalPassages_extraInitializers), __runInitializers(this, _theme_initializers, void 0));
                this.audienceProfile = (__runInitializers(this, _theme_extraInitializers), __runInitializers(this, _audienceProfile_initializers, void 0));
                this.sermonGoals = (__runInitializers(this, _audienceProfile_extraInitializers), __runInitializers(this, _sermonGoals_initializers, void 0));
                this.theologicalLens = (__runInitializers(this, _sermonGoals_extraInitializers), __runInitializers(this, _theologicalLens_initializers, void 0));
                this.style = (__runInitializers(this, _theologicalLens_extraInitializers), __runInitializers(this, _style_initializers, void 0));
                this.storyArc = (__runInitializers(this, _style_extraInitializers), __runInitializers(this, _storyArc_initializers, void 0));
                this.language = (__runInitializers(this, _storyArc_extraInitializers), __runInitializers(this, _language_initializers, void 0));
                this.egwEnabled = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _egwEnabled_initializers, void 0));
                this.metadata = (__runInitializers(this, _egwEnabled_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
            return CreateWorkspaceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _seriesTitle_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _mainPassage_decorators = [(0, class_validator_1.IsString)()];
            _additionalPassages_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _theme_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _audienceProfile_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sermonGoals_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _theologicalLens_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _style_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(sermon_workspace_entity_1.SermonStyle)];
            _storyArc_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(sermon_workspace_entity_1.StoryArc)];
            _language_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _egwEnabled_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _metadata_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _seriesTitle_decorators, { kind: "field", name: "seriesTitle", static: false, private: false, access: { has: function (obj) { return "seriesTitle" in obj; }, get: function (obj) { return obj.seriesTitle; }, set: function (obj, value) { obj.seriesTitle = value; } }, metadata: _metadata }, _seriesTitle_initializers, _seriesTitle_extraInitializers);
            __esDecorate(null, null, _mainPassage_decorators, { kind: "field", name: "mainPassage", static: false, private: false, access: { has: function (obj) { return "mainPassage" in obj; }, get: function (obj) { return obj.mainPassage; }, set: function (obj, value) { obj.mainPassage = value; } }, metadata: _metadata }, _mainPassage_initializers, _mainPassage_extraInitializers);
            __esDecorate(null, null, _additionalPassages_decorators, { kind: "field", name: "additionalPassages", static: false, private: false, access: { has: function (obj) { return "additionalPassages" in obj; }, get: function (obj) { return obj.additionalPassages; }, set: function (obj, value) { obj.additionalPassages = value; } }, metadata: _metadata }, _additionalPassages_initializers, _additionalPassages_extraInitializers);
            __esDecorate(null, null, _theme_decorators, { kind: "field", name: "theme", static: false, private: false, access: { has: function (obj) { return "theme" in obj; }, get: function (obj) { return obj.theme; }, set: function (obj, value) { obj.theme = value; } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
            __esDecorate(null, null, _audienceProfile_decorators, { kind: "field", name: "audienceProfile", static: false, private: false, access: { has: function (obj) { return "audienceProfile" in obj; }, get: function (obj) { return obj.audienceProfile; }, set: function (obj, value) { obj.audienceProfile = value; } }, metadata: _metadata }, _audienceProfile_initializers, _audienceProfile_extraInitializers);
            __esDecorate(null, null, _sermonGoals_decorators, { kind: "field", name: "sermonGoals", static: false, private: false, access: { has: function (obj) { return "sermonGoals" in obj; }, get: function (obj) { return obj.sermonGoals; }, set: function (obj, value) { obj.sermonGoals = value; } }, metadata: _metadata }, _sermonGoals_initializers, _sermonGoals_extraInitializers);
            __esDecorate(null, null, _theologicalLens_decorators, { kind: "field", name: "theologicalLens", static: false, private: false, access: { has: function (obj) { return "theologicalLens" in obj; }, get: function (obj) { return obj.theologicalLens; }, set: function (obj, value) { obj.theologicalLens = value; } }, metadata: _metadata }, _theologicalLens_initializers, _theologicalLens_extraInitializers);
            __esDecorate(null, null, _style_decorators, { kind: "field", name: "style", static: false, private: false, access: { has: function (obj) { return "style" in obj; }, get: function (obj) { return obj.style; }, set: function (obj, value) { obj.style = value; } }, metadata: _metadata }, _style_initializers, _style_extraInitializers);
            __esDecorate(null, null, _storyArc_decorators, { kind: "field", name: "storyArc", static: false, private: false, access: { has: function (obj) { return "storyArc" in obj; }, get: function (obj) { return obj.storyArc; }, set: function (obj, value) { obj.storyArc = value; } }, metadata: _metadata }, _storyArc_initializers, _storyArc_extraInitializers);
            __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: function (obj) { return "language" in obj; }, get: function (obj) { return obj.language; }, set: function (obj, value) { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
            __esDecorate(null, null, _egwEnabled_decorators, { kind: "field", name: "egwEnabled", static: false, private: false, access: { has: function (obj) { return "egwEnabled" in obj; }, get: function (obj) { return obj.egwEnabled; }, set: function (obj, value) { obj.egwEnabled = value; } }, metadata: _metadata }, _egwEnabled_initializers, _egwEnabled_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateWorkspaceDto = CreateWorkspaceDto;
