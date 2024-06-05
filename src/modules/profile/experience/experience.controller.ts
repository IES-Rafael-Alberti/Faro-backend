// experience.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { Experience } from './entity/experience.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() experience: Experience): Promise<Experience> {
    const result = this.experienceService.create(experience);

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  findAll(@Param(':id') id: string): Promise<Experience[]> {
    return this.experienceService
      .findAllByProfileId(id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Experience | null> {
    return this.experienceService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() experience: Partial<Experience>,
  ): Promise<void> {
    return this.experienceService.update(id, experience);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.experienceService.remove(id);
  }
}
