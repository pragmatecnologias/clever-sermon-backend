import { createWriteStream, promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import * as https from 'https';

const outputPath = process.argv[2] || 'data/timeline.json';
const url = 'https://raw.githubusercontent.com/BradyStephenson/bible-data/master/BibleData-Event.csv';

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

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map((value) => value.trim());
};

const extractBook = (reference: string) => {
  const match = reference?.match(/^([1-3]?\s?[A-Za-z]+)/);
  return match ? match[1].trim() : null;
};

(async () => {
  const resolvedOutput = resolve(outputPath);
  await ensureDir(resolvedOutput);
  const tempPath = `${resolvedOutput}.csv`;

  await download(url, tempPath);
  const content = await fs.readFile(tempPath, 'utf-8');
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);
  const [headerLine, ...rows] = lines;
  const headers = parseCsvLine(headerLine);

  const data: Record<string, any[]> = {};
  for (const row of rows) {
    const values = parseCsvLine(row);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });

    const reference = record.event_reference_id || record.event_reference || '';
    const book = extractBook(reference || record.event_location_reference_id || '');
    if (!book) continue;
    const key = normalizeKey(book);
    const entry = {
      year: record.bce_year || record.ussher_bce_year || record.event_year_ah || null,
      event: record.event_name,
      description: record.event_description,
      reference: reference || null,
      location: record.event_location || null,
      type: record.event_type || null,
    };
    if (!data[key]) data[key] = [];
    data[key].push(entry);
  }

  await fs.writeFile(resolvedOutput, `${JSON.stringify(data, null, 2)}\n`);
  await fs.unlink(tempPath);
  console.log(`Saved timeline data to ${resolvedOutput}`);
})();
