// experience.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { Experience } from './entity/experience.entity';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  create(@Body() experience: Experience): Promise<Experience> {
    const result = this.experienceService.create(experience);

    return result;
  }

  @Get()
  findAll(): Promise<Experience[]> {
    return this.experienceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Experience | null> {
    return this.experienceService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() experience: Partial<Experience>,
  ): Promise<void> {
    return this.experienceService.update(id, experience);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.experienceService.remove(id);
  }
}
