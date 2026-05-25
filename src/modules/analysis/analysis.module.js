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
exports.AnalysisModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var theological_center_analysis_entity_1 = require("../../entities/theological-center-analysis.entity");
var tension_analysis_entity_1 = require("../../entities/tension-analysis.entity");
var doctrinal_precision_check_entity_1 = require("../../entities/doctrinal-precision-check.entity");
var blind_spot_analysis_entity_1 = require("../../entities/blind-spot-analysis.entity");
var preaching_strategy_entity_1 = require("../../entities/preaching-strategy.entity");
var historical_context_enhanced_entity_1 = require("../../entities/historical-context-enhanced.entity");
var sermon_pattern_tracker_entity_1 = require("../../entities/sermon-pattern-tracker.entity");
var cross_reference_narrative_entity_1 = require("../../entities/cross-reference-narrative.entity");
var sermon_workspace_entity_1 = require("../../entities/sermon-workspace.entity");
var theological_center_service_1 = require("./theological-center.service");
var tension_mapping_service_1 = require("./tension-mapping.service");
var doctrinal_precision_service_1 = require("./doctrinal-precision.service");
var blind_spot_detector_service_1 = require("./blind-spot-detector.service");
var preaching_strategy_selector_service_1 = require("./preaching-strategy-selector.service");
var historical_context_enhancer_service_1 = require("./historical-context-enhancer.service");
var sermon_pattern_tracker_service_1 = require("./sermon-pattern-tracker.service");
var cross_reference_narrative_service_1 = require("./cross-reference-narrative.service");
var analysis_controller_1 = require("./analysis.controller");
var llm_module_1 = require("../llm/llm.module");
var scripture_module_1 = require("../scripture/scripture.module");
var AnalysisModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    theological_center_analysis_entity_1.TheologicalCenterAnalysis,
                    tension_analysis_entity_1.TensionAnalysis,
                    doctrinal_precision_check_entity_1.DoctrinalPrecisionCheck,
                    blind_spot_analysis_entity_1.BlindSpotAnalysis,
                    preaching_strategy_entity_1.PreachingStrategy,
                    historical_context_enhanced_entity_1.HistoricalContextEnhanced,
                    sermon_pattern_tracker_entity_1.SermonPatternTracker,
                    cross_reference_narrative_entity_1.CrossReferenceNarrative,
                    sermon_workspace_entity_1.SermonWorkspace,
                ]),
                llm_module_1.LlmModule,
                scripture_module_1.ScriptureModule,
            ],
            providers: [
                theological_center_service_1.TheologicalCenterService,
                tension_mapping_service_1.TensionMappingService,
                doctrinal_precision_service_1.DoctrinalPrecisionService,
                blind_spot_detector_service_1.BlindSpotDetectorService,
                preaching_strategy_selector_service_1.PreachingStrategySelectorService,
                historical_context_enhancer_service_1.HistoricalContextEnhancerService,
                sermon_pattern_tracker_service_1.SermonPatternTrackerService,
                cross_reference_narrative_service_1.CrossReferenceNarrativeService,
            ],
            controllers: [analysis_controller_1.AnalysisController],
            exports: [
                theological_center_service_1.TheologicalCenterService,
                tension_mapping_service_1.TensionMappingService,
                doctrinal_precision_service_1.DoctrinalPrecisionService,
                blind_spot_detector_service_1.BlindSpotDetectorService,
                preaching_strategy_selector_service_1.PreachingStrategySelectorService,
                historical_context_enhancer_service_1.HistoricalContextEnhancerService,
                sermon_pattern_tracker_service_1.SermonPatternTrackerService,
                cross_reference_narrative_service_1.CrossReferenceNarrativeService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AnalysisModule = _classThis = /** @class */ (function () {
        function AnalysisModule_1() {
        }
        return AnalysisModule_1;
    }());
    __setFunctionName(_classThis, "AnalysisModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalysisModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalysisModule = _classThis;
}();
exports.AnalysisModule = AnalysisModule;
