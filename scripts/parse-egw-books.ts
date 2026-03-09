/**
 * EGW Book Parser
 * Parses EPUB files and extracts content into searchable database format
 * 
 * Usage: npx ts-node scripts/parse-egw-books.ts
 */

import * as fs from 'fs';
import * as path from 'path';
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');

interface EGWChapter {
  bookCode: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
  paragraphs: string[];
}

interface EGWParagraph {
  bookCode: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  paragraphNumber: number;
  content: string;
  reference: string; // e.g., "DA 123.2"
}

const DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
const OUTPUT_DIR = path.join(__dirname, '../data/egw-parsed');

async function parseXML(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function extractTextFromHTML(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ');
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

async function parseEPUB(filepath: string, bookCode: string, bookTitle: string): Promise<EGWChapter[]> {
  const chapters: EGWChapter[] = [];
  
  try {
    const zip = new AdmZip(filepath);
    const zipEntries = zip.getEntries();
    
    // Find content files (usually in OEBPS or similar directory)
    const contentFiles = zipEntries.filter(entry => 
      entry.entryName.endsWith('.html') || entry.entryName.endsWith('.xhtml')
    );
    
    let chapterNumber = 0;
    
    for (const entry of contentFiles) {
      // Skip navigation and cover files
      if (entry.entryName.includes('nav') || 
          entry.entryName.includes('cover') ||
          entry.entryName.includes('toc')) {
        continue;
      }
      
      const content = entry.getData().toString('utf8');
      const text = extractTextFromHTML(content);
      
      // Skip very short content (likely not a chapter)
      if (text.length < 100) continue;
      
      chapterNumber++;
      
      // Extract chapter title (usually in first heading)
      const titleMatch = content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
      const chapterTitle = titleMatch ? extractTextFromHTML(titleMatch[1]) : `Chapter ${chapterNumber}`;
      
      // Split into paragraphs
      const paragraphs = text
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 20);
      
      chapters.push({
        bookCode,
        bookTitle,
        chapterNumber,
        chapterTitle,
        content: text,
        paragraphs
      });
    }
    
    return chapters;
  } catch (error) {
    console.error(`Error parsing ${bookCode}:`, error.message);
    return [];
  }
}

function generateParagraphReference(bookCode: string, chapterNumber: number, paragraphNumber: number): string {
  return `${bookCode} ${chapterNumber}.${paragraphNumber}`;
}

async function parseAllBooks() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const metadataPath = path.join(DOWNLOAD_DIR, 'metadata-bilingual.json');
  if (!fs.existsSync(metadataPath)) {
    console.error('❌ Metadata file not found. Run download script first.');
    return;
  }
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const books = metadata.books;
  
  console.log(`📖 Parsing ${books.length} EGW books...\n`);
  
  const allChapters: EGWChapter[] = [];
  const allParagraphs: EGWParagraph[] = [];
  
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const filepath = path.join(DOWNLOAD_DIR, `${book.code}.epub`);
    
    if (!fs.existsSync(filepath)) {
      console.log(`⏭️  [${i + 1}/${books.length}] Skipping ${book.code} - file not found`);
      continue;
    }
    
    console.log(`📖 [${i + 1}/${books.length}] Parsing ${book.code}: ${book.title}...`);
    
    const chapters = await parseEPUB(filepath, book.code, book.title);
    
    // Generate paragraph-level data
    chapters.forEach(chapter => {
      chapter.paragraphs.forEach((para, idx) => {
        allParagraphs.push({
          bookCode: chapter.bookCode,
          bookTitle: chapter.bookTitle,
          chapterNumber: chapter.chapterNumber,
          chapterTitle: chapter.chapterTitle,
          paragraphNumber: idx + 1,
          content: para,
          reference: generateParagraphReference(chapter.bookCode, chapter.chapterNumber, idx + 1)
        });
      });
    });
    
    allChapters.push(...chapters);
    
    console.log(`✅ Parsed ${chapters.length} chapters from ${book.code}`);
  }
  
  // Save parsed data
  const chaptersFile = path.join(OUTPUT_DIR, 'chapters.json');
  const paragraphsFile = path.join(OUTPUT_DIR, 'paragraphs.json');
  const indexFile = path.join(OUTPUT_DIR, 'index.json');
  
  fs.writeFileSync(chaptersFile, JSON.stringify(allChapters, null, 2));
  fs.writeFileSync(paragraphsFile, JSON.stringify(allParagraphs, null, 2));
  
  // Create searchable index
  const index = {
    totalBooks: books.length,
    totalChapters: allChapters.length,
    totalParagraphs: allParagraphs.length,
    books: books.map(book => ({
      code: book.code,
      title: book.title,
      category: book.category,
      chapters: allChapters.filter(c => c.bookCode === book.code).length,
      paragraphs: allParagraphs.filter(p => p.bookCode === book.code).length
    }))
  };
  
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Parsing Summary');
  console.log('='.repeat(60));
  console.log(`📚 Total books processed: ${books.length}`);
  console.log(`📖 Total chapters extracted: ${allChapters.length}`);
  console.log(`📝 Total paragraphs extracted: ${allParagraphs.length}`);
  console.log(`\n📁 Output files:`);
  console.log(`   - ${chaptersFile}`);
  console.log(`   - ${paragraphsFile}`);
  console.log(`   - ${indexFile}`);
  console.log('='.repeat(60));
}

parseAllBooks().catch(console.error);
