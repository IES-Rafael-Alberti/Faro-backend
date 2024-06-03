// recommendation.service.ts
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

  async create(recommendationDto: RecommendationDto): Promise<Recommendation> {
    const { profileId, senderId, message, date } = recommendationDto;

    const profile = await this.profileRepository.findOneBy({ id: profileId });
    if (!profile) {
      throw new Error(`Profile with ID "${profileId}" not found`);
    }

    const recommendation = this.recommendationRepository.create({
      profile,
      senderId,
      message,
      date,
    });

    return this.recommendationRepository.save(recommendation);
  }

  findAll(): Promise<Recommendation[]> {
    return this.recommendationRepository.find();
  }

  findOne(id: string): Promise<Recommendation | null> {
    return this.recommendationRepository.findOneBy({ id });
  }

  async update(
    id: string,
    recommendation: Partial<Recommendation>,
  ): Promise<void> {
    const updateResult = await this.recommendationRepository.update(
      id,
      recommendation,
    );
    if (updateResult.affected === 0) {
      throw new Error(`Recommendation with ID "${id}" not found`);
    }
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.recommendationRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new Error(`Recommendation with ID "${id}" not found`);
    }
  }
}
