import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { SermonStyle, StoryArc } from '../../../entities/sermon-workspace.entity';

export class CreateWorkspaceDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  seriesTitle?: string;

  @IsString()
  mainPassage: string;

  @IsOptional()
  @IsArray()
  additionalPassages?: string[];

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  audienceProfile?: string;

  @IsOptional()
  @IsString()
  sermonGoals?: string;

  @IsOptional()
  @IsString()
  theologicalLens?: string;

  @IsOptional()
  @IsEnum(SermonStyle)
  style?: SermonStyle;

  @IsOptional()
  @IsEnum(StoryArc)
  storyArc?: StoryArc;

  @IsOptional()
  @IsString()
  language?: string;
}
