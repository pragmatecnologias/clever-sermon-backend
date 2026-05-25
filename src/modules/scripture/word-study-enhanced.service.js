"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordStudyEnhancedService = void 0;
var common_1 = require("@nestjs/common");
var WordStudyEnhancedService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WordStudyEnhancedService = _classThis = /** @class */ (function () {
        function WordStudyEnhancedService_1() {
            this.wordIndex = new Map();
            this.initializeWordData();
        }
        WordStudyEnhancedService_1.prototype.getWordStudy = function (strongs) {
            return this.wordIndex.get(strongs) || null;
        };
        WordStudyEnhancedService_1.prototype.searchByLemma = function (lemma, language) {
            var results = [];
            for (var _i = 0, _a = this.wordIndex.values(); _i < _a.length; _i++) {
                var study = _a[_i];
                if (study.language === language && study.lemma.toLowerCase() === lemma.toLowerCase()) {
                    results.push(study);
                }
            }
            return results;
        };
        WordStudyEnhancedService_1.prototype.initializeWordData = function () {
            // Greek: ἀγαπάω (agapaō) - to love
            this.wordIndex.set('G25', {
                word: 'ἀγαπάω',
                language: 'greek',
                strongs: 'G25',
                lemma: 'ἀγαπάω',
                transliteration: 'agapaō',
                gloss: 'to love',
                morphology: {
                    partOfSpeech: 'Verb',
                    parsing: {
                        tense: 'Present/Aorist',
                        voice: 'Active',
                        mood: 'Indicative/Infinitive/Participle'
                    }
                },
                occurrenceDistribution: {
                    totalOccurrences: 143,
                    byBook: [
                        { book: 'John', count: 37 },
                        { book: '1 John', count: 28 },
                        { book: 'Matthew', count: 9 },
                        { book: 'Romans', count: 8 },
                        { book: 'Ephesians', count: 7 },
                        { book: 'Revelation', count: 6 }
                    ],
                    byTestament: { ot: 0, nt: 143 }
                },
                contextualExamples: [
                    {
                        reference: 'John 3:16',
                        text: 'For God so loved (ἠγάπησεν) the world',
                        usage: 'God\'s sacrificial love for humanity'
                    },
                    {
                        reference: 'John 21:15',
                        text: 'Simon, son of John, do you love (ἀγαπᾷς) me?',
                        usage: 'Jesus\' question to Peter about commitment'
                    },
                    {
                        reference: '1 John 4:8',
                        text: 'God is love (ἀγάπη)',
                        usage: 'God\'s essential nature'
                    }
                ],
                semanticRange: [
                    'Unconditional love',
                    'Sacrificial love',
                    'Covenant love',
                    'Divine love',
                    'Agape love (distinct from eros, philia, storge)'
                ],
                dataSource: 'lexical_database'
            });
            // Greek: πιστεύω (pisteuō) - to believe, trust
            this.wordIndex.set('G4100', {
                word: 'πιστεύω',
                language: 'greek',
                strongs: 'G4100',
                lemma: 'πιστεύω',
                transliteration: 'pisteuō',
                gloss: 'to believe, trust, have faith',
                morphology: {
                    partOfSpeech: 'Verb',
                    parsing: {
                        tense: 'Present/Aorist',
                        voice: 'Active',
                        mood: 'Indicative/Subjunctive/Participle'
                    }
                },
                occurrenceDistribution: {
                    totalOccurrences: 248,
                    byBook: [
                        { book: 'John', count: 98 },
                        { book: 'Acts', count: 37 },
                        { book: 'Romans', count: 21 },
                        { book: 'Galatians', count: 9 },
                        { book: '1 Corinthians', count: 9 }
                    ],
                    byTestament: { ot: 0, nt: 248 }
                },
                contextualExamples: [
                    {
                        reference: 'John 3:16',
                        text: 'whoever believes (πιστεύων) in him',
                        usage: 'Faith in Christ for salvation'
                    },
                    {
                        reference: 'Romans 10:9',
                        text: 'if you believe (πιστεύσῃς) in your heart',
                        usage: 'Heart belief leading to salvation'
                    },
                    {
                        reference: 'James 2:19',
                        text: 'You believe (πιστεύεις) that God is one',
                        usage: 'Intellectual assent vs. saving faith'
                    }
                ],
                semanticRange: [
                    'To believe, accept as true',
                    'To trust, have confidence in',
                    'To entrust oneself to',
                    'To have faith',
                    'To be convinced'
                ],
                dataSource: 'lexical_database'
            });
            // Greek: λόγος (logos) - word, message
            this.wordIndex.set('G3056', {
                word: 'λόγος',
                language: 'greek',
                strongs: 'G3056',
                lemma: 'λόγος',
                transliteration: 'logos',
                gloss: 'word, message, reason, account',
                morphology: {
                    partOfSpeech: 'Noun',
                    parsing: {
                        case: 'Nominative/Accusative/Genitive',
                        number: 'Singular',
                        gender: 'Masculine'
                    }
                },
                occurrenceDistribution: {
                    totalOccurrences: 330,
                    byBook: [
                        { book: 'John', count: 40 },
                        { book: 'Acts', count: 65 },
                        { book: 'Luke', count: 33 },
                        { book: 'Matthew', count: 33 },
                        { book: '1 Corinthians', count: 23 }
                    ],
                    byTestament: { ot: 0, nt: 330 }
                },
                contextualExamples: [
                    {
                        reference: 'John 1:1',
                        text: 'In the beginning was the Word (Λόγος)',
                        usage: 'Christ as the eternal Word'
                    },
                    {
                        reference: 'Matthew 13:19',
                        text: 'hears the word (λόγον) of the kingdom',
                        usage: 'The gospel message'
                    },
                    {
                        reference: 'Hebrews 4:12',
                        text: 'the word (λόγος) of God is living and active',
                        usage: 'Scripture as God\'s powerful word'
                    }
                ],
                semanticRange: [
                    'Spoken word, utterance',
                    'Message, proclamation',
                    'Reason, rational principle',
                    'Account, reckoning',
                    'The Word (Christ)',
                    'Scripture, divine revelation'
                ],
                dataSource: 'lexical_database'
            });
            // Hebrew: זָכַר (zakar) - to remember
            this.wordIndex.set('H2142', {
                word: 'זָכַר',
                language: 'hebrew',
                strongs: 'H2142',
                lemma: 'זָכַר',
                transliteration: 'zakar',
                gloss: 'to remember, recall, call to mind',
                morphology: {
                    partOfSpeech: 'Verb',
                    parsing: {
                        tense: 'Qal/Niphal/Hiphil',
                        mood: 'Perfect/Imperfect/Imperative/Infinitive'
                    }
                },
                occurrenceDistribution: {
                    totalOccurrences: 235,
                    byBook: [
                        { book: 'Psalms', count: 38 },
                        { book: 'Deuteronomy', count: 17 },
                        { book: 'Exodus', count: 15 },
                        { book: 'Leviticus', count: 11 },
                        { book: 'Isaiah', count: 11 }
                    ],
                    byTestament: { ot: 235, nt: 0 }
                },
                contextualExamples: [
                    {
                        reference: 'Exodus 20:8',
                        text: 'Remember (זָכוֹר) the Sabbath day',
                        usage: 'Command to keep Sabbath in mind'
                    },
                    {
                        reference: 'Deuteronomy 5:15',
                        text: 'Remember (וְזָכַרְתָּ) that you were a slave in Egypt',
                        usage: 'Recall past deliverance'
                    },
                    {
                        reference: 'Psalm 103:14',
                        text: 'He remembers (זָכוּר) that we are dust',
                        usage: 'God\'s mindfulness of human frailty'
                    }
                ],
                semanticRange: [
                    'To remember, recall',
                    'To mention, recount',
                    'To be mindful of',
                    'To commemorate',
                    'To act on behalf of (when God remembers)'
                ],
                dataSource: 'lexical_database'
            });
            // Hebrew: שַׁבָּת (shabbat) - Sabbath, rest
            this.wordIndex.set('H7676', {
                word: 'שַׁבָּת',
                language: 'hebrew',
                strongs: 'H7676',
                lemma: 'שַׁבָּת',
                transliteration: 'shabbat',
                gloss: 'Sabbath, day of rest',
                morphology: {
                    partOfSpeech: 'Noun',
                    parsing: {
                        case: 'Absolute/Construct',
                        number: 'Singular/Plural',
                        gender: 'Feminine',
                        state: 'Absolute'
                    }
                },
                occurrenceDistribution: {
                    totalOccurrences: 111,
                    byBook: [
                        { book: 'Leviticus', count: 19 },
                        { book: 'Exodus', count: 12 },
                        { book: 'Numbers', count: 7 },
                        { book: 'Ezekiel', count: 18 },
                        { book: 'Isaiah', count: 10 }
                    ],
                    byTestament: { ot: 111, nt: 0 }
                },
                contextualExamples: [
                    {
                        reference: 'Exodus 20:8',
                        text: 'Remember the Sabbath (שַׁבָּת) day',
                        usage: 'Fourth commandment'
                    },
                    {
                        reference: 'Leviticus 23:3',
                        text: 'the seventh day is a Sabbath (שַׁבַּת) of solemn rest',
                        usage: 'Weekly Sabbath observance'
                    },
                    {
                        reference: 'Isaiah 58:13',
                        text: 'call the Sabbath (לַשַּׁבָּת) a delight',
                        usage: 'Proper Sabbath attitude'
                    }
                ],
                semanticRange: [
                    'Seventh-day Sabbath',
                    'Day of rest',
                    'Cessation from work',
                    'Sacred assembly day',
                    'Sign of covenant'
                ],
                dataSource: 'lexical_database'
            });
            // Hebrew: צָדַק (tsadaq) - to be just, righteous
            this.wordIndex.set('H6663', {
                word: 'צָדַק',
                language: 'hebrew',
                strongs: 'H6663',
                lemma: 'צָדַק',
                transliteration: 'tsadaq',
                gloss: 'to be just, righteous; to be vindicated, cleansed',
                morphology: {
                    partOfSpeech: 'Verb',
                    parsing: {
                        tense: 'Qal/Niphal/Piel/Hiphil',
                        mood: 'Perfect/Imperfect'
                    }
                },
                occurrenceDistribution: {
                    totalOccurrences: 41,
                    byBook: [
                        { book: 'Job', count: 8 },
                        { book: 'Psalms', count: 7 },
                        { book: 'Isaiah', count: 6 },
                        { book: 'Jeremiah', count: 4 },
                        { book: 'Daniel', count: 2 }
                    ],
                    byTestament: { ot: 41, nt: 0 }
                },
                contextualExamples: [
                    {
                        reference: 'Daniel 8:14',
                        text: 'then shall the sanctuary be cleansed (נִצְדַּק)',
                        usage: 'Sanctuary vindication/cleansing (Niphal)'
                    },
                    {
                        reference: 'Job 33:32',
                        text: 'I desire to justify (צַדֶּקְךָ) you',
                        usage: 'To declare righteous (Piel)'
                    },
                    {
                        reference: 'Psalm 51:4',
                        text: 'that you may be justified (תִּצְדַּק) when you speak',
                        usage: 'God\'s vindication (Qal)'
                    }
                ],
                semanticRange: [
                    'To be just, righteous',
                    'To be vindicated, proven right',
                    'To be cleansed, restored',
                    'To justify, declare righteous',
                    'To be in the right'
                ],
                dataSource: 'lexical_database'
            });
        };
        WordStudyEnhancedService_1.prototype.getOccurrencesByBook = function (strongs) {
            var study = this.wordIndex.get(strongs);
            return (study === null || study === void 0 ? void 0 : study.occurrenceDistribution.byBook) || [];
        };
        WordStudyEnhancedService_1.prototype.getTotalOccurrences = function (strongs) {
            var study = this.wordIndex.get(strongs);
            return (study === null || study === void 0 ? void 0 : study.occurrenceDistribution.totalOccurrences) || 0;
        };
        return WordStudyEnhancedService_1;
    }());
    __setFunctionName(_classThis, "WordStudyEnhancedService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WordStudyEnhancedService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WordStudyEnhancedService = _classThis;
}();
exports.WordStudyEnhancedService = WordStudyEnhancedService;
