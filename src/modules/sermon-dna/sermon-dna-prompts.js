"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SermonDnaPrompts = void 0;
exports.SermonDnaPrompts = {
    analyze: function (input) {
        return "Analyze this sermon for its DNA profile.\nPassage: ".concat(input.mainPassage, "\nTheme: ").concat(input.theme, "\nOutline Points: ").concat(input.outlinePoints, "\nManuscript (excerpt): ").concat(input.manuscriptExcerpt, "\n\nReturn JSON with:\nsummary (string), themes (array of strings), scores (object with clarity, structure, scriptureFocus, applicationDepth 1-10).");
    },
};
