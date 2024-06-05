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

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() education: Education): Promise<Education> {
    return this.educationService.create(education);
  }

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

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Education | null> {
    return this.educationService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() education: Partial<Education>,
  ): Promise<void> {
    return this.educationService.update(id, education);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.educationService.remove(id);
  }
}
