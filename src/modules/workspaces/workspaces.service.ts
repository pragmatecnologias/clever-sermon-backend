import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { SermonOutline } from '../../entities/sermon-outline.entity';
import { SermonManuscript } from '../../entities/sermon-manuscript.entity';
import { AudienceType, SermonApplication } from '../../entities/sermon-application.entity';
import { DiscussionQuestion } from '../../entities/discussion-question.entity';
import { SermonIllustration } from '../../entities/sermon-illustration.entity';
import { SermonCitation, StatementType } from '../../entities/sermon-citation.entity';
import { SermonStudyReport } from '../../entities/sermon-study-report.entity';
import { SermonDnaAnalysis } from '../../entities/sermon-dna-analysis.entity';
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
import { RecordClaimReviewDto } from './dto/record-claim-review.dto';
import { RecordIntegrityIssueReviewDto } from './dto/record-integrity-issue-review.dto';
import { EGWService } from '../egw/egw.service';
import { EGWStudyReportIntegrationService } from '../egw/egw-study-report-integration.service';
import { EGWSermonBuilderIntegrationService } from '../egw/egw-sermon-builder-integration.service';
import { SermonIntegrityService } from './sermon-integrity.service';
import { SermonClaimReviewService } from './sermon-claim-review.service';
import { WorkspaceHelpers } from './helpers';
import { WorkspaceStateService } from './workspace-state.service';
import { WorkspaceGenerationCapability, WorkspaceGenerationRegistry } from './workspace-generation.registry';
import { GeneratedStudyOutputValidator } from '../scripture/generated-study-output.validator';
import {
  WorkspaceArtifactCounts,
  WorkspaceFeatureReadiness,
  WorkspaceFeatureReadinessMap,
  WorkspaceFeatureReadinessStatus,
  WorkspaceClaimSummary,
  WorkspaceClaimSupportLevel,
  WorkspaceClaimReview,
  WorkspaceClaimReviewDecision,
  WorkspaceIntegritySummary,
  WorkspaceIntegrityIssueDecision,
  WorkspaceIntegrityIssueReview,
  WorkspaceIntegrityIssueSummary,
  WorkspaceNextAction,
  WorkspaceMediaPackSummary,
  WorkspaceExportSummary,
  WorkspacePhase,
  WorkspaceManuscriptHistorySummary,
  WorkspaceManuscriptComparisonSummary,
  WorkspaceManuscriptSummary,
  WorkspaceProgress,
  WorkspaceOutlineHistorySummary,
  WorkspaceOutlineComparisonSummary,
  WorkspaceOutlineSummary,
  WorkspaceSection,
  WorkspaceSourceSummary,
  WorkspaceStateResponse,
} from './workspace-state.types';
import { WorkspacesPrompts } from './workspaces-prompts';
import { normalizeTheologicalLens } from './theological-lens.util';
import { cleanVerseText, extractVerseNumber, parseScriptureReference, validateVerseIntegrity } from '../scripture/scripture-helpers';

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

type CoachRepairIssueType =
  | 'text_fidelity'
  | 'structure_flow'
  | 'application_strength'
  | 'theological_clarity'
  | 'language_consistency'
  | 'gospel_focus';

type CoachRepairPlanItem = {
  issueId: string;
  questionId: string;
  issueType: CoachRepairIssueType;
  severity: 'high' | 'medium' | 'low';
  targetAnchor: string;
  proposedAction: string;
  expectedOutcome: string;
  selected?: boolean;
};

type ManuscriptRepairApplyPayload = {
  selectedIssueIds?: string[];
  doNotTouchAnchors?: string[];
  conversationSummary?: string;
  mode?: 'targeted' | string;
};

type ManuscriptRepairQueuePayload = {
  workspaceId: string;
  manuscriptId: string;
  userId: string;
  selectedIssueIds: string[];
  doNotTouchAnchors: string[];
  conversationSummary: string;
  mode: 'targeted';
};

type WorkspaceGenerationJobPayload = {
  workspaceId: string;
  userId: string;
  capability: WorkspaceGenerationCapability;
  promptOverride?: string;
  includeEGW?: boolean;
};

type WorkspacePlanningProfile = {
  sermonDate?: string;
  targetLengthMinutes?: number;
  serviceType?: string;
  appealStyle?: string;
  ministryMode?: string;
  bilingualMode?: string;
};

type WorkspaceGuardrailProfile = {
  active: boolean;
  label: string;
  mode?: 'prophetic_adventist';
  reason?: string;
  message?: string;
  focus?: string[];
  scriptureAnchors?: string[];
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

  private getPrimaryStudyReport(workspace: SermonWorkspace) {
    const reports = Array.isArray(workspace?.studyReports) ? workspace.studyReports.filter(Boolean) : [];
    if (!reports.length) return null;
    const passage = this.asString(workspace?.mainPassage || '').trim().toLowerCase();
    const sortByRecent = (left: any, right: any) => {
      const leftTime = new Date(this.asString(right?.updatedAt || right?.createdAt || '')).getTime();
      const rightTime = new Date(this.asString(left?.updatedAt || left?.createdAt || '')).getTime();
      return leftTime - rightTime;
    };
    const matchingPassage = reports.filter((report: any) => {
      const sections = report?.sections || {};
      const validation = this.generatedStudyOutputValidator.validate('study-report', sections, {
        reference: workspace?.mainPassage || '',
        language: workspace?.language || 'en',
      });
      if (!validation.valid || sections?.status === 'unavailable') {
        return false;
      }
      const haystack = [
        sections?.passageOverview,
        sections?.exegeticalSummary,
        sections?.literaryContext,
        sections?.historicalContext,
        sections?.canonicalContext,
        sections?.mainTheologicalClaim,
      ]
        .map((value) => this.asString(value).toLowerCase())
        .join(' ');
      return passage ? haystack.includes(passage) : false;
    });
    const pool = matchingPassage.length ? matchingPassage : reports;
    return [...pool].sort(sortByRecent)[0] || null;
  }

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
    const reportSections = this.getPrimaryStudyReport(workspace)?.sections || {};
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
      return WorkspacesPrompts.socraticCoachQuestion({
        languageLabel,
        context,
        questionId: payload.questionId,
        answer: payload.answer,
      });
    }

    return WorkspacesPrompts.socraticCoachList({
      promptOverride: payload.promptOverride || '',
      languageLabel,
      mode,
      listenerProfile,
      context,
    });
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

  private inferRepairIssueTypeFromDimension(dimension: string): CoachRepairIssueType {
    const normalized = this.asString(dimension).toLowerCase();
    if (normalized.includes('structure')) return 'structure_flow';
    if (normalized.includes('application')) return 'application_strength';
    if (normalized.includes('theolog')) return 'theological_clarity';
    if (normalized.includes('language')) return 'language_consistency';
    if (normalized.includes('gospel')) return 'gospel_focus';
    return 'text_fidelity';
  }

  private inferRepairAnchor(question: {
    sourceAnchor?: string;
    question?: string;
  }, workspace: SermonWorkspace): string {
    const explicit = this.cleanCoachText(question?.sourceAnchor || '');
    if (explicit) return explicit;
    const q = this.asString(question?.question || '').toLowerCase();
    if (q.includes('introduc')) return workspace.language === 'es' ? 'Introducción' : 'Introduction';
    if (q.includes('conclus')) return workspace.language === 'es' ? 'Conclusión' : 'Conclusion';
    if (q.includes('punto 1') || q.includes('point 1')) return workspace.language === 'es' ? 'Punto 1' : 'Point 1';
    if (q.includes('punto 2') || q.includes('point 2')) return workspace.language === 'es' ? 'Punto 2' : 'Point 2';
    if (q.includes('punto 3') || q.includes('point 3')) return workspace.language === 'es' ? 'Punto 3' : 'Point 3';
    return workspace.mainPassage || 'Manuscript';
  }

  private buildRepairPlanFromCoachQuestions(
    workspace: SermonWorkspace,
    questions: Array<{
      id: string;
      dimension: string;
      question: string;
      severity: string;
      sourceAnchor: string;
      purpose: string;
    }>,
  ): CoachRepairPlanItem[] {
    const plan = (questions || [])
      .map((question, index) => {
        const issueType = this.inferRepairIssueTypeFromDimension(question.dimension);
        const targetAnchor = this.inferRepairAnchor(question, workspace);
        const baseAction =
          issueType === 'text_fidelity'
            ? 'Align this section more directly with the passage argument and immediate context.'
            : issueType === 'structure_flow'
              ? 'Add an explicit transition to connect this section with the next movement.'
              : issueType === 'application_strength'
                ? 'Add concrete, audience-specific application examples tied to the text.'
                : issueType === 'theological_clarity'
                  ? 'Clarify doctrinal statements and remove ambiguous theological language.'
                  : issueType === 'language_consistency'
                    ? 'Normalize language and labels to match workspace language.'
                    : 'Strengthen gospel clarity and Christ-centered emphasis.';
        const expectedOutcome =
          workspace.language === 'es'
            ? 'Mayor claridad, fidelidad bíblica y aplicación práctica sin reescribir todo el manuscrito.'
            : 'Improved clarity, biblical fidelity, and practical application without rewriting the full manuscript.';
        return {
          issueId: `issue-${index + 1}-${this.cleanCoachText(question.id || `Q${index + 1}`)}`,
          questionId: this.cleanCoachText(question.id || `Q${index + 1}`),
          issueType,
          severity: this.normalizeCoachSeverity(question.severity || 'medium') as 'high' | 'medium' | 'low',
          targetAnchor,
          proposedAction: baseAction,
          expectedOutcome,
          selected: true,
        } as CoachRepairPlanItem;
      })
      .slice(0, 12);
    return plan;
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
    const summaryFromParsed = this.cleanCoachText(parsed?.summary || parsed?.coachSummary || parsed?.resumen || '');
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

    const repairPlan = this.buildRepairPlanFromCoachQuestions(workspace, questions);

    const coachSession = {
      mode: this.asString(parsed?.mode || payload?.mode || 'refine').toLowerCase(),
      listenerProfile: this.asString(parsed?.listenerProfile || payload?.listenerProfile || 'general_congregation'),
      summary,
      weakAreas,
      questions,
      repairPlan,
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

  async enqueueManuscriptRepair(
    workspaceId: string,
    manuscriptId: string,
    userId: string,
    payload: ManuscriptRepairApplyPayload,
  ) {
    const workspace = await this.findOne(workspaceId, userId);
    const manuscript = (workspace.manuscripts || []).find((item: any) => item.id === manuscriptId);
    if (!manuscript) {
      throw new BadRequestException('Manuscript not found in this workspace.');
    }

    const mode = payload?.mode === 'targeted' ? 'targeted' : 'targeted';
    const session = (workspace.metadata as any)?.socraticCoachLastSession || {};
    const repairPlan = Array.isArray(session?.repairPlan) ? session.repairPlan : [];
    if (!repairPlan.length) {
      throw new BadRequestException('No Socratic repair plan found. Generate coach questions first.');
    }

    const selectedIssueIds = (Array.isArray(payload?.selectedIssueIds) ? payload.selectedIssueIds : [])
      .map((item) => this.asString(item))
      .filter(Boolean);
    const effectiveIssueIds = selectedIssueIds.length
      ? selectedIssueIds
      : repairPlan
          .filter((item: any) => item?.selected !== false)
          .map((item: any) => this.asString(item?.issueId))
          .filter(Boolean);

    if (!effectiveIssueIds.length) {
      throw new BadRequestException('Select at least one repair issue to apply.');
    }

    const queuePayload: ManuscriptRepairQueuePayload = {
      workspaceId,
      manuscriptId,
      userId,
      selectedIssueIds: Array.from(new Set(effectiveIssueIds)),
      doNotTouchAnchors: (Array.isArray(payload?.doNotTouchAnchors) ? payload.doNotTouchAnchors : [])
        .map((item) => this.cleanCoachText(item))
        .filter(Boolean),
      conversationSummary: this.cleanCoachText(payload?.conversationSummary || ''),
      mode,
    };

    const job = await this.manuscriptRepairQueue.add('apply-targeted', queuePayload, {
      attempts: 1,
      removeOnComplete: 50,
      removeOnFail: 50,
    });

    return {
      jobId: String(job.id),
      status: 'queued',
      workspaceId,
      manuscriptId,
      mode,
      selectedIssueIds: queuePayload.selectedIssueIds,
    };
  }

  async getManuscriptRepairJobStatus(
    workspaceId: string,
    manuscriptId: string,
    jobId: string,
    userId: string,
  ) {
    await this.findOne(workspaceId, userId);
    const job = await this.manuscriptRepairQueue.getJob(jobId);
    if (!job) {
      throw new BadRequestException('Repair job not found.');
    }
    const data = (job.data || {}) as ManuscriptRepairQueuePayload;
    if (data.workspaceId !== workspaceId || data.manuscriptId !== manuscriptId || data.userId !== userId) {
      throw new BadRequestException('Repair job does not belong to this manuscript.');
    }

    const state = await job.getState();
    const progress = (job.progress() || {}) as { state?: string; message?: string; touchedAnchors?: string[] };
    if (state === 'completed') {
      const latestManuscript = await this.manuscriptRepository.findOne({ where: { id: manuscriptId } });
      return {
        jobId,
        status: 'completed',
        state: 'completed',
        result: job.returnvalue || null,
        manuscript: latestManuscript || null,
      };
    }
    if (state === 'failed') {
      return {
        jobId,
        status: 'failed',
        state: 'failed',
        error: job.failedReason || 'Repair job failed.',
      };
    }
    return {
      jobId,
      status: state === 'active' ? (progress.state || 'patching') : 'queued',
      state: progress.state || (state === 'active' ? 'patching' : 'queued'),
      message: progress.message || '',
      touchedAnchors: progress.touchedAnchors || [],
    };
  }

  async queueWorkspaceGeneration(
    workspaceId: string,
    userId: string,
    capability: WorkspaceGenerationCapability,
    promptOverride?: string,
    includeEGW = false,
  ) {
    await this.findOne(workspaceId, userId);
    const job = await this.workspaceGenerationQueue.add('generate', {
      workspaceId,
      userId,
      capability,
      promptOverride,
      includeEGW,
    } satisfies WorkspaceGenerationJobPayload, {
      attempts: 2,
      removeOnComplete: 50,
      removeOnFail: 50,
    });
    return {
      jobId: String(job.id),
      status: 'queued',
      workspaceId,
      capability,
    };
  }

  async getWorkspaceGenerationJobStatus(
    workspaceId: string,
    jobId: string,
    userId: string,
  ) {
    await this.findOne(workspaceId, userId);
    const job = await this.workspaceGenerationQueue.getJob(jobId);
    if (!job) {
      throw new BadRequestException('Generation job not found.');
    }
    const data = (job.data || {}) as WorkspaceGenerationJobPayload;
    if (data.workspaceId !== workspaceId || data.userId !== userId) {
      throw new BadRequestException('Generation job does not belong to this workspace.');
    }

    const state = await job.getState();
    const progress = (job.progress() || {}) as { state?: string; message?: string };
    if (state === 'completed') {
      return {
        jobId,
        status: 'completed',
        state: 'completed',
        result: job.returnvalue || null,
      };
    }
    if (state === 'failed') {
      return {
        jobId,
        status: 'failed',
        state: 'failed',
        error: job.failedReason || 'Generation job failed.',
      };
    }
    return {
      jobId,
      status: state === 'active' ? (progress.state || 'running') : 'queued',
      state: progress.state || (state === 'active' ? 'running' : 'queued'),
      message: progress.message || '',
    };
  }

  private validateGenerationResult(capability: WorkspaceGenerationCapability, parsed: unknown) {
    const registryEntry = WorkspaceGenerationRegistry[capability];
    const validation = registryEntry.validate(parsed);
    if (!validation.ok) {
      throw new BadRequestException(
        `${registryEntry.description} validation failed: ${validation.issues.join('; ')}`,
      );
    }
    return validation;
  }

  async processWorkspaceGenerationJob(
    payload: WorkspaceGenerationJobPayload,
    job?: Job<WorkspaceGenerationJobPayload>,
  ) {
    const setStage = async (state: string, message: string) => {
      if (job) {
        await job.progress({ state, message });
      }
    };

    await setStage('loading', 'Loading workspace.');
    await this.findOne(payload.workspaceId, payload.userId);
    if (payload.capability === 'study-report') {
      await setStage('study-report', 'Generating study report.');
      const report = await this.generateStudyReport(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('study-report', (report as any)?.sections || report);
      await setStage('completed', 'Study report completed.');
      return report;
    }
    if (payload.capability === 'outline-points' || payload.capability === 'outline') {
      await setStage('outline', 'Generating outlines.');
      const result = payload.capability === 'outline-points'
        ? await this.generateOutlines(payload.workspaceId, payload.userId, 3, payload.promptOverride)
        : await this.generateOutlines(payload.workspaceId, payload.userId, 3, payload.promptOverride);
      if (payload.capability === 'outline-points') {
        this.validateGenerationResult('outline-points', result.map((outline) => outline.structure?.outlineType ? {
          points: this.extractOutlinePointTexts(outline.structure || {}),
          angle: outline.title,
        } : {
          points: this.extractOutlinePointTexts(outline.structure || {}),
          angle: outline.title,
        }));
      } else {
        this.validateGenerationResult('outline', result[0]?.structure || {});
      }
      await setStage('completed', 'Outline generation completed.');
      return result;
    }
    if (payload.capability === 'sermon-core') {
      await setStage('sermon-core', 'Generating sermon core.');
      const result = await this.generateSermonCore(payload.workspaceId, payload.userId);
      this.validateGenerationResult('sermon-core', result);
      await setStage('completed', 'Sermon core completed.');
      return result;
    }
    if (payload.capability === 'integrity-check') {
      await setStage('integrity-check', 'Running integrity review.');
      const result = await this.runIntegrityCheck(payload.workspaceId, payload.userId);
      this.validateGenerationResult('integrity-check', result);
      await setStage('completed', 'Integrity review completed.');
      return result;
    }
    if (payload.capability === 'applications') {
      await setStage('applications', 'Generating applications.');
      const result = await this.generateApplications(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('applications', result);
      await setStage('completed', 'Applications completed.');
      return result;
    }
    if (payload.capability === 'discussion-questions') {
      await setStage('discussion-questions', 'Generating discussion questions.');
      const result = await this.generateDiscussionQuestions(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('discussion-questions', result);
      await setStage('completed', 'Discussion questions completed.');
      return result;
    }
    if (payload.capability === 'illustrations') {
      await setStage('illustrations', 'Generating illustration ideas.');
      const result = await this.generateIllustrations(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('illustrations', result);
      await setStage('completed', 'Illustrations completed.');
      return result;
    }
    if (payload.capability === 'citations') {
      await setStage('citations', 'Generating citations.');
      const result = await this.generateCitations(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('citations', result);
      await setStage('completed', 'Citations completed.');
      return result;
    }
    if (payload.capability === 'media-suggestions') {
      await setStage('media-suggestions', 'Generating media suggestions.');
      const result = await this.generateMediaSuggestions(payload.workspaceId, payload.userId, payload.promptOverride);
      this.validateGenerationResult('media-suggestions', result);
      await setStage('completed', 'Media suggestions completed.');
      return result;
    }
    await setStage('failed', `Unsupported capability: ${payload.capability}`);
    throw new BadRequestException(`Unsupported generation capability: ${payload.capability}`);
  }

  async processManuscriptRepairJob(
    payload: ManuscriptRepairQueuePayload,
    job?: Job<ManuscriptRepairQueuePayload>,
  ) {
    const setStage = async (state: string, message: string, touchedAnchors: string[] = []) => {
      if (job) {
        await job.progress({ state, message, touchedAnchors });
      }
      console.info(
        '[manuscript-repair]',
        JSON.stringify({
          tag: 'manuscript_repair_stage',
          workspaceId: payload.workspaceId,
          manuscriptId: payload.manuscriptId,
          state,
          message,
          touchedAnchors,
        }),
      );
    };

    await setStage('planning', 'Preparing targeted repair plan.');
    const result = await this.applyTargetedManuscriptRepair(payload, setStage);
    await setStage('completed', 'Targeted repair completed.', result?.touchedAnchors || []);
    return result;
  }

  private extractAnchorSnippet(html: string, anchor: string): string {
    const source = this.asString(html || '');
    const marker = this.cleanCoachText(anchor || '').toLowerCase();
    if (!source || !marker) return '';
    const plain = this.stripHtmlForWordCount(source);
    const idx = plain.toLowerCase().indexOf(marker);
    if (idx < 0) return '';
    const start = Math.max(0, idx - 240);
    const end = Math.min(plain.length, idx + Math.max(marker.length, 220));
    const snippet = plain.slice(start, end).replace(/\s+/g, ' ').trim();
    return snippet;
  }

  private buildTargetedRepairPatchPrompt(
    workspace: SermonWorkspace,
    issue: CoachRepairPlanItem,
    manuscriptHtml: string,
    snippet: string,
    conversationSummary: string,
  ): string {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    return WorkspacesPrompts.targetedRepairPatch({
      languageLabel,
      theologicalLens,
      mainPassage: workspace.mainPassage,
      theme: workspace.theme || '',
      audience: workspace.audienceProfile || '',
      issueId: issue.issueId,
      issueType: issue.issueType,
      severity: issue.severity,
      targetAnchor: issue.targetAnchor,
      proposedAction: issue.proposedAction,
      expectedOutcome: issue.expectedOutcome,
      conversationSummary: conversationSummary || 'N/A',
      manuscriptHtmlJson: this.compactJsonForPrompt({ manuscriptHtml }, 7000),
      snippet,
    });
  }

  private hasAdventistDrift(text: string): boolean {
    const normalized = this.asString(text || '').toLowerCase();
    return /\bdomingo\b|\bsunday\b/.test(normalized);
  }

  private stripLeadingDuplicateAnchorTitle(
    replacementHtml: string,
    anchorText: string,
    headingContext = false,
  ): string {
    const normalizedAnchor = this.cleanCoachText(anchorText || '');
    if (!replacementHtml || !normalizedAnchor) return replacementHtml;

    let cleaned = this.asString(replacementHtml);
    const escapedAnchor = normalizedAnchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    cleaned = cleaned.replace(
      new RegExp(`^\\s*<h[1-4][^>]*>\\s*${escapedAnchor}\\s*<\\/h[1-4]>\\s*`, 'i'),
      '',
    );

    cleaned = cleaned.replace(
      new RegExp(`^\\s*<p[^>]*>\\s*${escapedAnchor}\\s*[\\.:\\-–—]?\\s*<\\/p>\\s*`, 'i'),
      '',
    );

    cleaned = cleaned.replace(
      new RegExp(`^\\s*<p([^>]*)>\\s*${escapedAnchor}\\s*[\\.:\\-–—]?\\s*`, 'i'),
      '<p$1>',
    );

    if (headingContext) {
      cleaned = cleaned.replace(
        new RegExp(`^\\s*<p([^>]*)>\\s*(?:${escapedAnchor}\\s*[\\.:\\-–—]?\\s*)+`, 'i'),
        '<p$1>',
      );
      cleaned = cleaned.replace(
        new RegExp(`^\\s*(?:${escapedAnchor}\\s*[\\.:\\-–—]?\\s*)+`, 'i'),
        '',
      );
    } else {
      cleaned = cleaned.replace(
        new RegExp(`^\\s*<p([^>]*)>\\s*(${escapedAnchor}\\s*[\\.:\\-–—]?\\s*)(?:${escapedAnchor}\\s*[\\.:\\-–—]?\\s*)+`, 'i'),
        '<p$1>$2',
      );
      cleaned = cleaned.replace(
        new RegExp(`^\\s*(${escapedAnchor}\\s*[\\.:\\-–—]?\\s*)(?:${escapedAnchor}\\s*[\\.:\\-–—]?\\s*)+`, 'i'),
        '$1',
      );
    }

    return cleaned.trim() || replacementHtml;
  }

  private applyFirstSnippetReplacement(html: string, anchor: string, beforeSnippet: string, replacement: string): string {
    const source = this.asString(html || '');
    const anchorText = this.cleanCoachText(anchor || '');
    const before = this.cleanCoachText(beforeSnippet || '');
    if (!source) return source;
    const replacementHtml = this.sanitizeGeneratedManuscriptHtml(
      /<\/?(p|h2|h3|h4|ul|ol|li|blockquote|strong|em|br)\b/i.test(replacement)
        ? replacement
        : this.markdownLikeToHtml(replacement),
    );
    if (!replacementHtml) return source;
    const headingMatch =
      !!anchorText &&
      new RegExp(`(<h[2-4][^>]*>[\\s\\S]*?${anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?<\\/h[2-4]>)`, 'i')
        .test(source);
    const normalizedReplacementHtml = this.stripLeadingDuplicateAnchorTitle(
      replacementHtml,
      anchorText,
      headingMatch,
    );

    if (anchorText) {
      const escapedAnchor = anchorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const headingRegex = new RegExp(`(<h[2-4][^>]*>[\\s\\S]*?${escapedAnchor}[\\s\\S]*?<\\/h[2-4]>)`, 'i');
      if (headingRegex.test(source)) {
        return source.replace(headingRegex, `$1\n${normalizedReplacementHtml}`);
      }
    }

    const escapedBefore = before.slice(0, 120).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (escapedBefore) {
      const paragraphRegex = new RegExp(`(<p[^>]*>[\\s\\S]{0,400}?${escapedBefore}[\\s\\S]{0,400}?<\\/p>)`, 'i');
      if (paragraphRegex.test(source)) {
        return source.replace(paragraphRegex, normalizedReplacementHtml);
      }
    }

    return `${source}\n<h3>Repair · ${anchorText || 'Target Section'}</h3>\n${normalizedReplacementHtml}`.trim();
  }

  async applyTargetedManuscriptRepair(
    payload: ManuscriptRepairQueuePayload,
    setStage: (state: string, message: string, touchedAnchors?: string[]) => Promise<void>,
  ) {
    const workspace = await this.findOne(payload.workspaceId, payload.userId);
    const manuscript = (workspace.manuscripts || []).find((item: any) => item.id === payload.manuscriptId);
    if (!manuscript) {
      throw new BadRequestException('Manuscript not found for targeted repair.');
    }

    const session = ((workspace.metadata || {}) as any)?.socraticCoachLastSession || {};
    const repairPlan = (Array.isArray(session?.repairPlan) ? session.repairPlan : []) as CoachRepairPlanItem[];
    const selectedIssues = repairPlan.filter((item) => payload.selectedIssueIds.includes(this.asString(item?.issueId)));
    if (!selectedIssues.length) {
      throw new BadRequestException('No matching repair issues selected.');
    }

    const lockSet = new Set((payload.doNotTouchAnchors || []).map((item) => this.cleanCoachText(item).toLowerCase()));
    const touchedAnchors = new Set<string>();
    const auditTrail: Array<{
      issueId: string;
      anchor: string;
      beforeSnippet: string;
      afterSnippet: string;
      result: 'repaired' | 'skipped' | 'locked' | 'failed';
    }> = [];

    let currentHtml = this.asString(manuscript?.content?.text || '');
    let repairAttempts = 0;
    const repairedIssues: string[] = [];
    const remainingIssues: string[] = [];

    for (const issue of selectedIssues) {
      const anchor = this.cleanCoachText(issue.targetAnchor || '');
      if (!anchor) {
        const fallbackSnippet = 'No target anchor was provided for this repair action.';
        remainingIssues.push(issue.issueId);
        auditTrail.push({
          issueId: issue.issueId,
          anchor: '',
          beforeSnippet: fallbackSnippet,
          afterSnippet: fallbackSnippet,
          result: 'skipped',
        });
        continue;
      }
      if (lockSet.has(anchor.toLowerCase())) {
        const lockedSnippet =
          this.extractAnchorSnippet(currentHtml, anchor) ||
          `Anchor "${anchor}" is locked. No manuscript section was modified.`;
        remainingIssues.push(issue.issueId);
        auditTrail.push({
          issueId: issue.issueId,
          anchor,
          beforeSnippet: lockedSnippet,
          afterSnippet: lockedSnippet,
          result: 'locked',
        });
        continue;
      }

      const beforeSnippet = this.extractAnchorSnippet(currentHtml, anchor);
      if (!beforeSnippet) {
        const missingAnchorSnippet = `No manuscript section matched anchor "${anchor}".`;
        remainingIssues.push(issue.issueId);
        auditTrail.push({
          issueId: issue.issueId,
          anchor,
          beforeSnippet: missingAnchorSnippet,
          afterSnippet: missingAnchorSnippet,
          result: 'skipped',
        });
        continue;
      }

      await setStage('patching', `Repairing ${issue.questionId} (${issue.issueType})`, Array.from(touchedAnchors));
      let patched = false;
      let afterSnippet = '';

      for (let attempt = 0; attempt < 2; attempt += 1) {
        repairAttempts += 1;
        const patchPrompt = this.buildTargetedRepairPatchPrompt(
          workspace,
          issue,
          currentHtml,
          beforeSnippet,
          payload.conversationSummary || '',
        );
        const patchResponse = await this.llmService.generateCompletion(patchPrompt, payload.userId, {
          temperature: 0.2,
          maxTokens: 1200,
        });
        this.logLlmOutput(`manuscript:targeted-repair:${issue.issueId}:${attempt + 1}`, patchResponse);
        const patchParsed = this.parseJsonSafe(patchResponse) || {};
        const candidateReplacement = this.cleanCoachText(
          patchParsed?.replacement || patchParsed?.patch || patchParsed?.text || patchResponse,
        );
        if (!candidateReplacement) {
          continue;
        }
        if (normalizeTheologicalLens(workspace.theologicalLens) === 'adventist' && this.hasAdventistDrift(candidateReplacement)) {
          continue;
        }
        const patchedHtml = this.applyFirstSnippetReplacement(currentHtml, anchor, beforeSnippet, candidateReplacement);
        if (patchedHtml === currentHtml) {
          continue;
        }
        const cues = this.sanitizeCueObject(manuscript?.content?.cues || {});
        if (workspace.language === 'es' && this.hasEnglishLeakInSpanishManuscript(patchedHtml, cues)) {
          continue;
        }
        currentHtml = patchedHtml;
        touchedAnchors.add(anchor);
        afterSnippet = this.extractAnchorSnippet(currentHtml, anchor);
        patched = true;
        break;
      }

      if (patched) {
        const safeAfterSnippet = afterSnippet || beforeSnippet;
        repairedIssues.push(issue.issueId);
        auditTrail.push({
          issueId: issue.issueId,
          anchor,
          beforeSnippet,
          afterSnippet: safeAfterSnippet,
          result: 'repaired',
        });
      } else {
        const failedAfterSnippet = this.extractAnchorSnippet(currentHtml, anchor) || beforeSnippet;
        remainingIssues.push(issue.issueId);
        auditTrail.push({
          issueId: issue.issueId,
          anchor,
          beforeSnippet,
          afterSnippet: failedAfterSnippet,
          result: 'failed',
        });
      }
    }

    await setStage('validating', 'Validating repaired manuscript.', Array.from(touchedAnchors));
    const normalizedOptions = this.normalizeManuscriptOptions(workspace, manuscript?.content?.metadata?.options || {});
    const quality = this.assessManuscriptQuality(currentHtml, normalizedOptions);
    let cues = this.sanitizeCueObject(manuscript?.content?.cues || {});
    if (touchedAnchors.size > 0) {
      try {
        const cuePrompt = this.buildManuscriptCueRefreshPrompt(workspace, currentHtml);
        const cueResponse = await this.llmService.generateCompletion(cuePrompt, payload.userId, {
          temperature: 0.2,
          maxTokens: 1400,
        });
        this.logLlmOutput('manuscript:targeted-repair:cues-refresh', cueResponse);
        const parsedCuePayload = this.parseJsonSafe(cueResponse);
        cues = this.sanitizeCueObject(parsedCuePayload?.cues || parsedCuePayload || cues);
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
      } catch (error) {
        console.warn(`[manuscript:targeted-repair:cues-refresh] skipped: ${(error as Error)?.message || 'unknown error'}`);
      }
    }
    if (!this.hasUsableManuscriptText(currentHtml)) {
      throw new BadRequestException('Targeted repair produced unusable manuscript content.');
    }
    if (normalizeTheologicalLens(workspace.theologicalLens) === 'adventist' && this.hasAdventistDrift(currentHtml)) {
      throw new BadRequestException('Targeted repair violated Adventist guardrails.');
    }
    if (workspace.language === 'es' && this.hasEnglishLeakInSpanishManuscript(currentHtml, cues)) {
      throw new BadRequestException('Targeted repair violated Spanish language lock.');
    }

    const plainText = this.stripHtmlForWordCount(currentHtml);
    const wordCount = this.countWords(plainText);
    const estimatedMinutes = Math.max(1, Math.ceil(wordCount / this.manuscriptWpm));
    const unresolvedQualityIssues = quality.issues.filter((item) => !repairedIssues.includes(item));
    const metadata = {
      ...(manuscript?.content?.metadata || {}),
      quality: {
        ...(manuscript?.content?.metadata?.quality || {}),
        wordCount,
        targetWords: quality.targets.targetWords,
        minWords: quality.targets.minWords,
        maxWords: quality.targets.maxWords,
        finalIssues: quality.issues,
        status: quality.issues.length ? 'needs_review' : 'ok',
        repairAttempts,
        warningMessage: this.buildManuscriptQualityWarningMessage(quality.issues, workspace.language || 'en'),
        repairedIssues,
        remainingIssues: Array.from(new Set([...remainingIssues, ...unresolvedQualityIssues])),
      },
      repair: {
        lastRepairedAt: new Date().toISOString(),
        mode: 'targeted',
        conversationSummary: payload.conversationSummary || '',
        touchedAnchors: Array.from(touchedAnchors),
        cueAnchors: Array.from(touchedAnchors).reduce(
          (acc, anchor, index) => ({
            ...acc,
            [`anchor-${index + 1}`]: anchor,
          }),
          {},
        ),
        auditTrail,
      },
    };

    manuscript.content = {
      ...(manuscript?.content || {}),
      formatVersion: manuscript?.content?.formatVersion || 'v2',
      text: currentHtml,
      cues,
      metadata,
    };
    manuscript.wordCount = wordCount;
    manuscript.estimatedMinutes = estimatedMinutes;
    await this.manuscriptRepository.save(manuscript);

    console.warn(
      '[manuscript-targeted-repair]',
      JSON.stringify({
        tag: 'manuscript_targeted_repair',
        workspaceId: payload.workspaceId,
        manuscriptId: payload.manuscriptId,
        selectedIssues: payload.selectedIssueIds,
        repairedIssues,
        remainingIssues: metadata?.quality?.remainingIssues || [],
        repairAttempts,
        wordCount,
      }),
    );

    return {
      manuscriptId: manuscript.id,
      repairedIssues,
      remainingIssues: metadata?.quality?.remainingIssues || [],
      touchedAnchors: Array.from(touchedAnchors),
      repairAttempts,
      qualityStatus: metadata?.quality?.status || 'needs_review',
      warningMessage: metadata?.quality?.warningMessage || '',
      changeSummary:
        workspace.language === 'es'
          ? `Se repararon ${repairedIssues.length} elementos y quedaron ${remainingIssues.length} pendientes.`
          : `Repaired ${repairedIssues.length} items with ${remainingIssues.length} remaining.`,
    };
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
    private sermonIntegrityService: SermonIntegrityService,
    private sermoClaimReviewService: SermonClaimReviewService,
    private generatedStudyOutputValidator: GeneratedStudyOutputValidator,
    @InjectQueue('manuscript-repair')
    private manuscriptRepairQueue: Queue,
    @InjectQueue('workspace-generation')
    private workspaceGenerationQueue: Queue,
    private workspaceStateService: WorkspaceStateService,
  ) {}

  private getWorkspaceUiState(workspace: SermonWorkspace): { phase: WorkspacePhase; section: WorkspaceSection } {
    const rawState = (workspace?.metadata as any)?.uiState || {};
    const phaseCandidate = this.asString(rawState?.phase || '').toUpperCase();
    const sectionCandidate = this.asString(rawState?.section || '').toLowerCase();

    const phase: WorkspacePhase = ['THEME', 'PASSAGE', 'STUDY', 'OUTLINE', 'WRITE', 'REFINE', 'DELIVER'].includes(phaseCandidate)
      ? (phaseCandidate as WorkspacePhase)
      : this.inferWorkspacePhase(workspace);

    const section: WorkspaceSection = ['workspace', 'scripture', 'study-report', 'outlines', 'manuscript', 'citations', 'dna', 'media'].includes(sectionCandidate)
      ? (sectionCandidate as WorkspaceSection)
      : this.inferWorkspaceSection(phase);

    return { phase, section };
  }

  private inferWorkspacePhase(workspace: SermonWorkspace): WorkspacePhase {
    const progress = this.getWorkspaceProgress(workspace);
    if (progress.deliverPrepared) return 'DELIVER';
    if (progress.refineCompleted) return 'REFINE';
    if (progress.manuscriptWritten) return 'WRITE';
    if (progress.outlineCreated) return 'OUTLINE';
    if (progress.studyGenerated) return 'STUDY';
    if (progress.passageExplored) return 'PASSAGE';
    return 'THEME';
  }

  private inferWorkspaceSection(phase: WorkspacePhase): WorkspaceSection {
    switch (phase) {
      case 'PASSAGE':
        return 'scripture';
      case 'STUDY':
        return 'study-report';
      case 'OUTLINE':
        return 'outlines';
      case 'WRITE':
        return 'manuscript';
      case 'REFINE':
        return 'dna';
      case 'DELIVER':
        return 'media';
      case 'THEME':
      default:
        return 'workspace';
    }
  }

  private getWorkspaceArtifactCounts(workspace: SermonWorkspace): WorkspaceArtifactCounts {
    return {
      outlines: Array.isArray(workspace?.outlines) ? workspace.outlines.length : 0,
      manuscripts: Array.isArray(workspace?.manuscripts) ? workspace.manuscripts.length : 0,
      studyReports: Array.isArray(workspace?.studyReports) ? workspace.studyReports.length : 0,
      applications: Array.isArray(workspace?.applications) ? workspace.applications.length : 0,
      illustrations: Array.isArray(workspace?.illustrations) ? workspace.illustrations.length : 0,
      citations: Array.isArray(workspace?.citations) ? workspace.citations.length : 0,
    };
  }

  private getWorkspaceSourceLedger(workspace: SermonWorkspace): WorkspaceSourceSummary[] {
    const citationSources = (workspace?.citations || []).flatMap((citation: any) => {
      const verses = Array.isArray(citation?.verseReferences) ? citation.verseReferences : [];
      if (!verses.length) {
        return [{
          id: `citation-source-${citation.id}`,
          sourceType: citation?.externalSources?.length ? 'external' : 'generated',
          label: this.asString(citation?.statement || 'Citation'),
          reference: citation?.externalSources?.[0] || '',
          verified: Boolean(citation?.isVerified),
        }];
      }
      return verses.map((verse: string, index: number) => ({
        id: `citation-source-${citation.id}-${index}`,
        sourceType: 'bible' as const,
        label: verse,
        reference: verse,
        verified: Boolean(citation?.isVerified),
      }));
    });

    const studyReportSource = (workspace?.studyReports?.[0]?.sections?.studyAssets?.categoryAssets?.mediaSuggestionCards || []).length
      ? [{
          id: `study-report-${workspace?.studyReports?.[0]?.id || 'latest'}`,
          sourceType: 'generated' as const,
          label: 'Study report',
          reference: workspace?.studyReports?.[0]?.createdAt || '',
          verified: true,
        }]
      : [];

    return [...citationSources, ...studyReportSource].slice(0, 100);
  }

  private getWorkspaceMediaPack(workspace: SermonWorkspace): WorkspaceMediaPackSummary | null {
    const metadata = (workspace?.metadata || {}) as Record<string, any>;
    const mediaPack = metadata?.mediaPack || metadata?.deliverables?.mediaPack || null;
    if (!mediaPack || typeof mediaPack !== 'object') {
      return null;
    }

    return {
      status: this.asString(mediaPack.status || (mediaPack.generatedAt ? 'ready' : 'draft')) as WorkspaceMediaPackSummary['status'],
      generatedAt: mediaPack.generatedAt ? this.asString(mediaPack.generatedAt) : undefined,
      deckIntent: this.asString(mediaPack.deckIntent || '') || undefined,
      deckModeLabel: this.asString(mediaPack.deckModeLabel || '') || undefined,
      sourceOutlineId: mediaPack.sourceOutlineId ? this.asString(mediaPack.sourceOutlineId) : null,
      sourceManuscriptId: mediaPack.sourceManuscriptId ? this.asString(mediaPack.sourceManuscriptId) : null,
      sourceStudyReportId: mediaPack.sourceStudyReportId ? this.asString(mediaPack.sourceStudyReportId) : null,
      activeSermonDeckId: mediaPack.activeSermonDeckId ? this.asString(mediaPack.activeSermonDeckId) : null,
      activeSocialDeckId: mediaPack.activeSocialDeckId ? this.asString(mediaPack.activeSocialDeckId) : null,
      latestDeckByIntent: mediaPack.latestDeckByIntent && typeof mediaPack.latestDeckByIntent === 'object'
        ? Object.fromEntries(Object.entries(mediaPack.latestDeckByIntent).map(([key, value]) => [key, value ? this.asString(value) : null]))
        : undefined,
      archivedDeckIds: Array.isArray(mediaPack.archivedDeckIds)
        ? mediaPack.archivedDeckIds.map((item: any) => this.asString(item)).filter(Boolean)
        : undefined,
      slideCount: typeof mediaPack.slideCount === 'number' ? mediaPack.slideCount : undefined,
      audioEnabled: typeof mediaPack.audioEnabled === 'boolean' ? mediaPack.audioEnabled : undefined,
      musicEnabled: typeof mediaPack.musicEnabled === 'boolean' ? mediaPack.musicEnabled : undefined,
      videoEnabled: typeof mediaPack.videoEnabled === 'boolean' ? mediaPack.videoEnabled : undefined,
      exportPrepared: typeof mediaPack.exportPrepared === 'boolean'
        ? mediaPack.exportPrepared
        : Boolean(metadata?.deliverables?.export),
    };
  }

  private getWorkspaceExportPack(workspace: SermonWorkspace): WorkspaceExportSummary | null {
    const metadata = (workspace?.metadata || {}) as Record<string, any>;
    const exportPack = metadata?.exportPack || metadata?.deliverables?.export || null;
    if (!exportPack || typeof exportPack !== 'object') {
      return null;
    }

    const artifacts = Array.isArray(exportPack.artifacts) ? exportPack.artifacts : [];
    return {
      status: this.asString(exportPack.status || (exportPack.generatedAt ? 'ready' : 'draft')) as WorkspaceExportSummary['status'],
      generatedAt: exportPack.generatedAt ? this.asString(exportPack.generatedAt) : undefined,
      sourceOutlineId: exportPack.sourceOutlineId ? this.asString(exportPack.sourceOutlineId) : null,
      sourceManuscriptId: exportPack.sourceManuscriptId ? this.asString(exportPack.sourceManuscriptId) : null,
      sourceStudyReportId: exportPack.sourceStudyReportId ? this.asString(exportPack.sourceStudyReportId) : null,
      artifacts: artifacts
        .map((artifact: any) => ({
          type: this.asString(artifact?.type || 'study-report') as WorkspaceExportSummary['artifacts'][number]['type'],
          label: this.asString(artifact?.label || artifact?.type || 'Export'),
          status: this.asString(artifact?.status || 'pending') as WorkspaceExportSummary['artifacts'][number]['status'],
          filename: artifact?.filename ? this.asString(artifact.filename) : undefined,
          sourceOutlineId: artifact?.sourceOutlineId ? this.asString(artifact.sourceOutlineId) : null,
          sourceManuscriptId: artifact?.sourceManuscriptId ? this.asString(artifact.sourceManuscriptId) : null,
          sourceStudyReportId: artifact?.sourceStudyReportId ? this.asString(artifact.sourceStudyReportId) : null,
          url: artifact?.url ? this.asString(artifact.url) : null,
        }))
      .filter((artifact: any) => artifact.label),
    };
  }

  private featureReadinessItem(
    status: WorkspaceFeatureReadinessStatus,
    requiredItems: string[],
    recommendedItems: string[],
    message: string,
    extras: Partial<WorkspaceFeatureReadiness> = {},
  ): WorkspaceFeatureReadiness {
    return {
      status,
      requiredItems,
      recommendedItems,
      message,
      ...extras,
    };
  }

  private latestDateFrom<T extends { createdAt?: string | Date; updatedAt?: string | Date }>(items: Array<T | null | undefined>): string | undefined {
    const timestamps = items
      .map((item) => item ? (item.updatedAt || item.createdAt) : null)
      .filter(Boolean)
      .map((value) => new Date(value as string | Date))
      .filter((value) => !Number.isNaN(value.getTime()))
      .map((value) => value.toISOString());
    return timestamps.sort().at(-1);
  }

  private async getWorkspaceFeatureReadiness(workspace: SermonWorkspace): Promise<WorkspaceFeatureReadinessMap> {
    const mainPassage = this.asString(workspace?.mainPassage || '').trim();
    const studyReport = workspace?.studyReports?.[0] || null;
    const selectedOutline = this.getActiveOutline(workspace);
    const selectedManuscript = this.getActiveManuscript(workspace);
    const latestCitation = Array.isArray(workspace?.citations) ? workspace.citations[0] || null : null;
    const latestIntegrityReport = this.getLatestIntegrityReport(workspace);
    const latestDna = Array.isArray(workspace?.dnaAnalyses) ? workspace.dnaAnalyses[0] || null : null;
    const latestTheologicalCenter = Array.isArray((workspace as any)?.theologicalCenterAnalyses) ? (workspace as any).theologicalCenterAnalyses[0] || null : null;
    const latestTension = Array.isArray((workspace as any)?.tensionAnalyses) ? (workspace as any).tensionAnalyses[0] || null : null;
    const latestDoctrinal = Array.isArray((workspace as any)?.doctrinalChecks) ? (workspace as any).doctrinalChecks[0] || null : null;
    const latestBlindSpot = Array.isArray((workspace as any)?.blindSpotAnalyses) ? (workspace as any).blindSpotAnalyses[0] || null : null;
    const latestStrategy = Array.isArray((workspace as any)?.preachingStrategies) ? (workspace as any).preachingStrategies[0] || null : null;

    const scriptureCache = (workspace?.scriptureCache || {}) as Record<string, any>;
    const lookupHistory = Array.isArray(scriptureCache.lookupHistory) ? scriptureCache.lookupHistory : [];
    const scriptureReady = Boolean(mainPassage);
    const scriptureGenerated = Boolean(scriptureCache.scriptureResult || scriptureCache.scriptureLastLookup || lookupHistory.length > 0);

    const crossReferenceSeed = this.scriptureService?.getCrossReferenceSeedStats
      ? await this.scriptureService.getCrossReferenceSeedStats()
      : { loaded: false, entries: 0 };
    const egwLibrary = workspace.egwEnabled && this.egwService?.getLibraryStats
      ? await this.egwService.getLibraryStats()
      : null;
    const configuredLlmProvider = this.llmService?.getConfiguredProvider ? this.llmService.getConfiguredProvider() : null;
    const llmProviderHealth = configuredLlmProvider && this.llmService?.getProviderHealth
      ? this.llmService.getProviderHealth(configuredLlmProvider)
      : null;
    const llmConfigured = Boolean(configuredLlmProvider);
    const llmProviderLabel = this.llmService?.getConfiguredProviderLabel ? this.llmService.getConfiguredProviderLabel() : 'LLM provider';
    const llmProviderStatus = llmProviderHealth?.status || 'needs_service';
    const llmProviderMessage = llmProviderHealth?.message || 'Configure an LLM provider to enable generation.';
    const outlineExists = Boolean(selectedOutline);
    const manuscriptExists = Boolean(selectedManuscript);
    const studyReportExists = Boolean(studyReport);
    const citationsCount = Array.isArray(workspace?.citations) ? workspace.citations.length : 0;
    const hasAdvancedAnalysis =
      Boolean(latestDna || latestTheologicalCenter || latestTension || latestDoctrinal || latestBlindSpot || latestStrategy);
    const mediaPack = this.getWorkspaceMediaPack(workspace);
    const exportPack = this.getWorkspaceExportPack(workspace);

    const readiness: WorkspaceFeatureReadinessMap = {
      scripture: scriptureReady
        ? this.featureReadinessItem(
            scriptureGenerated ? 'generated' : 'ready',
            ['mainPassage'],
            ['translation'],
            scriptureGenerated
              ? 'A scripture snapshot exists for this workspace.'
              : 'Use the selected passage to look up Scripture and save a snapshot.',
            {
              lastGeneratedAt: this.asString(scriptureCache.cachedAt || lookupHistory?.[0]?.cachedAt || ''),
              artifactId: scriptureCache.scriptureLastLookup || mainPassage || undefined,
              count: lookupHistory.length,
            },
          )
        : this.featureReadinessItem(
            'needs_prerequisite',
            ['mainPassage'],
            ['translation'],
            'Add a main passage before looking up Scripture.',
          ),
      passageSummary: mainPassage
        ? this.featureReadinessItem(
            scriptureCache.passageSummary ? 'generated' : 'ready',
            ['mainPassage'],
            ['scripture lookup'],
            scriptureCache.passageSummary
              ? 'Passage summary saved.'
              : 'Generate a passage summary.',
            {
              lastGeneratedAt: this.asString(scriptureCache.cachedAt || ''),
              artifactId: scriptureCache.passageSummary ? mainPassage : undefined,
              count: scriptureCache.passageSummary ? 1 : 0,
            },
          )
        : this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['scripture lookup'], 'Add a main passage before generating a passage summary.'),
      translationComparison: mainPassage
        ? this.featureReadinessItem(
            scriptureCache.translationComparison ? 'generated' : 'ready',
            ['mainPassage'],
            ['scripture lookup', 'multiple translations'],
            scriptureCache.translationComparison
              ? 'Translation comparison saved.'
              : 'Compare translations from the current passage.',
            {
              lastGeneratedAt: this.asString(scriptureCache.cachedAt || ''),
              artifactId: scriptureCache.translationComparison ? mainPassage : undefined,
              count: scriptureCache.translationComparison ? 1 : 0,
            },
          )
        : this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['scripture lookup'], 'Add a main passage before comparing translations.'),
      wordStudy: mainPassage
        ? this.featureReadinessItem(
            scriptureCache.wordStudy ? 'generated' : 'ready',
            ['word', 'language'],
            ['current passage'],
            scriptureCache.wordStudy
              ? 'Word study saved.'
              : 'Pick a key term to study.',
            {
              lastGeneratedAt: this.asString(scriptureCache.wordStudy?.cachedAt || ''),
              artifactId: scriptureCache.wordStudy?.word ? String(scriptureCache.wordStudy.word) : undefined,
              count: scriptureCache.wordStudy ? 1 : 0,
            },
          )
        : this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['word', 'language'], 'Add a main passage before running word study.'),
      crossReferences: !mainPassage
        ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['cross-reference seed data'], 'Add a main passage before exploring cross references.')
        : !crossReferenceSeed.loaded
          ? this.featureReadinessItem('needs_data', ['cross-reference seed data'], ['mainPassage'], 'Cross-reference seed data has not been loaded yet.', {
              count: 0,
            })
          : this.featureReadinessItem(
              scriptureCache.crossReferences?.ranked?.length ? 'generated' : 'ready',
              ['mainPassage'],
              ['cross-reference seed data'],
              scriptureCache.crossReferences?.ranked?.length
                ? 'Cross references saved.'
                : 'Run cross-reference lookup.',
              {
                lastGeneratedAt: this.asString(scriptureCache.crossReferences?.cachedAt || ''),
                artifactId: scriptureCache.crossReferences?.verse || mainPassage,
                count: Array.isArray(scriptureCache.crossReferences?.ranked) ? scriptureCache.crossReferences.ranked.length : 0,
              },
            ),
      egw: !workspace.egwEnabled
        ? this.featureReadinessItem('needs_prerequisite', ['EGW enabled'], ['main passage'], 'Enable EGW in Setup to surface Spirit of Prophecy insights.')
        : !egwLibrary || egwLibrary.books === 0
          ? this.featureReadinessItem('needs_data', ['EGW library'], ['main passage'], 'EGW library is not loaded yet.', {
              count: egwLibrary?.books || 0,
            })
          : this.featureReadinessItem(
              scriptureCache.verseCommentary?.notes?.length ? 'generated' : 'ready',
              ['EGW enabled', 'main passage'],
              ['EGW seed data'],
              scriptureCache.verseCommentary?.notes?.length
                ? 'Spirit of Prophecy commentary saved.'
                : 'Generate EGW insights from the current passage.',
              {
                count: egwLibrary.books,
              },
            ),
      studyReport: !mainPassage
        ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['LLM provider'], 'Add a main passage before generating a study report.')
        : llmProviderStatus === 'needs_service'
          ? this.featureReadinessItem('needs_service', ['LLM provider'], ['mainPassage'], llmProviderMessage)
          : llmProviderStatus === 'failed'
            ? this.featureReadinessItem('failed', ['LLM provider'], ['mainPassage'], llmProviderMessage)
          : this.featureReadinessItem(
              studyReportExists ? 'generated' : 'ready',
              ['mainPassage'],
              ['LLM provider', 'scripture lookup'],
              studyReportExists
                ? 'Study report saved.'
                : 'Generate a study report from the current passage.',
              {
                lastGeneratedAt: studyReport?.createdAt ? this.asString(studyReport.createdAt) : undefined,
                artifactId: studyReport?.id,
                count: studyReportExists ? 1 : 0,
              },
            ),
      sermonCore: !mainPassage
        ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['study report'], 'Add a main passage before generating sermon core.')
        : llmProviderStatus === 'needs_service'
          ? this.featureReadinessItem('needs_service', ['LLM provider'], ['study report'], llmProviderMessage)
          : llmProviderStatus === 'failed'
            ? this.featureReadinessItem('failed', ['LLM provider'], ['study report'], llmProviderMessage)
          : this.featureReadinessItem(
              workspace?.sermonCore ? 'generated' : 'ready',
              ['mainPassage'],
              ['study report'],
              workspace?.sermonCore
                ? 'Sermon core saved.'
                : 'Generate a sermon core before outlining.',
              {
                artifactId: workspace?.sermonCore ? `${workspace.id}:sermon-core` : undefined,
                count: workspace?.sermonCore ? 1 : 0,
              },
            ),
      outline: !mainPassage
        ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['sermon core', 'study report'], 'Add a main passage before generating an outline.')
        : llmProviderStatus === 'needs_service'
          ? this.featureReadinessItem('needs_service', ['LLM provider'], ['sermon core', 'study report'], llmProviderMessage)
          : llmProviderStatus === 'failed'
            ? this.featureReadinessItem('failed', ['LLM provider'], ['sermon core', 'study report'], llmProviderMessage)
          : this.featureReadinessItem(
              outlineExists ? 'generated' : 'ready',
              ['mainPassage'],
              ['sermon core', 'study report'],
              outlineExists ? 'Outline exists for the workspace.' : 'Generate an outline from the passage or sermon core.',
              {
                lastGeneratedAt: selectedOutline?.createdAt ? this.asString(selectedOutline.createdAt) : undefined,
                artifactId: selectedOutline?.id,
                count: Array.isArray(workspace?.outlines) ? workspace.outlines.length : 0,
              },
            ),
      manuscript: !outlineExists
        ? this.featureReadinessItem('needs_prerequisite', ['selected outline'], ['study report', 'sermon core'], 'Select or create an outline before drafting the manuscript.')
        : llmProviderStatus === 'needs_service'
          ? this.featureReadinessItem('needs_service', ['LLM provider'], ['selected outline'], llmProviderMessage)
          : llmProviderStatus === 'failed'
            ? this.featureReadinessItem('failed', ['LLM provider'], ['selected outline'], llmProviderMessage)
          : this.featureReadinessItem(
              manuscriptExists ? 'generated' : 'ready',
              ['selected outline'],
              ['study report'],
              manuscriptExists ? 'Manuscript exists for the current workspace.' : 'Draft the manuscript from the selected outline.',
              {
                lastGeneratedAt: selectedManuscript?.updatedAt ? this.asString(selectedManuscript.updatedAt) : undefined,
                artifactId: selectedManuscript?.id,
                count: Array.isArray(workspace?.manuscripts) ? workspace.manuscripts.length : 0,
              },
            ),
      citations: !manuscriptExists && !outlineExists
        ? this.featureReadinessItem('needs_prerequisite', ['manuscript or outline'], ['study report'], 'Generate a manuscript or outline before reviewing citations.')
        : llmProviderStatus === 'needs_service'
          ? this.featureReadinessItem('needs_service', ['LLM provider'], ['manuscript', 'outline'], llmProviderMessage)
          : llmProviderStatus === 'failed'
            ? this.featureReadinessItem('failed', ['LLM provider'], ['manuscript', 'outline'], llmProviderMessage)
          : this.featureReadinessItem(
              citationsCount > 0 ? 'generated' : 'ready',
              ['manuscript or outline'],
              ['study report'],
              citationsCount > 0 ? 'Citation entries exist for this workspace.' : 'Generate citations from the current sermon draft.',
              {
                lastGeneratedAt: this.latestDateFrom(workspace?.citations || []),
                artifactId: latestCitation?.id,
                count: citationsCount,
              },
            ),
      integrityReview: !manuscriptExists
        ? this.featureReadinessItem('needs_prerequisite', ['manuscript'], ['citations'], 'Generate a manuscript before running the integrity review.')
        : this.featureReadinessItem(
            latestIntegrityReport ? 'generated' : 'ready',
            ['manuscript'],
            ['citations', 'outline'],
            latestIntegrityReport
              ? 'Integrity review exists for this workspace.'
              : 'Run the integrity review after drafting the manuscript.',
            {
              lastGeneratedAt: latestIntegrityReport?.updatedAt ? this.asString(latestIntegrityReport.updatedAt) : undefined,
              artifactId: latestIntegrityReport ? `${workspace.id}:integrity-report` : undefined,
              count: latestIntegrityReport ? 1 : 0,
            },
          ),
      visualExploration: !mainPassage
        ? this.featureReadinessItem('needs_prerequisite', ['mainPassage'], ['outline', 'manuscript'], 'Add a main passage before opening visual exploration.')
        : this.featureReadinessItem(
            hasAdvancedAnalysis ? 'generated' : 'ready',
            ['mainPassage'],
            ['outline', 'manuscript'],
            hasAdvancedAnalysis
              ? 'At least one visual analysis exists for this workspace.'
              : 'Use the current sermon to explore theology, evidence, and narrative maps.',
            {
              lastGeneratedAt: this.latestDateFrom([
                latestDna,
                latestTheologicalCenter,
                latestTension,
                latestDoctrinal,
                latestBlindSpot,
                latestStrategy,
              ] as Array<{ createdAt?: string | Date; updatedAt?: string | Date }>),
              artifactId: latestDna?.id || latestTheologicalCenter?.id || latestTension?.id || latestDoctrinal?.id || latestBlindSpot?.id || latestStrategy?.id,
              count: [
                ...(Array.isArray(workspace?.dnaAnalyses) ? workspace.dnaAnalyses : []),
                ...(Array.isArray((workspace as any)?.theologicalCenterAnalyses) ? (workspace as any).theologicalCenterAnalyses : []),
                ...(Array.isArray((workspace as any)?.tensionAnalyses) ? (workspace as any).tensionAnalyses : []),
                ...(Array.isArray((workspace as any)?.doctrinalChecks) ? (workspace as any).doctrinalChecks : []),
                ...(Array.isArray((workspace as any)?.blindSpotAnalyses) ? (workspace as any).blindSpotAnalyses : []),
                ...(Array.isArray((workspace as any)?.preachingStrategies) ? (workspace as any).preachingStrategies : []),
              ].length,
            },
          ),
      media: llmProviderStatus === 'needs_service'
        ? this.featureReadinessItem('needs_service', ['LLM provider'], ['outline', 'manuscript'], llmProviderMessage)
        : llmProviderStatus === 'failed'
          ? this.featureReadinessItem('failed', ['LLM provider'], ['outline', 'manuscript'], llmProviderMessage)
        : !outlineExists && !manuscriptExists && !studyReportExists
          ? this.featureReadinessItem('needs_prerequisite', ['outline or manuscript'], ['study report'], 'Create an outline or manuscript before composing media assets.')
          : this.featureReadinessItem(
              mediaPack ? 'generated' : 'ready',
              ['outline or manuscript'],
              ['study report', 'slides service'],
              mediaPack
                ? 'Media pack is saved for this workspace.'
                : 'Compose media assets from the current sermon workspace.',
              {
                lastGeneratedAt: mediaPack?.generatedAt,
                artifactId: mediaPack?.sourceOutlineId || mediaPack?.sourceManuscriptId || mediaPack?.sourceStudyReportId || workspace.id,
                count: mediaPack?.slideCount || 0,
              },
            ),
      slides: llmProviderStatus === 'needs_service'
        ? this.featureReadinessItem('needs_service', ['LLM provider'], ['media pack', 'slides service'], llmProviderMessage)
        : llmProviderStatus === 'failed'
          ? this.featureReadinessItem('failed', ['LLM provider'], ['media pack', 'slides service'], llmProviderMessage)
        : !outlineExists && !manuscriptExists && !studyReportExists
          ? this.featureReadinessItem('needs_prerequisite', ['outline or manuscript'], ['study report'], 'Create an outline or manuscript before generating slides.')
          : this.featureReadinessItem(
              exportPack?.artifacts?.length ? 'generated' : 'ready',
              ['outline or manuscript'],
              ['media pack', 'slides service'],
              exportPack?.artifacts?.length
                ? 'Slide export artifacts are available for this workspace.'
                : 'Generate or compose slides from the workspace media pack.',
              {
                lastGeneratedAt: exportPack?.generatedAt,
                artifactId: exportPack?.artifacts?.[0]?.filename || exportPack?.sourceOutlineId || workspace.id,
                count: exportPack?.artifacts?.length || 0,
              },
            ),
      llmProvider: llmConfigured
        ? this.featureReadinessItem(
            llmProviderStatus === 'failed' ? 'failed' : 'ready',
            ['LLM provider'],
            ['main passage', 'study report'],
            llmProviderStatus === 'failed'
              ? llmProviderMessage
              : `${llmProviderLabel} is configured for generation.`,
            llmProviderStatus === 'failed' ? { checkedAt: llmProviderHealth?.checkedAt } : {},
          )
        : this.featureReadinessItem(
            'needs_service',
            ['LLM provider'],
            ['main passage', 'study report'],
            'Configure LM_STUDIO_URL, OPENAI_API_KEY, or MINIMAX_API_KEY to enable generation.',
          ),
    };

    return readiness;
  }

  private getWorkspaceClaimLedger(workspace: SermonWorkspace): WorkspaceClaimSummary[] {
    const baseLedger = this.buildBaseClaimLedger(workspace);
    const passageText = this.getPassageTextForReview(workspace);
    const selectedRange = workspace.mainPassage || '';
    return this.sermoClaimReviewService.enrichClaims(baseLedger, selectedRange, passageText);
  }

  private getPassageTextForReview(workspace: SermonWorkspace): string {
    const cache = workspace.scriptureCache as Record<string, unknown> | null;
    if (cache?.scriptureResult) {
      const result = cache.scriptureResult as any;
      if (result?.verses && Array.isArray(result.verses)) {
        return result.verses.map((v: any) => v.text || '').join(' ');
      }
    }
    return '';
  }

  private buildBaseClaimLedger(workspace: SermonWorkspace): WorkspaceClaimSummary[] {
    const claimsFromCitations = (workspace?.citations || []).map((citation: any) => {
      const verified = Boolean(citation?.isVerified);
      const supportLevel: WorkspaceClaimSupportLevel = verified
        ? 'supported'
        : Array.isArray(citation?.verseReferences) && citation.verseReferences.length
          ? 'partially_supported'
          : 'needs_review';
      const sourceType: WorkspaceSourceSummary['sourceType'] = Array.isArray(citation?.verseReferences) && citation.verseReferences.length
        ? 'bible'
        : (citation?.externalSources?.length ? 'external' : 'generated');
      return {
        id: citation.id,
        claimText: this.asString(citation?.statement || ''),
        claimType: this.asString(citation?.statementType || 'claim'),
        supportLevel,
        sourceType,
        sourceIds: Array.isArray(citation?.verseReferences)
          ? citation.verseReferences.map((verse: string) => this.cleanCoachText(verse)).filter(Boolean)
          : [],
        location: 'citations',
        verified,
      };
    });

    const outline = this.getActiveOutline(workspace);
    const outlineClaims = outline
      ? [{
          id: `outline-${outline.id}`,
          claimText: this.asString(workspace?.outlines?.find((item: any) => item.id === outline.id)?.title || ''),
          claimType: 'outline',
          supportLevel: 'needs_review' as WorkspaceClaimSupportLevel,
          sourceType: 'generated' as const,
          sourceIds: [outline.id],
          location: 'outline',
          verified: false,
        }]
      : [];

    const studyReportClaim = this.asString((workspace?.studyReports?.[0]?.sections as any)?.mainTheologicalClaim || '');
    const studyReportClaims = studyReportClaim
      ? [{
          id: `study-report-claim-${workspace?.studyReports?.[0]?.id || 'latest'}`,
          claimText: studyReportClaim,
          claimType: 'study-report',
          supportLevel: 'needs_review' as WorkspaceClaimSupportLevel,
          sourceType: 'generated' as const,
          sourceIds: workspace?.studyReports?.[0]?.id ? [workspace.studyReports[0].id] : [],
          location: 'study-report',
          verified: false,
        }]
      : [];

    return [...claimsFromCitations, ...outlineClaims, ...studyReportClaims].slice(0, 100);
  }

  private getWorkspaceClaimReviews(workspace: SermonWorkspace): WorkspaceClaimReview[] {
    const claimReviews = (workspace?.metadata as any)?.claimReviews;
    if (!Array.isArray(claimReviews)) {
      return [];
    }
    return claimReviews
      .map((review: any) => ({
        claimId: this.asString(review?.claimId || ''),
        decision: this.asString(review?.decision || '') as WorkspaceClaimReviewDecision,
        note: review?.note ? this.asString(review.note) : undefined,
        updatedAt: this.asString(review?.updatedAt || ''),
        claimText: review?.claimText ? this.asString(review.claimText) : undefined,
        claimType: review?.claimType ? this.asString(review.claimType) : undefined,
        supportLevel: review?.supportLevel ? (this.asString(review.supportLevel) as WorkspaceClaimSupportLevel) : undefined,
        sourceType: review?.sourceType ? (this.asString(review.sourceType) as WorkspaceSourceSummary['sourceType']) : undefined,
        sourceIds: Array.isArray(review?.sourceIds) ? review.sourceIds.map((item: any) => this.asString(item)).filter(Boolean) : undefined,
        location: review?.location ? this.asString(review.location) : undefined,
      }))
      .filter((review) => review.claimId && ['repair', 'acknowledge', 'cite'].includes(review.decision));
  }

  async recordClaimReview(
    workspaceId: string,
    userId: string,
    payload: RecordClaimReviewDto,
  ): Promise<WorkspaceClaimReview> {
    const workspace = await this.findOne(workspaceId, userId);
    const claimId = this.asString(payload?.claimId || '');
    if (!claimId) {
      throw new BadRequestException('Claim id is required.');
    }
    const claimLedger = this.getWorkspaceClaimLedger(workspace);
    const claim = claimLedger.find((item) => item.id === claimId);
    if (!claim) {
      throw new BadRequestException('Claim not found in this workspace.');
    }

    const updatedAt = new Date().toISOString();
    const review: WorkspaceClaimReview = {
      claimId,
      decision: payload.decision,
      note: payload.note ? this.asString(payload.note) : undefined,
      updatedAt,
      claimText: payload.claimText ? this.asString(payload.claimText) : claim.claimText,
      claimType: payload.claimType ? this.asString(payload.claimType) : claim.claimType,
      supportLevel: payload.supportLevel || claim.supportLevel,
      sourceType: (payload.sourceType as WorkspaceSourceSummary['sourceType']) || claim.sourceType,
      sourceIds: Array.isArray(payload.sourceIds) && payload.sourceIds.length
        ? payload.sourceIds.map((item) => this.cleanCoachText(item)).filter(Boolean)
        : claim.sourceIds,
      location: payload.location ? this.asString(payload.location) : claim.location,
    };

    const metadata = (workspace.metadata || {}) as Record<string, any>;
    const claimReviews = Array.isArray(metadata.claimReviews) ? metadata.claimReviews : [];
    const filtered = claimReviews.filter((item: any) => this.asString(item?.claimId || '') !== claimId);
    metadata.claimReviews = [...filtered, review].slice(-100);
    workspace.metadata = metadata;
    await this.workspaceRepository.save(workspace);
    return review;
  }

  private buildIntegrityIssueId(issue: {
    severity?: string;
    category?: string;
    message?: string;
    affectedItem?: string;
  }, index: number): string {
    const raw = [
      issue.severity || 'issue',
      issue.category || 'general',
      issue.message || issue.affectedItem || 'integrity',
      String(index + 1),
    ]
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 72);
    return raw ? `issue-${raw}` : `issue-${index + 1}`;
  }

  private getWorkspaceIntegrityIssueLedger(workspace: SermonWorkspace): WorkspaceIntegrityIssueSummary[] {
    const report = (workspace?.metadata as any)?.integrityReport;
    const reviews = this.getWorkspaceIntegrityIssueReviews(workspace);
    const reviewMap = new Map(
      reviews.map((review) => [
        review.issueId,
        review,
      ]),
    );
    const issues = Array.isArray(report?.issues) ? report.issues : [];
    return issues.map((issue: any, index: number) => {
      const issueId = this.buildIntegrityIssueId(issue, index);
      const review = reviewMap.get(issueId);
      return {
        id: issueId,
        severity: this.asString(issue?.severity || 'warning') as WorkspaceIntegrityIssueSummary['severity'],
        category: this.asString(issue?.category || 'general'),
        message: this.asString(issue?.message || ''),
        affectedItem: issue?.affectedItem ? this.asString(issue.affectedItem) : undefined,
        decision: review?.decision,
        note: review?.note,
        updatedAt: review?.updatedAt || this.asString(report?.updatedAt || ''),
        status: review ? 'reviewed' : 'open',
      };
    });
  }

  private getWorkspaceIntegrityIssueReviews(workspace: SermonWorkspace): WorkspaceIntegrityIssueReview[] {
    const reviews = (workspace?.metadata as any)?.integrityIssueReviews;
    if (!Array.isArray(reviews)) {
      return [];
    }
    return reviews
      .map((review: any) => ({
        issueId: this.asString(review?.issueId || ''),
        decision: this.asString(review?.decision || '') as WorkspaceIntegrityIssueDecision,
        note: review?.note ? this.asString(review.note) : undefined,
        updatedAt: this.asString(review?.updatedAt || ''),
        issueMessage: review?.issueMessage ? this.asString(review.issueMessage) : undefined,
        severity: review?.severity ? (this.asString(review.severity) as WorkspaceIntegrityIssueSummary['severity']) : undefined,
        category: review?.category ? this.asString(review.category) : undefined,
        affectedItem: review?.affectedItem ? this.asString(review.affectedItem) : undefined,
      }))
      .filter((review) => review.issueId && ['repair', 'acknowledge', 'cite'].includes(review.decision));
  }

  async recordIntegrityIssueReview(
    workspaceId: string,
    userId: string,
    payload: RecordIntegrityIssueReviewDto,
  ): Promise<WorkspaceIntegrityIssueReview> {
    const workspace = await this.findOne(workspaceId, userId);
    const issueId = this.asString(payload?.issueId || '');
    if (!issueId) {
      throw new BadRequestException('Issue id is required.');
    }
    const ledger = this.getWorkspaceIntegrityIssueLedger(workspace);
    const issue = ledger.find((item) => item.id === issueId);
    if (!issue) {
      throw new BadRequestException('Issue not found in this workspace.');
    }

    const updatedAt = new Date().toISOString();
    const review: WorkspaceIntegrityIssueReview = {
      issueId,
      decision: payload.decision,
      note: payload.note ? this.asString(payload.note) : undefined,
      updatedAt,
      issueMessage: payload.issueMessage ? this.asString(payload.issueMessage) : issue.message,
      severity: (payload.severity as WorkspaceIntegrityIssueSummary['severity']) || issue.severity,
      category: payload.category ? this.asString(payload.category) : issue.category,
      affectedItem: payload.affectedItem ? this.asString(payload.affectedItem) : issue.affectedItem,
    };

    const metadata = (workspace.metadata || {}) as Record<string, any>;
    const existing = Array.isArray(metadata.integrityIssueReviews) ? metadata.integrityIssueReviews : [];
    const filtered = existing.filter((item: any) => this.asString(item?.issueId || '') !== issueId);
    metadata.integrityIssueReviews = [...filtered, review].slice(-100);
    workspace.metadata = metadata;
    await this.workspaceRepository.save(workspace);
    return review;
  }

  private getActiveOutline(workspace: SermonWorkspace): WorkspaceOutlineSummary | null {
    const activeOutlineId = this.asString((workspace?.metadata as any)?.activeOutlineId || '');
    const selectedOutline =
      (activeOutlineId
        ? (workspace?.outlines || []).find((outline: any) => outline?.id === activeOutlineId)
        : null) ||
      (workspace?.outlines || []).find((outline: any) => outline?.isSelected) ||
      workspace?.outlines?.[0];
    if (!selectedOutline) return null;
    return {
      id: selectedOutline.id,
      title: this.asString(selectedOutline.title || ''),
      isSelected: Boolean(selectedOutline.isSelected),
      createdAt: selectedOutline.createdAt,
      pointCount: this.extractOutlinePointTexts(selectedOutline.structure || {}).length,
    };
  }

  private getWorkspaceOutlineHistory(workspace: SermonWorkspace): WorkspaceOutlineHistorySummary[] {
    const history = Array.isArray((workspace?.metadata as any)?.outlineHistory)
      ? ((workspace?.metadata as any)?.outlineHistory as any[])
      : [];
    const snapshots = history
      .map((item: any, index: number) => ({
        id: this.asString(item?.id || `history-outline-${index + 1}`),
        title: this.asString(item?.title || `Outline Version ${index + 1}`),
        isSelected: false,
        createdAt: this.asString(item?.createdAt || item?.archivedAt || ''),
        pointCount: typeof item?.pointCount === 'number' ? item.pointCount : Array.isArray(item?.points) ? item.points.length : 0,
        revisionLabel: this.asString(item?.revisionLabel || `Version ${index + 1}`),
        archivedAt: this.asString(item?.archivedAt || item?.createdAt || ''),
      }))
      .filter((item) => item.id && item.title);
    const currentOutline = this.getActiveOutline(workspace);
    if (!currentOutline) return snapshots.slice(0, 10);
    const hasCurrent = snapshots.some((item) => item.id === currentOutline.id);
    const currentEntry: WorkspaceOutlineHistorySummary = {
      ...currentOutline,
      revisionLabel: 'Current',
      archivedAt: this.asString(currentOutline.createdAt || ''),
    };
    return [currentEntry, ...snapshots.filter((item) => !hasCurrent || item.id !== currentOutline.id)].slice(0, 10);
  }

  private getActiveManuscript(workspace: SermonWorkspace): WorkspaceManuscriptSummary | null {
    const activeManuscriptId = this.asString((workspace?.metadata as any)?.activeManuscriptId || '');
    const manuscript =
      (activeManuscriptId
        ? (workspace?.manuscripts || []).find((item: any) => item?.id === activeManuscriptId)
        : null) ||
      (workspace?.manuscripts || [])[0];
    if (!manuscript) return null;
    return {
      id: manuscript.id,
      outlineId: manuscript.outlineId || null,
      wordCount: typeof manuscript.wordCount === 'number' ? manuscript.wordCount : null,
      estimatedMinutes: typeof manuscript.estimatedMinutes === 'number' ? manuscript.estimatedMinutes : null,
      createdAt: manuscript.createdAt,
      updatedAt: manuscript.updatedAt,
    };
  }

  private getWorkspaceManuscriptHistory(workspace: SermonWorkspace): WorkspaceManuscriptHistorySummary[] {
    const history = Array.isArray((workspace?.metadata as any)?.manuscriptHistory)
      ? ((workspace?.metadata as any)?.manuscriptHistory as any[])
      : [];
    const snapshots = history
      .map((item: any, index: number) => ({
        id: this.asString(item?.id || `history-manuscript-${index + 1}`),
        outlineId: item?.outlineId ? this.asString(item.outlineId) : null,
        wordCount: typeof item?.wordCount === 'number' ? item.wordCount : null,
        estimatedMinutes: typeof item?.estimatedMinutes === 'number' ? item.estimatedMinutes : null,
        createdAt: this.asString(item?.createdAt || item?.archivedAt || ''),
        updatedAt: this.asString(item?.updatedAt || item?.archivedAt || ''),
        revisionLabel: this.asString(item?.revisionLabel || `Version ${index + 1}`),
        archivedAt: this.asString(item?.archivedAt || item?.updatedAt || item?.createdAt || ''),
      }))
      .filter((item) => item.id);
    const currentManuscript = this.getActiveManuscript(workspace);
    if (!currentManuscript) return snapshots.slice(0, 10);
    const hasCurrent = snapshots.some((item) => item.id === currentManuscript.id);
    const currentEntry: WorkspaceManuscriptHistorySummary = {
      ...currentManuscript,
      revisionLabel: 'Current',
      archivedAt: this.asString(currentManuscript.updatedAt || currentManuscript.createdAt || ''),
    };
    return [currentEntry, ...snapshots.filter((item) => !hasCurrent || item.id !== currentManuscript.id)].slice(0, 10);
  }

  private getWorkspaceOutlineComparison(
    workspace: SermonWorkspace,
    history: WorkspaceOutlineHistorySummary[],
  ): WorkspaceOutlineComparisonSummary | null {
    const active = this.getActiveOutline(workspace);
    if (!active) return null;
    const previous = history.find((item) => item.id !== active.id) || null;
    if (!previous) return null;
    return {
      previousRevisionLabel: previous.revisionLabel || null,
      pointDelta: active.pointCount - previous.pointCount,
      titleChanged: active.title !== previous.title,
    };
  }

  private getWorkspaceManuscriptComparison(
    workspace: SermonWorkspace,
    history: WorkspaceManuscriptHistorySummary[],
  ): WorkspaceManuscriptComparisonSummary | null {
    const active = this.getActiveManuscript(workspace);
    if (!active) return null;
    const previous = history.find((item) => item.id !== active.id) || null;
    if (!previous) return null;
    return {
      previousRevisionLabel: previous.revisionLabel || null,
      wordDelta: (active.wordCount || 0) - (previous.wordCount || 0),
      minuteDelta: (active.estimatedMinutes || 0) - (previous.estimatedMinutes || 0),
      outlineChanged: (active.outlineId || null) !== (previous.outlineId || null),
    };
  }

  private appendWorkspaceHistory<T extends Record<string, unknown>>(
    workspace: SermonWorkspace,
    key: 'outlineHistory' | 'manuscriptHistory',
    entry: T,
    limit = 10,
  ) {
    const metadata = (workspace.metadata || {}) as Record<string, any>;
    const existing = Array.isArray(metadata[key]) ? metadata[key] : [];
    const next = [...existing, entry].slice(-limit);
    workspace.metadata = {
      ...metadata,
      [key]: next,
    };
  }

  private snapshotOutlineForHistory(outline: SermonOutline, revisionLabel: string): Record<string, unknown> {
    return {
      id: outline.id,
      title: outline.title,
      isSelected: Boolean(outline.isSelected),
      createdAt: outline.createdAt?.toISOString?.() || outline.createdAt || new Date().toISOString(),
      archivedAt: new Date().toISOString(),
      revisionLabel,
      pointCount: this.extractOutlinePointTexts(outline.structure || {}).length,
      structure: outline.structure || {},
    };
  }

  private snapshotManuscriptForHistory(manuscript: SermonManuscript, revisionLabel: string): Record<string, unknown> {
    return {
      id: manuscript.id,
      outlineId: manuscript.outlineId || null,
      wordCount: typeof manuscript.wordCount === 'number' ? manuscript.wordCount : null,
      estimatedMinutes: typeof manuscript.estimatedMinutes === 'number' ? manuscript.estimatedMinutes : null,
      createdAt: manuscript.createdAt?.toISOString?.() || manuscript.createdAt || new Date().toISOString(),
      updatedAt: manuscript.updatedAt?.toISOString?.() || manuscript.updatedAt || new Date().toISOString(),
      archivedAt: new Date().toISOString(),
      revisionLabel,
      content: manuscript.content || {},
      transitions: manuscript.transitions || null,
    };
  }

  private getLatestIntegrityReport(workspace: SermonWorkspace): WorkspaceIntegritySummary | null {
    const metadataReport = (workspace?.metadata as any)?.integrityReport || null;
    if (!metadataReport) return null;
    const issues = Array.isArray(metadataReport.issues) ? metadataReport.issues : [];
    const reviewedIssueCount = this.getWorkspaceIntegrityIssueReviews(workspace).length;
    return {
      overallScore: typeof metadataReport.overallScore === 'number' ? metadataReport.overallScore : undefined,
      balanced: typeof metadataReport.balanced === 'boolean' ? metadataReport.balanced : undefined,
      issueCount: issues.length,
      criticalIssueCount: issues.filter((item: any) => this.asString(item?.severity || '').toLowerCase() === 'critical').length,
      warningIssueCount: issues.filter((item: any) => this.asString(item?.severity || '').toLowerCase() === 'warning').length,
      reviewedIssueCount,
      strengthCount: Array.isArray(metadataReport.strengths) ? metadataReport.strengths.length : undefined,
      updatedAt: this.asString(metadataReport.updatedAt || ''),
    };
  }

  private getWorkspaceProgress(workspace: SermonWorkspace): WorkspaceProgress {
    const scriptureCache = workspace?.scriptureCache || {};
    const metadata = (workspace?.metadata || {}) as Record<string, any>;
    const planning = this.normalizeWorkspacePlanning(metadata);
    const latestStudyReport = Array.isArray(workspace?.studyReports) ? workspace.studyReports[0] : null;
    const selectedOutline = Array.isArray(workspace?.outlines)
      ? workspace.outlines.find((outline: any) => outline?.isSelected) || workspace.outlines[0] || null
      : null;
    const latestManuscript = Array.isArray(workspace?.manuscripts) ? workspace.manuscripts[0] : null;

    return {
      themeConfigured: Boolean(
        workspace?.title &&
        workspace?.mainPassage &&
        workspace?.language &&
        workspace?.style &&
        workspace?.storyArc &&
        (workspace?.theme || workspace?.sermonGoals || workspace?.audienceProfile || planning.serviceType || planning.ministryMode || planning.appealStyle),
      ),
      passageExplored: Boolean(scriptureCache?.scriptureResult || scriptureCache?.passageSummary || scriptureCache?.translationComparison),
      studyGenerated: Boolean(latestStudyReport),
      outlineCreated: Boolean(selectedOutline),
      manuscriptWritten: Boolean(latestManuscript),
      refineCompleted: Boolean(metadata?.socraticCoachLastSession || metadata?.dnaIntegrity || metadata?.integrityReport),
      deliverPrepared: Boolean(metadata?.mediaPack || metadata?.deliverables?.mediaPack || metadata?.deliverables?.export),
    };
  }

  private getWorkspaceNextAction(workspace: SermonWorkspace): WorkspaceNextAction {
    const progress = this.getWorkspaceProgress(workspace);
    const uiState = this.getWorkspaceUiState(workspace);
    if (!progress.themeConfigured) {
      return {
        phase: 'THEME',
        section: 'workspace',
        action: 'define-theme',
        label: 'Define sermon direction',
        description: 'Confirm the sermon theme, audience, and goals before generating study artifacts.',
      };
    }
    if (!progress.passageExplored) {
      return {
        phase: 'PASSAGE',
        section: 'scripture',
        action: 'lookup-passage',
        label: 'Study the passage',
        description: 'Load the main passage, compare translations, and confirm the textual context.',
      };
    }
    if (!progress.studyGenerated) {
      return {
        phase: 'STUDY',
        section: 'study-report',
        action: 'generate-study-report',
        label: 'Generate a study report',
        description: 'Turn passage research into a structured study report before outlining.',
      };
    }
    if (!progress.outlineCreated) {
      return {
        phase: 'OUTLINE',
        section: 'outlines',
        action: 'create-outline',
        label: 'Generate sermon outlines',
        description: 'Create outline candidates and choose the strongest structure for the sermon.',
      };
    }
    if (!progress.manuscriptWritten) {
      return {
        phase: 'WRITE',
        section: 'manuscript',
        action: 'write-manuscript',
        label: 'Draft the manuscript',
        description: 'Generate the first manuscript draft from the selected outline.',
      };
    }
    if (!progress.refineCompleted) {
      return {
        phase: 'REFINE',
        section: 'dna',
        action: 'analyze-sermon',
        label: 'Run integrity review',
        description: 'Validate citations, theology, and sermon balance before delivery.',
      };
    }
    if (!progress.deliverPrepared) {
      return {
        phase: 'DELIVER',
        section: 'media',
        action: 'generate-media-pack',
        label: 'Prepare delivery assets',
        description: 'Generate slides, audio, and supporting media from the approved manuscript.',
      };
    }

    return {
      phase: uiState.phase,
      section: uiState.section,
      action: 'export-final',
      label: 'Export or present',
      description: 'The sermon is ready for export, delivery, or further refinement.',
    };
  }

  private async buildWorkspaceState(workspace: SermonWorkspace): Promise<WorkspaceStateResponse> {
    const uiState = this.getWorkspaceUiState(workspace);
    const progress = this.getWorkspaceProgress(workspace);
    const artifacts = this.getWorkspaceArtifactCounts(workspace);
    const activeOutline = this.getActiveOutline(workspace);
    const activeManuscript = this.getActiveManuscript(workspace);
    const outlineHistory = this.getWorkspaceOutlineHistory(workspace);
    const manuscriptHistory = this.getWorkspaceManuscriptHistory(workspace);
    const outlineComparison = this.getWorkspaceOutlineComparison(workspace, outlineHistory);
    const manuscriptComparison = this.getWorkspaceManuscriptComparison(workspace, manuscriptHistory);
    const latestIntegrityReport = this.getLatestIntegrityReport(workspace);
    const integrityIssueLedger = this.getWorkspaceIntegrityIssueLedger(workspace);
    const integrityIssueReviews = this.getWorkspaceIntegrityIssueReviews(workspace);
    const mediaPack = this.getWorkspaceMediaPack(workspace);
    const exportPack = this.getWorkspaceExportPack(workspace);
    const claimLedger = this.getWorkspaceClaimLedger(workspace);
    const sourceLedger = this.getWorkspaceSourceLedger(workspace);
    const claimReviewDecisions = this.getWorkspaceClaimReviews(workspace);
    const reviewSummary = this.sermoClaimReviewService.buildReviewSummary(claimLedger);
    const nextAction = this.getWorkspaceNextAction(workspace);
    const featureReadiness = await this.getWorkspaceFeatureReadiness(workspace);
    const workspaceSnapshot = {
      ...workspace,
      planning: this.normalizeWorkspacePlanning(workspace.metadata as Record<string, any>),
      guardrail: this.buildGuardrailProfile(workspace),
      guardrailMode: (workspace.metadata as Record<string, any>)?.guardrailMode,
      guardrailDetected: Boolean((workspace.metadata as Record<string, any>)?.guardrailDetected),
    };

    const stateBuilder = this.workspaceStateService || new WorkspaceStateService()
    return stateBuilder.buildWorkspaceState({
      workspace: workspaceSnapshot,
      activePhase: uiState.phase,
      activeSection: uiState.section,
      progress,
      featureReadiness,
      artifacts,
      activeOutline,
      activeManuscript,
      outlineHistory,
      manuscriptHistory,
      outlineComparison,
      manuscriptComparison,
      latestIntegrityReport,
      integrityIssueLedger,
      integrityIssueReviews,
      mediaPack,
      exportPack,
      claimLedger,
      sourceLedger,
      claimReviewDecisions,
      reviewSummary,
      nextAction,
      uiState,
    });
  }

  async create(userId: string, createDto: CreateWorkspaceDto): Promise<SermonWorkspace> {
    const metadata = this.buildWorkspaceMetadataPayload({
      mainPassage: createDto.mainPassage,
      language: createDto.language,
      theologicalLens: createDto.theologicalLens,
      metadata: createDto.metadata,
    });
    const workspace = this.workspaceRepository.create({
      ...createDto,
      metadata,
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
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
    return `${doctrinalContext}

Generate 8-12 high-quality sermon illustrations based on:
Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Main Points: ${mainPoints.join(', ') || 'N/A'}
${seededIdeas.length ? `Existing study illustration ideas (use only as inspiration, do not copy wording): ${seededIdeas.join(' | ')}` : ''}

Write in ${languageLabel}.

Return a JSON array with items containing:
title, content, verseReference, source (optional), relatedPoint (optional), tags (array, optional).

Rules:
- Include a relevant Bible verse reference for each illustration in verseReference.
- Return at least 8 DISTINCT items.
- Make each illustration concrete, realistic, and preacher-usable in a live sermon.
- Prioritize real-life scenarios (family, work, community, discipleship, conflict, restoration) over abstract allegories.
- Do not overuse repetitive bridge/garden/lighthouse metaphors unless uniquely developed.
- Keep each content field to 2-4 sentences max.
- Each item must include:
  1) a vivid scenario,
  2) the spiritual insight tied to the passage,
  3) a clear transition line the preacher can say.
- Vary the illustration type mix:
  - at least 3 everyday contemporary examples,
  - at least 2 pastoral/church-life examples,
  - at least 2 biblical-history/cultural-context analogies.
- Keep theological fidelity to ${workspace.mainPassage} and avoid doctrinal drift.
- If language is Spanish, use natural pastoral Spanish (not literal machine-translation style).
- No markdown, no prose outside JSON, no code fences.`;
  }

  buildCitationsPrompt(workspace: SermonWorkspace) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
    const guardrail = this.buildGuardrailProfile(workspace);
    const guardrailRule = guardrail.active
      ? `Prophetic guardrail: use verseReferences only from ${this.asString(workspace.mainPassage)} and the listed anchors. If a statement is theological inference, keep verseReferences empty or use only clearly relevant anchors. Do not invent unrelated proof texts.`
      : '';
    
    return `${doctrinalContext}

Generate 5-8 supporting citations and statements for the sermon:
Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Theological Lens: ${normalizeTheologicalLens(workspace.theologicalLens)}
${guardrailRule ? `${guardrailRule}\n` : ''}

Write in ${languageLabel}.

Return a JSON array with items containing:
statementType (observation, interpretation, application, illustration, external_reference),
statement, verseReferences (array), externalSources (array, optional).`;
  }

  buildOutlinePrompt(workspace: SermonWorkspace) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
    
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
Theological Lens: ${normalizeTheologicalLens(workspace.theologicalLens)}
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
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
    const guardrail = this.buildGuardrailProfile(workspace);
    const guardrailRule = guardrail.active
      ? `Prophetic guardrail: keep the outline tightly inside ${this.asString(workspace.mainPassage)} and the listed anchors. Do not create generic filler points, and do not invent unrelated proof texts or speculative claims.`
      : '';
    
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
Theological Lens: ${normalizeTheologicalLens(workspace.theologicalLens)}
Style: ${workspace.style || 'N/A'}
Story Arc: ${workspace.storyArc || 'N/A'}
${reportText ? `\nStudy Report Context:\n${reportText}` : ''}
${guardrailRule ? `\n${guardrailRule}` : ''}

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
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
    const guardrail = this.buildGuardrailProfile(workspace);
    const guardrailRule = guardrail.active
      ? `Prophetic guardrail: every point and supporting verse must stay text-grounded in ${this.asString(workspace.mainPassage)} or the listed anchors. Avoid generic filler, fear language, and unsupported cross references.`
      : '';
    
    return `${doctrinalContext}

Generate a complete sermon outline using these main points:
${points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

${variation}

Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
${reportText ? `\nStudy Report Context:\n${reportText}` : ''}
${guardrailRule ? `\n${guardrailRule}` : ''}

Write in ${languageLabel}.

Return ONLY valid JSON with this exact top-level shape:
{
  "introduction": "string",
  "points": ["Point 1", "Point 2", "Point 3"],
  "outlineType": "string",
  "sermonMovement": "string",
  "conclusion": "string",
  "callToAction": "string"
}

CRITICAL for slideTitle:
- slideTitle must be SHORT and PUNCHY (2-4 words, max 25 characters)
- Examples: "Muerte espiritual", "Obra redentora", "Nueva vida", "Fe viva"
- The full point description goes in "title", the short slide-friendly version goes in "slideTitle"
- Keep each summary to 1-2 short paragraphs max.
- Keep each array to 3 items or fewer.
- Do not generate pointNodes in this step. Those are generated separately from the canonical points.
- Do not generate applications, discussion questions, illustration ideas, media suggestions, or EGW support here. Those are attached later from study assets.

Rules:
- "points" is required and canonical; it must contain 3-5 concise points.
- "pointNodes" is optional enrichment aligned by index to "points".
- Use study assets from the Study Report Context when present.
- Ensure each point remains faithful to the passage and avoids drift.
- In Adventist context, never use Sunday/Domingo worship framing. Use Sabbath/Sábado.
- Do not include markdown, prose outside JSON, or code fences.`;
  }

  buildOutlinePointNodesPrompt(workspace: SermonWorkspace, points: string[], reportText?: string) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);

    return `${doctrinalContext}

Generate point metadata for this sermon outline. Keep the canonical point titles exactly as provided.

Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
${reportText ? `\nStudy Report Context:\n${reportText}` : ''}

Canonical Points:
${points.map((point, index) => `${index + 1}. ${point}`).join('\n')}

Write in ${languageLabel}.

Return ONLY valid JSON as an array aligned by index to the canonical points:
[
  {
    "title": "string (must match the canonical point text exactly)",
    "slideTitle": "string (SHORT 2-4 word title for slides, max 25 characters)",
    "summary": "string",
    "supportingVerses": ["Book 1:1"],
    "references": ["Book 1:1"]
  }
]

Rules:
- Return exactly ${points.length} items in the same order as the canonical points.
- Do not rewrite or shorten the "title" field; copy the canonical point text exactly.
- "slideTitle" must be punchy, meaningful, and not a truncation of the first words.
- Keep all metadata tightly related to its point.
- If a field is unknown, return an empty string or empty array instead of inventing unrelated content.
- Keep the summary brief. Do not exceed 3 short sentences.
- Do not generate applications, discussion questions, or illustration ideas here; those come from study assets later.
- In Adventist context, never use Sunday/Domingo worship framing. Use Sabbath/Sábado.
- Do not include markdown, prose outside JSON, or code fences.`;
  }

  private normalizeGeneratedPointNodes(rawPointNodes: any, points: string[]) {
    const sourceNodes = Array.isArray(rawPointNodes)
      ? rawPointNodes
      : Array.isArray(rawPointNodes?.pointNodes)
        ? rawPointNodes.pointNodes
        : [];

    const normalized = this.normalizeOutlineData({
      points,
      pointNodes: sourceNodes,
    });

    const normalizedNodes = Array.isArray(normalized?.pointNodes) ? normalized.pointNodes : [];

    return points.map((point, index) => {
      const node = normalizedNodes[index] || {};
      const pointText = this.asString(point);
      const pointParts = pointText.split(/\s[-–—]\s/);
      const fallbackSummary = this.asString(
        node?.summary ||
          (pointParts.length > 1 ? pointParts.slice(1).join(' - ') : pointText) ||
          pointText,
      );
      const fallbackSlideTitle = this.asString(
        node?.slideTitle ||
          pointText
            .split(/\s[-–—:]\s/)
            .shift()
            ?.split(/\s+/)
            .slice(0, 4)
            .join(' ') ||
          `Point ${index + 1}`,
      );
      return {
        id: this.asString(node?.id || `point-${index + 1}`),
        level: Number(node?.level) || 1,
        title: pointText,
        slideTitle: fallbackSlideTitle,
        summary: fallbackSummary,
        movement: this.asString(node?.movement || fallbackSummary),
        supportingVerses: this.asStringArray(node?.supportingVerses, 10),
        canonicalThemes: this.asStringArray(node?.canonicalThemes, 8),
        crossReferences: this.asStringArray(node?.crossReferences, 10),
        subpoints: this.asStringArray(node?.subpoints, 10),
        applications: this.asStringArray(node?.applications, 16),
        discussionQuestions: this.asStringArray(node?.discussionQuestions, 16),
        illustrationIdeas: this.asStringArray(node?.illustrationIdeas, 16),
        mediaSuggestions: this.asStringArray(node?.mediaSuggestions, 16),
        egwSupport: Array.isArray(node?.egwSupport) ? node.egwSupport : [],
        references: this.asStringArray(node?.references, 8),
        notes: this.asString(node?.notes),
      };
    }).filter((node) => node.title);
  }

  private async ensureOutlinePointNodes(
    workspace: SermonWorkspace,
    userId: string,
    outlineData: any,
    reportText?: string,
  ) {
    const canonicalPoints = this.extractOutlinePointTexts(outlineData || {});
    if (!canonicalPoints.length) return outlineData;

    const existingNodes = Array.isArray(outlineData?.pointNodes) ? outlineData.pointNodes : [];
    const hasAlignedSlideTitles =
      existingNodes.length === canonicalPoints.length &&
      existingNodes.every((node: any, index: number) => {
        const title = this.asString(node?.title || node?.text || node?.content);
        const slideTitle = this.asString(node?.slideTitle);
        return title && slideTitle && title === canonicalPoints[index];
      });

    if (hasAlignedSlideTitles) {
      return {
        ...outlineData,
        pointNodes: this.normalizeGeneratedPointNodes(existingNodes, canonicalPoints),
      };
    }

    const pointNodesPrompt = this.buildOutlinePointNodesPrompt(workspace, canonicalPoints, reportText);
    const pointNodesResponse = await this.llmService.generateCompletion(pointNodesPrompt, userId, {
      temperature: 0.2,
      maxTokens: 500,
    });
    const parsedPointNodes = this.parseJsonSafe(pointNodesResponse);
    const normalizedPointNodes = this.normalizeGeneratedPointNodes(parsedPointNodes, canonicalPoints);

    return {
      ...(outlineData || {}),
      points: canonicalPoints,
      pointNodes: normalizedPointNodes,
    };
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
      includeStudyInsights: options?.includeStudyInsights !== false,
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

  private normalizeCueSearchText(value: string) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private scoreCueMatch(cueText: string, candidateText: string) {
    const cueNorm = this.normalizeCueSearchText(cueText);
    const candNorm = this.normalizeCueSearchText(candidateText);
    if (!cueNorm || !candNorm) return 0;
    if (candNorm.includes(cueNorm)) return 1;
    const probe = cueNorm.slice(0, Math.min(90, cueNorm.length));
    if (probe && candNorm.includes(probe)) return 0.92;
    const cueTokens = cueNorm.split(' ').filter(Boolean);
    const candTokens = new Set(candNorm.split(' ').filter(Boolean));
    if (!cueTokens.length || !candTokens.size) return 0;
    const overlap = cueTokens.filter((token) => candTokens.has(token)).length;
    return overlap / cueTokens.length;
  }

  private buildCueAnchorsFromManuscriptHtml(html: string, cues: ManuscriptCues) {
    const segments = String(html || '')
      .replace(/<[^>]+>/g, '\n')
      .split(/\n+/)
      .map((item) => this.asString(item).trim())
      .filter(Boolean);
    const anchors: Record<string, any> = {};
    (['slide', 'keyLine', 'transition', 'pause', 'read', 'quote', 'cta'] as Array<keyof ManuscriptCues>).forEach((cueType) => {
      cues[cueType].forEach((cueText, cueIndex) => {
        const cueNorm = this.normalizeCueSearchText(cueText);
        if (!cueNorm) return;
        let bestIndex = -1;
        let bestScore = 0;
        let bestText = '';
        segments.forEach((segment, index) => {
          const score = this.scoreCueMatch(cueText, segment);
          if (score > bestScore) {
            bestScore = score;
            bestIndex = index;
            bestText = segment;
          }
        });
        if (bestIndex >= 0 && bestScore >= 0.35) {
          anchors[`${cueType}:${cueIndex}`] = {
            cueType,
            cueIndex,
            excerpt: bestText.slice(0, 240),
            paragraphIndex: bestIndex,
            paragraphHash: this.normalizeCueSearchText(bestText),
            confidence: Number(bestScore.toFixed(3)),
          };
        }
      });
    });
    return anchors;
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
    const studyReportRaw = this.getPrimaryStudyReport(workspace)?.sections || {};
    const structure = this.normalizeOutlineData(outline?.structure || {}) || {};
    const pointNodes = Array.isArray(structure.pointNodes) ? structure.pointNodes : [];
    const points = this.extractOutlinePointTexts(structure).slice(0, 4);
    const audience = this.asString(workspace.audienceProfile || '');
    const goal = this.asString(workspace.sermonGoals || '');
    const theme = this.asString(workspace.theme || '');
    const studyAssets = (studyReportRaw?.studyAssets || {}) as Record<string, any>;
    const categoryAssets = (studyAssets.categoryAssets || {}) as Record<string, any>;
    const movementAssets = Array.isArray(studyAssets.movementAssets) ? studyAssets.movementAssets : [];
    const blocks: string[] = [];

    blocks.push(
      isSpanish
        ? `<h2>Profundización Pastoral</h2><p>Antes de concluir, ampliemos cómo este pasaje transforma la vida diaria de la iglesia. Este desarrollo adicional conecta la verdad bíblica con decisiones concretas para ${this.formatManuscriptInline(audience || 'la congregación')} y retoma el hilo del estudio ya realizado.</p><p><strong>Resumen de estudio:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.exegeticalSummary || studyReportRaw.passageOverview || ''))}</p><p><strong>Contexto literario:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.literaryContext || ''))}</p><p><strong>Contexto histórico:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.historicalContext || ''))}</p><p><strong>Contexto canónico:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.canonicalContext || ''))}</p>`
        : `<h2>Pastoral Deepening</h2><p>Before concluding, we deepen how this passage transforms everyday church life. This additional development connects biblical truth with concrete decisions for ${this.formatManuscriptInline(audience || 'the congregation')} and reuses the study work already completed.</p><p><strong>Study summary:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.exegeticalSummary || studyReportRaw.passageOverview || ''))}</p><p><strong>Literary context:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.literaryContext || ''))}</p><p><strong>Historical context:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.historicalContext || ''))}</p><p><strong>Canonical context:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.canonicalContext || ''))}</p>`,
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
      const studyThemes = this.asStringArray(studyReportRaw?.theologicalThemes || [], 4);
      const keyTerms = Array.isArray(studyReportRaw?.keyTerms)
        ? studyReportRaw.keyTerms.slice(0, 2).map((item: any) => this.asString(item?.term || item?.word || '')).filter(Boolean)
        : [];
      const crossRefs = Array.isArray(studyReportRaw?.crossReferences)
        ? studyReportRaw.crossReferences.slice(0, 2).map((item: any) => this.asString(item?.reference || item?.verse || '')).filter(Boolean)
        : [];

      if (isSpanish) {
        blocks.push(
          `<h3>${this.formatManuscriptInline(title)}</h3>` +
            `<p><strong>Desarrollo:</strong> ${this.formatManuscriptInline(summary || 'Este punto llama a una respuesta espiritual profunda y constante.')}</p>` +
            `<p><strong>Conexión con el estudio:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.mainTheologicalClaim || theme || ''))}.</p>` +
            `<p><strong>Énfasis doctrinal:</strong> ${this.formatManuscriptInline(studyThemes.join('; ') || 'La gracia de Dios, la fe respondida y la nueva vida en Cristo.')}</p>` +
            `<p><strong>Aplicación congregacional:</strong> Como iglesia, necesitamos llevar esta verdad al hogar, al servicio y a la misión semanal. ` +
              `Esto implica oración intencional, discipulado activo y testimonio práctico para que la gracia de Cristo se vea en nuestras relaciones.</p>` +
            `<p><strong>Acompañamiento bíblico:</strong> ${this.formatManuscriptInline(refsText || workspace.mainPassage)} nos recuerda que la obediencia nace de la gracia y se expresa en obras preparadas por Dios.</p>` +
            (movementAssets[index]
              ? `<p><strong>Apoyo del estudio:</strong> ${this.formatManuscriptInline(this.asString(movementAssets[index]?.summary || ''))} ` +
                `${this.formatManuscriptInline(this.asStringArray(movementAssets[index]?.applications || [], 4).join(' '))} ` +
                `${this.formatManuscriptInline(this.asStringArray(movementAssets[index]?.discussionQuestions || [], 3).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.applications) && categoryAssets.applications.length
              ? `<p><strong>Aplicaciones extendidas:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.applications, 4).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.discussionQuestions) && categoryAssets.discussionQuestions.length
              ? `<p><strong>Preguntas pastorales:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.discussionQuestions, 3).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.illustrationIdeas) && categoryAssets.illustrationIdeas.length
              ? `<p><strong>Ilustraciones:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.illustrationIdeas, 3).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.mediaSuggestions) && categoryAssets.mediaSuggestions.length
              ? `<p><strong>Sugerencias de medios:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.mediaSuggestions, 3).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.egwSupport) && categoryAssets.egwSupport.length
              ? `<p><strong>Apoyo de Espíritu de Profecía:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.egwSupport.slice(0, 3).map((item: any) => item?.quote || item?.citation || ''), 3).join(' '))}</p>`
              : '') +
            (keyTerms.length
              ? `<p><strong>Términos clave:</strong> ${this.formatManuscriptInline(keyTerms.join('; '))}</p>`
              : '') +
            (crossRefs.length
              ? `<p><strong>Referencias de apoyo:</strong> ${this.formatManuscriptInline(crossRefs.join(', '))}</p>`
              : '') +
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
            `<p><strong>Study connection:</strong> ${this.formatManuscriptInline(this.asString(studyReportRaw.mainTheologicalClaim || theme || ''))}.</p>` +
            `<p><strong>Doctrinal emphasis:</strong> ${this.formatManuscriptInline(studyThemes.join('; ') || 'God’s grace, responsive faith, and new life in Christ.')}</p>` +
            `<p><strong>Congregational application:</strong> As a church we bring this truth into home life, service, and weekly mission through intentional prayer, active discipleship, and practical witness.</p>` +
            `<p><strong>Biblical grounding:</strong> ${this.formatManuscriptInline(refsText || workspace.mainPassage)} reminds us that obedience flows from grace and is expressed in works prepared by God.</p>` +
            (movementAssets[index]
              ? `<p><strong>Study support:</strong> ${this.formatManuscriptInline(this.asString(movementAssets[index]?.summary || ''))} ` +
                `${this.formatManuscriptInline(this.asStringArray(movementAssets[index]?.applications || [], 4).join(' '))} ` +
                `${this.formatManuscriptInline(this.asStringArray(movementAssets[index]?.discussionQuestions || [], 3).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.applications) && categoryAssets.applications.length
              ? `<p><strong>Extended applications:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.applications, 4).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.discussionQuestions) && categoryAssets.discussionQuestions.length
              ? `<p><strong>Pastoral questions:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.discussionQuestions, 3).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.illustrationIdeas) && categoryAssets.illustrationIdeas.length
              ? `<p><strong>Illustrative support:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.illustrationIdeas, 3).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.mediaSuggestions) && categoryAssets.mediaSuggestions.length
              ? `<p><strong>Media suggestions:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.mediaSuggestions, 3).join(' '))}</p>`
              : '') +
            (Array.isArray(categoryAssets.egwSupport) && categoryAssets.egwSupport.length
              ? `<p><strong>Spirit of Prophecy support:</strong> ${this.formatManuscriptInline(this.asStringArray(categoryAssets.egwSupport.slice(0, 3).map((item: any) => item?.quote || item?.citation || ''), 3).join(' '))}</p>`
              : '') +
            (keyTerms.length
              ? `<p><strong>Key terms:</strong> ${this.formatManuscriptInline(keyTerms.join('; '))}</p>`
              : '') +
            (crossRefs.length
              ? `<p><strong>Supporting references:</strong> ${this.formatManuscriptInline(crossRefs.join(', '))}</p>`
              : '') +
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
    const minReasonableWords = Math.max(650, Math.min(3600, neededWords));
    const dynamicPointTitles = points.map((item, idx) => this.asString(pointNodes[idx]?.title || item)).filter(Boolean);
    let safetyCounter = 0;
    while (this.countWords(this.stripHtmlForWordCount(html)) < minReasonableWords && dynamicPointTitles.length) {
      const title = dynamicPointTitles[(passIndex + safetyCounter) % dynamicPointTitles.length];
      html += isSpanish
        ? `<p><strong>Profundización adicional:</strong> Retoma el énfasis de ${this.formatManuscriptInline(title)} y desarrolla cómo esta verdad cambia las decisiones del hogar, la iglesia y la misión. Conecta nuevamente el resumen del estudio, el contexto literario, el contexto histórico y el énfasis canónico para mostrar por qué este punto importa para ${this.formatManuscriptInline(audience || 'la congregación')}. Luego vuelve a mencionar la gracia de Dios, la respuesta de fe y el llamado pastoral a vivir con obediencia, gratitud y esperanza.</p>`
        : `<p><strong>Additional deepening:</strong> Revisit ${this.formatManuscriptInline(title)} and show how this truth reshapes home life, church life, and mission. Reconnect the study summary, literary context, historical setting, and canonical significance so the congregation sees why this point matters for ${this.formatManuscriptInline(audience || 'the congregation')}. Then restate the grace of God, the human response of faith, and the pastoral call to live with obedience, gratitude, and hope.</p>`;
      safetyCounter += 1;
      if (safetyCounter > 12) break;
    }

    return html;
  }

  private buildManuscriptGuardrailFallback(
    workspace: SermonWorkspace,
    outline: SermonOutline,
    options: Required<ManuscriptGenerationOptions>,
  ): { text: string; cues: ManuscriptCues } {
    const isSpanish = workspace.language === 'es';
    const guardrail = this.buildGuardrailProfile(workspace);
    const normalizedStructure = this.normalizeOutlineData(outline?.structure || {}) || {};
    const pointNodes = Array.isArray(normalizedStructure.pointNodes) ? normalizedStructure.pointNodes : [];
    const pointTitles = this.extractOutlinePointTexts(normalizedStructure).slice(0, 4);
    const targetWords = Math.max(options.targetMinutes * this.manuscriptWpm, 220);
    const expandedBody = this.buildUnderLengthExpansionBlock(workspace, outline, targetWords, 0);
    const intro = isSpanish
      ? guardrail.active
        ? `<h2>Manuscrito con guardrail profético</h2><p>Este borrador mantiene el pasaje en primer lugar, conserva a Cristo en el centro y evita especulación. Está diseñado para ayudar a predicar el mensaje con claridad pastoral y fidelidad bíblica.</p>`
        : `<h2>Manuscrito pastoral</h2><p>Este borrador desarrolla con amplitud el mensaje del pasaje, usa el estudio ya generado y mantiene un tono pastoral, bíblico y claro. Está diseñado para que la congregación vea el flujo completo del sermón sin perder la conexión con el estudio previo.</p>`
      : guardrail.active
        ? `<h2>Prophetic guardrail manuscript</h2><p>This draft keeps the passage first, keeps Christ at the center, and avoids speculation. It is designed to help preach the message with pastoral clarity and biblical fidelity.</p>`
        : `<h2>Pastoral manuscript</h2><p>This draft develops the passage in full, reuses the study already generated, and keeps a pastoral, biblical, and clear tone. It is designed so the congregation can follow the full sermon flow without losing the study work completed earlier.</p>`;
    const conclusion = isSpanish
      ? `<h2>Conclusión y llamado</h2><p>Invitemos a la congregación a responder al evangelio eterno con fe, adoración fiel y confianza en Jesucristo, el único que salva, sostiene y envía a su pueblo.</p>`
      : `<h2>Conclusion and appeal</h2><p>Invite the congregation to respond to the everlasting gospel with faith, faithful worship, and confidence in Jesus Christ, the only One who saves, sustains, and sends His people.</p>`;
    const fallbackText = `${intro}\n${expandedBody}\n${conclusion}`;
    const cues: ManuscriptCues = {
      slide: pointTitles.length ? pointTitles.map((title) => this.formatManuscriptInline(title)).slice(0, 8) : this.manuscriptCueTemplate().slide,
      keyLine: isSpanish
        ? [
            'El evangelio eterno llama a responder con fe y adoración.',
            'Cristo permanece al centro del mensaje profético.',
          ]
        : [
            'The everlasting gospel calls for faith and worship.',
            'Christ remains at the center of the prophetic message.',
          ],
      transition: pointNodes.length
        ? pointNodes.map((point: any, index: number) =>
            isSpanish
              ? `Transición hacia ${this.asString(point?.title || pointTitles[index] || `Punto ${index + 1}`)}`
              : `Transition to ${this.asString(point?.title || pointTitles[index] || `Point ${index + 1}`)}`,
          )
        : [],
      pause: isSpanish
        ? ['Pausa pastoral: deje que la congregación escuche la invitación del evangelio.']
        : ['Pastoral pause: let the congregation hear the gospel invitation.'],
      read: [this.asString(workspace.mainPassage || '')].filter(Boolean),
      quote: [],
      cta: isSpanish
        ? ['Invite a la congregación a responder con fe y obediencia.']
        : ['Invite the congregation to respond with faith and obedience.'],
    };

    return this.normalizeManuscriptForWorkspace(workspace, { text: fallbackText, cues });
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
    const studyReportRaw = this.getPrimaryStudyReport(workspace)?.sections || {};
    const studyReport = {
      passageOverview: this.asString(studyReportRaw.passageOverview || ''),
      literaryContext: this.asString(studyReportRaw.literaryContext || ''),
      historicalContext: this.asString(studyReportRaw.historicalContext || ''),
      canonicalContext: this.asString(studyReportRaw.canonicalContext || ''),
      exegeticalSummary: this.asString(studyReportRaw.exegeticalSummary || ''),
      mainTheologicalClaim: this.asString(studyReportRaw.mainTheologicalClaim || ''),
      theologicalThemes: this.asStringArray(studyReportRaw.theologicalThemes || [], 6),
      interpretiveChallenges: Array.isArray(studyReportRaw.interpretiveChallenges)
        ? studyReportRaw.interpretiveChallenges.slice(0, 3)
        : [],
      pastoralImplications: {
        personalLife: this.asStringArray(studyReportRaw?.pastoralImplications?.personalLife || [], 4),
        churchLife: this.asStringArray(studyReportRaw?.pastoralImplications?.churchLife || [], 4),
        mission: this.asStringArray(studyReportRaw?.pastoralImplications?.mission || [], 4),
      },
      structureOfPassage: Array.isArray(studyReportRaw.structureOfPassage)
        ? studyReportRaw.structureOfPassage.slice(0, 4).map((item: any) => ({
            movement: this.asString(item?.movement || ''),
            verses: this.asString(item?.verses || ''),
            summary: this.asString(item?.summary || ''),
          }))
        : [],
      keyTerms: Array.isArray(studyReportRaw.keyTerms)
        ? studyReportRaw.keyTerms.slice(0, 6).map((item: any) => ({
            term: this.asString(item?.term || item?.word || ''),
            language: this.asString(item?.language || ''),
            transliteration: this.asString(item?.transliteration || ''),
            definition: this.asString(item?.definition || item?.meaning || ''),
            nuance: this.asString(item?.nuance || item?.significance || ''),
          }))
        : [],
      crossReferences: Array.isArray(studyReportRaw.crossReferences)
        ? studyReportRaw.crossReferences.slice(0, 6).map((item: any) => ({
            reference: this.asString(item?.reference || item?.verse || ''),
            connection: this.asString(item?.connection || item?.explanation || item?.reason || ''),
            category: this.asString(item?.category || ''),
            tier: this.asString(item?.tier || ''),
          })).filter((item: any) => item.reference)
        : [],
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
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
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

    return WorkspacesPrompts.manuscriptGeneration({
      doctrinalContext,
      metadataBlock: `${this.buildWorkspacePlanningSummary(workspace) ? `Planning: ${this.buildWorkspacePlanningSummary(workspace)}\n` : ''}Title: ${workspace.title}
Series: ${workspace.seriesTitle || 'N/A'}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Tone: ${normalizedOptions.tone}
Target Length: ${normalizedOptions.targetMinutes} minutes (~${Math.round(normalizedOptions.targetMinutes * this.manuscriptWpm)} words)`,
      contextJson,
      languageLabel,
      spanishRule: isSpanish ? 'Spanish-only requirement: do not output any section title, sentence, or cue in English.' : '',
      pointInstructions: pointInstructions || 'Use outline.pointNodes from the study data above.',
      mainPassage: workspace.mainPassage,
      pointCount: pointNodes.length,
      targetMinutes: normalizedOptions.targetMinutes,
      wordTarget: wordTargets.targetWords,
      wordMin: wordTargets.minWords,
      wordMax: wordTargets.maxWords,
      includeSlideCuesLine: normalizedOptions.includeSlideCues
        ? 'Populate cues.slide with presenter prompts.'
        : 'Leave cues.slide empty.',
      includeKeyLinesLine: normalizedOptions.includeKeyLines
        ? 'Populate cues.keyLine with memorable statements.'
        : 'Leave cues.keyLine empty.',
      formatLine: normalizedOptions.format === 'notes'
        ? 'Use concise preaching-note style.'
        : 'Use full spoken manuscript style.',
    });
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
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
    
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
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
    
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

  private buildDiscussionQuestionFallbacks(workspace: SermonWorkspace, seededQuestions: string[] = []): string[] {
    const passage = this.asString(workspace?.mainPassage || '').trim() || 'the selected passage';
    const theme = this.asString(workspace?.theme || 'God’s grace and invitation').trim();
    const audience = this.asString(workspace?.audienceProfile || 'the congregation').trim();
    const sermonGoals = this.asString(workspace?.sermonGoals || 'respond in faith').trim();
    const verseReference = `(Verse: ${passage})`;
    const baseQuestions = [
      `What does ${passage} reveal about God’s character, and how should that shape the way ${audience.toLowerCase()} approaches Him? ${verseReference}`,
      `How does this passage call us to trust ${theme.toLowerCase()} more deeply in our daily lives? ${verseReference}`,
      `What response of faith is being invited in this passage, and how can we practice it this week? ${verseReference}`,
      `How does the promise in ${passage} speak to people who feel distant, ashamed, or unworthy? ${verseReference}`,
      `What does believing in Christ look like in concrete choices, habits, and relationships? ${verseReference}`,
      `How does this passage help us understand salvation as a gift rather than something earned? ${verseReference}`,
      `What would it look like for our church to live out the ${sermonGoals.toLowerCase()} in this passage? ${verseReference}`,
      `How does this passage challenge us to share hope with others without becoming judgmental or defensive? ${verseReference}`,
      `Which words or ideas in this passage deserve a closer look during group discussion, and why? ${verseReference}`,
      `How does this passage reshape our understanding of identity, dignity, and belonging in Christ? ${verseReference}`,
      `What practical step can you take this week to respond more fully to God’s invitation here? ${verseReference}`,
      `Where do you most need to receive the good news of this passage personally before you can share it with others? ${verseReference}`,
    ];

    const combined = Array.from(
      new Set([
        ...this.asStringArray(seededQuestions, 12),
        ...baseQuestions,
      ].map((item) => this.asString(item).trim()).filter(Boolean)),
    );
    const normalized = workspace.language === 'es'
      ? combined.map((item) => this.normalizeSpanishGeneratedText(item))
      : combined;
    return normalized.slice(0, 12);
  }

  private buildIllustrationFallbackItems(
    workspace: SermonWorkspace,
    mainPoints: string[] = [],
    seededIllustrations: string[] = [],
  ): Array<{ title: string; content: string; source?: string; relatedPoint?: string; tags?: string[] }> {
    const passage = this.asString(workspace?.mainPassage || '').trim() || 'the selected passage';
    const theme = this.asString(workspace?.theme || 'God’s grace and invitation').trim();
    const audience = this.asString(workspace?.audienceProfile || 'the congregation').trim();
    const points = Array.isArray(mainPoints) ? mainPoints.filter(Boolean) : [];
    const sources = Array.from(new Set([passage, ...points].filter(Boolean)));
    const ideas = [
      {
        title: 'Storm and rescue',
        content: `Picture a person being pulled from rough water at the last moment, mirroring how ${passage} presents rescue as a gift rather than a reward.`,
      },
      {
        title: 'Open door',
        content: `An open door with warm light spilling into the room can illustrate how ${theme.toLowerCase()} invites ${audience.toLowerCase()} home.`,
      },
      {
        title: 'Wrapped gift',
        content: `A costly, carefully wrapped gift waiting on a table helps explain that God’s love in ${passage} is given, not earned.`,
      },
      {
        title: 'Father on the porch',
        content: `A father waiting on the porch for a returning child can help the congregation feel the welcome embedded in ${passage}.`,
      },
      {
        title: 'Lighthouse in the storm',
        content: `A lighthouse cutting through storm-dark waves works well for the way ${passage} offers direction and hope in chaos.`,
      },
      {
        title: 'Seed and new growth',
        content: `A seed breaking open into new life can help show how faith receives life and begins a new way of living.`,
      },
      {
        title: 'Courtroom grace',
        content: `A judge paying the penalty himself can help the audience grasp the costliness of God’s gift in ${passage}.`,
      },
      {
        title: 'Bridge home',
        content: `A bridge spanning a gap can illustrate how ${passage} moves people from distance into relationship with God.`,
      },
    ];

    const seedIdeas = Array.from(new Set(seededIllustrations.map((item) => this.asString(item).trim()).filter(Boolean)));
    const built = [
      ...seedIdeas.map((content, index) => ({
        title: `Illustration ${index + 1}`,
        content,
        source: sources[index % sources.length] || passage,
      })),
      ...ideas.map((item, index) => ({
        ...item,
        source: sources[index % sources.length] || passage,
      })),
    ];

    return built.slice(0, 8).map((item, index) => ({
      ...item,
      relatedPoint: points[index % points.length] || null,
      tags: [theme, passage].filter(Boolean).slice(0, 4),
    }));
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

    return WorkspacesPrompts.mediaSuggestions({
      languageLabel,
      contextJson,
      typeOptions,
      localeRules,
    });
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

  private isSpanishLanguage(language?: string): boolean {
    return this.asString(language || '')
      .toLowerCase()
      .startsWith('es');
  }

  private describeCrossReferenceCategory(category: string, language: string = 'en'): string {
    const normalized = this.asString(category).toLowerCase();
    const isSpanish = this.isSpanishLanguage(language);
    if (normalized === 'quotation') {
      return isSpanish
        ? 'Este pasaje se vincula por cita directa o fuerte coincidencia verbal.'
        : 'This passage is linked by direct quotation or strong verbal overlap.';
    }
    if (normalized === 'typology') {
      return isSpanish
        ? 'Este pasaje refleja el mismo patrón o tipo bíblico.'
        : 'This passage mirrors the same pattern or biblical type.';
    }
    if (normalized === 'prophetic_fulfillment') {
      return isSpanish
        ? 'Este pasaje desarrolla una conexión de profecía y cumplimiento.'
        : 'This passage advances a prophecy-to-fulfillment connection.';
    }
    if (normalized === 'narrative_continuation') {
      return isSpanish
        ? 'Este pasaje continúa la misma línea narrativa o movimiento redentor.'
        : 'This passage continues the same storyline or redemptive movement.';
    }
    if (normalized === 'interpretive_tension') {
      return isSpanish
        ? 'Este pasaje agudiza la misma tensión teológica o cuestión interpretativa.'
        : 'This passage sharpens the same theological tension or interpretive issue.';
    }
    if (normalized === 'lexical') {
      return isSpanish
        ? 'Este pasaje comparte vocabulario importante o términos clave con el texto principal.'
        : 'This passage shares important wording or key terms with the main text.';
    }
    if (normalized === 'thematic') {
      return isSpanish
        ? 'Este pasaje desarrolla el mismo tema teológico desde otro ángulo.'
        : 'This passage develops the same theological theme from another angle.';
    }
    return isSpanish
      ? 'Este pasaje apoya el mismo tema o movimiento doctrinal del estudio.'
      : 'This passage supports the same theme or doctrinal movement in the study.';
  }

  private async buildStudyReportInputContext(workspace: SermonWorkspace, passageText: string) {
    const reference = workspace.mainPassage;
    const book = this.extractBookFromReference(reference);
    const cache = workspace.scriptureCache || {};
    const egwReference = this.parseReferenceForEgw(reference);
    const includeEgw = Boolean((workspace as any)?.egwEnabled || workspace?.metadata?.egwEnabled);
    const reportLanguage = this.isSpanishLanguage(workspace.language) ? 'es' : 'en';
    const additionalPassages = this.asStringArray(workspace.additionalPassages, 24).filter(
      (item) => item && item !== reference,
    );

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
        const connection = this.asString(
          detailed?.connection || cached?.connection || this.describeCrossReferenceCategory(category, reportLanguage),
        );
        return {
          reference: ref,
          category,
          connection,
        };
      });
    const additionalPassageReferences = additionalPassages.map((ref) => ({
      reference: ref,
      category: 'thematic',
      connection: reportLanguage === 'es'
        ? `Conecta con ${workspace.mainPassage} y amplía el tema central del estudio.`
        : `Connects with ${workspace.mainPassage} and expands the study's central theme.`,
    }));
    const mergedCrossReferences = new Map<string, { reference: string; category: string; connection: string }>();
    [...additionalPassageReferences, ...normalizedCrossReferences].forEach((item) => {
      if (!item.reference) return;
      if (!mergedCrossReferences.has(item.reference)) {
        mergedCrossReferences.set(item.reference, item);
      }
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
              reportLanguage,
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
        seriesTitle: workspace.seriesTitle || '',
        theme: workspace.theme || '',
        audienceProfile: workspace.audienceProfile || '',
        sermonGoals: workspace.sermonGoals || '',
        style: workspace.style || '',
        storyArc: workspace.storyArc || '',
        additionalPassages,
        includeEgw,
        language: reportLanguage,
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
        crossReferences: Array.from(mergedCrossReferences.values()).slice(0, 24),
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
    const isSpanish = this.isSpanishLanguage(workspace.language || studyInputs?.workspace?.language);
    const languageLabel = isSpanish ? 'Spanish' : 'English';
    const languageInstruction = isSpanish
      ? 'CRITICAL LANGUAGE LOCK: Produce ALL text fields in Spanish only. Do not output English in any generated field.'
      : 'Produce ALL text fields in English only.';
    const doctrinalContext = this.buildWorkspacePromptContext(workspace);
    const inputJson = this.compactJsonForPrompt(studyInputs, 12000);
    
    return `${doctrinalContext}

Generate a structured exegetical study report for:
Main Passage: ${workspace.mainPassage}
Passage Text:
${passageText}

Workspace Metadata (all fields are intentional constraints, do not ignore):
Title: ${workspace.title || 'N/A'}
Series: ${workspace.seriesTitle || 'N/A'}
Theme: ${workspace.theme || 'N/A'}
Audience: ${workspace.audienceProfile || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Style: ${workspace.style || 'N/A'}
Story Arc: ${workspace.storyArc || 'N/A'}
Additional Passages: ${workspace.additionalPassages?.length ? workspace.additionalPassages.join(', ') : 'None'}
Include EGW: ${((workspace as any)?.egwEnabled || workspace?.metadata?.egwEnabled) ? 'Yes' : 'No'}
Theological Lens: ${normalizeTheologicalLens(workspace.theologicalLens)}
Planning: ${this.buildWorkspacePlanningSummary(workspace) || 'N/A'}

Study Data Inputs (use these as primary evidence; do not ignore them):
${inputJson}

Write in ${languageLabel}.
${languageInstruction}

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
- Use Additional Passages, saved references, and EGW input when available instead of inventing generic assets.
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

  private asNumber(value: any): number | undefined {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private isPropheticAdventistPassage(reference: string): boolean {
    const normalized = this.asString(reference).toLowerCase();
    if (!normalized) return false;
    return (
      /revelation\s*14(?::\s*6\s*-\s*12)?/.test(normalized) ||
      /revelation\s*(?:12\s*-\s*14|12|13|18)/.test(normalized) ||
      /daniel\s*(?:7|8)/.test(normalized) ||
      /matthew\s*24/.test(normalized) ||
      /exodus\s*20/.test(normalized)
    );
  }

  private normalizeWorkspacePlanning(metadata?: Record<string, any>): WorkspacePlanningProfile {
    const planningSource = metadata && typeof metadata === 'object' && metadata.planning && typeof metadata.planning === 'object'
      ? metadata.planning
      : {};
    const targetLength = this.asNumber(planningSource?.targetLengthMinutes);

    const profile: WorkspacePlanningProfile = {};
    const sermonDate = this.asString(planningSource?.sermonDate);
    const serviceType = this.asString(planningSource?.serviceType);
    const appealStyle = this.asString(planningSource?.appealStyle);
    const ministryMode = this.asString(planningSource?.ministryMode);
    const bilingualMode = this.asString(planningSource?.bilingualMode);

    if (sermonDate) profile.sermonDate = sermonDate;
    if (Number.isFinite(targetLength || NaN) && (targetLength || 0) > 0) profile.targetLengthMinutes = Math.round(targetLength as number);
    if (serviceType) profile.serviceType = serviceType;
    if (appealStyle) profile.appealStyle = appealStyle;
    if (ministryMode) profile.ministryMode = ministryMode;
    if (bilingualMode) profile.bilingualMode = bilingualMode;
    return profile;
  }

  private buildGuardrailProfile(workspace: Pick<SermonWorkspace, 'mainPassage' | 'metadata' | 'language' | 'theologicalLens'>): WorkspaceGuardrailProfile {
    const metadata = (workspace.metadata || {}) as Record<string, any>;
    const planning = this.normalizeWorkspacePlanning(metadata);
    const passage = this.asString(workspace.mainPassage);
    const manualMode = this.asString(metadata.guardrailMode).toLowerCase();
    const isProphetic = this.isPropheticAdventistPassage(passage);
    const explicitlyProphetic = planning.ministryMode === 'prophetic' || manualMode.includes('prophetic');
    const active = isProphetic || explicitlyProphetic;
    if (!active) {
      return { active: false, label: '' };
    }

    const scriptureAnchors = Array.from(
      new Set([
        ...SDAAlignmentService.getPropheticReferences(),
        ...SDAAlignmentService.getSanctuaryReferences(),
      ]),
    );
    const focus = [
      'Scripture first',
      'Christ-centered',
      'Adventist-aware',
      'historically responsible',
      'non-sensational',
      'hopeful and pastoral',
      'Distinguish Bible, EGW, generated interpretation, and pastoral inference',
    ];

    return {
      active: true,
      label: 'Prophetic / Adventist Guardrail Mode',
      mode: 'prophetic_adventist',
      reason: isProphetic
        ? `${passage} is a prophetic or Adventist-heavy passage that benefits from stronger guardrails.`
        : 'Prophetic ministry mode was selected in workspace planning.',
      message:
        'Scripture first. Christ-centered. Non-sensational. Historically responsible. EGW stays secondary.',
      focus,
      scriptureAnchors,
    };
  }

  private buildWorkspacePlanningSummary(workspace: SermonWorkspace): string {
    const planning = this.normalizeWorkspacePlanning(workspace.metadata as Record<string, any>);
    const items = [
      planning.sermonDate ? `Date: ${planning.sermonDate}` : '',
      planning.targetLengthMinutes ? `Length: ${planning.targetLengthMinutes} min` : '',
      planning.serviceType ? `Service: ${planning.serviceType}` : '',
      planning.appealStyle ? `Appeal: ${planning.appealStyle}` : '',
      planning.ministryMode ? `Mode: ${planning.ministryMode}` : '',
      planning.bilingualMode ? `Language mode: ${planning.bilingualMode}` : '',
    ].filter(Boolean);

    return items.join(' • ');
  }

  private getGuardrailReferenceAllowList(workspace: SermonWorkspace): string[] {
    const guardrail = this.buildGuardrailProfile(workspace);
    return Array.from(
      new Set([
        this.asString(workspace.mainPassage),
        ...(guardrail.scriptureAnchors || []),
      ].map((item) => this.asString(item)).filter(Boolean)),
    );
  }

  private referenceBaseKey(reference: string): string {
    const value = this.asString(reference).toLowerCase();
    const match = value.match(/^([1-3]?\s*[a-záéíóúñ]+)\s+(\d+)/i);
    if (!match) {
      return value.replace(/[^a-z0-9]/g, '');
    }
    return `${match[1].replace(/[^a-z0-9]/g, '')}${match[2]}`;
  }

  private isAllowedGuardrailReference(reference: string, workspace: SermonWorkspace): boolean {
    const candidate = this.asString(reference);
    if (!candidate) return false;
    const current = this.referenceBaseKey(candidate);
    const allowList = this.getGuardrailReferenceAllowList(workspace);
    return allowList.some((allowed) => {
      const allowedKey = this.referenceBaseKey(allowed);
      return allowedKey && current.startsWith(allowedKey);
    });
  }

  private sanitizeGuardrailedReferenceList(value: any, workspace: SermonWorkspace, fallbackReference?: string): string[] {
    const items = this.asStringArray(value, 12).filter(Boolean);
    const filtered = items.filter((item) => this.isAllowedGuardrailReference(item, workspace));
    if (filtered.length) {
      return Array.from(new Set(filtered));
    }
    const fallback = this.asString(fallbackReference || workspace.mainPassage);
    return fallback ? [fallback] : [];
  }

  private sanitizePropheticOutlineReferences(outlineData: Record<string, any>, workspace: SermonWorkspace) {
    if (!outlineData || !this.buildGuardrailProfile(workspace).active) {
      return outlineData;
    }
    const fallbackSeeds = this.buildPropheticGuardrailOutlineSeeds(workspace);
    const safePoints = Array.isArray(outlineData.points)
      ? outlineData.points.map((point: any, index: number) => {
          const cleaned = this.asString(point).replace(/\bjson\b[:\s-]*/gi, '').trim();
          if (cleaned && cleaned.toLowerCase() !== 'json') {
            return cleaned;
          }
          return fallbackSeeds[index] || fallbackSeeds[fallbackSeeds.length - 1] || this.asString(workspace.mainPassage);
        })
      : outlineData.points;
    const safePointNodes = Array.isArray(outlineData.pointNodes)
      ? outlineData.pointNodes.map((node: any, index: number) => ({
          ...node,
          title:
            this.asString(node?.title || node?.slideTitle || '').replace(/\bjson\b[:\s-]*/gi, '').trim() ||
            safePoints?.[index] ||
            this.asString(node?.title || node?.slideTitle || workspace.mainPassage),
          supportingVerses: this.sanitizeGuardrailedReferenceList(node?.supportingVerses || node?.verses, workspace),
          crossReferences: this.sanitizeGuardrailedReferenceList(node?.crossReferences || node?.references, workspace),
          egwSupport: Array.isArray(node?.egwSupport)
            ? node.egwSupport.map((support: any) => ({
                ...support,
                reference: this.isAllowedGuardrailReference(support?.reference, workspace)
                  ? this.asString(support?.reference)
                  : this.asString(workspace.mainPassage),
              }))
            : node?.egwSupport,
        }))
      : [];

    return {
      ...outlineData,
      pointNodes: safePointNodes,
      points: safePoints,
    };
  }

  private buildPropheticGuardrailOutlineSeeds(workspace: SermonWorkspace): string[] {
    const passage = this.asString(workspace.mainPassage).toLowerCase();
    if (passage.includes('revelation 14')) {
      return [
        'The everlasting gospel calls every person to fear God, give glory to Him, and worship the Creator.',
        'The second angel announces that Babylon is fallen.',
        'The saints endure by keeping God\'s commandments and holding the faith of Jesus.',
      ];
    }
    if (passage.includes('daniel 7')) {
      return [
        'The Ancient of Days rules with authority over every earthly kingdom.',
        'The Son of Man receives the kingdom that will never pass away.',
        'God\'s people are called to endurance and hope because His kingdom will stand.',
      ];
    }
    if (passage.includes('daniel 8')) {
      return [
        'The vision reveals a conflict over truth, worship, and holiness.',
        'God\'s sanctuary and timing remain central to understanding the message.',
        'Faithfulness waits on God with hope rather than speculation.',
      ];
    }
    if (passage.includes('revelation 12')) {
      return [
        'Christ defeats the dragon and preserves His people through conflict.',
        'The church overcomes by the blood of the Lamb and faithful testimony.',
        'Hope remains because God protects His remnant in the final struggle.',
      ];
    }
    if (passage.includes('revelation 18')) {
      return [
        'God exposes Babylon\'s collapse and calls His people to come out.',
        'True worship and loyalty belong to Christ, not to corrupt systems.',
        'The gospel invitation remains open even in the warning.',
      ];
    }
    if (passage.includes('matthew 24')) {
      return [
        'Jesus warns His disciples not to be deceived.',
        'Watchfulness and endurance matter as the church waits on Christ.',
        'Hope rests in the coming Son of Man rather than in fear.',
      ];
    }
    if (passage.includes('exodus 20')) {
      return [
        'God speaks covenant truth rooted in His character and grace.',
        'The Sabbath command calls His people to remember the Creator and Redeemer.',
        'Obedience becomes a covenant response to the God who saves.',
      ];
    }
    return [
      `${this.asString(workspace.mainPassage)} centers on Christ and faithful response.`,
      'The passage exposes the tension between truth and compromise.',
      'God calls His people to hopeful, Scripture-shaped obedience.',
    ];
  }

  private buildCitationFallbackItems(workspace: SermonWorkspace) {
    const selectedOutline = workspace.outlines?.find((item: any) => item.isSelected) || workspace.outlines?.[0] || null;
    const pointNodes = Array.isArray(selectedOutline?.structure?.pointNodes)
      ? selectedOutline.structure.pointNodes
      : [];
    const fallbackReferences = [workspace.mainPassage].filter(Boolean);

    const items = pointNodes
      .slice(0, 4)
      .map((point: any, index: number) => {
        const references = this.asStringArray(point?.supportingVerses || [], 4);
        return {
          statementType: index === 0 ? StatementType.OBSERVATION : StatementType.INTERPRETATION,
          statement: this.asString(point?.summary || point?.title || workspace.mainPassage || ''),
          verseReferences: references.length ? references : fallbackReferences,
          externalSources: this.asStringArray(
            Array.isArray(point?.egwSupport)
              ? point.egwSupport.map((support: any) => support?.citation).filter(Boolean)
              : [],
            4,
          ),
        };
      })
      .filter((item) => item.statement && Array.isArray(item.verseReferences) && item.verseReferences.length);

    if (items.length) {
      return items;
    }

    return [
      {
        statementType: StatementType.OBSERVATION,
        statement: this.asString(workspace.mainPassage || 'Scripture-based claim'),
        verseReferences: fallbackReferences,
        externalSources: [] as string[],
      },
    ];
  }

  private buildWorkspacePromptContext(workspace: SermonWorkspace): string {
    const theologicalLens = normalizeTheologicalLens(workspace.theologicalLens);
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    const guardrail = this.buildGuardrailProfile(workspace);
    const planning = this.normalizeWorkspacePlanning(workspace.metadata as Record<string, any>);
    const blocks = [doctrinalContext.trim()];

    if (guardrail.active) {
      blocks.push(
        [
          'Prophetic / Adventist Guardrail Mode:',
          `- Passage: ${this.asString(workspace.mainPassage)}`,
          `- Guardrails: ${guardrail.message}`,
          `- Why: ${guardrail.reason}`,
          '- Keep Scripture primary and Christ central.',
          '- Avoid fear-based, alarmist, or speculative claims.',
          '- Keep historical grounding explicit and distinguish it from inference.',
          '- Use EGW only as secondary support, never as a replacement for Scripture.',
          '- For citations and supporting verses, prefer the current passage and the listed anchors below. Do not invent unrelated proof texts.',
          '- If you mention another Bible passage, label it clearly as a supporting cross-reference or Adventist theological connection.',
          `- Helpful anchors: ${(guardrail.scriptureAnchors || []).slice(0, 8).join(', ')}`,
        ].join('\n'),
      );
    }

    if (Object.keys(planning).length > 0) {
      blocks.push(
        [
          'Pastor planning context:',
          planning.sermonDate ? `- Sermon date: ${planning.sermonDate}` : '',
          planning.targetLengthMinutes ? `- Target length: ${planning.targetLengthMinutes} minutes` : '',
          planning.serviceType ? `- Service type: ${planning.serviceType}` : '',
          planning.appealStyle ? `- Appeal style: ${planning.appealStyle}` : '',
          planning.ministryMode ? `- Ministry mode: ${planning.ministryMode}` : '',
          planning.bilingualMode ? `- Bilingual mode: ${planning.bilingualMode}` : '',
        ].filter(Boolean).join('\n'),
      );
    }

    return blocks.filter(Boolean).join('\n\n');
  }

  private buildGuardrailPromptBlock(workspace: SermonWorkspace): string {
    const guardrail = this.buildGuardrailProfile(workspace);
    if (!guardrail.active) {
      return '';
    }

    return [
      `Prophetic / Adventist Guardrail Mode: ${guardrail.label}`,
      `- Passage: ${this.asString(workspace.mainPassage)}`,
      `- Why: ${guardrail.reason}`,
      `- Use Scripture first and keep Christ central.`,
      `- Keep the tone hopeful, pastoral, and historically responsible.`,
      `- Avoid fear-based or sensational claims.`,
      `- Distinguish Bible text, EGW support, generated interpretation, and pastoral inference.`,
      `- For supporting verses, prefer the main passage and guardrail anchors; do not invent unrelated proof texts.`,
      `- Useful anchors: ${(guardrail.scriptureAnchors || []).slice(0, 8).join(', ')}`,
    ].join('\n');
  }

  private buildWorkspaceMetadataPayload(input: {
    mainPassage?: string;
    language?: string;
    theologicalLens?: string;
    metadata?: Record<string, any>;
  }): Record<string, any> {
    const sourceMetadata = input.metadata && typeof input.metadata === 'object' ? { ...input.metadata } : {};
    const planning = this.normalizeWorkspacePlanning(sourceMetadata);
    const guardrail = this.buildGuardrailProfile({
      mainPassage: this.asString(input.mainPassage || ''),
      language: this.asString(input.language || 'en') || 'en',
      theologicalLens: this.asString(input.theologicalLens || 'adventist'),
      metadata: sourceMetadata,
    } as SermonWorkspace);

    const normalizedPlanning: Record<string, any> = {};
    if (planning.sermonDate) normalizedPlanning.sermonDate = planning.sermonDate;
    if (planning.targetLengthMinutes) normalizedPlanning.targetLengthMinutes = planning.targetLengthMinutes;
    if (planning.serviceType) normalizedPlanning.serviceType = planning.serviceType;
    if (planning.appealStyle) normalizedPlanning.appealStyle = planning.appealStyle;
    if (planning.ministryMode) normalizedPlanning.ministryMode = planning.ministryMode;
    if (planning.bilingualMode) normalizedPlanning.bilingualMode = planning.bilingualMode;

    return {
      ...sourceMetadata,
      planning: normalizedPlanning,
      guardrailMode: guardrail.active ? guardrail.mode || sourceMetadata.guardrailMode : sourceMetadata.guardrailMode,
      guardrail,
      guardrailDetected: guardrail.active,
    };
  }

  private buildSermonCoreFallback(workspace: SermonWorkspace, studyReport: Record<string, any>) {
    const guardrail = this.buildGuardrailProfile(workspace);
    const languageIsSpanish = workspace.language === 'es';
    const mainClaim = this.asString(studyReport?.mainTheologicalClaim || studyReport?.exegeticalSummary || workspace.theme || '');

    if (guardrail.active) {
      return languageIsSpanish
        ? {
            bigIdea: 'El evangelio eterno llama a adorar al Creador, confiar en Cristo y permanecer fieles en el conflicto final.',
            fallenCondition: 'El corazón humano se inclina a la confusión, el compromiso y el miedo cuando oye el llamado profético de Dios.',
            centralTruth: 'Cristo y su evangelio eterno sostienen el mensaje de Apocalipsis 14 y llaman a una adoración leal y esperanzada.',
            sermonGoal: 'Invitar a la congregación a responder con fe, obediencia fiel y esperanza en Jesús.',
            audienceNeed: 'La congregación necesita un mensaje adventista claro, centrado en Cristo, pastoral y sin sensacionalismo.',
          }
        : {
            bigIdea: 'The everlasting gospel calls people to worship the Creator, trust Christ, and remain faithful in the final conflict.',
            fallenCondition: 'The human heart drifts toward compromise, fear, and counterfeit worship when confronted with prophetic warning.',
            centralTruth: 'Christ and His everlasting gospel anchor Revelation 14 in hope, worship, and faithful endurance.',
            sermonGoal: 'Call the congregation to respond with faith, faithful obedience, and confident witness in Jesus.',
            audienceNeed: 'The congregation needs a clear Adventist message that is Christ-centered, pastoral, historically grounded, and free from sensationalism.',
          };
    }

    return languageIsSpanish
      ? {
          bigIdea: mainClaim || 'Dios nos llama a una fe viva que produce esperanza y obediencia.',
          fallenCondition: 'La humanidad necesita la gracia de Dios porque el pecado distorsiona nuestra visión y nuestra respuesta.',
          centralTruth: 'En Cristo, la verdad bíblica conduce a vida nueva, esperanza y fidelidad.',
          sermonGoal: 'Responder con fe y obediencia a la verdad de Dios.',
          audienceNeed: 'La congregación necesita seguridad, dirección y una respuesta práctica al evangelio.',
        }
      : {
          bigIdea: mainClaim || 'God calls us to a living faith that produces hope and obedience.',
          fallenCondition: 'Humanity needs God’s grace because sin distorts our vision and our response.',
          centralTruth: 'In Christ, biblical truth leads to new life, hope, and faithfulness.',
          sermonGoal: 'Respond with faith and obedience to God’s truth.',
          audienceNeed: 'The congregation needs assurance, direction, and a practical response to the gospel.',
        };
  }

  private buildStudyReportFallbackSections(workspace: SermonWorkspace): Record<string, any> {
    return {
      status: 'unavailable',
      message: 'Study report could not be generated. Please retry.',
      passageOverview: '',
      literaryContext: '',
      historicalContext: '',
      canonicalContext: '',
      exegeticalSummary: '',
      mainTheologicalClaim: '',
      preachingFocus: '',
      exegeticalFlow: [],
      structureOfPassage: [],
      keyTerms: [],
      theologicalThemes: [],
      interpretiveChallenges: [],
      pastoralImplications: {
        personalLife: [],
        churchLife: [],
        mission: [],
      },
      studyAssets: {
        movementAssets: [],
        categoryAssets: {
          applications: [],
          discussionQuestions: [],
          illustrationIdeas: [],
          mediaSuggestions: [],
          egwSupport: [],
          references: [],
        },
      },
    };
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

  private asStudyListArray(value: any, limit = 12): string[] {
    if (Array.isArray(value)) {
      return value.map((item) => this.asString(item)).filter(Boolean).slice(0, limit);
    }
    const text = this.asString(value);
    if (!text) return [];

    const lineItems = this.parseListFromResponse(text).map((item) => this.asString(item)).filter(Boolean);
    if (lineItems.length > 1) {
      return lineItems.slice(0, limit);
    }

    const sentenceItems = text
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+(?=[A-Z0-9“"'\(\[])/)
      .map((item) => this.asString(item))
      .filter(Boolean);

    if (sentenceItems.length > 1) {
      return sentenceItems.slice(0, limit);
    }

    const clauseItems = text
      .split(/\s*[;•]\s*|\s+—\s+|\s+\|\s+/)
      .map((item) => this.asString(item))
      .filter(Boolean);

    if (clauseItems.length > 1) {
      return clauseItems.slice(0, limit);
    }

    return lineItems.length ? lineItems.slice(0, limit) : sentenceItems.slice(0, limit);
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

  private buildStudyReportBaseSections(studyInputs: any, language: string = 'en'): Record<string, any> {
    const summary = studyInputs?.cachedStudySections?.passageSummary || {};
    const verseContext = studyInputs?.cachedStudySections?.verseContext || {};
    const structural = studyInputs?.cachedStudySections?.structuralAnalysis || {};
    const challenges = studyInputs?.cachedStudySections?.interpretiveChallenges || {};
    const canonical = studyInputs?.cachedStudySections?.canonicalThemes || {};
    const synthesis = studyInputs?.cachedStudySections?.studySynthesis || {};
    const wordStudy = studyInputs?.cachedStudySections?.wordStudy || {};
    const referenceData = studyInputs?.referenceData || {};
    const preachingFocus = this.asString(
      studyInputs?.workspace?.sermonGoals ||
      studyInputs?.workspace?.theme ||
      summary?.applicationFocus ||
      synthesis?.summary ||
      '',
    );

    const verseContextSections = Array.isArray(verseContext?.sections) ? verseContext.sections : [];
    const verseContextHistoricalNotes = verseContextSections
      .filter((item: any) => /historical|cultural|geographical|literary|context/i.test(this.asString(item?.title)))
      .map((item: any) => this.asString(item?.content || item?.summary || ''))
      .filter(Boolean);
    const verseContextLiteraryNotes = verseContextSections
      .filter((item: any) => /literary|genre|poetic|narrative|prophetic|apocalyptic|wisdom|parable/i.test(this.asString(item?.title)))
      .map((item: any) => this.asString(item?.content || item?.summary || ''))
      .filter(Boolean);

    const historicalNotes = Array.isArray(verseContext?.historical)
      ? verseContext.historical.map((item: any) => this.asString(item?.note)).filter(Boolean)
      : [];
    const culturalNotes = Array.isArray(verseContext?.cultural)
      ? verseContext.cultural.map((item: any) => this.asString(item?.note)).filter(Boolean)
      : [];

    const crossReferences = Array.isArray(referenceData?.crossReferences)
      ? referenceData.crossReferences.slice(0, 8).map((item: any) => ({
          reference: this.asString(item?.reference),
          connection: this.asString(
            item?.connection || this.describeCrossReferenceCategory(item?.category, language),
          ),
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

    const fallbackKeyTerms = Array.isArray(canonical?.themes)
      ? canonical.themes
          .slice(0, 6)
          .map((item: any) => ({
            term: this.asString(item?.name || item?.theme),
            language: language === 'es' ? 'Spanish' : 'English',
            transliteration: '',
            definition: this.asString(item?.summary || item?.description || item?.explanation || ''),
            nuance: this.asString(item?.preachingUse || item?.canonicalMovement || ''),
          }))
          .filter((item: any) => item.term)
      : [];

    const keyTerms = Array.isArray(wordStudy?.insights)
      ? wordStudy.insights.slice(0, 6).map((item: any) => ({
          term: this.asString(item?.term || item?.word),
          language: this.asString(item?.language || ''),
          transliteration: this.asString(item?.transliteration || ''),
          definition: this.asString(item?.definition || item?.gloss || ''),
          nuance: this.asString(item?.nuance || item?.summary || ''),
        }))
      : fallbackKeyTerms;

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
      literaryContext: this.asString(
        referenceData?.bookMetadata?.literaryType ||
          referenceData?.bookMetadata?.genre ||
          verseContext?.genre ||
          verseContext?.literaryGenre ||
          verseContextLiteraryNotes[0] ||
          '',
      ),
      exegeticalFlow: this.asStudyListArray(summary?.movement || synthesis?.movement || [], 8),
      exegeticalSummary: this.asString(synthesis?.summary || summary?.interpretiveCenter || ''),
      structureOfPassage: Array.isArray(structural?.structure)
        ? structural.structure.map((item: any) => ({
            movement: this.asString(item?.description || item?.type),
            verses: this.asString(item?.verses),
            summary: this.asString(item?.description || item?.type),
          }))
        : [],
      keyTerms,
      historicalContext: [
        this.asString(referenceData?.historicalContext?.summary || referenceData?.historicalContext?.description || ''),
        this.asString(referenceData?.culturalContext?.summary || referenceData?.culturalContext?.description || ''),
        this.asString(referenceData?.bookMetadata?.summary || referenceData?.bookMetadata?.description || ''),
        ...verseContextHistoricalNotes,
        ...historicalNotes,
        ...culturalNotes,
      ].filter(Boolean).join(' '),
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
      preachingFocus,
    };
  }

  private mergeStudyReportSections(baseSections: Record<string, any>, parsedSections: Record<string, any> | null | undefined): Record<string, any> {
    const merged: Record<string, any> = { ...(baseSections || {}) };
    if (!parsedSections || typeof parsedSections !== 'object') {
      return merged;
    }

    for (const [key, value] of Object.entries(parsedSections)) {
      if (value === null || value === undefined) continue;
      if (typeof value === 'string') {
        if (this.asString(value)) {
          merged[key] = value;
        }
        continue;
      }
      if (Array.isArray(value)) {
        if (value.some((item) => this.asString(item))) {
          merged[key] = value;
        }
        continue;
      }
      if (typeof value === 'object') {
        if (Object.keys(value).length > 0) {
          merged[key] = value;
        }
      }
    }

    return merged;
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
    const source = sections || {};
    return {
      ...source,
      status: 'unavailable',
      message: 'Study report could not be generated. Please retry.',
      passageOverview: this.asString(source.passageOverview || ''),
      literaryContext: this.asString(source.literaryContext || ''),
      historicalContext: this.asString(source.historicalContext || ''),
      canonicalContext: this.asString(source.canonicalContext || ''),
      exegeticalSummary: this.asString(source.exegeticalSummary || ''),
      mainTheologicalClaim: this.asString(source.mainTheologicalClaim || ''),
      preachingFocus: this.asString(source.preachingFocus || ''),
      exegeticalFlow: Array.isArray(source.exegeticalFlow) ? source.exegeticalFlow : [],
      structureOfPassage: Array.isArray(source.structureOfPassage) ? source.structureOfPassage : [],
      keyTerms: Array.isArray(source.keyTerms) ? source.keyTerms : [],
      theologicalThemes: Array.isArray(source.theologicalThemes) ? source.theologicalThemes : [],
      interpretiveChallenges: Array.isArray(source.interpretiveChallenges) ? source.interpretiveChallenges : [],
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
        await this.outlineRepository.update({ id: outline.id }, { structure: sanitizedStructure });
        outline.structure = sanitizedStructure;
        touched = true;
      }
    }

    return workspace;
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
    const fallbackFlow = this.asStudyListArray(source.exegeticalFlow || source.argumentFlow || source.flow || [], 8);
    const fallbackSummary = this.asString(source.exegeticalSummary || source.summaryStatement || '');
    const fallbackPreachingFocus = this.asString(source.preachingFocus || source.sermonFocus || source.homileticFocus || source.mainTheologicalClaim || source.mainClaim || '');

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
      preachingFocus: fallbackPreachingFocus || fallbackClaim,
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

    if (applications.length) {
      await this.applicationRepository.delete({ workspaceId });
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
      await this.questionRepository.delete({ workspaceId });
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
      await this.illustrationRepository.delete({ workspaceId });
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
    const outlineCount = 1;

    if (Array.isArray(workspace.outlines) && workspace.outlines.length) {
      const outlineHistoryBase = Array.isArray((workspace.metadata as any)?.outlineHistory)
        ? ((workspace.metadata as any)?.outlineHistory as any[]).length
        : 0;
      workspace.outlines.forEach((outline, index) => {
        this.appendWorkspaceHistory(
          workspace,
          'outlineHistory',
          this.snapshotOutlineForHistory(outline, `Version ${outlineHistoryBase + index + 1}`),
        );
      });
      await this.workspaceRepository.save(workspace);
    }

    // Delete existing outlines before regenerating
    await this.outlineRepository.delete({ workspaceId });

    const guardrailProfile = this.buildGuardrailProfile(workspace);
    if (guardrailProfile.active) {
      const seedPoints = this.buildPropheticGuardrailOutlineSeeds(workspace);
      const introduction =
        workspace.language === 'es'
          ? `Este pasaje llama a la iglesia a escuchar el evangelio eterno, adorar al Creador y responder con fidelidad a Cristo.`
          : `This passage calls the church to hear the everlasting gospel, worship the Creator, and respond with faithful trust in Christ.`;
      const conclusion =
        workspace.language === 'es'
          ? `La respuesta pastoral a este mensaje es confiar en Jesús, adorar a Dios con reverencia y vivir con esperanza fiel.`
          : `The pastoral response to this message is to trust Jesus, worship God with reverence, and live with faithful hope.`;
      const callToAction =
        workspace.language === 'es'
          ? `Confía en Cristo, adora al Creador y camina con perseverancia como testigo fiel del evangelio eterno.`
          : `Trust Christ, worship the Creator, and walk with endurance as a faithful witness to the everlasting gospel.`;
      const outlineData = this.sanitizePropheticOutlineReferences(
        this.sanitizeOutputForLens(
          this.normalizeOutlineData({
            introduction,
            points: seedPoints,
            pointNodes: this.normalizeGeneratedPointNodes([], seedPoints).map((node, index) => ({
              ...node,
              slideTitle: node.slideTitle || this.asString(seedPoints[index]).split(/\s+/).slice(0, 4).join(' '),
              summary: node.summary || this.asString(seedPoints[index]),
              supportingVerses: node.supportingVerses.length ? node.supportingVerses : [workspace.mainPassage],
              crossReferences: node.crossReferences.length ? node.crossReferences : [workspace.mainPassage],
            })),
            conclusion,
            callToAction,
          }),
          workspace,
        ),
        workspace,
      );
      this.validateGenerationResult('outline', outlineData);
      const insertResult = await this.outlineRepository.insert({
        workspaceId,
        title: 'Outline Option 1',
        structure: outlineData,
        isSelected: true,
      });
      const outlineId = insertResult.identifiers?.[0]?.id;
      const savedOutline = outlineId
        ? await this.outlineRepository.findOne({ where: { id: outlineId } })
        : null;
      if (!savedOutline) {
        throw new BadRequestException('Outline creation succeeded but the saved outline could not be reloaded.');
      }
      workspace.metadata = {
        ...(workspace.metadata || {}),
        activeOutlineId: savedOutline.id,
      };
      await this.workspaceRepository.update(workspace.id, {
        metadata: workspace.metadata,
      });
      return [savedOutline];
    }

    const outlines = [];

    const studyReport = workspace.studyReports?.[0];
    const studyContext = this.buildOutlineStudyContext(studyReport, workspace);
    const reportText = studyReport?.sections ? JSON.stringify(studyContext, null, 2) : '';
    const pointsPrompt = promptOverride || this.buildOutlinePointsPrompt(workspace, outlineCount, reportText);
    const pointsResponse = await this.llmService.generateCompletion(pointsPrompt, userId, {
      temperature: 0.6,
      maxTokens: 700,
    });
    this.logLlmOutput('outline:points', pointsResponse);

    let pointsVariations = this.parseOutlinePointsResponse(pointsResponse, count);
    const fallbackPoints = this.parseListFromResponse(pointsResponse).slice(0, 5);
    const guardrailActive = this.buildGuardrailProfile(workspace).active;
    if (!pointsVariations.length) {
      const seedPoints =
        fallbackPoints.length > 0
          ? fallbackPoints
          : guardrailActive
            ? this.buildPropheticGuardrailOutlineSeeds(workspace)
            : [
                this.asString(workspace.theme || workspace.sermonCore?.bigIdea || workspace.mainPassage || 'Passage focus'),
                'Biblical tension',
                'Gospel restoration',
                'Call to response',
              ].filter(Boolean);
      pointsVariations = [
        {
          angle: 'Passage-centered outline',
          style: 'expository',
          theologicalEmphasis: this.asString(workspace.sermonCore?.centralTruth || workspace.theme || ''),
          audienceFocus: this.asString(workspace.audienceProfile || 'general congregation'),
          sermonStructure: this.asString(workspace.storyArc || ''),
          points: seedPoints,
        },
      ];
    }
    pointsVariations = pointsVariations
      .map((variation, index) => {
        const cleanPoints = this.asStringArray(variation?.points, 10).map((item) => this.cleanCoachText(item)).filter(Boolean);
        const recoveredPoints = guardrailActive
          ? this.buildPropheticGuardrailOutlineSeeds(workspace)
          : cleanPoints.length >= 3
            ? cleanPoints
            : fallbackPoints.length >= 3
              ? fallbackPoints
              : [
                  this.asString(workspace.theme || workspace.sermonCore?.bigIdea || workspace.mainPassage || 'Passage focus'),
                  'Biblical tension',
                  'Gospel restoration',
                  'Call to response',
                ].filter(Boolean);
        return {
          angle: this.cleanCoachText(variation?.angle || `Passage-centered outline ${index + 1}`),
          style: this.cleanCoachText(variation?.style || 'expository'),
          theologicalEmphasis: this.cleanCoachText(variation?.theologicalEmphasis || workspace.theme || workspace.sermonCore?.centralTruth || ''),
          audienceFocus: this.cleanCoachText(variation?.audienceFocus || workspace.audienceProfile || ''),
          sermonStructure: this.cleanCoachText(variation?.sermonStructure || workspace.storyArc || ''),
          points: recoveredPoints,
        };
      })
      .filter((variation) => Array.isArray(variation.points) && variation.points.length >= 3);
    if (!pointsVariations.length) {
      pointsVariations = [
        {
          angle: 'Passage-centered outline',
          style: 'expository',
          theologicalEmphasis: this.asString(workspace.sermonCore?.centralTruth || workspace.theme || ''),
          audienceFocus: this.asString(workspace.audienceProfile || 'general congregation'),
          sermonStructure: this.asString(workspace.storyArc || ''),
          points: guardrailActive ? this.buildPropheticGuardrailOutlineSeeds(workspace) : fallbackPoints.length >= 3
            ? fallbackPoints
            : [
                this.asString(workspace.theme || workspace.sermonCore?.bigIdea || workspace.mainPassage || 'Passage focus'),
                'Biblical tension',
                'Gospel restoration',
              ].filter(Boolean),
        },
      ];
    }
    this.validateGenerationResult('outline-points', pointsVariations);
    const generatedPointSignatures = new Set<string>();

    for (let i = 0; i < outlineCount; i++) {
      const variationData = pointsVariations[i];
      const points = variationData?.points?.length ? variationData.points : fallbackPoints;
      const variation = variationData?.angle
        ? `Angle: ${variationData.angle}. Style: ${variationData.style || 'N/A'}. Theological Emphasis: ${variationData.theologicalEmphasis || 'N/A'}. Audience Focus: ${variationData.audienceFocus || 'N/A'}. Structure: ${variationData.sermonStructure || 'N/A'}. Keep this outline distinct in tone and structure.`
        : `Outline variation ${i + 1} with a distinct angle and tone.`;
      const prompt = this.buildOutlineFromPointsPrompt(workspace, points, variation, reportText);
      let response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.9,
        maxTokens: 1200,
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
          maxTokens: 1200,
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
      outlineData = await this.ensureOutlinePointNodes(workspace, userId, outlineData, reportText);
      outlineData = this.attachStudyAssetsToOutline(outlineData, studyReport?.sections?.studyAssets);
      outlineData = this.sanitizeOutputForLens(outlineData, workspace);
      outlineData = this.sanitizePropheticOutlineReferences(outlineData || {}, workspace);
      const outlineSeedPoints = Array.isArray(points) ? points.map((item) => this.asString(item)).filter(Boolean) : [];
      if (!Array.isArray(outlineData?.points) || outlineData.points.length < 3) {
        outlineData.points = outlineSeedPoints.length >= 3
          ? outlineSeedPoints
          : [
              this.asString(workspace.theme || workspace.sermonCore?.bigIdea || workspace.mainPassage || 'Passage focus'),
              'Biblical tension',
              'Gospel response',
            ];
      }
      if (!Array.isArray(outlineData?.pointNodes) || outlineData.pointNodes.length < outlineData.points.length) {
        outlineData.pointNodes = this.normalizeGeneratedPointNodes(
          {
            pointNodes: Array.isArray(outlineData?.pointNodes) ? outlineData.pointNodes : [],
          },
          outlineData.points,
        );
      }
      this.validateGenerationResult('outline', outlineData);
      if (currentSignature) {
        generatedPointSignatures.add(currentSignature);
      }

      const insertResult = await this.outlineRepository.insert({
        workspaceId,
        title: `Outline Option ${i + 1}`,
        structure: outlineData,
        isSelected: i === 0,
      });
      const outlineId = insertResult.identifiers?.[0]?.id;
      const savedOutline = outlineId
        ? await this.outlineRepository.findOne({ where: { id: outlineId } })
        : null;
      if (!savedOutline) {
        throw new BadRequestException('Outline creation succeeded but the saved outline could not be reloaded.');
      }
      outlines.push(savedOutline);
    }

    const activeOutlineId = outlines.find((outline) => outline?.isSelected)?.id || outlines[0]?.id || null;
    if (activeOutlineId) {
      workspace.metadata = {
        ...(workspace.metadata || {}),
        activeOutlineId,
      };
      await this.workspaceRepository.update(workspace.id, {
        metadata: workspace.metadata,
      });
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

    if (Array.isArray(workspace.manuscripts) && workspace.manuscripts.length) {
      const manuscriptHistoryBase = Array.isArray((workspace.metadata as any)?.manuscriptHistory)
        ? ((workspace.metadata as any)?.manuscriptHistory as any[]).length
        : 0;
      workspace.manuscripts.forEach((manuscript, index) => {
        this.appendWorkspaceHistory(
          workspace,
          'manuscriptHistory',
          this.snapshotManuscriptForHistory(manuscript, `Version ${manuscriptHistoryBase + index + 1}`),
        );
      });
      await this.workspaceRepository.save(workspace);
    }

    const outlineFromWorkspace = Array.isArray(workspace.outlines)
      ? (workspace.outlines as any[]).find((item: any) => item?.id === outlineId || item?.isSelected) || workspace.outlines[0]
      : null;
    const outline = outlineId ? await this.outlineRepository.findOne({ where: { id: outlineId } }) : null;
    const selectedOutline = outline || outlineFromWorkspace;
    if (!selectedOutline) {
      throw new Error('Outline not found');
    }
    // Keep only the newest manuscript draft per workspace.
    await this.manuscriptRepository.delete({ workspaceId });
    const normalizedOptions = this.normalizeManuscriptOptions(workspace, manuscriptOptions);
    const prompt = promptOverride || this.buildManuscriptPrompt(workspace, selectedOutline, normalizedOptions);
    // Manuscripts need much higher token limits - calculate based on target minutes
    // For comprehensive manuscripts with HTML overhead, keep a generous token buffer for long-form outputs.
    // Add 50% buffer for rich content with illustrations, word studies, cross-references
    const targetTokens = Math.max(4500, Math.ceil((normalizedOptions.targetMinutes || 22) * 200));
    const manuscriptTimeoutMs = 60000;
    const useGuardrailFallback = this.buildGuardrailProfile(workspace).active;
    let parsedManuscript: { text: string; cues: ManuscriptCues };
    let usedFallback = useGuardrailFallback;
    if (useGuardrailFallback) {
      console.warn('[manuscript] guardrail fallback activated for prophetic passage');
      parsedManuscript = this.buildManuscriptGuardrailFallback(workspace, selectedOutline, normalizedOptions);
    } else {
      try {
        const manuscriptResponse = await this.llmService.generateCompletion(prompt, userId, {
          maxTokens: targetTokens,
          temperature: 0.65, // Slightly lower for more coherent long-form content
          timeoutMs: manuscriptTimeoutMs,
        });
        this.logLlmOutput('manuscript', manuscriptResponse);
        parsedManuscript = this.normalizeManuscriptForWorkspace(
          workspace,
          this.parseGeneratedManuscriptResponse(manuscriptResponse, normalizedOptions),
        );
      } catch (error) {
        usedFallback = true;
        console.warn(
          `[manuscript] fallback activated: ${(error as Error)?.message || 'unknown error'}`,
        );
        parsedManuscript = this.buildManuscriptGuardrailFallback(workspace, selectedOutline, normalizedOptions);
      }
    }

    if (
      !usedFallback &&
      workspace.language === 'es' &&
      this.hasEnglishLeakInSpanishManuscript(parsedManuscript.text, parsedManuscript.cues)
    ) {
      const rewritePrompt = this.buildSpanishManuscriptRewritePrompt(parsedManuscript.text, parsedManuscript.cues);
      const rewrittenResponse = await this.llmService.generateCompletion(rewritePrompt, userId, {
        maxTokens: targetTokens,
        temperature: 0.2,
        timeoutMs: manuscriptTimeoutMs,
      });
      this.logLlmOutput('manuscript:spanish-rewrite', rewrittenResponse);
      parsedManuscript = this.normalizeManuscriptForWorkspace(
        workspace,
        this.parseGeneratedManuscriptResponse(rewrittenResponse, normalizedOptions),
      );
    }

    if (!this.hasUsableManuscriptText(parsedManuscript.text)) {
      if (!usedFallback) {
        throw new BadRequestException('Unable to generate a usable manuscript draft. Please regenerate.');
      }
      parsedManuscript = this.buildManuscriptGuardrailFallback(workspace, selectedOutline, normalizedOptions);
    }

    let quality = this.assessManuscriptQuality(parsedManuscript.text, normalizedOptions);
    let repairAttemptsExecuted = 0;
    while (!usedFallback && quality.needsRepair && repairAttemptsExecuted < 2) {
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
        timeoutMs: manuscriptTimeoutMs,
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
          timeoutMs: manuscriptTimeoutMs,
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
    const cueAnchors = this.buildCueAnchorsFromManuscriptHtml(parsedManuscript.text, parsedManuscript.cues);

    if ((normalizedOptions.includeSlideCues || normalizedOptions.includeKeyLines) && cueCount < 2) {
      try {
        const refreshPrompt = this.buildManuscriptCueRefreshPrompt(workspace, parsedManuscript.text);
        const refreshResponse = await this.llmService.generateCompletion(refreshPrompt, userId, {
          temperature: 0.2,
          maxTokens: 1400,
          timeoutMs: manuscriptTimeoutMs,
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
          cueAnchors,
          cueAnchorUpdatedAt: new Date().toISOString(),
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

    const insertResult = await this.manuscriptRepository.insert(manuscript);
    const saved = insertResult.identifiers?.[0]?.id
      ? await this.manuscriptRepository.findOne({ where: { id: insertResult.identifiers[0].id } })
      : null;
    if (!saved) {
      throw new BadRequestException('Manuscript generation succeeded but the saved manuscript could not be reloaded.');
    }
    workspace.metadata = {
      ...(workspace.metadata || {}),
      activeOutlineId: outlineId,
      activeManuscriptId: saved.id,
    };
    await this.workspaceRepository.update(workspace.id, {
      metadata: workspace.metadata,
    });

    return saved;
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
    if (!Array.isArray(workspace?.studyReports) || workspace.studyReports.length === 0) {
      throw new BadRequestException(
        'Generate the Study Report first before creating applications.',
      );
    }
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
    if (!Array.isArray(workspace?.studyReports) || workspace.studyReports.length === 0) {
      throw new BadRequestException(
        'Generate the Study Report first before creating discussion questions.',
      );
    }
    await this.questionRepository.delete({ workspaceId });
    const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
    const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
    const seededQuestions = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.discussionQuestions, 4)))).slice(0, 12);
    const prompt = promptOverride || this.buildDiscussionPrompt(workspace, seededQuestions);
    const response = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('questions', response);
    const parsed = this.parseJsonSafe(response);
    const parsedQuestions = Array.from(
      new Set([
        ...this.parseListFromResponse(response),
        ...(Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.discussionQuestions)
            ? parsed.discussionQuestions
            : Array.isArray(parsed?.questions)
            ? parsed.questions
              : []),
        ...seededQuestions,
      ].map((item) => this.asString(item).trim()).filter(Boolean)),
    ).slice(0, 12);
    const fallbackQuestions = this.buildDiscussionQuestionFallbacks(workspace, seededQuestions);
    const questionTexts = parsedQuestions.filter((item) => item.split(/\s+/).filter(Boolean).length >= 5);
    const finalQuestionTexts = questionTexts.length >= 6 ? questionTexts : fallbackQuestions;

    const questions = [];
    for (let i = 0; i < finalQuestionTexts.length; i++) {
      const question = this.questionRepository.create({
        workspaceId,
        question: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(finalQuestionTexts[i]) : finalQuestionTexts[i],
        orderIndex: i,
      });

      questions.push(await this.questionRepository.save(question));
    }

    const latestReport = workspace.studyReports?.[0] || null;
    if (latestReport) {
      const latestSections = latestReport.sections || {};
      const latestStudyAssets = latestSections.studyAssets || {};
      const latestCategoryAssets = latestStudyAssets.categoryAssets || {};
      latestReport.sections = {
        ...latestSections,
        studyAssets: {
          ...latestStudyAssets,
          categoryAssets: {
            ...latestCategoryAssets,
            discussionQuestions: finalQuestionTexts,
          },
          discussionQuestions: finalQuestionTexts,
        },
      };
      await this.studyReportRepository.save(latestReport);
    }

    return questions;
  }

  async generateIllustrations(
    workspaceId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<SermonIllustration[]> {
    const workspace = await this.findOne(workspaceId, userId);
    if (!Array.isArray(workspace?.studyReports) || workspace.studyReports.length === 0) {
      throw new BadRequestException(
        'Generate the Study Report first before creating illustration ideas.',
      );
    }
    await this.illustrationRepository.delete({ workspaceId });
    const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
    const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
    const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
    const seededIllustrations = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.illustrationIdeas, 4)))).slice(0, 12);
    const prompt =
      promptOverride || this.buildIllustrationsPrompt(workspace, mainPoints, seededIllustrations);
    const response = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('illustrations', response);

    const parsed = this.parseJsonSafe(response);
    const fallbackItems = this.parseIllustrationsFromResponse(response);
    const items = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === 'object'
        ? (
            (Array.isArray((parsed as any).illustrations) && (parsed as any).illustrations) ||
            (Array.isArray((parsed as any).items) && (parsed as any).items) ||
            (Array.isArray((parsed as any).data) && (parsed as any).data) ||
            fallbackItems
          )
        : fallbackItems;
    const illustrations = [];
    const decodeLooseField = (source: string, key: string): string => {
      const value = this.asString(source);
      if (!value) return '';
      const pattern = new RegExp(
        `["'\`]?${key}["'\`]?\\s*[:=]\\s*["“]?([\\s\\S]*?)["”]?(?=\\n\\s*["'\`]?(?:title|content|description|text|verseReference|source|tags)["'\`]?\\s*[:=]|\\n{2,}|$)`,
        'i',
      );
      const match = value.match(pattern);
      return this.asString(match?.[1] || '').trim();
    };
    const cleanIllustrationText = (value: any): string =>
      this.asString(value)
        .replace(/\r/g, '')
        .replace(/^\s*["'`]?((title|content|description|text))["'`]?\s*[:=]\s*["'`]?/i, '')
        .replace(/\n+\s*["'`]?(verseReference|source|tags)["'`]?\s*[:=][\s\S]*$/i, '')
        .replace(/\s*["'`]?(verseReference|source|tags)["'`]?\s*[:=][\s\S]*$/i, '')
        .replace(/^[`"'“”]+|[`"',“”\]]+$/g, '')
        .trim();

    for (const item of items) {
      const rawItem = typeof item === 'string' ? this.asString(item) : this.asString(JSON.stringify(item));
      const title = this.asString(item?.title || decodeLooseField(rawItem, 'title'));
      const looseContent = decodeLooseField(rawItem, 'content') || decodeLooseField(rawItem, 'description');
      let content = cleanIllustrationText(item?.content || item?.text || item?.description || looseContent || rawItem);
      let source = this.asString(
        item?.source ||
        item?.verseReference ||
        item?.verseReferences?.[0] ||
        decodeLooseField(rawItem, 'verseReference') ||
        decodeLooseField(rawItem, 'source'),
      );
      let tags = Array.isArray(item?.tags)
        ? item.tags.map((tag: any) => this.asString(tag)).filter(Boolean).slice(0, 8)
        : [];
      if (!tags.length) {
        const tagsRaw = decodeLooseField(rawItem, 'tags');
        if (tagsRaw) {
          tags = tagsRaw
            .replace(/^\[|\]$/g, '')
            .split(/[,\|]/)
            .map((tag) => this.asString(tag).replace(/^["'`]+|["'`]+$/g, ''))
            .filter(Boolean)
            .slice(0, 8);
        }
      }
      if (!source) {
        const verseMatch = content.match(/\b(?:[1-3]\s*)?[A-Za-zÁÉÍÓÚáéíóúñÑ]+\s+\d+:\d+(?:-\d+)?\b/);
        if (verseMatch?.[0]) {
          source = verseMatch[0];
          content = cleanIllustrationText(content.replace(verseMatch[0], ''));
        }
      }
      if (!content) continue;
      const illustration = this.illustrationRepository.create({
        workspaceId,
        title: title || null,
        content: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(content) : content,
        source: source || null,
        relatedPoint: item.relatedPoint || null,
        tags: tags.length ? tags : null,
      });
      illustrations.push(await this.illustrationRepository.save(illustration));
    }

    if (!illustrations.length) {
      const fallbackIllustrations = this.buildIllustrationFallbackItems(workspace, mainPoints, seededIllustrations);
      for (const item of fallbackIllustrations) {
        const illustration = this.illustrationRepository.create({
          workspaceId,
          title: item.title || null,
          content: workspace.language === 'es' ? this.normalizeSpanishGeneratedText(item.content) : item.content,
          source: item.source || null,
          relatedPoint: item.relatedPoint || null,
          tags: Array.isArray(item.tags) && item.tags.length ? item.tags : null,
        });
        illustrations.push(await this.illustrationRepository.save(illustration));
      }
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
    let response = '';
    try {
      response = await this.llmService.generateCompletion(prompt, userId);
      this.logLlmOutput('citations', response);
    } catch (error) {
      console.warn('Citations generation failed, using fallback citations.', error);
    }

    const parsed = this.parseJsonSafe(response) || this.parseCitationsFromResponse(response);
    const items = Array.isArray(parsed) && parsed.length ? parsed : this.buildCitationFallbackItems(workspace);
    const citations = [];

    for (const item of items) {
      const verseReferences = this.buildGuardrailProfile(workspace).active
        ? this.sanitizeGuardrailedReferenceList(item.verseReferences, workspace)
        : Array.isArray(item.verseReferences)
          ? item.verseReferences
          : null;
      const citation = this.citationRepository.create({
        workspaceId,
        statementType: this.normalizeStatementType(item.statementType),
        statement:
          workspace.language === 'es'
            ? this.normalizeSpanishGeneratedText(item.statement || item.text || '')
            : item.statement || item.text || '',
        verseReferences,
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
    const baseSections = this.buildStudyReportBaseSections(studyInputs, workspace.language || 'en');
    let normalizedSections = this.normalizeStudyReportSections(
      this.mergeStudyReportSections(baseSections, parsed && typeof parsed === 'object' ? parsed : null),
    );
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
        normalizedSections = this.normalizeStudyReportSections(
          this.mergeStudyReportSections(baseSections, repairedParsed && typeof repairedParsed === 'object' ? repairedParsed : null),
        );
        completeness = this.assessStudyReportCompleteness(normalizedSections);
      } catch (error) {
        console.warn(`[study-report:repair] fallback activated: ${(error as Error)?.message || 'unknown error'}`);
      }
    }

    if (completeness.isSparse) {
      normalizedSections = this.buildStudyReportFallbackSections(workspace);
    }
    const studyReportValidation = this.generatedStudyOutputValidator.validate('study-report', normalizedSections, {
      reference: workspace.mainPassage,
      language: workspace.language,
    });
    if (!studyReportValidation.valid) {
      normalizedSections = this.buildStudyReportFallbackSections(workspace);
    }
    this.validateGenerationResult('study-report', normalizedSections);

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
    if (this.isSpanishLanguage(workspace.language)) {
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
    const useGuardrailFallback = this.buildGuardrailProfile(workspace).active;
    const planningSummary = this.buildWorkspacePlanningSummary(workspace);

    const prompt = WorkspacesPrompts.sermonCore({
      doctrinalContext,
      guardrailBlock: useGuardrailFallback ? this.buildGuardrailPromptBlock(workspace) : undefined,
      planningBlock: planningSummary ? `Planning: ${planningSummary}` : undefined,
      mainPassage: workspace.mainPassage,
      theme: workspace.theme || 'N/A',
      sermonGoals: workspace.sermonGoals || 'N/A',
      audienceProfile: workspace.audienceProfile || 'N/A',
      mainTheologicalClaim: studyReport.mainTheologicalClaim || 'N/A',
      theologicalThemesJson: JSON.stringify(studyReport.theologicalThemes || []),
      pastoralImplicationsJson: JSON.stringify(studyReport.pastoralImplications || {}),
      exegeticalSummary: studyReport.exegeticalSummary || 'N/A',
      languageLabel,
    });

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
    let normalizedSermonCore =
      workspace.language === 'es' ? this.normalizeSpanishValueDeep(sermonCore) : sermonCore;
    try {
      this.validateGenerationResult('sermon-core', normalizedSermonCore);
    } catch (error) {
      console.warn(`[sermon-core] fallback activated: ${(error as Error)?.message || 'unknown error'}`);
      normalizedSermonCore = this.buildSermonCoreFallback(workspace, studyReport);
      normalizedSermonCore =
        workspace.language === 'es' ? this.normalizeSpanishValueDeep(normalizedSermonCore) : normalizedSermonCore;
      this.validateGenerationResult('sermon-core', normalizedSermonCore);
    }

    // Save to workspace
    await this.workspaceRepository.update(workspaceId, {
      sermonCore: normalizedSermonCore as any,
    });

    return normalizedSermonCore;
  }

  async runIntegrityCheck(
    workspaceId: string,
    userId: string,
  ): Promise<{
    overallScore: number;
    balanced: boolean;
    issues: Array<{
      severity: 'critical' | 'warning' | 'info';
      category: 'textual_support' | 'relevance' | 'balance' | 'citation' | 'application';
      message: string;
      affectedItem?: string;
    }>;
    strengths: string[];
    recommendations: string[];
    pointAnalysis: Array<{ point: string; textSupported: boolean; supportingVerses: string[]; supportScore: number; issues: string[] }>;
    applicationAnalysis: Array<{ application: string; tiedToPassage: boolean; relevanceScore: number; issues: string[] }>;
    citationAnalysis: Array<{ statement: string; verseReference: string; verified: boolean; supportLevel: 'supported' | 'weak' | 'not_supported'; issues: string[] }>;
  }> {
    const workspace = await this.findOne(workspaceId, userId);
    const selectedOutline = workspace.outlines?.find((o: any) => o.isSelected) || workspace.outlines?.[0];
    const outlinePoints = selectedOutline?.structure?.points || [];
    const applications = (workspace.applications || []).map((a: any) => a.content);
    const citations = (workspace.citations || []).map((c: any) => ({
      statement: c.statement,
      verseReferences: c.verseReferences || [],
    }));

    const report = await this.sermonIntegrityService.analyzeSermonIntegrity({
      mainPassage: workspace.mainPassage,
      outlinePoints,
      applications,
      citations,
      language: workspace.language || 'en',
    });

    this.validateGenerationResult('integrity-check', report);

    const updatedAt = new Date().toISOString();
    const integrityIssueLedger = report.issues.map((issue, index) => ({
      id: this.buildIntegrityIssueId(issue, index),
      severity: issue.severity,
      category: issue.category,
      message: issue.message,
      affectedItem: issue.affectedItem,
      status: 'open' as const,
      updatedAt,
    }));

    workspace.metadata = {
      ...(workspace.metadata || {}),
      integrityReport: {
        ...report,
        updatedAt,
      },
      integrityIssueLedger,
    };
    await this.workspaceRepository.save(workspace);

    return report;
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
    let rawResponse = '';
    try {
      const response = await this.llmService.generateCompletion(prompt, userId, {
        temperature: 0.3,
        maxTokens: 1700,
        timeoutMs: 40000,
        localMaxAttempts: 1,
      });
      this.logLlmOutput('media-suggestions', response);
      rawResponse = response;
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
      mediaSuggestionCards = this.extractMediaSuggestionCardsFromLooseResponse(rawResponse, 24);
    }
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

    const selectedOutline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0] || null;
    const selectedManuscript = workspace.manuscripts?.[0] || null;
    const mediaPackGeneratedAt = new Date().toISOString();
    const mediaPack = {
      status: 'ready' as const,
      generatedAt: mediaPackGeneratedAt,
      sourceOutlineId: selectedOutline?.id || null,
      sourceManuscriptId: selectedManuscript?.id || null,
      sourceStudyReportId: latestReport?.id || null,
      slideCount: Array.isArray(mediaSuggestionCards) ? mediaSuggestionCards.length : 0,
      audioEnabled: mediaSuggestionCards.length > 0,
      musicEnabled: mediaSuggestionCards.length > 0,
      videoEnabled: mediaSuggestionCards.length > 0,
      exportPrepared: true,
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

    const nextMetadata = {
      ...(workspace.metadata || {}),
      mediaPack,
      exportPack: {
        status: 'ready',
        generatedAt: mediaPack.generatedAt,
        sourceOutlineId: mediaPack.sourceOutlineId,
        sourceManuscriptId: mediaPack.sourceManuscriptId,
        sourceStudyReportId: mediaPack.sourceStudyReportId,
        artifacts: [
          {
            type: 'pptx',
            label: 'Slide deck (PPTX)',
            status: 'ready',
            filename: `sermon-deck-${workspaceId}.pptx`,
            sourceOutlineId: mediaPack.sourceOutlineId,
            sourceManuscriptId: mediaPack.sourceManuscriptId,
            sourceStudyReportId: mediaPack.sourceStudyReportId,
          },
          {
            type: 'pdf',
            label: 'Slide deck (PDF)',
            status: 'ready',
            filename: `sermon-deck-${workspaceId}.pdf`,
            sourceOutlineId: mediaPack.sourceOutlineId,
            sourceManuscriptId: mediaPack.sourceManuscriptId,
            sourceStudyReportId: mediaPack.sourceStudyReportId,
          },
          {
            type: 'docx',
            label: 'Manuscript (DOCX)',
            status: 'ready',
            filename: `sermon-manuscript-${workspaceId}.docx`,
            sourceOutlineId: mediaPack.sourceOutlineId,
            sourceManuscriptId: mediaPack.sourceManuscriptId,
            sourceStudyReportId: mediaPack.sourceStudyReportId,
          },
          {
            type: 'study-report',
            label: 'Study report export',
            status: 'ready',
            filename: `study-report-${workspaceId}.md`,
            sourceOutlineId: mediaPack.sourceOutlineId,
            sourceManuscriptId: mediaPack.sourceManuscriptId,
            sourceStudyReportId: mediaPack.sourceStudyReportId,
          },
        ],
      },
      deliverables: {
        ...((workspace.metadata as Record<string, any>)?.deliverables || {}),
        mediaPack,
        export: {
          status: 'ready',
          sourceOutlineId: mediaPack.sourceOutlineId,
          sourceManuscriptId: mediaPack.sourceManuscriptId,
          sourceStudyReportId: mediaPack.sourceStudyReportId,
          generatedAt: mediaPack.generatedAt,
        },
      },
    };
    workspace.metadata = nextMetadata;
    await this.workspaceRepository.update(workspaceId, { metadata: nextMetadata as any });

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

  private isRecord(value: unknown): value is Record<string, any> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  private stripScriptureTranslationSuffix(reference: string): string {
    const cleaned = this.asString(reference || '').trim().replace(/\u2013|\u2014/g, '-');
    if (!cleaned) return cleaned;
    const colonMatch = cleaned.match(/^(.*):([A-Z][A-Z0-9]{1,7})$/);
    if (colonMatch) {
      const possibleTranslation = colonMatch[2].toUpperCase();
      const knownTranslations = new Set([
        'KJV', 'WEB', 'ESV', 'NIV', 'NASB', 'NKJV', 'ASV', 'NRSV', 'CSB', 'NLT', 'RVR1960', 'RVR', 'LBLA', 'DHH', 'TLA', 'NTV',
      ]);
      if (knownTranslations.has(possibleTranslation)) {
        return colonMatch[1].trim();
      }
    }
    const match = cleaned.match(/^(.*)\s+([A-Z][A-Z0-9]{1,7})$/);
    if (!match) return cleaned;
    const possibleTranslation = match[2].toUpperCase();
    const knownTranslations = new Set([
      'KJV', 'WEB', 'ESV', 'NIV', 'NASB', 'NKJV', 'ASV', 'NRSV', 'CSB', 'NLT', 'RVR1960', 'RVR', 'LBLA', 'DHH', 'TLA', 'NTV',
    ]);
    return knownTranslations.has(possibleTranslation) ? match[1].trim() : cleaned;
  }

  private extractScriptureVerses(result: unknown): Array<{ reference?: string; text?: string }> {
    if (!this.isRecord(result)) return [];
    const dataResult = this.isRecord(result.data) ? result.data : null;
    const passageResult = this.isRecord(result.passage) ? result.passage : null;
    const payloadResult = this.isRecord(result.payload) ? result.payload : null;

    const candidates = [result.verses, dataResult?.verses, passageResult?.verses, payloadResult?.verses];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate as Array<{ reference?: string; text?: string }>;
      }
      if (candidate && typeof candidate === 'object') {
        const values = Object.values(candidate as Record<string, unknown>);
        if (values.length && values.every((item) => this.isRecord(item))) {
          return values as Array<{ reference?: string; text?: string }>;
        }
      }
    }

    const textCandidate =
      this.asString(result.text || '') ||
      this.asString(result.content || '') ||
      this.asString(dataResult?.text || '') ||
      this.asString(dataResult?.content || '') ||
      this.asString(passageResult?.text || '') ||
      '';

    if (textCandidate.trim()) {
      return [
        {
          reference: this.asString(result.reference || dataResult?.reference || passageResult?.reference || ''),
          text: textCandidate.trim(),
        },
      ];
    }

    return [];
  }

  private normalizeScriptureVerseReference(reference: string, requestedReference: string, verseIndex: number): string {
    const cleanedReference = this.stripScriptureTranslationSuffix(reference);
    const parsed = parseScriptureReference(this.stripScriptureTranslationSuffix(requestedReference));
    const verseNumber = extractVerseNumber(cleanedReference) ?? (parsed?.verseStart !== undefined ? parsed.verseStart + verseIndex : null);
    if (parsed && Number.isFinite(verseNumber as number)) {
      return `${parsed.book} ${parsed.chapter}:${verseNumber}`;
    }
    return cleanedReference || this.stripScriptureTranslationSuffix(requestedReference);
  }

  private async normalizeScriptureCachePayload(
    cacheData: Record<string, any> | null | undefined,
    context: { mainPassage?: string; language?: string } = {},
  ): Promise<Record<string, any> | null> {
    if (!this.isRecord(cacheData)) {
      return null;
    }

    const normalizedCache: Record<string, any> = { ...cacheData };
    const defaultTranslation = String(normalizedCache.scriptureTranslation || '').trim().toUpperCase()
      || (String(context.language || '').toLowerCase().startsWith('es') ? 'RVR1960' : 'KJV');
    const requestedReference = this.stripScriptureTranslationSuffix(
      this.asString(
        normalizedCache.scriptureLastLookup ||
        normalizedCache.scriptureQuery ||
        normalizedCache.reference ||
        context.mainPassage ||
        '',
      ),
    );
    const scriptureReference = requestedReference || this.stripScriptureTranslationSuffix(this.asString(normalizedCache.scriptureQuery || context.mainPassage || ''));
    const normalizeResult = async (candidate: unknown, reference: string, translation: string) => {
      const verses = this.extractScriptureVerses(candidate)
        .map((verse, index) => ({
          reference: this.normalizeScriptureVerseReference(this.asString(verse.reference || ''), reference, index),
          text: cleanVerseText(this.asString(verse.text || '')),
        }))
        .filter((verse) => verse.reference && verse.text);

      if (reference && verses.length > 0) {
        const integrity = validateVerseIntegrity(reference, verses);
        if (integrity.valid) {
          return {
            ...(this.isRecord(candidate) ? candidate : {}),
            reference,
            translation,
            verses,
          };
        }
      }

      if (reference) {
        try {
          const refreshed = await this.scriptureService.getPassage(reference, translation);
          if (refreshed && Array.isArray(refreshed.verses) && refreshed.verses.length > 0) {
            const refreshedIntegrity = validateVerseIntegrity(reference, refreshed.verses);
            if (refreshedIntegrity.valid) {
              return refreshed;
            }
          }
        } catch {
          // Fall through to unavailable result.
        }
      }

      return null;
    };

    normalizedCache.scriptureLastLookup = scriptureReference || this.asString(normalizedCache.scriptureLastLookup || '');
    normalizedCache.scriptureQuery = this.stripScriptureTranslationSuffix(
      this.asString(normalizedCache.scriptureQuery || normalizedCache.scriptureLastLookup || scriptureReference || ''),
    ) || normalizedCache.scriptureLastLookup;
    normalizedCache.scriptureTranslation = defaultTranslation;
    normalizedCache.parallelTranslations = String(normalizedCache.parallelTranslations || defaultTranslation).trim().toUpperCase() || defaultTranslation;
    normalizedCache.scriptureResult = await normalizeResult(
      normalizedCache.scriptureResult,
      normalizedCache.scriptureLastLookup || scriptureReference,
      normalizedCache.scriptureTranslation,
    );

    const normalizeStudyCacheEntry = (moduleKey: string, value: any) => {
      if (!value) return null;
      const validation = this.generatedStudyOutputValidator.validate(moduleKey as any, value, {
        reference: scriptureReference || this.asString(context.mainPassage || ''),
        language: context.language || 'en',
      });
      return validation.valid ? value : null;
    };

    normalizedCache.passageSummary = normalizeStudyCacheEntry('passage-summary', normalizedCache.passageSummary);
    normalizedCache.studySynthesis = normalizeStudyCacheEntry('study-synthesis', normalizedCache.studySynthesis);
    normalizedCache.structuralAnalysis = normalizeStudyCacheEntry('structural-analysis', normalizedCache.structuralAnalysis);
    normalizedCache.interpretiveChallenges = normalizeStudyCacheEntry('interpretive-challenges', normalizedCache.interpretiveChallenges);
    normalizedCache.translationComparison = normalizeStudyCacheEntry('translation-comparison', normalizedCache.translationComparison);
    normalizedCache.perVerseContext = normalizeStudyCacheEntry('verse-context', normalizedCache.perVerseContext);
    normalizedCache.verseCommentary = normalizeStudyCacheEntry('verse-commentary', normalizedCache.verseCommentary);
    normalizedCache.canonicalThemes = normalizeStudyCacheEntry('canonical-themes', normalizedCache.canonicalThemes);

    if (Array.isArray(normalizedCache.lookupHistory)) {
      const normalizedHistory: Record<string, any>[] = [];
      for (const entry of normalizedCache.lookupHistory.slice(0, 12)) {
        if (!this.isRecord(entry)) continue;
        const entryTranslation = String(entry.scriptureTranslation || normalizedCache.scriptureTranslation || defaultTranslation).trim().toUpperCase() || defaultTranslation;
        const entryReference = this.stripScriptureTranslationSuffix(
          this.asString(entry.scriptureLastLookup || entry.scriptureQuery || entry.reference || scriptureReference || ''),
        );
        const entryResult = await normalizeResult(entry.scriptureResult, entryReference, entryTranslation);
        normalizedHistory.push({
          ...entry,
          scriptureLastLookup: entryReference || this.asString(entry.scriptureLastLookup || ''),
          scriptureQuery: this.stripScriptureTranslationSuffix(this.asString(entry.scriptureQuery || entryReference || '')),
          scriptureTranslation: entryTranslation,
          scriptureResult: entryResult,
        });
      }
      normalizedCache.lookupHistory = normalizedHistory.filter((entry) => entry.scriptureLastLookup && entry.scriptureResult);
    }

    return normalizedCache;
  }

  async updateScriptureCache(id: string, userId: string, cacheData: any): Promise<SermonWorkspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id, userId },
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    workspace.scriptureCache = await this.normalizeScriptureCachePayload({
      ...(workspace.scriptureCache || {}),
      ...(cacheData || {}),
      cachedAt: new Date(),
    }, { mainPassage: workspace.mainPassage, language: workspace.language });

    return this.workspaceRepository.save(workspace);
  }

  async getScriptureCache(id: string, userId: string): Promise<any> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id, userId },
      select: ['id', 'mainPassage', 'language', 'scriptureCache'],
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const normalized = await this.normalizeScriptureCachePayload(workspace.scriptureCache as Record<string, any> | null, {
      mainPassage: workspace.mainPassage,
      language: workspace.language,
    });
    if (normalized && JSON.stringify(normalized) !== JSON.stringify(workspace.scriptureCache || null)) {
      workspace.scriptureCache = normalized;
      await this.workspaceRepository.save(workspace);
    }
    return normalized || workspace.scriptureCache || null;
  }

  async findOne(id: string, userId: string): Promise<SermonWorkspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id, userId },
    });
    if (!workspace) {
      return workspace;
    }

    const [
      outlines,
      manuscripts,
      applications,
      illustrations,
      discussionQuestions,
      citations,
      dnaAnalyses,
      studyReports,
    ] = await Promise.all([
      this.outlineRepository.find({
        where: { workspaceId: workspace.id },
        order: { createdAt: 'DESC' },
      }),
      this.manuscriptRepository.find({
        where: { workspaceId: workspace.id },
        order: { createdAt: 'DESC' },
      }),
      this.applicationRepository.find({
        where: { workspaceId: workspace.id },
        order: { orderIndex: 'ASC', createdAt: 'ASC' },
      }),
      this.illustrationRepository.find({
        where: { workspaceId: workspace.id },
        order: { createdAt: 'ASC' },
      }),
      this.questionRepository.find({
        where: { workspaceId: workspace.id },
        order: { orderIndex: 'ASC', createdAt: 'ASC' },
      }),
      this.citationRepository.find({
        where: { workspaceId: workspace.id },
        order: { createdAt: 'DESC' },
      }),
      this.workspaceRepository.manager.getRepository(SermonDnaAnalysis).find({
        where: { workspaceId: workspace.id },
        order: { createdAt: 'DESC' },
      }),
      this.studyReportRepository.find({
        where: { workspaceId: workspace.id },
        order: { createdAt: 'DESC' },
      }),
    ]);

    workspace.outlines = outlines || [];
    workspace.manuscripts = manuscripts || [];
    workspace.applications = applications || [];
    workspace.illustrations = illustrations || [];
    workspace.discussionQuestions = discussionQuestions || [];
    workspace.citations = citations || [];
    workspace.dnaAnalyses = dnaAnalyses as SermonDnaAnalysis[] || [];
    workspace.studyReports = (studyReports || []).map((report: SermonStudyReport) => {
      const validation = this.generatedStudyOutputValidator.validate('study-report', report?.sections || {}, {
        reference: workspace.mainPassage,
        language: workspace.language,
      });
      if (validation.valid) {
        return report;
      }
      return {
        ...report,
        sections: this.buildStudyReportFallbackSections(workspace),
      };
    });
    workspace.scriptureCache = await this.normalizeScriptureCachePayload(workspace.scriptureCache as Record<string, any> | null, {
      mainPassage: workspace.mainPassage,
      language: workspace.language,
    });

    return this.upgradeWorkspaceContracts(workspace);
  }

  async getWorkspaceState(id: string, userId: string): Promise<WorkspaceStateResponse> {
    const workspace = await this.findOne(id, userId);
    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }
    return this.buildWorkspaceState(workspace);
  }

  async update(id: string, userId: string, updateDto: UpdateWorkspaceDto): Promise<SermonWorkspace> {
    const workspace = await this.findOne(id, userId);
    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }
    const nextMetadata = this.buildWorkspaceMetadataPayload({
      mainPassage: updateDto.mainPassage || workspace.mainPassage,
      language: updateDto.language || workspace.language,
      theologicalLens: updateDto.theologicalLens || workspace.theologicalLens,
      metadata: {
        ...(workspace.metadata || {}),
        ...(updateDto.metadata || {}),
      },
    });
    const normalizedUpdate: UpdateWorkspaceDto = { ...updateDto };
    if (updateDto.theologicalLens !== undefined) {
      normalizedUpdate.theologicalLens = normalizeTheologicalLens(updateDto.theologicalLens);
    } else {
      delete normalizedUpdate.theologicalLens;
    }
    await this.workspaceRepository.update(
      { id, userId },
      {
        ...normalizedUpdate,
        metadata: nextMetadata,
      },
    );
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
    const shouldSnapshot = typeof dto?.title === 'string' || dto?.structure !== undefined;
    if (shouldSnapshot) {
      const outlineHistoryBase = Array.isArray((outline.workspace.metadata as any)?.outlineHistory)
        ? ((outline.workspace.metadata as any)?.outlineHistory as any[]).length
        : 0;
      this.appendWorkspaceHistory(
        outline.workspace,
        'outlineHistory',
        this.snapshotOutlineForHistory(outline, `Version ${outlineHistoryBase + 1}`),
      );
      await this.workspaceRepository.save(outline.workspace);
    }
    if (dto.isSelected) {
      await this.outlineRepository
        .createQueryBuilder()
        .update(SermonOutline)
        .set({ isSelected: false })
        .where('workspaceId = :workspaceId', { workspaceId: outline.workspaceId })
        .andWhere('id <> :id', { id })
        .execute();
      await this.workspaceRepository.update(
        { id: outline.workspaceId, userId },
        {
          metadata: {
            ...(outline.workspace.metadata || {}),
            activeOutlineId: id,
          } as any,
        } as any,
      );
    }
    await this.outlineRepository.update({ id }, dto);
    return this.outlineRepository.findOne({ where: { id } });
  }

  async restoreOutlineHistory(userId: string, workspaceId: string, historyIndex: number): Promise<SermonOutline> {
    const workspace = await this.findOne(workspaceId, userId);
    const history = Array.isArray((workspace.metadata as any)?.outlineHistory)
      ? ((workspace.metadata as any)?.outlineHistory as any[])
      : [];
    const snapshot = history[historyIndex];
    if (!snapshot) {
      throw new BadRequestException('Outline history entry not found.');
    }
    const insertResult = await this.outlineRepository.insert({
      workspaceId,
      title: this.asString(snapshot.title || `Restored Outline ${historyIndex + 1}`),
      structure: (snapshot.structure as Record<string, any>) || {},
      contentFormat: 'markdown',
      isSelected: true,
    });
    const saved = insertResult.identifiers?.[0]?.id
      ? await this.outlineRepository.findOne({ where: { id: insertResult.identifiers[0].id } })
      : null;
    if (!saved) {
      throw new BadRequestException('Outline restoration succeeded but the saved outline could not be reloaded.');
    }
    workspace.metadata = {
      ...(workspace.metadata || {}),
      activeOutlineId: saved.id,
    };
    await this.workspaceRepository.update(workspace.id, {
      metadata: workspace.metadata,
    });
    return saved;
  }

  async updateManuscript(userId: string, id: string, dto: UpdateManuscriptDto): Promise<SermonManuscript> {
    const manuscript = await this.manuscriptRepository.findOne({ where: { id }, relations: ['workspace'] });
    if (!manuscript || manuscript.workspace.userId !== userId) {
      return null;
    }
    const shouldSnapshot = dto?.content !== undefined || dto?.transitions !== undefined;
    if (shouldSnapshot) {
      const manuscriptHistoryBase = Array.isArray((manuscript.workspace.metadata as any)?.manuscriptHistory)
        ? ((manuscript.workspace.metadata as any)?.manuscriptHistory as any[]).length
        : 0;
      this.appendWorkspaceHistory(
        manuscript.workspace,
        'manuscriptHistory',
        this.snapshotManuscriptForHistory(manuscript, `Version ${manuscriptHistoryBase + 1}`),
      );
      await this.workspaceRepository.save(manuscript.workspace);
    }
    const updatePayload: Partial<SermonManuscript> = {};
    if (dto.transitions) {
      updatePayload.transitions = dto.transitions;
    }
    const text = typeof dto?.content === 'string' ? dto.content : dto?.content?.text;
    if (typeof text === 'string') {
      const incomingContent = typeof dto.content === 'string' ? { text } : dto.content;
      const incomingMetadata = (incomingContent?.metadata || {}) as Record<string, any>;
      const existingMetadata = (manuscript?.content?.metadata || {}) as Record<string, any>;
      const safeContent = {
        ...(incomingContent || {}),
        formatVersion: incomingContent?.formatVersion || manuscript?.content?.formatVersion || 'v2',
        cues: this.sanitizeCueObject(incomingContent?.cues || manuscript?.content?.cues),
        metadata: {
          ...existingMetadata,
          ...incomingMetadata,
          cueAnchors: incomingMetadata.cueAnchors || existingMetadata.cueAnchors || {},
          cueAnchorUpdatedAt: incomingMetadata.cueAnchorUpdatedAt || existingMetadata.cueAnchorUpdatedAt,
        },
      };
      updatePayload.content = safeContent;
      const plainText = this.stripHtmlForWordCount(text);
      updatePayload.wordCount = plainText.split(' ').filter(Boolean).length;
      updatePayload.estimatedMinutes = Math.ceil(updatePayload.wordCount / 150);
      updatePayload.contentFormat = safeContent.formatVersion === 'v2' ? 'html' : manuscript.contentFormat;
    }
    await this.manuscriptRepository.update({ id }, updatePayload);
    manuscript.workspace.metadata = {
      ...(manuscript.workspace.metadata || {}),
      activeManuscriptId: id,
    };
    await this.workspaceRepository.update(manuscript.workspace.id, {
      metadata: manuscript.workspace.metadata,
    });
    return this.manuscriptRepository.findOne({ where: { id } });
  }

  async restoreManuscriptHistory(userId: string, workspaceId: string, historyIndex: number): Promise<SermonManuscript> {
    const workspace = await this.findOne(workspaceId, userId);
    const history = Array.isArray((workspace.metadata as any)?.manuscriptHistory)
      ? ((workspace.metadata as any)?.manuscriptHistory as any[])
      : [];
    const snapshot = history[historyIndex];
    if (!snapshot) {
      throw new BadRequestException('Manuscript history entry not found.');
    }
    const manuscript = this.manuscriptRepository.create({
      workspaceId,
      outlineId: snapshot.outlineId || null,
      content: (snapshot.content as Record<string, any>) || {},
      transitions: (snapshot.transitions as Record<string, any>) || null,
      contentFormat: 'html',
      wordCount: typeof snapshot.wordCount === 'number' ? snapshot.wordCount : null,
      estimatedMinutes: typeof snapshot.estimatedMinutes === 'number' ? snapshot.estimatedMinutes : null,
    });
    const insertResult = await this.manuscriptRepository.insert(manuscript);
    const saved = insertResult.identifiers?.[0]?.id
      ? await this.manuscriptRepository.findOne({ where: { id: insertResult.identifiers[0].id } })
      : null;
    if (!saved) {
      throw new BadRequestException('Manuscript restoration succeeded but the saved manuscript could not be reloaded.');
    }
    workspace.metadata = {
      ...(workspace.metadata || {}),
      activeManuscriptId: saved.id,
      activeOutlineId: saved.outlineId || (workspace.metadata as any)?.activeOutlineId,
    };
    await this.workspaceRepository.update(workspace.id, {
      metadata: workspace.metadata,
    });
    return saved;
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
