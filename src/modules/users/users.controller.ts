import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User): Promise<void> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() user: User): Promise<void> {
    return this.usersService.patch(id, user);
  }
  @Post('login')
  login(@Body() user: User): Promise<User> {
    return this.usersService.login(user);
  }

  @Post('register')
  register(@Body() user: User): Promise<User> {
    return this.usersService.register(user);
  }
}

/*
Make me an example user json object

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 45 })
  user_name: string;

  @Column({ type: 'varchar', length: 45 })
  user_first_surname: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  user_second_surname: string;

  @Column({ type: 'varchar', length: 254 })
  user_email: string;

  @Column({ type: 'varchar', length: 60 })
  user_password: string;

  @Column({ type: 'enum', enum: ['admin', 'teacher', 'company', 'student'] })
  user_role: string;

  @Column({ type: 'uuid' })
  users_profiles_user_profile_id: string;
}

{
  "user_name": "John",
  "user_first_surname": "Doe",
  "user_second_surname": "Smith",
  "user_email": "admin@admin.com",
  "user_password": "password",
  "user_role": "admin",
  "users_profiles_user_profile_id": "1"
}


*/
