import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ScriptureService } from './scripture.service';
import { ScripturePrompts } from './scripture-prompts';
import { buildFallbackInterpretiveChallenge } from './scripture-fallbacks';
import { GeneratedStudyOutputValidator } from './generated-study-output.validator';

export interface InterpretiveChallenge {
  passage: string;
  challenge: string;
  views: InterpretiveView[];
  sdaPerspective?: SDAPerspective;
  dataSource: 'llm-generated' | 'curated' | 'unavailable';
  status?: 'ready' | 'not_generated' | 'unavailable';
  message?: string;
  warnings?: string[];
}

export interface InterpretiveView {
  viewName: string;
  summary: string;
  proponents?: string;
  keyArguments: string[];
}

export interface SDAPerspective {
  position: string;
  reasoning: string;
  supportingTexts?: string[];
}

@Injectable()
export class InterpretiveChallengesDataService {
  private readonly logger = new Logger(InterpretiveChallengesDataService.name);
  private challengeIndex: Map<string, InterpretiveChallenge> = new Map();

  constructor(
    private llmService: LlmService,
    private scriptureService: ScriptureService,
    private generatedStudyOutputValidator: GeneratedStudyOutputValidator,
  ) {
    this.initializeChallengeData();
  }

  async getInterpretiveChallenge(passage: string, language?: string): Promise<InterpretiveChallenge | null> {
    if (!passage || !passage.trim()) {
      this.logger.warn(`Missing passage parameter for interpretive challenge request (language=${language || 'en'})`);
      return this.buildUnavailableChallenge(passage || '', language || 'en', 'missing_passage');
    }

    const normalized = this.normalizePassage(passage);
    const challenge = this.challengeIndex.get(normalized);
    
    if (challenge) {
      return { ...challenge, dataSource: 'curated', status: 'ready', warnings: [] };
    }

    // Generate interpretive challenges using LLM
    try {
      const passageText = await this.fetchPassageText(passage, language || 'en');
      const generated = await this.generateInterpretiveChallenge(passage, language || 'en', passageText);
      return generated;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to generate interpretive challenge for "${passage}" (language=${language || 'en'}): ${message}`,
        error instanceof Error ? error.stack : undefined,
      );
      const passageText = await this.fetchPassageText(passage, language || 'en');
      const computed = buildFallbackInterpretiveChallenge(passage, passageText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }
  }

  private async fetchPassageText(passage: string, language?: string): Promise<string> {
    const analysisTranslation = language === 'es' ? 'RVR1960' : 'KJV';
    let passageText = '';
    try {
      const result = await this.scriptureService.getPassage(passage, analysisTranslation);
      if (result && result.verses && result.verses.length > 0) {
        passageText = result.verses.map((v: any) => `${v.reference}: ${v.text}`).join('\n');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to fetch passage text for interpretive challenges (${passage}, ${analysisTranslation}): ${message}`,
      );
    }
    return passageText;
  }

  private async generateInterpretiveChallenge(passage: string, language?: string, passageText = ''): Promise<InterpretiveChallenge> {
    const resolvedPassageText = passageText || await this.fetchPassageText(passage, language);

    const languageInstruction = language === 'es'
      ? 'Responde únicamente en español. No uses inglés en ningún campo de texto de la respuesta.'
      : 'Respond in English.';
    
    const prompt = ScripturePrompts.interpretiveChallengesData({
      languageInstruction,
      passage,
      passageText: resolvedPassageText || 'Text not available',
    });

    const response = await this.llmService.generateCompletion(prompt, 'system', {
      temperature: 0.3,
      maxTokens: 3000,
      timeoutMs: 12000,
    });

    if (!response || !response.trim()) {
      const computed = buildFallbackInterpretiveChallenge(passage, resolvedPassageText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }

    let parsed: any;
    try {
      parsed = this.parseInterpretiveChallengeJson(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to parse interpretive challenge JSON for "${passage}": ${message}`);
      const salvaged = this.salvageInterpretiveChallengeFromRaw(response);
      if (salvaged) {
        this.logger.warn(`Using salvaged interpretive challenge payload for "${passage}"`);
        parsed = salvaged;
      } else {
        const computed = buildFallbackInterpretiveChallenge(passage, resolvedPassageText, language || 'en');
        return {
          ...computed,
          dataSource: 'curated',
          status: 'ready',
          warnings: [],
        };
      }
    }

    // Handle Spanish field names (desafío, vistas, perspectivaSDA)
    const challenge = parsed.challenge || parsed.desafío || parsed.desafio;
    const views = parsed.views || parsed.vistas || [];
    const sdaPerspective = parsed.sdaPerspective || parsed.perspectivaSDA;

    // Normalize views structure (handle Spanish field names)
    const normalizedViews = views
      .map((view: any) => ({
        viewName: view.viewName || view.nombreVista || view.nombre || '',
        summary: view.summary || view.resumen || '',
        proponents: view.proponents || view.proponentes || '',
        keyArguments: this.normalizeKeyArguments(
          view.keyArguments || view.argumentosClave || view.argumentos || [],
        ),
      }))
      .filter((view: InterpretiveView) => view.viewName && view.summary && view.keyArguments.length > 0);

    if (!challenge || normalizedViews.length === 0) {
      const computed = buildFallbackInterpretiveChallenge(passage, resolvedPassageText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }

    // Normalize SDA perspective (handle Spanish field names)
    const normalizedSdaPerspective = sdaPerspective ? {
      position: sdaPerspective.position || sdaPerspective.posición || sdaPerspective.posicion || '',
      reasoning: sdaPerspective.reasoning || sdaPerspective.razonamiento || '',
      supportingTexts: sdaPerspective.supportingTexts || sdaPerspective.textosDeApoyo || sdaPerspective.textos || [],
    } : undefined;

    if (
      !challenge ||
      normalizedViews.length < 3 ||
      normalizedViews.some((view: InterpretiveView) => String(view.summary || '').trim().length < 20 || view.keyArguments.length < 2) ||
      this.isWeakChallenge(challenge, normalizedViews, passage)
    ) {
      const computed = buildFallbackInterpretiveChallenge(passage, resolvedPassageText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }

    const candidate = {
      passage,
      challenge,
      views: normalizedViews,
      sdaPerspective: normalizedSdaPerspective,
      dataSource: 'llm-generated' as const,
    };
    const validation = this.generatedStudyOutputValidator.validate('interpretive-challenges', candidate, { reference: passage, language });
    if (!validation.valid) {
      const computed = buildFallbackInterpretiveChallenge(passage, resolvedPassageText, language || 'en');
      return {
        ...computed,
        dataSource: 'curated',
        status: 'ready',
        warnings: [],
      };
    }

    return {
      ...candidate,
      status: 'ready',
      warnings: [],
    };
  }

  private normalizePassage(passage: string): string {
    return passage.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private parseInterpretiveChallengeJson(raw: string): any {
    let jsonStr = raw.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    } else {
      const jsonMatch = jsonStr.match(/{[\s\S]*}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
    }

    const sanitize = (input: string) =>
      input
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/^\uFEFF/, '')
        // Fix malformed sequence seen in logs: ...],"},{"viewName...
        .replace(/,\s*"\s*}/g, '}')
        .replace(/\],\s*"\s*}\s*,\s*{/g, ']},{')
        .replace(/\],\s*"\s*}\s*,\s*{\s*"viewName"/g, ']},{"viewName"')
        .replace(/\],\s*}\s*,\s*{/g, ']},{')
        .replace(/\],\s*}\s*,\s*"/g, ']},"')
        .replace(/}\s*,\s*"\s*viewName"/g, '},{"viewName"')
        .replace(/}\s*,\s*,\s*{/g, '},{')
        .replace(/\},\s*\]/g, '}]')
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/,\s*"sdaPerspective"\s*:/g, ',"sdaPerspective":')
        .replace(/,\s*"perspectivaSDA"\s*:/g, ',"perspectivaSDA":')
        .trim();

    const primary = sanitize(jsonStr);
    try {
      return JSON.parse(primary);
    } catch {
      const repaired = sanitize(
        primary
          .replace(/([{,]\s*)([A-Za-z_][\w]*)(\s*:)/g, '$1"$2"$3')
          .replace(/:\s*'([^']*)'/g, ': "$1"'),
      );
      try {
        return JSON.parse(repaired);
      } catch {
        // Last pass: aggressively normalize broken object boundaries in views arrays.
        const aggressive = sanitize(
          repaired
            .replace(/\],\s*"\s*}\s*,\s*{\s*"/g, ']},{"')
            .replace(/\],\s*}\s*,\s*{\s*"/g, ']},{"')
            .replace(/}\s*,\s*"\s*}\s*,\s*{/g, '}},{')
            .replace(/"\s*}\s*,\s*{\s*"/g, '"},{"')
            .replace(/"\s*}\s*,\s*"sdaPerspective"/g, '"},"sdaPerspective"')
            .replace(/"\s*}\s*,\s*"perspectivaSDA"/g, '"},"perspectivaSDA"')
            .replace(/,\s*,/g, ','),
        );
        return JSON.parse(aggressive);
      }
    }
  }

  private salvageInterpretiveChallengeFromRaw(raw: string): any | null {
    const payloadMatch = raw.match(/{[\s\S]*}/);
    if (!payloadMatch) return null;
    const payload = payloadMatch[0];
    const repaired = payload
      .replace(/\],"\},\{"viewName"/g, ']},{"viewName"')
      .replace(/\],"\},\s*\{/g, ']},{')
      .replace(/"\}\],\s*"sdaPerspective"/g, '"]},"sdaPerspective"')
      .replace(/,\s*,/g, ',');

    const challenge =
      this.extractJsonStringField(repaired, 'challenge') ||
      this.extractJsonStringField(repaired, 'desafío') ||
      this.extractJsonStringField(repaired, 'desafio');
    if (!challenge) return null;

    const viewRegex =
      /\{\s*"viewName"\s*:\s*"((?:\\.|[^"\\])*)"\s*,\s*"summary"\s*:\s*"((?:\\.|[^"\\])*)"(?:\s*,\s*"proponents"\s*:\s*"((?:\\.|[^"\\])*)")?[\s\S]*?"keyArguments"\s*:\s*\[([\s\S]*?)\]\s*\}/g;
    const views: any[] = [];
    let match: RegExpExecArray | null;
    while ((match = viewRegex.exec(repaired)) !== null) {
      const keyArgumentsRaw = match[4] || '';
      const keyArguments = this.normalizeKeyArguments(
        Array.from(keyArgumentsRaw.matchAll(/"((?:\\.|[^"\\])*)"/g))
        .map((item) => this.unescapeJsonString(item[1]))
        .filter(Boolean),
      );
      views.push({
        viewName: this.unescapeJsonString(match[1]),
        summary: this.unescapeJsonString(match[2]),
        proponents: this.unescapeJsonString(match[3] || ''),
        keyArguments,
      });
    }

    const supportingTextsRaw =
      repaired.match(/"supportingTexts"\s*:\s*\[([\s\S]*?)\]/)?.[1] ||
      repaired.match(/"textosDeApoyo"\s*:\s*\[([\s\S]*?)\]/)?.[1] ||
      '';
    const supportingTexts = Array.from(supportingTextsRaw.matchAll(/"((?:\\.|[^"\\])*)"/g))
      .map((item) => this.unescapeJsonString(item[1]))
      .filter(Boolean);

    const sdaPerspective = {
      position:
        this.extractJsonStringField(repaired, 'position') ||
        this.extractJsonStringField(repaired, 'posición') ||
        this.extractJsonStringField(repaired, 'posicion') ||
        '',
      reasoning:
        this.extractJsonStringField(repaired, 'reasoning') ||
        this.extractJsonStringField(repaired, 'razonamiento') ||
        '',
      supportingTexts,
    };

    return {
      challenge,
      views,
      sdaPerspective: sdaPerspective.position || sdaPerspective.reasoning || supportingTexts.length ? sdaPerspective : undefined,
    };
  }

  private extractJsonStringField(input: string, fieldName: string): string {
    const escapedField = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`"${escapedField}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`);
    const match = input.match(regex);
    if (!match) return '';
    return this.unescapeJsonString(match[1]);
  }

  private unescapeJsonString(input: string): string {
    if (!input) return '';
    try {
      return JSON.parse(`"${input}"`);
    } catch {
      return input
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\');
    }
  }

  private normalizeKeyArguments(input: any): string[] {
    const rawValues: string[] = [];

    if (Array.isArray(input)) {
      for (const item of input) {
        if (typeof item === 'string') {
          rawValues.push(item);
          continue;
        }
        if (item && typeof item === 'object') {
          for (const value of Object.values(item)) {
            if (typeof value === 'string') {
              rawValues.push(value);
            }
          }
        }
      }
    } else if (typeof input === 'string') {
      rawValues.push(input);
    }

    const cleaned = rawValues
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .filter((value) => !/^(argument|argumento)s?:?$/i.test(value));

    return Array.from(new Set(cleaned));
  }

  private initializeChallengeData() {
    // Reserved for future curated high-priority passages
    // All other passages will be dynamically generated via LLM
  }

  hasInterpretiveChallenge(passage: string): boolean {
    const normalized = this.normalizePassage(passage);
    return this.challengeIndex.has(normalized);
  }

  getAllAvailablePassages(): string[] {
    return Array.from(this.challengeIndex.keys());
  }

  private buildUnavailableChallenge(passage: string, language: string, reason: string): InterpretiveChallenge {
    return {
      passage,
      challenge: '',
      views: [],
      dataSource: 'unavailable',
      status: 'unavailable',
      message: reason,
      warnings: [reason],
      sdaPerspective: undefined,
    };
  }

  private isWeakChallenge(challenge: string, views: InterpretiveView[], passage: string): boolean {
    const serialized = JSON.stringify({ challenge, views }).toLowerCase();
    if (serialized.includes('generic filler')) return true;
    if (serialized.includes('text fidelity') && serialized.includes('pastoral application') && !serialized.includes('verse')) return true;
    if (serialized.includes('gospel harmony') && !serialized.includes('psalm') && passage.toLowerCase().includes('psalm')) return true;
    return false;
  }

}
