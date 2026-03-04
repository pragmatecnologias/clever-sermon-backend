import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';
import { SermonManuscript } from './sermon-manuscript.entity';
import { LlmProvider } from './enums/llm-provider.enum';

@Entity('sermon_outlines')
export class SermonOutline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.outlines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'jsonb' })
  structure: Record<string, any>;

  @Column({ type: 'varchar', length: 20, default: 'markdown' })
  contentFormat: string;

  @Column({ type: 'boolean', default: false })
  isSelected: boolean;

  @Column({ type: 'enum', enum: LlmProvider, nullable: true })
  generatedBy: LlmProvider;

  @Column({ type: 'text', nullable: true })
  generatedModel: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => SermonManuscript, manuscript => manuscript.outline)
  manuscripts: SermonManuscript[];
}
