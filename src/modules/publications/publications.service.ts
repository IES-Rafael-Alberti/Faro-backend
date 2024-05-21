import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { ObjectLiteral } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePublicationDto } from './entities/publication.dto';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
    private usersService: UsersService,
  ) {}

  async findAll(): Promise<CreatePublicationDto[]> {
    const publications = await this.publicationsRepository.find();
    const publicationsDto = publications.map(async (publication) => {
      const user = await this.usersService.findOneById(
        publication.users_user_id,
      );
      if (!user) {
        throw new HttpException(
          'The user does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      const name = `${user.user_name} ${user.user_first_surname}`;
      const user_role = user.user_role;
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
    return Promise.all(publicationsDto);
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
    const name = `${user.user_name} ${user.user_first_surname}`;
    const user_role = user.user_role;

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
    const name = `${user.user_name} ${user.user_first_surname}`;
    const user_role = user.user_role;
    return this.publicationsRepository
      .find({
        where: { users_user_id: user_id } as ObjectLiteral,
      })
      .then((publications) =>
        publications.map((publication) => {
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
        }),
      );
  }
}
