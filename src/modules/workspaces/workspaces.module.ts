import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { ContentValidatorService } from './content-validator.service';
import { SermonIntegrityService } from './sermon-integrity.service';
import { ManuscriptRepairProcessor } from './manuscript-repair.processor';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { SermonOutline } from '../../entities/sermon-outline.entity';
import { SermonManuscript } from '../../entities/sermon-manuscript.entity';
import { SermonApplication } from '../../entities/sermon-application.entity';
import { SermonIllustration } from '../../entities/sermon-illustration.entity';
import { DiscussionQuestion } from '../../entities/discussion-question.entity';
import { SermonCitation } from '../../entities/sermon-citation.entity';
import { SermonStudyReport } from '../../entities/sermon-study-report.entity';
import { LlmModule } from '../llm/llm.module';
import { ScriptureModule } from '../scripture/scripture.module';
import { EGWModule } from '../egw/egw.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SermonWorkspace,
      SermonOutline,
      SermonManuscript,
      SermonApplication,
      SermonIllustration,
      DiscussionQuestion,
      SermonCitation,
      SermonStudyReport,
    ]),
    BullModule.registerQueue({
      name: 'manuscript-repair',
    }),
    LlmModule,
    ScriptureModule,
    EGWModule,
  ],
  providers: [WorkspacesService, ContentValidatorService, SermonIntegrityService, ManuscriptRepairProcessor],
  controllers: [WorkspacesController],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
