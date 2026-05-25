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
var fs_1 = require("fs");
var path_1 = require("path");
var https = require("https");
var outputPath = process.argv[2] || 'data/geography.json';
var url = 'https://www.openbible.info/geo/data/merged.txt';
var download = function (source, destination) {
    return new Promise(function (resolveDownload, reject) {
        var request = https.get(source, function (response) {
            if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                response.destroy();
                download(response.headers.location, destination).then(resolveDownload).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                response.resume();
                reject(new Error("Download failed with status ".concat(response.statusCode)));
                return;
            }
            var stream = (0, fs_1.createWriteStream)(destination);
            response.pipe(stream);
            stream.on('finish', function () { return stream.close(function () { return resolveDownload(); }); });
        });
        request.on('error', reject);
    });
};
var ensureDir = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.promises.mkdir((0, path_1.dirname)(path), { recursive: true })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var normalizeKey = function (value) { return value.toLowerCase().replace(/[^a-z0-9]/g, ''); };
var extractVerseBooks = function (text) {
    var matches = text.match(/[1-3]?[A-Za-z]+\s+\d+:/g) || [];
    return matches.map(function (match) { return match.replace(/\s+\d+:/, '').trim(); });
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var resolvedOutput, tempPath, content, lines, data, _i, lines_1, line, parts, place, referenceColumn, books, _a, books_1, book, key, entry;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                resolvedOutput = (0, path_1.resolve)(outputPath);
                return [4 /*yield*/, ensureDir(resolvedOutput)];
            case 1:
                _b.sent();
                tempPath = "".concat(resolvedOutput, ".txt");
                return [4 /*yield*/, download(url, tempPath)];
            case 2:
                _b.sent();
                return [4 /*yield*/, fs_1.promises.readFile(tempPath, 'utf-8')];
            case 3:
                content = _b.sent();
                lines = content.split('\n').map(function (line) { return line.trim(); }).filter(Boolean);
                data = {};
                for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    line = lines_1[_i];
                    parts = line.split('\t');
                    if (parts.length < 2)
                        continue;
                    place = parts[0];
                    referenceColumn = parts.find(function (part) { return /\d+:\d+/.test(part); }) || '';
                    books = extractVerseBooks(referenceColumn);
                    for (_a = 0, books_1 = books; _a < books_1.length; _a++) {
                        book = books_1[_a];
                        key = normalizeKey(book);
                        if (!key)
                            continue;
                        entry = data[key] || { places: [] };
                        if (!entry.places.includes(place)) {
                            entry.places.push(place);
                        }
                        data[key] = entry;
                    }
                }
                return [4 /*yield*/, fs_1.promises.writeFile(resolvedOutput, "".concat(JSON.stringify(data, null, 2), "\n"))];
            case 4:
                _b.sent();
                return [4 /*yield*/, fs_1.promises.unlink(tempPath)];
            case 5:
                _b.sent();
                console.log("Saved geography data to ".concat(resolvedOutput));
                return [2 /*return*/];
        }
    });
}); })();
