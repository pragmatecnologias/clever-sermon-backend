import { createWriteStream, promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import * as https from 'https';

const outputPath = process.argv[2] || 'data/book-metadata.json';
const url = 'https://raw.githubusercontent.com/jpoehls/bible-metadata/master/Books.csv';

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

(async () => {
  const resolvedOutput = resolve(outputPath);
  await ensureDir(resolvedOutput);
  const tempPath = `${resolvedOutput}.csv`;

  await download(url, tempPath);
  const content = await fs.readFile(tempPath, 'utf-8');
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);
  const [, ...rows] = lines;

  const data: Record<string, any> = {};
  for (const row of rows) {
    const [bookId, osisId, bookName, totalChapters, volume] = row.split(',');
    if (!bookName) continue;
    const key = normalizeKey(bookName);
    data[key] = {
      id: Number(bookId),
      osisId,
      name: bookName,
      totalChapters: Number(totalChapters),
      volume,
    };
  }

  await fs.writeFile(resolvedOutput, `${JSON.stringify(data, null, 2)}\n`);
  await fs.unlink(tempPath);
  console.log(`Saved ${Object.keys(data).length} book metadata entries to ${resolvedOutput}`);
})();
