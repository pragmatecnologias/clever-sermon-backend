import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { promises as fs } from 'fs';

export interface MorphologyEntry {
  lemma: string;
  strongs: string;
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
  plainEnglish: string;
  occurrences: string[];
  sameFormOccurrences?: string[];
}

@Injectable()
export class MorphologyService {
  private morphologyIndex: Record<string, MorphologyEntry> | null = null;

  async getMorphology(word: string, language: string): Promise<MorphologyEntry | null> {
    if (!word) return null;
    const index = await this.loadMorphologyIndex(language);
    const key = word.toLowerCase();
    return index[key] || null;
  }

  async getParsingExplanation(parsing: any): Promise<string> {
    const parts: string[] = [];

    if (parsing.partOfSpeech) {
      parts.push(this.explainPartOfSpeech(parsing.partOfSpeech));
    }

    if (parsing.tense) {
      parts.push(this.explainTense(parsing.tense));
    }

    if (parsing.voice) {
      parts.push(this.explainVoice(parsing.voice));
    }

    if (parsing.mood) {
      parts.push(this.explainMood(parsing.mood));
    }

    if (parsing.person && parsing.number) {
      parts.push(`${parsing.person} person ${parsing.number}`);
    }

    if (parsing.case) {
      parts.push(this.explainCase(parsing.case));
    }

    if (parsing.gender) {
      parts.push(`${parsing.gender} gender`);
    }

    return parts.join(', ');
  }

  private explainPartOfSpeech(pos: string): string {
    const explanations: Record<string, string> = {
      'verb': 'action or state word',
      'noun': 'person, place, or thing',
      'adjective': 'describing word',
      'pronoun': 'substitute for a noun',
      'preposition': 'relationship word',
      'conjunction': 'connecting word',
      'particle': 'grammatical marker',
      'adverb': 'modifies verb or adjective'
    };
    return explanations[pos.toLowerCase()] || pos;
  }

  private explainTense(tense: string): string {
    const explanations: Record<string, string> = {
      'present': 'ongoing or continuous action',
      'aorist': 'simple past action (point in time)',
      'imperfect': 'ongoing past action',
      'perfect': 'completed action with ongoing results',
      'pluperfect': 'action completed before another past action',
      'future': 'action that will happen'
    };
    return explanations[tense.toLowerCase()] || tense;
  }

  private explainVoice(voice: string): string {
    const explanations: Record<string, string> = {
      'active': 'subject performs the action',
      'passive': 'subject receives the action',
      'middle': 'subject acts for own benefit or interest'
    };
    return explanations[voice.toLowerCase()] || voice;
  }

  private explainMood(mood: string): string {
    const explanations: Record<string, string> = {
      'indicative': 'statement of fact',
      'subjunctive': 'possibility or potential',
      'imperative': 'command',
      'optative': 'wish or prayer',
      'infinitive': 'verbal noun (to do)',
      'participle': 'verbal adjective (doing)'
    };
    return explanations[mood.toLowerCase()] || mood;
  }

  private explainCase(caseType: string): string {
    const explanations: Record<string, string> = {
      'nominative': 'subject of sentence',
      'genitive': 'possession or source',
      'dative': 'indirect object',
      'accusative': 'direct object',
      'vocative': 'direct address'
    };
    return explanations[caseType.toLowerCase()] || caseType;
  }

  private async loadMorphologyIndex(language: string): Promise<Record<string, MorphologyEntry>> {
    if (this.morphologyIndex) {
      return this.morphologyIndex;
    }

    // For MVP, create a basic morphology dataset
    // In production, this would load from a comprehensive morphology database
    const mockData: Record<string, MorphologyEntry> = {
      'ἀγαπάω': {
        lemma: 'ἀγαπάω',
        strongs: 'G25',
        parsing: {
          partOfSpeech: 'verb',
          tense: 'present',
          voice: 'active',
          mood: 'indicative',
          person: '1st',
          number: 'singular'
        },
        plainEnglish: 'I love (ongoing action, active voice, statement of fact)',
        occurrences: ['John 3:16', 'John 14:21', '1 John 4:8'],
        sameFormOccurrences: ['John 3:16', 'John 14:21']
      },
      'πιστεύω': {
        lemma: 'πιστεύω',
        strongs: 'G4100',
        parsing: {
          partOfSpeech: 'verb',
          tense: 'present',
          voice: 'active',
          mood: 'indicative',
          person: '1st',
          number: 'singular'
        },
        plainEnglish: 'I believe (ongoing action, active voice, statement of fact)',
        occurrences: ['John 3:16', 'Romans 10:9', 'Hebrews 11:6'],
        sameFormOccurrences: ['John 3:16', 'Romans 10:9']
      },
      'λόγος': {
        lemma: 'λόγος',
        strongs: 'G3056',
        parsing: {
          partOfSpeech: 'noun',
          case: 'nominative',
          number: 'singular',
          gender: 'masculine'
        },
        plainEnglish: 'word, message, or reason (subject of sentence, masculine)',
        occurrences: ['John 1:1', 'John 1:14', 'Hebrews 4:12'],
        sameFormOccurrences: ['John 1:1', 'John 1:14']
      }
    };

    this.morphologyIndex = mockData;
    return this.morphologyIndex;
  }

  async findSameTenseUsage(lemma: string, tense: string, voice: string, mood: string): Promise<string[]> {
    // This would query a morphology database for same tense/voice/mood combinations
    // For MVP, return mock data
    return [
      'John 3:16 - same present active indicative form',
      'Romans 5:8 - same present active indicative form',
      '1 John 4:8 - same present active indicative form'
    ];
  }
}
