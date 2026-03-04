import { createWriteStream, promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import * as https from 'https';

const outputPath = process.argv[2] || 'data/historical-context.json';
const url = 'https://raw.githubusercontent.com/BradyStephenson/bible-data/master/BibleData-Book.csv';

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

const formatDateRange = (start: string, end: string) => {
  if (!start && !end) return null;
  const format = (value: string) => {
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    const year = Math.abs(num);
    return num < 0 ? `${year} BC` : `${year} AD`;
  };
  if (start && end && start !== end) {
    return `${format(start)}–${format(end)}`;
  }
  return format(start || end);
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

  const data: Record<string, any> = {};
  for (const row of rows) {
    const values = parseCsvLine(row);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });

    const bookName = record.book_name;
    if (!bookName) continue;
    const key = normalizeKey(bookName);
    data[key] = {
      approximateDate: formatDateRange(record.written_start_date, record.written_end_date),
      politicalAuthority: null,
      geopoliticalForces: [],
      religiousContext: null,
      author: record.writer_id || null,
      writtenLocationId: record.written_location_id || null,
    };
  }

  await fs.writeFile(resolvedOutput, `${JSON.stringify(data, null, 2)}\n`);
  await fs.unlink(tempPath);
  console.log(`Saved historical context to ${resolvedOutput}`);
})();
