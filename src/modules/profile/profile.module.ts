import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Recommendation } from './recommendation/entity/recommendation.entity';
import { Education } from './education/entity/education.entity';
import { Experience } from './experience/entity/experience.entity';
import { RecommendationService } from './recommendation/recommendation.service';
import { ExperienceService } from './experience/experience.service';
import { EducationService } from './education/education.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Recommendation, Education, Experience]),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    RecommendationService,
    ExperienceService,
    EducationService,
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
