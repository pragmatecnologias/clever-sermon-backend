import { IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateTopicEdgeDto {
  @IsUUID()
  sourceNodeId: string;

  @IsUUID()
  targetNodeId: string;

  @IsString()
  relationshipType: string;

  @IsInt()
  @Min(1)
  @Max(10)
  strength: number;
}
