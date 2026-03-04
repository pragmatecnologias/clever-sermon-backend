import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  verseReferences?: string[];

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  linkedNoteIds?: string[];

  @IsOptional()
  @IsUUID()
  workspaceId?: string;
}
