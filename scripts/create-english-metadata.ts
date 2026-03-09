/**
 * Create English EGW Books Metadata
 * Generates metadata for all English EPUB files found in data/egw-books
 */

import * as fs from 'fs';
import * as path from 'path';

const DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
const METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata-english.json');

// Map English book codes to titles and categories
const ENGLISH_BOOK_INFO: Record<string, { title: string; category: string }> = {
  // Conflict of Ages Series
  'PP': { title: 'Patriarchs and Prophets', category: 'Conflict of Ages' },
  'PK': { title: 'Prophets and Kings', category: 'Conflict of Ages' },
  'DA': { title: 'The Desire of Ages', category: 'Conflict of Ages' },
  'AA': { title: 'The Acts of the Apostles', category: 'Conflict of Ages' },
  'GC': { title: 'The Great Controversy', category: 'Conflict of Ages' },
  'GC88': { title: 'The Great Controversy (1888)', category: 'Conflict of Ages' },
  
  // Christian Living
  'SC': { title: 'Steps to Christ', category: 'Christian Living' },
  'MB': { title: 'Thoughts from the Mount of Blessing', category: 'Christian Living' },
  'COL': { title: 'Christ\'s Object Lessons', category: 'Christian Living' },
  'ChS': { title: 'Christian Service', category: 'Christian Living' },
  'CS': { title: 'Counsels on Stewardship', category: 'Christian Living' },
  'CCh': { title: 'Counsels for the Church', category: 'Christian Living' },
  'FW': { title: 'Faith and Works', category: 'Christian Living' },
  'Pr': { title: 'Prayer', category: 'Christian Living' },
  'SL': { title: 'The Sanctified Life', category: 'Christian Living' },
  'NL': { title: 'A New Life', category: 'Christian Living' },
  'TR': { title: 'True Revival', category: 'Christian Living' },
  'CL': { title: 'Country Living', category: 'Christian Living' },
  'CSA': { title: 'A Call To Stand Apart', category: 'Christian Living' },
  
  // Health
  'MH': { title: 'The Ministry of Healing', category: 'Health' },
  'CD': { title: 'Counsels on Diet and Foods', category: 'Health' },
  'Te': { title: 'Temperance', category: 'Health' },
  'CH': { title: 'Counsels on Health', category: 'Health' },
  'MM': { title: 'Medical Ministry', category: 'Health' },
  'CIHS': { title: 'Christ in His Sanctuary', category: 'Health' },
  'HFM': { title: 'The Health Food Ministry', category: 'Health' },
  'HL': { title: 'Healthful Living', category: 'Health' },
  'CTBH': { title: 'Christian Temperance and Bible Hygiene', category: 'Health' },
  'TSDF': { title: 'Testimony Studies on Diet and Foods', category: 'Health' },
  
  // Family
  'AH': { title: 'The Adventist Home', category: 'Family' },
  'CG': { title: 'Child Guidance', category: 'Family' },
  'DG': { title: 'Daughters of God', category: 'Family' },
  'LYL': { title: 'Letters to Young Lovers', category: 'Family' },
  'PCP': { title: 'Peter\'s Counsel to Parents', category: 'Family' },
  
  // Education
  'Ed': { title: 'Education', category: 'Education' },
  'CT': { title: 'Counsels to Teachers', category: 'Education' },
  'FE': { title: 'Fundamentals of Christian Education', category: 'Education' },
  'CSW': { title: 'Counsels on Sabbath School Work', category: 'Education' },
  'CE': { title: 'Christian Education', category: 'Education' },
  'SpTEd': { title: 'Special Testimonies On Education', category: 'Education' },
  
  // Testimonies
  '1T': { title: 'Testimonies for the Church Volume 1', category: 'Testimonies' },
  '2T': { title: 'Testimonies for the Church Volume 2', category: 'Testimonies' },
  '3T': { title: 'Testimonies for the Church Volume 3', category: 'Testimonies' },
  '4T': { title: 'Testimonies for the Church Volume 4', category: 'Testimonies' },
  '5T': { title: 'Testimonies for the Church Volume 5', category: 'Testimonies' },
  '6T': { title: 'Testimonies for the Church Volume 6', category: 'Testimonies' },
  '7T': { title: 'Testimonies for the Church Volume 7', category: 'Testimonies' },
  '8T': { title: 'Testimonies for the Church Volume 8', category: 'Testimonies' },
  '9T': { title: 'Testimonies for the Church Volume 9', category: 'Testimonies' },
  '1TT': { title: 'Testimony Treasures Volume 1', category: 'Testimonies' },
  '2TT': { title: 'Testimony Treasures Volume 2', category: 'Testimonies' },
  '3TT': { title: 'Testimony Treasures Volume 3', category: 'Testimonies' },
  'TSS': { title: 'Testimonies on Sabbath-School Work', category: 'Testimonies' },
  'TSB': { title: 'Testimonies on Sexual Behavior', category: 'Testimonies' },
  'TSA': { title: 'Testimonies to Southern Africa', category: 'Testimonies' },
  
  // Selected Messages
  '1SM': { title: 'Selected Messages Book 1', category: 'Compilations' },
  '2SM': { title: 'Selected Messages Book 2', category: 'Compilations' },
  '3SM': { title: 'Selected Messages Book 3', category: 'Compilations' },
  
  // Mind, Character & Personality
  '1MCP': { title: 'Mind, Character, and Personality Volume 1', category: 'Christian Living' },
  '2MCP': { title: 'Mind, Character, and Personality Volume 2', category: 'Christian Living' },
  
  // Ministry
  'GW': { title: 'Gospel Workers', category: 'Ministry' },
  'GW92': { title: 'Gospel Workers (1892)', category: 'Ministry' },
  'Ev': { title: 'Evangelism', category: 'Ministry' },
  'PM': { title: 'Publishing Ministry', category: 'Ministry' },
  'WM': { title: 'Welfare Ministry', category: 'Ministry' },
  'TM': { title: 'Testimonies to Ministers', category: 'Ministry' },
  'PaM': { title: 'Pastoral Ministry', category: 'Ministry' },
  'ChL': { title: 'Christian Leadership', category: 'Ministry' },
  'CW': { title: 'Counsels to Writers and Editors', category: 'Ministry' },
  'CEv': { title: 'The Colporteur Evangelist', category: 'Ministry' },
  'CM': { title: 'Colporteur Ministry', category: 'Ministry' },
  'CME': { title: 'A Call to Medical Evangelism', category: 'Ministry' },
  'MC': { title: 'Manual for Canvassers', category: 'Ministry' },
  'MTC': { title: 'Ministry to the Cities', category: 'Ministry' },
  'SWk': { title: 'The Southern Work', category: 'Ministry' },
  
  // Doctrinal
  'EW': { title: 'Early Writings', category: 'Doctrinal' },
  'SR': { title: 'The Story of Redemption', category: 'Doctrinal' },
  'GRC': { title: 'God\'s Remnant Church', category: 'Doctrinal' },
  'TA': { title: 'The Truth About Angels', category: 'Doctrinal' },
  'VSS': { title: 'Visions and Spiritual Gifts', category: 'Doctrinal' },
  
  // Spiritual Gifts
  '1SG': { title: 'Spiritual Gifts Volume 1', category: 'Doctrinal' },
  '2SG': { title: 'Spiritual Gifts Volume 2', category: 'Doctrinal' },
  '3SG': { title: 'Spiritual Gifts Volume 3', category: 'Doctrinal' },
  '4aSG': { title: 'Spiritual Gifts Volume 4a', category: 'Doctrinal' },
  '4bSG': { title: 'Spiritual Gifts Volume 4b', category: 'Doctrinal' },
  
  // Spirit of Prophecy
  '1SP': { title: 'The Spirit of Prophecy Volume 1', category: 'Conflict of Ages' },
  '2SP': { title: 'The Spirit of Prophecy Volume 2', category: 'Conflict of Ages' },
  '3SP': { title: 'The Spirit of Prophecy Volume 3', category: 'Conflict of Ages' },
  '4SP': { title: 'The Spirit of Prophecy Volume 4', category: 'Conflict of Ages' },
  
  // Youth
  'MYP': { title: 'Messages to Young People', category: 'Youth' },
  'AY': { title: 'An Appeal to the Youth', category: 'Youth' },
  
  // Biography
  'LS': { title: 'Life Sketches', category: 'Biography' },
  'LS80': { title: 'Life Sketches (1880)', category: 'Biography' },
  'LS88': { title: 'Life Sketches (1888)', category: 'Biography' },
  'CET': { title: 'Christian Experience and Teachings', category: 'Biography' },
  
  // Prophecy
  'LDE': { title: 'Last Day Events', category: 'Prophecy' },
  'IC': { title: 'The Impending Conflict', category: 'Prophecy' },
  'DD': { title: 'Darkness Before Dawn', category: 'Prophecy' },
  'GrH_c': { title: 'The Great Hope (Condensed)', category: 'Prophecy' },
  
  // Other
  'Hvn': { title: 'Heaven', category: 'Doctrinal' },
  'HDL': { title: 'Help In Daily Living', category: 'Christian Living' },
  'Con': { title: 'Confrontation', category: 'Doctrinal' },
  'RY': { title: 'The Retirement Years', category: 'Christian Living' },
  'SA': { title: 'A Solemn Appeal', category: 'Christian Living' },
  'ApM': { title: 'An Appeal to Mothers', category: 'Family' },
  'LP': { title: 'Sketches from the Life of Paul', category: 'Biography' },
  'SJ': { title: 'The Story of Jesus', category: 'Christian Living' },
  'ExV': { title: 'Christian Experience and Views', category: 'Biography' },
  'ExV53': { title: 'Notes of Explanation', category: 'Biography' },
  'ExV54': { title: 'Supplement to Christian Experience', category: 'Biography' },
  'HS': { title: 'Historical Sketches', category: 'Biography' },
  'EP': { title: 'From Eternity Past', category: 'Conflict of Ages' },
  'HLv': { title: 'From Heaven With Love', category: 'Conflict of Ages' },
  'HF': { title: 'From Here to Forever', category: 'Conflict of Ages' },
  'SS': { title: 'From Splendor to Shadow', category: 'Conflict of Ages' },
  'TT': { title: 'From Trials to Triumph', category: 'Christian Living' },
  'WLF': { title: 'Words of Life and Faith', category: 'Christian Living' },
};

function createEnglishMetadata() {
  const files = fs.readdirSync(DOWNLOAD_DIR);
  const englishEpubs = files.filter(f => f.startsWith('en_') && f.endsWith('.epub'));
  
  console.log(`📚 Found ${englishEpubs.length} English EPUB files\n`);
  
  const books = englishEpubs.map(filename => {
    // Extract book code from filename (e.g., "en_PP.epub" -> "PP")
    const code = filename.replace('en_', '').replace('.epub', '');
    
    const info = ENGLISH_BOOK_INFO[code] || { 
      title: code, 
      category: 'Other' 
    };
    
    const stats = fs.statSync(path.join(DOWNLOAD_DIR, filename));
    
    return {
      code,
      title: info.title,
      filename,
      category: info.category,
      language: 'en' as const,
      sizeBytes: stats.size
    };
  });
  
  // Sort by category and title
  books.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
  
  const metadata = {
    createdDate: new Date().toISOString(),
    totalBooks: books.length,
    language: 'en',
    books
  };
  
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
  
  console.log('✅ English metadata created');
  console.log(`📊 Total books: ${books.length}`);
  console.log(`📁 Saved to: ${METADATA_FILE}\n`);
  
  // Show summary by category
  const byCategory = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('📊 Books by category:');
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });
}

createEnglishMetadata();
