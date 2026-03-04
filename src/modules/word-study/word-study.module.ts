import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordStudy } from '../../entities/word-study.entity';
import { WordStudyService } from './word-study.service';
import { WordStudyController } from './word-study.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WordStudy])],
  providers: [WordStudyService],
  controllers: [WordStudyController],
  exports: [WordStudyService],
})
export class WordStudyModule {}
