import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './entities/like.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserImpersonationProtectionGuard } from 'src/auth/guards/UserImpersonationProtectionGuard.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  /**
   * @name addLike
   * @description This method adds a like to a publication.
   * @param {CreateLikeDto} createLikeDto - The DTO containing the user_id and publication_id.
   * @returns {Promise<CreateLikeDto>} - The created like.
   * @throws {HttpException} - Throws an exception if there's an error.
   */
  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
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

  /**
   * @name findAllLikesByPublicationId
   * @description This method finds all likes by publication id.
   * @param {string} publication_id - The id of the publication.
   * @returns {Promise<CreateLikeDto[]>} - The likes of the publication.
   */
  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
  @Get(':publication_id')
  async findAllLikesByPublicationId(
    @Param('publication_id') publication_id: string,
  ): Promise<CreateLikeDto[]> {
    return await this.likesService.findAllLikesByPublicationId(publication_id);
  }

  /**
   * @name removeLike
   * @description This method removes a like from a publication.
   * @param {CreateLikeDto} createLikeDto - The DTO containing the user_id and publication_id.
   * @returns {Promise<void>} - Returns nothing.
   * @throws {HttpException} - Throws an exception if there's an error.
   */
  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
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

  /**
   * @name countLikesByPublicationId
   * @description This method counts the likes by publication id.
   * @param {string} publication_id - The id of the publication.
   * @returns {Promise<number>} - The count of likes.
   */
  @UseGuards(AuthGuard)
  @Get('count/:publication_id')
  async countLikesByPublicationId(
    @Param('publication_id') publication_id: string,
  ): Promise<number> {
    return await this.likesService.countLikesByPublicationId(publication_id);
  }
}
