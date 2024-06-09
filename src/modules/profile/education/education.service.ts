// Importing necessary modules and entities
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entity/education.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
  ) {}

  // Method to create a new education record
  create(education: Education): Promise<Education> {
    return this.educationRepository.save(education);
  }

  // Method to find all education records by profile ID
  async findAllByProfileId(profileId: string): Promise<Education[]> {
    return this.educationRepository.find({
      where: { profile: { id: profileId } }, // Filtering by profile ID
      relations: ['profile'], // Eager loading 'profile' relation
    });
  }

  // Method to find a single education record by its ID
  findOne(id: string): Promise<Education | null> {
    return this.educationRepository.findOneBy({ id }); // Assuming there's no 'findOneBy' method, you might mean 'findOne'
  }

  // Method to update an education record
  async update(id: string, education: Partial<Education>): Promise<void> {
    await this.educationRepository.update(id, education);
  }

  // Method to remove an education record
  async remove(id: string): Promise<void> {
    await this.educationRepository.delete(id);
  }
}
