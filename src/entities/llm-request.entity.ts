import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { LlmProvider } from './enums/llm-provider.enum';

@Entity('llm_requests')
export class LlmRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.llmRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: LlmProvider })
  provider: LlmProvider;

  @Column({ type: 'text' })
  model: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'integer', nullable: true })
  tokenCount: number;

  @Column({ type: 'integer', nullable: true })
  latencyMs: number;

  @Column({ type: 'boolean', default: true })
  wasSuccessful: boolean;

  @Column({ type: 'text', nullable: true })
  error: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
