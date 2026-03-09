import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cross_reference_narratives')
export class CrossReferenceNarrative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  sourceVerse: string;

  @Column({ type: 'text' })
  narrativeTitle: string;

  @Column({ type: 'text' })
  narrativeDescription: string;

  @Column({ type: 'jsonb' })
  chain: {
    reference: string;
    era: string;
    contribution: string;
    order: number;
  }[];

  @Column({ type: 'text' })
  thematicThread: string;

  @Column({ type: 'text', nullable: true })
  redemptiveMovement: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
