import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHighlightDto {
  @IsString()
  verseReference: string;

  @IsOptional()
  @IsUUID()
  translationId?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
