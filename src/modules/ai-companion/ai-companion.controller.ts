import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiCompanionService } from './ai-companion.service';
import { CreateAiConversationDto } from './dto/create-ai-conversation.dto';
import { UpdateAiConversationDto } from './dto/update-ai-conversation.dto';

@Controller('ai-companion')
@UseGuards(JwtAuthGuard)
export class AiCompanionController {
  constructor(private aiCompanionService: AiCompanionService) {}

  @Post('conversations')
  create(@Request() req, @Body() dto: CreateAiConversationDto) {
    return this.aiCompanionService.create(req.user.userId, dto);
  }

  @Get('conversations')
  findAll(@Request() req) {
    return this.aiCompanionService.findAll(req.user.userId);
  }

  @Get('conversations/:id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.aiCompanionService.findOne(req.user.userId, id);
  }

  @Patch('conversations/:id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateAiConversationDto) {
    return this.aiCompanionService.update(req.user.userId, id, dto);
  }

  @Delete('conversations/:id')
  remove(@Request() req, @Param('id') id: string) {
    return this.aiCompanionService.remove(req.user.userId, id);
  }
}
