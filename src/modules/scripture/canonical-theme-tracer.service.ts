import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';

export interface ThemeThread {
  theme: string;
  description: string;
  explanation: string;
  canonicalMovement: string;
  verses: ThemeVerse[];
  category: string;
  isPrimary?: boolean;
}

export interface ThemeVerse {
  reference: string;
  snippet: string;
  explanation: string;
  stage: 'foundation' | 'expansion' | 'echo' | 'fulfillment';
  testament: 'OT' | 'NT';
  era: 'Torah' | 'History' | 'Wisdom' | 'Prophets' | 'Gospels' | 'Acts' | 'Epistles' | 'Revelation';
}

export interface CanonicalThemesResponse {
  passage: string;
  themes: ThemeThread[];
  dataSource: 'llm-generated' | 'unavailable';
}

@Injectable()
export class CanonicalThemeTracerService {
  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService
  ) {}

  async getThemesForPassage(reference: string, language?: string, userId?: string): Promise<CanonicalThemesResponse> {
    try {
      // Fetch actual passage text to prevent LLM hallucination
      const translationCode = language === 'es' ? 'RVR1960' : 'KJV';
      let passageText = '';
      try {
        const result = await this.scriptureService.getPassage(reference, translationCode);
        if (result && result.verses && result.verses.length > 0) {
          passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
        }
      } catch (error) {
        console.error('Failed to fetch passage text for canonical themes:', error);
      }

      const prompt = this.buildPrompt(reference, passageText, language);
      const response = await this.llmService.generateCompletion(
        prompt,
        userId || 'system',
        {
          temperature: 0.4,
          maxTokens: 2500,
        }
      );

      const parsed = this.parseResponse(response, reference);
      return parsed;
    } catch (error) {
      console.error('Error generating canonical themes:', error);
      return {
        passage: reference,
        themes: [],
        dataSource: 'unavailable',
      };
    }
  }

  private buildPrompt(reference: string, passageText: string, language?: string): string {
    const languageInstruction = language === 'es'
      ? `CRITICAL INSTRUCTIONS:
1. You MUST respond ONLY in Spanish. Every field in the JSON must be in Spanish.
2. Do NOT use any English words in theme names, descriptions, explanations, or snippets.
3. Return ONLY the JSON object - no explanations, no markdown code blocks, no extra text.

INSTRUCCIONES CRÍTICAS:
1. Debes responder ÚNICAMENTE en español. Todos los campos del JSON deben estar en español.
2. NO uses NINGUNA palabra en inglés en nombres de temas, descripciones, explicaciones o fragmentos.
3. Devuelve SOLAMENTE el objeto JSON - sin explicaciones, sin bloques de código markdown, sin texto adicional.

`
      : 'Return ONLY the JSON object - no markdown, no extra text.\n\n';

    return `${languageInstruction}You are a biblical scholar identifying canonical themes that trace through Scripture.

Passage Reference: ${reference}

Passage Text:
${passageText || 'Text not available'}

Analyze this passage and identify 3-6 major theological themes that appear in this passage and trace their development across the Bible.

For each theme, provide:

1. **Theme Name** (e.g., "Divine Kingship", "Covenant Faithfulness", "Spirit Empowerment")
2. **Description** (1 sentence: what this theme is about)
3. **Explanation** (2-3 sentences: how this theme develops across Scripture)
4. **Canonical Movement** (e.g., "Genesis → Prophets → Gospels → Revelation")
5. **Category** (one of: covenant, sanctuary, kingdom, sacrifice, sabbath, remnant, prophecy, gospel, spirit, election, kingship, redemption, judgment, worship, faith, grace)
6. **Verses** (4-8 key passages showing the theme's development):
   - **reference**: Bible reference
   - **snippet**: Brief description of what happens
   - **explanation**: How this verse contributes to the theme
   - **stage**: foundation | expansion | echo | fulfillment
   - **testament**: OT | NT
   - **era**: Torah | History | Wisdom | Prophets | Gospels | Acts | Epistles | Revelation

**CRITICAL REQUIREMENTS:**
- Themes must be **theologically meaningful** (not generic like "Faith" or "God")
- Themes must show **canonical progression** (how the idea develops from OT to NT)
- Include the **current passage** in the verse list with "YOU ARE HERE" marker
- Verses should show **clear theological development**, not random associations
- Stage labels: foundation (earliest appearance), expansion (development), echo (later reaffirmation), fulfillment (NT realization)

Format your response as JSON:
{
  "themes": [
    {
      "theme": "...",
      "description": "...",
      "explanation": "...",
      "canonicalMovement": "...",
      "category": "...",
      "verses": [
        {
          "reference": "...",
          "snippet": "...",
          "explanation": "...",
          "stage": "...",
          "testament": "...",
          "era": "..."
        }
      ]
    }
  ]
}

Be theologically rigorous and show real canonical development.`;
  }

  private parseResponse(response: string, reference: string): CanonicalThemesResponse {
    try {
      // Extract JSON from response - try multiple patterns
      let jsonStr = '';
      
      // Try to find JSON block with code fence
      const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      } else {
        // Try to find raw JSON object - be greedy to catch truncated responses
        const jsonMatch = response.match(/\{[\s\S]*$/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        } else {
          throw new Error('No JSON found in response');
        }
      }

      // Repair truncated JSON by closing unclosed structures
      const openBraces = (jsonStr.match(/\{/g) || []).length;
      const closeBraces = (jsonStr.match(/\}/g) || []).length;
      const openBrackets = (jsonStr.match(/\[/g) || []).length;
      const closeBrackets = (jsonStr.match(/\]/g) || []).length;
      
      // Close unclosed strings first
      const quoteCount = (jsonStr.match(/(?<!\\)"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        jsonStr += '"';
      }
      
      // Close unclosed arrays
      for (let i = 0; i < openBrackets - closeBrackets; i++) {
        jsonStr += ']';
      }
      
      // Close unclosed objects
      for (let i = 0; i < openBraces - closeBraces; i++) {
        jsonStr += '}';
      }

      // Clean up common JSON issues from LLM responses
      jsonStr = jsonStr
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/,\s*$/, '') // Remove trailing comma at end
        .trim();

      let parsed: any;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('First parse attempt failed:', parseError.message);
        console.error('JSON string:', jsonStr.substring(0, 500));
        
        // Try to fix common issues and parse again
        jsonStr = jsonStr
          .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Quote unquoted keys
          .replace(/:\s*'([^']*)'/g, ': "$1"'); // Replace single quotes with double quotes
        
        parsed = JSON.parse(jsonStr);
      }

      // Handle Spanish field names (temas instead of themes)
      const themesArray = parsed.themes || parsed.temas;
      
      if (!themesArray || !Array.isArray(themesArray)) {
        throw new Error('Invalid themes structure - missing or invalid themes array');
      }

      // Mark first theme as primary and validate structure
      const themes: ThemeThread[] = themesArray
        .filter((theme: any) => theme && typeof theme === 'object')
        .map((theme: any, index: number) => ({
          theme: String(theme.theme || theme.tema || '').substring(0, 200),
          description: String(theme.description || theme.descripción || theme.descripcion || '').substring(0, 500),
          explanation: String(theme.explanation || theme.explicación || theme.explicacion || '').substring(0, 1000),
          canonicalMovement: String(theme.canonicalMovement || theme.movimientoCanónico || theme.movimientoCanonico || '').substring(0, 1000),
          verses: Array.isArray(theme.verses || theme.versículos || theme.versiculos) 
            ? (theme.verses || theme.versículos || theme.versiculos).slice(0, 10).map((v: any) => ({
                reference: String(v.reference || v.referencia || '').substring(0, 100),
                snippet: String(v.snippet || v.fragmento || '').substring(0, 200),
                era: String(v.era || '').substring(0, 100),
              }))
            : [],
          category: ['gospel', 'sanctuary', 'prophecy', 'covenant', 'law', 'salvation', 'gracia', 'grace'].includes(theme.category || theme.categoría || theme.categoria)
            ? (theme.category || theme.categoría || theme.categoria)
            : 'gospel',
          isPrimary: index === 0,
        }))
        .filter(theme => theme.theme && theme.description); // Only keep themes with required fields

      if (themes.length === 0) {
        throw new Error('No valid themes extracted from response');
      }

      return {
        passage: reference,
        themes: themes.slice(0, 6), // Limit to 6 themes
        dataSource: 'llm-generated',
      };
    } catch (error) {
      console.error('Error parsing canonical themes response:', error);
      console.error('Raw response:', response.substring(0, 500));
      return {
        passage: reference,
        themes: [],
        dataSource: 'unavailable',
      };
    }
  }

  async getThemeByName(themeName: string): Promise<ThemeThread | null> {
    // This method is no longer supported with LLM approach
    return null;
  }

  async getAllThemes(): Promise<ThemeThread[]> {
    // This method is no longer supported with LLM approach
    return [];
  }
}
