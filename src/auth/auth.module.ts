// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TwitterStrategy } from './twitter.strategy';

@Module({
  imports: [PassportModule],
  providers: [TwitterStrategy],
})
export class AuthModule {}