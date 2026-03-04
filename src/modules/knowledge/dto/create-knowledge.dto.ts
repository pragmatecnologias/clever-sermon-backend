import { IsEnum, IsOptional, IsString, IsUUID, IsObject } from 'class-validator';
import { ContentType } from '../../../entities/knowledge-content.entity';

export class CreateKnowledgeDto {
  @IsString()
  title: string;

  @IsEnum(ContentType)
  contentType: ContentType;

  @IsOptional()
  @IsString()
  originalFilename?: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsString()
  extractedText?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
