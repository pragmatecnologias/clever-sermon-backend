import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { StatementType } from '../../../entities/sermon-citation.entity';

export class UpdateCitationDto {
  @IsOptional()
  @IsEnum(StatementType)
  statementType?: StatementType;

  @IsOptional()
  @IsString()
  statement?: string;

  @IsOptional()
  @IsArray()
  verseReferences?: string[];

  @IsOptional()
  @IsArray()
  externalSources?: string[];

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
