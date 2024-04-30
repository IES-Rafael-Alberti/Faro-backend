import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordMatching = await compare(pass, user.user_password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.user_id, email: user.user_email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
