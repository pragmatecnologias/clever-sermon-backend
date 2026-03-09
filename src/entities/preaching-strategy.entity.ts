import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

export enum PreachingGenre {
  EXPOSITORY = 'expository',
  NARRATIVE = 'narrative',
  PROPHETIC = 'prophetic',
  APOLOGETIC = 'apologetic',
  REVIVALIST = 'revivalist',
  TEACHING = 'teaching',
  PASTORAL = 'pastoral',
  EVANGELISTIC = 'evangelistic',
}

export enum EmotionalArc {
  CONVICTION_TO_HOPE = 'conviction_to_hope',
  CRISIS_TO_RESOLUTION = 'crisis_to_resolution',
  QUESTION_TO_DISCOVERY = 'question_to_discovery',
  COMFORT_TO_CHALLENGE = 'comfort_to_challenge',
  LAMENT_TO_PRAISE = 'lament_to_praise',
}

@Entity('preaching_strategies')
export class PreachingStrategy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.preachingStrategies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'enum', enum: PreachingGenre })
  recommendedGenre: PreachingGenre;

  @Column({ type: 'text' })
  genreRationale: string;

  @Column({ type: 'enum', enum: EmotionalArc })
  emotionalArc: EmotionalArc;

  @Column({ type: 'varchar', length: 50 })
  tone: string;

  @Column({ type: 'integer' })
  targetLengthMinutes: number;

  @Column({ type: 'float' })
  tensionLevel: number;

  @Column({ type: 'float' })
  applicationDensity: number;

  @Column({ type: 'boolean', default: false })
  invitationDriven: boolean;

  @Column({ type: 'jsonb', nullable: true })
  structuralGuidance: {
    introduction: string;
    bodyStructure: string;
    conclusion: string;
  };

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
