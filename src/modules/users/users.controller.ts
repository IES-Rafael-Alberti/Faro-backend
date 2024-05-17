import { Controller, Get, Body, Param, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './entities/user.dto';
import { InputUserDto } from './entities/input.user.dto';
// TODO: Assert tha the user is the only who can modify his own data

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto | null> {
    return this.usersService.findOneByIdUserDto(id);
  }

  @Patch('update')
  updateById(@Body() userDto: InputUserDto): Promise<UserDto> {
    return this.usersService.path(userDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
