/**
 * EGW Book Downloader
 * Downloads all Ellen G. White books from egwwritings.org
 * 
 * Usage: npx ts-node scripts/download-egw-books.ts
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

// Comprehensive list of EGW books with their codes
const EGW_BOOKS: EGWBook[] = [
  // ENGLISH BOOKS
  // Conflict of the Ages Series
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

const DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
const METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata.json');

async function downloadFile(url: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
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
  // Create download directory if it doesn't exist
  if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  }

  console.log(`📚 Starting download of ${EGW_BOOKS.length} EGW books...`);
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

    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  [${i + 1}/${EGW_BOOKS.length}] Skipping ${book.code} - already exists`);
      results.skipped.push(book.code);
      continue;
    }

    try {
      console.log(`⬇️  [${i + 1}/${EGW_BOOKS.length}] Downloading ${book.code}: ${book.title}...`);
      await downloadFile(book.url, filepath);
      
      const stats = fs.statSync(filepath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ Downloaded ${book.code} (${sizeInMB} MB)`);
      results.successful.push(book.code);
      
      // Small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to download ${book.code}: ${error.message}`);
      results.failed.push({ code: book.code, error: error.message });
    }
  }

  // Save metadata
  const metadata = {
    downloadDate: new Date().toISOString(),
    totalBooks: EGW_BOOKS.length,
    books: EGW_BOOKS,
    results
  };

  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Download Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully downloaded: ${results.successful.length}`);
  console.log(`⏭️  Skipped (already exist): ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📁 Total files in directory: ${results.successful.length + results.skipped.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    results.failed.forEach(({ code, error }) => {
      console.log(`   - ${code}: ${error}`);
    });
  }
  
  console.log(`\n📄 Metadata saved to: ${METADATA_FILE}`);
  console.log('='.repeat(60));
}

// Run the download
downloadAllBooks().catch(console.error);
