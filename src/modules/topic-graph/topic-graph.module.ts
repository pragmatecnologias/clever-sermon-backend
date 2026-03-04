import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicGraphNode } from '../../entities/topic-graph-node.entity';
import { TopicGraphEdge } from '../../entities/topic-graph-edge.entity';
import { TopicGraphService } from './topic-graph.service';
import { TopicGraphController } from './topic-graph.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TopicGraphNode, TopicGraphEdge])],
  providers: [TopicGraphService],
  controllers: [TopicGraphController],
  exports: [TopicGraphService],
})
export class TopicGraphModule {}
