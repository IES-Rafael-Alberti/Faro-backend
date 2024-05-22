import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 'LIMIT_FILE_SIZE') {
      response.status(413).json({
        statusCode: 413,
        message: 'File too large',
        error: 'Payload Too Large',
      });
    } else {
      response.status(400).json({
        statusCode: 400,
        message: exception.message,
        error: 'Bad Request',
      });
    }
  }
}
