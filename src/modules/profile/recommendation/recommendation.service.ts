// Importing necessary modules and entities
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from './entity/recommendation.entity';
import { RecommendationDto } from './entity/recommendation.dto';
import { Profile } from '../entities/profile.entity';
@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  /**
   * Creates a new recommendation.
   * @param {RecommendationDto} recommendationDto - The recommendation data transfer object.
   * @returns {Promise<Recommendation>} - The created recommendation.
   * @throws {Error} - If the profile associated with the given profileId is not found.
   */
  async create(recommendationDto: RecommendationDto): Promise<Recommendation> {
    const { profileId, senderId, message, date } = recommendationDto;

    // Find the profile associated with the given profileId
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
    });
    if (!profile) {
      throw new Error(`Profile with ID "${profileId}" not found`);
    }

    // Create a new recommendation entity
    const recommendation = this.recommendationRepository.create({
      profile,
      senderId,
      message,
      date,
    });

    // Save the recommendation to the database
    return this.recommendationRepository.save(recommendation);
  }

  /**
   * Finds all recommendations for a given profile ID.
   * @param {string} profileId - The ID of the profile.
   * @returns {Promise<Recommendation[]>} - The list of recommendations for the given profile ID.
   */
  async findAllByProfileId(profileId: string): Promise<Recommendation[]> {
    return this.recommendationRepository.find({
      where: { profile: { id: profileId } }, // Filter by profile ID
      relations: ['profile'], // Eager load 'profile' relation
    });
  }

  /**
   * Finds a single recommendation by its ID.
   * @param {string} id - The ID of the recommendation.
   * @returns {Promise<Recommendation | null>} - The recommendation or null if not found.
   */
  findOne(id: string): Promise<Recommendation | null> {
    return this.recommendationRepository.findOne({ where: { id: id } });
  }

  /**
   * Updates a recommendation.
   * @param {string} id - The ID of the recommendation.
   * @param {Partial<Recommendation>} recommendation - The partial recommendation data.
   * @returns {Promise<void>}
   * @throws {Error} - If the recommendation with the given ID is not found.
   */
  async update(
    id: string,
    recommendation: Partial<Recommendation>,
  ): Promise<void> {
    // Update the recommendation in the database
    const updateResult = await this.recommendationRepository.update(
      id,
      recommendation,
    );
    if (updateResult.affected === 0) {
      throw new Error(`Recommendation with ID "${id}" not found`);
    }
  }

  /**
   * Removes a recommendation.
   * @param {string} id - The ID of the recommendation.
   * @returns {Promise<void>}
   * @throws {Error} - If the recommendation with the given ID is not found.
   */
  async remove(id: string): Promise<void> {
    // Delete the recommendation from the database
    const deleteResult = await this.recommendationRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new Error(`Recommendation with ID "${id}" not found`);
    }
  }
}
