import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly defaultTimeout = 60000; // 60 seconds
  private readonly llmTimeout = 300000; // 5 minutes for LLM operations

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const timeoutDuration = this.getTimeoutForRequest(request);

    return next.handle().pipe(
      timeout(timeoutDuration),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () => new RequestTimeoutException(
              `Request timed out after ${timeoutDuration}ms. Please try again or simplify your request.`
            )
          );
        }
        return throwError(() => err);
      })
    );
  }

  private getTimeoutForRequest(request: any): number {
    // LLM operations need more time
    const llmPaths = [
      '/study-report',
      '/outline',
      '/manuscript',
      '/applications',
      '/illustrations',
      '/discussion-questions',
      '/citations',
      '/structural-analysis',
      '/interpretive-challenge',
      '/verse-context',
      '/passage-summary',
      '/study-synthesis',
      '/canonical-themes',
      '/verse-commentary',
      '/translation-comparison-enhanced'
    ];

    if (llmPaths.some(path => request.url.includes(path))) {
      return this.llmTimeout;
    }

    return this.defaultTimeout;
  }
}
