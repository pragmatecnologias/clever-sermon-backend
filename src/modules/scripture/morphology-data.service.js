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
exports.MorphologyDataService = void 0;
var common_1 = require("@nestjs/common");
var MorphologyDataService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MorphologyDataService = _classThis = /** @class */ (function () {
        function MorphologyDataService_1() {
            this.morphologyIndex = new Map();
            this.initializeMorphologyData();
        }
        MorphologyDataService_1.prototype.getMorphology = function (word, language) {
            var key = "".concat(language, ":").concat(word.toLowerCase());
            return this.morphologyIndex.get(key) || [];
        };
        MorphologyDataService_1.prototype.getMorphologyByStrongs = function (strongs) {
            var results = [];
            for (var _i = 0, _a = this.morphologyIndex.values(); _i < _a.length; _i++) {
                var entries = _a[_i];
                for (var _b = 0, entries_1 = entries; _b < entries_1.length; _b++) {
                    var entry = entries_1[_b];
                    if (entry.strongs === strongs) {
                        results.push(entry);
                    }
                }
            }
            return results;
        };
        MorphologyDataService_1.prototype.initializeMorphologyData = function () {
            // Sample Greek morphology data
            // In production, load from comprehensive lexicon database
            this.addMorphology('greek', 'ἀγαπάω', {
                word: 'ἀγαπάω',
                lemma: 'ἀγαπάω',
                strongs: 'G25',
                parsing: {
                    partOfSpeech: 'Verb',
                    tense: 'Aorist',
                    voice: 'Active',
                    mood: 'Indicative',
                    person: '3rd',
                    number: 'Singular'
                },
                transliteration: 'agapaō',
                gloss: 'to love',
                verseReference: 'John 3:16'
            });
            this.addMorphology('greek', 'ἠγάπησεν', {
                word: 'ἠγάπησεν',
                lemma: 'ἀγαπάω',
                strongs: 'G25',
                parsing: {
                    partOfSpeech: 'Verb',
                    tense: 'Aorist',
                    voice: 'Active',
                    mood: 'Indicative',
                    person: '3rd',
                    number: 'Singular'
                },
                transliteration: 'ēgapēsen',
                gloss: 'loved',
                verseReference: 'John 3:16'
            });
            this.addMorphology('greek', 'πιστεύω', {
                word: 'πιστεύω',
                lemma: 'πιστεύω',
                strongs: 'G4100',
                parsing: {
                    partOfSpeech: 'Verb',
                    tense: 'Present',
                    voice: 'Active',
                    mood: 'Participle',
                    case: 'Nominative',
                    number: 'Singular',
                    gender: 'Masculine'
                },
                transliteration: 'pisteuō',
                gloss: 'to believe, trust',
                verseReference: 'John 3:16'
            });
            this.addMorphology('greek', 'λόγος', {
                word: 'λόγος',
                lemma: 'λόγος',
                strongs: 'G3056',
                parsing: {
                    partOfSpeech: 'Noun',
                    case: 'Nominative',
                    number: 'Singular',
                    gender: 'Masculine'
                },
                transliteration: 'logos',
                gloss: 'word, message, reason',
                verseReference: 'John 1:1'
            });
            // Sample Hebrew morphology
            this.addMorphology('hebrew', 'זָכַר', {
                word: 'זָכַר',
                lemma: 'זָכַר',
                strongs: 'H2142',
                parsing: {
                    partOfSpeech: 'Verb',
                    tense: 'Qal',
                    mood: 'Infinitive Absolute'
                },
                transliteration: 'zakar',
                gloss: 'to remember',
                verseReference: 'Exodus 20:8'
            });
            this.addMorphology('hebrew', 'שַׁבָּת', {
                word: 'שַׁבָּת',
                lemma: 'שַׁבָּת',
                strongs: 'H7676',
                parsing: {
                    partOfSpeech: 'Noun',
                    case: 'Construct',
                    number: 'Singular',
                    gender: 'Feminine'
                },
                transliteration: 'shabbat',
                gloss: 'Sabbath, rest',
                verseReference: 'Exodus 20:8'
            });
            this.addMorphology('hebrew', 'צָדַק', {
                word: 'צָדַק',
                lemma: 'צָדַק',
                strongs: 'H6663',
                parsing: {
                    partOfSpeech: 'Verb',
                    tense: 'Niphal',
                    mood: 'Perfect'
                },
                transliteration: 'tsadaq',
                gloss: 'to be just, righteous; to be cleansed',
                verseReference: 'Daniel 8:14'
            });
        };
        MorphologyDataService_1.prototype.addMorphology = function (language, word, data) {
            var key = "".concat(language, ":").concat(word.toLowerCase());
            var existing = this.morphologyIndex.get(key) || [];
            existing.push(data);
            this.morphologyIndex.set(key, existing);
        };
        MorphologyDataService_1.prototype.getParsingDisplay = function (parsing) {
            var parts = [];
            if (parsing.partOfSpeech)
                parts.push(parsing.partOfSpeech);
            if (parsing.tense)
                parts.push(parsing.tense);
            if (parsing.voice)
                parts.push(parsing.voice);
            if (parsing.mood)
                parts.push(parsing.mood);
            if (parsing.person)
                parts.push(parsing.person);
            if (parsing.number)
                parts.push(parsing.number);
            if (parsing.gender)
                parts.push(parsing.gender);
            if (parsing.case)
                parts.push(parsing.case);
            return parts.join(', ');
        };
        return MorphologyDataService_1;
    }());
    __setFunctionName(_classThis, "MorphologyDataService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MorphologyDataService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MorphologyDataService = _classThis;
}();
exports.MorphologyDataService = MorphologyDataService;
