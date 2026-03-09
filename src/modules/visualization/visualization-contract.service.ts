import { Injectable } from '@nestjs/common';

type NormalizedRelationType =
  | 'direct_quotation'
  | 'thematic'
  | 'typology'
  | 'prophetic_fulfillment'
  | 'narrative_continuation'
  | 'lexical';

type RelationStyle = 'solid' | 'dashed' | 'dotted';

@Injectable()
export class VisualizationContractService {
  normalizeRelationType(raw?: string): NormalizedRelationType {
    const value = String(raw || '').trim().toLowerCase();
    if (!value) return 'thematic';

    const map: Record<string, NormalizedRelationType> = {
      direct_quotation: 'direct_quotation',
      direct_quote: 'direct_quotation',
      quotation: 'direct_quotation',
      quote: 'direct_quotation',
      thematic: 'thematic',
      thematic_echo: 'thematic',
      theme_connection: 'thematic',
      parallels: 'thematic',
      supports: 'thematic',
      applies: 'thematic',
      typology: 'typology',
      prophetic_fulfillment: 'prophetic_fulfillment',
      fulfills: 'prophetic_fulfillment',
      fulfillment: 'prophetic_fulfillment',
      narrative_continuation: 'narrative_continuation',
      illustrates: 'narrative_continuation',
      lexical: 'lexical',
      grounds: 'direct_quotation',
    };

    return map[value] || 'thematic';
  }

  getRelationStyle(relationType: NormalizedRelationType): RelationStyle {
    if (relationType === 'direct_quotation' || relationType === 'prophetic_fulfillment') {
      return 'solid';
    }
    if (relationType === 'thematic' || relationType === 'narrative_continuation') {
      return 'dashed';
    }
    return 'dotted';
  }

  normalizeStrengthScore(raw: unknown): number {
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return Math.max(0, Math.min(1, raw));
    }
    const value = String(raw || '').trim().toLowerCase();
    if (value === 'strong' || value === 'high' || value === 'primary') return 0.9;
    if (value === 'moderate' || value === 'medium' || value === 'secondary') return 0.65;
    if (value === 'weak' || value === 'low' || value === 'illustrative') return 0.35;
    return 0.6;
  }

  inferTestament(reference?: string): 'OT' | 'NT' | 'UNKNOWN' {
    const normalized = String(reference || '').toUpperCase().replace(/\s+/g, '');
    if (!normalized) return 'UNKNOWN';

    const otBooks = [
      'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI',
      '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER',
      'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP',
      'HAG', 'ZEC', 'MAL', 'GENESIS', 'EXODUS', 'LEVITICUS', 'NUMBERS', 'DEUTERONOMY',
      'JOSHUA', 'JUDGES', 'RUTH', 'SAMUEL', 'KINGS', 'CHRONICLES', 'EZRA', 'NEHEMIAH',
      'ESTHER', 'JOB', 'PSALM', 'PSALMS', 'PROVERBS', 'ECCLESIASTES', 'SONG', 'ISAIAH',
      'JEREMIAH', 'LAMENTATIONS', 'EZEKIEL', 'DANIEL', 'HOSEA', 'JOEL', 'AMOS', 'OBADIAH',
      'JONAH', 'MICAH', 'NAHUM', 'HABAKKUK', 'ZEPHANIAH', 'HAGGAI', 'ZECHARIAH', 'MALACHI',
      'GENESIS', 'SALMOS', 'PROVERBIOS', 'ISAIAS', 'JEREMIAS', 'EZEQUIEL', 'DANIEL', 'OSEAS',
      'JOEL', 'AMOS', 'ABDIAS', 'JONAS', 'MIQUEAS', 'NAHUM', 'HABACUC', 'SOFONIAS', 'HAGEO',
      'ZACARIAS', 'MALAQUIAS',
    ];
    const ntBooks = [
      'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL',
      '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN',
      '3JN', 'JUD', 'REV', 'MATTHEW', 'MARK', 'LUKE', 'JOHN', 'ACTS', 'ROMANS', 'CORINTHIANS',
      'GALATIANS', 'EPHESIANS', 'PHILIPPIANS', 'COLOSSIANS', 'THESSALONIANS', 'TIMOTHY', 'TITUS',
      'PHILEMON', 'HEBREWS', 'JAMES', 'PETER', 'JUDE', 'REVELATION', 'MATEO', 'MARCOS', 'LUCAS',
      'JUAN', 'HECHOS', 'ROMANOS', 'CORINTIOS', 'GALATAS', 'EFESIOS', 'FILIPENSES', 'COLOSENSES',
      'TESALONICENSES', 'TIMOTEO', 'TITO', 'FILEMON', 'HEBREOS', 'SANTIAGO', 'PEDRO', 'APOCALIPSIS',
    ];

    const token = normalized.split(/[.:,\-]/)[0];
    if (otBooks.some((book) => token.startsWith(book))) return 'OT';
    if (ntBooks.some((book) => token.startsWith(book))) return 'NT';
    return 'UNKNOWN';
  }

  enrichGraph<T extends { nodes?: any[]; connections?: any[] }>(data: T): T {
    const nodes = (data.nodes || []).map((node) => {
      const reference = node.reference || node.label || node.id;
      const themes = Array.isArray(node.themes)
        ? node.themes
        : Array.isArray(node.relatedThemes)
          ? node.relatedThemes.map((theme: any) => (typeof theme === 'string' ? theme : theme?.name)).filter(Boolean)
          : node.theme
            ? [node.theme]
            : [];

      const warningLevel = node.warningLevel || (node.isWeak ? 'warning' : undefined);
      return {
        ...node,
        kind: node.kind || node.type || 'node',
        reference,
        label: node.label || reference,
        themes,
        warningLevel,
        testament: node.testament || this.inferTestament(reference),
      };
    });

    const connections = (data.connections || []).map((edge) => {
      const relationType = this.normalizeRelationType(edge.relationType || edge.type);
      const strengthScore = this.normalizeStrengthScore(
        edge.strengthScore ?? edge.strengthValue ?? edge.strength,
      );
      return {
        ...edge,
        source: edge.source || edge.from,
        target: edge.target || edge.to,
        relationType,
        relationStyle: edge.relationStyle || this.getRelationStyle(relationType),
        strengthScore,
        explanation: edge.explanation || edge.canonicalSignificance || 'Scripture connection',
        evidence: edge.evidence || {
          canonicalSignificance: edge.canonicalSignificance || null,
          sourceEra: edge.sourceEra || null,
          targetEra: edge.targetEra || null,
        },
      };
    });

    return { ...data, nodes, connections };
  }
}

