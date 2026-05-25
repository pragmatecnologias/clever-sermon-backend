"use strict";
/**
 * Load EGW Bible References into Database
 * Loads the extracted Bible references from paragraphs-with-references.json
 * into the egw_scripture_references table
 *
 * Usage: npx ts-node scripts/load-egw-references.ts
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
var typeorm_1 = require("typeorm");
// Load environment variables
var dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '../.env') });
// Parse DATABASE_URL if available
var dbConfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: '',
    database: 'clever_sermon',
};
if (process.env.DATABASE_URL) {
    var url = new URL(process.env.DATABASE_URL);
    dbConfig.username = url.username || 'admin';
    dbConfig.password = url.password || '';
    dbConfig.host = url.hostname || 'localhost';
    dbConfig.port = parseInt(url.port || '5432');
}
if (process.env.DATABASE_NAME) {
    dbConfig.database = process.env.DATABASE_NAME;
}
// Database configuration
var AppDataSource = new typeorm_1.DataSource(__assign(__assign({}, dbConfig), { entities: ['src/entities/**/*.entity.ts'], synchronize: false }));
function loadReferences() {
    return __awaiter(this, void 0, void 0, function () {
        var PARSED_FILE, paragraphs, dbParagraphs, refToUuidMap_1, totalInserted, skipped, batchSize, batch, i, para, paragraphUuid, _i, _a, ref, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    PARSED_FILE = path.join(__dirname, '../data/egw-parsed/paragraphs-with-references.json');
                    if (!fs.existsSync(PARSED_FILE)) {
                        console.error('❌ File not found:', PARSED_FILE);
                        console.error('Run extract-bible-references.ts first.');
                        process.exit(1);
                    }
                    console.log('📖 Loading paragraphs with references...');
                    paragraphs = JSON.parse(fs.readFileSync(PARSED_FILE, 'utf8'));
                    console.log('🔌 Connecting to database...');
                    return [4 /*yield*/, AppDataSource.initialize()];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 13, 14, 16]);
                    console.log('� Building paragraph reference map from database...');
                    return [4 /*yield*/, AppDataSource.query('SELECT id, reference FROM egw_paragraphs')];
                case 3:
                    dbParagraphs = _b.sent();
                    refToUuidMap_1 = new Map();
                    dbParagraphs.forEach(function (p) {
                        refToUuidMap_1.set(p.reference, p.id);
                    });
                    console.log("\u2705 Found ".concat(refToUuidMap_1.size, " paragraphs in database"));
                    console.log('�️  Clearing existing references...');
                    return [4 /*yield*/, AppDataSource.query('TRUNCATE TABLE egw_scripture_references CASCADE')];
                case 4:
                    _b.sent();
                    console.log('📝 Loading references into database...\n');
                    totalInserted = 0;
                    skipped = 0;
                    batchSize = 500;
                    batch = [];
                    i = 0;
                    _b.label = 5;
                case 5:
                    if (!(i < paragraphs.length)) return [3 /*break*/, 10];
                    para = paragraphs[i];
                    if (para.bibleReferences.length === 0)
                        return [3 /*break*/, 9];
                    paragraphUuid = refToUuidMap_1.get(para.reference);
                    if (!paragraphUuid) {
                        skipped++;
                        return [3 /*break*/, 9]; // Skip if paragraph not in database
                    }
                    _i = 0, _a = para.bibleReferences;
                    _b.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    ref = _a[_i];
                    batch.push({
                        egwParagraphId: paragraphUuid,
                        book: ref.book,
                        chapter: ref.chapter,
                        verseStart: ref.verseStart || null,
                        verseEnd: ref.verseEnd || null,
                        reference: ref.reference,
                        language: para.language
                    });
                    if (!(batch.length >= batchSize)) return [3 /*break*/, 8];
                    return [4 /*yield*/, insertBatch(AppDataSource, batch)];
                case 7:
                    _b.sent();
                    totalInserted += batch.length;
                    console.log("\u2705 Inserted ".concat(totalInserted, " references..."));
                    batch = [];
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    i++;
                    return [3 /*break*/, 5];
                case 10:
                    if (!(batch.length > 0)) return [3 /*break*/, 12];
                    return [4 /*yield*/, insertBatch(AppDataSource, batch)];
                case 11:
                    _b.sent();
                    totalInserted += batch.length;
                    _b.label = 12;
                case 12:
                    console.log('\n' + '='.repeat(60));
                    console.log('📊 Load Complete');
                    console.log('='.repeat(60));
                    console.log("\u2705 Total references inserted: ".concat(totalInserted));
                    console.log("\u23ED\uFE0F  Paragraphs skipped (not in DB): ".concat(skipped));
                    console.log('='.repeat(60));
                    return [3 /*break*/, 16];
                case 13:
                    error_1 = _b.sent();
                    console.error('❌ Error loading references:', error_1);
                    throw error_1;
                case 14: return [4 /*yield*/, AppDataSource.destroy()];
                case 15:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function insertBatch(dataSource, batch) {
    return __awaiter(this, void 0, void 0, function () {
        var values, query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    values = batch.map(function (ref) {
                        return "(uuid_generate_v4(), '".concat(ref.egwParagraphId, "', '").concat(escapeSql(ref.book), "', ").concat(ref.chapter, ", ").concat(ref.verseStart, ", ").concat(ref.verseEnd, ", '").concat(escapeSql(ref.reference), "', '").concat(ref.language, "', NOW())");
                    }).join(',');
                    query = "\n    INSERT INTO egw_scripture_references \n    (id, \"egwParagraphId\", book, chapter, \"verseStart\", \"verseEnd\", reference, language, \"createdAt\")\n    VALUES ".concat(values, "\n  ");
                    return [4 /*yield*/, dataSource.query(query)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function escapeSql(str) {
    return str.replace(/'/g, "''");
}
loadReferences().catch(console.error);
