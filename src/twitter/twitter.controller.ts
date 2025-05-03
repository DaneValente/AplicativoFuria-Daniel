import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { CountFuriaLikesDto } from './dto/CountFuriaLikesDto';
import { CountFuriaCommentsDto } from './dto/CountFuriaCommentsDto';
import { CountFuriaRetweetsDto } from './dto/CountFuriaRetweetsDto';


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

  // src/twitter/twitter.controller.ts
  @Get('furia-comments') // <-- Decorator corrigido
  async countFuriaComments(
    @Query() { username }: CountFuriaCommentsDto // <-- Certifique-se do tipo DTO
  ) {
    const cleanUsername = username.replace(/^@/, '');
    const count = await this.twitterService.countCommentsToFuria(cleanUsername);
    
    return {
      username: cleanUsername,
      furia_comments_count: count,
      profile: `https://twitter.com/${cleanUsername}`,
      checked_at: new Date().toISOString()
    };
  }

    @Get('furia-retweets')
      async countFuriaRetweets(@Query() { username }: CountFuriaRetweetsDto) {
      const cleanUsername = username.replace(/^@/, '');
      const count = await this.twitterService.countRetweetsToFuria(cleanUsername);
      
      return {
        username: cleanUsername,
        furia_retweets_count: count,
        message: `@${cleanUsername} retweetou ${count} posts da Furia`,
        checked_at: new Date().toISOString()
      };
  }
}