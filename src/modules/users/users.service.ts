import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { UserDto } from './entities/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => {
      const userDto = {
        user_id: user.user_id,
        name: user.user_name,
        first_surname: user.user_first_surname,
        second_surname: user.user_second_surname,
        email: '',
        password: '',
        user_role: user.user_role,
        profile_id: user.users_profiles_user_profile_id,
      };
      return userDto;
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { user_id: id } as FindOptionsWhere<User>,
    });
  }

  async findOneByIdUserDto(id: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne({
      where: { user_id: id } as FindOptionsWhere<User>,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      user_id: user.user_id,
      name: user.user_name,
      first_surname: user.user_first_surname,
      second_surname: user.user_second_surname,
      email: '',
      password: '',
      user_role: user.user_role,
      profile_id: user.users_profiles_user_profile_id,
    };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { user_email: email } as FindOptionsWhere<User>,
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.remove(user);
  }

  async save(userDto: UserDto): Promise<User> {
    const user = {
      user_id: userDto.user_id,
      user_name: userDto.name,
      user_first_surname: userDto.first_surname,
      user_second_surname: userDto.second_surname,
      user_email: userDto.email,
      user_password: userDto.password,
      user_role: userDto.user_role,
      users_profiles_user_profile_id: userDto.user_id,
    };
    return this.usersRepository.save(user);
  }

  async create(userDto: UserDto): Promise<UserDto> {
    const id = uuidv4();
    const user = await this.save(userDto);
    return {
      user_id: id,
      name: user.user_name,
      first_surname: user.user_first_surname,
      second_surname: user.user_second_surname,
      email: user.user_email,
      password: user.user_password,
      user_role: user.user_role,
      profile_id: id,
    };
  }
  // TODO: refactor this fucking function
  async update(id: string, userDto: UserDto): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Assign properties from userDto to user
    Object.assign(user, userDto);

    const updatedUser = await this.usersRepository.save(user);

    return {
      user_id: updatedUser.user_id,
      name: updatedUser.user_name,
      first_surname: updatedUser.user_first_surname,
      second_surname: updatedUser.user_second_surname,
      email: updatedUser.user_email,
      password: updatedUser.user_password,
      user_role: updatedUser.user_role,
      profile_id: updatedUser.users_profiles_user_profile_id,
    };
  }

  async findProfile(id: string): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { id: id } as FindOptionsWhere<Profile>,
    });
  }
}
