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
  async updateProfile(id: string, updateData: any): Promise<Profile | null> {
    let updatedProfile: Profile | null = null;

    console.log(`Starting updateProfile for ID: ${id}`);
    console.log(`Update data: ${JSON.stringify(updateData)}`);

    try {
      await this.entityManager.transaction(async (entityManager) => {
        try {
          console.log('Transaction started');

          // Retrieve the Profile entity
          const profile = await entityManager.findOne(Profile, {
            where: { id },
            relations: ['educations', 'experience', 'recommendations'],
          });
          console.log(`Profile retrieved: ${JSON.stringify(profile)}`);

          if (!profile) {
            console.error(`Profile with ID ${id} not found`);
            throw new NotFoundException(`Profile with ID ${id} not found`);
          }

          // Update Education
          if (updateData.education) {
            console.log('Updating education');
            profile.educations.forEach((education, index) => {
              if (updateData.education[index]) {
                Object.assign(education, updateData.education[index]);
              }
            });
            console.log(
              `Updated education: ${JSON.stringify(profile.educations)}`,
            );
          }

          // Update Experience
          if (updateData.experience) {
            console.log('Updating experience');
            profile.experience.forEach((exp, index) => {
              if (updateData.experience[index]) {
                Object.assign(exp, updateData.experience[index]);
              }
            });
            console.log(
              `Updated experience: ${JSON.stringify(profile.experience)}`,
            );
          }

          // Update Recommendations
          if (updateData.recommendations) {
            console.log('Updating recommendations');
            profile.recommendations.forEach((rec, index) => {
              if (updateData.recommendations[index]) {
                Object.assign(rec, updateData.recommendations[index]);
              }
            });
            console.log(
              `Updated recommendations: ${JSON.stringify(
                profile.recommendations,
              )}`,
            );
          }

          // Save the updated profile
          updatedProfile = await entityManager.save(profile);
          console.log(`Profile saved: ${JSON.stringify(updatedProfile)}`);
        } catch (error) {
          console.error('Error during transaction', error);
          throw error;
        }
      });
    } catch (outerError) {
      console.error('Transaction failed', outerError);
      throw outerError;
    }

    console.log(`Returning updated profile: ${JSON.stringify(updatedProfile)}`);
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
