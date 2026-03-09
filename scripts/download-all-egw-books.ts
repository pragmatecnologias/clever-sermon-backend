/**
 * Download All EGW Books - English and Spanish
 * Downloads comprehensive collection of Ellen G. White books in both languages
 * Based on available books from egwwritings.org
 * 
 * Usage: npx ts-node scripts/download-all-egw-books.ts
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
  { code: 'Ed', title: 'Education', url: 'https://media2.egwwritings.org/epub/en_Ed.epub', category: 'Education', language: 'en' },
  { code: 'AH', title: 'The Adventist Home', url: 'https://media2.egwwritings.org/epub/en_AH.epub', category: 'Family', language: 'en' },
  { code: 'CG', title: 'Child Guidance', url: 'https://media2.egwwritings.org/epub/en_CG.epub', category: 'Family', language: 'en' },
  { code: 'CS', title: 'Counsels on Stewardship', url: 'https://media2.egwwritings.org/epub/en_CS.epub', category: 'Christian Living', language: 'en' },
  { code: 'ChS', title: 'Christian Service', url: 'https://media2.egwwritings.org/epub/en_ChS.epub', category: 'Christian Living', language: 'en' },
  
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
  
  // Doctrinal & Ministry
  { code: 'EW', title: 'Early Writings', url: 'https://media2.egwwritings.org/epub/en_EW.epub', category: 'Doctrinal', language: 'en' },
  { code: 'GW', title: 'Gospel Workers', url: 'https://media2.egwwritings.org/epub/en_GW.epub', category: 'Ministry', language: 'en' },
  { code: 'Ev', title: 'Evangelism', url: 'https://media2.egwwritings.org/epub/en_Ev.epub', category: 'Ministry', language: 'en' },
  { code: 'PM', title: 'Publishing Ministry', url: 'https://media2.egwwritings.org/epub/en_PM.epub', category: 'Ministry', language: 'en' },
  { code: 'WM', title: 'Welfare Ministry', url: 'https://media2.egwwritings.org/epub/en_WM.epub', category: 'Ministry', language: 'en' },
  { code: 'TM', title: 'Testimonies to Ministers', url: 'https://media2.egwwritings.org/epub/en_TM.epub', category: 'Ministry', language: 'en' },
  
  // Health & Temperance
  { code: 'CD', title: 'Counsels on Diet and Foods', url: 'https://media2.egwwritings.org/epub/en_CD.epub', category: 'Health', language: 'en' },
  { code: 'Te', title: 'Temperance', url: 'https://media2.egwwritings.org/epub/en_Te.epub', category: 'Health', language: 'en' },
  { code: 'CH', title: 'Counsels on Health', url: 'https://media2.egwwritings.org/epub/en_CH.epub', category: 'Health', language: 'en' },
  { code: 'MM', title: 'Medical Ministry', url: 'https://media2.egwwritings.org/epub/en_MM.epub', category: 'Health', language: 'en' },
  
  // Education
  { code: 'CT', title: 'Counsels to Teachers', url: 'https://media2.egwwritings.org/epub/en_CT.epub', category: 'Education', language: 'en' },
  { code: 'FE', title: 'Fundamentals of Christian Education', url: 'https://media2.egwwritings.org/epub/en_FE.epub', category: 'Education', language: 'en' },
  { code: 'CSW', title: 'Counsels on Sabbath School Work', url: 'https://media2.egwwritings.org/epub/en_CSW.epub', category: 'Education', language: 'en' },
  
  // Selected Messages
  { code: '1SM', title: 'Selected Messages Book 1', url: 'https://media2.egwwritings.org/epub/en_1SM.epub', category: 'Compilations', language: 'en' },
  { code: '2SM', title: 'Selected Messages Book 2', url: 'https://media2.egwwritings.org/epub/en_2SM.epub', category: 'Compilations', language: 'en' },
  { code: '3SM', title: 'Selected Messages Book 3', url: 'https://media2.egwwritings.org/epub/en_3SM.epub', category: 'Compilations', language: 'en' },
  
  // Mind, Character & Personality
  { code: '1MCP', title: 'Mind, Character, and Personality Volume 1', url: 'https://media2.egwwritings.org/epub/en_1MCP.epub', category: 'Christian Living', language: 'en' },
  { code: '2MCP', title: 'Mind, Character, and Personality Volume 2', url: 'https://media2.egwwritings.org/epub/en_2MCP.epub', category: 'Christian Living', language: 'en' },
  
  // Youth & Messages
  { code: 'MYP', title: 'Messages to Young People', url: 'https://media2.egwwritings.org/epub/en_MYP.epub', category: 'Youth', language: 'en' },
  { code: 'LYL', title: 'Letters to Young Lovers', url: 'https://media2.egwwritings.org/epub/en_LYL.epub', category: 'Youth', language: 'en' },
  
  // Other Important Books
  { code: 'LS', title: 'Life Sketches', url: 'https://media2.egwwritings.org/epub/en_LS.epub', category: 'Biography', language: 'en' },
  { code: 'SR', title: 'The Story of Redemption', url: 'https://media2.egwwritings.org/epub/en_SR.epub', category: 'Doctrinal', language: 'en' },
  { code: 'LDE', title: 'Last Day Events', url: 'https://media2.egwwritings.org/epub/en_LDE.epub', category: 'Prophecy', language: 'en' },
  { code: 'CW', title: 'Counsels to Writers and Editors', url: 'https://media2.egwwritings.org/epub/en_CW.epub', category: 'Ministry', language: 'en' },
  
  // ========== SPANISH BOOKS ==========
  
  // Serie Conflicto de los Siglos
  { code: 'PP', title: 'Patriarcas y Profetas', url: 'https://media2.egwwritings.org/epub/es_PP.epub', category: 'Conflict of Ages', language: 'es' },
  { code: 'PR', title: 'Profetas y Reyes', url: 'https://media2.egwwritings.org/epub/es_PR.epub', category: 'Conflict of Ages', language: 'es' },
  { code: 'DTG', title: 'El Deseado de Todas las Gentes', url: 'https://media2.egwwritings.org/epub/es_DTG.epub', category: 'Conflict of Ages', language: 'es' },
  { code: 'HAp', title: 'Los Hechos de los Apóstoles', url: 'https://media2.egwwritings.org/epub/es_HAp.epub', category: 'Conflict of Ages', language: 'es' },
  { code: 'CS', title: 'El Conflicto de los Siglos', url: 'https://media2.egwwritings.org/epub/es_CS.epub', category: 'Conflict of Ages', language: 'es' },
  
  // Vida Cristiana
  { code: 'CC', title: 'El Camino a Cristo', url: 'https://media2.egwwritings.org/epub/es_CC.epub', category: 'Christian Living', language: 'es' },
  { code: 'DMJ', title: 'El Discurso Maestro de Jesucristo', url: 'https://media2.egwwritings.org/epub/es_DMJ.epub', category: 'Christian Living', language: 'es' },
  { code: 'PVGM', title: 'Palabras de Vida del Gran Maestro', url: 'https://media2.egwwritings.org/epub/es_PVGM.epub', category: 'Christian Living', language: 'es' },
  { code: 'MC', title: 'El Ministerio de Curación', url: 'https://media2.egwwritings.org/epub/es_MC.epub', category: 'Health', language: 'es' },
  { code: 'Ed', title: 'La Educación', url: 'https://media2.egwwritings.org/epub/es_Ed.epub', category: 'Education', language: 'es' },
  { code: 'HC', title: 'El Hogar Cristiano', url: 'https://media2.egwwritings.org/epub/es_HC.epub', category: 'Family', language: 'es' },
  { code: 'CN', title: 'Conducción del Niño', url: 'https://media2.egwwritings.org/epub/es_CN.epub', category: 'Family', language: 'es' },
  { code: 'CMC', title: 'Consejos sobre Mayordomía Cristiana', url: 'https://media2.egwwritings.org/epub/es_CMC.epub', category: 'Christian Living', language: 'es' },
  { code: 'SC', title: 'Servicio Cristiano', url: 'https://media2.egwwritings.org/epub/es_SC.epub', category: 'Christian Living', language: 'es' },
  
  // Testimonios
  { code: '1T', title: 'Testimonios para la Iglesia Tomo 1', url: 'https://media2.egwwritings.org/epub/es_1T.epub', category: 'Testimonies', language: 'es' },
  { code: '2T', title: 'Testimonios para la Iglesia Tomo 2', url: 'https://media2.egwwritings.org/epub/es_2T.epub', category: 'Testimonies', language: 'es' },
  { code: '3T', title: 'Testimonios para la Iglesia Tomo 3', url: 'https://media2.egwwritings.org/epub/es_3T.epub', category: 'Testimonies', language: 'es' },
  { code: '4T', title: 'Testimonios para la Iglesia Tomo 4', url: 'https://media2.egwwritings.org/epub/es_4T.epub', category: 'Testimonies', language: 'es' },
  { code: '5T', title: 'Testimonios para la Iglesia Tomo 5', url: 'https://media2.egwwritings.org/epub/es_5T.epub', category: 'Testimonies', language: 'es' },
  { code: '6T', title: 'Testimonios para la Iglesia Tomo 6', url: 'https://media2.egwwritings.org/epub/es_6T.epub', category: 'Testimonies', language: 'es' },
  { code: '7T', title: 'Testimonios para la Iglesia Tomo 7', url: 'https://media2.egwwritings.org/epub/es_7T.epub', category: 'Testimonies', language: 'es' },
  { code: '8T', title: 'Testimonios para la Iglesia Tomo 8', url: 'https://media2.egwwritings.org/epub/es_8T.epub', category: 'Testimonies', language: 'es' },
  { code: '9T', title: 'Testimonios para la Iglesia Tomo 9', url: 'https://media2.egwwritings.org/epub/es_9T.epub', category: 'Testimonies', language: 'es' },
  
  // Joyas de los Testimonios
  { code: '1JT', title: 'Joyas de los Testimonios Tomo 1', url: 'https://media2.egwwritings.org/epub/es_1JT.epub', category: 'Testimonies', language: 'es' },
  { code: '2JT', title: 'Joyas de los Testimonios Tomo 2', url: 'https://media2.egwwritings.org/epub/es_2JT.epub', category: 'Testimonies', language: 'es' },
  { code: '3JT', title: 'Joyas de los Testimonios Tomo 3', url: 'https://media2.egwwritings.org/epub/es_3JT.epub', category: 'Testimonies', language: 'es' },
  
  // Doctrinal y Ministerio
  { code: 'PE', title: 'Primeros Escritos', url: 'https://media2.egwwritings.org/epub/es_PE.epub', category: 'Doctrinal', language: 'es' },
  { code: 'OE', title: 'Obreros Evangélicos', url: 'https://media2.egwwritings.org/epub/es_OE.epub', category: 'Ministry', language: 'es' },
  { code: 'Ev', title: 'El Evangelismo', url: 'https://media2.egwwritings.org/epub/es_Ev.epub', category: 'Ministry', language: 'es' },
  { code: 'MPu', title: 'El Ministerio de Publicaciones', url: 'https://media2.egwwritings.org/epub/es_MPu.epub', category: 'Ministry', language: 'es' },
  { code: 'CE', title: 'El Colportor Evangélico', url: 'https://media2.egwwritings.org/epub/es_CE.epub', category: 'Ministry', language: 'es' },
  
  // Salud y Temperancia
  { code: 'CRA', title: 'Consejos Sobre el Régimen Alimenticio', url: 'https://media2.egwwritings.org/epub/es_CRA.epub', category: 'Health', language: 'es' },
  { code: 'Te', title: 'La Temperancia', url: 'https://media2.egwwritings.org/epub/es_Te.epub', category: 'Health', language: 'es' },
  { code: 'CSI', title: 'Consejos Sobre la Salud', url: 'https://media2.egwwritings.org/epub/es_CSI.epub', category: 'Health', language: 'es' },
  { code: 'MM', title: 'El Ministerio Médico', url: 'https://media2.egwwritings.org/epub/es_MM.epub', category: 'Health', language: 'es' },
  
  // Educación
  { code: 'CM', title: 'Consejos para los Maestros', url: 'https://media2.egwwritings.org/epub/es_CM.epub', category: 'Education', language: 'es' },
  { code: 'FEC', title: 'Fundamentos de la Educación Cristiana', url: 'https://media2.egwwritings.org/epub/es_FEC.epub', category: 'Education', language: 'es' },
  { code: 'COES', title: 'Consejos Sobre la Obra de la Escuela Sabática', url: 'https://media2.egwwritings.org/epub/es_COES.epub', category: 'Education', language: 'es' },
  
  // Mensajes Selectos
  { code: '1MS', title: 'Mensajes Selectos Tomo 1', url: 'https://media2.egwwritings.org/epub/es_1MS.epub', category: 'Compilations', language: 'es' },
  { code: '2MS', title: 'Mensajes Selectos Tomo 2', url: 'https://media2.egwwritings.org/epub/es_2MS.epub', category: 'Compilations', language: 'es' },
  { code: '3MS', title: 'Mensajes Selectos Tomo 3', url: 'https://media2.egwwritings.org/epub/es_3MS.epub', category: 'Compilations', language: 'es' },
  
  // Mente, Carácter y Personalidad
  { code: '1MCP', title: 'Mente, Carácter y Personalidad Tomo 1', url: 'https://media2.egwwritings.org/epub/es_1MCP.epub', category: 'Christian Living', language: 'es' },
  { code: '2MCP', title: 'Mente, Carácter y Personalidad Tomo 2', url: 'https://media2.egwwritings.org/epub/es_2MCP.epub', category: 'Christian Living', language: 'es' },
  
  // Jóvenes y Mensajes
  { code: 'MJ', title: 'Mensajes para los Jóvenes', url: 'https://media2.egwwritings.org/epub/es_MJ.epub', category: 'Youth', language: 'es' },
  { code: 'CJE', title: 'Cartas a Jóvenes Enamorados', url: 'https://media2.egwwritings.org/epub/es_CJE.epub', category: 'Youth', language: 'es' },
  
  // Otros Libros Importantes
  { code: 'NBEW', title: 'Notas Biográficas de Elena G. de White', url: 'https://media2.egwwritings.org/epub/es_NBEW.epub', category: 'Biography', language: 'es' },
  { code: 'HR', title: 'La Historia de la Redención', url: 'https://media2.egwwritings.org/epub/es_HR.epub', category: 'Doctrinal', language: 'es' },
  { code: 'EUD', title: 'Eventos de los Últimos Días', url: 'https://media2.egwwritings.org/epub/es_EUD.epub', category: 'Prophecy', language: 'es' },
  { code: 'FO', title: 'Fe y Obras', url: 'https://media2.egwwritings.org/epub/es_FO.epub', category: 'Doctrinal', language: 'es' },
  { code: 'LC', title: 'Liderazgo Cristiano', url: 'https://media2.egwwritings.org/epub/es_LC.epub', category: 'Ministry', language: 'es' },
  { code: 'Or', title: 'La Oración', url: 'https://media2.egwwritings.org/epub/es_Or.epub', category: 'Christian Living', language: 'es' },
  { code: 'CPI', title: 'Consejos para la Iglesia', url: 'https://media2.egwwritings.org/epub/es_CPI.epub', category: 'Christian Living', language: 'es' },
];

const DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
const METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata-complete.json');

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
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        fs.unlink(destination, () => {});
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
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

  console.log(`📚 Starting comprehensive download of ${EGW_BOOKS.length} EGW books...`);
  console.log(`   🇺🇸 English: ${englishBooks.length} books`);
  console.log(`   🇪🇸 Spanish: ${spanishBooks.length} books`);
  console.log(`📁 Download directory: ${DOWNLOAD_DIR}\n`);

  const results = {
    successful: [] as string[],
    failed: [] as { code: string; error: string; language: string }[],
    skipped: [] as string[]
  };

  for (let i = 0; i < EGW_BOOKS.length; i++) {
    const book = EGW_BOOKS[i];
    const filename = `${book.language}_${book.code}.epub`;
    const filepath = path.join(DOWNLOAD_DIR, filename);

    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      // Skip if file exists and is larger than 1KB (not an error file)
      if (stats.size > 1024) {
        console.log(`⏭️  [${i + 1}/${EGW_BOOKS.length}] Skipping ${book.language}_${book.code} - already exists`);
        results.skipped.push(`${book.language}_${book.code}`);
        continue;
      } else {
        // Delete small files (likely errors) and re-download
        fs.unlinkSync(filepath);
      }
    }

    try {
      const flag = book.language === 'en' ? '🇺🇸' : '🇪🇸';
      console.log(`⬇️  [${i + 1}/${EGW_BOOKS.length}] ${flag} Downloading ${book.language}_${book.code}: ${book.title}...`);
      await downloadFile(book.url, filepath);
      
      const stats = fs.statSync(filepath);
      const sizeInKB = (stats.size / 1024).toFixed(2);
      
      // Check if download was successful (file size > 1KB)
      if (stats.size > 1024) {
        console.log(`✅ Downloaded ${book.language}_${book.code} (${sizeInKB} KB)`);
        results.successful.push(`${book.language}_${book.code}`);
      } else {
        console.error(`❌ Failed ${book.language}_${book.code}: File too small (likely 404)`);
        results.failed.push({ code: `${book.language}_${book.code}`, error: 'File not found on server', language: book.language });
        fs.unlinkSync(filepath);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ Failed to download ${book.language}_${book.code}: ${error.message}`);
      results.failed.push({ code: `${book.language}_${book.code}`, error: error.message, language: book.language });
    }
  }

  const metadata = {
    downloadDate: new Date().toISOString(),
    totalBooks: EGW_BOOKS.length,
    englishBooks: englishBooks.length,
    spanishBooks: spanishBooks.length,
    books: EGW_BOOKS.map(b => ({ ...b, downloadedAs: `${b.language}_${b.code}.epub` })),
    results
  };

  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 Comprehensive Download Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully downloaded: ${results.successful.length}`);
  console.log(`   🇺🇸 English: ${results.successful.filter(c => c.startsWith('en_')).length}`);
  console.log(`   🇪🇸 Spanish: ${results.successful.filter(c => c.startsWith('es_')).length}`);
  console.log(`⏭️  Skipped (already exist): ${results.skipped.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📁 Total files: ${results.successful.length + results.skipped.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    const enFailed = results.failed.filter(f => f.language === 'en');
    const esFailed = results.failed.filter(f => f.language === 'es');
    if (enFailed.length > 0) {
      console.log(`   🇺🇸 English (${enFailed.length}):`);
      enFailed.forEach(({ code, error }) => {
        console.log(`      - ${code}: ${error}`);
      });
    }
    if (esFailed.length > 0) {
      console.log(`   🇪🇸 Spanish (${esFailed.length}):`);
      esFailed.forEach(({ code, error }) => {
        console.log(`      - ${code}: ${error}`);
      });
    }
  }
  
  console.log(`\n📄 Metadata saved to: ${METADATA_FILE}`);
  console.log('='.repeat(60));
}

downloadAllBooks().catch(console.error);
