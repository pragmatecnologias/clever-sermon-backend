export function parseJsonObjectFromLlm(raw: string): any {
  const candidates = buildCandidates(raw);
  let lastError: Error | null = null;

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (error: any) {
      lastError = error;
    }
  }

  // Last attempt: trim to largest parsable prefix ending with "}".
  const base = candidates[candidates.length - 1] || '';
  for (let i = base.lastIndexOf('}'); i > 1; i = base.lastIndexOf('}', i - 1)) {
    const prefix = base.slice(0, i + 1);
    const repaired = repairJson(prefix, true);
    try {
      return JSON.parse(repaired);
    } catch (error: any) {
      lastError = error;
    }
  }

  throw new Error(`Invalid JSON response from LLM${lastError ? `: ${lastError.message}` : ''}`);
}

function buildCandidates(raw: string): string[] {
  const extracted = extractLikelyJson(raw);
  const sanitized = sanitizeJson(extracted);
  const repaired = repairJson(sanitized, false);
  const repairedWithQuotedKeys = repairJson(
    repaired
      .replace(/([{,]\s*)([A-Za-z_][\w]*)(\s*:)/g, '$1"$2"$3')
      .replace(/:\s*'([^']*)'/g, ': "$1"'),
    true,
  );

  return uniqueNonEmpty([extracted, sanitized, repaired, repairedWithQuotedKeys]);
}

function extractLikelyJson(raw: string): string {
  const text = (raw || '').trim();
  if (!text) return '{}';

  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlock?.[1]) {
    return codeBlock[1].trim();
  }

  const firstBrace = text.indexOf('{');
  if (firstBrace === -1) return text;
  const lastBrace = text.lastIndexOf('}');
  if (lastBrace > firstBrace) return text.slice(firstBrace, lastBrace + 1);
  return text.slice(firstBrace);
}

function sanitizeJson(input: string): string {
  return (input || '')
    .replace(/^\uFEFF/, '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/([\[,]\s*)\{\s*\{/g, '$1{')
    .replace(/}\s*,\s*{\s*{/g, '},{')
    .replace(/}\s*}\s*,/g, '},')
    .trim();
}

function repairJson(input: string, closeStructures: boolean): string {
  let out = input;

  if (closeStructures) {
    const quoteCount = (out.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      out += '"';
    }

    const openBrackets = (out.match(/\[/g) || []).length;
    const closeBrackets = (out.match(/\]/g) || []).length;
    for (let i = 0; i < openBrackets - closeBrackets; i++) out += ']';

    const openBraces = (out.match(/\{/g) || []).length;
    const closeBraces = (out.match(/\}/g) || []).length;
    for (let i = 0; i < openBraces - closeBraces; i++) out += '}';
  }

  return out
    .replace(/,\s*,/g, ',')
    .replace(/,\s*([}\]])/g, '$1')
    .trim();
}

function uniqueNonEmpty(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const trimmed = (value || '').trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}
