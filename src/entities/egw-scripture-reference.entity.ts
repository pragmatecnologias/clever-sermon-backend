import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { EGWParagraph } from './egw-paragraph.entity';

@Entity('egw_scripture_references')
@Index(['book', 'chapter', 'verseStart'])
@Index(['egwParagraphId'])
export class EGWScriptureReference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  egwParagraphId: string;

  @ManyToOne(() => EGWParagraph)
  @JoinColumn({ name: 'egwParagraphId' })
  egwParagraph: EGWParagraph;

  // Bible reference details
  @Column()
  @Index()
  book: string; // e.g., "John", "Genesis"

  @Column({ type: 'int' })
  @Index()
  chapter: number;

  @Column({ type: 'int', nullable: true })
  verseStart: number;

  @Column({ type: 'int', nullable: true })
  verseEnd: number;

  @Column()
  @Index()
  reference: string; // e.g., "John 3:16", "Genesis 1:1-3"

  @Column({ type: 'varchar', length: 2, default: 'en' })
  @Index()
  language: string;

  @CreateDateColumn()
  createdAt: Date;
}
