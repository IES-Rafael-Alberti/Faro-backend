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

  // Method to create a new recommendation
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

  // Method to find all recommendations for a given profile ID
  async findAllByProfileId(profileId: string): Promise<Recommendation[]> {
    return this.recommendationRepository.find({
      where: { profile: { id: profileId } }, // Filter by profile ID
      relations: ['profile'], // Eager load 'profile' relation
    });
  }

  // Method to find a single recommendation by its ID
  findOne(id: string): Promise<Recommendation | null> {
    return this.recommendationRepository.findOne({ where: { id: id } });
  }

  // Method to update a recommendation
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

  // Method to remove a recommendation
  async remove(id: string): Promise<void> {
    // Delete the recommendation from the database
    const deleteResult = await this.recommendationRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new Error(`Recommendation with ID "${id}" not found`);
    }
  }
}
