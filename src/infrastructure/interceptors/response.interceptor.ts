import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { getLoggerContext } from 'src/modules/logger/logger-context';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.formatResponse(data, HttpStatus.OK)),
      catchError((error) => {
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const response = error.getResponse();
          return throwError(() => new HttpException(this.formatErrorResponse(response, status), status));
        }
  
        this.logger.error('Unhandled exception', { error: error.message, stack: error.stack });
  
        return throwError(
          () =>
            new HttpException(
              this.formatErrorResponse(
                { message: 'An unexpected error occurred' },
                HttpStatus.INTERNAL_SERVER_ERROR
              ),
              HttpStatus.INTERNAL_SERVER_ERROR
            ),
        );
      }),
    );
  }

  private formatResponse(data: any, statusCode: number) {
    const loggerContext = getLoggerContext();
    return {
      transactionId: loggerContext?.uuid || 'NO_UUID',
      statusCode: statusCode,
      result: data,
    };
  }

  private formatErrorResponse(response: string | object, statusCode: number) {
    const loggerContext = getLoggerContext();
    let errorData: { statusCode: number; message: string };

    if (typeof response === 'string') {
      errorData = { statusCode, message: response };
    } else if (typeof response === 'object' && response !== null) {
      errorData = {
        statusCode: (response as any).statusCode || statusCode,
        message: (response as any).message || 'An error occurred',
      };
    } else {
      errorData = { statusCode, message: 'An error occurred' };
    }

    return {
      transactionId: loggerContext?.uuid || 'NO_UUID',
      statusCode: statusCode,
      result: errorData,
    };
  }
}
