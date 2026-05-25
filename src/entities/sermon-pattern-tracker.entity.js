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
exports.SermonPatternTracker = void 0;
var typeorm_1 = require("typeorm");
var SermonPatternTracker = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('sermon_pattern_trackers')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _totalSermons_decorators;
    var _totalSermons_initializers = [];
    var _totalSermons_extraInitializers = [];
    var _styleFrequency_decorators;
    var _styleFrequency_initializers = [];
    var _styleFrequency_extraInitializers = [];
    var _themeFrequency_decorators;
    var _themeFrequency_initializers = [];
    var _themeFrequency_extraInitializers = [];
    var _applicationCategoryBalance_decorators;
    var _applicationCategoryBalance_initializers = [];
    var _applicationCategoryBalance_extraInitializers = [];
    var _avgChristCentrality_decorators;
    var _avgChristCentrality_initializers = [];
    var _avgChristCentrality_extraInitializers = [];
    var _avgApplicationDepth_decorators;
    var _avgApplicationDepth_initializers = [];
    var _avgApplicationDepth_extraInitializers = [];
    var _avoidedTexts_decorators;
    var _avoidedTexts_initializers = [];
    var _avoidedTexts_extraInitializers = [];
    var _overusedIllustrations_decorators;
    var _overusedIllustrations_initializers = [];
    var _overusedIllustrations_extraInitializers = [];
    var _growthInsights_decorators;
    var _growthInsights_initializers = [];
    var _growthInsights_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var SermonPatternTracker = _classThis = /** @class */ (function () {
        function SermonPatternTracker_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.totalSermons = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _totalSermons_initializers, void 0));
            this.styleFrequency = (__runInitializers(this, _totalSermons_extraInitializers), __runInitializers(this, _styleFrequency_initializers, void 0));
            this.themeFrequency = (__runInitializers(this, _styleFrequency_extraInitializers), __runInitializers(this, _themeFrequency_initializers, void 0));
            this.applicationCategoryBalance = (__runInitializers(this, _themeFrequency_extraInitializers), __runInitializers(this, _applicationCategoryBalance_initializers, void 0));
            this.avgChristCentrality = (__runInitializers(this, _applicationCategoryBalance_extraInitializers), __runInitializers(this, _avgChristCentrality_initializers, void 0));
            this.avgApplicationDepth = (__runInitializers(this, _avgChristCentrality_extraInitializers), __runInitializers(this, _avgApplicationDepth_initializers, void 0));
            this.avoidedTexts = (__runInitializers(this, _avgApplicationDepth_extraInitializers), __runInitializers(this, _avoidedTexts_initializers, void 0));
            this.overusedIllustrations = (__runInitializers(this, _avoidedTexts_extraInitializers), __runInitializers(this, _overusedIllustrations_initializers, void 0));
            this.growthInsights = (__runInitializers(this, _overusedIllustrations_extraInitializers), __runInitializers(this, _growthInsights_initializers, void 0));
            this.createdAt = (__runInitializers(this, _growthInsights_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return SermonPatternTracker_1;
    }());
    __setFunctionName(_classThis, "SermonPatternTracker");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid' })];
        _totalSermons_decorators = [(0, typeorm_1.Column)({ type: 'integer', default: 0 })];
        _styleFrequency_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _themeFrequency_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _applicationCategoryBalance_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', default: {} })];
        _avgChristCentrality_decorators = [(0, typeorm_1.Column)({ type: 'float', nullable: true })];
        _avgApplicationDepth_decorators = [(0, typeorm_1.Column)({ type: 'float', nullable: true })];
        _avoidedTexts_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true, nullable: true })];
        _overusedIllustrations_decorators = [(0, typeorm_1.Column)({ type: 'text', array: true, nullable: true })];
        _growthInsights_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _totalSermons_decorators, { kind: "field", name: "totalSermons", static: false, private: false, access: { has: function (obj) { return "totalSermons" in obj; }, get: function (obj) { return obj.totalSermons; }, set: function (obj, value) { obj.totalSermons = value; } }, metadata: _metadata }, _totalSermons_initializers, _totalSermons_extraInitializers);
        __esDecorate(null, null, _styleFrequency_decorators, { kind: "field", name: "styleFrequency", static: false, private: false, access: { has: function (obj) { return "styleFrequency" in obj; }, get: function (obj) { return obj.styleFrequency; }, set: function (obj, value) { obj.styleFrequency = value; } }, metadata: _metadata }, _styleFrequency_initializers, _styleFrequency_extraInitializers);
        __esDecorate(null, null, _themeFrequency_decorators, { kind: "field", name: "themeFrequency", static: false, private: false, access: { has: function (obj) { return "themeFrequency" in obj; }, get: function (obj) { return obj.themeFrequency; }, set: function (obj, value) { obj.themeFrequency = value; } }, metadata: _metadata }, _themeFrequency_initializers, _themeFrequency_extraInitializers);
        __esDecorate(null, null, _applicationCategoryBalance_decorators, { kind: "field", name: "applicationCategoryBalance", static: false, private: false, access: { has: function (obj) { return "applicationCategoryBalance" in obj; }, get: function (obj) { return obj.applicationCategoryBalance; }, set: function (obj, value) { obj.applicationCategoryBalance = value; } }, metadata: _metadata }, _applicationCategoryBalance_initializers, _applicationCategoryBalance_extraInitializers);
        __esDecorate(null, null, _avgChristCentrality_decorators, { kind: "field", name: "avgChristCentrality", static: false, private: false, access: { has: function (obj) { return "avgChristCentrality" in obj; }, get: function (obj) { return obj.avgChristCentrality; }, set: function (obj, value) { obj.avgChristCentrality = value; } }, metadata: _metadata }, _avgChristCentrality_initializers, _avgChristCentrality_extraInitializers);
        __esDecorate(null, null, _avgApplicationDepth_decorators, { kind: "field", name: "avgApplicationDepth", static: false, private: false, access: { has: function (obj) { return "avgApplicationDepth" in obj; }, get: function (obj) { return obj.avgApplicationDepth; }, set: function (obj, value) { obj.avgApplicationDepth = value; } }, metadata: _metadata }, _avgApplicationDepth_initializers, _avgApplicationDepth_extraInitializers);
        __esDecorate(null, null, _avoidedTexts_decorators, { kind: "field", name: "avoidedTexts", static: false, private: false, access: { has: function (obj) { return "avoidedTexts" in obj; }, get: function (obj) { return obj.avoidedTexts; }, set: function (obj, value) { obj.avoidedTexts = value; } }, metadata: _metadata }, _avoidedTexts_initializers, _avoidedTexts_extraInitializers);
        __esDecorate(null, null, _overusedIllustrations_decorators, { kind: "field", name: "overusedIllustrations", static: false, private: false, access: { has: function (obj) { return "overusedIllustrations" in obj; }, get: function (obj) { return obj.overusedIllustrations; }, set: function (obj, value) { obj.overusedIllustrations = value; } }, metadata: _metadata }, _overusedIllustrations_initializers, _overusedIllustrations_extraInitializers);
        __esDecorate(null, null, _growthInsights_decorators, { kind: "field", name: "growthInsights", static: false, private: false, access: { has: function (obj) { return "growthInsights" in obj; }, get: function (obj) { return obj.growthInsights; }, set: function (obj, value) { obj.growthInsights = value; } }, metadata: _metadata }, _growthInsights_initializers, _growthInsights_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SermonPatternTracker = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SermonPatternTracker = _classThis;
}();
exports.SermonPatternTracker = SermonPatternTracker;
