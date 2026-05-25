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
var inputPath = process.argv[2] || 'data/openbible-cross-references.txt';
var outputPath = process.argv[3] || 'data/cross-reference-categories.json';
var normalize = function (value) { return value.trim().replace(/\s+/g, '').replace(':', '.'); };
var getBook = function (reference) {
    var match = reference.match(/^(.*?)\d/);
    return match ? match[1].trim().toLowerCase() : '';
};
var getChapter = function (reference) {
    var match = reference.match(/(\d+)\.?\d*/);
    return match ? match[1] : '';
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var input, lines, categories, _i, lines_1, line, _a, source, target, normalizedSource, normalizedTarget, sourceBook, targetBook, sourceChapter, targetChapter, category;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fs_1.promises.readFile((0, path_1.resolve)(inputPath), 'utf-8')];
            case 1:
                input = _b.sent();
                lines = input.split('\n').map(function (line) { return line.trim(); }).filter(Boolean);
                categories = {};
                for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    line = lines_1[_i];
                    _a = line.split(/\s+/), source = _a[0], target = _a[1];
                    if (!source || !target)
                        continue;
                    normalizedSource = normalize(source);
                    normalizedTarget = normalize(target);
                    sourceBook = getBook(source);
                    targetBook = getBook(target);
                    sourceChapter = getChapter(source);
                    targetChapter = getChapter(target);
                    category = 'thematic_echo';
                    if (sourceBook && sourceBook === targetBook) {
                        category = sourceChapter && sourceChapter === targetChapter ? 'parallel_narrative' : 'thematic_echo';
                    }
                    categories["".concat(normalizedSource, "|").concat(normalizedTarget)] = category;
                }
                return [4 /*yield*/, fs_1.promises.writeFile((0, path_1.resolve)(outputPath), "".concat(JSON.stringify(categories, null, 2), "\n"))];
            case 2:
                _b.sent();
                console.log("Saved ".concat(Object.keys(categories).length, " category mappings to ").concat(outputPath));
                return [2 /*return*/];
        }
    });
}); })();
