import { Controller } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';
import { CreateDirectMessageDto } from './entities/direct-messages.dto';
import { Body, Get, Post } from '@nestjs/common';

@Controller('direct-messages')
export class DirectMessagesController {
  constructor(private readonly directMessagesService: DirectMessagesService) {}

  // Get all direct messages from two users
  @Get('sender/:senderId/receiver/:receiverId')
  findAll(
    senderId: string,
    receiverId: string,
  ): Promise<CreateDirectMessageDto[]> {
    return this.directMessagesService.getAllDirectMessagesFromTwoUsers(
      senderId,
      receiverId,
    );
  }

  @Post()
  create(
    @Body() createDirectMessageDto: CreateDirectMessageDto,
  ): Promise<CreateDirectMessageDto> {
    return this.directMessagesService.create(createDirectMessageDto);
  }
}
