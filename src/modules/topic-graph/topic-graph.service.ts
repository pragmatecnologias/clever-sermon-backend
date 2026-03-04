import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicGraphNode } from '../../entities/topic-graph-node.entity';
import { TopicGraphEdge } from '../../entities/topic-graph-edge.entity';
import { CreateTopicNodeDto } from './dto/create-topic-node.dto';
import { CreateTopicEdgeDto } from './dto/create-topic-edge.dto';

@Injectable()
export class TopicGraphService {
  constructor(
    @InjectRepository(TopicGraphNode)
    private nodeRepository: Repository<TopicGraphNode>,
    @InjectRepository(TopicGraphEdge)
    private edgeRepository: Repository<TopicGraphEdge>,
  ) {}

  createNode(userId: string, dto: CreateTopicNodeDto) {
    const node = this.nodeRepository.create({
      ...dto,
      userId,
    });
    return this.nodeRepository.save(node);
  }

  listNodes(userId: string) {
    return this.nodeRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  createEdge(dto: CreateTopicEdgeDto) {
    const edge = this.edgeRepository.create(dto);
    return this.edgeRepository.save(edge);
  }

  listEdges() {
    return this.edgeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
