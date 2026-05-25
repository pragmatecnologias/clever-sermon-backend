"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var inputPath = process.argv[2];
var outputPath = process.argv[3];
if (!inputPath || !outputPath) {
    console.error('Usage: ts-node scripts/convert-cross-references.ts <input.txt> <output.txt>');
    process.exit(1);
}
var input = (0, fs_1.readFileSync)((0, path_1.resolve)(inputPath), 'utf-8');
var lines = input
    .split('\n')
    .map(function (line) { return line.trim(); })
    .filter(Boolean)
    .map(function (line) { return line.replace(/[,;]+/g, ' '); });
var outputLines = [];
for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    var parts = line.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        outputLines.push("".concat(parts[0], " ").concat(parts[1]));
    }
}
(0, fs_1.writeFileSync)((0, path_1.resolve)(outputPath), "".concat(outputLines.join('\n'), "\n"));
console.log("Wrote ".concat(outputLines.length, " cross references to ").concat(outputPath));
