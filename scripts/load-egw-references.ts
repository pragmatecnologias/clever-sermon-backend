/**
 * Load EGW Bible References into Database
 * Loads the extracted Bible references from paragraphs-with-references.json
 * into the egw_scripture_references table
 * 
 * Usage: npx ts-node scripts/load-egw-references.ts
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

async function loadReferences() {
  const PARSED_FILE = path.join(__dirname, '../data/egw-parsed/paragraphs-with-references.json');
  
  if (!fs.existsSync(PARSED_FILE)) {
    console.error('❌ File not found:', PARSED_FILE);
    console.error('Run extract-bible-references.ts first.');
    process.exit(1);
  }

  console.log('📖 Loading paragraphs with references...');
  const paragraphs: EGWParagraphWithRefs[] = JSON.parse(fs.readFileSync(PARSED_FILE, 'utf8'));
  
  console.log('🔌 Connecting to database...');
  await AppDataSource.initialize();
  
  try {
    console.log('� Building paragraph reference map from database...');
    // Get all existing paragraphs from database to map references to UUIDs
    const dbParagraphs = await AppDataSource.query(
      'SELECT id, reference FROM egw_paragraphs'
    );
    
    const refToUuidMap = new Map<string, string>();
    dbParagraphs.forEach((p: any) => {
      refToUuidMap.set(p.reference, p.id);
    });
    
    console.log(`✅ Found ${refToUuidMap.size} paragraphs in database`);
    
    console.log('�️  Clearing existing references...');
    await AppDataSource.query('TRUNCATE TABLE egw_scripture_references CASCADE');
    
    console.log('📝 Loading references into database...\n');
    
    let totalInserted = 0;
    let skipped = 0;
    let batchSize = 500;
    let batch: any[] = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      
      if (para.bibleReferences.length === 0) continue;
      
      // Look up the actual UUID for this paragraph
      const paragraphUuid = refToUuidMap.get(para.reference);
      
      if (!paragraphUuid) {
        skipped++;
        continue; // Skip if paragraph not in database
      }
      
      for (const ref of para.bibleReferences) {
        batch.push({
          egwParagraphId: paragraphUuid,
          book: ref.book,
          chapter: ref.chapter,
          verseStart: ref.verseStart || null,
          verseEnd: ref.verseEnd || null,
          reference: ref.reference,
          language: para.language
        });
        
        if (batch.length >= batchSize) {
          await insertBatch(AppDataSource, batch);
          totalInserted += batch.length;
          console.log(`✅ Inserted ${totalInserted} references...`);
          batch = [];
        }
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
    console.log(`✅ Total references inserted: ${totalInserted}`);
    console.log(`⏭️  Paragraphs skipped (not in DB): ${skipped}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error loading references:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

async function insertBatch(dataSource: DataSource, batch: any[]) {
  const values = batch.map(ref => 
    `(uuid_generate_v4(), '${ref.egwParagraphId}', '${escapeSql(ref.book)}', ${ref.chapter}, ${ref.verseStart}, ${ref.verseEnd}, '${escapeSql(ref.reference)}', '${ref.language}', NOW())`
  ).join(',');
  
  const query = `
    INSERT INTO egw_scripture_references 
    (id, "egwParagraphId", book, chapter, "verseStart", "verseEnd", reference, language, "createdAt")
    VALUES ${values}
  `;
  
  await dataSource.query(query);
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

loadReferences().catch(console.error);
