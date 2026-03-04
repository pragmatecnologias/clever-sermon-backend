import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TopicGraphService } from './topic-graph.service';
import { CreateTopicNodeDto } from './dto/create-topic-node.dto';
import { CreateTopicEdgeDto } from './dto/create-topic-edge.dto';

@Controller('topic-graph')
@UseGuards(JwtAuthGuard)
export class TopicGraphController {
  constructor(private topicGraphService: TopicGraphService) {}

  @Post('nodes')
  createNode(@Request() req, @Body() dto: CreateTopicNodeDto) {
    return this.topicGraphService.createNode(req.user.userId, dto);
  }

  @Get('nodes')
  listNodes(@Request() req) {
    return this.topicGraphService.listNodes(req.user.userId);
  }

  @Post('edges')
  createEdge(@Body() dto: CreateTopicEdgeDto) {
    return this.topicGraphService.createEdge(dto);
  }

  @Get('edges')
  listEdges() {
    return this.topicGraphService.listEdges();
  }
}
