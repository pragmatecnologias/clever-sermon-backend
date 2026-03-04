import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiConversation } from '../../entities/ai-conversation.entity';
import { AiCompanionService } from './ai-companion.service';
import { AiCompanionController } from './ai-companion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AiConversation])],
  providers: [AiCompanionService],
  controllers: [AiCompanionController],
  exports: [AiCompanionService],
})
export class AiCompanionModule {}
