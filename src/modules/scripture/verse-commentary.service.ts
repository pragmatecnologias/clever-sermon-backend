import { Injectable } from '@nestjs/common';

export interface VerseCommentary {
  verseReference: string;
  notes: CommentaryNote[];
}

export interface CommentaryNote {
  type: 'context' | 'word' | 'historical' | 'theological' | 'interpretive';
  content: string;
  source?: string;
}

@Injectable()
export class VerseCommentaryService {
  private commentaryIndex: Map<string, CommentaryNote[]> = new Map();

  constructor() {
    this.initializeCommentaryData();
  }

  getCommentary(verseReference: string): VerseCommentary {
    const normalized = this.normalizeReference(verseReference);
    const notes = this.commentaryIndex.get(normalized) || [];
    
    return {
      verseReference,
      notes
    };
  }

  getCommentaryForPassage(startRef: string, endRef?: string): VerseCommentary[] {
    // For now, return single verse commentary
    // Future: expand to passage range
    return [this.getCommentary(startRef)];
  }

  private normalizeReference(ref: string): string {
    return ref.trim().replace(/\s+/g, ' ');
  }

  private initializeCommentaryData() {
    // Sample curated commentary data
    // In production, this would load from a database or JSON file
    
    this.commentaryIndex.set('John 3:16', [
      {
        type: 'context',
        content: 'Part of Jesus\' conversation with Nicodemus, a Pharisee who came to Jesus at night.',
        source: 'Contextual Analysis'
      },
      {
        type: 'word',
        content: 'The Greek word "agape" (loved) emphasizes God\'s unconditional, sacrificial love.',
        source: 'Lexical Study'
      },
      {
        type: 'theological',
        content: 'Central verse expressing the gospel: God\'s love, Christ\'s sacrifice, and salvation by faith.',
        source: 'Theological Framework'
      }
    ]);

    this.commentaryIndex.set('Romans 3:23', [
      {
        type: 'context',
        content: 'Part of Paul\'s argument that all humanity is under sin, both Jews and Gentiles.',
        source: 'Contextual Analysis'
      },
      {
        type: 'word',
        content: '"Fall short" (Greek: husterountai) means to lack or be deficient in reaching the standard.',
        source: 'Lexical Study'
      }
    ]);

    this.commentaryIndex.set('Hebrews 8:1-2', [
      {
        type: 'context',
        content: 'Summary statement of the high priestly ministry of Christ in the heavenly sanctuary.',
        source: 'Contextual Analysis'
      },
      {
        type: 'theological',
        content: 'Establishes the reality of the heavenly sanctuary where Christ ministers as High Priest.',
        source: 'SDA Theological Framework'
      },
      {
        type: 'historical',
        content: 'Contrasts the earthly tabernacle (Exodus 25) with the true tabernacle in heaven.',
        source: 'Biblical Typology'
      }
    ]);

    this.commentaryIndex.set('Daniel 8:14', [
      {
        type: 'context',
        content: 'Part of Daniel\'s vision of the ram, goat, and little horn. The 2300 days prophecy.',
        source: 'Contextual Analysis'
      },
      {
        type: 'word',
        content: '"Cleansed" (Hebrew: tsadaq) can also mean "vindicated" or "restored to righteousness."',
        source: 'Lexical Study'
      },
      {
        type: 'theological',
        content: 'Central to SDA understanding of the investigative judgment beginning in 1844.',
        source: 'SDA Prophetic Interpretation'
      },
      {
        type: 'interpretive',
        content: 'Day-year principle applied: 2300 prophetic days = 2300 literal years (457 BC to AD 1844).',
        source: 'Historicist Interpretation'
      }
    ]);

    this.commentaryIndex.set('Revelation 14:6-7', [
      {
        type: 'context',
        content: 'First of three angels\' messages, proclaiming the everlasting gospel.',
        source: 'Contextual Analysis'
      },
      {
        type: 'theological',
        content: 'Call to worship the Creator, emphasizing Sabbath truth and judgment hour message.',
        source: 'SDA End-Time Theology'
      },
      {
        type: 'historical',
        content: 'Parallels the Sabbath commandment in Exodus 20:11.',
        source: 'Canonical Connection'
      }
    ]);

    this.commentaryIndex.set('Matthew 24:14', [
      {
        type: 'context',
        content: 'Part of the Olivet Discourse on signs of the end times.',
        source: 'Contextual Analysis'
      },
      {
        type: 'theological',
        content: 'Gospel commission must be fulfilled before Christ\'s return.',
        source: 'Eschatological Framework'
      }
    ]);

    this.commentaryIndex.set('Exodus 20:8-11', [
      {
        type: 'context',
        content: 'Fourth commandment of the Decalogue given at Mount Sinai.',
        source: 'Contextual Analysis'
      },
      {
        type: 'word',
        content: '"Remember" (Hebrew: zakar) implies ongoing observance of an established institution.',
        source: 'Lexical Study'
      },
      {
        type: 'theological',
        content: 'Sabbath as memorial of Creation and sign of sanctification.',
        source: 'SDA Sabbath Theology'
      },
      {
        type: 'historical',
        content: 'Sabbath instituted at Creation (Genesis 2:2-3), reaffirmed in the law.',
        source: 'Biblical Timeline'
      }
    ]);

    this.commentaryIndex.set('Leviticus 16:29-30', [
      {
        type: 'context',
        content: 'Instructions for the Day of Atonement, Israel\'s annual cleansing ceremony.',
        source: 'Contextual Analysis'
      },
      {
        type: 'theological',
        content: 'Type of the final atonement and investigative judgment in the heavenly sanctuary.',
        source: 'SDA Sanctuary Doctrine'
      },
      {
        type: 'word',
        content: '"Afflict your souls" (Hebrew: anah nephesh) means to humble oneself, often through fasting.',
        source: 'Lexical Study'
      }
    ]);
  }

  addCommentary(verseReference: string, note: CommentaryNote): void {
    const normalized = this.normalizeReference(verseReference);
    const existing = this.commentaryIndex.get(normalized) || [];
    existing.push(note);
    this.commentaryIndex.set(normalized, existing);
  }

  bulkLoadCommentary(data: Array<{ verse: string; notes: CommentaryNote[] }>): void {
    for (const entry of data) {
      const normalized = this.normalizeReference(entry.verse);
      this.commentaryIndex.set(normalized, entry.notes);
    }
  }
}
