import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EGWService } from './egw.service';
import { EGWIntegrationService } from './egw-integration.service';
import { EGWPassageIntegrationService } from './egw-passage-integration.service';
import { EGWStudyReportIntegrationService } from './egw-study-report-integration.service';
import { EGWSermonBuilderIntegrationService } from './egw-sermon-builder-integration.service';
import { EGWController } from './egw.controller';
import { EGWBook } from '../../entities/egw-book.entity';
import { EGWParagraph } from '../../entities/egw-paragraph.entity';
import { EGWScriptureReference } from '../../entities/egw-scripture-reference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EGWBook, EGWParagraph, EGWScriptureReference])],
  providers: [
    EGWService,
    EGWIntegrationService,
    EGWPassageIntegrationService,
    EGWStudyReportIntegrationService,
    EGWSermonBuilderIntegrationService
  ],
  controllers: [EGWController],
  exports: [
    EGWService,
    EGWIntegrationService,
    EGWPassageIntegrationService,
    EGWStudyReportIntegrationService,
    EGWSermonBuilderIntegrationService
  ]
})
export class EGWModule {}
