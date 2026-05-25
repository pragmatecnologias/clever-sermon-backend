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
Object.defineProperty(exports, "__esModule", { value: true });
var workspaces_service_1 = require("./workspaces.service");
describe('WorkspacesService manuscript parsing', function () {
    var options = {
        tone: 'teaching',
        targetMinutes: 22,
        format: 'full',
        audienceMode: 'general congregation',
        includeSlideCues: true,
        includeKeyLines: true,
    };
    var service;
    var consoleInfoSpy;
    beforeEach(function () {
        var llmService = {
            getConfiguredProvider: function () { return 'local'; },
            getProviderHealth: function () { return ({ status: 'ready', message: 'Local LLM ready', checkedAt: '2026-01-01T00:00:00.000Z' }); },
            getConfiguredProviderLabel: function () { return 'Local LLM'; },
        };
        service = new workspaces_service_1.WorkspacesService(null, null, null, null, null, null, null, null, llmService, null, null, null, null, null, null, null, null);
        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(function () { return undefined; });
    });
    afterEach(function () {
        consoleInfoSpy.mockRestore();
    });
    it('uses the JSON path for valid manuscript payloads', function () {
        var response = JSON.stringify({
            text: '<h2>Introduction</h2><p onclick="alert(1)">Grace restores us.</p><script>alert(1)</script>',
            cues: {
                slide: ['Open with testimony'],
                keyLine: ['Grace still reaches dead hearts.'],
            },
        });
        var parsed = service.parseGeneratedManuscriptResponse(response, options);
        expect(parsed.text).toContain('<h2>Introduction</h2>');
        expect(parsed.text).toContain('<p>Grace restores us.</p>');
        expect(parsed.text).not.toContain('onclick=');
        expect(parsed.text).not.toContain('<script>');
        expect(parsed.cues.slide).toEqual(['Open with testimony']);
        expect(parsed.cues.keyLine).toEqual(['Grace still reaches dead hearts.']);
        expect(consoleInfoSpy).toHaveBeenCalledWith('[manuscript-parse] recovery_mode=json');
    });
    it('recovers malformed truncated JSON wrappers that contain HTML', function () {
        var response = 'assistant: {"text":"<h2>Introduction</h2><p>En Efesios 2 vemos la gracia de Dios.</p><p>Nos levantó con Cristo.</p>';
        var parsed = service.parseGeneratedManuscriptResponse(response, options);
        expect(parsed.text).toContain('<h2>Introduction</h2>');
        expect(parsed.text).toContain('<p>En Efesios 2 vemos la gracia de Dios.</p>');
        expect(parsed.cues).toEqual({
            slide: [],
            keyLine: [],
            transition: [],
            pause: [],
            read: [],
            quote: [],
            cta: [],
        });
        var recoveryModes = consoleInfoSpy.mock.calls.map(function (call) { return String(call[0] || ''); });
        expect(recoveryModes.some(function (value) {
            return value === '[manuscript-parse] recovery_mode=text-field' ||
                value === '[manuscript-parse] recovery_mode=html-fragment';
        })).toBe(true);
    });
    it('converts malformed plain-text payloads into HTML paragraphs', function () {
        var response = 'response: {"text":"Introduction\\nGrace meets dead hearts and makes them alive in Christ.';
        var parsed = service.parseGeneratedManuscriptResponse(response, options);
        expect(parsed.text).toBe('<p>Introduction Grace meets dead hearts and makes them alive in Christ.</p>');
        expect(parsed.text).not.toContain('{"text"');
        expect(consoleInfoSpy).toHaveBeenCalledWith('[manuscript-parse] recovery_mode=text-field');
    });
    it('accepts raw HTML responses without wrapping syntax', function () {
        var response = '<h2>Introduction</h2><p>Christ saves by grace.</p>';
        var parsed = service.parseGeneratedManuscriptResponse(response, options);
        expect(parsed.text).toBe('<h2>Introduction</h2><p>Christ saves by grace.</p>');
        expect(consoleInfoSpy).toHaveBeenCalledWith('[manuscript-parse] recovery_mode=html-fragment');
    });
    it('drops malformed cues while preserving recovered text', function () {
        var response = JSON.stringify({
            text: '<h2>Introduction</h2><p>Hope is alive.</p>',
            cues: {
                slide: 'not-an-array',
                keyLine: null,
            },
        });
        var parsed = service.parseGeneratedManuscriptResponse(response, __assign(__assign({}, options), { includeSlideCues: false, includeKeyLines: false }));
        expect(parsed.cues).toEqual({
            slide: [],
            keyLine: [],
            transition: [],
            pause: [],
            read: [],
            quote: [],
            cta: [],
        });
    });
    it('marks quality improvement when candidate has fewer issues and better word fit', function () {
        var baseline = {
            wordCount: 700,
            targets: { minWords: 1000, targetWords: 1200, maxWords: 1500 },
            issues: ['too_short', 'repetitive'],
        };
        var candidate = {
            wordCount: 980,
            targets: { minWords: 1000, targetWords: 1200, maxWords: 1500 },
            issues: ['too_short'],
        };
        var improved = service.isQualityImprovement(baseline, candidate);
        expect(improved).toBe(true);
    });
    it('builds localized quality warning messages', function () {
        var esMessage = service.buildManuscriptQualityWarningMessage(['too_short', 'repetitive'], 'es');
        var enMessage = service.buildManuscriptQualityWarningMessage(['too_long'], 'en');
        expect(esMessage).toContain('observaciones de calidad');
        expect(esMessage).toContain('demasiado corto');
        expect(enMessage).toContain('Draft saved with quality warnings');
        expect(enMessage).toContain('too long');
    });
    it('treats tiny manuscript fragments as unusable', function () {
        var unusable = service.hasUsableManuscriptText('<p>Hola mundo.</p>');
        var usable = service.hasUsableManuscriptText('<p>' +
            'La gracia de Dios transforma la vida humana con poder redentor y produce obediencia visible en el hogar y en la iglesia. '.repeat(3) +
            '</p>');
        expect(unusable).toBe(false);
        expect(usable).toBe(true);
    });
    it('builds a non-empty targeted repair plan from coach questions', function () {
        var workspace = {
            language: 'es',
            mainPassage: 'Efesios 2:1-10',
            theologicalLens: 'adventist',
            theme: 'Gracia transformadora',
            audienceProfile: 'Familias y jóvenes',
        };
        var questions = [
            {
                id: 'Q1',
                dimension: 'text_fidelity',
                question: '¿Cómo conecta esta metáfora con Efesios 2:1-10?',
                severity: 'medium',
                sourceAnchor: 'Introducción',
                purpose: 'Alinear con el texto',
            },
            {
                id: 'Q2',
                dimension: 'application_strength',
                question: '¿Dónde aterriza esto para familias y jóvenes?',
                severity: 'high',
                sourceAnchor: 'Punto 3',
                purpose: 'Aplicación concreta',
            },
        ];
        var plan = service.buildRepairPlanFromCoachQuestions(workspace, questions);
        expect(Array.isArray(plan)).toBe(true);
        expect(plan.length).toBeGreaterThan(0);
        expect(plan[0].issueId).toContain('issue-');
        expect(plan[0].targetAnchor).toBeTruthy();
        expect(plan[0].proposedAction).toBeTruthy();
    });
    it('applies anchored targeted replacements without rewriting full manuscript', function () {
        var html = '<h2>Introducción</h2><p>Texto original de introducción.</p><h2>Punto 1</h2><p>Contenido punto uno.</p>';
        var patched = service.applyFirstSnippetReplacement(html, 'Introducción', 'Texto original de introducción.', '<p>Texto mejorado y más fiel al pasaje.</p>');
        expect(patched).toContain('<h2>Introducción</h2>');
        expect(patched).toContain('Texto mejorado y más fiel al pasaje.');
        expect(patched).toContain('<h2>Punto 1</h2>');
        expect(patched).toContain('Contenido punto uno.');
    });
    it('removes duplicated anchor title text from heading-context repair patches', function () {
        var html = '<h2>Introducción: La noche sin luna</h2><p>Aquí comienza nuestro viaje.</p><h2>Punto 1</h2><p>Contenido punto uno.</p>';
        var patched = service.applyFirstSnippetReplacement(html, 'Introducción: La noche sin luna', 'Aquí comienza nuestro viaje.', '<p>Introducción: La noche sin luna Introducción: La noche sin luna Aquí comienza nuestro viaje con claridad.</p>');
        expect(patched).toContain('<h2>Introducción: La noche sin luna</h2>');
        expect(patched).toContain('Aquí comienza nuestro viaje con claridad.');
        expect(patched).not.toContain('Introducción: La noche sin luna Introducción: La noche sin luna');
        expect(patched).toContain('<h2>Punto 1</h2>');
    });
    it('flags adventist drift when sunday language appears', function () {
        expect(service.hasAdventistDrift('En este domingo celebramos...')).toBe(true);
        expect(service.hasAdventistDrift('En este sábado adoramos al Señor.')).toBe(false);
    });
    it('builds workspace state with history and compare summaries', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace, state;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    workspace = {
                        title: 'Hope in Christ',
                        mainPassage: 'John 3:16',
                        language: 'en',
                        status: 'in_progress',
                        metadata: {
                            activeOutlineId: 'outline-current',
                            activeManuscriptId: 'manuscript-current',
                            mediaPack: {
                                status: 'ready',
                                generatedAt: '2026-01-04T00:00:00.000Z',
                                sourceOutlineId: 'outline-current',
                                sourceManuscriptId: 'manuscript-current',
                                sourceStudyReportId: 'study-1',
                                slideCount: 6,
                                audioEnabled: true,
                                musicEnabled: false,
                                videoEnabled: true,
                                exportPrepared: true,
                            },
                            exportPack: {
                                status: 'ready',
                                generatedAt: '2026-01-04T00:00:00.000Z',
                                sourceOutlineId: 'outline-current',
                                sourceManuscriptId: 'manuscript-current',
                                sourceStudyReportId: 'study-1',
                                artifacts: [
                                    { type: 'pptx', label: 'Slide deck (PPTX)', status: 'ready', filename: 'sermon-deck-workspace.pptx' },
                                    { type: 'docx', label: 'Manuscript (DOCX)', status: 'ready', filename: 'sermon-manuscript-workspace.docx' },
                                ],
                            },
                            outlineHistory: [
                                {
                                    id: 'outline-previous',
                                    title: 'Outline Version 1',
                                    createdAt: '2026-01-01T00:00:00.000Z',
                                    archivedAt: '2026-01-02T00:00:00.000Z',
                                    revisionLabel: 'Version 1',
                                    pointCount: 2,
                                    structure: { points: ['a', 'b'] },
                                },
                            ],
                            manuscriptHistory: [
                                {
                                    id: 'manuscript-previous',
                                    outlineId: 'outline-previous',
                                    createdAt: '2026-01-01T00:00:00.000Z',
                                    updatedAt: '2026-01-02T00:00:00.000Z',
                                    archivedAt: '2026-01-02T00:00:00.000Z',
                                    revisionLabel: 'Version 1',
                                    wordCount: 900,
                                    estimatedMinutes: 7,
                                    content: { text: '<p>old</p>' },
                                    transitions: {},
                                },
                            ],
                        },
                        outlines: [
                            {
                                id: 'outline-current',
                                title: 'Outline Version 2',
                                isSelected: true,
                                createdAt: '2026-01-03T00:00:00.000Z',
                                structure: { points: ['a', 'b', 'c', 'd'] },
                            },
                        ],
                        manuscripts: [
                            {
                                id: 'manuscript-current',
                                outlineId: 'outline-current',
                                wordCount: 1200,
                                estimatedMinutes: 9,
                                createdAt: '2026-01-03T00:00:00.000Z',
                                updatedAt: '2026-01-04T00:00:00.000Z',
                                content: { text: '<p>new</p>' },
                            },
                        ],
                        studyReports: [{ id: 'study-1' }],
                        applications: [],
                        illustrations: [],
                        citations: [],
                        scriptureCache: {
                            scriptureResult: { verses: [{ reference: 'John 3:16', text: 'For God so loved the world' }] },
                        },
                    };
                    return [4 /*yield*/, service.buildWorkspaceState(workspace)];
                case 1:
                    state = _o.sent();
                    expect((_a = state.activeOutline) === null || _a === void 0 ? void 0 : _a.id).toBe('outline-current');
                    expect((_b = state.activeManuscript) === null || _b === void 0 ? void 0 : _b.id).toBe('manuscript-current');
                    expect(state.outlineHistory.length).toBeGreaterThanOrEqual(1);
                    expect(state.manuscriptHistory.length).toBeGreaterThanOrEqual(1);
                    expect((_c = state.outlineComparison) === null || _c === void 0 ? void 0 : _c.pointDelta).toBe(2);
                    expect((_d = state.manuscriptComparison) === null || _d === void 0 ? void 0 : _d.wordDelta).toBe(300);
                    expect((_e = state.manuscriptComparison) === null || _e === void 0 ? void 0 : _e.minuteDelta).toBe(2);
                    expect((_f = state.mediaPack) === null || _f === void 0 ? void 0 : _f.status).toBe('ready');
                    expect((_g = state.mediaPack) === null || _g === void 0 ? void 0 : _g.exportPrepared).toBe(true);
                    expect((_h = state.mediaPack) === null || _h === void 0 ? void 0 : _h.slideCount).toBe(6);
                    expect((_j = state.exportPack) === null || _j === void 0 ? void 0 : _j.status).toBe('ready');
                    expect((_k = state.exportPack) === null || _k === void 0 ? void 0 : _k.artifacts.length).toBeGreaterThan(0);
                    expect((_l = state.featureReadiness) === null || _l === void 0 ? void 0 : _l.outline.status).toBe('generated');
                    expect((_m = state.featureReadiness) === null || _m === void 0 ? void 0 : _m.scripture.status).toBe('generated');
                    expect(state.nextAction.label).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
