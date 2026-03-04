import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';
import { SermonOutline } from './sermon-outline.entity';
import { LlmProvider } from './enums/llm-provider.enum';

@Entity('sermon_manuscripts')
export class SermonManuscript {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.manuscripts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'uuid', nullable: true })
  outlineId: string;

  @ManyToOne(() => SermonOutline, outline => outline.manuscripts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'outlineId' })
  outline: SermonOutline;

  @Column({ type: 'jsonb' })
  content: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'markdown' })
  contentFormat: string;

  @Column({ type: 'integer', nullable: true })
  wordCount: number;

  @Column({ type: 'integer', nullable: true })
  estimatedMinutes: number;

  @Column({ type: 'jsonb', nullable: true })
  transitions: Record<string, any>;

  @Column({ type: 'enum', enum: LlmProvider, nullable: true })
  generatedBy: LlmProvider;

  @Column({ type: 'text', nullable: true })
  generatedModel: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
