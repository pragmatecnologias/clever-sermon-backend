import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CanonicalConstellationService } from './canonical-constellation.service';
import { WordUsageSphereService } from './word-usage-sphere.service';
import { SermonFlowSculptorService } from './sermon-flow-sculptor.service';
import { TimelineUniverseService } from './timeline-universe.service';
import { ProphecyFulfillmentService } from './prophecy-fulfillment.service';
import { TheologicalThemeGalaxyService } from './theological-theme-galaxy.service';

@Controller('visualization')
@UseGuards(JwtAuthGuard)
export class VisualizationController {
  constructor(
    private canonicalConstellationService: CanonicalConstellationService,
    private wordUsageSphereService: WordUsageSphereService,
    private sermonFlowSculptorService: SermonFlowSculptorService,
    private timelineUniverseService: TimelineUniverseService,
    private prophecyFulfillmentService: ProphecyFulfillmentService,
    private theologicalThemeGalaxyService: TheologicalThemeGalaxyService
  ) {}

  @Get('canonical-constellation')
  async getCanonicalConstellation(
    @Query('focusPassage') focusPassage?: string,
    @Query('types') types?: string
  ) {
    const includeTypes = types ? types.split(',') : undefined;
    return this.canonicalConstellationService.generateConstellation(focusPassage, includeTypes);
  }

  @Get('book-cluster')
  async getBookCluster(@Query('book') book: string) {
    return this.canonicalConstellationService.getBookCluster(book);
  }

  @Get('word-sphere')
  async getWordSphere(
    @Query('lemma') lemma: string,
    @Query('strongs') strongs: string
  ) {
    return this.wordUsageSphereService.generateWordSphere(lemma, strongs);
  }

  @Post('sermon-flow')
  async generateSermonFlow(
    @Body() body: {
      bigIdea: string;
      points: string[];
      applications: string[];
      supportingVerses: Record<string, string[]>;
      illustrations?: string[];
    }
  ) {
    return this.sermonFlowSculptorService.generateSermonFlow(
      body.bigIdea,
      body.points,
      body.applications,
      body.supportingVerses,
      body.illustrations
    );
  }

  @Post('sermon-balance')
  async analyzeSermonBalance(@Body() flowData: any) {
    return this.sermonFlowSculptorService.analyzeSermonBalance(flowData);
  }

  @Get('timeline')
  async getTimeline(
    @Query('startYear') startYear?: string,
    @Query('endYear') endYear?: string,
    @Query('categories') categories?: string
  ) {
    const start = startYear ? parseInt(startYear) : undefined;
    const end = endYear ? parseInt(endYear) : undefined;
    const cats = categories ? categories.split(',') : undefined;
    
    return this.timelineUniverseService.generateTimeline(start, end, cats);
  }

  @Get('timeline-events')
  async getTimelineEvents(
    @Query('year') year: string,
    @Query('category') category?: string
  ) {
    return this.timelineUniverseService.getEventDetails(parseInt(year), category);
  }

  @Get('timeline-context')
  async getTimelineContext(@Query('year') year: string) {
    return this.timelineUniverseService.getContextForYear(parseInt(year));
  }

  @Get('prophecy-web')
  async getProphecyWeb(@Query('theme') theme?: string) {
    return this.prophecyFulfillmentService.generateProphecyWeb(theme as any);
  }

  @Get('prophecy-2300-days')
  async get2300DaysThread() {
    return this.prophecyFulfillmentService.get2300DaysThread();
  }

  @Get('theme-galaxy')
  async getThemeGalaxy(@Query('theme') theme: string) {
    return this.theologicalThemeGalaxyService.generateThemeGalaxy(theme);
  }

  @Get('theme-progression')
  async getThemeProgression(@Query('theme') theme: string) {
    return this.theologicalThemeGalaxyService.getThemeProgression(theme);
  }
}
