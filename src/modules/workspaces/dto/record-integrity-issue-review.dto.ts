import { IsIn, IsOptional, IsString } from 'class-validator';
import { WorkspaceIntegrityIssueDecision } from '../workspace-state.types';

export class RecordIntegrityIssueReviewDto {
  @IsString()
  issueId: string;

  @IsIn(['repair', 'acknowledge', 'cite'])
  decision: WorkspaceIntegrityIssueDecision;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  issueMessage?: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  affectedItem?: string;
}
