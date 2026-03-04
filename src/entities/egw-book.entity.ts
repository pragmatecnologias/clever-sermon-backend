import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('egw_books')
export class EGWBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  code: string;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column({ type: 'varchar', length: 2, default: 'en' })
  @Index()
  language: string;

  @Column({ type: 'int', default: 0 })
  chapterCount: number;

  @Column({ type: 'int', default: 0 })
  paragraphCount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
