import { Injectable } from '@nestjs/common';
import { SDAAlignmentService } from '../llm/sda-alignment';

export interface SDAContextualReferences {
  primary: string[];
  sabbath?: string[];
  sanctuary?: string[];
  prophetic?: string[];
  covenant?: string[];
}

@Injectable()
export class SDACrossReferencesService {
  /**
   * Get SDA-contextual cross-references based on passage content
   */
  async getContextualReferences(passage: string, verseText: string): Promise<SDAContextualReferences> {
    const references: SDAContextualReferences = {
      primary: []
    };

    const lowerText = verseText.toLowerCase();

    // Detect Sabbath context
    if (this.containsSabbathLanguage(lowerText)) {
      references.sabbath = SDAAlignmentService.getSabbathReferences();
    }

    // Detect Sanctuary context
    if (this.containsSanctuaryLanguage(lowerText)) {
      references.sanctuary = SDAAlignmentService.getSanctuaryReferences();
    }

    // Detect Prophetic context
    if (this.containsPropheticLanguage(lowerText) || this.isPropheticBook(passage)) {
      references.prophetic = SDAAlignmentService.getPropheticReferences();
    }

    // Detect Covenant context
    if (this.containsCovenantLanguage(lowerText)) {
      references.covenant = this.getCovenantReferences();
    }

    return references;
  }

  private containsSabbathLanguage(text: string): boolean {
    const sabbathTerms = ['sabbath', 'seventh day', 'rest', 'remember the sabbath', 'holy day'];
    return sabbathTerms.some(term => text.includes(term));
  }

  private containsSanctuaryLanguage(text: string): boolean {
    const sanctuaryTerms = [
      'sanctuary', 'temple', 'tabernacle', 'holy place', 'most holy',
      'altar', 'sacrifice', 'priest', 'high priest', 'atonement',
      'cleanse', 'cleansing', 'blood', 'veil', 'ark'
    ];
    return sanctuaryTerms.some(term => text.includes(term));
  }

  private containsPropheticLanguage(text: string): boolean {
    const propheticTerms = [
      'prophecy', 'vision', 'dream', 'beast', 'horn', 'kingdom',
      'time of the end', 'latter days', 'seal', 'trumpet', 'judgment'
    ];
    return propheticTerms.some(term => text.includes(term));
  }

  private containsCovenantLanguage(text: string): boolean {
    const covenantTerms = [
      'covenant', 'promise', 'oath', 'testament', 'everlasting',
      'establish', 'sign', 'token', 'memorial'
    ];
    return covenantTerms.some(term => text.includes(term));
  }

  private isPropheticBook(passage: string): boolean {
    const propheticBooks = [
      'daniel', 'revelation', 'ezekiel', 'isaiah', 'jeremiah',
      'zechariah', 'joel', 'amos'
    ];
    const lowerPassage = passage.toLowerCase();
    return propheticBooks.some(book => lowerPassage.includes(book));
  }

  private getCovenantReferences(): string[] {
    return [
      'Genesis 12:1-3',
      'Genesis 15:5-6',
      'Genesis 17:7',
      'Exodus 19:5-6',
      'Exodus 24:7-8',
      '2 Samuel 7:12-13',
      'Jeremiah 31:31-33',
      'Luke 22:20',
      'Hebrews 8:8-10',
      'Hebrews 9:15'
    ];
  }

  /**
   * Get interpretive framing for debated passages
   */
  getInterpretiveFrame(passage: string): string | null {
    return SDAAlignmentService.buildInterpretiveFrame(passage);
  }
}
