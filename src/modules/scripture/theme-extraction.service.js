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
exports.ThemeExtractionService = void 0;
var common_1 = require("@nestjs/common");
var ThemeExtractionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ThemeExtractionService = _classThis = /** @class */ (function () {
        function ThemeExtractionService_1() {
            this.stopWords = new Set([
                'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
                'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                'would', 'shall', 'should', 'may', 'might', 'can', 'could', 'that',
                'this', 'these', 'those', 'he', 'she', 'it', 'they', 'them', 'their',
                'his', 'her', 'its', 'who', 'whom', 'which', 'what', 'when', 'where',
                'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
                'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
                'so', 'than', 'too', 'very', 'said', 'says', 'unto', 'thee', 'thou',
                'thy', 'thine', 'ye'
            ]);
            this.covenantTerms = {
                covenant: ['covenant', 'testament', 'promise', 'oath', 'seal', 'sign'],
                kingdom: ['kingdom', 'king', 'throne', 'reign', 'rule', 'dominion', 'authority'],
                sanctuary: ['sanctuary', 'temple', 'tabernacle', 'altar', 'holy', 'priest', 'sacrifice', 'offering', 'blood', 'veil', 'ark']
            };
        }
        ThemeExtractionService_1.prototype.extractThemes = function (verses) {
            var _this = this;
            var wordFrequency = new Map();
            var verbFrequency = new Map();
            // Count word frequencies
            verses.forEach(function (verse) {
                var words = _this.tokenize(verse.text);
                var uniqueWords = new Set(words);
                uniqueWords.forEach(function (word) {
                    if (_this.stopWords.has(word) || word.length < 3)
                        return;
                    var isVerb = _this.isLikelyVerb(word);
                    var map = isVerb ? verbFrequency : wordFrequency;
                    if (!map.has(word)) {
                        map.set(word, { count: 0, verses: new Set() });
                    }
                    var entry = map.get(word);
                    entry.count += words.filter(function (w) { return w === word; }).length;
                    entry.verses.add(verse.reference);
                });
            });
            // Convert to theme clusters
            var themes = [];
            // Add noun themes
            wordFrequency.forEach(function (data, word) {
                if (data.count >= 2) {
                    themes.push({
                        theme: word,
                        words: [word],
                        frequency: data.count,
                        verses: Array.from(data.verses),
                        type: 'noun'
                    });
                }
            });
            // Add verb themes
            verbFrequency.forEach(function (data, word) {
                if (data.count >= 2) {
                    themes.push({
                        theme: word,
                        words: [word],
                        frequency: data.count,
                        verses: Array.from(data.verses),
                        type: 'verb'
                    });
                }
            });
            // Detect concept clusters (e.g., "vine, fruit, abide" in John 15)
            var conceptClusters = this.detectConceptClusters(verses);
            themes.push.apply(themes, conceptClusters);
            // Sort by frequency
            return themes.sort(function (a, b) { return b.frequency - a.frequency; });
        };
        ThemeExtractionService_1.prototype.extractCovenantThreads = function (verses) {
            var threads = [];
            // Check for covenant language
            var covenantRefs = this.findThreadReferences(verses, this.covenantTerms.covenant);
            if (covenantRefs.length > 0) {
                threads.push({
                    type: 'covenant',
                    references: covenantRefs
                });
            }
            // Check for kingdom language
            var kingdomRefs = this.findThreadReferences(verses, this.covenantTerms.kingdom);
            if (kingdomRefs.length > 0) {
                threads.push({
                    type: 'kingdom',
                    references: kingdomRefs
                });
            }
            // Check for sanctuary language
            var sanctuaryRefs = this.findThreadReferences(verses, this.covenantTerms.sanctuary);
            if (sanctuaryRefs.length > 0) {
                threads.push({
                    type: 'sanctuary',
                    references: sanctuaryRefs
                });
            }
            return threads;
        };
        ThemeExtractionService_1.prototype.findThreadReferences = function (verses, terms) {
            var _this = this;
            var references = [];
            verses.forEach(function (verse) {
                var lowerText = verse.text.toLowerCase();
                terms.forEach(function (term) {
                    if (lowerText.includes(term)) {
                        // Extract phrase containing the term (context window)
                        var words = verse.text.split(/\s+/);
                        var termIndex = words.findIndex(function (w) { return w.toLowerCase().includes(term); });
                        if (termIndex >= 0) {
                            var start = Math.max(0, termIndex - 3);
                            var end = Math.min(words.length, termIndex + 4);
                            var phrase = words.slice(start, end).join(' ');
                            references.push({
                                verse: verse.reference,
                                phrase: phrase,
                                significance: _this.getSignificance(term)
                            });
                        }
                    }
                });
            });
            return references;
        };
        ThemeExtractionService_1.prototype.getSignificance = function (term) {
            var significance = {
                'covenant': 'Divine agreement or promise',
                'testament': 'Covenant witness or will',
                'kingdom': 'Divine rule and authority',
                'sanctuary': 'Holy dwelling place of God',
                'priest': 'Mediator between God and people',
                'sacrifice': 'Atonement offering',
                'blood': 'Life and covenant ratification',
                'altar': 'Place of sacrifice and worship'
            };
            return significance[term.toLowerCase()] || 'Significant theological term';
        };
        ThemeExtractionService_1.prototype.detectConceptClusters = function (verses) {
            // Detect known concept clusters
            var clusters = [];
            // John 15 cluster: vine, fruit, abide
            var vineWords = ['vine', 'branch', 'fruit', 'abide', 'remain'];
            var vineCluster = this.findCluster(verses, vineWords, 'vine-abiding');
            if (vineCluster)
                clusters.push(vineCluster);
            // Faith cluster: faith, believe, trust
            var faithWords = ['faith', 'believe', 'trust', 'faithful'];
            var faithCluster = this.findCluster(verses, faithWords, 'faith-belief');
            if (faithCluster)
                clusters.push(faithCluster);
            // Love cluster: love, beloved, charity
            var loveWords = ['love', 'loved', 'beloved', 'charity'];
            var loveCluster = this.findCluster(verses, loveWords, 'love');
            if (loveCluster)
                clusters.push(loveCluster);
            return clusters;
        };
        ThemeExtractionService_1.prototype.findCluster = function (verses, words, themeName) {
            var foundWords = [];
            var foundVerses = new Set();
            var totalCount = 0;
            verses.forEach(function (verse) {
                var lowerText = verse.text.toLowerCase();
                words.forEach(function (word) {
                    if (lowerText.includes(word)) {
                        if (!foundWords.includes(word))
                            foundWords.push(word);
                        foundVerses.add(verse.reference);
                        totalCount++;
                    }
                });
            });
            if (foundWords.length >= 2) {
                return {
                    theme: themeName,
                    words: foundWords,
                    frequency: totalCount,
                    verses: Array.from(foundVerses),
                    type: 'concept'
                };
            }
            return null;
        };
        ThemeExtractionService_1.prototype.tokenize = function (text) {
            return text
                .toLowerCase()
                .replace(/[.,;:!?()[\]{}'"]/g, ' ')
                .split(/\s+/)
                .filter(Boolean);
        };
        ThemeExtractionService_1.prototype.isLikelyVerb = function (word) {
            return /ed$|ing$|s$|en$/.test(word) && word.length > 3;
        };
        return ThemeExtractionService_1;
    }());
    __setFunctionName(_classThis, "ThemeExtractionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ThemeExtractionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ThemeExtractionService = _classThis;
}();
exports.ThemeExtractionService = ThemeExtractionService;
