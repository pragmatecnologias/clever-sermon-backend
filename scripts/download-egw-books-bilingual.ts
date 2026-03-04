/**
 * EGW Book Downloader - Bilingual (English & Spanish)
 * Downloads all Ellen G. White books from egwwritings.org in both languages
 * 
 * Usage: npx ts-node scripts/download-egw-books-bilingual.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

interface EGWBook {
  code: string;
  title: string;
  url: string;
  category: string;
  language: 'en' | 'es';
}

// Comprehensive list of EGW books in BOTH English and Spanish
const EGW_BOOKS: EGWBook[] = [
  // ========== ENGLISH BOOKS ==========
  // Conflict of the Ages Series
  { code: 'en_PP', title: 'Patriarchs and Prophets', url: 'https://media2.egwwritings.org/epub/en_PP.epub', category: 'Conflict of Ages', language: 'en' },
  { code: 'en_PK', title: 'Prophets and Kings', url: 'https://media2.egwwritings.org/epub/en_PK.epub', category: 'Conflict of Ages', language: 'en' },
  { code: 'en_DA', title: 'The Desire of Ages', url: 'https://media2.egwwritings.org/epub/en_DA.epub', category: 'Conflict of Ages', language: 'en' },
  { code: 'en_AA', title: 'The Acts of the Apostles', url: 'https://media2.egwwritings.org/epub/en_AA.epub', category: 'Conflict of Ages', language: 'en' },
  { code: 'en_GC', title: 'The Great Controversy', url: 'https://media2.egwwritings.org/epub/en_GC.epub', category: 'Conflict of Ages', language: 'en' },
  
  // Christian Living
  { code: 'en_SC', title: 'Steps to Christ', url: 'https://media2.egwwritings.org/epub/en_SC.epub', category: 'Christian Living', language: 'en' },
  { code: 'en_MB', title: 'Thoughts from the Mount of Blessing', url: 'https://media2.egwwritings.org/epub/en_MB.epub', category: 'Christian Living', language: 'en' },
  { code: 'en_COL', title: 'Christ\'s Object Lessons', url: 'https://media2.egwwritings.org/epub/en_COL.epub', category: 'Christian Living', language: 'en' },
  { code: 'en_MH', title: 'The Ministry of Healing', url: 'https://media2.egwwritings.org/epub/en_MH.epub', category: 'Christian Living', language: 'en' },
  { code: 'en_Ed', title: 'Education', url: 'https://media2.egwwritings.org/epub/en_Ed.epub', category: 'Christian Living', language: 'en' },
  
  // Testimonies
  { code: 'en_1T', title: 'Testimonies Volume 1', url: 'https://media2.egwwritings.org/epub/en_1T.epub', category: 'Testimonies', language: 'en' },
  { code: 'en_2T', title: 'Testimonies Volume 2', url: 'https://media2.egwwritings.org/epub/en_2T.epub', category: 'Testimonies', language: 'en' },
  { code: 'en_3T', title: 'Testimonies Volume 3', url: 'https://media2.egwwritings.org/epub/en_3T.epub', category: 'Testimonies', language: 'en' },
  { code: 'en_4T', title: 'Testimonies Volume 4', url: 'https://media2.egwwritings.org/epub/en_4T.epub', category: 'Testimonies', language: 'en' },
  { code: 'en_5T', title: 'Testimonies Volume 5', url: 'https://media2.egwwritings.org/epub/en_5T.epub', category: 'Testimonies', language: 'en' },
  { code: 'en_6T', title: 'Testimonies Volume 6', url: 'https://media2.egwwritings.org/epub/en_6T.epub', category: 'Testimonies', language: 'en' },
  { code: 'en_7T', title: 'Testimonies Volume 7', url: 'https://media2.egwwritings.org/epub/en_7T.epub', category: 'Testimonies', language: 'en' },
  { code: 'en_8T', title: 'Testimonies Volume 8', url: 'https://media2.egwwritings.org/epub/en_8T.epub', category: 'Testimonies', language: 'en' },
  { code: 'en_9T', title: 'Testimonies Volume 9', url: 'https://media2.egwwritings.org/epub/en_9T.epub', category: 'Testimonies', language: 'en' },
  
  // Additional English Books
  { code: 'en_AH', title: 'The Adventist Home', url: 'https://media2.egwwritings.org/epub/en_AH.epub', category: 'Family', language: 'en' },
  { code: 'en_CG', title: 'Child Guidance', url: 'https://media2.egwwritings.org/epub/en_CG.epub', category: 'Family', language: 'en' },
  { code: 'en_EW', title: 'Early Writings', url: 'https://media2.egwwritings.org/epub/en_EW.epub', category: 'Doctrinal', language: 'en' },
  { code: 'en_GW', title: 'Gospel Workers', url: 'https://media2.egwwritings.org/epub/en_GW.epub', category: 'Ministry', language: 'en' },
  
  // ========== SPANISH BOOKS ==========
  // Serie Conflicto de los Siglos
  { code: 'es_PP', title: 'Patriarcas y Profetas', url: 'https://media2.egwwritings.org/epub/es_PP.epub', category: 'Conflict of Ages', language: 'es' },
  { code: 'es_PR', title: 'Profetas y Reyes', url: 'https://media2.egwwritings.org/epub/es_PR.epub', category: 'Conflict of Ages', language: 'es' },
  { code: 'es_DTG', title: 'El Deseado de Todas las Gentes', url: 'https://media2.egwwritings.org/epub/es_DTG.epub', category: 'Conflict of Ages', language: 'es' },
  { code: 'es_HAp', title: 'Los Hechos de los Apóstoles', url: 'https://media2.egwwritings.org/epub/es_HAp.epub', category: 'Conflict of Ages', language: 'es' },
  { code: 'es_CS', title: 'El Conflicto de los Siglos', url: 'https://media2.egwwritings.org/epub/es_CS.epub', category: 'Conflict of Ages', language: 'es' },
  
  // Vida Cristiana
  { code: 'es_CC', title: 'El Camino a Cristo', url: 'https://media2.egwwritings.org/epub/es_CC.epub', category: 'Christian Living', language: 'es' },
  { code: 'es_DMJ', title: 'El Discurso Maestro de Jesucristo', url: 'https://media2.egwwritings.org/epub/es_DMJ.epub', category: 'Christian Living', language: 'es' },
  { code: 'es_PVGM', title: 'Palabras de Vida del Gran Maestro', url: 'https://media2.egwwritings.org/epub/es_PVGM.epub', category: 'Christian Living', language: 'es' },
  { code: 'es_MC', title: 'El Ministerio de Curación', url: 'https://media2.egwwritings.org/epub/es_MC.epub', category: 'Christian Living', language: 'es' },
  { code: 'es_Ed', title: 'La Educación', url: 'https://media2.egwwritings.org/epub/es_Ed.epub', category: 'Christian Living', language: 'es' },
  
  // Testimonios
  { code: 'es_1T', title: 'Testimonios Tomo 1', url: 'https://media2.egwwritings.org/epub/es_1T.epub', category: 'Testimonies', language: 'es' },
  { code: 'es_2T', title: 'Testimonios Tomo 2', url: 'https://media2.egwwritings.org/epub/es_2T.epub', category: 'Testimonies', language: 'es' },
  { code: 'es_3T', title: 'Testimonios Tomo 3', url: 'https://media2.egwwritings.org/epub/es_3T.epub', category: 'Testimonies', language: 'es' },
  { code: 'es_4T', title: 'Testimonios Tomo 4', url: 'https://media2.egwwritings.org/epub/es_4T.epub', category: 'Testimonies', language: 'es' },
  { code: 'es_5T', title: 'Testimonios Tomo 5', url: 'https://media2.egwwritings.org/epub/es_5T.epub', category: 'Testimonies', language: 'es' },
  { code: 'es_6T', title: 'Testimonios Tomo 6', url: 'https://media2.egwwritings.org/epub/es_6T.epub', category: 'Testimonies', language: 'es' },
  { code: 'es_7T', title: 'Testimonios Tomo 7', url: 'https://media2.egwwritings.org/epub/es_7T.epub', category: 'Testimonies', language: 'es' },
  { code: 'es_8T', title: 'Testimonios Tomo 8', url: 'https://media2.egwwritings.org/epub/es_8T.epub', category: 'Testimonies', language: 'es' },
  { code: 'es_9T', title: 'Testimonios Tomo 9', url: 'https://media2.egwwritings.org/epub/es_9T.epub', category: 'Testimonies', language: 'es' },
  
  // Libros Adicionales en Español
  { code: 'es_HAd', title: 'El Hogar Adventista', url: 'https://media2.egwwritings.org/epub/es_HAd.epub', category: 'Family', language: 'es' },
  { code: 'es_CN', title: 'Conducción del Niño', url: 'https://media2.egwwritings.org/epub/es_CN.epub', category: 'Family', language: 'es' },
  { code: 'es_PE', title: 'Primeros Escritos', url: 'https://media2.egwwritings.org/epub/es_PE.epub', category: 'Doctrinal', language: 'es' },
  { code: 'es_OE', title: 'Obreros Evangélicos', url: 'https://media2.egwwritings.org/epub/es_OE.epub', category: 'Ministry', language: 'es' },
  { code: 'es_CES(CIHS)', title: 'Consejos sobre la Salud', url: 'https://media2.egwwritings.org/epub/es_CES(CIHS).epub', category: 'Health', language: 'es' },
  { code: 'es_CMC', title: 'Consejos sobre Mayordomía Cristiana', url: 'https://media2.egwwritings.org/epub/es_CMC.epub', category: 'Christian Living', language: 'es' },
  { code: 'es_FEC', title: 'Fundamentals of Christian Education', url: 'https://media2.egwwritings.org/epub/es_FEC.epub', category: 'Education', language: 'es' },
  { code: 'es_MeM', title: 'Mente, Carácter y Personalidad', url: 'https://media2.egwwritings.org/epub/es_MeM.epub', category: 'Christian Living', language: 'es' }
];

const DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
const METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata-bilingual.json');

async function downloadFile(url: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, (redirectResponse) => {
            redirectResponse.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          }).on('error', (err) => {
            fs.unlink(destination, () => {});
            reject(err);
          });
        }
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      reject(err);
    });
  });
}

async function downloadAllBooks() {
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }

  const englishBooks = EGW_BOOKS.filter(b => b.language === 'en');
  const spanishBooks = EGW_BOOKS.filter(b => b.language === 'es');

  console.log(`📚 Starting bilingual download of ${EGW_BOOKS.length} EGW books...`);
  console.log(`   🇺🇸 English: ${englishBooks.length} books`);
  console.log(`   🇪🇸 Spanish: ${spanishBooks.length} books`);
  console.log(`📁 Download directory: ${DOWNLOAD_DIR}\n`);

  const results = {
    successful: [] as string[],
    failed: [] as { code: string; error: string }[],
    skipped: [] as string[]
  };

  for (let i = 0; i < EGW_BOOKS.length; i++) {
    const book = EGW_BOOKS[i];
    const filename = `${book.code}.epub`;
    const filepath = path.join(DOWNLOAD_DIR, filename);

    if (fs.existsSync(filepath)) {
      console.log(`⏭️  [${i + 1}/${EGW_BOOKS.length}] Skipping ${book.code} - already exists`);
      results.skipped.push(book.code);
      continue;
    }

    try {
      const flag = book.language === 'en' ? '🇺🇸' : '🇪🇸';
      console.log(`⬇️  [${i + 1}/${EGW_BOOKS.length}] ${flag} Downloading ${book.code}: ${book.title}...`);
      await downloadFile(book.url, filepath);
      
      const stats = fs.statSync(filepath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ Downloaded ${book.code} (${sizeInMB} MB)`);
      results.successful.push(book.code);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to download ${book.code}: ${error.message}`);
      results.failed.push({ code: book.code, error: error.message });
    }
  }

  const metadata = {
    downloadDate: new Date().toISOString(),
    totalBooks: EGW_BOOKS.length,
    englishBooks: englishBooks.length,
    spanishBooks: spanishBooks.length,
    books: EGW_BOOKS,
    results
  };

  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 Bilingual Download Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully downloaded: ${results.successful.length}`);
  console.log(`   🇺🇸 English: ${results.successful.filter(c => c.startsWith('en_')).length}`);
  console.log(`   🇪🇸 Spanish: ${results.successful.filter(c => c.startsWith('es_')).length}`);
  console.log(`⏭️  Skipped (already exist): ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📁 Total files: ${results.successful.length + results.skipped.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    results.failed.forEach(({ code, error }) => {
      console.log(`   - ${code}: ${error}`);
    });
  }
  
  console.log(`\n📄 Metadata saved to: ${METADATA_FILE}`);
  console.log('='.repeat(60));
}

downloadAllBooks().catch(console.error);
