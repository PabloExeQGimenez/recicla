import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : Number(HttpStatus.INTERNAL_SERVER_ERROR);

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    const path = String(httpAdapter.getRequestUrl(request));

    const responseBody = {
      statusCode,
      timestamp: new Date().toISOString(),
      path,
      ...(typeof message === 'string'
        ? { message }
        : typeof message === 'object'
          ? message
          : { message: String(message) }),
    };

    if (statusCode === Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
      this.logger.error(
        `Unhandled exception: ${exception instanceof Error ? exception.message : String(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
        `${request.method} ${request.url}`,
      );
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
