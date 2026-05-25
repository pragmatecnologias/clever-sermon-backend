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
exports.ScriptureModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var scripture_service_1 = require("./scripture.service");
var scripture_controller_1 = require("./scripture.controller");
var scripture_cache_service_1 = require("./scripture-cache.service");
var audio_bible_service_1 = require("./audio-bible.service");
var translation_comparison_service_1 = require("./translation-comparison.service");
var morphology_service_1 = require("./morphology.service");
var theme_extraction_service_1 = require("./theme-extraction.service");
var evidence_map_service_1 = require("./evidence-map.service");
var cross_reference_ranking_service_1 = require("./cross-reference-ranking.service");
var interpretive_highlights_service_1 = require("./interpretive-highlights.service");
var sda_cross_references_service_1 = require("./sda-cross-references.service");
var citation_validator_service_1 = require("./citation-validator.service");
var verse_commentary_service_1 = require("./verse-commentary.service");
var morphology_data_service_1 = require("./morphology-data.service");
var canonical_theme_tracer_service_1 = require("./canonical-theme-tracer.service");
var sanctuary_prophecy_mapper_service_1 = require("./sanctuary-prophecy-mapper.service");
var structural_analysis_data_service_1 = require("./structural-analysis-data.service");
var interpretive_challenges_data_service_1 = require("./interpretive-challenges-data.service");
var word_study_enhanced_service_1 = require("./word-study-enhanced.service");
var per_verse_context_service_1 = require("./per-verse-context.service");
var sda_doctrinal_guardrails_service_1 = require("./sda-doctrinal-guardrails.service");
var translation_comparison_enhanced_service_1 = require("./translation-comparison-enhanced.service");
var passage_summary_service_1 = require("./passage-summary.service");
var study_synthesis_service_1 = require("./study-synthesis.service");
var bible_translation_entity_1 = require("../../entities/bible-translation.entity");
var llm_module_1 = require("../llm/llm.module");
var egw_module_1 = require("../egw/egw.module");
var ScriptureModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule,
                typeorm_1.TypeOrmModule.forFeature([bible_translation_entity_1.BibleTranslation]),
                llm_module_1.LlmModule,
                egw_module_1.EGWModule,
            ],
            providers: [
                scripture_service_1.ScriptureService,
                scripture_cache_service_1.ScriptureCacheService,
                audio_bible_service_1.AudioBibleService,
                translation_comparison_service_1.TranslationComparisonService,
                morphology_service_1.MorphologyService,
                theme_extraction_service_1.ThemeExtractionService,
                evidence_map_service_1.EvidenceMapService,
                cross_reference_ranking_service_1.CrossReferenceRankingService,
                interpretive_highlights_service_1.InterpretiveHighlightsService,
                sda_cross_references_service_1.SDACrossReferencesService,
                citation_validator_service_1.CitationValidatorService,
                verse_commentary_service_1.VerseCommentaryService,
                morphology_data_service_1.MorphologyDataService,
                canonical_theme_tracer_service_1.CanonicalThemeTracerService,
                sanctuary_prophecy_mapper_service_1.SanctuaryProphecyMapperService,
                structural_analysis_data_service_1.StructuralAnalysisDataService,
                interpretive_challenges_data_service_1.InterpretiveChallengesDataService,
                word_study_enhanced_service_1.WordStudyEnhancedService,
                per_verse_context_service_1.PerVerseContextService,
                sda_doctrinal_guardrails_service_1.SDADoctrinalGuardrailsService,
                translation_comparison_enhanced_service_1.TranslationComparisonEnhancedService,
                passage_summary_service_1.PassageSummaryService,
                study_synthesis_service_1.StudySynthesisService,
            ],
            controllers: [scripture_controller_1.ScriptureController],
            exports: [
                scripture_service_1.ScriptureService,
                citation_validator_service_1.CitationValidatorService,
                sda_doctrinal_guardrails_service_1.SDADoctrinalGuardrailsService,
                passage_summary_service_1.PassageSummaryService,
                study_synthesis_service_1.StudySynthesisService,
                structural_analysis_data_service_1.StructuralAnalysisDataService,
                interpretive_challenges_data_service_1.InterpretiveChallengesDataService,
                translation_comparison_enhanced_service_1.TranslationComparisonEnhancedService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ScriptureModule = _classThis = /** @class */ (function () {
        function ScriptureModule_1() {
        }
        return ScriptureModule_1;
    }());
    __setFunctionName(_classThis, "ScriptureModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScriptureModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScriptureModule = _classThis;
}();
exports.ScriptureModule = ScriptureModule;
