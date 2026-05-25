"use strict";
/**
 * Load All English EGW Data
 * Clears existing English data and loads complete collection
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
(0, dotenv_1.config)({ path: path.join(__dirname, '../.env') });
var databaseUrl = process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/';
var databaseName = process.env.DATABASE_NAME || 'clever_sermon';
var urlMatch = databaseUrl.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)/);
if (!urlMatch) {
    throw new Error('Invalid DATABASE_URL format');
}
var username = urlMatch[1], password = urlMatch[2], host = urlMatch[3], port = urlMatch[4];
var dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: host,
    port: parseInt(port),
    username: username,
    password: password,
    database: databaseName,
    synchronize: false,
    logging: false,
});
function loadAllEnglishData() {
    return __awaiter(this, void 0, void 0, function () {
        var metadataPath, paragraphsPath, metadata, paragraphs, booksLoaded, _i, _a, book, parasLoaded, batchSize, i, batch, _b, batch_1, para, totalBooks, totalParas;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    metadataPath = path.join(__dirname, '../data/egw-books/metadata-english.json');
                    paragraphsPath = path.join(__dirname, '../data/egw-parsed-english/paragraphs.json');
                    if (!fs.existsSync(metadataPath) || !fs.existsSync(paragraphsPath)) {
                        console.error('❌ Required files not found');
                        process.exit(1);
                    }
                    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                    paragraphs = JSON.parse(fs.readFileSync(paragraphsPath, 'utf8'));
                    console.log('🔌 Connecting to database...');
                    return [4 /*yield*/, dataSource.initialize()];
                case 1:
                    _c.sent();
                    console.log('✅ Database connected\n');
                    // Clear existing English data
                    console.log('🗑️  Clearing existing English EGW data...');
                    return [4 /*yield*/, dataSource.query("DELETE FROM egw_scripture_references WHERE language = 'en'")];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, dataSource.query("DELETE FROM egw_paragraphs WHERE language = 'en'")];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, dataSource.query("DELETE FROM egw_books WHERE language = 'en'")];
                case 4:
                    _c.sent();
                    console.log('✅ Cleared existing English data\n');
                    // Load books
                    console.log("\uD83D\uDCDA Loading ".concat(metadata.books.length, " English books..."));
                    booksLoaded = 0;
                    _i = 0, _a = metadata.books;
                    _c.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    book = _a[_i];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_books (code, title, category, language)\n       VALUES ($1, $2, $3, $4)", ["en_".concat(book.code), book.title, book.category, 'en'])];
                case 6:
                    _c.sent();
                    booksLoaded++;
                    if (booksLoaded % 20 === 0) {
                        console.log("  \u2713 Loaded ".concat(booksLoaded, "/").concat(metadata.books.length, " books..."));
                    }
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("\u2705 Loaded ".concat(booksLoaded, " English books\n"));
                    // Load paragraphs
                    console.log("\uD83D\uDCDD Loading ".concat(paragraphs.length, " English paragraphs..."));
                    parasLoaded = 0;
                    batchSize = 500;
                    i = 0;
                    _c.label = 9;
                case 9:
                    if (!(i < paragraphs.length)) return [3 /*break*/, 15];
                    batch = paragraphs.slice(i, i + batchSize);
                    _b = 0, batch_1 = batch;
                    _c.label = 10;
                case 10:
                    if (!(_b < batch_1.length)) return [3 /*break*/, 13];
                    para = batch_1[_b];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_paragraphs \n         (\"bookCode\", \"bookTitle\", language, \"chapterNumber\", \"chapterTitle\", \"paragraphNumber\", content, reference, \"createdAt\")\n         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())", ["en_".concat(para.bookCode), para.bookTitle, 'en', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference])];
                case 11:
                    _c.sent();
                    parasLoaded++;
                    _c.label = 12;
                case 12:
                    _b++;
                    return [3 /*break*/, 10];
                case 13:
                    console.log("  \u2713 Loaded ".concat(parasLoaded, "/").concat(paragraphs.length, " paragraphs..."));
                    _c.label = 14;
                case 14:
                    i += batchSize;
                    return [3 /*break*/, 9];
                case 15:
                    console.log('\n' + '='.repeat(60));
                    console.log('📊 English Data Load Complete');
                    console.log('='.repeat(60));
                    console.log("\u2705 Books loaded: ".concat(booksLoaded));
                    console.log("\u2705 Paragraphs loaded: ".concat(parasLoaded));
                    return [4 /*yield*/, dataSource.query('SELECT COUNT(*) as count FROM egw_books')];
                case 16:
                    totalBooks = _c.sent();
                    return [4 /*yield*/, dataSource.query('SELECT COUNT(*) as count FROM egw_paragraphs')];
                case 17:
                    totalParas = _c.sent();
                    console.log("\n\uD83D\uDCCA Total in database:");
                    console.log("   Books: ".concat(totalBooks[0].count));
                    console.log("   Paragraphs: ".concat(totalParas[0].count));
                    console.log('='.repeat(60));
                    return [4 /*yield*/, dataSource.destroy()];
                case 18:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
loadAllEnglishData().catch(console.error);
