// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  // Rota GET (não POST)
  @Get('twitter') // <--- Decorador @Get
  @UseGuards(AuthGuard('twitter'))
  async twitterLogin() {
    // Inicia o fluxo OAuth
  }

  // Callback também é GET
  @Get('twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  async twitterCallback(@Req() req: any, @Res() res: Response) {
    // ... lógica do callback
  }
}