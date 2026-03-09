/**
 * Load Spanish EGW Paragraphs
 * Loads Spanish paragraphs into the database
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

async function loadSpanishParagraphs() {
  const paragraphsPath = path.join(__dirname, '../data/egw-parsed-spanish/paragraphs.json');
  
  if (!fs.existsSync(paragraphsPath)) {
    console.error('❌ Spanish paragraphs file not found');
    process.exit(1);
  }

  console.log('📖 Loading Spanish EGW paragraphs...');
  const paragraphs = JSON.parse(fs.readFileSync(paragraphsPath, 'utf8'));
  
  console.log('🔌 Connecting to database...');
  await dataSource.initialize();
  
  console.log('🗑️  Clearing existing Spanish paragraphs...');
  await dataSource.query("DELETE FROM egw_paragraphs WHERE language = 'es'");
  
  console.log('📝 Loading paragraphs into database...\n');
  
  let inserted = 0;
  const batchSize = 500;
  
  for (let i = 0; i < paragraphs.length; i += batchSize) {
    const batch = paragraphs.slice(i, i + batchSize);
    
    for (const para of batch) {
      await dataSource.query(
        `INSERT INTO egw_paragraphs 
         ("bookCode", "bookTitle", language, "chapterNumber", "chapterTitle", "paragraphNumber", content, reference, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [`es_${para.bookCode}`, para.bookTitle, 'es', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference]
      );
      inserted++;
    }
    
    console.log(`✅ Inserted ${inserted} paragraphs...`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Load Complete');
  console.log('='.repeat(60));
  console.log(`✅ Total Spanish paragraphs inserted: ${inserted}`);
  
  const totalCount = await dataSource.query('SELECT COUNT(*) as count FROM egw_paragraphs');
  const spanishCount = await dataSource.query("SELECT COUNT(*) as count FROM egw_paragraphs WHERE language = 'es'");
  const englishCount = await dataSource.query("SELECT COUNT(*) as count FROM egw_paragraphs WHERE language = 'en'");
  
  console.log(`📊 Total paragraphs in database: ${totalCount[0].count}`);
  console.log(`   🇺🇸 English: ${englishCount[0].count}`);
  console.log(`   🇪🇸 Spanish: ${spanishCount[0].count}`);
  console.log('='.repeat(60));
  
  await dataSource.destroy();
}

loadSpanishParagraphs().catch(console.error);
