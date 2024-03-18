import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from './entities/publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publication])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule {}
