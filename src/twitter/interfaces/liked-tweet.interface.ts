export interface LikedTweet {
  id: string;
  text: string;
  lang: string;
  author_id: string;
  created_at?: string;
}

export interface LikedTweetsResponse {
  data: LikedTweet[];
  meta?: {
    result_count: number;
    newest_id?: string;
    oldest_id?: string;
    next_token?: string;
  };
}