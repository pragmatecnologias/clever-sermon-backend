import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: ts-node scripts/convert-word-occurrences.ts <input.tsv> <output.json>');
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
    count: entry.count ? Number(entry.count) : undefined,
    verses: entry.verses ? entry.verses.split(';').map((value) => value.trim()).filter(Boolean) : [],
  };
}

writeFileSync(resolve(outputPath), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote ${Object.keys(data).length} word occurrence entries to ${outputPath}`);
