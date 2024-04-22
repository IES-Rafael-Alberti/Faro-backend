import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserDTO {
  userId: string;

  @IsString()
  userName: string;

  @IsString()
  firstSurname: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
