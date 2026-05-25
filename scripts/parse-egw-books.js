"use strict";
/**
 * EGW Book Parser
 * Parses EPUB files and extracts content into searchable database format
 *
 * Usage: npx ts-node scripts/parse-egw-books.ts
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
var xml2js = require('xml2js');
var DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
var OUTPUT_DIR = path.join(__dirname, '../data/egw-parsed');
function parseXML(xml) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    xml2js.parseString(xml, function (err, result) {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                })];
        });
    });
}
function extractTextFromHTML(html) {
    // Remove HTML tags
    var text = html.replace(/<[^>]*>/g, ' ');
    // Decode HTML entities
    text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    return text;
}
function parseEPUB(filepath, bookCode, bookTitle) {
    return __awaiter(this, void 0, void 0, function () {
        var chapters, zip, zipEntries, contentFiles, chapterNumber, _i, contentFiles_1, entry, content, text, titleMatch, chapterTitle, paragraphs;
        return __generator(this, function (_a) {
            chapters = [];
            try {
                zip = new AdmZip(filepath);
                zipEntries = zip.getEntries();
                contentFiles = zipEntries.filter(function (entry) {
                    return entry.entryName.endsWith('.html') || entry.entryName.endsWith('.xhtml');
                });
                chapterNumber = 0;
                for (_i = 0, contentFiles_1 = contentFiles; _i < contentFiles_1.length; _i++) {
                    entry = contentFiles_1[_i];
                    // Skip navigation and cover files
                    if (entry.entryName.includes('nav') ||
                        entry.entryName.includes('cover') ||
                        entry.entryName.includes('toc')) {
                        continue;
                    }
                    content = entry.getData().toString('utf8');
                    text = extractTextFromHTML(content);
                    // Skip very short content (likely not a chapter)
                    if (text.length < 100)
                        continue;
                    chapterNumber++;
                    titleMatch = content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
                    chapterTitle = titleMatch ? extractTextFromHTML(titleMatch[1]) : "Chapter ".concat(chapterNumber);
                    paragraphs = text
                        .split(/\n\n+/)
                        .map(function (p) { return p.trim(); })
                        .filter(function (p) { return p.length > 20; });
                    chapters.push({
                        bookCode: bookCode,
                        bookTitle: bookTitle,
                        chapterNumber: chapterNumber,
                        chapterTitle: chapterTitle,
                        content: text,
                        paragraphs: paragraphs
                    });
                }
                return [2 /*return*/, chapters];
            }
            catch (error) {
                console.error("Error parsing ".concat(bookCode, ":"), error.message);
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
function generateParagraphReference(bookCode, chapterNumber, paragraphNumber) {
    return "".concat(bookCode, " ").concat(chapterNumber, ".").concat(paragraphNumber);
}
function parseAllBooks() {
    return __awaiter(this, void 0, void 0, function () {
        var metadataPath, metadata, books, allChapters, allParagraphs, i, book, filepath, chapters, chaptersFile, paragraphsFile, indexFile, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync(OUTPUT_DIR)) {
                        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
                    }
                    metadataPath = path.join(DOWNLOAD_DIR, 'metadata-bilingual.json');
                    if (!fs.existsSync(metadataPath)) {
                        console.error('❌ Metadata file not found. Run download script first.');
                        return [2 /*return*/];
                    }
                    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                    books = metadata.books;
                    console.log("\uD83D\uDCD6 Parsing ".concat(books.length, " EGW books...\n"));
                    allChapters = [];
                    allParagraphs = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < books.length)) return [3 /*break*/, 4];
                    book = books[i];
                    filepath = path.join(DOWNLOAD_DIR, "".concat(book.code, ".epub"));
                    if (!fs.existsSync(filepath)) {
                        console.log("\u23ED\uFE0F  [".concat(i + 1, "/").concat(books.length, "] Skipping ").concat(book.code, " - file not found"));
                        return [3 /*break*/, 3];
                    }
                    console.log("\uD83D\uDCD6 [".concat(i + 1, "/").concat(books.length, "] Parsing ").concat(book.code, ": ").concat(book.title, "..."));
                    return [4 /*yield*/, parseEPUB(filepath, book.code, book.title)];
                case 2:
                    chapters = _a.sent();
                    // Generate paragraph-level data
                    chapters.forEach(function (chapter) {
                        chapter.paragraphs.forEach(function (para, idx) {
                            allParagraphs.push({
                                bookCode: chapter.bookCode,
                                bookTitle: chapter.bookTitle,
                                chapterNumber: chapter.chapterNumber,
                                chapterTitle: chapter.chapterTitle,
                                paragraphNumber: idx + 1,
                                content: para,
                                reference: generateParagraphReference(chapter.bookCode, chapter.chapterNumber, idx + 1)
                            });
                        });
                    });
                    allChapters.push.apply(allChapters, chapters);
                    console.log("\u2705 Parsed ".concat(chapters.length, " chapters from ").concat(book.code));
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    chaptersFile = path.join(OUTPUT_DIR, 'chapters.json');
                    paragraphsFile = path.join(OUTPUT_DIR, 'paragraphs.json');
                    indexFile = path.join(OUTPUT_DIR, 'index.json');
                    fs.writeFileSync(chaptersFile, JSON.stringify(allChapters, null, 2));
                    fs.writeFileSync(paragraphsFile, JSON.stringify(allParagraphs, null, 2));
                    index = {
                        totalBooks: books.length,
                        totalChapters: allChapters.length,
                        totalParagraphs: allParagraphs.length,
                        books: books.map(function (book) { return ({
                            code: book.code,
                            title: book.title,
                            category: book.category,
                            chapters: allChapters.filter(function (c) { return c.bookCode === book.code; }).length,
                            paragraphs: allParagraphs.filter(function (p) { return p.bookCode === book.code; }).length
                        }); })
                    };
                    fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
                    console.log('\n' + '='.repeat(60));
                    console.log('📊 Parsing Summary');
                    console.log('='.repeat(60));
                    console.log("\uD83D\uDCDA Total books processed: ".concat(books.length));
                    console.log("\uD83D\uDCD6 Total chapters extracted: ".concat(allChapters.length));
                    console.log("\uD83D\uDCDD Total paragraphs extracted: ".concat(allParagraphs.length));
                    console.log("\n\uD83D\uDCC1 Output files:");
                    console.log("   - ".concat(chaptersFile));
                    console.log("   - ".concat(paragraphsFile));
                    console.log("   - ".concat(indexFile));
                    console.log('='.repeat(60));
                    return [2 /*return*/];
            }
        });
    });
}
parseAllBooks().catch(console.error);
