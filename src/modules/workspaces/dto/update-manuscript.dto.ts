import { IsOptional } from 'class-validator';

export class UpdateManuscriptDto {
  @IsOptional()
  content?: Record<string, any> | string;

  @IsOptional()
  transitions?: Record<string, any>;
}
