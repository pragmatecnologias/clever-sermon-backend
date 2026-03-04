/**
 * Helper methods for parsing LLM responses
 */

export class WorkspaceHelpers {
  static parseJsonSafe(text: string): any {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Try direct JSON parse
      return JSON.parse(text);
    } catch {
      return null;
    }
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
    const parsed = this.parseJsonSafe(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, count);
    }
    
    // Fallback: try to parse variations manually
    const variations: any[] = [];
    const sections = text.split(/Variation \d+:|Option \d+:/i);
    
    for (let i = 1; i < Math.min(sections.length, count + 1); i++) {
      const points = this.parseListFromResponse(sections[i]).slice(0, 5);
      if (points.length > 0) {
        variations.push({
          angle: `Variation ${i}`,
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
    
    return {
      introduction: data.introduction || data.intro || '',
      points: Array.isArray(data.points) ? data.points : 
              Array.isArray(data.mainPoints) ? data.mainPoints : [],
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
