import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Education } from './entities/education.entity';
import { Recommendation } from './entities/recommendation.entity'; // Import the missing module

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Education, Recommendation])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
