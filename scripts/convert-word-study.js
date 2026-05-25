"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var inputPath = process.argv[2];
var outputPath = process.argv[3];
if (!inputPath || !outputPath) {
    console.error('Usage: ts-node scripts/convert-word-study.ts <input.tsv> <output.json>');
    process.exit(1);
}
var input = (0, fs_1.readFileSync)((0, path_1.resolve)(inputPath), 'utf-8').trim();
var _a = input.split('\n'), headerLine = _a[0], rows = _a.slice(1);
var headers = headerLine.split('\t').map(function (header) { return header.trim(); });
var data = {};
var _loop_1 = function (row) {
    if (!row.trim())
        return "continue";
    var values = row.split('\t').map(function (value) { return value.trim(); });
    var entry = {};
    headers.forEach(function (header, index) {
        entry[header] = values[index] || '';
    });
    var key = (entry.word || '').toLowerCase();
    if (!key)
        return "continue";
    data[key] = {
        word: entry.word,
        language: entry.language,
        lemma: entry.lemma,
        strongs: entry.strongs,
        transliteration: entry.transliteration,
        definition: entry.definition,
        examples: entry.examples ? entry.examples.split(';').map(function (value) { return value.trim(); }).filter(Boolean) : [],
        usageCount: entry.usageCount ? Number(entry.usageCount) : undefined,
        partOfSpeech: entry.partOfSpeech || undefined,
    };
};
for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
    var row = rows_1[_i];
    _loop_1(row);
}
(0, fs_1.writeFileSync)((0, path_1.resolve)(outputPath), "".concat(JSON.stringify(data, null, 2), "\n"));
console.log("Wrote ".concat(Object.keys(data).length, " word study entries to ").concat(outputPath));
