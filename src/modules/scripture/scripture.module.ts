import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptureService } from './scripture.service';
import { ScriptureController } from './scripture.controller';
import { ScriptureCacheService } from './scripture-cache.service';
import { AudioBibleService } from './audio-bible.service';
import { TranslationComparisonService } from './translation-comparison.service';
import { MorphologyService } from './morphology.service';
import { ThemeExtractionService } from './theme-extraction.service';
import { EvidenceMapService } from './evidence-map.service';
import { CrossReferenceRankingService } from './cross-reference-ranking.service';
import { InterpretiveHighlightsService } from './interpretive-highlights.service';
import { SDACrossReferencesService } from './sda-cross-references.service';
import { CitationValidatorService } from './citation-validator.service';
import { VerseCommentaryService } from './verse-commentary.service';
import { MorphologyDataService } from './morphology-data.service';
import { CanonicalThemeTracerService } from './canonical-theme-tracer.service';
import { SanctuaryProphecyMapperService } from './sanctuary-prophecy-mapper.service';
import { StructuralAnalysisDataService } from './structural-analysis-data.service';
import { InterpretiveChallengesDataService } from './interpretive-challenges-data.service';
import { WordStudyEnhancedService } from './word-study-enhanced.service';
import { PerVerseContextService } from './per-verse-context.service';
import { SDADoctrinalGuardrailsService } from './sda-doctrinal-guardrails.service';
import { TranslationComparisonEnhancedService } from './translation-comparison-enhanced.service';
import { BibleTranslation } from '../../entities/bible-translation.entity';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([BibleTranslation]),
    LlmModule,
  ],
  providers: [
    ScriptureService,
    ScriptureCacheService,
    AudioBibleService,
    TranslationComparisonService,
    MorphologyService,
    ThemeExtractionService,
    EvidenceMapService,
    CrossReferenceRankingService,
    InterpretiveHighlightsService,
    SDACrossReferencesService,
    CitationValidatorService,
    VerseCommentaryService,
    MorphologyDataService,
    CanonicalThemeTracerService,
    SanctuaryProphecyMapperService,
    StructuralAnalysisDataService,
    InterpretiveChallengesDataService,
    WordStudyEnhancedService,
    PerVerseContextService,
    SDADoctrinalGuardrailsService,
    TranslationComparisonEnhancedService
  ],
  controllers: [ScriptureController],
  exports: [ScriptureService, CitationValidatorService, SDADoctrinalGuardrailsService],
})
export class ScriptureModule {}
