import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(private authService: AuthService) {
    super();
    this.logger = new Logger('LocalStrategy');
  }

  async validate(username: string, password: string) {
    this.logger.log(`Validating user with username: ${username}`);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
