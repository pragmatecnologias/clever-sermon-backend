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
exports.EGWModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var egw_service_1 = require("./egw.service");
var egw_integration_service_1 = require("./egw-integration.service");
var egw_passage_integration_service_1 = require("./egw-passage-integration.service");
var egw_study_report_integration_service_1 = require("./egw-study-report-integration.service");
var egw_sermon_builder_integration_service_1 = require("./egw-sermon-builder-integration.service");
var egw_controller_1 = require("./egw.controller");
var egw_book_entity_1 = require("../../entities/egw-book.entity");
var egw_paragraph_entity_1 = require("../../entities/egw-paragraph.entity");
var egw_scripture_reference_entity_1 = require("../../entities/egw-scripture-reference.entity");
var EGWModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([egw_book_entity_1.EGWBook, egw_paragraph_entity_1.EGWParagraph, egw_scripture_reference_entity_1.EGWScriptureReference])],
            providers: [
                egw_service_1.EGWService,
                egw_integration_service_1.EGWIntegrationService,
                egw_passage_integration_service_1.EGWPassageIntegrationService,
                egw_study_report_integration_service_1.EGWStudyReportIntegrationService,
                egw_sermon_builder_integration_service_1.EGWSermonBuilderIntegrationService
            ],
            controllers: [egw_controller_1.EGWController],
            exports: [
                egw_service_1.EGWService,
                egw_integration_service_1.EGWIntegrationService,
                egw_passage_integration_service_1.EGWPassageIntegrationService,
                egw_study_report_integration_service_1.EGWStudyReportIntegrationService,
                egw_sermon_builder_integration_service_1.EGWSermonBuilderIntegrationService
            ]
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EGWModule = _classThis = /** @class */ (function () {
        function EGWModule_1() {
        }
        return EGWModule_1;
    }());
    __setFunctionName(_classThis, "EGWModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EGWModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EGWModule = _classThis;
}();
exports.EGWModule = EGWModule;
