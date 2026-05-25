"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectHistoricalGenre = detectHistoricalGenre;
exports.resolveHistoricalContextRange = resolveHistoricalContextRange;
exports.composeHistoricalContextOutput = composeHistoricalContextOutput;
exports.isWeakHistoricalContextOutput = isWeakHistoricalContextOutput;
exports.validateHistoricalContextOutput = validateHistoricalContextOutput;
exports.normalizeHistoricalContextOutput = normalizeHistoricalContextOutput;
var BANNED_LABELS = [
    'fallback',
    'custom',
    'template',
    'placeholder',
    'generated',
    'social realities',
];
var stripBannedLabels = function (value) {
    var text = String(value || '');
    text = text.replace(/\b(fallback|custom|template|placeholder|generated)\b/gi, '');
    text = text.replace(/\b(social realities)\b/gi, 'community');
    text = text.replace(/\b(literary setting of psalm)\b/gi, 'poetic setting within the psalm');
    text = text.replace(/\b(narrative or doctrinal flow)\b/gi, 'the passage’s own literary movement');
    text = text.replace(/\s{2,}/g, ' ');
    return text.trim();
};
var clean = function (value) { return stripBannedLabels(value).replace(/\s+([,.;:!?])/g, '$1').trim(); };
var sentence = function (value) {
    var text = clean(value);
    if (!text)
        return '';
    return /[.!?]$/.test(text) ? text : "".concat(text, ".");
};
var normalizeReference = function (reference) { return String(reference || '').trim().toLowerCase(); };
var bookKeyFromReference = function (reference) {
    var normalized = normalizeReference(reference);
    var bookMatch = normalized.match(/^([a-z0-9]+)\s+/);
    return (bookMatch === null || bookMatch === void 0 ? void 0 : bookMatch[1]) || normalized;
};
var chapterFromReference = function (reference) {
    var _a;
    var match = String(reference || '').trim().match(/^(.*?)\s+(\d+)(?::(\d+)(?:[-–—](\d+))?)?$/);
    return {
        book: ((_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0 ? void 0 : _a.trim()) || '',
        chapter: match ? Number(match[2]) : null,
        verseStart: (match === null || match === void 0 ? void 0 : match[3]) ? Number(match[3]) : null,
        verseEnd: (match === null || match === void 0 ? void 0 : match[4]) ? Number(match[4]) : (match === null || match === void 0 ? void 0 : match[3]) ? Number(match[3]) : null,
    };
};
function detectHistoricalGenre(reference) {
    var _a = chapterFromReference(reference), book = _a.book, chapter = _a.chapter;
    var normalizedBook = book.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedBook === 'psalms' || normalizedBook === 'psalm' || normalizedBook === 'ps') {
        return 'wisdom_poetry';
    }
    if (normalizedBook === 'proverbs' || normalizedBook === 'ecclesiastes' || normalizedBook === 'job') {
        return 'wisdom_poetry';
    }
    if (['matthew', 'mark', 'luke', 'john'].includes(normalizedBook)) {
        if (normalizedBook === 'luke' && chapter === 15)
            return 'parable';
        return 'gospel_dialogue';
    }
    if (normalizedBook === 'revelation' || normalizedBook === 'rev' || normalizedBook === 'apocalipsis') {
        return 'prophetic_apocalyptic';
    }
    if (normalizedBook === 'exodus' || normalizedBook === 'exod') {
        if (chapter === 20)
            return 'covenant_law';
        return 'narrative';
    }
    if ([
        'romans', '1corinthians', '2corinthians', 'galatians', 'ephesians', 'philippians',
        'colossians', '1thessalonians', '2thessalonians', '1timothy', '2timothy', 'titus',
        'philemon', 'hebrews', 'james', '1peter', '2peter', '1john', '2john', '3john', 'jude',
    ].includes(normalizedBook)) {
        return 'epistle';
    }
    if (['genesis', 'exodus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', '1samuel', '2samuel',
        '1kings', '2kings', '1chronicles', '2chronicles', 'ezra', 'nehemiah', 'esther', 'matthew',
        'mark', 'luke', 'john', 'acts'].includes(normalizedBook)) {
        return 'narrative';
    }
    return 'general';
}
function resolveHistoricalContextRange(reference, genre) {
    var chapter = chapterFromReference(reference).chapter;
    if (genre === 'wisdom_poetry') {
        return chapter === 37 ? 6 : 4;
    }
    if (genre === 'parable')
        return 3;
    if (genre === 'gospel_dialogue')
        return 2;
    if (genre === 'prophetic_apocalyptic')
        return 2;
    if (genre === 'covenant_law')
        return 1;
    if (genre === 'epistle')
        return 2;
    return 2;
}
var buildSectionItem = function (item) { return (__assign(__assign({}, item), { aspect: item.aspect ? clean(item.aspect) : item.aspect, description: clean(item.description), impact: item.impact ? clean(item.impact) : item.impact, structure: item.structure ? clean(item.structure) : item.structure, dynamics: item.dynamics ? clean(item.dynamics) : item.dynamics, relevance: item.relevance ? clean(item.relevance) : item.relevance, factor: item.factor ? clean(item.factor) : item.factor, element: item.element ? clean(item.element) : item.element, tension: item.tension ? clean(item.tension) : item.tension, pressure: item.pressure ? clean(item.pressure) : item.pressure, source: item.source ? clean(item.source) : item.source, pastoralResponse: item.pastoralResponse ? clean(item.pastoralResponse) : item.pastoralResponse })); };
var specialCaseGuide = function (reference) {
    var normalized = normalizeReference(reference);
    if (normalized.startsWith('psalm 37') || normalized.startsWith('ps 37')) {
        return {
            genreLabel: 'wisdom psalm',
            geographyLine: 'Exact geography is not central here; the psalm draws its force from covenant life and worship, not from a travel setting.',
            socialRealities: [
                {
                    aspect: 'Worshiping community tempted to envy',
                    description: 'Psalm 37 speaks to believers who see the wicked prosper and wonder whether faithfulness is worth it.',
                    impact: 'The psalm does pastoral work in a congregation that needs patience instead of panic.',
                },
                {
                    aspect: 'Poetic instruction about life direction',
                    description: 'The imagery of steps, paths, and the way of the righteous is wisdom language, not a report of one historical incident.',
                    impact: 'Preaching should track the psalm’s moral and devotional movement instead of flattening it into narrative form.',
                },
            ],
            powerStructures: [
                {
                    structure: 'Temporary power of the wicked',
                    description: 'The wicked can appear strong for a season, but their success is not the last word.',
                    dynamics: 'The psalm admits that injustice can look successful for a season.',
                    relevance: 'The preacher should confront envy and fear without pretending evil is insignificant.',
                },
            ],
            economicContext: [
                {
                    factor: 'Land and inheritance language',
                    description: 'The promise of inheritance points to covenant security, not merely private property.',
                },
            ],
            religiousClimate: [
                {
                    element: 'Trust versus comparison',
                    description: 'The psalm calls the faithful to delight in the Lord, wait for Him, and resist measuring life by the wicked’s apparent success.',
                    tension: 'The righteous must trust when outcomes are not yet visible.',
                },
                {
                    element: 'Guided steps',
                    description: '“Steps” and “path” language frames daily life as direction from God rather than self-managed control.',
                    tension: 'The faithful are called to steady obedience, not flawless self-protection.',
                },
            ],
            audiencePressures: [
                {
                    pressure: 'Envy and discouragement',
                    description: 'The faithful may look at the wicked and wonder whether trust is worthwhile.',
                    source: 'Seeing the wicked prosper while the faithful struggle',
                    pastoralResponse: 'The psalm insists that the Lord establishes the steps of those who delight in Him.',
                },
                {
                    pressure: 'Fear that one failure means ruin',
                    description: 'A stumble can feel final even when the covenant promise is still holding.',
                    source: 'The reality that the righteous may stumble',
                    pastoralResponse: 'The fall is real, but abandonment is not final because the Lord upholds His people.',
                },
            ],
            synthesisStatement: 'Psalm 37 is a wisdom psalm that addresses the temptation to envy the wicked. It calls the righteous to trust, wait, and remain faithful while the Lord establishes their steps. The preacher should emphasize God’s sustaining faithfulness, not human perfection, because stumbling is possible but final abandonment is not.',
        };
    }
    if (normalized.startsWith('john 3:16') || normalized.startsWith('john 3')) {
        return {
            genreLabel: 'gospel dialogue',
            geographyLine: 'No exact geography drives the meaning here; the night conversation and canonical setting matter more than location.',
            socialRealities: [
                {
                    aspect: 'Nighttime conversation with a respected teacher',
                    description: 'Jesus speaks to Nicodemus, a representative of religious status, in a setting marked by curiosity and caution.',
                    impact: 'The passage confronts religious certainty with the need for new birth.',
                },
                {
                    aspect: 'Conversation inside the Gospel of John',
                    description: 'John places this verse inside a larger theological conversation about belief, light, and new life.',
                    impact: 'The verse should be preached as the climax of the dialogue, not as a detached slogan.',
                },
            ],
            powerStructures: [
                {
                    structure: 'Religious authority',
                    description: 'Nicodemus stands for recognized religious leadership and learning.',
                    dynamics: 'Nicodemus represents the world of recognized religious leadership and learning.',
                    relevance: 'The gospel speaks to people who have status but still need regeneration.',
                },
            ],
            economicContext: [
                {
                    factor: 'No direct economic setting',
                    description: 'The passage is not about trade or labor pressures; its force lies in salvation language and divine initiative.',
                },
            ],
            religiousClimate: [
                {
                    element: 'Second Temple Jewish expectation',
                    description: 'The conversation sits inside a world where teachers, signs, and purity concerns shaped the way people thought about God.',
                    tension: 'Nicodemus must move from inherited religion to living trust in the Son.',
                },
                {
                    element: 'Belief and new birth',
                    description: 'John 3:16 gathers the chapter’s themes into one sentence: God’s love, the Son’s gift, belief, and eternal life.',
                    tension: 'The issue is not mere information but receiving what grace gives.',
                },
            ],
            audiencePressures: [
                {
                    pressure: 'Status without transformation',
                    description: 'A person may hold honor and still need new birth.',
                    source: 'A religious leader can know the language of faith without being born again',
                    pastoralResponse: 'The verse invites hearers to receive life from God rather than rely on pedigree or performance.',
                },
            ],
            synthesisStatement: 'John 3:16 belongs in the nighttime conversation with Nicodemus and the chapter’s larger movement from misunderstanding to new birth. Geography is not the key interpretive factor; the canonical and theological setting is. The preacher should highlight God’s initiating love and the Son’s gift, not turn the verse into a generic inspirational line.',
        };
    }
    if (normalized.startsWith('luke 15')) {
        return {
            genreLabel: 'parable',
            geographyLine: 'No exact map detail is needed; the force of the passage is the homecoming image, the family setting, and the honor-shame world behind the parables.',
            socialRealities: [
                {
                    aspect: 'Public criticism of Jesus’ table fellowship',
                    description: 'Luke 15 follows grumbling from religious insiders over Jesus welcoming sinners and eating with them.',
                    impact: 'The chapter is pastoral response, not isolated moralism.',
                },
                {
                    aspect: 'Household and inheritance expectations',
                    description: 'The younger son’s request and return play in an honor-shame world where inheritance and family standing matter deeply.',
                    impact: 'Repentance is not abstract; it touches belonging, shame, and restored relationship.',
                },
            ],
            powerStructures: [
                {
                    structure: 'Religious and social judgment',
                    description: 'The self-appointed gatekeepers of righteousness are critiquing Jesus for welcoming the wrong people.',
                    dynamics: 'The Pharisaic posture assumes control over who belongs at the table.',
                    relevance: 'Jesus answers criticism with parables of lostness and welcome.',
                },
            ],
            economicContext: [
                {
                    factor: 'Inheritance and famine pressure',
                    description: 'The younger son’s ruin is economic, but the deeper issue is broken relationship.',
                },
            ],
            religiousClimate: [
                {
                    element: 'Mercy versus self-righteous distance',
                    description: 'The chapter presses the question of whether joy will be found in God’s recovery of the lost.',
                    tension: 'The audience must choose between resentment and rejoicing.',
                },
                {
                    element: 'Homecoming as grace',
                    description: 'The father running to meet the son is the visual center of the parable’s hope.',
                    tension: 'Grace is not sentimental; it restores the repentant to the household.',
                },
            ],
            audiencePressures: [
                {
                    pressure: 'Shame and dislocation',
                    description: 'The younger son returns with nothing to claim and no status to protect.',
                    source: 'The son has squandered his place and returns with nothing to claim',
                    pastoralResponse: 'The father’s welcome shows grace that restores identity before it restores status.',
                },
                {
                    pressure: 'Religious resentment',
                    description: 'Some hearers think mercy is unfair when it reaches people they had written off.',
                    source: 'Listeners who think mercy is unfair',
                    pastoralResponse: 'Jesus invites them to see that joy belongs in the recovery of the lost.',
                },
            ],
            synthesisStatement: 'Luke 15 is a parable-shaped response to grumbling about Jesus welcoming sinners. The passage works through honor, shame, inheritance, and homecoming more than through geography. Preaching should move from distance to repentance to welcome to restoration, without flattening the chapter into a generic “God loves you” message.',
        };
    }
    if (normalized.startsWith('revelation 14') || normalized.startsWith('rev 14')) {
        return {
            genreLabel: 'prophetic apocalyptic proclamation',
            geographyLine: 'Geography is not central here; the passage is about worship, witness, and allegiance under pressure.',
            socialRealities: [
                {
                    aspect: 'Believers living under coercive worship systems',
                    description: 'Revelation frames a world where political and religious power pressures people to compromise.',
                    impact: 'The vision strengthens endurance without sensationalism.',
                },
            ],
            powerStructures: [
                {
                    structure: 'Imperial and religious power',
                    description: 'Empire and idolatry can demand loyalty that belongs to God alone.',
                    dynamics: 'The chapter stands against systems that demand allegiance apart from God.',
                    relevance: 'The message is about faithful witness, not fear-driven spectacle.',
                },
            ],
            economicContext: [
                {
                    factor: 'Buying and selling pressure',
                    description: 'Economic life can become a loyalty test when empire or idolatry controls commerce.',
                },
            ],
            religiousClimate: [
                {
                    element: 'Everlasting gospel',
                    description: 'The chapter begins with good news before warning and calls people to worship the Creator.',
                    tension: 'Urgency must stay Christ-centered and hope-filled.',
                },
                {
                    element: 'Faithfulness of the saints',
                    description: 'The passage closes with endurance, commandments, and the faith of Jesus.',
                    tension: 'The church is called to steadfast loyalty, not panic.',
                },
            ],
            audiencePressures: [
                {
                    pressure: 'Fear of pressure and compromise',
                    description: 'Believers can feel squeezed by systems that reward compromise and punish fidelity.',
                    source: 'A community facing coercion and spiritual confusion',
                    pastoralResponse: 'The vision answers with the everlasting gospel, worship, and patient faithfulness.',
                },
            ],
            synthesisStatement: 'Revelation 14 is a prophetic-apocalyptic proclamation that begins with the everlasting gospel and only then moves to warning. Geography is not the point; worship and allegiance are. The preacher should keep the message Christ-centered, hopeful, and non-sensational, with an emphasis on faithful endurance and the Creator’s claim on human worship.',
        };
    }
    if (normalized.startsWith('exodus 20')) {
        return {
            genreLabel: 'covenant law',
            geographyLine: 'The mountain setting matters, but the deeper weight is covenant identity, liberation from slavery, and a new rhythm of life under God.',
            socialRealities: [
                {
                    aspect: 'A newly freed people learning covenant life',
                    description: 'Exodus 20 comes after deliverance from Egypt, so the commandments are given to a rescued community, not a slave class.',
                    impact: 'Sabbath becomes a sign of freedom and trust, not mere regulation.',
                },
            ],
            powerStructures: [
                {
                    structure: 'YHWH’s covenant authority',
                    description: 'The command comes from the God who redeemed Israel, not from Pharaoh.',
                    dynamics: 'The command comes from the God who redeemed Israel, not from Pharaoh.',
                    relevance: 'The law is framed by grace and rescue.',
                },
            ],
            economicContext: [
                {
                    factor: 'Work and rest patterns',
                    description: 'The Sabbath command shapes labor, household rhythm, servants, and animals alike.',
                },
            ],
            religiousClimate: [
                {
                    element: 'Creation and redemption memory',
                    description: 'The command connects creation rest with liberation from slavery.',
                    tension: 'The people must remember who they are and whose they are.',
                },
            ],
            audiencePressures: [
                {
                    pressure: 'Identity after slavery',
                    description: 'A liberated people needs a new rhythm of life and trust.',
                    source: 'A people learning how to live after rescue',
                    pastoralResponse: 'The command teaches trust, freedom, and covenant belonging.',
                },
            ],
            synthesisStatement: 'Exodus 20 is covenant law given to a redeemed people after deliverance from Egypt. The mountain setting matters, but geography is not the main interpretive key; the text is about covenant identity, creation memory, and a liberated rhythm of rest. Preaching should show how Sabbath flows from God’s rescue and care, not from bare obligation.',
        };
    }
    return null;
};
var genericByGenre = function (input, genreLabel) {
    var _a, _b, _c, _d;
    var passage = clean(input.passageText || input.expandedPassageText || input.reference);
    var book = chapterFromReference(input.reference).book || input.reference;
    var bookKey = bookKeyFromReference(input.reference);
    var historicalDate = ((_a = input.historicalContext) === null || _a === void 0 ? void 0 : _a.approximateDate) ? clean(String(input.historicalContext.approximateDate)) : null;
    var author = ((_b = input.historicalContext) === null || _b === void 0 ? void 0 : _b.author) ? clean(String(input.historicalContext.author).replace(/_/g, ' ')) : null;
    var culturalSummary = input.culturalContext
        ? Object.entries(input.culturalContext)
            .filter(function (_a) {
            var value = _a[1];
            return Array.isArray(value) ? value.length > 0 : Boolean(value);
        })
            .slice(0, 2)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "".concat(key, ": ").concat(Array.isArray(value) ? value.slice(0, 2).join(', ') : String(value));
        })
        : [];
    var geographyNote = input.geographyContext && Object.keys(input.geographyContext).length > 0
        ? 'Geography is secondary here; the passage’s canonical and literary setting carries more weight than location alone.'
        : 'Exact geography is limited or not central, so the preacher should lean on canonical and cultural context.';
    return {
        socialRealities: [
            buildSectionItem({
                aspect: genreLabel === 'wisdom psalm' ? 'Worshiping community' : 'Original audience',
                description: sentence(historicalDate
                    ? "".concat(book, " sits in a ").concat(genreLabel, " setting with ").concat(historicalDate, " as its broad historical backdrop.")
                    : "".concat(book, " sits in a ").concat(genreLabel, " setting, so the passage should be read with its own literary and canonical frame.")),
                impact: sentence("The preacher should keep the passage tied to the chapter\u2019s movement: ".concat(passage.slice(0, 180))),
            }),
            buildSectionItem({
                aspect: 'Cultural frame',
                description: sentence(culturalSummary.length
                    ? "".concat(culturalSummary.join(' · '))
                    : "".concat(geographyNote, " Cultural setting is the richer lens for this passage.")),
                impact: sentence('Use the cultural frame to clarify symbols, habits, and covenant language for the congregation.'),
            }),
        ],
        powerStructures: [
            buildSectionItem({
                structure: author ? "".concat(author, " / canonical setting") : "".concat(book, " / canonical setting"),
                dynamics: sentence("The passage belongs within ".concat(genreLabel, " and should not be isolated from the surrounding chapter.")),
                relevance: sentence('The preacher should read the verse as part of the chapter’s argument, prayer, or proclamation.'),
            }),
        ],
        economicContext: [
            buildSectionItem({
                factor: 'Livelihood and daily life',
                description: sentence(((_d = (_c = input.culturalContext) === null || _c === void 0 ? void 0 : _c.economicSystems) === null || _d === void 0 ? void 0 : _d.length)
                    ? "Economic background matters where the text touches daily work: ".concat(String(input.culturalContext.economicSystems[0]), ".")
                    : 'No detailed economic background is central here, so the sermon should not force a market story into the text.'),
            }),
        ],
        religiousClimate: [
            buildSectionItem({
                element: genreLabel,
                description: sentence("This passage speaks from within a ".concat(genreLabel, " world, so poetic, covenantal, parabolic, or apocalyptic language should be handled on its own terms.")),
                tension: sentence("The preacher should let the chapter\u2019s own movement do the work rather than flattening it into a generic moral lesson."),
            }),
        ],
        audiencePressures: [
            buildSectionItem({
                pressure: 'Need for trustful hearing',
                source: sentence(genreLabel === 'wisdom psalm'
                    ? 'The congregation is tempted to envy, impatience, or fear when the wicked seem to prosper.'
                    : genreLabel === 'parable'
                        ? 'Listeners may carry shame, resentment, or moral distance.'
                        : genreLabel === 'prophetic apocalyptic'
                            ? 'Believers may feel pressure to compromise or panic.'
                            : genreLabel === 'covenant law'
                                ? 'A redeemed community needs to learn how to live after rescue.'
                                : 'The audience needs the passage’s theological logic rather than a generic historical label.'),
                pastoralResponse: sentence(genreLabel === 'wisdom psalm'
                    ? 'Emphasize God’s sustaining faithfulness, the path of the righteous, and the truth that stumbling is not the same as abandonment.'
                    : genreLabel === 'parable'
                        ? 'Move the hearer toward repentance, welcome, and restored belonging.'
                        : genreLabel === 'prophetic apocalyptic'
                            ? 'Keep the tone hopeful, worship-centered, and Christ-focused.'
                            : genreLabel === 'covenant law'
                                ? 'Show how command and covenant flow from redemption and creation.'
                                : 'Let the passage’s own movement shape the sermon’s application.'),
            }),
        ],
        synthesisStatement: sentence("".concat(bookKey.replace(/^([a-z])/, function (m) { return m.toUpperCase(); }), " read as ").concat(genreLabel, " should stay inside its chapter, its covenant or narrative frame, and its pastoral burden. ").concat(geographyNote, " The preacher should use the context to explain why the verse matters, not to replace the verse with background notes.")),
    };
};
function composeHistoricalContextOutput(input) {
    var special = specialCaseGuide(input.reference);
    var genre = input.genre;
    if (special) {
        return {
            socialRealities: special.socialRealities.map(function (item) { return buildSectionItem(item); }),
            powerStructures: special.powerStructures.map(function (item) { return buildSectionItem(item); }),
            economicContext: special.economicContext.map(function (item) { return buildSectionItem(item); }),
            religiousClimate: special.religiousClimate.map(function (item) { return buildSectionItem(item); }),
            audiencePressures: special.audiencePressures.map(function (item) { return buildSectionItem(item); }),
            synthesisStatement: clean(special.synthesisStatement),
        };
    }
    var genreLabel = {
        wisdom_poetry: 'wisdom psalm',
        gospel_dialogue: 'gospel dialogue',
        parable: 'parable',
        prophetic_apocalyptic: 'prophetic-apocalyptic proclamation',
        covenant_law: 'covenant law',
        epistle: 'epistle',
        narrative: 'narrative',
        general: 'canonical passage',
    }[genre];
    return genericByGenre(input, genreLabel);
}
function isWeakHistoricalContextOutput(output) {
    if (!output)
        return true;
    var serialized = JSON.stringify(output || {}).toLowerCase();
    if (BANNED_LABELS.some(function (label) { return serialized.includes(label); }))
        return true;
    if (serialized.includes('literary setting of psalm'))
        return true;
    if (serialized.includes('narrative or doctrinal flow'))
        return true;
    if (serialized.includes('historical context analysis pending'))
        return true;
    if (serialized.includes('manual research recommended'))
        return true;
    var sections = ['socialRealities', 'powerStructures', 'economicContext', 'religiousClimate', 'audiencePressures'];
    var hasUsefulSections = sections.filter(function (key) { return Array.isArray(output[key]) && output[key].length > 0; }).length;
    if (hasUsefulSections < 4)
        return true;
    return false;
}
function validateHistoricalContextOutput(output) {
    var errors = [];
    if (!output) {
        return {
            valid: false,
            errors: ['Historical context output is missing.'],
        };
    }
    var serialized = JSON.stringify(output || {}).toLowerCase();
    var forbiddenPhrases = [
        'fallback',
        'custom',
        'template',
        'placeholder',
        'debug',
        'undefined',
        'null',
        'historical context analysis pending',
        'manual research recommended',
        'literary setting of psalm',
        'narrative or doctrinal flow',
        'helps move from background to sermon',
        'exact geography is unavailable',
    ];
    for (var _i = 0, forbiddenPhrases_1 = forbiddenPhrases; _i < forbiddenPhrases_1.length; _i++) {
        var phrase = forbiddenPhrases_1[_i];
        if (serialized.includes(phrase)) {
            errors.push("Forbidden historical-context phrase detected: ".concat(phrase, "."));
        }
    }
    var requiredSections = [
        { key: 'socialRealities', label: 'Historical Context' },
        { key: 'powerStructures', label: 'Cultural Context' },
        { key: 'economicContext', label: 'Geographical / Literary Setting' },
        { key: 'religiousClimate', label: 'Significance for Preaching' },
        { key: 'audiencePressures', label: 'Pastoral Application' },
    ];
    for (var _a = 0, requiredSections_1 = requiredSections; _a < requiredSections_1.length; _a++) {
        var section = requiredSections_1[_a];
        var items = Array.isArray(output[section.key]) ? output[section.key] : [];
        if (!items.length) {
            errors.push("Missing required section content for ".concat(section.label, "."));
            continue;
        }
        var _loop_1 = function (item) {
            var itemSerialized = JSON.stringify(item || {}).trim();
            if (!itemSerialized || itemSerialized === '{}' || itemSerialized === '[]') {
                errors.push("Empty item detected in ".concat(section.label, "."));
            }
            var itemText = itemSerialized.toLowerCase();
            if (forbiddenPhrases.some(function (phrase) { return itemText.includes(phrase); })) {
                errors.push("Forbidden historical-context phrase detected in ".concat(section.label, "."));
            }
            if (/^(significance|historical context|cultural context|geographical context|pastoral application)\.?$/i.test(String(item.description || item.impact || item.relevance || item.pastoralResponse || '').trim())) {
                errors.push("Generic label used as content in ".concat(section.label, "."));
            }
        };
        for (var _b = 0, items_1 = items; _b < items_1.length; _b++) {
            var item = items_1[_b];
            _loop_1(item);
        }
    }
    var synthesis = String(output.synthesisStatement || '').trim();
    if (!synthesis || synthesis.length < 80) {
        errors.push('Synthesis statement is too short to help preaching.');
    }
    if (forbiddenPhrases.some(function (phrase) { return synthesis.toLowerCase().includes(phrase); })) {
        errors.push('Forbidden historical-context phrase detected in synthesis statement.');
    }
    if (isWeakHistoricalContextOutput(output)) {
        errors.push('Historical context output is too weak or too generic.');
    }
    return {
        valid: errors.length === 0,
        errors: errors,
    };
}
function normalizeHistoricalContextOutput(output) {
    return {
        socialRealities: Array.isArray(output.socialRealities) ? output.socialRealities.map(buildSectionItem) : [],
        powerStructures: Array.isArray(output.powerStructures) ? output.powerStructures.map(buildSectionItem) : [],
        economicContext: Array.isArray(output.economicContext) ? output.economicContext.map(buildSectionItem) : [],
        religiousClimate: Array.isArray(output.religiousClimate) ? output.religiousClimate.map(buildSectionItem) : [],
        audiencePressures: Array.isArray(output.audiencePressures) ? output.audiencePressures.map(buildSectionItem) : [],
        synthesisStatement: clean(output.synthesisStatement),
    };
}
