import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { UserDto } from './entities/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';

// TODO: Implement exceptions for user HttpException HttpStatus
// TODO: Implement token

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => {
      const userDto = {
        user_id: user.user_id,
        name: user.user_name,
        first_surname: user.user_first_surname,
        second_surname: user.user_second_surname,
        email: user.user_email,
        password: user.user_password,
        user_role: user.user_role,
        users_profiles_user_profile_id: user.users_profiles_user_profile_id,
      };
      return userDto;
    });
  }

  findOneById(id: string): Promise<User | null> {
    // TODO: Implement exceptions for user HttpException HttpStatus
    return this.usersRepository.findOne({
      where: { user_id: id } as FindOptionsWhere<User>,
    });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { user_email: email } as FindOptionsWhere<User>,
    });
  }

  async register(userDto: UserDto): Promise<{ access_token: string }> {
    const id = uuidv4();
    const user = {
      user_id: id,
      user_name: userDto.name,
      user_first_surname: userDto.first_surname,
      user_second_surname: userDto.second_surname,
      user_email: userDto.email,
      user_password: await hash(userDto.password, 10),
      user_role: userDto.user_role,
      // User profile id is the same as user id, because it is a 1:1 relationship
      users_profiles_user_profile_id: id,
    };
    // Check if the user already exists
    const userExists = await this.findOneByEmail(user.user_email);
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    // Set role to student, teacher, company or admin are set by the admin
    user.user_role = 'student';
    // Set generic Exeption, because the built-in exception can leak information
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      throw new HttpException(
        'Error saving user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const payload = { id: user.user_id, email: user.user_email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
  /*
  async update(id: string, userDto: UserDto): Promise<void> {
    this.usersRepository.create(userDto);
    await this.usersRepository.update(id, userDto);
  }
  */
  /*
  async patch(id: string, userDto: UserDto): Promise<void> {
    const user = this.usersRepository.create(userDto);
    await this.usersRepository.update(id, user);
  }
  */
}
