import { PartialType } from '@nestjs/mapped-types';
import { CreateAiConversationDto } from './create-ai-conversation.dto';

export class UpdateAiConversationDto extends PartialType(CreateAiConversationDto) {}
