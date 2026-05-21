/**
 * Seed All EGW Data
 * Loads all English and Spanish EGW books, paragraphs, and Bible references
 * Run this after schema creation to populate the EGW database
 */

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { CreateEGWTables1709577500000 } from '../src/migrations/1709577500000-CreateEGWTables';
import { CreateEGWScriptureReferences1709577600000 } from '../src/migrations/1709577600000-CreateEGWScriptureReferences';

config({ path: path.join(__dirname, '../.env'), override: true });

const databaseUrl = process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/';
const databaseName = process.env.DATABASE_NAME || 'clever_sermon';

const dataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  database: databaseName,
  synchronize: false,
  logging: false,
});

async function tableExists(tableName: string): Promise<boolean> {
  const rows = await dataSource.query(
    `SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    ) AS exists`,
    [tableName]
  );

  return Boolean(rows?.[0]?.exists);
}

async function seedAllEGW() {
  console.log('\n' + '='.repeat(60));
  console.log('📚 SEEDING ALL EGW DATA');
  console.log('='.repeat(60) + '\n');

  const englishMetadataPath = path.join(__dirname, '../data/egw-books/metadata-english.json');
  const spanishMetadataPath = path.join(__dirname, '../data/egw-books/metadata-spanish.json');
  const englishParagraphsPath = path.join(__dirname, '../data/egw-parsed-english/paragraphs.json');
  const spanishParagraphsPath = path.join(__dirname, '../data/egw-parsed-spanish/paragraphs.json');
  const englishRefsPath = path.join(__dirname, '../data/egw-parsed-english/paragraphs-with-references.json');
  const spanishRefsPath = path.join(__dirname, '../data/egw-parsed-spanish/paragraphs-with-references.json');

  // Check if all required files exist
  const requiredFiles = [
    englishMetadataPath,
    spanishMetadataPath,
    englishParagraphsPath,
    spanishParagraphsPath,
    englishRefsPath,
    spanishRefsPath
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(`❌ Required file not found: ${file}`);
      console.error('Please run the parsing scripts first.');
      process.exit(1);
    }
  }

  console.log('🔌 Connecting to database...');
  await dataSource.initialize();
  console.log('✅ Connected\n');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const booksExists = await tableExists('egw_books');
    const paragraphsExists = await tableExists('egw_paragraphs');
    const refsExists = await tableExists('egw_scripture_references');

    if (!booksExists || !paragraphsExists) {
      console.log('🧱 EGW tables missing, creating books and paragraphs...');
      await new CreateEGWTables1709577500000().up(queryRunner);
      console.log('✅ EGW books and paragraphs tables ready\n');
    }

    if (!refsExists) {
      console.log('🧱 EGW scripture references missing, creating references table...');
      await new CreateEGWScriptureReferences1709577600000().up(queryRunner);
      console.log('✅ EGW scripture references table ready\n');
    }
  } finally {
    await queryRunner.release();
  }

  // Clear existing EGW data to prevent duplicates
  console.log('🗑️  Clearing existing EGW data...');
  await dataSource.query('DELETE FROM egw_scripture_references');
  await dataSource.query('DELETE FROM egw_paragraphs');
  await dataSource.query('DELETE FROM egw_books');
  console.log('✅ Cleared\n');

  // Load English books (deduplicate by code)
  console.log('📚 Loading English books...');
  const englishMetadata = JSON.parse(fs.readFileSync(englishMetadataPath, 'utf8'));
  const englishBookMap = new Map();
  for (const book of englishMetadata.books) {
    if (!englishBookMap.has(book.code)) {
      englishBookMap.set(book.code, book);
    }
  }
  for (const book of englishBookMap.values()) {
    await dataSource.query(
      `INSERT INTO egw_books (code, title, category, language)
       VALUES ($1, $2, $3, $4)`,
      [`en_${book.code}`, book.title, book.category, 'en']
    );
  }
  console.log(`✅ Loaded ${englishBookMap.size} English books (${englishMetadata.books.length - englishBookMap.size} duplicates skipped)\n`);

  // Load Spanish books (deduplicate by code)
  console.log('📚 Loading Spanish books...');
  const spanishMetadata = JSON.parse(fs.readFileSync(spanishMetadataPath, 'utf8'));
  const spanishBookMap = new Map();
  for (const book of spanishMetadata.books) {
    if (!spanishBookMap.has(book.code)) {
      spanishBookMap.set(book.code, book);
    }
  }
  for (const book of spanishBookMap.values()) {
    await dataSource.query(
      `INSERT INTO egw_books (code, title, category, language)
       VALUES ($1, $2, $3, $4)`,
      [`es_${book.code}`, book.title, book.category, 'es']
    );
  }
  console.log(`✅ Loaded ${spanishBookMap.size} Spanish books (${spanishMetadata.books.length - spanishBookMap.size} duplicates skipped)\n`);

  // Load English paragraphs
  console.log('📝 Loading English paragraphs (this may take a few minutes)...');
  const englishParagraphs = JSON.parse(fs.readFileSync(englishParagraphsPath, 'utf8'));
  let count = 0;
  for (const para of englishParagraphs) {
    await dataSource.query(
      `INSERT INTO egw_paragraphs 
       ("bookCode", "bookTitle", language, "chapterNumber", "chapterTitle", "paragraphNumber", content, reference, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [`en_${para.bookCode}`, para.bookTitle, 'en', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference]
    );
    count++;
    if (count % 10000 === 0) {
      console.log(`  ✓ ${count}/${englishParagraphs.length}...`);
    }
  }
  console.log(`✅ Loaded ${englishParagraphs.length} English paragraphs\n`);

  // Load Spanish paragraphs
  console.log('📝 Loading Spanish paragraphs (this may take a few minutes)...');
  const spanishParagraphs = JSON.parse(fs.readFileSync(spanishParagraphsPath, 'utf8'));
  count = 0;
  for (const para of spanishParagraphs) {
    await dataSource.query(
      `INSERT INTO egw_paragraphs 
       ("bookCode", "bookTitle", language, "chapterNumber", "chapterTitle", "paragraphNumber", content, reference, "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [`es_${para.bookCode}`, para.bookTitle, 'es', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference]
    );
    count++;
    if (count % 10000 === 0) {
      console.log(`  ✓ ${count}/${spanishParagraphs.length}...`);
    }
  }
  console.log(`✅ Loaded ${spanishParagraphs.length} Spanish paragraphs\n`);

  // Build paragraph ID maps
  console.log('🗗 Building paragraph reference maps...');
  const englishParas = await dataSource.query(
    "SELECT id, reference FROM egw_paragraphs WHERE language = 'en'"
  );
  const spanishParas = await dataSource.query(
    "SELECT id, reference FROM egw_paragraphs WHERE language = 'es'"
  );
  
  const englishParaMap = new Map();
  for (const para of englishParas) {
    englishParaMap.set(para.reference, para.id);
  }
  
  const spanishParaMap = new Map();
  for (const para of spanishParas) {
    spanishParaMap.set(para.reference, para.id);
  }
  console.log('✅ Maps built\n');

  // Load English references
  console.log('🔗 Loading English Bible references...');
  const englishRefs = JSON.parse(fs.readFileSync(englishRefsPath, 'utf8'));
  count = 0;
  for (const para of englishRefs) {
    const paragraphId = englishParaMap.get(para.reference);
    if (!paragraphId) continue;
    
    for (const ref of para.bibleReferences) {
      await dataSource.query(
        `INSERT INTO egw_scripture_references 
         ("egwParagraphId", book, chapter, "verseStart", "verseEnd", reference, language, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [paragraphId, ref.book, ref.chapter, ref.verseStart || null, ref.verseEnd || null, ref.reference, 'en']
      );
      count++;
    }
    if (count % 5000 === 0) {
      console.log(`  ✓ ${count} references...`);
    }
  }
  console.log(`✅ Loaded ${count} English Bible references\n`);

  // Load Spanish references
  console.log('🔗 Loading Spanish Bible references...');
  const spanishRefs = JSON.parse(fs.readFileSync(spanishRefsPath, 'utf8'));
  count = 0;
  for (const para of spanishRefs) {
    const paragraphId = spanishParaMap.get(para.reference);
    if (!paragraphId) continue;
    
    for (const ref of para.bibleReferences) {
      await dataSource.query(
        `INSERT INTO egw_scripture_references 
         ("egwParagraphId", book, chapter, "verseStart", "verseEnd", reference, language, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [paragraphId, ref.book, ref.chapter, ref.verseStart || null, ref.verseEnd || null, ref.reference, 'es']
      );
      count++;
    }
    if (count % 5000 === 0) {
      console.log(`  ✓ ${count} references...`);
    }
  }
  console.log(`✅ Loaded ${count} Spanish Bible references\n`);

  // Final summary
  const totalBooks = await dataSource.query('SELECT COUNT(*) as count FROM egw_books');
  const totalParas = await dataSource.query('SELECT COUNT(*) as count FROM egw_paragraphs');
  const totalRefs = await dataSource.query('SELECT COUNT(*) as count FROM egw_scripture_references');

  console.log('='.repeat(60));
  console.log('📊 EGW SEEDING COMPLETE');
  console.log('='.repeat(60));
  console.log(`📚 Total books: ${totalBooks[0].count}`);
  console.log(`📝 Total paragraphs: ${totalParas[0].count}`);
  console.log(`🔗 Total Bible references: ${totalRefs[0].count}`);
  console.log('='.repeat(60) + '\n');

  await dataSource.destroy();
}

seedAllEGW().catch((error) => {
  console.error('❌ Error seeding EGW data:', error);
  process.exit(1);
});
