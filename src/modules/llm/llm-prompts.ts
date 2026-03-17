export const LlmPrompts = {
  sermonOutline(input: { passage: string; theme: string; style: string; languageLabel: string }): string {
    return `Generate a sermon outline for the following:
Passage: ${input.passage}
Theme: ${input.theme}
Style: ${input.style}

Write in ${input.languageLabel}.

Please provide a structured outline with:
1. Introduction
2. Main Points (3-5 points)
3. Conclusion
4. Call to Action

Format the response as JSON.`;
  },

  manuscript(input: { outlineJson: string; passage: string; languageLabel: string }): string {
    return `Generate a full sermon manuscript based on this outline:
${input.outlineJson}

Passage: ${input.passage}

Write in ${input.languageLabel}.

Please write a complete sermon manuscript with smooth transitions between points.`;
  },

  applications(input: {
    audienceType: string;
    passage: string;
    mainPoints: string;
    languageLabel: string;
  }): string {
    return `Generate practical applications for ${input.audienceType} based on:
Passage: ${input.passage}
Main Points: ${input.mainPoints}

Write in ${input.languageLabel}.

Provide 3-5 specific, actionable applications.`;
  },

  discussionQuestions(input: { passage: string; theme: string; languageLabel: string }): string {
    return `Generate discussion questions for a small group study on:
Passage: ${input.passage}
Theme: ${input.theme}

Write in ${input.languageLabel}.

Provide 5-7 thought-provoking questions that encourage deep reflection and application.`;
  },
};
