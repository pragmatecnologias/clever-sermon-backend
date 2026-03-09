/**
 * Parse English EGW Books
 * Parses all English EPUB files and extracts content
 */

import * as fs from 'fs';
import * as path from 'path';
const AdmZip = require('adm-zip');

const DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
const OUTPUT_DIR = path.join(__dirname, '../data/egw-parsed-english');
const METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata-english.json');

interface ParsedChapter {
  bookCode: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
}

interface ParsedParagraph {
  bookCode: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  paragraphNumber: number;
  content: string;
  reference: string;
}

async function parseEpubFile(filepath: string, bookCode: string, bookTitle: string): Promise<ParsedChapter[]> {
  try {
    const zip = new AdmZip(filepath);
    const zipEntries = zip.getEntries();
    
    const chapters: ParsedChapter[] = [];
    let chapterNumber = 0;
    
    for (const entry of zipEntries) {
      if (entry.entryName.endsWith('.xhtml') || entry.entryName.endsWith('.html')) {
        const content = entry.getData().toString('utf8');
        
        const match = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (!match) continue;
        
        let text = match[1]
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (text.length > 100) {
          chapterNumber++;
          
          const titleMatch = text.match(/^(.{1,100}?)(?:\.|$)/);
          const chapterTitle = titleMatch ? titleMatch[1].trim() : `Chapter ${chapterNumber}`;
          
          chapters.push({
            bookCode,
            bookTitle,
            chapterNumber,
            chapterTitle,
            content: text
          });
        }
      }
    }
    
    return chapters;
  } catch (error) {
    throw new Error(`Failed to parse EPUB: ${error.message}`);
  }
}

function splitIntoParagraphs(chapter: ParsedChapter): ParsedParagraph[] {
  const sentences = chapter.content.split(/(?<=[.!?])\s+/);
  const paragraphs: ParsedParagraph[] = [];
  
  let currentParagraph = '';
  let paragraphNumber = 0;
  
  for (const sentence of sentences) {
    if (currentParagraph.length + sentence.length > 500 || 
        (currentParagraph.length > 200 && sentence.match(/^[A-Z]/))) {
      if (currentParagraph.trim()) {
        paragraphNumber++;
        paragraphs.push({
          bookCode: chapter.bookCode,
          bookTitle: chapter.bookTitle,
          chapterNumber: chapter.chapterNumber,
          chapterTitle: chapter.chapterTitle,
          paragraphNumber,
          content: currentParagraph.trim(),
          reference: `en_${chapter.bookCode} ${chapter.chapterNumber}.${paragraphNumber}`
        });
      }
      currentParagraph = sentence;
    } else {
      currentParagraph += ' ' + sentence;
    }
  }
  
  if (currentParagraph.trim()) {
    paragraphNumber++;
    paragraphs.push({
      bookCode: chapter.bookCode,
      bookTitle: chapter.bookTitle,
      chapterNumber: chapter.chapterNumber,
      chapterTitle: chapter.chapterTitle,
      paragraphNumber,
      content: currentParagraph.trim(),
      reference: `en_${chapter.bookCode} ${chapter.chapterNumber}.${paragraphNumber}`
    });
  }
  
  return paragraphs;
}

async function parseAllEnglishBooks() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(METADATA_FILE)) {
    console.error('❌ English metadata file not found. Run create-english-metadata.ts first.');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
  const books = metadata.books;
  
  console.log(`📖 Parsing ${books.length} English EGW books...\n`);
  
  const allChapters: ParsedChapter[] = [];
  const allParagraphs: ParsedParagraph[] = [];
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const filepath = path.join(DOWNLOAD_DIR, book.filename);
    
    if (!fs.existsSync(filepath)) {
      console.log(`⏭️  [${i + 1}/${books.length}] Skipping ${book.code} - file not found`);
      failCount++;
      continue;
    }
    
    try {
      console.log(`📖 [${i + 1}/${books.length}] Parsing ${book.code}: ${book.title}...`);
      const chapters = await parseEpubFile(filepath, book.code, book.title);
      
      if (chapters.length === 0) {
        console.log(`⚠️  No chapters found in ${book.code}`);
        failCount++;
        continue;
      }
      
      allChapters.push(...chapters);
      
      for (const chapter of chapters) {
        const paragraphs = splitIntoParagraphs(chapter);
        allParagraphs.push(...paragraphs);
      }
      
      console.log(`✅ Parsed ${chapters.length} chapters from ${book.code}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Error parsing ${book.code}: ${error.message}`);
      failCount++;
    }
  }
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'chapters.json'),
    JSON.stringify(allChapters, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'paragraphs.json'),
    JSON.stringify(allParagraphs, null, 2)
  );
  
  const index = {
    totalBooks: successCount,
    totalChapters: allChapters.length,
    totalParagraphs: allParagraphs.length,
    language: 'en',
    parsedDate: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.json'),
    JSON.stringify(index, null, 2)
  );
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 English Parsing Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully parsed: ${successCount} books`);
  console.log(`❌ Failed: ${failCount} books`);
  console.log(`📖 Total chapters extracted: ${allChapters.length}`);
  console.log(`📝 Total paragraphs extracted: ${allParagraphs.length}`);
  console.log(`\n📁 Output files:`);
  console.log(`   - ${path.join(OUTPUT_DIR, 'chapters.json')}`);
  console.log(`   - ${path.join(OUTPUT_DIR, 'paragraphs.json')}`);
  console.log(`   - ${path.join(OUTPUT_DIR, 'index.json')}`);
  console.log('='.repeat(60));
}

parseAllEnglishBooks().catch(console.error);
