import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';
import { Note } from './note.entity';
import { Highlight } from './highlight.entity';
import { WordStudy } from './word-study.entity';
import { KnowledgeContent } from './knowledge-content.entity';
import { TopicGraphNode } from './topic-graph-node.entity';
import { AiConversation } from './ai-conversation.entity';
import { LlmRequest } from './llm-request.entity';

export enum UserRole {
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  firstName: string;

  @Column({ type: 'text', nullable: true })
  lastName: string;

  @Column({ type: 'jsonb', default: {} })
  preferences: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => SermonWorkspace, workspace => workspace.user)
  workspaces: SermonWorkspace[];

  @OneToMany(() => Note, note => note.user)
  notes: Note[];

  @OneToMany(() => Highlight, highlight => highlight.user)
  highlights: Highlight[];

  @OneToMany(() => WordStudy, wordStudy => wordStudy.user)
  wordStudies: WordStudy[];

  @OneToMany(() => KnowledgeContent, content => content.user)
  knowledgeContent: KnowledgeContent[];

  @OneToMany(() => TopicGraphNode, node => node.user)
  topicNodes: TopicGraphNode[];

  @OneToMany(() => AiConversation, conversation => conversation.user)
  aiConversations: AiConversation[];

  @OneToMany(() => LlmRequest, request => request.user)
  llmRequests: LlmRequest[];
}
