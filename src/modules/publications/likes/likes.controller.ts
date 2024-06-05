import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpException,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './entities/like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async addLike(@Body() createLikeDto: CreateLikeDto): Promise<CreateLikeDto> {
    try {
      return await this.likesService.addLike(
        createLikeDto.user_id,
        createLikeDto.publication_id,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':publication_id')
  async findAllLikesByPublicationId(
    @Param('publication_id') publication_id: string,
  ): Promise<CreateLikeDto[]> {
    return await this.likesService.findAllLikesByPublicationId(publication_id);
  }

  @Delete()
  async removeLike(@Body() createLikeDto: CreateLikeDto): Promise<void> {
    try {
      await this.likesService.removeLike(
        createLikeDto.user_id,
        createLikeDto.publication_id,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
