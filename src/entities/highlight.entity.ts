import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BibleTranslation } from './bible-translation.entity';

@Entity('highlights')
export class Highlight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.highlights, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  verseReference: string;

  @Column({ type: 'uuid', nullable: true })
  translationId: string;

  @ManyToOne(() => BibleTranslation, translation => translation.highlights, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'translationId' })
  translation: BibleTranslation;

  @Column({ type: 'text', nullable: true })
  color: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
