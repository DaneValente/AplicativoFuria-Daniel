import { IsOptional, IsString } from 'class-validator';

export class GetLikedTweetsDto {
  @IsOptional()
  @IsString()
  tweetFields?: string = 'lang,author_id,created_at';

  @IsOptional()
  @IsString()
  userFields?: string = 'created_at';

  @IsOptional()
  @IsString()
  nextToken?: string;
}