import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  NotFoundException,
  UseFilters,
  UseGuards,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './fileFilter';
import { MulterExceptionFilter } from './sizeException';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserImpersonationProtectionGuard } from 'src/auth/guards/UserImpersonationProtectionGuard.guard';

@Controller('profiles')
@UseFilters(MulterExceptionFilter)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * @name findAll
   * @description Fetches all profiles.
   * @returns {Promise<Profile[]>} A promise that resolves to an array of profiles.
   */
  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<Profile[]> {
    return await this.profileService.findAll();
  }

  /**
   * @name findById
   * @description Fetches a profile by its ID.
   * @param {string} id - The ID of the profile.
   * @returns {Promise<Profile>} A promise that resolves to the profile.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Profile> {
    return await this.profileService.findById(id);
  }

  /**
   * @name create
   * @description Creates a new profile.
   * @param {Partial<Profile>} profileData - The data for the new profile.
   * @returns {Promise<Profile>} A promise that resolves to the created profile.
   */
  @UseGuards(UserImpersonationProtectionGuard)
  @Post()
  async create(@Body() profileData: Partial<Profile>): Promise<Profile> {
    return await this.profileService.create(profileData);
  }

  /**
   * @name update
   * @description Updates a profile.
   * @param {string} id - The ID of the profile to update.
   * @param {Profile} profileData - The new data for the profile.
   * @returns {Promise<Profile | null>} A promise that resolves to the updated profile or null if the profile was not found.
   */
  @UseGuards(UserImpersonationProtectionGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() profileData: Profile,
  ): Promise<Profile | null> {
    return await this.profileService.updateProfile(id, profileData);
  }

  /**
   * @name delete
   * @description Deletes a profile.
   * @param {string} id - The ID of the profile to delete.
   * @returns {Promise<void>} A promise that resolves when the profile has been deleted.
   */
  @UseGuards(UserImpersonationProtectionGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.profileService.delete(id);
  }

  /**
   * @name getProfilePicture
   * @description Fetches the profile picture of a profile.
   * @param {string} id - The ID of the profile.
   * @returns {Promise<string>} A promise that resolves to the base64 encoded profile picture.
   */
  @UseGuards(UserImpersonationProtectionGuard)
  @Post('upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit
    }),
  )
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Profile> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const updatedProfile = await this.profileService.updateProfilePicture(
      id,
      file,
    );

    return updatedProfile;
  }

  @UseGuards(AuthGuard)
  @Get('picture/:id')
  async getProfilePicture(@Param('id') id: string): Promise<string> {
    const profile = await this.profileService.findById(id);

    if (!profile || !profile.users_profile_profile_picture) {
      throw new NotFoundException('Profile picture not found');
    }

    const base64 = profile.users_profile_profile_picture.toString('base64');

    return `data:image/jpeg;base64,${base64}`;
  }
}
