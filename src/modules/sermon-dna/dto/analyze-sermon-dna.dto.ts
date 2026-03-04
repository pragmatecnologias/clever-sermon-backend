import { IsUUID } from 'class-validator';

export class AnalyzeSermonDnaDto {
  @IsUUID()
  workspaceId: string;
}
