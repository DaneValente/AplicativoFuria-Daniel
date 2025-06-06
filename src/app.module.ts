import { AuthModule } from './auth/auth.module';
import { TwitterRepositoryService } from './twitter/twitter.repository.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter} from './common/filters/exception.filter'
import { TwitterModule } from './twitter/twitter.modulo';
import { TwitterService } from './twitter/twitter.service';
import { TwitterController } from './twitter/twitter.controller';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
        ConfigModule.forRoot({ isGlobal: true,  envFilePath: '.env',}),
        AuthModule, 
        TwitterModule,
  ],
  controllers: [TwitterController, AppController],
  providers: [
        TwitterRepositoryService, 
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    TwitterService,
    AppService,
  ],
})
export class AppModule {
  constructor() {
    console.log('Variáveis do .env:', {
      TW_API_KEY: process.env.TWITTER_API_KEY?.substring(0, 3) + '...',
      TW_SECRET: process.env.TWITTER_API_SECRET?.substring(0, 3) + '...',
    });
  }
}
