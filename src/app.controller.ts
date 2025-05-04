import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('dados')
  getData() {
    return { message: 'Dados do backend!' };
  }

  @Post('dados')
  postData() {
    return { status: 'Dados recebidos!' };
  }


}
