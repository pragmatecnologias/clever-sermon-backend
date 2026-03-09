import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { SermonOutline } from './sermon-outline.entity';
import { SermonManuscript } from './sermon-manuscript.entity';
import { SermonApplication } from './sermon-application.entity';
import { SermonIllustration } from './sermon-illustration.entity';
import { DiscussionQuestion } from './discussion-question.entity';
import { SermonCitation } from './sermon-citation.entity';
import { Note } from './note.entity';
import { AiConversation } from './ai-conversation.entity';
import { SermonDnaAnalysis } from './sermon-dna-analysis.entity';
import { SermonStudyReport } from './sermon-study-report.entity';
import { TheologicalCenterAnalysis } from './theological-center-analysis.entity';
import { TensionAnalysis } from './tension-analysis.entity';
import { DoctrinalPrecisionCheck } from './doctrinal-precision-check.entity';
import { BlindSpotAnalysis } from './blind-spot-analysis.entity';
import { PreachingStrategy } from './preaching-strategy.entity';
import { HistoricalContextEnhanced } from './historical-context-enhanced.entity';

export enum SermonStyle {
  EXPOSITORY = 'expository',
  TOPICAL = 'topical',
  NARRATIVE = 'narrative',
  APOLOGETIC = 'apologetic',
  DEVOTIONAL = 'devotional',
}

export enum StoryArc {
  PROBLEM_TRUTH_RESPONSE = 'problem_truth_response',
  TENSION_TURN_RESOLUTION = 'tension_turn_resolution',
  QUESTION_DISCOVERY_ANSWER = 'question_discovery_answer',
  CHALLENGE_JOURNEY_TRANSFORMATION = 'challenge_journey_transformation',
}

export enum WorkspaceStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity('sermon_workspaces')
export class SermonWorkspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, user => user.workspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  seriesTitle: string;

  @Column({ type: 'text' })
  mainPassage: string;

  @Column({ type: 'text', array: true, nullable: true })
  additionalPassages: string[];

  @Column({ type: 'text', nullable: true })
  theme: string;

  @Column({ type: 'text', nullable: true })
  audienceProfile: string;

  @Column({ type: 'text', nullable: true })
  sermonGoals: string;

  @Column({ type: 'text', nullable: true })
  theologicalLens: string;

  @Column({ type: 'enum', enum: SermonStyle, nullable: true })
  style: SermonStyle;

  @Column({ type: 'enum', enum: StoryArc, nullable: true })
  storyArc: StoryArc;

  @Column({ type: 'enum', enum: WorkspaceStatus, default: WorkspaceStatus.DRAFT })
  status: WorkspaceStatus;

  @Column({ type: 'text', default: 'en' })
  language: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  scriptureCache: {
    scriptureResult?: any;
    scriptureLastLookup?: string;
    scriptureQuery?: string;
    scriptureTranslation?: string;
    scriptureContextRange?: number;
    parallelTranslations?: string;
    parallelResults?: any[];
    contextData?: any;
    structuralAnalysis?: any;
    interpretiveChallenges?: any;
    perVerseContext?: any;
    passageSummary?: any;
    studySynthesis?: any;
    canonicalThemes?: any;
    verseCommentary?: any;
    translationComparison?: any;
    wordStudy?: {
      word?: string;
      language?: string;
      result?: any;
      insights?: any;
      cachedAt?: string;
    };
    crossReferences?: {
      verse?: string;
      ranked?: any[];
      cachedAt?: string;
    };
    lookupHistory?: any[];
    cachedAt?: Date;
  };

  @Column({ type: 'jsonb', nullable: true, default: [] })
  references: Array<{
    reference: string;
    context?: string;
    addedAt?: string;
  }>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => SermonOutline, outline => outline.workspace)
  outlines: SermonOutline[];

  @OneToMany(() => SermonManuscript, manuscript => manuscript.workspace)
  manuscripts: SermonManuscript[];

  @OneToMany(() => SermonApplication, application => application.workspace)
  applications: SermonApplication[];

  @OneToMany(() => SermonIllustration, illustration => illustration.workspace)
  illustrations: SermonIllustration[];

  @OneToMany(() => DiscussionQuestion, question => question.workspace)
  discussionQuestions: DiscussionQuestion[];

  @OneToMany(() => SermonCitation, citation => citation.workspace)
  citations: SermonCitation[];

  @OneToMany(() => Note, note => note.workspace)
  notes: Note[];

  @OneToMany(() => AiConversation, conversation => conversation.workspace)
  aiConversations: AiConversation[];

  @OneToMany(() => SermonDnaAnalysis, analysis => analysis.workspace)
  dnaAnalyses: SermonDnaAnalysis[];

  @OneToMany(() => SermonStudyReport, report => report.workspace)
  studyReports: SermonStudyReport[];

  @OneToMany(() => TheologicalCenterAnalysis, analysis => analysis.workspace)
  theologicalCenterAnalyses: TheologicalCenterAnalysis[];

  @OneToMany(() => TensionAnalysis, analysis => analysis.workspace)
  tensionAnalyses: TensionAnalysis[];

  @OneToMany(() => DoctrinalPrecisionCheck, check => check.workspace)
  doctrinalChecks: DoctrinalPrecisionCheck[];

  @OneToMany(() => BlindSpotAnalysis, analysis => analysis.workspace)
  blindSpotAnalyses: BlindSpotAnalysis[];

  @OneToMany(() => PreachingStrategy, strategy => strategy.workspace)
  preachingStrategies: PreachingStrategy[];

  @OneToMany(() => HistoricalContextEnhanced, context => context.workspace)
  historicalContexts: HistoricalContextEnhanced[];
}
