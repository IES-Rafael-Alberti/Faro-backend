import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './entities/comments.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserImpersonationProtectionGuard } from 'src/auth/guards/UserImpersonationProtectionGuard.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * @name addComment
   * @description This method adds a new comment.
   * @param {CreateCommentDto} createCommentDto - The data transfer object containing the details of the comment to be added.
   * @returns {Promise<CreateCommentDto>} - The added comment.
   * @useGuards AuthGuard - Ensures the user is authenticated.
   * @post
   */
  @UseGuards(AuthGuard)
  @Post()
  async addComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentDto> {
    return this.commentsService.addComment(
      createCommentDto.user_id,
      createCommentDto.publication_id,
      createCommentDto.comment,
    );
  }

  /**
   * @name findAllCommentsByPublicationId
   * @description This method fetches all comments for a given publication.
   * @param {string} publication_id - The id of the publication.
   * @returns {Promise<CreateCommentDto[]>} - An array of comments.
   * @useGuards AuthGuard - Ensures the user is authenticated.
   * @get
   */
  @UseGuards(AuthGuard)
  @Get(':publication_id')
  async findAllCommentsByPublicationId(
    @Param('publication_id') publication_id: string,
  ): Promise<CreateCommentDto[]> {
    return this.commentsService.findAllCommentsByPublicationId(publication_id);
  }

  /**
   * @name removeComment
   * @description This method removes a comment.
   * @param {object} data - An object containing the id of the comment, the user id and the publication id.
   * @returns {Promise<void>} - Returns nothing.
   * @useGuards AuthGuard, UserImpersonationProtectionGuard - Ensures the user is authenticated and not impersonating another user.
   * @delete
   */
  @UseGuards(AuthGuard)
  @UseGuards(UserImpersonationProtectionGuard)
  @Delete()
  async removeComment(
    @Body() data: { id: string; user_id: string; publication_id: string },
  ): Promise<void> {
    return this.commentsService.removeComment(
      data.id,
      data.user_id,
      data.publication_id,
    );
  }

  /**
   * @name countCommentsByPublicationId
   * @description This method counts the number of comments for a given publication.
   * @param {string} publication_id - The id of the publication.
   * @returns {Promise<number>} - The number of comments.
   * @useGuards AuthGuard - Ensures the user is authenticated.
   * @get
   */
  @UseGuards(AuthGuard)
  @Get('count/:publication_id')
  async countCommentsByPublicationId(
    @Param('publication_id') publication_id: string,
  ): Promise<number> {
    return this.commentsService.countCommentsByPublicationId(publication_id);
  }
}
