export interface Tweet {
    id: string;
    text: string;
    createdAt: Date;
    userId: string;
    metrics?: {
      likes?: number;
      retweets?: number;
      replies?: number;
    };
  }
  
  export interface TweetResponse {
    success: boolean;
    data: Tweet;
  }

 export interface TweetV2SendParams {
    text: string;
    media?: {
        media_ids: [string] | [string, string] | [string, string, string] | [string, string, string, string];
    };
    // Outros parâmetros opcionais...
}

export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
  // ... outros campos da API
}