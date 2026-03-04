import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { TopicGraphEdge } from './topic-graph-edge.entity';

@Entity('topic_graph_nodes')
export class TopicGraphNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.topicNodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  topic: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  relatedVerses: string[];

  @Column({ type: 'uuid', array: true, nullable: true })
  relatedNotes: string[];

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => TopicGraphEdge, edge => edge.sourceNode)
  outgoingEdges: TopicGraphEdge[];

  @OneToMany(() => TopicGraphEdge, edge => edge.targetNode)
  incomingEdges: TopicGraphEdge[];
}
