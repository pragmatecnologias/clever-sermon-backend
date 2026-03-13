/**
 * Helper methods for parsing LLM responses
 */

export class WorkspaceHelpers {
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

  static pointText(point: any): string {
    if (typeof point === 'string') return point.trim();
    if (!point || typeof point !== 'object') return '';
    return String(point.title || point.text || point.content || '').trim();
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
    const raw = String(text || '').trim();
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
      // Match numbered lists: 1. , 1) , or just lines
      const match = line.match(/^\s*(?:\d+[\.\)]\s*)?(.+)$/);
      if (match && match[1].trim()) {
        items.push(match[1].trim());
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
            summary: typeof point?.summary === 'string' ? point.summary.trim() : '',
            movement: typeof point?.movement === 'string' ? point.movement.trim() : '',
            supportingVerses: WorkspaceHelpers.asStringArray(point?.supportingVerses || point?.verses, 10),
            canonicalThemes: WorkspaceHelpers.asStringArray(point?.canonicalThemes || point?.themes, 8),
            crossReferences: WorkspaceHelpers.asStringArray(point?.crossReferences || point?.crossRefs, 10),
            subpoints: WorkspaceHelpers.asStringArray(point?.subpoints || point?.children, 10),
            applications: WorkspaceHelpers.asStringArray(point?.applications || point?.applicationIdeas, 8),
            discussionQuestions: WorkspaceHelpers.asStringArray(point?.discussionQuestions || point?.questions, 8),
            illustrationIdeas: WorkspaceHelpers.asStringArray(point?.illustrationIdeas || point?.illustrations, 6),
            mediaSuggestions: WorkspaceHelpers.asStringArray(point?.mediaSuggestions || point?.media, 6),
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
    
    return items.length > 0 ? items : [];
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
