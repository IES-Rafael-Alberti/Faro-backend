import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './validations/signIn.validator';
import { UserDto } from 'src/modules/users/entities/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @name signIn
   * @description Handles the sign in process for a user.
   * @param {SignInDto} signInDto - Data Transfer Object containing the user's email and password.
   * @returns {Promise<{ access_token: string }>} - A promise that resolves to an object containing the access token.
   */
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  /**
   * @name register
   * @description Handles the registration process for a new user.
   * @param {UserDto} user - Data Transfer Object containing the user's details.
   * @returns {Promise<{ access_token: string }>} - A promise that resolves to an object containing the access token.
   */
  @Post('register')
  register(@Body() user: UserDto): Promise<{ access_token: string }> {
    return this.authService.register(user);
  }
}
