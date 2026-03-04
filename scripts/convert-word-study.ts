import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: ts-node scripts/convert-word-study.ts <input.tsv> <output.json>');
  process.exit(1);
}

const input = readFileSync(resolve(inputPath), 'utf-8').trim();
const [headerLine, ...rows] = input.split('\n');
const headers = headerLine.split('\t').map((header) => header.trim());

const data: Record<string, any> = {};

for (const row of rows) {
  if (!row.trim()) continue;
  const values = row.split('\t').map((value) => value.trim());
  const entry: Record<string, string> = {};
  headers.forEach((header, index) => {
    entry[header] = values[index] || '';
  });

  const key = (entry.word || '').toLowerCase();
  if (!key) continue;
  data[key] = {
    word: entry.word,
    language: entry.language,
    lemma: entry.lemma,
    strongs: entry.strongs,
    transliteration: entry.transliteration,
    definition: entry.definition,
    examples: entry.examples ? entry.examples.split(';').map((value) => value.trim()).filter(Boolean) : [],
    usageCount: entry.usageCount ? Number(entry.usageCount) : undefined,
    partOfSpeech: entry.partOfSpeech || undefined,
  };
}

writeFileSync(resolve(outputPath), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote ${Object.keys(data).length} word study entries to ${outputPath}`);
