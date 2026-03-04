import { Module } from '@nestjs/common';
import { VisualizationController } from './visualization.controller';
import { CanonicalConstellationService } from './canonical-constellation.service';
import { WordUsageSphereService } from './word-usage-sphere.service';
import { SermonFlowSculptorService } from './sermon-flow-sculptor.service';
import { TimelineUniverseService } from './timeline-universe.service';
import { ProphecyFulfillmentService } from './prophecy-fulfillment.service';
import { TheologicalThemeGalaxyService } from './theological-theme-galaxy.service';
import { ScriptureModule } from '../scripture/scripture.module';

@Module({
  imports: [ScriptureModule],
  controllers: [VisualizationController],
  providers: [
    CanonicalConstellationService,
    WordUsageSphereService,
    SermonFlowSculptorService,
    TimelineUniverseService,
    ProphecyFulfillmentService,
    TheologicalThemeGalaxyService
  ],
  exports: [
    CanonicalConstellationService,
    WordUsageSphereService,
    SermonFlowSculptorService,
    TimelineUniverseService,
    ProphecyFulfillmentService,
    TheologicalThemeGalaxyService
  ]
})
export class VisualizationModule {}
