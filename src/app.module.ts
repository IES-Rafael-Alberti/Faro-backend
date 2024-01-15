import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot(
      //`mongodb+srv://{user}:{pwd}@faro-cluster-0.lchdolp.mongodb.net/faro?retryWrites=true&w=majority`,
      'mongodb://localhost:27017/faro',
    ),
    UserModule,
    ConfigModule.forRoot({ envFilePath: `${process.env.NODE_ENV}.env` }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
