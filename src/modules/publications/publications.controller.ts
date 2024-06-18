import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './entities/publication.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PublicationImpersonationProtectionGuard } from 'src/auth/guards/PublicationImpersonationProtectionGuard.guard';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  /**
   * Get all publications with a limit.
   * @param {number} limit - The number of publications to return.
   * @returns {Promise} A promise that resolves to an object containing the data, current page, and total pages.
   */
  @UseGuards(AuthGuard)
  @Get('/:limit')
  findAll(@Param('limit') limit: number): Promise<{
    data: CreatePublicationDto[];
    currentPage: number;
    totalPages: number;
  }> {
    return this.publicationsService.findAll(limit);
  }

  /**
   * Create a new publication.
   * @param {CreatePublicationDto} createPublicationDto - The data to create a new publication.
   * @returns {Promise} A promise that resolves to the created publication.
   */
  @UseGuards(AuthGuard)
  @UseGuards(PublicationImpersonationProtectionGuard)
  @Post()
  create(
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<CreatePublicationDto> {
    return this.publicationsService.create(createPublicationDto);
  }

  /**
   * Remove a publication.
   * @param {string} user_id - The ID of the user.
   * @param {string} msg_id - The ID of the message.
   * @returns {Promise} A promise that resolves when the publication is removed.
   */
  @UseGuards(AuthGuard)
  @UseGuards(PublicationImpersonationProtectionGuard)
  @Delete('user/:user_id/msg/:msg_id')
  remove(
    @Param('user_id') user_id: string,
    @Param('msg_id') msg_id: string,
  ): Promise<void> {
    return this.publicationsService.remove(user_id, msg_id);
  }

  /**
   * Get all publications from a user.
   * @param {string} id - The ID of the user.
   * @returns {Promise} A promise that resolves to an array of publications.
   */
  @UseGuards(AuthGuard)
  @Get('user/:id')
  findAllFromUser(@Param('id') id: string): Promise<CreatePublicationDto[]> {
    return this.publicationsService.findAllFromUser(id);
  }

  /**
   * Count all publications from a user.
   * @param {string} id - The ID of the user.
   * @returns {Promise} A promise that resolves to the count of publications.
   */
  @UseGuards(AuthGuard)
  @Get('user/:id/count')
  countAllFromUser(@Param('id') id: string): Promise<number> {
    return this.publicationsService.countAllPublicationsFromUser(id);
  }
}
