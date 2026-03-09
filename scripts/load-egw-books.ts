import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

interface EGWBook {
  code: string;
  title: string;
  url: string;
  category: string;
  language: 'en' | 'es';
}

// Load books from metadata file
const metadataPath = path.join(__dirname, '../data/egw-books/metadata-complete.json');
let EGW_BOOKS: EGWBook[] = [];

if (fs.existsSync(metadataPath)) {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  EGW_BOOKS = metadata.books.filter((b: any) => 
    metadata.results.successful.includes(b.downloadedAs?.replace('.epub', '')) ||
    metadata.results.skipped.includes(b.downloadedAs?.replace('.epub', ''))
  );
} else {
  console.error('❌ Metadata file not found. Run download script first.');
  process.exit(1);
}

async function loadEGWBooks() {
  // Parse DATABASE_URL from .env
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/';
  const databaseName = process.env.DATABASE_NAME || 'clever_sermon';
  
  // Extract connection details - handle format: postgresql://username:password@host:port/
  const urlMatch = databaseUrl.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)/);
  if (!urlMatch) {
    console.error('DATABASE_URL:', databaseUrl);
    throw new Error('Invalid DATABASE_URL format. Expected: postgresql://username:password@host:port/');
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

  try {
    console.log('📚 Loading EGW book metadata into database...\n');
    
    await dataSource.initialize();
    console.log('✅ Database connection established\n');

    // Clear existing books
    await dataSource.query('DELETE FROM egw_books');
    console.log('🗑️  Cleared existing book metadata\n');

    // Insert books
    let inserted = 0;
    for (const book of EGW_BOOKS) {
      await dataSource.query(
        `INSERT INTO egw_books (code, title, category, language)
         VALUES ($1, $2, $3, $4)`,
        [book.code, book.title, book.category, book.language]
      );
      inserted++;
      
      if (inserted % 10 === 0) {
        console.log(`  ✓ Loaded ${inserted}/${EGW_BOOKS.length} books...`);
      }
    }

    console.log(`\n✅ Successfully loaded ${inserted} EGW books into database`);
    
    // Verify
    const result = await dataSource.query('SELECT COUNT(*) as count FROM egw_books');
    console.log(`📊 Total books in database: ${result[0].count}\n`);

    await dataSource.destroy();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error loading EGW books:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

loadEGWBooks();
