import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDto } from './entities/user.dto';
import { ProfileModule } from '../profile/profile.module';
import { Profile } from '../profile/entities/profile.entity';
import { PublicationsModule } from '../publications/publications.module';
import { ConnectionsModule } from '../connections/connections.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    UserDto,
    ProfileModule,
    forwardRef(() => PublicationsModule),
    forwardRef(() => ConnectionsModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
