import { Injectable, Logger, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { TwitterApi, TwitterApiv2, ApiV2Includes, TweetV2SingleResult } from 'twitter-api-v2';
import {CreateTweetDto} from './dto/create-tweet.dto';
import { TweetResponse } from './interfaces/tweet.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitterService implements OnModuleInit {
  private readonly logger = new Logger(TwitterService.name);
  private client: TwitterApi;
  private v2: TwitterApiv2; // Client v2 explicitamente tipado

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeClient();
  } 

  private async initializeClient() {
    try {
      // Verificar explicitamente cada variável
      const credentials = {
        appKey: this.getConfigValue('TWITTER_API_KEY'),
        appSecret: this.getConfigValue('TWITTER_API_SECRET'),
        accessToken: this.getConfigValue('TWITTER_ACCESS_TOKEN'),
        accessSecret: this.getConfigValue('TWITTER_ACCESS_SECRET'),
      };

      this.logger.debug('Credenciais carregadas:', {
        keys: Object.keys(credentials).map(k => k + ': ' + credentials[k].substring(0, 3) + '...')
      });

      this.client = new TwitterApi(credentials);
      this.v2 = this.client.v2;
      await this.testConnection();
      
    } catch (error) {
      this.logger.error('Falha na inicialização', error.stack);
      throw error;
    }
  }

  private getConfigValue(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Variável de ambiente faltando: ${key}`);
    }
    return value;
  }

  private async testConnection() {
    try {
      const { data: user } = await this.client.v2.me();
      this.logger.log(`Conectado como @${user.username}`);
    } catch (error) {
      this.logger.error('Teste de conexão falhou', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async createTweet(createTweetDto: CreateTweetDto): Promise<TweetResponse> {
    if (!this.client) {
      throw new HttpException('Twitter client not initialized', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const { text, mediaIds } = createTweetDto;
      const trimmedText = text.trim();

      if (!trimmedText || trimmedText.length > 280) {
        throw new HttpException('Invalid tweet text', HttpStatus.BAD_REQUEST);
      }

      const tweetParams: any = { text: trimmedText };
      
      if (mediaIds?.length > 0) {
        if (mediaIds.length > 4) {
          throw new HttpException('Maximum 4 media items allowed', HttpStatus.BAD_REQUEST);
        }
        tweetParams.media = { media_ids: mediaIds };
      }

      const { data: tweet, includes } = await this.v2.tweet(tweetParams) as TweetV2SingleResult & { includes?: ApiV2Includes };

      return {
        success: true,
        data: {
          id: tweet.id,
          text: tweet.text,
          createdAt: new Date(),
          userId: includes?.users?.[0]?.id || 'unknown' // Corrige o erro do userId
        },
      };
    } catch (error) {
      this.logger.error('Failed to create tweet', error.stack);
      throw new HttpException(
        `Failed to post tweet: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}