import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WordStudyService } from './word-study.service';
import { CreateWordStudyDto } from './dto/create-word-study.dto';

@Controller('word-studies')
@UseGuards(JwtAuthGuard)
export class WordStudyController {
  constructor(private wordStudyService: WordStudyService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateWordStudyDto) {
    return this.wordStudyService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.wordStudyService.findAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.wordStudyService.remove(req.user.userId, id);
  }
}
