import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { LocalStrategy } from './strategy/local-strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Module({
  providers: [AuthService, UsersService, LocalStrategy],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      // Expiration time set to 1 hour may be susceptible to change in the future
      signOptions: { expiresIn: '3600s' },
    }),
  ],
})
export class AuthModule {}
