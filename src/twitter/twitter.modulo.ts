import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';

@Module({
  imports: [ConfigModule],
  controllers: [TwitterController],
  providers: [TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}