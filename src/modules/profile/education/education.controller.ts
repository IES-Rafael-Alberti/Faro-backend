// education.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { Education } from './entity/education.entity';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  create(@Body() education: Education): Promise<Education> {
    return this.educationService.create(education);
  }

  @Get()
  findAll(): Promise<Education[]> {
    return this.educationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Education | null> {
    return this.educationService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() education: Partial<Education>,
  ): Promise<void> {
    return this.educationService.update(id, education);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.educationService.remove(id);
  }
}
