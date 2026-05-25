import { SermonClaimReviewService } from './sermon-claim-review.service';
import { WorkspaceClaimSummary } from './workspace-state.types';

function makeClaim(overrides: Partial<WorkspaceClaimSummary> = {}): WorkspaceClaimSummary {
  return {
    id: 'claim-1',
    claimText: 'The father watched from the porch.',
    claimType: 'claim',
    supportLevel: 'needs_review',
    sourceType: 'generated',
    sourceIds: [],
    location: 'citations',
    verified: false,
    ...overrides,
  };
}

const LUKE_15_PASSAGE = [
  'Then He said: A certain man had two sons.',
  'And the younger of them said to his father, Father, give me the portion of goods that falls to me. So he divided to them his livelihood.',
  'And not many days after, the younger son gathered all together, journeyed to a far country, and there wasted his possessions with prodigal living.',
  'But when he had spent all, there arose a severe famine in that land, and he began to be in want.',
  'Then he went and joined himself to a citizen of that country, and he sent him into his fields to feed swine.',
  'And he would gladly have filled his stomach with the pods that the swine ate, and no one gave him anything.',
  'But when he came to himself, he said, How many of my father\'s hired servants have bread enough and to spare, and I perish with hunger!',
  'I will arise and go to my father, and will say to him, Father, I have sinned against heaven and before you,',
  'and I am no longer worthy to be called your son. Make me like one of your hired servants.',
  'And he arose and came to his father. But when he was still a great way off, his father saw him and had compassion, and ran and fell on his neck and kissed him.',
  'And the son said to him, Father, I have sinned against heaven and in your sight, and am no longer worthy to be called your son.',
  'But the father said to his servants, Bring out the best robe and put it on him, and put a ring on his hand and sandals on his feet.',
  'And bring the fatted calf here and kill it, and let us eat and be merry;',
  'for this my son was dead and is alive again; he was lost and is found. And they began to be merry.',
].join(' ');

describe('SermonClaimReviewService', () => {
  let service: SermonClaimReviewService;

  beforeEach(() => {
    service = new SermonClaimReviewService();
  });

  // ─── Classification ──────────────────────────────────────

  describe('classifyClaimType', () => {
    it('classifies porch claim as textual_observation', () => {
      const claim = makeClaim({ claimText: 'The father watched from the porch.' });
      expect(service.classifyClaimType(claim, claim.claimText)).toBe('textual_observation');
    });

    it('classifies theological extension with "represents"', () => {
      const text = 'The robe, ring, and sandals represent imparted righteousness in the sanctuary model.';
      expect(service.classifyClaimType(makeClaim(), text)).toBe('theological_extension');
    });

    it('classifies application with "should"', () => {
      const text = 'We should welcome sinners as the father welcomed his son.';
      expect(service.classifyClaimType(makeClaim(), text)).toBe('application');
    });

    it('classifies interpretation with "means"', () => {
      const text = 'The fatted calf means the fullness of Christ\'s sacrifice.';
      expect(service.classifyClaimType(makeClaim(), text)).toBe('interpretation');
    });

    it('classifies illustration with "Imagine"', () => {
      const text = 'Imagine the father scanning the horizon every day.';
      expect(service.classifyClaimType(makeClaim(), text)).toBe('illustration');
    });
  });

  // ─── Homiletical Imagination ─────────────────────────────

  describe('detectHomileticalImagination', () => {
    it('detects "porch" not in Luke 15 passage', () => {
      const claim = 'The father watched from the porch.';
      const result = service.detectHomileticalImagination(claim, LUKE_15_PASSAGE);
      expect(result.detected).toBe(true);
      expect(result.imaginedDetail).toBe('porch');
      expect(result.suggestedRepair).toBeTruthy();
    });

    it('does not flag "robe" which IS in the passage', () => {
      const claim = 'The best robe shows the father\'s honor.';
      const result = service.detectHomileticalImagination(claim, LUKE_15_PASSAGE);
      expect(result.detected).toBe(false);
    });

    it('does not flag claim with no imagined details', () => {
      const claim = 'The father saw him while still far away.';
      const result = service.detectHomileticalImagination(claim, LUKE_15_PASSAGE);
      expect(result.detected).toBe(false);
    });
  });

  // ─── Outside-Range Detection ─────────────────────────────

  describe('detectOutsideRange', () => {
    it('detects Luke 15:25-32 outside range 15:11-24', () => {
      const claim = 'The elder brother reveals religious resentment Luke 15:25-32.';
      const result = service.detectOutsideRange(claim, { book: 'Luke', startChapter: 15, startVerse: 11, endChapter: 15, endVerse: 24 });
      expect(result.isOutsideRange).toBe(true);
      expect(result.note).toContain('outside the selected passage');
    });

    it('does not flag Luke 15:22 within range 15:11-24', () => {
      const claim = 'The robe, ring, and sandals show public restoration (Luke 15:22).';
      const result = service.detectOutsideRange(claim, { book: 'Luke', startChapter: 15, startVerse: 11, endChapter: 15, endVerse: 24 });
      expect(result.isOutsideRange).toBe(false);
    });
  });

  // ─── Risk Assessment ─────────────────────────────────────

  describe('assessPastoralRisk', () => {
    it('returns high for homiletical + unsupported', () => {
      expect(service.assessPastoralRisk('', 'textual_observation', 'unsupported', true, false, false)).toBe('high');
    });

    it('returns medium for homiletical even with support', () => {
      expect(service.assessPastoralRisk('', 'textual_observation', 'supported', true, false, false)).toBe('medium');
    });

    it('returns medium for theological extension without support', () => {
      expect(service.assessPastoralRisk('', 'theological_extension', 'needs_review', false, false, false)).toBe('medium');
    });

    it('returns none for supported textual observation', () => {
      expect(service.assessPastoralRisk('', 'textual_observation', 'supported', false, false, false)).toBe('none');
    });

    it('returns medium for outside-range claims', () => {
      expect(service.assessPastoralRisk('', 'interpretation', 'needs_review', false, true, false)).toBe('medium');
    });
  });

  // ─── Socratic Questions ──────────────────────────────────

  describe('generateSocraticQuestions', () => {
    it('returns observation questions for textual_observation', () => {
      const qs = service.generateSocraticQuestions('textual_observation', 'The father saw him.');
      expect(qs.length).toBeGreaterThan(0);
      expect(qs[0]).toContain('text');
    });

    it('returns interpretation questions', () => {
      const qs = service.generateSocraticQuestions('interpretation', 'This means the Father loves all.');
      expect(qs.length).toBeGreaterThan(0);
      expect(qs.some((q) => q.includes('interpretation'))).toBe(true);
    });

    it('returns theological extension questions', () => {
      const qs = service.generateSocraticQuestions('theological_extension', 'The robe represents righteousness.');
      expect(qs.length).toBeGreaterThan(0);
      expect(qs.some((q) => q.toLowerCase().includes('scripture') || q.toLowerCase().includes('connection') || q.toLowerCase().includes('application'))).toBe(true);
    });

    it('returns application questions', () => {
      const qs = service.generateSocraticQuestions('application', 'We should welcome sinners.');
      expect(qs.length).toBeGreaterThan(0);
      expect(qs.some((q) => q.includes('grace') || q.includes('burden') || q.includes('flow'))).toBe(true);
    });
  });

  // ─── Enrich Claims (integration) ─────────────────────────

  describe('enrichClaims', () => {
    it('enriches porch claim with medium risk and repair', () => {
      const claims = [makeClaim({ claimText: 'The father watched from the porch.' })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      expect(enriched[0].pastoralRisk).toBe('medium');
      expect(enriched[0].suggestedRepair).toBeTruthy();
      expect(enriched[0].claimSubType).toBe('textual_observation');
    });

    it('enriches robe claim with low risk', () => {
      const claims = [makeClaim({
        claimText: 'The robe, ring, and sandals show public restoration.',
        supportLevel: 'supported',
        sourceIds: ['Luke 15:22'],
        sourceType: 'bible',
        verified: true,
      })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      expect(enriched[0].pastoralRisk).toBe('none');
    });

    it('enriches theological extension for sanctuary model', () => {
      const claims = [makeClaim({
        claimText: 'The robe, ring, and sandals represent imparted righteousness in the sanctuary model.',
        supportLevel: 'needs_review',
      })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      expect(enriched[0].claimSubType).toBe('theological_extension');
      // sanctuary model triggers theological overreach → high risk
      expect(enriched[0].pastoralRisk).toBe('high');
      expect(enriched[0].theologicalExtension).toBe(true);
      expect(enriched[0].socraticQuestions!.length).toBeGreaterThan(0);
    });

    it('enriches outside-range claim', () => {
      const claims = [makeClaim({
        claimText: 'The elder brother in Luke 15:28 reveals resentment.',
      })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      expect(enriched[0].riskReason).toContain('outside the selected passage');
    });

    it('enriches application claim', () => {
      const claims = [makeClaim({
        claimText: 'No matter how far one has wandered, the Father welcomes the repentant.',
        supportLevel: 'supported',
        sourceIds: ['Luke 15:20-24'],
        verified: true,
      })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      // Does not contain explicit "should"/"must" so classification may vary
      expect(enriched[0].pastoralRisk).toBe('none');
    });
  });

  // ─── Review Summary ──────────────────────────────────────

  describe('buildReviewSummary', () => {
    it('computes correct counts from enriched claims', () => {
      const enriched = service.enrichClaims([
        makeClaim({ claimText: 'The father watched from the porch.', id: '1' }),
        makeClaim({ claimText: 'The robe shows restoration.', id: '2', supportLevel: 'supported', verified: true }),
        makeClaim({ claimText: 'The robe represents imparted righteousness.', id: '3' }),
      ], 'Luke 15:11-24', LUKE_15_PASSAGE);

      const summary = service.buildReviewSummary(enriched);
      expect(summary.totalClaims).toBe(3);
      expect(summary.supportedClaims).toBe(1);
      expect(summary.highRiskClaims).toBe(0);
      expect(summary.theologicalExtensions).toBe(1);
    });
  });

  // ─── Theological Overreach ─────────────────────────────────

  describe('detectTheologicalOverreach', () => {
    it('detects state of the dead claim', () => {
      const result = service.detectTheologicalOverreach(
        'Luke 15:24 supports state of the dead.',
        '',
        'theological_extension',
      );
      expect(result.detected).toBe(true);
      expect(result.theme).toBe('State of the Dead');
      expect(result.riskLevel).toBe('high');
    });

    it('detects sanctuary model from Luke 15 robe/ring', () => {
      const result = service.detectTheologicalOverreach(
        'The robe, ring, and sandals represent imparted righteousness in the sanctuary model.',
        '',
        'theological_extension',
      );
      expect(result.detected).toBe(true);
      expect(result.theme).toContain('Sanctuary');
    });

    it('does not flag ordinary interpretation', () => {
      const result = service.detectTheologicalOverreach(
        'The father welcomes the son with compassion.',
        '',
        'textual_observation',
      );
      expect(result.detected).toBe(false);
    });
  });

  // ─── Boolean Flags ─────────────────────────────────────────

  describe('top-level boolean flags', () => {
    it('sets homileticalImagination flag', () => {
      const claims = [makeClaim({ claimText: 'The father watched from the porch.' })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      expect(enriched[0].homileticalImagination).toBe(true);
    });

    it('sets outsideSelectedRange flag', () => {
      const claims = [makeClaim({ claimText: 'The elder brother in Luke 15:28 reveals resentment.' })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      expect(enriched[0].outsideSelectedRange).toBe(true);
      expect(enriched[0].outsideRangeReason).toBeTruthy();
    });

    it('sets theologicalExtension flag for doctrine claims', () => {
      const claims = [makeClaim({
        claimText: 'Luke 15:24 supports state of the dead.',
        supportLevel: 'needs_review',
      })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      expect(enriched[0].theologicalExtension).toBe(true);
      expect(enriched[0].pastoralRisk).toBe('high');
    });

    it('does not set flags for clean observation', () => {
      const claims = [makeClaim({
        claimText: 'The son confesses sin and unworthiness.',
        supportLevel: 'partially_supported',
        sourceIds: ['Luke 15:18-21'],
        verified: true,
      })];
      const enriched = service.enrichClaims(claims, 'Luke 15:11-24', LUKE_15_PASSAGE);
      expect(enriched[0].homileticalImagination).toBeFalsy();
      expect(enriched[0].outsideSelectedRange).toBeFalsy();
    });
  });

  // ─── Support Level Refinement ──────────────────────────────

  describe('refineSupportLevel', () => {
    it('keeps supported for verified claim with sources', () => {
      const claim = makeClaim({ verified: true, sourceIds: ['Luke 15:22'] });
      expect(service.refineSupportLevel('The robe shows restoration.', claim)).toBe('supported');
    });

    it('returns needs_review for theological extension language', () => {
      const claim = makeClaim({ supportLevel: 'partially_supported' });
      expect(service.refineSupportLevel('The robe represents righteousness.', claim)).toBe('needs_review');
    });

    it('returns needs_review for porch claim', () => {
      const claim = makeClaim({ claimText: 'The father watched from the porch.' });
      expect(service.refineSupportLevel('The father watched from the porch.', claim)).toBe('needs_review');
    });
  });
});
