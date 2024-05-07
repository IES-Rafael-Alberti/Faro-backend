import { Controller, Param, UseGuards } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';
import { CreateDirectMessageDto } from './entities/direct-messages.dto';
import { Body, Get, Post } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DirectMessageImpersonationProtectionGuard } from 'src/auth/guards/DirectMessageImpersonationProtectionGuard.guard';

@Controller('direct-messages')
export class DirectMessagesController {
  constructor(private readonly directMessagesService: DirectMessagesService) {}

  @UseGuards(AuthGuard)
  @UseGuards(DirectMessageImpersonationProtectionGuard)
  @Get('sender/:sender_id/receiver/:receiver_id')
  findAllMessagesFromTwoUsers(
    @Param('sender_id') sender_id: string,
    @Param('receiver_id') receiver_id: string,
  ): Promise<CreateDirectMessageDto[]> {
    return this.directMessagesService.getAllDirectMessagesFromTwoUsers(
      sender_id,
      receiver_id,
    );
  }

  @UseGuards(AuthGuard)
  @UseGuards(DirectMessageImpersonationProtectionGuard)
  @Post()
  create(
    @Body() createDirectMessageDto: CreateDirectMessageDto,
  ): Promise<CreateDirectMessageDto> {
    return this.directMessagesService.create(createDirectMessageDto);
  }
}
