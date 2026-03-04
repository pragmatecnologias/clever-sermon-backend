import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

export enum StatementType {
  OBSERVATION = 'observation',
  INTERPRETATION = 'interpretation',
  APPLICATION = 'application',
  ILLUSTRATION = 'illustration',
  EXTERNAL_REFERENCE = 'external_reference',
}

@Entity('sermon_citations')
export class SermonCitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.citations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'enum', enum: StatementType })
  statementType: StatementType;

  @Column({ type: 'text' })
  statement: string;

  @Column({ type: 'text', array: true, nullable: true })
  verseReferences: string[];

  @Column({ type: 'text', array: true, nullable: true })
  externalSources: string[];

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
