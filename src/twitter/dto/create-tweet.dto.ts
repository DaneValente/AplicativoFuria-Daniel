import { IsString, IsNotEmpty, MaxLength, MinLength, IsOptional, IsArray } from 'class-validator';
import { TWITTER_CONFIG } from '../constants.ts/twitter.constants';

export class CreateTweetDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(TWITTER_CONFIG.MIN_TWEET_LENGTH, {
    message: `O tweet deve ter pelo menos ${TWITTER_CONFIG.MIN_TWEET_LENGTH} caractere`
  })
  @MaxLength(TWITTER_CONFIG.MAX_TWEET_LENGTH, {
    message: `O tweet não pode exceder ${TWITTER_CONFIG.MAX_TWEET_LENGTH} caracteres`
  })
  text: string;

  @IsOptional()
  @IsArray()
  mediaIds?: string[];
}