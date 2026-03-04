import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { SermonWorkspace } from './sermon-workspace.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', array: true, nullable: true })
  verseReferences: string[];

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({ type: 'uuid', array: true, nullable: true })
  linkedNoteIds: string[];

  @Column({ type: 'uuid', nullable: true })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.notes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
