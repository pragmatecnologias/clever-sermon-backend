/**
 * Create Spanish EGW Books Metadata
 * Generates metadata for all Spanish EPUB files found in data/egw-books
 */

import * as fs from 'fs';
import * as path from 'path';

const DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
const METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata-spanish.json');

// Map Spanish book codes to titles and categories
const SPANISH_BOOK_INFO: Record<string, { title: string; category: string }> = {
  // Conflict of Ages Series
  'PP': { title: 'Patriarcas y Profetas', category: 'Conflict of Ages' },
  'PR': { title: 'Profetas y Reyes', category: 'Conflict of Ages' },
  'DTG': { title: 'El Deseado de Todas las Gentes', category: 'Conflict of Ages' },
  'HAp': { title: 'Los Hechos de los Apóstoles', category: 'Conflict of Ages' },
  'CS': { title: 'El Conflicto de los Siglos', category: 'Conflict of Ages' },
  
  // Christian Living
  'CC': { title: 'El Camino a Cristo', category: 'Christian Living' },
  'DMJ': { title: 'El Discurso Maestro de Jesucristo', category: 'Christian Living' },
  'PVGM': { title: 'Palabras de Vida del Gran Maestro', category: 'Christian Living' },
  'SC': { title: 'Servicio Cristiano', category: 'Christian Living' },
  'CMC': { title: 'Consejos sobre Mayordomía Cristiana', category: 'Christian Living' },
  'CNS': { title: 'Cristo Nuestro Salvador', category: 'Christian Living' },
  'Or': { title: 'La Oración', category: 'Christian Living' },
  'CPI': { title: 'Consejos para la Iglesia', category: 'Christian Living' },
  'FO': { title: 'Fe y Obras', category: 'Christian Living' },
  'ECFP': { title: 'La Edificación del Carácter', category: 'Christian Living' },
  
  // Health
  'MC': { title: 'El Ministerio de Curación', category: 'Health' },
  'CRA': { title: 'Consejos Sobre el Régimen Alimenticio', category: 'Health' },
  'Te': { title: 'La Temperancia', category: 'Health' },
  'CSI': { title: 'Consejos Sobre la Salud', category: 'Health' },
  'CES': { title: 'Cristo en Su Santuario', category: 'Health' },
  'MM': { title: 'El Ministerio Médico', category: 'Health' },
  
  // Family
  'HC': { title: 'El Hogar Cristiano', category: 'Family' },
  'CN': { title: 'Conducción del Niño', category: 'Family' },
  'HD': { title: 'Hijas de Dios', category: 'Family' },
  
  // Education
  'ED': { title: 'La Educación', category: 'Education' },
  'CM': { title: 'Consejos para los Maestros', category: 'Education' },
  'ECR': { title: 'La Educación Cristiana', category: 'Education' },
  'COES': { title: 'Consejos Sobre la Obra de la Escuela Sabática', category: 'Education' },
  
  // Testimonies
  '1TPI': { title: 'Testimonios para la Iglesia Tomo 1', category: 'Testimonies' },
  '2TPI': { title: 'Testimonios para la Iglesia Tomo 2', category: 'Testimonies' },
  '3TPI': { title: 'Testimonios para la Iglesia Tomo 3', category: 'Testimonies' },
  '4TPI': { title: 'Testimonios para la Iglesia Tomo 4', category: 'Testimonies' },
  '5TPI': { title: 'Testimonios para la Iglesia Tomo 5', category: 'Testimonies' },
  '6TPI': { title: 'Testimonios para la Iglesia Tomo 6', category: 'Testimonies' },
  '7TPI': { title: 'Testimonios para la Iglesia Tomo 7', category: 'Testimonies' },
  '8TPI': { title: 'Testimonios para la Iglesia Tomo 8', category: 'Testimonies' },
  '9TPI': { title: 'Testimonios para la Iglesia Tomo 9', category: 'Testimonies' },
  
  // Joyas de los Testimonios
  '1JT': { title: 'Joyas de los Testimonios Tomo 1', category: 'Testimonies' },
  '2JT': { title: 'Joyas de los Testimonios Tomo 2', category: 'Testimonies' },
  '3JT': { title: 'Joyas de los Testimonios Tomo 3', category: 'Testimonies' },
  '1TS': { title: 'Testimonios Selectos Tomo 1', category: 'Testimonies' },
  '2TS': { title: 'Testimonios Selectos Tomo 2', category: 'Testimonies' },
  '3TS': { title: 'Testimonios Selectos Tomo 3', category: 'Testimonies' },
  '4TS': { title: 'Testimonios Selectos Tomo 4', category: 'Testimonies' },
  '5TS': { title: 'Testimonios Selectos Tomo 5', category: 'Testimonies' },
  
  // Mensajes Selectos
  '1MS': { title: 'Mensajes Selectos Tomo 1', category: 'Compilations' },
  '2MS': { title: 'Mensajes Selectos Tomo 2', category: 'Compilations' },
  '3MS': { title: 'Mensajes Selectos Tomo 3', category: 'Compilations' },
  
  // Mente, Carácter y Personalidad
  '1MCP': { title: 'Mente, Carácter y Personalidad Tomo 1', category: 'Christian Living' },
  '2MCP': { title: 'Mente, Carácter y Personalidad Tomo 2', category: 'Christian Living' },
  '1MCP89': { title: 'Mente, Carácter y Personalidad Tomo 1 (1989)', category: 'Christian Living' },
  '2MCP89': { title: 'Mente, Carácter y Personalidad Tomo 2 (1989)', category: 'Christian Living' },
  
  // Ministry
  'OE': { title: 'Obreros Evangélicos', category: 'Ministry' },
  'Ev': { title: 'El Evangelismo', category: 'Ministry' },
  'MPu': { title: 'El Ministerio de Publicaciones', category: 'Ministry' },
  'CE': { title: 'El Colportor Evangélico', category: 'Ministry' },
  'MPa': { title: 'El Ministerio Pastoral', category: 'Ministry' },
  'LC': { title: 'Liderazgo Cristiano', category: 'Ministry' },
  'TM': { title: 'Testimonios para los Ministros', category: 'Ministry' },
  'MB': { title: 'El Ministerio de la Bondad', category: 'Ministry' },
  'OP': { title: 'El otro Poder', category: 'Ministry' },
  
  // Doctrinal
  'PE': { title: 'Primeros Escritos', category: 'Doctrinal' },
  'HR': { title: 'La Historia de la Redención', category: 'Doctrinal' },
  'IR': { title: 'La Iglesia Remanente', category: 'Doctrinal' },
  
  // Youth
  'MJ': { title: 'Mensajes para los Jóvenes', category: 'Youth' },
  'CJE': { title: 'Cartas a Jóvenes Enamorados', category: 'Youth' },
  
  // Biography
  'NBEW': { title: 'Notas Biográficas de Elena G. de White', category: 'Biography' },
  
  // Prophecy
  'EUD': { title: 'Eventos de los Últimos Días', category: 'Prophecy' },
  'EUD92': { title: 'Eventos de los Últimos Días (1992)', category: 'Prophecy' },
  'CI': { title: 'El Conflicto Inminente', category: 'Prophecy' },
  'PUD': { title: 'Promesas para los Últimos Días', category: 'Prophecy' },
  
  // Other
  'SVC': { title: 'La Segunda Venida y el Cielo', category: 'Doctrinal' },
  'TCS': { title: 'Testimonios Acerca de Conducta Sexual', category: 'Christian Living' },
  'DCC': { title: 'De la Ciudad al Campo', category: 'Christian Living' },
  'RAM': { title: 'Reavivamientos Modernos', category: 'Christian Living' },
  'Mu': { title: 'La Música', category: 'Christian Living' },
  'UE': { title: 'Una Esperanza', category: 'Christian Living' },
  'VAAn': { title: 'La Verdad Acerca de los Ángeles', category: 'Doctrinal' },
  'VEUC': { title: 'Visiones del Espíritu de Profecía', category: 'Doctrinal' },
  'PP54': { title: 'Patriarcas y Profetas (1954)', category: 'Conflict of Ages' },
  'ED98': { title: 'La Educación (1998)', category: 'Education' },
  'HD99': { title: 'Hijas de Dios (1999)', category: 'Family' },
  'Or06': { title: 'La Oración (2006)', category: 'Christian Living' },
};

function createSpanishMetadata() {
  const files = fs.readdirSync(DOWNLOAD_DIR);
  const spanishEpubs = files.filter(f => f.startsWith('es_') && f.endsWith('.epub'));
  
  console.log(`📚 Found ${spanishEpubs.length} Spanish EPUB files\n`);
  
  const books = spanishEpubs.map(filename => {
    // Extract book code from filename (e.g., "es_PP(PP).epub" -> "PP")
    const match = filename.match(/^es_([^(\.]+)/);
    const code = match ? match[1] : filename.replace('es_', '').replace('.epub', '');
    
    const info = SPANISH_BOOK_INFO[code] || { 
      title: code, 
      category: 'Other' 
    };
    
    const stats = fs.statSync(path.join(DOWNLOAD_DIR, filename));
    
    return {
      code,
      title: info.title,
      filename,
      category: info.category,
      language: 'es' as const,
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
    language: 'es',
    books
  };
  
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
  
  console.log('✅ Spanish metadata created');
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

createSpanishMetadata();
