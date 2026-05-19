import { Allow, IsOptional } from 'class-validator';

export class UpdateScriptureCacheDto {
  @IsOptional()
  @Allow()
  payload?: any;
}
