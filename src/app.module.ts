import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `src/config/${process.env.NODE_ENV}.env`,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
