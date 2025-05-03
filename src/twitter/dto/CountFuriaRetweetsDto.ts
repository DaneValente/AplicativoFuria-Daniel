// src/twitter/dto/count-furia-retweets.dto.ts
import { IsString, Matches } from 'class-validator';

export class CountFuriaRetweetsDto {
  @IsString()
  @Matches(/^@?[A-Za-z0-9_]{1,15}$/)
  username: string;
}