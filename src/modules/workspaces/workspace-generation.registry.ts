import { WorkspaceHelpers } from './helpers';

export type WorkspaceGenerationCapability =
  | 'study-report'
  | 'outline-points'
  | 'outline'
  | 'manuscript'
  | 'sermon-core'
  | 'integrity-check'
  | 'applications'
  | 'discussion-questions'
  | 'illustrations'
  | 'citations'
  | 'media-suggestions';

export type StructuredValidationResult = {
  ok: boolean;
  issues: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const ensureStringArray = (value: unknown): boolean => Array.isArray(value) && value.every((item) => typeof item === 'string');
const ensureStringOrObjectArray = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.every((item) => typeof item === 'string' || isRecord(item));

type RegistryEntry = {
  capability: WorkspaceGenerationCapability;
  description: string;
  validate: (parsed: unknown) => StructuredValidationResult;
};

export const WorkspaceGenerationRegistry: Record<WorkspaceGenerationCapability, RegistryEntry> = {
  'study-report': {
    capability: 'study-report',
    description: 'Structured exegetical study report',
    validate: (parsed) => {
      if (!isRecord(parsed)) return { ok: false, issues: ['study report is not an object'] };
      if (parsed.status === 'unavailable') {
        const message = typeof parsed.message === 'string' && parsed.message.trim() ? parsed.message.trim() : '';
        const hasEmptyPayload =
          !parsed.passageOverview &&
          !parsed.literaryContext &&
          !parsed.exegeticalSummary &&
          !parsed.historicalContext &&
          !parsed.canonicalContext &&
          !parsed.mainTheologicalClaim &&
          !parsed.preachingFocus &&
          Array.isArray(parsed.exegeticalFlow) && parsed.exegeticalFlow.length === 0 &&
          Array.isArray(parsed.structureOfPassage) && parsed.structureOfPassage.length === 0 &&
          Array.isArray(parsed.keyTerms) && parsed.keyTerms.length === 0 &&
          Array.isArray(parsed.theologicalThemes) && parsed.theologicalThemes.length === 0 &&
          Array.isArray(parsed.interpretiveChallenges) && parsed.interpretiveChallenges.length === 0;
        return hasEmptyPayload && Boolean(message)
          ? { ok: true, issues: [] }
          : { ok: false, issues: ['study report unavailable payload is not clean'] };
      }
      const issues = ['passageOverview', 'literaryContext', 'exegeticalFlow', 'exegeticalSummary', 'structureOfPassage', 'keyTerms', 'historicalContext', 'canonicalContext', 'crossReferences', 'interpretiveChallenges', 'theologicalThemes', 'mainTheologicalClaim', 'pastoralImplications', 'preachingFocus']
        .filter((key) => parsed[key] === undefined || parsed[key] === null)
        .map((key) => `${key} missing`);
      if (!ensureStringArray(parsed.exegeticalFlow)) issues.push('exegeticalFlow invalid');
      if (!Array.isArray(parsed.structureOfPassage)) issues.push('structureOfPassage invalid');
      if (!Array.isArray(parsed.keyTerms)) issues.push('keyTerms invalid');
      if (!Array.isArray(parsed.crossReferences)) issues.push('crossReferences invalid');
      if (!Array.isArray(parsed.interpretiveChallenges)) issues.push('interpretiveChallenges invalid');
      if (!ensureStringArray(parsed.theologicalThemes)) issues.push('theologicalThemes invalid');
      if (!isRecord(parsed.pastoralImplications)) issues.push('pastoralImplications invalid');
      return { ok: issues.length === 0, issues };
    },
  },
  'outline-points': {
    capability: 'outline-points',
    description: 'Outline candidate point set',
    validate: (parsed) => {
      if (!Array.isArray(parsed)) return { ok: false, issues: ['outline points not an array'] };
      const issues: string[] = [];
      if (parsed.length < 1) issues.push('no outline point variations');
      parsed.forEach((entry, index) => {
        if (!isRecord(entry)) {
          issues.push(`variation ${index + 1} not an object`);
          return;
        }
        const points = Array.isArray(entry.points) ? entry.points : [];
        if (!ensureStringArray(points) || points.length < 3) issues.push(`variation ${index + 1} points invalid`);
        if (typeof entry.angle !== 'string') issues.push(`variation ${index + 1} angle missing`);
      });
      return { ok: issues.length === 0, issues };
    },
  },
  outline: {
    capability: 'outline',
    description: 'Full sermon outline',
    validate: (parsed) => {
      if (!isRecord(parsed)) return { ok: false, issues: ['outline is not an object'] };
      const issues: string[] = [];
      if (typeof parsed.introduction !== 'string') issues.push('introduction missing');
      const points = Array.isArray(parsed.points) ? WorkspaceHelpers.asStringArray(parsed.points, 24) : [];
      const pointNodes = Array.isArray(parsed.pointNodes) ? parsed.pointNodes : [];
      const inferredPoints = points.length
        ? points
        : pointNodes.map((node: any) => WorkspaceHelpers.pointText(node)).filter(Boolean);
      if (!ensureStringArray(inferredPoints) || inferredPoints.length < 3) issues.push('points invalid');
      if (!Array.isArray(pointNodes)) issues.push('pointNodes invalid');
      if (typeof parsed.conclusion !== 'string') issues.push('conclusion missing');
      return { ok: issues.length === 0, issues };
    },
  },
  manuscript: {
    capability: 'manuscript',
    description: 'Generated sermon manuscript',
    validate: (parsed) => {
      if (!isRecord(parsed)) return { ok: false, issues: ['manuscript is not an object'] };
      const issues: string[] = [];
      const content = isRecord(parsed.content) ? parsed.content : null;
      if (!content) issues.push('content missing');
      const text = typeof content?.text === 'string' ? content.text.trim() : '';
      if (!text) issues.push('content.text missing');
      return { ok: issues.length === 0, issues };
    },
  },
  'sermon-core': {
    capability: 'sermon-core',
    description: 'Sermon core summary',
    validate: (parsed) => {
      if (!isRecord(parsed)) return { ok: false, issues: ['sermon core is not an object'] };
      const issues = ['bigIdea', 'fallenCondition', 'centralTruth', 'sermonGoal', 'audienceNeed']
        .filter((key) => typeof parsed[key] !== 'string' || !String(parsed[key] || '').trim())
        .map((key) => `${key} missing`);
      return { ok: issues.length === 0, issues };
    },
  },
  'integrity-check': {
    capability: 'integrity-check',
    description: 'Sermon integrity report',
    validate: (parsed) => {
      if (!isRecord(parsed)) return { ok: false, issues: ['integrity report is not an object'] };
      const issues: string[] = [];
      if (typeof parsed.overallScore !== 'number') issues.push('overallScore missing');
      if (typeof parsed.balanced !== 'boolean') issues.push('balanced missing');
      if (!Array.isArray(parsed.issues)) issues.push('issues invalid');
      if (!Array.isArray(parsed.strengths)) issues.push('strengths invalid');
      if (!Array.isArray(parsed.recommendations)) issues.push('recommendations invalid');
      if (!Array.isArray(parsed.pointAnalysis)) issues.push('pointAnalysis invalid');
      if (!Array.isArray(parsed.applicationAnalysis)) issues.push('applicationAnalysis invalid');
      if (!Array.isArray(parsed.citationAnalysis)) issues.push('citationAnalysis invalid');
      return { ok: issues.length === 0, issues };
    },
  },
  applications: {
    capability: 'applications',
    description: 'Generated application suggestions',
    validate: (parsed) => {
      if (!Array.isArray(parsed)) return { ok: false, issues: ['applications is not an array'] };
      const items = parsed.filter((item) => typeof item === 'string' || isRecord(item));
      const issues = [];
      if (!items.length) issues.push('applications empty');
      if (!ensureStringOrObjectArray(items)) issues.push('applications invalid');
      return { ok: issues.length === 0, issues };
    },
  },
  'discussion-questions': {
    capability: 'discussion-questions',
    description: 'Generated discussion questions',
    validate: (parsed) => {
      if (!Array.isArray(parsed)) return { ok: false, issues: ['discussion questions is not an array'] };
      const items = parsed.filter((item) => typeof item === 'string' || isRecord(item));
      const issues = [];
      if (!items.length) issues.push('discussion questions empty');
      if (!ensureStringOrObjectArray(items)) issues.push('discussion questions invalid');
      return { ok: issues.length === 0, issues };
    },
  },
  illustrations: {
    capability: 'illustrations',
    description: 'Generated illustration ideas',
    validate: (parsed) => {
      if (!Array.isArray(parsed)) return { ok: false, issues: ['illustrations is not an array'] };
      const items = parsed.filter((item) => typeof item === 'string' || isRecord(item));
      const issues = [];
      if (!items.length) issues.push('illustrations empty');
      if (!ensureStringOrObjectArray(items)) issues.push('illustrations invalid');
      return { ok: issues.length === 0, issues };
    },
  },
  citations: {
    capability: 'citations',
    description: 'Generated citations',
    validate: (parsed) => {
      if (!Array.isArray(parsed)) return { ok: false, issues: ['citations is not an array'] };
      const items = parsed.filter((item) => typeof item === 'string' || isRecord(item));
      const issues = [];
      if (!items.length) issues.push('citations empty');
      if (!ensureStringOrObjectArray(items)) issues.push('citations invalid');
      return { ok: issues.length === 0, issues };
    },
  },
  'media-suggestions': {
    capability: 'media-suggestions',
    description: 'Media pack suggestions',
    validate: (parsed) => {
      if (!isRecord(parsed)) return { ok: false, issues: ['media suggestions are not an object'] };
      const sections = isRecord(parsed.sections) ? parsed.sections : parsed;
      const studyAssets = isRecord((sections as Record<string, unknown>).studyAssets)
        ? (sections as Record<string, unknown>).studyAssets
        : null;
      const categoryAssets = isRecord((studyAssets as Record<string, unknown> | null)?.categoryAssets)
        ? (studyAssets as Record<string, unknown>).categoryAssets
        : null;
      const mediaSuggestions = Array.isArray((sections as Record<string, unknown>).mediaSuggestions)
        ? ((sections as Record<string, unknown>).mediaSuggestions as unknown[])
        : Array.isArray((categoryAssets as Record<string, unknown> | null)?.mediaSuggestions)
          ? (((categoryAssets as Record<string, unknown>).mediaSuggestions) as unknown[])
          : [];
      const issues = [];
      if (!mediaSuggestions.length) issues.push('media suggestions empty');
      if (!ensureStringOrObjectArray(mediaSuggestions)) issues.push('media suggestions invalid');
      return { ok: issues.length === 0, issues };
    },
  },
};
