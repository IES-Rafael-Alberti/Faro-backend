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

  // Method to create a new experience record
  create(experience: Experience): Promise<Experience> {
    return this.experienceRepository.save(experience);
  }

  // Method to find all experience records by profile ID
  async findAllByProfileId(profileId: string): Promise<Experience[]> {
    return this.experienceRepository.find({
      where: { profile: { id: profileId } }, // Filtering by profile ID
      relations: ['profile'], // Eager loading 'profile' relation
    });
  }

  // Method to find a single experience record by its ID
  findOne(id: string): Promise<Experience | null> {
    return this.experienceRepository.findOneBy({ id });
  }

  // Method to update an experience record
  async update(id: string, experience: Partial<Experience>): Promise<void> {
    await this.experienceRepository.update(id, experience);
  }

  // Method to remove an experience record
  async remove(id: string): Promise<void> {
    await this.experienceRepository.delete(id);
  }
}
