import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordStudy } from '../../entities/word-study.entity';
import { CreateWordStudyDto } from './dto/create-word-study.dto';

@Injectable()
export class WordStudyService {
  constructor(
    @InjectRepository(WordStudy)
    private wordStudyRepository: Repository<WordStudy>,
  ) {}

  create(userId: string, dto: CreateWordStudyDto) {
    const study = this.wordStudyRepository.create({
      ...dto,
      userId,
    });
    return this.wordStudyRepository.save(study);
  }

  findAll(userId: string) {
    return this.wordStudyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: string, id: string) {
    await this.wordStudyRepository.delete({ id, userId });
  }
}
