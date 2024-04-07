import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  userFirstSurname: string;

  @IsString()
  @IsOptional()
  userSecondSurname: string | null;

  @IsEmail()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  userPassword: string;

  @IsNotEmpty()
  // This sets the default to be student
  userRole: 'admin' | 'teacher' | 'company' | 'student' = 'student';

  @IsString()
  @IsNotEmpty()
  usersProfilesUserProfileId: string;
}
