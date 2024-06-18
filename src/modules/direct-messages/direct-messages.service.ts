import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './entities/direct-messages.entity';
import { CreateDirectMessageDto } from './entities/direct-messages.dto';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment-timezone';

@Injectable()
export class DirectMessagesService {
  constructor(
    @InjectRepository(DirectMessage)
    private directMessagesRepository: Repository<DirectMessage>,
    private usersService: UsersService,
  ) {}

  /**
   * Gets all direct messages between two users.
   *
   * @param {string} sender_id - The ID of the sender.
   * @param {string} receiver_id - The ID of the receiver.
   * @returns {Promise<CreateDirectMessageDto[]>} - A promise that resolves to an array of direct messages.
   * @throws {HttpException} - Throws an exception if the sender or receiver does not exist or if they are the same.
   */
  async getAllDirectMessagesFromTwoUsers(
    sender_id: string,
    receiver_id: string,
  ): Promise<CreateDirectMessageDto[]> {
    // Assert that the sender and receiver exist
    const sender = await this.usersService.findOneById(sender_id);
    const receiver = await this.usersService.findOneById(receiver_id);
    if (!sender || !receiver) {
      throw new HttpException(
        'Sender or receiver not found',
        HttpStatus.NOT_FOUND,
      );
    }
    // Assert that sender is not the same as receiver
    if (sender_id === receiver_id) {
      throw new HttpException(
        'Sender and receiver cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }
    const directMessages = await this.directMessagesRepository
      .find({
        where: [
          {
            user_direct_message_sender: sender_id,
            user_direct_message_receiber: receiver_id,
          },
          {
            user_direct_message_sender: receiver_id,
            user_direct_message_receiber: sender_id,
          },
        ],
      })
      .then((directMessages) => {
        return directMessages.map((directMessage) => {
          return {
            msg: directMessage.user_direct_message_msg,
            sender_id: directMessage.user_direct_message_sender,
            receiver_id: directMessage.user_direct_message_receiber,
            message_id: directMessage.users_direct_message_id,
            date: directMessage.user_direct_message_date,
          };
        });
      });
    return directMessages;
  }

  /**
   * Creates a new direct message.
   *
   * @param {CreateDirectMessageDto} createDirectMessageDto - The DTO containing the details of the direct message to be created.
   * @returns {Promise<CreateDirectMessageDto>} - A promise that resolves to the created direct message.
   * @throws {HttpException} - Throws an exception if the sender or receiver does not exist or if they are the same.
   */
  async create(
    createDirectMessageDto: CreateDirectMessageDto,
  ): Promise<CreateDirectMessageDto> {
    // TODO: Validate the sender and receiver are connected
    const { sender_id, receiver_id } = createDirectMessageDto;
    // Assert that the sender and receiver exist
    const sender = await this.usersService.findOneById(sender_id);
    const receiver = await this.usersService.findOneById(receiver_id);
    if (!sender || !receiver) {
      throw new HttpException(
        'Sender or receiver not found',
        HttpStatus.NOT_FOUND,
      );
    }
    // Assert that sender is not the same as receiver
    if (sender_id === receiver_id) {
      throw new HttpException(
        'Sender and receiver cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { msg } = createDirectMessageDto;

    const formatDateForSpain = (date: Date) => {
      return moment(date).tz('Europe/Madrid').format('YYYY-MM-DD HH:mm:ss');
    };

    const directMessage = this.directMessagesRepository.create({
      user_direct_message_msg: msg,
      user_direct_message_sender: sender_id,
      user_direct_message_receiber: receiver_id,
      users_direct_message_id: uuidv4(),
      user_direct_message_date: formatDateForSpain(new Date()), // Format the date before saving
    });
    await this.directMessagesRepository.save(directMessage);
    return {
      ...createDirectMessageDto,
      date: directMessage.user_direct_message_date,
    };
  }
}
