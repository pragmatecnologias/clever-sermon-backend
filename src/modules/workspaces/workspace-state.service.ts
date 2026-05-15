import { Injectable } from '@nestjs/common';
import {
  WorkspaceArtifactCounts,
  WorkspaceClaimReview,
  WorkspaceClaimSummary,
  WorkspaceExportSummary,
  WorkspaceIntegrityIssueReview,
  WorkspaceIntegrityIssueSummary,
  WorkspaceIntegritySummary,
  WorkspaceManuscriptComparisonSummary,
  WorkspaceManuscriptHistorySummary,
  WorkspaceManuscriptSummary,
  WorkspaceMediaPackSummary,
  WorkspaceNextAction,
  WorkspaceOutlineComparisonSummary,
  WorkspaceOutlineHistorySummary,
  WorkspaceOutlineSummary,
  WorkspacePhase,
  WorkspaceProgress,
  WorkspaceSection,
  WorkspaceSourceSummary,
  WorkspaceStateResponse,
  WorkspaceWorkspaceSnapshot,
} from './workspace-state.types';

export type WorkspaceStateParts = {
  workspace: WorkspaceWorkspaceSnapshot;
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
};

@Injectable()
export class WorkspaceStateService {
  buildWorkspaceState(parts: WorkspaceStateParts): WorkspaceStateResponse {
    return {
      ...parts,
    };
  }
}
