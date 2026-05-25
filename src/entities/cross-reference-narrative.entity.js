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
exports.CrossReferenceNarrative = void 0;
var typeorm_1 = require("typeorm");
var CrossReferenceNarrative = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('cross_reference_narratives')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _sourceVerse_decorators;
    var _sourceVerse_initializers = [];
    var _sourceVerse_extraInitializers = [];
    var _narrativeTitle_decorators;
    var _narrativeTitle_initializers = [];
    var _narrativeTitle_extraInitializers = [];
    var _narrativeDescription_decorators;
    var _narrativeDescription_initializers = [];
    var _narrativeDescription_extraInitializers = [];
    var _chain_decorators;
    var _chain_initializers = [];
    var _chain_extraInitializers = [];
    var _thematicThread_decorators;
    var _thematicThread_initializers = [];
    var _thematicThread_extraInitializers = [];
    var _redemptiveMovement_decorators;
    var _redemptiveMovement_initializers = [];
    var _redemptiveMovement_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var CrossReferenceNarrative = _classThis = /** @class */ (function () {
        function CrossReferenceNarrative_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.sourceVerse = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _sourceVerse_initializers, void 0));
            this.narrativeTitle = (__runInitializers(this, _sourceVerse_extraInitializers), __runInitializers(this, _narrativeTitle_initializers, void 0));
            this.narrativeDescription = (__runInitializers(this, _narrativeTitle_extraInitializers), __runInitializers(this, _narrativeDescription_initializers, void 0));
            this.chain = (__runInitializers(this, _narrativeDescription_extraInitializers), __runInitializers(this, _chain_initializers, void 0));
            this.thematicThread = (__runInitializers(this, _chain_extraInitializers), __runInitializers(this, _thematicThread_initializers, void 0));
            this.redemptiveMovement = (__runInitializers(this, _thematicThread_extraInitializers), __runInitializers(this, _redemptiveMovement_initializers, void 0));
            this.createdAt = (__runInitializers(this, _redemptiveMovement_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
        return CrossReferenceNarrative_1;
    }());
    __setFunctionName(_classThis, "CrossReferenceNarrative");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _sourceVerse_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _narrativeTitle_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _narrativeDescription_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _chain_decorators = [(0, typeorm_1.Column)({ type: 'jsonb' })];
        _thematicThread_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _redemptiveMovement_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _sourceVerse_decorators, { kind: "field", name: "sourceVerse", static: false, private: false, access: { has: function (obj) { return "sourceVerse" in obj; }, get: function (obj) { return obj.sourceVerse; }, set: function (obj, value) { obj.sourceVerse = value; } }, metadata: _metadata }, _sourceVerse_initializers, _sourceVerse_extraInitializers);
        __esDecorate(null, null, _narrativeTitle_decorators, { kind: "field", name: "narrativeTitle", static: false, private: false, access: { has: function (obj) { return "narrativeTitle" in obj; }, get: function (obj) { return obj.narrativeTitle; }, set: function (obj, value) { obj.narrativeTitle = value; } }, metadata: _metadata }, _narrativeTitle_initializers, _narrativeTitle_extraInitializers);
        __esDecorate(null, null, _narrativeDescription_decorators, { kind: "field", name: "narrativeDescription", static: false, private: false, access: { has: function (obj) { return "narrativeDescription" in obj; }, get: function (obj) { return obj.narrativeDescription; }, set: function (obj, value) { obj.narrativeDescription = value; } }, metadata: _metadata }, _narrativeDescription_initializers, _narrativeDescription_extraInitializers);
        __esDecorate(null, null, _chain_decorators, { kind: "field", name: "chain", static: false, private: false, access: { has: function (obj) { return "chain" in obj; }, get: function (obj) { return obj.chain; }, set: function (obj, value) { obj.chain = value; } }, metadata: _metadata }, _chain_initializers, _chain_extraInitializers);
        __esDecorate(null, null, _thematicThread_decorators, { kind: "field", name: "thematicThread", static: false, private: false, access: { has: function (obj) { return "thematicThread" in obj; }, get: function (obj) { return obj.thematicThread; }, set: function (obj, value) { obj.thematicThread = value; } }, metadata: _metadata }, _thematicThread_initializers, _thematicThread_extraInitializers);
        __esDecorate(null, null, _redemptiveMovement_decorators, { kind: "field", name: "redemptiveMovement", static: false, private: false, access: { has: function (obj) { return "redemptiveMovement" in obj; }, get: function (obj) { return obj.redemptiveMovement; }, set: function (obj, value) { obj.redemptiveMovement = value; } }, metadata: _metadata }, _redemptiveMovement_initializers, _redemptiveMovement_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CrossReferenceNarrative = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CrossReferenceNarrative = _classThis;
}();
exports.CrossReferenceNarrative = CrossReferenceNarrative;
