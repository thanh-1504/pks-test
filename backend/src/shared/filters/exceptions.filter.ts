import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Lỗi server';
    let errors: unknown;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else {
        const b = body as { message?: unknown };
        if (Array.isArray(b.message)) {
          message = 'Dữ liệu không hợp lệ';
          errors = b.message;
        } else if (typeof b.message === 'string') {
          message = b.message;
        }
      }
    } else {
      this.logger.error(exception);
    }

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(errors ? { errors } : {}),
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
