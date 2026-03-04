import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CrossReferencesService } from './cross-references.service';
import { CrossReference } from '../../entities/cross-reference.entity';

@Controller('cross-references')
@UseGuards(JwtAuthGuard)
export class CrossReferencesController {
  constructor(private crossReferencesService: CrossReferencesService) {}

  @Get()
  findAll(@Query('sourceVerse') sourceVerse?: string, @Query('relationshipType') relationshipType?: string) {
    if (sourceVerse) {
      return this.crossReferencesService.findBySourceVerse(sourceVerse, relationshipType);
    }
    return this.crossReferencesService.findAll();
  }

  @Post()
  create(@Body() dto: Partial<CrossReference>) {
    return this.crossReferencesService.create(dto);
  }
}
