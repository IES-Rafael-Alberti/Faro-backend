import { Controller, Param, UseGuards } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';
import { CreateDirectMessageDto } from './entities/direct-messages.dto';
import { Body, Get, Post } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DirectMessageImpersonationProtectionGuard } from 'src/auth/guards/DirectMessageImpersonationProtectionGuard.guard';

@Controller('direct-messages')
export class DirectMessagesController {
  constructor(private readonly directMessagesService: DirectMessagesService) {}

  /**
   * @api {get} /direct-messages/sender/:sender_id/receiver/:receiver_id Find all messages between two users
   * @apiName findAllMessagesFromTwoUsers
   * @apiGroup DirectMessages
   *
   * @apiParam {String} sender_id User's unique ID.
   * @apiParam {String} receiver_id User's unique ID.
   *
   * @apiSuccess {Object[]} messages List of messages between two users.
   *
   * @apiUse AuthGuard
   * @apiUse DirectMessageImpersonationProtectionGuard
   */
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

  /**
   * @api {post} /direct-messages Create a new direct message
   * @apiName create
   * @apiGroup DirectMessages
   *
   * @apiParam {Object} createDirectMessageDto Data to create a new direct message.
   *
   * @apiSuccess {Object} message The created direct message.
   *
   * @apiUse AuthGuard
   * @apiUse DirectMessageImpersonationProtectionGuard
   */
  @UseGuards(AuthGuard)
  @UseGuards(DirectMessageImpersonationProtectionGuard)
  @Post()
  create(
    @Body() createDirectMessageDto: CreateDirectMessageDto,
  ): Promise<CreateDirectMessageDto> {
    return this.directMessagesService.create(createDirectMessageDto);
  }
}
