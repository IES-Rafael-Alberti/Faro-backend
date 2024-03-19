import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';
import { PublicationsModule } from './modules/publications/publications.module';
import { Publication } from './modules/publications/entities/publication.entity';
import { ProfilesModule } from './modules/profiles/profiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `src/config/${process.env.NODE_ENV}.env`,
    }),
    // TODO: Extract the database configuration to an external file
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'faro',
      // TODO: Add the entities to the array in and external file
      entities: [User, Publication],
      // TODO: Remove this line in production
      synchronize: true,
    }),
    UsersModule,
    PublicationsModule,
    ProfilesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
