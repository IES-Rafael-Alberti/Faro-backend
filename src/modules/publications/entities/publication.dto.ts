import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';

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

  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(['admin', 'teacher', 'company', 'student'])
  @IsOptional()
  user_role: string;
}
