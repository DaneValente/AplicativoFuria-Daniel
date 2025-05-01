import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { CountFuriaLikesDto } from './dto/CountFuriaLikesDto';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post('tweet')
  async createTweet(@Body() createTweetDto: CreateTweetDto) {
    // Correção: Extrai a propriedade text do DTO
    return this.twitterService.createTweet(createTweetDto.text);
  }

  @Get('furia-likes')
  async countFuriaLikes(@Query() { username }: CountFuriaLikesDto) {
    const count = await this.twitterService.countLikesToFuria(username);
    return {
      username,
      furia_likes_count: count,
      profile: `https://twitter.com/${username}`,
      checked_at: new Date().toISOString(),
    };
  }
}