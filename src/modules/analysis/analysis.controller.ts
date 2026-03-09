import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TheologicalCenterService } from './theological-center.service';
import { TensionMappingService } from './tension-mapping.service';
import { DoctrinalPrecisionService } from './doctrinal-precision.service';
import { BlindSpotDetectorService } from './blind-spot-detector.service';
import { PreachingStrategySelectorService } from './preaching-strategy-selector.service';
import { HistoricalContextEnhancerService } from './historical-context-enhancer.service';
import { SermonPatternTrackerService } from './sermon-pattern-tracker.service';
import { CrossReferenceNarrativeService } from './cross-reference-narrative.service';

@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(
    private theologicalCenterService: TheologicalCenterService,
    private tensionMappingService: TensionMappingService,
    private doctrinalPrecisionService: DoctrinalPrecisionService,
    private blindSpotDetectorService: BlindSpotDetectorService,
    private preachingStrategySelectorService: PreachingStrategySelectorService,
    private historicalContextEnhancerService: HistoricalContextEnhancerService,
    private sermonPatternTrackerService: SermonPatternTrackerService,
    private crossReferenceNarrativeService: CrossReferenceNarrativeService,
  ) {}

  @Post('theological-center/:workspaceId')
  async analyzeTheologicalCenter(@Param('workspaceId') workspaceId: string, @Request() req: any) {
    return this.theologicalCenterService.analyze(workspaceId, req.user.userId);
  }

  @Get('theological-center/:workspaceId')
  async getTheologicalCenter(@Param('workspaceId') workspaceId: string) {
    return this.theologicalCenterService.get(workspaceId);
  }

  @Post('tension-mapping/:workspaceId')
  async analyzeTensions(@Param('workspaceId') workspaceId: string, @Request() req: any) {
    return this.tensionMappingService.analyze(workspaceId, req.user.userId);
  }

  @Get('tension-mapping/:workspaceId')
  async getTensions(@Param('workspaceId') workspaceId: string) {
    return this.tensionMappingService.get(workspaceId);
  }

  @Post('doctrinal-precision/:workspaceId')
  async checkDoctrinalPrecision(@Param('workspaceId') workspaceId: string, @Request() req: any) {
    return this.doctrinalPrecisionService.analyze(workspaceId, req.user.userId);
  }

  @Get('doctrinal-precision/:workspaceId')
  async getDoctrinalPrecision(@Param('workspaceId') workspaceId: string) {
    return this.doctrinalPrecisionService.get(workspaceId);
  }

  @Post('blind-spots/:workspaceId')
  async detectBlindSpots(@Param('workspaceId') workspaceId: string, @Request() req: any) {
    return this.blindSpotDetectorService.analyze(workspaceId, req.user.userId);
  }

  @Get('blind-spots/:workspaceId')
  async getBlindSpots(@Param('workspaceId') workspaceId: string) {
    return this.blindSpotDetectorService.get(workspaceId);
  }

  @Post('preaching-strategy/:workspaceId')
  async selectPreachingStrategy(@Param('workspaceId') workspaceId: string, @Request() req: any) {
    return this.preachingStrategySelectorService.analyze(workspaceId, req.user.userId);
  }

  @Get('preaching-strategy/:workspaceId')
  async getPreachingStrategy(@Param('workspaceId') workspaceId: string) {
    return this.preachingStrategySelectorService.get(workspaceId);
  }

  @Post('historical-context/:workspaceId')
  async enhanceHistoricalContext(@Param('workspaceId') workspaceId: string, @Request() req: any) {
    return this.historicalContextEnhancerService.analyze(workspaceId, req.user.userId);
  }

  @Get('historical-context/:workspaceId')
  async getHistoricalContext(@Param('workspaceId') workspaceId: string) {
    return this.historicalContextEnhancerService.get(workspaceId);
  }

  @Get('sermon-patterns')
  async getSermonPatterns(@Request() req: any) {
    return this.sermonPatternTrackerService.get(req.user.userId);
  }

  @Post('sermon-patterns/analyze')
  async analyzeSermonPatterns(@Request() req: any) {
    return this.sermonPatternTrackerService.analyzeGrowth(req.user.userId);
  }

  @Post('cross-reference-narrative/:verse')
  async buildCrossReferenceNarrative(@Param('verse') verse: string, @Request() req: any) {
    return this.crossReferenceNarrativeService.buildNarrative(verse, req.user.userId);
  }

  @Get('cross-reference-narrative/:verse')
  async getCrossReferenceNarrative(@Param('verse') verse: string) {
    return this.crossReferenceNarrativeService.get(verse);
  }

  @Post('run-all/:workspaceId')
  async runAllAnalyses(@Param('workspaceId') workspaceId: string, @Request() req: any) {
    const userId = req.user.userId;

    const [
      theologicalCenter,
      tensions,
      doctrinalCheck,
      blindSpots,
      strategy,
      historicalContext,
    ] = await Promise.all([
      this.theologicalCenterService.analyze(workspaceId, userId),
      this.tensionMappingService.analyze(workspaceId, userId),
      this.doctrinalPrecisionService.analyze(workspaceId, userId),
      this.blindSpotDetectorService.analyze(workspaceId, userId),
      this.preachingStrategySelectorService.analyze(workspaceId, userId),
      this.historicalContextEnhancerService.analyze(workspaceId, userId),
    ]);

    await this.sermonPatternTrackerService.updatePatterns(userId, workspaceId);

    return {
      theologicalCenter,
      tensions,
      doctrinalCheck,
      blindSpots,
      strategy,
      historicalContext,
    };
  }
}
