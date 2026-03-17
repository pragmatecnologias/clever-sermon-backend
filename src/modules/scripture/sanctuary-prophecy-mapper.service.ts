import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { ScriptureCacheService } from './scripture-cache.service';
import { parseJsonObjectFromLlm } from './json-response.util';

export interface SanctuaryConnection {
  sourcePassage: string;
  targetPassages: string[];
  connectionType: 'type_antitype' | 'parallel' | 'fulfillment' | 'thematic';
  description: string;
}

export interface ProphecyConnection {
  passage: string;
  connectedPassages: string[];
  theme: string;
  description: string;
}

@Injectable()
export class SanctuaryProphecyMapperService {
  private bookAliasMap = new Map<string, string>([
    ['efesios', 'ephesians'],
    ['hebreos', 'hebrews'],
    ['apocalipsis', 'revelation'],
    ['levitico', 'leviticus'],
    ['éxodo', 'exodus'],
    ['exodo', 'exodus'],
    ['daniel', 'daniel'],
  ]);

  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService,
    private cacheService: ScriptureCacheService,
  ) {}

  async getSanctuaryConnections(passage: string, language: string = 'en', userId: string = 'system'): Promise<SanctuaryConnection[]> {
    const normalizedPassage = this.normalizePassageForCache(passage);
    const cached = await this.cacheService.getSanctuaryConnections(normalizedPassage, language);
    if (Array.isArray(cached)) {
      const sanitizedCached = cached
        .map((item) => this.sanitizeSanctuaryConnection(item))
        .filter((item): item is SanctuaryConnection => !!item);
      if (sanitizedCached.length > 0) {
        return sanitizedCached;
      }
    }

    const response = await this.getConnectionsFromLlm('sanctuary', passage, language, userId);
    const connections = this.parseSanctuaryConnectionsResponse(response);
    if (connections.length === 0) {
      throw new Error('No valid sanctuary connections were generated for this passage.');
    }
    await this.cacheService.setSanctuaryConnections(normalizedPassage, language, connections);
    return connections;
  }

  async getProphecyConnections(passage: string, language: string = 'en', userId: string = 'system'): Promise<ProphecyConnection[]> {
    const normalizedPassage = this.normalizePassageForCache(passage);
    const cached = await this.cacheService.getProphecyConnections(normalizedPassage, language);
    if (Array.isArray(cached)) {
      const sanitizedCached = cached
        .map((item) => this.sanitizeProphecyConnection(item))
        .filter((item): item is ProphecyConnection => !!item);
      if (sanitizedCached.length > 0) {
        return sanitizedCached;
      }
    }

    const response = await this.getConnectionsFromLlm('prophecy', passage, language, userId);
    const connections = this.parseProphecyConnectionsResponse(response);
    if (connections.length === 0) {
      throw new Error('No valid prophecy connections were generated for this passage.');
    }
    await this.cacheService.setProphecyConnections(normalizedPassage, language, connections);
    return connections;
  }

  getAllSanctuaryThreads(): SanctuaryConnection[] {
    return [];
  }

  getAllProphecyThreads(): ProphecyConnection[] {
    return [];
  }

  private normalizeBookName(book: string): string {
    const cleaned = String(book || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return this.bookAliasMap.get(cleaned) || cleaned;
  }

  private toCanonicalBookChapter(passage: string): string {
    const match = String(passage || '').match(/^([\wÀ-ÿ\s]+)\s+(\d+)/);
    if (!match) {
      return this.normalizeBookName(passage).replace(/\s+/g, '-');
    }
    const book = this.normalizeBookName(match[1]);
    const chapter = match[2];
    return `${book}-${chapter}`;
  }

  private normalizePassageForCache(passage: string): string {
    const canonical = this.toCanonicalBookChapter(passage);
    return canonical || String(passage || '').trim().toLowerCase();
  }

  private async getConnectionsFromLlm(
    mode: 'sanctuary' | 'prophecy',
    passage: string,
    language: string,
    userId: string,
  ): Promise<string> {
    const translationCode = language === 'es' ? 'RVR1960' : 'KJV';
    let passageText = '';

    try {
      const result = await this.scriptureService.getPassage(passage, translationCode);
      if (result && Array.isArray(result.verses) && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error: any) {
      console.error(`[SanctuaryProphecyMapper] Failed to fetch passage text for ${passage}:`, error?.message || error);
    }

    const prompt = this.buildPrompt(mode, passage, passageText, language);
    let lastParseError: Error | null = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      const attemptPrompt =
        attempt === 1
          ? prompt
          : `${prompt}\n\nCRITICAL: Your previous response was invalid or truncated. Return strict valid JSON only, no markdown.`;
      const response = await this.llmService.generateCompletion(attemptPrompt, userId || 'system', {
        temperature: 0.25,
        maxTokens: 1600,
      });

      try {
        if (mode === 'sanctuary') {
          const parsed = this.parseSanctuaryConnectionsResponse(response);
          if (parsed.length > 0) return response;
        } else {
          const parsed = this.parseProphecyConnectionsResponse(response);
          if (parsed.length > 0) return response;
        }
      } catch (error: any) {
        lastParseError = error;
      }
    }

    if (lastParseError) {
      throw new Error(`LLM response parsing failed: ${lastParseError.message}`);
    }
    throw new Error('LLM did not return usable connection data.');
  }

  private buildPrompt(mode: 'sanctuary' | 'prophecy', passage: string, passageText: string, language: string): string {
    const languageInstruction =
      language === 'es'
        ? 'Responde solo en español, con JSON válido y sin markdown.'
        : 'Respond in English only, with valid JSON and no markdown.';

    if (mode === 'sanctuary') {
      return `${languageInstruction}

You are a Seventh-day Adventist biblical theologian.
Task: Generate sanctuary connections for the passage below, following Adventist doctrine only.
Do not use non-Adventist interpretive frameworks.
Ground every connection in explicit Scripture references.

Passage: ${passage}
Passage Text:
${passageText || 'Text not available'}

Return JSON exactly in this shape:
{
  "connections": [
    {
      "sourcePassage": "Book X:Y-Z",
      "targetPassages": ["Book A:B-C", "Book D:E-F"],
      "connectionType": "type_antitype|parallel|fulfillment|thematic",
      "description": "1-2 sentences, Adventist framing only"
    }
  ]
}

Rules:
- Return 1 to 5 connections.
- Keep description concise and specific.
- Use only canonical Bible references.
- connectionType must be one of: type_antitype, parallel, fulfillment, thematic.
- No extra fields.`;
    }

    return `${languageInstruction}

You are a Seventh-day Adventist biblical theologian.
Task: Generate prophecy connections for the passage below, following Adventist doctrine only.
Do not use non-Adventist interpretive frameworks.
Ground every connection in explicit Scripture references.

Passage: ${passage}
Passage Text:
${passageText || 'Text not available'}

Return JSON exactly in this shape:
{
  "connections": [
    {
      "passage": "Book X:Y-Z",
      "connectedPassages": ["Book A:B-C", "Book D:E-F"],
      "theme": "short Adventist prophetic theme",
      "description": "1-2 sentences, Adventist framing only"
    }
  ]
}

Rules:
- Return 1 to 5 connections.
- Keep theme and description concise and specific.
- Use only canonical Bible references.
- No extra fields.`;
  }

  private parseSanctuaryConnectionsResponse(response: string): SanctuaryConnection[] {
    const parsed = parseJsonObjectFromLlm(response);
    const items = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.connections)
        ? parsed.connections
        : Array.isArray(parsed?.data)
          ? parsed.data
          : [];
    if (!Array.isArray(items)) return [];

    return items
      .map((item: any) => this.sanitizeSanctuaryConnection(item))
      .filter((item): item is SanctuaryConnection => !!item)
      .slice(0, 5);
  }

  private parseProphecyConnectionsResponse(response: string): ProphecyConnection[] {
    const parsed = parseJsonObjectFromLlm(response);
    const items = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.connections)
        ? parsed.connections
        : Array.isArray(parsed?.data)
          ? parsed.data
          : [];
    if (!Array.isArray(items)) return [];

    return items
      .map((item: any) => this.sanitizeProphecyConnection(item))
      .filter((item): item is ProphecyConnection => !!item)
      .slice(0, 5);
  }

  private sanitizeSanctuaryConnection(raw: any): SanctuaryConnection | null {
    if (!raw || typeof raw !== 'object') return null;
    const sourcePassage = String(raw.sourcePassage || raw.passage || '').trim().slice(0, 120);
    const targetPassages = Array.isArray(raw.targetPassages)
      ? raw.targetPassages.map((x: any) => String(x || '').trim()).filter(Boolean).slice(0, 12)
      : [];
    const description = String(raw.description || '').trim().slice(0, 600);
    const allowedTypes = new Set(['type_antitype', 'parallel', 'fulfillment', 'thematic']);
    const connectionTypeRaw = String(raw.connectionType || '').trim();
    const connectionType = allowedTypes.has(connectionTypeRaw) ? (connectionTypeRaw as SanctuaryConnection['connectionType']) : 'thematic';

    if (!sourcePassage || !description) return null;
    return {
      sourcePassage,
      targetPassages,
      connectionType,
      description,
    };
  }

  private sanitizeProphecyConnection(raw: any): ProphecyConnection | null {
    if (!raw || typeof raw !== 'object') return null;
    const passage = String(raw.passage || raw.sourcePassage || '').trim().slice(0, 120);
    const connectedPassages = Array.isArray(raw.connectedPassages)
      ? raw.connectedPassages.map((x: any) => String(x || '').trim()).filter(Boolean).slice(0, 12)
      : [];
    const theme = String(raw.theme || '').trim().slice(0, 160);
    const description = String(raw.description || '').trim().slice(0, 600);

    if (!passage || !theme || !description) return null;
    return {
      passage,
      connectedPassages,
      theme,
      description,
    };
  }
}
