import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './entities/direct-messages.entity';
import { CreateDirectMessageDto } from './entities/direct-messages.dto';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DirectMessagesService {
  constructor(
    @InjectRepository(DirectMessage)
    private directMessagesRepository: Repository<DirectMessage>,
    private usersService: UsersService,
  ) {}

  // Get all direct messages between two users
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
    // Assert that serder is not the same as receiver
    if (sender_id === receiver_id) {
      throw new HttpException(
        'Sender and receiver cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Retrieve direct messages between the two users
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
          };
        });
      });
    return directMessages;
  }

  // Create a direct message
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
    // Assert that serder is not the same as receiver
    if (sender_id === receiver_id) {
      throw new HttpException(
        'Sender and receiver cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { msg } = createDirectMessageDto;

    // Function to format the date to 'YYYY-MM-DD HH:MM:SS'
    const formatDateForMySQL = (date: Date) => {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    // Create a direct message entity and save it to the repository
    const directMessage = this.directMessagesRepository.create({

      user_direct_message_msg: msg,
      user_direct_message_sender: sender_id,
      user_direct_message_receiber: receiver_id,
      users_direct_message_id: uuidv4(),
    });
    await this.directMessagesRepository.save(directMessage);
    return createDirectMessageDto;
  }
}
