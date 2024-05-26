import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './entities/user.dto';
import { InputUserDto } from './entities/input.user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserImpersonationProtectionGuard } from 'src/auth/guards/UserImpersonationProtectionGuard.guard';
import { PublicationsService } from 'src/modules/publications/publications.service';
import { ConnectionsService } from 'src/modules/connections/connections.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly publicationsService: PublicationsService,
    private readonly connectionsService: ConnectionsService,
  ) {}

  // Make this route only for admins
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

  @Get('userBasicInfo/:id')
  async userBasicInfo(@Param('id') id: string): Promise<any> {
    const user = await this.usersService.findOneByIdUserDto(id);
    const profile = await this.usersService.findProfile(id);
    if (!user || !profile) {
      throw new NotFoundException('User not found');
    }
    let base64 = '';
    if (profile.users_profile_profile_picture) {
      base64 = profile.users_profile_profile_picture.toString('base64');
    }
    return {
      username: user.name,
      profile_picture: base64 ? `data:image/jpeg;base64,${base64}` : '',
      rol: user.user_role,
      count_of_publications:
        await this.publicationsService.countAllPublicationsFromUser(id),
      count_of_connections:
        await this.connectionsService.countConnectionsFromUser(id),
    };
  }
}
