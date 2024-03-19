import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreatePublicationDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  @IsOptional()
  created_at: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
