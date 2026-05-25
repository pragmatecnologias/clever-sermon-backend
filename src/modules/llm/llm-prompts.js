"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmPrompts = void 0;
exports.LlmPrompts = {
    sermonOutline: function (input) {
        return "Generate a sermon outline for the following:\nPassage: ".concat(input.passage, "\nTheme: ").concat(input.theme, "\nStyle: ").concat(input.style, "\n\nWrite in ").concat(input.languageLabel, ".\n\nPlease provide a structured outline with:\n1. Introduction\n2. Main Points (3-5 points)\n3. Conclusion\n4. Call to Action\n\nFormat the response as JSON.");
    },
    manuscript: function (input) {
        return "Generate a full sermon manuscript based on this outline:\n".concat(input.outlineJson, "\n\nPassage: ").concat(input.passage, "\n\nWrite in ").concat(input.languageLabel, ".\n\nPlease write a complete sermon manuscript with smooth transitions between points.");
    },
    applications: function (input) {
        return "Generate practical applications for ".concat(input.audienceType, " based on:\nPassage: ").concat(input.passage, "\nMain Points: ").concat(input.mainPoints, "\n\nWrite in ").concat(input.languageLabel, ".\n\nProvide 3-5 specific, actionable applications.");
    },
    discussionQuestions: function (input) {
        return "Generate discussion questions for a small group study on:\nPassage: ".concat(input.passage, "\nTheme: ").concat(input.theme, "\n\nWrite in ").concat(input.languageLabel, ".\n\nProvide 5-7 thought-provoking questions that encourage deep reflection and application.");
    },
};
