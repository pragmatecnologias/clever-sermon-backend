import { createWriteStream, promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import * as https from 'https';

const outputPath = process.argv[2] || 'data/cultural-context.json';
const bookUrl = 'https://raw.githubusercontent.com/BradyStephenson/bible-data/master/BibleData-Book.csv';
const placeUrl = 'https://raw.githubusercontent.com/BradyStephenson/bible-data/master/BibleData-Place.csv';

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

const loadCsv = async (path: string) => {
  const content = await fs.readFile(path, 'utf-8');
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean);
  const [headerLine, ...rows] = lines;
  const headers = parseCsvLine(headerLine);
  return rows.map((row) => {
    const values = parseCsvLine(row);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    return record;
  });
};

(async () => {
  const resolvedOutput = resolve(outputPath);
  await ensureDir(resolvedOutput);
  const bookTemp = `${resolvedOutput}.books.csv`;
  const placeTemp = `${resolvedOutput}.places.csv`;

  await download(bookUrl, bookTemp);
  await download(placeUrl, placeTemp);

  const books = await loadCsv(bookTemp);
  const places = await loadCsv(placeTemp);
  const placeMap = new Map<string, string>();
  places.forEach((place) => {
    if (place.place_id && place.place_name) {
      placeMap.set(place.place_id, place.place_name);
    }
  });

  const data: Record<string, any> = {};
  for (const book of books) {
    if (!book.book_name) continue;
    const key = normalizeKey(book.book_name);
    data[key] = {
      socialCustoms: [],
      templePractices: [],
      agriculturalMetaphors: [],
      economicSystems: [],
      marriageCustoms: [],
      religiousGroups: [],
      writtenLocation: book.written_location_id ? placeMap.get(book.written_location_id) || null : null,
    };
  }

  await fs.writeFile(resolvedOutput, `${JSON.stringify(data, null, 2)}\n`);
  await Promise.all([fs.unlink(bookTemp), fs.unlink(placeTemp)]);
  console.log(`Saved cultural context to ${resolvedOutput}`);
})();
