import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Highlight } from './highlight.entity';

@Entity('bible_translations')
export class BibleTranslation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  code: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', default: 'en' })
  language: string;

  @Column({ type: 'text', nullable: true })
  apiId: string;

  @Column({ type: 'boolean', default: false })
  isPublicDomain: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Highlight, highlight => highlight.translation)
  highlights: Highlight[];
}
