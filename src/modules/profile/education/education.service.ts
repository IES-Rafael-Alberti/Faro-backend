// education.service.ts
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

  create(education: Education): Promise<Education> {
    return this.educationRepository.save(education);
  }

  findAll(): Promise<Education[]> {
    return this.educationRepository.find();
  }

  findOne(id: string): Promise<Education | null> {
    return this.educationRepository.findOneBy({ id });
  }

  async update(id: string, education: Partial<Education>): Promise<void> {
    await this.educationRepository.update(id, education);
  }

  async remove(id: string): Promise<void> {
    await this.educationRepository.delete(id);
  }
}
