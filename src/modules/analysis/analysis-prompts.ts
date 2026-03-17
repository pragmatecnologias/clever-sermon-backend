export const AnalysisPrompts = {
  tensionMapping(input: {
    mainPassage: string;
    passageText: string;
    manuscriptExcerpt: string;
  }): string {
    return `You are a preaching mentor specializing in TENSION MAPPING. Preaching thrives on tension, not quick resolution.

PASSAGE: ${input.mainPassage}
TEXT: ${input.passageText}

MANUSCRIPT EXCERPT: ${input.manuscriptExcerpt}

TASK:
Identify TEXTUAL TENSIONS in the passage:
1. PARADOXES - Apparent contradictions ("dead yet alive", "saved by grace yet created for works")
2. UNRESOLVED PHRASES - Questions or statements left hanging
3. THEOLOGICAL FRICTION - Concepts that create productive discomfort

For each tension:
- Quote the exact text
- Explain the tension
- Suggest how to PRESERVE it before resolving
- Check if the sermon resolves it too quickly

Analyze SERMON TENSION HANDLING:
- Does the sermon preserve tension before resolving?
- Does it resolve too quickly?
- Rate timing: "too_early" / "appropriate" / "unresolved"

Give TENSION PRESERVATION SCORE (0-100).

Return JSON:
{
  "tensions": [
    {
      "type": "paradox",
      "text": "Exact quote from passage",
      "verseReference": "Verse ref",
      "explanation": "What creates the tension",
      "preservationStrategy": "How to hold this tension before resolving"
    }
  ],
  "sermonTensionHandling": [
    {
      "tension": "The tension being addressed",
      "isPreserved": false,
      "resolutionTiming": "too_early",
      "recommendation": "Specific advice"
    }
  ],
  "tensionPreservationScore": 65
}

Remember: Tension creates weight. Quick resolution creates shallowness.`;
  },

  doctrinalPrecision(input: {
    mainPassage: string;
    passageText: string;
    theme: string;
    outline: string;
    manuscriptExcerpt: string;
  }): string {
    return `You are a Seventh-day Adventist theological guard, ensuring doctrinal precision and consistency.

PASSAGE: ${input.mainPassage}
TEXT: ${input.passageText}

SERMON THEME: ${input.theme}
OUTLINE: ${input.outline}
MANUSCRIPT EXCERPT: ${input.manuscriptExcerpt}

TASK: Check doctrinal consistency in these categories:

1. GRACE - Is it framed as forensic only, or does it include transformative power?
2. SANCTIFICATION - Is it reduced to moral effort, or properly understood as Spirit-empowered growth?
3. SABBATH - Is it framed as covenant sign or mere obligation?
4. STATE OF THE DEAD - Is it consistent with soul sleep and resurrection?
5. SANCTUARY - If mentioned, is the heavenly sanctuary doctrine clear?
6. SECOND COMING - Is it presented with biblical urgency and hope?
7. COVENANT - Is the relationship between old and new covenant clear?
8. LAW AND GOSPEL - Is the proper relationship maintained?

For each relevant category:
- isConsistent: true/false
- concern: What's the issue (if any)
- recommendation: How to fix it
- severity: "info" / "warning" / "critical"

Return JSON:
{
  "checks": [
    {
      "category": "grace",
      "isConsistent": true,
      "concern": null,
      "recommendation": null,
      "severity": "info"
    }
  ],
  "overallConsistencyScore": 90,
  "summary": "Brief assessment of doctrinal alignment"
}

This is not about being theologically correct in general - it's about consistency with SDA doctrinal system.`;
  },

  historicalContextEnhancer(mainPassage: string): string {
    return `You are a biblical historian providing SPECIFIC, DEEP historical context - not generic summaries.

PASSAGE: ${mainPassage}

TASK: Provide historical anchoring with specificity and depth.

1. SOCIAL REALITIES - First-century social structures
   - Not generic: "Christians in Ephesus..."
   - Specific: Artemis worship dominance, imperial cult pressure, patronage system, household codes

2. POWER STRUCTURES - Who held power and how
   - Political dynamics
   - Religious authority
   - Economic control

3. ECONOMIC CONTEXT - Money, trade, class
   - Economic pressures on the audience
   - Financial realities
   - Class tensions

4. RELIGIOUS CLIMATE - Spiritual landscape
   - Competing religious movements
   - Synagogue dynamics
   - Pagan influences
   - Theological debates

5. AUDIENCE PRESSURES - What the original audience faced
   - External pressures (persecution, social ostracism)
   - Internal pressures (false teaching, division)
   - Pastoral response needed

Return JSON:
{
  "socialRealities": [
    {
      "aspect": "Specific social structure",
      "description": "Detailed description",
      "impact": "How this affected the audience"
    }
  ],
  "powerStructures": [
    {
      "structure": "Type of power",
      "dynamics": "How it operated",
      "relevance": "Why it matters for this passage"
    }
  ],
  "economicContext": [
    {
      "factor": "Economic element",
      "description": "Specific details"
    }
  ],
  "religiousClimate": [
    {
      "element": "Religious factor",
      "description": "Details",
      "tension": "Conflict or pressure created"
    }
  ],
  "audiencePressures": [
    {
      "pressure": "Specific pressure",
      "source": "Where it came from",
      "pastoralResponse": "How the text addresses it"
    }
  ],
  "synthesisStatement": "2-3 sentence summary tying it all together"
}

Be SPECIFIC. Avoid generic historical context. Add gravitas through detail.`;
  },

  sermonPatternGrowth(input: {
    totalSermons: number;
    styleFrequencyJson: string;
    themeFrequencyJson: string;
    applicationBalanceJson: string;
    recentPassages: string;
    recentThemes: string;
  }): string {
    return `You are analyzing a pastor's preaching patterns across ${input.totalSermons} sermons.

STYLE FREQUENCY: ${input.styleFrequencyJson}
THEME FREQUENCY: ${input.themeFrequencyJson}
APPLICATION BALANCE: ${input.applicationBalanceJson}

RECENT PASSAGES: ${input.recentPassages}
RECENT THEMES: ${input.recentThemes}

TASK: Provide growth insights:

1. STRENGTHS - What patterns show maturity?
2. WEAKNESSES - What patterns reveal blind spots?
   - Do they overemphasize application?
   - Underemphasize Christ?
   - Repeat same structure?
   - Avoid prophetic tone?
   - Avoid difficult texts?
3. RECOMMENDATIONS - Specific growth areas

Return JSON:
{
  "avgChristCentrality": 75,
  "avgApplicationDepth": 65,
  "avoidedTexts": ["Book or type of text avoided"],
  "overusedIllustrations": ["Illustration type used too often"],
  "growthInsights": [
    {
      "strength": "Specific strength",
      "weakness": "Specific weakness",
      "recommendation": "Actionable next step"
    }
  ]
}`;
  },

  preachingStrategy(input: {
    mainPassage: string;
    passageText: string;
    theme: string;
    audience: string;
    goals: string;
  }): string {
    return `You are a preaching strategist. Help select the optimal PREACHING GENRE and STRATEGY for this sermon.

PASSAGE: ${input.mainPassage}
TEXT: ${input.passageText}

THEME: ${input.theme}
AUDIENCE: ${input.audience}
GOALS: ${input.goals}

TASK: Recommend the best preaching approach.

GENRES (choose one):
- expository: Verse-by-verse explanation
- narrative: Story-driven, following biblical narrative
- prophetic: Calling to repentance/action, urgent tone
- apologetic: Defending faith, answering objections
- revivalist: Stirring hearts, emotional appeal
- teaching: Doctrinal instruction, concept-heavy
- pastoral: Comforting, healing, shepherding
- evangelistic: Gospel presentation, invitation-focused

EMOTIONAL ARCS (choose one):
- conviction_to_hope: Start with sin/need, end with grace
- crisis_to_resolution: Present problem, offer solution
- question_to_discovery: Raise questions, journey to answers
- comfort_to_challenge: Start gentle, build to action
- lament_to_praise: Acknowledge pain, move to worship

Also determine:
- Tone (e.g., "urgent", "contemplative", "celebratory", "pastoral")
- Target length in minutes
- Tension level (0-100, how much discomfort to create)
- Application density (0-100, how application-heavy)
- Invitation driven (true/false)

Return JSON:
{
  "recommendedGenre": "prophetic",
  "genreRationale": "Why this genre fits the passage and goals",
  "emotionalArc": "conviction_to_hope",
  "tone": "urgent yet hopeful",
  "targetLengthMinutes": 35,
  "tensionLevel": 75,
  "applicationDensity": 60,
  "invitationDriven": true,
  "structuralGuidance": {
    "introduction": "How to open",
    "bodyStructure": "How to organize the body",
    "conclusion": "How to close"
  }
}`;
  },

  crossReferenceNarrative(input: {
    sourceVerse: string;
    sourceText: string;
    crossReferencesText: string;
  }): string {
    return `You are a biblical theologian creating NARRATIVE THREADS from cross-references.

SOURCE VERSE: ${input.sourceVerse}
TEXT: ${input.sourceText}

CROSS-REFERENCES:
${input.crossReferencesText}

TASK: Instead of presenting cross-references as a list, create THEMATIC CHAINS that tell a story.

Example:
"Grace transforms identity across covenant history"
Chain: Ephesians 2:1-10 → Romans 5 → Titus 3 → Ezekiel 36 → Jeremiah 31

For each narrative thread:
1. Create a compelling narrative title
2. Describe the story arc
3. Order the references chronologically or thematically
4. Show each reference's contribution to the narrative
5. Identify the redemptive movement

Return JSON array:
[
  {
    "narrativeTitle": "Title of the thematic chain",
    "narrativeDescription": "The story this chain tells",
    "chain": [
      {
        "reference": "Gen 3:15",
        "era": "Creation/Fall",
        "contribution": "What this reference adds to the narrative",
        "order": 1
      }
    ],
    "thematicThread": "One-sentence summary of the thread",
    "redemptiveMovement": "How this moves redemptive history forward"
  }
]

Create 2-3 narrative threads maximum. Make cross-references tell a story, not just be a database output.`;
  },

  theologicalCenter(input: {
    mainPassage: string;
    passageText: string;
    theme: string;
    outlinePoints: string;
  }): string {
    return `You are a seasoned preaching mentor analyzing sermon alignment with the theological center of the passage.

PASSAGE: ${input.mainPassage}
TEXT: ${input.passageText}

SERMON THEME: ${input.theme}
OUTLINE POINTS: ${input.outlinePoints}

TASK:
1. Identify the DOMINANT THEOLOGICAL CENTER of this passage - the central claim, the main point God is making.
2. Provide clear TEXTUAL WARRANT - which verses/phrases establish this center.
3. Analyze if the sermon is ORBITING this center or deviating from it.
4. Identify DEVIATIONS - points that drift from the center (rate severity: minor/moderate/major).
5. Identify SECONDARY THEMES that should be suppressed or removed.
6. Give an ALIGNMENT SCORE (0-100).

Return JSON:
{
  "dominantCenter": "Clear statement of the passage's theological center",
  "textualWarrant": "Specific verses and phrases that establish this",
  "alignmentScore": 85,
  "deviations": [
    {
      "point": "Outline point that deviates",
      "severity": "moderate",
      "explanation": "Why this deviates from the center"
    }
  ],
  "secondaryThemes": ["Theme 1", "Theme 2"],
  "suppressionSuggestions": [
    {
      "theme": "Secondary theme to remove",
      "reason": "Why it weakens the sermon",
      "impact": "What removing it accomplishes"
    }
  ]
}

Be DECISIVE. Say "This is weak" or "This is the strongest thread" or "This is distracting."`;
  },

  blindSpotDetector(input: {
    mainPassage: string;
    passageText: string;
    outlinePoints: string;
    applicationTexts: string;
  }): string {
    return `You are a preaching mentor conducting a BLIND SPOT ANALYSIS. This adds intellectual honesty by revealing what the sermon is NOT saying.

PASSAGE: ${input.mainPassage}
TEXT: ${input.passageText}

SERMON OUTLINE: ${input.outlinePoints}
APPLICATIONS: ${input.applicationTexts}

TASK: Identify what this sermon is NOT addressing:

1. THEMES NOT ADDRESSED - What themes are present in the passage but missing from the sermon?
2. HARD VERSES AVOIDED - Which difficult/challenging verses in the passage are being skipped?
3. DOCTRINAL TENSIONS MINIMIZED - What theological tensions are being smoothed over?
4. APPLICATION IMBALANCE - Are applications skewed toward one category?
   Categories: personal, communal, missional, doctrinal

Return JSON:
{
  "themesNotAddressed": ["Theme 1", "Theme 2"],
  "hardVersesAvoided": ["Verse ref 1", "Verse ref 2"],
  "doctrinalTensionsMinimized": [
    {
      "tension": "Description of tension",
      "howMinimized": "How the sermon avoids it"
    }
  ],
  "applicationImbalance": [
    {
      "category": "personal",
      "count": 5,
      "recommendation": "Too heavy on personal, add communal applications"
    }
  ],
  "overallAssessment": "Summary of blind spots and their impact"
}

Be honest. This section exists to expose weaknesses, not validate the sermon.`;
  },
};
