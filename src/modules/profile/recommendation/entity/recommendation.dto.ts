// create-recommendation.dto.ts
import { IsUUID, IsString, IsDateString } from 'class-validator';

export class RecommendationDto {
  @IsUUID()
  profileId: string;

  @IsUUID()
  senderId: string;

  @IsString()
  message: string;

  @IsDateString()
  date: string;
}
