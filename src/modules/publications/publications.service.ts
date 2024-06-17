import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { CreatePublicationDto } from './entities/publication.dto';
import { UsersService } from '../users/users.service';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
    private usersService: UsersService,
  ) {}

  // Method to find all publications with pagination
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

    // Get publications with pagination and reversed by date
    const [result, total] = await this.publicationsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        users_publications_created_at: 'DESC',
      },
    });

    // Get user details for each publication
    const data = await Promise.all(
      result.map(async (publication) => {
        const user = await this.usersService.findOneById(
          publication.users_user_id,
        );

        return {
          id: publication.user_publication_id,
          msg: publication.user_publication_msg,
          created_at: publication.users_publications_created_at,
          user_id: publication.users_user_id,
          name: `${user?.name} ${user?.first_surname}`,
          user_role: `${user?.role}`,
        };
      }),
    );

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Method to create a new publication
  async create(
    createPublicationDto: CreatePublicationDto,
  ): Promise<CreatePublicationDto> {
    const { msg, user_id } = createPublicationDto;

    // Ensure the user exists
    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new HttpException('The user does not exist', HttpStatus.NOT_FOUND);
    }

    const name = `${user.name} ${user.first_surname}`;
    const user_role = user.role;

    // Create a new publication entity
    const publication = new Publication();
    publication.user = user;
    publication.user_publication_msg = msg;

    // Save the new publication and return the DTO
    return this.publicationsRepository
      .save(publication)
      .then((publication) => ({
        id: publication.user_publication_id,
        msg: publication.user_publication_msg,
        created_at: publication.users_publications_created_at,
        user_id: publication.users_user_id,
        name: name,
        user_role: user_role,
      }));
  }

  // Method to remove a publication
  async remove(user_id: string, msg_id: string): Promise<void> {
    // Ensure the publication exists
    const publication = await this.publicationsRepository.findOne({
      where: { user_publication_id: msg_id } as FindOptionsWhere<any>,
    });
    if (!publication) {
      throw new HttpException(
        'The publication does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    // Ensure the publication belongs to the user
    if (publication.users_user_id !== user_id) {
      throw new HttpException(
        'The publication does not belong to the user',
        HttpStatus.FORBIDDEN,
      );
    }

    // Remove the publication
    await this.publicationsRepository.delete(msg_id);
  }

  // Method to find all publications from a user
  async findAllFromUser(user_id: string): Promise<CreatePublicationDto[]> {
    // Ensure the user exists
    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new HttpException('The user does not exist', HttpStatus.NOT_FOUND);
    }

    const name = `${user.name} ${user.first_surname}`;
    const user_role = user.role;

    try {
      // Get the publications for the user, reversed by date
      const publications = await this.publicationsRepository.find({
        where: { users_user_id: user_id },
        order: { users_publications_created_at: 'DESC' },
      });

      // Map the publications to DTOs
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

  // Method to count all publications from a user
  async countAllPublicationsFromUser(user_id: string): Promise<number> {
    // Ensure the user exists
    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new HttpException('The user does not exist', HttpStatus.NOT_FOUND);
    }

    // Count the publications for the user
    return this.publicationsRepository.count({
      where: { users_user_id: user_id },
    });
  }
}
