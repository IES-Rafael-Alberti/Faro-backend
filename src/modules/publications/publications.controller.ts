import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './entities/publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  findAll(): Promise<CreatePublicationDto[]> {
    return this.publicationsService.findAll();
  }

  @Post()
  create(
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<CreatePublicationDto> {
    return this.publicationsService.create(createPublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.publicationsService.remove(id);
  }

  @Get('user/:id')
  findAllFromUser(@Param('id') id: string): Promise<CreatePublicationDto[]> {
    return this.publicationsService.findAllFromUser(id);
  }
}
