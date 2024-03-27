import { Module } from '@nestjs/common';
import { DirectMessagesController } from './direct-messages.controller';
import { DirectMessagesService } from './direct-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectMessage } from './entities/direct-messages.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([DirectMessage]), UsersModule],
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService],
})
export class DirectMessagesModule {}
