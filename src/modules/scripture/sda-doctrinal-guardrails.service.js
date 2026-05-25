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
exports.SDADoctrinalGuardrailsService = void 0;
var common_1 = require("@nestjs/common");
var SDADoctrinalGuardrailsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SDADoctrinalGuardrailsService = _classThis = /** @class */ (function () {
        function SDADoctrinalGuardrailsService_1() {
            this.guidelines = new Map();
            this.initializeGuidelines();
        }
        SDADoctrinalGuardrailsService_1.prototype.validateContent = function (content) {
            var issues = [];
            var suggestions = [];
            // Check for Sunday worship language
            if (this.containsSundayWorshipLanguage(content)) {
                issues.push({
                    severity: 'critical',
                    topic: 'Sabbath',
                    problematicPhrase: 'Sunday worship',
                    reason: 'Implies Sunday as day of worship; conflicts with Sabbath truth',
                    suggestedReplacement: 'Sabbath worship or seventh-day Sabbath'
                });
            }
            // Check for immortal soul language
            if (this.containsImmortalSoulLanguage(content)) {
                issues.push({
                    severity: 'critical',
                    topic: 'State of the Dead',
                    problematicPhrase: 'immortal soul',
                    reason: 'Implies inherent immortality; conflicts with conditional immortality',
                    suggestedReplacement: 'soul (mortal being) or person'
                });
            }
            // Check for eternal torment language
            if (this.containsEternalTormentLanguage(content)) {
                issues.push({
                    severity: 'critical',
                    topic: 'Final Punishment',
                    problematicPhrase: 'eternal torment/burning forever',
                    reason: 'Implies conscious eternal suffering; conflicts with annihilationism',
                    suggestedReplacement: 'eternal destruction or final punishment'
                });
            }
            // Check for rapture theology
            if (this.containsRaptureTheology(content)) {
                issues.push({
                    severity: 'warning',
                    topic: 'Second Coming',
                    problematicPhrase: 'secret rapture',
                    reason: 'Implies secret coming; conflicts with visible, glorious return',
                    suggestedReplacement: 'visible return of Christ or Second Coming'
                });
            }
            // Check for once saved always saved
            if (this.containsOnceSavedAlwaysSaved(content)) {
                issues.push({
                    severity: 'warning',
                    topic: 'Salvation',
                    problematicPhrase: 'once saved, always saved',
                    reason: 'Implies no possibility of apostasy; conflicts with free will and warnings',
                    suggestedReplacement: 'salvation by grace through faith, with perseverance'
                });
            }
            // Generate suggestions
            if (issues.length === 0) {
                suggestions.push('Content is aligned with SDA doctrinal positions');
            }
            else {
                suggestions.push('Review flagged phrases for doctrinal clarity');
                suggestions.push('Ensure language reflects biblical truth as understood by SDA theology');
            }
            return {
                isAligned: issues.filter(function (i) { return i.severity === 'critical'; }).length === 0,
                issues: issues,
                suggestions: suggestions
            };
        };
        SDADoctrinalGuardrailsService_1.prototype.getGuideline = function (topic) {
            return this.guidelines.get(topic.toLowerCase()) || null;
        };
        SDADoctrinalGuardrailsService_1.prototype.getAllGuidelines = function () {
            return Array.from(this.guidelines.values());
        };
        SDADoctrinalGuardrailsService_1.prototype.containsSundayWorshipLanguage = function (content) {
            var patterns = [
                /sunday\s+(worship|service|observance)/i,
                /worship\s+on\s+sunday/i,
                /first\s+day.*worship/i,
                /lord'?s\s+day.*worship/i
            ];
            return patterns.some(function (p) { return p.test(content); });
        };
        SDADoctrinalGuardrailsService_1.prototype.containsImmortalSoulLanguage = function (content) {
            var patterns = [
                /immortal\s+soul/i,
                /soul.*never\s+dies/i,
                /soul.*eternal/i,
                /disembodied\s+spirit/i
            ];
            return patterns.some(function (p) { return p.test(content); });
        };
        SDADoctrinalGuardrailsService_1.prototype.containsEternalTormentLanguage = function (content) {
            var patterns = [
                /eternal\s+torment/i,
                /burn.*forever/i,
                /burning.*eternally/i,
                /conscious.*eternal.*suffering/i,
                /hell.*never\s+ends/i
            ];
            return patterns.some(function (p) { return p.test(content); });
        };
        SDADoctrinalGuardrailsService_1.prototype.containsRaptureTheology = function (content) {
            var patterns = [
                /secret\s+rapture/i,
                /rapture.*before.*tribulation/i,
                /pre-?tribulation.*rapture/i
            ];
            return patterns.some(function (p) { return p.test(content); });
        };
        SDADoctrinalGuardrailsService_1.prototype.containsOnceSavedAlwaysSaved = function (content) {
            var patterns = [
                /once\s+saved,?\s+always\s+saved/i,
                /cannot\s+lose.*salvation/i,
                /impossible.*fall\s+away/i
            ];
            return patterns.some(function (p) { return p.test(content); });
        };
        SDADoctrinalGuardrailsService_1.prototype.initializeGuidelines = function () {
            // Sabbath
            this.guidelines.set('sabbath', {
                topic: 'Sabbath',
                sdaPosition: 'The seventh-day Sabbath (Saturday) is the biblical day of worship, instituted at Creation and affirmed in the Ten Commandments',
                avoidPhrasing: [
                    'Sunday worship',
                    'First day of the week as Sabbath',
                    'Lord\'s day (referring to Sunday)',
                    'Christian Sabbath on Sunday'
                ],
                preferredPhrasing: [
                    'Seventh-day Sabbath',
                    'Sabbath (Saturday)',
                    'Biblical Sabbath',
                    'Sabbath rest from Friday sunset to Saturday sunset'
                ],
                keyTexts: ['Genesis 2:2-3', 'Exodus 20:8-11', 'Mark 2:27-28', 'Hebrews 4:9']
            });
            // State of the Dead
            this.guidelines.set('state of the dead', {
                topic: 'State of the Dead',
                sdaPosition: 'The dead are unconscious, awaiting resurrection. Humans do not possess inherent immortality',
                avoidPhrasing: [
                    'Immortal soul',
                    'Soul goes to heaven immediately',
                    'Conscious in death',
                    'Talking to the dead',
                    'Purgatory'
                ],
                preferredPhrasing: [
                    'Soul (meaning the whole person)',
                    'Unconscious in death',
                    'Sleeping in Jesus',
                    'Awaiting resurrection',
                    'Conditional immortality'
                ],
                keyTexts: ['Ecclesiastes 9:5', 'Psalm 146:4', 'John 11:11-14', '1 Thessalonians 4:13-16']
            });
            // Hell and Final Punishment
            this.guidelines.set('hell', {
                topic: 'Hell and Final Punishment',
                sdaPosition: 'The wicked will be destroyed completely (annihilation), not tormented forever',
                avoidPhrasing: [
                    'Eternal torment',
                    'Burning forever',
                    'Conscious eternal suffering',
                    'Hell never ends'
                ],
                preferredPhrasing: [
                    'Eternal destruction',
                    'Final punishment',
                    'Consumed by fire',
                    'Perish completely',
                    'Second death'
                ],
                keyTexts: ['Malachi 4:1-3', 'Matthew 10:28', 'Romans 6:23', 'Revelation 20:14-15']
            });
            // Second Coming
            this.guidelines.set('second coming', {
                topic: 'Second Coming',
                sdaPosition: 'Christ\'s return will be visible, audible, and glorious—not secret',
                avoidPhrasing: [
                    'Secret rapture',
                    'Pre-tribulation rapture',
                    'Secret coming',
                    'Believers disappear secretly'
                ],
                preferredPhrasing: [
                    'Visible return of Christ',
                    'Glorious Second Coming',
                    'Every eye will see Him',
                    'Audible and visible return'
                ],
                keyTexts: ['Matthew 24:27', 'Acts 1:11', '1 Thessalonians 4:16-17', 'Revelation 1:7']
            });
            // Sanctuary and Judgment
            this.guidelines.set('sanctuary', {
                topic: 'Sanctuary and Judgment',
                sdaPosition: 'Christ ministers in the heavenly sanctuary; investigative judgment began in 1844',
                avoidPhrasing: [
                    'No heavenly sanctuary',
                    'Judgment only at Second Coming',
                    'No pre-advent judgment'
                ],
                preferredPhrasing: [
                    'Heavenly sanctuary ministry',
                    'Investigative judgment',
                    'Pre-advent judgment',
                    'Cleansing of sanctuary (Daniel 8:14)'
                ],
                keyTexts: ['Daniel 8:14', 'Hebrews 8:1-2', 'Hebrews 9:23-24', 'Revelation 11:19']
            });
            // Law and Grace
            this.guidelines.set('law', {
                topic: 'Law and Grace',
                sdaPosition: 'The moral law (Ten Commandments) remains binding; salvation is by grace through faith',
                avoidPhrasing: [
                    'Law abolished',
                    'Ten Commandments no longer apply',
                    'Under grace, not law (implying law is void)',
                    'Legalism (when referring to Sabbath keeping)'
                ],
                preferredPhrasing: [
                    'Law reflects God\'s character',
                    'Obedience through grace',
                    'Law and grace work together',
                    'Saved by grace, obey from love'
                ],
                keyTexts: ['Matthew 5:17-19', 'Romans 3:31', 'James 2:10-12', '1 John 5:3']
            });
            // Salvation
            this.guidelines.set('salvation', {
                topic: 'Salvation',
                sdaPosition: 'Salvation is by grace through faith; believers can fall away through persistent rejection',
                avoidPhrasing: [
                    'Once saved, always saved',
                    'Cannot lose salvation',
                    'Impossible to fall away'
                ],
                preferredPhrasing: [
                    'Salvation by grace through faith',
                    'Perseverance of the saints',
                    'Abiding in Christ',
                    'Warnings against apostasy are real'
                ],
                keyTexts: ['Ephesians 2:8-9', 'Hebrews 6:4-6', '2 Peter 2:20-22', 'Revelation 2:10']
            });
            // Spirit of Prophecy
            this.guidelines.set('spirit of prophecy', {
                topic: 'Spirit of Prophecy',
                sdaPosition: 'Ellen G. White\'s writings are inspired counsel, not equal to Scripture but harmonious with it',
                avoidPhrasing: [
                    'EGW replaces the Bible',
                    'EGW is infallible',
                    'Must believe EGW to be saved'
                ],
                preferredPhrasing: [
                    'Spirit of Prophecy as lesser light pointing to greater light (Bible)',
                    'Inspired counsel',
                    'Harmonious with Scripture',
                    'Helpful for understanding biblical truth'
                ],
                keyTexts: ['Revelation 12:17', 'Revelation 19:10', 'Amos 3:7', '1 Thessalonians 5:20-21']
            });
        };
        SDADoctrinalGuardrailsService_1.prototype.applyGuardrailsToPrompt = function (basePrompt, context) {
            var guardrails = "\nDOCTRINAL GUARDRAILS (MUST FOLLOW):\n1. Sabbath: Seventh-day (Saturday) is biblical Sabbath. Never suggest Sunday worship.\n2. State of Dead: Dead are unconscious, awaiting resurrection. No immortal soul doctrine.\n3. Hell: Final punishment is destruction (annihilation), not eternal conscious torment.\n4. Second Coming: Visible and glorious return, not secret rapture.\n5. Sanctuary: Christ ministers in heavenly sanctuary; investigative judgment began 1844.\n6. Law: Ten Commandments remain binding; salvation by grace through faith.\n7. Salvation: By grace through faith; believers can fall away through persistent rejection.\n\nWhen discussing controversial topics, present views neutrally, then clearly state SDA perspective if relevant.\n";
            return "".concat(basePrompt, "\n\n").concat(guardrails, "\n\nContext: ").concat(context);
        };
        return SDADoctrinalGuardrailsService_1;
    }());
    __setFunctionName(_classThis, "SDADoctrinalGuardrailsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SDADoctrinalGuardrailsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SDADoctrinalGuardrailsService = _classThis;
}();
exports.SDADoctrinalGuardrailsService = SDADoctrinalGuardrailsService;
