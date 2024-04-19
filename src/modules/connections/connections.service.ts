import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from './entities/connections.entity';
import { CreateConnectionDto } from './entities/connections.dto';
import { RequestConnection } from './entities/request_connections.entity';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private connectionsRepository: Repository<Connection>,
    @InjectRepository(RequestConnection)
    private requestConnectionsRepository: Repository<RequestConnection>,
    private usersService: UsersService,
  ) {}

  async getAllConnectionsFromUser(
    user_id: string,
  ): Promise<CreateConnectionDto[]> {
    const connections = await this.connectionsRepository
      .find({
        where: {
          user_id,
        },
      })
      .then((connections) => {
        return connections.map((connection) => {
          return {
            user_id: connection.user_id,
            connected_user_id: connection.connected_user_id,
          };
        });
      });
    return connections;
  }

  async createConnection(
    user_id: string,
    connected_user_id: string,
  ): Promise<{ message: string }> {
    const id_1 = uuidv4();
    const id_2 = uuidv4();
    await this.connectionsRepository.save({
      connection_id: id_1,
      user_id: user_id,
      connected_user_id: connected_user_id,
    });
    await this.connectionsRepository.save({
      connection_id: id_2,
      user_id: connected_user_id,
      connected_user_id: user_id,
    });
    return { message: 'Connection created successfully' };
  }

  async requestConnection(
    applicant_id: string,
    required_id: string,
  ): Promise<{ message: string }> {
    // Assert that the applicant and required exist
    const applicant = await this.usersService.findOne(applicant_id);
    const required = await this.usersService.findOne(required_id);
    if (!applicant || !required) {
      throw new HttpException(
        'Applicant or required not found',
        HttpStatus.NOT_FOUND,
      );
    }
    // Assert that applicant is not the same as required
    if (applicant === required) {
      throw new HttpException(
        'Applicant and required cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }
    // If the connection already exists, return an error
    const connection = await this.connectionsRepository.findOne({
      where: { user_id: applicant_id, connected_user_id: required_id },
    });
    if (connection) {
      throw new HttpException(
        'Connection already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    // If the request already exists, return an error
    const requestConnection = await this.requestConnectionsRepository.findOne({
      where: { applicant_id: applicant_id, required_id: required_id },
    });
    if (requestConnection) {
      throw new HttpException(
        'Connection request already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    // If required requested the applicant, create the connection
    const connectionRequest = await this.requestConnectionsRepository.findOne({
      where: { applicant_id: required_id, required_id: applicant_id },
    });
    if (connectionRequest) {
      return this.createConnection(applicant_id, required_id);
    }
    // Create the request connection
    await this.requestConnectionsRepository.save({
      applicant_id: applicant_id,
      required_id: required_id,
      connection_id: uuidv4(),
    });
    return { message: 'Connection requested successfully' };
  }

  async deleteRequestConnection(
    applicant_id: string,
    required_id: string,
  ): Promise<{ message: string }> {
    const requestConnection = await this.requestConnectionsRepository.findOne({
      where: { applicant_id, required_id },
    });
    if (!requestConnection) {
      throw new HttpException(
        'Connection request not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.requestConnectionsRepository.delete(requestConnection);
    return { message: 'Connection request deleted successfully' };
  }
}
