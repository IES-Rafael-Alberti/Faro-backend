// profile.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}
  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find();
  }
  async findById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  async create(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }
}
