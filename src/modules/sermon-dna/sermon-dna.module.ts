import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SermonDnaAnalysis } from '../../entities/sermon-dna-analysis.entity';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { LlmModule } from '../llm/llm.module';
import { SermonDnaService } from './sermon-dna.service';
import { SermonDnaController } from './sermon-dna.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SermonDnaAnalysis, SermonWorkspace]), LlmModule],
  providers: [SermonDnaService],
  controllers: [SermonDnaController],
  exports: [SermonDnaService],
})
export class SermonDnaModule {}
