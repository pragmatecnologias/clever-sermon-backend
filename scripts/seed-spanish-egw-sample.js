"use strict";
/**
 * Seed Spanish EGW Sample Data
 * Manually seeds Spanish EGW paragraphs and references for testing
 * Focuses on Ephesians 2 content from El Deseado de Todas las Gentes
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var dotenv_1 = require("dotenv");
var path = require("path");
(0, dotenv_1.config)({ path: path.join(__dirname, '../.env') });
var databaseUrl = process.env.DATABASE_URL || 'postgresql://admin:secret123@localhost:5432/';
var databaseName = process.env.DATABASE_NAME || 'clever_sermon';
var urlMatch = databaseUrl.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)/);
if (!urlMatch) {
    throw new Error('Invalid DATABASE_URL format');
}
var username = urlMatch[1], password = urlMatch[2], host = urlMatch[3], port = urlMatch[4];
var dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: host,
    port: parseInt(port),
    username: username,
    password: password,
    database: databaseName,
    synchronize: false,
    logging: false,
});
// Sample Spanish EGW content related to Ephesians 2 themes
var spanishEGWData = [
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
function seedSpanishEGW() {
    return __awaiter(this, void 0, void 0, function () {
        var spanishBooks, _i, spanishBooks_1, book, paragraphCount, _a, spanishEGWData_1, para, result, paragraphId, _b, _c, ref, bookCount, paraCount, refCount, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 17, , 19]);
                    console.log('🌍 Seeding Spanish EGW sample data...\n');
                    return [4 /*yield*/, dataSource.initialize()];
                case 1:
                    _d.sent();
                    console.log('✅ Database connection established\n');
                    // First, ensure Spanish books exist in egw_books table
                    console.log('📚 Ensuring Spanish books exist...');
                    spanishBooks = [
                        { code: 'es_DTG', title: 'El Deseado de Todas las Gentes', category: 'Conflict of Ages', language: 'es' },
                        { code: 'es_CC', title: 'El Camino a Cristo', category: 'Christian Living', language: 'es' },
                        { code: 'es_PP', title: 'Patriarcas y Profetas', category: 'Conflict of Ages', language: 'es' }
                    ];
                    _i = 0, spanishBooks_1 = spanishBooks;
                    _d.label = 2;
                case 2:
                    if (!(_i < spanishBooks_1.length)) return [3 /*break*/, 5];
                    book = spanishBooks_1[_i];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_books (code, title, category, language)\n         VALUES ($1, $2, $3, $4)\n         ON CONFLICT (code) DO UPDATE SET title = $2, category = $3, language = $4", [book.code, book.title, book.category, book.language])];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("\u2705 Ensured ".concat(spanishBooks.length, " Spanish books\n"));
                    // Insert paragraphs
                    console.log('📝 Inserting Spanish paragraphs...');
                    paragraphCount = 0;
                    _a = 0, spanishEGWData_1 = spanishEGWData;
                    _d.label = 6;
                case 6:
                    if (!(_a < spanishEGWData_1.length)) return [3 /*break*/, 12];
                    para = spanishEGWData_1[_a];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_paragraphs \n         (\"bookCode\", \"bookTitle\", language, \"chapterNumber\", \"chapterTitle\", \"paragraphNumber\", content, reference, \"createdAt\")\n         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())\n         RETURNING id", [para.bookCode, para.bookTitle, 'es', para.chapterNumber, para.chapterTitle, para.paragraphNumber, para.content, para.reference])];
                case 7:
                    result = _d.sent();
                    paragraphId = result[0].id;
                    paragraphCount++;
                    _b = 0, _c = para.bibleReferences;
                    _d.label = 8;
                case 8:
                    if (!(_b < _c.length)) return [3 /*break*/, 11];
                    ref = _c[_b];
                    return [4 /*yield*/, dataSource.query("INSERT INTO egw_scripture_references \n           (\"egwParagraphId\", book, chapter, \"verseStart\", \"verseEnd\", reference, language, \"createdAt\")\n           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())", [paragraphId, ref.book, ref.chapter, ref.verseStart, ref.verseEnd, ref.reference, 'es'])];
                case 9:
                    _d.sent();
                    _d.label = 10;
                case 10:
                    _b++;
                    return [3 /*break*/, 8];
                case 11:
                    _a++;
                    return [3 /*break*/, 6];
                case 12:
                    console.log("\u2705 Inserted ".concat(paragraphCount, " Spanish paragraphs with Bible references\n"));
                    return [4 /*yield*/, dataSource.query("SELECT COUNT(*) as count FROM egw_books WHERE language = 'es'")];
                case 13:
                    bookCount = _d.sent();
                    return [4 /*yield*/, dataSource.query("SELECT COUNT(*) as count FROM egw_paragraphs WHERE language = 'es'")];
                case 14:
                    paraCount = _d.sent();
                    return [4 /*yield*/, dataSource.query("SELECT COUNT(*) as count FROM egw_scripture_references WHERE language = 'es'")];
                case 15:
                    refCount = _d.sent();
                    console.log('='.repeat(60));
                    console.log('📊 Spanish EGW Data Summary');
                    console.log('='.repeat(60));
                    console.log("\uD83D\uDCDA Spanish books: ".concat(bookCount[0].count));
                    console.log("\uD83D\uDCDD Spanish paragraphs: ".concat(paraCount[0].count));
                    console.log("\uD83D\uDCD6 Spanish Bible references: ".concat(refCount[0].count));
                    console.log('='.repeat(60));
                    return [4 /*yield*/, dataSource.destroy()];
                case 16:
                    _d.sent();
                    console.log('\n✅ Spanish EGW sample data seeded successfully');
                    return [3 /*break*/, 19];
                case 17:
                    error_1 = _d.sent();
                    console.error('❌ Error seeding Spanish EGW data:', error_1);
                    return [4 /*yield*/, dataSource.destroy()];
                case 18:
                    _d.sent();
                    process.exit(1);
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/];
            }
        });
    });
}
seedSpanishEGW();
