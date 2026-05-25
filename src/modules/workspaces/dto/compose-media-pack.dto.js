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
exports.ComposeMediaPackDto = void 0;
var class_validator_1 = require("class-validator");
var ComposeMediaPackDto = function () {
    var _a;
    var _deckSize_decorators;
    var _deckSize_initializers = [];
    var _deckSize_extraInitializers = [];
    var _deckIntent_decorators;
    var _deckIntent_initializers = [];
    var _deckIntent_extraInitializers = [];
    var _backgroundProvider_decorators;
    var _backgroundProvider_initializers = [];
    var _backgroundProvider_extraInitializers = [];
    var _backgroundPreset_decorators;
    var _backgroundPreset_initializers = [];
    var _backgroundPreset_extraInitializers = [];
    var _visualStyle_decorators;
    var _visualStyle_initializers = [];
    var _visualStyle_extraInitializers = [];
    var _exportTypes_decorators;
    var _exportTypes_initializers = [];
    var _exportTypes_extraInitializers = [];
    var _includeDeck_decorators;
    var _includeDeck_initializers = [];
    var _includeDeck_extraInitializers = [];
    var _themeId_decorators;
    var _themeId_initializers = [];
    var _themeId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ComposeMediaPackDto() {
                this.deckSize = __runInitializers(this, _deckSize_initializers, void 0);
                this.deckIntent = (__runInitializers(this, _deckSize_extraInitializers), __runInitializers(this, _deckIntent_initializers, void 0));
                this.backgroundProvider = (__runInitializers(this, _deckIntent_extraInitializers), __runInitializers(this, _backgroundProvider_initializers, void 0));
                this.backgroundPreset = (__runInitializers(this, _backgroundProvider_extraInitializers), __runInitializers(this, _backgroundPreset_initializers, void 0));
                this.visualStyle = (__runInitializers(this, _backgroundPreset_extraInitializers), __runInitializers(this, _visualStyle_initializers, void 0));
                this.exportTypes = (__runInitializers(this, _visualStyle_extraInitializers), __runInitializers(this, _exportTypes_initializers, void 0));
                this.includeDeck = (__runInitializers(this, _exportTypes_extraInitializers), __runInitializers(this, _includeDeck_initializers, void 0));
                this.themeId = (__runInitializers(this, _includeDeck_extraInitializers), __runInitializers(this, _themeId_initializers, void 0));
                __runInitializers(this, _themeId_extraInitializers);
            }
            return ComposeMediaPackDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _deckSize_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _deckIntent_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _backgroundProvider_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _backgroundPreset_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visualStyle_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _exportTypes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsIn)(['pptx', 'pdf'], { each: true })];
            _includeDeck_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _themeId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _deckSize_decorators, { kind: "field", name: "deckSize", static: false, private: false, access: { has: function (obj) { return "deckSize" in obj; }, get: function (obj) { return obj.deckSize; }, set: function (obj, value) { obj.deckSize = value; } }, metadata: _metadata }, _deckSize_initializers, _deckSize_extraInitializers);
            __esDecorate(null, null, _deckIntent_decorators, { kind: "field", name: "deckIntent", static: false, private: false, access: { has: function (obj) { return "deckIntent" in obj; }, get: function (obj) { return obj.deckIntent; }, set: function (obj, value) { obj.deckIntent = value; } }, metadata: _metadata }, _deckIntent_initializers, _deckIntent_extraInitializers);
            __esDecorate(null, null, _backgroundProvider_decorators, { kind: "field", name: "backgroundProvider", static: false, private: false, access: { has: function (obj) { return "backgroundProvider" in obj; }, get: function (obj) { return obj.backgroundProvider; }, set: function (obj, value) { obj.backgroundProvider = value; } }, metadata: _metadata }, _backgroundProvider_initializers, _backgroundProvider_extraInitializers);
            __esDecorate(null, null, _backgroundPreset_decorators, { kind: "field", name: "backgroundPreset", static: false, private: false, access: { has: function (obj) { return "backgroundPreset" in obj; }, get: function (obj) { return obj.backgroundPreset; }, set: function (obj, value) { obj.backgroundPreset = value; } }, metadata: _metadata }, _backgroundPreset_initializers, _backgroundPreset_extraInitializers);
            __esDecorate(null, null, _visualStyle_decorators, { kind: "field", name: "visualStyle", static: false, private: false, access: { has: function (obj) { return "visualStyle" in obj; }, get: function (obj) { return obj.visualStyle; }, set: function (obj, value) { obj.visualStyle = value; } }, metadata: _metadata }, _visualStyle_initializers, _visualStyle_extraInitializers);
            __esDecorate(null, null, _exportTypes_decorators, { kind: "field", name: "exportTypes", static: false, private: false, access: { has: function (obj) { return "exportTypes" in obj; }, get: function (obj) { return obj.exportTypes; }, set: function (obj, value) { obj.exportTypes = value; } }, metadata: _metadata }, _exportTypes_initializers, _exportTypes_extraInitializers);
            __esDecorate(null, null, _includeDeck_decorators, { kind: "field", name: "includeDeck", static: false, private: false, access: { has: function (obj) { return "includeDeck" in obj; }, get: function (obj) { return obj.includeDeck; }, set: function (obj, value) { obj.includeDeck = value; } }, metadata: _metadata }, _includeDeck_initializers, _includeDeck_extraInitializers);
            __esDecorate(null, null, _themeId_decorators, { kind: "field", name: "themeId", static: false, private: false, access: { has: function (obj) { return "themeId" in obj; }, get: function (obj) { return obj.themeId; }, set: function (obj, value) { obj.themeId = value; } }, metadata: _metadata }, _themeId_initializers, _themeId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ComposeMediaPackDto = ComposeMediaPackDto;
