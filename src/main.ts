import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// TODO: Add a pipe to validate the request body

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
