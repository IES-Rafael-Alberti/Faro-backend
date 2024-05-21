import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './entities/user.dto';
import { InputUserDto } from './entities/input.user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserImpersonationProtectionGuard } from 'src/auth/guards/UserImpersonationProtectionGuard.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Make this only for admins
  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto | null> {
    return this.usersService.findOneByIdUserDto(id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
  @Patch('update')
  updateById(@Body() userDto: InputUserDto): Promise<UserDto> {
    return this.usersService.path(userDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
