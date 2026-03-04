import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

export enum AudienceType {
  YOUTH = 'youth',
  NEW_BELIEVERS = 'new_believers',
  LEADERSHIP = 'leadership',
  MIXED_CONGREGATION = 'mixed_congregation',
  PASTORAL_CARE = 'pastoral_care',
  SMALL_GROUP = 'small_group',
}

@Entity('sermon_applications')
export class SermonApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'enum', enum: AudienceType })
  audienceType: AudienceType;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 20, default: 'markdown' })
  contentFormat: string;

  @Column({ type: 'integer', default: 0 })
  orderIndex: number;

  @Column({ type: 'boolean', default: false })
  isSelected: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
