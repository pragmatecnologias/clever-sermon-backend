import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

@Entity('sermon_illustrations')
export class SermonIllustration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.illustrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 20, default: 'markdown' })
  contentFormat: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @Column({ type: 'text', nullable: true })
  relatedPoint: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
