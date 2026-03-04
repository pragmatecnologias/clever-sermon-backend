import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateIllustrationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  relatedPoint?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
