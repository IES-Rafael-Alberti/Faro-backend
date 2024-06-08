import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';

import { Profile } from './entities/profile.entity';
import { Education } from './education/entity/education.entity';
import { Experience } from './experience/entity/experience.entity';
import { Recommendation } from './recommendation/entity/recommendation.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find();
  }

  async findById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async create(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }

  // TODO: Refactor this function
  async updateProfile(id: string, updateData: any): Promise<Profile | null> {
    let updatedProfile: Profile | null = null;

    try {
      await this.entityManager.transaction(async (entityManager) => {
        try {
          // Retrieve the Profile entity
          const profile = await entityManager.findOne(Profile, {
            where: { id },
            relations: ['educations', 'experience', 'recommendations'],
          });

          if (!profile) {
            throw new NotFoundException(`Profile with ID ${id} not found`);
          }

          // Update Education
          if (updateData.education) {
            profile.educations.forEach((education, index) => {
              if (updateData.education[index]) {
                Object.assign(education, updateData.education[index]);
              }
            });
          }

          // Update Experience
          if (updateData.experience) {
            profile.experience.forEach((exp, index) => {
              if (updateData.experience[index]) {
                Object.assign(exp, updateData.experience[index]);
              }
            });
          }

          // Update Recommendations
          if (updateData.recommendations) {
            profile.recommendations.forEach((rec, index) => {
              if (updateData.recommendations[index]) {
                Object.assign(rec, updateData.recommendations[index]);
              }
            });
          }

          // Save the updated profile
          updatedProfile = await entityManager.save(profile);
        } catch (error) {
          throw error;
        }
      });
    } catch (outerError) {
      throw outerError;
    }
    return updatedProfile;
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }

  async updateProfilePicture(
    id: string,
    file: Express.Multer.File,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    // Save the file buffer directly to the profilePicture field
    profile.users_profile_profile_picture = file.buffer;
    return await this.profileRepository.save(profile);
  }
}
