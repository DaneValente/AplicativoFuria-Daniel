// src/twitter/dto/count-furia-comments.dto.ts
import { IsString, Matches } from 'class-validator';

export class CountFuriaCommentsDto {
  @IsString()
  @Matches(/^@?[A-Za-z0-9_]{1,15}$/)
  username: string;
}