import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeContent } from '../../entities/knowledge-content.entity';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(KnowledgeContent)
    private knowledgeRepository: Repository<KnowledgeContent>,
  ) {}

  create(userId: string, dto: CreateKnowledgeDto) {
    const content = this.knowledgeRepository.create({
      ...dto,
      userId,
    });
    return this.knowledgeRepository.save(content);
  }

  findAll(userId: string) {
    return this.knowledgeRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  findOne(userId: string, id: string) {
    return this.knowledgeRepository.findOne({ where: { id, userId } });
  }

  async update(userId: string, id: string, dto: UpdateKnowledgeDto) {
    await this.knowledgeRepository.update({ id, userId }, dto);
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string) {
    await this.knowledgeRepository.delete({ id, userId });
  }
}
