type NamedItem = Record<string, unknown>

const clean = (value: unknown, fallback = '') => String(value ?? fallback).trim()

export const extractBookName = (reference: string) => {
  const match = clean(reference).match(/^(.+?)\s+\d/)
  return clean(match?.[1] || reference).replace(/\s+/g, ' ').trim()
}

export const getPassageLead = (text: string, limit = 180) => {
  const compact = clean(text)
    .replace(/\s+/g, ' ')
    .trim()
  if (!compact) return ''
  const firstSentence = compact.split(/(?<=[.!?])\s+/)[0] || compact
  return firstSentence.length > limit ? `${firstSentence.slice(0, limit - 1)}…` : firstSentence
}

export const buildFallbackPassageSummary = (reference: string, passageText: string, language?: string) => {
  const lead = getPassageLead(passageText, 220)
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  return {
    passage: reference,
    summary: lead
      ? `${lead} The passage is not just a statement of truth; it is also a call to response and trust in God's character. For preaching, keep the emotional weight and the gospel invitation in view rather than reducing it to a slogan.`
      : isSpanish
        ? 'Este pasaje resume el mensaje central de la referencia seleccionada. También llama a una respuesta concreta de fe, esperanza y obediencia. Predícalo como una verdad pastoral, no solo como una cita breve.'
        : 'This passage summarizes the central message of the selected reference. It also calls for a concrete response of faith, hope, and obedience. Preach it as a pastoral word, not just a short quotation.',
    interpretiveCenter: isSpanish
      ? 'La idea central del pasaje queda resaltada por el texto principal y por el tipo de respuesta que exige. La gracia de Dios y la respuesta humana no compiten; se iluminan mutuamente.'
      : 'The passage centers on the main claim of the text and the response it calls for. Divine grace and human response do not compete here; they illuminate each other.',
    mainTension: isSpanish
      ? 'La tensión principal está entre la promesa del texto y la respuesta humana que pide. El predicador debe sostener ambas cosas con claridad: lo que Dios ofrece y lo que el oyente debe hacer.'
      : 'The main tension lies between the promise of the text and the human response it seeks. The preacher must hold both sides clearly: what God offers and what the hearer is called to do.',
    movement: lead
      ? [
          lead,
          isSpanish
            ? 'Expón la afirmación central del pasaje con precisión.'
            : 'State the passage’s central claim with precision.',
          isSpanish
            ? 'Muestra cómo la promesa conduce a una respuesta de fe.'
            : 'Show how the promise leads to a response of faith.',
        ]
      : isSpanish
        ? ['Leer el texto principal en su contexto inmediato.', 'Identificar la afirmación central del pasaje.', 'Conectar la verdad bíblica con la respuesta pastoral.', 'Aplicar el mensaje al sermón.']
        : ['Read the main text in its immediate context.', 'Identify the passage’s central claim.', 'Connect the biblical truth to the pastoral response.', 'Apply the message in preaching.'],
    dataSource: 'llm-generated' as const,
  }
}

export const buildFallbackStudySynthesis = (reference: string, passageText: string, language?: string) => {
  const lead = getPassageLead(passageText, 220)
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  return {
    passage: reference,
    centralClaim: lead
      ? `${lead} The passage therefore functions as a gospel summary that both reveals God's heart and invites a decision. It is the kind of text that should shape the sermon’s big idea, appeal, and closing call.`
      : isSpanish
        ? 'El pasaje declara la verdad principal del texto y su llamado pastoral. Presenta la revelación de Dios junto con la respuesta de fe que el oyente debe considerar.'
        : 'The passage declares the text’s main truth and its pastoral call. It presents God’s revelation together with the faith response the listener must consider.',
    canonicalSignificance: isSpanish
      ? 'Conecta la lectura actual con el hilo canónico del evangelio y la gracia. El texto no flota aislado; se une al testimonio bíblico más amplio sobre salvación, fe y nueva vida.'
      : 'Connects the passage to the canonical thread of the gospel and grace. The text does not float in isolation; it joins the wider biblical witness about salvation, faith, and new life.',
    pastoralTakeaway: isSpanish
      ? 'Invita a responder con fe, esperanza y obediencia. También anima al predicador a ofrecer consuelo real sin diluir la verdad del texto.'
      : 'Invites a response of faith, hope, and obedience. It also calls the preacher to offer real comfort without diluting the text’s truth.',
    preachingFocus: isSpanish
      ? 'Predicar la verdad central con claridad, ritmo pastoral y aplicación práctica. El sermón debe moverse desde la exposición del texto hacia una respuesta concreta de fe.'
      : 'Preach the central truth with clarity, pastoral rhythm, and practical application. The sermon should move from exposition of the text to a concrete response of faith.',
    dataSource: 'llm-generated' as const,
  }
}

export const buildFallbackStructuralAnalysis = (reference: string, passageText: string, language?: string) => {
  const lead = getPassageLead(passageText, 160)
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const intro = isSpanish
    ? 'Introducción: presenta la verdad principal del pasaje y sitúa al oyente en su peso pastoral.'
    : 'Introduction: introduces the passage’s central claim and frames its pastoral weight.'
  const body = isSpanish
    ? lead || 'Cuerpo: desarrolla la afirmación central con claridad y progresión.'
    : lead || 'Body: develops the central claim with clarity and progression.'
  const conclusion = isSpanish
    ? 'Conclusión: conduce del contenido bíblico a la respuesta de fe y obediencia.'
    : 'Conclusion: moves from biblical content to a response of faith and obedience.'
  return {
    passage: reference,
    literaryGenre: isSpanish ? 'Narrativa / Exposición' : 'Narrative / Expository',
    structure: [
      {
        verses: reference,
        type: 'introduction' as const,
        description: intro,
      },
      {
        verses: reference,
        type: 'body' as const,
        description: body,
      },
      {
        verses: reference,
        type: 'conclusion' as const,
        description: conclusion,
      },
    ],
    dataSource: 'llm-generated' as const,
  }
}

export const buildFallbackVerseContext = (
  reference: string,
  passageText: string,
  language?: string,
  bookMetadata?: NamedItem | null,
  historical?: NamedItem | null,
  cultural?: NamedItem | null,
  geography?: NamedItem | null,
  timeline?: NamedItem | null,
) => {
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const book = extractBookName(reference)
  const historicalNote = clean(historical?.summary || historical?.description || bookMetadata?.summary || bookMetadata?.description)
  const culturalNote = clean(cultural?.summary || cultural?.description || bookMetadata?.cultural || bookMetadata?.audience)
  const geoNote = clean(geography?.summary || geography?.description || geography?.significance)
  const timelineNote = clean(timeline?.summary || timeline?.description || timeline?.event)
  const lead = getPassageLead(passageText, 160)

  return {
    reference,
    historical: [
      {
        note: historicalNote || (isSpanish
          ? `El pasaje pertenece al marco literario de ${book} y debe leerse dentro de su flujo narrativo o doctrinal inmediato.`
          : `The passage belongs to the literary setting of ${book} and should be read inside its immediate narrative or doctrinal flow.`),
        period: isSpanish ? 'Contexto bíblico' : 'Biblical context',
        source: 'fallback',
      },
      {
        note: isSpanish
          ? 'Este contexto ayuda al predicador a distinguir entre el versículo aislado y el mensaje completo del capítulo.'
          : 'This context helps the preacher distinguish the isolated verse from the chapter’s full message.',
        period: isSpanish ? 'Lectura pastoral' : 'Pastoral reading',
        source: 'fallback',
      },
    ],
    cultural: [
      {
        note: culturalNote || (isSpanish
          ? `El lenguaje del pasaje refleja su audiencia y propósito en ${book}, y por eso conviene evitar lecturas apresuradas.`
          : `The passage language reflects its audience and purpose in ${book}, so rushed readings should be avoided.`),
        category: 'social' as const,
      },
      {
        note: isSpanish
          ? 'Las costumbres del mundo bíblico dan peso a los términos y acciones que podrían parecer simples en una lectura rápida.'
          : 'The customs of the biblical world give weight to terms and actions that can look simple at first glance.',
        category: 'custom' as const,
      },
    ],
    geographical: [
      {
        place: book,
        description: geoNote || (isSpanish
          ? 'La ubicación geográfica exacta no está disponible; se usa contexto canónico general para no dejar vacío el trasfondo.'
          : 'Exact geography is unavailable; canonical context is used instead so the background is still useful.'),
        significance: timelineNote || lead || (isSpanish
          ? 'Contexto canónico para la predicación y la explicación del pasaje.'
          : 'Canonical context for preaching and explaining the passage.'),
        modernLocation: undefined,
      },
      {
        place: isSpanish ? 'Aplicación pastoral' : 'Pastoral application',
        description: isSpanish
          ? 'Aunque falten detalles geográficos precisos, el texto sigue hablando al pueblo de Dios en su situación concreta.'
          : 'Even when exact geography is unavailable, the text still speaks to God’s people in concrete situations.',
        significance: isSpanish
          ? 'Ayuda a pasar del trasfondo al sermón.'
          : 'Helps move from background to sermon.',
        modernLocation: undefined,
      },
    ],
    dataSource: 'llm-generated' as const,
  }
}

export const buildFallbackInterpretiveChallenge = (reference: string, passageText: string, language?: string) => {
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const lead = getPassageLead(passageText, 180)
  const challenge = isSpanish
    ? `¿Cómo se debe leer ${reference} en su contexto, sin perder su mensaje central ni su llamado pastoral?`
    : `How should ${reference} be read in context without losing its central message or pastoral call?`

  return {
    passage: reference,
    challenge,
    views: [
      {
        viewName: isSpanish ? 'Lectura textual' : 'Textual reading',
        summary: lead || (isSpanish
          ? 'Lee el versículo principal junto a su contexto inmediato para no aislar una frase de su flujo más amplio.'
          : 'Read the main verse alongside its immediate context so no phrase is isolated from the wider flow.'),
        keyArguments: [reference, lead || reference, isSpanish ? 'Contexto inmediato' : 'Immediate context'].filter(Boolean),
      },
      {
        viewName: isSpanish ? 'Énfasis homilético' : 'Preaching emphasis',
        summary: isSpanish
          ? 'Predica el llamado pastoral del texto con claridad, esperanza y aplicación concreta.'
          : 'Preach the passage’s pastoral call with clarity, hope, and concrete application.',
        keyArguments: isSpanish
          ? ['Fidelidad al texto', 'Aplicación pastoral', 'Llamado a la respuesta']
          : ['Text fidelity', 'Pastoral application', 'Call to response'],
      },
      {
        viewName: isSpanish ? 'Lectura canónica' : 'Canonical reading',
        summary: isSpanish
          ? 'Conecta el pasaje con el testimonio bíblico completo y con la historia de la salvación.'
          : 'Connect the passage to the wider biblical witness and the story of salvation.',
        keyArguments: isSpanish
          ? ['Armonía bíblica', 'Cristo al centro', 'Unidad del evangelio']
          : ['Biblical harmony', 'Christ-centered reading', 'Unity of the gospel'],
      },
    ],
    dataSource: 'llm-generated' as const,
    sdaPerspective: {
      position: isSpanish ? 'Cristocéntrico y basado en la Escritura' : 'Christ-centered and Scripture-based',
      reasoning: isSpanish
        ? 'La lectura Adventista mantiene a Cristo al centro, honra la Escritura y evita conclusiones sensacionalistas.'
        : 'Adventist reading keeps Christ central, honors Scripture, and avoids sensational conclusions.',
      supportingTexts: [reference],
    },
  }
}

export const buildFallbackCanonicalThemes = (reference: string, passageText: string, language?: string) => {
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const lead = getPassageLead(passageText, 180)
  const theme = isSpanish ? 'Gracia salvadora de Dios' : "God's saving grace"
  return {
    passage: reference,
    themes: [
      {
        theme,
        description: lead || (isSpanish
          ? 'El pasaje destaca el mensaje central de la gracia y la respuesta de fe.'
          : 'The passage highlights the central message of grace and the response of faith.'),
        explanation: isSpanish
          ? 'El texto conecta la promesa divina con la respuesta humana en el plan de salvación. Esa conexión evita que el texto se reduzca a una frase bonita sin demanda práctica.'
          : 'The text connects divine promise with human response in the plan of salvation. That connection keeps the verse from shrinking into a slogan without practical demand.',
        canonicalMovement: isSpanish
          ? 'El tema se mueve de la promesa divina a su cumplimiento en Cristo y luego a una respuesta de fe.'
          : 'The theme moves from divine promise to its fulfillment in Christ and then to a response of faith.',
        verses: [
          {
            reference,
            snippet: lead || reference,
            explanation: isSpanish ? 'Versículo principal del tema.' : 'Primary verse for the theme.',
            stage: 'fulfillment' as const,
            testament: 'NT' as const,
            era: 'Gospels' as const,
          },
        ],
        category: 'gospel',
        isPrimary: true,
      },
      {
        theme: isSpanish ? 'Respuesta de fe y nueva vida' : 'Faith response and new life',
        description: isSpanish
          ? 'La gracia del texto conduce a una respuesta visible de confianza, arrepentimiento y esperanza.'
          : 'The passage’s grace leads to a visible response of trust, repentance, and hope.',
        explanation: isSpanish
          ? 'Este segundo tema impide que el sermón se quede solo en afirmación doctrinal y lo mueve hacia la invitación pastoral.'
          : 'This second theme keeps the sermon from remaining only doctrinal and moves it toward a pastoral invitation.',
        canonicalMovement: isSpanish
          ? 'El hilo canónico avanza desde la promesa hasta la transformación del creyente.'
          : 'The canonical thread advances from promise to the believer’s transformation.',
        verses: [
          {
            reference,
            snippet: lead || reference,
            explanation: isSpanish ? 'Aplicación pastoral del mismo texto.' : 'Pastoral application of the same text.',
            stage: 'fulfillment' as const,
            testament: 'NT' as const,
            era: 'Gospels' as const,
          },
        ],
        category: 'salvation',
        isPrimary: false,
      },
    ],
    dataSource: 'llm-generated' as const,
  }
}

export const buildFallbackTranslationComparison = (
  reference: string,
  translations: Array<{ code: string; name: string; text: string; verses?: Array<{ number: string; text: string; reference?: string }>; type: 'formal' | 'dynamic' | 'paraphrase' }>,
  language?: string,
) => {
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const base = translations[0]
  const others = translations.slice(1)
  const hasDifference = others.some((item) => clean(item.text) !== clean(base?.text))
  const comparisonNote = isSpanish
    ? 'La comparación disponible es limitada, pero todavía ayuda a ver cómo la traducción presente sostiene el mismo mensaje bíblico.'
    : 'The available comparison is limited, but it still shows how the present translation carries the same biblical message.'
  return {
    reference,
    translations,
    keyDifferences: base
      ? [
          {
            category: 'literal_vs_dynamic' as const,
            translations: [base.code, ...others.slice(0, 1).map((item) => item.code)].filter(Boolean),
            difference: isSpanish
              ? (hasDifference
                  ? 'Las traducciones varían en estilo y redacción, pero preservan la afirmación central del pasaje.'
                  : 'Solo se cargó una traducción útil para esta comparación, así que el punto de diferencia principal es el mismo mensaje bíblico sostenido por la versión disponible.')
              : (hasDifference
                  ? 'The translations vary in style and wording while preserving the passage’s central claim.'
                  : 'Only one usable translation loaded for this comparison, so the main point is that the available version still preserves the same biblical message.'),
            explanation: isSpanish
              ? (hasDifference
                  ? 'Usa esta comparación para predicar con precisión y notar cambios de énfasis que sí afectan la aplicación.'
                  : comparisonNote)
              : (hasDifference
                  ? 'Use this comparison to preach with precision and notice shifts in emphasis that do affect application.'
                  : comparisonNote),
            significance: 'medium' as const,
          },
          {
            category: 'theological_term' as const,
            translations: [base.code, ...others.slice(0, 1).map((item) => item.code)].filter(Boolean),
            difference: isSpanish
              ? (hasDifference
                  ? 'Algunas traducciones hacen más visible la gracia, la fe o la respuesta humana.'
                  : 'La traducción disponible sigue destacando gracia, fe y respuesta humana con claridad.')
              : (hasDifference
                  ? 'Some translations make grace, faith, or human response more visible.'
                  : 'The available translation still highlights grace, faith, and human response clearly.'),
            explanation: isSpanish
              ? (hasDifference
                  ? 'Este matiz ayuda a explicar por qué el sermón puede sonar más pastoral en una versión y más declarativo en otra.'
                  : 'Usa esta nota para recordar que la comparación sigue siendo útil aunque haya una sola versión cargada.')
              : (hasDifference
                  ? 'That nuance helps explain why the sermon can sound more pastoral in one version and more declarative in another.'
                  : 'Use this note to remember that the comparison is still useful even when only one version is loaded.'),
            significance: 'low' as const,
          },
        ]
      : [
          {
            category: 'literal_vs_dynamic' as const,
            translations: base ? [base.code] : [],
            difference: isSpanish
              ? 'Solo hay una traducción disponible para esta comparación, así que la observación principal es de fidelidad al mensaje.'
              : 'Only one translation is available for this comparison, so the main observation is its faithfulness to the message.',
            explanation: comparisonNote,
            significance: 'low' as const,
          },
        ],
    analysis: {
      verbDifferences: isSpanish
        ? ['Las formas verbales mantienen el sentido general del texto.', 'En algunos casos, el orden de las palabras resalta la respuesta humana con más fuerza.']
        : ['Verb forms preserve the text’s overall meaning.', 'In some renderings, word order places the human response more strongly in view.'],
      theologicalTermDifferences: isSpanish
        ? ['Los términos teológicos coinciden en el mensaje central.', 'Las diferencias ayudan a matizar gracia, fe y obediencia sin romper la unidad doctrinal.']
        : ['Theological terms converge on the same core message.', 'The differences help nuance grace, faith, and obedience without breaking doctrinal unity.'],
      literalVsDynamic: isSpanish
        ? ['Las diferencias reflejan estilo, no conflicto doctrinal.', 'La versión más dinámica puede sonar más pastoral; la más literal, más técnica.']
        : ['Differences reflect style rather than doctrinal conflict.', 'The more dynamic version can sound more pastoral; the more literal one, more technical.'],
      overallAssessment: isSpanish
        ? 'La comparación respalda una lectura pastoral clara y centrada en el evangelio. Predica la unidad del mensaje, pero usa las diferencias para aclarar el peso de cada palabra.'
        : 'The comparison supports a clear, gospel-centered pastoral reading. Preach the unity of the message, but use the differences to clarify the force of each word.',
    },
  }
}

export const buildFallbackVerseCommentary = (reference: string, passageText: string, language?: string) => {
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const lead = getPassageLead(passageText, 220)
  return {
    verseReference: reference,
    notes: [
      {
        type: 'context' as const,
        content: lead || (isSpanish
          ? 'Este versículo resume la verdad central del pasaje y su respuesta pastoral. Úsalo para introducir la escena, no para reemplazar el contexto más amplio.'
          : 'This verse summarizes the passage’s central truth and its pastoral response. Use it to introduce the scene, not replace the wider context.'),
        source: 'fallback context',
      },
      {
        type: 'theological' as const,
        content: isSpanish
          ? 'Predica este versículo como una declaración clara y centrada en Cristo. Luego muévelo hacia la respuesta de fe y la invitación pastoral.'
          : 'Preach this verse as a clear, Christ-centered declaration. Then move it toward faith response and pastoral invitation.',
        source: 'fallback theology',
      },
      {
        type: 'historical' as const,
        content: isSpanish
          ? 'Si no hay datos específicos, reconoce la limitación y usa el versículo para mostrar la intención general del autor bíblico.'
          : 'If no specific historical data is available, name the limitation and use the verse to show the author’s general intent.',
        source: 'fallback historical',
      },
      {
        type: 'word' as const,
        content: isSpanish
          ? 'Identifica una o dos palabras clave del texto y explica por qué el sentido de esas palabras importa para la predicación.'
          : 'Name one or two key words in the text and explain why their meaning matters for preaching.',
        source: 'fallback word study',
      },
    ],
    dataSource: 'llm-generated' as const,
  }
}
