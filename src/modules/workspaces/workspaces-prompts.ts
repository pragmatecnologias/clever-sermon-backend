export const WorkspacesPrompts = {
  sermonCore(input: {
    doctrinalContext: string;
    guardrailBlock?: string;
    planningBlock?: string;
    mainPassage: string;
    theme: string;
    sermonGoals: string;
    audienceProfile: string;
    mainTheologicalClaim: string;
    theologicalThemesJson: string;
    pastoralImplicationsJson: string;
    exegeticalSummary: string;
    languageLabel: string;
  }): string {
    return `${input.doctrinalContext}

${input.guardrailBlock ? `=== PASTORAL GUARDRAILS ===\n${input.guardrailBlock}\n` : ''}${input.planningBlock ? `=== SERMON PLANNING CONTEXT ===\n${input.planningBlock}\n` : ''}

You are extracting the SERMON CORE - the DNA of the sermon message.

=== CONTEXT ===
Main Passage: ${input.mainPassage}
Theme: ${input.theme}
Sermon Goals: ${input.sermonGoals}
Audience: ${input.audienceProfile}

=== STUDY DATA ===
Main Theological Claim: ${input.mainTheologicalClaim}
Theological Themes: ${input.theologicalThemesJson}
Pastoral Implications: ${input.pastoralImplicationsJson}
Exegetical Summary: ${input.exegeticalSummary}

=== TASK ===
Extract the sermon core - the unified message that ties everything together.

Write in ${input.languageLabel}.

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
  },

  socraticCoachQuestion(input: {
    languageLabel: string;
    context: string;
    questionId: string;
    answer: string;
  }): string {
    return `You are a Socratic Sermon Coach. Analyze the pastor answer and respond with concise coaching feedback.

Language: ${input.languageLabel}
Context:
${input.context}

Answered Question ID: ${input.questionId}
Pastor Answer:
${input.answer}

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
  },

  socraticCoachList(input: {
    promptOverride: string;
    languageLabel: string;
    mode: string;
    listenerProfile: string;
    context: string;
  }): string {
    return `${input.promptOverride}You are a seminary-level Socratic Sermon Coach.

Language: ${input.languageLabel}
Task mode: ${input.mode}
Listener simulation profile: ${input.listenerProfile}

Context:
${input.context}

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
  },

  targetedRepairPatch(input: {
    languageLabel: string;
    theologicalLens: string;
    mainPassage: string;
    theme: string;
    audience: string;
    issueId: string;
    issueType: string;
    severity: string;
    targetAnchor: string;
    proposedAction: string;
    expectedOutcome: string;
    conversationSummary: string;
    manuscriptHtmlJson: string;
    snippet: string;
  }): string {
    return `You are repairing a sermon manuscript section with high precision.

Language: ${input.languageLabel}
Theological Lens: ${input.theologicalLens}
Main Passage: ${input.mainPassage}
Theme: ${input.theme}
Audience: ${input.audience}
Issue ID: ${input.issueId}
Issue Type: ${input.issueType}
Severity: ${input.severity}
Target Anchor: ${input.targetAnchor}
Proposed Action: ${input.proposedAction}
Expected Outcome: ${input.expectedOutcome}
Conversation Summary: ${input.conversationSummary || 'N/A'}

Current manuscript HTML (excerpt):
${input.manuscriptHtmlJson}

Anchor snippet to replace:
${input.snippet}

Return ONLY valid JSON:
{
  "replacement": "Improved text for this section in ${input.languageLabel}. Use plain text or simple HTML paragraphs.",
  "why": "Short rationale for the change."
}

Rules:
- Keep biblical fidelity to ${input.mainPassage}.
- Keep Adventist alignment if lens is adventist.
- Keep same language as workspace.
- Do not introduce Sunday worship framing.
- Do not repeat the section title or anchor phrase at the start of the replacement.
- Do not rewrite the full manuscript; patch only this targeted section.
- No markdown, no prose outside JSON.`;
  },

  manuscriptGeneration(input: {
    doctrinalContext: string;
    metadataBlock: string;
    contextJson: string;
    languageLabel: string;
    spanishRule: string;
    pointInstructions: string;
    mainPassage: string;
    pointCount: number;
    targetMinutes: number;
    wordTarget: number;
    wordMin: number;
    wordMax: number;
    includeSlideCuesLine: string;
    includeKeyLinesLine: string;
    formatLine: string;
  }): string {
    return `${input.doctrinalContext}

You are writing a sermon manuscript. The OUTLINE is your structural authority - each point carries its own assets.

=== SERMON METADATA ===
${input.metadataBlock}

=== STUDY DATA (background context) ===
${input.contextJson}

=== LANGUAGE ===
Write entirely in ${input.languageLabel}.
${input.spanishRule}

=== CRITICAL: OUTLINE IS THE AUTHORITY ===

Each sermon point carries its OWN assets. Do NOT mix assets between points.
Use the applications, illustrations, and cross-references ATTACHED TO EACH POINT.

${input.pointInstructions || 'Use outline.pointNodes from the study data above.'}

=== SERMON STRUCTURE ===

1. INTRODUCTION
   - Hook the audience
   - Use studyReport.passageOverview to set the scene
   - State the mainTheologicalClaim
   - Use globalCrossReferences or globalEgwQuotes if helpful

2. PASSAGE READING
   - Present ${input.mainPassage}
   - Brief transition

3. CONTEXT (Literary & Historical)
   - Use studyReport.literaryContext and historicalContext
   - Address interpretiveChallenges if present

4. MAIN POINTS (${input.pointCount} points - follow outline exactly)
   - For EACH point, use ONLY the assets attached to that point
   - Include word study insights from wordStudies where relevant
   - Each point should be substantial with explanation → illustration → application

5. CONCLUSION & INVITATION
   - Synthesize the main points
   - Restate mainTheologicalClaim
   - Clear call to action from outline.callToAction

=== QUALITY REQUIREMENTS ===
- Manuscript must be SUBSTANTIAL (${input.targetMinutes} minutes)
- Length target: ~${input.wordTarget} words (minimum ${input.wordMin}, maximum ${input.wordMax})
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
- Use h2 for major sections
- Use h3 for subsections within points
- Short paragraphs (2-4 sentences)
- Use <strong>Label:</strong> for moves like Explanation, Application, Illustration
- ${input.includeSlideCuesLine}
- ${input.includeKeyLinesLine}
- ${input.formatLine}`;
  },

  mediaSuggestions(input: {
    languageLabel: string;
    contextJson: string;
    typeOptions: string;
    localeRules: string;
  }): string {
    return `You are a sermon media director.

Generate high-quality, production-ready media suggestions for sermon preparation.

Language: ${input.languageLabel}
Context:
${input.contextJson}

Return ONLY valid JSON in this exact shape:
{
  "mediaSuggestions": [
    {
      "type": "${input.typeOptions}",
      "intent": "short intent label",
      "useCase": "where and how the pastor should use this asset during sermon delivery",
      "prompt": "final production prompt"
    }
  ]
}

Rules:
${input.localeRules}
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
  },
};

export type WorkspacePromptId =
  | 'sermon-core'
  | 'socratic-coach-question'
  | 'socratic-coach-list'
  | 'targeted-repair-patch'
  | 'manuscript-generation'
  | 'outline'
  | 'outline-points'
  | 'outline-from-points'
  | 'outline-point-nodes'
  | 'applications'
  | 'discussion-questions'
  | 'illustrations'
  | 'citations'
  | 'study-report'
  | 'media-suggestions';

export type WorkspacePromptEvaluationCase = {
  id: string;
  promptId: WorkspacePromptId;
  description: string;
  input: Record<string, unknown>;
  expectedTraits: string[];
};

export const WorkspacePromptRegistry: Record<WorkspacePromptId, {
  promptId: WorkspacePromptId;
  description: string;
  evaluationCases: WorkspacePromptEvaluationCase[];
}> = {
  'sermon-core': {
    promptId: 'sermon-core',
    description: 'Extract sermon core from study data',
    evaluationCases: [
      {
        id: 'sermon-core-en-simple',
        promptId: 'sermon-core',
        description: 'English sermon core generation from passage study data',
        input: {
          mainPassage: 'John 3:16',
          theme: 'God so loved the world',
          sermonGoals: 'Call people to trust Christ',
          audienceProfile: 'Mixed congregation',
        },
        expectedTraits: ['json', 'bigIdea', 'fallenCondition', 'centralTruth', 'sermonGoal', 'audienceNeed', 'passage-grounded'],
      },
    ],
  },
  'socratic-coach-question': {
    promptId: 'socratic-coach-question',
    description: 'Coach a pastor answer with a single question',
    evaluationCases: [
      {
        id: 'coach-question-faithfulness',
        promptId: 'socratic-coach-question',
        description: 'Checks answer fidelity to the passage',
        input: {
          context: 'Romans 8:1',
          questionId: 'Q1',
          answer: 'No condemnation in Christ means believers are free.',
        },
        expectedTraits: ['json', 'affirmation', 'coachFeedback', 'rewriteHint', 'nextQuestion', 'text-fidelity'],
      },
    ],
  },
  'socratic-coach-list': {
    promptId: 'socratic-coach-list',
    description: 'Generate a full Socratic question set',
    evaluationCases: [
      {
        id: 'coach-list-refine-mode',
        promptId: 'socratic-coach-list',
        description: 'Produces eight targeted refine questions',
        input: {
          mode: 'refine',
          listenerProfile: 'skeptic',
          context: 'Outline points and manuscript excerpts',
        },
        expectedTraits: ['json', 'questions', '8-questions', 'text-fidelity', 'application-linkage'],
      },
      {
        id: 'coach-list-self-reflection',
        promptId: 'socratic-coach-list',
        description: 'Produces self reflection questions',
        input: {
          mode: 'self_reflection',
          listenerProfile: 'general_congregation',
          context: 'Sermon preparation notes',
        },
        expectedTraits: ['json', 'questions', 'self-reflection', 'spiritual-formation'],
      },
    ],
  },
  'targeted-repair-patch': {
    promptId: 'targeted-repair-patch',
    description: 'Patch a manuscript snippet with local repair',
    evaluationCases: [
      {
        id: 'targeted-repair-no-anchor-duplication',
        promptId: 'targeted-repair-patch',
        description: 'Avoids duplicating the anchor title in the replacement',
        input: {
          mainPassage: 'Ephesians 2:1-10',
          targetAnchor: 'Introduction',
          proposedAction: 'Strengthen text fidelity',
          conversationSummary: 'Coach flagged weak grounding',
        },
        expectedTraits: ['json', 'replacement', 'why', 'no-anchor-duplication', 'text-faithful'],
      },
    ],
  },
  'manuscript-generation': {
    promptId: 'manuscript-generation',
    description: 'Generate a sermon manuscript from outline and study data',
    evaluationCases: [
      {
        id: 'manuscript-v2-en',
        promptId: 'manuscript-generation',
        description: 'Produces full HTML manuscript with cues',
        input: {
          mainPassage: 'John 3:16',
          targetMinutes: 22,
          wordTarget: 2800,
        },
        expectedTraits: ['html', 'cues', 'outline-authority', 'slide-cues', 'key-lines'],
      },
    ],
  },
  outline: {
    promptId: 'outline',
    description: 'Generate a sermon outline',
    evaluationCases: [
      {
        id: 'outline-candidate-basic',
        promptId: 'outline',
        description: 'Generates a full outline structure',
        input: {
          mainPassage: 'John 3:16',
          theme: 'Love of God',
        },
        expectedTraits: ['json', 'introduction', 'points', 'conclusion', 'scripture-support'],
      },
    ],
  },
  'outline-points': {
    promptId: 'outline-points',
    description: 'Generate outline point variations',
    evaluationCases: [
      {
        id: 'outline-points-variations',
        promptId: 'outline-points',
        description: 'Produces multiple candidate point sets',
        input: {
          mainPassage: 'John 3:16',
          count: 3,
        },
        expectedTraits: ['json', 'array', 'angle', 'points', 'variation'],
      },
    ],
  },
  'outline-from-points': {
    promptId: 'outline-from-points',
    description: 'Generate a sermon outline from selected points',
    evaluationCases: [
      {
        id: 'outline-from-points-simple',
        promptId: 'outline-from-points',
        description: 'Builds a structured outline from three points',
        input: {
          mainPassage: 'John 3:16',
          points: ['God loved', 'God gave', 'We believe'],
        },
        expectedTraits: ['json', 'outline', 'points', 'title', 'conclusion'],
      },
    ],
  },
  'outline-point-nodes': {
    promptId: 'outline-point-nodes',
    description: 'Generate supporting node data for outline points',
    evaluationCases: [
      {
        id: 'outline-point-nodes-support',
        promptId: 'outline-point-nodes',
        description: 'Produces grounded node metadata for each point',
        input: {
          mainPassage: 'John 3:16',
          points: ['God loved', 'God gave', 'We believe'],
        },
        expectedTraits: ['json', 'pointNodes', 'supportingVerses', 'applications', 'discussionQuestions'],
      },
    ],
  },
  applications: {
    promptId: 'applications',
    description: 'Generate sermon applications',
    evaluationCases: [
      {
        id: 'applications-audience-driven',
        promptId: 'applications',
        description: 'Produces audience-specific applications',
        input: {
          mainPassage: 'John 3:16',
          audienceType: 'young adults',
        },
        expectedTraits: ['list', 'audience-specific', 'actionable'],
      },
    ],
  },
  'discussion-questions': {
    promptId: 'discussion-questions',
    description: 'Generate discussion questions',
    evaluationCases: [
      {
        id: 'discussion-questions-groups',
        promptId: 'discussion-questions',
        description: 'Produces small-group discussion questions',
        input: {
          mainPassage: 'John 3:16',
        },
        expectedTraits: ['list', 'reflective', 'discussion-ready'],
      },
    ],
  },
  illustrations: {
    promptId: 'illustrations',
    description: 'Generate illustration ideas',
    evaluationCases: [
      {
        id: 'illustrations-sermon-ready',
        promptId: 'illustrations',
        description: 'Produces grounded illustration concepts',
        input: {
          mainPassage: 'John 3:16',
        },
        expectedTraits: ['list', 'illustration', 'source-aware'],
      },
    ],
  },
  citations: {
    promptId: 'citations',
    description: 'Generate citation candidates',
    evaluationCases: [
      {
        id: 'citations-source-aware',
        promptId: 'citations',
        description: 'Produces claim citations with verse references',
        input: {
          mainPassage: 'John 3:16',
        },
        expectedTraits: ['json', 'verseReferences', 'source-aware', 'claim-support'],
      },
    ],
  },
  'study-report': {
    promptId: 'study-report',
    description: 'Generate a structured study report',
    evaluationCases: [
      {
        id: 'study-report-exegetical',
        promptId: 'study-report',
        description: 'Produces the required study-report sections',
        input: {
          mainPassage: 'John 3:16',
          language: 'en',
        },
        expectedTraits: ['json', 'passageOverview', 'canonicalContext', 'crossReferences', 'interpretiveChallenges', 'mainTheologicalClaim'],
      },
    ],
  },
  'media-suggestions': {
    promptId: 'media-suggestions',
    description: 'Generate media and delivery suggestions',
    evaluationCases: [
      {
        id: 'media-suggestions-pack',
        promptId: 'media-suggestions',
        description: 'Produces export-ready media pack suggestions',
        input: {
          mainPassage: 'John 3:16',
        },
        expectedTraits: ['json', 'mediaSuggestions', 'studyAssets', 'slide-cues', 'export-ready'],
      },
    ],
  },
};

export const WorkspacePromptEvaluationCases = Object.values(WorkspacePromptRegistry).flatMap((entry) => entry.evaluationCases);

export const getWorkspacePromptEvaluationCoverage = () => ({
  promptCount: Object.keys(WorkspacePromptRegistry).length,
  evaluationCaseCount: WorkspacePromptEvaluationCases.length,
  promptIds: Object.keys(WorkspacePromptRegistry) as WorkspacePromptId[],
});
