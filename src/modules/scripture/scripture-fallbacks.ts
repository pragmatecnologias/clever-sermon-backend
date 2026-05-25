type NamedItem = Record<string, unknown>
export type StudyGenre =
  | 'wisdom_poetry'
  | 'gospel_dialogue'
  | 'parable'
  | 'prophetic_apocalyptic'
  | 'covenant_law'
  | 'epistle'
  | 'narrative'
  | 'general'

const clean = (value: unknown, fallback = '') => String(value ?? fallback).trim()

const parseReferenceInfo = (reference: string) => {
  const cleaned = clean(reference).replace(/\u2013|\u2014/g, '-')
  const match = cleaned.match(/^(.*?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/)
  return {
    book: clean(match?.[1] || ''),
    chapter: match ? Number(match[2]) : null,
    verseStart: match?.[3] ? Number(match[3]) : null,
    verseEnd: match?.[4] ? Number(match[4]) : match?.[3] ? Number(match[3]) : null,
  }
}

export const detectStudyGenre = (reference: string): StudyGenre => {
  const { book, chapter } = parseReferenceInfo(reference)
  const normalizedBook = book.toLowerCase().replace(/[^a-z0-9]/g, '')

  if (normalizedBook === 'psalm' || normalizedBook === 'psalms' || normalizedBook === 'ps') {
    return 'wisdom_poetry'
  }
  if (['proverbs', 'ecclesiastes', 'job'].includes(normalizedBook)) {
    return 'wisdom_poetry'
  }
  if (['matthew', 'mark', 'luke', 'john'].includes(normalizedBook)) {
    if (normalizedBook === 'luke' && chapter === 15) return 'parable'
    return 'gospel_dialogue'
  }
  if (['revelation', 'rev', 'apocalipsis'].includes(normalizedBook)) {
    return 'prophetic_apocalyptic'
  }
  if (['exodus', 'exod'].includes(normalizedBook)) {
    if (chapter === 20) return 'covenant_law'
    return 'narrative'
  }
  if ([
    'romans', '1corinthians', '2corinthians', 'galatians', 'ephesians', 'philippians',
    'colossians', '1thessalonians', '2thessalonians', '1timothy', '2timothy', 'titus',
    'philemon', 'hebrews', 'james', '1peter', '2peter', '1john', '2john', '3john', 'jude',
  ].includes(normalizedBook)) {
    return 'epistle'
  }
  if ([
    'genesis', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', '1samuel', '2samuel',
    '1kings', '2kings', '1chronicles', '2chronicles', 'ezra', 'nehemiah', 'esther', 'matthew',
    'mark', 'luke', 'john', 'acts',
  ].includes(normalizedBook)) {
    return 'narrative'
  }
  return 'general'
}

const verseEntriesFromPassageText = (passageText: string) => {
  const lines = clean(passageText)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.map((line) => {
    const match = line.match(/^(.*?\s\d+:\d+(?:-\d+)?)\s*:\s*(.*)$/)
    if (!match) {
      return null
    }
    return {
      reference: clean(match[1]),
      text: clean(match[2]),
    }
  }).filter(Boolean) as Array<{ reference: string; text: string }>
}

const passageLeadSentence = (text: string, limit = 180) => {
  const compact = clean(text)
    .replace(/\s+/g, ' ')
    .trim()
  if (!compact) return ''
  const firstSentence = compact.split(/(?<=[.!?])\s+/)[0] || compact
  return firstSentence.length > limit ? `${firstSentence.slice(0, limit - 1)}…` : firstSentence
}

const firstVerseText = (passageText: string) => verseEntriesFromPassageText(passageText)[0]?.text || ''

const verseNumberFromReference = (reference: string) => {
  const match = clean(reference).match(/:(\d+)(?:[-–—](\d+))?$/)
  return match ? Number(match[1]) : null
}

const verseRangeCount = (reference: string, passageText: string) => {
  const verses = verseEntriesFromPassageText(passageText)
  const countFromText = verses.length
  const parsed = parseReferenceInfo(reference)
  if (countFromText > 0) return countFromText
  if (typeof parsed.verseStart === 'number' && typeof parsed.verseEnd === 'number' && parsed.verseEnd >= parsed.verseStart) {
    return parsed.verseEnd - parsed.verseStart + 1
  }
  return 1
}

const verseNumberList = (passageText: string) =>
  verseEntriesFromPassageText(passageText)
    .map((verse) => verseNumberFromReference(verse.reference))
    .filter((value): value is number => typeof value === 'number')

const makeVerseRange = (start?: number, end?: number) => {
  if (typeof start !== 'number' || !Number.isFinite(start)) return ''
  if (typeof end !== 'number' || !Number.isFinite(end) || end <= start) return `${start}`
  return `${start}-${end}`
}

const buildSemanticMovement = (reference: string, genre: StudyGenre, passageText: string): string[] => {
  const verses = verseEntriesFromPassageText(passageText)
  const verseNumbers = verseNumberList(passageText)
  const verseCount = verseRangeCount(reference, passageText)
  const firstVerse = verseNumbers[0] ?? verseNumberFromReference(reference) ?? null
  const secondVerse = verseNumbers[1] ?? (typeof firstVerse === 'number' ? firstVerse + 1 : null)
  const lastVerse = verseNumbers.length > 0 ? verseNumbers[verseNumbers.length - 1] : (typeof firstVerse === 'number' ? firstVerse + Math.max(verseCount - 1, 0) : null)

  switch (genre) {
    case 'wisdom_poetry':
      return [
        'The Lord establishes the path of the righteous.',
        'The righteous may still stumble.',
        'The Lord upholds them so the fall is not final.',
      ]
    case 'gospel_dialogue':
      if (verseCount > 1) {
        return [
          'The conversation moves from curiosity to the need for new birth.',
          'The Son is given so life can be received by faith.',
          'Belief becomes the decisive response to God’s love.',
        ]
      }
      return [
        'Jesus moves the conversation from curiosity to the need for new birth.',
        'The Son is given so life can be received by faith.',
        'Belief becomes the decisive response to God’s love.',
      ]
    case 'parable':
      if (verseCount > 2) {
        return [
          'The son leaves home and moves toward ruin.',
          'The turning point comes in repentance and honest return.',
          'The father runs to receive the lost child.',
          'Restoration is marked by welcome, joy, and renewed belonging.',
        ]
      }
      return [
        'The son moves away from home and into ruin.',
        'The turning point comes in repentance and return.',
        'The father’s welcome restores the lost child.',
      ]
    case 'prophetic_apocalyptic':
      if (verseCount > 1) {
        return [
          'The everlasting gospel is proclaimed to every nation.',
          'Humanity is called to fear God, give Him glory, and worship the Creator.',
          'Babylon’s deception is announced as fallen.',
          'False worship and allegiance to the beast are warned against.',
          'The saints are identified by endurance, obedience, and the faith of Jesus.',
        ]
      }
      return [
        'The message begins with the everlasting gospel.',
        'Worship of the Creator comes into focus.',
        'Faithful endurance marks the saints who remain loyal.',
      ]
    case 'covenant_law':
      if (verseCount > 1) {
        return [
          'The command comes from the God who redeemed His people.',
          'Creation and rest shape the meaning of obedience.',
          'Covenant life orders the community after rescue.',
        ]
      }
      return [
        'The command comes from the God who redeemed His people.',
        'Creation and rest shape the meaning of obedience.',
        'Covenant life orders the community after rescue.',
      ]
    case 'epistle':
      if (verseCount > 1) {
        return [
          'The apostolic argument names the church’s need.',
          'The gospel grounds the response.',
          'The instruction turns the truth toward communal obedience.',
        ]
      }
      return [
        'The apostolic argument names the church’s need.',
        'The gospel grounds the response.',
        'The instruction turns the truth toward communal obedience.',
      ]
    case 'narrative':
      if (verseCount > 2) {
        return [
          'The scene introduces the immediate situation.',
          'The tension develops as the story moves forward.',
          'The passage advances toward the turning point.',
          'The final unit shows how the scene resolves or lands.',
        ]
      }
      return [
        'The scene introduces the immediate situation.',
        'The tension develops through the chapter’s movement.',
        'The passage advances toward God’s action in the story.',
      ]
    default:
      return [
        'The passage should be read in its immediate context.',
        'Its main claim develops within the chapter’s own movement.',
        'Preaching should keep the text anchored to the book’s argument.',
      ]
  }
}

const buildSemanticStructure = (reference: string, genre: StudyGenre, passageText: string) => {
  const verses = verseEntriesFromPassageText(passageText)
  if (genre === 'wisdom_poetry' && verses.length >= 2) {
    const firstVerse = verseNumberFromReference(verses[0].reference)
    const secondVerse = verseNumberFromReference(verses[1].reference)
    const first = typeof firstVerse === 'number' ? firstVerse : verseNumberFromReference(reference) || 0
    const second = typeof secondVerse === 'number' ? secondVerse : (typeof first === 'number' ? first + 1 : 0)
    return [
      {
        verses: `${first}a`,
        type: 'transition' as const,
        description: 'Divine guidance — the Lord establishes the path of the righteous.',
      },
      {
        verses: `${first}b`,
        type: 'climax' as const,
        description: 'Divine delight — the Lord delights in the way of the righteous.',
      },
      {
        verses: `${second}a`,
        type: 'transition' as const,
        description: 'Human weakness — the righteous may stumble.',
      },
      {
        verses: `${second}b`,
        type: 'climax' as const,
        description: 'Divine support — the Lord upholds them so the fall is not final.',
      },
    ]
  }

  if (genre === 'prophetic_apocalyptic' && verses.length > 1) {
    const parsed = parseReferenceInfo(reference)
    const start = parsed.verseStart ?? verseNumberFromReference(reference) ?? 0
    const end = parsed.verseEnd ?? start
    const second = start + 1
    const third = start + 2
    const preFinalStart = start + 3
    const preFinalEnd = Math.max(preFinalStart, end - 1)
    return [
      {
        verses: `${start}`,
        type: 'transition' as const,
        description: 'Worldwide gospel proclamation',
      },
      {
        verses: `${second}`,
        type: 'body' as const,
        description: 'Call to worship the Creator in the hour of judgment',
      },
      {
        verses: `${third}`,
        type: 'body' as const,
        description: 'Announcement of Babylon’s fall',
      },
      {
        verses: `${makeVerseRange(preFinalStart, preFinalEnd)}`,
        type: 'climax' as const,
        description: 'Warning against false worship and allegiance to the beast',
      },
      {
        verses: `${end}`,
        type: 'inclusio' as const,
        description: 'Identity and endurance of the saints',
      },
    ].filter((item) => item.verses)
  }

  if (genre === 'parable' && verses.length > 2) {
    const numbers = verseNumberList(passageText)
    const start = numbers[0] ?? verseNumberFromReference(reference) ?? 0
    const end = numbers[numbers.length - 1] ?? start
    const second = numbers[1] ?? (start + 1)
    const third = numbers[2] ?? (second + 1)
    const penultimate = numbers.length > 3 ? numbers[numbers.length - 2] : third
    return [
      {
        verses: makeVerseRange(start, second),
        type: 'transition' as const,
        description: 'Departure from the father’s house',
      },
      {
        verses: makeVerseRange(second + 1, third + 2),
        type: 'body' as const,
        description: 'Ruin, hunger, and the collapse of self-rule',
      },
      {
        verses: makeVerseRange(third + 3, penultimate),
        type: 'climax' as const,
        description: 'Repentance and the decision to return home',
      },
      {
        verses: `${end}`,
        type: 'inclusio' as const,
        description: 'Restoration through the father’s welcome',
      },
    ].filter((item) => item.verses)
  }

  if (genre === 'covenant_law' && verses.length > 1) {
    const numbers = verseNumberList(passageText)
    const start = numbers[0] ?? verseNumberFromReference(reference) ?? 0
    const end = numbers[numbers.length - 1] ?? start
    const middle = numbers.length > 2 ? numbers.slice(1, -1) : [numbers[1] ?? (start + 1)]
    return [
      {
        verses: `${start}`,
        type: 'transition' as const,
        description: 'Command rooted in redemption',
      },
      {
        verses: makeVerseRange(middle[0], middle[middle.length - 1]),
        type: 'body' as const,
        description: 'Command shaped by creation and covenant rest',
      },
      {
        verses: `${end}`,
        type: 'inclusio' as const,
        description: 'Final grounding in God’s own pattern',
      },
    ].filter((item) => item.verses)
  }

  return verses.length > 0
    ? verses.slice(0, 6).map((verse, index) => ({
        verses: verse.reference,
        type: index === 0 ? 'transition' as const : index === verses.length - 1 ? 'climax' as const : 'body' as const,
        description: passageLeadSentence(verse.text, 120),
      }))
    : [
          {
            verses: reference,
          type: 'transition' as const,
          description: 'The passage opens with its own literary burden.',
        },
        {
          verses: reference,
          type: 'body' as const,
          description: 'The passage develops its meaning in context.',
        },
        {
          verses: reference,
          type: 'climax' as const,
          description: 'The passage resolves in the text’s own theological direction.',
        },
      ]
}

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
  const genre = detectStudyGenre(reference)
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const verses = verseEntriesFromPassageText(passageText)
  const verseCount = verseRangeCount(reference, passageText)
  const passageBody = verses.map((verse) => clean(verse.text)).join(' ').toLowerCase()
  const mentionsSteps = /steps?|path|way|walk|walks?/.test(passageBody)
  const mentionsFall = /fall|stumble|cast down|uphold/.test(passageBody)
  const mentionsWicked = /wicked|evil|unrighteous/.test(passageBody)
  const movement = buildSemanticMovement(reference, genre, passageText)

  const buildSummary = () => {
    const multiVerse = verseCount > 1
    switch (genre) {
      case 'wisdom_poetry':
        return isSpanish
          ? `El Salmo 37 llama a no envidiar a los malvados y a confiar en que el Señor sostiene el camino de los justos${mentionsFall ? ' incluso cuando tropiezan' : ''}${mentionsSteps ? ', guiando sus pasos' : ''}. ${mentionsWicked ? 'La tensión es la prosperidad aparente de los malos frente a la confianza paciente de los fieles.' : 'La tensión principal está en aprender a confiar cuando la fidelidad no parece recompensada de inmediato.'} El énfasis no está en la perfección humana, sino en la fidelidad sostenedora de Dios.`
          : `Psalm 37 warns against envying the wicked and calls the righteous to trust the Lord’s steady care${mentionsFall ? ' even when they stumble' : ''}${mentionsSteps ? ', as He directs their steps' : ''}. ${mentionsWicked ? 'The tension is the apparent prosperity of the wicked versus the patient trust of the faithful.' : 'The main tension is learning to trust when faithfulness does not seem immediately rewarded.'} The emphasis is not human perfection but God’s sustaining faithfulness.`
      case 'gospel_dialogue':
        return isSpanish
          ? (multiVerse
            ? 'La conversación avanza de la curiosidad al nuevo nacimiento y culmina en la fe en el Hijo. No es un lema aislado, sino parte de un diálogo sobre vida nueva.'
            : 'Este pasaje pertenece a la conversación de Jesús con Nicodemo y debe leerse dentro del movimiento del nuevo nacimiento y la fe.')
          : (multiVerse
            ? 'The conversation moves from curiosity to new birth and culminates in faith in the Son. It is not an isolated slogan but part of a dialogue about new life.'
            : 'This passage belongs inside Jesus’ conversation with Nicodemus and the larger movement toward new birth and faith.')
      case 'parable':
        return isSpanish
          ? (multiVerse
            ? 'La parábola sigue al hijo en su salida, ruina, arrepentimiento y regreso, y termina en la bienvenida restauradora del padre.'
            : 'El pasaje avanza como una parábola de regreso, vergüenza, bienvenida y restauración.')
          : (multiVerse
            ? 'The parable follows the son through departure, ruin, repentance, and return, ending in the father’s restoring welcome.'
            : 'The passage moves as a parable of return, shame, welcome, and restoration.')
      case 'prophetic_apocalyptic':
        return isSpanish
          ? (multiVerse
            ? 'Apocalipsis 14:6–12 presenta el evangelio eterno como un llamado mundial a adorar al Creador, rechazar Babilonia, evitar la falsa adoración y perseverar como santos.'
            : 'El pasaje proclama el evangelio eterno dentro de una escena de adoración y lealtad bajo presión.')
          : (multiVerse
            ? 'Revelation 14:6–12 presents the everlasting gospel as a worldwide call to worship the Creator, reject Babylon, refuse false worship, and endure as saints.'
            : 'The passage announces the everlasting gospel inside a scene of worship and allegiance under pressure.')
      case 'covenant_law':
        return isSpanish
          ? (multiVerse
            ? 'El mandamiento del sábado vincula descanso, creación y redención para ordenar la vida del pueblo rescatado.'
            : 'El pasaje presenta instrucción del pacto a un pueblo rescatado, especialmente con la creación y el descanso en vista.')
          : (multiVerse
            ? 'The Sabbath command links rest, creation, and redemption to order the life of a rescued people.'
            : 'The passage presents covenant instruction to a rescued people, especially with creation and rest in view.')
      case 'epistle':
        return isSpanish
          ? (multiVerse
            ? 'La carta desarrolla un argumento apostólico que avanza de la necesidad de la iglesia a la respuesta del evangelio.'
            : 'El pasaje forma parte de una carta apostólica que aplica el evangelio a la vida de la iglesia.')
          : (multiVerse
            ? 'The letter develops an apostolic argument that moves from the church’s need to the gospel’s response.'
            : 'The passage belongs to an apostolic letter applying the gospel to church life.')
      case 'narrative':
        return isSpanish
          ? (multiVerse
            ? 'La escena avanza desde la situación inicial hasta el punto de giro y la resolución final.'
            : 'El pasaje avanza dentro de una escena narrativa concreta y debe leerse con su capítulo inmediato.')
          : (multiVerse
            ? 'The scene moves from the opening situation to the turning point and final resolution.'
            : 'The passage moves inside a concrete narrative scene and should be read with its immediate chapter context.')
      default:
        return isSpanish
          ? (multiVerse
            ? 'El pasaje desarrolla un movimiento literario completo que debe resumirse por unidades, no por versos aislados.'
            : 'El pasaje debe leerse dentro de su contexto literario inmediato y canónico.')
          : (multiVerse
            ? 'The passage develops a complete literary movement that should be summarized by units, not isolated verses.'
            : 'The passage should be read inside its immediate literary and canonical context.')
    }
  }

  return {
    passage: reference,
    summary: buildSummary(),
    interpretiveCenter: isSpanish
      ? (genre === 'wisdom_poetry'
        ? 'La idea central es que Dios sostiene el camino de los justos y no abandona a los que confían en Él.'
        : genre === 'parable'
          ? 'El centro interpretativo es la gracia restauradora de Dios que recibe al arrepentido.'
          : genre === 'prophetic_apocalyptic'
            ? 'El centro interpretativo es la fidelidad de Dios que llama a adorarlo y perseverar.'
            : 'El centro interpretativo sigue la afirmación principal del pasaje dentro de su contexto inmediato.')
      : (genre === 'wisdom_poetry'
        ? 'The interpretive center is God’s sustaining care for the righteous path and His refusal to abandon those who trust Him.'
        : genre === 'parable'
          ? 'The interpretive center is God’s restoring grace that receives the repentant.'
          : genre === 'prophetic_apocalyptic'
            ? 'The interpretive center is God’s faithful call to worship and perseverance.'
            : 'The interpretive center follows the passage’s main claim in its immediate context.'),
    mainTension: isSpanish
      ? (genre === 'wisdom_poetry'
        ? 'La tensión está entre la aparente prosperidad de los malos y la confianza paciente de los justos.'
        : genre === 'parable'
          ? 'La tensión está entre la vergüenza del hijo perdido y la bienvenida inesperada del padre.'
          : genre === 'prophetic_apocalyptic'
            ? 'La tensión está entre la presión del mundo y la lealtad debida al Creador.'
            : 'La tensión principal debe leerse desde el contexto inmediato del pasaje.')
      : (genre === 'wisdom_poetry'
        ? 'The tension lies between the apparent prosperity of the wicked and the patient trust of the righteous.'
        : genre === 'parable'
          ? 'The tension lies between the shame of the lost child and the father’s unexpected welcome.'
          : genre === 'prophetic_apocalyptic'
            ? 'The tension lies between worldly pressure and the allegiance owed to the Creator.'
            : 'The main tension should be read from the passage’s immediate context.'),
    movement: movement.length > 0 ? movement : (isSpanish
      ? ['Lee el pasaje en su contexto inmediato.', 'Observa cómo el texto desarrolla su afirmación principal.', 'Lleva la verdad del texto a la respuesta pastoral.']
      : ['Read the passage in its immediate context.', 'Observe how the text develops its main claim.', 'Move the text’s truth toward a pastoral response.']),
    dataSource: 'computed' as const,
  }
}

export const buildFallbackStudySynthesis = (reference: string, passageText: string, language?: string) => {
  const genre = detectStudyGenre(reference)
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const verses = verseEntriesFromPassageText(passageText)
  const verseCount = verseRangeCount(reference, passageText)
  const multiVerse = verseCount > 1
  const firstVerse = verses[0]?.text || passageLeadSentence(firstVerseText(passageText) || passageText, 220) || reference

  const centralClaim = () => {
    switch (genre) {
      case 'wisdom_poetry':
        return isSpanish
          ? 'Dios dirige y sostiene la vida de los justos; aun cuando tropiezan, su mano evita que la caída sea final.'
          : 'God directs and sustains the life of the righteous; even when they stumble, His hand keeps them from final ruin.'
      case 'gospel_dialogue':
        return isSpanish
          ? 'Jesús lleva a Nicodemo al corazón del nuevo nacimiento y de la fe en el Hijo. La vida nueva llega por la iniciativa de Dios.'
          : 'Jesus brings Nicodemus to the heart of new birth and faith in the Son. New life comes by God’s initiative.'
      case 'parable':
        return isSpanish
          ? (multiVerse
            ? 'La parábola muestra el viaje completo del hijo perdido: alejamiento, ruina, arrepentimiento y restauración. La gracia del padre recibe al arrepentido y lo devuelve a la casa.'
            : 'La parábola revela que la gracia del padre recibe al hijo arrepentido y restaura su lugar en la casa.')
          : (multiVerse
            ? 'The parable traces the lost son’s full journey: departure, ruin, repentance, and restoration. The father’s grace receives the repentant and brings him home.'
            : 'The parable reveals that the father’s grace receives the repentant son and restores his place in the house.')
      case 'prophetic_apocalyptic':
        return isSpanish
          ? (multiVerse
            ? 'Revelation 14:6–12 presents God’s final worldwide gospel appeal: worship the Creator, reject Babylon’s deception, refuse false worship, and endure as saints who keep God’s commandments and the faith of Jesus.'
            : 'El pasaje proclama el evangelio eterno y llama a la adoración fiel en medio de la presión.')
          : (multiVerse
            ? 'Revelation 14:6–12 presents God’s final worldwide gospel appeal: worship the Creator, reject Babylon’s deception, refuse false worship, and endure as saints who keep God’s commandments and the faith of Jesus.'
            : 'The passage proclaims the everlasting gospel and calls for faithful worship under pressure.')
      case 'covenant_law':
        return isSpanish
          ? 'El mandamiento surge de un pueblo rescatado y ordena la vida desde la creación y la redención. La obediencia responde a la gracia que libera.'
          : 'The command emerges from a rescued people and orders life from creation and redemption. Obedience responds to the grace that delivers.'
      case 'epistle':
        return isSpanish
          ? 'La carta aplica el evangelio a una necesidad concreta de la iglesia. La verdad apostólica busca formar la vida comunitaria.'
          : 'The letter applies the gospel to a concrete need in the church. Apostolic truth aims to shape communal life.'
      case 'narrative':
        return isSpanish
          ? 'La narración avanza una escena concreta dentro del libro y muestra cómo actúa Dios en la historia. El contexto inmediato evita conclusiones apresuradas.'
          : 'The narrative advances a concrete scene within the book and shows how God acts in history. The immediate context prevents rushed conclusions.'
      default:
        return isSpanish
          ? 'El pasaje comunica una verdad bíblica concreta dentro de su contexto inmediato. Debe leerse como Escritura viva, no como una frase aislada.'
          : 'The passage communicates a concrete biblical truth within its immediate context. It should be read as living Scripture, not as an isolated slogan.'
    }
  }

  return {
    passage: reference,
    centralClaim: centralClaim(),
    canonicalSignificance: isSpanish
      ? (genre === 'wisdom_poetry'
        ? 'Conecta con el testimonio bíblico sobre caminar con Dios, perseverar en la prueba y ser sostenido por el Señor.'
        : genre === 'parable'
          ? 'Conecta con el testimonio bíblico sobre arrepentimiento, misericordia y restauración de los perdidos.'
          : genre === 'prophetic_apocalyptic'
            ? 'Conecta con el testimonio bíblico sobre adoración, perseverancia y fidelidad al Creador.'
            : 'Conecta el pasaje con el testimonio bíblico más amplio sobre la fidelidad de Dios.')
      : (genre === 'wisdom_poetry'
        ? 'Connects to the biblical witness about walking with God, persevering in trial, and being sustained by the Lord.'
        : genre === 'parable'
          ? 'Connects to the biblical witness about repentance, mercy, and the restoration of the lost.'
          : genre === 'prophetic_apocalyptic'
            ? 'Connects to the biblical witness about worship, perseverance, and fidelity to the Creator.'
            : 'Connects the passage to the wider biblical witness about God’s faithfulness.'),
    pastoralTakeaway: isSpanish
      ? (genre === 'wisdom_poetry'
        ? 'Anima al creyente a confiar cuando su camino parece inestable y a predicar la fidelidad sostenedora de Dios.'
        : genre === 'parable'
          ? 'Invita a celebrar la misericordia que restaura y a llamar al oyente al arrepentimiento sin vergüenza estéril.'
          : genre === 'prophetic_apocalyptic'
            ? 'Anima a perseverar con esperanza y a adorar al Creador con lealtad.'
            : 'Llama a una respuesta concreta de fe y obediencia sin diluir la verdad del texto.')
      : (genre === 'wisdom_poetry'
        ? 'Encourages believers to trust when the path feels unstable and to preach God’s sustaining faithfulness.'
        : genre === 'parable'
          ? 'Invites celebration of restorative mercy and a call to repentance without sterile shame.'
          : genre === 'prophetic_apocalyptic'
            ? 'Encourages steadfast hope and worshipful loyalty to the Creator.'
            : 'Calls for a concrete response of faith and obedience without diluting the text’s truth.'),
    preachingFocus: isSpanish
      ? (genre === 'wisdom_poetry'
        ? 'Predicar cómo el Señor dirige y sostiene a los justos cuando tropiezan.'
        : genre === 'parable'
          ? 'Predicar la restauración del padre y la respuesta del hijo como camino de regreso.'
          : genre === 'prophetic_apocalyptic'
            ? 'Predicar adoración, perseverancia y el evangelio eterno como el corazón del mensaje.'
            : 'Predicar la verdad central del texto con claridad pastoral y aplicación concreta.')
      : (genre === 'wisdom_poetry'
        ? 'Preach how the Lord directs and sustains the righteous when they stumble.'
        : genre === 'parable'
          ? 'Preach the father’s restoration and the son’s return as the way home.'
          : genre === 'prophetic_apocalyptic'
            ? 'Preach worship, endurance, and the everlasting gospel as the heart of the message.'
            : 'Preach the text’s central truth with clarity, pastoral rhythm, and concrete application.'),
    dataSource: 'llm-generated' as const,
  }
}

export const buildFallbackStructuralAnalysis = (reference: string, passageText: string, language?: string) => {
  const lead = passageLeadSentence(passageText, 160)
  const genre = detectStudyGenre(reference)
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const verses = verseEntriesFromPassageText(passageText)
  const genreLabel = {
    wisdom_poetry: isSpanish ? 'Poesía sapiencial / Salmo de sabiduría' : 'Wisdom psalm / Hebrew poetry',
    gospel_dialogue: isSpanish ? 'Diálogo del Evangelio' : 'Gospel dialogue',
    parable: isSpanish ? 'Parábola' : 'Parable',
    prophetic_apocalyptic: isSpanish ? 'Profecía apocalíptica' : 'Prophetic apocalyptic',
    covenant_law: isSpanish ? 'Ley del pacto' : 'Covenant law',
    epistle: isSpanish ? 'Epístola apostólica' : 'Apostolic epistle',
    narrative: isSpanish ? 'Narrativa bíblica' : 'Biblical narrative',
    general: isSpanish ? 'Contexto canónico general' : 'General canonical context',
  }[genre]

  const structure = ['wisdom_poetry', 'prophetic_apocalyptic', 'parable', 'covenant_law', 'gospel_dialogue', 'epistle', 'narrative'].includes(genre)
    ? buildSemanticStructure(reference, genre, passageText)
    : verses.length > 0
      ? verses.slice(0, 6).map((verse, index) => ({
          verses: verse.reference,
          type: index === 0 ? 'transition' as const : index === verses.length - 1 ? 'climax' as const : 'body' as const,
          description: `${verse.reference}: ${passageLeadSentence(verse.text, 120)}`,
        }))
      : [
          {
            verses: reference,
            type: 'transition' as const,
            description: isSpanish
              ? `${lead || 'El pasaje presenta su afirmación principal dentro de su contexto inmediato.'}`
              : `${lead || 'The passage presents its main claim within its immediate context.'}`,
          },
          {
            verses: reference,
            type: 'body' as const,
            description: isSpanish
              ? 'Desarrolla su argumento o tensión sin salir de su propio género.'
              : 'It develops its argument or tension within its own genre.',
          },
          {
            verses: reference,
            type: 'climax' as const,
            description: isSpanish
              ? 'Conduce a una respuesta pastoral fiel al texto.'
              : 'It leads to a pastoral response faithful to the text.',
          },
        ]

  return {
    passage: reference,
    literaryGenre: genreLabel,
    structure,
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
          ? `El pasaje pertenece al marco de ${book} y debe leerse dentro de su contexto literario inmediato.`
          : `The passage belongs within the book-level context of ${book} and should be read inside its immediate literary movement.`),
        period: isSpanish ? 'Contexto bíblico' : 'Biblical context',
        source: isSpanish ? 'contexto bíblico' : 'biblical context',
      },
      {
        note: isSpanish
          ? 'Este contexto ayuda al predicador a distinguir entre el versículo aislado y el mensaje completo del capítulo.'
          : 'This context helps the preacher keep the verse connected to the chapter’s full message.',
        period: isSpanish ? 'Lectura pastoral' : 'Pastoral reading',
        source: isSpanish ? 'lectura pastoral' : 'pastoral reading',
      },
    ],
    cultural: [
      {
        note: culturalNote || (isSpanish
          ? `El lenguaje del pasaje refleja su audiencia y propósito en ${book}, y por eso conviene evitar lecturas apresuradas.`
          : `The passage language reflects its audience and purpose in ${book}, so rushed readings should be avoided.`),
        category: 'cultural' as const,
      },
      {
        note: isSpanish
          ? 'Las costumbres del mundo bíblico dan peso a los términos y acciones que podrían parecer simples en una lectura rápida.'
          : 'The customs of the biblical world give weight to terms and actions that can look simple at first glance.',
        category: 'customs' as const,
      },
    ],
    geographical: [
      {
        place: book,
        description: geoNote || (isSpanish
          ? 'Cuando la geografía exacta no sea central, se usa contexto canónico general para mantener útil el trasfondo.'
          : 'When exact geography is not central, canonical context carries the background without forcing a location story.'),
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
          ? 'Ayuda a trasladar el trasfondo al sermón.'
          : 'Helps move from context to preaching application.',
        modernLocation: undefined,
      },
    ],
    dataSource: 'llm-generated' as const,
  }
}

export const buildFallbackInterpretiveChallenge = (reference: string, passageText: string, language?: string) => {
  const isSpanish = clean(language).toLowerCase().startsWith('es')
  const genre = detectStudyGenre(reference)
  const lead = passageLeadSentence(passageText, 180)
  const verseText = firstVerseText(passageText)

  const buildChallenge = () => {
    switch (genre) {
      case 'wisdom_poetry':
        return isSpanish
          ? `¿Cómo se debe predicar ${reference} sin confundir “caer” con ruina final ni convertir la promesa en perfeccionismo?`
          : `How should ${reference} be preached without confusing “falling” with final ruin or turning the promise into perfectionism?`
      case 'gospel_dialogue':
        return isSpanish
          ? `¿Cómo se lee ${reference} dentro de la conversación de Jesús con Nicodemo, y no como una frase aislada?`
          : `How should ${reference} be read inside Jesus’ conversation with Nicodemus rather than as an isolated slogan?`
      case 'parable':
        return isSpanish
          ? `¿La parábola centra su peso en el hijo perdido, en el padre que recibe, o en el hermano resentido?`
          : `Does the parable center on the lost son, the welcoming father, or the resentful brother?`
      case 'prophetic_apocalyptic':
        return isSpanish
          ? `¿Cómo mantener ${reference} centrado en el evangelio eterno sin volverlo sensacionalista o impulsado por miedo?`
          : `How do we keep ${reference} centered on the everlasting gospel without turning it sensational or fear-driven?`
      case 'covenant_law':
        return isSpanish
          ? `¿Cómo predicar ${reference} como ley del pacto nacida de la redención y no como mero deber religioso?`
          : `How should ${reference} be preached as covenant law rooted in redemption rather than bare religious duty?`
      case 'epistle':
        return isSpanish
          ? `¿Qué problema pastoral de la iglesia está respondiendo este texto apostólico?`
          : `What pastoral problem in the church is this apostolic text addressing?`
      case 'narrative':
        return isSpanish
          ? `¿Cómo se cuenta esta escena sin perder su flujo narrativo inmediato?`
          : `How do we tell this scene without losing its immediate narrative flow?`
      default:
        return isSpanish
          ? `¿Cómo se lee ${reference} dentro de su contexto inmediato y su peso pastoral?`
          : `How should ${reference} be read in its immediate context and pastoral weight?`
    }
  }

  const views = (() => {
    switch (genre) {
      case 'wisdom_poetry':
        return [
          {
            viewName: isSpanish ? 'Lectura sapiencial' : 'Wisdom reading',
            summary: isSpanish
              ? `El pasaje habla de pasos, caída y sostén divino dentro de una sabiduría que contrasta al justo con el malvado.`
              : `The passage speaks of steps, falling, and divine upholding within a wisdom contrast between the righteous and the wicked.`,
            keyArguments: isSpanish
              ? ['La poesía sapiencial usa paralelismo y contraste', 'La caída no significa abandono final', 'El énfasis está en la fidelidad de Dios']
              : ['Wisdom poetry uses parallelism and contrast', 'Falling does not equal final abandonment', 'The emphasis is God’s sustaining faithfulness'],
          },
          {
            viewName: isSpanish ? 'Advertencia pastoral' : 'Pastoral caution',
            summary: isSpanish
              ? 'No debe predicarse como una promesa de ausencia de tropiezos o sufrimiento.'
              : 'It should not be preached as a promise of no setbacks or suffering.',
            keyArguments: isSpanish
              ? ['Evita el perfeccionismo', 'Evita el evangelio de prosperidad', 'Predica la perseverancia']
              : ['Avoid perfectionism', 'Avoid prosperity-gospel readings', 'Preach perseverance'],
          },
          {
            viewName: isSpanish ? 'Énfasis homilético' : 'Homiletical emphasis',
            summary: isSpanish
              ? 'La promesa principal es que el Señor sostiene al justo cuando tropieza.'
              : 'The main promise is that the Lord sustains the righteous when they stumble.',
            keyArguments: isSpanish
              ? ['El sostén de Dios es el centro', 'La confianza vence la envidia', 'La caída no es final']
              : ['God’s sustaining hand is central', 'Trust defeats envy', 'The fall is not final'],
          },
        ]
      case 'gospel_dialogue':
        return [
          {
            viewName: isSpanish ? 'Diálogo con Nicodemo' : 'Nicodemus dialogue',
            summary: isSpanish
              ? 'El versículo pertenece a una conversación sobre nuevo nacimiento, fe y vida eterna.'
              : 'The verse belongs inside a conversation about new birth, faith, and eternal life.',
            keyArguments: isSpanish
              ? ['El contexto inmediato importa', 'La fe es respuesta al don de Dios', 'No es un lema aislado']
              : ['Immediate context matters', 'Faith is a response to God’s gift', 'It is not an isolated slogan'],
          },
          {
            viewName: isSpanish ? 'Lectura teológica' : 'Theological reading',
            summary: isSpanish
              ? 'La iniciativa amorosa de Dios está en el centro.'
              : 'God’s initiating love is central.',
            keyArguments: isSpanish
              ? ['Dios amó primero', 'El Hijo es el regalo', 'La vida eterna es don']
              : ['God loved first', 'The Son is the gift', 'Eternal life is a gift'],
          },
          {
            viewName: isSpanish ? 'Énfasis pastoral' : 'Pastoral emphasis',
            summary: isSpanish
              ? 'Predica la invitación a creer sin reducir el texto a eslogan.'
              : 'Preach the invitation to believe without reducing the text to a slogan.',
            keyArguments: isSpanish
              ? ['Nuevo nacimiento', 'Confianza viva', 'Seguridad en Cristo']
              : ['New birth', 'Living trust', 'Assurance in Christ'],
          },
        ]
      case 'parable':
        return [
          {
            viewName: isSpanish ? 'Lectura narrativa' : 'Narrative reading',
            summary: isSpanish
              ? 'La historia se mueve del alejamiento al regreso, y del regreso al abrazo restaurador.'
              : 'The story moves from distance to return, and from return to restoring embrace.',
            keyArguments: isSpanish
              ? ['La vergüenza es real', 'El arrepentimiento es real', 'La bienvenida también']
              : ['Shame is real', 'Repentance is real', 'So is welcome'],
          },
          {
            viewName: isSpanish ? 'Tensión interpretativa' : 'Interpretive tension',
            summary: isSpanish
              ? 'El hermano mayor y el padre muestran que la gracia confronta tanto al perdido como al orgulloso.'
              : 'The older brother and the father show that grace confronts both the lost and the proud.',
            keyArguments: isSpanish
              ? ['La misericordia irrita al orgullo', 'La casa celebra al arrepentido', 'La restauración es relacional']
              : ['Mercy offends pride', 'The house celebrates repentance', 'Restoration is relational'],
          },
          {
            viewName: isSpanish ? 'Énfasis pastoral' : 'Pastoral emphasis',
            summary: isSpanish
              ? 'Predica la bienvenida del Padre y la necesidad de regresar.'
              : 'Preach the Father’s welcome and the need to come home.',
            keyArguments: isSpanish
              ? ['El regreso importa', 'La mesa se abre', 'La gracia restaura']
              : ['Return matters', 'The table opens', 'Grace restores'],
          },
        ]
      case 'prophetic_apocalyptic':
        return [
          {
            viewName: isSpanish ? 'Lectura profética' : 'Prophetic reading',
            summary: isSpanish
              ? 'El mensaje llama a adorar al Creador y a permanecer fieles bajo presión.'
              : 'The message calls people to worship the Creator and remain faithful under pressure.',
            keyArguments: isSpanish
              ? ['El evangelio eterno encabeza el mensaje', 'La adoración define la lealtad', 'La urgencia no es pánico']
              : ['The everlasting gospel leads', 'Worship defines loyalty', 'Urgency is not panic'],
          },
          {
            viewName: isSpanish ? 'Advertencia pastoral' : 'Pastoral caution',
            summary: isSpanish
              ? 'El pasaje no debe tratarse con miedo sensacionalista.'
              : 'The passage must not be handled with sensational fear.',
            keyArguments: isSpanish
              ? ['Cristo al centro', 'Esperanza con claridad', 'Fidelidad sin alarma']
              : ['Christ at the center', 'Hope with clarity', 'Faithfulness without alarm'],
          },
          {
            viewName: isSpanish ? 'Énfasis homilético' : 'Homiletical emphasis',
            summary: isSpanish
              ? 'Predica el llamado a la fidelidad y al evangelio eterno.'
              : 'Preach the call to fidelity and the everlasting gospel.',
            keyArguments: isSpanish
              ? ['Adoración verdadera', 'Paciencia de los santos', 'Lealtad a Dios']
              : ['True worship', 'The patience of the saints', 'Loyalty to God'],
          },
        ]
      case 'covenant_law':
        return [
          {
            viewName: isSpanish ? 'Lectura del pacto' : 'Covenant reading',
            summary: isSpanish
              ? 'La ley nace de la liberación y ordena la vida del pueblo redimido.'
              : 'The law arises from deliverance and orders the life of the redeemed people.',
            keyArguments: isSpanish
              ? ['La gracia precede al mandato', 'La creación y la redención se unen', 'El descanso tiene forma de pacto']
              : ['Grace precedes command', 'Creation and redemption unite', 'Rest has covenant shape'],
          },
          {
            viewName: isSpanish ? 'Advertencia pastoral' : 'Pastoral caution',
            summary: isSpanish
              ? 'No debe predicarse como legalismo desnudo.'
              : 'It should not be preached as bare legalism.',
            keyArguments: isSpanish
              ? ['Obediencia con gratitud', 'Identidad redimida', 'Santidad práctica']
              : ['Obedience with gratitude', 'Redeemed identity', 'Practical holiness'],
          },
          {
            viewName: isSpanish ? 'Énfasis homilético' : 'Homiletical emphasis',
            summary: isSpanish
              ? 'Predica la obediencia como respuesta a la redención.'
              : 'Preach obedience as response to redemption.',
            keyArguments: isSpanish
              ? ['Rescate antes que regla', 'Descanso para el pueblo', 'Memoria de la creación']
              : ['Rescue before rule', 'Rest for the people', 'Creation memory'],
          },
        ]
      case 'epistle':
        return [
          {
            viewName: isSpanish ? 'Lectura apostólica' : 'Apostolic reading',
            summary: isSpanish
              ? 'La carta responde a una necesidad concreta de la iglesia y desarrolla argumento pastoral.'
              : 'The letter responds to a concrete church need and develops pastoral argument.',
            keyArguments: isSpanish
              ? ['No es colección de máximas', 'Hay flujo lógico', 'La iglesia es el destinatario']
              : ['Not a collection of maxims', 'There is logical flow', 'The church is the audience'],
          },
          {
            viewName: isSpanish ? 'Énfasis pastoral' : 'Pastoral emphasis',
            summary: isSpanish
              ? 'La aplicación debe seguir al argumento, no sustituirlo.'
              : 'Application must follow the argument, not replace it.',
            keyArguments: isSpanish
              ? ['Mente y vida', 'Doctrina y práctica', 'Fidelidad comunitaria']
              : ['Mind and life', 'Doctrine and practice', 'Communal faithfulness'],
          },
          {
            viewName: isSpanish ? 'Lectura canónica' : 'Canonical reading',
            summary: isSpanish
              ? 'La carta se integra al testimonio apostólico más amplio.'
              : 'The letter belongs within the wider apostolic witness.',
            keyArguments: isSpanish
              ? ['Unidad del evangelio', 'Edificación de la iglesia', 'Cristo al centro']
              : ['Unity of the gospel', 'Edification of the church', 'Christ at the center'],
          },
        ]
      case 'narrative':
        return [
          {
            viewName: isSpanish ? 'Lectura narrativa' : 'Narrative reading',
            summary: isSpanish
              ? `La escena avanza en una secuencia concreta: ${lead || verseText || 'el episodio desarrolla su propia acción'}.`
              : `The scene moves in a concrete sequence: ${lead || verseText || 'the episode develops its own action'}.`,
            keyArguments: isSpanish
              ? ['La acción importa', 'El contexto inmediato dirige el sentido']
              : ['The action matters', 'Immediate context drives meaning'],
          },
          {
            viewName: isSpanish ? 'Tensión narrativa' : 'Narrative tension',
            summary: isSpanish
              ? 'La escena debe leerse como parte de la historia mayor, no como una cita aislada.'
              : 'The scene should be read as part of the larger story, not as an isolated quotation.',
            keyArguments: isSpanish
              ? ['Movimiento dentro del relato', 'No aislar la frase', 'Observar respuestas']
              : ['Movement within the story', 'Do not isolate the line', 'Observe responses'],
          },
          {
            viewName: isSpanish ? 'Énfasis pastoral' : 'Pastoral emphasis',
            summary: isSpanish
              ? 'Predica la acción de Dios en la escena y lo que esa acción demanda.'
              : 'Preach God’s action in the scene and what that action requires.',
            keyArguments: isSpanish
              ? ['Dios actúa en la historia', 'La respuesta humana cuenta', 'El texto avanza']
              : ['God acts in history', 'Human response matters', 'The text moves forward'],
          },
        ]
      default:
        return [
          {
            viewName: isSpanish ? 'Lectura textual' : 'Textual reading',
            summary: isSpanish
              ? `${lead || verseText || 'El pasaje necesita su contexto inmediato para ser predicado con precisión.'}`
              : `${lead || verseText || 'The passage needs its immediate context to be preached accurately.'}`,
            keyArguments: isSpanish
              ? ['Contexto inmediato', 'Lectura pastoral', 'Fidelidad al texto']
              : ['Immediate context', 'Pastoral reading', 'Text fidelity'],
          },
          {
            viewName: isSpanish ? 'Énfasis homilético' : 'Homiletical emphasis',
            summary: isSpanish
              ? 'El predicador debe dejar que el texto marque el tono.'
              : 'The preacher should let the text set the tone.',
            keyArguments: isSpanish
              ? ['Texto antes que plantilla', 'Evitar generalidades', 'Aplicación concreta']
              : ['Text before template', 'Avoid generalities', 'Concrete application'],
          },
          {
            viewName: isSpanish ? 'Lectura canónica' : 'Canonical reading',
            summary: isSpanish
              ? 'Conecta el texto con la historia bíblica mayor sin aplastarlo.'
              : 'Connect the text to the larger biblical story without flattening it.',
            keyArguments: isSpanish
              ? ['Unidad bíblica', 'Cristo al centro', 'No aplastar el pasaje']
              : ['Biblical unity', 'Christ at the center', 'Do not flatten the passage'],
          },
        ]
    }
  })();

  return {
    passage: reference,
    challenge: buildChallenge(),
    views,
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
  const genre = detectStudyGenre(reference)
  const verses = verseEntriesFromPassageText(passageText)
  const firstRef = verses[0]?.reference || reference
  const ref23 = verses.find((item) => /:23\b/.test(item.reference))?.reference || firstRef
  const ref24 = verses.find((item) => /:24\b/.test(item.reference))?.reference || firstRef
  const ref6 = verses.find((item) => /:6\b/.test(item.reference))?.reference || firstRef
  const ref7 = verses.find((item) => /:7\b/.test(item.reference))?.reference || firstRef
  const ref8 = verses.find((item) => /:8\b/.test(item.reference))?.reference || firstRef
  const ref9to11 = verses.some((item) => /:9\b/.test(item.reference)) ? `${parseReferenceInfo(reference).book} ${parseReferenceInfo(reference).chapter}:9-11` : firstRef
  const ref12 = verses.find((item) => /:12\b/.test(item.reference))?.reference || firstRef
  const ref20 = verses.find((item) => /:20\b/.test(item.reference))?.reference || firstRef
  const ref21 = verses.find((item) => /:21\b/.test(item.reference))?.reference || firstRef
  const ref22to24 = verses.some((item) => /:22\b/.test(item.reference)) ? `${parseReferenceInfo(reference).book} ${parseReferenceInfo(reference).chapter}:22-24` : firstRef
  const ref17to21 = verses.some((item) => /:17\b/.test(item.reference)) ? `${parseReferenceInfo(reference).book} ${parseReferenceInfo(reference).chapter}:17-21` : firstRef
  const ref24only = verses.find((item) => /:24\b/.test(item.reference))?.reference || firstRef
  const ref8to11 = verses.some((item) => /:8\b/.test(item.reference)) ? `${parseReferenceInfo(reference).book} ${parseReferenceInfo(reference).chapter}:8-11` : firstRef

  const stageToRelation = (stage: 'foundation' | 'expansion' | 'echo' | 'fulfillment'): 'foundation' | 'development' | 'echo' | 'fulfillment' =>
    stage === 'expansion' ? 'development' : stage

  const makeVerse = (
    verseReference: string,
    snippet: string,
    contribution: string,
    stage: 'foundation' | 'expansion' | 'echo' | 'fulfillment' | 'application',
    testament: 'OT' | 'NT',
    era: 'Torah' | 'History' | 'Wisdom' | 'Prophets' | 'Gospels' | 'Acts' | 'Epistles' | 'Revelation',
  ): any => ({
    reference: verseReference,
    snippet,
    explanation: contribution,
    contribution,
    relation: stage === 'application' ? 'application' : stageToRelation(stage),
    canonicalStage: contribution,
    stage: stage === 'application' ? 'fulfillment' : stage,
    testament,
    era,
  })

  const makeTheme = (input: {
    id: string
    theme: string
    summary: string
    explanation: string
    canonicalMovement: string
    passageAnchor: string
    preachingUse: string
    category: string
    canonicalCategory: string
    tags: string[]
    confidence?: number
    cautions?: string[]
    verses: any[]
  }) => ({
    id: input.id,
    theme: input.theme,
    name: input.theme,
    priority: 'secondary' as const,
    summary: input.summary,
    description: input.summary,
    explanation: input.explanation,
    canonicalMovement: input.canonicalMovement,
    passageAnchor: input.passageAnchor,
    preachingUse: input.preachingUse,
    category: input.category,
    canonicalCategory: input.canonicalCategory,
    tags: input.tags,
    confidence: input.confidence ?? 0.82,
    cautions: input.cautions || [],
    development: input.verses,
    verses: input.verses,
  })

  const themePack = (() => {
    switch (genre) {
      case 'wisdom_poetry':
        return isSpanish
          ? [
              makeTheme({
                id: 'guidance-righteous',
                theme: 'La guía del Señor para los justos',
                summary: 'El Señor afirma y dirige el camino de los justos.',
                explanation: 'El ancla del pasaje está en los pasos establecidos por Dios, no en la autosuficiencia humana.',
                canonicalMovement: 'La sabiduría bíblica describe la vida fiel como un camino guiado por Dios y sostenido por su fidelidad.',
                passageAnchor: ref23,
                preachingUse: 'Úsalo para predicar dirección divina con humildad y dependencia, no autosuperación.',
                category: 'grace',
                canonicalCategory: 'wisdom',
                tags: ['guía', 'camino', 'justicia', 'pasos'],
                verses: [
                  makeVerse(ref23, 'El Señor afirma los pasos del justo.', 'El pasaje ancla el tema en la dirección personal del Señor.', 'fulfillment', 'OT', 'Wisdom'),
                  makeVerse('Proverbs 3:5-6', 'Él enderezará tus veredas.', 'La sabiduría vincula confianza con dirección divina.', 'foundation', 'OT', 'Wisdom'),
                  makeVerse('Psalm 23:3', 'Me guiará por sendas de justicia.', 'La guía del Pastor profundiza el tema del camino recto.', 'echo', 'OT', 'Wisdom'),
                  makeVerse('Isaiah 26:7', 'Tú allanas la senda del justo.', 'Los profetas amplían la imagen del camino nivelado por Dios.', 'expansion', 'OT', 'Prophets'),
                ],
              }),
              makeTheme({
                id: 'path-walk',
                theme: 'El camino del justo',
                summary: 'La imagen del camino describe la orientación completa de la vida delante de Dios.',
                explanation: 'El lenguaje de pasos y camino convierte la fidelidad en una trayectoria diaria, no en un momento aislado.',
                canonicalMovement: 'La Escritura usa repetidamente el camino para describir sabiduría, obediencia y comunión con Dios.',
                passageAnchor: ref23,
                preachingUse: 'Ayuda a mostrar que la fidelidad bíblica es una forma de andar, no solo una decisión puntual.',
                category: 'grace',
                canonicalCategory: 'wisdom',
                tags: ['camino', 'andar', 'sabiduría', 'fidelidad'],
                verses: [
                  makeVerse(ref23, 'Los pasos del justo tienen dirección.', 'El pasaje introduce el motivo del camino.', 'fulfillment', 'OT', 'Wisdom'),
                  makeVerse('Psalm 1:6', 'Jehová conoce el camino de los justos.', 'El Salmo 1 establece el contraste entre caminos.', 'foundation', 'OT', 'Wisdom'),
                  makeVerse('Deuteronomy 5:33', 'Andad en todo el camino que Jehová os ha mandado.', 'La Torá vincula el camino con obediencia de pacto.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Ephesians 2:10', 'Andemos en ellas.', 'El NT retoma el lenguaje del andar para la vida redimida.', 'expansion', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'sustaining-hand',
                theme: 'La mano que sostiene después del tropiezo',
                summary: 'El justo puede caer, pero no queda abandonado porque Dios lo sostiene.',
                explanation: 'El texto no promete ausencia de tropiezos; promete sostén divino.',
                canonicalMovement: 'La Biblia extiende esta promesa hacia perseverancia, restauración y preservación final.',
                passageAnchor: ref24,
                preachingUse: 'Predícalo para creyentes cansados, avergonzados o golpeados por la prueba.',
                category: 'grace',
                canonicalCategory: 'wisdom',
                tags: ['sostén', 'caída', 'mano de Dios', 'restauración'],
                verses: [
                  makeVerse(ref24, 'Aunque caiga, no quedará derribado.', 'El pasaje afirma sostén y no abandono.', 'fulfillment', 'OT', 'Wisdom'),
                  makeVerse('Proverbs 24:16', 'Siete veces cae el justo, y vuelve a levantarse.', 'La sabiduría reconoce tropiezos reales sin negar perseverancia.', 'echo', 'OT', 'Wisdom'),
                  makeVerse('Micah 7:8', 'Aunque caí, me levantaré.', 'Los profetas convierten la caída en escenario de la fidelidad divina.', 'expansion', 'OT', 'Prophets'),
                  makeVerse('Jude 24', 'Aquel que es poderoso para guardaros sin caída.', 'El NT lleva el tema hacia la preservación final del pueblo de Dios.', 'fulfillment', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'perseverance-trial',
                theme: 'Perseverancia en la prueba',
                summary: 'La perseverancia del justo nace de la fidelidad de Dios en medio de la prueba.',
                explanation: 'La caída no define el fin del justo porque la fidelidad divina sostiene el proceso.',
                canonicalMovement: 'Desde la sabiduría hasta el NT, la perseverancia se presenta como fruto del sostén de Dios.',
                passageAnchor: ref24,
                preachingUse: 'Úsalo para corregir lecturas triunfalistas y enseñar resistencia fiel.',
                category: 'salvation',
                canonicalCategory: 'wisdom',
                tags: ['perseverancia', 'prueba', 'resistencia', 'fidelidad'],
                verses: [
                  makeVerse(ref24, 'El justo tropieza, pero no termina destruido.', 'El texto une debilidad humana con fidelidad divina.', 'fulfillment', 'OT', 'Wisdom'),
                  makeVerse('James 1:12', 'Bienaventurado el varón que soporta la tentación.', 'El NT vincula perseverancia con bendición bajo prueba.', 'expansion', 'NT', 'Epistles'),
                  makeVerse('Romans 5:3-5', 'La tribulación produce paciencia.', 'Pablo desarrolla cómo la prueba madura la esperanza.', 'expansion', 'NT', 'Epistles'),
                  makeVerse('1 Peter 1:6-7', 'Afligidos en diversas pruebas.', 'Pedro muestra la prueba como refinamiento de fe.', 'echo', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'trust-amid-wicked',
                theme: 'Confiar mientras prospera el malvado',
                summary: 'El contexto del salmo llama a la confianza paciente cuando los impíos parecen prosperar.',
                explanation: 'Psalm 37 places the promise inside the tension of envying the wicked and waiting for the Lord.',
                canonicalMovement: 'La Escritura vuelve a esta tensión para enseñar paciencia, esperanza y confianza en la justicia final de Dios.',
                passageAnchor: 'Psalm 37',
                preachingUse: 'Sirve para ubicar el versículo dentro del conflicto moral del capítulo y evitar aplicaciones aisladas.',
                category: 'grace',
                canonicalCategory: 'wisdom',
                tags: ['confianza', 'impíos', 'espera', 'justicia de Dios'],
                verses: [
                  makeVerse('Psalm 37:1-7', 'No te impacientes a causa de los malignos.', 'El contexto del salmo define la tensión principal.', 'foundation', 'OT', 'Wisdom'),
                  makeVerse('Jeremiah 12:1', '¿Por qué prospera el camino de los impíos?', 'Los profetas repiten la misma pregunta dolorosa.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Habakkuk 2:3-4', 'El justo por su fe vivirá.', 'La espera fiel se convierte en respuesta a la injusticia visible.', 'expansion', 'OT', 'Prophets'),
                  makeVerse('2 Thessalonians 1:5-7', 'Dios dará reposo y justicia.', 'El NT lleva la espera hacia la vindicación final.', 'fulfillment', 'NT', 'Epistles'),
                ],
              }),
            ]
          : [
              makeTheme({
                id: 'guidance-righteous',
                theme: 'The Lord’s guidance of the righteous',
                summary: 'The Lord establishes and directs the path of the righteous.',
                explanation: 'The passage anchors this theme in steps established by God rather than human self-management.',
                canonicalMovement: 'Biblical wisdom treats faithful living as a God-guided path that later Scripture expands into perseverance and sustaining grace.',
                passageAnchor: ref23,
                preachingUse: 'Use this to preach divine direction with dependence and humility rather than self-improvement.',
                category: 'grace',
                canonicalCategory: 'wisdom',
                tags: ['guidance', 'path', 'righteous', 'steps'],
                verses: [
                  makeVerse(ref23, 'The Lord establishes the steps of the righteous.', 'The selected passage anchors the theme in God’s personal guidance.', 'fulfillment', 'OT', 'Wisdom'),
                  makeVerse('Proverbs 3:5-6', 'He shall direct thy paths.', 'Wisdom literature links trust to God-directed paths.', 'foundation', 'OT', 'Wisdom'),
                  makeVerse('Psalm 23:3', 'He leadeth me in the paths of righteousness.', 'The shepherd image deepens the guidance motif.', 'echo', 'OT', 'Wisdom'),
                  makeVerse('Isaiah 26:7', 'Thou dost weigh the path of the just.', 'The prophets extend the image of a path made straight by God.', 'expansion', 'OT', 'Prophets'),
                ],
              }),
              makeTheme({
                id: 'path-walk',
                theme: 'The way of the righteous',
                summary: 'The image of steps and way presents faithfulness as a whole manner of life before God.',
                explanation: 'The language of path and walking turns righteousness into a lived direction, not a single moment.',
                canonicalMovement: 'Scripture repeatedly uses the path motif to describe wisdom, obedience, and communion with God.',
                passageAnchor: ref23,
                preachingUse: 'This helps frame discipleship as a sustained walk with God rather than a one-time spiritual act.',
                category: 'grace',
                canonicalCategory: 'wisdom',
                tags: ['path', 'walk', 'wisdom', 'obedience'],
                verses: [
                  makeVerse(ref23, 'The steps of the righteous have direction.', 'The passage introduces the path motif.', 'fulfillment', 'OT', 'Wisdom'),
                  makeVerse('Psalm 1:6', 'The Lord knoweth the way of the righteous.', 'Psalm 1 sets the canonical contrast between two ways.', 'foundation', 'OT', 'Wisdom'),
                  makeVerse('Deuteronomy 5:33', 'Walk in all the ways which the LORD your God hath commanded you.', 'Torah ties the way motif to covenant obedience.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Ephesians 2:10', 'That we should walk in them.', 'The New Testament carries the walking image into redeemed life.', 'expansion', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'sustaining-hand',
                theme: 'Divine sustaining after stumbling',
                summary: 'The righteous may fall, but the Lord’s hand keeps the fall from becoming final ruin.',
                explanation: 'The text does not promise a stumble-free life; it promises God’s sustaining presence in weakness.',
                canonicalMovement: 'The theme widens into biblical perseverance, restoration, and God’s preserving hand.',
                passageAnchor: ref24,
                preachingUse: 'Preach this to discouraged believers who need sustaining grace rather than perfectionism.',
                category: 'grace',
                canonicalCategory: 'wisdom',
                tags: ['sustaining hand', 'falling', 'upholding', 'restoration'],
                verses: [
                  makeVerse(ref24, 'Though he fall, he shall not be utterly cast down.', 'The passage asserts real stumbling without final abandonment.', 'fulfillment', 'OT', 'Wisdom'),
                  makeVerse('Proverbs 24:16', 'A just man falleth seven times, and riseth up again.', 'Wisdom literature recognizes repeated stumbling without denying perseverance.', 'echo', 'OT', 'Wisdom'),
                  makeVerse('Micah 7:8', 'When I fall, I shall arise.', 'The prophets turn personal collapse into a stage for God’s faithfulness.', 'expansion', 'OT', 'Prophets'),
                  makeVerse('Jude 24', 'Able to keep you from falling.', 'The New Testament carries the theme toward God’s final preserving power.', 'fulfillment', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'perseverance-trial',
                theme: 'Perseverance under trial',
                summary: 'The righteous endure because God sustains them in trial and weakness.',
                explanation: 'The fall in Psalm 37 is not final because divine faithfulness steadies the righteous through adversity.',
                canonicalMovement: 'From wisdom literature to the apostles, perseverance is framed as the fruit of God’s sustaining grace.',
                passageAnchor: ref24,
                preachingUse: 'Use this theme to correct triumphalism and teach durable faith under pressure.',
                category: 'salvation',
                canonicalCategory: 'wisdom',
                tags: ['perseverance', 'trial', 'endurance', 'faithfulness'],
                verses: [
                  makeVerse(ref24, 'The righteous stumble but are not destroyed.', 'The chosen text joins human weakness to divine faithfulness.', 'fulfillment', 'OT', 'Wisdom'),
                  makeVerse('James 1:12', 'Blessed is the man that endureth temptation.', 'The New Testament names endurance as blessed under trial.', 'expansion', 'NT', 'Epistles'),
                  makeVerse('Romans 5:3-5', 'Tribulation worketh patience.', 'Paul shows how suffering matures hope.', 'expansion', 'NT', 'Epistles'),
                  makeVerse('1 Peter 1:6-7', 'Ye are in heaviness through manifold temptations.', 'Peter frames testing as refinement of genuine faith.', 'echo', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'trust-amid-wicked',
                theme: 'Trust while the wicked appear to prosper',
                summary: 'Psalm 37 places these verses inside the tension of envying the wicked and waiting for the Lord.',
                explanation: 'The promise of upheld steps belongs to a psalm that teaches patience when evil looks successful.',
                canonicalMovement: 'Scripture repeatedly returns to this tension to teach waiting, hope, and confidence in God’s justice.',
                passageAnchor: 'Psalm 37',
                preachingUse: 'This theme keeps the verses tied to the chapter’s moral pressure instead of treating them as isolated encouragement.',
                category: 'grace',
                canonicalCategory: 'wisdom',
                tags: ['trust', 'wicked', 'waiting', 'justice'],
                verses: [
                  makeVerse('Psalm 37:1-7', 'Fret not thyself because of evildoers.', 'The immediate context defines the psalm’s central tension.', 'foundation', 'OT', 'Wisdom'),
                  makeVerse('Jeremiah 12:1', 'Wherefore doth the way of the wicked prosper?', 'The prophets revisit the same painful question.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Habakkuk 2:3-4', 'The just shall live by his faith.', 'Waiting in faith becomes the answer to visible injustice.', 'expansion', 'OT', 'Prophets'),
                  makeVerse('2 Thessalonians 1:5-7', 'The Lord Jesus shall be revealed from heaven.', 'The New Testament carries the theme toward final vindication.', 'fulfillment', 'NT', 'Epistles'),
                ],
              }),
            ]
      case 'gospel_dialogue':
        return isSpanish
          ? [
              makeTheme({
                id: 'amor-divino',
                theme: 'El amor de Dios que toma la iniciativa',
                summary: 'Juan 3:16 presenta la salvación como iniciativa del amor de Dios.',
                explanation: 'El pasaje no comienza con la respuesta humana sino con el amor y la entrega divinos.',
                canonicalMovement: 'Desde el pacto hasta el evangelio, la Escritura muestra que Dios toma la iniciativa para salvar.',
                passageAnchor: reference,
                preachingUse: 'Predícalo como iniciativa divina antes de hablar de respuesta humana.',
                category: 'grace',
                canonicalCategory: 'gospels',
                tags: ['amor de Dios', 'iniciativa divina', 'gracia'],
                verses: [
                  makeVerse(reference, 'Porque de tal manera amó Dios al mundo.', 'El pasaje ancla el tema en el amor de Dios.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Deuteronomy 7:7-8', 'Jehová os amó.', 'El pacto ya mostraba la iniciativa del amor divino.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Romans 5:8', 'Dios muestra su amor para con nosotros.', 'Pablo desarrolla la misma lógica de amor previo.', 'expansion', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'gift-son',
                theme: 'El don del Hijo',
                summary: 'La entrega del Hijo revela el corazón del Padre y el costo de la salvación.',
                explanation: 'Juan 3:16 no ofrece una idea abstracta sino el don del Hijo unigénito.',
                canonicalMovement: 'La línea bíblica del sacrificio y del hijo prometido encuentra su centro en Cristo dado por el Padre.',
                passageAnchor: reference,
                preachingUse: 'Úsalo para mostrar que la salvación tiene forma personal y cristológica.',
                category: 'salvation',
                canonicalCategory: 'cross',
                tags: ['Hijo', 'don', 'entrega', 'Cristo'],
                verses: [
                  makeVerse(reference, 'Dio a su Hijo unigénito.', 'El pasaje ancla el tema en el don del Hijo.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Genesis 22:8', 'Dios se proveerá de cordero.', 'La provisión divina anticipa el don supremo.', 'foundation', 'OT', 'Torah'),
                  makeVerse('1 John 4:9-10', 'Dios envió a su Hijo.', 'Juan mismo amplía el tema del Hijo enviado en amor.', 'expansion', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'faith-life',
                theme: 'Fe que recibe vida eterna',
                summary: 'La fe recibe la vida que Dios da en el Hijo.',
                explanation: 'La vida eterna aparece como don recibido por creer, no como logro moral.',
                canonicalMovement: 'La promesa de vida se concentra en el Hijo y se recibe por fe.',
                passageAnchor: reference,
                preachingUse: 'Ayuda a mantener juntas la oferta universal y la respuesta de fe.',
                category: 'salvation',
                canonicalCategory: 'gospels',
                tags: ['fe', 'vida eterna', 'creer'],
                verses: [
                  makeVerse(reference, 'Para que todo aquel que en él cree tenga vida eterna.', 'El pasaje une fe y vida eterna.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Habakkuk 2:4', 'El justo por su fe vivirá.', 'La vida por fe prepara la línea canónica.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('John 20:31', 'Para que creyendo tengáis vida.', 'El Evangelio de Juan explicita su propio propósito.', 'echo', 'NT', 'Gospels'),
                ],
              }),
            ]
          : [
              makeTheme({
                id: 'divine-love',
                theme: 'God’s initiating love',
                summary: 'John 3:16 presents salvation as the initiative of God’s love.',
                explanation: 'The passage begins with God’s love and gift, not with human worthiness.',
                canonicalMovement: 'From covenant love to gospel fulfillment, Scripture shows God moving first to save.',
                passageAnchor: reference,
                preachingUse: 'Use this theme to keep divine initiative in front before turning to human response.',
                category: 'grace',
                canonicalCategory: 'gospels',
                tags: ['love of God', 'initiative', 'grace'],
                verses: [
                  makeVerse(reference, 'God so loved the world.', 'The chosen verse anchors the theme in divine initiative.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Deuteronomy 7:7-8', 'The LORD loved you.', 'Covenant love provides the earlier canonical pattern.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Romans 5:8', 'God commendeth his love toward us.', 'Paul expands the same theme of prior love.', 'expansion', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'gift-of-son',
                theme: 'The gift of the Son',
                summary: 'The giving of the Son reveals the Father’s heart and the cost of salvation.',
                explanation: 'John 3:16 offers not an abstraction but the concrete gift of the only begotten Son.',
                canonicalMovement: 'The biblical line of sacrifice and promised sonship centers in Christ given by the Father.',
                passageAnchor: reference,
                preachingUse: 'Use this to keep the passage explicitly Christ-centered rather than reducing it to a slogan.',
                category: 'salvation',
                canonicalCategory: 'cross',
                tags: ['Son', 'gift', 'Christ', 'atonement'],
                verses: [
                  makeVerse(reference, 'He gave his only begotten Son.', 'The passage anchors the theme in the Father’s gift.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Genesis 22:8', 'God will provide himself a lamb.', 'The provision motif anticipates the greater gift.', 'foundation', 'OT', 'Torah'),
                  makeVerse('1 John 4:9-10', 'God sent his only begotten Son into the world.', 'John’s epistle expands the same theme in explicit theological language.', 'expansion', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'faith-and-life',
                theme: 'Faith receiving eternal life',
                summary: 'Faith receives the life God gives in the Son.',
                explanation: 'Eternal life is presented as a gift received by believing, not a moral achievement earned by effort.',
                canonicalMovement: 'The promise of life narrows toward the Son and is received by faith.',
                passageAnchor: reference,
                preachingUse: 'This theme helps keep together the universal offer and the necessary response of faith.',
                category: 'salvation',
                canonicalCategory: 'gospels',
                tags: ['faith', 'eternal life', 'belief'],
                verses: [
                  makeVerse(reference, 'Whosoever believeth in him should not perish, but have everlasting life.', 'The selected verse binds faith to life.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Habakkuk 2:4', 'The just shall live by his faith.', 'The prophets provide an earlier faith-life axis.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('John 20:31', 'Believing ye might have life through his name.', 'John’s stated purpose reinforces the same theme.', 'echo', 'NT', 'Gospels'),
                ],
              }),
            ]
      case 'parable':
        return isSpanish
          ? [
              makeTheme({
                id: 'restoring-mercy',
                theme: 'Misericordia que restaura',
                summary: 'El padre recibe al hijo arrepentido con compasión restauradora, no con mera tolerancia.',
                explanation: 'El ancla del pasaje está en la carrera del padre, el abrazo y la restauración pública.',
                canonicalMovement: 'La Escritura presenta a Dios como misericordioso y restaurador, culminando en la bienvenida del Padre en la enseñanza de Jesús.',
                passageAnchor: ref20,
                preachingUse: 'Úsalo para mostrar que la gracia no solo perdona; también restaura la relación y el honor.',
                category: 'grace',
                canonicalCategory: 'gospels',
                tags: ['misericordia', 'restauración', 'compasión', 'hijo'],
                verses: [
                  makeVerse(ref20, 'El padre fue movido a misericordia y corrió.', 'El pasaje muestra misericordia activa y restauradora.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Exodus 34:6-7', 'Misericordioso y piadoso.', 'La autodefinición divina establece el fundamento del tema.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Psalm 103:8-13', 'Como el padre se compadece de los hijos.', 'La compasión paternal anticipa la escena de Lucas.', 'echo', 'OT', 'Wisdom'),
                  makeVerse('Hosea 11:8-9', 'Se revuelven dentro de mí mis compasiones.', 'Los profetas muestran compasión divina sobre juicio merecido.', 'expansion', 'OT', 'Prophets'),
                  makeVerse('2 Corinthians 5:18-20', 'Dios nos reconcilió consigo mismo.', 'La reconciliación apostólica prolonga la restauración del pasaje.', 'application', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'repentance-return',
                theme: 'Arrepentimiento y regreso',
                summary: 'El hijo vuelve en arrepentimiento, confesión y humildad.',
                explanation: 'La parábola muestra un regreso consciente, no una simple mejora de circunstancias.',
                canonicalMovement: 'La Biblia llama al pecador a volver al Señor con arrepentimiento sincero.',
                passageAnchor: ref17to21,
                preachingUse: 'Predícalo para mostrar cómo el arrepentimiento nombra el pecado y regresa al Padre.',
                category: 'grace',
                canonicalCategory: 'gospels',
                tags: ['arrepentimiento', 'confesión', 'retorno', 'humildad'],
                verses: [
                  makeVerse(ref17to21, 'Volveré a mi padre.', 'El pasaje ancla el tema en un regreso confesional.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Isaiah 55:6-7', 'Vuélvase a Jehová.', 'Los profetas llaman al impío a volver a Dios.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('Joel 2:12-13', 'Convertíos a mí de todo vuestro corazón.', 'El arrepentimiento bíblico une regreso y corazón rendido.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Acts 3:19', 'Arrepentíos y convertíos.', 'La predicación apostólica mantiene el mismo llamado.', 'application', 'NT', 'Acts'),
                  makeVerse('1 John 1:9', 'Si confesamos nuestros pecados.', 'La confesión sigue siendo la forma de volver a la luz.', 'application', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'lost-and-found',
                theme: 'Perdido y hallado',
                summary: 'La restauración del hijo forma parte del gran gozo bíblico por lo perdido que vuelve a ser hallado.',
                explanation: 'La declaración “perdido y es hallado” ofrece el lema teológico del pasaje.',
                canonicalMovement: 'La Escritura retrata a Dios buscando, encontrando y restaurando a los perdidos.',
                passageAnchor: ref24only,
                preachingUse: 'Úsalo para conectar la historia con la misión de Dios hacia los perdidos.',
                category: 'grace',
                canonicalCategory: 'gospels',
                tags: ['perdido', 'hallado', 'gozo', 'misión'],
                verses: [
                  makeVerse(ref24only, 'Se había perdido, y es hallado.', 'El pasaje enuncia su propio centro teológico.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Ezekiel 34:11-16', 'Yo buscaré mis ovejas.', 'La búsqueda divina del perdido ya estaba prometida.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('Luke 15:4-10', 'Gozo por un pecador que se arrepiente.', 'Las parábolas anteriores preparan explícitamente este clímax.', 'echo', 'NT', 'Gospels'),
                  makeVerse('Luke 19:10', 'El Hijo del Hombre vino a buscar y a salvar.', 'Jesús formula directamente la misión de hallar al perdido.', 'fulfillment', 'NT', 'Gospels'),
                ],
              }),
              makeTheme({
                id: 'sonship-restored',
                theme: 'Hijo restaurado a la casa',
                summary: 'La restauración incluye pertenencia, vestido, mesa y honra familiar.',
                explanation: 'La ropa, el anillo y el banquete muestran que la relación es restaurada públicamente.',
                canonicalMovement: 'La Escritura desarrolla la identidad de hijos restaurados por la gracia de Dios.',
                passageAnchor: ref22to24,
                preachingUse: 'Predícalo para mostrar que la gracia no deja al arrepentido en la puerta; lo recibe como hijo.',
                category: 'grace',
                canonicalCategory: 'church',
                tags: ['hijo', 'adopción', 'pertenencia', 'identidad'],
                verses: [
                  makeVerse(ref22to24, 'Vestidle... poned un anillo... haced fiesta.', 'El pasaje muestra restauración visible de identidad y pertenencia.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Hosea 1:10', 'Hijos del Dios viviente.', 'La restauración de identidad filial ya aparece en los profetas.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('John 1:12', 'Les dio potestad de ser hechos hijos de Dios.', 'El Evangelio amplía la restauración en lenguaje de adopción.', 'expansion', 'NT', 'Gospels'),
                  makeVerse('Romans 8:15-17', 'Habéis recibido el Espíritu de adopción.', 'Pablo desarrolla pertenencia y herencia filial.', 'application', 'NT', 'Epistles'),
                  makeVerse('Galatians 4:4-7', 'Ya no eres siervo, sino hijo.', 'La adopción define la nueva identidad del redimido.', 'application', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'grace-overcoming-shame',
                theme: 'La gracia vence la vergüenza',
                summary: 'La bienvenida del padre cubre la vergüenza del hijo y lo recibe con honor.',
                explanation: 'La restauración pública responde a la humillación pública del fracaso del hijo.',
                canonicalMovement: 'La Escritura muestra a Dios cubriendo vergüenza, limpiando culpa y recibiendo al pecador.',
                passageAnchor: ref20,
                preachingUse: 'Úsalo para hablar a los que temen regresar por vergüenza o fracaso visible.',
                category: 'grace',
                canonicalCategory: 'cross',
                tags: ['gracia', 'vergüenza', 'bienvenida', 'reconciliación'],
                verses: [
                  makeVerse(ref20, 'Le besó y lo recibió.', 'El pasaje muestra gracia que vence la vergüenza del regreso.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Genesis 3:21', 'Jehová hizo túnicas y los vistió.', 'La vergüenza es cubierta desde los primeros capítulos bíblicos.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Zechariah 3:1-5', 'Quitadle esas vestiduras viles.', 'La restauración incluye limpieza y nueva vestidura.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Romans 5:8', 'Cristo murió por nosotros.', 'La gracia alcanza al pecador antes de que merezca restauración.', 'expansion', 'NT', 'Epistles'),
                  makeVerse('Ephesians 2:4-10', 'Por gracia sois salvos.', 'Pablo formula la misma lógica de gracia restauradora.', 'application', 'NT', 'Epistles'),
                ],
              }),
            ]
          : [
              makeTheme({
                id: 'restoring-mercy',
                theme: 'Restoring mercy',
                summary: 'The father receives the repentant son with restoring compassion, not mere tolerance.',
                explanation: 'The anchor of the passage is the father’s running, embrace, and public restoration.',
                canonicalMovement: 'Scripture presents God as merciful and restorative, culminating in the Father’s welcome in Jesus’ teaching.',
                passageAnchor: ref20,
                preachingUse: 'Use this to show that grace not only forgives but restores relationship and honor.',
                category: 'grace',
                canonicalCategory: 'gospels',
                tags: ['mercy', 'restoration', 'compassion', 'sonship'],
                verses: [
                  makeVerse(ref20, 'His father saw him, and had compassion, and ran.', 'The selected passage displays active restoring mercy.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Exodus 34:6-7', 'The LORD God, merciful and gracious.', 'God’s self-revelation lays the canonical foundation for mercy.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Psalm 103:8-13', 'Like as a father pitieth his children.', 'The fatherly compassion of the Psalms anticipates Luke 15.', 'echo', 'OT', 'Wisdom'),
                  makeVerse('Hosea 11:8-9', 'My repentings are kindled together.', 'The prophets depict compassion overcoming deserved judgment.', 'expansion', 'OT', 'Prophets'),
                  makeVerse('2 Corinthians 5:18-20', 'God hath reconciled us to himself.', 'Apostolic reconciliation extends the restoring movement of the parable.', 'application', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'repentance-return',
                theme: 'Repentance and return',
                summary: 'The son returns in repentance, confession, and humility.',
                explanation: 'The parable presents a conscious turning back, not a mere change in circumstances.',
                canonicalMovement: 'Scripture repeatedly calls sinners to return to the Lord in honest repentance.',
                passageAnchor: ref17to21,
                preachingUse: 'Use this to frame repentance as honest confession and return to the Father.',
                category: 'grace',
                canonicalCategory: 'gospels',
                tags: ['repentance', 'confession', 'return', 'humility'],
                verses: [
                  makeVerse(ref17to21, 'I will arise and go to my father.', 'The selected passage anchors the theme in repentant return.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Isaiah 55:6-7', 'Let the wicked forsake his way.', 'The prophets call sinners to return to God.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('Joel 2:12-13', 'Turn ye even to me with all your heart.', 'Biblical repentance joins return with heart-level surrender.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Acts 3:19', 'Repent ye therefore, and be converted.', 'The apostolic witness keeps the same call to return.', 'application', 'NT', 'Acts'),
                  makeVerse('1 John 1:9', 'If we confess our sins.', 'Confession remains a canonical expression of returning to God.', 'application', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'lost-and-found',
                theme: 'Lost and found',
                summary: 'The son’s restoration belongs to the biblical joy over the lost being found.',
                explanation: 'The declaration “was lost, and is found” gives the parable its theological headline.',
                canonicalMovement: 'Scripture portrays God seeking, finding, and restoring the lost.',
                passageAnchor: ref24only,
                preachingUse: 'Use this to connect the story to God’s mission toward the lost.',
                category: 'grace',
                canonicalCategory: 'gospels',
                tags: ['lost', 'found', 'joy', 'mission'],
                verses: [
                  makeVerse(ref24only, 'Was lost, and is found.', 'The selected verse states the passage’s own theological center.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Ezekiel 34:11-16', 'I will seek that which was lost.', 'God’s shepherding mission frames the canonical background.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('Luke 15:4-10', 'Joy in heaven over one sinner that repenteth.', 'The earlier parables in Luke 15 explicitly prepare this climax.', 'echo', 'NT', 'Gospels'),
                  makeVerse('Luke 19:10', 'The Son of man is come to seek and to save that which was lost.', 'Jesus states the mission that the parable dramatizes.', 'fulfillment', 'NT', 'Gospels'),
                ],
              }),
              makeTheme({
                id: 'sonship-restored',
                theme: 'Sonship restored',
                summary: 'Restoration includes belonging, clothing, table fellowship, and family honor.',
                explanation: 'The robe, ring, and feast show public restoration of relationship, not bare survival.',
                canonicalMovement: 'Scripture develops the identity of restored sons and daughters who belong in the Father’s house.',
                passageAnchor: ref22to24,
                preachingUse: 'Use this to show that grace does not leave the repentant at the gate; it welcomes them home as children.',
                category: 'grace',
                canonicalCategory: 'church',
                tags: ['sonship', 'belonging', 'adoption', 'identity'],
                verses: [
                  makeVerse(ref22to24, 'Bring forth the best robe... put a ring on his hand.', 'The selected verses display visible restoration of sonship.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Hosea 1:10', 'Ye are the sons of the living God.', 'The prophets already speak of restored filial identity.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('John 1:12', 'Power to become the sons of God.', 'The Gospel expands restoration in language of divine sonship.', 'expansion', 'NT', 'Gospels'),
                  makeVerse('Romans 8:15-17', 'Ye have received the Spirit of adoption.', 'Paul develops belonging and inheritance as adopted children.', 'application', 'NT', 'Epistles'),
                  makeVerse('Galatians 4:4-7', 'Thou art no more a servant, but a son.', 'Adoption language deepens the homecoming logic of the parable.', 'application', 'NT', 'Epistles'),
                ],
              }),
              makeTheme({
                id: 'grace-overcoming-shame',
                theme: 'Grace overcoming shame',
                summary: 'The father’s welcome covers the son’s shame and receives him with honor.',
                explanation: 'Public restoration answers the public humiliation created by the son’s rebellion and ruin.',
                canonicalMovement: 'Scripture shows God covering shame, cleansing guilt, and welcoming the returning sinner.',
                passageAnchor: ref20,
                preachingUse: 'Use this for hearers who fear returning because of visible failure or shame.',
                category: 'grace',
                canonicalCategory: 'cross',
                tags: ['grace', 'shame', 'welcome', 'reconciliation'],
                verses: [
                  makeVerse(ref20, 'He fell on his neck, and kissed him.', 'The selected passage shows grace overriding shame at the moment of return.', 'fulfillment', 'NT', 'Gospels'),
                  makeVerse('Genesis 3:21', 'The LORD God made coats of skins, and clothed them.', 'Shame is covered from the earliest chapters of Scripture.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Zechariah 3:1-5', 'Take away the filthy garments from him.', 'Restoration includes cleansing and new clothing.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Romans 5:8', 'While we were yet sinners, Christ died for us.', 'Grace reaches the sinner before worthiness appears.', 'expansion', 'NT', 'Epistles'),
                  makeVerse('Ephesians 2:4-10', 'By grace are ye saved.', 'Paul articulates the same restoring grace in doctrinal form.', 'application', 'NT', 'Epistles'),
                ],
              }),
            ]
      case 'prophetic_apocalyptic':
        return isSpanish
          ? [
              makeTheme({
                id: 'everlasting-gospel',
                theme: 'El evangelio eterno',
                summary: 'Apocalipsis 14:6 abre el pasaje con una proclamación mundial de buenas noticias.',
                explanation: 'La advertencia apocalíptica comienza con evangelio, no con sensacionalismo.',
                canonicalMovement: 'La misión a las naciones culmina en una proclamación final centrada en el evangelio.',
                passageAnchor: ref6,
                preachingUse: 'Predícalo como la nota inicial del pasaje para mantener un tono esperanzado y cristocéntrico.',
                category: 'salvation',
                canonicalCategory: 'gospels',
                tags: ['evangelio', 'misión', 'naciones', 'proclamación'],
                verses: [
                  makeVerse(ref6, 'Tenía el evangelio eterno para predicarlo a toda nación.', 'El pasaje ancla el tema en proclamación global.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Genesis 12:3', 'Serán benditas en ti todas las familias de la tierra.', 'La bendición a las naciones anticipa la amplitud del evangelio.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Matthew 24:14', 'Será predicado este evangelio del reino en todo el mundo.', 'Jesús mismo anuncia la extensión global del evangelio.', 'expansion', 'NT', 'Gospels'),
                  makeVerse('Revelation 5:9', 'Nos has redimido... de todo linaje y lengua y pueblo y nación.', 'La adoración celestial confirma el alcance universal del evangelio.', 'echo', 'NT', 'Revelation'),
                ],
              }),
              makeTheme({
                id: 'creator-worship',
                theme: 'Adoración al Creador',
                summary: 'El pasaje llama a dar gloria a Dios y a adorar al Creador.',
                explanation: 'La respuesta central al evangelio en este pasaje es adoración verdadera.',
                canonicalMovement: 'La Escritura conecta creación, adoración y fidelidad de pacto desde la Torá hasta Apocalipsis.',
                passageAnchor: ref7,
                preachingUse: 'Úsalo para vincular evangelio, creación y lealtad en adoración.',
                category: 'law',
                canonicalCategory: 'creation',
                tags: ['Creador', 'adoración', 'creación', 'lealtad'],
                verses: [
                  makeVerse(ref7, 'Adorad a aquel que hizo el cielo y la tierra.', 'El pasaje define la adoración verdadera por la identidad del Creador.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Genesis 1:1', 'En el principio creó Dios.', 'La creación establece el derecho de Dios a ser adorado.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Exodus 20:11', 'En seis días hizo Jehová los cielos y la tierra.', 'La resonancia sabática conecta creación y adoración.', 'echo', 'OT', 'Torah'),
                  makeVerse('Psalm 95:6', 'Adoremos y postrémonos.', 'La adoración bíblica responde al Dios creador y pastor.', 'expansion', 'OT', 'Wisdom'),
                  makeVerse('Acts 14:15', 'Os anunciamos... que os convirtáis... al Dios vivo, que hizo el cielo y la tierra.', 'La misión apostólica ya une llamado y adoración al Creador.', 'application', 'NT', 'Acts'),
                ],
              }),
              makeTheme({
                id: 'judgment-accountability',
                theme: 'Juicio y responsabilidad',
                summary: 'La hora del juicio hace urgente la reverencia, la gloria y la respuesta a Dios.',
                explanation: 'El pasaje no trata el juicio como espectáculo sino como llamado santo a rendir cuentas.',
                canonicalMovement: 'La Biblia presenta el juicio como parte del gobierno moral de Dios sobre el mundo.',
                passageAnchor: ref7,
                preachingUse: 'Predícalo con sobriedad y esperanza, no con miedo sensacionalista.',
                category: 'judgment',
                canonicalCategory: 'judgment',
                tags: ['juicio', 'responsabilidad', 'reverencia', 'gloria'],
                verses: [
                  makeVerse(ref7, 'La hora de su juicio ha llegado.', 'El pasaje ancla el tema en urgencia moral y reverencia.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Ecclesiastes 12:13-14', 'Dios traerá toda obra a juicio.', 'La sabiduría ya coloca la vida bajo evaluación divina.', 'foundation', 'OT', 'Wisdom'),
                  makeVerse('Daniel 7:9-10', 'El juicio se sentó.', 'Daniel aporta el escenario apocalíptico del juicio.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Acts 17:30-31', 'Ha establecido un día en el cual juzgará al mundo.', 'La proclamación apostólica lleva el juicio a las naciones.', 'expansion', 'NT', 'Acts'),
                ],
              }),
              makeTheme({
                id: 'babylon-deception',
                theme: 'Babilonia y engaño',
                summary: 'La caída de Babilonia expone el poder corruptor del engaño religioso y moral.',
                explanation: 'El anuncio de su caída desenmascara una alianza seductora que aparta a las naciones de Dios.',
                canonicalMovement: 'Desde Babel hasta Babilonia en Apocalipsis, la Escritura muestra sistemas humanos orgullosos y engañosos opuestos a Dios.',
                passageAnchor: ref8,
                preachingUse: 'Úsalo para denunciar el engaño espiritual sin caer en tono caótico o conspirativo.',
                category: 'prophecy',
                canonicalCategory: 'prophets',
                tags: ['Babilonia', 'engaño', 'caída', 'corrupción'],
                verses: [
                  makeVerse(ref8, 'Ha caído Babilonia.', 'El pasaje nombra la caída del sistema engañoso.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Genesis 11:4', 'Hagámonos un nombre.', 'Babel anticipa la arrogancia corporativa contra Dios.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Isaiah 21:9', 'Cayó, cayó Babilonia.', 'Los profetas ya anuncian la ruina de Babilonia.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Jeremiah 51:7-8', 'Babilonia fue copa de oro... cayó Babilonia.', 'Jeremías profundiza el tema de corrupción y juicio.', 'expansion', 'OT', 'Prophets'),
                  makeVerse('Revelation 17:1-6', 'La gran ramera.', 'La imagen se amplía en la misma profecía apocalíptica.', 'application', 'NT', 'Revelation'),
                ],
              }),
              makeTheme({
                id: 'true-false-worship',
                theme: 'Adoración verdadera y adoración falsa',
                summary: 'El pasaje contrasta la adoración al Creador con la lealtad falsa al sistema de la bestia.',
                explanation: 'La crisis central no es mera información profética sino adoración y lealtad.',
                canonicalMovement: 'La Escritura contrasta repetidamente la adoración fiel con la idolatría y la falsa lealtad.',
                passageAnchor: ref9to11,
                preachingUse: 'Predícalo como un llamado a lealtad real a Dios frente a presiones rivales.',
                category: 'prophecy',
                canonicalCategory: 'judgment',
                tags: ['adoración', 'bestia', 'marca', 'lealtad'],
                verses: [
                  makeVerse(ref9to11, 'Si alguno adora a la bestia.', 'El pasaje define la crisis final en términos de adoración.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Exodus 32:1-6', 'Hicieron un becerro de fundición.', 'La idolatría del pueblo de Dios forma un antecedente decisivo.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Daniel 3:16-18', 'No serviremos a tus dioses.', 'La fidelidad bajo presión estatal prepara la escena apocalíptica.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Matthew 4:10', 'Al Señor tu Dios adorarás.', 'Jesús formula el principio de adoración exclusiva.', 'expansion', 'NT', 'Gospels'),
                  makeVerse('Revelation 13:12-17', 'Hace que la tierra adore a la primera bestia.', 'El contexto inmediato desarrolla la falsa adoración que aquí se condena.', 'application', 'NT', 'Revelation'),
                ],
              }),
              makeTheme({
                id: 'endurance-saints',
                theme: 'La perseverancia de los santos',
                summary: 'Los santos son identificados por paciencia, obediencia y la fe de Jesús.',
                explanation: 'El verso final del pasaje define el perfil del pueblo fiel bajo presión.',
                canonicalMovement: 'La Escritura une perseverancia, lealtad de pacto y fe centrada en Cristo.',
                passageAnchor: ref12,
                preachingUse: 'Úsalo para terminar el pasaje con esperanza fiel y resistencia santa.',
                category: 'covenant',
                canonicalCategory: 'church',
                tags: ['paciencia', 'mandamientos', 'fe de Jesús', 'santos'],
                verses: [
                  makeVerse(ref12, 'Aquí está la paciencia de los santos.', 'El pasaje concluye definiendo al pueblo fiel.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Daniel 7:25-27', 'Los santos del Altísimo recibirán el reino.', 'Daniel prepara la identidad perseverante de los santos.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('Hebrews 10:36', 'Os es necesaria la paciencia.', 'El NT llama a resistencia perseverante bajo presión.', 'expansion', 'NT', 'Epistles'),
                  makeVerse('Revelation 13:10', 'Aquí está la paciencia y la fe de los santos.', 'El contexto cercano ya introduce esta identidad perseverante.', 'echo', 'NT', 'Revelation'),
                ],
              }),
            ]
          : [
              makeTheme({
                id: 'everlasting-gospel',
                theme: 'The everlasting gospel',
                summary: 'Revelation 14:6 opens the passage with a worldwide proclamation of good news.',
                explanation: 'Apocalyptic warning begins with gospel, not with fear-driven spectacle.',
                canonicalMovement: 'Mission to the nations culminates in a final proclamation centered on the gospel.',
                passageAnchor: ref6,
                preachingUse: 'Use this as the opening note of the passage to keep the sermon hopeful and Christ-centered.',
                category: 'salvation',
                canonicalCategory: 'gospels',
                tags: ['gospel', 'mission', 'nations', 'proclamation'],
                verses: [
                  makeVerse(ref6, 'Having the everlasting gospel to preach unto them that dwell on the earth.', 'The passage anchors the theme in global proclamation.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Genesis 12:3', 'In thee shall all families of the earth be blessed.', 'Blessing to the nations anticipates the gospel’s worldwide reach.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Matthew 24:14', 'This gospel of the kingdom shall be preached in all the world.', 'Jesus announces the global spread of the gospel before the end.', 'expansion', 'NT', 'Gospels'),
                  makeVerse('Revelation 5:9', 'Thou hast redeemed us... out of every kindred, and tongue, and people, and nation.', 'Heavenly worship confirms the universal scope of redemption.', 'echo', 'NT', 'Revelation'),
                ],
              }),
              makeTheme({
                id: 'creator-worship',
                theme: 'Creator worship',
                summary: 'The passage calls humanity to give glory to God and worship the Creator.',
                explanation: 'True response to the gospel in this passage takes the shape of worship grounded in God’s identity as Creator.',
                canonicalMovement: 'Scripture ties creation, worship, and covenant loyalty together from Torah to Revelation.',
                passageAnchor: ref7,
                preachingUse: 'Use this to connect gospel, creation, and covenant loyalty in worship.',
                category: 'law',
                canonicalCategory: 'creation',
                tags: ['Creator', 'worship', 'creation', 'allegiance'],
                verses: [
                  makeVerse(ref7, 'Worship him that made heaven, and earth, and the sea, and the fountains of waters.', 'The passage defines true worship by the Creator’s identity.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Genesis 1:1', 'In the beginning God created the heaven and the earth.', 'Creation grounds God’s right to worship.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Exodus 20:11', 'For in six days the LORD made heaven and earth.', 'Sabbath creation language resonates directly with Revelation 14:7.', 'echo', 'OT', 'Torah'),
                  makeVerse('Psalm 95:6', 'O come, let us worship and bow down.', 'Biblical worship responds to the Creator and Shepherd.', 'expansion', 'OT', 'Wisdom'),
                  makeVerse('Acts 14:15', 'Turn from these vanities unto the living God, which made heaven, and earth.', 'Apostolic mission already unites repentance with Creator worship.', 'application', 'NT', 'Acts'),
                ],
              }),
              makeTheme({
                id: 'judgment-accountability',
                theme: 'Judgment and accountability',
                summary: 'The hour of judgment makes reverence, glory, and response to God urgent.',
                explanation: 'The passage treats judgment not as spectacle but as a holy call to answer to God.',
                canonicalMovement: 'Scripture presents judgment as part of God’s moral governance over the world.',
                passageAnchor: ref7,
                preachingUse: 'Preach this with sobriety and hope rather than sensational fear.',
                category: 'judgment',
                canonicalCategory: 'judgment',
                tags: ['judgment', 'accountability', 'reverence', 'glory'],
                verses: [
                  makeVerse(ref7, 'The hour of his judgment is come.', 'The selected verse anchors the theme in urgent moral accountability.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Ecclesiastes 12:13-14', 'God shall bring every work into judgment.', 'Wisdom literature already places life under divine evaluation.', 'foundation', 'OT', 'Wisdom'),
                  makeVerse('Daniel 7:9-10', 'The judgment was set, and the books were opened.', 'Daniel supplies the apocalyptic courtroom background.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Acts 17:30-31', 'He hath appointed a day, in the which he will judge the world.', 'Apostolic proclamation carries judgment to the nations.', 'expansion', 'NT', 'Acts'),
                ],
              }),
              makeTheme({
                id: 'babylon-deception',
                theme: 'Babylon and deception',
                summary: 'Babylon’s fall exposes the corrupting power of spiritual and moral deception.',
                explanation: 'The announcement of Babylon’s fall unmasks a seductive system drawing the nations away from God.',
                canonicalMovement: 'From Babel to Babylon in Revelation, Scripture portrays proud, corrupt systems opposed to God.',
                passageAnchor: ref8,
                preachingUse: 'Use this to name spiritual deception without slipping into chaotic speculation.',
                category: 'prophecy',
                canonicalCategory: 'prophets',
                tags: ['Babylon', 'deception', 'fall', 'corruption'],
                verses: [
                  makeVerse(ref8, 'Babylon is fallen, is fallen.', 'The selected verse names the downfall of a deceptive system.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Genesis 11:4', 'Let us make us a name.', 'Babel anticipates corporate pride in defiance of God.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Isaiah 21:9', 'Babylon is fallen, is fallen.', 'The prophetic announcement is echoed directly in Revelation.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Jeremiah 51:7-8', 'Babylon hath been a golden cup... Babylon is suddenly fallen.', 'Jeremiah deepens the motifs of corruption and judgment.', 'expansion', 'OT', 'Prophets'),
                  makeVerse('Revelation 17:1-6', 'The judgment of the great whore.', 'The same apocalypse expands Babylon’s identity and seduction.', 'application', 'NT', 'Revelation'),
                ],
              }),
              makeTheme({
                id: 'true-false-worship',
                theme: 'True and false worship',
                summary: 'The passage contrasts worship of the Creator with false allegiance to the beastly system.',
                explanation: 'The central crisis is not mere information about prophecy but the question of worship and loyalty.',
                canonicalMovement: 'Scripture repeatedly contrasts faithful worship with idolatry and counterfeit allegiance.',
                passageAnchor: ref9to11,
                preachingUse: 'Use this to frame the passage as a real call to loyal worship under pressure.',
                category: 'prophecy',
                canonicalCategory: 'judgment',
                tags: ['worship', 'beast', 'mark', 'allegiance'],
                verses: [
                  makeVerse(ref9to11, 'If any man worship the beast and his image.', 'The selected unit defines the final crisis in terms of worship.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Exodus 32:1-6', 'They made a molten calf.', 'Israel’s idolatry forms an early pattern of false worship.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Daniel 3:16-18', 'We will not serve thy gods.', 'Faithful resistance to coerced worship prepares the apocalyptic pattern.', 'echo', 'OT', 'Prophets'),
                  makeVerse('Matthew 4:10', 'Thou shalt worship the Lord thy God, and him only shalt thou serve.', 'Jesus states the principle of exclusive worship.', 'expansion', 'NT', 'Gospels'),
                  makeVerse('Revelation 13:12-17', 'He causeth the earth... to worship the first beast.', 'The immediate context details the counterfeit worship condemned in chapter 14.', 'application', 'NT', 'Revelation'),
                ],
              }),
              makeTheme({
                id: 'endurance-saints',
                theme: 'Endurance of the saints',
                summary: 'The saints are identified by endurance, obedience, and the faith of Jesus.',
                explanation: 'The final verse defines the faithful people of God under pressure.',
                canonicalMovement: 'Scripture joins perseverance, covenant loyalty, and Christ-centered faith as the mark of God’s people.',
                passageAnchor: ref12,
                preachingUse: 'Use this to land the passage in faithful hope and holy endurance.',
                category: 'covenant',
                canonicalCategory: 'church',
                tags: ['endurance', 'commandments', 'faith of Jesus', 'saints'],
                verses: [
                  makeVerse(ref12, 'Here is the patience of the saints.', 'The selected verse concludes the passage by defining the faithful.', 'fulfillment', 'NT', 'Revelation'),
                  makeVerse('Daniel 7:25-27', 'The saints of the most High shall take the kingdom.', 'Daniel prepares the persevering identity of the saints.', 'foundation', 'OT', 'Prophets'),
                  makeVerse('Hebrews 10:36', 'Ye have need of patience.', 'The New Testament explicitly calls for endurance under pressure.', 'expansion', 'NT', 'Epistles'),
                  makeVerse('Revelation 13:10', 'Here is the patience and the faith of the saints.', 'The immediate context already names the saints by patient faith.', 'echo', 'NT', 'Revelation'),
                ],
              }),
            ]
      case 'covenant_law':
        return isSpanish
          ? [
              makeTheme({
                id: 'holy-time',
                theme: 'Tiempo santo recordado',
                summary: 'El mandamiento llama a recordar y santificar el tiempo que Dios apartó.',
                explanation: 'El sábado aparece como tiempo recibido de Dios, no inventado por la comunidad.',
                canonicalMovement: 'La Escritura vincula tiempo santo con memoria, adoración y pertenencia al Dios del pacto.',
                passageAnchor: firstRef,
                preachingUse: 'Úsalo para mostrar que el tiempo santo forma la vida del pueblo de Dios.',
                category: 'law',
                canonicalCategory: 'covenant',
                tags: ['sábado', 'tiempo santo', 'memoria', 'pacto'],
                verses: [
                  makeVerse(firstRef, 'Acuérdate del día de reposo.', 'El pasaje ancla el tema en memoria y santidad.', 'fulfillment', 'OT', 'Torah'),
                  makeVerse('Genesis 2:2-3', 'Bendijo Dios al día séptimo y lo santificó.', 'La creación establece el patrón de tiempo santo.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Ezekiel 20:12', 'Les di también mis días de reposo por señal.', 'Los profetas presentan el sábado como señal de pacto.', 'echo', 'OT', 'Prophets'),
                ],
              }),
              makeTheme({
                id: 'creator-rest',
                theme: 'Creación, descanso y adoración',
                summary: 'El descanso sabático está arraigado en la obra creadora de Dios.',
                explanation: 'La razón dada en el pasaje mira hacia la creación como fundamento de adoración y ritmo.',
                canonicalMovement: 'La creación y el descanso forman un hilo canónico que ordena adoración, identidad y esperanza.',
                passageAnchor: reference,
                preachingUse: 'Ayuda a predicar el sábado como respuesta al Creador y no como formalismo vacío.',
                category: 'law',
                canonicalCategory: 'creation',
                tags: ['creación', 'descanso', 'adoración', 'Creador'],
                verses: [
                  makeVerse(reference, 'Porque en seis días hizo Jehová los cielos y la tierra.', 'El pasaje ancla el tema en la creación.', 'fulfillment', 'OT', 'Torah'),
                  makeVerse('Psalm 95:6', 'Adoremos y postrémonos.', 'La adoración del Creador acompaña el descanso santo.', 'echo', 'OT', 'Wisdom'),
                  makeVerse('Mark 2:27-28', 'El sábado fue hecho por causa del hombre.', 'Jesús clarifica el propósito humano y teológico del sábado.', 'expansion', 'NT', 'Gospels'),
                ],
              }),
              makeTheme({
                id: 'redeemed-obedience',
                theme: 'Obediencia del pueblo redimido',
                summary: 'El mandamiento ordena la vida de un pueblo que ya ha sido rescatado por Dios.',
                explanation: 'La ley del pacto no crea la redención; forma la vida de quienes ya pertenecen a Dios.',
                canonicalMovement: 'La Escritura presenta la obediencia como forma de vida del pueblo redimido.',
                passageAnchor: reference,
                preachingUse: 'Predícalo para evitar legalismo y para ubicar la obediencia después de la gracia redentora.',
                category: 'law',
                canonicalCategory: 'covenant',
                tags: ['obediencia', 'redención', 'pacto', 'pueblo de Dios'],
                verses: [
                  makeVerse(reference, 'El mandamiento ordena la vida del pueblo del pacto.', 'El texto se sitúa dentro de la vida redimida de Israel.', 'fulfillment', 'OT', 'Torah'),
                  makeVerse('Deuteronomy 5:15', 'Acuérdate que fuiste siervo... por eso te mandó Jehová.', 'Deuteronomio une el sábado con redención histórica.', 'expansion', 'OT', 'Torah'),
                  makeVerse('John 14:15', 'Si me amáis, guardad mis mandamientos.', 'El NT mantiene obediencia como respuesta de amor.', 'application', 'NT', 'Gospels'),
                ],
              }),
            ]
          : [
              makeTheme({
                id: 'holy-time',
                theme: 'Holy time remembered',
                summary: 'The command calls God’s people to remember and sanctify time that God Himself set apart.',
                explanation: 'The Sabbath appears as received holy time, not as a community invention.',
                canonicalMovement: 'Scripture ties holy time to memory, worship, and belonging to the covenant God.',
                passageAnchor: firstRef,
                preachingUse: 'Use this to show that holy time shapes the life of God’s people.',
                category: 'law',
                canonicalCategory: 'covenant',
                tags: ['Sabbath', 'holy time', 'memory', 'covenant'],
                verses: [
                  makeVerse(firstRef, 'Remember the sabbath day, to keep it holy.', 'The passage anchors the theme in memory and sanctification.', 'fulfillment', 'OT', 'Torah'),
                  makeVerse('Genesis 2:2-3', 'God blessed the seventh day, and sanctified it.', 'Creation establishes the pattern of holy time.', 'foundation', 'OT', 'Torah'),
                  makeVerse('Ezekiel 20:12', 'I gave them my sabbaths, to be a sign.', 'The prophets present Sabbath as covenant sign.', 'echo', 'OT', 'Prophets'),
                ],
              }),
              makeTheme({
                id: 'creator-rest',
                theme: 'Creation, rest, and worship',
                summary: 'Sabbath rest is grounded in God’s creating work.',
                explanation: 'The rationale in the passage looks back to creation as the foundation of worship and rhythm.',
                canonicalMovement: 'Creation and rest form a canonical thread that orders worship, identity, and hope.',
                passageAnchor: reference,
                preachingUse: 'Use this to preach Sabbath as response to the Creator rather than empty formalism.',
                category: 'law',
                canonicalCategory: 'creation',
                tags: ['creation', 'rest', 'worship', 'Creator'],
                verses: [
                  makeVerse(reference, 'For in six days the LORD made heaven and earth.', 'The passage anchors the theme directly in creation.', 'fulfillment', 'OT', 'Torah'),
                  makeVerse('Psalm 95:6', 'O come, let us worship and bow down.', 'Creator worship accompanies holy rest.', 'echo', 'OT', 'Wisdom'),
                  makeVerse('Mark 2:27-28', 'The sabbath was made for man.', 'Jesus clarifies the human and theological purpose of Sabbath.', 'expansion', 'NT', 'Gospels'),
                ],
              }),
              makeTheme({
                id: 'redeemed-obedience',
                theme: 'Obedience of a redeemed people',
                summary: 'The command orders the life of a people already rescued by God.',
                explanation: 'Covenant law does not create redemption; it shapes the life of those who already belong to the Lord.',
                canonicalMovement: 'Scripture presents obedience as the form of life appropriate to a redeemed people.',
                passageAnchor: reference,
                preachingUse: 'Use this to avoid legalism and place obedience after redeeming grace.',
                category: 'law',
                canonicalCategory: 'covenant',
                tags: ['obedience', 'redemption', 'covenant', 'people of God'],
                verses: [
                  makeVerse(reference, 'The command orders covenant life.', 'The text stands inside the redeemed life of Israel.', 'fulfillment', 'OT', 'Torah'),
                  makeVerse('Deuteronomy 5:15', 'Remember that thou wast a servant... therefore the LORD thy God commanded thee.', 'Deuteronomy ties Sabbath directly to redemption.', 'expansion', 'OT', 'Torah'),
                  makeVerse('John 14:15', 'If ye love me, keep my commandments.', 'The New Testament preserves obedience as a loving response.', 'application', 'NT', 'Gospels'),
                ],
              }),
            ]
      default:
        return isSpanish
          ? [
              makeTheme({
                id: 'hilo-canonico',
                theme: 'Hilo canónico del pasaje',
                summary: 'El pasaje debe leerse dentro de la historia bíblica mayor sin perder su peso local.',
                explanation: 'El punto de partida sigue siendo el propio pasaje, sus motivos y su contexto inmediato.',
                canonicalMovement: 'El tema avanza del texto local hacia el testimonio bíblico más amplio sin aplanar el pasaje.',
                passageAnchor: firstRef,
                preachingUse: 'Úsalo para conectar el pasaje con la historia bíblica manteniendo primero la intención local del texto.',
                category: 'gospel',
                canonicalCategory: 'other',
                tags: ['canon', 'contexto', 'motivos bíblicos'],
                verses: [
                  makeVerse(firstRef, verses[0]?.text || reference, 'El pasaje provee el ancla inicial del hilo canónico.', 'fulfillment', 'NT', 'Gospels'),
                ],
              }),
            ]
          : [
              makeTheme({
                id: 'canonical-thread',
                theme: 'Canonical thread of the passage',
                summary: 'The passage should be read inside the larger biblical storyline without losing its local weight.',
                explanation: 'The starting point remains the passage itself, its motifs, and its immediate context.',
                canonicalMovement: 'The theme moves from the local text toward the wider biblical witness without flattening the passage.',
                passageAnchor: firstRef,
                preachingUse: 'Use this to connect the passage to the broader canon while keeping the local intent of the text primary.',
                category: 'gospel',
                canonicalCategory: 'other',
                tags: ['canon', 'context', 'biblical motifs'],
                verses: [
                  makeVerse(firstRef, verses[0]?.text || reference, 'The selected passage provides the initial canonical anchor.', 'fulfillment', 'NT', 'Gospels'),
                ],
              }),
            ]
    }
  })();
  return {
    passage: reference,
    themes: themePack.map((item, index) => ({
      ...item,
      isPrimary: index === 0,
      priority: (index === 0 ? 'primary' : index < 3 ? 'secondary' : 'supporting') as 'primary' | 'secondary' | 'supporting',
    })),
    dataSource: 'llm-generated' as const,
    warnings: ['Cross-reference data was limited; theme development uses passage-level analysis.'],
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
  const lead = passageLeadSentence(passageText, 220)
  return {
    verseReference: reference,
    notes: [
      {
        type: 'context' as const,
        content: lead || (isSpanish
          ? 'Este versículo resume la verdad central del pasaje y su respuesta pastoral. Úsalo para introducir la escena, no para reemplazar el contexto más amplio.'
          : 'This verse summarizes the passage’s central truth and its pastoral response. Use it to introduce the scene, not replace the wider context.'),
        source: isSpanish ? 'contexto' : 'context',
      },
      {
        type: 'theological' as const,
        content: isSpanish
          ? 'Predica este versículo como una declaración clara y centrada en Cristo. Luego muévelo hacia la respuesta de fe y la invitación pastoral.'
          : 'Preach this verse as a clear, Christ-centered declaration. Then move it toward faith response and pastoral invitation.',
        source: isSpanish ? 'teología' : 'theology',
      },
      {
        type: 'historical' as const,
        content: isSpanish
          ? 'Si no hay datos específicos, reconoce la limitación y usa el versículo para mostrar la intención general del autor bíblico.'
          : 'If no specific historical data is available, name the limitation and use the verse to show the author’s general intent.',
        source: isSpanish ? 'histórico' : 'historical',
      },
      {
        type: 'word' as const,
        content: isSpanish
          ? 'Identifica una o dos palabras clave del texto y explica por qué el sentido de esas palabras importa para la predicación.'
          : 'Name one or two key words in the text and explain why their meaning matters for preaching.',
        source: isSpanish ? 'palabra' : 'word',
      },
    ],
    dataSource: 'llm-generated' as const,
  }
}
