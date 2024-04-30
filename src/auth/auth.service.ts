import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordMatching = await compare(pass, user.user_password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    //const { passwor, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return 'Ta bien';
  }
}
