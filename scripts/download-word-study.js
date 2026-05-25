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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var https = require("https");
var outputPath = process.argv[2] || 'data/strongs-word-study.json';
var greekUrl = 'https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongsgreek.dat';
var hebrewUrl = 'https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongshebrew.dat';
var download = function (url, destination) {
    return new Promise(function (resolveDownload, reject) {
        var request = https.get(url, { headers: { 'User-Agent': 'clever-sermon-datasets/1.0' } }, function (response) {
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
var parseStrongs = function (content, language, prefix) {
    var lines = content.split('\n');
    var entries = [];
    var current = null;
    var definitionLines = [];
    var flush = function () {
        if (current) {
            var definition = definitionLines
                .map(function (line) { return line.trim(); })
                .filter(function (line) { return line && !line.toLowerCase().startsWith('see '); })
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
            current.definition = definition;
            entries.push(current);
        }
        current = null;
        definitionLines = [];
    };
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var rawLine = lines_1[_i];
        var line = rawLine.trim();
        if (!line || line.startsWith('$$T') || line.startsWith('\\')) {
            continue;
        }
        var match = line.match(/^(\d{1,5})\s+(\S+)\s+(.+)$/);
        if (match) {
            flush();
            var number = match[1].padStart(4, '0');
            var word = match[2];
            var transliteration = match[3].replace(/\s{2,}/g, ' ').trim();
            current = {
                word: word,
                language: language,
                lemma: word,
                strongs: "".concat(prefix).concat(number),
                transliteration: transliteration,
                definition: '',
                examples: [],
            };
            continue;
        }
        if (current) {
            definitionLines.push(line);
        }
    }
    flush();
    return entries;
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var resolvedOutput, tempGreek, tempHebrew, greekContent, hebrewContent, entries, data, _i, entries_1, entry, key;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resolvedOutput = (0, path_1.resolve)(outputPath);
                return [4 /*yield*/, ensureDir(resolvedOutput)];
            case 1:
                _a.sent();
                tempGreek = "".concat(resolvedOutput, ".greek.tmp");
                tempHebrew = "".concat(resolvedOutput, ".hebrew.tmp");
                return [4 /*yield*/, download(greekUrl, tempGreek)];
            case 2:
                _a.sent();
                return [4 /*yield*/, download(hebrewUrl, tempHebrew)];
            case 3:
                _a.sent();
                return [4 /*yield*/, fs_1.promises.readFile(tempGreek, 'utf-8')];
            case 4:
                greekContent = _a.sent();
                return [4 /*yield*/, fs_1.promises.readFile(tempHebrew, 'utf-8')];
            case 5:
                hebrewContent = _a.sent();
                entries = __spreadArray(__spreadArray([], parseStrongs(greekContent, 'greek', 'G'), true), parseStrongs(hebrewContent, 'hebrew', 'H'), true);
                data = {};
                for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    entry = entries_1[_i];
                    key = entry.word.toLowerCase();
                    if (!data[key]) {
                        data[key] = entry;
                    }
                }
                return [4 /*yield*/, fs_1.promises.writeFile(resolvedOutput, "".concat(JSON.stringify(data, null, 2), "\n"))];
            case 6:
                _a.sent();
                return [4 /*yield*/, fs_1.promises.unlink(tempGreek)];
            case 7:
                _a.sent();
                return [4 /*yield*/, fs_1.promises.unlink(tempHebrew)];
            case 8:
                _a.sent();
                console.log("Saved ".concat(Object.keys(data).length, " Strong's entries to ").concat(resolvedOutput));
                return [2 /*return*/];
        }
    });
}); })();
