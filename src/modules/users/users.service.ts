import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './entities/logIn.dto';
import { validateOrReject } from 'class-validator';
import { UserDTO } from './entities/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { user_id: id } as FindOptionsWhere<User>,
    });
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
  async register(user: UserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.userPassword, 10);
    const newUser = { ...user, user_password: hashedPassword };
    return this.usersRepository.save(newUser);
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
