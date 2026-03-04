import { promises as fs } from 'fs';
import { resolve } from 'path';

const inputPath = process.argv[2] || 'data/openbible-cross-references.txt';
const outputPath = process.argv[3] || 'data/cross-reference-categories.json';

const normalize = (value: string) => value.trim().replace(/\s+/g, '').replace(':', '.');

const getBook = (reference: string) => {
  const match = reference.match(/^(.*?)\d/);
  return match ? match[1].trim().toLowerCase() : '';
};

const getChapter = (reference: string) => {
  const match = reference.match(/(\d+)\.?\d*/);
  return match ? match[1] : '';
};

(async () => {
  const input = await fs.readFile(resolve(inputPath), 'utf-8');
  const lines = input.split('\n').map((line) => line.trim()).filter(Boolean);
  const categories: Record<string, string> = {};

  for (const line of lines) {
    const [source, target] = line.split(/\s+/);
    if (!source || !target) continue;
    const normalizedSource = normalize(source);
    const normalizedTarget = normalize(target);
    const sourceBook = getBook(source);
    const targetBook = getBook(target);
    const sourceChapter = getChapter(source);
    const targetChapter = getChapter(target);

    let category = 'thematic_echo';
    if (sourceBook && sourceBook === targetBook) {
      category = sourceChapter && sourceChapter === targetChapter ? 'parallel_narrative' : 'thematic_echo';
    }

    categories[`${normalizedSource}|${normalizedTarget}`] = category;
  }

  await fs.writeFile(resolve(outputPath), `${JSON.stringify(categories, null, 2)}\n`);
  console.log(`Saved ${Object.keys(categories).length} category mappings to ${outputPath}`);
})();
