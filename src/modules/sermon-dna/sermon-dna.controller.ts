import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SermonDnaService } from './sermon-dna.service';
import { AnalyzeSermonDnaDto } from './dto/analyze-sermon-dna.dto';

@Controller('sermon-dna')
@UseGuards(JwtAuthGuard)
export class SermonDnaController {
  constructor(private sermonDnaService: SermonDnaService) {}

  @Post('analyze')
  analyze(@Request() req, @Body() dto: AnalyzeSermonDnaDto) {
    return this.sermonDnaService.analyze(req.user.userId, dto.workspaceId);
  }

  @Get('workspace/:id')
  list(@Request() req, @Param('id') workspaceId: string) {
    return this.sermonDnaService.list(req.user.userId, workspaceId);
  }
}
