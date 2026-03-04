import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum ContentType {
  SERMON = 'sermon',
  PDF = 'pdf',
  OUTLINE = 'outline',
  STUDY_NOTE = 'study_note',
}

@Entity('knowledge_content')
export class KnowledgeContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.knowledgeContent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'enum', enum: ContentType })
  contentType: ContentType;

  @Column({ type: 'text', nullable: true })
  originalFilename: string;

  @Column({ type: 'text', nullable: true })
  filePath: string;

  @Column({ type: 'text', nullable: true })
  extractedText: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
