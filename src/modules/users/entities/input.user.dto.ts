import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsUUID,
} from 'class-validator';

export class InputUserDto {
  @IsUUID()
  @IsOptional()
  user_id: string;

  @IsString()
  @Length(1, 45)
  @IsOptional()
  name: string;

  @IsString()
  @Length(1, 45)
  @IsOptional()
  first_surname: string;

  @IsString()
  @Length(1, 45)
  @IsOptional()
  second_surname: string;

  @IsEmail()
  @Length(1, 254)
  @IsOptional()
  email: string;

  @IsString()
  @Length(8, 60)
  @IsOptional()
  password: string;

  @IsEnum(['admin', 'teacher', 'company', 'student'])
  @IsOptional()
  user_role: string;

  @IsUUID()
  @IsOptional()
  profile_id: string;
}
