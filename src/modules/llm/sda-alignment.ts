/**
 * SDA Doctrinal Alignment System
 * 
 * Provides doctrinal guardrails for LLM-generated content without being polemical.
 * Ensures theological consistency while maintaining academic respect for other traditions.
 */

export const SDA_DOCTRINAL_CONTEXT = `
You are generating content for a Seventh-day Adventist Bible study and sermon preparation application.

All outputs must align with the following doctrinal guidelines unless explicitly asked to compare traditions:

1. The seventh-day Sabbath (Saturday) is the biblical day of worship. Do not default to Sunday worship language.
2. Avoid assuming the immortality of the soul. The state of the dead is described as unconscious sleep until resurrection.
3. Avoid eternal conscious torment language. Use biblically grounded phrasing.
4. Recognize the significance of the sanctuary theme in Scripture.
5. Treat prophetic books (Daniel and Revelation) as coherent and connected.
6. Avoid replacement theology framing.
7. Maintain salvation by grace through faith in Christ alone.
8. When discussing debated passages, clearly distinguish between interpretations and avoid asserting non-Adventist views as normative.
9. Maintain respectful and non-polemical tone toward other Christian traditions.
10. When mentioning worship gatherings, use "Sabbath" unless explicitly instructed otherwise.
11. If a passage is commonly interpreted differently across traditions, present interpretations clearly labeled and avoid asserting one as universally accepted.
12. All study insights must remain grounded in Scripture.

IMPORTANT TONE GUIDELINES:
- Be confident but balanced
- Never say "Other traditions are wrong"
- Instead say "Many Christian traditions interpret this differently. In Adventist theology..."
- Maintain academic respect
- Avoid sectarian language
- Do not embed controversial phrasing automatically
`;

export const THEOLOGICAL_LENS_CONTEXTS = {
  adventist: SDA_DOCTRINAL_CONTEXT,
  
  evangelical: `
You are generating content for an evangelical Bible study application.

Guidelines:
1. Maintain biblical authority and inerrancy
2. Emphasize personal relationship with Christ
3. Focus on grace through faith
4. Use contemporary worship language
5. Be respectful of denominational differences
6. Ground all insights in Scripture
`,
  
  neutral: `
You are generating academic biblical content.

Guidelines:
1. Present multiple scholarly interpretations when relevant
2. Clearly label theological positions
3. Maintain academic objectivity
4. Cite traditions and scholars when making interpretive claims
5. Avoid asserting any single tradition as normative
6. Ground all analysis in textual evidence
`
};

export interface ContentScanResult {
  hasIssues: boolean;
  issues: {
    type: 'sunday_language' | 'immortal_soul' | 'eternal_torment' | 'replacement_theology';
    text: string;
    suggestion: string;
  }[];
}

export class SDAAlignmentService {
  /**
   * Scan content for problematic language patterns
   */
  static scanContent(content: string): ContentScanResult {
    const issues: ContentScanResult['issues'] = [];

    // Check for Sunday worship language
    const sundayPatterns = [
      /come to church (this |on )?sunday/i,
      /celebrate (resurrection )?sunday/i,
      /sunday worship/i,
      /lord's day service/i
    ];

    sundayPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        issues.push({
          type: 'sunday_language',
          text: content.match(pattern)?.[0] || '',
          suggestion: 'Replace with "Sabbath worship" or "gather in worship this Sabbath"'
        });
      }
    });

    // Check for immortal soul language
    const immortalSoulPatterns = [
      /when you die you(?:'ll| will) (?:immediately )?(?:be in|go to) heaven/i,
      /your soul (?:goes|ascends) to heaven/i,
      /immortal soul/i
    ];

    immortalSoulPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        issues.push({
          type: 'immortal_soul',
          text: content.match(pattern)?.[0] || '',
          suggestion: 'Use "resurrection" or "sleep in death until resurrection" language'
        });
      }
    });

    // Check for eternal torment language
    const eternalTormentPatterns = [
      /eternal (?:conscious )?torment/i,
      /burning forever in hell/i,
      /eternal suffering/i
    ];

    eternalTormentPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        issues.push({
          type: 'eternal_torment',
          text: content.match(pattern)?.[0] || '',
          suggestion: 'Use biblically grounded language about final judgment'
        });
      }
    });

    // Check for replacement theology
    const replacementTheologyPatterns = [
      /israel (?:has been|was) replaced by the church/i,
      /the church (?:is|has become) the new israel/i
    ];

    replacementTheologyPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        issues.push({
          type: 'replacement_theology',
          text: content.match(pattern)?.[0] || '',
          suggestion: 'Use language that respects continuity between Israel and the church'
        });
      }
    });

    return {
      hasIssues: issues.length > 0,
      issues
    };
  }

  /**
   * Apply content transformations for SDA alignment
   */
  static transformContent(content: string): string {
    let transformed = content;

    // Transform Sunday language to Sabbath
    transformed = transformed.replace(/come to church (this |on )?sunday/gi, 'gather in worship this Sabbath');
    transformed = transformed.replace(/celebrate (resurrection )?sunday/gi, 'celebrate the resurrection');
    transformed = transformed.replace(/sunday worship/gi, 'Sabbath worship');
    transformed = transformed.replace(/lord's day/gi, 'Sabbath');

    return transformed;
  }

  /**
   * Get SDA-specific cross-reference suggestions
   */
  static getSabbathReferences(): string[] {
    return [
      'Genesis 2:1-3',
      'Exodus 20:8-11',
      'Isaiah 58:13-14',
      'Mark 2:27-28',
      'Luke 4:16',
      'Hebrews 4:9-10',
      'Revelation 14:12'
    ];
  }

  static getSanctuaryReferences(): string[] {
    return [
      'Exodus 25:8-9',
      'Leviticus 16:1-34',
      'Hebrews 8:1-5',
      'Hebrews 9:11-12',
      'Hebrews 9:23-24',
      'Daniel 8:14',
      'Revelation 11:19'
    ];
  }

  static getPropheticReferences(): string[] {
    return [
      'Daniel 2:44',
      'Daniel 7:13-14',
      'Daniel 8:14',
      'Daniel 9:24-27',
      'Revelation 12:17',
      'Revelation 14:6-12',
      'Revelation 20:11-15'
    ];
  }

  /**
   * Build interpretive challenge framing for debated passages
   */
  static buildInterpretiveFrame(passage: string): string {
    const debatedPassages: Record<string, string> = {
      'Luke 16': 'This parable is interpreted differently across Christian traditions. Some view it as literal, while Adventist theology understands it as a parable using contemporary Jewish imagery, not a literal description of the afterlife.',
      'Ecclesiastes 9': 'Different traditions interpret the state of the dead differently. Adventist theology emphasizes the biblical language of "sleep" until resurrection.',
      '1 Thessalonians 4': 'While all Christians affirm the resurrection, traditions differ on the intermediate state. Adventist theology emphasizes the resurrection as the moment of reunion with Christ.',
      'Daniel 8': 'The 2300 days prophecy is understood differently across traditions. Adventist theology connects this to the investigative judgment beginning in 1844.',
      'Hebrews 8-10': 'The sanctuary theme is central to Adventist theology, understanding Christ\'s ministry in the heavenly sanctuary as ongoing.'
    };

    for (const [key, frame] of Object.entries(debatedPassages)) {
      if (passage.includes(key)) {
        return frame;
      }
    }

    return 'Different Christian traditions may interpret this passage differently. Consider multiple perspectives while remaining grounded in Scripture.';
  }

  /**
   * Get theological lens context for LLM prompts
   */
  static getLensContext(lens: 'adventist' | 'evangelical' | 'neutral' = 'adventist'): string {
    return THEOLOGICAL_LENS_CONTEXTS[lens];
  }
}
