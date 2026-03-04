import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SermonWorkspace } from '../../entities/sermon-workspace.entity';
import { Note } from '../../entities/note.entity';
import { KnowledgeContent } from '../../entities/knowledge-content.entity';
import { SermonOutline } from '../../entities/sermon-outline.entity';
import { SermonManuscript } from '../../entities/sermon-manuscript.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SermonWorkspace,
      Note,
      KnowledgeContent,
      SermonOutline,
      SermonManuscript,
    ]),
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
