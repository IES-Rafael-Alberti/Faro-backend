import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
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

// TODO: Implement logs system
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
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // TODO: Remove this line in production
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
