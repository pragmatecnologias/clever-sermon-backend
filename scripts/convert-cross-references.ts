import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: ts-node scripts/convert-cross-references.ts <input.txt> <output.txt>');
  process.exit(1);
}

const input = readFileSync(resolve(inputPath), 'utf-8');
const lines = input
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => line.replace(/[,;]+/g, ' '));

const outputLines: string[] = [];
for (const line of lines) {
  const parts = line.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    outputLines.push(`${parts[0]} ${parts[1]}`);
  }
}

writeFileSync(resolve(outputPath), `${outputLines.join('\n')}\n`);
console.log(`Wrote ${outputLines.length} cross references to ${outputPath}`);
