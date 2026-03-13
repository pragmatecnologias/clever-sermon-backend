import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { SermonOutline } from '../../entities/sermon-outline.entity';
import { SermonManuscript } from '../../entities/sermon-manuscript.entity';
import { AudienceType, SermonApplication } from '../../entities/sermon-application.entity';
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

  buildIllustrationsPrompt(workspace: SermonWorkspace, mainPoints: string[], seededIdeas: string[] = []) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    return `Generate 3-5 sermon illustrations based on:
Title: ${workspace.title}
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Main Points: ${mainPoints.join(', ') || 'N/A'}
${seededIdeas.length ? `Existing study illustration ideas: ${seededIdeas.join(' | ')}` : ''}

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
      .replace(/^\s*(assistant|final|response)\s*[:\-]\s*/i, '')
      .replace(/\r\n/g, '\n')
      .trim();
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
      const textFromModel = this.normalizeGeneratedManuscriptText(String(parsed.text || ''));
      const cueObject = this.sanitizeCueObject(parsed.cues);
      const htmlText = /<\/?(p|h2|h3|h4|ul|ol|li|strong|em|br)\b/i.test(textFromModel)
        ? textFromModel
        : this.markdownLikeToHtml(textFromModel);
      return {
        text: htmlText || '<p></p>',
        cues: {
          ...cueObject,
          slide: options.includeSlideCues ? cueObject.slide : [],
          keyLine: options.includeKeyLines ? cueObject.keyLine : [],
        },
      };
    }

    const extracted = this.extractCuesFromLegacyText(this.normalizeGeneratedManuscriptText(cleanedResponse || rawResponse));
    return {
      text: this.markdownLikeToHtml(extracted.text),
      cues: {
        ...extracted.cues,
        slide: options.includeSlideCues ? extracted.cues.slide : [],
        keyLine: options.includeKeyLines ? extracted.cues.keyLine : [],
      },
    };
  }

  private stripHtmlForWordCount(htmlText: string) {
    return String(htmlText || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildManuscriptContext(workspace: SermonWorkspace, outline: SermonOutline) {
    const cache = workspace.scriptureCache || {};
    const outlineStructure = outline?.structure || {};
    const outlinePoints = this.extractOutlinePointTexts(outlineStructure).slice(0, 8);
    const pointNodes = Array.isArray(outlineStructure?.pointNodes) ? outlineStructure.pointNodes.slice(0, 8) : [];
    const studyReport = workspace.studyReports?.[0]?.sections || {};
    const pointApplications = pointNodes.flatMap((point: any) => this.asStringArray(point?.applications, 4));
    const pointIllustrations = pointNodes.flatMap((point: any) => this.asStringArray(point?.illustrationIdeas, 4));
    const applications = Array.from(
      new Set([
        ...pointApplications,
        ...(workspace.applications || [])
          .slice(0, 12)
          .map((item: any) => this.asString(item?.content || item?.text))
          .filter(Boolean),
      ]),
    ).slice(0, 12);
    const illustrations = Array.from(
      new Set([
        ...pointIllustrations,
        ...(workspace.illustrations || [])
          .slice(0, 12)
          .map((item: any) => this.asString(item?.description || item?.content || item?.scenario))
          .filter(Boolean),
      ]),
    ).slice(0, 12);
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

Output requirements:
- Return ONLY valid JSON (no markdown code fences, no prose outside JSON).
- JSON shape:
{
  "text": "<HTML body using only p,h2,h3,ul,ol,li,strong,em,br tags>",
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
- In "text", write clean sermon prose content (no [Slide], no [Key Line], no bracket markers).
- The HTML must read beautifully as a sermon manuscript, not as a raw dump.
- Use h2 for major sections like Introduction, Passage Reading, Context, Main Point sections, Applications, and Conclusion.
- Use h3 for numbered sermon points when needed.
- Write short, readable paragraphs of 2-4 sentences each. Do not collapse entire sections into one giant paragraph.
- Insert a new <p> for each distinct pastoral thought, transition, or explanation shift.
- When presenting the main scripture reference, put the reference on its own italicized line using <p><em>...</em></p>.
- When quoting the passage text itself, use short paragraph blocks and clear separation between verse lines/segments so the reading breathes naturally.
- For labeled moves like "Explanation", "Application", "Illustration", or "Invitation", start a new paragraph and use <strong>Label:</strong> followed by normal prose.
- Prefer paragraph rhythm and white space over density. The manuscript should feel easy to read aloud.
- ${normalizedOptions.includeSlideCues ? 'Populate cues.slide with useful presenter prompts.' : 'Leave cues.slide as an empty array.'}
- ${normalizedOptions.includeKeyLines ? 'Populate cues.keyLine with memorable preaching statements.' : 'Leave cues.keyLine as an empty array.'}
- Populate other cue arrays only when helpful; otherwise keep empty arrays.
- ${normalizedOptions.format === 'notes'
  ? 'Use concise preaching-note style inside HTML (short bullets/brief paragraphs).'
  : 'Use full spoken manuscript style inside HTML with smooth transitions.'}`;
  }

  buildApplicationsPrompt(workspace: SermonWorkspace, mainPoints: string[], audienceType: string, seededApplications: string[] = []) {
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
    const theologicalLens = workspace.theologicalLens || 'adventist';
    const doctrinalContext = SDAAlignmentService.getLensContext(theologicalLens as any);
    
    return `${doctrinalContext}

Generate practical applications for ${audienceType} based on:
Main Passage: ${workspace.mainPassage}
Theme: ${workspace.theme || 'N/A'}
Sermon Goals: ${workspace.sermonGoals || 'N/A'}
Main Points: ${mainPoints.join(', ') || 'N/A'}
${seededApplications.length ? `Existing study applications to refine: ${seededApplications.join(' | ')}` : ''}

Write in ${languageLabel}.

Provide 3-5 specific, actionable applications.

Rules:
- Return ONLY a numbered list (1., 2., 3., etc.).
- Each line must be a single sentence starting with a verb.
- End each line with a verse reference in the format "(Verse: Book 1:1)".
- No tables, no pipes, no markdown, no headings, no extra commentary.`;
  }

  buildDiscussionPrompt(workspace: SermonWorkspace, seededQuestions: string[] = []) {
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
    const languageLabel = workspace.language === 'es' ? 'Spanish' : 'English';
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
      12000,
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
      "type": "Image · Hero|Image · Point 1|Image · Point 2|Image · Point 3|Image · Application|Image · Closing|Video · Intro Loop|Video · Transition|Voice · Opening Reflection|Voice · Closing Appeal|Music · Theme Song|Music · Instrumental Bed|Social · Instagram Post|Social · Instagram Story|Social · Facebook Post|Social · WhatsApp Status|Social · YouTube Thumbnail|Social · X Post",
      "intent": "short intent label",
      "useCase": "where and how the pastor should use this asset during sermon delivery",
      "prompt": "final production prompt"
    }
  ]
}

Rules:
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
    for (const item of value) {
      if (typeof item === 'string') {
        const prompt = this.asString(item);
        if (!prompt) continue;
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
        applications: this.asStringArray(item?.applications, 6),
        discussionQuestions: this.asStringArray(item?.discussionQuestions || item?.questions, 6),
        illustrationIdeas: this.asStringArray(item?.illustrationIdeas || item?.illustrations, 6),
        mediaSuggestions: this.asStringArray(item?.mediaSuggestions || item?.media, 6),
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
        applications: this.mergeUniqueStrings(point?.applications, movementAsset?.applications || categoryAssets?.applications, 6),
        discussionQuestions: this.mergeUniqueStrings(point?.discussionQuestions, movementAsset?.discussionQuestions || categoryAssets?.discussionQuestions, 6),
        illustrationIdeas: this.mergeUniqueStrings(point?.illustrationIdeas, movementAsset?.illustrationIdeas || categoryAssets?.illustrationIdeas, 6),
        mediaSuggestions: this.mergeUniqueStrings(point?.mediaSuggestions, movementAsset?.mediaSuggestions || categoryAssets?.mediaSuggestions, 6),
        references: this.mergeUniqueStrings(point?.references, movementAsset?.references || categoryAssets?.references?.map((item: any) => item?.reference || item), 6),
        egwSupport: mergedEgw,
      };
    });

    return outlineData;
  }

  private async upgradeWorkspaceContracts(workspace: SermonWorkspace): Promise<SermonWorkspace> {
    if (!workspace) return workspace;

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
      const before = JSON.stringify(outline.structure || {});
      const after = JSON.stringify(enrichedStructure || {});
      if (before !== after) {
        outline.structure = enrichedStructure;
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
    const manuscriptResponse = await this.llmService.generateCompletion(prompt, userId);
    this.logLlmOutput('manuscript', manuscriptResponse);
    const parsedManuscript = this.parseGeneratedManuscriptResponse(manuscriptResponse, normalizedOptions);
    const plainText = this.stripHtmlForWordCount(parsedManuscript.text);
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const estimatedMinutes = Math.max(1, Math.ceil(wordCount / 145));

    const manuscript = this.manuscriptRepository.create({
      workspaceId,
      outlineId,
      content: {
        formatVersion: 'v2',
        text: parsedManuscript.text,
        cues: parsedManuscript.cues,
        metadata: {
          options: normalizedOptions,
          generatedFromOutlineId: outlineId,
        },
      },
      contentFormat: 'html',
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
    let workspace = await this.findOne(workspaceId, userId);
    workspace = await this.ensureStudyReportForAssetGeneration(workspace, userId);
    await this.applicationRepository.delete({ workspaceId });
    const outline = workspace.outlines?.find((item) => item.isSelected) || workspace.outlines?.[0];
    const mainPoints = this.extractOutlinePointTexts(outline?.structure || {});
    const pointNodes = Array.isArray(outline?.structure?.pointNodes) ? outline.structure.pointNodes : [];
    const seededApplications = Array.from(new Set(pointNodes.flatMap((point: any) => this.asStringArray(point?.applications, 4)))).slice(0, 12);
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
        : this.buildApplicationsPrompt(workspace, mainPoints, audienceType, seededApplications);
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
    let workspace = await this.findOne(workspaceId, userId);
    workspace = await this.ensureStudyReportForAssetGeneration(workspace, userId);
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
    let workspace = await this.findOne(workspaceId, userId);
    workspace = await this.ensureStudyReportForAssetGeneration(workspace, userId);
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
    const baseSections = this.buildStudyReportBaseSections(studyInputs);
    const normalizedSections = this.normalizeStudyReportSections({
      ...baseSections,
      ...(parsed && typeof parsed === 'object' ? parsed : {}),
    });
    const mergedSections = {
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

  async generateMediaSuggestions(
    workspaceId: string,
    userId: string,
    promptOverride?: string,
  ): Promise<SermonStudyReport> {
    let workspace = await this.findOne(workspaceId, userId);
    workspace = await this.ensureStudyReportForAssetGeneration(workspace, userId);
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

    const existingPrompts = this.asStringArray(existingAssets?.categoryAssets?.mediaSuggestions, 24);
    const prompt =
      promptOverride ||
      this.buildMediaSuggestionsPrompt(workspace, passageText, studyInputs, normalizedSections, existingPrompts);
    const response = await this.llmService.generateCompletion(prompt, userId, {
      temperature: 0.35,
      maxTokens: 2600,
    });
    this.logLlmOutput('media-suggestions', response);

    const parsed = this.parseJsonSafe(response);
    const rawSuggestions = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.mediaSuggestions)
        ? parsed.mediaSuggestions
        : Array.isArray(parsed?.suggestions)
          ? parsed.suggestions
          : [];

    let mediaSuggestionCards = this.normalizeMediaSuggestionCards(rawSuggestions, 24);
    if (!mediaSuggestionCards.length) {
      mediaSuggestionCards = this.parseListFromResponse(response)
        .map((item) => ({
          type: 'Media',
          intent: 'Study prompt',
          prompt: this.asString(item),
        }))
        .filter((item) => item.prompt)
        .slice(0, 24);
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

  private async ensureStudyReportForAssetGeneration(
    workspace: SermonWorkspace,
    userId: string,
  ): Promise<SermonWorkspace> {
    if (Array.isArray(workspace?.studyReports) && workspace.studyReports.length > 0) {
      return workspace;
    }

    await this.generateStudyReport(workspace.id, userId);
    return this.findOne(workspace.id, userId);
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
