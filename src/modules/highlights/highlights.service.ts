import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Highlight } from '../../entities/highlight.entity';
import { CreateHighlightDto } from './dto/create-highlight.dto';

@Injectable()
export class HighlightsService {
  constructor(
    @InjectRepository(Highlight)
    private highlightRepository: Repository<Highlight>,
  ) {}

  create(userId: string, dto: CreateHighlightDto) {
    const highlight = this.highlightRepository.create({
      ...dto,
      userId,
    });
    return this.highlightRepository.save(highlight);
  }

  findAll(userId: string) {
    return this.highlightRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: string, id: string) {
    await this.highlightRepository.delete({ id, userId });
  }
}
