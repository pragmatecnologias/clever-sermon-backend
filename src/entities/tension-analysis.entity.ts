import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

@Entity('tension_analyses')
export class TensionAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.tensionAnalyses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'jsonb' })
  tensions: {
    type: 'paradox' | 'unresolved_phrase' | 'theological_friction';
    text: string;
    verseReference: string;
    explanation: string;
    preservationStrategy: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  sermonTensionHandling: {
    tension: string;
    isPreserved: boolean;
    resolutionTiming: 'too_early' | 'appropriate' | 'unresolved';
    recommendation: string;
  }[];

  @Column({ type: 'float' })
  tensionPreservationScore: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
