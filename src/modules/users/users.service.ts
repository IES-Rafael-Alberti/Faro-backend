import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './entities/logIn.dto';
import { validateOrReject } from 'class-validator';
import { UserDTO } from './entities/user.dto';

import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository
      .findOne({
        where: { user_id: id } as FindOptionsWhere<User>,
      })
      .then((user) => {
        return user;
      });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { user_email: email } as FindOptionsWhere<User>,
    });
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update(id: string, user: User): Promise<void> {
    await this.usersRepository.update(id, user);
  }

  async patch(id: string, user: User): Promise<void> {
    await this.usersRepository.update(id, user);
  }

  async create(userDto: UserDTO): Promise<UserDTO> {
    const { email, password, userName, firstSurname } = userDto;
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('The user already exists');
    }
    const user = new User();
    user.user_email = email;
    user.user_first_surname = firstSurname;
    user.user_name = userName;
    // Generate a new UUID for user's profile ID
    user.users_profiles_user_profile_id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    user.user_password = hashedPassword;

    return await this.usersRepository.save(user).then((user) => {
      const { user_id, user_email, user_first_surname, user_name } = user;
      const userDto: UserDTO = {
        userId: user_id,
        email: user_email,
        userName: user_name,
        password: user.user_password,
        firstSurname: user_first_surname,
      };
      return userDto;
    });
  }

  async login(loginData: LoginDTO): Promise<User> {
    // Validate login data
    await validateOrReject(loginData);

    const foundUser = await this.usersRepository.findOne({
      where: { user_email: loginData.userEmail },
    });

    if (!foundUser) {
      throw new Error('User not found');
    }
    // TODO: Check if this can be implemented in a better way
    const isPasswordValid = await bcrypt.compare(
      loginData.userPassword,
      foundUser.user_password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return foundUser;
  }
}
