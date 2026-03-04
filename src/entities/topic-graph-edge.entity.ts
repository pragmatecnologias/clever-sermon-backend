import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TopicGraphNode } from './topic-graph-node.entity';

@Entity('topic_graph_edges')
export class TopicGraphEdge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  sourceNodeId: string;

  @ManyToOne(() => TopicGraphNode, node => node.outgoingEdges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sourceNodeId' })
  sourceNode: TopicGraphNode;

  @Column({ type: 'uuid' })
  targetNodeId: string;

  @ManyToOne(() => TopicGraphNode, node => node.incomingEdges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetNodeId' })
  targetNode: TopicGraphNode;

  @Column({ type: 'text' })
  relationshipType: string;

  @Column({ type: 'integer', default: 5 })
  strength: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
