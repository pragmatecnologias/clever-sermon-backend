import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiConversation } from '../../entities/ai-conversation.entity';
import { CreateAiConversationDto } from './dto/create-ai-conversation.dto';
import { UpdateAiConversationDto } from './dto/update-ai-conversation.dto';

@Injectable()
export class AiCompanionService {
  constructor(
    @InjectRepository(AiConversation)
    private conversationRepository: Repository<AiConversation>,
  ) {}

  create(userId: string, dto: CreateAiConversationDto) {
    const conversation = this.conversationRepository.create({
      ...dto,
      userId,
    });
    return this.conversationRepository.save(conversation);
  }

  findAll(userId: string) {
    return this.conversationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(userId: string, id: string) {
    return this.conversationRepository.findOne({ where: { id, userId } });
  }

  async update(userId: string, id: string, dto: UpdateAiConversationDto) {
    await this.conversationRepository.update({ id, userId }, dto);
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string) {
    await this.conversationRepository.delete({ id, userId });
  }
}
