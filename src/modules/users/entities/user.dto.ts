import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UserDTO {
  userId: string;

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  firstSurname: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
