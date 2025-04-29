import { Controller, Post, Body, UsePipes, HttpCode } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { TweetResponse } from './interfaces/tweet.interface';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post('tweet')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async createTweet(@Body() createTweetDto: CreateTweetDto) {
    return this.twitterService.createTweet(createTweetDto);
  }
}