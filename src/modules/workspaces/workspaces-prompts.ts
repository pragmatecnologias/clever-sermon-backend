export const WorkspacesPrompts = {
  sermonCore(input: {
    doctrinalContext: string;
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
