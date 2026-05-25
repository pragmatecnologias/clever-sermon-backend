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
exports.PerVerseContextService = void 0;
var common_1 = require("@nestjs/common");
var json_response_util_1 = require("./json-response.util");
var scripture_prompts_1 = require("./scripture-prompts");
var PerVerseContextService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PerVerseContextService = _classThis = /** @class */ (function () {
        function PerVerseContextService_1(llmService, scriptureService) {
            this.llmService = llmService;
            this.scriptureService = scriptureService;
            this.contextIndex = new Map();
            this.initializeContextData();
        }
        PerVerseContextService_1.prototype.getVerseContext = function (reference, language) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedLanguage, normalizedReference, curated, deterministic;
                return __generator(this, function (_a) {
                    normalizedLanguage = this.normalizeLanguage(language || 'en');
                    this.assertSupportedLanguage(normalizedLanguage);
                    normalizedReference = this.normalizeReference(reference);
                    this.assertValidReference(normalizedReference);
                    curated = this.contextIndex.get(normalizedReference);
                    if (curated) {
                        return [2 /*return*/, __assign(__assign({}, curated), { status: 'ready', source: 'curated', language: normalizedLanguage, reference: normalizedReference, warnings: curated.warnings || [], sections: curated.sections || this.buildSectionsFromLegacy(curated) })];
                    }
                    deterministic = this.buildDeterministicContext(normalizedReference, normalizedLanguage);
                    if (deterministic) {
                        return [2 /*return*/, deterministic];
                    }
                    return [2 /*return*/, this.generateValidatedContextWithLLM(normalizedReference, normalizedLanguage)];
                });
            });
        };
        PerVerseContextService_1.prototype.generateValidatedContextWithLLM = function (reference, language) {
            return __awaiter(this, void 0, void 0, function () {
                var analysisTranslation, passageText, hints, languageInstruction, prompt, initial, initialValidation, repaired, repairPrompt, repairedValidation, deterministic, deterministicValidation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
                            return [4 /*yield*/, this.loadPassageText(reference, analysisTranslation)];
                        case 1:
                            passageText = _a.sent();
                            hints = this.buildDeterministicHints(reference);
                            languageInstruction = language === 'es'
                                ? 'Responde únicamente en español. No uses inglés en ningún campo de texto de la respuesta.'
                                : 'Respond in English.';
                            prompt = scripture_prompts_1.ScripturePrompts.perVerseContext({
                                languageInstruction: languageInstruction,
                                reference: reference,
                                passageText: passageText || 'Text not available',
                                genreHint: hints.genreHint,
                                themeHint: hints.themeHint,
                                contextHint: hints.contextHint,
                                motifHint: hints.motifHint,
                                targetLanguage: language,
                            });
                            return [4 /*yield*/, this.requestContext(prompt, reference, language).catch(function (error) {
                                    console.error('Failed initial verse-context generation:', error);
                                    return null;
                                })];
                        case 2:
                            initial = _a.sent();
                            initialValidation = initial
                                ? this.validateHistoricalContextOutput(initial, reference)
                                : { valid: false, errors: ['Initial historical-context generation failed.'] };
                            if (initial && initialValidation.valid) {
                                return [2 /*return*/, this.normalizeReadyResponse(initial, reference, language)];
                            }
                            repaired = null;
                            if (!initial) return [3 /*break*/, 4];
                            repairPrompt = scripture_prompts_1.ScripturePrompts.perVerseContextRepair({
                                languageInstruction: languageInstruction,
                                reference: reference,
                                passageText: passageText || 'Text not available',
                                validationErrors: initialValidation.errors,
                                previousResponse: JSON.stringify(initial, null, 2),
                                genreHint: hints.genreHint,
                                themeHint: hints.themeHint,
                                contextHint: hints.contextHint,
                                motifHint: hints.motifHint,
                                targetLanguage: language,
                            });
                            return [4 /*yield*/, this.requestContext(repairPrompt, reference, language).catch(function (error) {
                                    console.error('Failed repaired verse-context generation:', error);
                                    return null;
                                })];
                        case 3:
                            repaired = _a.sent();
                            if (repaired) {
                                repairedValidation = this.validateHistoricalContextOutput(repaired, reference);
                                if (repairedValidation.valid) {
                                    return [2 /*return*/, this.normalizeReadyResponse(repaired, reference, language)];
                                }
                            }
                            _a.label = 4;
                        case 4:
                            deterministic = this.buildDeterministicContext(reference, language);
                            if (deterministic) {
                                deterministicValidation = this.validateHistoricalContextOutput(deterministic, reference);
                                if (deterministicValidation.valid) {
                                    return [2 /*return*/, this.normalizeReadyResponse(deterministic, reference, language)];
                                }
                            }
                            console.warn('Verse context validation failed after repair', {
                                reference: reference,
                                language: language,
                                initialErrors: initialValidation.errors,
                                repairedPresent: Boolean(repaired),
                            });
                            return [2 /*return*/, this.buildUnavailableResponse(reference, language, ['Historical context generation failed validation'])];
                    }
                });
            });
        };
        PerVerseContextService_1.prototype.requestContext = function (prompt, reference, language) {
            return __awaiter(this, void 0, void 0, function () {
                var response, parsed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.llmService.generateCompletion(prompt, 'system', {
                                temperature: 0.3,
                                maxTokens: 4000,
                                timeoutMs: 12000,
                            })];
                        case 1:
                            response = _a.sent();
                            parsed = (0, json_response_util_1.parseJsonObjectFromLlm)(response);
                            return [2 /*return*/, this.normalizeResponseShape(parsed, reference, language)];
                    }
                });
            });
        };
        PerVerseContextService_1.prototype.normalizeResponseShape = function (parsed, reference, language) {
            var _this = this;
            var rawSections = Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.sections)
                ? parsed.sections
                : this.buildSectionsFromLegacy(parsed);
            var sections = rawSections
                .map(function (item) { return ({
                title: _this.cleanText((item === null || item === void 0 ? void 0 : item.title) || (item === null || item === void 0 ? void 0 : item.aspect) || (item === null || item === void 0 ? void 0 : item.structure) || (item === null || item === void 0 ? void 0 : item.factor) || (item === null || item === void 0 ? void 0 : item.element) || (item === null || item === void 0 ? void 0 : item.pressure) || ''),
                content: _this.cleanText((item === null || item === void 0 ? void 0 : item.content) || (item === null || item === void 0 ? void 0 : item.note) || (item === null || item === void 0 ? void 0 : item.description) || (item === null || item === void 0 ? void 0 : item.dynamics) || (item === null || item === void 0 ? void 0 : item.relevance) || (item === null || item === void 0 ? void 0 : item.impact) || (item === null || item === void 0 ? void 0 : item.pastoralResponse) || (item === null || item === void 0 ? void 0 : item.significance) || ''),
            }); })
                .filter(function (item) { return item.title && item.content; });
            return {
                status: (parsed === null || parsed === void 0 ? void 0 : parsed.status) === 'unavailable' ? 'unavailable' : 'ready',
                reference: this.cleanText((parsed === null || parsed === void 0 ? void 0 : parsed.reference) || reference),
                language: this.cleanText((parsed === null || parsed === void 0 ? void 0 : parsed.language) || language || 'en').toLowerCase(),
                genre: (parsed === null || parsed === void 0 ? void 0 : parsed.genre) ? this.cleanText(parsed.genre) : undefined,
                sections: sections,
                warnings: Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.warnings) ? parsed.warnings.map(function (item) { return _this.cleanText(item); }).filter(Boolean) : [],
                message: typeof (parsed === null || parsed === void 0 ? void 0 : parsed.message) === 'string' ? this.cleanText(parsed.message) : undefined,
                source: (parsed === null || parsed === void 0 ? void 0 : parsed.source) === 'curated' ? 'curated' : 'llm-generated',
            };
        };
        PerVerseContextService_1.prototype.buildSectionsFromLegacy = function (parsed) {
            if (!parsed)
                return [];
            var sections = [];
            var historicalContent = this.legacyNotesToText(parsed.historical, ['note', 'period', 'source']);
            var culturalContent = this.legacyNotesToText(parsed.cultural, ['note', 'category', 'source']);
            var geographicalContent = this.legacyNotesToText(parsed.geographical, ['place', 'description', 'significance', 'modernLocation']);
            var timelineContent = this.legacyNotesToText(parsed.timeline, ['event', 'date', 'significance']);
            if (historicalContent)
                sections.push({ title: 'Historical Context', content: historicalContent });
            if (culturalContent)
                sections.push({ title: 'Cultural Context', content: culturalContent });
            if (geographicalContent)
                sections.push({ title: 'Geographical / Literary Setting', content: geographicalContent });
            if (timelineContent) {
                sections.push({ title: 'Significance for Preaching', content: timelineContent });
            }
            var synthesis = this.cleanText(parsed.synthesisStatement || parsed.summary || parsed.overview || '');
            if (synthesis) {
                sections.push({ title: 'Pastoral Application', content: synthesis });
            }
            return sections;
        };
        PerVerseContextService_1.prototype.legacyNotesToText = function (items, keys) {
            var _this = this;
            if (!Array.isArray(items) || items.length === 0)
                return '';
            var lines = items
                .map(function (item) {
                var parts = keys
                    .map(function (key) { return _this.cleanText(item === null || item === void 0 ? void 0 : item[key]); })
                    .filter(Boolean);
                return parts.join(' — ');
            })
                .filter(Boolean);
            return lines.join(' ');
        };
        PerVerseContextService_1.prototype.validateHistoricalContextOutput = function (output, reference) {
            var _this = this;
            var errors = [];
            var serialized = JSON.stringify(output || {}).toLowerCase();
            var forbidden = [
                'fallback',
                'social',
                'custom',
                'template',
                'placeholder',
                'debug',
                'todo',
                'undefined',
                'null',
                'historical context analysis pending',
                'manual research recommended',
                'literary setting of psalm',
                'narrative or doctrinal flow',
                'helps move from background to sermon',
                'exact geography is unavailable',
                'the passage belongs to the literary setting of',
                'immediate narrative or doctrinal flow',
                'this context helps the preacher distinguish',
            ];
            for (var _i = 0, forbidden_1 = forbidden; _i < forbidden_1.length; _i++) {
                var phrase = forbidden_1[_i];
                if (serialized.includes(phrase)) {
                    errors.push("Forbidden historical-context phrase detected: ".concat(phrase, "."));
                }
            }
            if (output.status !== 'ready') {
                errors.push('Historical context status is not ready.');
            }
            var expectedTitles = [
                'Historical Context',
                'Cultural Context',
                'Geographical / Literary Setting',
                'Significance for Preaching',
                'Pastoral Application',
            ];
            if (!Array.isArray(output.sections) || output.sections.length < 5) {
                errors.push('Historical context sections are missing.');
            }
            else {
                var titles = output.sections.map(function (section) { return _this.cleanText(section === null || section === void 0 ? void 0 : section.title); });
                for (var _a = 0, expectedTitles_1 = expectedTitles; _a < expectedTitles_1.length; _a++) {
                    var title = expectedTitles_1[_a];
                    if (!titles.includes(title)) {
                        errors.push("Missing required section title: ".concat(title, "."));
                    }
                }
                for (var _b = 0, _c = output.sections; _b < _c.length; _b++) {
                    var section = _c[_b];
                    var content = this.cleanText(section === null || section === void 0 ? void 0 : section.content);
                    if (!content) {
                        errors.push("Empty content detected for section: ".concat(this.cleanText(section === null || section === void 0 ? void 0 : section.title) || 'unknown', "."));
                    }
                }
            }
            var sectionTexts = (output.sections || []).map(function (section) { return "".concat(section.title, " ").concat(section.content).toLowerCase(); });
            if (sectionTexts.some(function (text) { return /partial verse|though he fall, he shall not be utterly cast down: for the lord$/i.test(text); })) {
                errors.push('Partial verse text detected.');
            }
            if (/^psalm\s+37|^ps\s+37/i.test(reference)) {
                if (!/wisdom|poetry|worship/i.test(serialized)) {
                    errors.push('Psalm context is not clearly framed as wisdom poetry.');
                }
                if (!/envy|wicked|trust|steps|path|fall|uphold/i.test(serialized)) {
                    errors.push('Psalm 37 context is missing its pastoral tension and path imagery.');
                }
            }
            return {
                valid: errors.length === 0,
                errors: errors,
            };
        };
        PerVerseContextService_1.prototype.normalizeReadyResponse = function (output, reference, language) {
            var genre = this.normalizeGenre(reference, output.genre);
            return __assign(__assign({}, output), { status: 'ready', reference: reference, language: language, genre: genre, warnings: [], message: undefined, source: output.source || 'llm-generated' });
        };
        PerVerseContextService_1.prototype.buildUnavailableResponse = function (reference, language, warnings) {
            return {
                status: 'unavailable',
                reference: reference,
                language: language,
                sections: [],
                warnings: warnings.length > 0 ? warnings : ['Historical context generation failed validation'],
                message: 'Historical context could not be generated. Please retry.',
                source: 'llm-generated',
            };
        };
        PerVerseContextService_1.prototype.buildDeterministicContext = function (reference, language) {
            var _this = this;
            var normalized = reference.toLowerCase();
            var builders = [
                function () { return (normalized.startsWith('psalm 37') || normalized.startsWith('ps 37') ? _this.buildPsalm37Context(reference, language) : null); },
                function () { return (normalized.startsWith('john 3') ? _this.buildJohn3Context(reference, language) : null); },
                function () { return (normalized.startsWith('luke 15') ? _this.buildLuke15Context(reference, language) : null); },
                function () { return (normalized.startsWith('revelation 14') || normalized.startsWith('rev 14') ? _this.buildRevelation14Context(reference, language) : null); },
                function () { return (normalized.startsWith('exodus 20') ? _this.buildExodus20Context(reference, language) : null); },
            ];
            for (var _i = 0, builders_1 = builders; _i < builders_1.length; _i++) {
                var builder = builders_1[_i];
                var result = builder();
                if (result) {
                    return result;
                }
            }
            return null;
        };
        PerVerseContextService_1.prototype.buildPsalm37Context = function (reference, language) {
            if (language === 'es') {
                return {
                    status: 'ready',
                    reference: reference,
                    language: language,
                    genre: 'Salmo sapiencial',
                    sections: [
                        {
                            title: 'Historical Context',
                            content: 'El Salmo 37 es un salmo de sabiduría que contrasta la prosperidad momentánea de los impíos con la seguridad duradera de quienes confían en el Señor. Repite el llamado a no inquietarse por los malvados, a no envidiar su aparente éxito y a esperar con paciencia la justicia de Dios.',
                        },
                        {
                            title: 'Cultural Context',
                            content: 'El lenguaje de pasos, camino y caída usa una imagen bíblica común: la vida como una senda que revela dirección, carácter y fidelidad. Decir que el Señor afirma los pasos de una persona significa que Dios guía y sostiene activamente la vida del justo, aun cuando atraviesa debilidad, oposición o tropiezo.',
                        },
                        {
                            title: 'Geographical / Literary Setting',
                            content: 'El Salmo 37 no depende de una geografía específica. Su escenario principal es literario y de pacto: tierra, herencia, permanencia y estabilidad describen la vida del pueblo de Dios bajo la fidelidad del Señor. Eso ayuda al predicador a no aislar los versículos 23–24 del argumento completo del salmo.',
                        },
                        {
                            title: 'Significance for Preaching',
                            content: 'Estos versículos no prometen que el justo jamás caerá. Enseñan que el Señor establece el camino de quienes se deleitan en Él y que, cuando tropiezan, no quedan abandonados ni destruidos. El énfasis del sermón debe estar en la fidelidad sostenedora de Dios, no en una perfección humana sin fallas.',
                        },
                        {
                            title: 'Pastoral Application',
                            content: 'Este pasaje sirve para personas cansadas, avergonzadas o confundidas por sus luchas. El predicador puede mostrar que la mano de Dios no desaparece cuando el creyente tropieza. El Señor sigue sosteniendo, corrigiendo y afirmando a su pueblo mientras aprende a confiar y esperar en Él.',
                        },
                    ],
                    warnings: [],
                    source: 'curated',
                };
            }
            return {
                status: 'ready',
                reference: reference,
                language: language,
                genre: 'Wisdom psalm',
                sections: [
                    {
                        title: 'Historical Context',
                        content: 'Psalm 37 is a wisdom psalm that addresses the temptation to envy the wicked when injustice appears to prosper. Across the whole chapter, the righteous are told not to fret, not to envy evildoers, and not to lose confidence in the Lord’s justice.',
                    },
                    {
                        title: 'Cultural Context',
                        content: 'The language of steps, way, and falling reflects a common biblical picture of life as a path shaped by trust, obedience, and character. To say that the Lord establishes a person’s steps means God is actively guiding and sustaining the faithful life rather than leaving the righteous to walk alone.',
                    },
                    {
                        title: 'Geographical / Literary Setting',
                        content: 'Psalm 37 is not anchored to one dramatic location, so the preacher should work with its literary and covenant setting rather than forcing artificial geography. The psalm uses themes such as land, inheritance, dwelling, and stability to show that God’s promises are lived out in real covenant life before Him.',
                    },
                    {
                        title: 'Significance for Preaching',
                        content: 'Psalm 37:23–24 must stay connected to the psalm’s larger tension between wicked prosperity and righteous trust. The text does not teach that believers never stumble. It teaches that the Lord directs the life of the righteous and upholds them when they fall, so the focus is God’s sustaining faithfulness rather than human perfection.',
                    },
                    {
                        title: 'Pastoral Application',
                        content: 'This passage gives real hope to people who feel unstable, ashamed, or discouraged by failure. The preacher can say with honesty that stumbling is possible, yet final abandonment is not for those held by the Lord. God steadies His people and teaches them to keep walking in trust.',
                    },
                ],
                warnings: [],
                source: 'curated',
            };
        };
        PerVerseContextService_1.prototype.buildJohn3Context = function (reference, language) {
            if (language === 'es') {
                return {
                    status: 'ready',
                    reference: reference,
                    language: language,
                    genre: 'Diálogo del evangelio',
                    sections: [
                        {
                            title: 'Historical Context',
                            content: 'Juan 3:16 aparece dentro de la conversación de Jesús con Nicodemo, un maestro religioso que necesita entender el nuevo nacimiento. El versículo resume el corazón del evangelio en medio de una escena donde Jesús confronta la confianza religiosa superficial y revela la iniciativa salvadora de Dios.',
                        },
                        {
                            title: 'Cultural Context',
                            content: 'Nicodemo representa a una persona formada dentro de la vida religiosa de Israel, pero todavía necesitada de una obra interior de Dios. El lenguaje de creer, vida eterna y perecer habla de una respuesta total a la revelación de Dios en Cristo, no de un simple acuerdo intelectual.',
                        },
                        {
                            title: 'Geographical / Literary Setting',
                            content: 'El escenario inmediato es Jerusalén y el marco literario es el testimonio del Evangelio de Juan acerca de Jesús como el Hijo enviado por el Padre. El predicador debe mantener el versículo unido al diálogo completo sobre nuevo nacimiento, luz y tinieblas.',
                        },
                        {
                            title: 'Significance for Preaching',
                            content: 'Juan 3:16 no debe reducirse a un eslogan aislado. En su contexto, anuncia que la salvación nace del amor de Dios, llega por el don del Hijo y exige una respuesta de fe. El énfasis recae en la iniciativa divina y en la urgencia de recibir a Cristo.',
                        },
                        {
                            title: 'Pastoral Application',
                            content: 'El pasaje permite hablar a personas religiosas, cansadas o culpables que necesitan más que información espiritual. Dios ama, Dios da y Dios llama a creer. El predicador puede invitar a la congregación a confiar en el Hijo y recibir la vida que Dios ofrece.',
                        },
                    ],
                    warnings: [],
                    source: 'curated',
                };
            }
            return {
                status: 'ready',
                reference: reference,
                language: language,
                genre: 'Gospel dialogue',
                sections: [
                    {
                        title: 'Historical Context',
                        content: 'John 3:16 comes in Jesus’ nighttime conversation with Nicodemus, a respected religious leader who must learn that entry into God’s kingdom requires new birth. The verse is not floating free from context; it stands inside Jesus’ explanation of God’s saving initiative.',
                    },
                    {
                        title: 'Cultural Context',
                        content: 'Nicodemus reflects the religious world of first-century Judaism, where knowledge, status, and covenant privilege mattered deeply. Jesus redirects attention from human standing to divine grace, teaching that eternal life is received through believing in the Son.',
                    },
                    {
                        title: 'Geographical / Literary Setting',
                        content: 'The immediate setting is Jerusalem, but the stronger context is literary: John presents Jesus as the sent Son who brings light into darkness. John 3:16 should be preached alongside the themes of new birth, belief, and the contrast between light and darkness in the rest of the chapter.',
                    },
                    {
                        title: 'Significance for Preaching',
                        content: 'This verse must be preached as the gospel in context, not as an isolated slogan. It shows that salvation begins in God’s love, is accomplished through the gift of the Son, and calls for a response of faith from people who cannot save themselves.',
                    },
                    {
                        title: 'Pastoral Application',
                        content: 'John 3:16 speaks to people who need more than religious familiarity. The preacher can call the congregation to trust the God who loved first, gave His Son freely, and still offers life to those who believe.',
                    },
                ],
                warnings: [],
                source: 'curated',
            };
        };
        PerVerseContextService_1.prototype.buildLuke15Context = function (reference, language) {
            if (language === 'es') {
                return {
                    status: 'ready',
                    reference: reference,
                    language: language,
                    genre: 'Parábola',
                    sections: [
                        {
                            title: 'Historical Context',
                            content: 'Lucas 15:11–24 forma parte de la respuesta de Jesús a la murmuración de los fariseos y escribas porque Él recibe a pecadores. La parábola del hijo pródigo muestra el corazón del Padre en medio de una discusión sobre quién pertenece realmente al gozo del reino.',
                        },
                        {
                            title: 'Cultural Context',
                            content: 'La petición de la herencia antes de tiempo era una ofensa grave contra la familia. La pobreza, el hambre y el cuidado de cerdos muestran degradación, vergüenza y distancia del hogar. El abrazo del padre, el vestido, el anillo y la fiesta hablan de restauración pública, no solo de perdón privado.',
                        },
                        {
                            title: 'Geographical / Literary Setting',
                            content: 'La fuerza del pasaje no depende de un mapa específico sino del movimiento literario de alejamiento, ruina, arrepentimiento y regreso. Dentro de Lucas 15, esta historia culmina la secuencia de la oveja perdida y la moneda perdida, ampliando el gozo del reencuentro con el hijo restaurado.',
                        },
                        {
                            title: 'Significance for Preaching',
                            content: 'El predicador no debe reducir este texto a una simple moraleja sobre malas decisiones. Jesús está revelando el carácter del Padre y confrontando tanto la rebelión abierta del hijo menor como la dureza religiosa del hijo mayor. El acento cae sobre la gracia que corre a recibir al arrepentido.',
                        },
                        {
                            title: 'Pastoral Application',
                            content: 'Este pasaje habla a personas que se sienten lejos, indignas o cansadas de fingir. También confronta a quienes se irritan cuando la gracia alcanza a otros. El sermón puede invitar a volver a casa confiando en el Padre que recibe, restaura y se alegra en rescatar.',
                        },
                    ],
                    warnings: [],
                    source: 'curated',
                };
            }
            return {
                status: 'ready',
                reference: reference,
                language: language,
                genre: 'Parable',
                sections: [
                    {
                        title: 'Historical Context',
                        content: 'Luke 15:11–24 belongs to Jesus’ response to religious leaders who resent His welcome of sinners. The parable is not only about a rebellious son; it reveals the Father’s heart in a chapter built around the recovery of what was lost.',
                    },
                    {
                        title: 'Cultural Context',
                        content: 'Requesting an inheritance early was a deep insult within family life. The younger son’s hunger, ruin, and life among pigs communicate shame, uncleanness, and collapse. The father’s embrace, robe, ring, and feast signal public restoration, not bare private forgiveness.',
                    },
                    {
                        title: 'Geographical / Literary Setting',
                        content: 'The power of the passage does not depend on exact geography as much as its literary movement from distance to repentance to welcome. Within Luke 15, the story climaxes the sequence of the lost sheep and the lost coin by showing the joy of restored sonship.',
                    },
                    {
                        title: 'Significance for Preaching',
                        content: 'This passage should not be flattened into a generic lesson about bad choices. Jesus is exposing both open rebellion and cold religious resentment while magnifying the compassion of the Father. The sermon should let the welcome of grace carry the weight of the text.',
                    },
                    {
                        title: 'Pastoral Application',
                        content: 'Luke 15 speaks to people who feel far from home and to churchgoers who struggle to rejoice over mercy shown to others. The preacher can call listeners to come home in repentance and to share the Father’s joy in restoration.',
                    },
                ],
                warnings: [],
                source: 'curated',
            };
        };
        PerVerseContextService_1.prototype.buildRevelation14Context = function (reference, language) {
            if (language === 'es') {
                return {
                    status: 'ready',
                    reference: reference,
                    language: language,
                    genre: 'Profecía apocalíptica',
                    sections: [
                        {
                            title: 'Historical Context',
                            content: 'Apocalipsis 14:6–12 pertenece a la visión de Juan sobre el conflicto final entre la fidelidad a Dios y la lealtad falsa. El pasaje presenta el mensaje de los tres ángeles como un llamado global en medio de presión espiritual, engaño y perseverancia.',
                        },
                        {
                            title: 'Cultural Context',
                            content: 'El lenguaje de adoración, paciencia y mandamientos comunica lealtad de pacto bajo conflicto. Las imágenes no fueron dadas para alimentar morbo o pánico, sino para fortalecer a un pueblo llamado a obedecer a Dios y a mantener la fe de Jesús en tiempos de oposición.',
                        },
                        {
                            title: 'Geographical / Literary Setting',
                            content: 'La escena es apocalíptica y simbólica más que geográfica en sentido estrecho. Dentro de Apocalipsis, este pasaje debe leerse a la luz del Cordero, del evangelio eterno y del conflicto entre la adoración verdadera y la falsa. El predicador debe mantener a Cristo y el evangelio en el centro.',
                        },
                        {
                            title: 'Significance for Preaching',
                            content: 'Apocalipsis 14:6–12 no debe predicarse con tono sensacionalista. El primer énfasis del pasaje es el evangelio eterno, seguido por el llamado a adorar al Creador y a perseverar en fidelidad. El sermón debe subrayar esperanza, reverencia y resistencia santa en lugar de miedo.',
                        },
                        {
                            title: 'Pastoral Application',
                            content: 'Este texto fortalece a creyentes que viven bajo presión cultural o espiritual. El predicador puede llamar a la iglesia a adorar a Dios con fidelidad, a rechazar lealtades falsas y a permanecer firme en Jesús con esperanza sobria y reverente.',
                        },
                    ],
                    warnings: [],
                    source: 'curated',
                };
            }
            return {
                status: 'ready',
                reference: reference,
                language: language,
                genre: 'Prophetic apocalyptic',
                sections: [
                    {
                        title: 'Historical Context',
                        content: 'Revelation 14:6–12 belongs to John’s vision of final conflict, where allegiance to God is tested in the face of deception and pressure. The passage presents the three angels’ messages as a worldwide summons rooted in the everlasting gospel.',
                    },
                    {
                        title: 'Cultural Context',
                        content: 'Its language of worship, endurance, commandments, and the faith of Jesus reflects covenant loyalty under conflict. These images are meant to steady God’s people, not to stir panic or spectacle. The text calls the church to faithful worship when false worship becomes costly.',
                    },
                    {
                        title: 'Geographical / Literary Setting',
                        content: 'The setting is symbolic and apocalyptic rather than narrowly geographic. Within Revelation, this passage must be read in the light of the Lamb, the everlasting gospel, and the contrast between true and false worship. The preacher should keep Christ and the gospel central at every step.',
                    },
                    {
                        title: 'Significance for Preaching',
                        content: 'Revelation 14 should not be handled as fear bait. The first note is good news, then a call to worship the Creator, remain faithful, and endure with the saints. The sermon should sound hopeful, reverent, and clear rather than chaotic or sensational.',
                    },
                    {
                        title: 'Pastoral Application',
                        content: 'This passage serves believers who need courage to stay loyal under pressure. The preacher can call the church to patient endurance, faithful worship, and Christ-centered obedience without turning the text into panic-driven speculation.',
                    },
                ],
                warnings: [],
                source: 'curated',
            };
        };
        PerVerseContextService_1.prototype.buildExodus20Context = function (reference, language) {
            if (language === 'es') {
                return {
                    status: 'ready',
                    reference: reference,
                    language: language,
                    genre: 'Ley del pacto',
                    sections: [
                        {
                            title: 'Historical Context',
                            content: 'Éxodo 20:8–11 se encuentra dentro del pacto del Sinaí después de la liberación de Israel de Egipto. El mandamiento del sábado se da a un pueblo redimido que ahora aprende cómo vivir bajo la autoridad y la misericordia del Dios que lo rescató.',
                        },
                        {
                            title: 'Cultural Context',
                            content: 'El sábado ordena descanso para toda la casa: familia, siervos y extranjeros. En un mundo donde el trabajo podía dominar la vida, este mandamiento proclamaba que el tiempo pertenece a Dios y que su pueblo no vive esclavizado por la producción continua.',
                        },
                        {
                            title: 'Geographical / Literary Setting',
                            content: 'El escenario inmediato es Sinaí, pero el peso principal es teológico y de pacto. El mandamiento se apoya en la creación: Dios hizo los cielos y la tierra y reposó el séptimo día. Por eso el sábado conecta identidad, adoración y memoria en la vida del pueblo.',
                        },
                        {
                            title: 'Significance for Preaching',
                            content: 'Éxodo 20:8–11 no debe reducirse a una regla aislada. El mandamiento revela al Dios Creador que aparta tiempo santo para la comunión, el descanso y la obediencia. El sermón debe mostrar que el sábado nace del carácter de Dios y de su pacto con un pueblo redimido.',
                        },
                        {
                            title: 'Pastoral Application',
                            content: 'Este pasaje habla a creyentes agotados, acelerados o tentados a medir la vida solo por productividad. El predicador puede invitar a la iglesia a recibir el sábado como un regalo de adoración, memoria y descanso en el Dios que crea, sostiene y redime.',
                        },
                    ],
                    warnings: [],
                    source: 'curated',
                };
            }
            return {
                status: 'ready',
                reference: reference,
                language: language,
                genre: 'Covenant law',
                sections: [
                    {
                        title: 'Historical Context',
                        content: 'Exodus 20:8–11 stands within the Sinai covenant after God has redeemed Israel from Egypt. The Sabbath command is given to a rescued people who are learning how to live under the rule of the God who brought them out.',
                    },
                    {
                        title: 'Cultural Context',
                        content: 'The Sabbath command orders rest for the whole household, including family members, servants, and outsiders. In a world where labor could dominate life, Sabbath proclaimed that God owns time and that His people are not meant to live as slaves to endless production.',
                    },
                    {
                        title: 'Geographical / Literary Setting',
                        content: 'The immediate setting is Sinai, but the weight of the passage is covenantal and theological. The command is grounded in creation itself: the God who made heaven and earth set apart the seventh day. That links Sabbath to worship, identity, and memory in the life of God’s people.',
                    },
                    {
                        title: 'Significance for Preaching',
                        content: 'Exodus 20:8–11 should not be reduced to an isolated rule. It reveals the Creator who establishes holy time for rest, worship, and obedience. The preacher should connect Sabbath to God’s character, creation, and covenant grace.',
                    },
                    {
                        title: 'Pastoral Application',
                        content: 'This passage speaks to people who are exhausted, hurried, or tempted to measure life only by productivity. The preacher can invite the church to receive Sabbath as a gift of worship, remembrance, and rest in the God who creates, sustains, and redeems.',
                    },
                ],
                warnings: [],
                source: 'curated',
            };
        };
        PerVerseContextService_1.prototype.normalizeGenre = function (reference, parsedGenre) {
            var normalized = reference.toLowerCase();
            if (parsedGenre)
                return this.cleanText(parsedGenre);
            if (normalized.startsWith('psalm 37') || normalized.startsWith('ps 37'))
                return 'Wisdom psalm';
            if (normalized.startsWith('john 3'))
                return 'Gospel dialogue';
            if (normalized.startsWith('luke 15'))
                return 'Parable';
            if (normalized.startsWith('revelation 14') || normalized.startsWith('rev 14'))
                return 'Prophetic apocalyptic';
            if (normalized.startsWith('exodus 20'))
                return 'Covenant law';
            return 'Canonical passage';
        };
        PerVerseContextService_1.prototype.buildDeterministicHints = function (reference) {
            var normalized = reference.toLowerCase();
            if (normalized.startsWith('psalm 37') || normalized.startsWith('ps 37')) {
                return {
                    genreHint: 'wisdom psalm / acrostic wisdom poem',
                    themeHint: 'trust the Lord instead of envying evildoers',
                    contextHint: 'the righteous may stumble, but the Lord upholds them',
                    motifHint: 'path, steps, way, falling, land, inheritance, dwelling',
                };
            }
            if (normalized.startsWith('john 3')) {
                return {
                    genreHint: 'gospel dialogue',
                    themeHint: 'God’s love gives eternal life through the Son',
                    contextHint: 'Nicodemus comes at night and must hear about new birth',
                    motifHint: 'light, birth, wind, believing, life',
                };
            }
            if (normalized.startsWith('luke 15')) {
                return {
                    genreHint: 'parable',
                    themeHint: 'the Father welcomes the repentant child',
                    contextHint: 'grumbling insiders, inheritance, shame, repentance, welcome',
                    motifHint: 'homecoming, road, robe, ring, feast, embrace',
                };
            }
            if (normalized.startsWith('revelation 14') || normalized.startsWith('rev 14')) {
                return {
                    genreHint: 'prophetic apocalyptic',
                    themeHint: 'the everlasting gospel and worship of the Creator',
                    contextHint: 'hopeful witness under pressure, not sensational fear',
                    motifHint: 'angelic proclamation, worship, endurance, creation, hope',
                };
            }
            if (normalized.startsWith('exodus 20')) {
                return {
                    genreHint: 'covenant law',
                    themeHint: 'Sabbath as covenant rest grounded in creation and liberation',
                    contextHint: 'a redeemed people learns how to live after rescue',
                    motifHint: 'Sabbath, rest, creation, deliverance, covenant identity',
                };
            }
            return {
                genreHint: 'passage-aware pastoral context',
                themeHint: 'the passage’s central burden and the preacher’s pastoral task',
                contextHint: 'chapter-level context and canonical movement',
                motifHint: 'literary, covenantal, and pastoral clues from the text',
            };
        };
        PerVerseContextService_1.prototype.normalizeReference = function (ref) {
            return this.cleanText(ref).replace(/\s+/g, ' ');
        };
        PerVerseContextService_1.prototype.normalizeLanguage = function (language) {
            return this.cleanText(language).toLowerCase();
        };
        PerVerseContextService_1.prototype.assertSupportedLanguage = function (language) {
            if (!['en', 'es'].includes(language)) {
                throw new common_1.BadRequestException('Unsupported language');
            }
        };
        PerVerseContextService_1.prototype.assertValidReference = function (reference) {
            if (!reference) {
                throw new common_1.BadRequestException('Missing required reference parameter');
            }
            var referencePattern = /^(?:[1-3]\s*)?[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*\s+\d+(?::\d+(?:-\d+)?)?$/;
            if (!referencePattern.test(reference)) {
                throw new common_1.BadRequestException('Invalid reference parameter');
            }
        };
        PerVerseContextService_1.prototype.loadPassageText = function (reference, translationCode) {
            return __awaiter(this, void 0, void 0, function () {
                var passageText, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            passageText = '';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.scriptureService.getPassage(reference, translationCode)];
                        case 2:
                            result = _a.sent();
                            if (result && result.verses && result.verses.length > 0) {
                                passageText = result.verses.map(function (verse) { return "".concat(verse.reference, ": ").concat(verse.text); }).join('\n');
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error('Failed to fetch passage text for verse context:', error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, passageText];
                    }
                });
            });
        };
        PerVerseContextService_1.prototype.cleanText = function (value) {
            return String(value !== null && value !== void 0 ? value : '').replace(/\s+/g, ' ').trim();
        };
        PerVerseContextService_1.prototype.initializeContextData = function () {
            // Reserved for curated high-priority verses in the future.
        };
        PerVerseContextService_1.prototype.hasContextData = function (reference) {
            var normalized = this.normalizeReference(reference);
            return this.contextIndex.has(normalized);
        };
        PerVerseContextService_1.prototype.getAllAvailableVerses = function () {
            return Array.from(this.contextIndex.keys());
        };
        return PerVerseContextService_1;
    }());
    __setFunctionName(_classThis, "PerVerseContextService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PerVerseContextService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PerVerseContextService = _classThis;
}();
exports.PerVerseContextService = PerVerseContextService;
