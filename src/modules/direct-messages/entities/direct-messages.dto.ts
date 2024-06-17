import { IsString, IsNotEmpty, MaxLength, IsUUID, IsDate } from 'class-validator';

export class CreateDirectMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  msg: string;

  @IsString()
  @IsNotEmpty()
  sender_id: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  receiver_id: string;

  @IsDate()
  date: Date;
}
