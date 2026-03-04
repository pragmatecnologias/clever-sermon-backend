import { createWriteStream, promises as fs } from 'fs';
import { dirname, resolve } from 'path';
import * as https from 'https';

const outputPath = process.argv[2] || 'data/word-occurrences.json';
const url = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json';

const bookMap: Record<string, string> = {
  gn: 'Genesis',
  ex: 'Exodus',
  lv: 'Leviticus',
  nm: 'Numbers',
  dt: 'Deuteronomy',
  js: 'Joshua',
  jg: 'Judges',
  rt: 'Ruth',
  '1sm': '1 Samuel',
  '2sm': '2 Samuel',
  '1kgs': '1 Kings',
  '2kgs': '2 Kings',
  '1ch': '1 Chronicles',
  '2ch': '2 Chronicles',
  ezr: 'Ezra',
  neh: 'Nehemiah',
  est: 'Esther',
  job: 'Job',
  ps: 'Psalms',
  pr: 'Proverbs',
  ec: 'Ecclesiastes',
  so: 'Song of Solomon',
  is: 'Isaiah',
  jr: 'Jeremiah',
  lm: 'Lamentations',
  ez: 'Ezekiel',
  dn: 'Daniel',
  ho: 'Hosea',
  jl: 'Joel',
  am: 'Amos',
  ob: 'Obadiah',
  jon: 'Jonah',
  mi: 'Micah',
  na: 'Nahum',
  hb: 'Habakkuk',
  zp: 'Zephaniah',
  hg: 'Haggai',
  zc: 'Zechariah',
  ml: 'Malachi',
  mt: 'Matthew',
  mk: 'Mark',
  lk: 'Luke',
  jo: 'John',
  ac: 'Acts',
  rm: 'Romans',
  '1co': '1 Corinthians',
  '2co': '2 Corinthians',
  ga: 'Galatians',
  eph: 'Ephesians',
  ph: 'Philippians',
  col: 'Colossians',
  '1th': '1 Thessalonians',
  '2th': '2 Thessalonians',
  '1tm': '1 Timothy',
  '2tm': '2 Timothy',
  tt: 'Titus',
  phm: 'Philemon',
  hb2: 'Hebrews',
  jm: 'James',
  '1pe': '1 Peter',
  '2pe': '2 Peter',
  '1jo': '1 John',
  '2jo': '2 John',
  '3jo': '3 John',
  jd: 'Jude',
  rv: 'Revelation',
};

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

const normalizeWord = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9']/g, '')
    .replace(/^'+|'+$/g, '');

(async () => {
  const resolvedOutput = resolve(outputPath);
  await ensureDir(resolvedOutput);
  const tempPath = `${resolvedOutput}.json`;

  await download(url, tempPath);
  const content = await fs.readFile(tempPath, 'utf-8');
  const data = JSON.parse(content.replace(/^\uFEFF/, ''));
  const occurrences: Record<string, { count: number; verses: string[] }> = {};

  for (const book of data) {
    const abbrev = (book.abbrev || '').toLowerCase();
    const bookName = book.name || bookMap[abbrev] || abbrev;
    const chapters = book.chapters || [];
    chapters.forEach((verses: string[], chapterIndex: number) => {
      verses.forEach((verseText: string, verseIndex: number) => {
        const reference = `${bookName} ${chapterIndex + 1}:${verseIndex + 1}`;
        const words = verseText.split(/\s+/g).map(normalizeWord).filter(Boolean);
        const unique = new Set(words);
        unique.forEach((word) => {
          if (!occurrences[word]) {
            occurrences[word] = { count: 0, verses: [] };
          }
          occurrences[word].count += words.filter((item) => item === word).length;
          occurrences[word].verses.push(reference);
        });
      });
    });
  }

  await fs.writeFile(resolvedOutput, `${JSON.stringify(occurrences, null, 2)}\n`);
  await fs.unlink(tempPath);
  console.log(`Saved word occurrences to ${resolvedOutput}`);
})();
