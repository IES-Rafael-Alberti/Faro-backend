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

  // Method to fetch all profiles
  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find();
  }

  // Method to find a profile by ID
  async findById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  // Method to create a new profile
  async create(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }

  // Method to update a profile
  async updateProfile(id: string, updateData: any): Promise<Profile | null> {
    let updatedProfile: Profile | null = null;

    try {
      await this.entityManager.transaction(async (entityManager) => {
        // Retrieve the Profile entity with related entities
        const profile = await entityManager.findOne(Profile, {
          where: { id },
          relations: ['educations', 'experience', 'recommendations'],
        });

        if (!profile) {
          throw new NotFoundException(`Profile with ID ${id} not found`);
        }

        // Update Education
        if (updateData.education) {
          // Clear existing educations and add updated ones
          await entityManager.remove(profile.educations);
          profile.educations = updateData.education.map((edu: any) => {
            return entityManager.create(Education, edu);
          });
        }

        // Update Experience
        if (updateData.experience) {
          // Clear existing experience and add updated ones
          await entityManager.remove(profile.experience);
          profile.experience = updateData.experience.map((exp: any) => {
            return entityManager.create(Experience, exp);
          });
        }

        // Update Recommendations
        if (updateData.recommendations) {
          // Clear existing recommendations and add updated ones
          await entityManager.remove(profile.recommendations);
          profile.recommendations = updateData.recommendations.map(
            (rec: any) => {
              return entityManager.create(Recommendation, rec);
            },
          );
        }

        // Update other profile fields
        Object.assign(profile, updateData);

        // Save the updated profile
        updatedProfile = await entityManager.save(profile);
      });
    } catch (error) {
      console.error(`Error updating profile with ID ${id}:`, error);
      throw error;
    }
    return updatedProfile;
  }

  // Method to delete a profile
  async delete(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }

  // Method to update profile picture
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
