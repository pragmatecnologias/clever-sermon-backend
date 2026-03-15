import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { SermonOutline } from '../../entities/sermon-outline.entity';
import { SermonManuscript } from '../../entities/sermon-manuscript.entity';
import { AudienceType, SermonApplication } from '../../entities/sermon-application.entity';
import { DiscussionQuestion } from '../../entities/discussion-question.entity';
import { SermonIllustration } from '../../entities/sermon-illustration.entity';
import { SermonCitation, StatementType } from '../../entities/sermon-citation.entity';
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
import { normalizeTheologicalLens } from './theological-lens.util';

type ManuscriptGenerationOptions = {
  tone?: 'teaching' | 'pastoral' | 'evangelistic' | 'storytelling' | 'motivational' | string;
  targetMinutes?: number;
  format?: 'full' | 'notes' | string;
  audienceMode?: string;
  includeSlideCues?: boolean;
  includeKeyLines?: boolean;
  includeStudyInsights?: boolean; // When true, includes deep study data (word studies, interpretive challenges, etc.)
};

type ManuscriptCues = {
  slide: string[];
  keyLine: string[];
  transition: string[];
  pause: string[];
  read: string[];
  quote: string[];
  cta: string[];
};

@Injectable()
export class WorkspacesService {
  private readonly manuscriptWpm = 145;
  private manuscriptSoftGateSaveCount = 0;

  private parseJsonSafe = WorkspaceHelpers.parseJsonSafe;
  private parseListFromResponse = WorkspaceHelpers.parseListFromResponse;
  private parseOutlinePointsResponse = WorkspaceHelpers.parseOutlinePointsResponse;
  private parseOutlineFromResponse = WorkspaceHelpers.parseOutlineFromResponse;
  private normalizeOutlineData = WorkspaceHelpers.normalizeOutlineData;
  private parseIllustrationsFromResponse = WorkspaceHelpers.parseIllustrationsFromResponse;
  private parseCitationsFromResponse = WorkspaceHelpers.parseCitationsFromResponse;
  private logLlmOutput = WorkspaceHelpers.logLlmOutput;
  private extractOutlinePointTexts = WorkspaceHelpers.extractOutlinePointTexts;
  private extractMalformedManuscriptPayload = WorkspaceHelpers.extractMalformedManuscriptPayload;

  private buildSocraticCoachPrompt(
    workspace: SermonWorkspace,
    payload: {
      mode?: 'refine' | 'self_reflection';
      listenerProfile?: string;
      questionId?: string;
      answer?: string;
      promptOverride?: string;
    },
  ) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const mode = payload.mode === 'self_reflection' ? 'self_reflection' : 'refine';
    const listenerProfile = this.asString(payload.listenerProfile || 'general_congregation').toLowerCase();
    const selectedOutline = workspace.outlines?.find((o: any) => o.isSelected) || workspace.outlines?.[0];
    const outlinePoints = this.extractOutlinePointTexts(selectedOutline?.structure || {}).slice(0, 8);
    const manuscriptText = this.asString(workspace.manuscripts?.[0]?.content?.text || '');
    const reportSections = workspace.studyReports?.[0]?.sections || {};
    const cache = workspace.scriptureCache || {};
    const integritySignals = {
      latestDnaSummary: this.asString(workspace.dnaAnalyses?.[0]?.summary || ''),
      lastIntegrityIssues: Array.isArray((workspace.metadata || {})?.dnaIntegrity?.issues)
        ? (workspace.metadata || {}).dnaIntegrity.issues.slice(0, 8)
        : [],
    };

    const context = this.compactJsonForPrompt(
      {
        workspace: {
          title: workspace.title,
          mainPassage: workspace.mainPassage,
          theme: workspace.theme || '',
          audienceProfile: workspace.audienceProfile || '',
          sermonGoals: workspace.sermonGoals || '',
          language: workspace.language || 'en',
        },
        mode,
        listenerProfile,
        outline: {
          title: selectedOutline?.title || '',
          points: outlinePoints,
          introduction: this.asString(selectedOutline?.structure?.introduction || ''),
          conclusion: this.asString(selectedOutline?.structure?.conclusion || ''),
        },
        manuscript: {
          excerpt: manuscriptText.slice(0, 2600),
          wordCount: manuscriptText ? manuscriptText.split(/\s+/).filter(Boolean).length : 0,
        },
        studyReport: {
          passageOverview: this.asString(reportSections?.passageOverview || ''),
          exegeticalFlow: Array.isArray(reportSections?.exegeticalFlow) ? reportSections.exegeticalFlow : [],
          mainTheologicalClaim: this.asString(reportSections?.mainTheologicalClaim || ''),
          structureOfPassage: Array.isArray(reportSections?.structureOfPassage)
            ? reportSections.structureOfPassage
            : [],
          interpretiveChallenges: Array.isArray(reportSections?.interpretiveChallenges)
            ? reportSections.interpretiveChallenges
            : [],
        },
        scriptureCache: {
          passageSummary: cache?.passageSummary || null,
          crossReferences: cache?.crossReferences?.ranked || [],
          canonicalThemes: cache?.canonicalThemes || null,
        },
        integritySignals,
      },
      10000,
    );

    if (payload.questionId && payload.answer) {
      return `You are a Socratic Sermon Coach. Analyze the pastor answer and respond with concise coaching feedback.

Language: ${languageLabel}
Context:
${context}

Answered Question ID: ${payload.questionId}
Pastor Answer:
${payload.answer}

Return ONLY valid JSON:
{
  "questionId": "string",
  "affirmation": "short encouragement",
  "coachFeedback": "specific theological/exegetical feedback",
  "improvementSuggestion": "how to strengthen sermon content",
  "rewriteHint": "one improved sermon sentence the pastor can reuse",
  "nextQuestion": "one follow-up Socratic question"
}

Rules:
- Be text-faithful to the main passage.
- If answer drifts from text, say it clearly.
- Keep all fields short and practical.
- No markdown, no code fences.`;
    }

    return `${payload.promptOverride || ''}You are a seminary-level Socratic Sermon Coach.

Language: ${languageLabel}
Task mode: ${mode}
Listener simulation profile: ${listenerProfile}

Context:
${context}

Generate 8 coaching questions that challenge interpretation, structure, theological clarity, application linkage, and gospel focus.

Return ONLY valid JSON:
{
  "mode": "refine|self_reflection",
  "listenerProfile": "string",
  "summary": "1-2 sentence coaching summary",
  "weakAreas": ["string"],
  "questions": [
    {
      "id": "Q1",
      "dimension": "text_fidelity|theological_clarity|audience_relevance|gospel_focus|structure_flow|application_strength|cross_reference_grounding|self_reflection",
      "question": "string",
      "purpose": "why this matters",
      "sourceAnchor": "passage verse or outline/manuscript anchor",
      "severity": "high|medium|low",
      "listenerAngle": "how this listener might challenge the sermon",
      "suggestedFollowUp": "optional follow-up prompt"
    }
  ],
  "nextStepSuggestion": "one concrete refinement step"
}

Rules:
- Questions must be specific to provided content, not generic.
- Include at least 2 text-fidelity checks and 2 application-linkage checks.
- Use at least 4 distinct dimensions across the 8 questions.
- For self_reflection mode, include at least 3 spiritual formation questions.
- Keep question text concise and pastor-friendly.
- Do not wrap fields in extra quotes.
- No markdown, no prose outside JSON.`;
  }

  private buildSocraticCoachRepairPrompt(
    workspace: SermonWorkspace,
    payload: {
      mode?: 'refine' | 'self_reflection';
      listenerProfile?: string;
    },
    rawResponse: string,
  ) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const mode = payload.mode === 'self_reflection' ? 'self_reflection' : 'refine';
    const listenerProfile = this.asString(payload.listenerProfile || 'general_congregation').toLowerCase();
    const compactRaw = this.compactJsonForPrompt({ rawResponse }, 8000);

    return `Repair this Socratic Sermon Coach output into clean structured JSON.

Language: ${languageLabel}
Mode: ${mode}
Listener profile: ${listenerProfile}
Main passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}

Raw output to normalize:
${compactRaw}

Return ONLY valid JSON:
{
  "mode": "refine|self_reflection",
  "listenerProfile": "string",
  "summary": "1-2 sentence coaching summary",
  "weakAreas": ["string"],
  "questions": [
    {
      "id": "Q1",
      "dimension": "text_fidelity|theological_clarity|audience_relevance|gospel_focus|structure_flow|application_strength|cross_reference_grounding|self_reflection",
      "question": "string",
      "purpose": "why this matters",
      "sourceAnchor": "passage anchor",
      "severity": "high|medium|low",
      "listenerAngle": "listener challenge",
      "suggestedFollowUp": "optional follow-up"
    }
  ],
  "nextStepSuggestion": "one concrete refinement step"
}

Rules:
- Produce exactly 8 questions.
- Use at least 4 distinct dimensions.
- Keep text clean: no leading/trailing quote artifacts.
- Keep all content in ${languageLabel}.
- No markdown, no prose outside JSON.`;
  }

  private cleanCoachText(value: any): string {
    let text = this.asString(value)
      .replace(/[\u0000-\u001F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    text = text.replace(/^[`"'“”‘’«»]+/, '').replace(/[`"'“”‘’«»]+$/, '').trim();
    text = text.replace(/\s*["'”’]+\s*$/g, '').trim();
    return text;
  }

  private normalizeCoachDimension(value: any): string {
    const raw = this.asString(value).toLowerCase().trim();
    const allowed = new Set([
      'text_fidelity',
      'theological_clarity',
      'audience_relevance',
      'gospel_focus',
      'structure_flow',
      'application_strength',
      'cross_reference_grounding',
      'self_reflection',
    ]);
    const mapped =
      raw.includes('application') ? 'application_strength' :
      raw.includes('structure') || raw.includes('flow') ? 'structure_flow' :
      raw.includes('gospel') ? 'gospel_focus' :
      raw.includes('theolog') ? 'theological_clarity' :
      raw.includes('audience') || raw.includes('listener') ? 'audience_relevance' :
      raw.includes('cross') || raw.includes('reference') ? 'cross_reference_grounding' :
      raw.includes('self') || raw.includes('reflect') ? 'self_reflection' :
      'text_fidelity';
    return allowed.has(mapped) ? mapped : 'text_fidelity';
  }

  private normalizeCoachSeverity(value: any): string {
    const raw = this.asString(value).toLowerCase().trim();
    if (raw === 'high' || raw === 'medium' || raw === 'low') return raw;
    if (raw.includes('alto') || raw.includes('urgent')) return 'high';
    if (raw.includes('bajo')) return 'low';
    return 'medium';
  }

  private isCoachSessionLowQuality(session: {
    summary: string;
    questions: Array<{ dimension: string; question: string }>;
  }): boolean {
    const questionCount = Array.isArray(session.questions) ? session.questions.length : 0;
    if (questionCount < 4) return true;
    const dimensionSet = new Set((session.questions || []).map((item) => this.asString(item.dimension)));
    if (dimensionSet.size < 2) return true;
    if (!this.asString(session.summary)) return true;
    return false;
  }

  private normalizeSocraticCoachQuestions(
    parsed: any,
    response: string,
    fallbackAnchor: string,
  ): Array<{
    id: string;
    dimension: string;
    question: string;
    purpose: string;
    sourceAnchor: string;
    severity: string;
    listenerAngle: string;
    suggestedFollowUp: string;
  }> {
    const candidateCollections = [
      parsed?.questions,
      parsed?.coachQuestions,
      parsed?.items,
      parsed?.questionList,
      parsed?.preguntas,
    ];

    const normalizedFromObjects = candidateCollections
      .filter((value) => Array.isArray(value))
      .flatMap((value: any[]) => value)
      .map((item: any, idx: number) => {
        const questionText = this.asString(
          item?.question ||
          item?.text ||
          item?.prompt ||
          item?.pregunta ||
          (typeof item === 'string' ? item : ''),
        );
        return {
          id: this.cleanCoachText(item?.id || `Q${idx + 1}`),
          dimension: this.normalizeCoachDimension(item?.dimension || item?.category || item?.type || 'text_fidelity'),
          question: this.cleanCoachText(questionText),
          purpose: this.cleanCoachText(item?.purpose || item?.why || item?.reason || ''),
          sourceAnchor: this.cleanCoachText(item?.sourceAnchor || item?.anchor || fallbackAnchor),
          severity: this.normalizeCoachSeverity(item?.severity || 'medium'),
          listenerAngle: this.cleanCoachText(item?.listenerAngle || item?.angle || ''),
          suggestedFollowUp: this.cleanCoachText(item?.suggestedFollowUp || item?.followUp || ''),
        };
      })
      .filter((item) => item.question);

    if (normalizedFromObjects.length) {
      return normalizedFromObjects.slice(0, 10);
    }

    const listFromText = this.parseListFromResponse(response)
      .map((line, idx) => ({
        id: `Q${idx + 1}`,
        dimension: 'text_fidelity',
        question: this.cleanCoachText(line),
        purpose: '',
        sourceAnchor: fallbackAnchor,
        severity: 'medium',
        listenerAngle: '',
        suggestedFollowUp: '',
      }))
      .filter((item) => item.question)
      .slice(0, 10);

    return listFromText;
  }

  private normalizeSocraticCoachWeakAreas(parsed: any, response: string): string[] {
    if (Array.isArray(parsed?.weakAreas)) {
      return parsed.weakAreas.map((item: any) => this.cleanCoachText(item)).filter(Boolean).slice(0, 8);
    }
    if (Array.isArray(parsed?.areasToImprove)) {
      return parsed.areasToImprove.map((item: any) => this.cleanCoachText(item)).filter(Boolean).slice(0, 8);
    }
    const extracted = this.parseListFromResponse(this.asString(parsed?.summary || response))
      .map((item) => this.cleanCoachText(item))
      .filter(Boolean)
      .slice(0, 4);
    return extracted;
  }

  async generateSocraticCoach(
    workspaceId: string,
    userId: string,
    payload: {
      mode?: 'refine' | 'self_reflection';
      listenerProfile?: 'new_believer' | 'skeptic' | 'teenager' | 'bible_scholar' | 'family_church' | string;
      questionId?: string;
      answer?: string;
      promptOverride?: string;
    },
  ) {
    const workspace = await this.findOne(workspaceId, userId);
    const prompt = this.buildSocraticCoachPrompt(workspace, payload || {});
    const response = await this.llmService.generateCompletion(prompt, userId, {
      temperature: 0.5,
      maxTokens: 1600,
    });
    this.logLlmOutput('socratic-coach', response);

    const parsed = this.parseJsonSafe(response) || {};
    const now = new Date().toISOString();

    if (payload?.questionId && payload?.answer) {
      const feedback = {
        questionId: this.cleanCoachText(parsed?.questionId || payload.questionId),
        affirmation: this.cleanCoachText(parsed?.affirmation || ''),
        coachFeedback: this.cleanCoachText(parsed?.coachFeedback || ''),
        improvementSuggestion: this.cleanCoachText(parsed?.improvementSuggestion || ''),
        rewriteHint: this.cleanCoachText(parsed?.rewriteHint || ''),
        nextQuestion: this.cleanCoachText(parsed?.nextQuestion || ''),
      };
      workspace.metadata = {
        ...(workspace.metadata || {}),
        socraticCoachLastFeedback: {
          ...(workspace.language === 'es' ? this.normalizeSpanishValueDeep(feedback) : feedback),
          listenerProfile: payload.listenerProfile || 'general_congregation',
          mode: payload.mode || 'refine',
          updatedAt: now,
        },
      };
      await this.workspaceRepository.save(workspace);
      return {
        ...(workspace.language === 'es' ? this.normalizeSpanishValueDeep(feedback) : feedback),
        updatedAt: now,
      };
    }

    let questions = this.normalizeSocraticCoachQuestions(parsed, response, workspace.mainPassage);
    let weakAreas = this.normalizeSocraticCoachWeakAreas(parsed, response);
    let summaryFromParsed = this.cleanCoachText(parsed?.summary || parsed?.coachSummary || parsed?.resumen || '');
    const summaryFromQuestions = questions.length
      ? (workspace.language === 'es'
          ? `Se detectaron ${questions.length} preguntas de mejora para refinar fidelidad bíblica, claridad y aplicación.`
          : `Identified ${questions.length} coaching questions to refine text fidelity, clarity, and application.`)
      : '';
    let summary = summaryFromParsed || summaryFromQuestions;
    let nextStepSuggestion = this.cleanCoachText(parsed?.nextStepSuggestion || parsed?.nextStep || parsed?.siguientePaso || '');

    if (this.isCoachSessionLowQuality({ summary, questions })) {
      try {
        const repairPrompt = this.buildSocraticCoachRepairPrompt(workspace, payload || {}, response);
        const repairedResponse = await this.llmService.generateCompletion(repairPrompt, userId, {
          temperature: 0.3,
          maxTokens: 1800,
        });
        this.logLlmOutput('socratic-coach:repair', repairedResponse);
        const repairedParsed = this.parseJsonSafe(repairedResponse) || {};
        const repairedQuestions = this.normalizeSocraticCoachQuestions(repairedParsed, repairedResponse, workspace.mainPassage);
        const repairedWeakAreas = this.normalizeSocraticCoachWeakAreas(repairedParsed, repairedResponse);
        const repairedSummary = this.cleanCoachText(
          repairedParsed?.summary || repairedParsed?.coachSummary || repairedParsed?.resumen || '',
        );
        const repairedNextStep = this.cleanCoachText(
          repairedParsed?.nextStepSuggestion || repairedParsed?.nextStep || repairedParsed?.siguientePaso || '',
        );
        if (!this.isCoachSessionLowQuality({ summary: repairedSummary || summaryFromQuestions, questions: repairedQuestions })) {
          questions = repairedQuestions;
          weakAreas = repairedWeakAreas;
          summary = repairedSummary || summaryFromQuestions;
          nextStepSuggestion = repairedNextStep || nextStepSuggestion;
        }
      } catch (error) {
        console.warn(`[socratic-coach:repair] skipped: ${(error as Error)?.message || 'unknown error'}`);
      }
    }

    const coachSession = {
      mode: this.asString(parsed?.mode || payload?.mode || 'refine').toLowerCase(),
      listenerProfile: this.asString(parsed?.listenerProfile || payload?.listenerProfile || 'general_congregation'),
      summary,
      weakAreas,
      questions,
      nextStepSuggestion,
      generatedAt: now,
    };
    const normalizedCoachSession =
      workspace.language === 'es' ? this.normalizeSpanishValueDeep(coachSession) : coachSession;

    workspace.metadata = {
      ...(workspace.metadata || {}),
      socraticCoachLastSession: normalizedCoachSession,
    };
    await this.workspaceRepository.save(workspace);
    return normalizedCoachSession;
  }

  private normalizePointTextForSimilarity(text: string): string {
    return (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildPointSignature(points: string[]): string {
    if (!Array.isArray(points) || points.length === 0) return '';
    return points
      .map((point) => this.normalizePointTextForSimilarity(point))
      .filter(Boolean)
      .join(' | ');
  }

  private isSignatureTooSimilar(candidateSignature: string, existingSignatures: Set<string>): boolean {
    if (!candidateSignature) return false;
    const candidateTokens = new Set(candidateSignature.split(/\s+/).filter(Boolean));
    if (candidateTokens.size === 0) return false;

    for (const existing of existingSignatures) {
      const existingTokens = new Set(existing.split(/\s+/).filter(Boolean));
      if (existingTokens.size === 0) continue;
      const overlap = [...candidateTokens].filter((token) => existingTokens.has(token)).length;
      const union = new Set([...candidateTokens, ...existingTokens]).size || 1;
      const jaccard = overlap / union;
      if (jaccard >= 0.72) {
        return true;
      }
    }
    return false;
  }

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
      theologicalLens: normalizeTheologicalLens(createDto.theologicalLens),
      userId,
    });

    return this.workspaceRepository.save(workspace);
  }

  async addReference(workspaceId: string, userId: string, reference: string, context?: string): Promise<SermonWorkspace> {
    const workspace = await this.findOne(workspaceId, userId);
    
    // Initialize references array if it doesn't exist
    if (!workspace.references) {
      workspace.references = [];
    }
    
    // Add reference if not already present
    const refExists = workspace.references.some((ref: any) => 
      typeof ref === 'string' ? ref === reference : ref.reference === reference
    );
    
    if (!refExists) {
      workspace.references.push({
        reference,
        context: context || 'Added from 3D exploration',
        addedAt: new Date().toISOString()
      });
      
      await this.workspaceRepository.save(workspace);
    }
    
    return workspace;
  }

  buildIllustrationsPrompt(workspace: SermonWorkspace, mainPoints: string[], seededIdeas: string[] = []) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    return `Generate 8-12 sermon illustrations based on:
Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Main Points: ${mainPoints.join(', ') || 'N/A'}
${seededIdeas.length ? `Existing study illustration ideas: ${seededIdeas.join(' | ')}` : ''}

Write in ${languageLabel}.

Return a JSON array with items containing:
title, content, verseReference, source (optional), relatedPoint (optional), tags (array, optional).

Rules:
- Include a relevant Bible verse reference for each illustration in verseReference.
- Return at least 8 distinct items.
- No markdown, no prose outside JSON, no code fences.`;
  }

  buildCitationsPrompt(workspace: SermonWorkspace) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate 5-8 supporting citations and statements for the sermon:
Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Theological Lens: ${theologicalLens}

Write in ${languageLabel}.

Return a JSON array with items containing:
statementType (observation, interpretation, application, illustration, external_reference),
statement, verseReferences (array), externalSources (array, optional).`;
  }

  buildOutlinePrompt(workspace: SermonWorkspace) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
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
Theological Lens: ${theologicalLens}
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

Rules:
- In Adventist context, never use Sunday/Domingo worship framing.
- If weekly worship timing is mentioned, use Sabbath/Sábado language.
- DO NOT include metadata, JSON, or any other format. Use only the section markers shown above.`;
  }

  buildOutlinePointsPrompt(workspace: SermonWorkspace, count: number, reportText?: string) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
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
Theological Lens: ${theologicalLens}
Style: ${workspace.style || 'N/A'}
Story Arc: ${workspace.storyArc || 'N/A'}
${reportText ? `\nStudy Report Context:\n${reportText}` : ''}

Write in ${languageLabel}.

Rules:
- Each variation must be substantively different in framing, emphasis, and wording.
- Make each variation distinct across these axes:
  1) Narrative approach
  2) Theological emphasis
  3) Audience focus
  4) Sermon structure style (expository, narrative, thematic, problem-solution, story-driven)
- Do NOT reuse sentences or phrases across variations.

Return ONLY valid JSON as an array of objects with this shape:
[
  {
    "angle": "<short angle label>",
    "style": "<style label>",
    "theologicalEmphasis": "<short emphasis label>",
    "audienceFocus": "<short audience focus label>",
    "sermonStructure": "<structure type label>",
    "points": ["Point 1", "Point 2", "Point 3"]
  }
]

Only include ${count} variations and no extra text.`;
  }

  buildOutlineFromPointsPrompt(workspace: SermonWorkspace, points: string[], variation: string, reportText?: string) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
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

Return ONLY valid JSON with this exact top-level shape:
{
  "introduction": "string",
  "points": ["Point 1", "Point 2", "Point 3"],
  "pointNodes": [
    {
      "title": "string",
      "summary": "string",
      "subpoints": ["string"],
      "supportingVerses": ["Book 1:1"],
      "canonicalThemes": ["string"],
      "crossReferences": ["Book 1:1"],
      "applications": ["string"],
      "discussionQuestions": ["string"],
      "illustrationIdeas": ["string"],
      "mediaSuggestions": ["string"],
      "egwSupport": [
        {
          "citation": "string",
          "quote": "string",
          "relevance": "string"
        }
      ],
      "references": ["Book 1:1"]
    }
  ],
  "outlineType": "string",
  "sermonMovement": "string",
  "conclusion": "string",
  "callToAction": "string"
}

Rules:
- "points" is required and canonical; it must contain 3-5 concise points.
- "pointNodes" is optional enrichment aligned by index to "points".
- Use study assets from the Study Report Context when present.
- Keep applications, questions, illustration ideas, media suggestions, EGW support, and references tied to each point instead of treating them as separate tabs.
- Ensure each point remains faithful to the passage and avoids drift.
- In Adventist context, never use Sunday/Domingo worship framing. Use Sabbath/Sábado.
- Do not include markdown, prose outside JSON, or code fences.`;
  }

  private normalizeManuscriptOptions(
    workspace: SermonWorkspace,
    options?: ManuscriptGenerationOptions,
  ): Required<ManuscriptGenerationOptions> {
    const targetMinutesRaw = Number(options?.targetMinutes);
    const targetMinutes = Number.isFinite(targetMinutesRaw) && targetMinutesRaw > 0
      ? Math.min(60, Math.max(8, Math.round(targetMinutesRaw)))
      : 22;
    const tone = this.asString(options?.tone || workspace.style || 'teaching').toLowerCase();
    const format = this.asString(options?.format || 'full').toLowerCase();
    const audienceMode = this.asString(options?.audienceMode || workspace.audienceProfile || 'general congregation');

    return {
      tone: tone || 'teaching',
      targetMinutes,
      format: format === 'notes' ? 'notes' : 'full',
      audienceMode: audienceMode || 'general congregation',
      includeSlideCues: options?.includeSlideCues !== false,
      includeKeyLines: options?.includeKeyLines !== false,
      includeStudyInsights: options?.includeStudyInsights === true,
    };
  }

  private manuscriptCueTemplate() {
    return {
      slide: [] as string[],
      keyLine: [] as string[],
      transition: [] as string[],
      pause: [] as string[],
      read: [] as string[],
      quote: [] as string[],
      cta: [] as string[],
    };
  }

  private extractCuesFromLegacyText(rawText: string) {
    const cues = this.manuscriptCueTemplate();
    const cueMap: Record<string, keyof typeof cues> = {
      slide: 'slide',
      keyline: 'keyLine',
      transition: 'transition',
      pause: 'pause',
      read: 'read',
      quote: 'quote',
      cta: 'cta',
      calltoaction: 'cta',
    };

    const stripped = String(rawText || '').replace(
      /\[(Slide|Key\s*Line|Transition|Pause|Read|Quote|CTA|Call\s*to\s*Action)\]\s*([^\n]*)/gi,
      (_match, cueType, cueText) => {
        const key = String(cueType || '').toLowerCase().replace(/\s+/g, '');
        const cueBucket = cueMap[key];
        const cleanText = String(cueText || '').trim();
        if (cueBucket && cleanText) {
          cues[cueBucket].push(cleanText);
        }
        return cleanText;
      },
    );

    return {
      text: stripped,
      cues,
    };
  }

  private escapeHtml(value: string) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private formatManuscriptInline(value: string) {
    let output = this.escapeHtml(value);
    output = output.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    output = output.replace(/(^|[\s(])\*(.+?)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
    output = output.replace(/(^|[\s(])_(.+?)_(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
    return output;
  }

  private markdownLikeToHtml(rawText: string) {
    const text = String(rawText || '').replace(/\r\n/g, '\n').trim();
    if (!text) return '<p></p>';
    const lines = text.split('\n');
    const htmlBlocks: string[] = [];
    let paragraphBuffer: string[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;
    let scriptureBuffer: string[] = [];
    let inBlockquote = false;
    let lastSectionWasHeading = false;

    const flushParagraph = () => {
      if (!paragraphBuffer.length) return;
      const paragraph = paragraphBuffer.join(' ').replace(/\s+/g, ' ').trim();
      if (paragraph) {
        htmlBlocks.push(`<p>${this.formatManuscriptInline(paragraph)}</p>`);
      }
      paragraphBuffer = [];
    };

    const flushList = () => {
      if (!listBuffer || !listBuffer.items.length) {
        listBuffer = null;
        return;
      }
      const items = listBuffer.items
        .map((item) => `<li>${this.formatManuscriptInline(item)}</li>`)
        .join('');
      htmlBlocks.push(`<${listBuffer.type}>${items}</${listBuffer.type}>`);
      listBuffer = null;
    };

    const flushScripture = () => {
      if (!scriptureBuffer.length) return;
      const content = scriptureBuffer
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => `<p>${this.formatManuscriptInline(item)}</p>`)
        .join('');
      if (content) {
        htmlBlocks.push(`<blockquote>${content}</blockquote>`);
      }
      scriptureBuffer = [];
      inBlockquote = false;
    };

    const sectionHeadingPattern =
      /^(introducci[oó]n|lectura del pasaje principal|lectura b[ií]blica|contexto(?: literario| hist[oó]rico| literario y hist[oó]rico)?|trasfondo(?: hist[oó]rico)?|movimiento \d+|punto \d+|aplicaci[oó]n(?: pr[aá]ctica)?|ilustraci[oó]n|conclusi[oó]n|llamado(?: final)?|invitaci[oó]n|oraci[oó]n final|preguntas de reflexi[oó]n|explicaci[oó]n|transici[oó]n)$/i;
    const scriptureReferencePattern =
      /^([1-3]?\s?[A-Za-zÁÉÍÓÚÑáéíóúñ.]+(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ.]+)*)\s+\d+:\d+(?:[-–]\d+)?(?:\s*\([^)]+\))?$/;
    const numberedHeadingPattern = /^\d+[\.\)]\s+.+$/;
    const scriptureLinePattern = /^\d+\s+.+/;
    const labelPattern = /^(Explicaci[oó]n|Aplicaci[oó]n|Ilustraci[oó]n|Transici[oó]n|Conclusi[oó]n|Invitaci[oó]n|Oraci[oó]n final)\s*:\s*(.+)$/i;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        flushParagraph();
        flushList();
        flushScripture();
        lastSectionWasHeading = false;
        continue;
      }

      const markdownHeading = line.match(/^(#{1,3})\s+(.+)$/);
      if (markdownHeading) {
        flushParagraph();
        flushList();
        flushScripture();
        const level = Math.min(3, Math.max(1, markdownHeading[1].length));
        const headingTag = level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4';
        htmlBlocks.push(`<${headingTag}>${this.formatManuscriptInline(markdownHeading[2])}</${headingTag}>`);
        lastSectionWasHeading = true;
        continue;
      }

      if (sectionHeadingPattern.test(line)) {
        flushParagraph();
        flushList();
        flushScripture();
        htmlBlocks.push(`<h2>${this.formatManuscriptInline(line)}</h2>`);
        lastSectionWasHeading = true;
        continue;
      }

      if (numberedHeadingPattern.test(line)) {
        flushParagraph();
        flushList();
        flushScripture();
        htmlBlocks.push(`<h3>${this.formatManuscriptInline(line)}</h3>`);
        lastSectionWasHeading = true;
        continue;
      }

      const scriptureReference = line.match(scriptureReferencePattern);
      if (scriptureReference) {
        flushParagraph();
        flushList();
        flushScripture();
        htmlBlocks.push(`<p><em>${this.formatManuscriptInline(line)}</em></p>`);
        lastSectionWasHeading = false;
        continue;
      }

      const labelMatch = line.match(labelPattern);
      if (labelMatch) {
        flushParagraph();
        flushList();
        flushScripture();
        htmlBlocks.push(
          `<p><strong>${this.formatManuscriptInline(labelMatch[1])}:</strong> ${this.formatManuscriptInline(labelMatch[2])}</p>`,
        );
        lastSectionWasHeading = false;
        continue;
      }

      if (/^[-*]\s+/.test(line) || /^\d+[\.\)]\s+/.test(line)) {
        flushParagraph();
        flushScripture();
        const nextType = /^\d+[\.\)]\s+/.test(line) ? 'ol' : 'ul';
        const itemText = line.replace(/^[-*]\s+/, '').replace(/^\d+[\.\)]\s+/, '').trim();
        if (!listBuffer || listBuffer.type !== nextType) {
          flushList();
          listBuffer = { type: nextType, items: [] };
        }
        listBuffer.items.push(itemText);
        lastSectionWasHeading = false;
        continue;
      }

      if (scriptureLinePattern.test(line) && (inBlockquote || lastSectionWasHeading || htmlBlocks.at(-1)?.includes('<em>'))) {
        flushParagraph();
        flushList();
        inBlockquote = true;
        scriptureBuffer.push(line);
        lastSectionWasHeading = false;
        continue;
      }

      flushList();
      flushScripture();
      paragraphBuffer.push(line);
      lastSectionWasHeading = false;
    }

    flushParagraph();
    flushList();
    flushScripture();

    return htmlBlocks.join('\n');
  }

  private sanitizeCueObject(raw: any) {
    const cues = this.manuscriptCueTemplate();
    if (!raw || typeof raw !== 'object') return cues;
    const map: Record<string, keyof typeof cues> = {
      slide: 'slide',
      keyline: 'keyLine',
      key_line: 'keyLine',
      transition: 'transition',
      pause: 'pause',
      read: 'read',
      quote: 'quote',
      cta: 'cta',
      calltoaction: 'cta',
      call_to_action: 'cta',
    };

    Object.entries(raw).forEach(([key, value]) => {
      const normalized = map[String(key).toLowerCase().replace(/\s+/g, '')] || map[String(key).toLowerCase()];
      if (!normalized) return;
      cues[normalized] = this.asStringArray(value, 20);
    });
    return cues;
  }

  private stripModelTransportArtifacts(value: string) {
    return String(value || '')
      .replace(/<\|[^|>]+?\|>/g, ' ')
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .replace(/^\s*(assistant|final|response)\s*[:\-]\s*/i, '')
      .replace(/\r\n/g, '\n')
      .trim();
  }

  private sanitizeGeneratedManuscriptHtml(htmlText: string) {
    return String(htmlText || '')
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/\son\w+="[^"]*"/gi, '')
      .replace(/\son\w+='[^']*'/gi, '')
      .replace(/\s(href|src)=("|\')\s*javascript:[\s\S]*?\2/gi, '')
      .trim();
  }

  private normalizeRecoveredManuscriptContent(text: string) {
    const normalized = this.normalizeGeneratedManuscriptText(text);
    if (!normalized) return '<p></p>';

    const htmlText = /<\/?(p|h2|h3|h4|ul|ol|li|blockquote|strong|em|br)\b/i.test(normalized)
      ? normalized
      : this.markdownLikeToHtml(normalized);

    return this.sanitizeGeneratedManuscriptHtml(htmlText) || '<p></p>';
  }

  private logManuscriptRecoveryMode(mode: 'json' | 'text-field' | 'html-fragment' | 'plain-text') {
    console.info(`[manuscript-parse] recovery_mode=${mode}`);
  }

  private normalizeGeneratedManuscriptText(text: string) {
    let normalized = this.stripModelTransportArtifacts(text)
      .replace(/\\n/g, '\n')
      .trim();

    const embedded = this.parseJsonSafe(normalized);
    if (embedded && typeof embedded === 'object' && typeof embedded.text === 'string') {
      normalized = this.stripModelTransportArtifacts(String(embedded.text || ''))
        .replace(/\\n/g, '\n')
        .trim();
    }

    return normalized;
  }

  private parseGeneratedManuscriptResponse(rawResponse: string, options: Required<ManuscriptGenerationOptions>) {
    const cleanedResponse = this.stripModelTransportArtifacts(rawResponse);
    const parsed = this.parseJsonSafe(cleanedResponse) || this.parseJsonSafe(rawResponse);
    if (parsed && typeof parsed === 'object' && typeof parsed.text === 'string') {
      const textFromModel = this.normalizeRecoveredManuscriptContent(String(parsed.text || ''));
      const cueObject = this.sanitizeCueObject(parsed.cues);
      this.logManuscriptRecoveryMode('json');
      return {
        text: textFromModel || '<p></p>',
        cues: {
          ...cueObject,
          slide: options.includeSlideCues ? cueObject.slide : [],
          keyLine: options.includeKeyLines ? cueObject.keyLine : [],
        },
      };
    }

    const malformedPayload = this.extractMalformedManuscriptPayload(cleanedResponse || rawResponse);
    if (malformedPayload?.text) {
      this.logManuscriptRecoveryMode(malformedPayload.source);
      return {
        text: this.normalizeRecoveredManuscriptContent(malformedPayload.text),
        cues: this.manuscriptCueTemplate(),
      };
    }

    this.logManuscriptRecoveryMode('plain-text');
    const extracted = this.extractCuesFromLegacyText(this.normalizeGeneratedManuscriptText(cleanedResponse || rawResponse));
    return {
      text: this.normalizeRecoveredManuscriptContent(extracted.text),
      cues: {
        ...extracted.cues,
        slide: options.includeSlideCues ? extracted.cues.slide : [],
        keyLine: options.includeKeyLines ? extracted.cues.keyLine : [],
      },
    };
  }

  private hasEnglishLeakInSpanishManuscript(text: string, cues: ManuscriptCues): boolean {
    const normalized = this.stripHtmlForWordCount(String(text || '')).toLowerCase();
    const cueText = Object.values(cues || {})
      .flat()
      .join(' ')
      .toLowerCase();
    const combined = `${normalized} ${cueText}`;

    const structuralMarkers = [
      /\bintroduction\b/i,
      /\bpoint\s+\d+\b/i,
      /\bconclusion\b/i,
      /\bcall to action\b/i,
      /\bscripture readings?\b/i,
      /\bkey quotes?\b/i,
      /\bkey lines?\b/i,
      /\bappeals?\b/i,
      /\bexplanation\b/i,
      /\bapplication\b/i,
      /\billustration\b/i,
      /\bcontext\b/i,
    ];

    const markerHits = structuralMarkers.reduce((sum, rx) => sum + (rx.test(combined) ? 1 : 0), 0);
    const englishLeakPatterns = [
      /\bhe will impart life\b/i,
      /\bdead in trespasses\b/i,
      /\bbelieve his word\b/i,
      /\bput your will\b/i,
      /\bchrist is able\b/i,
      /\bthe soul\b/i,
      /\bby nature we are\b/i,
    ];
    const hasSentenceLeak = englishLeakPatterns.some((rx) => rx.test(combined));

    const commonEnglishWords = combined.match(
      /\b(the|and|with|from|that|this|will|would|should|before|after|through|because|therefore|where|when|while|dead|trespasses)\b/gi,
    );
    const englishWordHits = commonEnglishWords?.length || 0;
    return markerHits >= 1 || hasSentenceLeak || englishWordHits >= 6;
  }

  private normalizeSpanishManuscriptLabels(text: string): string {
    return String(text || '')
      .replace(/\bIntroduction\b/gi, 'Introducción')
      .replace(/\bPoint\s+(\d+)\b/gi, 'Punto $1')
      .replace(/\bConclusion\b/gi, 'Conclusión')
      .replace(/\bCall to Action\b/gi, 'Llamado a la acción')
      .replace(/\bScripture Readings?\b/gi, 'Lecturas bíblicas')
      .replace(/\bKey Quotes?\b/gi, 'Citas clave')
      .replace(/\bKey Lines?\b/gi, 'Líneas clave')
      .replace(/\bAppeals?\b/gi, 'Llamado')
      .replace(/\bExplanation\b/gi, 'Explicación')
      .replace(/\bApplication\b/gi, 'Aplicación')
      .replace(/\bIllustration\b/gi, 'Ilustración')
      .replace(/\bContext\b/gi, 'Contexto')
      .replace(/\bLeyenda:\b/gi, 'Literatura:')
      .replace(
        /He will impart life to the soul that is ['"`“”]?dead in trespasses['"`“”]?\.?/gi,
        'Él impartirá vida al alma que está «muerta en delitos y pecados».',
      )
      .replace(
        /Believe His word, and put your will on the side of Christ[^.]*\./gi,
        'Cree su Palabra y pon tu voluntad del lado de Cristo.',
      );
  }

  private normalizeSpanishGeneratedText(text: string): string {
    return this.translateEnglishBibleBooksToSpanish(
      this.normalizeSpanishManuscriptLabels(String(text || ''))
      .replace(/\(\s*Verse\s*:\s*/gi, '(Versículo: ')
      .replace(/\bVerse\s*:\s*/gi, 'Versículo: ')
      .replace(/\bBook\s+([1-3]?\s*[A-Za-zÁÉÍÓÚÑáéíóúñ]+)\s+(\d+:\d+(?:[-–]\d+)?)\b/gi, '$1 $2')
      .replace(
        /This passage supports the same theme or doctrinal movement in the study\./gi,
        'Este pasaje refuerza el mismo tema o movimiento doctrinal del estudio.',
      ),
    );
  }

  private translateEnglishBibleBooksToSpanish(text: string): string {
    const replacements: Array<[RegExp, string]> = [
      [/\bGenesis\b/gi, 'Génesis'],
      [/\bExodus\b/gi, 'Éxodo'],
      [/\bLeviticus\b/gi, 'Levítico'],
      [/\bNumbers\b/gi, 'Números'],
      [/\bDeuteronomy\b/gi, 'Deuteronomio'],
      [/\bJoshua\b/gi, 'Josué'],
      [/\bJudges\b/gi, 'Jueces'],
      [/\bRuth\b/gi, 'Rut'],
      [/\b1\s*Samuel\b/gi, '1 Samuel'],
      [/\b2\s*Samuel\b/gi, '2 Samuel'],
      [/\b1\s*Kings\b/gi, '1 Reyes'],
      [/\b2\s*Kings\b/gi, '2 Reyes'],
      [/\b1\s*Chronicles\b/gi, '1 Crónicas'],
      [/\b2\s*Chronicles\b/gi, '2 Crónicas'],
      [/\bEzra\b/gi, 'Esdras'],
      [/\bNehemiah\b/gi, 'Nehemías'],
      [/\bEsther\b/gi, 'Ester'],
      [/\bJob\b/gi, 'Job'],
      [/\bPsalms?\b/gi, 'Salmos'],
      [/\bProverbs\b/gi, 'Proverbios'],
      [/\bEcclesiastes\b/gi, 'Eclesiastés'],
      [/\bSong of Solomon\b/gi, 'Cantares'],
      [/\bIsaiah\b/gi, 'Isaías'],
      [/\bJeremiah\b/gi, 'Jeremías'],
      [/\bLamentations\b/gi, 'Lamentaciones'],
      [/\bEzekiel\b/gi, 'Ezequiel'],
      [/\bDaniel\b/gi, 'Daniel'],
      [/\bHosea\b/gi, 'Oseas'],
      [/\bJoel\b/gi, 'Joel'],
      [/\bAmos\b/gi, 'Amós'],
      [/\bObadiah\b/gi, 'Abdías'],
      [/\bJonah\b/gi, 'Jonás'],
      [/\bMicah\b/gi, 'Miqueas'],
      [/\bNahum\b/gi, 'Nahúm'],
      [/\bHabakkuk\b/gi, 'Habacuc'],
      [/\bZephaniah\b/gi, 'Sofonías'],
      [/\bHaggai\b/gi, 'Hageo'],
      [/\bZechariah\b/gi, 'Zacarías'],
      [/\bMalachi\b/gi, 'Malaquías'],
      [/\bMatthew\b/gi, 'Mateo'],
      [/\bMark\b/gi, 'Marcos'],
      [/\bLuke\b/gi, 'Lucas'],
      [/\bJohn\b/gi, 'Juan'],
      [/\bActs\b/gi, 'Hechos'],
      [/\bRomans\b/gi, 'Romanos'],
      [/\b1\s*Corinthians\b/gi, '1 Corintios'],
      [/\b2\s*Corinthians\b/gi, '2 Corintios'],
      [/\bGalatians\b/gi, 'Gálatas'],
      [/\bEphesians\b/gi, 'Efesios'],
      [/\bPhilippians\b/gi, 'Filipenses'],
      [/\bColossians\b/gi, 'Colosenses'],
      [/\b1\s*Thessalonians\b/gi, '1 Tesalonicenses'],
      [/\b2\s*Thessalonians\b/gi, '2 Tesalonicenses'],
      [/\b1\s*Timothy\b/gi, '1 Timoteo'],
      [/\b2\s*Timothy\b/gi, '2 Timoteo'],
      [/\bTitus\b/gi, 'Tito'],
      [/\bPhilemon\b/gi, 'Filemón'],
      [/\bHebrews\b/gi, 'Hebreos'],
      [/\bJames\b/gi, 'Santiago'],
      [/\b1\s*Peter\b/gi, '1 Pedro'],
      [/\b2\s*Peter\b/gi, '2 Pedro'],
      [/\b1\s*John\b/gi, '1 Juan'],
      [/\b2\s*John\b/gi, '2 Juan'],
      [/\b3\s*John\b/gi, '3 Juan'],
      [/\bJude\b/gi, 'Judas'],
      [/\bRevelation\b/gi, 'Apocalipsis'],
    ];

    return replacements.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), String(text || ''));
  }

  private normalizeSpanishValueDeep<T>(value: T): T {
    const walk = (input: any): any => {
      if (typeof input === 'string') return this.normalizeSpanishGeneratedText(input);
      if (Array.isArray(input)) return input.map((item) => walk(item));
      if (input && typeof input === 'object') {
        const next: Record<string, any> = {};
        for (const [key, val] of Object.entries(input)) next[key] = walk(val);
        return next;
      }
      return input;
    };
    return walk(value) as T;
  }

  private normalizeStatementType(value: any): StatementType {
    const raw = this.asString(value).trim().toLowerCase();
    if (!raw) return StatementType.OBSERVATION;
    if (raw === 'observation') return StatementType.OBSERVATION;
    if (raw === 'interpretation') return StatementType.INTERPRETATION;
    if (raw === 'application') return StatementType.APPLICATION;
    if (raw === 'illustration') return StatementType.ILLUSTRATION;
    if (
      raw === 'external_reference' ||
      raw === 'external reference' ||
      raw === 'exterior_reference' ||
      raw === 'exterior reference' ||
      raw === 'reference'
    ) {
      return StatementType.EXTERNAL_REFERENCE;
    }
    return StatementType.OBSERVATION;
  }

  private buildSpanishManuscriptRewritePrompt(text: string, cues: ManuscriptCues) {
    const payload = this.compactJsonForPrompt({ text, cues }, 24000);
    return `Convierte y normaliza este manuscrito al español completo.

Reglas:
- Todo el contenido debe quedar en español natural ministerial.
- No dejes encabezados ni frases en inglés.
- Traduce también las citas de EGW al español (mantén la referencia/citación).
- Mantén estructura, sentido teológico, referencias bíblicas y HTML.
- Mantén claves de cues (slide, keyLine, transition, pause, read, quote, cta), pero su contenido debe estar en español.

Entrada:
${payload}

Devuelve SOLO JSON válido:
{
  "text": "<HTML>",
  "cues": {
    "slide": ["string"],
    "keyLine": ["string"],
    "transition": ["string"],
    "pause": ["string"],
    "read": ["string"],
    "quote": ["string"],
    "cta": ["string"]
  }
}`;
  }

  private stripHtmlForWordCount(htmlText: string) {
    return String(htmlText || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private manuscriptWordTargets(options: Required<ManuscriptGenerationOptions>) {
    const baseTarget = Math.round((options.targetMinutes || 22) * this.manuscriptWpm);
    if (options.format === 'notes') {
      const notesTarget = Math.round(baseTarget * 0.65);
      return {
        minWords: Math.max(420, Math.round(notesTarget * 0.78)),
        targetWords: notesTarget,
        maxWords: Math.round(notesTarget * 1.35),
      };
    }

    return {
      minWords: Math.max(650, Math.round(baseTarget * 0.82)),
      targetWords: baseTarget,
      maxWords: Math.round(baseTarget * 1.3),
    };
  }

  private countWords(text: string): number {
    return this.asString(text).split(/\s+/).filter(Boolean).length;
  }

  private sentenceRepetitionSignals(plainText: string): { maxRepeat: number; repeatedSentence: string } {
    const sentences = plainText
      .split(/(?<=[.!?])\s+/)
      .map((item) =>
        item
          .toLowerCase()
          .replace(/\b\d+\b/g, ' ')
          .replace(/[^\p{L}\p{N}\s]/gu, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
      )
      .filter((item) => this.countWords(item) >= 8);
    const counts = new Map<string, number>();
    let maxRepeat = 0;
    let repeatedSentence = '';

    for (const sentence of sentences) {
      const next = (counts.get(sentence) || 0) + 1;
      counts.set(sentence, next);
      if (next > maxRepeat) {
        maxRepeat = next;
        repeatedSentence = sentence;
      }
    }

    return { maxRepeat, repeatedSentence };
  }

  private assessManuscriptQuality(htmlText: string, options: Required<ManuscriptGenerationOptions>) {
    const plainText = this.stripHtmlForWordCount(htmlText);
    const wordTargets = this.manuscriptWordTargets(options);
    const wordCount = this.countWords(plainText);
    const repetition = this.sentenceRepetitionSignals(plainText);
    const repeatedSequence = /(?:\b\d+\s+)?por eso,\s+en cristo jes[uú]s somos la obra de su mano; los que antes estaban muertos son ahora vivos/gi.test(
      plainText.toLowerCase(),
    );

    const issues: string[] = [];
    if (wordCount < wordTargets.minWords) issues.push('too_short');
    if (wordCount > wordTargets.maxWords) issues.push('too_long');
    if (repetition.maxRepeat >= 4 || repeatedSequence) issues.push('repetitive');

    return {
      wordCount,
      targets: wordTargets,
      issues,
      repetition,
      needsRepair: issues.length > 0,
    };
  }

  private manuscriptQualityScore(quality: {
    wordCount: number;
    targets: { minWords: number; targetWords: number; maxWords: number };
    issues: string[];
  }): number {
    const issuePenalty = quality.issues.reduce((sum, issue) => {
      if (issue === 'repetitive') return sum + 4;
      if (issue === 'too_long') return sum + 3;
      if (issue === 'too_short') return sum + 2;
      return sum + 1;
    }, 0);
    const distancePenalty = Math.abs(quality.wordCount - quality.targets.targetWords) / Math.max(quality.targets.targetWords, 1);
    return Number((issuePenalty + distancePenalty).toFixed(4));
  }

  private isQualityImprovement(
    baseline: {
      wordCount: number;
      targets: { minWords: number; targetWords: number; maxWords: number };
      issues: string[];
    },
    candidate: {
      wordCount: number;
      targets: { minWords: number; targetWords: number; maxWords: number };
      issues: string[];
    },
  ): boolean {
    const baselineScore = this.manuscriptQualityScore(baseline);
    const candidateScore = this.manuscriptQualityScore(candidate);
    if (candidateScore + 0.01 < baselineScore) return true;

    const fewerIssues = candidate.issues.length < baseline.issues.length;
    const closerToTarget =
      Math.abs(candidate.wordCount - candidate.targets.targetWords) <
      Math.abs(baseline.wordCount - baseline.targets.targetWords);
    return fewerIssues || closerToTarget;
  }

  private hasUsableManuscriptText(htmlText: string): boolean {
    const plainText = this.stripHtmlForWordCount(htmlText);
    const words = this.countWords(plainText);
    return words >= 40 && plainText.length >= 220;
  }

  private buildManuscriptQualityWarningMessage(issues: string[], language: string): string {
    if (!issues.length) return '';
    const isSpanish = language === 'es';
    const labels = issues.map((issue) => {
      if (issue === 'too_short') return isSpanish ? 'demasiado corto' : 'too short';
      if (issue === 'too_long') return isSpanish ? 'demasiado largo' : 'too long';
      if (issue === 'repetitive') return isSpanish ? 'repetitivo' : 'repetitive';
      return issue;
    });
    return isSpanish
      ? `Borrador guardado con observaciones de calidad: ${labels.join(', ')}.`
      : `Draft saved with quality warnings: ${labels.join(', ')}.`;
  }

  private buildManuscriptQualityRepairPrompt(
    workspace: SermonWorkspace,
    draftHtml: string,
    cues: ManuscriptCues,
    options: Required<ManuscriptGenerationOptions>,
    issues: string[],
    repetitionSample?: string,
  ) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const targets = this.manuscriptWordTargets(options);
    const draftText = this.stripHtmlForWordCount(draftHtml).slice(0, 22000);
    const cuesJson = this.compactJsonForPrompt(cues, 4000);
    const issueList = issues.join(', ');
    const repetitionHint = repetitionSample
      ? `Detected repeated sentence to remove: "${repetitionSample.slice(0, 220)}"`
      : '';

    return `Repair this sermon manuscript output for quality and length.

Language: ${languageLabel}
Main Passage: ${workspace.mainPassage}
Target words: around ${targets.targetWords} (minimum ${targets.minWords}, maximum ${targets.maxWords})
Detected issues: ${issueList}
${repetitionHint}

Hard rules:
- Keep all content in ${languageLabel}.
- Remove loops/repetition and keep prose natural.
- Keep the same theological direction and structure.
- Do not invent Greek/Hebrew/Aramaic words, lexical claims, or historical facts.
- Do not invent Bible references or EGW references.
- Preserve cues shape and intent.

Current draft text:
${draftText}

Current cues:
${cuesJson}

Return ONLY valid JSON:
{
  "text": "<HTML using p,h2,h3,ul,ol,li,strong,em,br tags>",
  "cues": {
    "slide": ["string"],
    "keyLine": ["string"],
    "transition": ["string"],
    "pause": ["string"],
    "read": ["string"],
    "quote": ["string"],
    "cta": ["string"]
  }
}`;
  }

  private buildManuscriptLengthRescuePrompt(
    workspace: SermonWorkspace,
    outline: SermonOutline,
    options: Required<ManuscriptGenerationOptions>,
  ) {
    const basePrompt = this.buildManuscriptPrompt(workspace, outline, options);
    const targets = this.manuscriptWordTargets(options);
    return `${basePrompt}

LENGTH ENFORCEMENT:
- Output must contain between ${targets.minWords} and ${targets.maxWords} words.
- Outputs below ${targets.minWords} words are invalid.
- Expand each section with substantive exposition, transitions, and concrete application.`;
  }

  private normalizeManuscriptForWorkspace(
    workspace: SermonWorkspace,
    parsed: { text: string; cues: ManuscriptCues },
  ): { text: string; cues: ManuscriptCues } {
    let next = {
      text: parsed.text,
      cues: parsed.cues,
    };

    if (workspace.language === 'es') {
      next = {
        ...next,
        text: this.normalizeSpanishManuscriptLabels(next.text),
        cues: {
          slide: next.cues.slide.map((item) => this.normalizeSpanishManuscriptLabels(item)),
          keyLine: next.cues.keyLine.map((item) => this.normalizeSpanishManuscriptLabels(item)),
          transition: next.cues.transition.map((item) => this.normalizeSpanishManuscriptLabels(item)),
          pause: next.cues.pause.map((item) => this.normalizeSpanishManuscriptLabels(item)),
          read: next.cues.read.map((item) => this.normalizeSpanishManuscriptLabels(item)),
          quote: next.cues.quote.map((item) => this.normalizeSpanishManuscriptLabels(item)),
          cta: next.cues.cta.map((item) => this.normalizeSpanishManuscriptLabels(item)),
        },
      };
    }

    return this.sanitizeOutputForLens(next, workspace);
  }

  private buildUnderLengthExpansionBlock(
    workspace: SermonWorkspace,
    outline: SermonOutline,
    neededWords: number,
    passIndex: number = 0,
  ): string {
    const isSpanish = workspace.language === 'es';
    const structure = this.normalizeOutlineData(outline?.structure || {}) || {};
    const pointNodes = Array.isArray(structure.pointNodes) ? structure.pointNodes : [];
    const points = this.extractOutlinePointTexts(structure).slice(0, 4);
    const audience = this.asString(workspace.audienceProfile || '');
    const goal = this.asString(workspace.sermonGoals || '');
    const theme = this.asString(workspace.theme || '');
    const blocks: string[] = [];

    blocks.push(
      isSpanish
        ? `<h2>Profundización Pastoral</h2><p>Antes de concluir, ampliemos cómo este pasaje transforma la vida diaria de la iglesia. Este desarrollo adicional conecta la verdad bíblica con decisiones concretas para ${this.formatManuscriptInline(audience || 'la congregación')}.</p>`
        : `<h2>Pastoral Deepening</h2><p>Before concluding, we deepen how this passage transforms everyday church life. This additional development connects biblical truth with concrete decisions for ${this.formatManuscriptInline(audience || 'the congregation')}.</p>`,
    );

    points.forEach((point, index) => {
      const node = pointNodes[index] || {};
      const title = this.asString(node?.title || point || (isSpanish ? `Punto ${index + 1}` : `Point ${index + 1}`));
      const summary = this.asString(node?.summary || point || '');
      const refs = this.asStringArray(node?.supportingVerses || node?.crossReferences || [], 4);
      const refsText = refs.join(', ');
      const applications = this.asStringArray(node?.applications || [], 3);
      const questions = this.asStringArray(node?.discussionQuestions || [], 2);
      const illustrations = this.asStringArray(node?.illustrationIdeas || [], 2);
      const themes = this.asStringArray(node?.canonicalThemes || [], 2);

      if (isSpanish) {
        blocks.push(
          `<h3>${this.formatManuscriptInline(title)}</h3>` +
            `<p><strong>Desarrollo:</strong> ${this.formatManuscriptInline(summary || 'Este punto llama a una respuesta espiritual profunda y constante.')}</p>` +
            `<p><strong>Aplicación congregacional:</strong> Como iglesia, necesitamos llevar esta verdad al hogar, al servicio y a la misión semanal. ` +
            `Esto implica oración intencional, discipulado activo y testimonio práctico para que la gracia de Cristo se vea en nuestras relaciones.</p>` +
            `<p><strong>Acompañamiento bíblico:</strong> ${this.formatManuscriptInline(refsText || workspace.mainPassage)} nos recuerda que la obediencia nace de la gracia y se expresa en obras preparadas por Dios.</p>` +
            (themes.length
              ? `<p><strong>Enfoque temático:</strong> ${this.formatManuscriptInline(themes.join('; '))}.</p>`
              : '') +
            (illustrations.length
              ? `<p><strong>Apoyo ilustrativo:</strong> ${this.formatManuscriptInline(illustrations.join(' '))}</p>`
              : '') +
            (questions.length
              ? `<p><strong>Puente pastoral:</strong> ${this.formatManuscriptInline(questions.join(' '))}</p>`
              : '') +
            (applications.length
              ? `<p><strong>Paso concreto:</strong> ${this.formatManuscriptInline(applications.join(' '))}</p>`
              : ''),
        );
      } else {
        blocks.push(
          `<h3>${this.formatManuscriptInline(title)}</h3>` +
            `<p><strong>Development:</strong> ${this.formatManuscriptInline(summary || 'This point calls for deep and sustained spiritual response.')}</p>` +
            `<p><strong>Congregational application:</strong> As a church we bring this truth into home life, service, and weekly mission through intentional prayer, active discipleship, and practical witness.</p>` +
            `<p><strong>Biblical grounding:</strong> ${this.formatManuscriptInline(refsText || workspace.mainPassage)} reminds us that obedience flows from grace and is expressed in works prepared by God.</p>` +
            (themes.length
              ? `<p><strong>Thematic focus:</strong> ${this.formatManuscriptInline(themes.join('; '))}.</p>`
              : '') +
            (illustrations.length
              ? `<p><strong>Illustrative support:</strong> ${this.formatManuscriptInline(illustrations.join(' '))}</p>`
              : '') +
            (questions.length
              ? `<p><strong>Pastoral bridge:</strong> ${this.formatManuscriptInline(questions.join(' '))}</p>`
              : '') +
            (applications.length
              ? `<p><strong>Concrete step:</strong> ${this.formatManuscriptInline(applications.join(' '))}</p>`
              : ''),
        );
      }
    });

    if (isSpanish) {
      blocks.push(
        `<p><strong>Enfoque final:</strong> ${this.formatManuscriptInline(goal || 'Respondamos con fe, obediencia y gratitud.')} ` +
          `${this.formatManuscriptInline(theme || '')}</p>`,
      );
    } else {
      blocks.push(
        `<p><strong>Final focus:</strong> ${this.formatManuscriptInline(goal || 'Let us respond with faith, obedience, and gratitude.')} ${this.formatManuscriptInline(theme || '')}</p>`,
      );
    }

    let html = blocks.join('\n');
    const minReasonableWords = Math.max(220, Math.min(1200, neededWords));
    const dynamicPointTitles = points.map((item, idx) => this.asString(pointNodes[idx]?.title || item)).filter(Boolean);
    let safetyCounter = 0;
    while (this.countWords(this.stripHtmlForWordCount(html)) < minReasonableWords && dynamicPointTitles.length) {
      const title = dynamicPointTitles[(passIndex + safetyCounter) % dynamicPointTitles.length];
      html += isSpanish
        ? `<p><strong>Profundización adicional:</strong> Retoma el énfasis de ${this.formatManuscriptInline(title)} y desarrolla su aplicación directa al contexto de ${this.formatManuscriptInline(audience || 'la congregación')}.</p>`
        : `<p><strong>Additional deepening:</strong> Revisit ${this.formatManuscriptInline(title)} and develop direct application for ${this.formatManuscriptInline(audience || 'the congregation')}.</p>`;
      safetyCounter += 1;
      if (safetyCounter > 8) break;
    }

    return html;
  }

  private buildManuscriptExpansionPrompt(
    workspace: SermonWorkspace,
    draftHtml: string,
    cues: ManuscriptCues,
    options: Required<ManuscriptGenerationOptions>,
  ) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const targets = this.manuscriptWordTargets(options);
    const draftText = this.stripHtmlForWordCount(draftHtml).slice(0, 20000);
    const cuesJson = this.compactJsonForPrompt(cues, 4000);

    return `Revise and expand this sermon manuscript to reach the requested length while preserving theological accuracy and structure.

Language: ${languageLabel}
Main Passage: ${workspace.mainPassage}
Target minutes: ${options.targetMinutes}
Target words: around ${targets.targetWords} (minimum ${targets.minWords}, maximum ${targets.maxWords})
Format: ${options.format}

Hard rules:
- Keep all content in ${languageLabel}.
- Return between ${targets.minWords} and ${targets.maxWords} words. Responses below ${targets.minWords} words are rejected.
- Do not invent Greek/Hebrew/Aramaic words, lexical claims, or historical facts not in the draft.
- Do not invent Bible references or EGW references.
- Keep doctrinal alignment Adventist and Scripture-grounded.
- If uncertain about a detail, simplify instead of fabricating.
- Preserve cue intent and return cues in same structure.
- Expand each major section with concrete explanation, biblical grounding, and practical application.
- Do not include meta comments about word count, timing, or generation instructions inside the sermon text.

Current draft text:
${draftText}

Current cues:
${cuesJson}

Return ONLY valid JSON:
{
  "text": "<HTML using p,h2,h3,ul,ol,li,strong,em,br tags>",
  "cues": {
    "slide": ["string"],
    "keyLine": ["string"],
    "transition": ["string"],
    "pause": ["string"],
    "read": ["string"],
    "quote": ["string"],
    "cta": ["string"]
  }
}`;
  }

  private buildManuscriptContext(
    workspace: SermonWorkspace,
    outline: SermonOutline,
    options?: Required<ManuscriptGenerationOptions>,
  ) {
    const cache = workspace.scriptureCache || {};
    const outlineStructure = outline?.structure || {};
    const cacheAny = cache as any;
    
    // ============================================
    // STUDY REPORT - Background intelligence layer
    // ============================================
    const studyReportRaw = workspace.studyReports?.[0]?.sections || {};
    const studyReport = {
      passageOverview: this.asString(studyReportRaw.passageOverview || ''),
      literaryContext: this.asString(studyReportRaw.literaryContext || ''),
      historicalContext: this.asString(studyReportRaw.historicalContext || ''),
      canonicalContext: this.asString(studyReportRaw.canonicalContext || ''),
      exegeticalFlow: this.asStringArray(studyReportRaw.exegeticalFlow || [], 8),
      exegeticalSummary: this.asString(studyReportRaw.exegeticalSummary || ''),
      mainTheologicalClaim: this.asString(studyReportRaw.mainTheologicalClaim || ''),
      theologicalThemes: this.asStringArray(studyReportRaw.theologicalThemes || [], 8),
      interpretiveChallenges: Array.isArray(studyReportRaw.interpretiveChallenges) 
        ? studyReportRaw.interpretiveChallenges.slice(0, 5) 
        : [],
      pastoralImplications: studyReportRaw.pastoralImplications || {},
    };

    // ============================================
    // WORD STUDIES - Original language insights (global, for context)
    // ============================================
    const wordStudyData = cacheAny?.wordStudy || cacheAny?.wordStudies || [];
    const keyTermsFromStudy = Array.isArray(studyReportRaw.keyTerms) ? studyReportRaw.keyTerms : [];
    const wordStudies = [
      ...keyTermsFromStudy.map((kt: any) => ({
        word: this.asString(kt?.term || kt?.word || ''),
        originalLanguage: this.asString(kt?.language || ''),
        transliteration: this.asString(kt?.transliteration || ''),
        meaning: this.asString(kt?.definition || kt?.meaning || ''),
        significance: this.asString(kt?.nuance || kt?.significance || ''),
      })),
      ...(Array.isArray(wordStudyData) ? wordStudyData.slice(0, 6).map((ws: any) => ({
        word: this.asString(ws?.word || ws?.originalWord || ''),
        originalLanguage: this.asString(ws?.language || ''),
        transliteration: this.asString(ws?.transliteration || ''),
        meaning: this.asString(ws?.meaning || ws?.definition || ''),
        significance: this.asString(ws?.significance || ws?.theologicalSignificance || ''),
      })) : []),
    ].filter((ws) => ws.word).slice(0, 10);

    // ============================================
    // OUTLINE AS AUTHORITY - Each point carries its own assets
    // ============================================
    const rawPointNodes = Array.isArray(outlineStructure?.pointNodes) ? outlineStructure.pointNodes.slice(0, 8) : [];
    const outlinePoints = this.extractOutlinePointTexts(outlineStructure).slice(0, 8);
    
    // Normalize each point node with its attached assets
    const enrichedPointNodes = rawPointNodes.map((point: any, index: number) => ({
      // Point identity
      title: this.asString(point?.title || outlinePoints[index] || `Point ${index + 1}`),
      summary: this.asString(point?.summary || ''),
      subpoints: this.asStringArray(point?.subpoints || [], 5),
      
      // Scripture support for THIS point
      supportingVerses: this.asStringArray(point?.supportingVerses || point?.verses || [], 6),
      crossReferences: this.asStringArray(point?.crossReferences || point?.references || [], 6),
      
      // Preaching assets for THIS point (not global!)
      applications: this.asStringArray(point?.applications || [], 12),
      illustrationIdeas: this.asStringArray(point?.illustrationIdeas || [], 12),
      discussionQuestions: this.asStringArray(point?.discussionQuestions || [], 12),
      
      // Theological anchors for THIS point
      canonicalThemes: this.asStringArray(point?.canonicalThemes || [], 4),
      
      // EGW support for THIS point
      egwSupport: Array.isArray(point?.egwSupport) 
        ? point.egwSupport.slice(0, 3).map((e: any) => ({
            citation: this.asString(e?.citation || e?.reference || ''),
            quote: this.asString(e?.quote || e?.text || ''),
            relevance: this.asString(e?.relevance || e?.summary || ''),
          })).filter((e: any) => e.citation || e.quote)
        : [],
    }));

    // ============================================
    // GLOBAL EGW QUOTES - For intro/conclusion
    // ============================================
    const egwQuotesData = cacheAny?.egwQuotes || cacheAny?.egwSupport || [];
    const globalEgwQuotes = Array.isArray(egwQuotesData)
      ? egwQuotesData.slice(0, 4).map((q: any) => ({
          text: this.asString(q?.text || q?.quote || q?.content || ''),
          source: this.asString(q?.source || q?.reference || q?.book || ''),
          theme: this.asString(q?.theme || q?.topic || ''),
        })).filter((q: any) => q.text)
      : [];

    // ============================================
    // GLOBAL CROSS REFERENCES - For intro/conclusion
    // ============================================
    const studyCrossRefs = Array.isArray(studyReportRaw.crossReferences) 
      ? studyReportRaw.crossReferences.slice(0, 8) 
      : [];
    const cachedCrossRefs = Array.isArray(cache?.crossReferences?.ranked)
      ? cache.crossReferences.ranked.slice(0, 8)
      : [];
    const crossRefMap = new Map<string, any>();
    [...studyCrossRefs, ...cachedCrossRefs].forEach((ref: any) => {
      const key = this.asString(ref?.reference || ref?.verse || '');
      if (key && !crossRefMap.has(key)) {
        crossRefMap.set(key, {
          reference: key,
          connection: this.asString(ref?.connection || ref?.explanation || ref?.reason || ''),
        });
      }
    });
    const globalCrossReferences = Array.from(crossRefMap.values()).slice(0, 12);

    // ============================================
    // CITATIONS - External references (global)
    // ============================================
    const citations = (workspace.citations || [])
      .slice(0, 6)
      .map((c: any) => ({
        source: this.asString(c?.source || c?.author || ''),
        quote: this.asString(c?.quote || c?.text || c?.content || ''),
        context: this.asString(c?.context || ''),
      }))
      .filter((c: any) => c.quote);

    // ============================================
    // PREACHING INSIGHTS - From scripture cache
    // ============================================
    const preachingInsights = {
      passageSummary: this.asString(cache?.passageSummary || ''),
      studySynthesis: this.asString(cache?.studySynthesis || ''),
      structuralAnalysis: cache?.structuralAnalysis || null,
      verseCommentary: cache?.verseCommentary || null,
    };

    const includeStudyInsights = options?.includeStudyInsights === true;

    return {
      // ============================================
      // OUTLINE IS THE AUTHORITY
      // Each point carries its own assets - no global pools
      // ============================================
      outline: {
        title: this.asString(outline?.title),
        introduction: this.asString(outlineStructure?.introduction),
        // pointNodes ARE the source of truth for manuscript generation
        pointNodes: enrichedPointNodes,
        conclusion: this.asString(outlineStructure?.conclusion),
        callToAction: this.asString(outlineStructure?.callToAction),
      },
      
      // Passage data
      passage: {
        main: workspace.mainPassage,
        additional: workspace.additionalPassages || [],
      },
      
      // Study intelligence (background context, not primary)
      studyReport: includeStudyInsights
        ? studyReport
        : {
            passageOverview: studyReport.passageOverview,
            mainTheologicalClaim: studyReport.mainTheologicalClaim,
          },
      preachingInsights,
      wordStudies: includeStudyInsights ? wordStudies : [],
      
      // Global assets (for intro/conclusion only)
      globalCrossReferences,
      globalEgwQuotes,
      citations,
      
      // Workspace settings
      settings: {
        title: workspace.title,
        seriesTitle: workspace.seriesTitle || '',
        theme: workspace.theme || '',
        sermonGoals: workspace.sermonGoals || '',
        audienceProfile: workspace.audienceProfile || '',
        storyArc: workspace.storyArc || '',
        theologicalLens: normalizeTheologicalLens(workspace.theologicalLens),
        style: workspace.style || '',
      },
    };
  }

  buildManuscriptPrompt(
    workspace: SermonWorkspace,
    outline: SermonOutline,
    options?: ManuscriptGenerationOptions,
  ) {
    const isSpanish = workspace.language === 'es';
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    const normalizedOptions = this.normalizeManuscriptOptions(workspace, options);
    const wordTargets = this.manuscriptWordTargets(normalizedOptions);
    const manuscriptContext = this.buildManuscriptContext(workspace, outline, normalizedOptions);
    const contextJson = this.compactJsonForPrompt(manuscriptContext, 24000);
    
    // Extract point nodes - THE AUTHORITY for manuscript structure
    const pointNodes = manuscriptContext?.outline?.pointNodes || [];

    // Build point-by-point instructions showing each point's attached assets
    const pointInstructions = pointNodes.map((point: any, index: number) => {
      const apps = point.applications?.length ? point.applications.join('; ') : 'none provided';
      const illus = point.illustrationIdeas?.length ? point.illustrationIdeas.join('; ') : 'none provided';
      const refs = point.crossReferences?.length ? point.crossReferences.join(', ') : 'none provided';
      const egw = point.egwSupport?.length ? point.egwSupport.map((e: any) => e.citation || e.quote).join('; ') : 'none provided';
      
      return `${isSpanish ? 'PUNTO' : 'POINT'} ${index + 1}: "${point.title}"
   Summary: ${point.summary || 'Expand from title'}
   Supporting Verses: ${point.supportingVerses?.join(', ') || 'Use main passage'}
   Cross-References FOR THIS POINT: ${refs}
   Applications FOR THIS POINT: ${apps}
   Illustrations FOR THIS POINT: ${illus}
   EGW Support FOR THIS POINT: ${egw}
   
   → Write a SUBSTANTIAL section that:
     - Explains the biblical truth deeply
     - Uses the cross-references listed above
     - Includes the illustration(s) listed above
     - Ends with the application(s) listed above
     - Cites EGW if provided above`;
    }).join('\n\n');

    return `${doctrinalContext}

You are writing a sermon manuscript. The OUTLINE is your structural authority - each point carries its own assets.

=== SERMON METADATA ===
Title: ${workspace.title}
Series: ${workspace.seriesTitle || 'N/A'}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Tone: ${normalizedOptions.tone}
Target Length: ${normalizedOptions.targetMinutes} minutes (~${Math.round(normalizedOptions.targetMinutes * this.manuscriptWpm)} words)

=== STUDY DATA (background context) ===
${contextJson}

=== LANGUAGE ===
Write entirely in ${languageLabel}.
${isSpanish ? 'Spanish-only requirement: do not output any section title, sentence, or cue in English.' : ''}

=== CRITICAL: OUTLINE IS THE AUTHORITY ===

Each sermon point carries its OWN assets. Do NOT mix assets between points.
Use the applications, illustrations, and cross-references ATTACHED TO EACH POINT.

${pointInstructions || 'Use outline.pointNodes from the study data above.'}

=== SERMON STRUCTURE ===

1. INTRODUCTION
   - Hook the audience
   - Use studyReport.passageOverview to set the scene
   - State the mainTheologicalClaim
   - Use globalCrossReferences or globalEgwQuotes if helpful

2. PASSAGE READING
   - Present ${workspace.mainPassage}
   - Brief transition

3. CONTEXT (Literary & Historical)
   - Use studyReport.literaryContext and historicalContext
   - Address interpretiveChallenges if present

4. MAIN POINTS (${pointNodes.length} points - follow outline exactly)
   - For EACH point, use ONLY the assets attached to that point
   - Include word study insights from wordStudies where relevant
   - Each point should be substantial with explanation → illustration → application

5. CONCLUSION & INVITATION
   - Synthesize the main points
   - Restate mainTheologicalClaim
   - Clear call to action from outline.callToAction

=== QUALITY REQUIREMENTS ===
- Manuscript must be SUBSTANTIAL (${normalizedOptions.targetMinutes} minutes)
- Length target: ~${wordTargets.targetWords} words (minimum ${wordTargets.minWords}, maximum ${wordTargets.maxWords})
- Each point uses ITS OWN applications, illustrations, cross-references
- Do NOT drift - keep assets tied to their points
- Use word studies to add depth
- Address interpretive challenges honestly
- Do not invent Greek/Hebrew/Aramaic words, lexical claims, or historical details.
- Do not invent Bible references or EGW references/citations.
- If a detail is uncertain, omit it instead of fabricating.

=== OUTPUT FORMAT ===
Return ONLY valid JSON:
{
  "text": "<HTML using p,h2,h3,ul,ol,li,strong,em,br tags>",
  "cues": {
    "slide": ["string"],
    "keyLine": ["string"],
    "transition": ["string"],
    "pause": ["string"],
    "read": ["string"],
    "quote": ["string"],
    "cta": ["string"]
  }
}

HTML Guidelines:
- Use h2 for major sections (${isSpanish ? 'Introducción, Contexto, Punto 1, Punto 2, etc., Conclusión' : 'Introduction, Context, Point 1, Point 2, etc., Conclusion'})
- Use h3 for subsections within points
- Short paragraphs (2-4 sentences)
- Use <strong>Label:</strong> for moves like Explanation, Application, Illustration
- ${normalizedOptions.includeSlideCues ? 'Populate cues.slide with presenter prompts.' : 'Leave cues.slide empty.'}
- ${normalizedOptions.includeKeyLines ? 'Populate cues.keyLine with memorable statements.' : 'Leave cues.keyLine empty.'}
- ${normalizedOptions.format === 'notes' ? 'Use concise preaching-note style.' : 'Use full spoken manuscript style.'}`;
  }

  private buildManuscriptCueRefreshPrompt(workspace: SermonWorkspace, manuscriptHtml: string) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const plainText = this.stripHtmlForWordCount(manuscriptHtml).slice(0, 16000);
    return `Extract preaching cues from this sermon manuscript.

Language: ${languageLabel}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}

Rules:
- Return ONLY valid JSON.
- Use manuscript wording (do not invent unrelated content).
- Keep each cue concise.
- Provide 2-8 items per cue type when available.
- Keep all cue content in ${languageLabel}.

Manuscript Text:
${plainText}

Output shape:
{
  "slide": ["string"],
  "keyLine": ["string"],
  "transition": ["string"],
  "pause": ["string"],
  "read": ["string"],
  "quote": ["string"],
  "cta": ["string"]
}`;
  }

  buildApplicationsPrompt(workspace: SermonWorkspace, mainPoints: string[], audienceType: string, seededApplications: string[] = []) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate practical applications for ${audienceType} based on:
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Main Points: ${mainPoints.join(', ') || 'N/A'}
${seededApplications.length ? `Existing study applications to refine: ${seededApplications.join(' | ')}` : ''}

Write in ${languageLabel}.

Provide 8-12 specific, actionable applications.

Rules:
- Return ONLY a numbered list (1., 2., 3., etc.).
- Each line must be a single sentence starting with a verb.
- End each line with a verse reference in the format "(Verse: Book 1:1)".
- No tables, no pipes, no markdown, no headings, no extra commentary.`;
  }

  private resolveApplicationAudienceTypes(workspace: SermonWorkspace): AudienceType[] {
    const profile = this.asString(workspace?.audienceProfile || '').toLowerCase();
    if (!profile) {
      return [
        AudienceType.YOUTH,
        AudienceType.NEW_BELIEVERS,
        AudienceType.LEADERSHIP,
        AudienceType.MIXED_CONGREGATION,
        AudienceType.PASTORAL_CARE,
        AudienceType.SMALL_GROUP,
      ];
    }

    const matches = new Set<AudienceType>();
    const hasAny = (terms: string[]) => terms.some((term) => profile.includes(term));

    if (hasAny(['youth', 'young', 'teen', 'teens', 'student', 'students', 'joven', 'jóven', 'jóvenes', 'juventud'])) {
      matches.add(AudienceType.YOUTH);
    }
    if (hasAny(['new believer', 'new believers', 'new convert', 'new converts', 'nuevo creyente', 'nuevos creyentes', 'recien convertido', 'recién convertido'])) {
      matches.add(AudienceType.NEW_BELIEVERS);
    }
    if (hasAny(['leader', 'leaders', 'leadership', 'elder', 'elders', 'deacon', 'deacons', 'lider', 'líder', 'líderes', 'liderazgo', 'anciano', 'ancianos', 'diacono', 'diácono'])) {
      matches.add(AudienceType.LEADERSHIP);
    }
    if (hasAny(['pastoral care', 'care', 'grief', 'counsel', 'healing', 'broken', 'sick', 'hospital', 'cuidado pastoral', 'duelo', 'consejeria', 'consejería', 'sanidad', 'enfermo', 'enfermos'])) {
      matches.add(AudienceType.PASTORAL_CARE);
    }
    if (hasAny(['small group', 'small groups', 'cell group', 'bible class', 'home group', 'grupo pequeno', 'grupo pequeño', 'grupos pequenos', 'grupos pequeños', 'celula', 'célula', 'escuela sabatica', 'escuela sabática'])) {
      matches.add(AudienceType.SMALL_GROUP);
    }
    if (hasAny(['mixed', 'general congregation', 'all ages', 'families', 'family', 'congregation', 'multigenerational', 'multi-generational', 'mixto', 'congregacion', 'congregación', 'familias', 'multigeneracional'])) {
      matches.add(AudienceType.MIXED_CONGREGATION);
    }

    if (!matches.size) {
      matches.add(AudienceType.MIXED_CONGREGATION);
    }

    return Array.from(matches);
  }

  buildDiscussionPrompt(workspace: SermonWorkspace, seededQuestions: string[] = []) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate discussion questions for a small group study on:
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}

Write in ${languageLabel}.

Provide 10-14 thought-provoking questions that encourage deep reflection and application.
${seededQuestions.length ? `\nUse and sharpen these existing study questions when helpful:\n${seededQuestions.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}` : ''}

Rules:
- Return ONLY a numbered list (1., 2., 3., etc.).
- End each question with a verse reference in the format "(Verse: Book 1:1)".
- No tables, no pipes, no markdown, no headings, no extra commentary.`;
  }

  buildMediaSuggestionsPrompt(
    workspace: SermonWorkspace,
    passageText: string,
    studyInputs: any,
    reportSections: Record<string, any>,
    existingPrompts: string[] = [],
  ) {
    const isSpanish = workspace.language === 'es';
    const languageLabel = isSpanish ? 'Spanish' : 'English';
    const typeOptions = isSpanish
      ? 'Imagen · Hero|Imagen · Punto 1|Imagen · Punto 2|Imagen · Punto 3|Imagen · Aplicación|Imagen · Cierre|Video · Intro Loop|Video · Transición|Voz · Reflexión Inicial|Voz · Llamado Final|Música · Tema Principal|Música · Base Instrumental|Social · Instagram Post|Social · Instagram Story|Social · Facebook Post|Social · WhatsApp Status|Social · YouTube Thumbnail|Social · X Post'
      : 'Image · Hero|Image · Point 1|Image · Point 2|Image · Point 3|Image · Application|Image · Closing|Video · Intro Loop|Video · Transition|Voice · Opening Reflection|Voice · Closing Appeal|Music · Theme Song|Music · Instrumental Bed|Social · Instagram Post|Social · Instagram Story|Social · Facebook Post|Social · WhatsApp Status|Social · YouTube Thumbnail|Social · X Post';
    const localeRules = isSpanish
      ? `Regla crítica de idioma:
- Responde ÚNICAMENTE en español.
- No uses inglés en "type", "intent", "useCase" ni "prompt".
- Usa terminología ministerial natural en español.`
      : `Language rule:
- Respond ONLY in English.
- Do not use Spanish in "type", "intent", "useCase", or "prompt".`;
    const contextJson = this.compactJsonForPrompt(
      {
        workspace: {
          title: workspace.title,
          mainPassage: workspace.mainPassage,
          theme: workspace.theme || '',
          audienceProfile: workspace.audienceProfile || '',
          sermonGoals: workspace.sermonGoals || '',
          language: workspace.language || 'en',
        },
        passageText,
        reportSections: {
          passageOverview: this.asString(reportSections?.passageOverview),
          exegeticalFlow: Array.isArray(reportSections?.exegeticalFlow) ? reportSections.exegeticalFlow : [],
          theologicalThemes: Array.isArray(reportSections?.theologicalThemes) ? reportSections.theologicalThemes : [],
          pastoralImplications: reportSections?.pastoralImplications || null,
          structureOfPassage: Array.isArray(reportSections?.structureOfPassage)
            ? reportSections.structureOfPassage
            : [],
        },
        studyInputs: {
          cachedStudySections: studyInputs?.cachedStudySections || {},
          referenceData: studyInputs?.referenceData || {},
        },
        existingPrompts,
      },
      7000,
    );

    return `You are a sermon media director.

Generate high-quality, production-ready media suggestions for sermon preparation.

Language: ${languageLabel}
Context:
${contextJson}

Return ONLY valid JSON in this exact shape:
{
  "mediaSuggestions": [
    {
      "type": "${typeOptions}",
      "intent": "short intent label",
      "useCase": "where and how the pastor should use this asset during sermon delivery",
      "prompt": "final production prompt"
    }
  ]
}

Rules:
${localeRules}
- Generate 12-18 suggestions total.
- Required minimums:
  - Images: at least 6 (Hero, each major point, Application, Closing).
  - Video: at least 2 (Intro Loop, Transition).
  - Voice: at least 2 (Opening Reflection, Closing Appeal).
  - Music: at least 2 (Theme Song, Instrumental Bed).
  - Social: at least 4 (Instagram Post, Instagram Story, Facebook Post, WhatsApp Status).
- Every suggestion must be concrete and usable as a prompt, not abstract advice.
- Prompts must be context-grounded in the passage, theological focus, and audience.
- Do NOT generate slide/presentation prompts.
- Prioritize deliverable assets: images, videos, song audio, pastor voice audio, social promo.
- For "Voz Pastoral", "useCase" must explain practical sermon usage (opening reflection, transition narration, closing appeal recap, etc.).
- For image/video prompts, include visual direction details (subject, environment, symbolism, camera/framing, lighting, style, color palette).
- For music prompts, include mode/genre/tempo/mood/instrumentation and use-case constraints.
- For social prompts, include platform-specific framing and wording that fits each network format.
- Keep "intent" short (2-6 words).
- No markdown, no prose outside JSON, no code fences.`;
  }

  private compactJsonForPrompt(value: any, maxChars: number = 6000): string {
    try {
      const text = JSON.stringify(value, null, 2);
      if (text.length <= maxChars) return text;
      return `${text.slice(0, maxChars)}\n...TRUNCATED...`;
    } catch {
      return '{}';
    }
  }

  private extractBookFromReference(reference: string): string {
    const match = String(reference || '').trim().match(/^(.*?)\s+\d+/);
    return match?.[1]?.trim() || String(reference || '').trim();
  }

  private describeCrossReferenceCategory(category: string): string {
    const normalized = this.asString(category).toLowerCase();
    if (normalized === 'quotation') return 'This passage is linked by direct quotation or strong verbal overlap.';
    if (normalized === 'typology') return 'This passage mirrors the same pattern or biblical type.';
    if (normalized === 'prophetic_fulfillment') return 'This passage advances a prophecy-to-fulfillment connection.';
    if (normalized === 'narrative_continuation') return 'This passage continues the same storyline or redemptive movement.';
    if (normalized === 'interpretive_tension') return 'This passage sharpens the same theological tension or interpretive issue.';
    if (normalized === 'lexical') return 'This passage shares important wording or key terms with the main text.';
    if (normalized === 'thematic') return 'This passage develops the same theological theme from another angle.';
    return 'This passage supports the same theme or doctrinal movement in the study.';
  }

  private async buildStudyReportInputContext(workspace: SermonWorkspace, passageText: string) {
    const reference = workspace.mainPassage;
    const book = this.extractBookFromReference(reference);
    const cache = workspace.scriptureCache || {};
    const egwReference = this.parseReferenceForEgw(reference);
    const includeEgw = Boolean((workspace as any)?.egwEnabled || workspace?.metadata?.egwEnabled);

    const [bookMetadata, historicalContext, culturalContext, timeline, crossReferences, crossReferenceDetails] = await Promise.all([
      this.scriptureService.getBookMetadata(book).catch(() => null),
      this.scriptureService.getHistoricalContext(book).catch(() => null),
      this.scriptureService.getCulturalContext(book).catch(() => null),
      this.scriptureService.getTimeline(book).catch(() => null),
      this.scriptureService.getCrossReferences(reference).catch(() => []),
      this.scriptureService.getCrossReferenceDetails(reference).catch(() => []),
    ]);

    const xrefCategoryMap = new Map(
      (Array.isArray(crossReferenceDetails) ? crossReferenceDetails : []).map((item: any) => [
        String(item?.reference || ''),
        {
          category: String(item?.category || ''),
          connection: String(item?.connection || item?.explanation || item?.reason || ''),
        },
      ]),
    );

    const cachedRankedMap = new Map(
      (Array.isArray(cache?.crossReferences?.ranked) ? cache.crossReferences.ranked : []).map((item: any) => [
        String(item?.reference || ''),
        {
          category: String(item?.category || ''),
          connection: String(item?.explanation || item?.connection || item?.reason || ''),
        },
      ]),
    );

    const normalizedCrossReferences = (Array.isArray(crossReferences) ? crossReferences : [])
      .slice(0, 20)
      .map((ref: string) => {
        const detailed = xrefCategoryMap.get(ref);
        const cached = cachedRankedMap.get(ref);
        const category = this.asString(detailed?.category || cached?.category || '');
        const connection = this.asString(detailed?.connection || cached?.connection || this.describeCrossReferenceCategory(category));
        return {
          reference: ref,
          category,
          connection,
        };
      });

    const egwSection =
      includeEgw && egwReference
        ? await this.egwStudyReportService
            .generateStudyReportSection(
              egwReference.book,
              egwReference.chapter,
              egwReference.verseStart,
              egwReference.verseEnd,
              true,
            )
            .catch(() => null)
        : null;

    return {
      passage: {
        reference,
        text: passageText,
      },
      workspace: {
        title: workspace.title,
        theme: workspace.theme || '',
        audienceProfile: workspace.audienceProfile || '',
        sermonGoals: workspace.sermonGoals || '',
        language: workspace.language || 'en',
        theologicalLens: normalizeTheologicalLens(workspace.theologicalLens),
      },
      cachedStudySections: {
        passageSummary: cache?.passageSummary || null,
        verseContext: cache?.perVerseContext || null,
        translationComparison: cache?.translationComparison || null,
        verseCommentary: cache?.verseCommentary || null,
        structuralAnalysis: cache?.structuralAnalysis || null,
        interpretiveChallenges: cache?.interpretiveChallenges || null,
        canonicalThemes: cache?.canonicalThemes || null,
        studySynthesis: cache?.studySynthesis || null,
        contextData: cache?.contextData || null,
        wordStudy: cache?.wordStudy || null,
        crossReferencesLookup: cache?.crossReferences || null,
      },
      referenceData: {
        crossReferences: normalizedCrossReferences,
        savedReferences: this.normalizeReferenceEntries(workspace.references || [], 20),
        bookMetadata,
        historicalContext,
        culturalContext,
        timeline,
      },
      egwSection,
    };
  }

  buildStudyReportPrompt(workspace: SermonWorkspace, passageText: string, studyInputs: any) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    const inputJson = this.compactJsonForPrompt(studyInputs, 12000);
    
    return `${doctrinalContext}

Generate a structured exegetical study report for:
Main Passage: ${workspace.mainPassage}
Passage Text:
${passageText}

Theme: ${workspace.theme || 'N/A'}
Theological Lens: ${theologicalLens}

Study Data Inputs (use these as primary evidence; do not ignore them):
${inputJson}

Write in ${languageLabel}.

Return ONLY valid JSON with this exact shape:
{
  "passageOverview": "string",
  "literaryContext": "string",
  "exegeticalFlow": ["string"],
  "exegeticalSummary": "string",
  "structureOfPassage": [
    {
      "movement": "string",
      "verses": "string",
      "summary": "string"
    }
  ],
  "keyTerms": [
    {
      "term": "string",
      "language": "Greek|Hebrew|Aramaic",
      "transliteration": "string",
      "definition": "string",
      "nuance": "string"
    }
  ],
  "historicalContext": "string",
  "canonicalContext": "string",
  "crossReferences": [
    {
      "reference": "Book 1:1",
      "connection": "why it connects",
      "category": "thematic|quotation|typology|prophetic_fulfillment|narrative_continuation|interpretive_tension|lexical",
      "tier": "primary|secondary|illustrative"
    }
  ],
  "interpretiveChallenges": [
    {
      "question": "string",
      "interpretationOptions": ["string"],
      "preachingGuidance": "string"
    }
  ],
  "theologicalThemes": ["string"],
  "mainTheologicalClaim": "one-sentence doctrinal claim",
  "pastoralImplications": {
    "personalLife": ["string"],
    "churchLife": ["string"],
    "mission": ["string"]
  },
  "studyAssets": {
    "movementAssets": [
      {
        "movement": "string",
        "verses": "string",
        "summary": "string",
        "applications": ["string"],
        "discussionQuestions": ["string"],
        "illustrationIdeas": ["string"],
        "mediaSuggestions": ["string"],
        "egwSupport": [
          {
            "citation": "string",
            "quote": "string",
            "relevance": "string"
          }
        ],
        "references": ["string"]
      }
    ],
    "categoryAssets": {
      "applications": ["string"],
      "discussionQuestions": ["string"],
      "illustrationIdeas": ["string"],
      "mediaSuggestions": ["string"],
      "egwSupport": [
        {
          "citation": "string",
          "quote": "string",
          "relevance": "string"
        }
      ],
      "references": [
        {
          "reference": "Book 1:1",
          "context": "string"
        }
      ]
    }
  }
}

Rules:
- This is exegetical analysis, not a sermon draft.
- Keep each section concise, concrete, and passage-grounded.
- "mainTheologicalClaim" must be one sentence and explicit.
- "exegeticalFlow" must describe argument progression (not just outline labels).
- "structureOfPassage" must include visible verse anchoring in "verses".
- "studyAssets" must organize sermon material already grounded in the passage for later outline work.
- Use saved references and EGW input when available instead of inventing generic assets.
- For "crossReferences", always explain connection with a concrete reason.
- For "interpretiveChallenges", provide at least 2 interpretationOptions when possible.
- In "canonicalContext", show storyline movement (OT -> Christ/NT -> consummation) when applicable.
- "pastoralImplications" must be categorized by personalLife, churchLife, and mission.
- Prioritize supplied Study Data Inputs over generic assumptions.
- If a required field has insufficient evidence, explicitly return "Insufficient data available" in that field.
- No markdown, no prose outside JSON, no code fences.`;
  }

  private asString(value: any): string {
    if (typeof value === 'string') return value.trim();
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }

  private asStringArray(value: any, limit = 12): string[] {
    if (Array.isArray(value)) {
      return value.map((item) => this.asString(item)).filter(Boolean).slice(0, limit);
    }
    if (typeof value === 'string') {
      return this.parseListFromResponse(value).slice(0, limit);
    }
    return [];
  }

  private sanitizeAdventistWorshipLanguage(text: string, language: string): string {
    let transformed = SDAAlignmentService.transformContent(String(text || ''));
    const isSpanish = String(language || '').toLowerCase().startsWith('es');

    if (isSpanish) {
      transformed = transformed
        .replace(/\best[ea]\s+domingo\b/gi, 'este sábado')
        .replace(/\bel\s+domingo\b/gi, 'el sábado')
        .replace(/\bde\s+domingo\b/gi, 'de sábado')
        .replace(/\bculto\s+dominical\b/gi, 'culto de sábado')
        .replace(/\bdominical\b/gi, 'de sábado')
        .replace(/\bdomingo\b/gi, 'sábado');
      return transformed;
    }

    transformed = transformed
      .replace(/\bthis\s+Sunday\b/gi, 'this Sabbath')
      .replace(/\bon\s+Sunday\b/gi, 'on Sabbath')
      .replace(/\bSunday\b/gi, 'Sabbath');
    return transformed;
  }

  private sanitizeOutputForLens<T>(value: T, workspace: SermonWorkspace): T {
    const lens = normalizeTheologicalLens(workspace?.theologicalLens);
    if (lens !== 'adventist' || value === null || value === undefined) {
      return value;
    }

    const language = this.asString(workspace?.language || 'en');
    const sanitizeRecursive = (input: any): any => {
      if (typeof input === 'string') {
        return this.sanitizeAdventistWorshipLanguage(input, language);
      }
      if (Array.isArray(input)) {
        return input.map((item) => sanitizeRecursive(item));
      }
      if (input && typeof input === 'object') {
        const next: Record<string, any> = {};
        for (const [key, val] of Object.entries(input)) {
          next[key] = sanitizeRecursive(val);
        }
        return next;
      }
      return input;
    };

    return sanitizeRecursive(value) as T;
  }

  private normalizeReferenceEntries(value: any, limit = 12) {
    if (!Array.isArray(value)) return [];
    return value
      .map((item: any) => {
        if (typeof item === 'string') {
          return { reference: this.asString(item), context: '', addedAt: '' };
        }
        return {
          reference: this.asString(item?.reference || item?.label || item?.id),
          context: this.asString(item?.context || item?.connection || item?.relevance),
          addedAt: this.asString(item?.addedAt || ''),
        };
      })
      .filter((item) => item.reference)
      .slice(0, limit);
  }

  private buildStudyReportBaseSections(studyInputs: any): Record<string, any> {
    const summary = studyInputs?.cachedStudySections?.passageSummary || {};
    const verseContext = studyInputs?.cachedStudySections?.verseContext || {};
    const structural = studyInputs?.cachedStudySections?.structuralAnalysis || {};
    const challenges = studyInputs?.cachedStudySections?.interpretiveChallenges || {};
    const canonical = studyInputs?.cachedStudySections?.canonicalThemes || {};
    const synthesis = studyInputs?.cachedStudySections?.studySynthesis || {};
    const wordStudy = studyInputs?.cachedStudySections?.wordStudy || {};
    const referenceData = studyInputs?.referenceData || {};

    const historicalNotes = Array.isArray(verseContext?.historical)
      ? verseContext.historical.map((item: any) => this.asString(item?.note)).filter(Boolean)
      : [];
    const culturalNotes = Array.isArray(verseContext?.cultural)
      ? verseContext.cultural.map((item: any) => this.asString(item?.note)).filter(Boolean)
      : [];

    const crossReferences = Array.isArray(referenceData?.crossReferences)
      ? referenceData.crossReferences.slice(0, 8).map((item: any) => ({
          reference: this.asString(item?.reference),
          connection: this.asString(item?.connection || this.describeCrossReferenceCategory(item?.category)),
          category: this.asString(item?.category || 'thematic'),
          tier: 'secondary',
        }))
      : [];

    const interpretiveChallenges = challenges?.challenge
      ? [
          {
            question: this.asString(challenges.challenge),
            interpretationOptions: Array.isArray(challenges?.views)
              ? challenges.views.map((item: any) => this.asString(item?.summary || item?.viewName)).filter(Boolean).slice(0, 4)
              : [],
            preachingGuidance: this.asString(challenges?.sdaPerspective?.reasoning || ''),
          },
        ]
      : [];

    const canonicalThemes = Array.isArray(canonical?.themes)
      ? canonical.themes.map((item: any) => this.asString(item?.theme)).filter(Boolean).slice(0, 8)
      : [];

    const keyTerms = Array.isArray(wordStudy?.insights)
      ? wordStudy.insights.slice(0, 6).map((item: any) => ({
          term: this.asString(item?.term || item?.word),
          language: this.asString(item?.language || ''),
          transliteration: this.asString(item?.transliteration || ''),
          definition: this.asString(item?.definition || item?.gloss || ''),
          nuance: this.asString(item?.nuance || item?.summary || ''),
        }))
      : [];

    const allImplications = Array.from(
      new Set(
        [
          ...this.asStringArray(synthesis?.personalApplication || [], 4),
          ...this.asStringArray(synthesis?.churchApplication || [], 4),
          ...this.asStringArray(synthesis?.missionApplication || [], 4),
          ...this.asStringArray(synthesis?.applications || [], 8),
          ...culturalNotes,
        ].map((item) => item.trim()).filter(Boolean),
      ),
    ).slice(0, 9);

    const personalLife = this.asStringArray(synthesis?.personalApplication || [], 4);
    const churchLife = this.asStringArray(synthesis?.churchApplication || [], 4);
    const mission = this.asStringArray(synthesis?.missionApplication || culturalNotes, 4);

    const distributedImplications = {
      personalLife: personalLife.length ? personalLife : allImplications.slice(0, 3),
      churchLife: churchLife.length ? churchLife : allImplications.slice(3, 6),
      mission: mission.length ? mission : allImplications.slice(6, 9),
    };

    return {
      passageOverview: this.asString(summary?.summary || synthesis?.summary || ''),
      literaryContext: this.asString(referenceData?.bookMetadata?.literaryType || referenceData?.bookMetadata?.genre || ''),
      exegeticalFlow: this.asStringArray(summary?.movement || synthesis?.movement || [], 8),
      exegeticalSummary: this.asString(synthesis?.summary || summary?.interpretiveCenter || ''),
      structureOfPassage: Array.isArray(structural?.structure)
        ? structural.structure.map((item: any) => ({
            movement: this.asString(item?.description || item?.type),
            verses: this.asString(item?.verses),
            summary: this.asString(item?.description || item?.type),
          }))
        : [],
      keyTerms,
      historicalContext: [this.asString(referenceData?.historicalContext?.summary || ''), ...historicalNotes].filter(Boolean).join(' '),
      canonicalContext: this.asString(
        synthesis?.canonicalContext ||
          (Array.isArray(canonical?.themes)
            ? canonical.themes
                .map((item: any) => this.asString(item?.canonicalMovement))
                .filter(Boolean)
                .slice(0, 2)
                .join(' | ')
            : ''),
      ),
      crossReferences,
      interpretiveChallenges,
      theologicalThemes: canonicalThemes,
      mainTheologicalClaim: this.asString(synthesis?.mainClaim || summary?.interpretiveCenter || ''),
      pastoralImplications: distributedImplications,
    };
  }

  private assessStudyReportCompleteness(sections: Record<string, any>) {
    const requiredTextFields = [
      'passageOverview',
      'literaryContext',
      'historicalContext',
      'canonicalContext',
      'exegeticalSummary',
      'mainTheologicalClaim',
    ];
    const missingText = requiredTextFields.filter((field) => !this.asString(sections?.[field]));
    const listChecks = [
      { field: 'exegeticalFlow', min: 2 },
      { field: 'structureOfPassage', min: 2 },
      { field: 'keyTerms', min: 2 },
      { field: 'theologicalThemes', min: 2 },
      { field: 'interpretiveChallenges', min: 1 },
    ];
    const missingLists = listChecks
      .filter((check) => !Array.isArray(sections?.[check.field]) || sections[check.field].length < check.min)
      .map((check) => check.field);

    return {
      missingText,
      missingLists,
      isSparse: missingText.length >= 2 || missingLists.length >= 2,
    };
  }

  private hydrateSparseStudyReportSections(
    workspace: SermonWorkspace,
    sections: Record<string, any>,
  ): Record<string, any> {
    const isSpanish = workspace.language === 'es';
    const source = sections || {};
    const mainPassage = this.asString(workspace.mainPassage || '');
    const theme = this.asString(workspace.theme || '');
    const claimFallback = theme || (isSpanish
      ? 'Dios nos salva por gracia y nos llama a vivir en obediencia.'
      : 'God saves us by grace and calls us to live in obedience.');

    const fallback = {
      passageOverview: isSpanish
        ? `El pasaje ${mainPassage} muestra el paso de muerte espiritual a vida en Cristo por la gracia de Dios.`
        : `The passage ${mainPassage} shows the transition from spiritual death to life in Christ by God’s grace.`,
      literaryContext: isSpanish
        ? 'Unidad epistolar de Pablo: argumento doctrinal seguido de exhortación práctica para la iglesia.'
        : 'Pauline epistolary unit: doctrinal argument followed by practical exhortation for the church.',
      historicalContext: isSpanish
        ? 'La audiencia original vivía en un contexto urbano plural, con tensiones religiosas y morales que hacen urgente el llamado a una nueva vida.'
        : 'The original audience lived in a plural urban context with religious and moral tensions that made the call to new life urgent.',
      canonicalContext: isSpanish
        ? 'El tema se conecta con la narrativa bíblica de caída, redención en Cristo y restauración del pueblo de Dios.'
        : 'This theme connects to the biblical storyline of fall, redemption in Christ, and restoration of God’s people.',
      exegeticalSummary: isSpanish
        ? 'Pablo contrasta la antigua condición de pecado con la nueva identidad en Cristo, enfatizando que la salvación es por gracia y produce buenas obras.'
        : 'Paul contrasts the former condition of sin with the new identity in Christ, emphasizing salvation by grace that produces good works.',
      mainTheologicalClaim: claimFallback,
      exegeticalFlow: isSpanish
        ? ['Condición previa: muerte espiritual.', 'Intervención divina: gracia y vida en Cristo.', 'Respuesta visible: obediencia y buenas obras.']
        : ['Former condition: spiritual death.', 'Divine intervention: grace and life in Christ.', 'Visible response: obedience and good works.'],
      structureOfPassage: isSpanish
        ? [
            { movement: 'Condición humana sin Cristo', verses: `${mainPassage} (sección inicial)`, summary: 'Diagnóstico de muerte espiritual y esclavitud al pecado.' },
            { movement: 'Intervención de la gracia', verses: `${mainPassage} (sección central)`, summary: 'Dios da vida con Cristo por pura gracia.' },
            { movement: 'Nueva vida y misión', verses: `${mainPassage} (sección final)`, summary: 'El creyente vive para obras preparadas por Dios.' },
          ]
        : [
            { movement: 'Human condition apart from Christ', verses: `${mainPassage} (opening section)`, summary: 'Diagnosis of spiritual death and bondage to sin.' },
            { movement: 'Intervention of grace', verses: `${mainPassage} (middle section)`, summary: 'God gives life with Christ by pure grace.' },
            { movement: 'New life and mission', verses: `${mainPassage} (final section)`, summary: 'Believers live for works prepared by God.' },
          ],
      keyTerms: isSpanish
        ? [
            { term: 'gracia', language: 'griego', transliteration: 'charis', definition: 'favor inmerecido de Dios', nuance: 'base de la salvación' },
            { term: 'fe', language: 'griego', transliteration: 'pistis', definition: 'confianza en Dios', nuance: 'respuesta del creyente' },
            { term: 'obras', language: 'griego', transliteration: 'erga', definition: 'acciones concretas', nuance: 'fruto de la nueva vida' },
          ]
        : [
            { term: 'grace', language: 'greek', transliteration: 'charis', definition: 'undeserved favor of God', nuance: 'basis of salvation' },
            { term: 'faith', language: 'greek', transliteration: 'pistis', definition: 'trust in God', nuance: 'believer response' },
            { term: 'works', language: 'greek', transliteration: 'erga', definition: 'concrete actions', nuance: 'fruit of new life' },
          ],
      theologicalThemes: isSpanish
        ? ['Gracia salvadora', 'Nueva creación en Cristo', 'Obediencia como fruto', 'Unidad del pueblo de Dios']
        : ['Saving grace', 'New creation in Christ', 'Obedience as fruit', 'Unity of God’s people'],
      interpretiveChallenges: isSpanish
        ? [
            {
              question: '¿Cómo se relacionan gracia y buenas obras sin contradicción?',
              interpretationOptions: ['Las obras no causan la salvación.', 'Las obras confirman una fe viva.'],
              preachingGuidance: 'Presentar la obediencia como fruto del nuevo nacimiento, no como mérito.',
            },
          ]
        : [
            {
              question: 'How do grace and good works relate without contradiction?',
              interpretationOptions: ['Works do not cause salvation.', 'Works confirm living faith.'],
              preachingGuidance: 'Present obedience as fruit of new birth, not human merit.',
            },
          ],
    };

    return {
      ...source,
      passageOverview: this.asString(source.passageOverview || fallback.passageOverview),
      literaryContext: this.asString(source.literaryContext || fallback.literaryContext),
      historicalContext: this.asString(source.historicalContext || fallback.historicalContext),
      canonicalContext: this.asString(source.canonicalContext || fallback.canonicalContext),
      exegeticalSummary: this.asString(source.exegeticalSummary || fallback.exegeticalSummary),
      mainTheologicalClaim: this.asString(source.mainTheologicalClaim || fallback.mainTheologicalClaim),
      exegeticalFlow: Array.isArray(source.exegeticalFlow) && source.exegeticalFlow.length ? source.exegeticalFlow : fallback.exegeticalFlow,
      structureOfPassage:
        Array.isArray(source.structureOfPassage) && source.structureOfPassage.length
          ? source.structureOfPassage
          : fallback.structureOfPassage,
      keyTerms: Array.isArray(source.keyTerms) && source.keyTerms.length ? source.keyTerms : fallback.keyTerms,
      theologicalThemes:
        Array.isArray(source.theologicalThemes) && source.theologicalThemes.length
          ? source.theologicalThemes
          : fallback.theologicalThemes,
      interpretiveChallenges:
        Array.isArray(source.interpretiveChallenges) && source.interpretiveChallenges.length
          ? source.interpretiveChallenges
          : fallback.interpretiveChallenges,
    };
  }

  private parseReferenceForEgw(reference: string): { book: string; chapter: number; verseStart?: number; verseEnd?: number } | null {
    const normalized = this.asString(reference).replace(/\u2013|\u2014/g, '-');
    const match = normalized.match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!match) return null;
    const chapter = Number(match[2]);
    if (!Number.isFinite(chapter)) return null;
    const verseStart = match[3] ? Number(match[3]) : undefined;
    const verseEnd = match[4] ? Number(match[4]) : undefined;
    return {
      book: this.asString(match[1]),
      chapter,
      verseStart: Number.isFinite(verseStart as number) ? verseStart : undefined,
      verseEnd: Number.isFinite(verseEnd as number) ? verseEnd : undefined,
    };
  }

  private normalizeMediaSuggestionCards(value: any, limit = 24): Array<{ type: string; intent: string; useCase?: string; prompt: string }> {
    if (!Array.isArray(value)) return [];
    const cards: Array<{ type: string; intent: string; useCase?: string; prompt: string }> = [];
    const isLikelyJsonNoise = (text: string) => {
      const trimmed = this.asString(text);
      if (!trimmed) return true;
      if (/^[\{\}\[\],]+$/.test(trimmed)) return true;
      if (trimmed.startsWith('"') && trimmed.includes('":')) return true;
      if (/^[A-Za-z0-9_]+\s*:\s*[\[{]?\s*$/.test(trimmed)) return true;
      if (/^["']?mediaSuggestions["']?\s*:/.test(trimmed)) return true;
      return false;
    };

    for (const item of value) {
      if (typeof item === 'string') {
        const prompt = this.asString(item);
        if (!prompt || isLikelyJsonNoise(prompt)) continue;
        cards.push({
          type: 'Media',
          intent: 'Study prompt',
          prompt,
        });
        continue;
      }
      const type = this.asString(item?.type || item?.label || item?.name);
      const lowerType = type.toLowerCase();
      if (
        lowerType.includes('presentación') ||
        lowerType.includes('presentation') ||
        lowerType.includes('slide') ||
        lowerType.includes('deck')
      ) {
        continue;
      }
      const intent = this.asString(item?.intent || item?.category || item?.purpose);
      const useCase = this.asString(item?.useCase || item?.usage || item?.howToUse);
      const prompt = this.asString(item?.prompt || item?.text || item?.content || item?.description);
      if (!prompt) continue;
      cards.push({
        type: type || 'Media',
        intent: intent || 'Study prompt',
        ...(useCase ? { useCase } : {}),
        prompt,
      });
    }
    return cards.slice(0, limit);
  }

  private extractMediaSuggestionCardsFromLooseResponse(
    rawText: string,
    limit = 24,
  ): Array<{ type: string; intent: string; useCase?: string; prompt: string }> {
    const source = String(rawText || '')
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");
    if (!source.trim()) return [];

    const decoded = (value: string) =>
      String(value || '')
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .trim();

    const cards: Array<{ type: string; intent: string; useCase?: string; prompt: string }> = [];

    // First, extract complete-ish object blocks if present.
    const objectBlocks = source.match(/\{[\s\S]*?\}/g) || [];
    for (const block of objectBlocks) {
      const promptMatch = block.match(/"prompt"\s*:\s*"((?:\\.|[^"\\])*)"/i);
      if (!promptMatch) continue;
      const prompt = decoded(promptMatch[1]);
      if (!prompt) continue;

      const typeMatch = block.match(/"type"\s*:\s*"((?:\\.|[^"\\])*)"/i);
      const intentMatch = block.match(/"intent"\s*:\s*"((?:\\.|[^"\\])*)"/i);
      const useCaseMatch = block.match(/"useCase"\s*:\s*"((?:\\.|[^"\\])*)"/i);

      cards.push({
        type: decoded(typeMatch?.[1] || '') || 'Media',
        intent: decoded(intentMatch?.[1] || '') || 'Study prompt',
        ...(decoded(useCaseMatch?.[1] || '') ? { useCase: decoded(useCaseMatch?.[1] || '') } : {}),
        prompt,
      });
      if (cards.length >= limit) return cards.slice(0, limit);
    }

    // If still empty, salvage every prompt key occurrence as a card.
    if (!cards.length) {
      const promptRegex = /"prompt"\s*:\s*"((?:\\.|[^"\\])*)"/gi;
      let match: RegExpExecArray | null = null;
      while ((match = promptRegex.exec(source)) !== null) {
        const prompt = decoded(match[1]);
        if (!prompt) continue;
        cards.push({
          type: 'Media',
          intent: 'Study prompt',
          prompt,
        });
        if (cards.length >= limit) break;
      }
    }

    return cards.slice(0, limit);
  }

  private normalizeStudyAssets(source: any, structureOfPassage: any[], workspace?: SermonWorkspace) {
    const movementSource = Array.isArray(source?.studyAssets?.movementAssets)
      ? source.studyAssets.movementAssets
      : Array.isArray(source?.movementAssets)
        ? source.movementAssets
        : [];
    const categorySource = source?.studyAssets?.categoryAssets && typeof source.studyAssets.categoryAssets === 'object'
      ? source.studyAssets.categoryAssets
      : source?.categoryAssets && typeof source.categoryAssets === 'object'
        ? source.categoryAssets
        : {};

    const categoryEgw = Array.isArray(categorySource?.egwSupport)
      ? categorySource.egwSupport
      : Array.isArray(source?.egwSupport)
        ? source.egwSupport
        : [];

    const normalizedEgw = categoryEgw
      .map((item: any) => ({
        citation: this.asString(item?.citation || item?.reference || item?.bookTitle),
        quote: this.asString(item?.quote || item?.text),
        relevance: this.asString(item?.relevance || item?.summary || item?.connection),
      }))
      .filter((item) => item.citation || item.quote || item.relevance)
      .slice(0, 8);

    if (Array.isArray(source?.egw?.quotes)) {
      for (const quote of source.egw.quotes.slice(0, 8)) {
        const normalizedQuote = {
          citation: this.asString(quote?.reference || quote?.bookTitle),
          quote: this.asString(quote?.text),
          relevance: this.asString(quote?.category || ''),
        };
        if (normalizedQuote.citation || normalizedQuote.quote) {
          normalizedEgw.push(normalizedQuote);
        }
      }
    }

    const normalizedReferences = this.normalizeReferenceEntries(
      categorySource?.references || source?.references || workspace?.references || [],
      12,
    );

    const movementAssets = movementSource
      .map((item: any, index: number) => ({
        movement: this.asString(item?.movement || item?.title || structureOfPassage?.[index]?.movement),
        verses: this.asString(item?.verses || structureOfPassage?.[index]?.verses),
        summary: this.asString(item?.summary || item?.description || structureOfPassage?.[index]?.summary),
        applications: this.asStringArray(item?.applications, 12),
        discussionQuestions: this.asStringArray(item?.discussionQuestions || item?.questions, 12),
        illustrationIdeas: this.asStringArray(item?.illustrationIdeas || item?.illustrations, 12),
        mediaSuggestions: this.asStringArray(item?.mediaSuggestions || item?.media, 12),
        egwSupport: Array.isArray(item?.egwSupport)
          ? item.egwSupport
              .map((egw: any) => ({
                citation: this.asString(egw?.citation || egw?.reference),
                quote: this.asString(egw?.quote || egw?.text),
                relevance: this.asString(egw?.relevance || egw?.summary),
              }))
              .filter((egw: any) => egw.citation || egw.quote || egw.relevance)
              .slice(0, 4)
          : [],
        references: this.asStringArray(item?.references || item?.explorationReferences, 6),
      }))
      .filter((item) => item.movement || item.summary || item.verses);

    if (!movementAssets.length && Array.isArray(structureOfPassage)) {
      for (const item of structureOfPassage.slice(0, 8)) {
        const movement = this.asString(item?.movement);
        const verses = this.asString(item?.verses);
        const summary = this.asString(item?.summary);
        if (movement || verses || summary) {
          movementAssets.push({
            movement,
            verses,
            summary,
            applications: [],
            discussionQuestions: [],
            illustrationIdeas: [],
            mediaSuggestions: [],
            egwSupport: [],
            references: [],
          });
        }
      }
    }

    const mediaSuggestionCards = this.normalizeMediaSuggestionCards(
      categorySource?.mediaSuggestionCards || source?.mediaSuggestionCards || categorySource?.mediaSuggestions || source?.mediaSuggestions,
      24,
    );
    const mediaSuggestions = this.asStringArray(categorySource?.mediaSuggestions || categorySource?.media || source?.mediaSuggestions, 24);

    return {
      movementAssets,
      categoryAssets: {
        applications: this.asStringArray(categorySource?.applications || source?.applications, 12),
        discussionQuestions: this.asStringArray(categorySource?.discussionQuestions || categorySource?.questions || source?.discussionQuestions, 12),
        illustrationIdeas: this.asStringArray(categorySource?.illustrationIdeas || categorySource?.illustrations || source?.illustrationIdeas, 12),
        mediaSuggestions: mediaSuggestions.length ? mediaSuggestions : mediaSuggestionCards.map((item) => item.prompt).slice(0, 24),
        mediaSuggestionCards,
        egwSupport: normalizedEgw.slice(0, 10),
        references: normalizedReferences,
      },
    };
  }

  private buildOutlineStudyContext(studyReport: any, workspace: SermonWorkspace) {
    const sections = studyReport?.sections || {};
    return {
      structureOfPassage: Array.isArray(sections?.structureOfPassage) ? sections.structureOfPassage : [],
      theologicalThemes: Array.isArray(sections?.theologicalThemes) ? sections.theologicalThemes : [],
      interpretiveChallenges: Array.isArray(sections?.interpretiveChallenges) ? sections.interpretiveChallenges : [],
      pastoralImplications: sections?.pastoralImplications || null,
      studyAssets: sections?.studyAssets || null,
      references: this.normalizeReferenceEntries(workspace?.references || [], 12),
    };
  }

  private findBestMovementAsset(point: any, movementAssets: any[]) {
    const title = `${this.asString(point?.title)} ${this.asString(point?.summary)} ${this.asString(point?.movement)}`.toLowerCase();
    const verses = this.asStringArray(point?.supportingVerses || point?.verses, 8).join(' ').toLowerCase();
    let bestAsset = null;
    let bestScore = 0;

    for (const asset of movementAssets) {
      const movement = this.asString(asset?.movement).toLowerCase();
      const assetVerses = this.asString(asset?.verses).toLowerCase();
      const assetSummary = this.asString(asset?.summary).toLowerCase();
      let score = 0;
      if (movement && title.includes(movement)) score += 4;
      if (movement && movement.includes(title)) score += 2;
      if (assetVerses && verses && (assetVerses.includes(verses) || verses.includes(assetVerses))) score += 4;
      if (assetSummary && title && (title.includes(assetSummary) || assetSummary.includes(title))) score += 1;
      if (score > bestScore) {
        bestScore = score;
        bestAsset = asset;
      }
    }

    return bestAsset;
  }

  private mergeUniqueStrings(primary: any[], secondary: any[], limit = 8) {
    const merged = [...this.asStringArray(primary, limit), ...this.asStringArray(secondary, limit)]
      .map((item) => this.asString(item))
      .filter(Boolean);
    return Array.from(new Set(merged)).slice(0, limit);
  }

  private attachStudyAssetsToOutline(outlineData: any, studyAssets: any) {
    if (!outlineData || !studyAssets || !Array.isArray(outlineData.pointNodes)) return outlineData;
    const movementAssets = Array.isArray(studyAssets?.movementAssets) ? studyAssets.movementAssets : [];
    const categoryAssets = studyAssets?.categoryAssets || {};

    outlineData.pointNodes = outlineData.pointNodes.map((point: any) => {
      const movementAsset = this.findBestMovementAsset(point, movementAssets);
      const mergedEgw = [
        ...(Array.isArray(point?.egwSupport) ? point.egwSupport : []),
        ...(Array.isArray(movementAsset?.egwSupport) ? movementAsset.egwSupport : []),
        ...(Array.isArray(categoryAssets?.egwSupport) ? categoryAssets.egwSupport.slice(0, 2) : []),
      ]
        .map((item: any) => ({
          citation: this.asString(item?.citation || item?.reference),
          quote: this.asString(item?.quote || item?.text),
          relevance: this.asString(item?.relevance || item?.summary),
        }))
        .filter((item) => item.citation || item.quote || item.relevance)
        .slice(0, 4);

      return {
        ...point,
        applications: this.mergeUniqueStrings(point?.applications, movementAsset?.applications || categoryAssets?.applications, 12),
        discussionQuestions: this.mergeUniqueStrings(point?.discussionQuestions, movementAsset?.discussionQuestions || categoryAssets?.discussionQuestions, 12),
        illustrationIdeas: this.mergeUniqueStrings(point?.illustrationIdeas, movementAsset?.illustrationIdeas || categoryAssets?.illustrationIdeas, 12),
        mediaSuggestions: this.mergeUniqueStrings(point?.mediaSuggestions, movementAsset?.mediaSuggestions || categoryAssets?.mediaSuggestions, 12),
        references: this.mergeUniqueStrings(point?.references, movementAsset?.references || categoryAssets?.references?.map((item: any) => item?.reference || item), 6),
        egwSupport: mergedEgw,
      };
    });

    return outlineData;
  }

  private async upgradeWorkspaceContracts(workspace: SermonWorkspace): Promise<SermonWorkspace> {
    if (!workspace) return workspace;

    workspace.theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);

    let touched = false;
    const primaryStudyReport = workspace.studyReports?.[0] || null;
    const normalizedStudySections = primaryStudyReport?.sections
      ? this.normalizeStudyReportSections(primaryStudyReport.sections)
      : null;
    const upgradedStudyAssets =
      normalizedStudySections && (!primaryStudyReport?.sections?.studyAssets || !primaryStudyReport.sections.studyAssets.categoryAssets)
        ? this.normalizeStudyAssets(primaryStudyReport.sections, normalizedStudySections.structureOfPassage || [], workspace)
        : primaryStudyReport?.sections?.studyAssets || null;

    if (primaryStudyReport && normalizedStudySections) {
      const nextSections = {
        ...primaryStudyReport.sections,
        ...normalizedStudySections,
        studyAssets: upgradedStudyAssets,
      };
      const before = JSON.stringify(primaryStudyReport.sections || {});
      const after = JSON.stringify(nextSections);
      if (before !== after) {
        primaryStudyReport.sections = nextSections;
        await this.studyReportRepository.save(primaryStudyReport);
        touched = true;
      }
    }

    const studyAssets = upgradedStudyAssets || primaryStudyReport?.sections?.studyAssets || null;
    for (const outline of workspace.outlines || []) {
      if (!outline?.structure) continue;
      const normalizedStructure = this.normalizeOutlineData(outline.structure);
      const enrichedStructure = this.attachStudyAssetsToOutline(
        {
          ...(normalizedStructure || {}),
          pointNodes: Array.isArray(normalizedStructure?.pointNodes) ? normalizedStructure.pointNodes : [],
        },
        studyAssets,
      );
      const sanitizedStructure = this.sanitizeOutputForLens(enrichedStructure, workspace);
      const before = JSON.stringify(outline.structure || {});
      const after = JSON.stringify(sanitizedStructure || {});
      if (before !== after) {
        outline.structure = sanitizedStructure;
        await this.outlineRepository.save(outline);
        touched = true;
      }
    }

    if (!touched) {
      return workspace;
    }

    return this.workspaceRepository.findOne({
      where: { id: workspace.id, userId: workspace.userId },
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

  private normalizeStudyReportSections(raw: any): Record<string, any> {
    const source = raw && typeof raw === 'object' ? raw : {};

    const structureOfPassage = Array.isArray(source.structureOfPassage)
      ? source.structureOfPassage
          .map((item: any) => ({
            movement: this.asString(item?.movement || item?.title || item?.section),
            verses: this.asString(item?.verses || item?.reference),
            summary: this.asString(item?.summary || item?.description || item?.content),
          }))
          .filter((item: any) => item.movement || item.summary)
      : [];

    const keyTerms = Array.isArray(source.keyTerms)
      ? source.keyTerms
          .map((item: any) => ({
            term: this.asString(item?.term || item?.word),
            language: this.asString(item?.language || ''),
            transliteration: this.asString(item?.transliteration || ''),
            definition: this.asString(item?.definition || ''),
            nuance: this.asString(item?.nuance || item?.notes || ''),
          }))
          .filter((item: any) => item.term)
      : [];

    const crossReferences = Array.isArray(source.crossReferences)
      ? source.crossReferences
          .map((item: any) => ({
            reference: this.asString(item?.reference || item?.verse),
            connection: this.asString(item?.connection || item?.explanation || item?.reason),
            category: this.asString(item?.category || 'thematic').toLowerCase(),
            tier: this.asString(item?.tier || 'secondary').toLowerCase(),
          }))
          .filter((item: any) => item.reference)
      : [];

    const interpretiveChallenges = Array.isArray(source.interpretiveChallenges)
      ? source.interpretiveChallenges
          .map((item: any) => ({
            question: this.asString(item?.question || item?.challenge),
            interpretationOptions: this.asStringArray(item?.interpretationOptions || item?.options || [], 5),
            preachingGuidance: this.asString(item?.preachingGuidance || item?.guidance || item?.note),
          }))
          .filter((item: any) => item.question)
      : [];

    const pastoralImplicationsRaw = source.pastoralImplications || source.practicalApplications || source.applications;
    const pastoralImplications = (() => {
      const pickFirstList = (...values: any[]): string[] => {
        for (const value of values) {
          const parsed = this.asStringArray(value, 6);
          if (parsed.length) return parsed;
        }
        return [];
      };
      if (pastoralImplicationsRaw && typeof pastoralImplicationsRaw === 'object' && !Array.isArray(pastoralImplicationsRaw)) {
        const personalLife = pickFirstList(
          (pastoralImplicationsRaw as any).personalLife,
          (pastoralImplicationsRaw as any).personal,
          (pastoralImplicationsRaw as any).vidaPersonal,
          (pastoralImplicationsRaw as any).individualLife,
        );
        const churchLife = pickFirstList(
          (pastoralImplicationsRaw as any).churchLife,
          (pastoralImplicationsRaw as any).churchApplication,
          (pastoralImplicationsRaw as any).communityLife,
          (pastoralImplicationsRaw as any).congregationalLife,
          (pastoralImplicationsRaw as any).communalLife,
          (pastoralImplicationsRaw as any).vidaIglesia,
          (pastoralImplicationsRaw as any).iglesia,
        );
        const mission = pickFirstList(
          (pastoralImplicationsRaw as any).mission,
          (pastoralImplicationsRaw as any).missional,
          (pastoralImplicationsRaw as any).missionApplication,
          (pastoralImplicationsRaw as any).outreach,
          (pastoralImplicationsRaw as any).evangelism,
          (pastoralImplicationsRaw as any).mision,
        );
        const combined = Array.from(
          new Set([
            ...this.asStringArray((pastoralImplicationsRaw as any).implications, 12),
            ...this.asStringArray((pastoralImplicationsRaw as any).applications, 12),
            ...personalLife,
            ...churchLife,
            ...mission,
          ]),
        );
        const fillMissing = (items: string[], used: Set<string>) => {
          if (items.length) {
            items.forEach((item) => used.add(item));
            return items.slice(0, 6);
          }
          let fill = combined.filter((item) => !used.has(item)).slice(0, 6);
          if (!fill.length && combined.length) {
            fill = combined.slice(0, 6);
          }
          fill.forEach((item) => used.add(item));
          return fill;
        };
        const used = new Set<string>();
        return {
          personalLife: fillMissing(personalLife, used),
          churchLife: fillMissing(churchLife, used),
          mission: fillMissing(mission, used),
        };
      }
      const flat = this.asStringArray(pastoralImplicationsRaw, 12);
      return {
        personalLife: flat.slice(0, 4),
        churchLife: flat.slice(4, 8),
        mission: flat.slice(8, 12),
      };
    })();

    // Legacy key fallback mapping
    const fallbackThemes = this.asStringArray(source.theologicalThemes || source.keyThemes || source.themes, 10);
    const fallbackCanonical = this.asString(source.canonicalContext || source.canonicalConnections || source.canonicalThemes || '');
    const fallbackClaim = this.asString(source.mainTheologicalClaim || source.theologicalInsights || source.mainClaim || '');
    const fallbackFlow = this.asStringArray(source.exegeticalFlow || source.argumentFlow || source.flow || [], 8);
    const fallbackSummary = this.asString(source.exegeticalSummary || source.summaryStatement || '');

    return {
      passageOverview: this.asString(source.passageOverview || source.overview || source.summary || ''),
      literaryContext: this.asString(source.literaryContext || ''),
      exegeticalFlow: fallbackFlow,
      exegeticalSummary: fallbackSummary,
      structureOfPassage,
      keyTerms,
      historicalContext: this.asString(source.historicalContext || ''),
      canonicalContext: fallbackCanonical,
      crossReferences,
      interpretiveChallenges,
      theologicalThemes: fallbackThemes,
      mainTheologicalClaim: fallbackClaim,
      pastoralImplications,
      studyAssets: this.normalizeStudyAssets(source, structureOfPassage),
    };
  }

  private flattenStudyAssetStrings(studyAssets: any, key: string, limit: number = 12): string[] {
    const categoryAssets = studyAssets?.categoryAssets || {};
    const movementAssets = Array.isArray(studyAssets?.movementAssets) ? studyAssets.movementAssets : [];
    const direct = this.asStringArray(categoryAssets?.[key], limit);
    const movement = movementAssets.flatMap((item: any) => this.asStringArray(item?.[key], limit));
    return Array.from(new Set([...direct, ...movement].map((item) => item.trim()).filter(Boolean))).slice(0, limit);
  }

  private async syncStudyAssetRecords(workspaceId: string, studyAssets: any): Promise<void> {
    const applications = this.flattenStudyAssetStrings(studyAssets, 'applications', 18);
    const discussionQuestions = this.flattenStudyAssetStrings(studyAssets, 'discussionQuestions', 18);
    const illustrationIdeas = this.flattenStudyAssetStrings(studyAssets, 'illustrationIdeas', 18);

    await this.applicationRepository.delete({ workspaceId });
    await this.questionRepository.delete({ workspaceId });
    await this.illustrationRepository.delete({ workspaceId });

    if (applications.length) {
      await this.applicationRepository.save(
        applications.map((content, index) =>
          this.applicationRepository.create({
            workspaceId,
            audienceType: AudienceType.MIXED_CONGREGATION,
            content,
            orderIndex: index,
          }),
        ),
      );
    }

    if (discussionQuestions.length) {
      await this.questionRepository.save(
        discussionQuestions.map((question, index) =>
          this.questionRepository.create({
            workspaceId,
            question,
            orderIndex: index,
            category: 'study',
          }),
        ),
      );
    }

    if (illustrationIdeas.length) {
      await this.illustrationRepository.save(
        illustrationIdeas.map((content, index) =>
          this.illustrationRepository.create({
            workspaceId,
            title: `Illustration ${index + 1}`,
            content,
          }),
        ),
      );
    }
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
    const studyContext = this.buildOutlineStudyContext(studyReport, workspace);
    const reportText = studyReport?.sections ? JSON.stringify(studyContext, null, 2) : '';
    const pointsPrompt = promptOverride || this.buildOutlinePointsPrompt(workspace, count, reportText);
    const pointsResponse = await this.llmService.generateCompletion(pointsPrompt, userId, {
      temperature: 0.6,
      maxTokens: 900,
    });
    this.logLlmOutput('outline:points', pointsResponse);

    const pointsVariations = this.parseOutlinePointsResponse(pointsResponse, count);
    const fallbackPoints = this.parseListFromResponse(pointsResponse).slice(0, 5);
    const generatedPointSignatures = new Set<string>();

    for (let i = 0; i < count; i++) {
      const variationData = pointsVariations[i];
      const points = variationData?.points?.length ? variationData.points : fallbackPoints;
      const variation = variationData?.angle
        ? `Angle: ${variationData.angle}. Style: ${variationData.style || 'N/A'}. Theological Emphasis: ${variationData.theologicalEmphasis || 'N/A'}. Audience Focus: ${variationData.audienceFocus || 'N/A'}. Structure: ${variationData.sermonStructure || 'N/A'}. Keep this outline distinct in tone and structure.`
        : `Outline variation ${i + 1} with a distinct angle and tone.`;
      const prompt = this.buildOutlineFromPointsPrompt(workspace, points, variation, reportText);
      let response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.9,
        maxTokens: 2200,
      });
      this.logLlmOutput('outline', response);
      let outlineData = this.parseJsonSafe(response);
      outlineData = outlineData ? this.normalizeOutlineData(outlineData) : null;
      if (!outlineData) {
        outlineData = this.parseOutlineFromResponse(response);
      }
      if (!outlineData) {
        outlineData = this.normalizeOutlineData({
          introduction: '',
          points,
          conclusion: '',
          callToAction: '',
        });
      }

      // Diversity guard: if generated outline points are too similar to previous outlines, regenerate once.
      const currentPoints = this.extractOutlinePointTexts(outlineData || {});
      let currentSignature = this.buildPointSignature(currentPoints);
      if (currentSignature && this.isSignatureTooSimilar(currentSignature, generatedPointSignatures)) {
        const diversityPrompt = `${prompt}\n\nIMPORTANT: Previous options are too similar. Regenerate with significantly different point wording, progression, and framing.`;
        response = await this.llmService.generateCompletion(diversityPrompt, userId, {
          temperature: 1.0,
          maxTokens: 2200,
        });
        this.logLlmOutput('outline:diversity-regenerate', response);
        let retriedOutlineData = this.parseJsonSafe(response);
        retriedOutlineData = retriedOutlineData ? this.normalizeOutlineData(retriedOutlineData) : null;
        if (!retriedOutlineData) {
          retriedOutlineData = this.parseOutlineFromResponse(response);
        }
        if (!retriedOutlineData) {
          retriedOutlineData = this.normalizeOutlineData({
            introduction: '',
            points,
            conclusion: '',
            callToAction: '',
          });
        }
        if (retriedOutlineData) {
          outlineData = retriedOutlineData;
          const retriedPoints = this.extractOutlinePointTexts(outlineData || {});
          currentSignature = this.buildPointSignature(retriedPoints);
        }
      }
      outlineData = this.attachStudyAssetsToOutline(outlineData, studyContext?.studyAssets);
      outlineData = this.sanitizeOutputForLens(outlineData, workspace);
      if (currentSignature) {
        generatedPointSignatures.add(currentSignature);
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
    manuscriptOptions?: ManuscriptGenerationOptions,
  ): Promise<SermonManuscript> {
    const workspace = await this.findOne(workspaceId, userId);
    const outline = await this.outlineRepository.findOne({ where: { id: outlineId } });
    if (!outline) {
      throw new Error('Outline not found');
    }
    await this.manuscriptRepository.delete({ workspaceId, outlineId });
    const normalizedOptions = this.normalizeManuscriptOptions(workspace, manuscriptOptions);
    const prompt = promptOverride || this.buildManuscriptPrompt(workspace, outline, normalizedOptions);
    // Manuscripts need much higher token limits - calculate based on target minutes
    // For comprehensive manuscripts with HTML overhead, keep a generous token buffer for long-form outputs.
    // Add 50% buffer for rich content with illustrations, word studies, cross-references
    const targetTokens = Math.max(6000, Math.ceil((normalizedOptions.targetMinutes || 22) * 450));
    const manuscriptResponse = await this.llmService.generateCompletion(prompt, userId, {
      maxTokens: targetTokens,
      temperature: 0.65, // Slightly lower for more coherent long-form content
    });
    this.logLlmOutput('manuscript', manuscriptResponse);
    let parsedManuscript = this.normalizeManuscriptForWorkspace(
      workspace,
      this.parseGeneratedManuscriptResponse(manuscriptResponse, normalizedOptions),
    );

    if (workspace.language === 'es' && this.hasEnglishLeakInSpanishManuscript(parsedManuscript.text, parsedManuscript.cues)) {
      const rewritePrompt = this.buildSpanishManuscriptRewritePrompt(parsedManuscript.text, parsedManuscript.cues);
      const rewrittenResponse = await this.llmService.generateCompletion(rewritePrompt, userId, {
        maxTokens: targetTokens,
        temperature: 0.2,
      });
      this.logLlmOutput('manuscript:spanish-rewrite', rewrittenResponse);
      parsedManuscript = this.normalizeManuscriptForWorkspace(
        workspace,
        this.parseGeneratedManuscriptResponse(rewrittenResponse, normalizedOptions),
      );
    }

    if (!this.hasUsableManuscriptText(parsedManuscript.text)) {
      throw new BadRequestException('Unable to generate a usable manuscript draft. Please regenerate.');
    }

    let quality = this.assessManuscriptQuality(parsedManuscript.text, normalizedOptions);
    let repairAttemptsExecuted = 0;
    while (quality.needsRepair && repairAttemptsExecuted < 2) {
      const currentQuality = quality;
      const shouldPrioritizeLength = currentQuality.issues.includes('too_short');
      const repairPrompt = shouldPrioritizeLength
        ? this.buildManuscriptExpansionPrompt(
            workspace,
            parsedManuscript.text,
            parsedManuscript.cues,
            normalizedOptions,
          )
        : this.buildManuscriptQualityRepairPrompt(
            workspace,
            parsedManuscript.text,
            parsedManuscript.cues,
            normalizedOptions,
            currentQuality.issues,
            currentQuality.repetition.repeatedSentence,
          );
      const repairedResponse = await this.llmService.generateCompletion(repairPrompt, userId, {
        maxTokens: targetTokens,
        temperature: shouldPrioritizeLength ? 0.4 : 0.35,
      });
      repairAttemptsExecuted += 1;
      this.logLlmOutput(`manuscript:quality-repair:${repairAttemptsExecuted}`, repairedResponse);
      let candidateManuscript = this.normalizeManuscriptForWorkspace(
        workspace,
        this.parseGeneratedManuscriptResponse(repairedResponse, normalizedOptions),
      );

      if (!this.hasUsableManuscriptText(candidateManuscript.text)) {
        break;
      }

      if (workspace.language === 'es' && this.hasEnglishLeakInSpanishManuscript(candidateManuscript.text, candidateManuscript.cues)) {
        const rewritePrompt = this.buildSpanishManuscriptRewritePrompt(candidateManuscript.text, candidateManuscript.cues);
        const rewrittenResponse = await this.llmService.generateCompletion(rewritePrompt, userId, {
          maxTokens: targetTokens,
          temperature: 0.2,
        });
        this.logLlmOutput(`manuscript:quality-repair:${repairAttemptsExecuted}:spanish-rewrite`, rewrittenResponse);
        candidateManuscript = this.normalizeManuscriptForWorkspace(
          workspace,
          this.parseGeneratedManuscriptResponse(rewrittenResponse, normalizedOptions),
        );
        if (!this.hasUsableManuscriptText(candidateManuscript.text)) {
          break;
        }
      }

      const candidateQuality = this.assessManuscriptQuality(candidateManuscript.text, normalizedOptions);
      if (!this.isQualityImprovement(currentQuality, candidateQuality)) {
        break;
      }

      parsedManuscript = candidateManuscript;
      quality = candidateQuality;
    }

    let deterministicExpansionAttempt = 0;
    while (quality.issues.includes('too_short') && deterministicExpansionAttempt < 4) {
      const currentQuality = quality;
      const neededWords = Math.max(0, quality.targets.minWords - quality.wordCount);
      if (neededWords <= 0) break;
      const expansionHtml = this.buildUnderLengthExpansionBlock(
        workspace,
        outline,
        neededWords,
        deterministicExpansionAttempt,
      );
      const merged = `${parsedManuscript.text}\n${expansionHtml}`.trim();
      repairAttemptsExecuted += 1;
      const mergedQuality = this.assessManuscriptQuality(merged, normalizedOptions);
      if (mergedQuality.wordCount > currentQuality.wordCount && !mergedQuality.issues.includes('too_long')) {
        parsedManuscript = {
          ...parsedManuscript,
          text: merged,
        };
        quality = mergedQuality;
      } else {
        break;
      }
      deterministicExpansionAttempt += 1;
    }

    if (!this.hasUsableManuscriptText(parsedManuscript.text)) {
      throw new BadRequestException('Unable to generate a usable manuscript draft. Please regenerate.');
    }

    const plainText = this.stripHtmlForWordCount(parsedManuscript.text);
    const wordCount = this.countWords(plainText);
    const estimatedMinutes = Math.max(1, Math.ceil(wordCount / this.manuscriptWpm));
    const cueCount = Object.values(parsedManuscript.cues || {}).reduce(
      (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
      0,
    );

    if ((normalizedOptions.includeSlideCues || normalizedOptions.includeKeyLines) && cueCount < 2) {
      try {
        const refreshPrompt = this.buildManuscriptCueRefreshPrompt(workspace, parsedManuscript.text);
        const refreshResponse = await this.llmService.generateCompletion(refreshPrompt, userId, {
          temperature: 0.2,
          maxTokens: 1400,
        });
        this.logLlmOutput('manuscript:cues-auto-refresh', refreshResponse);
        let refreshedCues = this.sanitizeCueObject(this.parseJsonSafe(refreshResponse) || {});
        if (workspace.language === 'es') {
          refreshedCues = {
            slide: refreshedCues.slide.map((item) => this.normalizeSpanishManuscriptLabels(item)),
            keyLine: refreshedCues.keyLine.map((item) => this.normalizeSpanishManuscriptLabels(item)),
            transition: refreshedCues.transition.map((item) => this.normalizeSpanishManuscriptLabels(item)),
            pause: refreshedCues.pause.map((item) => this.normalizeSpanishManuscriptLabels(item)),
            read: refreshedCues.read.map((item) => this.normalizeSpanishManuscriptLabels(item)),
            quote: refreshedCues.quote.map((item) => this.normalizeSpanishManuscriptLabels(item)),
            cta: refreshedCues.cta.map((item) => this.normalizeSpanishManuscriptLabels(item)),
          };
        }
        parsedManuscript = {
          ...parsedManuscript,
          cues: {
            ...refreshedCues,
            slide: normalizedOptions.includeSlideCues ? refreshedCues.slide : [],
            keyLine: normalizedOptions.includeKeyLines ? refreshedCues.keyLine : [],
          },
        };
      } catch (error) {
        console.warn(`[manuscript:cues-auto-refresh] skipped: ${(error as Error)?.message || 'unknown error'}`);
      }
    }

    const manuscript = this.manuscriptRepository.create({
      workspaceId,
      outlineId,
      content: {
        formatVersion: 'v2',
        text: parsedManuscript.text,
        cues: parsedManuscript.cues,
        metadata: {
          title: this.asString(outline?.title || workspace?.title || 'Manuscript'),
          options: normalizedOptions,
          generatedFromOutlineId: outlineId,
          quality: {
            wordCount,
            targetWords: quality.targets.targetWords,
            minWords: quality.targets.minWords,
            maxWords: quality.targets.maxWords,
            finalIssues: quality.issues,
            status: quality.issues.length ? 'needs_review' : 'ok',
            repairAttempts: repairAttemptsExecuted,
            warningMessage: this.buildManuscriptQualityWarningMessage(quality.issues, workspace.language || 'en'),
          },
        },
      },
      contentFormat: 'html',
      wordCount,
      estimatedMinutes,
    });

    if (quality.issues.length) {
      this.manuscriptSoftGateSaveCount += 1;
      console.warn(
        '[manuscript-soft-gate]',
        JSON.stringify({
          tag: 'manuscript_soft_gate_save',
          counter: this.manuscriptSoftGateSaveCount,
          workspaceId,
          outlineId,
          issues: quality.issues,
          wordCount,
          targetWords: quality.targets.targetWords,
          minWords: quality.targets.minWords,
          maxWords: quality.targets.maxWords,
          repairAttempts: repairAttemptsExecuted,
        }),
      );
    }

    return this.manuscriptRepository.save(manuscript);
  }

  async regenerateManuscriptCues(
    workspaceId: string,
    manuscriptId: string,
    userId: string,
  ): Promise<SermonManuscript> {
    const workspace = await this.findOne(workspaceId, userId);
    const manuscript = (workspace.manuscripts || []).find((item: any) => item.id === manuscriptId);
    if (!manuscript) {
      throw new BadRequestException('Manuscript not found in this workspace.');
    }

    const manuscriptHtml = this.asString(manuscript?.content?.text || '');
    if (!manuscriptHtml) {
      throw new BadRequestException('Manuscript has no content to extract cues from.');
    }

    const prompt = this.buildManuscriptCueRefreshPrompt(workspace, manuscriptHtml);
    const response = await this.llmService.generateCompletion(prompt, userId, {
      temperature: 0.2,
      maxTokens: 1400,
    });
    this.logLlmOutput('manuscript:cues-regenerate', response);

    const parsed = this.parseJsonSafe(response);
    let cues = this.sanitizeCueObject(parsed?.cues || parsed || {});
    if (workspace.language === 'es') {
      cues = {
        slide: cues.slide.map((item) => this.normalizeSpanishManuscriptLabels(item)),
        keyLine: cues.keyLine.map((item) => this.normalizeSpanishManuscriptLabels(item)),
        transition: cues.transition.map((item) => this.normalizeSpanishManuscriptLabels(item)),
        pause: cues.pause.map((item) => this.normalizeSpanishManuscriptLabels(item)),
        read: cues.read.map((item) => this.normalizeSpanishManuscriptLabels(item)),
        quote: cues.quote.map((item) => this.normalizeSpanishManuscriptLabels(item)),
        cta: cues.cta.map((item) => this.normalizeSpanishManuscriptLabels(item)),
      };
    }

    cues = this.sanitizeOutputForLens(cues, workspace);
    manuscript.content = {
      ...(manuscript.content || {}),
      formatVersion: manuscript?.content?.formatVersion || 'v2',
      text: manuscriptHtml,
      cues,
      metadata: {
        ...(manuscript?.content?.metadata || {}),
        cuesRegeneratedAt: new Date().toISOString(),
      },
    };
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
    const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
    const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
    const seededApplications = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.applications, 4)))).slice(0, 12);
    const audienceTypes = this.resolveApplicationAudienceTypes(workspace);
    const applications = [];

    for (const audienceType of audienceTypes) {
      const prompt = promptOverride
        ? this.applyAudiencePrompt(promptOverride, audienceType)
        : this.buildApplicationsPrompt(workspace, mainPoints, audienceType, seededApplications);
      const response = await this.llmService.generateCompletion(prompt, userId);
      this.logLlmOutput(`applications:${audienceType}`, response);
      const appTexts = this.parseListFromResponse(response);

      for (let i = 0; i < appTexts.length; i++) {
        const application = this.applicationRepository.create({
          workspaceId,
          audienceType: audienceType as any,
          content: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(appTexts[i]) : appTexts[i],
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
    const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
    const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
    const seededQuestions = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.discussionQuestions, 4)))).slice(0, 12);
    const prompt = promptOverride || this.buildDiscussionPrompt(workspace, seededQuestions);
    const response = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('questions', response);
    const questionTexts = this.parseListFromResponse(response);

    const questions = [];
    for (let i = 0; i < questionTexts.length; i++) {
      const question = this.questionRepository.create({
        workspaceId,
        question: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(questionTexts[i]) : questionTexts[i],
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
    const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
    const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
    const seededIllustrations = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.illustrationIdeas, 4)))).slice(0, 12);
    const prompt =
      promptOverride || this.buildIllustrationsPrompt(workspace, mainPoints, seededIllustrations);
    const response = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('illustrations', response);

    const parsed = this.parseJsonSafe(response) || this.parseIllustrationsFromResponse(response);
    const items = Array.isArray(parsed) ? parsed : [];
    const illustrations = [];

    for (const item of items) {
      const illustration = this.illustrationRepository.create({
        workspaceId,
        title: item.title || null,
        content:
          workspace.language === 'es'
            ? this.normalizeSpanishGeneratedText(item.content || item.text || '')
            : item.content || item.text || '',
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
        statementType: this.normalizeStatementType(item.statementType),
        statement:
          workspace.language === 'es'
            ? this.normalizeSpanishGeneratedText(item.statement || item.text || '')
            : item.statement || item.text || '',
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
    const studyInputs = await this.buildStudyReportInputContext(workspace, passageText);

    const prompt = promptOverride || this.buildStudyReportPrompt(workspace, passageText, studyInputs);
    let response: string | null = null;
    let parsed: any = null;
    try {
      response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.35,
        maxTokens: 1600,
        timeoutMs: 40000,
        localMaxAttempts: 1,
      });
      this.logLlmOutput('study-report', response);
      parsed = this.parseJsonSafe(response);
    } catch (error) {
      console.warn(`[study-report] LLM fallback activated: ${(error as Error)?.message || 'unknown error'}`);
      response = null;
      parsed = null;
    }
    const baseSections = this.buildStudyReportBaseSections(studyInputs);
    let normalizedSections = this.normalizeStudyReportSections({
      ...baseSections,
      ...(parsed && typeof parsed === 'object' ? parsed : {}),
    });
    let completeness = this.assessStudyReportCompleteness(normalizedSections);
    const hasRichStudyInputs =
      !!studyInputs?.cachedStudySections?.passageSummary ||
      !!studyInputs?.cachedStudySections?.structuralAnalysis ||
      !!studyInputs?.cachedStudySections?.interpretiveChallenges ||
      !!studyInputs?.cachedStudySections?.studySynthesis ||
      !!studyInputs?.cachedStudySections?.wordStudy;

    if (completeness.isSparse && hasRichStudyInputs) {
      const repairPrompt = `${this.buildStudyReportPrompt(workspace, passageText, studyInputs)}\n\nCRITICAL FIX:\n- Previous result left required fields empty.\n- Fill every required field with concrete passage-grounded content.\n- Do not leave required sections blank.`;
      try {
        const repairResponse = await this.llmService.generateCompletion(repairPrompt, userId, {
          temperature: 0.3,
          maxTokens: 1200,
          timeoutMs: 30000,
          localMaxAttempts: 1,
        });
        this.logLlmOutput('study-report:repair', repairResponse);
        const repairedParsed = this.parseJsonSafe(repairResponse);
        normalizedSections = this.normalizeStudyReportSections({
          ...baseSections,
          ...(repairedParsed && typeof repairedParsed === 'object' ? repairedParsed : {}),
        });
        completeness = this.assessStudyReportCompleteness(normalizedSections);
      } catch (error) {
        console.warn(`[study-report:repair] fallback activated: ${(error as Error)?.message || 'unknown error'}`);
      }
    }

    if (completeness.isSparse) {
      normalizedSections = this.hydrateSparseStudyReportSections(workspace, normalizedSections);
    }

    let mergedSections = {
      ...normalizedSections,
      egw: studyInputs?.egwSection || normalizedSections?.egw || null,
      studyAssets: this.normalizeStudyAssets(
        {
          ...(parsed && typeof parsed === 'object' ? parsed : {}),
          egw: studyInputs?.egwSection || null,
        },
        normalizedSections?.structureOfPassage || [],
        workspace,
      ),
    };
    if (workspace.language === 'es') {
      mergedSections = this.normalizeSpanishValueDeep(mergedSections);
    }
    const report = this.studyReportRepository.create({
      workspaceId,
      sections: {
        ...mergedSections,
        _sources: {
          crossReferencesCount: Array.isArray(studyInputs?.referenceData?.crossReferences)
            ? studyInputs.referenceData.crossReferences.length
            : 0,
          hasPassageSummary: !!studyInputs?.cachedStudySections?.passageSummary,
          hasStructuralAnalysis: !!studyInputs?.cachedStudySections?.structuralAnalysis,
          hasInterpretiveChallenges: !!studyInputs?.cachedStudySections?.interpretiveChallenges,
          hasCanonicalThemes: !!studyInputs?.cachedStudySections?.canonicalThemes,
          hasStudySynthesis: !!studyInputs?.cachedStudySections?.studySynthesis,
          hasWordStudy: !!studyInputs?.cachedStudySections?.wordStudy,
          hasCrossReferencesLookup: !!studyInputs?.cachedStudySections?.crossReferencesLookup,
        },
      },
      rawResponse: parsed ? null : response,
    });
    const savedReport = await this.studyReportRepository.save(report);
    await this.syncStudyAssetRecords(workspaceId, mergedSections.studyAssets);
    return savedReport;
  }

  async generateSermonCore(
    workspaceId: string,
    userId: string,
  ): Promise<{
    bigIdea: string;
    fallenCondition: string;
    centralTruth: string;
    sermonGoal: string;
    audienceNeed: string;
  }> {
    const workspace = await this.findOne(workspaceId, userId);
    const studyReport = workspace.studyReports?.[0]?.sections || {};
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);

    const prompt = `${doctrinalContext}

You are extracting the SERMON CORE - the DNA of the sermon message.

=== CONTEXT ===
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}

=== STUDY DATA ===
Main Theological Claim: ${studyReport.mainTheologicalClaim || 'N/A'}
Theological Themes: ${JSON.stringify(studyReport.theologicalThemes || [])}
Pastoral Implications: ${JSON.stringify(studyReport.pastoralImplications || {})}
Exegetical Summary: ${studyReport.exegeticalSummary || 'N/A'}

=== TASK ===
Extract the sermon core - the unified message that ties everything together.

Write in ${languageLabel}.

Return ONLY valid JSON:
{
  "bigIdea": "The one sentence people should remember (e.g., 'God's grace reconciles what sin has separated.')",
  "fallenCondition": "The human problem this sermon addresses (e.g., 'Humanity is separated from God because of sin.')",
  "centralTruth": "The biblical truth that answers the problem (e.g., 'Through Christ we are restored into relationship with God.')",
  "sermonGoal": "What you want the audience to do (e.g., 'Accept reconciliation through Christ.')",
  "audienceNeed": "The specific need your audience has (e.g., 'Many feel distant from God and need assurance of His love.')"
}

Rules:
- Each field should be 1-2 sentences maximum
- The bigIdea must be memorable and quotable
- The fallenCondition must connect to universal human experience
- The centralTruth must be grounded in the passage
- The sermonGoal must be actionable
- The audienceNeed must be specific and pastoral`;

    const response = await this.llmService.generateCompletion(prompt, userId, {
      temperature: 0.5,
      maxTokens: 800,
    });

    const parsed = this.parseJsonSafe(response);
    const sermonCore = {
      bigIdea: this.asString(parsed?.bigIdea || ''),
      fallenCondition: this.asString(parsed?.fallenCondition || ''),
      centralTruth: this.asString(parsed?.centralTruth || ''),
      sermonGoal: this.asString(parsed?.sermonGoal || ''),
      audienceNeed: this.asString(parsed?.audienceNeed || ''),
    };
    const normalizedSermonCore =
      workspace.language === 'es' ? this.normalizeSpanishValueDeep(sermonCore) : sermonCore;

    // Save to workspace
    await this.workspaceRepository.update(workspaceId, {
      sermonCore: normalizedSermonCore as any,
    });

    return normalizedSermonCore;
  }

  async generateMediaSuggestions(
    workspaceId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<SermonStudyReport> {
    const workspace = await this.findOne(workspaceId, userId);
    if (!Array.isArray(workspace?.studyReports) || workspace.studyReports.length === 0) {
      throw new BadRequestException(
        'Generate the Study Report first before creating media suggestions.',
      );
    }
    const mainPassage = await this.scriptureService.getPassage(workspace.mainPassage);
    const passageText = Array.isArray(mainPassage?.verses)
      ? mainPassage.verses.map((verse: any) => `${verse.reference} ${verse.text}`).join('\n')
      : JSON.stringify(mainPassage || {});
    const studyInputs = await this.buildStudyReportInputContext(workspace, passageText);
    const latestReport = workspace.studyReports?.[0] || null;
    const latestSections = latestReport?.sections || {};
    const normalizedSections = this.normalizeStudyReportSections(
      Object.keys(latestSections).length ? latestSections : this.buildStudyReportBaseSections(studyInputs),
    );
    const existingAssets = this.normalizeStudyAssets(
      {
        ...normalizedSections,
        studyAssets: latestSections?.studyAssets || null,
      },
      normalizedSections?.structureOfPassage || [],
      workspace,
    );

    // Avoid anchoring Spanish workspaces to previously generated English prompts.
    const existingPrompts = workspace.language === 'es'
      ? []
      : this.asStringArray(existingAssets?.categoryAssets?.mediaSuggestions, 24);
    const prompt =
      promptOverride ||
      this.buildMediaSuggestionsPrompt(workspace, passageText, studyInputs, normalizedSections, existingPrompts);
    let parsed: any = null;
    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.3,
        maxTokens: 1700,
        timeoutMs: 40000,
        localMaxAttempts: 1,
      });
      this.logLlmOutput('media-suggestions', response);
      parsed = this.parseJsonSafe(response);
    } catch (error) {
      console.warn(`[media-suggestions] LLM fallback activated: ${(error as Error)?.message || 'unknown error'}`);
      parsed = null;
    }
    const rawSuggestions = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.mediaSuggestions)
        ? parsed.mediaSuggestions
        : Array.isArray(parsed?.suggestions)
          ? parsed.suggestions
          : [];

    let mediaSuggestionCards = this.normalizeMediaSuggestionCards(rawSuggestions, 24);
    if (!mediaSuggestionCards.length) {
      mediaSuggestionCards = this.normalizeMediaSuggestionCards(existingAssets?.categoryAssets?.mediaSuggestionCards || [], 24);
      if (!mediaSuggestionCards.length) {
        mediaSuggestionCards = this.asStringArray(existingAssets?.categoryAssets?.mediaSuggestions || [], 24)
          .map((item) => ({
            type: 'Media',
            intent: workspace.language === 'es' ? 'Recurso sugerido' : 'Study prompt',
            prompt: this.asString(item),
          }))
          .filter((item) => item.prompt)
          .slice(0, 24);
      }
    }
    if (workspace.language === 'es') {
      mediaSuggestionCards = mediaSuggestionCards.map((item) => ({
        ...item,
        intent: this.normalizeSpanishGeneratedText(item.intent),
        useCase: this.normalizeSpanishGeneratedText(item.useCase || ''),
        prompt: this.normalizeSpanishGeneratedText(item.prompt),
      }));
    }

    const mergedAssets = {
      ...existingAssets,
      categoryAssets: {
        ...(existingAssets?.categoryAssets || {}),
        mediaSuggestionCards,
        mediaSuggestions: mediaSuggestionCards.map((item) => item.prompt).slice(0, 24),
      },
    };

    const mergedSections = {
      ...normalizedSections,
      mediaSuggestionCards,
      mediaSuggestions: mediaSuggestionCards.map((item) => item.prompt).slice(0, 24),
      egw: studyInputs?.egwSection || normalizedSections?.egw || null,
      studyAssets: mergedAssets,
    };

    let persistedReport: SermonStudyReport;
    if (latestReport) {
      latestReport.sections = mergedSections;
      latestReport.rawResponse = null;
      persistedReport = await this.studyReportRepository.save(latestReport);
    } else {
      const created = this.studyReportRepository.create({
        workspaceId,
        sections: mergedSections,
        rawResponse: null,
      });
      persistedReport = await this.studyReportRepository.save(created);
    }

    return persistedReport;
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
    const workspaces = await this.workspaceRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    for (const workspace of workspaces) {
      workspace.theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    }

    return workspaces;
  }

  async updateScriptureCache(id: string, userId: string, cacheData: any): Promise<SermonWorkspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id, userId },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    workspace.scriptureCache = {
      ...(workspace.scriptureCache || {}),
      ...(cacheData || {}),
      cachedAt: new Date(),
    };

    return this.workspaceRepository.save(workspace);
  }

  async getScriptureCache(id: string, userId: string): Promise<any> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id, userId },
      select: ['id', 'scriptureCache'],
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    return workspace.scriptureCache || null;
  }

  async findOne(id: string, userId: string): Promise<SermonWorkspace> {
    const workspace = await this.workspaceRepository.findOne({
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
    return this.upgradeWorkspaceContracts(workspace);
  }

  async update(id: string, userId: string, updateDto: UpdateWorkspaceDto): Promise<SermonWorkspace> {
    const normalizedUpdate: UpdateWorkspaceDto = { ...updateDto };
    normalizedUpdate.theologicalLens = normalizeTheologicalLens(
      (updateDto as any)?.theologicalLens,
    );
    await this.workspaceRepository.update({ id, userId }, normalizedUpdate);
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
      const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
      const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
      const seededApplications = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.applications, 4)))).slice(0, 12);
      return this.buildApplicationsPrompt(workspace, mainPoints, '{{audienceType}}', seededApplications);
    }

    if (type === 'illustrations') {
      const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
      const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
      const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
      const seededIllustrations = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.illustrationIdeas, 4)))).slice(0, 12);
      return this.buildIllustrationsPrompt(workspace, mainPoints, seededIllustrations);
    }

    if (type === 'citations') {
      return this.buildCitationsPrompt(workspace);
    }

    if (type === 'study-report') {
      const passage = await this.scriptureService.getPassage(workspace.mainPassage);
      const passageText = Array.isArray(passage?.verses)
        ? passage.verses.map((verse: any) => `${verse.reference} ${verse.text}`).join('\n')
        : JSON.stringify(passage || {});
      const studyInputs = await this.buildStudyReportInputContext(workspace, passageText);
      return this.buildStudyReportPrompt(workspace, passageText, studyInputs);
    }

    const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
    const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
    const seededQuestions = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.discussionQuestions, 4)))).slice(0, 12);
    return this.buildDiscussionPrompt(workspace, seededQuestions);
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
    if (typeof text === 'string') {
      const incomingContent = typeof dto.content === 'string' ? { text } : dto.content;
      const safeContent = {
        ...(incomingContent || {}),
        formatVersion: incomingContent?.formatVersion || manuscript?.content?.formatVersion || 'v2',
        cues: this.sanitizeCueObject(incomingContent?.cues || manuscript?.content?.cues),
      };
      updatePayload.content = safeContent;
      const plainText = this.stripHtmlForWordCount(text);
      updatePayload.wordCount = plainText.split(' ').filter(Boolean).length;
      updatePayload.estimatedMinutes = Math.ceil(updatePayload.wordCount / 150);
      updatePayload.contentFormat = safeContent.formatVersion === 'v2' ? 'html' : manuscript.contentFormat;
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
