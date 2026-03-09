import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sermon_pattern_trackers')
export class SermonPatternTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'integer', default: 0 })
  totalSermons: number;

  @Column({ type: 'jsonb', default: {} })
  styleFrequency: Record<string, number>;

  @Column({ type: 'jsonb', default: {} })
  themeFrequency: Record<string, number>;

  @Column({ type: 'jsonb', default: {} })
  applicationCategoryBalance: {
    personal: number;
    communal: number;
    missional: number;
    doctrinal: number;
  };

  @Column({ type: 'float', nullable: true })
  avgChristCentrality: number;

  @Column({ type: 'float', nullable: true })
  avgApplicationDepth: number;

  @Column({ type: 'text', array: true, nullable: true })
  avoidedTexts: string[];

  @Column({ type: 'text', array: true, nullable: true })
  overusedIllustrations: string[];

  @Column({ type: 'jsonb', nullable: true })
  growthInsights: {
    strength: string;
    weakness: string;
    recommendation: string;
  }[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
