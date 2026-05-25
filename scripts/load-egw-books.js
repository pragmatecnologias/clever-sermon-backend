"use strict";
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
// Load environment variables
(0, dotenv_1.config)({ path: path.join(__dirname, '../.env') });
// Load books from metadata file
var metadataPath = path.join(__dirname, '../data/egw-books/metadata-complete.json');
var EGW_BOOKS = [];
if (fs.existsSync(metadataPath)) {
    var metadata_1 = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    EGW_BOOKS = metadata_1.books.filter(function (b) {
        var _a, _b;
        return metadata_1.results.successful.includes((_a = b.downloadedAs) === null || _a === void 0 ? void 0 : _a.replace('.epub', '')) ||
            metadata_1.results.skipped.includes((_b = b.downloadedAs) === null || _b === void 0 ? void 0 : _b.replace('.epub', ''));
    });
}
else {
    console.error('❌ Metadata file not found. Run download script first.');
    process.exit(1);
}
function loadEGWBooks() {
    return __awaiter(this, void 0, void 0, function () {
        var databaseUrl, databaseName, urlMatch, username, password, host, port, dataSource, inserted, _i, EGW_BOOKS_1, book, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    databaseUrl = process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/';
                    databaseName = process.env.DATABASE_NAME || 'clever_sermon';
                    urlMatch = databaseUrl.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)/);
                    if (!urlMatch) {
                        console.error('DATABASE_URL:', databaseUrl);
                        throw new Error('Invalid DATABASE_URL format. Expected: postgresql://username:password@host:port/');
                    }
                    username = urlMatch[1], password = urlMatch[2], host = urlMatch[3], port = urlMatch[4];
                    dataSource = new typeorm_1.DataSource({
                        type: 'postgres',
                        host: host,
                        port: parseInt(port),
                        username: username,
                        password: password,
                        database: databaseName,
                        synchronize: false,
                        logging: false,
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 12]);
                    console.log('📚 Loading EGW book metadata into database...\n');
                    return [4 /*yield*/, dataSource.initialize()];
                case 2:
                    _a.sent();
                    console.log('✅ Database connection established\n');
                    // Clear existing books
                    return [4 /*yield*/, dataSource.query('DELETE FROM egw_books')];
                case 3:
                    // Clear existing books
                    _a.sent();
                    console.log('🗑️  Cleared existing book metadata\n');
                    inserted = 0;
                    _i = 0, EGW_BOOKS_1 = EGW_BOOKS;
                    _a.label = 4;
                case 4:
                    if (!(_i < EGW_BOOKS_1.length)) return [3 /*break*/, 7];
                    book = EGW_BOOKS_1[_i];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_books (code, title, category, language)\n         VALUES ($1, $2, $3, $4)", [book.code, book.title, book.category, book.language])];
                case 5:
                    _a.sent();
                    inserted++;
                    if (inserted % 10 === 0) {
                        console.log("  \u2713 Loaded ".concat(inserted, "/").concat(EGW_BOOKS.length, " books..."));
                    }
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    console.log("\n\u2705 Successfully loaded ".concat(inserted, " EGW books into database"));
                    return [4 /*yield*/, dataSource.query('SELECT COUNT(*) as count FROM egw_books')];
                case 8:
                    result = _a.sent();
                    console.log("\uD83D\uDCCA Total books in database: ".concat(result[0].count, "\n"));
                    return [4 /*yield*/, dataSource.destroy()];
                case 9:
                    _a.sent();
                    console.log('✅ Database connection closed');
                    return [3 /*break*/, 12];
                case 10:
                    error_1 = _a.sent();
                    console.error('❌ Error loading EGW books:', error_1);
                    return [4 /*yield*/, dataSource.destroy()];
                case 11:
                    _a.sent();
                    process.exit(1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
loadEGWBooks();
