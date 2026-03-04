import { createWriteStream, promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import * as https from 'https';

const outputPath = process.argv[2] || 'data/strongs-word-study.json';
const greekUrl = 'https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongsgreek.dat';
const hebrewUrl = 'https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongshebrew.dat';

type Entry = {
  word: string;
  language: string;
  lemma: string;
  strongs: string;
  transliteration: string;
  definition: string;
  examples: string[];
  usageCount?: number;
  partOfSpeech?: string;
};

const download = (url: string, destination: string): Promise<void> =>
  new Promise((resolveDownload, reject) => {
    const request = https.get(
      url,
      { headers: { 'User-Agent': 'clever-sermon-datasets/1.0' } },
      (response) => {
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
      },
    );
    request.on('error', reject);
  });

const ensureDir = async (path: string) => {
  await fs.mkdir(dirname(path), { recursive: true });
};

const parseStrongs = (content: string, language: 'greek' | 'hebrew', prefix: 'G' | 'H') => {
  const lines = content.split('\n');
  const entries: Entry[] = [];
  let current: Entry | null = null;
  let definitionLines: string[] = [];

  const flush = () => {
    if (current) {
      const definition = definitionLines
        .map((line) => line.trim())
        .filter((line) => line && !line.toLowerCase().startsWith('see '))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      current.definition = definition;
      entries.push(current);
    }
    current = null;
    definitionLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('$$T') || line.startsWith('\\')) {
      continue;
    }
    const match = line.match(/^(\d{1,5})\s+(\S+)\s+(.+)$/);
    if (match) {
      flush();
      const number = match[1].padStart(4, '0');
      const word = match[2];
      const transliteration = match[3].replace(/\s{2,}/g, ' ').trim();
      current = {
        word,
        language,
        lemma: word,
        strongs: `${prefix}${number}`,
        transliteration,
        definition: '',
        examples: [],
      };
      continue;
    }
    if (current) {
      definitionLines.push(line);
    }
  }

  flush();
  return entries;
};

(async () => {
  const resolvedOutput = resolve(outputPath);
  await ensureDir(resolvedOutput);
  const tempGreek = `${resolvedOutput}.greek.tmp`;
  const tempHebrew = `${resolvedOutput}.hebrew.tmp`;

  await download(greekUrl, tempGreek);
  await download(hebrewUrl, tempHebrew);

  const greekContent = await fs.readFile(tempGreek, 'utf-8');
  const hebrewContent = await fs.readFile(tempHebrew, 'utf-8');

  const entries = [
    ...parseStrongs(greekContent, 'greek', 'G'),
    ...parseStrongs(hebrewContent, 'hebrew', 'H'),
  ];

  const data: Record<string, Entry> = {};
  for (const entry of entries) {
    const key = entry.word.toLowerCase();
    if (!data[key]) {
      data[key] = entry;
    }
  }

  await fs.writeFile(resolvedOutput, `${JSON.stringify(data, null, 2)}\n`);
  await fs.unlink(tempGreek);
  await fs.unlink(tempHebrew);
  console.log(`Saved ${Object.keys(data).length} Strong's entries to ${resolvedOutput}`);
})();
