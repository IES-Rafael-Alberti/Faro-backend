// experience.service.ts
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

  create(experience: Experience): Promise<Experience> {
    return this.experienceRepository.save(experience);
  }

  async findAllByProfileId(profileId: string): Promise<Experience[]> {
    return this.experienceRepository.find({
      where: { profile: { id: profileId } },
      relations: ['profile'],
    });
  }

  findOne(id: string): Promise<Experience | null> {
    return this.experienceRepository.findOneBy({ id });
  }

  async update(id: string, experience: Partial<Experience>): Promise<void> {
    await this.experienceRepository.update(id, experience);
  }

  async remove(id: string): Promise<void> {
    await this.experienceRepository.delete(id);
  }
}
