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
  BadRequestException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from './fileFilter';
import { MulterExceptionFilter } from './sizeException';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserImpersonationProtectionGuard } from 'src/auth/guards/UserImpersonationProtectionGuard.guard';

@Controller('profiles')
@UseFilters(MulterExceptionFilter)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<Profile[]> {
    return await this.profileService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Profile> {
    return await this.profileService.findById(id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
  @Post()
  async create(@Body() profileData: Partial<Profile>): Promise<Profile> {
    return await this.profileService.create(profileData);
  }

  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() profileData: Partial<Profile>,
  ): Promise<Profile> {
    return await this.profileService.update(id, profileData);
  }

  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.profileService.delete(id);
  }

  @UseGuards(AuthGuard)
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