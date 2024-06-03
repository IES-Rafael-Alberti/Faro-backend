// education.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { Experience } from './entity/experience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience])],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
