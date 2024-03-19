import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
    private usersService: UsersService,
  ) {}

  findAll(): Promise<Publication[]> {
    return this.publicationsRepository.find();
  }

  async create(publication: Publication): Promise<Publication> {
    if (!publication.user) {
      throw new BadRequestException('The user is required');
    }
    // Assert the user exists
    const user = await this.usersService.findOne(publication.user.user_id);
    if (!user) {
      throw new BadRequestException('The user does not exist');
    }
    // Assert the publication message is not empty
    if (!publication.user_publication_msg) {
      throw new BadRequestException('The publication message is required');
    }
    return await this.publicationsRepository.save(publication);
  }

  async remove(id: string): Promise<void> {
    // Assert id is not empty
    if (!id) {
      throw new BadRequestException('The id is required');
    }
    // Assert the publication exists
    const publication = await this.publicationsRepository.findOne({
      where: { user_publication_id: id } as ObjectLiteral,
    });
    if (!publication) {
      throw new BadRequestException('The publication does not exist');
    }
    await this.publicationsRepository.delete(id);
  }
}
