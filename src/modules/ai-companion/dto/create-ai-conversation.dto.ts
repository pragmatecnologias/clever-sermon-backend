import { IsArray, IsEnum, IsObject, IsOptional, IsUUID } from 'class-validator';
import { AiMode } from '../../../entities/ai-conversation.entity';

export class CreateAiConversationDto {
  @IsOptional()
  @IsUUID()
  workspaceId?: string;

  @IsOptional()
  @IsEnum(AiMode)
  mode?: AiMode;

  @IsOptional()
  @IsArray()
  messages?: any[];

  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}
