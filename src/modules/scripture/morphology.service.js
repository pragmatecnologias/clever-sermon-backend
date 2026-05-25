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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MorphologyService = void 0;
var common_1 = require("@nestjs/common");
var MorphologyService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MorphologyService = _classThis = /** @class */ (function () {
        function MorphologyService_1() {
            this.morphologyIndex = null;
        }
        MorphologyService_1.prototype.getMorphology = function (word, language) {
            return __awaiter(this, void 0, void 0, function () {
                var index, key;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!word)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.loadMorphologyIndex(language)];
                        case 1:
                            index = _a.sent();
                            key = word.toLowerCase();
                            return [2 /*return*/, index[key] || null];
                    }
                });
            });
        };
        MorphologyService_1.prototype.getParsingExplanation = function (parsing) {
            return __awaiter(this, void 0, void 0, function () {
                var parts;
                return __generator(this, function (_a) {
                    parts = [];
                    if (parsing.partOfSpeech) {
                        parts.push(this.explainPartOfSpeech(parsing.partOfSpeech));
                    }
                    if (parsing.tense) {
                        parts.push(this.explainTense(parsing.tense));
                    }
                    if (parsing.voice) {
                        parts.push(this.explainVoice(parsing.voice));
                    }
                    if (parsing.mood) {
                        parts.push(this.explainMood(parsing.mood));
                    }
                    if (parsing.person && parsing.number) {
                        parts.push("".concat(parsing.person, " person ").concat(parsing.number));
                    }
                    if (parsing.case) {
                        parts.push(this.explainCase(parsing.case));
                    }
                    if (parsing.gender) {
                        parts.push("".concat(parsing.gender, " gender"));
                    }
                    return [2 /*return*/, parts.join(', ')];
                });
            });
        };
        MorphologyService_1.prototype.explainPartOfSpeech = function (pos) {
            var explanations = {
                'verb': 'action or state word',
                'noun': 'person, place, or thing',
                'adjective': 'describing word',
                'pronoun': 'substitute for a noun',
                'preposition': 'relationship word',
                'conjunction': 'connecting word',
                'particle': 'grammatical marker',
                'adverb': 'modifies verb or adjective'
            };
            return explanations[pos.toLowerCase()] || pos;
        };
        MorphologyService_1.prototype.explainTense = function (tense) {
            var explanations = {
                'present': 'ongoing or continuous action',
                'aorist': 'simple past action (point in time)',
                'imperfect': 'ongoing past action',
                'perfect': 'completed action with ongoing results',
                'pluperfect': 'action completed before another past action',
                'future': 'action that will happen'
            };
            return explanations[tense.toLowerCase()] || tense;
        };
        MorphologyService_1.prototype.explainVoice = function (voice) {
            var explanations = {
                'active': 'subject performs the action',
                'passive': 'subject receives the action',
                'middle': 'subject acts for own benefit or interest'
            };
            return explanations[voice.toLowerCase()] || voice;
        };
        MorphologyService_1.prototype.explainMood = function (mood) {
            var explanations = {
                'indicative': 'statement of fact',
                'subjunctive': 'possibility or potential',
                'imperative': 'command',
                'optative': 'wish or prayer',
                'infinitive': 'verbal noun (to do)',
                'participle': 'verbal adjective (doing)'
            };
            return explanations[mood.toLowerCase()] || mood;
        };
        MorphologyService_1.prototype.explainCase = function (caseType) {
            var explanations = {
                'nominative': 'subject of sentence',
                'genitive': 'possession or source',
                'dative': 'indirect object',
                'accusative': 'direct object',
                'vocative': 'direct address'
            };
            return explanations[caseType.toLowerCase()] || caseType;
        };
        MorphologyService_1.prototype.loadMorphologyIndex = function (language) {
            return __awaiter(this, void 0, void 0, function () {
                var mockData;
                return __generator(this, function (_a) {
                    if (this.morphologyIndex) {
                        return [2 /*return*/, this.morphologyIndex];
                    }
                    mockData = {
                        'ἀγαπάω': {
                            lemma: 'ἀγαπάω',
                            strongs: 'G25',
                            parsing: {
                                partOfSpeech: 'verb',
                                tense: 'present',
                                voice: 'active',
                                mood: 'indicative',
                                person: '1st',
                                number: 'singular'
                            },
                            plainEnglish: 'I love (ongoing action, active voice, statement of fact)',
                            occurrences: ['John 3:16', 'John 14:21', '1 John 4:8'],
                            sameFormOccurrences: ['John 3:16', 'John 14:21']
                        },
                        'πιστεύω': {
                            lemma: 'πιστεύω',
                            strongs: 'G4100',
                            parsing: {
                                partOfSpeech: 'verb',
                                tense: 'present',
                                voice: 'active',
                                mood: 'indicative',
                                person: '1st',
                                number: 'singular'
                            },
                            plainEnglish: 'I believe (ongoing action, active voice, statement of fact)',
                            occurrences: ['John 3:16', 'Romans 10:9', 'Hebrews 11:6'],
                            sameFormOccurrences: ['John 3:16', 'Romans 10:9']
                        },
                        'λόγος': {
                            lemma: 'λόγος',
                            strongs: 'G3056',
                            parsing: {
                                partOfSpeech: 'noun',
                                case: 'nominative',
                                number: 'singular',
                                gender: 'masculine'
                            },
                            plainEnglish: 'word, message, or reason (subject of sentence, masculine)',
                            occurrences: ['John 1:1', 'John 1:14', 'Hebrews 4:12'],
                            sameFormOccurrences: ['John 1:1', 'John 1:14']
                        }
                    };
                    this.morphologyIndex = mockData;
                    return [2 /*return*/, this.morphologyIndex];
                });
            });
        };
        MorphologyService_1.prototype.findSameTenseUsage = function (lemma, tense, voice, mood) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // This would query a morphology database for same tense/voice/mood combinations
                    // For MVP, return mock data
                    return [2 /*return*/, [
                            'John 3:16 - same present active indicative form',
                            'Romans 5:8 - same present active indicative form',
                            '1 John 4:8 - same present active indicative form'
                        ]];
                });
            });
        };
        return MorphologyService_1;
    }());
    __setFunctionName(_classThis, "MorphologyService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MorphologyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MorphologyService = _classThis;
}();
exports.MorphologyService = MorphologyService;
