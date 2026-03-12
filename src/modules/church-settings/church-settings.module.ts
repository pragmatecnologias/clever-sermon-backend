import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChurchSettings } from '../../entities/church-settings.entity';
import { ChurchSettingsService } from './church-settings.service';
import { ChurchSettingsController } from './church-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChurchSettings])],
  providers: [ChurchSettingsService],
  controllers: [ChurchSettingsController],
  exports: [ChurchSettingsService],
})
export class ChurchSettingsModule {}

