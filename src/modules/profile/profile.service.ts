import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { Express } from 'express';

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
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async create(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }

  async update(id: string, profileData: Partial<Profile>): Promise<Profile> {
    await this.profileRepository.update(id, profileData);
    const updatedProfile = await this.profileRepository.findOne({
      where: { id },
    });
    if (!updatedProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return updatedProfile;
  }

  async delete(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }

  async updateProfilePicture(
    id: string,
    file: Express.Multer.File,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    // Save the file buffer directly to the profilePicture field
    profile.users_profile_profile_picture = file.buffer;
    return await this.profileRepository.save(profile);
  }
}
