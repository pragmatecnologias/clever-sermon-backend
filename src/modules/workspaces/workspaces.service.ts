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

type ManuscriptGenerationOptions = {
  tone?: 'teaching' | 'pastoral' | 'evangelistic' | 'storytelling' | 'motivational' | string;
  targetMinutes?: number;
  format?: 'full' | 'notes' | string;
  audienceMode?: string;
  includeSlideCues?: boolean;
  includeKeyLines?: boolean;
};

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
  private extractOutlinePointTexts = WorkspaceHelpers.extractOutlinePointTexts;

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
- For self_reflection mode, include at least 3 spiritual formation questions.
- Keep question text concise and pastor-friendly.
- No markdown, no prose outside JSON.`;
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
        questionId: this.asString(parsed?.questionId || payload.questionId),
        affirmation: this.asString(parsed?.affirmation || ''),
        coachFeedback: this.asString(parsed?.coachFeedback || ''),
        improvementSuggestion: this.asString(parsed?.improvementSuggestion || ''),
        rewriteHint: this.asString(parsed?.rewriteHint || ''),
        nextQuestion: this.asString(parsed?.nextQuestion || ''),
      };
      workspace.metadata = {
        ...(workspace.metadata || {}),
        socraticCoachLastFeedback: {
          ...feedback,
          listenerProfile: payload.listenerProfile || 'general_congregation',
          mode: payload.mode || 'refine',
          updatedAt: now,
        },
      };
      await this.workspaceRepository.save(workspace);
      return { ...feedback, updatedAt: now };
    }

    const questionsRaw = Array.isArray(parsed?.questions) ? parsed.questions : [];
    const questions = questionsRaw
      .map((item: any, idx: number) => ({
        id: this.asString(item?.id || `Q${idx + 1}`),
        dimension: this.asString(item?.dimension || 'text_fidelity').toLowerCase(),
        question: this.asString(item?.question || ''),
        purpose: this.asString(item?.purpose || ''),
        sourceAnchor: this.asString(item?.sourceAnchor || workspace.mainPassage),
        severity: this.asString(item?.severity || 'medium').toLowerCase(),
        listenerAngle: this.asString(item?.listenerAngle || ''),
        suggestedFollowUp: this.asString(item?.suggestedFollowUp || ''),
      }))
      .filter((item: any) => item.question)
      .slice(0, 10);

    const coachSession = {
      mode: this.asString(parsed?.mode || payload?.mode || 'refine').toLowerCase(),
      listenerProfile: this.asString(parsed?.listenerProfile || payload?.listenerProfile || 'general_congregation'),
      summary: this.asString(parsed?.summary || ''),
      weakAreas: Array.isArray(parsed?.weakAreas)
        ? parsed.weakAreas.map((item: any) => this.asString(item)).filter(Boolean).slice(0, 8)
        : [],
      questions,
      nextStepSuggestion: this.asString(parsed?.nextStepSuggestion || ''),
      generatedAt: now,
    };

    workspace.metadata = {
      ...(workspace.metadata || {}),
      socraticCoachLastSession: coachSession,
    };
    await this.workspaceRepository.save(workspace);
    return coachSession;
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
      "illustrationIdeas": ["string"],
      "mediaSuggestions": ["string"]
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
- Ensure each point remains faithful to the passage and avoids drift.
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
    };
  }

  private buildManuscriptContext(workspace: SermonWorkspace, outline: SermonOutline) {
    const cache = workspace.scriptureCache || {};
    const outlineStructure = outline?.structure || {};
    const outlinePoints = this.extractOutlinePointTexts(outlineStructure).slice(0, 8);
    const pointNodes = Array.isArray(outlineStructure?.pointNodes) ? outlineStructure.pointNodes.slice(0, 8) : [];
    const studyReport = workspace.studyReports?.[0]?.sections || {};
    const applications = (workspace.applications || [])
      .slice(0, 12)
      .map((item: any) => this.asString(item?.content || item?.text))
      .filter(Boolean);
    const illustrations = (workspace.illustrations || [])
      .slice(0, 12)
      .map((item: any) => this.asString(item?.description || item?.content || item?.scenario))
      .filter(Boolean);
    const cachedCrossReferences = Array.isArray(cache?.crossReferences?.ranked)
      ? cache.crossReferences.ranked.slice(0, 16)
      : [];

    return {
      outline: {
        title: this.asString(outline?.title),
        introduction: this.asString(outlineStructure?.introduction),
        points: outlinePoints,
        pointNodes,
        conclusion: this.asString(outlineStructure?.conclusion),
        callToAction: this.asString(outlineStructure?.callToAction),
      },
      scripture: {
        mainPassage: workspace.mainPassage,
        additionalPassages: workspace.additionalPassages || [],
        passageSummary: cache?.passageSummary || null,
        verseContext: cache?.perVerseContext || null,
        structuralAnalysis: cache?.structuralAnalysis || null,
        interpretiveChallenges: cache?.interpretiveChallenges || null,
        canonicalThemes: cache?.canonicalThemes || null,
        studySynthesis: cache?.studySynthesis || null,
        translationComparison: cache?.translationComparison || null,
        verseCommentary: cache?.verseCommentary || null,
      },
      studyReport: studyReport || null,
      crossReferences: cachedCrossReferences,
      applications,
      illustrations,
      workspace: {
        title: workspace.title,
        seriesTitle: workspace.seriesTitle || '',
        theme: workspace.theme || '',
        sermonGoals: workspace.sermonGoals || '',
        audienceProfile: workspace.audienceProfile || '',
        storyArc: workspace.storyArc || '',
        theologicalLens: workspace.theologicalLens || '',
      },
    };
  }

  buildManuscriptPrompt(
    workspace: SermonWorkspace,
    outline: SermonOutline,
    options?: ManuscriptGenerationOptions,
  ) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    const normalizedOptions = this.normalizeManuscriptOptions(workspace, options);
    const manuscriptContext = this.buildManuscriptContext(workspace, outline);
    const contextJson = this.compactJsonForPrompt(manuscriptContext, 14000);
    const selectedPoints = manuscriptContext?.outline?.points || [];

    return `${doctrinalContext}

Generate a sermon manuscript that is fully synchronized with the provided outline and study inputs.

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
Requested Tone: ${normalizedOptions.tone}
Requested Delivery Length: ${normalizedOptions.targetMinutes} minutes
Requested Format: ${normalizedOptions.format === 'notes' ? 'Preaching Notes' : 'Full Manuscript'}
Requested Audience Focus: ${normalizedOptions.audienceMode}
Include Slide Cues: ${normalizedOptions.includeSlideCues ? 'Yes' : 'No'}
Highlight Key Preaching Statements: ${normalizedOptions.includeKeyLines ? 'Yes' : 'No'}

Primary Data Inputs (must be used as source material):
${contextJson}

Write in ${languageLabel}.

Hard constraints:
- The manuscript must follow this sequence:
  1) Introduction
  2) Passage Reading (${workspace.mainPassage})
  3) Context Explanation (literary + historical)
  4) Main Points (one section for each canonical outline point, same order)
  5) Applications (point-tied)
  6) Conclusion with invitation/call to action
- Use these exact outline point anchors in order:
${selectedPoints.map((point, index) => `${index + 1}. ${point}`).join('\n') || '1. Use outline points from provided context'}
- For each main point section include: explanation, one illustration, one practical application.
- Integrate scripture references naturally and explicitly.
- Do not invent a different outline flow.
- Keep theological coherence with provided study report + scripture cache.
- If evidence is missing for a specific detail, avoid fabrication and stay passage-grounded.

Formatting rules:
- Use markdown headings for each major manuscript section.
- ${normalizedOptions.includeSlideCues ? 'Add slide cues in this exact format: `[Slide] ...` where helpful.' : 'Do not add `[Slide]` cues.'}
- ${normalizedOptions.includeKeyLines ? 'Mark strong preaching lines with this exact marker: `[Key Line] ...`.' : 'Do not add `[Key Line]` markers.'}
- ${normalizedOptions.format === 'notes'
  ? 'Output concise preaching notes: bullets under each section, short speaking cues, no long paragraphs.'
  : 'Output full spoken manuscript prose with smooth transitions and natural oral cadence.'}
- End with a short metadata block:
  - Estimated Delivery Time: <number> minutes
  - Audience Focus: <text>
  - Tone: <text>
  - Format: Full Manuscript|Preaching Notes.`;
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

  private async buildStudyReportInputContext(workspace: SermonWorkspace, passageText: string) {
    const reference = workspace.mainPassage;
    const book = this.extractBookFromReference(reference);
    const cache = workspace.scriptureCache || {};

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
        String(item?.category || ''),
      ]),
    );

    const normalizedCrossReferences = (Array.isArray(crossReferences) ? crossReferences : [])
      .slice(0, 20)
      .map((ref: string) => ({
        reference: ref,
        category: xrefCategoryMap.get(ref) || '',
      }));

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
        theologicalLens: workspace.theologicalLens || '',
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
        bookMetadata,
        historicalContext,
        culturalContext,
        timeline,
      },
    };
  }

  buildStudyReportPrompt(workspace: SermonWorkspace, passageText: string, studyInputs: any) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    const inputJson = this.compactJsonForPrompt(studyInputs, 12000);
    
    return `${doctrinalContext}

Generate a structured exegetical study report for:
Main Passage: ${workspace.mainPassage}
Passage Text:
${passageText}

Theme: ${workspace.theme || 'N/A'}
Theological Lens: ${workspace.theologicalLens || 'N/A'}

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
  }
}

Rules:
- This is exegetical analysis, not a sermon draft.
- Keep each section concise, concrete, and passage-grounded.
- "mainTheologicalClaim" must be one sentence and explicit.
- "exegeticalFlow" must describe argument progression (not just outline labels).
- "structureOfPassage" must include visible verse anchoring in "verses".
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

  private normalizeStudyReportSections(raw: any): Record<string, any> {
    const source = raw && typeof raw === 'object' ? raw : {};
    const asStringArray = (value: any, limit = 12) => {
      if (Array.isArray(value)) {
        return value.map((item) => this.asString(item)).filter(Boolean).slice(0, limit);
      }
      if (typeof value === 'string') {
        return this.parseListFromResponse(value).slice(0, limit);
      }
      return [];
    };

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
            interpretationOptions: asStringArray(item?.interpretationOptions || item?.options || [], 5),
            preachingGuidance: this.asString(item?.preachingGuidance || item?.guidance || item?.note),
          }))
          .filter((item: any) => item.question)
      : [];

    const pastoralImplicationsRaw = source.pastoralImplications || source.practicalApplications || source.applications;
    const pastoralImplications = (() => {
      if (pastoralImplicationsRaw && typeof pastoralImplicationsRaw === 'object' && !Array.isArray(pastoralImplicationsRaw)) {
        return {
          personalLife: asStringArray((pastoralImplicationsRaw as any).personalLife, 6),
          churchLife: asStringArray((pastoralImplicationsRaw as any).churchLife, 6),
          mission: asStringArray((pastoralImplicationsRaw as any).mission, 6),
        };
      }
      const flat = asStringArray(pastoralImplicationsRaw, 12);
      return {
        personalLife: flat.slice(0, 4),
        churchLife: flat.slice(4, 8),
        mission: flat.slice(8, 12),
      };
    })();

    // Legacy key fallback mapping
    const fallbackThemes = asStringArray(source.theologicalThemes || source.keyThemes || source.themes, 10);
    const fallbackCanonical = this.asString(source.canonicalContext || source.canonicalConnections || source.canonicalThemes || '');
    const fallbackClaim = this.asString(source.mainTheologicalClaim || source.theologicalInsights || source.mainClaim || '');
    const fallbackFlow = asStringArray(source.exegeticalFlow || source.argumentFlow || source.flow || [], 8);
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
    };
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
    const manuscriptText = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('manuscript', manuscriptText);
    const wordCount = manuscriptText.split(/\s+/).filter(Boolean).length;
    const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 145));

    const manuscript = this.manuscriptRepository.create({
      workspaceId,
      outlineId,
      content: {
        text: manuscriptText,
        metadata: {
          options: normalizedOptions,
          generatedFromOutlineId: outlineId,
        },
      },
      wordCount,
      estimatedMinutes,
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
    const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
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
    const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
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
    const studyInputs = await this.buildStudyReportInputContext(workspace, passageText);

    const prompt = promptOverride || this.buildStudyReportPrompt(workspace, passageText, studyInputs);
    const response = await this.llmService.generateCompletion(prompt, userId, {
      temperature: 0.4,
      maxTokens: 2200,
    });
    this.logLlmOutput('study-report', response);

    const parsed = this.parseJsonSafe(response);
    const normalizedSections = this.normalizeStudyReportSections(parsed);
    const report = this.studyReportRepository.create({
      workspaceId,
      sections: {
        ...normalizedSections,
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
      const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
      return this.buildApplicationsPrompt(workspace, mainPoints, '{{audienceType}}');
    }

    if (type === 'illustrations') {
      const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
      const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
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
      const studyInputs = await this.buildStudyReportInputContext(workspace, passageText);
      return this.buildStudyReportPrompt(workspace, passageText, studyInputs);
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
