import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './entities/connections.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ConnectionImpersonationProtectionGuard } from 'src/auth/guards/ConnectionImpersonationProtectionGuard.guard';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @UseGuards(AuthGuard)
  @Get(':user_id')
  async getAllConnectionsFromUser(
    @Param('user_id') user_id: string,
  ): Promise<string[]> {
    return await this.connectionsService.getAllConnectionsFromUser(user_id);
  }

  @UseGuards(AuthGuard)
  @Get('request/:user_id')
  async getRequestsFromUser(
    @Param('user_id') user_id: string,
  ): Promise<string[]> {
    return await this.connectionsService.getRequestsFromUser(user_id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(ConnectionImpersonationProtectionGuard)
  @Post('request')
  async requestConnection(
    @Body() requestConnectionDto: CreateConnectionDto,
  ): Promise<{ message: string }> {
    return await this.connectionsService.requestConnection(
      requestConnectionDto.user_id,
      requestConnectionDto.connected_user_id,
    );
  }

  @UseGuards(AuthGuard)
  @UseGuards(ConnectionImpersonationProtectionGuard)
  @Delete('request/:applicant_id/:required_id')
  async deleteRequestConnection(
    @Param('applicant_id') applicant_id: string,
    @Param('required_id') required_id: string,
  ): Promise<{ message: string }> {
    return await this.connectionsService.deleteRequestConnection(
      applicant_id,
      required_id,
    );
  }

  @UseGuards(AuthGuard)
  @UseGuards(ConnectionImpersonationProtectionGuard)
  @Delete(':user_id/:connected_user_id')
  async deleteConnection(
    @Param('user_id') user_id: string,
    @Param('connected_user_id') connected_user_id: string,
  ): Promise<{ message: string }> {
    return await this.connectionsService.deleteConnection(
      user_id,
      connected_user_id,
    );
  }

  @UseGuards(AuthGuard)
  @Get('count/:user_id')
  async countConnectionsFromUser(
    @Param('user_id') user_id: string,
  ): Promise<number> {
    return await this.connectionsService.countAllConnectionsFromUser(user_id);
  }
}
