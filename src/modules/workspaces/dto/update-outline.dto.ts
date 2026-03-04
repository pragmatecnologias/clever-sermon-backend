import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateOutlineDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  structure?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;
}
