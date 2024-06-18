// recommendation.controller.ts
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
import { RecommendationService } from './recommendation.service';
import { Recommendation } from './entity/recommendation.entity';
import { RecommendationDto } from './entity/recommendation.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  /**
   * Creates a new recommendation.
   *
   * @param {RecommendationDto} createRecommendationDto - The data to create a new recommendation.
   * @returns {Promise<Recommendation>} - The created recommendation.
   */
  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createRecommendationDto: RecommendationDto,
  ): Promise<Recommendation> {
    return this.recommendationService
      .create(createRecommendationDto)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Finds all recommendations for a specific profile.
   *
   * @param {string} id - The ID of the profile.
   * @returns {Promise<Recommendation[]>} - The recommendations for the profile.
   */
  @UseGuards(AuthGuard)
  @Get('profile/:id')
  findAll(@Param(':id') id: string): Promise<Recommendation[]> {
    return this.recommendationService
      .findAllByProfileId(id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Finds a specific recommendation by ID.
   *
   * @param {string} id - The ID of the recommendation.
   * @returns {Promise<Recommendation | null>} - The found recommendation or null if not found.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Recommendation | null> {
    return this.recommendationService
      .findOne(id)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Updates a specific recommendation.
   *
   * @param {string} id - The ID of the recommendation.
   * @param {Partial<Recommendation>} recommendation - The data to update the recommendation.
   * @returns {Promise<void>}
   */
  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() recommendation: Partial<Recommendation>,
  ): Promise<void> {
    return this.recommendationService
      .update(id, recommendation)
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Removes a specific recommendation.
   *
   * @param {string} id - The ID of the recommendation.
   * @returns {Promise<void>}
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.recommendationService.remove(id).catch((error) => {
      throw error;
    });
  }
}
