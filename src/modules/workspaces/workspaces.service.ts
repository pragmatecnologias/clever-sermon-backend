import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { SermonOutline } from '../../entities/sermon-outline.entity';
import { SermonManuscript } from '../../entities/sermon-manuscript.entity';
import { SermonApplication } from '../../entities/sermon-application.entity';
import { DiscussionQuestion } from '../../entities/discussion-question.entity';
import { SermonIllustration } from '../../entities/sermon-illustration.entity';
import { SermonCitation } from '../../entities/sermon-citation.entity';
import { SermonStudyReport } from '../../entities/sermon-study-report.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from '../scripture/scripture.service';
import { SDAAlignmentService } from '../llm/sda-alignment';
import { UpdateOutlineDto } from './dto/update-outline.dto';
import { UpdateManuscriptDto } from './dto/update-manuscript.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UpdateIllustrationDto } from './dto/update-illustration.dto';
import { UpdateDiscussionQuestionDto } from './dto/update-discussion-question.dto';
import { UpdateCitationDto } from './dto/update-citation.dto';
import { EGWService } from '../egw/egw.service';
import { EGWStudyReportIntegrationService } from '../egw/egw-study-report-integration.service';
import { EGWSermonBuilderIntegrationService } from '../egw/egw-sermon-builder-integration.service';
import { WorkspaceHelpers } from './helpers';

@Injectable()
export class WorkspacesService {
  private parseJsonSafe = WorkspaceHelpers.parseJsonSafe;
  private parseListFromResponse = WorkspaceHelpers.parseListFromResponse;
  private parseOutlinePointsResponse = WorkspaceHelpers.parseOutlinePointsResponse;
  private parseOutlineFromResponse = WorkspaceHelpers.parseOutlineFromResponse;
  private normalizeOutlineData = WorkspaceHelpers.normalizeOutlineData;
  private parseIllustrationsFromResponse = WorkspaceHelpers.parseIllustrationsFromResponse;
  private parseCitationsFromResponse = WorkspaceHelpers.parseCitationsFromResponse;
  private logLlmOutput = WorkspaceHelpers.logLlmOutput;

  constructor(
    @InjectRepository(SermonWorkspace)
    private workspaceRepository: Repository<SermonWorkspace>,
    @InjectRepository(SermonOutline)
    private outlineRepository: Repository<SermonOutline>,
    @InjectRepository(SermonManuscript)
    private manuscriptRepository: Repository<SermonManuscript>,
    @InjectRepository(SermonApplication)
    private applicationRepository: Repository<SermonApplication>,
    @InjectRepository(SermonIllustration)
    private illustrationRepository: Repository<SermonIllustration>,
    @InjectRepository(DiscussionQuestion)
    private questionRepository: Repository<DiscussionQuestion>,
    @InjectRepository(SermonCitation)
    private citationRepository: Repository<SermonCitation>,
    @InjectRepository(SermonStudyReport)
    private studyReportRepository: Repository<SermonStudyReport>,
    private llmService: LlmService,
    private scriptureService: ScriptureService,
    private egwService: EGWService,
    private egwStudyReportService: EGWStudyReportIntegrationService,
    private egwSermonBuilderService: EGWSermonBuilderIntegrationService,
  ) {}

  async create(userId: string, createDto: CreateWorkspaceDto): Promise<SermonWorkspace> {
    const workspace = this.workspaceRepository.create({
      ...createDto,
      userId,
    });

    return this.workspaceRepository.save(workspace);
  }

  buildIllustrationsPrompt(workspace: SermonWorkspace, mainPoints: string[]) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    return `Generate 3-5 sermon illustrations based on:
Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Main Points: ${mainPoints.join(', ') || 'N/A'}

Write in ${languageLabel}.

Return a JSON array with items containing:
title, content, verseReference, source (optional), relatedPoint (optional), tags (array, optional).

Rules:
- Include a relevant Bible verse reference for each illustration in verseReference.`;
  }

  buildCitationsPrompt(workspace: SermonWorkspace) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate 5-8 supporting citations and statements for the sermon:
Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Theological Lens: ${workspace.theologicalLens || 'N/A'}

Write in ${languageLabel}.

Return a JSON array with items containing:
statementType (observation, interpretation, application, illustration, external_reference),
statement, verseReferences (array), externalSources (array, optional).`;
  }

  buildOutlinePrompt(workspace: SermonWorkspace) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate a sermon outline for the following:
Title: ${workspace.title}
Series: ${workspace.seriesTitle || 'N/A'}
Main Passage: ${workspace.mainPassage}
Additional Passages: ${workspace.additionalPassages?.length
      ? workspace.additionalPassages.join(', ')
      : 'None'}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Theological Lens: ${workspace.theologicalLens || 'N/A'}
Style: ${workspace.style || 'N/A'}
Story Arc: ${workspace.storyArc || 'N/A'}

Write in ${languageLabel}.

Return the outline in this EXACT format with clear section markers:

INTRODUCTION:
[Write a complete introduction paragraph explaining the sermon topic and context]

POINT 1:
[First main point with full explanation]

POINT 2:
[Second main point with full explanation]

POINT 3:
[Third main point with full explanation]

CONCLUSION:
[Write a complete conclusion paragraph summarizing the message]

CALL TO ACTION:
[Write a specific call to action for the congregation]

DO NOT include metadata, JSON, or any other format. Use only the section markers shown above.`;
  }

  buildOutlinePointsPrompt(workspace: SermonWorkspace, count: number, reportText?: string) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate ${count} DISTINCT variations of 3-5 concise main points for a sermon on:
Title: ${workspace.title}
Series: ${workspace.seriesTitle || 'N/A'}
Main Passage: ${workspace.mainPassage}
Additional Passages: ${workspace.additionalPassages?.length
      ? workspace.additionalPassages.join(', ')
      : 'None'}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Theological Lens: ${workspace.theologicalLens || 'N/A'}
Style: ${workspace.style || 'N/A'}
Story Arc: ${workspace.storyArc || 'N/A'}
${reportText ? `\nStudy Report Context:\n${reportText}` : ''}

Write in ${languageLabel}.

Rules:
- Each variation must be substantively different in framing, emphasis, and wording.
- Use different angles (e.g., personal transformation, family/community impact, doctrinal focus, mission/outreach, etc.).
- Do NOT reuse sentences or phrases across variations.

Return ONLY valid JSON as an array of objects with this shape:
[
  {"angle": "<short angle label>", "points": ["Point 1", "Point 2", "Point 3"]},
  {"angle": "<short angle label>", "points": ["Point 1", "Point 2", "Point 3"]},
  {"angle": "<short angle label>", "points": ["Point 1", "Point 2", "Point 3"]}
]

Only include ${count} variations and no extra text.`;
  }

  buildOutlineFromPointsPrompt(workspace: SermonWorkspace, points: string[], variation: string, reportText?: string) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate a complete sermon outline using these main points:
${points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

${variation}

Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
${reportText ? `\nStudy Report Context:\n${reportText}` : ''}

Write in ${languageLabel}.

Return the outline in this EXACT format with clear section markers:

INTRODUCTION:
[Write a complete introduction paragraph]

POINT 1:
[First main point with full explanation]

POINT 2:
[Second main point with full explanation]

POINT 3:
[Third main point with full explanation]

CONCLUSION:
[Write a complete conclusion paragraph]

CALL TO ACTION:
[Write a specific call to action]

DO NOT include metadata, JSON, or any other format.`;
  }

  buildManuscriptPrompt(workspace: SermonWorkspace, outline: SermonOutline) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate a full sermon manuscript based on this outline:
${JSON.stringify(outline.structure, null, 2)}

Title: ${workspace.title}
Series: ${workspace.seriesTitle || 'N/A'}
Main Passage: ${workspace.mainPassage}
Additional Passages: ${workspace.additionalPassages?.length
      ? workspace.additionalPassages.join(', ')
      : 'None'}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Style: ${workspace.style || 'N/A'}
Story Arc: ${workspace.storyArc || 'N/A'}

Write in ${languageLabel}.

Write a complete sermon manuscript with smooth transitions between points.`;
  }

  buildApplicationsPrompt(workspace: SermonWorkspace, mainPoints: string[], audienceType: string) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate practical applications for ${audienceType} based on:
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Main Points: ${mainPoints.join(', ') || 'N/A'}

Write in ${languageLabel}.

Provide 3-5 specific, actionable applications.

Rules:
- Return ONLY a numbered list (1., 2., 3., etc.).
- Each line must be a single sentence starting with a verb.
- End each line with a verse reference in the format "(Verse: Book 1:1)".
- No tables, no pipes, no markdown, no headings, no extra commentary.`;
  }

  buildDiscussionPrompt(workspace: SermonWorkspace) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate discussion questions for a small group study on:
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}

Write in ${languageLabel}.

Provide 5-7 thought-provoking questions that encourage deep reflection and application.

Rules:
- Return ONLY a numbered list (1., 2., 3., etc.).
- End each question with a verse reference in the format "(Verse: Book 1:1)".
- No tables, no pipes, no markdown, no headings, no extra commentary.`;
  }

  buildStudyReportPrompt(workspace: SermonWorkspace, passageText: string) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate a comprehensive Bible study report for:
Main Passage: ${workspace.mainPassage}
Passage Text:
${passageText}

Theme: ${workspace.theme || 'N/A'}
Theological Lens: ${workspace.theologicalLens || 'N/A'}

Write in ${languageLabel}.

Provide a structured study report with the following sections:
1. Literary Context
2. Historical Context
3. Structural Analysis
4. Key Themes
5. Theological Insights
6. Interpretive Challenges
7. Canonical Connections
8. Practical Applications

Return as JSON with these section keys.`;
  }

  async generateOutlines(
    workspaceId: string,
    userId: string,
    count: number = 3,
    promptOverride?: string,
  ): Promise<SermonOutline[]> {
    const workspace = await this.findOne(workspaceId, userId);

    // Delete existing outlines before regenerating
    await this.outlineRepository.delete({ workspaceId });

    const outlines = [];

    const studyReport = workspace.studyReports?.[0];
    const reportText = studyReport?.sections ? JSON.stringify(studyReport.sections, null, 2) : '';
    const pointsPrompt = promptOverride || this.buildOutlinePointsPrompt(workspace, count, reportText);
    const pointsResponse = await this.llmService.generateCompletion(pointsPrompt, userId, {
      temperature: 0.6,
      maxTokens: 900,
    });
    this.logLlmOutput('outline:points', pointsResponse);

    const pointsVariations = this.parseOutlinePointsResponse(pointsResponse, count);
    const fallbackPoints = this.parseListFromResponse(pointsResponse).slice(0, 5);

    for (let i = 0; i < count; i++) {
      const variationData = pointsVariations[i];
      const points = variationData?.points?.length ? variationData.points : fallbackPoints;
      const variation = variationData?.angle
        ? `Angle: ${variationData.angle}. Keep this outline distinct in tone and structure.`
        : `Outline variation ${i + 1} with a distinct angle and tone.`;
      const prompt = this.buildOutlineFromPointsPrompt(workspace, points, variation, reportText);
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.9,
        maxTokens: 2200,
      });
      this.logLlmOutput('outline', response);
      let outlineData = this.parseJsonSafe(response);
      outlineData = outlineData ? this.normalizeOutlineData(outlineData) : null;
      if (!outlineData) {
        outlineData = this.parseOutlineFromResponse(response);
      }

      const outline = this.outlineRepository.create({
        workspaceId,
        title: `Outline Option ${i + 1}`,
        structure: outlineData,
        isSelected: i === 0,
      });

      outlines.push(await this.outlineRepository.save(outline));
    }

    return outlines;
  }

  async generateManuscript(
    workspaceId: string,
    outlineId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<SermonManuscript> {
    const workspace = await this.findOne(workspaceId, userId);
    const outline = await this.outlineRepository.findOne({ where: { id: outlineId } });
    await this.manuscriptRepository.delete({ workspaceId, outlineId });
    const prompt = promptOverride || this.buildManuscriptPrompt(workspace, outline);
    const manuscriptText = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('manuscript', manuscriptText);

    const manuscript = this.manuscriptRepository.create({
      workspaceId,
      outlineId,
      content: { text: manuscriptText },
      wordCount: manuscriptText.split(' ').length,
      estimatedMinutes: Math.ceil(manuscriptText.split(' ').length / 150),
    });

    return this.manuscriptRepository.save(manuscript);
  }

  async generateApplications(
    workspaceId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<SermonApplication[]> {
    const workspace = await this.findOne(workspaceId, userId);
    await this.applicationRepository.delete({ workspaceId });
    const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
    const mainPoints = Array.isArray(outline?.structure?.points) ? outline.structure.points : [];
    const audienceTypes = [
      'youth',
      'new_believers',
      'leadership',
      'mixed_congregation',
      'pastoral_care',
      'small_group',
    ];
    const applications = [];

    for (const audienceType of audienceTypes) {
      const prompt = promptOverride
        ? this.applyAudiencePrompt(promptOverride, audienceType)
        : this.buildApplicationsPrompt(workspace, mainPoints, audienceType);
      const response = await this.llmService.generateCompletion(prompt, userId);
      this.logLlmOutput(`applications:${audienceType}`, response);
      const appTexts = this.parseListFromResponse(response);

      for (let i = 0; i < appTexts.length; i++) {
        const application = this.applicationRepository.create({
          workspaceId,
          audienceType: audienceType as any,
          content: appTexts[i],
          orderIndex: i,
        });

        applications.push(await this.applicationRepository.save(application));
      }
    }

    return applications;
  }

  async generateDiscussionQuestions(
    workspaceId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<DiscussionQuestion[]> {
    const workspace = await this.findOne(workspaceId, userId);
    await this.questionRepository.delete({ workspaceId });
    const prompt = promptOverride || this.buildDiscussionPrompt(workspace);
    const response = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('questions', response);
    const questionTexts = this.parseListFromResponse(response);

    const questions = [];
    for (let i = 0; i < questionTexts.length; i++) {
      const question = this.questionRepository.create({
        workspaceId,
        question: questionTexts[i],
        orderIndex: i,
      });

      questions.push(await this.questionRepository.save(question));
    }

    return questions;
  }

  async generateIllustrations(
    workspaceId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<SermonIllustration[]> {
    const workspace = await this.findOne(workspaceId, userId);
    await this.illustrationRepository.delete({ workspaceId });
    const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
    const mainPoints = Array.isArray(outline?.structure?.points) ? outline.structure.points : [];
    const prompt = promptOverride || this.buildIllustrationsPrompt(workspace, mainPoints);
    const response = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('illustrations', response);

    const parsed = this.parseJsonSafe(response) || this.parseIllustrationsFromResponse(response);
    const items = Array.isArray(parsed) ? parsed : [];
    const illustrations = [];

    for (const item of items) {
      const illustration = this.illustrationRepository.create({
        workspaceId,
        title: item.title || null,
        content: item.content || item.text || '',
        source: item.source || item.verseReference || item.verseReferences?.[0] || null,
        relatedPoint: item.relatedPoint || null,
        tags: Array.isArray(item.tags) ? item.tags : null,
      });
      illustrations.push(await this.illustrationRepository.save(illustration));
    }

    return illustrations;
  }

  async generateCitations(
    workspaceId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<SermonCitation[]> {
    const workspace = await this.findOne(workspaceId, userId);
    await this.citationRepository.delete({ workspaceId });
    const prompt = promptOverride || this.buildCitationsPrompt(workspace);
    const response = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('citations', response);

    const parsed = this.parseJsonSafe(response) || this.parseCitationsFromResponse(response);
    const items = Array.isArray(parsed) ? parsed : [];
    const citations = [];

    for (const item of items) {
      const citation = this.citationRepository.create({
        workspaceId,
        statementType: item.statementType || 'observation',
        statement: item.statement || item.text || '',
        verseReferences: Array.isArray(item.verseReferences) ? item.verseReferences : null,
        externalSources: Array.isArray(item.externalSources) ? item.externalSources : null,
        isVerified: false,
      });
      citations.push(await this.citationRepository.save(citation));
    }

    return citations;
  }

  async generateStudyReport(
    workspaceId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<SermonStudyReport> {
    const workspace = await this.findOne(workspaceId, userId);

    // Delete existing study reports before regenerating
    await this.studyReportRepository.delete({ workspaceId });

    const mainPassage = await this.scriptureService.getPassage(workspace.mainPassage);
    const passageText = Array.isArray(mainPassage?.verses)
      ? mainPassage.verses.map((verse: any) => `${verse.reference} ${verse.text}`).join('\n')
      : JSON.stringify(mainPassage || {});

    const prompt = promptOverride || this.buildStudyReportPrompt(workspace, passageText);
    const response = await this.llmService.generateCompletion(prompt, userId, {
      temperature: 0.4,
      maxTokens: 2200,
    });
    this.logLlmOutput('study-report', response);

    const parsed = this.parseJsonSafe(response);
    const report = this.studyReportRepository.create({
      workspaceId,
      sections: parsed || { raw: response },
      rawResponse: parsed ? null : response,
    });

    return this.studyReportRepository.save(report);
  }

  async validateCitations(workspaceId: string, userId: string, translationCode: string = 'KJV') {
    const workspace = await this.findOne(workspaceId, userId);
    const citations = workspace?.citations || [];
    const results = [] as { id: string; isVerified: boolean; errors?: string[] }[];

    const stopWords = new Set([
      'the', 'and', 'for', 'that', 'with', 'from', 'this', 'these', 'those', 'are', 'was', 'were', 'has', 'have',
      'had', 'not', 'but', 'you', 'your', 'his', 'her', 'their', 'they', 'them', 'our', 'its', 'into', 'over',
      'under', 'upon', 'within', 'about', 'after', 'before', 'through', 'because', 'while', 'when', 'then',
    ]);

    for (const citation of citations) {
      const verseRefs = Array.isArray(citation.verseReferences) ? citation.verseReferences : [];
      const errors: string[] = [];
      for (const verseRef of verseRefs) {
        try {
          const passage = await this.scriptureService.getPassage(verseRef, translationCode);
          if (!passage || !passage.verses?.length) {
            errors.push(`Missing verse: ${verseRef}`);
          } else if (citation.statement) {
            const passageTranslation =
              (passage.translation || passage.translation_id || passage.translationId || '').toString();
            if (passageTranslation && passageTranslation.toLowerCase() !== translationCode.toLowerCase()) {
              errors.push(`Translation mismatch for ${verseRef}`);
            }
            const passageText = passage.verses.map((verse: any) => verse.text || '').join(' ').toLowerCase();
            const statementTokens = citation.statement
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, '')
              .split(/\s+/)
              .filter(Boolean)
              .filter((token) => !stopWords.has(token));
            const matched = statementTokens.filter((token) => passageText.includes(token));
            if (statementTokens.length && matched.length === 0) {
              errors.push(`Unsupported claim for ${verseRef}`);
            }
          }
        } catch {
          errors.push(`Lookup failed: ${verseRef}`);
        }
      }

      const isVerified = errors.length === 0 && verseRefs.length > 0;
      await this.citationRepository.update({ id: citation.id }, { isVerified });
      results.push({ id: citation.id, isVerified, errors: errors.length ? errors : undefined });
    }

    return results;
  }

  async findAll(userId: string): Promise<SermonWorkspace[]> {
    return this.workspaceRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<SermonWorkspace> {
    return this.workspaceRepository.findOne({
      where: { id, userId },
      relations: [
        'outlines',
        'manuscripts',
        'applications',
        'illustrations',
        'discussionQuestions',
        'citations',
        'dnaAnalyses',
        'studyReports',
      ],
    });
  }

  async update(id: string, userId: string, updateDto: UpdateWorkspaceDto): Promise<SermonWorkspace> {
    await this.workspaceRepository.update({ id, userId }, updateDto);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.workspaceRepository.delete({ id, userId });
  }

  applyAudiencePrompt(prompt: string, audienceType: string) {
    return prompt
      .replace(/\{\{\s*audienceType\s*\}\}/gi, audienceType)
      .replace(/\{\{\s*AUDIENCE\s*\}\}/g, audienceType);
  }

  async getPromptPreview(
    workspaceId: string,
    userId: string,
    type: 'outline' | 'manuscript' | 'applications' | 'questions' | 'illustrations' | 'citations' | 'study-report',
    outlineId?: string,
  ) {
    const workspace = await this.findOne(workspaceId, userId);
    if (!workspace) {
      return null;
    }

    if (type === 'outline') {
      return this.buildOutlinePrompt(workspace);
    }

    if (type === 'manuscript') {
      const selectedOutline = outlineId
        ? await this.outlineRepository.findOne({ where: { id: outlineId } })
        : workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
      return this.buildManuscriptPrompt(workspace, selectedOutline);
    }

    if (type === 'applications') {
      const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
      const mainPoints = Array.isArray(outline?.structure?.points) ? outline.structure.points : [];
      return this.buildApplicationsPrompt(workspace, mainPoints, '{{audienceType}}');
    }

    if (type === 'illustrations') {
      const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
      const mainPoints = Array.isArray(outline?.structure?.points) ? outline.structure.points : [];
      return this.buildIllustrationsPrompt(workspace, mainPoints);
    }

    if (type === 'citations') {
      return this.buildCitationsPrompt(workspace);
    }

    if (type === 'study-report') {
      const passage = await this.scriptureService.getPassage(workspace.mainPassage);
      const passageText = Array.isArray(passage?.verses)
        ? passage.verses.map((verse: any) => `${verse.reference} ${verse.text}`).join('\n')
        : JSON.stringify(passage || {});
      return this.buildStudyReportPrompt(workspace, passageText);
    }

    return this.buildDiscussionPrompt(workspace);
  }

  async updateOutline(userId: string, id: string, dto: UpdateOutlineDto): Promise<SermonOutline> {
    const outline = await this.outlineRepository.findOne({ where: { id }, relations: ['workspace'] });
    if (!outline || outline.workspace.userId !== userId) {
      return null;
    }
    await this.outlineRepository.update({ id }, dto);
    return this.outlineRepository.findOne({ where: { id } });
  }

  async updateManuscript(userId: string, id: string, dto: UpdateManuscriptDto): Promise<SermonManuscript> {
    const manuscript = await this.manuscriptRepository.findOne({ where: { id }, relations: ['workspace'] });
    if (!manuscript || manuscript.workspace.userId !== userId) {
      return null;
    }
    const updatePayload: Partial<SermonManuscript> = {};
    if (dto.transitions) {
      updatePayload.transitions = dto.transitions;
    }
    const text = typeof dto?.content === 'string' ? dto.content : dto?.content?.text;
    if (text) {
      updatePayload.content = typeof dto.content === 'string' ? { text } : dto.content;
      updatePayload.wordCount = text.split(' ').filter(Boolean).length;
      updatePayload.estimatedMinutes = Math.ceil(updatePayload.wordCount / 150);
    }
    await this.manuscriptRepository.update({ id }, updatePayload);
    return this.manuscriptRepository.findOne({ where: { id } });
  }

  async updateApplication(userId: string, id: string, dto: UpdateApplicationDto): Promise<SermonApplication> {
    const application = await this.applicationRepository.findOne({ where: { id }, relations: ['workspace'] });
    if (!application || application.workspace.userId !== userId) {
      return null;
    }
    await this.applicationRepository.update({ id }, dto);
    return this.applicationRepository.findOne({ where: { id } });
  }

  async updateIllustration(userId: string, id: string, dto: UpdateIllustrationDto): Promise<SermonIllustration> {
    const illustration = await this.illustrationRepository.findOne({ where: { id }, relations: ['workspace'] });
    if (!illustration || illustration.workspace.userId !== userId) {
      return null;
    }
    await this.illustrationRepository.update({ id }, dto);
    return this.illustrationRepository.findOne({ where: { id } });
  }

  async updateDiscussionQuestion(userId: string, id: string, dto: UpdateDiscussionQuestionDto): Promise<DiscussionQuestion> {
    const question = await this.questionRepository.findOne({ where: { id }, relations: ['workspace'] });
    if (!question || question.workspace.userId !== userId) {
      return null;
    }
    await this.questionRepository.update({ id }, dto);
    return this.questionRepository.findOne({ where: { id } });
  }

  async updateCitation(userId: string, id: string, dto: UpdateCitationDto): Promise<SermonCitation> {
    const citation = await this.citationRepository.findOne({ where: { id }, relations: ['workspace'] });
    if (!citation || citation.workspace.userId !== userId) {
      return null;
    }
    await this.citationRepository.update({ id }, dto);
    return this.citationRepository.findOne({ where: { id } });
  }
}
