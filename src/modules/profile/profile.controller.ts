// profile.controller.ts

import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async findAll(): Promise<Profile[]> {
    return await this.profileService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Profile> {
    return await this.profileService.findById(id);
  }

  @Post()
  async create(@Body() profileData: Partial<Profile>): Promise<Profile> {
    return await this.profileService.create(profileData);
  }
}
