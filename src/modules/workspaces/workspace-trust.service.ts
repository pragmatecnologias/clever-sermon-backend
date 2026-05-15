import { Injectable } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { RecordClaimReviewDto } from './dto/record-claim-review.dto';
import { RecordIntegrityIssueReviewDto } from './dto/record-integrity-issue-review.dto';

@Injectable()
export class WorkspaceTrustService {
  constructor(private readonly workspacesService: WorkspacesService) {}

  recordClaimReview(workspaceId: string, userId: string, body: RecordClaimReviewDto) {
    return this.workspacesService.recordClaimReview(workspaceId, userId, body);
  }

  recordIntegrityIssueReview(workspaceId: string, userId: string, body: RecordIntegrityIssueReviewDto) {
    return this.workspacesService.recordIntegrityIssueReview(workspaceId, userId, body);
  }

  validateCitations(workspaceId: string, userId: string, translation?: string) {
    return this.workspacesService.validateCitations(workspaceId, userId, translation);
  }
}
