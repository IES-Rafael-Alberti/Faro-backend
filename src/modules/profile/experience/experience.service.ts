// Importing necessary modules and entities
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entity/experience.entity';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  /**
   * Creates a new experience record.
   * @param {Experience} experience - The experience to create.
   * @returns {Promise<Experience>} - A promise that resolves to the created experience.
   */
  create(experience: Experience): Promise<Experience> {
    return this.experienceRepository.save(experience);
  }

  /**
   * Finds all experience records associated with a specific profile.
   * @param {string} profileId - The ID of the profile.
   * @returns {Promise<Experience[]>} - A promise that resolves to an array of experiences.
   */
  async findAllByProfileId(profileId: string): Promise<Experience[]> {
    return this.experienceRepository.find({
      where: { profile: { id: profileId } }, // Filtering by profile ID
      relations: ['profile'], // Eager loading 'profile' relation
    });
  }

  /**
   * Finds a single experience record by its ID.
   * @param {string} id - The ID of the experience.
   * @returns {Promise<Experience | null>} - A promise that resolves to the experience or null if not found.
   */
  findOne(id: string): Promise<Experience | null> {
    return this.experienceRepository.findOneBy({ id });
  }

  /**
   * Updates an experience record.
   * @param {string} id - The ID of the experience to update.
   * @param {Partial<Experience>} experience - The new experience data.
   * @returns {Promise<void>} - A promise that resolves when the update is complete.
   */
  async update(id: string, experience: Partial<Experience>): Promise<void> {
    await this.experienceRepository.update(id, experience);
  }

  /**
   * Removes an experience record.
   * @param {string} id - The ID of the experience to remove.
   * @returns {Promise<void>} - A promise that resolves when the removal is complete.
   */
  async remove(id: string): Promise<void> {
    await this.experienceRepository.delete(id);
  }
}
