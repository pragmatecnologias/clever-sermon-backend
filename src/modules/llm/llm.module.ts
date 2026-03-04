import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LlmService } from './llm.service';
import { LlmRequest } from '../../entities/llm-request.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([LlmRequest]),
  ],
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}
