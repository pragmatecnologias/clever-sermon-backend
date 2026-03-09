/**
 * Helper functions for API.Bible integration
 */

/**
 * Convert a scripture reference to API.Bible passage ID format
 * Examples:
 *   "John 3:16" -> "JHN.3.16"
 *   "John 3:16-17" -> "JHN.3.16-JHN.3.17"
 *   "Genesis 1:1-3" -> "GEN.1.1-GEN.1.3"
 */
export function convertToApiBiblePassageId(reference: string): string {
  // Book name to API.Bible book ID mapping
  const bookMap: Record<string, string> = {
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
  const match = reference.match(/^(.*?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) {
    // Try without verse: "Book Chapter"
    const chapterMatch = reference.match(/^(.*?)\s+(\d+)$/);
    if (chapterMatch) {
      const bookName = chapterMatch[1].toLowerCase().replace(/\s+/g, '');
      const chapter = chapterMatch[2];
      const bookId = bookMap[bookName] || bookName.toUpperCase();
      return `${bookId}.${chapter}`;
    }
    return reference; // Return as-is if can't parse
  }

  const bookName = match[1].toLowerCase().replace(/\s+/g, '');
  const chapter = match[2];
  const verseStart = match[3];
  const verseEnd = match[4];

  const bookId = bookMap[bookName] || bookName.toUpperCase();

  if (verseEnd) {
    // Range: JHN.3.16-JHN.3.17
    return `${bookId}.${chapter}.${verseStart}-${bookId}.${chapter}.${verseEnd}`;
  } else {
    // Single verse: JHN.3.16
    return `${bookId}.${chapter}.${verseStart}`;
  }
}

/**
 * Format API.Bible response to match our expected structure
 */
export function formatApiBibleResponse(apiResponse: any, originalReference: string, translationCode: string) {
  const data = apiResponse.data;
  
  // Parse verses from content
  const verses: any[] = [];
  const content = data.content || '';
  
  // Extract verse numbers and text - handle multiple formats
  // Format: [16] text [17] text or just text
  const versePattern = /\[(\d+)\]\s*([^\[]+?)(?=\s*\[|$)/g;
  let match;
  
  while ((match = versePattern.exec(content)) !== null) {
    const verseNum = match[1];
    const text = match[2].trim();
    
    if (text) {
      // Get book and chapter from reference
      const refParts = data.reference.split(':');
      const bookChapter = refParts[0];
      
      verses.push({
        reference: `${bookChapter}:${verseNum}`,
        text: text
      });
    }
  }

  // If no verses found with brackets, try to parse the whole content
  if (verses.length === 0 && content) {
    // Get book and chapter from the API response reference
    const refMatch = (data.reference || originalReference).match(/^(.*?)\s+(\d+)/);
    const bookChapter = refMatch ? `${refMatch[1]} ${refMatch[2]}` : (data.reference || originalReference);
    
    // Split content into individual verses (each separated by newline)
    const verseTexts = content.split(/\n+/).filter(line => line.trim());
    
    verseTexts.forEach((text, index) => {
      const cleanText = text.replace(/\s+/g, ' ').trim();
      if (cleanText) {
        verses.push({
          reference: `${bookChapter}:${index + 1}`,
          text: cleanText
        });
      }
    });
    
    // Fallback: if still no verses after splitting, add the whole content as one verse
    if (verses.length === 0) {
      const cleanContent = content.replace(/\s+/g, ' ').trim();
      if (cleanContent) {
        verses.push({
          reference: data.reference || originalReference,
          text: cleanContent
        });
      }
    }
  }

  // Parse study notes if available
  const studyNotes: any[] = [];
  if (data.notes && Array.isArray(data.notes)) {
    for (const note of data.notes) {
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
