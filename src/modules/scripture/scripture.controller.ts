import { Controller, Get, Post, Query, Param, Body, UseGuards, Req, Res, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ScriptureService } from './scripture.service';
import { SDACrossReferencesService } from './sda-cross-references.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AudioBibleService } from './audio-bible.service';
import { TranslationComparisonService } from './translation-comparison.service';
import { MorphologyService } from './morphology.service';
import { ThemeExtractionService } from './theme-extraction.service';
import { EvidenceMapService } from './evidence-map.service';
import { CrossReferenceRankingService } from './cross-reference-ranking.service';
import { InterpretiveHighlightsService } from './interpretive-highlights.service';
import { CitationValidatorService } from './citation-validator.service';
import { VerseCommentaryService } from './verse-commentary.service';
import { MorphologyDataService } from './morphology-data.service';
import { CanonicalThemeTracerService } from './canonical-theme-tracer.service';
import { SanctuaryProphecyMapperService } from './sanctuary-prophecy-mapper.service';
import { StructuralAnalysisDataService } from './structural-analysis-data.service';
import { InterpretiveChallengesDataService } from './interpretive-challenges-data.service';
import { WordStudyEnhancedService } from './word-study-enhanced.service';
import { PerVerseContextService } from './per-verse-context.service';
import { TranslationComparisonEnhancedService } from './translation-comparison-enhanced.service';
import { PassageSummaryService } from './passage-summary.service';
import { StudySynthesisService } from './study-synthesis.service';

@Controller('scripture')
@UseGuards(JwtAuthGuard)
export class ScriptureController {
  constructor(
    private scriptureService: ScriptureService,
    private audioBibleService: AudioBibleService,
    private translationComparisonService: TranslationComparisonService,
    private morphologyService: MorphologyService,
    private themeExtractionService: ThemeExtractionService,
    private evidenceMapService: EvidenceMapService,
    private crossReferenceRankingService: CrossReferenceRankingService,
    private interpretiveHighlightsService: InterpretiveHighlightsService,
    private sdaCrossReferencesService: SDACrossReferencesService,
    private citationValidatorService: CitationValidatorService,
    private verseCommentaryService: VerseCommentaryService,
    private morphologyDataService: MorphologyDataService,
    private canonicalThemeTracerService: CanonicalThemeTracerService,
    private sanctuaryProphecyMapperService: SanctuaryProphecyMapperService,
    private structuralAnalysisDataService: StructuralAnalysisDataService,
    private interpretiveChallengesDataService: InterpretiveChallengesDataService,
    private wordStudyEnhancedService: WordStudyEnhancedService,
    private perVerseContextService: PerVerseContextService,
    private translationComparisonEnhancedService: TranslationComparisonEnhancedService,
    private passageSummaryService: PassageSummaryService,
    private studySynthesisService: StudySynthesisService
  ) {}

  @Get('passage')
  async getPassage(
    @Query('reference') reference: string,
    @Query('translation') translation?: string,
  ) {
    return this.scriptureService.getPassage(reference, translation);
  }

  @Get('passage-with-context')
  async getPassageWithContext(
    @Query('reference') reference: string,
    @Query('translation') translation?: string,
    @Query('contextRange') contextRange?: string,
  ) {
    const range = contextRange ? Number(contextRange) : undefined;
    return this.scriptureService.getPassageWithContext(reference, translation, range);
  }

  @Get('parallel')
  async getParallelPassages(
    @Query('reference') reference: string,
    @Query('translations') translations?: string,
    @Query('contextRange') contextRange?: string,
  ) {
    const list = translations ? translations.split(',').map((item) => item.trim()).filter(Boolean) : [];
    const range = contextRange ? Number(contextRange) : undefined;
    return this.scriptureService.getParallelPassages(reference, list, range);
  }

  @Get('cross-references')
  async getCrossReferences(@Query('verse') verse: string) {
    return this.scriptureService.getCrossReferences(verse);
  }

  @Get('audio-bibles')
  async getAudioBibles(@Query('language') language?: string) {
    return this.audioBibleService.getAudioBibles(language);
  }

  @Get('audio-bibles/:audioBibleId')
  async getAudioBible(@Param('audioBibleId') audioBibleId: string) {
    return this.audioBibleService.getAudioBible(audioBibleId);
  }

  @Get('audio-bibles/:audioBibleId/chapters/:chapterId')
  async getAudioChapter(
    @Param('audioBibleId') audioBibleId: string,
    @Param('chapterId') chapterId: string,
  ) {
    return this.audioBibleService.getAudioChapter(audioBibleId, chapterId);
  }

  @Get('audio-bibles/:audioBibleId/books/:bookId/chapters')
  async getAudioChapters(
    @Param('audioBibleId') audioBibleId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.audioBibleService.getAudioChapters(audioBibleId, bookId);
  }

  @Get('cross-reference-details')
  async getCrossReferenceDetails(
    @Query('verse') verse: string,
    @Query('category') category?: string,
  ) {
    return this.scriptureService.getCrossReferenceDetails(verse, category);
  }

  @Get('word-study')
  async getWordStudy(
    @Query('word') word: string,
    @Query('language') language: string,
    @Query('responseLanguage') responseLanguage?: string,
  ) {
    return this.scriptureService.getWordStudy(word, language, responseLanguage);
  }

  @Get('word-study-insights')
  async getWordStudyInsights(
    @Query('word') word: string,
    @Query('language') language: string,
    @Query('context') context?: string,
    @Query('responseLanguage') responseLanguage?: string,
  ) {
    return this.scriptureService.getWordStudyInsights(word, language, context, responseLanguage);
  }

  @Get('word-study-suggestions')
  async getWordStudySuggestions(
    @Query('reference') reference: string,
    @Query('translation') translation?: string,
    @Query('language') language?: string,
    @Query('responseLanguage') responseLanguage?: string,
  ) {
    return this.scriptureService.getWordStudySuggestions(
      reference,
      translation || 'KJV',
      language || 'greek',
      responseLanguage,
    );
  }

  @Get('search')
  async searchScripture(
    @Query('query') query: string,
    @Query('translation') translation?: string,
  ) {
    return this.scriptureService.searchScripture(query, translation);
  }

  @Get('translations')
  async getTranslations() {
    return this.scriptureService.getTranslations();
  }

  @Get('context')
  async getContext(@Query('book') book: string, @Query('reference') reference?: string) {
    const target = book || (reference ? reference.split(' ')[0] : null);
    if (!target) return { book: null, metadata: null, historical: null, cultural: null, timeline: null, geography: null };
    return {
      book: target,
      metadata: await this.scriptureService.getBookMetadata(target),
      historical: await this.scriptureService.getHistoricalContext(target),
      cultural: await this.scriptureService.getCulturalContext(target),
      timeline: await this.scriptureService.getTimeline(target),
      geography: await this.scriptureService.getGeography(target),
    };
  }

  @Get('translation-comparison')
  async compareTranslations(
    @Query('reference') reference: string,
    @Query('translations') translations: string,
    @Query('highlightMode') highlightMode?: 'all' | 'verbs' | 'theological' | 'covenant'
  ) {
    const translationList = translations.split(',').map(t => t.trim());
    return this.translationComparisonService.compareTranslations(reference, translationList, highlightMode);
  }

  @Get('morphology')
  async getMorphology(
    @Query('word') word: string,
    @Query('language') language: string
  ) {
    const morphology = await this.morphologyService.getMorphology(word, language);
    if (morphology) {
      const explanation = await this.morphologyService.getParsingExplanation(morphology.parsing);
      return { ...morphology, parsingExplanation: explanation };
    }
    return null;
  }

  @Get('theme-extraction')
  async extractThemes(
    @Query('reference') reference: string,
    @Query('translation') translation?: string
  ) {
    const passage = await this.scriptureService.getPassage(reference, translation);
    if (!passage?.verses) return { themes: [], covenantThreads: [] };
    
    const themes = this.themeExtractionService.extractThemes(passage.verses);
    const covenantThreads = this.themeExtractionService.extractCovenantThreads(passage.verses);
    
    return { themes, covenantThreads };
  }

  @Post('evidence-map')
  async analyzeEvidence(
    @Body() body: { sermonPoints: string[]; mainPassage: string; additionalPassages: string[] }
  ) {
    return this.evidenceMapService.analyzeSermonEvidence(
      body.sermonPoints,
      body.mainPassage,
      body.additionalPassages || []
    );
  }

  @Post('passage-integrity')
  async checkIntegrity(
    @Body() body: {
      outlinePoints: string[];
      applications: string[];
      mainPassage: string;
      crossReferences: string[];
    }
  ) {
    return this.evidenceMapService.checkPassageIntegrity(
      body.outlinePoints,
      body.applications,
      body.mainPassage,
      body.crossReferences
    );
  }

  @Get('cross-references-ranked')
  async getRankedCrossReferences(@Query('verse') verse: string) {
    return this.crossReferenceRankingService.getRankedCrossReferences(verse);
  }

  @Get('cross-references-sop-linked')
  async getSOPLinkedCrossReferences(
    @Query('verse') verse: string,
    @Query('language') language?: string,
  ) {
    return this.crossReferenceRankingService.getSOPLinkedCrossReferences(verse, language || 'en');
  }

  @Post('cross-references-outline-map')
  async getOutlineCrossReferenceMap(
    @Body() body: { verse: string; points: Array<{ id?: string; text: string; supportingVerses?: string[] }> },
  ) {
    return this.crossReferenceRankingService.mapCrossReferencesToOutlinePoints(
      body?.verse || '',
      Array.isArray(body?.points) ? body.points : [],
    );
  }

  @Get('cross-references-top')
  async getTopCrossReferences(
    @Query('verse') verse: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit) : 3;
    return this.crossReferenceRankingService.getTopCrossReferences(verse, limitNum);
  }

  @Get('cross-references-edges')
  async getCrossReferenceEdges(@Query('verse') verse: string) {
    return this.crossReferenceRankingService.getCrossReferenceEdges(verse);
  }

  @Get('interpretive-highlights')
  async getInterpretiveHighlights(
    @Query('reference') reference: string,
    @Query('text') text: string
  ) {
    return this.interpretiveHighlightsService.getInterpretiveHighlights(reference, text);
  }

  @Get('interpretive-highlights-formatted')
  async getFormattedHighlights(
    @Query('reference') reference: string,
    @Query('text') text: string
  ) {
    const highlights = await this.interpretiveHighlightsService.getInterpretiveHighlights(reference, text);
    return this.interpretiveHighlightsService.formatHighlightedText(text, highlights);
  }

  @Get('sda-contextual-references')
  async getSDAContextualReferences(
    @Query('passage') passage: string,
    @Query('text') text: string
  ) {
    return this.sdaCrossReferencesService.getContextualReferences(passage, text);
  }

  @Get('sda-interpretive-frame')
  async getSDAInterpretiveFrame(@Query('passage') passage: string) {
    return {
      passage,
      frame: this.sdaCrossReferencesService.getInterpretiveFrame(passage)
    };
  }

  @Post('validate-citation')
  async validateCitation(
    @Body() body: { statement: string; verseReference: string; translation?: string }
  ) {
    return this.citationValidatorService.validateCitation(
      body.statement, 
      body.verseReference, 
      body.translation || 'KJV'
    );
  }

  @Post('validate-citations-bulk')
  async validateCitationsBulk(
    @Body() body: { citations: Array<{ statement: string; verseReferences: string[] }>; translation?: string }
  ) {
    return this.citationValidatorService.validateMultipleCitations(
      body.citations, 
      body.translation || 'KJV'
    );
  }

  @Get('verse-commentary')
  async getVerseCommentary(
    @Query('reference') reference: string,
    @Query('force') force: string,
    @Query('language') language: string,
    @Req() req: any
  ) {
    const userId = req.user?.userId || req.user?.id;
    const forceRegenerate = force === 'true';
    return this.verseCommentaryService.getCommentary(reference, userId, forceRegenerate, language || 'en');
  }

  @Get('morphology-data')
  async getMorphologyData(
    @Query('word') word: string,
    @Query('language') language: 'greek' | 'hebrew'
  ) {
    return this.morphologyDataService.getMorphology(word, language);
  }

  @Get('canonical-themes')
  async getCanonicalThemes(
    @Query('reference') reference: string,
    @Query('language') language?: string
  ) {
    return this.canonicalThemeTracerService.getThemesForPassage(reference, language);
  }

  @Get('sanctuary-connections')
  async getSanctuaryConnections(
    @Query('passage') passage: string,
    @Query('language') language: string,
    @Req() req: any,
  ) {
    if (!passage || !String(passage).trim()) {
      throw new BadRequestException('Missing required passage parameter');
    }
    const userId = req.user?.userId || req.user?.id || 'system';
    try {
      return await this.sanctuaryProphecyMapperService.getSanctuaryConnections(passage, language || 'en', userId);
    } catch (error: any) {
      throw new InternalServerErrorException(error?.message || 'Unable to generate sanctuary connections');
    }
  }

  @Get('prophecy-connections')
  async getProphecyConnections(
    @Query('passage') passage: string,
    @Query('language') language: string,
    @Req() req: any,
  ) {
    if (!passage || !String(passage).trim()) {
      throw new BadRequestException('Missing required passage parameter');
    }
    const userId = req.user?.userId || req.user?.id || 'system';
    try {
      return await this.sanctuaryProphecyMapperService.getProphecyConnections(passage, language || 'en', userId);
    } catch (error: any) {
      throw new InternalServerErrorException(error?.message || 'Unable to generate prophecy connections');
    }
  }

  @Get('sanctuary-threads')
  async getAllSanctuaryThreads() {
    return this.sanctuaryProphecyMapperService.getAllSanctuaryThreads();
  }

  @Get('prophecy-threads')
  async getAllProphecyThreads() {
    return this.sanctuaryProphecyMapperService.getAllProphecyThreads();
  }

  @Get('structural-analysis')
  async getStructuralAnalysis(
    @Query('reference') reference?: string,
    @Query('passage') passage?: string,
    @Query('language') language?: string
  ) {
    const ref = reference || passage;
    if (!ref) {
      throw new Error('Missing reference or passage parameter');
    }
    return this.structuralAnalysisDataService.getStructuralAnalysis(ref, language || 'en');
  }

  @Get('interpretive-challenge')
  async getInterpretiveChallenge(
    @Query('passage') passage: string,
    @Query('language') language?: string
  ) {
    return this.interpretiveChallengesDataService.getInterpretiveChallenge(passage, language || 'en');
  }

  @Get('interpretive-challenges')
  async getInterpretiveChallenges(
    @Query('reference') reference: string,
    @Query('language') language?: string
  ) {
    return this.interpretiveChallengesDataService.getInterpretiveChallenge(reference, language || 'en');
  }

  @Get('word-study-enhanced')
  async getWordStudyEnhanced(@Query('strongs') strongs: string) {
    return this.wordStudyEnhancedService.getWordStudy(strongs);
  }

  @Get('word-study-by-lemma')
  async searchWordByLemma(
    @Query('lemma') lemma: string,
    @Query('language') language: 'greek' | 'hebrew'
  ) {
    return this.wordStudyEnhancedService.searchByLemma(lemma, language);
  }

  @Get('verse-context')
  async getVerseContext(
    @Query('reference') reference: string,
    @Query('language') language?: string
  ) {
    return this.perVerseContextService.getVerseContext(reference, language || 'en');
  }

  @Get('passage-summary')
  async getPassageSummary(
    @Query('reference') reference: string,
    @Query('language') language?: string
  ) {
    return this.passageSummaryService.getPassageSummary(reference, undefined, language || 'en');
  }

  @Get('study-synthesis')
  async getStudySynthesis(
    @Query('reference') reference: string,
    @Query('language') language?: string
  ) {
    return this.studySynthesisService.getStudySynthesis(reference, undefined, language || 'en');
  }

  @Get('translation-comparison-enhanced')
  async getEnhancedTranslationComparison(
    @Query('reference') reference: string,
    @Req() req: any,
    @Query('language') language?: string
  ) {
    const userId = req.user?.userId || req.user?.id;
    return this.translationComparisonEnhancedService.getEnhancedComparison(reference, language || 'en', userId);
  }

  // IMPORTANT: This wildcard route MUST be last to avoid catching other routes
  @Get(':reference')
  async getScriptureHtmlPage(
    @Param('reference') reference: string,
    @Query('translation') translation: string = 'KJV',
    @Res() res: any
  ) {
    const decodedReference = decodeURIComponent(reference);
    const normalizedReference = /\d/.test(decodedReference)
      ? decodedReference
      : `${decodedReference} 1`;
    const passage = await this.scriptureService.getPassage(normalizedReference, translation);
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${normalizedReference} - ${translation}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      color: #e0e0e0;
      font-family: 'Georgia', serif;
      padding: 2rem;
      min-height: 100vh;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(34, 211, 238, 0.3);
      border-radius: 1rem;
      padding: 3rem;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }
    .header {
      border-bottom: 2px solid rgba(34, 211, 238, 0.4);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    h1 {
      color: #22d3ee;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      text-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
    }
    .translation {
      color: #a78bfa;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: 600;
    }
    .verse {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(34, 211, 238, 0.05);
      border-left: 3px solid rgba(34, 211, 238, 0.4);
      border-radius: 0.5rem;
      transition: all 0.3s ease;
    }
    .verse:hover {
      background: rgba(34, 211, 238, 0.1);
      border-left-color: #22d3ee;
      transform: translateX(4px);
    }
    .verse-ref {
      color: #22d3ee;
      font-weight: bold;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      display: block;
      font-family: 'Courier New', monospace;
    }
    .verse-text {
      color: #e0e0e0;
      line-height: 1.8;
      font-size: 1.1rem;
    }
    .footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(34, 211, 238, 0.2);
      text-align: center;
      color: #888;
      font-size: 0.9rem;
    }
    .error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 2rem;
      border-radius: 0.5rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    ${passage && passage.verses && passage.verses.length > 0 ? `
    <div class="header">
      <h1>${normalizedReference}</h1>
      <div class="translation">${translation}</div>
    </div>
    <div class="verses">
      ${passage.verses.map((verse: any) => `
        <div class="verse">
          <span class="verse-ref">${verse.reference}</span>
          <div class="verse-text">${verse.text}</div>
        </div>
      `).join('')}
    </div>
    <div class="footer">
      Clever Sermon - Scripture Study Platform
    </div>
    ` : `
    <div class="error">
      <h2>Passage Not Found</h2>
      <p>Could not retrieve: ${normalizedReference}</p>
    </div>
    `}
  </div>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
