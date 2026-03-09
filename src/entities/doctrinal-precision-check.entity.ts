import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SermonWorkspace } from './sermon-workspace.entity';

export enum DoctrinalCategory {
  GRACE = 'grace',
  SANCTIFICATION = 'sanctification',
  SABBATH = 'sabbath',
  STATE_OF_DEAD = 'state_of_dead',
  SANCTUARY = 'sanctuary',
  SECOND_COMING = 'second_coming',
  COVENANT = 'covenant',
  LAW_AND_GOSPEL = 'law_and_gospel',
}

@Entity('doctrinal_precision_checks')
export class DoctrinalPrecisionCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @ManyToOne(() => SermonWorkspace, workspace => workspace.doctrinalChecks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: SermonWorkspace;

  @Column({ type: 'jsonb' })
  checks: {
    category: DoctrinalCategory;
    isConsistent: boolean;
    concern: string | null;
    recommendation: string | null;
    severity: 'info' | 'warning' | 'critical';
  }[];

  @Column({ type: 'float' })
  overallConsistencyScore: number;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
