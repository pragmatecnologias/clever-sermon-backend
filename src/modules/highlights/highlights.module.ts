import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highlight } from '../../entities/highlight.entity';
import { HighlightsService } from './highlights.service';
import { HighlightsController } from './highlights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Highlight])],
  providers: [HighlightsService],
  controllers: [HighlightsController],
  exports: [HighlightsService],
})
export class HighlightsModule {}
