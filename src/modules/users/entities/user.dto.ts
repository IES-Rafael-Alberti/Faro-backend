import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsUUID,
} from 'class-validator';

export class UserDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @Length(1, 45)
  name: string;

  @IsString()
  @Length(1, 45)
  first_surname: string;

  @IsString()
  @Length(1, 45)
  @IsOptional()
  second_surname: string;

  @IsEmail()
  @Length(1, 254)
  email: string;

  @IsString()
  @Length(8, 60)
  password: string;

  @IsEnum(['admin', 'teacher', 'company', 'student'])
  @IsOptional()
  user_role: string;

  @IsUUID()
  @IsOptional()
  profile_id: string;
}
