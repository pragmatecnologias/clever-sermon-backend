import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('egw_paragraphs')
@Index(['bookCode', 'chapterNumber', 'paragraphNumber'])
@Index(['reference'])
export class EGWParagraph {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  bookCode: string;

  @Column()
  bookTitle: string;

  @Column({ type: 'varchar', length: 2, default: 'en' })
  @Index()
  language: string;

  @Column({ type: 'int' })
  chapterNumber: number;

  @Column()
  chapterTitle: string;

  @Column({ type: 'int' })
  paragraphNumber: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ unique: true })
  @Index()
  reference: string; // e.g., "DA 123.2"

  @CreateDateColumn()
  createdAt: Date;
}
