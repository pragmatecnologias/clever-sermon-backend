export const ScripturePrompts = {
  interpretiveHighlights(input: { reference: string; verseText: string }): string {
    return `Analyze this Bible verse for interpretive challenges. Return JSON only.

Reference: ${input.reference}
Text: ${input.verseText}

Identify phrases with:
1. Grammatical ambiguity (unclear syntax or word meaning)
2. Theological debate (different doctrinal interpretations)
3. Textual variants (manuscript differences)
4. Contextual tension (apparent contradictions or difficult passages)

Return JSON array:
[
  {
    "phrase": "exact phrase from text",
    "type": "grammatical_ambiguity|theological_debate|textual_variant|contextual_tension",
    "options": [
      {
        "view": "interpretation name",
        "explanation": "brief explanation",
        "proponents": ["tradition or scholar"]
      }
    ],
    "significance": "why this matters"
  }
]

Rules:
- Only include genuine scholarly debates
- Be honest about uncertainty
- Cite specific traditions when possible
- No markdown, just JSON`;
  },

  crossReferenceRefine(input: { sourceVerse: string; sourceText: string; candidatesJson: string }): string {
    return `Refine these ranked biblical cross references for preaching use.

Source Verse: ${input.sourceVerse}
Source Text: ${input.sourceText}

Candidates JSON:
${input.candidatesJson}

Return JSON array of same length and order with fields:
[
  {
    "reference": "string",
    "category": "thematic|quotation|typology|prophetic_fulfillment|narrative_continuation|interpretive_tension|lexical",
    "tier": "primary|secondary|illustrative",
    "relevanceScore": 0-100,
    "connectionExplanation": "short explanation",
    "themes": ["theme1","theme2"]
  }
]

Rules:
- Keep references unchanged.
- Improve explanation clarity for sermon use.
- Keep categories/tier conservative.
- Return JSON only.`;
  },

  perVerseContext(input: { languageInstruction: string; reference: string; passageText: string }): string {
    return `${input.languageInstruction} Devuelve solo JSON válido. Eres un erudito bíblico que da contexto histórico, cultural y geográfico.

Reference: ${input.reference}

Passage Text:
${input.passageText}

Formato JSON:
{
  "historical": [
    {
      "note": "Historical fact or background",
      "period": "Time period (e.g., 'United Monarchy Period', 'c. 1025 BC')",
      "source": "Biblical reference or historical source (optional)"
    }
  ],
  "cultural": [
    {
      "note": "Cultural practice, custom, or belief",
      "category": "custom|law|practice|belief|social",
      "source": "Biblical reference (optional)"
    }
  ],
  "geographical": [
    {
      "place": "Place name",
      "description": "Description of the place",
      "significance": "Biblical or historical significance",
      "modernLocation": "Modern location (optional)"
    }
  ],
  "timeline": [
    {
      "event": "Event name",
      "date": "Approximate date",
      "significance": "Why this event matters"
    }
  ]
}

Reglas:
- 2-3 notas históricas.
- 2-3 notas culturales.
- 1-2 notas geográficas.
- 1-2 eventos cronológicos.
- Sin markdown ni texto fuera del JSON.`;
  },

  interpretiveChallengesData(input: { languageInstruction: string; passage: string; passageText: string }): string {
    return `${input.languageInstruction} Devuelve solo JSON válido. Eres un erudito bíblico que identifica tensiones interpretativas y perspectivas teológicas.

Passage Reference: ${input.passage}

Passage Text:
${input.passageText}

Formato JSON:
{
  "challenge": "Main interpretive question or difficulty",
  "views": [
    {
      "viewName": "Name of interpretive view",
      "summary": "Brief summary of this view",
      "proponents": "Optional: who holds this view",
      "keyArguments": ["Argument 1", "Argument 2", "Argument 3"]
    }
  ],
  "sdaPerspective": {
    "position": "SDA theological position",
    "reasoning": "Why SDA theology holds this position",
    "supportingTexts": ["Reference 1", "Reference 2"]
  }
}

Reglas:
- Devuelve 2-4 perspectivas reales.
- Cada perspectiva debe tener 2-3 argumentos breves.
- Si no hay desafío importante, usa null en challenge.
- No uses markdown ni texto fuera del JSON.`;
  },

  structuralAnalysis(input: { languageInstruction: string; passage: string; passageText: string }): string {
    return `${input.languageInstruction}

You are a biblical scholar analyzing the literary structure of scripture passages.

Passage Reference: ${input.passage}

Passage Text:
${input.passageText}

Provide a detailed structural analysis in the following JSON format:
{
  "literaryGenre": "Genre (e.g., Narrative, Poetry, Apocalyptic, Legal, Wisdom, Gospel, Epistle)",
  "structure": [
    {
      "verses": "verse range",
      "type": "introduction|body|conclusion|transition|climax|inclusio",
      "description": "Description of this structural element"
    }
  ],
  "chiasm": {
    "pattern": "Pattern notation (e.g., A-B-C-B'-A')",
    "elements": [
      {
        "label": "A",
        "verses": "verse range",
        "content": "Brief description"
      }
    ]
  },
  "parallelism": [
    {
      "type": "synonymous|antithetic|synthetic|emblematic",
      "verses": "verse range",
      "lineA": "First line",
      "lineB": "Second line"
    }
  ]
}

Guidelines:
- Identify the literary genre accurately
- Break down the passage into 3-6 structural elements
- Note transitions, climaxes, and literary devices
- ALWAYS create a chiastic structure with at least 3 elements (A-B-A' minimum), even if the passage doesn't have an obvious chiasm - identify thematic or conceptual parallels
- For poetry, identify parallelism patterns when present
- Parallelism is optional - only include if clearly present
- Return ONLY valid JSON, no markdown or extra text`;
  },

  verseContextualCommentary(input: { languageInstruction: string; reference: string; languageLabel: string }): string {
    return `${input.languageInstruction} Provide a brief 2-3 sentence contextual overview of ${input.reference}. Include:
- What is happening in this passage
- Where it fits in the book/narrative
- Key theological significance

Be concise and pastor-focused. Language: ${input.languageLabel}`;
  },

  verseLlmCommentary(input: { languageInstruction: string; reference: string; languageLabel: string }): string {
    return `${input.languageInstruction} You are a biblical scholar providing verse commentary for pastors.

Analyze ${input.reference} and provide 3-4 concise commentary notes covering:

1. **Context**: What's happening in this passage? Where does it fit in the book?
2. **Key Words**: Any significant Greek/Hebrew words or phrases worth noting?
3. **Historical/Cultural**: Relevant historical or cultural background
4. **Theological**: Main theological significance or application

Format as JSON:
{
  "notes": [
    {
      "type": "context" | "word" | "historical" | "theological",
      "content": "...",
      "source": "..."
    }
  ]
}

Keep each note to 2-3 sentences. Be practical and pastor-focused. Language: ${input.languageLabel}`;
  },

  basicStructuralAnalysis(input: { reference: string; passageText: string }): string {
    return `Analyze the passage structure and return JSON only.

Passage: ${input.reference}

Text:
${input.passageText}

Return JSON with keys:
{
  "repeatedPhrases": ["..."],
  "imperatives": ["..."],
  "promises": ["..."],
  "conditions": ["..."],
  "narrativeShifts": ["..."],
  "literaryMarkers": ["..."],
  "chiasticStructure": "...",
  "outline": ["Verse: Summary"]
}

Rules:
- Ground all points in verses.
- If unsure, say so in the relevant field.
- No markdown.`;
  },

  basicInterpretiveChallenges(input: { reference: string; passageText: string }): string {
    return `Identify interpretive challenges or debated phrases in this passage.

Passage: ${input.reference}
Text:
${input.passageText}

Return ONLY JSON:
{
  "challenges": [
    {
      "phrase": "...",
      "issue": "...",
      "views": ["...", "..."],
      "verses": ["Book 1:1"]
    }
  ]
}

Rules:
- Include verses for each challenge.
- If none, return an empty array.
- No markdown.`;
  },

  wordStudyInsights(input: {
    word: string;
    language: string;
    context: string;
    outputLanguageLabel: string;
  }): string {
    return `Provide advanced word study insights as JSON only.

Word: ${input.word}
Language: ${input.language}
Context: ${input.context}
Output Language: ${input.outputLanguageLabel}

Return JSON:
{
  "rootWord": "...",
  "semanticRange": ["..."],
  "grammarInsights": {
    "tense": "...",
    "voice": "...",
    "mood": "...",
    "case": "...",
    "number": "...",
    "gender": "...",
    "notes": "..."
  },
  "nuanceNotes": ["..."],
  "commonTranslations": ["..."],
  "exampleReferences": ["Book 1:1"]
}

Rules:
- If unsure, say so in the relevant field.
- All human-readable values must be written in ${input.outputLanguageLabel}.
- No markdown, no extra commentary.`;
  },

  wordStudySuggestions(input: {
    sourceLanguageLabel: string;
    reference: string;
    passageText: string;
    outputLanguageLabel: string;
    sourceLanguage: string;
  }): string {
    return `Extract the most important ${input.sourceLanguageLabel} study words for this Bible passage.

Reference: ${input.reference}
Passage Text:
${input.passageText}
Output language for gloss/reason: ${input.outputLanguageLabel}

Return JSON only:
[
  {
    "term": "string",
    "transliteration": "string",
    "gloss": "string",
    "reason": "short reason this term matters for interpreting the passage",
    "language": "${input.sourceLanguage}"
  }
]

Rules:
- Return 5-8 terms max.
- Prioritize doctrinally central and structurally central terms.
- Do not return duplicates.
- No markdown, no commentary.`;
  },

  translateTextToSpanish(input: string): string {
    return `Translate to Spanish.

Rules:
- Keep Greek/Hebrew words, Strong's identifiers, and Bible references unchanged.
- Return only the translated text, no quotes, no markdown.

Text:
${input}`;
  },

  translationComparisonRepair(input: { rawResponse: string; isSpanish: boolean }): string {
    if (input.isSpanish) {
      return `Convierte la siguiente respuesta en JSON VÁLIDO con esta forma exacta.
No inventes contenido. Si falta algo, usa arreglos vacíos y una oración breve en overallAssessment.
Devuelve SOLO JSON.

{
  "keyDifferences": [
    {
      "category": "theological_term",
      "translations": [],
      "difference": "",
      "explanation": "",
      "significance": "medium"
    }
  ],
  "analysis": {
    "verbDifferences": [],
    "theologicalTermDifferences": [],
    "literalVsDynamic": [],
    "overallAssessment": ""
  }
}

RESPUESTA ORIGINAL:
${input.rawResponse}`;
    }

    return `Convert the following response into VALID JSON with this exact shape.
Do not invent content. If data is missing, use empty arrays and a short overallAssessment sentence.
Return ONLY JSON.

{
  "keyDifferences": [
    {
      "category": "theological_term",
      "translations": [],
      "difference": "",
      "explanation": "",
      "significance": "medium"
    }
  ],
  "analysis": {
    "verbDifferences": [],
    "theologicalTermDifferences": [],
    "literalVsDynamic": [],
    "overallAssessment": ""
  }
}

ORIGINAL RESPONSE:
${input.rawResponse}`;
  },

  translationComparisonAnalyze(input: {
    isSpanish: boolean;
    reference: string;
    translationTexts: string;
  }): string {
    if (input.isSpanish) {
      return `Responde ÚNICAMENTE en español. No uses inglés en ningún campo de texto (difference, explanation, analysis, overallAssessment, etc.).
Eres un erudito bíblico que analiza diferencias de traducción para pastores.

**Pasaje**: ${input.reference}

**Traducciones**:
${input.translationTexts}

Analiza las diferencias clave entre estas traducciones y entrega:

1. **Diferencias clave**: 3-5 diferencias significativas (términos teológicos, verbos, adiciones/omisiones, literal vs dinámico)
2. **Análisis**:
   - Diferencias verbales
   - Diferencias de términos teológicos
   - Enfoque literal vs dinámico
   - Evaluación general

Formato JSON:
{
  "keyDifferences": [
    {
      "category": "theological_term" | "verb_difference" | "literal_vs_dynamic" | "addition_omission",
      "translations": ["RVR1960: texto", "NBLA: texto"],
      "difference": "Descripción breve en español",
      "explanation": "Explicación detallada en español",
      "significance": "high" | "medium" | "low"
    }
  ],
  "analysis": {
    "verbDifferences": ["diferencia 1"],
    "theologicalTermDifferences": ["diferencia 1"],
    "literalVsDynamic": ["observación 1"],
    "overallAssessment": "Resumen general en español"
  }
}

Sé conciso, práctico y pastoral. Devuelve SOLO JSON válido.`;
    }

    return `Respond in English. You are a biblical scholar analyzing translation differences for pastors.

**Passage**: ${input.reference}

**Translations**:
${input.translationTexts}

Analyze the key differences between these translations and provide:

1. **Key Differences**: 3-5 significant differences (theological terms, verb choices, additions/omissions, literal vs dynamic)
2. **Analysis**:
   - Verb differences
   - Theological term differences
   - Literal vs dynamic translation approaches
   - Overall assessment

Format as JSON:
{
  "keyDifferences": [
    {
      "category": "theological_term" | "verb_difference" | "literal_vs_dynamic" | "addition_omission",
      "translations": ["KJV: text", "NIV: text"],
      "difference": "Brief description",
      "explanation": "Detailed explanation",
      "significance": "high" | "medium" | "low"
    }
  ],
  "analysis": {
    "verbDifferences": ["difference 1", "difference 2"],
    "theologicalTermDifferences": ["difference 1"],
    "literalVsDynamic": ["observation 1"],
    "overallAssessment": "Summary of main differences and their significance"
  }
}

Be concise, practical, and pastor-focused. Highlight differences that affect interpretation or application.`;
  },

  translationComparisonSpanishEnforcer(resultJson: string): string {
    return `Traduce al español TODOS los valores de texto del siguiente JSON.
No cambies claves, estructura, categorías ni niveles de significancia.
Devuelve SOLO JSON válido.

JSON:
${resultJson}`;
  },

  canonicalThemes(input: {
    languageInstruction: string;
    reference: string;
    passageText: string;
  }): string {
    return `${input.languageInstruction}You are a biblical scholar identifying canonical themes that trace through Scripture.

Passage Reference: ${input.reference}

Passage Text:
${input.passageText}

Identify 3-4 major theological themes in this passage and trace them across Scripture.

JSON format:
{
  "themes": [
    {
      "theme": "...",
      "description": "...",
      "explanation": "...",
      "canonicalMovement": "...",
      "category": "...",
      "verses": [
        {
          "reference": "...",
          "snippet": "...",
          "explanation": "...",
          "stage": "...",
          "testament": "...",
          "era": "..."
        }
      ]
    }
  ]
}

Rules:
- Use 4-6 verses per theme.
- Include the current passage in one verse list entry with "YOU ARE HERE".
- Keep themes theologically meaningful and canonically progressive.
- No markdown or extra text.`;
  },

  passageSummary(input: {
    languageInstruction: string;
    reference: string;
    passageText: string;
  }): string {
    return `${input.languageInstruction} You are a biblical scholar providing interpretive guidance for pastors studying Scripture.

Passage Reference: ${input.reference}

Passage Text:
${input.passageText}

Analyze this passage and provide:

1. **Summary** (2-3 sentences): What happens in this passage? What is the basic content?

2. **Passage Movement** (if narrative, 3-5 steps): Break down the flow of the passage step by step. If it's not narrative (e.g., poetry, epistle), skip this section.

3. **Interpretive Center** (1-2 sentences): What is the theological heart of this passage? What is the main claim or truth being communicated?

4. **Main Tension** (1-2 sentences): What is the primary theological or interpretive tension in this passage? What question or difficulty does it raise?

Format your response as JSON:
{
  "summary": "...",
  "movement": ["step 1", "step 2", "step 3"] or [],
  "interpretiveCenter": "...",
  "mainTension": "..."
}

Be concise, theologically precise, and pastor-focused.`;
  },

  studySynthesis(input: {
    languageInstruction: string;
    reference: string;
    passageText: string;
  }): string {
    return `${input.languageInstruction} You are a biblical theologian synthesizing study insights for pastors preparing sermons.

Passage Reference: ${input.reference}

Passage Text:
${input.passageText}

After analyzing this passage through multiple interpretive lenses (structure, context, themes, challenges), provide a unified theological synthesis:

1. **Central Claim** (1-2 sentences): What is the core theological truth this passage communicates? State it as a clear, declarative claim.

2. **Canonical Significance** (2-3 sentences): How does this passage fit into the larger biblical storyline? What role does it play in God's unfolding revelation?

3. **Pastoral Takeaway** (2-3 sentences): What does this passage mean for God's people today? How should it shape faith and practice?

4. **Preaching Focus** (1-2 sentences): What is the sermon-ready angle? What should a pastor emphasize when preaching this text?

Format your response as JSON:
{
  "centralClaim": "...",
  "canonicalSignificance": "...",
  "pastoralTakeaway": "...",
  "preachingFocus": "..."
}

Be theologically precise, pastorally practical, and sermon-focused.`;
  },

  sanctuaryOrProphecyConnections(input: {
    mode: 'sanctuary' | 'prophecy';
    languageInstruction: string;
    passage: string;
    passageText: string;
  }): string {
    if (input.mode === 'sanctuary') {
      return `${input.languageInstruction}

You are a Seventh-day Adventist biblical theologian.
Task: Generate sanctuary connections for the passage below, following Adventist doctrine only.
Do not use non-Adventist interpretive frameworks.
Ground every connection in explicit Scripture references.

Passage: ${input.passage}
Passage Text:
${input.passageText}

Return JSON exactly in this shape:
{
  "connections": [
    {
      "sourcePassage": "Book X:Y-Z",
      "targetPassages": ["Book A:B-C", "Book D:E-F"],
      "connectionType": "type_antitype|parallel|fulfillment|thematic",
      "description": "1-2 sentences, Adventist framing only"
    }
  ]
}

Rules:
- Return 1 to 5 connections.
- Keep description concise and specific.
- Use only canonical Bible references.
- connectionType must be one of: type_antitype, parallel, fulfillment, thematic.
- No extra fields.`;
    }

    return `${input.languageInstruction}

You are a Seventh-day Adventist biblical theologian.
Task: Generate prophecy connections for the passage below, following Adventist doctrine only.
Do not use non-Adventist interpretive frameworks.
Ground every connection in explicit Scripture references.

Passage: ${input.passage}
Passage Text:
${input.passageText}

Return JSON exactly in this shape:
{
  "connections": [
    {
      "passage": "Book X:Y-Z",
      "connectedPassages": ["Book A:B-C", "Book D:E-F"],
      "theme": "short Adventist prophetic theme",
      "description": "1-2 sentences, Adventist framing only"
    }
  ]
}

Rules:
- Return 1 to 5 connections.
- Keep theme and description concise and specific.
- Use only canonical Bible references.
- No extra fields.`;
  },
};
