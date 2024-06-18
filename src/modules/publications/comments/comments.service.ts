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

  /**
   * @method create
   * @description This method creates a new comment.
   * @param {CreateCommentDto} createCommentDto - The data transfer object containing the details of the comment to be created.
   * @returns {Promise<CreateCommentDto>} - The created comment.
   */
  async create(createCommentDto: CreateCommentDto): Promise<CreateCommentDto> {
    const comment = this.commentsRepository.create(createCommentDto);
    await this.commentsRepository.save(comment);
    return comment;
  }

  /**
   * @method findAllCommentsByPublicationId
   * @description This method finds all comments associated with a specific publication.
   * @param {string} publication_id - The ID of the publication.
   * @returns {Promise<CreateCommentDto[]>} - An array of comments associated with the publication.
   */
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

  /**
   * @method addComment
   * @description This method adds a new comment to a specific publication.
   * @param {string} user_id - The ID of the user adding the comment.
   * @param {string} publication_id - The ID of the publication.
   * @param {string} comment - The comment text.
   * @returns {Promise<CreateCommentDto>} - The added comment.
   */
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

  /**
   * @method removeComment
   * @description This method removes a comment from a specific publication.
   * @param {string} id - The ID of the comment.
   * @param {string} user_id - The ID of the user who added the comment.
   * @param {string} publication_id - The ID of the publication.
   * @returns {Promise<void>} - No return value.
   */
  async removeComment(
    id: string,
    user_id: string,
    publication_id: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: {
        user_id,
        publication_id,
        id,
      } as FindOptionsWhere<Comment>,
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    await this.commentsRepository.remove(comment);
  }

  /**
   * @method countCommentsByPublicationId
   * @description This method counts the number of comments associated with a specific publication.
   * @param {string} publication_id - The ID of the publication.
   * @returns {Promise<number>} - The number of comments associated with the publication.
   */
  async countCommentsByPublicationId(publication_id: string): Promise<number> {
    const comments = await this.commentsRepository.find({
      where: { publication_id } as FindOptionsWhere<Comment>,
    });
    return comments.length;
  }
}
