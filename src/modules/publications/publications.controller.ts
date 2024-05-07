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

  @Get()
  findAll(): Promise<CreatePublicationDto[]> {
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
  @Delete(':msg_id')
  remove(@Param('msg_id') id: string): Promise<void> {
    return this.publicationsService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  findAllFromUser(@Param('id') id: string): Promise<CreatePublicationDto[]> {
    return this.publicationsService.findAllFromUser(id);
  }
}

// 1261c8a7-ffa8-4998-b954-7d0146b8020d
// f9f72caf-ae8c-4aeb-bc6f-c35046a45755
