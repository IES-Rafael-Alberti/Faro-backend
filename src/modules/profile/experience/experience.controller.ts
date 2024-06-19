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

  /**
   * @name create
   * @description This method creates a new Experience entity.
   * @param {Experience} experience - The Experience entity to be created.
   * @returns {Promise<Experience>} - The created Experience entity.
   */
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() experience: Experience): Promise<Experience> {
    const result = this.experienceService.create(experience);

    return result;
  }

  /**
   * @name findAll
   * @description This method retrieves all Experience entities associated with a specific profile.
   * @param {string} id - The id of the profile.
   * @returns {Promise<Experience[]>} - The list of Experience entities.
   */
  @UseGuards(AuthGuard)
  @Get('profile/:id')
  findAll(@Param('id') id: string): Promise<Experience[]> {
    return this.experienceService
      .findAllByProfileId(id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * @name findOne
   * @description This method retrieves a specific Experience entity.
   * @param {string} id - The id of the Experience entity.
   * @returns {Promise<Experience | null>} - The Experience entity or null if not found.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Experience | null> {
    return this.experienceService.findOne(id);
  }

  /**
   * @name update
   * @description This method updates a specific Experience entity.
   * @param {string} id - The id of the Experience entity.
   * @param {Partial<Experience>} experience - The partial Experience entity with updated fields.
   * @returns {Promise<void>} - Returns nothing if the operation is successful.
   */
  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() experience: Partial<Experience>,
  ): Promise<void> {
    return this.experienceService.update(id, experience);
  }

  /**
   * @name remove
   * @description This method removes a specific Experience entity.
   * @param {string} id - The id of the Experience entity.
   * @returns {Promise<void>} - Returns nothing if the operation is successful.
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.experienceService.remove(id);
  }
}
