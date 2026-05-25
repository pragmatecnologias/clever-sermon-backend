"use strict";
/**
 * EGW Book Downloader
 * Downloads all Ellen G. White books from egwwritings.org
 *
 * Usage: npx ts-node scripts/download-egw-books.ts
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
var https = require("https");
// Comprehensive list of EGW books with their codes
var EGW_BOOKS = [
    // ENGLISH BOOKS
    // Conflict of the Ages Series
    { code: 'PP', title: 'Patriarchs and Prophets', url: 'https://media2.egwwritings.org/epub/en_PP.epub', category: 'Conflict of Ages', language: 'en' },
    { code: 'PK', title: 'Prophets and Kings', url: 'https://media2.egwwritings.org/epub/en_PK.epub', category: 'Conflict of Ages', language: 'en' },
    { code: 'DA', title: 'The Desire of Ages', url: 'https://media2.egwwritings.org/epub/en_DA.epub', category: 'Conflict of Ages', language: 'en' },
    { code: 'AA', title: 'The Acts of the Apostles', url: 'https://media2.egwwritings.org/epub/en_AA.epub', category: 'Conflict of Ages', language: 'en' },
    { code: 'GC', title: 'The Great Controversy', url: 'https://media2.egwwritings.org/epub/en_GC.epub', category: 'Conflict of Ages', language: 'en' },
    // Christian Living
    { code: 'SC', title: 'Steps to Christ', url: 'https://media2.egwwritings.org/epub/en_SC.epub', category: 'Christian Living', language: 'en' },
    { code: 'MB', title: 'Thoughts from the Mount of Blessing', url: 'https://media2.egwwritings.org/epub/en_MB.epub', category: 'Christian Living', language: 'en' },
    { code: 'COL', title: 'Christ\'s Object Lessons', url: 'https://media2.egwwritings.org/epub/en_COL.epub', category: 'Christian Living', language: 'en' },
    { code: 'MH', title: 'The Ministry of Healing', url: 'https://media2.egwwritings.org/epub/en_MH.epub', category: 'Christian Living', language: 'en' },
    { code: 'Ed', title: 'Education', url: 'https://media2.egwwritings.org/epub/en_Ed.epub', category: 'Christian Living', language: 'en' },
    // Testimonies
    { code: '1T', title: 'Testimonies for the Church Volume 1', url: 'https://media2.egwwritings.org/epub/en_1T.epub', category: 'Testimonies', language: 'en' },
    { code: '2T', title: 'Testimonies for the Church Volume 2', url: 'https://media2.egwwritings.org/epub/en_2T.epub', category: 'Testimonies', language: 'en' },
    { code: '3T', title: 'Testimonies for the Church Volume 3', url: 'https://media2.egwwritings.org/epub/en_3T.epub', category: 'Testimonies', language: 'en' },
    { code: '4T', title: 'Testimonies for the Church Volume 4', url: 'https://media2.egwwritings.org/epub/en_4T.epub', category: 'Testimonies', language: 'en' },
    { code: '5T', title: 'Testimonies for the Church Volume 5', url: 'https://media2.egwwritings.org/epub/en_5T.epub', category: 'Testimonies', language: 'en' },
    { code: '6T', title: 'Testimonies for the Church Volume 6', url: 'https://media2.egwwritings.org/epub/en_6T.epub', category: 'Testimonies', language: 'en' },
    { code: '7T', title: 'Testimonies for the Church Volume 7', url: 'https://media2.egwwritings.org/epub/en_7T.epub', category: 'Testimonies', language: 'en' },
    { code: '8T', title: 'Testimonies for the Church Volume 8', url: 'https://media2.egwwritings.org/epub/en_8T.epub', category: 'Testimonies', language: 'en' },
    { code: '9T', title: 'Testimonies for the Church Volume 9', url: 'https://media2.egwwritings.org/epub/en_9T.epub', category: 'Testimonies', language: 'en' },
    // Devotional
    { code: 'ML', title: 'My Life Today', url: 'https://media2.egwwritings.org/epub/en_ML.epub', category: 'Devotional', language: 'en' },
    { code: 'OHC', title: 'Our High Calling', url: 'https://media2.egwwritings.org/epub/en_OHC.epub', category: 'Devotional', language: 'en' },
    { code: 'Mar', title: 'Maranatha', url: 'https://media2.egwwritings.org/epub/en_Mar.epub', category: 'Devotional', language: 'en' },
    // Doctrinal
    { code: 'EW', title: 'Early Writings', url: 'https://media2.egwwritings.org/epub/en_EW.epub', category: 'Doctrinal', language: 'en' },
    { code: 'GW', title: 'Gospel Workers', url: 'https://media2.egwwritings.org/epub/en_GW.epub', category: 'Doctrinal', language: 'en' },
    { code: 'Ev', title: 'Evangelism', url: 'https://media2.egwwritings.org/epub/en_Ev.epub', category: 'Doctrinal', language: 'en' },
    // Health
    { code: 'CD', title: 'Counsels on Diet and Foods', url: 'https://media2.egwwritings.org/epub/en_CD.epub', category: 'Health', language: 'en' },
    { code: 'Te', title: 'Temperance', url: 'https://media2.egwwritings.org/epub/en_Te.epub', category: 'Health', language: 'en' },
    // Family
    { code: 'AH', title: 'The Adventist Home', url: 'https://media2.egwwritings.org/epub/en_AH.epub', category: 'Family', language: 'en' },
    { code: 'CG', title: 'Child Guidance', url: 'https://media2.egwwritings.org/epub/en_CG.epub', category: 'Family', language: 'en' },
    // Additional Important Works
    { code: 'CS', title: 'Counsels on Stewardship', url: 'https://media2.egwwritings.org/epub/en_CS.epub', category: 'Christian Living', language: 'en' },
    { code: 'CT', title: 'Counsels to Teachers', url: 'https://media2.egwwritings.org/epub/en_CT.epub', category: 'Education', language: 'en' },
    { code: 'FE', title: 'Fundamentals of Christian Education', url: 'https://media2.egwwritings.org/epub/en_FE.epub', category: 'Education', language: 'en' },
    { code: 'LS', title: 'Life Sketches', url: 'https://media2.egwwritings.org/epub/en_LS.epub', category: 'Biography', language: 'en' },
    { code: 'PM', title: 'Publishing Ministry', url: 'https://media2.egwwritings.org/epub/en_PM.epub', category: 'Ministry', language: 'en' },
    { code: 'WM', title: 'Welfare Ministry', url: 'https://media2.egwwritings.org/epub/en_WM.epub', category: 'Ministry', language: 'en' }
];
var DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
var METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata.json');
function downloadFile(url, destination) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var file = fs.createWriteStream(destination);
                    https.get(url, function (response) {
                        if (response.statusCode === 302 || response.statusCode === 301) {
                            // Handle redirect
                            var redirectUrl = response.headers.location;
                            if (redirectUrl) {
                                https.get(redirectUrl, function (redirectResponse) {
                                    redirectResponse.pipe(file);
                                    file.on('finish', function () {
                                        file.close();
                                        resolve();
                                    });
                                }).on('error', function (err) {
                                    fs.unlink(destination, function () { });
                                    reject(err);
                                });
                            }
                        }
                        else {
                            response.pipe(file);
                            file.on('finish', function () {
                                file.close();
                                resolve();
                            });
                        }
                    }).on('error', function (err) {
                        fs.unlink(destination, function () { });
                        reject(err);
                    });
                })];
        });
    });
}
function downloadAllBooks() {
    return __awaiter(this, void 0, void 0, function () {
        var results, i, book, filename, filepath, stats, sizeInMB, error_1, metadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Create download directory if it doesn't exist
                    if (!fs.existsSync(DOWNLOAD_DIR)) {
                        fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
                    }
                    console.log("\uD83D\uDCDA Starting download of ".concat(EGW_BOOKS.length, " EGW books..."));
                    console.log("\uD83D\uDCC1 Download directory: ".concat(DOWNLOAD_DIR, "\n"));
                    results = {
                        successful: [],
                        failed: [],
                        skipped: []
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < EGW_BOOKS.length)) return [3 /*break*/, 7];
                    book = EGW_BOOKS[i];
                    filename = "".concat(book.code, ".epub");
                    filepath = path.join(DOWNLOAD_DIR, filename);
                    // Skip if already downloaded
                    if (fs.existsSync(filepath)) {
                        console.log("\u23ED\uFE0F  [".concat(i + 1, "/").concat(EGW_BOOKS.length, "] Skipping ").concat(book.code, " - already exists"));
                        results.skipped.push(book.code);
                        return [3 /*break*/, 6];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    console.log("\u2B07\uFE0F  [".concat(i + 1, "/").concat(EGW_BOOKS.length, "] Downloading ").concat(book.code, ": ").concat(book.title, "..."));
                    return [4 /*yield*/, downloadFile(book.url, filepath)];
                case 3:
                    _a.sent();
                    stats = fs.statSync(filepath);
                    sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
                    console.log("\u2705 Downloaded ".concat(book.code, " (").concat(sizeInMB, " MB)"));
                    results.successful.push(book.code);
                    // Small delay to be respectful to the server
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 4:
                    // Small delay to be respectful to the server
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("\u274C Failed to download ".concat(book.code, ": ").concat(error_1.message));
                    results.failed.push({ code: book.code, error: error_1.message });
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7:
                    metadata = {
                        downloadDate: new Date().toISOString(),
                        totalBooks: EGW_BOOKS.length,
                        books: EGW_BOOKS,
                        results: results
                    };
                    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
                    // Print summary
                    console.log('\n' + '='.repeat(60));
                    console.log('📊 Download Summary');
                    console.log('='.repeat(60));
                    console.log("\u2705 Successfully downloaded: ".concat(results.successful.length));
                    console.log("\u23ED\uFE0F  Skipped (already exist): ".concat(results.skipped.length));
                    console.log("\u274C Failed: ".concat(results.failed.length));
                    console.log("\uD83D\uDCC1 Total files in directory: ".concat(results.successful.length + results.skipped.length));
                    if (results.failed.length > 0) {
                        console.log('\n❌ Failed downloads:');
                        results.failed.forEach(function (_a) {
                            var code = _a.code, error = _a.error;
                            console.log("   - ".concat(code, ": ").concat(error));
                        });
                    }
                    console.log("\n\uD83D\uDCC4 Metadata saved to: ".concat(METADATA_FILE));
                    console.log('='.repeat(60));
                    return [2 /*return*/];
            }
        });
    });
}
// Run the download
downloadAllBooks().catch(console.error);
