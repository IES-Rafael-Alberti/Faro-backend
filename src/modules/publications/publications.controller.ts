import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { Publication } from './entities/publication.entity';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  findAll(): Promise<Publication[]> {
    return this.publicationsService.findAll();
  }

  @Post()
  create(@Body() publication: Publication): Promise<Publication> {
    return this.publicationsService.create(publication);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.publicationsService.remove(id);
  }
}
