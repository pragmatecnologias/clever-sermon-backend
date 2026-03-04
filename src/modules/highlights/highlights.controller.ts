import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HighlightsService } from './highlights.service';
import { CreateHighlightDto } from './dto/create-highlight.dto';

@Controller('highlights')
@UseGuards(JwtAuthGuard)
export class HighlightsController {
  constructor(private highlightsService: HighlightsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateHighlightDto) {
    return this.highlightsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.highlightsService.findAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.highlightsService.remove(req.user.userId, id);
  }
}
