import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ScriptureModule } from './modules/scripture/scripture.module';
import { LlmModule } from './modules/llm/llm.module';
import { NotesModule } from './modules/notes/notes.module';
import { HighlightsModule } from './modules/highlights/highlights.module';
import { WordStudyModule } from './modules/word-study/word-study.module';
import { CrossReferencesModule } from './modules/cross-references/cross-references.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { TopicGraphModule } from './modules/topic-graph/topic-graph.module';
import { AiCompanionModule } from './modules/ai-companion/ai-companion.module';
import { SermonDnaModule } from './modules/sermon-dna/sermon-dna.module';
import { SearchModule } from './modules/search/search.module';
import { VisualizationModule } from './modules/visualization/visualization.module';
import { EGWModule } from './modules/egw/egw.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { ChurchSettingsModule } from './modules/church-settings/church-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseUrl = configService.get<string>('DATABASE_URL');
        const databaseName = configService.get<string>('DATABASE_NAME');
        const hasPath = baseUrl && new URL(baseUrl).pathname && new URL(baseUrl).pathname !== '/';
        const url = baseUrl && databaseName && !hasPath ? `${baseUrl.replace(/\/$/, '')}/${databaseName}` : baseUrl;

        // When using url, TypeORM parses credentials from it - don't duplicate
        const useUrl = configService.get('DATABASE_URL') ? true : false;

        return {
          type: 'postgres',
          url: useUrl ? url : undefined,
          host: useUrl ? undefined : (configService.get('DATABASE_HOST') || 'localhost'),
          port: useUrl ? undefined : parseInt(configService.get('DATABASE_PORT') || '5432', 10),
          username: useUrl ? undefined : (configService.get('DATABASE_USER') || 'admin'),
          password: useUrl ? undefined : configService.get('DATABASE_PASSWORD'),
          database: useUrl ? undefined : databaseName,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('TYPEORM_SYNC') === 'true',
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
        },
      }),
    }),
    AuthModule,
    WorkspacesModule,
    ScriptureModule,
    LlmModule,
    NotesModule,
    HighlightsModule,
    WordStudyModule,
    CrossReferencesModule,
    KnowledgeModule,
    TopicGraphModule,
    AiCompanionModule,
    SermonDnaModule,
    SearchModule,
    VisualizationModule,
    EGWModule,
    AnalysisModule,
    ChurchSettingsModule,
  ],
})
export class AppModule {}
