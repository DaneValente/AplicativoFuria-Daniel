import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi, TwitterApiReadWrite } from 'twitter-api-v2';

// No topo do arquivo
interface RateLimit {
  remaining: number;
  reset: number;
}

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private twitterClient: TwitterApiReadWrite;

  constructor(private configService: ConfigService) {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      this.twitterClient = new TwitterApi({
        appKey: this.configService.get<string>('TWITTER_API_KEY'),
        appSecret: this.configService.get<string>('TWITTER_API_SECRET'),
        accessToken: this.configService.get<string>('TWITTER_ACCESS_TOKEN'),
        accessSecret: this.configService.get<string>('TWITTER_ACCESS_SECRET'),
      }).readWrite;
      
      this.logger.log('Twitter client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Twitter client', error.stack);
      throw new Error('Twitter client configuration error');
    }
  }

  async createTweet(text: string): Promise<{ id: string; text: string }> {
    try {
      const tweet = await this.twitterClient.v2.tweet(text);
      this.logger.log(`Tweet created: ${tweet.data.id}`);
      return {
        id: tweet.data.id,
        text: tweet.data.text,
      };
    } catch (error) {
      this.logger.error(`Tweet creation failed: ${error.message}`, error.stack);
      throw new Error(`Failed to create tweet: ${error.message}`);
    }
  }

  async getTweet(tweetId: string): Promise<any> {
    try {
      const tweet = await this.twitterClient.v2.singleTweet(tweetId, {
        'tweet.fields': ['created_at', 'public_metrics'],
      });
      return tweet.data;
    } catch (error) {
      this.logger.error(`Tweet fetch failed: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch tweet: ${error.message}`);
    }
  }

  private furiaUserId: string | null = null;

  async initializeFuriaUser() {
    if (!this.furiaUserId) {
      try {
        const user = await this.twitterClient.v2.userByUsername('Furia');
        this.furiaUserId = user.data.id;
        this.logger.log(`Furia user ID resolved: ${this.furiaUserId}`);
      } catch (error) {
        this.logger.error('Failed to resolve Furia user', error.stack);
        throw new Error('Não foi possível encontrar o usuário @Furia');
      }
    }
  }

  async countLikesToFuria(username: string): Promise<number> { //promise que retorna dto
    // await this.initializeFuriaUser(); 

    // Passo novo: Obter o ID do usuário alvo
    const targetUser = await this.twitterClient.v2.userByUsername(username);
    const targetUserId = targetUser.data.id;

    let count = 0;
    let paginationToken: string | undefined;

    //following ver se está seguindo
      try {
        const totalCountLikes = await this.SearchAndCountFuriaLikes(targetUser, paginationToken);

        
        // paginationToken = response.meta.next_token;
        // this.logger.debug(`Progresso: ${count} likes encontrados`);
  
        // // erro [Nest] 23096  - 30/04/2025, 23:38:50    WARN [TwitterService] Aguardando reset do rate limit: 903508ms
        // if (response.rateLimit.remaining < 2) {
        //   const resetWait = (response.rateLimit.reset * 1000) - Date.now() + 2000;
        //   this.logger.warn(`Aguardando reset do rate limit: ${resetWait}ms`);
        //   await this.sleep(resetWait);
        // }
  
      } catch (error) {
        if (error.code === 400) {
          throw new Error(`Usuário ${username} inválido ou não encontrado`);
        }
        throw error;
      }
    return count;
  }
  private async SearchAndCountFuriaLikes(targetUserId,paginationToken) {
    const response = await this.twitterClient.v2.userLikedTweets(targetUserId, {
      max_results: 100,
      'tweet.fields': ['author_id'],
      pagination_token: paginationToken,
      expansions: ['author_id']
    });

    // Filtra usando comparação de IDs
    let count = response.data.data?.filter(t => t.author_id === this.furiaUserId).length || 0;
    return count;
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}