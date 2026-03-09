/**
 * Load All English EGW Data
 * Clears existing English data and loads complete collection
 */

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

config({ path: path.join(__dirname, '../.env') });

const databaseUrl = process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/';
const databaseName = process.env.DATABASE_NAME || 'clever_sermon';

const urlMatch = databaseUrl.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)/);
if (!urlMatch) {
  throw new Error('Invalid DATABASE_URL format');
}

const [, username, password, host, port] = urlMatch;

const dataSource = new DataSource({
  type: 'postgres',
  host,
  port: parseInt(port),
  username,
  password,
  database: databaseName,
  synchronize: false,
  logging: false,
});

async function loadAllEnglishData() {
  const metadataPath = path.join(__dirname, '../data/egw-books/metadata-english.json');
  const paragraphsPath = path.join(__dirname, '../data/egw-parsed-english/paragraphs.json');
  
  if (!fs.existsSync(metadataPath) || !fs.existsSync(paragraphsPath)) {
    console.error('❌ Required files not found');
    process.exit(1);
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const paragraphs = JSON.parse(fs.readFileSync(paragraphsPath, 'utf8'));

  console.log('🔌 Connecting to database...');
  await dataSource.initialize();
  console.log('✅ Database connected\n');

  // Clear existing English data
  console.log('🗑️  Clearing existing English EGW data...');
  await dataSource.query("DELETE FROM egw_scripture_references WHERE language = 'en'");
  await dataSource.query("DELETE FROM egw_paragraphs WHERE language = 'en'");
  await dataSource.query("DELETE FROM egw_books WHERE language = 'en'");
  console.log('✅ Cleared existing English data\n');

  // Load books
  console.log(`📚 Loading ${metadata.books.length} English books...`);
  let booksLoaded = 0;
  for (const book of metadata.books) {
    await dataSource.query(
      `INSERT INTO egw_books (code, title, category, language)
       VALUES ($1, $2, $3, $4)`,
      [`en_${book.code}`, book.title, book.category, 'en']
    );
    booksLoaded++;
    if (booksLoaded % 20 === 0) {
      console.log(`  ✓ Loaded ${booksLoaded}/${metadata.books.length} books...`);
    }
  }
  console.log(`✅ Loaded ${booksLoaded} English books\n`);

  // Load paragraphs
  console.log(`📝 Loading ${paragraphs.length} English paragraphs...`);
  let parasLoaded = 0;
  const batchSize = 500;
  
  for (let i = 0; i < paragraphs.length; i += batchSize) {
    const batch = paragraphs.slice(i, i + batchSize);
    
    for (const para of batch) {
      await dataSource.query(
        `INSERT INTO egw_paragraphs 
         ("bookCode", "bookTitle", language, "chapterNumber", "chapterTitle", "paragraphNumber", content, reference, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [`en_${para.bookCode}`, para.bookTitle, 'en', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference]
      );
      parasLoaded++;
    }
    
    console.log(`  ✓ Loaded ${parasLoaded}/${paragraphs.length} paragraphs...`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 English Data Load Complete');
  console.log('='.repeat(60));
  console.log(`✅ Books loaded: ${booksLoaded}`);
  console.log(`✅ Paragraphs loaded: ${parasLoaded}`);
  
  const totalBooks = await dataSource.query('SELECT COUNT(*) as count FROM egw_books');
  const totalParas = await dataSource.query('SELECT COUNT(*) as count FROM egw_paragraphs');
  
  console.log(`\n📊 Total in database:`);
  console.log(`   Books: ${totalBooks[0].count}`);
  console.log(`   Paragraphs: ${totalParas[0].count}`);
  console.log('='.repeat(60));
  
  await dataSource.destroy();
}

loadAllEnglishData().catch(console.error);
