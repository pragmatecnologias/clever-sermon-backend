import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

interface EGWBook {
  code: string;
  title: string;
  url: string;
  category: string;
  language: 'en' | 'es';
}

const EGW_BOOKS: EGWBook[] = [
  // Conflict of Ages Series
  { code: 'PP', title: 'Patriarchs and Prophets', url: 'https://media2.egwwritings.org/epub/en_PP.epub', category: 'Conflict of Ages', language: 'en' },
  { code: 'PK', title: 'Prophets and Kings', url: 'https://media2.egwwritings.org/epub/en_PK.epub', category: 'Conflict of Ages', language: 'en' },
  { code: 'DA', title: 'The Desire of Ages', url: 'https://media2.egwwritings.org/epub/en_DA.epub', category: 'Conflict of Ages', language: 'en' },
  { code: 'AA', title: 'The Acts of the Apostles', url: 'https://media2.egwwritings.org/epub/en_AA.epub', category: 'Conflict of Ages', language: 'en' },
  { code: 'GC', title: 'The Great Controversy', url: 'https://media2.egwwritings.org/epub/en_GC.epub', category: 'Conflict of Ages', language: 'en' },
  
  // Christian Living
  { code: 'SC', title: 'Steps to Christ', url: 'https://media2.egwwritings.org/epub/en_SC.epub', category: 'Christian Living', language: 'en' },
  { code: 'MB', title: 'Thoughts from the Mount of Blessing', url: 'https://media2.egwwritings.org/epub/en_MB.epub', category: 'Christian Living', language: 'en' },
  { code: 'COL', title: 'Christ\'s Object Lessons', url: 'https://media2.egwwritings.org/epub/en_COL.epub', category: 'Christian Living', language: 'en' },
  { code: 'MH', title: 'The Ministry of Healing', url: 'https://media2.egwwritings.org/epub/en_MH.epub', category: 'Christian Living', language: 'en' },
  { code: 'Ed', title: 'Education', url: 'https://media2.egwwritings.org/epub/en_Ed.epub', category: 'Christian Living', language: 'en' },
  
  // Testimonies
  { code: '1T', title: 'Testimonies for the Church Volume 1', url: 'https://media2.egwwritings.org/epub/en_1T.epub', category: 'Testimonies', language: 'en' },
  { code: '2T', title: 'Testimonies for the Church Volume 2', url: 'https://media2.egwwritings.org/epub/en_2T.epub', category: 'Testimonies', language: 'en' },
  { code: '3T', title: 'Testimonies for the Church Volume 3', url: 'https://media2.egwwritings.org/epub/en_3T.epub', category: 'Testimonies', language: 'en' },
  { code: '4T', title: 'Testimonies for the Church Volume 4', url: 'https://media2.egwwritings.org/epub/en_4T.epub', category: 'Testimonies', language: 'en' },
  { code: '5T', title: 'Testimonies for the Church Volume 5', url: 'https://media2.egwwritings.org/epub/en_5T.epub', category: 'Testimonies', language: 'en' },
  { code: '6T', title: 'Testimonies for the Church Volume 6', url: 'https://media2.egwwritings.org/epub/en_6T.epub', category: 'Testimonies', language: 'en' },
  { code: '7T', title: 'Testimonies for the Church Volume 7', url: 'https://media2.egwwritings.org/epub/en_7T.epub', category: 'Testimonies', language: 'en' },
  { code: '8T', title: 'Testimonies for the Church Volume 8', url: 'https://media2.egwwritings.org/epub/en_8T.epub', category: 'Testimonies', language: 'en' },
  { code: '9T', title: 'Testimonies for the Church Volume 9', url: 'https://media2.egwwritings.org/epub/en_9T.epub', category: 'Testimonies', language: 'en' },
  
  // Devotional
  { code: 'ML', title: 'My Life Today', url: 'https://media2.egwwritings.org/epub/en_ML.epub', category: 'Devotional', language: 'en' },
  { code: 'OHC', title: 'Our High Calling', url: 'https://media2.egwwritings.org/epub/en_OHC.epub', category: 'Devotional', language: 'en' },
  { code: 'Mar', title: 'Maranatha', url: 'https://media2.egwwritings.org/epub/en_Mar.epub', category: 'Devotional', language: 'en' },
  
  // Doctrinal
  { code: 'EW', title: 'Early Writings', url: 'https://media2.egwwritings.org/epub/en_EW.epub', category: 'Doctrinal', language: 'en' },
  { code: 'GW', title: 'Gospel Workers', url: 'https://media2.egwwritings.org/epub/en_GW.epub', category: 'Doctrinal', language: 'en' },
  { code: 'Ev', title: 'Evangelism', url: 'https://media2.egwwritings.org/epub/en_Ev.epub', category: 'Doctrinal', language: 'en' },
  
  // Health
  { code: 'CD', title: 'Counsels on Diet and Foods', url: 'https://media2.egwwritings.org/epub/en_CD.epub', category: 'Health', language: 'en' },
  { code: 'Te', title: 'Temperance', url: 'https://media2.egwwritings.org/epub/en_Te.epub', category: 'Health', language: 'en' },
  
  // Family
  { code: 'AH', title: 'The Adventist Home', url: 'https://media2.egwwritings.org/epub/en_AH.epub', category: 'Family', language: 'en' },
  { code: 'CG', title: 'Child Guidance', url: 'https://media2.egwwritings.org/epub/en_CG.epub', category: 'Family', language: 'en' },
  
  // Additional Important Works
  { code: 'CS', title: 'Counsels on Stewardship', url: 'https://media2.egwwritings.org/epub/en_CS.epub', category: 'Christian Living', language: 'en' },
  { code: 'CT', title: 'Counsels to Teachers', url: 'https://media2.egwwritings.org/epub/en_CT.epub', category: 'Education', language: 'en' },
  { code: 'FE', title: 'Fundamentals of Christian Education', url: 'https://media2.egwwritings.org/epub/en_FE.epub', category: 'Education', language: 'en' },
  { code: 'LS', title: 'Life Sketches', url: 'https://media2.egwwritings.org/epub/en_LS.epub', category: 'Biography', language: 'en' },
  { code: 'PM', title: 'Publishing Ministry', url: 'https://media2.egwwritings.org/epub/en_PM.epub', category: 'Ministry', language: 'en' },
  { code: 'WM', title: 'Welfare Ministry', url: 'https://media2.egwwritings.org/epub/en_WM.epub', category: 'Ministry', language: 'en' }
];

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
