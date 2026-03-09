/**
 * Extract Spanish Bible References
 * Extracts Bible references from Spanish EGW paragraphs
 */

import * as fs from 'fs';
import * as path from 'path';

const INPUT_FILE = path.join(__dirname, '../data/egw-parsed-spanish/paragraphs.json');
const OUTPUT_FILE = path.join(__dirname, '../data/egw-parsed-spanish/paragraphs-with-references.json');

// Spanish Bible book names mapping
const SPANISH_BOOKS: Record<string, string> = {
  'Génesis': 'Genesis', 'Éxodo': 'Exodus', 'Levítico': 'Leviticus', 'Números': 'Numbers', 'Deuteronomio': 'Deuteronomy',
  'Josué': 'Joshua', 'Jueces': 'Judges', 'Rut': 'Ruth', '1 Samuel': '1 Samuel', '2 Samuel': '2 Samuel',
  '1 Reyes': '1 Kings', '2 Reyes': '2 Kings', '1 Crónicas': '1 Chronicles', '2 Crónicas': '2 Chronicles',
  'Esdras': 'Ezra', 'Nehemías': 'Nehemiah', 'Ester': 'Esther', 'Job': 'Job', 'Salmos': 'Psalms', 'Salmo': 'Psalms',
  'Proverbios': 'Proverbs', 'Eclesiastés': 'Ecclesiastes', 'Cantares': 'Song of Solomon', 'Cantar de los Cantares': 'Song of Solomon',
  'Isaías': 'Isaiah', 'Jeremías': 'Jeremiah', 'Lamentaciones': 'Lamentations', 'Ezequiel': 'Ezekiel', 'Daniel': 'Daniel',
  'Oseas': 'Hosea', 'Joel': 'Joel', 'Amós': 'Amos', 'Abdías': 'Obadiah', 'Jonás': 'Jonah', 'Miqueas': 'Micah',
  'Nahúm': 'Nahum', 'Habacuc': 'Habakkuk', 'Sofonías': 'Zephaniah', 'Hageo': 'Haggai', 'Zacarías': 'Zechariah', 'Malaquías': 'Malachi',
  'Mateo': 'Matthew', 'Marcos': 'Mark', 'Lucas': 'Luke', 'Juan': 'John', 'Hechos': 'Acts',
  'Romanos': 'Romans', '1 Corintios': '1 Corinthians', '2 Corintios': '2 Corinthians', 'Gálatas': 'Galatians',
  'Efesios': 'Ephesians', 'Filipenses': 'Philippians', 'Colosenses': 'Colossians', '1 Tesalonicenses': '1 Thessalonians',
  '2 Tesalonicenses': '2 Thessalonians', '1 Timoteo': '1 Timothy', '2 Timoteo': '2 Timothy', 'Tito': 'Titus',
  'Filemón': 'Philemon', 'Hebreos': 'Hebrews', 'Santiago': 'James', '1 Pedro': '1 Peter', '2 Pedro': '2 Peter',
  '1 Juan': '1 John', '2 Juan': '2 John', '3 Juan': '3 John', 'Judas': 'Jude', 'Apocalipsis': 'Revelation'
};

function extractBibleReferences(text: string): Array<{ book: string; chapter: number; verseStart?: number; verseEnd?: number; reference: string }> {
  const references: Array<{ book: string; chapter: number; verseStart?: number; verseEnd?: number; reference: string }> = [];
  
  // Pattern for Spanish Bible references
  const pattern = new RegExp(
    `(${Object.keys(SPANISH_BOOKS).join('|')})\\s+(\\d+)(?::(\\d+)(?:[-–](\\d+))?)?`,
    'gi'
  );
  
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const spanishBook = match[1];
    const englishBook = SPANISH_BOOKS[spanishBook] || spanishBook;
    const chapter = parseInt(match[2]);
    const verseStart = match[3] ? parseInt(match[3]) : undefined;
    const verseEnd = match[4] ? parseInt(match[4]) : undefined;
    
    references.push({
      book: englishBook,
      chapter,
      verseStart,
      verseEnd,
      reference: match[0]
    });
  }
  
  return references;
}

async function extractAllReferences() {
  console.log('📖 Loading Spanish EGW paragraphs...');
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
  console.log('📊 Spanish Bible Reference Extraction Summary');
  console.log('='.repeat(60));
  console.log(`📝 Total paragraphs processed: ${paragraphs.length}`);
  console.log(`📖 Paragraphs with Bible references: ${parasWithRefs}`);
  console.log(`🔗 Total Bible references found: ${totalRefs}`);
  console.log(`📈 Average references per paragraph: ${(totalRefs / parasWithRefs).toFixed(2)}`);
  console.log(`\n📄 Output saved to: ${OUTPUT_FILE}`);
  console.log('='.repeat(60));
}

extractAllReferences().catch(console.error);
