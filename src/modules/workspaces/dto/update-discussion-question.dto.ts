import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDiscussionQuestionDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
