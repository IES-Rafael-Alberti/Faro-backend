import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { Education } from './entities/education.entity';
import { Recommendation } from './entities/recommendation.entity';
import { ProfileDTO } from './entities/profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async findAll(@Query() query: any): Promise<Profile[]> {
    // Check if there are any query parameters for filtering
    if (Object.keys(query).length > 0) {
      return this.profileService.findAllWithFilters(query);
    }
    // If no query parameters provided, return all profiles
    return this.profileService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Profile | null> {
    return this.profileService.findOne(id);
  }

  @Post('')
  async create(@Body() profileData: ProfileDTO): Promise<Profile> {
    return this.profileService.create(profileData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() profileData: Profile,
  ): Promise<Profile | null> {
    return this.profileService.update(id, profileData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.profileService.remove(id);
  }

  // Filter education by institution
  @Get(':id/education')
  async findEducationByInstitution(
    @Param('id') id: string,
    @Query('institution') institution: string,
  ): Promise<Education[]> {
    return this.profileService.findEducationByInstitution(id, institution);
  }

  // Filter recommendation by sender
  @Get(':id/recommendation')
  async findRecommendationBySender(
    @Param('id') id: string,
    @Query('senderId') senderId: string,
  ): Promise<Recommendation[]> {
    return this.profileService.findRecommendationBySender(id, senderId);
  }
}
