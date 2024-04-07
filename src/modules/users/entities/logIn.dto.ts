import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  userEmail: string;

  @IsNotEmpty()
  userPassword: string;
}
