import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsOptional, IsEnum, IsObject } from 'class-validator';
import { WorkspaceStatus } from '../../../entities/sermon-workspace.entity';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
