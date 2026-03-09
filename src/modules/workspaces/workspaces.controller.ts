import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Request, Query, Req } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { ContentValidatorService } from './content-validator.service';
import { SermonIntegrityService } from './sermon-integrity.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { UpdateOutlineDto } from './dto/update-outline.dto';
import { UpdateManuscriptDto } from './dto/update-manuscript.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateIllustrationDto } from './dto/update-illustration.dto';
import { UpdateDiscussionQuestionDto } from './dto/update-discussion-question.dto';
import { UpdateCitationDto } from './dto/update-citation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly contentValidatorService: ContentValidatorService,
    private readonly sermonIntegrityService: SermonIntegrityService
  ) {}

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

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, req.user.userId, updateDto);
  }

  @Patch(':id/scripture-cache')
  updateScriptureCache(@Request() req, @Param('id') id: string, @Body() cacheData: any) {
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
  generateOutlines(@Request() req, @Param('id') id: string, @Body('promptOverride') promptOverride?: string) {
    return this.workspacesService.generateOutlines(id, req.user.userId, 3, promptOverride);
  }

  @Post(':id/manuscript')
  generateManuscript(
    @Request() req,
    @Param('id') id: string,
    @Body('outlineId') outlineId: string,
    @Body('promptOverride') promptOverride?: string,
  ) {
    return this.workspacesService.generateManuscript(id, outlineId, req.user.userId, promptOverride);
  }

  @Post(':id/applications')
  generateApplications(@Request() req, @Param('id') id: string, @Body('promptOverride') promptOverride?: string) {
    return this.workspacesService.generateApplications(id, req.user.userId, promptOverride);
  }

  @Post(':id/discussion-questions')
  generateDiscussionQuestions(
    @Request() req,
    @Param('id') id: string,
    @Body('promptOverride') promptOverride?: string,
  ) {
    return this.workspacesService.generateDiscussionQuestions(id, req.user.userId, promptOverride);
  }

  @Post(':id/illustrations')
  generateIllustrations(@Request() req, @Param('id') id: string, @Body('promptOverride') promptOverride?: string) {
    return this.workspacesService.generateIllustrations(id, req.user.userId, promptOverride);
  }

  @Post(':id/citations')
  generateCitations(@Request() req, @Param('id') id: string, @Body('promptOverride') promptOverride?: string) {
    return this.workspacesService.generateCitations(id, req.user.userId, promptOverride);
  }

  @Post(':id/study-report')
  async generateStudyReport(
    @Param('id') id: string,
    @Req() req,
    @Query('includeEGW') includeEGW?: string
  ) {
    const includeEGWBool = includeEGW === 'true';
    return this.workspacesService.generateStudyReport(id, req.user.userId);
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
  async checkSermonIntegrity(@Param('id') id: string, @Req() req) {
    const workspace = await this.workspacesService.findOne(id, req.user.userId);
    
    const selectedOutline = workspace.outlines?.find((o: any) => o.isSelected) || workspace.outlines?.[0];
    const outlinePoints = selectedOutline?.structure?.points || [];
    const applications = (workspace.applications || []).map((a: any) => a.content);
    const citations = (workspace.citations || []).map((c: any) => ({
      statement: c.statement,
      verseReferences: c.verseReferences || []
    }));

    return this.sermonIntegrityService.analyzeSermonIntegrity({
      mainPassage: workspace.mainPassage,
      outlinePoints,
      applications,
      citations
    });
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
    return this.workspacesService.validateCitations(id, req.user.userId, translation);
  }

  @Patch('outlines/:id')
  updateOutline(@Request() req, @Param('id') id: string, @Body() dto: UpdateOutlineDto) {
    return this.workspacesService.updateOutline(req.user.userId, id, dto);
  }

  @Patch('manuscripts/:id')
  updateManuscript(@Request() req, @Param('id') id: string, @Body() dto: UpdateManuscriptDto) {
    return this.workspacesService.updateManuscript(req.user.userId, id, dto);
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
