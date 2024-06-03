import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from './entities/connections.entity';
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

  async getAllConnectionsFromUser(user_id: string): Promise<string[]> {
    const connections = await this.connectionsRepository
      .createQueryBuilder('connection')
      .where('connection.user_id = :user_id', { user_id })
      .orWhere('connection.connected_user_id = :user_id', { user_id })
      .getMany();

    return connections.map((connection) => {
      return connection.user_id === user_id
        ? connection.connected_user_id
        : connection.user_id;
    });
  }

  async createConnection(
    user_id: string,
    connected_user_id: string,
  ): Promise<{ message: string }> {
    const id = uuidv4();
    await this.connectionsRepository.save({
      connection_id: id,
      user_id: user_id,
      connected_user_id: connected_user_id,
    });
    return { message: 'Connection created successfully' };
  }

  async requestConnection(
    applicant_id: string,
    required_id: string,
  ): Promise<{ message: string }> {
    // Assert that the applicant and required exist
    const applicant = await this.usersService.findOneById(applicant_id);
    const required = await this.usersService.findOneById(required_id);
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
    const connection_1 = await this.connectionsRepository.findOne({
      where: { user_id: applicant_id, connected_user_id: required_id },
    });
    if (connection_1) {
      throw new HttpException(
        'Connection already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const connection_2 = await this.connectionsRepository.findOne({
      where: { user_id: required_id, connected_user_id: applicant_id },
    });
    if (connection_2) {
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
      // Delete the request connection
      await this.requestConnectionsRepository.delete(connectionRequest);
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

  async deleteConnection(
    user_id: string,
    connected_user_id: string,
  ): Promise<{ message: string }> {
    const possible_connection_1 = await this.connectionsRepository.findOne({
      where: { user_id, connected_user_id },
    });
    const possible_connection_2 = await this.connectionsRepository.findOne({
      where: { user_id: connected_user_id, connected_user_id: user_id },
    });
    if (!possible_connection_1 && !possible_connection_2) {
      throw new HttpException('Connection not found', HttpStatus.NOT_FOUND);
    }
    if (possible_connection_1) {
      await this.connectionsRepository.delete(possible_connection_1);
    }
    if (possible_connection_2) {
      await this.connectionsRepository.delete(possible_connection_2);
    }
    return { message: 'Connection deleted successfully' };
  }

  async countConnectionsFromUser(user_id: string): Promise<number> {
    const connections = await this.connectionsRepository
      .createQueryBuilder('connection')
      .where('connection.user_id = :user_id', { user_id })
      .orWhere('connection.connected_user_id = :user_id', { user_id })
      .getMany();

    return connections.length;
  }
}
