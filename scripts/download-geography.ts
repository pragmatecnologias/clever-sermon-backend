import { createWriteStream, promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import * as https from 'https';

const outputPath = process.argv[2] || 'data/geography.json';
const url = 'https://www.openbible.info/geo/data/merged.txt';

const download = (source: string, destination: string): Promise<void> =>
  new Promise((resolveDownload, reject) => {
    const request = https.get(source, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.destroy();
        download(response.headers.location, destination).then(resolveDownload).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }
      const stream = createWriteStream(destination);
      response.pipe(stream);
      stream.on('finish', () => stream.close(() => resolveDownload()));
    });
    request.on('error', reject);
  });

const ensureDir = async (path: string) => {
  await fs.mkdir(dirname(path), { recursive: true });
};

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const extractVerseBooks = (text: string) => {
  const matches = text.match(/[1-3]?[A-Za-z]+\s+\d+:/g) || [];
  return matches.map((match) => match.replace(/\s+\d+:/, '').trim());
};

(async () => {
  const resolvedOutput = resolve(outputPath);
  await ensureDir(resolvedOutput);
  const tempPath = `${resolvedOutput}.txt`;

  await download(url, tempPath);
  const content = await fs.readFile(tempPath, 'utf-8');
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);

  const data: Record<string, { places: string[]; terrainNotes?: string }> = {};
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 2) continue;
    const place = parts[0];
    const referenceColumn = parts.find((part) => /\d+:\d+/.test(part)) || '';
    const books = extractVerseBooks(referenceColumn);
    for (const book of books) {
      const key = normalizeKey(book);
      if (!key) continue;
      const entry = data[key] || { places: [] };
      if (!entry.places.includes(place)) {
        entry.places.push(place);
      }
      data[key] = entry;
    }
  }

  await fs.writeFile(resolvedOutput, `${JSON.stringify(data, null, 2)}\n`);
  await fs.unlink(tempPath);
  console.log(`Saved geography data to ${resolvedOutput}`);
})();
