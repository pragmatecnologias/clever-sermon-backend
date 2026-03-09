/**
 * Extract English Bible References
 * Extracts Bible references from English EGW paragraphs
 */

import * as fs from 'fs';
import * as path from 'path';

const INPUT_FILE = path.join(__dirname, '../data/egw-parsed-english/paragraphs.json');
const OUTPUT_FILE = path.join(__dirname, '../data/egw-parsed-english/paragraphs-with-references.json');

// English Bible book names
const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Psalm',
  'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
  'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
  'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
  'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

function extractBibleReferences(text: string): Array<{ book: string; chapter: number; verseStart?: number; verseEnd?: number; reference: string }> {
  const references: Array<{ book: string; chapter: number; verseStart?: number; verseEnd?: number; reference: string }> = [];
  
  const pattern = new RegExp(
    `(${BIBLE_BOOKS.join('|')})\\s+(\\d+)(?::(\\d+)(?:[-–](\\d+))?)?`,
    'gi'
  );
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const book = match[1];
    const chapter = parseInt(match[2]);
    const verseStart = match[3] ? parseInt(match[3]) : undefined;
    const verseEnd = match[4] ? parseInt(match[4]) : undefined;
    
    references.push({
      book,
      chapter,
      verseStart,
      verseEnd,
      reference: match[0]
    });
  }
  
  return references;
}

async function extractAllReferences() {
  console.log('📖 Loading English EGW paragraphs...');
  const paragraphs = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  
  console.log(`📝 Processing ${paragraphs.length} paragraphs...\n`);
  
  const paragraphsWithRefs = [];
  let totalRefs = 0;
  let parasWithRefs = 0;
  
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const refs = extractBibleReferences(para.content);
    
    if (refs.length > 0) {
      paragraphsWithRefs.push({
        ...para,
        bibleReferences: refs
      });
      totalRefs += refs.length;
      parasWithRefs++;
    }
    
    if ((i + 1) % 10000 === 0) {
      console.log(`✅ Processed ${i + 1}/${paragraphs.length} paragraphs...`);
    }
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(paragraphsWithRefs, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 English Bible Reference Extraction Summary');
  console.log('='.repeat(60));
  console.log(`📝 Total paragraphs processed: ${paragraphs.length}`);
  console.log(`📖 Paragraphs with Bible references: ${parasWithRefs}`);
  console.log(`🔗 Total Bible references found: ${totalRefs}`);
  console.log(`📈 Average references per paragraph: ${(totalRefs / parasWithRefs).toFixed(2)}`);
  console.log(`\n📄 Output saved to: ${OUTPUT_FILE}`);
  console.log('='.repeat(60));
}

extractAllReferences().catch(console.error);
