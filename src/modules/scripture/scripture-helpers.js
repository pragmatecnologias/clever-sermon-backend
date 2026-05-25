"use strict";
/**
 * Helper functions for API.Bible integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToApiBiblePassageId = convertToApiBiblePassageId;
exports.formatApiBibleResponse = formatApiBibleResponse;
/**
 * Convert a scripture reference to API.Bible passage ID format
 * Examples:
 *   "John 3:16" -> "JHN.3.16"
 *   "John 3:16-17" -> "JHN.3.16-JHN.3.17"
 *   "Genesis 1:1-3" -> "GEN.1.1-GEN.1.3"
 */
function convertToApiBiblePassageId(reference) {
    // Book name to API.Bible book ID mapping
    var bookMap = {
        'genesis': 'GEN', 'gen': 'GEN',
        'exodus': 'EXO', 'exo': 'EXO', 'exod': 'EXO',
        'leviticus': 'LEV', 'lev': 'LEV',
        'numbers': 'NUM', 'num': 'NUM',
        'deuteronomy': 'DEU', 'deut': 'DEU',
        'joshua': 'JOS', 'josh': 'JOS',
        'judges': 'JDG', 'judg': 'JDG',
        'ruth': 'RUT',
        '1samuel': '1SA', '1sam': '1SA', '1 samuel': '1SA',
        '2samuel': '2SA', '2sam': '2SA', '2 samuel': '2SA',
        '1kings': '1KI', '1kgs': '1KI', '1 kings': '1KI',
        '2kings': '2KI', '2kgs': '2KI', '2 kings': '2KI',
        '1chronicles': '1CH', '1chr': '1CH', '1 chronicles': '1CH',
        '2chronicles': '2CH', '2chr': '2CH', '2 chronicles': '2CH',
        'ezra': 'EZR',
        'nehemiah': 'NEH', 'neh': 'NEH',
        'esther': 'EST', 'esth': 'EST',
        'job': 'JOB',
        'psalm': 'PSA', 'psalms': 'PSA', 'ps': 'PSA',
        'proverbs': 'PRO', 'prov': 'PRO',
        'ecclesiastes': 'ECC', 'eccl': 'ECC',
        'songofsolomon': 'SNG', 'song': 'SNG', 'songofsongs': 'SNG',
        'isaiah': 'ISA', 'isa': 'ISA',
        'jeremiah': 'JER', 'jer': 'JER',
        'lamentations': 'LAM', 'lam': 'LAM',
        'ezekiel': 'EZK', 'ezek': 'EZK',
        'daniel': 'DAN', 'dan': 'DAN',
        'hosea': 'HOS', 'hos': 'HOS',
        'joel': 'JOL',
        'amos': 'AMO',
        'obadiah': 'OBA', 'obad': 'OBA',
        'jonah': 'JON',
        'micah': 'MIC', 'mic': 'MIC',
        'nahum': 'NAM', 'nah': 'NAM',
        'habakkuk': 'HAB', 'hab': 'HAB',
        'zephaniah': 'ZEP', 'zeph': 'ZEP',
        'haggai': 'HAG', 'hag': 'HAG',
        'zechariah': 'ZEC', 'zech': 'ZEC',
        'malachi': 'MAL', 'mal': 'MAL',
        'matthew': 'MAT', 'matt': 'MAT', 'mt': 'MAT',
        'mark': 'MRK', 'mk': 'MRK',
        'luke': 'LUK', 'lk': 'LUK',
        'john': 'JHN', 'jn': 'JHN',
        'acts': 'ACT',
        'romans': 'ROM', 'rom': 'ROM',
        '1corinthians': '1CO', '1cor': '1CO', '1 corinthians': '1CO',
        '2corinthians': '2CO', '2cor': '2CO', '2 corinthians': '2CO',
        'galatians': 'GAL', 'gal': 'GAL',
        'ephesians': 'EPH', 'eph': 'EPH',
        'philippians': 'PHP', 'phil': 'PHP',
        'colossians': 'COL', 'col': 'COL',
        '1thessalonians': '1TH', '1thess': '1TH', '1 thessalonians': '1TH',
        '2thessalonians': '2TH', '2thess': '2TH', '2 thessalonians': '2TH',
        '1timothy': '1TI', '1tim': '1TI', '1 timothy': '1TI',
        '2timothy': '2TI', '2tim': '2TI', '2 timothy': '2TI',
        'titus': 'TIT',
        'philemon': 'PHM', 'phlm': 'PHM',
        'hebrews': 'HEB', 'heb': 'HEB',
        'james': 'JAS', 'jas': 'JAS',
        '1peter': '1PE', '1pet': '1PE', '1 peter': '1PE',
        '2peter': '2PE', '2pet': '2PE', '2 peter': '2PE',
        '1john': '1JN', '1jn': '1JN', '1 john': '1JN',
        '2john': '2JN', '2jn': '2JN', '2 john': '2JN',
        '3john': '3JN', '3jn': '3JN', '3 john': '3JN',
        'jude': 'JUD',
        'revelation': 'REV', 'rev': 'REV',
    };
    // Parse reference: "Book Chapter:Verse" or "Book Chapter:Verse-Verse"
    var match = reference.match(/^(.*?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (!match) {
        // Try without verse: "Book Chapter"
        var chapterMatch = reference.match(/^(.*?)\s+(\d+)$/);
        if (chapterMatch) {
            var bookName_1 = chapterMatch[1].toLowerCase().replace(/\s+/g, '');
            var chapter_1 = chapterMatch[2];
            var bookId_1 = bookMap[bookName_1] || bookName_1.toUpperCase();
            return "".concat(bookId_1, ".").concat(chapter_1);
        }
        return reference; // Return as-is if can't parse
    }
    var bookName = match[1].toLowerCase().replace(/\s+/g, '');
    var chapter = match[2];
    var verseStart = match[3];
    var verseEnd = match[4];
    var bookId = bookMap[bookName] || bookName.toUpperCase();
    if (verseEnd) {
        // Range: JHN.3.16-JHN.3.17
        return "".concat(bookId, ".").concat(chapter, ".").concat(verseStart, "-").concat(bookId, ".").concat(chapter, ".").concat(verseEnd);
    }
    else {
        // Single verse: JHN.3.16
        return "".concat(bookId, ".").concat(chapter, ".").concat(verseStart);
    }
}
/**
 * Format API.Bible response to match our expected structure
 */
function formatApiBibleResponse(apiResponse, originalReference, translationCode) {
    var data = apiResponse.data;
    // Parse verses from content
    var verses = [];
    var content = data.content || '';
    // Extract verse numbers and text - handle multiple formats
    // Format: [16] text [17] text or just text
    var versePattern = /\[(\d+)\]\s*([^\[]+?)(?=\s*\[|$)/g;
    var match;
    while ((match = versePattern.exec(content)) !== null) {
        var verseNum = match[1];
        var text = match[2].trim();
        if (text) {
            // Get book and chapter from reference
            var refParts = data.reference.split(':');
            var bookChapter = refParts[0];
            verses.push({
                reference: "".concat(bookChapter, ":").concat(verseNum),
                text: text
            });
        }
    }
    // If no verses found with brackets, try to parse the whole content
    if (verses.length === 0 && content) {
        // Get book and chapter from the API response reference
        var refMatch = (data.reference || originalReference).match(/^(.*?)\s+(\d+)/);
        var bookChapter_1 = refMatch ? "".concat(refMatch[1], " ").concat(refMatch[2]) : (data.reference || originalReference);
        // Split content into individual verses (each separated by newline)
        var verseTexts = content.split(/\n+/).filter(function (line) { return line.trim(); });
        verseTexts.forEach(function (text, index) {
            var cleanText = text.replace(/\s+/g, ' ').trim();
            if (cleanText) {
                verses.push({
                    reference: "".concat(bookChapter_1, ":").concat(index + 1),
                    text: cleanText
                });
            }
        });
        // Fallback: if still no verses after splitting, add the whole content as one verse
        if (verses.length === 0) {
            var cleanContent = content.replace(/\s+/g, ' ').trim();
            if (cleanContent) {
                verses.push({
                    reference: data.reference || originalReference,
                    text: cleanContent
                });
            }
        }
    }
    // Parse study notes if available
    var studyNotes = [];
    if (data.notes && Array.isArray(data.notes)) {
        for (var _i = 0, _a = data.notes; _i < _a.length; _i++) {
            var note = _a[_i];
            studyNotes.push({
                id: note.id,
                type: note.type || 'study',
                text: note.text || note.content,
                verseReference: note.verseId || note.reference,
                category: note.category || 'general'
            });
        }
    }
    return {
        reference: data.reference || originalReference,
        translation: translationCode,
        verses: verses,
        studyNotes: studyNotes.length > 0 ? studyNotes : undefined,
        copyright: data.copyright,
        verseCount: data.verseCount
    };
}
