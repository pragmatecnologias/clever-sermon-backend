import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossReference } from '../../entities/cross-reference.entity';

@Injectable()
export class CrossReferencesService {
  constructor(
    @InjectRepository(CrossReference)
    private crossRefRepository: Repository<CrossReference>,
  ) {}

  findAll() {
    return this.crossRefRepository.find({ order: { createdAt: 'DESC' } });
  }

  findBySourceVerse(sourceVerse: string, relationshipType?: string) {
    const where: Record<string, any> = { sourceVerse };
    if (relationshipType) {
      where.relationshipType = relationshipType;
    }
    return this.crossRefRepository.find({ where, order: { strength: 'DESC' } });
  }

  create(dto: Partial<CrossReference>) {
    const ref = this.crossRefRepository.create(dto);
    return this.crossRefRepository.save(ref);
  }
}
