import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { DirectMessagesModule } from './modules/direct-messages/direct-messages.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './modules/profile/profile.module';
import { EducationModule } from './modules/profile/education/education.module';
import { RecommendationModule } from './modules/profile/recommendation/recommendation.module';
import { ExperienceModule } from './modules/profile/experience/experience.module';
import { ConfigModule } from '@nestjs/config';

// TODO: Implement logs system
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    // TODO: Extract the database configuration to an external file
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // TODO: Add the entities to the array in and external file
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // This line recreates the database schema every time the server starts
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_KEY}`,
      signOptions: { expiresIn: '3600s' },
    }),
    UsersModule,
    PublicationsModule,
    DirectMessagesModule,
    ConnectionsModule,
    AuthModule,
    ProfileModule,
    EducationModule,
    RecommendationModule,
    ExperienceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
