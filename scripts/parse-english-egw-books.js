"use strict";
/**
 * Parse English EGW Books
 * Parses all English EPUB files and extracts content
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
var AdmZip = require('adm-zip');
var DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
var OUTPUT_DIR = path.join(__dirname, '../data/egw-parsed-english');
var METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata-english.json');
function parseEpubFile(filepath, bookCode, bookTitle) {
    return __awaiter(this, void 0, void 0, function () {
        var zip, zipEntries, chapters, chapterNumber, _i, zipEntries_1, entry, content, match, text, titleMatch, chapterTitle;
        return __generator(this, function (_a) {
            try {
                zip = new AdmZip(filepath);
                zipEntries = zip.getEntries();
                chapters = [];
                chapterNumber = 0;
                for (_i = 0, zipEntries_1 = zipEntries; _i < zipEntries_1.length; _i++) {
                    entry = zipEntries_1[_i];
                    if (entry.entryName.endsWith('.xhtml') || entry.entryName.endsWith('.html')) {
                        content = entry.getData().toString('utf8');
                        match = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                        if (!match)
                            continue;
                        text = match[1]
                            .replace(/<script[\s\S]*?<\/script>/gi, '')
                            .replace(/<style[\s\S]*?<\/style>/gi, '')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/&nbsp;/g, ' ')
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/\s+/g, ' ')
                            .trim();
                        if (text.length > 100) {
                            chapterNumber++;
                            titleMatch = text.match(/^(.{1,100}?)(?:\.|$)/);
                            chapterTitle = titleMatch ? titleMatch[1].trim() : "Chapter ".concat(chapterNumber);
                            chapters.push({
                                bookCode: bookCode,
                                bookTitle: bookTitle,
                                chapterNumber: chapterNumber,
                                chapterTitle: chapterTitle,
                                content: text
                            });
                        }
                    }
                }
                return [2 /*return*/, chapters];
            }
            catch (error) {
                throw new Error("Failed to parse EPUB: ".concat(error.message));
            }
            return [2 /*return*/];
        });
    });
}
function splitIntoParagraphs(chapter) {
    var sentences = chapter.content.split(/(?<=[.!?])\s+/);
    var paragraphs = [];
    var currentParagraph = '';
    var paragraphNumber = 0;
    for (var _i = 0, sentences_1 = sentences; _i < sentences_1.length; _i++) {
        var sentence = sentences_1[_i];
        if (currentParagraph.length + sentence.length > 500 ||
            (currentParagraph.length > 200 && sentence.match(/^[A-Z]/))) {
            if (currentParagraph.trim()) {
                paragraphNumber++;
                paragraphs.push({
                    bookCode: chapter.bookCode,
                    bookTitle: chapter.bookTitle,
                    chapterNumber: chapter.chapterNumber,
                    chapterTitle: chapter.chapterTitle,
                    paragraphNumber: paragraphNumber,
                    content: currentParagraph.trim(),
                    reference: "en_".concat(chapter.bookCode, " ").concat(chapter.chapterNumber, ".").concat(paragraphNumber)
                });
            }
            currentParagraph = sentence;
        }
        else {
            currentParagraph += ' ' + sentence;
        }
    }
    if (currentParagraph.trim()) {
        paragraphNumber++;
        paragraphs.push({
            bookCode: chapter.bookCode,
            bookTitle: chapter.bookTitle,
            chapterNumber: chapter.chapterNumber,
            chapterTitle: chapter.chapterTitle,
            paragraphNumber: paragraphNumber,
            content: currentParagraph.trim(),
            reference: "en_".concat(chapter.bookCode, " ").concat(chapter.chapterNumber, ".").concat(paragraphNumber)
        });
    }
    return paragraphs;
}
function parseAllEnglishBooks() {
    return __awaiter(this, void 0, void 0, function () {
        var metadata, books, allChapters, allParagraphs, successCount, failCount, i, book, filepath, chapters, _i, chapters_1, chapter, paragraphs, error_1, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync(OUTPUT_DIR)) {
                        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
                    }
                    if (!fs.existsSync(METADATA_FILE)) {
                        console.error('❌ English metadata file not found. Run create-english-metadata.ts first.');
                        return [2 /*return*/];
                    }
                    metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
                    books = metadata.books;
                    console.log("\uD83D\uDCD6 Parsing ".concat(books.length, " English EGW books...\n"));
                    allChapters = [];
                    allParagraphs = [];
                    successCount = 0;
                    failCount = 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < books.length)) return [3 /*break*/, 6];
                    book = books[i];
                    filepath = path.join(DOWNLOAD_DIR, book.filename);
                    if (!fs.existsSync(filepath)) {
                        console.log("\u23ED\uFE0F  [".concat(i + 1, "/").concat(books.length, "] Skipping ").concat(book.code, " - file not found"));
                        failCount++;
                        return [3 /*break*/, 5];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log("\uD83D\uDCD6 [".concat(i + 1, "/").concat(books.length, "] Parsing ").concat(book.code, ": ").concat(book.title, "..."));
                    return [4 /*yield*/, parseEpubFile(filepath, book.code, book.title)];
                case 3:
                    chapters = _a.sent();
                    if (chapters.length === 0) {
                        console.log("\u26A0\uFE0F  No chapters found in ".concat(book.code));
                        failCount++;
                        return [3 /*break*/, 5];
                    }
                    allChapters.push.apply(allChapters, chapters);
                    for (_i = 0, chapters_1 = chapters; _i < chapters_1.length; _i++) {
                        chapter = chapters_1[_i];
                        paragraphs = splitIntoParagraphs(chapter);
                        allParagraphs.push.apply(allParagraphs, paragraphs);
                    }
                    console.log("\u2705 Parsed ".concat(chapters.length, " chapters from ").concat(book.code));
                    successCount++;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("\u274C Error parsing ".concat(book.code, ": ").concat(error_1.message));
                    failCount++;
                    return [3 /*break*/, 5];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6:
                    fs.writeFileSync(path.join(OUTPUT_DIR, 'chapters.json'), JSON.stringify(allChapters, null, 2));
                    fs.writeFileSync(path.join(OUTPUT_DIR, 'paragraphs.json'), JSON.stringify(allParagraphs, null, 2));
                    index = {
                        totalBooks: successCount,
                        totalChapters: allChapters.length,
                        totalParagraphs: allParagraphs.length,
                        language: 'en',
                        parsedDate: new Date().toISOString()
                    };
                    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.json'), JSON.stringify(index, null, 2));
                    console.log('\n' + '='.repeat(60));
                    console.log('📊 English Parsing Summary');
                    console.log('='.repeat(60));
                    console.log("\u2705 Successfully parsed: ".concat(successCount, " books"));
                    console.log("\u274C Failed: ".concat(failCount, " books"));
                    console.log("\uD83D\uDCD6 Total chapters extracted: ".concat(allChapters.length));
                    console.log("\uD83D\uDCDD Total paragraphs extracted: ".concat(allParagraphs.length));
                    console.log("\n\uD83D\uDCC1 Output files:");
                    console.log("   - ".concat(path.join(OUTPUT_DIR, 'chapters.json')));
                    console.log("   - ".concat(path.join(OUTPUT_DIR, 'paragraphs.json')));
                    console.log("   - ".concat(path.join(OUTPUT_DIR, 'index.json')));
                    console.log('='.repeat(60));
                    return [2 /*return*/];
            }
        });
    });
}
parseAllEnglishBooks().catch(console.error);
