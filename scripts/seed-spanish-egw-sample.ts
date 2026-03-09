/**
 * Seed Spanish EGW Sample Data
 * Manually seeds Spanish EGW paragraphs and references for testing
 * Focuses on Ephesians 2 content from El Deseado de Todas las Gentes
 */

import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

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

// Sample Spanish EGW content related to Ephesians 2 themes
const spanishEGWData = [
  {
    bookCode: 'es_DTG',
    bookTitle: 'El Deseado de Todas las Gentes',
    chapterNumber: 1,
    chapterTitle: 'Dios con Nosotros',
    paragraphNumber: 1,
    content: 'Al venir a morar con nosotros, Jesús iba a revelar a Dios tanto a los hombres como a los ángeles. Él era la Palabra de Dios: el pensamiento de Dios hecho audible. En su oración por sus discípulos, dice: "Yo les he manifestado tu nombre"—"misericordioso y piadoso; tardo para la ira, y grande en benignidad y verdad"—"para que el amor con que me has amado, esté en ellos, y yo en ellos."',
    reference: 'es_DTG 1.1',
    bibleReferences: [
      { book: 'Efesios', chapter: 2, verseStart: 4, verseEnd: 5, reference: 'Efesios 2:4-5' }
    ]
  },
  {
    bookCode: 'es_DTG',
    bookTitle: 'El Deseado de Todas las Gentes',
    chapterNumber: 1,
    chapterTitle: 'Dios con Nosotros',
    paragraphNumber: 2,
    content: 'Pero esta revelación no fue dada solamente para sus hijos nacidos en la tierra. Nuestro pequeño mundo es un libro de texto para el universo. El maravilloso y misericordioso propósito de Dios, el misterio del amor redentor, es el tema en el cual "desean mirar los ángeles," y será su estudio a través de los siglos sin fin. Tanto los redimidos como los seres que nunca cayeron hallarán en la cruz de Cristo su ciencia y su canción.',
    reference: 'es_DTG 1.2',
    bibleReferences: [
      { book: 'Efesios', chapter: 2, verseStart: 7, verseEnd: 7, reference: 'Efesios 2:7' }
    ]
  },
  {
    bookCode: 'es_DTG',
    bookTitle: 'El Deseado de Todas las Gentes',
    chapterNumber: 2,
    chapterTitle: 'El Pueblo Escogido',
    paragraphNumber: 1,
    content: 'Por más de mil años, los judíos habían esperado la venida del Salvador. En este acontecimiento habían cifrado sus más gloriosas esperanzas. En cantos y profecías, en los ritos del templo y en las oraciones del hogar, habían conservado su nombre. Y sin embargo, cuando vino, no le conocieron. El Amado del cielo fue para ellos "como raíz de tierra seca;" no vieron en él belleza que le deseasen.',
    reference: 'es_DTG 2.1',
    bibleReferences: [
      { book: 'Efesios', chapter: 2, verseStart: 12, verseEnd: 13, reference: 'Efesios 2:12-13' }
    ]
  },
  {
    bookCode: 'es_CC',
    bookTitle: 'El Camino a Cristo',
    chapterNumber: 1,
    chapterTitle: 'El Amor de Dios',
    paragraphNumber: 1,
    content: 'La naturaleza y la revelación a una dan testimonio del amor de Dios. Nuestro Padre celestial es la fuente de vida, sabiduría y gozo. Mirad las maravillas y bellezas de la naturaleza. Pensad en su prodigiosa adaptación a las necesidades y a la felicidad, no solamente del hombre, sino de todas las criaturas vivientes.',
    reference: 'CC 1.1',
    bibleReferences: [
      { book: 'Efesios', chapter: 2, verseStart: 4, verseEnd: 5, reference: 'Efesios 2:4-5' }
    ]
  },
  {
    bookCode: 'es_CC',
    bookTitle: 'El Camino a Cristo',
    chapterNumber: 2,
    chapterTitle: 'El Pecador Necesita a Cristo',
    paragraphNumber: 1,
    content: 'El hombre estaba dotado originalmente de facultades nobles y de un entendimiento bien equilibrado. Era perfecto en su ser y estaba en armonía con Dios. Sus pensamientos eran puros, sus designios santos. Pero por la desobediencia, sus facultades se pervirtieron y el egoísmo reemplazó al amor. Su naturaleza quedó tan debilitada por la transgresión que le fue imposible, por su propia fuerza, resistir el poder del mal.',
    reference: 'es_CC 2.1',
    bibleReferences: [
      { book: 'Efesios', chapter: 2, verseStart: 1, verseEnd: 3, reference: 'Efesios 2:1-3' }
    ]
  },
  {
    bookCode: 'es_CC',
    bookTitle: 'El Camino a Cristo',
    chapterNumber: 3,
    chapterTitle: 'El Arrepentimiento',
    paragraphNumber: 1,
    content: '¿Cómo se efectuará la justificación del hombre? ¿Cómo llegará el pecador a ser justo? Sólo por medio de Cristo podemos ser puestos en armonía con Dios y la santidad; pero, ¿cómo hemos de ir a Cristo? Muchos hacen hoy la misma pregunta que hizo la multitud en el día de Pentecostés, cuando, convencida de pecado, exclamó: "¿Qué haremos?"',
    reference: 'es_CC 3.1',
    bibleReferences: [
      { book: 'Efesios', chapter: 2, verseStart: 8, verseEnd: 9, reference: 'Efesios 2:8-9' }
    ]
  },
  {
    bookCode: 'es_PP',
    bookTitle: 'Patriarcas y Profetas',
    chapterNumber: 1,
    chapterTitle: 'La Creación',
    paragraphNumber: 1,
    content: '"En el principio creó Dios los cielos y la tierra." Como el libro de la naturaleza y el de la revelación llevan el sello de la misma mente maestra, no pueden menos que hablar en armonía. Con lenguaje diferente, dan testimonio de las mismas grandes verdades. La ciencia descubre siempre nuevas maravillas, se remonta a mayores alturas y explora nuevas profundidades; pero de su búsqueda no trae nada que, correctamente entendido, esté en conflicto con la revelación divina.',
    reference: 'es_PP 1.1',
    bibleReferences: [
      { book: 'Efesios', chapter: 2, verseStart: 10, verseEnd: 10, reference: 'Efesios 2:10' }
    ]
  }
];

async function seedSpanishEGW() {
  try {
    console.log('🌍 Seeding Spanish EGW sample data...\n');
    
    await dataSource.initialize();
    console.log('✅ Database connection established\n');

    // First, ensure Spanish books exist in egw_books table
    console.log('📚 Ensuring Spanish books exist...');
    
    const spanishBooks = [
      { code: 'es_DTG', title: 'El Deseado de Todas las Gentes', category: 'Conflict of Ages', language: 'es' },
      { code: 'es_CC', title: 'El Camino a Cristo', category: 'Christian Living', language: 'es' },
      { code: 'es_PP', title: 'Patriarcas y Profetas', category: 'Conflict of Ages', language: 'es' }
    ];

    for (const book of spanishBooks) {
      await dataSource.query(
        `INSERT INTO egw_books (code, title, category, language)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (code) DO UPDATE SET title = $2, category = $3, language = $4`,
        [book.code, book.title, book.category, book.language]
      );
    }
    console.log(`✅ Ensured ${spanishBooks.length} Spanish books\n`);

    // Insert paragraphs
    console.log('📝 Inserting Spanish paragraphs...');
    let paragraphCount = 0;

    for (const para of spanishEGWData) {
      const result = await dataSource.query(
        `INSERT INTO egw_paragraphs 
         ("bookCode", "bookTitle", language, "chapterNumber", "chapterTitle", "paragraphNumber", content, reference, "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING id`,
        [para.bookCode, para.bookTitle, 'es', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference]
      );

      const paragraphId = result[0].id;
      paragraphCount++;

      // Insert Bible references for this paragraph
      for (const ref of para.bibleReferences) {
        await dataSource.query(
          `INSERT INTO egw_scripture_references 
           ("egwParagraphId", book, chapter, "verseStart", "verseEnd", reference, language, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [paragraphId, ref.book, ref.chapter, ref.verseStart, ref.verseEnd, ref.reference, 'es']
        );
      }
    }

    console.log(`✅ Inserted ${paragraphCount} Spanish paragraphs with Bible references\n`);

    // Verify
    const bookCount = await dataSource.query(
      `SELECT COUNT(*) as count FROM egw_books WHERE language = 'es'`
    );
    const paraCount = await dataSource.query(
      `SELECT COUNT(*) as count FROM egw_paragraphs WHERE language = 'es'`
    );
    const refCount = await dataSource.query(
      `SELECT COUNT(*) as count FROM egw_scripture_references WHERE language = 'es'`
    );

    console.log('='.repeat(60));
    console.log('📊 Spanish EGW Data Summary');
    console.log('='.repeat(60));
    console.log(`📚 Spanish books: ${bookCount[0].count}`);
    console.log(`📝 Spanish paragraphs: ${paraCount[0].count}`);
    console.log(`📖 Spanish Bible references: ${refCount[0].count}`);
    console.log('='.repeat(60));

    await dataSource.destroy();
    console.log('\n✅ Spanish EGW sample data seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding Spanish EGW data:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

seedSpanishEGW();
