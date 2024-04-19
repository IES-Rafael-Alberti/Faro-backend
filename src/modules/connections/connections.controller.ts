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
  ): Promise<CreateConnectionDto[]> {
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

/*
{
	"user_id": "20e7b93a-8aa7-4ddf-859d-206a32cca6c2",
	"connected_user_id": "05d9538d-64f5-4ad0-a59d-be31a58ed506"
}

{
	"user_id": "05d9538d-64f5-4ad0-a59d-be31a58ed506",
	"connected_user_id": "20e7b93a-8aa7-4ddf-859d-206a32cca6c2"
}
*/
