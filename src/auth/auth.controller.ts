import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './validations/signIn.validator';
import { UserDto } from 'src/modules/users/entities/user.dto';
import { UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  // Add a new endpoint profile with a guard to protect it
  @UseGuards(AuthGuard)
  @Get('profile')
  profile() {
    return 'Ta bien';
  }

  @Post('register')
  register(@Body() user: UserDto): Promise<{ access_token: string }> {
    return this.authService.register(user);
  }
}
