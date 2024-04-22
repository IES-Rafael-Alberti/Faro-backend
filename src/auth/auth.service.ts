import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { UserDTO } from 'src/modules/users/entities/user.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.logger = new Logger('AuthService');
  }

  async validateUser(email: string, pass: string) {
    this.logger.log(`Validating user with email: ${email}`);
    const user = await this.usersService.findOneByEmail(email);
    this.logger.log(`Found user: ${JSON.stringify(user)}`);
    if (user && (await bcrypt.compare(pass, user.user_password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserDTO) {
    const payload = { email: user.email, sub: user.userId };
    this.logger.log(`Logging in user: ${JSON.stringify(user)}`);
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
