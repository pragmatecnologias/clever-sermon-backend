import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

@Entity('historical_contexts_enhanced')
export class HistoricalContextEnhanced {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.historicalContexts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'text' })
  passage: string;

  @Column({ type: 'jsonb' })
  socialRealities: {
    aspect: string;
    description: string;
    impact: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  powerStructures: {
    structure: string;
    dynamics: string;
    relevance: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  economicContext: {
    factor: string;
    description: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  religiousClimate: {
    element: string;
    description: string;
    tension: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  audiencePressures: {
    pressure: string;
    source: string;
    pastoralResponse: string;
  }[];

  @Column({ type: 'text', nullable: true })
  synthesisStatement: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
