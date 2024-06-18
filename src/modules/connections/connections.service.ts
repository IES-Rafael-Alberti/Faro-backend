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

  /**
   * @name getRequestsFromUser
   * @description Retrieves all connection requests made to a specific user.
   * @param {string} user_id - The ID of the user to retrieve requests for.
   * @returns {Promise<string[]>} - A promise that resolves to an array of request IDs.
   */
  async getRequestsFromUser(user_id: string): Promise<string[]> {
    const requests = await this.requestConnectionsRepository.find({
      where: { applicant_id: user_id },
    });
    return requests.map((request) => request.required_id);
  }

  /**
   * @name getRequestMadeByUser
   * @description Retrieves all connection requests made by a specific user.
   * @param {string} user_id - The ID of the user to retrieve requests from.
   * @returns {Promise<string[]>} - A promise that resolves to an array of request IDs.
   */
  async getRequestMadeByUser(user_id: string): Promise<string[]> {
    const requests = await this.requestConnectionsRepository.find({
      where: { required_id: user_id },
    });
    return requests.map((request) => request.required_id);
  }

  /**
   * @name getAllConnectionsFromUser
   * @description Retrieves all connections of a specific user.
   * @param {string} user_id - The ID of the user to retrieve connections for.
   * @returns {Promise<string[]>} - A promise that resolves to an array of connection IDs.
   */
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

  /**
   * @name createConnection
   * @description Creates a connection between two users.
   * @param {string} user_id - The ID of the first user.
   * @param {string} connected_user_id - The ID of the second user.
   * @returns {Promise<{ message: string }>} - A promise that resolves to a message indicating the connection was created successfully.
   */
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

  /**
   * @name requestConnection
   * @description Requests a connection between two users. It will create a request from the applicant to the required user. If the required user has previously requested the applicant, the connection will be created. Otherwise will create a request connection and wait until this method is called again for the required user.
   * @param {string} applicant_id - The ID of the user making the request.
   * @param {string} required_id - The ID of the user to connect to.
   * @returns {Promise<{ message: string }>} - A promise that resolves to a message indicating the connection request was made successfully.
   */
  async requestConnection(
    applicant_id: string,
    required_id: string,
  ): Promise<{ message: string }> {
    // Assert that both users exist
    const applicant = await this.usersService.findOneById(applicant_id);
    const required = await this.usersService.findOneById(required_id);
    if (!applicant || !required) {
      throw new HttpException(
        'Applicant or required not found',
        HttpStatus.NOT_FOUND,
      );
    }
    // Check if applicant is the same as required
    if (applicant === required) {
      throw new HttpException(
        'Applicant and required cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Check if connection already exists
    const connectionExists = await this.connectionsRepository.findOne({
      where: [
        { user_id: applicant_id, connected_user_id: required_id },
        { user_id: required_id, connected_user_id: applicant_id },
      ],
    });
    if (connectionExists) {
      throw new HttpException(
        'Connection already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Check if request already exists
    const requestExists = await this.requestConnectionsRepository.findOne({
      where: { applicant_id: applicant_id, required_id: required_id },
    });
    if (requestExists) {
      throw new HttpException(
        'Connection request already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    // If the required user previously requested the applicant, create the connection
    const connectionRequest = await this.requestConnectionsRepository.findOne({
      where: { applicant_id: required_id, required_id: applicant_id },
    });
    if (connectionRequest) {
      await this.requestConnectionsRepository.delete(connectionRequest);
      return this.createConnection(applicant_id, required_id);
    }
    // Otherwise, create the request connection
    await this.requestConnectionsRepository.save({
      applicant_id: applicant_id,
      required_id: required_id,
      connection_id: uuidv4(),
    });
    return { message: 'Connection requested successfully' };
  }

  /**
   * @name deleteRequestConnection
   * @description Deletes a connection request between two users.
   * @param {string} applicant_id - The ID of the user who made the request.
   * @param {string} required_id - The ID of the user the request was made to.
   * @returns {Promise<{ message: string }>} - A promise that resolves to a message indicating the connection request was deleted successfully.
   */
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

  /**
   * @name deleteConnection
   * @description Deletes a connection between two users.
   * @param {string} user_id - The ID of the first user.
   * @param {string} connected_user_id - The ID of the second user.
   * @returns {Promise<{ message: string }>} - A promise that resolves to a message indicating the connection was deleted successfully.
   */
  async deleteConnection(
    user_id: string,
    connected_user_id: string,
  ): Promise<{ message: string }> {
    const connection1 = await this.connectionsRepository.findOne({
      where: { user_id, connected_user_id },
    });
    const connection2 = await this.connectionsRepository.findOne({
      where: { user_id: connected_user_id, connected_user_id: user_id },
    });
    if (!connection1 && !connection2) {
      throw new HttpException('Connection not found', HttpStatus.NOT_FOUND);
    }
    if (connection1) {
      await this.connectionsRepository.delete(connection1);
    }
    if (connection2) {
      await this.connectionsRepository.delete(connection2);
    }
    return { message: 'Connection deleted successfully' };
  }

  /**
   * @name countAllConnectionsFromUser
   * @description Counts all connections of a specific user.
   * @param {string} user_id - The ID of the user to count connections for.
   * @returns {Promise<number>} - A promise that resolves to the number of connections the user has.
   */
  async countAllConnectionsFromUser(user_id: string): Promise<number> {
    const connections = await this.connectionsRepository
      .createQueryBuilder('connection')
      .where('connection.user_id = :user_id', { user_id })
      .orWhere('connection.connected_user_id = :user_id', { user_id })
      .getMany();

    return connections.length;
  }
}
