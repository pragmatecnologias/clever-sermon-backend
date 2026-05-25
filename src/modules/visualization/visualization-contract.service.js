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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualizationContractService = void 0;
var common_1 = require("@nestjs/common");
var VisualizationContractService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VisualizationContractService = _classThis = /** @class */ (function () {
        function VisualizationContractService_1() {
        }
        VisualizationContractService_1.prototype.normalizeRelationType = function (raw) {
            var value = String(raw || '').trim().toLowerCase();
            if (!value)
                return 'thematic';
            var map = {
                direct_quotation: 'direct_quotation',
                direct_quote: 'direct_quotation',
                quotation: 'direct_quotation',
                quote: 'direct_quotation',
                thematic: 'thematic',
                thematic_echo: 'thematic',
                theme_connection: 'thematic',
                parallels: 'thematic',
                supports: 'thematic',
                applies: 'thematic',
                typology: 'typology',
                prophetic_fulfillment: 'prophetic_fulfillment',
                fulfills: 'prophetic_fulfillment',
                fulfillment: 'prophetic_fulfillment',
                narrative_continuation: 'narrative_continuation',
                illustrates: 'narrative_continuation',
                lexical: 'lexical',
                grounds: 'direct_quotation',
            };
            return map[value] || 'thematic';
        };
        VisualizationContractService_1.prototype.getRelationStyle = function (relationType) {
            if (relationType === 'direct_quotation' || relationType === 'prophetic_fulfillment') {
                return 'solid';
            }
            if (relationType === 'thematic' || relationType === 'narrative_continuation') {
                return 'dashed';
            }
            return 'dotted';
        };
        VisualizationContractService_1.prototype.normalizeStrengthScore = function (raw) {
            if (typeof raw === 'number' && Number.isFinite(raw)) {
                return Math.max(0, Math.min(1, raw));
            }
            var value = String(raw || '').trim().toLowerCase();
            if (value === 'strong' || value === 'high' || value === 'primary')
                return 0.9;
            if (value === 'moderate' || value === 'medium' || value === 'secondary')
                return 0.65;
            if (value === 'weak' || value === 'low' || value === 'illustrative')
                return 0.35;
            return 0.6;
        };
        VisualizationContractService_1.prototype.inferTestament = function (reference) {
            var normalized = String(reference || '').toUpperCase().replace(/\s+/g, '');
            if (!normalized)
                return 'UNKNOWN';
            var otBooks = [
                'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI',
                '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER',
                'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP',
                'HAG', 'ZEC', 'MAL', 'GENESIS', 'EXODUS', 'LEVITICUS', 'NUMBERS', 'DEUTERONOMY',
                'JOSHUA', 'JUDGES', 'RUTH', 'SAMUEL', 'KINGS', 'CHRONICLES', 'EZRA', 'NEHEMIAH',
                'ESTHER', 'JOB', 'PSALM', 'PSALMS', 'PROVERBS', 'ECCLESIASTES', 'SONG', 'ISAIAH',
                'JEREMIAH', 'LAMENTATIONS', 'EZEKIEL', 'DANIEL', 'HOSEA', 'JOEL', 'AMOS', 'OBADIAH',
                'JONAH', 'MICAH', 'NAHUM', 'HABAKKUK', 'ZEPHANIAH', 'HAGGAI', 'ZECHARIAH', 'MALACHI',
                'GENESIS', 'SALMOS', 'PROVERBIOS', 'ISAIAS', 'JEREMIAS', 'EZEQUIEL', 'DANIEL', 'OSEAS',
                'JOEL', 'AMOS', 'ABDIAS', 'JONAS', 'MIQUEAS', 'NAHUM', 'HABACUC', 'SOFONIAS', 'HAGEO',
                'ZACARIAS', 'MALAQUIAS',
            ];
            var ntBooks = [
                'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL',
                '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN',
                '3JN', 'JUD', 'REV', 'MATTHEW', 'MARK', 'LUKE', 'JOHN', 'ACTS', 'ROMANS', 'CORINTHIANS',
                'GALATIANS', 'EPHESIANS', 'PHILIPPIANS', 'COLOSSIANS', 'THESSALONIANS', 'TIMOTHY', 'TITUS',
                'PHILEMON', 'HEBREWS', 'JAMES', 'PETER', 'JUDE', 'REVELATION', 'MATEO', 'MARCOS', 'LUCAS',
                'JUAN', 'HECHOS', 'ROMANOS', 'CORINTIOS', 'GALATAS', 'EFESIOS', 'FILIPENSES', 'COLOSENSES',
                'TESALONICENSES', 'TIMOTEO', 'TITO', 'FILEMON', 'HEBREOS', 'SANTIAGO', 'PEDRO', 'APOCALIPSIS',
            ];
            var token = normalized.split(/[.:,\-]/)[0];
            if (otBooks.some(function (book) { return token.startsWith(book); }))
                return 'OT';
            if (ntBooks.some(function (book) { return token.startsWith(book); }))
                return 'NT';
            return 'UNKNOWN';
        };
        VisualizationContractService_1.prototype.enrichGraph = function (data) {
            var _this = this;
            var nodes = (data.nodes || []).map(function (node) {
                var reference = node.reference || node.label || node.id;
                var themes = Array.isArray(node.themes)
                    ? node.themes
                    : Array.isArray(node.relatedThemes)
                        ? node.relatedThemes.map(function (theme) { return (typeof theme === 'string' ? theme : theme === null || theme === void 0 ? void 0 : theme.name); }).filter(Boolean)
                        : node.theme
                            ? [node.theme]
                            : [];
                var warningLevel = node.warningLevel || (node.isWeak ? 'warning' : undefined);
                return __assign(__assign({}, node), { kind: node.kind || node.type || 'node', reference: reference, label: node.label || reference, themes: themes, warningLevel: warningLevel, testament: node.testament || _this.inferTestament(reference) });
            });
            var connections = (data.connections || []).map(function (edge) {
                var _a, _b;
                var relationType = _this.normalizeRelationType(edge.relationType || edge.type);
                var strengthScore = _this.normalizeStrengthScore((_b = (_a = edge.strengthScore) !== null && _a !== void 0 ? _a : edge.strengthValue) !== null && _b !== void 0 ? _b : edge.strength);
                return __assign(__assign({}, edge), { source: edge.source || edge.from, target: edge.target || edge.to, relationType: relationType, relationStyle: edge.relationStyle || _this.getRelationStyle(relationType), strengthScore: strengthScore, explanation: edge.explanation || edge.canonicalSignificance || 'Scripture connection', evidence: edge.evidence || {
                        canonicalSignificance: edge.canonicalSignificance || null,
                        sourceEra: edge.sourceEra || null,
                        targetEra: edge.targetEra || null,
                    } });
            });
            return __assign(__assign({}, data), { nodes: nodes, connections: connections });
        };
        return VisualizationContractService_1;
    }());
    __setFunctionName(_classThis, "VisualizationContractService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VisualizationContractService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VisualizationContractService = _classThis;
}();
exports.VisualizationContractService = VisualizationContractService;
