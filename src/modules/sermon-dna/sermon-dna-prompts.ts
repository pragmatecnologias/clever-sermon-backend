export const SermonDnaPrompts = {
  analyze(input: {
    mainPassage: string;
    theme: string;
    outlinePoints: string;
    manuscriptExcerpt: string;
  }): string {
    return `Analyze this sermon for its DNA profile.
Passage: ${input.mainPassage}
Theme: ${input.theme}
Outline Points: ${input.outlinePoints}
Manuscript (excerpt): ${input.manuscriptExcerpt}

Return JSON with:
summary (string), themes (array of strings), scores (object with clarity, structure, scriptureFocus, applicationDepth 1-10).`;
  },
};
