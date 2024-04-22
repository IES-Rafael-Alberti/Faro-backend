import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDTO } from 'src/modules/users/entities/user.dto';
import { UsersService } from 'src/modules/users/users.service';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger;
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
    this.logger = new Logger('AuthController');
  }

  @Post('login')
  async login(@Body() user: UserDTO) {
    this.logger.log(`Logging in user: ${user}`);
    return await this.authService.login(user);
  }

  @Post('register')
  async register(@Body() userDTO: UserDTO) {
    return await this.userService.create(userDTO);
  }
}
