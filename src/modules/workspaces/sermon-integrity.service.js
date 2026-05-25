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
exports.SermonIntegrityService = void 0;
var common_1 = require("@nestjs/common");
var SermonIntegrityService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SermonIntegrityService = _classThis = /** @class */ (function () {
        function SermonIntegrityService_1(scriptureService, citationValidator) {
            this.scriptureService = scriptureService;
            this.citationValidator = citationValidator;
        }
        SermonIntegrityService_1.prototype.isPropheticPassage = function (reference) {
            var normalized = String(reference || '').toLowerCase();
            return (/revelation\s*14(?::\s*6\s*-\s*12)?/.test(normalized) ||
                /revelation\s*(?:12\s*-\s*14|18)/.test(normalized) ||
                /daniel\s*(?:7|8)/.test(normalized) ||
                /matthew\s*24/.test(normalized) ||
                /exodus\s*20/.test(normalized));
        };
        SermonIntegrityService_1.prototype.analyzeSermonIntegrity = function (sermonData) {
            return __awaiter(this, void 0, void 0, function () {
                var isSpanish, issues, strengths, recommendations, pointAnalysis, applicationAnalysis, citationAnalysis, wellSupportedPoints, verifiedCitations, tiedApplications, criticalIssues, warningIssues, overallScore, balanced;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isSpanish = String(sermonData.language || '').toLowerCase().startsWith('es');
                            issues = [];
                            strengths = [];
                            recommendations = [];
                            return [4 /*yield*/, this.analyzeOutlinePoints(sermonData.mainPassage, sermonData.outlinePoints, isSpanish)];
                        case 1:
                            pointAnalysis = _a.sent();
                            return [4 /*yield*/, this.analyzeApplications(sermonData.mainPassage, sermonData.applications, isSpanish)];
                        case 2:
                            applicationAnalysis = _a.sent();
                            return [4 /*yield*/, this.analyzeCitations(sermonData.citations, isSpanish)];
                        case 3:
                            citationAnalysis = _a.sent();
                            // Collect issues
                            pointAnalysis.forEach(function (p) {
                                if (!p.textSupported) {
                                    issues.push({
                                        severity: 'critical',
                                        category: 'textual_support',
                                        message: isSpanish
                                            ? "Este punto necesita apoyo textual m\u00E1s claro antes de predicarlo: \"".concat(p.point.substring(0, 50), "...\"")
                                            : "This point needs clearer textual support before it is preached: \"".concat(p.point.substring(0, 50), "...\""),
                                        affectedItem: p.point
                                    });
                                }
                                else if (p.supportScore < 0.5) {
                                    issues.push({
                                        severity: 'warning',
                                        category: 'textual_support',
                                        message: isSpanish
                                            ? "Este punto necesita una conexi\u00F3n m\u00E1s visible con el pasaje: \"".concat(p.point.substring(0, 50), "...\"")
                                            : "This point needs a more visible connection to the passage: \"".concat(p.point.substring(0, 50), "...\""),
                                        affectedItem: p.point
                                    });
                                }
                            });
                            applicationAnalysis.forEach(function (a) {
                                if (!a.tiedToPassage) {
                                    issues.push({
                                        severity: 'warning',
                                        category: 'application',
                                        message: isSpanish
                                            ? "Esta aplicaci\u00F3n necesita un puente m\u00E1s claro hacia el pasaje: \"".concat(a.application.substring(0, 50), "...\"")
                                            : "This application needs a clearer bridge back to the passage: \"".concat(a.application.substring(0, 50), "...\""),
                                        affectedItem: a.application
                                    });
                                }
                            });
                            citationAnalysis.forEach(function (c) {
                                if (c.supportLevel === 'not_supported') {
                                    issues.push({
                                        severity: 'critical',
                                        category: 'citation',
                                        message: isSpanish
                                            ? "La cita no est\u00E1 respaldada por el texto b\u00EDblico y conviene revisarla antes de predicar: ".concat(c.verseReference)
                                            : "This citation is not yet supported by the verse text and should be reviewed before preaching: ".concat(c.verseReference),
                                        affectedItem: c.statement
                                    });
                                }
                                else if (c.supportLevel === 'weak') {
                                    issues.push({
                                        severity: 'warning',
                                        category: 'citation',
                                        message: isSpanish
                                            ? "Esta cita tiene respaldo d\u00E9bil y necesita revisi\u00F3n pastoral: ".concat(c.verseReference)
                                            : "This citation has weak support and needs pastoral review: ".concat(c.verseReference),
                                        affectedItem: c.statement
                                    });
                                }
                            });
                            wellSupportedPoints = pointAnalysis.filter(function (p) { return p.supportScore >= 0.7; }).length;
                            if (wellSupportedPoints > 0) {
                                strengths.push(isSpanish
                                    ? "".concat(wellSupportedPoints, " puntos del bosquejo tienen fuerte apoyo textual")
                                    : "".concat(wellSupportedPoints, " outline points have strong textual support"));
                            }
                            verifiedCitations = citationAnalysis.filter(function (c) { return c.supportLevel === 'supported'; }).length;
                            if (verifiedCitations > 0) {
                                strengths.push(isSpanish
                                    ? "".concat(verifiedCitations, " citas est\u00E1n bien respaldadas por la Escritura")
                                    : "".concat(verifiedCitations, " citations are well-supported by Scripture"));
                            }
                            tiedApplications = applicationAnalysis.filter(function (a) { return a.tiedToPassage; }).length;
                            if (tiedApplications > 0) {
                                strengths.push(isSpanish
                                    ? "".concat(tiedApplications, " aplicaciones est\u00E1n claramente conectadas al pasaje")
                                    : "".concat(tiedApplications, " applications are clearly tied to the passage"));
                            }
                            // Generate recommendations
                            if (issues.some(function (i) { return i.category === 'textual_support'; })) {
                                recommendations.push(isSpanish
                                    ? 'Revisa los puntos del bosquejo para asegurar que surjan del texto y no sean impuestos sobre él'
                                    : 'Review outline points to ensure they emerge from the text rather than being imposed on it');
                            }
                            if (issues.some(function (i) { return i.category === 'citation'; })) {
                                recommendations.push(isSpanish
                                    ? 'Verifica todas las citas bíblicas para asegurar precisión y contexto adecuado'
                                    : 'Verify all Scripture citations to ensure accuracy and proper context');
                            }
                            if (issues.some(function (i) { return i.category === 'application'; })) {
                                recommendations.push(isSpanish
                                    ? 'Fortalece la conexión entre las aplicaciones y el pasaje principal para que el llamado pastoral nazca del texto.'
                                    : 'Strengthen the connection between applications and the main passage so the pastoral call rises from the text.');
                            }
                            if (this.isPropheticPassage(sermonData.mainPassage)) {
                                recommendations.push(isSpanish
                                    ? 'En pasajes proféticos, mantén a Cristo en el centro, confirma el trasfondo histórico y evita especulación o sensacionalismo.'
                                    : 'For prophetic passages, keep Christ at the center, verify the historical setting, and avoid speculation or sensationalism.');
                            }
                            criticalIssues = issues.filter(function (i) { return i.severity === 'critical'; }).length;
                            warningIssues = issues.filter(function (i) { return i.severity === 'warning'; }).length;
                            overallScore = 100;
                            overallScore -= criticalIssues * 15;
                            overallScore -= warningIssues * 5;
                            overallScore = Math.max(0, Math.min(100, overallScore));
                            balanced = criticalIssues === 0 && warningIssues <= 2;
                            return [2 /*return*/, {
                                    overallScore: overallScore,
                                    balanced: balanced,
                                    issues: issues,
                                    strengths: strengths,
                                    recommendations: recommendations,
                                    pointAnalysis: pointAnalysis,
                                    applicationAnalysis: applicationAnalysis,
                                    citationAnalysis: citationAnalysis
                                }];
                    }
                });
            });
        };
        SermonIntegrityService_1.prototype.analyzeOutlinePoints = function (mainPassage, points, isSpanish) {
            return __awaiter(this, void 0, void 0, function () {
                var results, passage, passageText, _i, points_1, point, supportScore, textSupported, error_1, _a, points_2, point;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            results = [];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.scriptureService.getPassage(mainPassage)];
                        case 2:
                            passage = _c.sent();
                            passageText = ((_b = passage === null || passage === void 0 ? void 0 : passage.verses) === null || _b === void 0 ? void 0 : _b.map(function (v) { return v.text || ''; }).join(' ')) || '';
                            for (_i = 0, points_1 = points; _i < points_1.length; _i++) {
                                point = points_1[_i];
                                supportScore = this.calculateTextualSupport(point, passageText);
                                textSupported = supportScore >= 0.4;
                                results.push({
                                    point: point,
                                    textSupported: textSupported,
                                    supportingVerses: [mainPassage],
                                    supportScore: supportScore,
                                    issues: textSupported
                                        ? []
                                        : [isSpanish ? 'El punto no surge claramente del texto del pasaje' : 'Point does not clearly emerge from the passage text']
                                });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _c.sent();
                            // If passage retrieval fails, mark all as unsupported
                            for (_a = 0, points_2 = points; _a < points_2.length; _a++) {
                                point = points_2[_a];
                                results.push({
                                    point: point,
                                    textSupported: false,
                                    supportingVerses: [],
                                    supportScore: 0,
                                    issues: [isSpanish ? 'No se pudo verificar el apoyo textual' : 'Could not verify textual support']
                                });
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, results];
                    }
                });
            });
        };
        SermonIntegrityService_1.prototype.analyzeApplications = function (mainPassage, applications, isSpanish) {
            return __awaiter(this, void 0, void 0, function () {
                var results, passage, passageText, _i, applications_1, app, relevanceScore, tiedToPassage, error_2, _a, applications_2, app;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            results = [];
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.scriptureService.getPassage(mainPassage)];
                        case 2:
                            passage = _c.sent();
                            passageText = ((_b = passage === null || passage === void 0 ? void 0 : passage.verses) === null || _b === void 0 ? void 0 : _b.map(function (v) { return v.text || ''; }).join(' ')) || '';
                            for (_i = 0, applications_1 = applications; _i < applications_1.length; _i++) {
                                app = applications_1[_i];
                                relevanceScore = this.calculateRelevance(app, passageText);
                                tiedToPassage = relevanceScore >= 0.3;
                                results.push({
                                    application: app,
                                    tiedToPassage: tiedToPassage,
                                    relevanceScore: relevanceScore,
                                    issues: tiedToPassage
                                        ? []
                                        : [isSpanish ? 'La conexión de la aplicación con el pasaje no es clara' : 'Application connection to passage is unclear']
                                });
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _c.sent();
                            for (_a = 0, applications_2 = applications; _a < applications_2.length; _a++) {
                                app = applications_2[_a];
                                results.push({
                                    application: app,
                                    tiedToPassage: false,
                                    relevanceScore: 0,
                                    issues: [isSpanish ? 'No se pudo verificar la conexión con el pasaje' : 'Could not verify passage connection']
                                });
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, results];
                    }
                });
            });
        };
        SermonIntegrityService_1.prototype.analyzeCitations = function (citations, isSpanish) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _i, citations_1, citation, _a, _b, ref, validation;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            results = [];
                            _i = 0, citations_1 = citations;
                            _c.label = 1;
                        case 1:
                            if (!(_i < citations_1.length)) return [3 /*break*/, 6];
                            citation = citations_1[_i];
                            _a = 0, _b = citation.verseReferences;
                            _c.label = 2;
                        case 2:
                            if (!(_a < _b.length)) return [3 /*break*/, 5];
                            ref = _b[_a];
                            return [4 /*yield*/, this.citationValidator.validateCitation(citation.statement, ref)];
                        case 3:
                            validation = _c.sent();
                            results.push({
                                statement: citation.statement,
                                verseReference: ref,
                                verified: validation.supportLevel === 'supported',
                                supportLevel: validation.supportLevel,
                                issues: validation.supportLevel === 'supported'
                                    ? []
                                    : [
                                        isSpanish
                                            ? this.translateCitationExplanation(validation.explanation)
                                            : validation.explanation,
                                    ],
                            });
                            _c.label = 4;
                        case 4:
                            _a++;
                            return [3 /*break*/, 2];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, results];
                    }
                });
            });
        };
        SermonIntegrityService_1.prototype.calculateTextualSupport = function (point, passageText) {
            var pointWords = point.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(/\s+/)
                .filter(function (w) { return w.length > 3; });
            var passageWords = new Set(passageText.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(/\s+/)
                .filter(function (w) { return w.length > 3; }));
            if (pointWords.length === 0)
                return 0;
            var matchedWords = pointWords.filter(function (w) { return passageWords.has(w); });
            return matchedWords.length / pointWords.length;
        };
        SermonIntegrityService_1.prototype.calculateRelevance = function (application, passageText) {
            // Similar to textual support but with lower threshold
            return this.calculateTextualSupport(application, passageText) * 0.8;
        };
        SermonIntegrityService_1.prototype.translateCitationExplanation = function (explanation) {
            var value = String(explanation || '').trim();
            if (!value)
                return 'La cita necesita verificación adicional.';
            if (/not supported/i.test(value))
                return 'La cita no está respaldada por el texto bíblico citado.';
            if (/weak/i.test(value))
                return 'La cita muestra un respaldo débil y requiere revisión.';
            if (/context/i.test(value))
                return 'La cita requiere una revisión de contexto.';
            if (/could not/i.test(value) || /unable/i.test(value))
                return 'No se pudo verificar la cita con los datos disponibles.';
            return value;
        };
        return SermonIntegrityService_1;
    }());
    __setFunctionName(_classThis, "SermonIntegrityService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SermonIntegrityService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SermonIntegrityService = _classThis;
}();
exports.SermonIntegrityService = SermonIntegrityService;
