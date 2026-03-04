import { IsArray, IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateWordStudyDto {
  @IsString()
  word: string;

  @IsOptional()
  @IsString()
  lemma?: string;

  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  transliteration?: string;

  @IsOptional()
  @IsString()
  definition?: string;

  @IsOptional()
  @IsNumber()
  usageCount?: number;

  @IsOptional()
  @IsArray()
  verseExamples?: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
