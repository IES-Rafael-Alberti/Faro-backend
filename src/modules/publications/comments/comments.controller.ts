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

  @UseGuards(AuthGuard)
  @Get(':publication_id')
  async findAllCommentsByPublicationId(
    @Param('publication_id') publication_id: string,
  ): Promise<CreateCommentDto[]> {
    return this.commentsService.findAllCommentsByPublicationId(publication_id);
  }

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

  @UseGuards(AuthGuard)
  @Get('count/:publication_id')
  async countCommentsByPublicationId(
    @Param('publication_id') publication_id: string,
  ): Promise<number> {
    return this.commentsService.countCommentsByPublicationId(publication_id);
  }
}
