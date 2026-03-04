import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, mergeMap } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RetryInterceptor.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const isRetryable = this.isRetryableRequest(request);

    if (!isRetryable) {
      return next.handle();
    }

    return next.handle().pipe(
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          if (!this.isRetryableError(error)) {
            throw error;
          }

          this.logger.warn(
            `Retrying request ${request.method} ${request.url} (attempt ${retryCount}/${this.maxRetries})`
          );

          // Exponential backoff - return timer observable
          const delayMs = this.retryDelay * Math.pow(2, retryCount - 1);
          return timer(delayMs);
        },
      }),
      catchError((error) => {
        this.logger.error(
          `Request failed after ${this.maxRetries} retries: ${request.method} ${request.url}`,
          error.stack
        );
        return throwError(() => error);
      })
    );
  }

  private isRetryableRequest(request: any): boolean {
    // Only retry GET requests and specific safe operations
    return request.method === 'GET' || 
           request.url.includes('/passage') ||
           request.url.includes('/search');
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx errors
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    
    if (error.response?.status) {
      return retryableStatusCodes.includes(error.response.status);
    }

    // Retry on network errors
    return error.code === 'ECONNRESET' ||
           error.code === 'ETIMEDOUT' ||
           error.code === 'ECONNREFUSED';
  }
}
