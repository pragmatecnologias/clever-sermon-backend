import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossReference } from '../../entities/cross-reference.entity';
import { CrossReferencesService } from './cross-references.service';
import { CrossReferencesController } from './cross-references.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CrossReference])],
  providers: [CrossReferencesService],
  controllers: [CrossReferencesController],
  exports: [CrossReferencesService],
})
export class CrossReferencesModule {}
