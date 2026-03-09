import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { EGWService } from './egw.service';
import { EGWIntegrationService } from './egw-integration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('egw')
@UseGuards(JwtAuthGuard)
export class EGWController {
  constructor(
    private egwService: EGWService,
    private egwIntegrationService: EGWIntegrationService
  ) {}

  @Get('books')
  async getAllBooks(@Query('language') language?: string) {
    return this.egwService.getAllBooks(language);
  }

  @Get('books/:code')
  async getBook(@Param('code') code: string) {
    return this.egwService.getBookByCode(code);
  }

  @Get('books/category/:category')
  async getBooksByCategory(@Param('category') category: string) {
    return this.egwService.getBooksByCategory(category);
  }

  @Get('chapter/:bookCode/:chapterNumber')
  async getChapter(
    @Param('bookCode') bookCode: string,
    @Param('chapterNumber') chapterNumber: string
  ) {
    return this.egwService.getChapter(bookCode, parseInt(chapterNumber));
  }

  @Get('paragraph/:reference')
  async getParagraph(@Param('reference') reference: string) {
    return this.egwService.getParagraphByReference(reference);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('limit') limit?: string,
    @Query('language') language?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    return this.egwService.searchContent(query, limitNum, language);
  }

  @Get('search/topic')
  async searchByTopic(
    @Query('topic') topic: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.egwService.searchByTopic(topic, limitNum);
  }

  @Get('quotes')
  async getRelevantQuotes(
    @Query('scripture') scripture: string,
    @Query('topic') topic?: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 5;
    return this.egwService.getRelevantQuotes(scripture, topic, limitNum);
  }

  @Get('suggested-reading')
  async getSuggestedReading(@Query('topic') topic: string) {
    return this.egwService.getSuggestedReading(topic);
  }

  @Get('insights/passage')
  async getPassageInsights(
    @Query('book') book: string,
    @Query('chapter') chapter: string,
    @Query('verseStart') verseStart?: string,
    @Query('verseEnd') verseEnd?: string,
    @Query('language') language?: string,
    @Query('limit') limit?: string
  ) {
    const chapterNum = parseInt(chapter);
    const verseStartNum = verseStart ? parseInt(verseStart) : undefined;
    const verseEndNum = verseEnd ? parseInt(verseEnd) : undefined;
    const limitNum = limit ? parseInt(limit) : 5;

    return this.egwService.getInsightsForPassage(
      book,
      chapterNum,
      verseStartNum,
      verseEndNum,
      language,
      limitNum
    );
  }

  @Get('sermon-suggestions')
  async getSermonSuggestions(
    @Query('passage') passage: string,
    @Query('theme') theme: string,
    @Query('language') language?: string,
    @Query('limit') limit?: string
  ) {
    const lang = language || 'en';
    const limitNum = limit ? parseInt(limit) : 3;

    return this.egwIntegrationService.getSermonssuggestions(
      passage,
      theme,
      lang,
      limitNum
    );
  }

  @Get('interpretive-perspective')
  async getInterpretivePerspective(
    @Query('passage') passage: string,
    @Query('language') language?: string
  ) {
    const lang = language || 'en';
    return this.egwIntegrationService.getInterpretivePerspective(passage, lang);
  }

  @Get('smart-boosts')
  async getSDASmartBoosts(
    @Query('topic') topic: string,
    @Query('language') language?: string
  ) {
    const lang = language || 'en';
    return this.egwIntegrationService.getSDASmartBoosts(topic, lang);
  }

  @Get('passage-panel')
  async getPassagePanel(
    @Query('book') book: string,
    @Query('chapter') chapter: string,
    @Query('verseStart') verseStart?: string,
    @Query('verseEnd') verseEnd?: string,
    @Query('language') language?: string,
    @Query('limit') limit?: string
  ) {
    const chapterNum = parseInt(chapter);
    const verseStartNum = verseStart ? parseInt(verseStart) : undefined;
    const verseEndNum = verseEnd ? parseInt(verseEnd) : undefined;
    const lang = language || 'en';
    const limitNum = limit ? parseInt(limit) : 5;

    const { EGWPassageIntegrationService } = require('./egw-passage-integration.service');
    const passageService = new EGWPassageIntegrationService(
      this.egwService['paragraphRepository'],
      this.egwService['scriptureRefRepository']
    );

    return passageService.getPassageInsights(
      book,
      chapterNum,
      verseStartNum,
      verseEndNum,
      lang,
      limitNum
    );
  }

  @Get('sda-smart-boost-check')
  async checkSDASmartBoost(@Query('passage') passage: string) {
    const { EGWPassageIntegrationService } = require('./egw-passage-integration.service');
    const passageService = new EGWPassageIntegrationService(
      this.egwService['paragraphRepository'],
      this.egwService['scriptureRefRepository']
    );

    return passageService.getSDASmartBoost(passage);
  }
}
