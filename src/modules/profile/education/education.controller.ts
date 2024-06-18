// education.controller.ts
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
import { EducationService } from './education.service';
import { Education } from './entity/education.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  /**
   * Creates a new Education record.
   * @param {Education} education - The Education entity to create.
   * @returns {Promise<Education>} - The created Education entity.
   */
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() education: Education): Promise<Education> {
    return this.educationService.create(education);
  }

  /**
   * Retrieves all Education records associated with a specific profile.
   * @param {string} id - The ID of the profile.
   * @returns {Promise<Education[]>} - The list of Education entities.
   */
  @UseGuards(AuthGuard)
  @Get('profile/:id')
  findAll(@Param(':id') id: string): Promise<Education[]> {
    return this.educationService
      .findAllByProfileId(id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Retrieves a specific Education record.
   * @param {string} id - The ID of the Education entity.
   * @returns {Promise<Education | null>} - The Education entity or null if not found.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Education | null> {
    return this.educationService.findOne(id);
  }

  /**
   * Updates a specific Education record.
   * @param {string} id - The ID of the Education entity.
   * @param {Partial<Education>} education - The partial Education entity with updated values.
   * @returns {Promise<void>}
   */
  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() education: Partial<Education>,
  ): Promise<void> {
    return this.educationService.update(id, education);
  }

  /**
   * Deletes a specific Education record.
   * @param {string} id - The ID of the Education entity.
   * @returns {Promise<void>}
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.educationService.remove(id);
  }
}
