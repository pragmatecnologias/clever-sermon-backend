import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('word_studies')
export class WordStudy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.wordStudies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  word: string;

  @Column({ type: 'text', nullable: true })
  lemma: string;

  @Column({ type: 'text' })
  language: string;

  @Column({ type: 'text', nullable: true })
  transliteration: string;

  @Column({ type: 'text', nullable: true })
  definition: string;

  @Column({ type: 'integer', nullable: true })
  usageCount: number;

  @Column({ type: 'text', array: true, nullable: true })
  verseExamples: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
