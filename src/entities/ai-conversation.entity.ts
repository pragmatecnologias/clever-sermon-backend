import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { SermonWorkspace } from './sermon-workspace.entity';

export enum AiMode {
  ANSWER = 'answer',
  MENTOR = 'mentor',
  COACH = 'coach',
}

@Entity('ai_conversations')
export class AiConversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.aiConversations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.aiConversations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'enum', enum: AiMode, default: AiMode.ANSWER })
  mode: AiMode;

  @Column({ type: 'jsonb', default: [] })
  messages: any[];

  @Column({ type: 'jsonb', default: {} })
  context: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
