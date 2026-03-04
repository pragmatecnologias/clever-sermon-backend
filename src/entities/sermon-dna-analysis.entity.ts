import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

@Entity('sermon_dna_analyses')
export class SermonDnaAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.dnaAnalyses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'varchar', length: 20, default: 'markdown' })
  contentFormat: string;

  @Column({ type: 'text', array: true, nullable: true })
  themes: string[];

  @Column({ type: 'jsonb', default: {} })
  scores: Record<string, number>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
