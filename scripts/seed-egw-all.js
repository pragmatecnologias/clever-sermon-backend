"use strict";
/**
 * Seed All EGW Data
 * Loads all English and Spanish EGW books, paragraphs, and Bible references
 * Run this after schema creation to populate the EGW database
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
var typeorm_1 = require("typeorm");
var dotenv_1 = require("dotenv");
var path = require("path");
var fs = require("fs");
var _1709577500000_CreateEGWTables_1 = require("../src/migrations/1709577500000-CreateEGWTables");
var _1709577600000_CreateEGWScriptureReferences_1 = require("../src/migrations/1709577600000-CreateEGWScriptureReferences");
(0, dotenv_1.config)({ path: path.join(__dirname, '../.env'), override: true });
var databaseUrl = process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/';
var databaseName = process.env.DATABASE_NAME || 'clever_sermon';
var dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: databaseUrl,
    database: databaseName,
    synchronize: false,
    logging: false,
});
function tableExists(tableName) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, dataSource.query("SELECT EXISTS (\n      SELECT 1\n      FROM information_schema.tables\n      WHERE table_schema = 'public' AND table_name = $1\n    ) AS exists", [tableName])];
                case 1:
                    rows = _b.sent();
                    return [2 /*return*/, Boolean((_a = rows === null || rows === void 0 ? void 0 : rows[0]) === null || _a === void 0 ? void 0 : _a.exists)];
            }
        });
    });
}
function seedAllEGW() {
    return __awaiter(this, void 0, void 0, function () {
        var englishMetadataPath, spanishMetadataPath, englishParagraphsPath, spanishParagraphsPath, englishRefsPath, spanishRefsPath, requiredFiles, _i, requiredFiles_1, file, queryRunner, booksExists, paragraphsExists, refsExists, englishMetadata, englishBookMap, _a, _b, book, _c, _d, book, spanishMetadata, spanishBookMap, _e, _f, book, _g, _h, book, englishParagraphs, count, _j, englishParagraphs_1, para, spanishParagraphs, _k, spanishParagraphs_1, para, englishParas, spanishParas, englishParaMap, _l, englishParas_1, para, spanishParaMap, _m, spanishParas_1, para, englishRefs, _o, englishRefs_1, para, paragraphId, _p, _q, ref, spanishRefs, _r, spanishRefs_1, para, paragraphId, _s, _t, ref, totalBooks, totalParas, totalRefs;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    console.log('\n' + '='.repeat(60));
                    console.log('📚 SEEDING ALL EGW DATA');
                    console.log('='.repeat(60) + '\n');
                    englishMetadataPath = path.join(__dirname, '../data/egw-books/metadata-english.json');
                    spanishMetadataPath = path.join(__dirname, '../data/egw-books/metadata-spanish.json');
                    englishParagraphsPath = path.join(__dirname, '../data/egw-parsed-english/paragraphs.json');
                    spanishParagraphsPath = path.join(__dirname, '../data/egw-parsed-spanish/paragraphs.json');
                    englishRefsPath = path.join(__dirname, '../data/egw-parsed-english/paragraphs-with-references.json');
                    spanishRefsPath = path.join(__dirname, '../data/egw-parsed-spanish/paragraphs-with-references.json');
                    requiredFiles = [
                        englishMetadataPath,
                        spanishMetadataPath,
                        englishParagraphsPath,
                        spanishParagraphsPath,
                        englishRefsPath,
                        spanishRefsPath
                    ];
                    for (_i = 0, requiredFiles_1 = requiredFiles; _i < requiredFiles_1.length; _i++) {
                        file = requiredFiles_1[_i];
                        if (!fs.existsSync(file)) {
                            console.error("\u274C Required file not found: ".concat(file));
                            console.error('Please run the parsing scripts first.');
                            process.exit(1);
                        }
                    }
                    console.log('🔌 Connecting to database...');
                    return [4 /*yield*/, dataSource.initialize()];
                case 1:
                    _u.sent();
                    console.log('✅ Connected\n');
                    queryRunner = dataSource.createQueryRunner();
                    return [4 /*yield*/, queryRunner.connect()];
                case 2:
                    _u.sent();
                    _u.label = 3;
                case 3:
                    _u.trys.push([3, , 11, 13]);
                    return [4 /*yield*/, tableExists('egw_books')];
                case 4:
                    booksExists = _u.sent();
                    return [4 /*yield*/, tableExists('egw_paragraphs')];
                case 5:
                    paragraphsExists = _u.sent();
                    return [4 /*yield*/, tableExists('egw_scripture_references')];
                case 6:
                    refsExists = _u.sent();
                    if (!(!booksExists || !paragraphsExists)) return [3 /*break*/, 8];
                    console.log('🧱 EGW tables missing, creating books and paragraphs...');
                    return [4 /*yield*/, new _1709577500000_CreateEGWTables_1.CreateEGWTables1709577500000().up(queryRunner)];
                case 7:
                    _u.sent();
                    console.log('✅ EGW books and paragraphs tables ready\n');
                    _u.label = 8;
                case 8:
                    if (!!refsExists) return [3 /*break*/, 10];
                    console.log('🧱 EGW scripture references missing, creating references table...');
                    return [4 /*yield*/, new _1709577600000_CreateEGWScriptureReferences_1.CreateEGWScriptureReferences1709577600000().up(queryRunner)];
                case 9:
                    _u.sent();
                    console.log('✅ EGW scripture references table ready\n');
                    _u.label = 10;
                case 10: return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, queryRunner.release()];
                case 12:
                    _u.sent();
                    return [7 /*endfinally*/];
                case 13:
                    // Clear existing EGW data to prevent duplicates
                    console.log('🗑️  Clearing existing EGW data...');
                    return [4 /*yield*/, dataSource.query('DELETE FROM egw_scripture_references')];
                case 14:
                    _u.sent();
                    return [4 /*yield*/, dataSource.query('DELETE FROM egw_paragraphs')];
                case 15:
                    _u.sent();
                    return [4 /*yield*/, dataSource.query('DELETE FROM egw_books')];
                case 16:
                    _u.sent();
                    console.log('✅ Cleared\n');
                    // Load English books (deduplicate by code)
                    console.log('📚 Loading English books...');
                    englishMetadata = JSON.parse(fs.readFileSync(englishMetadataPath, 'utf8'));
                    englishBookMap = new Map();
                    for (_a = 0, _b = englishMetadata.books; _a < _b.length; _a++) {
                        book = _b[_a];
                        if (!englishBookMap.has(book.code)) {
                            englishBookMap.set(book.code, book);
                        }
                    }
                    _c = 0, _d = englishBookMap.values();
                    _u.label = 17;
                case 17:
                    if (!(_c < _d.length)) return [3 /*break*/, 20];
                    book = _d[_c];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_books (code, title, category, language)\n       VALUES ($1, $2, $3, $4)", ["en_".concat(book.code), book.title, book.category, 'en'])];
                case 18:
                    _u.sent();
                    _u.label = 19;
                case 19:
                    _c++;
                    return [3 /*break*/, 17];
                case 20:
                    console.log("\u2705 Loaded ".concat(englishBookMap.size, " English books (").concat(englishMetadata.books.length - englishBookMap.size, " duplicates skipped)\n"));
                    // Load Spanish books (deduplicate by code)
                    console.log('📚 Loading Spanish books...');
                    spanishMetadata = JSON.parse(fs.readFileSync(spanishMetadataPath, 'utf8'));
                    spanishBookMap = new Map();
                    for (_e = 0, _f = spanishMetadata.books; _e < _f.length; _e++) {
                        book = _f[_e];
                        if (!spanishBookMap.has(book.code)) {
                            spanishBookMap.set(book.code, book);
                        }
                    }
                    _g = 0, _h = spanishBookMap.values();
                    _u.label = 21;
                case 21:
                    if (!(_g < _h.length)) return [3 /*break*/, 24];
                    book = _h[_g];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_books (code, title, category, language)\n       VALUES ($1, $2, $3, $4)", ["es_".concat(book.code), book.title, book.category, 'es'])];
                case 22:
                    _u.sent();
                    _u.label = 23;
                case 23:
                    _g++;
                    return [3 /*break*/, 21];
                case 24:
                    console.log("\u2705 Loaded ".concat(spanishBookMap.size, " Spanish books (").concat(spanishMetadata.books.length - spanishBookMap.size, " duplicates skipped)\n"));
                    // Load English paragraphs
                    console.log('📝 Loading English paragraphs (this may take a few minutes)...');
                    englishParagraphs = JSON.parse(fs.readFileSync(englishParagraphsPath, 'utf8'));
                    count = 0;
                    _j = 0, englishParagraphs_1 = englishParagraphs;
                    _u.label = 25;
                case 25:
                    if (!(_j < englishParagraphs_1.length)) return [3 /*break*/, 28];
                    para = englishParagraphs_1[_j];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_paragraphs \n       (\"bookCode\", \"bookTitle\", language, \"chapterNumber\", \"chapterTitle\", \"paragraphNumber\", content, reference, \"createdAt\")\n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())", ["en_".concat(para.bookCode), para.bookTitle, 'en', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference])];
                case 26:
                    _u.sent();
                    count++;
                    if (count % 10000 === 0) {
                        console.log("  \u2713 ".concat(count, "/").concat(englishParagraphs.length, "..."));
                    }
                    _u.label = 27;
                case 27:
                    _j++;
                    return [3 /*break*/, 25];
                case 28:
                    console.log("\u2705 Loaded ".concat(englishParagraphs.length, " English paragraphs\n"));
                    // Load Spanish paragraphs
                    console.log('📝 Loading Spanish paragraphs (this may take a few minutes)...');
                    spanishParagraphs = JSON.parse(fs.readFileSync(spanishParagraphsPath, 'utf8'));
                    count = 0;
                    _k = 0, spanishParagraphs_1 = spanishParagraphs;
                    _u.label = 29;
                case 29:
                    if (!(_k < spanishParagraphs_1.length)) return [3 /*break*/, 32];
                    para = spanishParagraphs_1[_k];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_paragraphs \n       (\"bookCode\", \"bookTitle\", language, \"chapterNumber\", \"chapterTitle\", \"paragraphNumber\", content, reference, \"createdAt\")\n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())", ["es_".concat(para.bookCode), para.bookTitle, 'es', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference])];
                case 30:
                    _u.sent();
                    count++;
                    if (count % 10000 === 0) {
                        console.log("  \u2713 ".concat(count, "/").concat(spanishParagraphs.length, "..."));
                    }
                    _u.label = 31;
                case 31:
                    _k++;
                    return [3 /*break*/, 29];
                case 32:
                    console.log("\u2705 Loaded ".concat(spanishParagraphs.length, " Spanish paragraphs\n"));
                    // Build paragraph ID maps
                    console.log('🗗 Building paragraph reference maps...');
                    return [4 /*yield*/, dataSource.query("SELECT id, reference FROM egw_paragraphs WHERE language = 'en'")];
                case 33:
                    englishParas = _u.sent();
                    return [4 /*yield*/, dataSource.query("SELECT id, reference FROM egw_paragraphs WHERE language = 'es'")];
                case 34:
                    spanishParas = _u.sent();
                    englishParaMap = new Map();
                    for (_l = 0, englishParas_1 = englishParas; _l < englishParas_1.length; _l++) {
                        para = englishParas_1[_l];
                        englishParaMap.set(para.reference, para.id);
                    }
                    spanishParaMap = new Map();
                    for (_m = 0, spanishParas_1 = spanishParas; _m < spanishParas_1.length; _m++) {
                        para = spanishParas_1[_m];
                        spanishParaMap.set(para.reference, para.id);
                    }
                    console.log('✅ Maps built\n');
                    // Load English references
                    console.log('🔗 Loading English Bible references...');
                    englishRefs = JSON.parse(fs.readFileSync(englishRefsPath, 'utf8'));
                    count = 0;
                    _o = 0, englishRefs_1 = englishRefs;
                    _u.label = 35;
                case 35:
                    if (!(_o < englishRefs_1.length)) return [3 /*break*/, 41];
                    para = englishRefs_1[_o];
                    paragraphId = englishParaMap.get(para.reference);
                    if (!paragraphId)
                        return [3 /*break*/, 40];
                    _p = 0, _q = para.bibleReferences;
                    _u.label = 36;
                case 36:
                    if (!(_p < _q.length)) return [3 /*break*/, 39];
                    ref = _q[_p];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_scripture_references \n         (\"egwParagraphId\", book, chapter, \"verseStart\", \"verseEnd\", reference, language, \"createdAt\")\n         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())", [paragraphId, ref.book, ref.chapter, ref.verseStart || null, ref.verseEnd || null, ref.reference, 'en'])];
                case 37:
                    _u.sent();
                    count++;
                    _u.label = 38;
                case 38:
                    _p++;
                    return [3 /*break*/, 36];
                case 39:
                    if (count % 5000 === 0) {
                        console.log("  \u2713 ".concat(count, " references..."));
                    }
                    _u.label = 40;
                case 40:
                    _o++;
                    return [3 /*break*/, 35];
                case 41:
                    console.log("\u2705 Loaded ".concat(count, " English Bible references\n"));
                    // Load Spanish references
                    console.log('🔗 Loading Spanish Bible references...');
                    spanishRefs = JSON.parse(fs.readFileSync(spanishRefsPath, 'utf8'));
                    count = 0;
                    _r = 0, spanishRefs_1 = spanishRefs;
                    _u.label = 42;
                case 42:
                    if (!(_r < spanishRefs_1.length)) return [3 /*break*/, 48];
                    para = spanishRefs_1[_r];
                    paragraphId = spanishParaMap.get(para.reference);
                    if (!paragraphId)
                        return [3 /*break*/, 47];
                    _s = 0, _t = para.bibleReferences;
                    _u.label = 43;
                case 43:
                    if (!(_s < _t.length)) return [3 /*break*/, 46];
                    ref = _t[_s];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_scripture_references \n         (\"egwParagraphId\", book, chapter, \"verseStart\", \"verseEnd\", reference, language, \"createdAt\")\n         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())", [paragraphId, ref.book, ref.chapter, ref.verseStart || null, ref.verseEnd || null, ref.reference, 'es'])];
                case 44:
                    _u.sent();
                    count++;
                    _u.label = 45;
                case 45:
                    _s++;
                    return [3 /*break*/, 43];
                case 46:
                    if (count % 5000 === 0) {
                        console.log("  \u2713 ".concat(count, " references..."));
                    }
                    _u.label = 47;
                case 47:
                    _r++;
                    return [3 /*break*/, 42];
                case 48:
                    console.log("\u2705 Loaded ".concat(count, " Spanish Bible references\n"));
                    return [4 /*yield*/, dataSource.query('SELECT COUNT(*) as count FROM egw_books')];
                case 49:
                    totalBooks = _u.sent();
                    return [4 /*yield*/, dataSource.query('SELECT COUNT(*) as count FROM egw_paragraphs')];
                case 50:
                    totalParas = _u.sent();
                    return [4 /*yield*/, dataSource.query('SELECT COUNT(*) as count FROM egw_scripture_references')];
                case 51:
                    totalRefs = _u.sent();
                    console.log('='.repeat(60));
                    console.log('📊 EGW SEEDING COMPLETE');
                    console.log('='.repeat(60));
                    console.log("\uD83D\uDCDA Total books: ".concat(totalBooks[0].count));
                    console.log("\uD83D\uDCDD Total paragraphs: ".concat(totalParas[0].count));
                    console.log("\uD83D\uDD17 Total Bible references: ".concat(totalRefs[0].count));
                    console.log('='.repeat(60) + '\n');
                    return [4 /*yield*/, dataSource.destroy()];
                case 52:
                    _u.sent();
                    return [2 /*return*/];
            }
        });
    });
}
seedAllEGW().catch(function (error) {
    console.error('❌ Error seeding EGW data:', error);
    process.exit(1);
});
