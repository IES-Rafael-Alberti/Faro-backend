import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { ObjectLiteral } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePublicationDto } from './entities/publication.dto';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
    private usersService: UsersService,
  ) {}

  async findAll(
    page = 1,
    limit = 16,
  ): Promise<{
    data: CreatePublicationDto[];
    currentPage: number;
    totalPages: number;
  }> {
    if (page < 1) {
      page = 1;
    }

    // Get the publications reversed by date
    const [result, total] = await this.publicationsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        users_publications_created_at: 'DESC',
      },
    });

    // Get the user for each publication
    const data = result.map(async (publication) => {
      const user = await this.usersService.findOneById(
        publication.users_user_id,
      );

      const {
        user_publication_id,
        user_publication_msg,
        users_publications_created_at,
        users_user_id,
      } = publication;
      const publicationDto: CreatePublicationDto = {
        id: user_publication_id,
        msg: user_publication_msg,
        created_at: users_publications_created_at,
        user_id: users_user_id,
        name: `${user?.name} ${user?.first_surname}`,
        user_role: `${user?.role}`,
      };
      return publicationDto;
    });

    return {
      data: await Promise.all(data),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(
    createPublicationDto: CreatePublicationDto,
  ): Promise<CreatePublicationDto> {
    const { msg, user_id } = createPublicationDto;
    // Assert the user exists
    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new HttpException('The user does not exist', HttpStatus.NOT_FOUND);
    }
    const name = `${user.name} ${user.first_surname}`;
    const user_role = user.role;

    const publication = new Publication();
    publication.user = user;
    publication.user_publication_msg = msg;

    return await this.publicationsRepository
      .save(publication)
      .then((publication) => {
        const {
          user_publication_id,
          user_publication_msg,
          users_publications_created_at,
          users_user_id,
        } = publication;
        const publicationDto: CreatePublicationDto = {
          id: user_publication_id,
          msg: user_publication_msg,
          created_at: users_publications_created_at,
          user_id: users_user_id,
          name: name,
          user_role: user_role,
        };
        return publicationDto;
      });
  }

  async remove(user_id: string, msg_id: string): Promise<void> {
    // Assert the publication exists
    const publication = await this.publicationsRepository.findOne({
      where: { user_publication_id: msg_id } as ObjectLiteral,
    });
    if (!publication) {
      throw new HttpException(
        'The publication does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    // Assert publication belongs to the user
    if (publication.users_user_id !== user_id) {
      throw new HttpException(
        'The publication does not belong to the user',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.publicationsRepository.delete(msg_id);
  }

  async findAllFromUser(user_id: string): Promise<CreatePublicationDto[]> {
    // Assert the user exists
    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new HttpException('The user does not exist', HttpStatus.NOT_FOUND);
    }

    const name = `${user.name} ${user.first_surname}`;
    const user_role = user.role;

    try {
      // Get the publications reversed by date
      const publications = await this.publicationsRepository.find({
        where: { users_user_id: user_id },
        order: { users_publications_created_at: 'DESC' },
      });

      return publications.map((publication) => ({
        id: publication.user_publication_id,
        msg: publication.user_publication_msg,
        created_at: publication.users_publications_created_at,
        user_id: publication.users_user_id,
        name: name,
        user_role: user_role,
      }));
    } catch (error) {
      // Handle any errors that might occur during the query
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async countAllPublicationsFromUser(user_id: string): Promise<number> {
    // Assert the user exists
    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new HttpException('The user does not exist', HttpStatus.NOT_FOUND);
    }
    const where: FindOptionsWhere<any> = { users_user_id: user_id };
    return this.publicationsRepository.count({ where });
  }
}
