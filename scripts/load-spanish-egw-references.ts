/**
 * Load Spanish EGW Bible References
 * Loads Spanish Bible references into the database
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

async function loadSpanishReferences() {
  const refsPath = path.join(__dirname, '../data/egw-parsed-spanish/paragraphs-with-references.json');
  
  if (!fs.existsSync(refsPath)) {
    console.error('❌ Spanish references file not found');
    process.exit(1);
  }

  console.log('📖 Loading paragraphs with references...');
  const paragraphsWithRefs = JSON.parse(fs.readFileSync(refsPath, 'utf8'));
  
  console.log('🔌 Connecting to database...');
  await dataSource.initialize();
  
  console.log('🗗 Building paragraph reference map from database...');
  const paragraphs = await dataSource.query(
    "SELECT id, reference FROM egw_paragraphs WHERE language = 'es'"
  );
  
  const paragraphMap = new Map();
  for (const para of paragraphs) {
    paragraphMap.set(para.reference, para.id);
  }
  
  console.log(`✅ Found ${paragraphs.length} Spanish paragraphs in database`);
  
  console.log('🗑️  Clearing existing Spanish references...');
  await dataSource.query("DELETE FROM egw_scripture_references WHERE language = 'es'");
  
  console.log('📝 Loading references into database...\n');
  
  let inserted = 0;
  let skipped = 0;
  
  for (const para of paragraphsWithRefs) {
    const paragraphId = paragraphMap.get(para.reference);
    
    if (!paragraphId) {
      skipped++;
      continue;
    }
    
    for (const ref of para.bibleReferences) {
      await dataSource.query(
        `INSERT INTO egw_scripture_references 
         ("egwParagraphId", book, chapter, "verseStart", "verseEnd", reference, language, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [paragraphId, ref.book, ref.chapter, ref.verseStart || null, ref.verseEnd || null, ref.reference, 'es']
      );
      inserted++;
      
      if (inserted % 1000 === 0) {
        console.log(`✅ Inserted ${inserted} references...`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Load Complete');
  console.log('='.repeat(60));
  console.log(`✅ Total Spanish references inserted: ${inserted}`);
  console.log(`⏭️  Paragraphs skipped (not in DB): ${skipped}`);
  
  const totalCount = await dataSource.query('SELECT COUNT(*) as count FROM egw_scripture_references');
  const spanishCount = await dataSource.query("SELECT COUNT(*) as count FROM egw_scripture_references WHERE language = 'es'");
  const englishCount = await dataSource.query("SELECT COUNT(*) as count FROM egw_scripture_references WHERE language = 'en'");
  
  console.log(`📊 Total references in database: ${totalCount[0].count}`);
  console.log(`   🇺🇸 English: ${englishCount[0].count}`);
  console.log(`   🇪🇸 Spanish: ${spanishCount[0].count}`);
  console.log('='.repeat(60));
  
  await dataSource.destroy();
}

loadSpanishReferences().catch(console.error);
