import { Module, forwardRef } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from './entities/connections.entity';
import { RequestConnection } from './entities/request_connections.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Connection, RequestConnection]),
    forwardRef(() => UsersModule),
  ],
  providers: [ConnectionsService],
  controllers: [ConnectionsController],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
