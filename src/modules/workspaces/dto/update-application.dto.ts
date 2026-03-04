import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AudienceType } from '../../../entities/sermon-application.entity';

export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(AudienceType)
  audienceType?: AudienceType;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;
}
