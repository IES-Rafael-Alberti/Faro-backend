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

  /**
   * Creates a new education record.
   * @param {Education} education - The education record to create.
   * @returns {Promise<Education>} - The created education record.
   */
  create(education: Education): Promise<Education> {
    console.log('Creating education record:', education);
    return this.educationRepository.save(education);
  }

  /**
   * Finds all education records associated with a specific profile ID.
   * @param {string} profileId - The ID of the profile to find education records for.
   * @returns {Promise<Education[]>} - The education records found.
   */
  async findAllByProfileId(profileId: string): Promise<Education[]> {
    return this.educationRepository.find({
      where: { profile: { id: profileId } }, // Filtering by profile ID
      relations: ['profile'], // Eager loading 'profile' relation
    });
  }

  /**
   * Finds a single education record by its ID.
   * @param {string} id - The ID of the education record to find.
   * @returns {Promise<Education | null>} - The found education record or null if not found.
   */
  findOne(id: string): Promise<Education | null> {
    return this.educationRepository.findOneBy({ id }); // Assuming there's no 'findOneBy' method, you might mean 'findOne'
  }

  /**
   * Updates an education record.
   * @param {string} id - The ID of the education record to update.
   * @param {Partial<Education>} education - The updated education data.
   * @returns {Promise<void>}
   */
  async update(id: string, education: Partial<Education>): Promise<void> {
    await this.educationRepository.update(id, education);
  }

  /**
   * Removes an education record.
   * @param {string} id - The ID of the education record to remove.
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
    await this.educationRepository.delete(id);
  }
}
