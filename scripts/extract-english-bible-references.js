"use strict";
/**
 * Extract English Bible References
 * Extracts Bible references from English EGW paragraphs
 */
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
var fs = require("fs");
var path = require("path");
var INPUT_FILE = path.join(__dirname, '../data/egw-parsed-english/paragraphs.json');
var OUTPUT_FILE = path.join(__dirname, '../data/egw-parsed-english/paragraphs-with-references.json');
// English Bible book names
var BIBLE_BOOKS = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Psalm',
    'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
    'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
    'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
    '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
    'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];
function extractBibleReferences(text) {
    var references = [];
    var pattern = new RegExp("(".concat(BIBLE_BOOKS.join('|'), ")\\s+(\\d+)(?::(\\d+)(?:[-\u2013](\\d+))?)?"), 'gi');
    var match;
    while ((match = pattern.exec(text)) !== null) {
        var book = match[1];
        var chapter = parseInt(match[2]);
        var verseStart = match[3] ? parseInt(match[3]) : undefined;
        var verseEnd = match[4] ? parseInt(match[4]) : undefined;
        references.push({
            book: book,
            chapter: chapter,
            verseStart: verseStart,
            verseEnd: verseEnd,
            reference: match[0]
        });
    }
    return references;
}
function extractAllReferences() {
    return __awaiter(this, void 0, void 0, function () {
        var paragraphs, paragraphsWithRefs, totalRefs, parasWithRefs, i, para, refs;
        return __generator(this, function (_a) {
            console.log('📖 Loading English EGW paragraphs...');
            paragraphs = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
            console.log("\uD83D\uDCDD Processing ".concat(paragraphs.length, " paragraphs...\n"));
            paragraphsWithRefs = [];
            totalRefs = 0;
            parasWithRefs = 0;
            for (i = 0; i < paragraphs.length; i++) {
                para = paragraphs[i];
                refs = extractBibleReferences(para.content);
                if (refs.length > 0) {
                    paragraphsWithRefs.push(__assign(__assign({}, para), { bibleReferences: refs }));
                    totalRefs += refs.length;
                    parasWithRefs++;
                }
                if ((i + 1) % 10000 === 0) {
                    console.log("\u2705 Processed ".concat(i + 1, "/").concat(paragraphs.length, " paragraphs..."));
                }
            }
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(paragraphsWithRefs, null, 2));
            console.log('\n' + '='.repeat(60));
            console.log('📊 English Bible Reference Extraction Summary');
            console.log('='.repeat(60));
            console.log("\uD83D\uDCDD Total paragraphs processed: ".concat(paragraphs.length));
            console.log("\uD83D\uDCD6 Paragraphs with Bible references: ".concat(parasWithRefs));
            console.log("\uD83D\uDD17 Total Bible references found: ".concat(totalRefs));
            console.log("\uD83D\uDCC8 Average references per paragraph: ".concat((totalRefs / parasWithRefs).toFixed(2)));
            console.log("\n\uD83D\uDCC4 Output saved to: ".concat(OUTPUT_FILE));
            console.log('='.repeat(60));
            return [2 /*return*/];
        });
    });
}
extractAllReferences().catch(console.error);
