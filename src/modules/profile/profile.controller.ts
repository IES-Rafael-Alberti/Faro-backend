import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() profileData: Partial<Profile>,
  ): Promise<Profile> {
    return await this.profileService.update(id, profileData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.profileService.delete(id);
  }
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profile = await this.profileService.findById(id);

    if (!profile) {
      throw new NotFoundException('Entity not found');
    }

    profile.users_profile_profile_picture = file;

    await this.profileService.update(id, profile);

    return profile.users_profile_profile_picture.filename;
  }
}
