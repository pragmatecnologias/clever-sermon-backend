/**
 * Verify EGW Data in Database
 */

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

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

async function verifyData() {
  console.log('🔌 Connecting to database...\n');
  await dataSource.initialize();
  
  console.log('=== EGW DATA VERIFICATION ===\n');
  
  // Books
  const booksByLang = await dataSource.query(
    `SELECT language, COUNT(*) as count FROM egw_books GROUP BY language ORDER BY language`
  );
  const totalBooks = await dataSource.query(`SELECT COUNT(*) as count FROM egw_books`);
  
  console.log('📚 Books:');
  console.log(`   Total: ${totalBooks[0].count}`);
  booksByLang.forEach((row: any) => {
    const flag = row.language === 'en' ? '🇺🇸' : '🇪🇸';
    console.log(`   ${flag} ${row.language.toUpperCase()}: ${row.count}`);
  });
  
  // Paragraphs
  const parasByLang = await dataSource.query(
    `SELECT language, COUNT(*) as count FROM egw_paragraphs GROUP BY language ORDER BY language`
  );
  const totalParas = await dataSource.query(`SELECT COUNT(*) as count FROM egw_paragraphs`);
  
  console.log('\n📝 Paragraphs:');
  console.log(`   Total: ${totalParas[0].count}`);
  parasByLang.forEach((row: any) => {
    const flag = row.language === 'en' ? '🇺🇸' : '🇪🇸';
    console.log(`   ${flag} ${row.language.toUpperCase()}: ${row.count}`);
  });
  
  // References
  const refsByLang = await dataSource.query(
    `SELECT language, COUNT(*) as count FROM egw_scripture_references GROUP BY language ORDER BY language`
  );
  const totalRefs = await dataSource.query(`SELECT COUNT(*) as count FROM egw_scripture_references`);
  
  console.log('\n🔗 Bible References:');
  console.log(`   Total: ${totalRefs[0].count}`);
  refsByLang.forEach((row: any) => {
    const flag = row.language === 'en' ? '🇺🇸' : '🇪🇸';
    console.log(`   ${flag} ${row.language.toUpperCase()}: ${row.count}`);
  });
  
  // Sample books
  console.log('\n📖 Sample Books:');
  const sampleBooks = await dataSource.query(
    `SELECT code, title, language FROM egw_books ORDER BY language, code LIMIT 10`
  );
  sampleBooks.forEach((book: any) => {
    const flag = book.language === 'en' ? '🇺🇸' : '🇪🇸';
    console.log(`   ${flag} ${book.code} - ${book.title}`);
  });
  
  console.log('\n✅ Verification complete!');
  
  await dataSource.destroy();
}

verifyData().catch(console.error);
