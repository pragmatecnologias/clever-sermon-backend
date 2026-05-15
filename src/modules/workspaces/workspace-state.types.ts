import { SermonWorkspace } from '../../entities/sermon-workspace.entity';

export type WorkspacePhase = 'THEME' | 'PASSAGE' | 'STUDY' | 'OUTLINE' | 'WRITE' | 'REFINE' | 'DELIVER';

export type WorkspaceSection =
  | 'workspace'
  | 'scripture'
  | 'study-report'
  | 'outlines'
  | 'manuscript'
  | 'citations'
  | 'dna'
  | 'media';

export interface WorkspaceProgress {
  themeConfigured: boolean;
  passageExplored: boolean;
  studyGenerated: boolean;
  outlineCreated: boolean;
  manuscriptWritten: boolean;
  refineCompleted: boolean;
  deliverPrepared: boolean;
}

export interface WorkspaceArtifactCounts {
  outlines: number;
  manuscripts: number;
  studyReports: number;
  applications: number;
  illustrations: number;
  citations: number;
}

export interface WorkspaceOutlineSummary {
  id: string;
  title: string;
  isSelected: boolean;
  createdAt: Date | string;
  pointCount: number;
}

export interface WorkspaceOutlineHistorySummary extends WorkspaceOutlineSummary {
  revisionLabel: string;
  archivedAt: string;
  structure?: Record<string, unknown>;
}

export interface WorkspaceManuscriptSummary {
  id: string;
  outlineId: string | null;
  wordCount: number | null;
  estimatedMinutes: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface WorkspaceManuscriptHistorySummary extends WorkspaceManuscriptSummary {
  revisionLabel: string;
  archivedAt: string;
  content?: Record<string, unknown>;
  transitions?: Record<string, unknown> | null;
}

export interface WorkspaceOutlineComparisonSummary {
  previousRevisionLabel: string | null;
  pointDelta: number | null;
  titleChanged: boolean;
}

export interface WorkspaceManuscriptComparisonSummary {
  previousRevisionLabel: string | null;
  wordDelta: number | null;
  minuteDelta: number | null;
  outlineChanged: boolean;
}

export interface WorkspaceIntegritySummary {
  overallScore?: number;
  balanced?: boolean;
  issueCount?: number;
  strengthCount?: number;
  criticalIssueCount?: number;
  warningIssueCount?: number;
  reviewedIssueCount?: number;
  updatedAt?: string;
}

export type WorkspaceIntegrityIssueDecision = 'repair' | 'acknowledge' | 'cite';

export interface WorkspaceIntegrityIssueSummary {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  affectedItem?: string;
  decision?: WorkspaceIntegrityIssueDecision;
  note?: string;
  status?: 'open' | 'reviewed' | 'resolved';
  updatedAt?: string;
}

export interface WorkspaceIntegrityIssueReview {
  issueId: string;
  decision: WorkspaceIntegrityIssueDecision;
  note?: string;
  updatedAt: string;
  issueMessage?: string;
  severity?: 'critical' | 'warning' | 'info';
  category?: string;
  affectedItem?: string;
}

export interface WorkspaceMediaPackSummary {
  status: 'draft' | 'ready' | 'outdated';
  generatedAt?: string;
  sourceOutlineId?: string | null;
  sourceManuscriptId?: string | null;
  sourceStudyReportId?: string | null;
  slideCount?: number;
  audioEnabled?: boolean;
  musicEnabled?: boolean;
  videoEnabled?: boolean;
  exportPrepared?: boolean;
}

export interface WorkspaceExportArtifactSummary {
  type: 'pptx' | 'pdf' | 'docx' | 'study-report';
  label: string;
  status: 'pending' | 'ready' | 'downloaded' | 'outdated';
  filename?: string;
  sourceOutlineId?: string | null;
  sourceManuscriptId?: string | null;
  sourceStudyReportId?: string | null;
  url?: string | null;
}

export interface WorkspaceExportSummary {
  status: 'draft' | 'ready' | 'outdated';
  generatedAt?: string;
  sourceOutlineId?: string | null;
  sourceManuscriptId?: string | null;
  sourceStudyReportId?: string | null;
  artifacts: WorkspaceExportArtifactSummary[];
}

export type WorkspaceClaimSupportLevel = 'supported' | 'partially_supported' | 'needs_review' | 'unsupported';

export interface WorkspaceSourceSummary {
  id: string;
  sourceType: 'bible' | 'egw' | 'external' | 'user' | 'generated';
  label: string;
  reference?: string;
  verified?: boolean;
}

export interface WorkspaceClaimSummary {
  id: string;
  claimText: string;
  claimType: string;
  supportLevel: WorkspaceClaimSupportLevel;
  sourceType: WorkspaceSourceSummary['sourceType'];
  sourceIds: string[];
  location?: string;
  verified?: boolean;
}

export type WorkspaceClaimReviewDecision = 'repair' | 'acknowledge' | 'cite';

export interface WorkspaceClaimReview {
  claimId: string;
  decision: WorkspaceClaimReviewDecision;
  note?: string;
  updatedAt: string;
  claimText?: string;
  claimType?: string;
  supportLevel?: WorkspaceClaimSupportLevel;
  sourceType?: WorkspaceSourceSummary['sourceType'];
  sourceIds?: string[];
  location?: string;
}

export interface WorkspaceNextAction {
  phase: WorkspacePhase;
  section: WorkspaceSection;
  action: string;
  label: string;
  description: string;
}

export interface WorkspaceStateResponse {
  workspace: SermonWorkspace;
  activePhase: WorkspacePhase;
  activeSection: WorkspaceSection;
  progress: WorkspaceProgress;
  artifacts: WorkspaceArtifactCounts;
  activeOutline: WorkspaceOutlineSummary | null;
  activeManuscript: WorkspaceManuscriptSummary | null;
  outlineHistory: WorkspaceOutlineHistorySummary[];
  manuscriptHistory: WorkspaceManuscriptHistorySummary[];
  outlineComparison: WorkspaceOutlineComparisonSummary | null;
  manuscriptComparison: WorkspaceManuscriptComparisonSummary | null;
  latestIntegrityReport: WorkspaceIntegritySummary | null;
  integrityIssueLedger: WorkspaceIntegrityIssueSummary[];
  integrityIssueReviews: WorkspaceIntegrityIssueReview[];
  mediaPack: WorkspaceMediaPackSummary | null;
  exportPack: WorkspaceExportSummary | null;
  claimLedger: WorkspaceClaimSummary[];
  sourceLedger: WorkspaceSourceSummary[];
  claimReviewDecisions: WorkspaceClaimReview[];
  nextAction: WorkspaceNextAction;
  uiState: {
    phase: WorkspacePhase;
    section: WorkspaceSection;
  };
}
