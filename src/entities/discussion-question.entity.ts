import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

@Entity('discussion_questions')
export class DiscussionQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.discussionQuestions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'varchar', length: 20, default: 'markdown' })
  contentFormat: string;

  @Column({ type: 'integer', default: 0 })
  orderIndex: number;

  @Column({ type: 'text', nullable: true })
  category: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
