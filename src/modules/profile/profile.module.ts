import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { Recommendation } from './entities/recommendation.entity';
import { Experience } from './entities/experience.entity';
import { Education } from './entities/education.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Recommendation, Experience, Education]),
    UsersModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
