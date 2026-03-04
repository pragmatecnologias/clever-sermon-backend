/**
 * Load EGW Paragraphs into Database
 * Loads the parsed EGW paragraphs from paragraphs.json into the database
 * 
 * Usage: npx ts-node scripts/load-egw-paragraphs.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

// Parse DATABASE_URL if available
let dbConfig: any = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: '',
  database: 'clever_sermon',
};

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  dbConfig.username = url.username || 'admin';
  dbConfig.password = url.password || '';
  dbConfig.host = url.hostname || 'localhost';
  dbConfig.port = parseInt(url.port || '5432');
}

if (process.env.DATABASE_NAME) {
  dbConfig.database = process.env.DATABASE_NAME;
}

// Database configuration
const AppDataSource = new DataSource({
  ...dbConfig,
  entities: ['src/entities/**/*.entity.ts'],
  synchronize: false,
});

interface EGWParagraph {
  bookCode: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  paragraphNumber: number;
  content: string;
  reference: string;
}

async function loadParagraphs() {
  const PARSED_FILE = path.join(__dirname, '../data/egw-parsed/paragraphs.json');
  
  if (!fs.existsSync(PARSED_FILE)) {
    console.error('❌ File not found:', PARSED_FILE);
    console.error('Run parse-egw-books.ts first.');
    process.exit(1);
  }

  console.log('📖 Loading EGW paragraphs...');
  const paragraphs: EGWParagraph[] = JSON.parse(fs.readFileSync(PARSED_FILE, 'utf8'));
  
  console.log('🔌 Connecting to database...');
  await AppDataSource.initialize();
  
  try {
    console.log('🗑️  Clearing existing paragraphs...');
    await AppDataSource.query('TRUNCATE TABLE egw_paragraphs CASCADE');
    
    console.log('📝 Loading paragraphs into database...\n');
    
    let totalInserted = 0;
    let batchSize = 500;
    let batch: any[] = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      
      // Determine language from bookCode
      const language = para.bookCode.startsWith('es_') ? 'es' : 'en';
      
      batch.push({
        bookCode: para.bookCode,
        bookTitle: para.bookTitle,
        language,
        chapterNumber: para.chapterNumber,
        chapterTitle: para.chapterTitle,
        paragraphNumber: para.paragraphNumber,
        content: para.content,
        reference: para.reference
      });
      
      if (batch.length >= batchSize) {
        await insertBatch(AppDataSource, batch);
        totalInserted += batch.length;
        console.log(`✅ Inserted ${totalInserted} paragraphs...`);
        batch = [];
      }
    }
    
    // Insert remaining batch
    if (batch.length > 0) {
      await insertBatch(AppDataSource, batch);
      totalInserted += batch.length;
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Load Complete');
    console.log('='.repeat(60));
    console.log(`✅ Total paragraphs inserted: ${totalInserted}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error loading paragraphs:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

async function insertBatch(dataSource: DataSource, batch: any[]) {
  const values = batch.map(para => 
    `(uuid_generate_v4(), '${escapeSql(para.bookCode)}', '${escapeSql(para.bookTitle)}', '${para.language}', ${para.chapterNumber}, '${escapeSql(para.chapterTitle)}', ${para.paragraphNumber}, '${escapeSql(para.content)}', '${escapeSql(para.reference)}', NOW())`
  ).join(',');
  
  const query = `
    INSERT INTO egw_paragraphs 
    (id, "bookCode", "bookTitle", language, "chapterNumber", "chapterTitle", "paragraphNumber", content, reference, "createdAt")
    VALUES ${values}
  `;
  
  await dataSource.query(query);
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

loadParagraphs().catch(console.error);
