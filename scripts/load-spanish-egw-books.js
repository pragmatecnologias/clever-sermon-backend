"use strict";
/**
 * Load Spanish EGW Books Metadata
 * Loads Spanish book metadata into the database
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
function loadSpanishBooks() {
    return __awaiter(this, void 0, void 0, function () {
        var metadataPath, metadata, books, loaded, skipped, _i, books_1, book, bookCode, existing, totalCount, spanishCount, englishCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    metadataPath = path.join(__dirname, '../data/egw-books/metadata-spanish.json');
                    if (!fs.existsSync(metadataPath)) {
                        console.error('❌ Spanish metadata file not found');
                        process.exit(1);
                    }
                    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                    books = metadata.books;
                    console.log('📚 Loading Spanish EGW book metadata into database...\n');
                    return [4 /*yield*/, dataSource.initialize()];
                case 1:
                    _a.sent();
                    console.log('✅ Database connection established\n');
                    // Don't clear existing books - we want to keep English books
                    console.log('📝 Loading Spanish books alongside English books...\n');
                    loaded = 0;
                    skipped = 0;
                    _i = 0, books_1 = books;
                    _a.label = 2;
                case 2:
                    if (!(_i < books_1.length)) return [3 /*break*/, 9];
                    book = books_1[_i];
                    bookCode = "es_".concat(book.code);
                    return [4 /*yield*/, dataSource.query("SELECT id FROM egw_books WHERE code = $1", [bookCode])];
                case 3:
                    existing = _a.sent();
                    if (!(existing.length > 0)) return [3 /*break*/, 5];
                    // Update existing book
                    return [4 /*yield*/, dataSource.query("UPDATE egw_books SET title = $1, category = $2, language = $3 WHERE code = $4", [book.title, book.category, book.language, bookCode])];
                case 4:
                    // Update existing book
                    _a.sent();
                    skipped++;
                    return [3 /*break*/, 7];
                case 5: 
                // Insert new book
                return [4 /*yield*/, dataSource.query("INSERT INTO egw_books (code, title, category, language)\n         VALUES ($1, $2, $3, $4)", [bookCode, book.title, book.category, book.language])];
                case 6:
                    // Insert new book
                    _a.sent();
                    loaded++;
                    _a.label = 7;
                case 7:
                    if ((loaded + skipped) % 10 === 0) {
                        console.log("  \u2713 Processed ".concat(loaded + skipped, "/").concat(books.length, " books..."));
                    }
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9:
                    console.log("\n\u2705 Successfully processed ".concat(books.length, " Spanish EGW books"));
                    console.log("   \uD83D\uDCE5 New books inserted: ".concat(loaded));
                    console.log("   \uD83D\uDD04 Existing books updated: ".concat(skipped));
                    return [4 /*yield*/, dataSource.query('SELECT COUNT(*) as count FROM egw_books')];
                case 10:
                    totalCount = _a.sent();
                    return [4 /*yield*/, dataSource.query("SELECT COUNT(*) as count FROM egw_books WHERE language = 'es'")];
                case 11:
                    spanishCount = _a.sent();
                    return [4 /*yield*/, dataSource.query("SELECT COUNT(*) as count FROM egw_books WHERE language = 'en'")];
                case 12:
                    englishCount = _a.sent();
                    console.log("\uD83D\uDCCA Total books in database: ".concat(totalCount[0].count));
                    console.log("   \uD83C\uDDFA\uD83C\uDDF8 English: ".concat(englishCount[0].count));
                    console.log("   \uD83C\uDDEA\uD83C\uDDF8 Spanish: ".concat(spanishCount[0].count));
                    return [4 /*yield*/, dataSource.destroy()];
                case 13:
                    _a.sent();
                    console.log('\n✅ Database connection closed');
                    return [2 /*return*/];
            }
        });
    });
}
loadSpanishBooks().catch(console.error);
