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
import { UserDto } from './entities/user.dto';

// TODO: Assert tha the user is the only who can modify his own data

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOneById(id);
  }
  /*
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
  */
  /*
  @Post('login')
  login(@Body() user: User): Promise<User> {
    return this.usersService.login(user);
  }

  @Post('register')
  register(@Body() user: User): Promise<User> {
    return this.usersService.register(user);
  }
  */
}
