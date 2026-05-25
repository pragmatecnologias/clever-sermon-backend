"use strict";
/**
 * Download All EGW Books - English and Spanish
 * Downloads comprehensive collection of Ellen G. White books in both languages
 * Based on available books from egwwritings.org
 *
 * Usage: npx ts-node scripts/download-all-egw-books.ts
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var fs = require("fs");
var path = require("path");
var https = require("https");
// Comprehensive list of EGW books in BOTH English and Spanish
var EGW_BOOKS = [
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
var DOWNLOAD_DIR = path.join(__dirname, '../data/egw-books');
var METADATA_FILE = path.join(DOWNLOAD_DIR, 'metadata-complete.json');
function downloadFile(url, destination) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var file = fs.createWriteStream(destination);
                    https.get(url, function (response) {
                        if (response.statusCode === 302 || response.statusCode === 301) {
                            var redirectUrl = response.headers.location;
                            if (redirectUrl) {
                                https.get(redirectUrl, function (redirectResponse) {
                                    redirectResponse.pipe(file);
                                    file.on('finish', function () {
                                        file.close();
                                        resolve();
                                    });
                                }).on('error', function (err) {
                                    fs.unlink(destination, function () { });
                                    reject(err);
                                });
                            }
                        }
                        else if (response.statusCode === 200) {
                            response.pipe(file);
                            file.on('finish', function () {
                                file.close();
                                resolve();
                            });
                        }
                        else {
                            fs.unlink(destination, function () { });
                            reject(new Error("HTTP ".concat(response.statusCode, ": ").concat(response.statusMessage)));
                        }
                    }).on('error', function (err) {
                        fs.unlink(destination, function () { });
                        reject(err);
                    });
                })];
        });
    });
}
function downloadAllBooks() {
    return __awaiter(this, void 0, void 0, function () {
        var englishBooks, spanishBooks, results, i, book, filename, filepath, stats, flag, stats, sizeInKB, error_1, metadata, enFailed, esFailed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync(DOWNLOAD_DIR)) {
                        fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
                    }
                    englishBooks = EGW_BOOKS.filter(function (b) { return b.language === 'en'; });
                    spanishBooks = EGW_BOOKS.filter(function (b) { return b.language === 'es'; });
                    console.log("\uD83D\uDCDA Starting comprehensive download of ".concat(EGW_BOOKS.length, " EGW books..."));
                    console.log("   \uD83C\uDDFA\uD83C\uDDF8 English: ".concat(englishBooks.length, " books"));
                    console.log("   \uD83C\uDDEA\uD83C\uDDF8 Spanish: ".concat(spanishBooks.length, " books"));
                    console.log("\uD83D\uDCC1 Download directory: ".concat(DOWNLOAD_DIR, "\n"));
                    results = {
                        successful: [],
                        failed: [],
                        skipped: []
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < EGW_BOOKS.length)) return [3 /*break*/, 7];
                    book = EGW_BOOKS[i];
                    filename = "".concat(book.language, "_").concat(book.code, ".epub");
                    filepath = path.join(DOWNLOAD_DIR, filename);
                    if (fs.existsSync(filepath)) {
                        stats = fs.statSync(filepath);
                        // Skip if file exists and is larger than 1KB (not an error file)
                        if (stats.size > 1024) {
                            console.log("\u23ED\uFE0F  [".concat(i + 1, "/").concat(EGW_BOOKS.length, "] Skipping ").concat(book.language, "_").concat(book.code, " - already exists"));
                            results.skipped.push("".concat(book.language, "_").concat(book.code));
                            return [3 /*break*/, 6];
                        }
                        else {
                            // Delete small files (likely errors) and re-download
                            fs.unlinkSync(filepath);
                        }
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    flag = book.language === 'en' ? '🇺🇸' : '🇪🇸';
                    console.log("\u2B07\uFE0F  [".concat(i + 1, "/").concat(EGW_BOOKS.length, "] ").concat(flag, " Downloading ").concat(book.language, "_").concat(book.code, ": ").concat(book.title, "..."));
                    return [4 /*yield*/, downloadFile(book.url, filepath)];
                case 3:
                    _a.sent();
                    stats = fs.statSync(filepath);
                    sizeInKB = (stats.size / 1024).toFixed(2);
                    // Check if download was successful (file size > 1KB)
                    if (stats.size > 1024) {
                        console.log("\u2705 Downloaded ".concat(book.language, "_").concat(book.code, " (").concat(sizeInKB, " KB)"));
                        results.successful.push("".concat(book.language, "_").concat(book.code));
                    }
                    else {
                        console.error("\u274C Failed ".concat(book.language, "_").concat(book.code, ": File too small (likely 404)"));
                        results.failed.push({ code: "".concat(book.language, "_").concat(book.code), error: 'File not found on server', language: book.language });
                        fs.unlinkSync(filepath);
                    }
                    // Small delay to avoid overwhelming the server
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                case 4:
                    // Small delay to avoid overwhelming the server
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("\u274C Failed to download ".concat(book.language, "_").concat(book.code, ": ").concat(error_1.message));
                    results.failed.push({ code: "".concat(book.language, "_").concat(book.code), error: error_1.message, language: book.language });
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7:
                    metadata = {
                        downloadDate: new Date().toISOString(),
                        totalBooks: EGW_BOOKS.length,
                        englishBooks: englishBooks.length,
                        spanishBooks: spanishBooks.length,
                        books: EGW_BOOKS.map(function (b) { return (__assign(__assign({}, b), { downloadedAs: "".concat(b.language, "_").concat(b.code, ".epub") })); }),
                        results: results
                    };
                    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
                    console.log('\n' + '='.repeat(60));
                    console.log('📊 Comprehensive Download Summary');
                    console.log('='.repeat(60));
                    console.log("\u2705 Successfully downloaded: ".concat(results.successful.length));
                    console.log("   \uD83C\uDDFA\uD83C\uDDF8 English: ".concat(results.successful.filter(function (c) { return c.startsWith('en_'); }).length));
                    console.log("   \uD83C\uDDEA\uD83C\uDDF8 Spanish: ".concat(results.successful.filter(function (c) { return c.startsWith('es_'); }).length));
                    console.log("\u23ED\uFE0F  Skipped (already exist): ".concat(results.skipped.length));
                    console.log("\u274C Failed: ".concat(results.failed.length));
                    console.log("\uD83D\uDCC1 Total files: ".concat(results.successful.length + results.skipped.length));
                    if (results.failed.length > 0) {
                        console.log('\n❌ Failed downloads:');
                        enFailed = results.failed.filter(function (f) { return f.language === 'en'; });
                        esFailed = results.failed.filter(function (f) { return f.language === 'es'; });
                        if (enFailed.length > 0) {
                            console.log("   \uD83C\uDDFA\uD83C\uDDF8 English (".concat(enFailed.length, "):"));
                            enFailed.forEach(function (_a) {
                                var code = _a.code, error = _a.error;
                                console.log("      - ".concat(code, ": ").concat(error));
                            });
                        }
                        if (esFailed.length > 0) {
                            console.log("   \uD83C\uDDEA\uD83C\uDDF8 Spanish (".concat(esFailed.length, "):"));
                            esFailed.forEach(function (_a) {
                                var code = _a.code, error = _a.error;
                                console.log("      - ".concat(code, ": ").concat(error));
                            });
                        }
                    }
                    console.log("\n\uD83D\uDCC4 Metadata saved to: ".concat(METADATA_FILE));
                    console.log('='.repeat(60));
                    return [2 /*return*/];
            }
        });
    });
}
downloadAllBooks().catch(console.error);
