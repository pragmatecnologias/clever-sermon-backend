import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

@Entity('blind_spot_analyses')
export class BlindSpotAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.blindSpotAnalyses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'text', array: true })
  themesNotAddressed: string[];

  @Column({ type: 'text', array: true })
  hardVersesAvoided: string[];

  @Column({ type: 'jsonb', nullable: true })
  doctrinalTensionsMinimized: {
    tension: string;
    howMinimized: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  applicationImbalance: {
    category: string;
    count: number;
    recommendation: string;
  }[];

  @Column({ type: 'text', nullable: true })
  overallAssessment: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
