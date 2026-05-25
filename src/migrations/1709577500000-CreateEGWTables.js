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
exports.CreateEGWTables1709577500000 = void 0;
var typeorm_1 = require("typeorm");
var CreateEGWTables1709577500000 = /** @class */ (function () {
    function CreateEGWTables1709577500000() {
    }
    CreateEGWTables1709577500000.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            var booksTableExists, paragraphsTableExists, booksTable, _a, paragraphsTable, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Enable UUID extension if not already enabled
                    return [4 /*yield*/, queryRunner.query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")];
                    case 1:
                        // Enable UUID extension if not already enabled
                        _c.sent();
                        return [4 /*yield*/, queryRunner.hasTable('egw_books')];
                    case 2:
                        booksTableExists = _c.sent();
                        return [4 /*yield*/, queryRunner.hasTable('egw_paragraphs')];
                    case 3:
                        paragraphsTableExists = _c.sent();
                        if (!booksTableExists) return [3 /*break*/, 5];
                        return [4 /*yield*/, queryRunner.getTable('egw_books')];
                    case 4:
                        _a = _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _a = null;
                        _c.label = 6;
                    case 6:
                        booksTable = _a;
                        if (!paragraphsTableExists) return [3 /*break*/, 8];
                        return [4 /*yield*/, queryRunner.getTable('egw_paragraphs')];
                    case 7:
                        _b = _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        _b = null;
                        _c.label = 9;
                    case 9:
                        paragraphsTable = _b;
                        if (!!booksTableExists) return [3 /*break*/, 11];
                        // Create egw_books table
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: 'egw_books',
                                columns: [
                                    {
                                        name: 'id',
                                        type: 'uuid',
                                        isPrimary: true,
                                        default: 'uuid_generate_v4()',
                                    },
                                    {
                                        name: 'code',
                                        type: 'varchar',
                                        isUnique: true,
                                    },
                                    {
                                        name: 'title',
                                        type: 'varchar',
                                    },
                                    {
                                        name: 'category',
                                        type: 'varchar',
                                    },
                                    {
                                        name: 'language',
                                        type: 'varchar',
                                        length: '2',
                                        default: "'en'",
                                    },
                                    {
                                        name: 'chapterCount',
                                        type: 'int',
                                        default: 0,
                                    },
                                    {
                                        name: 'paragraphCount',
                                        type: 'int',
                                        default: 0,
                                    },
                                    {
                                        name: 'description',
                                        type: 'text',
                                        isNullable: true,
                                    },
                                    {
                                        name: 'createdAt',
                                        type: 'timestamp',
                                        default: 'now()',
                                    },
                                ],
                            }), true)];
                    case 10:
                        // Create egw_books table
                        _c.sent();
                        _c.label = 11;
                    case 11:
                        if (!!(booksTable === null || booksTable === void 0 ? void 0 : booksTable.indices.some(function (index) { return index.name === 'IDX_egw_books_code'; }))) return [3 /*break*/, 13];
                        return [4 /*yield*/, queryRunner.createIndex('egw_books', new typeorm_1.TableIndex({
                                name: 'IDX_egw_books_code',
                                columnNames: ['code'],
                            }))];
                    case 12:
                        _c.sent();
                        _c.label = 13;
                    case 13:
                        if (!!(booksTable === null || booksTable === void 0 ? void 0 : booksTable.indices.some(function (index) { return index.name === 'IDX_egw_books_language'; }))) return [3 /*break*/, 15];
                        return [4 /*yield*/, queryRunner.createIndex('egw_books', new typeorm_1.TableIndex({
                                name: 'IDX_egw_books_language',
                                columnNames: ['language'],
                            }))];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15:
                        if (!!paragraphsTableExists) return [3 /*break*/, 17];
                        // Create egw_paragraphs table
                        return [4 /*yield*/, queryRunner.createTable(new typeorm_1.Table({
                                name: 'egw_paragraphs',
                                columns: [
                                    {
                                        name: 'id',
                                        type: 'uuid',
                                        isPrimary: true,
                                        default: 'uuid_generate_v4()',
                                    },
                                    {
                                        name: 'bookCode',
                                        type: 'varchar',
                                    },
                                    {
                                        name: 'bookTitle',
                                        type: 'varchar',
                                    },
                                    {
                                        name: 'language',
                                        type: 'varchar',
                                        length: '2',
                                        default: "'en'",
                                    },
                                    {
                                        name: 'chapterNumber',
                                        type: 'int',
                                    },
                                    {
                                        name: 'chapterTitle',
                                        type: 'varchar',
                                    },
                                    {
                                        name: 'paragraphNumber',
                                        type: 'int',
                                    },
                                    {
                                        name: 'content',
                                        type: 'text',
                                    },
                                    {
                                        name: 'reference',
                                        type: 'varchar',
                                        isUnique: true,
                                    },
                                    {
                                        name: 'createdAt',
                                        type: 'timestamp',
                                        default: 'now()',
                                    },
                                ],
                            }), true)];
                    case 16:
                        // Create egw_paragraphs table
                        _c.sent();
                        _c.label = 17;
                    case 17:
                        if (!!(paragraphsTable === null || paragraphsTable === void 0 ? void 0 : paragraphsTable.indices.some(function (index) { return index.name === 'IDX_egw_paragraphs_book_chapter_para'; }))) return [3 /*break*/, 19];
                        return [4 /*yield*/, queryRunner.createIndex('egw_paragraphs', new typeorm_1.TableIndex({
                                name: 'IDX_egw_paragraphs_book_chapter_para',
                                columnNames: ['bookCode', 'chapterNumber', 'paragraphNumber'],
                            }))];
                    case 18:
                        _c.sent();
                        _c.label = 19;
                    case 19:
                        if (!!(paragraphsTable === null || paragraphsTable === void 0 ? void 0 : paragraphsTable.indices.some(function (index) { return index.name === 'IDX_egw_paragraphs_reference'; }))) return [3 /*break*/, 21];
                        return [4 /*yield*/, queryRunner.createIndex('egw_paragraphs', new typeorm_1.TableIndex({
                                name: 'IDX_egw_paragraphs_reference',
                                columnNames: ['reference'],
                            }))];
                    case 20:
                        _c.sent();
                        _c.label = 21;
                    case 21:
                        if (!!(paragraphsTable === null || paragraphsTable === void 0 ? void 0 : paragraphsTable.indices.some(function (index) { return index.name === 'IDX_egw_paragraphs_bookCode'; }))) return [3 /*break*/, 23];
                        return [4 /*yield*/, queryRunner.createIndex('egw_paragraphs', new typeorm_1.TableIndex({
                                name: 'IDX_egw_paragraphs_bookCode',
                                columnNames: ['bookCode'],
                            }))];
                    case 22:
                        _c.sent();
                        _c.label = 23;
                    case 23:
                        if (!!(paragraphsTable === null || paragraphsTable === void 0 ? void 0 : paragraphsTable.indices.some(function (index) { return index.name === 'IDX_egw_paragraphs_language'; }))) return [3 /*break*/, 25];
                        return [4 /*yield*/, queryRunner.createIndex('egw_paragraphs', new typeorm_1.TableIndex({
                                name: 'IDX_egw_paragraphs_language',
                                columnNames: ['language'],
                            }))];
                    case 24:
                        _c.sent();
                        _c.label = 25;
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    CreateEGWTables1709577500000.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.dropTable('egw_paragraphs')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.dropTable('egw_books')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreateEGWTables1709577500000;
}());
exports.CreateEGWTables1709577500000 = CreateEGWTables1709577500000;
