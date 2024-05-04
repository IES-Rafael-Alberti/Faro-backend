import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import * as bcrypt from 'bcrypt';

// TODO: Implement exceptions for user HttpException HttpStatus

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
  async register(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.user_password, 10);
    const newUser = { ...user, user_password: hashedPassword };
    return this.usersRepository.save(newUser);
  }
  // TODO: Implement the DTO to this fuction to validate the password
  async login(user: User): Promise<User> {
    const foundUser = await this.usersRepository.findOne({
      where: { user_email: user.user_email },
    });
    if (!foundUser) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      user.user_password,
      foundUser.user_password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return foundUser;
  }
}
