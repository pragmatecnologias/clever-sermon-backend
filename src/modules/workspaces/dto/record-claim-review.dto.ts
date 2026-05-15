import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { WorkspaceClaimReviewDecision, WorkspaceClaimSupportLevel } from '../workspace-state.types';

export class RecordClaimReviewDto {
  @IsString()
  claimId: string;

  @IsIn(['repair', 'acknowledge', 'cite'])
  decision: WorkspaceClaimReviewDecision;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  claimText?: string;

  @IsOptional()
  @IsString()
  claimType?: string;

  @IsOptional()
  @IsIn(['supported', 'partially_supported', 'needs_review', 'unsupported'])
  supportLevel?: WorkspaceClaimSupportLevel;

  @IsOptional()
  @IsString()
  sourceType?: string;

  @IsOptional()
  @IsArray()
  sourceIds?: string[];

  @IsOptional()
  @IsString()
  location?: string;
}
