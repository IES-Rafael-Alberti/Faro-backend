import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { Education } from './entities/education.entity';
import { Recommendation } from './entities/recommendation.entity';
import { ProfileDTO } from './entities/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Recommendation)
    private readonly recommendationRepository: Repository<Recommendation>,
  ) {}

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find();
  }

  async findOne(id: string): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { id: id } as FindOptionsWhere<Profile>,
    });
  }

  async update(id: string, profileData: Profile): Promise<Profile | null> {
    await this.profileRepository.update(id, profileData);
    return this.findOne(id);
  }
  async create(profileDto: ProfileDTO): Promise<Profile> {
    const profile = new Profile();
    profile.id = profileDto.id;
    profile.headline = profileDto.headline;
    profile.description = profileDto.description;
    profile.ocupation_status = profileDto.ocupation_status;
    profile.educations = profileDto.educations;
    profile.recommendation = profileDto.recommendation;
    this.profileRepository.save(profile);
    return profile;
  }

  async remove(id: string): Promise<void> {
    await this.profileRepository.delete(id);
  }

  async findAllWithFilters(filters: any): Promise<Profile[]> {
    // Implement filtering logic based on provided filters
    // Example: Filtering by occupation status
    if (filters.ocupation_status) {
      return this.profileRepository.find({
        where: { ocupation_status: filters.ocupation_status },
      });
    }
    // Add more filtering logic as needed for other properties
    return this.profileRepository.find();
  }

  async findEducationByInstitution(
    profileId: string,
    institution: string,
  ): Promise<Education[]> {
    return this.educationRepository.find({
      where: { profile: { id: profileId }, institution },
    });
  }
  // TODO: Test this function
  async findRecommendationBySender(
    profileId: string,
    senderId: string,
  ): Promise<Recommendation[]> {
    return this.recommendationRepository
      .createQueryBuilder('recommendation')
      .innerJoin('recommendation.profile', 'profile')
      .innerJoin('recommendation.sender', 'sender')
      .where('profile.id = :profileId', { profileId })
      .andWhere('sender.id = :senderId', { senderId })
      .getMany();
  }
}
