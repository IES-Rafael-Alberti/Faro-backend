import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { ProfileModule } from 'src/modules/profile/profile.module';

@Module({
  imports: [UsersModule, ProfileModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
