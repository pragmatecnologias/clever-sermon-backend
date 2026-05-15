import { IsArray, IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class ComposeMediaPackDto {
  @IsOptional()
  @IsString()
  deckSize?: 'short' | 'standard' | 'long';

  @IsOptional()
  @IsString()
  backgroundProvider?: 'local' | 'openai';

  @IsOptional()
  @IsString()
  backgroundPreset?: string;

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
