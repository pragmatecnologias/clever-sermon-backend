import { Injectable } from '@nestjs/common';

export interface MorphologyData {
  word: string;
  lemma: string;
  strongs?: string;
  parsing: {
    partOfSpeech: string;
    tense?: string;
    voice?: string;
    mood?: string;
    case?: string;
    number?: string;
    gender?: string;
    person?: string;
  };
  transliteration: string;
  gloss: string;
  verseReference: string;
}

@Injectable()
export class MorphologyDataService {
  private morphologyIndex: Map<string, MorphologyData[]> = new Map();

  constructor() {
    this.initializeMorphologyData();
  }

  getMorphology(word: string, language: 'greek' | 'hebrew'): MorphologyData[] {
    const key = `${language}:${word.toLowerCase()}`;
    return this.morphologyIndex.get(key) || [];
  }

  getMorphologyByStrongs(strongs: string): MorphologyData[] {
    const results: MorphologyData[] = [];
    for (const entries of this.morphologyIndex.values()) {
      for (const entry of entries) {
        if (entry.strongs === strongs) {
          results.push(entry);
        }
      }
    }
    return results;
  }

  private initializeMorphologyData() {
    // Sample Greek morphology data
    // In production, load from comprehensive lexicon database
    
    this.addMorphology('greek', 'ἀγαπάω', {
      word: 'ἀγαπάω',
      lemma: 'ἀγαπάω',
      strongs: 'G25',
      parsing: {
        partOfSpeech: 'Verb',
        tense: 'Aorist',
        voice: 'Active',
        mood: 'Indicative',
        person: '3rd',
        number: 'Singular'
      },
      transliteration: 'agapaō',
      gloss: 'to love',
      verseReference: 'John 3:16'
    });

    this.addMorphology('greek', 'ἠγάπησεν', {
      word: 'ἠγάπησεν',
      lemma: 'ἀγαπάω',
      strongs: 'G25',
      parsing: {
        partOfSpeech: 'Verb',
        tense: 'Aorist',
        voice: 'Active',
        mood: 'Indicative',
        person: '3rd',
        number: 'Singular'
      },
      transliteration: 'ēgapēsen',
      gloss: 'loved',
      verseReference: 'John 3:16'
    });

    this.addMorphology('greek', 'πιστεύω', {
      word: 'πιστεύω',
      lemma: 'πιστεύω',
      strongs: 'G4100',
      parsing: {
        partOfSpeech: 'Verb',
        tense: 'Present',
        voice: 'Active',
        mood: 'Participle',
        case: 'Nominative',
        number: 'Singular',
        gender: 'Masculine'
      },
      transliteration: 'pisteuō',
      gloss: 'to believe, trust',
      verseReference: 'John 3:16'
    });

    this.addMorphology('greek', 'λόγος', {
      word: 'λόγος',
      lemma: 'λόγος',
      strongs: 'G3056',
      parsing: {
        partOfSpeech: 'Noun',
        case: 'Nominative',
        number: 'Singular',
        gender: 'Masculine'
      },
      transliteration: 'logos',
      gloss: 'word, message, reason',
      verseReference: 'John 1:1'
    });

    // Sample Hebrew morphology
    this.addMorphology('hebrew', 'זָכַר', {
      word: 'זָכַר',
      lemma: 'זָכַר',
      strongs: 'H2142',
      parsing: {
        partOfSpeech: 'Verb',
        tense: 'Qal',
        mood: 'Infinitive Absolute'
      },
      transliteration: 'zakar',
      gloss: 'to remember',
      verseReference: 'Exodus 20:8'
    });

    this.addMorphology('hebrew', 'שַׁבָּת', {
      word: 'שַׁבָּת',
      lemma: 'שַׁבָּת',
      strongs: 'H7676',
      parsing: {
        partOfSpeech: 'Noun',
        case: 'Construct',
        number: 'Singular',
        gender: 'Feminine'
      },
      transliteration: 'shabbat',
      gloss: 'Sabbath, rest',
      verseReference: 'Exodus 20:8'
    });

    this.addMorphology('hebrew', 'צָדַק', {
      word: 'צָדַק',
      lemma: 'צָדַק',
      strongs: 'H6663',
      parsing: {
        partOfSpeech: 'Verb',
        tense: 'Niphal',
        mood: 'Perfect'
      },
      transliteration: 'tsadaq',
      gloss: 'to be just, righteous; to be cleansed',
      verseReference: 'Daniel 8:14'
    });
  }

  private addMorphology(language: string, word: string, data: MorphologyData) {
    const key = `${language}:${word.toLowerCase()}`;
    const existing = this.morphologyIndex.get(key) || [];
    existing.push(data);
    this.morphologyIndex.set(key, existing);
  }

  getParsingDisplay(parsing: MorphologyData['parsing']): string {
    const parts: string[] = [];
    
    if (parsing.partOfSpeech) parts.push(parsing.partOfSpeech);
    if (parsing.tense) parts.push(parsing.tense);
    if (parsing.voice) parts.push(parsing.voice);
    if (parsing.mood) parts.push(parsing.mood);
    if (parsing.person) parts.push(parsing.person);
    if (parsing.number) parts.push(parsing.number);
    if (parsing.gender) parts.push(parsing.gender);
    if (parsing.case) parts.push(parsing.case);
    
    return parts.join(', ');
  }
}
