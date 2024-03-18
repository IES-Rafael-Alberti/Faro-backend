import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { BadRequestException } from '@nestjs/common';

/*
DROP TABLE IF EXISTS `faro`.`users_publications` ;

CREATE TABLE IF NOT EXISTS `faro`.`users_publications` (
  `user_publication_id` BINARY(16) NOT NULL,
  `user_publication_msg` VARCHAR(2048) NOT NULL,
  `users_publications_created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `users_user_id` BINARY(16) NOT NULL,
  `users_users_profiles_user_profile_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`user_publication_id`, `users_user_id`, `users_users_profiles_user_profile_id`),
  INDEX `fk_users_publications_users1_idx` (`users_user_id` ASC, `users_users_profiles_user_profile_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_publications_users1`
    FOREIGN KEY (`users_user_id` , `users_users_profiles_user_profile_id`)
    REFERENCES `faro`.`users` (`user_id` , `users_profiles_user_profile_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
*/

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
  ) {}

  findAll(): Promise<Publication[]> {
    return this.publicationsRepository.find();
  }

  async create(publication: Publication): Promise<Publication> {
    // Assert the msg is not empty
    if (!publication.user_publication_msg) {
      throw new BadRequestException('The publication message cannot be empty.');
    }
    return this.publicationsRepository.save(publication);
  }

  async remove(id: string): Promise<void> {
    await this.publicationsRepository.delete(id);
  }
}
