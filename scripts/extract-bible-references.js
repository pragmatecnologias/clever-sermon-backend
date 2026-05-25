"use strict";
/**
 * Bible Reference Extractor for EGW Paragraphs
 * Extracts and links Bible references from EGW content
 *
 * Usage: npx ts-node scripts/extract-bible-references.ts
 */
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
var BIBLE_BOOKS = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
    'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
    '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
    'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
    'Jude', 'Revelation'
];
var SPANISH_BIBLE_BOOKS = [
    'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
    'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
    '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester',
    'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
    'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel',
    'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm',
    'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
    'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos',
    '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios',
    'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses',
    '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos',
    'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan',
    'Judas', 'Apocalipsis'
];
function extractBibleReferences(text, language) {
    var references = [];
    var books = language === 'es' ? SPANISH_BIBLE_BOOKS : BIBLE_BOOKS;
    // Build regex pattern for book names
    var bookPattern = books.join('|');
    // Pattern: Book Chapter:Verse or Book Chapter:Verse-Verse
    var refPattern = new RegExp("(".concat(bookPattern, ")\\s+(\\d+)(?::(\\d+)(?:-(\\d+))?)?"), 'gi');
    var match;
    while ((match = refPattern.exec(text)) !== null) {
        var book = match[1];
        var chapter = parseInt(match[2]);
        var verseStart = match[3] ? parseInt(match[3]) : undefined;
        var verseEnd = match[4] ? parseInt(match[4]) : undefined;
        var reference = "".concat(book, " ").concat(chapter);
        if (verseStart) {
            reference += ":".concat(verseStart);
            if (verseEnd) {
                reference += "-".concat(verseEnd);
            }
        }
        references.push({
            book: book,
            chapter: chapter,
            verseStart: verseStart,
            verseEnd: verseEnd,
            reference: reference
        });
    }
    return references;
}
function processParagraphs() {
    return __awaiter(this, void 0, void 0, function () {
        var PARSED_DIR, OUTPUT_FILE, paragraphsFile, paragraphs, paragraphsWithRefs, totalReferences, paragraphsWithReferences, i, para, language, bibleReferences;
        return __generator(this, function (_a) {
            PARSED_DIR = path.join(__dirname, '../data/egw-parsed');
            OUTPUT_FILE = path.join(PARSED_DIR, 'paragraphs-with-references.json');
            paragraphsFile = path.join(PARSED_DIR, 'paragraphs.json');
            if (!fs.existsSync(paragraphsFile)) {
                console.error('❌ Paragraphs file not found. Run parse-egw-books.ts first.');
                return [2 /*return*/];
            }
            console.log('📖 Loading EGW paragraphs...');
            paragraphs = JSON.parse(fs.readFileSync(paragraphsFile, 'utf8'));
            console.log("\uD83D\uDCDD Processing ".concat(paragraphs.length, " paragraphs...\n"));
            paragraphsWithRefs = [];
            totalReferences = 0;
            paragraphsWithReferences = 0;
            for (i = 0; i < paragraphs.length; i++) {
                para = paragraphs[i];
                language = para.bookCode.startsWith('es_') ? 'es' : 'en';
                bibleReferences = extractBibleReferences(para.content, language);
                if (bibleReferences.length > 0) {
                    paragraphsWithReferences++;
                    totalReferences += bibleReferences.length;
                }
                paragraphsWithRefs.push({
                    id: "egw-para-".concat(i),
                    bookCode: para.bookCode,
                    bookTitle: para.bookTitle,
                    language: language,
                    chapterNumber: para.chapterNumber,
                    paragraphNumber: para.paragraphNumber,
                    content: para.content,
                    reference: para.reference,
                    bibleReferences: bibleReferences
                });
                if ((i + 1) % 500 === 0) {
                    console.log("\u2705 Processed ".concat(i + 1, "/").concat(paragraphs.length, " paragraphs..."));
                }
            }
            // Save results
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(paragraphsWithRefs, null, 2));
            console.log('\n' + '='.repeat(60));
            console.log('📊 Bible Reference Extraction Summary');
            console.log('='.repeat(60));
            console.log("\uD83D\uDCDD Total paragraphs processed: ".concat(paragraphs.length));
            console.log("\uD83D\uDCD6 Paragraphs with Bible references: ".concat(paragraphsWithReferences));
            console.log("\uD83D\uDD17 Total Bible references found: ".concat(totalReferences));
            console.log("\uD83D\uDCC8 Average references per paragraph: ".concat((totalReferences / paragraphsWithReferences).toFixed(2)));
            console.log("\n\uD83D\uDCC4 Output saved to: ".concat(OUTPUT_FILE));
            console.log('='.repeat(60));
            return [2 /*return*/];
        });
    });
}
processParagraphs().catch(console.error);
