import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { TweetResponse } from '../../twitter/interfaces/tweet.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: Partial<TweetResponse> = {
      success: false,
      data: {
        id: 'error',
        text: exception instanceof Error ? exception.message : 'Internal server error',
        createdAt: new Date(),
        userId: 'system'
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      errorResponse.data.text = exception instanceof Error 
        ? exception.message 
        : 'Internal server error';
    }

    response.status(status).json(errorResponse);
  }
}