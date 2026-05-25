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
exports.ChurchSettings = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var ChurchSettings = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('church_settings')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _churchName_decorators;
    var _churchName_initializers = [];
    var _churchName_extraInitializers = [];
    var _addressLine1_decorators;
    var _addressLine1_initializers = [];
    var _addressLine1_extraInitializers = [];
    var _addressLine2_decorators;
    var _addressLine2_initializers = [];
    var _addressLine2_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _state_decorators;
    var _state_initializers = [];
    var _state_extraInitializers = [];
    var _postalCode_decorators;
    var _postalCode_initializers = [];
    var _postalCode_extraInitializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _country_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _website_decorators;
    var _website_initializers = [];
    var _website_extraInitializers = [];
    var _logoUrl_decorators;
    var _logoUrl_initializers = [];
    var _logoUrl_extraInitializers = [];
    var _defaultTimezone_decorators;
    var _defaultTimezone_initializers = [];
    var _defaultTimezone_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var ChurchSettings = _classThis = /** @class */ (function () {
        function ChurchSettings_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.userId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.user = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.churchName = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _churchName_initializers, void 0));
            this.addressLine1 = (__runInitializers(this, _churchName_extraInitializers), __runInitializers(this, _addressLine1_initializers, void 0));
            this.addressLine2 = (__runInitializers(this, _addressLine1_extraInitializers), __runInitializers(this, _addressLine2_initializers, void 0));
            this.city = (__runInitializers(this, _addressLine2_extraInitializers), __runInitializers(this, _city_initializers, void 0));
            this.state = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _state_initializers, void 0));
            this.postalCode = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
            this.country = (__runInitializers(this, _postalCode_extraInitializers), __runInitializers(this, _country_initializers, void 0));
            this.phone = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.website = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _website_initializers, void 0));
            this.logoUrl = (__runInitializers(this, _website_extraInitializers), __runInitializers(this, _logoUrl_initializers, void 0));
            this.defaultTimezone = (__runInitializers(this, _logoUrl_extraInitializers), __runInitializers(this, _defaultTimezone_initializers, void 0));
            this.createdAt = (__runInitializers(this, _defaultTimezone_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
        return ChurchSettings_1;
    }());
    __setFunctionName(_classThis, "ChurchSettings");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _userId_decorators = [(0, typeorm_1.Column)({ type: 'uuid', unique: true })];
        _user_decorators = [(0, typeorm_1.OneToOne)(function () { return user_entity_1.User; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _churchName_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _addressLine1_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _addressLine2_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _city_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _state_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _postalCode_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _country_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _phone_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _website_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _logoUrl_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _defaultTimezone_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _churchName_decorators, { kind: "field", name: "churchName", static: false, private: false, access: { has: function (obj) { return "churchName" in obj; }, get: function (obj) { return obj.churchName; }, set: function (obj, value) { obj.churchName = value; } }, metadata: _metadata }, _churchName_initializers, _churchName_extraInitializers);
        __esDecorate(null, null, _addressLine1_decorators, { kind: "field", name: "addressLine1", static: false, private: false, access: { has: function (obj) { return "addressLine1" in obj; }, get: function (obj) { return obj.addressLine1; }, set: function (obj, value) { obj.addressLine1 = value; } }, metadata: _metadata }, _addressLine1_initializers, _addressLine1_extraInitializers);
        __esDecorate(null, null, _addressLine2_decorators, { kind: "field", name: "addressLine2", static: false, private: false, access: { has: function (obj) { return "addressLine2" in obj; }, get: function (obj) { return obj.addressLine2; }, set: function (obj, value) { obj.addressLine2 = value; } }, metadata: _metadata }, _addressLine2_initializers, _addressLine2_extraInitializers);
        __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
        __esDecorate(null, null, _state_decorators, { kind: "field", name: "state", static: false, private: false, access: { has: function (obj) { return "state" in obj; }, get: function (obj) { return obj.state; }, set: function (obj, value) { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
        __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: function (obj) { return "postalCode" in obj; }, get: function (obj) { return obj.postalCode; }, set: function (obj, value) { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
        __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _website_decorators, { kind: "field", name: "website", static: false, private: false, access: { has: function (obj) { return "website" in obj; }, get: function (obj) { return obj.website; }, set: function (obj, value) { obj.website = value; } }, metadata: _metadata }, _website_initializers, _website_extraInitializers);
        __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: function (obj) { return "logoUrl" in obj; }, get: function (obj) { return obj.logoUrl; }, set: function (obj, value) { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
        __esDecorate(null, null, _defaultTimezone_decorators, { kind: "field", name: "defaultTimezone", static: false, private: false, access: { has: function (obj) { return "defaultTimezone" in obj; }, get: function (obj) { return obj.defaultTimezone; }, set: function (obj, value) { obj.defaultTimezone = value; } }, metadata: _metadata }, _defaultTimezone_initializers, _defaultTimezone_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChurchSettings = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChurchSettings = _classThis;
}();
exports.ChurchSettings = ChurchSettings;
