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

  /**
   * @name findAll
   * @description Fetches all profiles from the database.
   * @returns {Promise<Profile[]>} An array of all profiles.
   */
  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find();
  }

  /**
   * @name findById
   * @description Fetches a profile by its ID.
   * @param {string} id - The ID of the profile to fetch.
   * @returns {Promise<Profile>} The profile with the given ID.
   * @throws {NotFoundException} If no profile with the given ID is found.
   */
  async findById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  /**
   * @name create
   * @description Creates a new profile.
   * @param {Partial<Profile>} profileData - The data for the new profile.
   * @returns {Promise<Profile>} The newly created profile.
   */
  async create(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }

  /**
   * @name updateProfile
   * @description Updates a profile.
   * @param {string} id - The ID of the profile to update.
   * @param {any} updateData - The new data for the profile.
   * @returns {Promise<Profile | null>} The updated profile, or null if the profile could not be found.
   * @throws {NotFoundException} If no profile with the given ID is found.
   */
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

  /**
   * @name delete
   * @description Deletes a profile.
   * @param {string} id - The ID of the profile to delete.
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }

  /**
   * @name updateProfilePicture
   * @description Updates the profile picture of a profile.
   * @param {string} id - The ID of the profile to update.
   * @param {Express.Multer.File} file - The new profile picture.
   * @returns {Promise<Profile>} The updated profile.
   * @throws {NotFoundException} If no profile with the given ID is found.
   */
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
