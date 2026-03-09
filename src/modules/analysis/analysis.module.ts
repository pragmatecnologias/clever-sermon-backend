import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TheologicalCenterAnalysis } from '../../entities/theological-center-analysis.entity';
import { TensionAnalysis } from '../../entities/tension-analysis.entity';
import { DoctrinalPrecisionCheck } from '../../entities/doctrinal-precision-check.entity';
import { BlindSpotAnalysis } from '../../entities/blind-spot-analysis.entity';
import { PreachingStrategy } from '../../entities/preaching-strategy.entity';
import { HistoricalContextEnhanced } from '../../entities/historical-context-enhanced.entity';
import { SermonPatternTracker } from '../../entities/sermon-pattern-tracker.entity';
import { CrossReferenceNarrative } from '../../entities/cross-reference-narrative.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { TheologicalCenterService } from './theological-center.service';
import { TensionMappingService } from './tension-mapping.service';
import { DoctrinalPrecisionService } from './doctrinal-precision.service';
import { BlindSpotDetectorService } from './blind-spot-detector.service';
import { PreachingStrategySelectorService } from './preaching-strategy-selector.service';
import { HistoricalContextEnhancerService } from './historical-context-enhancer.service';
import { SermonPatternTrackerService } from './sermon-pattern-tracker.service';
import { CrossReferenceNarrativeService } from './cross-reference-narrative.service';
import { AnalysisController } from './analysis.controller';
import { LlmModule } from '../llm/llm.module';
import { ScriptureModule } from '../scripture/scripture.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TheologicalCenterAnalysis,
      TensionAnalysis,
      DoctrinalPrecisionCheck,
      BlindSpotAnalysis,
      PreachingStrategy,
      HistoricalContextEnhanced,
      SermonPatternTracker,
      CrossReferenceNarrative,
      SermonWorkspace,
    ]),
    LlmModule,
    ScriptureModule,
  ],
  providers: [
    TheologicalCenterService,
    TensionMappingService,
    DoctrinalPrecisionService,
    BlindSpotDetectorService,
    PreachingStrategySelectorService,
    HistoricalContextEnhancerService,
    SermonPatternTrackerService,
    CrossReferenceNarrativeService,
  ],
  controllers: [AnalysisController],
  exports: [
    TheologicalCenterService,
    TensionMappingService,
    DoctrinalPrecisionService,
    BlindSpotDetectorService,
    PreachingStrategySelectorService,
    HistoricalContextEnhancerService,
    SermonPatternTrackerService,
    CrossReferenceNarrativeService,
  ],
})
export class AnalysisModule {}
