import { IsArray, IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class ComposeMediaPackDto {
  @IsOptional()
  @IsString()
  deckSize?: 'short' | 'standard' | 'long';

  @IsOptional()
  @IsString()
  deckIntent?: 'sermon_presentation' | 'social_summary' | 'teaching_study' | 'youth_message' | 'evangelistic_appeal';

  @IsOptional()
  @IsString()
  backgroundProvider?: 'local' | 'openai';

  @IsOptional()
  @IsString()
  backgroundPreset?: string;

  @IsOptional()
  @IsString()
  visualStyle?: 'auto' | 'reverent_worship' | 'warm_pastoral' | 'evangelistic_invitation' | 'hopeful_prophecy' | 'bible_study_clean' | 'youth_modern' | 'spanish_church_warm';

  @IsOptional()
  @IsArray()
  @IsIn(['pptx', 'pdf'], { each: true })
  exportTypes?: Array<'pptx' | 'pdf'>;

  @IsOptional()
  @IsBoolean()
  includeDeck?: boolean;

  @IsOptional()
  @IsString()
  themeId?: string;
}
