import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterApi, TwitterApiReadWrite, } from 'twitter-api-v2';
@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private twitterClient: TwitterApiReadWrite;

  constructor(
    private configService: ConfigService) {
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
    await this.initializeFuriaUser(); 

    // Passo novo: Obter o ID do usuário alvo
    const targetUser = await this.twitterClient.v2.userByUsername(username);
    const targetUserId = targetUser.data.id;

    let count = 0;
    let paginationToken: string | undefined;

    //following ver se está seguindo
      try {
        const response = await this.twitterClient.v2.userLikedTweets(targetUserId, {
          max_results: 100,
          'tweet.fields': ['author_id'],
          pagination_token: paginationToken,
          expansions: ['author_id']
        });
    
        // Filtra usando comparação de IDs
        let count = response.data.data?.filter(t => t.author_id === this.furiaUserId).length || 0;
        return count;
  
      } catch (error) {
        if (error.code === 400) {
          throw new Error(`Usuário ${username} inválido ou não encontrado`);
        }
        throw error;
      }
    return count;
  }


  async countCommentsToFuria(username: string): Promise<number> {
    await this.initializeFuriaUser();
    
    const targetUser = await this.twitterClient.v2.userByUsername(username);
    const targetUserId = targetUser.data.id;
  
    let count = 0;
    let paginationToken: string | undefined;
    let rateLimit = { remaining: 15, reset: 0 };
  
    // Primeiro: Buscar tweets do usuário que mencionam a Furia
    const mentionQuery = `@Furia from:${username}`;
    
    // Segundo: Buscar replies diretos aos tweets da Furia
    const replyQuery = `to:${this.furiaUserId} from:${username}`;
  
    try {
      // Busca combinada usando operador OR
      const search = await this.twitterClient.v2.search(
        `${mentionQuery} OR ${replyQuery}`,
        {
          max_results: 100,
          'tweet.fields': ['in_reply_to_user_id', 'referenced_tweets'],
          expansions: ['referenced_tweets.id'],
          next_token: paginationToken
        }
      );
  
      count = search.data.data?.filter(tweet => {
        // Verifica se é reply direto à Furia
        const isDirectReply = tweet.in_reply_to_user_id === this.furiaUserId;
        
        // Verifica se menciona a Furia em replies a outros tweets
        const referencesFuria = tweet.referenced_tweets?.some(ref => 
          ref.type === 'replied_to' && ref.id === this.furiaUserId
        );
  
        return isDirectReply || referencesFuria;
      }).length || 0;
  
    } catch (error) {
      this.logger.error(`Search error: ${error.message}`);
      throw new Error('Erro na busca de comentários');
    }
  
    return count;
  }

  async countRetweetsToFuria(username: string): Promise<number> {
    await this.initializeFuriaUser();
    
    // 1. Buscar ID do usuário alvo
    const targetUser = await this.twitterClient.v2.userByUsername(username);
    const targetUserId = targetUser.data.id;
  
    // 2. Buscar TODOS os tweets da Furia
    const furiaTweets = await this.twitterClient.v2.userTimeline(this.furiaUserId, {
      max_results: 100,
      exclude: 'replies',
      'tweet.fields': ['id']
    });
  
    let totalRetweets = 0;
  
    // 3. Verificar retweets para cada tweet da Furia
    for await (const tweet of furiaTweets) {
      const retweeters = await this.twitterClient.v2.tweetRetweetedBy(tweet.id, {
        max_results: 100
      });
      
      if (retweeters.data.some(user => user.id === targetUserId)) {
        totalRetweets++;
      }
    }
  
    return totalRetweets;
  }
}