// src/twitter/dto/count-furia-likes.dto.ts
import { IsString, Matches } from 'class-validator';

export class CountFuriaLikesDto {
  @IsString()
  @Matches(/^[A-Za-z0-9_]{1,15}$/, {
    message: 'Username do Twitter inválido',
  })
  username: string;
}