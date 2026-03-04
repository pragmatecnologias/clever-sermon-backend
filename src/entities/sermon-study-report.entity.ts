import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';
import { LlmProvider } from './enums/llm-provider.enum';

@Entity('sermon_study_reports')
export class SermonStudyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.studyReports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'jsonb' })
  sections: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'markdown' })
  contentFormat: string;

  @Column({ type: 'text', nullable: true })
  rawResponse: string;

  @Column({ type: 'enum', enum: LlmProvider, nullable: true })
  generatedBy: LlmProvider;

  @Column({ type: 'text', nullable: true })
  generatedModel: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
