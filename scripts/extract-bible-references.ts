/**
 * Bible Reference Extractor for EGW Paragraphs
 * Extracts and links Bible references from EGW content
 * 
 * Usage: npx ts-node scripts/extract-bible-references.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface BibleReference {
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  reference: string;
}

interface EGWParagraphWithRefs {
  id: string;
  bookCode: string;
  bookTitle: string;
  language: string;
  chapterNumber: number;
  paragraphNumber: number;
  content: string;
  reference: string;
  bibleReferences: BibleReference[];
}

const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
  '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
  'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
  'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
  'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

const SPANISH_BIBLE_BOOKS = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
  'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
  '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester',
  'Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares',
  'Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel',
  'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm',
  'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías',
  'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos',
  '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios',
  'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses',
  '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos',
  'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan',
  'Judas', 'Apocalipsis'
];

function extractBibleReferences(text: string, language: 'en' | 'es'): BibleReference[] {
  const references: BibleReference[] = [];
  const books = language === 'es' ? SPANISH_BIBLE_BOOKS : BIBLE_BOOKS;
  
  // Build regex pattern for book names
  const bookPattern = books.join('|');
  
  // Pattern: Book Chapter:Verse or Book Chapter:Verse-Verse
  const refPattern = new RegExp(
    `(${bookPattern})\\s+(\\d+)(?::(\\d+)(?:-(\\d+))?)?`,
    'gi'
  );
  
  let match;
  while ((match = refPattern.exec(text)) !== null) {
    const book = match[1];
    const chapter = parseInt(match[2]);
    const verseStart = match[3] ? parseInt(match[3]) : undefined;
    const verseEnd = match[4] ? parseInt(match[4]) : undefined;
    
    let reference = `${book} ${chapter}`;
    if (verseStart) {
      reference += `:${verseStart}`;
      if (verseEnd) {
        reference += `-${verseEnd}`;
      }
    }
    
    references.push({
      book,
      chapter,
      verseStart,
      verseEnd,
      reference
    });
  }
  
  return references;
}

async function processParagraphs() {
  const PARSED_DIR = path.join(__dirname, '../data/egw-parsed');
  const OUTPUT_FILE = path.join(PARSED_DIR, 'paragraphs-with-references.json');
  
  const paragraphsFile = path.join(PARSED_DIR, 'paragraphs.json');
  
  if (!fs.existsSync(paragraphsFile)) {
    console.error('❌ Paragraphs file not found. Run parse-egw-books.ts first.');
    return;
  }
  
  console.log('📖 Loading EGW paragraphs...');
  const paragraphs = JSON.parse(fs.readFileSync(paragraphsFile, 'utf8'));
  
  console.log(`📝 Processing ${paragraphs.length} paragraphs...\n`);
  
  const paragraphsWithRefs: EGWParagraphWithRefs[] = [];
  let totalReferences = 0;
  let paragraphsWithReferences = 0;
  
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    
    // Determine language from bookCode
    const language: 'en' | 'es' = para.bookCode.startsWith('es_') ? 'es' : 'en';
    
    // Extract Bible references
    const bibleReferences = extractBibleReferences(para.content, language);
    
    if (bibleReferences.length > 0) {
      paragraphsWithReferences++;
      totalReferences += bibleReferences.length;
    }
    
    paragraphsWithRefs.push({
      id: `egw-para-${i}`,
      bookCode: para.bookCode,
      bookTitle: para.bookTitle,
      language,
      chapterNumber: para.chapterNumber,
      paragraphNumber: para.paragraphNumber,
      content: para.content,
      reference: para.reference,
      bibleReferences
    });
    
    if ((i + 1) % 500 === 0) {
      console.log(`✅ Processed ${i + 1}/${paragraphs.length} paragraphs...`);
    }
  }
  
  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(paragraphsWithRefs, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Bible Reference Extraction Summary');
  console.log('='.repeat(60));
  console.log(`📝 Total paragraphs processed: ${paragraphs.length}`);
  console.log(`📖 Paragraphs with Bible references: ${paragraphsWithReferences}`);
  console.log(`🔗 Total Bible references found: ${totalReferences}`);
  console.log(`📈 Average references per paragraph: ${(totalReferences / paragraphsWithReferences).toFixed(2)}`);
  console.log(`\n📄 Output saved to: ${OUTPUT_FILE}`);
  console.log('='.repeat(60));
}

processParagraphs().catch(console.error);
