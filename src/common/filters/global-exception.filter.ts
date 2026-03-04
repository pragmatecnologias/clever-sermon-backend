import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors || null;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    } else {
      this.logger.error('Unknown exception type', exception);
    }

    // Log error details
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`
    );

    // Send user-friendly error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: this.getUserFriendlyMessage(status, message),
      ...(errors && { errors }),
      ...(process.env.NODE_ENV === 'development' && {
        originalMessage: message,
        stack: exception instanceof Error ? exception.stack : undefined
      })
    });
  }

  private getUserFriendlyMessage(status: number, originalMessage: string): string {
    // Map technical errors to user-friendly messages
    const friendlyMessages: Record<number, string> = {
      400: 'Invalid request. Please check your input and try again.',
      401: 'Authentication required. Please log in.',
      403: 'You do not have permission to access this resource.',
      404: 'The requested resource was not found.',
      409: 'This operation conflicts with existing data.',
      422: 'The data provided could not be processed.',
      429: 'Too many requests. Please try again later.',
      500: 'An unexpected error occurred. Our team has been notified.',
      502: 'Service temporarily unavailable. Please try again.',
      503: 'Service is currently under maintenance.',
    };

    // Check for specific error patterns
    if (originalMessage.includes('LLM') || originalMessage.includes('generation')) {
      return 'Content generation failed. Please try again or adjust your request.';
    }

    if (originalMessage.includes('Bible') || originalMessage.includes('passage')) {
      return 'Unable to retrieve Bible passage. Please check the reference and try again.';
    }

    if (originalMessage.includes('EGW') || originalMessage.includes('Ellen')) {
      return 'Unable to retrieve Spirit of Prophecy content. Please try again.';
    }

    return friendlyMessages[status] || originalMessage;
  }
}
