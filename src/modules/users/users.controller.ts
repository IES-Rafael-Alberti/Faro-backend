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
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserImpersonationProtectionGuard } from 'src/auth/guards/UserImpersonationProtectionGuard.guard';
import { PublicationsService } from 'src/modules/publications/publications.service';
import { ConnectionsService } from 'src/modules/connections/connections.service';
import { DEFAULT_IMG } from 'src/consts';

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
  @Patch('update/:id')
  updateById(
    @Param('id') id: string,
    @Body() userDto: UserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, userDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @UseGuards(AuthGuard)
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
      username: user.name + ' ' + user.first_surname,
      profile_picture: base64
        ? `data:image/jpeg;base64,${base64}`
        : DEFAULT_IMG,
      rol: user.user_role,
      count_of_publications:
        await this.publicationsService.countAllPublicationsFromUser(id),
      count_of_connections:
        await this.connectionsService.countAllConnectionsFromUser(id),
    };
  }
}
