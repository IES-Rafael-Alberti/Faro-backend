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

  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<{
    data: CreatePublicationDto[];
    currentPage: number;
    totalPages: number;
  }> {
    return this.publicationsService.findAll();
  }

  @UseGuards(AuthGuard)
  @UseGuards(PublicationImpersonationProtectionGuard)
  @Post()
  create(
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<CreatePublicationDto> {
    return this.publicationsService.create(createPublicationDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PublicationImpersonationProtectionGuard)
  @Delete('user/:user_id/msg/:msg_id')
  remove(
    @Param('user_id') user_id: string,
    @Param('msg_id') msg_id: string,
  ): Promise<void> {
    return this.publicationsService.remove(user_id, msg_id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  findAllFromUser(@Param('id') id: string): Promise<CreatePublicationDto[]> {
    return this.publicationsService.findAllFromUser(id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id/count')
  countAllFromUser(@Param('id') id: string): Promise<number> {
    return this.publicationsService.countAllFromUser(id);
  }
}
