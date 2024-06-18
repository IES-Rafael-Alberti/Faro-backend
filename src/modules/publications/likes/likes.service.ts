import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './entities/like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  /**
   * Creates a new like.
   * @param {CreateLikeDto} createLikeDto - The DTO for creating a new like.
   * @returns {Promise<CreateLikeDto>} The created like.
   */
  async create(createLikeDto: CreateLikeDto): Promise<CreateLikeDto> {
    const like = this.likesRepository.create(createLikeDto);
    await this.likesRepository.save(like);
    return like;
  }

  /**
   * Finds all likes by publication ID.
   * @param {string} publication_id - The ID of the publication.
   * @returns {Promise<CreateLikeDto[]>} The likes for the publication.
   */
  async findAllLikesByPublicationId(
    publication_id: string,
  ): Promise<CreateLikeDto[]> {
    const likes = await this.likesRepository.find({
      where: { publication_id } as FindOptionsWhere<Like>,
    });
    return likes.map((like) => {
      const likeDto = {
        user_id: like.user_id,
        publication_id: like.publication_id,
        created_at: like.created_at,
      };
      return likeDto;
    });
  }

  /**
   * Adds a like.
   * @param {string} user_id - The ID of the user.
   * @param {string} publication_id - The ID of the publication.
   * @returns {Promise<CreateLikeDto>} The created like.
   * @throws {HttpException} If the like already exists.
   */
  async addLike(
    user_id: string,
    publication_id: string,
  ): Promise<CreateLikeDto> {
    const like = await this.likesRepository.findOne({
      where: { user_id, publication_id } as FindOptionsWhere<Like>,
    });
    if (like) {
      throw new HttpException('Like already exists', HttpStatus.CONFLICT);
    }
    const likeDto = {
      user_id,
      publication_id,
      created_at: new Date(),
    };
    return this.create(likeDto);
  }

  /**
   * Removes a like.
   * @param {string} user_id - The ID of the user.
   * @param {string} publication_id - The ID of the publication.
   * @returns {Promise<void>}
   * @throws {HttpException} If the like does not exist.
   */
  async removeLike(user_id: string, publication_id: string): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: { user_id, publication_id } as FindOptionsWhere<Like>,
    });
    if (!like) {
      throw new HttpException('Like not found', HttpStatus.NOT_FOUND);
    }
    await this.likesRepository.remove(like);
  }

  /**
   * Counts likes by publication ID.
   * @param {string} publication_id - The ID of the publication.
   * @returns {Promise<number>} The number of likes for the publication.
   */
  async countLikesByPublicationId(publication_id: string): Promise<number> {
    return this.likesRepository.count({
      where: { publication_id } as FindOptionsWhere<Like>,
    });
  }
}
