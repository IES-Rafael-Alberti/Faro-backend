import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateLikeDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  publication_id: string;

  @IsDate()
  @IsOptional()
  created_at: Date;
}
