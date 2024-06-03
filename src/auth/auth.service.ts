import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/modules/users/entities/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { hash } from 'bcrypt';
import { ProfileService } from 'src/modules/profile/profile.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private profileService: ProfileService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ id: string; access_token: string }> {
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
      id: user.user_id,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    userDto: UserDto,
  ): Promise<{ id: string; access_token: string }> {
    const id = uuidv4();
    const userDtoFill = {
      user_id: id,
      name: userDto.name,
      first_surname: userDto.first_surname,
      second_surname: userDto.second_surname,
      email: userDto.email,
      password: await hash(userDto.password, 10),
      // Set role to student, teacher, company or admin are set by the admin
      user_role: 'student',
      // User profile id is the same as user id, because it is a 1:1 relationship
      profile_id: id,
    };
    // Check if the user already exists
    const userExists = await this.usersService.findOneByEmail(
      userDtoFill.email,
    );
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    // Set generic Exeption, because the built-in exception can leak information
    try {
      await this.usersService.save(userDtoFill);
    } catch (error) {
      throw new HttpException(
        'Error saving user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const payload = { id: userDtoFill.user_id, email: userDtoFill.email };
    this.profileService.create({ id: id });
    return {
      id: id,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
