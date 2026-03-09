import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

@Entity('theological_center_analyses')
export class TheologicalCenterAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.theologicalCenterAnalyses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'text' })
  dominantCenter: string;

  @Column({ type: 'text' })
  textualWarrant: string;

  @Column({ type: 'float' })
  alignmentScore: number;

  @Column({ type: 'jsonb', nullable: true })
  deviations: {
    point: string;
    severity: 'minor' | 'moderate' | 'major';
    explanation: string;
  }[];

  @Column({ type: 'text', array: true, nullable: true })
  secondaryThemes: string[];

  @Column({ type: 'jsonb', nullable: true })
  suppressionSuggestions: {
    theme: string;
    reason: string;
    impact: string;
  }[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
