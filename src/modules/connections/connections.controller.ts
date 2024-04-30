import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './entities/connections.dto';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get(':user_id')
  async getAllConnectionsFromUser(
    @Param('user_id') user_id: string,
  ): Promise<string[]> {
    return await this.connectionsService.getAllConnectionsFromUser(user_id);
  }

  @Post('request')
  async requestConnection(
    @Body() requestConnectionDto: CreateConnectionDto,
  ): Promise<{ message: string }> {
    return await this.connectionsService.requestConnection(
      requestConnectionDto.user_id,
      requestConnectionDto.connected_user_id,
    );
  }

  @Delete('request/:applicant_id/:required_id')
  async deleteRequestConnection(
    @Param('applicant_id') applicant_id: string,
    @Param('required_id') required_id: string,
  ): Promise<{ message: string }> {
    // TODO: Check this try/catch block
    try {
      return await this.connectionsService.deleteRequestConnection(
        applicant_id,
        required_id,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
