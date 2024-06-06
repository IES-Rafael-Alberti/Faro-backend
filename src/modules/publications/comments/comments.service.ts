import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Comment } from './entities/comments.entity';
import { CreateCommentDto } from './entities/comments.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CreateCommentDto> {
    const comment = this.commentsRepository.create(createCommentDto);
    await this.commentsRepository.save(comment);
    return comment;
  }

  async findAllCommentsByPublicationId(
    publication_id: string,
  ): Promise<CreateCommentDto[]> {
    const comments = await this.commentsRepository.find({
      where: { publication_id } as FindOptionsWhere<Comment>,
    });
    return comments.map((comment) => {
      const commentDto = {
        id: comment.id,
        user_id: comment.user_id,
        publication_id: comment.publication_id,
        comment: comment.comment,
        created_at: comment.created_at,
      };
      return commentDto;
    });
  }

  async addComment(
    user_id: string,
    publication_id: string,
    comment: string,
  ): Promise<CreateCommentDto> {
    const existingComment = await this.commentsRepository.findOne({
      where: { user_id, publication_id, comment } as FindOptionsWhere<Comment>,
    });
    if (existingComment) {
      throw new HttpException('Comment already exists', HttpStatus.CONFLICT);
    }
    const commentDto = {
      id: uuidv4(),
      user_id,
      publication_id,
      comment,
      created_at: new Date(),
    };
    return this.create(commentDto);
  }

  async removeComment(
    user_id: string,
    publication_id: string,
    comment_msg: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: {
        user_id,
        publication_id,
        comment: comment_msg,
      } as FindOptionsWhere<Comment>,
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    await this.commentsRepository.remove(comment);
  }

  async countCommentsByPublicationId(publication_id: string): Promise<number> {
    const comments = await this.commentsRepository.find({
      where: { publication_id } as FindOptionsWhere<Comment>,
    });
    return comments.length;
  }
}
