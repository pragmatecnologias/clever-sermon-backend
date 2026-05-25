"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspacePromptEvaluationCoverage = exports.WorkspacePromptEvaluationCases = exports.WorkspacePromptRegistry = exports.WorkspacesPrompts = void 0;
exports.WorkspacesPrompts = {
    sermonCore: function (input) {
        return "".concat(input.doctrinalContext, "\n\n").concat(input.guardrailBlock ? "=== PASTORAL GUARDRAILS ===\n".concat(input.guardrailBlock, "\n") : '').concat(input.planningBlock ? "=== SERMON PLANNING CONTEXT ===\n".concat(input.planningBlock, "\n") : '', "\n\nYou are extracting the SERMON CORE - the DNA of the sermon message.\n\n=== CONTEXT ===\nMain Passage: ").concat(input.mainPassage, "\nTheme: ").concat(input.theme, "\nSermon Goals: ").concat(input.sermonGoals, "\nAudience: ").concat(input.audienceProfile, "\n\n=== STUDY DATA ===\nMain Theological Claim: ").concat(input.mainTheologicalClaim, "\nTheological Themes: ").concat(input.theologicalThemesJson, "\nPastoral Implications: ").concat(input.pastoralImplicationsJson, "\nExegetical Summary: ").concat(input.exegeticalSummary, "\n\n=== TASK ===\nExtract the sermon core - the unified message that ties everything together.\n\nWrite in ").concat(input.languageLabel, ".\n\nReturn ONLY valid JSON:\n{\n  \"bigIdea\": \"The one sentence people should remember (e.g., 'God's grace reconciles what sin has separated.')\",\n  \"fallenCondition\": \"The human problem this sermon addresses (e.g., 'Humanity is separated from God because of sin.')\",\n  \"centralTruth\": \"The biblical truth that answers the problem (e.g., 'Through Christ we are restored into relationship with God.')\",\n  \"sermonGoal\": \"What you want the audience to do (e.g., 'Accept reconciliation through Christ.')\",\n  \"audienceNeed\": \"The specific need your audience has (e.g., 'Many feel distant from God and need assurance of His love.')\"\n}\n\nRules:\n- Each field should be 1-2 sentences maximum\n- The bigIdea must be memorable and quotable\n- The fallenCondition must connect to universal human experience\n- The centralTruth must be grounded in the passage\n- The sermonGoal must be actionable\n- The audienceNeed must be specific and pastoral");
    },
    socraticCoachQuestion: function (input) {
        return "You are a Socratic Sermon Coach. Analyze the pastor answer and respond with concise coaching feedback.\n\nLanguage: ".concat(input.languageLabel, "\nContext:\n").concat(input.context, "\n\nAnswered Question ID: ").concat(input.questionId, "\nPastor Answer:\n").concat(input.answer, "\n\nReturn ONLY valid JSON:\n{\n  \"questionId\": \"string\",\n  \"affirmation\": \"short encouragement\",\n  \"coachFeedback\": \"specific theological/exegetical feedback\",\n  \"improvementSuggestion\": \"how to strengthen sermon content\",\n  \"rewriteHint\": \"one improved sermon sentence the pastor can reuse\",\n  \"nextQuestion\": \"one follow-up Socratic question\"\n}\n\nRules:\n- Be text-faithful to the main passage.\n- If answer drifts from text, say it clearly.\n- Keep all fields short and practical.\n- No markdown, no code fences.");
    },
    socraticCoachList: function (input) {
        return "".concat(input.promptOverride, "You are a seminary-level Socratic Sermon Coach.\n\nLanguage: ").concat(input.languageLabel, "\nTask mode: ").concat(input.mode, "\nListener simulation profile: ").concat(input.listenerProfile, "\n\nContext:\n").concat(input.context, "\n\nGenerate 8 coaching questions that challenge interpretation, structure, theological clarity, application linkage, and gospel focus.\n\nReturn ONLY valid JSON:\n{\n  \"mode\": \"refine|self_reflection\",\n  \"listenerProfile\": \"string\",\n  \"summary\": \"1-2 sentence coaching summary\",\n  \"weakAreas\": [\"string\"],\n  \"questions\": [\n    {\n      \"id\": \"Q1\",\n      \"dimension\": \"text_fidelity|theological_clarity|audience_relevance|gospel_focus|structure_flow|application_strength|cross_reference_grounding|self_reflection\",\n      \"question\": \"string\",\n      \"purpose\": \"why this matters\",\n      \"sourceAnchor\": \"passage verse or outline/manuscript anchor\",\n      \"severity\": \"high|medium|low\",\n      \"listenerAngle\": \"how this listener might challenge the sermon\",\n      \"suggestedFollowUp\": \"optional follow-up prompt\"\n    }\n  ],\n  \"nextStepSuggestion\": \"one concrete refinement step\"\n}\n\nRules:\n- Questions must be specific to provided content, not generic.\n- Include at least 2 text-fidelity checks and 2 application-linkage checks.\n- Use at least 4 distinct dimensions across the 8 questions.\n- For self_reflection mode, include at least 3 spiritual formation questions.\n- Keep question text concise and pastor-friendly.\n- Do not wrap fields in extra quotes.\n- No markdown, no prose outside JSON.");
    },
    targetedRepairPatch: function (input) {
        return "You are repairing a sermon manuscript section with high precision.\n\nLanguage: ".concat(input.languageLabel, "\nTheological Lens: ").concat(input.theologicalLens, "\nMain Passage: ").concat(input.mainPassage, "\nTheme: ").concat(input.theme, "\nAudience: ").concat(input.audience, "\nIssue ID: ").concat(input.issueId, "\nIssue Type: ").concat(input.issueType, "\nSeverity: ").concat(input.severity, "\nTarget Anchor: ").concat(input.targetAnchor, "\nProposed Action: ").concat(input.proposedAction, "\nExpected Outcome: ").concat(input.expectedOutcome, "\nConversation Summary: ").concat(input.conversationSummary || 'N/A', "\n\nCurrent manuscript HTML (excerpt):\n").concat(input.manuscriptHtmlJson, "\n\nAnchor snippet to replace:\n").concat(input.snippet, "\n\nReturn ONLY valid JSON:\n{\n  \"replacement\": \"Improved text for this section in ").concat(input.languageLabel, ". Use plain text or simple HTML paragraphs.\",\n  \"why\": \"Short rationale for the change.\"\n}\n\nRules:\n- Keep biblical fidelity to ").concat(input.mainPassage, ".\n- Keep Adventist alignment if lens is adventist.\n- Keep same language as workspace.\n- Do not introduce Sunday worship framing.\n- Do not repeat the section title or anchor phrase at the start of the replacement.\n- Do not rewrite the full manuscript; patch only this targeted section.\n- No markdown, no prose outside JSON.");
    },
    manuscriptGeneration: function (input) {
        return "".concat(input.doctrinalContext, "\n\nYou are writing a sermon manuscript. The OUTLINE is your structural authority - each point carries its own assets.\n\n=== SERMON METADATA ===\n").concat(input.metadataBlock, "\n\n=== STUDY DATA (background context) ===\n").concat(input.contextJson, "\n\n=== LANGUAGE ===\nWrite entirely in ").concat(input.languageLabel, ".\n").concat(input.spanishRule, "\n\n=== CRITICAL: OUTLINE IS THE AUTHORITY ===\n\nEach sermon point carries its OWN assets. Do NOT mix assets between points.\nUse the applications, illustrations, and cross-references ATTACHED TO EACH POINT.\n\n").concat(input.pointInstructions || 'Use outline.pointNodes from the study data above.', "\n\n=== SERMON STRUCTURE ===\n\n1. INTRODUCTION\n   - Hook the audience\n   - Use studyReport.passageOverview to set the scene\n   - State the mainTheologicalClaim\n   - Use globalCrossReferences or globalEgwQuotes if helpful\n\n2. PASSAGE READING\n   - Present ").concat(input.mainPassage, "\n   - Brief transition\n\n3. CONTEXT (Literary & Historical)\n   - Use studyReport.literaryContext and historicalContext\n   - Address interpretiveChallenges if present\n\n4. MAIN POINTS (").concat(input.pointCount, " points - follow outline exactly)\n   - For EACH point, use ONLY the assets attached to that point\n   - Include word study insights from wordStudies where relevant\n   - Each point should be substantial with explanation \u2192 illustration \u2192 application\n\n5. CONCLUSION & INVITATION\n   - Synthesize the main points\n   - Restate mainTheologicalClaim\n   - Clear call to action from outline.callToAction\n\n=== QUALITY REQUIREMENTS ===\n- Manuscript must be SUBSTANTIAL (").concat(input.targetMinutes, " minutes)\n- Length target: ~").concat(input.wordTarget, " words (minimum ").concat(input.wordMin, ", maximum ").concat(input.wordMax, ")\n- Each point uses ITS OWN applications, illustrations, cross-references\n- Do NOT drift - keep assets tied to their points\n- Use word studies to add depth\n- Address interpretive challenges honestly\n- Do not invent Greek/Hebrew/Aramaic words, lexical claims, or historical details.\n- Do not invent Bible references or EGW references/citations.\n- If a detail is uncertain, omit it instead of fabricating.\n\n=== OUTPUT FORMAT ===\nReturn ONLY valid JSON:\n{\n  \"text\": \"<HTML using p,h2,h3,ul,ol,li,strong,em,br tags>\",\n  \"cues\": {\n    \"slide\": [\"string\"],\n    \"keyLine\": [\"string\"],\n    \"transition\": [\"string\"],\n    \"pause\": [\"string\"],\n    \"read\": [\"string\"],\n    \"quote\": [\"string\"],\n    \"cta\": [\"string\"]\n  }\n}\n\nHTML Guidelines:\n- Use h2 for major sections\n- Use h3 for subsections within points\n- Short paragraphs (2-4 sentences)\n- Use <strong>Label:</strong> for moves like Explanation, Application, Illustration\n- ").concat(input.includeSlideCuesLine, "\n- ").concat(input.includeKeyLinesLine, "\n- ").concat(input.formatLine);
    },
    mediaSuggestions: function (input) {
        return "You are a sermon media director.\n\nGenerate high-quality, production-ready media suggestions for sermon preparation.\n\nLanguage: ".concat(input.languageLabel, "\nContext:\n").concat(input.contextJson, "\n\nReturn ONLY valid JSON in this exact shape:\n{\n  \"mediaSuggestions\": [\n    {\n      \"type\": \"").concat(input.typeOptions, "\",\n      \"intent\": \"short intent label\",\n      \"useCase\": \"where and how the pastor should use this asset during sermon delivery\",\n      \"prompt\": \"final production prompt\"\n    }\n  ]\n}\n\nRules:\n").concat(input.localeRules, "\n- Generate 12-18 suggestions total.\n- Required minimums:\n  - Images: at least 6 (Hero, each major point, Application, Closing).\n  - Video: at least 2 (Intro Loop, Transition).\n  - Voice: at least 2 (Opening Reflection, Closing Appeal).\n  - Music: at least 2 (Theme Song, Instrumental Bed).\n  - Social: at least 4 (Instagram Post, Instagram Story, Facebook Post, WhatsApp Status).\n- Every suggestion must be concrete and usable as a prompt, not abstract advice.\n- Prompts must be context-grounded in the passage, theological focus, and audience.\n- Do NOT generate slide/presentation prompts.\n- Prioritize deliverable assets: images, videos, song audio, pastor voice audio, social promo.\n- For \"Voz Pastoral\", \"useCase\" must explain practical sermon usage (opening reflection, transition narration, closing appeal recap, etc.).\n- For image/video prompts, include visual direction details (subject, environment, symbolism, camera/framing, lighting, style, color palette).\n- For music prompts, include mode/genre/tempo/mood/instrumentation and use-case constraints.\n- For social prompts, include platform-specific framing and wording that fits each network format.\n- Keep \"intent\" short (2-6 words).\n- No markdown, no prose outside JSON, no code fences.");
    },
};
exports.WorkspacePromptRegistry = {
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
exports.WorkspacePromptEvaluationCases = Object.values(exports.WorkspacePromptRegistry).flatMap(function (entry) { return entry.evaluationCases; });
var getWorkspacePromptEvaluationCoverage = function () { return ({
    promptCount: Object.keys(exports.WorkspacePromptRegistry).length,
    evaluationCaseCount: exports.WorkspacePromptEvaluationCases.length,
    promptIds: Object.keys(exports.WorkspacePromptRegistry),
}); };
exports.getWorkspacePromptEvaluationCoverage = getWorkspacePromptEvaluationCoverage;
