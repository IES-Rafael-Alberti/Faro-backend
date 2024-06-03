// recommendation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from './entity/recommendation.entity';
import { Profile } from '../entities/profile.entity';
import { User } from '../../users/entities/user.entity';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { ProfileService } from '../profile.service';
import { UsersService } from '../../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Recommendation, Profile, User])],
  controllers: [RecommendationController],
  providers: [RecommendationService, ProfileService, UsersService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
