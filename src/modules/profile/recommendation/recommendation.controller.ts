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

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.recommendationService.remove(id).catch((error) => {
      console.error(`Error removing recommendation with ID ${id}:`, error);
      throw error;
    });
  }
}
