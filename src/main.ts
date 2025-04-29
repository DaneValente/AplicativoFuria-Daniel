import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/exception.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('Environment Variables:', {
    TWITTER_API_KEY: process.env.TWITTER_API_KEY ? '****' : 'missing',
    TWITTER_API_SECRET: process.env.TWITTER_API_SECRET ? '****' : 'missing',
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN ? '****' : 'missing',
    TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET ? '****' : 'missing',
  });
}
bootstrap();