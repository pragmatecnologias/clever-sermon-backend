import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTopicNodeDto {
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  relatedVerses?: string[];

  @IsOptional()
  @IsArray()
  relatedNotes?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
