import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';

@Controller('knowledge')
@UseGuards(JwtAuthGuard)
export class KnowledgeController {
  constructor(private knowledgeService: KnowledgeService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateKnowledgeDto) {
    return this.knowledgeService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.knowledgeService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.knowledgeService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateKnowledgeDto) {
    return this.knowledgeService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.knowledgeService.remove(req.user.userId, id);
  }
}
