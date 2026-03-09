/**
 * Load Spanish EGW Books Metadata
 * Loads Spanish book metadata into the database
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

async function loadSpanishBooks() {
  const metadataPath = path.join(__dirname, '../data/egw-books/metadata-spanish.json');
  
  if (!fs.existsSync(metadataPath)) {
    console.error('❌ Spanish metadata file not found');
    process.exit(1);
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const books = metadata.books;

  console.log('📚 Loading Spanish EGW book metadata into database...\n');

  await dataSource.initialize();
  console.log('✅ Database connection established\n');

  // Don't clear existing books - we want to keep English books
  console.log('📝 Loading Spanish books alongside English books...\n');

  let loaded = 0;
  let skipped = 0;
  
  for (const book of books) {
    // Prefix Spanish book codes with es_ to avoid conflicts
    const bookCode = `es_${book.code}`;
    
    // Check if book already exists
    const existing = await dataSource.query(
      `SELECT id FROM egw_books WHERE code = $1`,
      [bookCode]
    );
    
    if (existing.length > 0) {
      // Update existing book
      await dataSource.query(
        `UPDATE egw_books SET title = $1, category = $2, language = $3 WHERE code = $4`,
        [book.title, book.category, book.language, bookCode]
      );
      skipped++;
    } else {
      // Insert new book
      await dataSource.query(
        `INSERT INTO egw_books (code, title, category, language)
         VALUES ($1, $2, $3, $4)`,
        [bookCode, book.title, book.category, book.language]
      );
      loaded++;
    }
    
    if ((loaded + skipped) % 10 === 0) {
      console.log(`  ✓ Processed ${loaded + skipped}/${books.length} books...`);
    }
  }

  console.log(`\n✅ Successfully processed ${books.length} Spanish EGW books`);
  console.log(`   📥 New books inserted: ${loaded}`);
  console.log(`   🔄 Existing books updated: ${skipped}`);

  const totalCount = await dataSource.query('SELECT COUNT(*) as count FROM egw_books');
  const spanishCount = await dataSource.query("SELECT COUNT(*) as count FROM egw_books WHERE language = 'es'");
  const englishCount = await dataSource.query("SELECT COUNT(*) as count FROM egw_books WHERE language = 'en'");
  
  console.log(`📊 Total books in database: ${totalCount[0].count}`);
  console.log(`   🇺🇸 English: ${englishCount[0].count}`);
  console.log(`   🇪🇸 Spanish: ${spanishCount[0].count}`);

  await dataSource.destroy();
  console.log('\n✅ Database connection closed');
}

loadSpanishBooks().catch(console.error);
