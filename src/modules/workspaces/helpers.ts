/**
 * Helper methods for parsing LLM responses
 */

export class WorkspaceHelpers {
  private static cleanGeneratedString(value: any): string {
    if (value === null || value === undefined) return '';
    let cleaned = String(value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
      .replace(/\r\n/g, '\n')
      .trim();

    cleaned = cleaned
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\`/g, '`')
      .replace(/\s+/g, ' ')
      .trim();

    cleaned = cleaned.replace(/^[`"'“”‘’]+/, '').replace(/[`"'“”‘’]+$/, '').trim();
    cleaned = cleaned.replace(/\\+$/, '').replace(/,\s*$/, '').trim();

    return cleaned;
  }

  private static tryJsonParse(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  private static extractBalancedJsonSegment(text: string): string | null {
    const source = String(text || '');
    const startIndex = source.search(/[\{\[]/);
    if (startIndex < 0) return null;

    const openChar = source[startIndex];
    const closeChar = openChar === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escapeNext = false;

    for (let index = startIndex; index < source.length; index += 1) {
      const char = source[index];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;

      if (char === openChar) depth += 1;
      if (char === closeChar) {
        depth -= 1;
        if (depth === 0) {
          return source.slice(startIndex, index + 1);
        }
      }
    }

    return null;
  }

  private static stripTransportNoise(text: string): string {
    return String(text || '')
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .replace(/<\|[^|>]+?\|>/g, ' ')
      .replace(/^\s*(assistant|final|response)\s*[:\-]\s*/i, '')
      .replace(/\r\n/g, '\n')
      .trim();
  }

  private static decodeSerializedText(text: string): string {
    return String(text || '')
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\//g, '/')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, '\\')
      .replace(/\\u([0-9a-fA-F]{4})/g, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
      .trim();
  }

  private static extractQuotedJsonStringField(
    text: string,
    key: string,
  ): { value: string; closed: boolean } | null {
    const source = WorkspaceHelpers.stripTransportNoise(text);
    if (!source) return null;

    const keyPattern = new RegExp(`"${key}"\\s*:\\s*"`, 'i');
    const match = keyPattern.exec(source);
    if (!match) return null;

    let index = match.index + match[0].length;
    let escaped = false;
    let output = '';

    while (index < source.length) {
      const char = source[index];

      if (escaped) {
        output += `\\${char}`;
        escaped = false;
        index += 1;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        index += 1;
        continue;
      }

      if (char === '"') {
        return { value: WorkspaceHelpers.decodeSerializedText(output), closed: true };
      }

      output += char;
      index += 1;
    }

    return { value: WorkspaceHelpers.decodeSerializedText(output), closed: false };
  }

  private static extractLeadingHtmlFragment(text: string): string | null {
    const source = WorkspaceHelpers.decodeSerializedText(WorkspaceHelpers.stripTransportNoise(text));
    if (!source) return null;

    const tagMatch = source.match(/<(h2|h3|h4|p|ul|ol|li|blockquote|strong|em|br)\b/i);
    if (!tagMatch || typeof tagMatch.index !== 'number') return null;

    let fragment = source.slice(tagMatch.index).trim();
    fragment = fragment.replace(/(?:["']?\s*,\s*["']cues["']\s*:)[\s\S]*$/i, '').trim();
    fragment = fragment.replace(/["'}\]]+\s*$/, '').trim();

    return /<\/?(h2|h3|h4|p|ul|ol|li|blockquote|strong|em|br)\b/i.test(fragment) ? fragment : null;
  }

  static extractMalformedManuscriptPayload(
    text: string,
  ): { text: string; source: 'text-field' | 'html-fragment' | 'plain-text' } | null {
    const source = WorkspaceHelpers.stripTransportNoise(text);
    if (!source) return null;

    // Prefer full HTML fragment recovery first. This avoids early truncation when
    // malformed JSON contains unescaped quotes inside HTML attributes.
    const htmlFragment = WorkspaceHelpers.extractLeadingHtmlFragment(source);
    if (htmlFragment) {
      return {
        text: htmlFragment,
        source: 'html-fragment',
      };
    }

    const extractedTextField = WorkspaceHelpers.extractQuotedJsonStringField(source, 'text');
    if (extractedTextField?.value) {
      const value = extractedTextField.value.trim();
      if (value.length >= 24 || /<\/?(h2|h3|p|ul|ol|li|strong|em|br)\b/i.test(value)) {
        return {
          text: value,
          source: 'text-field',
        };
      }
    }

    let plainText = WorkspaceHelpers.decodeSerializedText(source)
      .replace(/^\s*\{\s*"text"\s*:\s*/i, '')
      .replace(/^"\s*/, '')
      .replace(/"\s*,\s*"cues"[\s\S]*$/i, '')
      .replace(/"\s*\}\s*$/i, '')
      .replace(/^\s*text\s*:\s*/i, '')
      .trim();

    if (!plainText || /^[{\[]/.test(plainText)) {
      return null;
    }

    return {
      text: plainText,
      source: 'plain-text',
    };
  }

  static pointText(point: any): string {
    if (typeof point === 'string') return WorkspaceHelpers.cleanGeneratedString(point);
    if (!point || typeof point !== 'object') return '';
    return WorkspaceHelpers.cleanGeneratedString(point.title || point.text || point.content || '');
  }

  static asStringArray(value: any, limit: number = 20): string[] {
    if (!Array.isArray(value)) return [];
    return value
      .map((item) => WorkspaceHelpers.pointText(item))
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, limit);
  }

  static extractOutlinePointTexts(structure: any): string[] {
    if (!structure || typeof structure !== 'object') return [];
    const points = WorkspaceHelpers.asStringArray(structure.points, 24);
    if (points.length > 0) return points;

    if (Array.isArray(structure.pointNodes)) {
      const fromNodes = WorkspaceHelpers.asStringArray(
        structure.pointNodes.map((node: any) => node?.title || node?.text || node?.content || ''),
        24,
      );
      if (fromNodes.length > 0) return fromNodes;
    }

    return WorkspaceHelpers.asStringArray(structure.mainPoints, 24);
  }

  static parseJsonSafe(text: string): any {
    const raw = WorkspaceHelpers.stripTransportNoise(text);
    if (!raw) return null;

    const candidates = new Set<string>();
    candidates.add(raw);

    const withoutCodeFence = raw
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .trim();
    if (withoutCodeFence) candidates.add(withoutCodeFence);

    const withoutModelTags = withoutCodeFence.replace(/<\|[^|>]+?\|>/g, '').trim();
    if (withoutModelTags) candidates.add(withoutModelTags);

    const withoutPrefixNoise = withoutModelTags
      .replace(/^\s*(assistant|final|response)\s*[:\-]\s*/i, '')
      .trim();
    if (withoutPrefixNoise) candidates.add(withoutPrefixNoise);

    // Some providers/models return JSON-like payloads with smart quotes.
    // Normalize quote punctuation so JSON parsing still succeeds.
    const smartQuoteNormalized = withoutPrefixNoise
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .trim();
    if (smartQuoteNormalized) candidates.add(smartQuoteNormalized);

    for (const candidate of candidates) {
      const parsed = WorkspaceHelpers.tryJsonParse(candidate);
      if (parsed) return parsed;
    }

    for (const candidate of candidates) {
      const segment = WorkspaceHelpers.extractBalancedJsonSegment(candidate);
      if (!segment) continue;
      const parsed = WorkspaceHelpers.tryJsonParse(segment);
      if (parsed) return parsed;
    }

    return null;
  }

  static parseListFromResponse(text: string): string[] {
    const lines = text.split('\n').filter(line => line.trim());
    const items: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip obvious JSON/object noise so malformed JSON does not become fake list items.
      if (/^[\{\}\[\],]+$/.test(trimmed)) continue;

      // Match numbered lists: 1. , 1) , or just lines
      const match = line.match(/^\s*(?:\d+[\.\)]\s*)?(.+)$/);
      const candidate = WorkspaceHelpers.cleanGeneratedString(match?.[1] || '');
      if (!candidate) continue;

      // Skip JSON-style key/value fragments such as:
      // "mediaSuggestions": [
      // "type": "Image"
      if (trimmed.startsWith('"') && trimmed.includes('":')) continue;
      if (/^[A-Za-z0-9_]+\s*:\s*[\[{]?\s*$/.test(candidate)) continue;

      if (candidate) {
        items.push(candidate);
      }
    }
    
    return items;
  }

  static parseOutlinePointsResponse(text: string, count: number): any[] {
    const parsed = WorkspaceHelpers.parseJsonSafe(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, count).map((variation: any, idx: number) => ({
        angle: variation?.angle || `Variation ${idx + 1}`,
        style: variation?.style || variation?.outlineType || '',
        theologicalEmphasis: variation?.theologicalEmphasis || '',
        audienceFocus: variation?.audienceFocus || '',
        sermonStructure: variation?.sermonStructure || '',
        points: WorkspaceHelpers.asStringArray(variation?.points || variation?.mainPoints, 8),
      }));
    }
    
    // Fallback: try to parse variations manually
    const variations: any[] = [];
    const sections = text.split(/Variation \d+:|Option \d+:/i);
    
    for (let i = 1; i < Math.min(sections.length, count + 1); i++) {
      const points = WorkspaceHelpers.parseListFromResponse(sections[i]).slice(0, 5);
      if (points.length > 0) {
        variations.push({
          angle: `Variation ${i}`,
          style: '',
          theologicalEmphasis: '',
          audienceFocus: '',
          sermonStructure: '',
          points
        });
      }
    }
    
    return variations;
  }

  static parseOutlineFromResponse(text: string): any {
    const structure: any = {
      introduction: '',
      points: [],
      conclusion: '',
      callToAction: ''
    };

    const introMatch = text.match(/INTRODUCTION:\s*([\s\S]*?)(?=POINT 1:|$)/i);
    if (introMatch) structure.introduction = introMatch[1].trim();

    const pointMatches = text.matchAll(/POINT (\d+):\s*([\s\S]*?)(?=POINT \d+:|CONCLUSION:|$)/gi);
    for (const match of pointMatches) {
      structure.points.push(match[2].trim());
    }

    const conclusionMatch = text.match(/CONCLUSION:\s*([\s\S]*?)(?=CALL TO ACTION:|$)/i);
    if (conclusionMatch) structure.conclusion = conclusionMatch[1].trim();

    const callMatch = text.match(/CALL TO ACTION:\s*([\s\S]*?)$/i);
    if (callMatch) structure.callToAction = callMatch[1].trim();

    return structure.points.length > 0 ? structure : null;
  }

  static normalizeOutlineData(data: any): any {
    if (!data) return null;
    const normalizedPoints = WorkspaceHelpers.extractOutlinePointTexts(data);

    const pointNodes = Array.isArray(data.pointNodes)
      ? data.pointNodes
          .map((point: any, idx: number) => ({
            id: String(point?.id || `point-${idx + 1}`),
            level: Number(point?.level) || 1,
            title: WorkspaceHelpers.pointText(point),
            slideTitle: typeof point?.slideTitle === 'string' ? point.slideTitle.replace(/^"|"$/g, '').trim() : '',
            summary: typeof point?.summary === 'string' ? point.summary.trim() : '',
            movement: typeof point?.movement === 'string' ? point.movement.trim() : '',
            supportingVerses: WorkspaceHelpers.asStringArray(point?.supportingVerses || point?.verses, 10),
            canonicalThemes: WorkspaceHelpers.asStringArray(point?.canonicalThemes || point?.themes, 8),
            crossReferences: WorkspaceHelpers.asStringArray(point?.crossReferences || point?.crossRefs, 10),
            subpoints: WorkspaceHelpers.asStringArray(point?.subpoints || point?.children, 10),
            applications: WorkspaceHelpers.asStringArray(point?.applications || point?.applicationIdeas, 16),
            discussionQuestions: WorkspaceHelpers.asStringArray(point?.discussionQuestions || point?.questions, 16),
            illustrationIdeas: WorkspaceHelpers.asStringArray(point?.illustrationIdeas || point?.illustrations, 16),
            mediaSuggestions: WorkspaceHelpers.asStringArray(point?.mediaSuggestions || point?.media, 16),
            egwSupport: Array.isArray(point?.egwSupport)
              ? point.egwSupport
                  .map((item: any) => ({
                    citation: typeof item?.citation === 'string' ? item.citation.trim() : '',
                    quote: typeof item?.quote === 'string' ? item.quote.trim() : '',
                    relevance: typeof item?.relevance === 'string' ? item.relevance.trim() : '',
                  }))
                  .filter((item: any) => item.citation || item.quote || item.relevance)
                  .slice(0, 6)
              : [],
            references: WorkspaceHelpers.asStringArray(point?.references || point?.explorationReferences, 8),
            notes: typeof point?.notes === 'string' ? point.notes.trim() : '',
          }))
          .filter((point: any) => point.title)
      : [];

    return {
      introduction: data.introduction || data.intro || '',
      points: normalizedPoints,
      pointNodes,
      outlineType: data.outlineType || data.style || '',
      sermonMovement: data.sermonMovement || data.movement || '',
      slidePlan: WorkspaceHelpers.asStringArray(data.slidePlan || data.slides, 20),
      workflowTags: WorkspaceHelpers.asStringArray(data.workflowTags || data.pipelineTags, 12),
      conclusion: data.conclusion || '',
      callToAction: data.callToAction || data.call_to_action || data.cta || ''
    };
  }

  static parseIllustrationsFromResponse(text: string): any[] {
    const parsed = WorkspaceHelpers.parseJsonSafe(text);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && typeof parsed === 'object') {
      const fromObject =
        (Array.isArray((parsed as any).illustrations) && (parsed as any).illustrations) ||
        (Array.isArray((parsed as any).items) && (parsed as any).items) ||
        (Array.isArray((parsed as any).data) && (parsed as any).data) ||
        [];
      if (fromObject.length > 0) {
        return fromObject;
      }
    }

    const items: any[] = [];
    const sections = text.split(/(?:Illustration|Example) \d+:/i);
    
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i].trim();
      const titleMatch = section.match(/^([^\n]+)/);
      const verseMatch = section.match(/\(([^)]+\d+:\d+[^)]*)\)/);
      
      items.push({
        title: titleMatch ? titleMatch[1].trim() : `Illustration ${i}`,
        content: section,
        verseReference: verseMatch ? verseMatch[1] : null
      });
    }

    if (items.length > 0) return items;

    const listItems = WorkspaceHelpers.parseListFromResponse(text);
    if (listItems.length > 0) {
      return listItems.map((entry, index) => {
        const verseMatch = entry.match(/\(([^)]+\d+:\d+[^)]*)\)/);
        const content = entry.replace(/\(([^)]+\d+:\d+[^)]*)\)/, '').trim();
        return {
          title: `Illustration ${index + 1}`,
          content: content || entry,
          verseReference: verseMatch ? verseMatch[1] : null,
        };
      });
    }

    return [];
  }

  static parseCitationsFromResponse(text: string): any[] {
    const items: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const verseMatch = line.match(/\(([^)]+\d+:\d+[^)]*)\)/);
      const statement = line.replace(/^\s*\d+[\.\)]\s*/, '').replace(/\([^)]+\)/, '').trim();
      
      if (statement) {
        items.push({
          statementType: 'observation',
          statement,
          verseReferences: verseMatch ? [verseMatch[1]] : []
        });
      }
    }
    
    return items;
  }

  static logLlmOutput(type: string, output: string): void {
    if (process.env.LOG_LLM_REQUESTS === 'true') {
      console.log(`[LLM ${type}]:`, output.substring(0, 500));
    }
  }
}
