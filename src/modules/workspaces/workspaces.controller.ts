import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Request, Query, Req, Headers } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { ContentValidatorService } from './content-validator.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { UpdateOutlineDto } from './dto/update-outline.dto';
import { UpdateManuscriptDto } from './dto/update-manuscript.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateIllustrationDto } from './dto/update-illustration.dto';
import { UpdateDiscussionQuestionDto } from './dto/update-discussion-question.dto';
import { UpdateCitationDto } from './dto/update-citation.dto';
import { UpdateScriptureCacheDto } from './dto/update-scripture-cache.dto';
import { RecordClaimReviewDto } from './dto/record-claim-review.dto';
import { RecordIntegrityIssueReviewDto } from './dto/record-integrity-issue-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGenerationService } from './workspace-generation.service';
import { WorkspaceTrustService } from './workspace-trust.service';
import { WorkspaceMediaPackService } from './workspace-media-pack.service';
import { ComposeMediaPackDto } from './dto/compose-media-pack.dto';
import { ScriptureService } from '../scripture/scripture.service';
import { PassageSummaryService } from '../scripture/passage-summary.service';
import { StudySynthesisService } from '../scripture/study-synthesis.service';
import { StructuralAnalysisDataService } from '../scripture/structural-analysis-data.service';
import { InterpretiveChallengesDataService } from '../scripture/interpretive-challenges-data.service';
import { TranslationComparisonEnhancedService } from '../scripture/translation-comparison-enhanced.service';
import { SermonStyle, StoryArc, WorkspaceStatus } from '../../entities/sermon-workspace.entity';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  private readonly demoWorkspaceTitle = 'Demo Sermon: John 3:16';
  private readonly demoSeriesTitle = 'Demo Sermons';

  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly workspaceGenerationService: WorkspaceGenerationService,
    private readonly workspaceTrustService: WorkspaceTrustService,
    private readonly workspaceMediaPackService: WorkspaceMediaPackService,
    private readonly contentValidatorService: ContentValidatorService,
    private readonly scriptureService: ScriptureService,
    private readonly passageSummaryService: PassageSummaryService,
    private readonly studySynthesisService: StudySynthesisService,
    private readonly structuralAnalysisDataService: StructuralAnalysisDataService,
    private readonly interpretiveChallengesDataService: InterpretiveChallengesDataService,
    private readonly translationComparisonEnhancedService: TranslationComparisonEnhancedService,
  ) {}

  private wantsAsync(asyncMode?: string) {
    return asyncMode === 'true' || asyncMode === '1' || asyncMode === 'yes';
  }

  private isCompleteProgress(progress: any) {
    return Boolean(
      progress?.themeConfigured &&
      progress?.passageExplored &&
      progress?.studyGenerated &&
      progress?.outlineCreated &&
      progress?.manuscriptWritten &&
      progress?.refineCompleted &&
      progress?.deliverPrepared,
    );
  }

  private isDemoWorkspace(workspace: { title?: string; metadata?: Record<string, any> }) {
    return /demo sermon:\s*john 3:16/i.test(String(workspace?.title || ''))
      || Boolean((workspace?.metadata || {})?.demo);
  }

  private async buildDemoScriptureCache(userId: string, language: string) {
    const translationCode = language === 'es' ? 'RVR1960' : 'KJV';
    const reference = 'John 3:16';
    const cache: Record<string, any> = {};

    try {
      cache.scriptureResult = await this.scriptureService.getPassage(reference, translationCode);
      cache.scriptureTranslation = translationCode;
      cache.scriptureLastLookup = `${reference}:${translationCode}`;
      cache.lookupHistory = [
        {
          reference,
          translation: translationCode,
          lookedUpAt: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error('Demo scripture lookup failed', error);
    }

    const safeLoad = async (label: string, loader: () => Promise<any>) => {
      try {
        return await loader();
      } catch (error) {
        console.error(`Demo ${label} failed`, error);
        return null;
      }
    };

    cache.passageSummary = await safeLoad('passage summary', () =>
      this.passageSummaryService.getPassageSummary(reference, userId, language),
    );
    cache.studySynthesis = await safeLoad('study synthesis', () =>
      this.studySynthesisService.getStudySynthesis(reference, userId, language),
    );
    cache.structuralAnalysis = await safeLoad('structural analysis', () =>
      this.structuralAnalysisDataService.getStructuralAnalysis(reference, language),
    );
    cache.interpretiveChallenges = await safeLoad('interpretive challenges', () =>
      this.interpretiveChallengesDataService.getInterpretiveChallenge(reference, language),
    );
    cache.translationComparison = await safeLoad('translation comparison', () =>
      this.translationComparisonEnhancedService.getEnhancedComparison(reference, language, userId),
    );

    return cache;
  }

  private async findLatestDemoWorkspace(userId: string) {
    const workspaces = await this.workspacesService.findAll(userId);
    const candidates = [...workspaces]
      .filter((workspace) => this.isDemoWorkspace(workspace) && workspace.status !== WorkspaceStatus.ARCHIVED)
      .sort((left, right) => {
        const leftTime = new Date(left.createdAt || left.updatedAt || 0).getTime();
        const rightTime = new Date(right.createdAt || right.updatedAt || 0).getTime();
        return leftTime - rightTime;
      });

    const exactTitleCompleted = candidates.filter(
      (workspace) => workspace.status === WorkspaceStatus.COMPLETED && workspace.title === this.demoWorkspaceTitle,
    );
    if (exactTitleCompleted.length > 0) {
      return exactTitleCompleted[0];
    }

    const exactTitleAny = candidates.filter((workspace) => workspace.title === this.demoWorkspaceTitle);
    if (exactTitleAny.length > 0) {
      return exactTitleAny[0];
    }

    return candidates[0] || null;
  }

  private async normalizeDemoWorkspace(userId: string, workspaceId: string) {
    return this.workspacesService.update(workspaceId, userId, {
      title: this.demoWorkspaceTitle,
      seriesTitle: this.demoSeriesTitle,
      mainPassage: 'John 3:16',
      additionalPassages: ['Romans 5:8', 'Ephesians 2:8-9'],
      theme: 'God’s love and salvation',
      audienceProfile: 'General Sabbath congregation with members, visitors, young people, and people who may feel spiritually distant from God.',
      sermonGoals: 'Help people see God as a loving Father who welcomes repentant sinners, restores dignity, and invites them back into relationship.',
      theologicalLens: 'adventist',
      style: SermonStyle.EXPOSITORY,
      storyArc: StoryArc.PROBLEM_TRUTH_RESPONSE,
      language: 'en',
      egwEnabled: true,
      metadata: {
        demo: {
          enabled: true,
          kind: 'john_3_16',
        },
        planning: {
          sermonDate: '2026-05-18',
          targetLengthMinutes: 25,
          serviceType: 'sabbath_worship',
          appealStyle: 'invitation',
          ministryMode: 'evangelistic',
          bilingualMode: 'none',
        },
      },
    });
  }

  private async prepareDemoWorkspaceArtifacts(workspaceId: string, userId: string, authorization?: string) {
    const workspace = await this.workspacesService.findOne(workspaceId, userId);
    const beforeState = await this.workspacesService.getWorkspaceState(workspace.id, userId);

    if (!beforeState.progress?.passageExplored) {
      const scriptureCache = await this.buildDemoScriptureCache(userId, workspace.language || 'en');
      await this.workspacesService.updateScriptureCache(workspace.id, userId, scriptureCache);
    }

    if (!beforeState.progress?.studyGenerated) {
      await this.workspacesService.generateStudyReport(workspace.id, userId);
    }

    if (!beforeState.progress?.outlineCreated) {
      await this.workspacesService.generateSermonCore(workspace.id, userId);
      const outlines = await this.workspacesService.generateOutlines(workspace.id, userId, 3);
      const selectedOutline = outlines.find((outline) => outline.isSelected) || outlines[0] || null;
      if (selectedOutline && !selectedOutline.isSelected) {
        await this.workspacesService.updateOutline(userId, selectedOutline.id, { isSelected: true });
      }
    }

    if (!beforeState.progress?.manuscriptWritten) {
      const refreshed = await this.workspacesService.findOne(workspace.id, userId);
      const outline = refreshed.outlines?.find((item) => item.isSelected) || refreshed.outlines?.[0];
      if (!outline) {
        throw new Error('Demo outline is required before drafting the manuscript.');
      }
      await this.workspacesService.generateManuscript(workspace.id, outline.id, userId);
    }

    if (!beforeState.progress?.refineCompleted || beforeState.artifacts?.citations === 0) {
      await this.workspacesService.generateCitations(workspace.id, userId);
    }

    if (!beforeState.progress?.refineCompleted) {
      await this.workspacesService.runIntegrityCheck(workspace.id, userId);
    }

    if (!beforeState.progress?.deliverPrepared) {
      await this.workspaceMediaPackService.composeMediaPack(workspace.id, userId, authorization, {
        deckIntent: 'social_summary',
        includeDeck: true,
      });
      await this.workspaceMediaPackService.composeMediaPack(workspace.id, userId, authorization, {
        deckIntent: 'sermon_presentation',
        includeDeck: true,
        exportTypes: ['pptx', 'pdf'],
      });
    }

    const finalWorkspace = await this.workspacesService.update(workspace.id, userId, {
      status: WorkspaceStatus.COMPLETED,
      metadata: {
        ...(workspace.metadata || {}),
        demo: {
          enabled: true,
          kind: 'john_3_16',
          completedAt: new Date().toISOString(),
        },
      },
    });

    const finalState = await this.workspacesService.getWorkspaceState(finalWorkspace.id, userId);
    if (!this.isCompleteProgress(finalState.progress)) {
      throw new Error('Demo preparation finished without reaching 100% progress.');
    }

    return finalState;
  }

  @Post('demo-sermon/prepare')
  async prepareDemoSermon(
    @Request() req,
    @Headers('authorization') authorization?: string,
  ) {
    const userId = req.user.userId;
    let created = false;
    let workspace = await this.findLatestDemoWorkspace(userId);

    if (!workspace) {
      workspace = await this.workspacesService.create(userId, {
        title: this.demoWorkspaceTitle,
        seriesTitle: this.demoSeriesTitle,
        mainPassage: 'John 3:16',
        additionalPassages: ['Romans 5:8', 'Ephesians 2:8-9'],
        theme: 'God’s love and salvation',
        audienceProfile: 'General Sabbath congregation with members, visitors, young people, and people who may feel spiritually distant from God.',
        sermonGoals: 'Help people see God as a loving Father who welcomes repentant sinners, restores dignity, and invites them back into relationship.',
        theologicalLens: 'adventist',
        style: SermonStyle.EXPOSITORY,
        storyArc: StoryArc.PROBLEM_TRUTH_RESPONSE,
        language: 'en',
        egwEnabled: true,
        metadata: {
          demo: {
            enabled: true,
            kind: 'john_3_16',
          },
          planning: {
            sermonDate: '2026-05-18',
            targetLengthMinutes: 25,
            serviceType: 'sabbath_worship',
            appealStyle: 'invitation',
            ministryMode: 'evangelistic',
            bilingualMode: 'none',
          },
        },
      });
      created = true;
    } else {
      const needsNormalization =
        workspace.title !== this.demoWorkspaceTitle ||
        workspace.seriesTitle !== this.demoSeriesTitle ||
        workspace.mainPassage !== 'John 3:16' ||
        workspace.language !== 'en' ||
        workspace.style !== 'expository' ||
        workspace.storyArc !== 'problem_truth_response' ||
        workspace.egwEnabled !== true ||
        workspace.theologicalLens !== 'adventist';

      if (needsNormalization) {
        workspace = await this.normalizeDemoWorkspace(userId, workspace.id);
      }
    }

    const beforeState = await this.workspacesService.getWorkspaceState(workspace.id, userId);
    if (this.isCompleteProgress(beforeState.progress)) {
      if (workspace.status !== WorkspaceStatus.COMPLETED) {
        workspace = await this.workspacesService.update(workspace.id, userId, {
          status: WorkspaceStatus.COMPLETED,
          metadata: {
            ...(workspace.metadata || {}),
            demo: {
              enabled: true,
              kind: 'john_3_16',
              completedAt: new Date().toISOString(),
            },
          },
        });
      }

      return {
        workspaceId: workspace.id,
        created: false,
        prepared: true,
        state: await this.workspacesService.getWorkspaceState(workspace.id, userId),
      };
    }

    const demoPrepStartedAt = new Date().toISOString();
    const demoMetadata = {
      ...(workspace.metadata || {}),
      demo: {
        enabled: true,
        kind: 'john_3_16',
        preparingAt: demoPrepStartedAt,
      },
    };

    workspace = await this.workspacesService.update(workspace.id, userId, {
      metadata: demoMetadata,
    });

    void this.prepareDemoWorkspaceArtifacts(workspace.id, userId, authorization)
      .then(async () => {
        await this.workspacesService.update(workspace.id, userId, {
          status: WorkspaceStatus.COMPLETED,
        });
      })
      .catch(async (error) => {
        console.error('Demo preparation failed', error);
        await this.workspacesService.update(workspace.id, userId, {
          metadata: {
            ...(workspace.metadata || {}),
            demo: {
              ...(workspace.metadata as any)?.demo,
              enabled: true,
              kind: 'john_3_16',
              preparingAt: demoPrepStartedAt,
              preparationFailedAt: new Date().toISOString(),
              preparationError: error?.message || 'Demo preparation failed.',
            },
          },
        });
      });

    return {
      workspaceId: workspace.id,
      created,
      prepared: false,
      state: await this.workspacesService.getWorkspaceState(workspace.id, userId),
      status: 'preparing',
    };
  }

  @Post()
  create(@Request() req, @Body() createDto: CreateWorkspaceDto) {
    return this.workspacesService.create(req.user.userId, createDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.workspacesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.workspacesService.findOne(id, req.user.userId);
  }

  @Get(':id/state')
  getState(@Request() req, @Param('id') id: string) {
    return this.workspacesService.getWorkspaceState(id, req.user.userId);
  }

  @Post(':id/claim-reviews')
  recordClaimReview(
    @Request() req,
    @Param('id') id: string,
    @Body() body: RecordClaimReviewDto,
  ) {
    return this.workspaceTrustService.recordClaimReview(id, req.user.userId, body);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, req.user.userId, updateDto);
  }

  @Patch(':id/scripture-cache')
  updateScriptureCache(
    @Request() req,
    @Param('id') id: string,
    @Query('payload') payload?: string,
    @Body() body?: UpdateScriptureCacheDto,
  ) {
    let cacheData: Record<string, any> = {};
    const payloadText = typeof payload === 'string' && payload.length > 0
      ? payload
      : typeof body?.payload === 'string'
        ? body.payload
        : null;

    if (payloadText) {
      try {
        cacheData = JSON.parse(payloadText);
      } catch {
        cacheData = {};
      }
    } else if (req.body && typeof req.body === 'object') {
      cacheData = req.body;
    }

    return this.workspacesService.updateScriptureCache(id, req.user.userId, cacheData);
  }

  @Post(':id/references')
  async addReference(@Request() req, @Param('id') id: string, @Body() body: { reference: string, context?: string }) {
    return this.workspacesService.addReference(id, req.user.userId, body.reference, body.context);
  }

  @Get(':id/scripture-cache')
  getScriptureCache(@Request() req, @Param('id') id: string) {
    return this.workspacesService.getScriptureCache(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.workspacesService.remove(id, req.user.userId);
  }

  @Get(':id/prompts')
  previewPrompt(
    @Request() req,
    @Param('id') id: string,
    @Query('type') type: 'outline' | 'manuscript' | 'applications' | 'questions' | 'illustrations' | 'citations' | 'study-report',
    @Query('outlineId') outlineId?: string,
  ) {
    return this.workspacesService.getPromptPreview(id, req.user.userId, type, outlineId);
  }

  @Post(':id/outlines')
  generateOutlines(
    @Request() req,
    @Param('id') id: string,
    @Body('promptOverride') promptOverride?: string,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'outline', promptOverride);
    }
    return this.workspacesService.generateOutlines(id, req.user.userId, 3, promptOverride);
  }

  @Post(':id/manuscript')
  generateManuscript(
    @Request() req,
    @Param('id') id: string,
    @Body('outlineId') outlineId: string,
    @Body('promptOverride') promptOverride?: string,
    @Body('manuscriptOptions') manuscriptOptions?: Record<string, any>,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'manuscript', promptOverride);
    }
    return this.workspacesService.generateManuscript(
      id,
      outlineId,
      req.user.userId,
      promptOverride,
      manuscriptOptions,
    );
  }

  @Post(':id/applications')
  generateApplications(
    @Request() req,
    @Param('id') id: string,
    @Body('promptOverride') promptOverride?: string,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'applications', promptOverride);
    }
    return this.workspacesService.generateApplications(id, req.user.userId, promptOverride);
  }

  @Post(':id/discussion-questions')
  generateDiscussionQuestions(
    @Request() req,
    @Param('id') id: string,
    @Body('promptOverride') promptOverride?: string,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'discussion-questions', promptOverride);
    }
    return this.workspacesService.generateDiscussionQuestions(id, req.user.userId, promptOverride);
  }

  @Post(':id/illustrations')
  generateIllustrations(
    @Request() req,
    @Param('id') id: string,
    @Body('promptOverride') promptOverride?: string,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'illustrations', promptOverride);
    }
    return this.workspacesService.generateIllustrations(id, req.user.userId, promptOverride);
  }

  @Post(':id/citations')
  generateCitations(
    @Request() req,
    @Param('id') id: string,
    @Body('promptOverride') promptOverride?: string,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'citations', promptOverride);
    }
    return this.workspacesService.generateCitations(id, req.user.userId, promptOverride);
  }

  @Post(':id/study-report')
  async generateStudyReport(
    @Param('id') id: string,
    @Req() req,
    @Body('promptOverride') promptOverride?: string,
    @Query('includeEGW') includeEGW?: string,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'study-report', promptOverride, includeEGW === 'true');
    }
    return this.workspacesService.generateStudyReport(id, req.user.userId, promptOverride);
  }

  @Post(':id/sermon-core')
  async generateSermonCore(
    @Param('id') id: string,
    @Req() req,
    @Body('promptOverride') promptOverride?: string,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'sermon-core', promptOverride);
    }
    return this.workspacesService.generateSermonCore(id, req.user.userId);
  }

  @Get(':id/jobs/:jobId')
  getGenerationJobStatus(
    @Request() req,
    @Param('id') id: string,
    @Param('jobId') jobId: string,
  ) {
    return this.workspaceGenerationService.getWorkspaceGenerationJobStatus(id, jobId, req.user.userId);
  }

  @Post(':id/media-suggestions')
  generateMediaSuggestions(
    @Request() req,
    @Param('id') id: string,
    @Body('promptOverride') promptOverride?: string,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'media-suggestions', promptOverride);
    }
    return this.workspacesService.generateMediaSuggestions(id, req.user.userId, promptOverride);
  }

  @Post(':id/media-pack/compose')
  composeMediaPack(
    @Request() req,
    @Param('id') id: string,
    @Body() body: ComposeMediaPackDto,
    @Query('payload') payload?: string,
    @Headers('authorization') authorization?: string,
  ) {
    let payloadData: Record<string, any> = body || {};
    if (typeof payload === 'string' && payload.length > 0) {
      try {
        payloadData = JSON.parse(payload);
      } catch {
        payloadData = body || {};
      }
    }
    return this.workspaceMediaPackService.composeMediaPack(id, req.user.userId, authorization, payloadData || {});
  }

  @Post(':id/socratic-coach')
  async generateSocraticCoach(
    @Param('id') id: string,
    @Req() req,
    @Body()
    body: {
      mode?: 'refine' | 'self_reflection';
      listenerProfile?: 'new_believer' | 'skeptic' | 'teenager' | 'bible_scholar' | 'family_church' | string;
      questionId?: string;
      answer?: string;
      promptOverride?: string;
    },
  ) {
    return this.workspacesService.generateSocraticCoach(id, req.user.userId, body || {});
  }

  @Post(':id/validate-content')
  async validateContent(@Param('id') id: string, @Req() req) {
    const workspace = await this.workspacesService.findOne(id, req.user.userId);
    
    return this.contentValidatorService.validateSermonContent({
      outline: workspace.outlines?.find(o => o.isSelected) || workspace.outlines?.[0],
      manuscript: workspace.manuscripts?.[0],
      applications: workspace.applications,
      illustrations: workspace.illustrations
    });
  }

  @Post(':id/integrity-check')
  async checkSermonIntegrity(
    @Param('id') id: string,
    @Req() req,
    @Query('async') asyncMode?: string,
  ) {
    if (this.wantsAsync(asyncMode)) {
      return this.workspaceGenerationService.queueWorkspaceGeneration(id, req.user.userId, 'integrity-check');
    }
    return this.workspacesService.runIntegrityCheck(id, req.user.userId);
  }

  @Post(':id/integrity-issue-reviews')
  recordIntegrityIssueReview(
    @Request() req,
    @Param('id') id: string,
    @Body() body: RecordIntegrityIssueReviewDto,
  ) {
    return this.workspaceTrustService.recordIntegrityIssueReview(id, req.user.userId, body);
  }

  @Post(':id/auto-fix-content')
  async autoFixContent(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Req() req
  ) {
    return this.contentValidatorService.validateAndTransform(body.content, true);
  }

  @Post(':id/citations/validate')
  validateCitations(
    @Request() req,
    @Param('id') id: string,
    @Query('translation') translation?: string,
  ) {
    return this.workspaceTrustService.validateCitations(id, req.user.userId, translation);
  }

  @Patch('outlines/:id')
  updateOutline(@Request() req, @Param('id') id: string, @Body() dto: UpdateOutlineDto) {
    return this.workspacesService.updateOutline(req.user.userId, id, dto);
  }

  @Post(':workspaceId/outlines/history/:historyIndex/restore')
  restoreOutlineHistory(
    @Request() req,
    @Param('workspaceId') workspaceId: string,
    @Param('historyIndex') historyIndex: string,
  ) {
    return this.workspacesService.restoreOutlineHistory(req.user.userId, workspaceId, Number(historyIndex));
  }

  @Patch('manuscripts/:id')
  updateManuscript(@Request() req, @Param('id') id: string, @Body() dto: UpdateManuscriptDto) {
    return this.workspacesService.updateManuscript(req.user.userId, id, dto);
  }

  @Post(':workspaceId/manuscripts/history/:historyIndex/restore')
  restoreManuscriptHistory(
    @Request() req,
    @Param('workspaceId') workspaceId: string,
    @Param('historyIndex') historyIndex: string,
  ) {
    return this.workspacesService.restoreManuscriptHistory(req.user.userId, workspaceId, Number(historyIndex));
  }

  @Post(':id/manuscripts/:manuscriptId/cues/regenerate')
  regenerateManuscriptCues(
    @Request() req,
    @Param('id') id: string,
    @Param('manuscriptId') manuscriptId: string,
  ) {
    return this.workspacesService.regenerateManuscriptCues(id, manuscriptId, req.user.userId);
  }

  @Post(':id/manuscripts/:manuscriptId/repair/apply')
  applyManuscriptRepair(
    @Request() req,
    @Param('id') id: string,
    @Param('manuscriptId') manuscriptId: string,
    @Body()
    body: {
      selectedIssueIds?: string[];
      doNotTouchAnchors?: string[];
      conversationSummary?: string;
      mode?: 'targeted' | string;
    },
  ) {
    return this.workspaceGenerationService.enqueueManuscriptRepair(id, manuscriptId, req.user.userId, body || {});
  }

  @Get(':id/manuscripts/:manuscriptId/repair/jobs/:jobId')
  getManuscriptRepairStatus(
    @Request() req,
    @Param('id') id: string,
    @Param('manuscriptId') manuscriptId: string,
    @Param('jobId') jobId: string,
  ) {
    return this.workspaceGenerationService.getManuscriptRepairJobStatus(id, manuscriptId, jobId, req.user.userId);
  }

  @Patch('applications/:id')
  updateApplication(@Request() req, @Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.workspacesService.updateApplication(req.user.userId, id, dto);
  }

  @Patch('illustrations/:id')
  updateIllustration(@Request() req, @Param('id') id: string, @Body() dto: UpdateIllustrationDto) {
    return this.workspacesService.updateIllustration(req.user.userId, id, dto);
  }

  @Patch('discussion-questions/:id')
  updateDiscussionQuestion(@Request() req, @Param('id') id: string, @Body() dto: UpdateDiscussionQuestionDto) {
    return this.workspacesService.updateDiscussionQuestion(req.user.userId, id, dto);
  }

  @Patch('citations/:id')
  updateCitation(@Request() req, @Param('id') id: string, @Body() dto: UpdateCitationDto) {
    return this.workspacesService.updateCitation(req.user.userId, id, dto);
  }
}
