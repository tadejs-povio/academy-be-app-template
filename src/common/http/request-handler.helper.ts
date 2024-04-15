import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClientRequest } from './interfaces/client-request.interface';

export const requestHandlerMiddleware =
  () => (request: ClientRequest, response: Response, next: NextFunction) => {
    const requestId = crypto.randomUUID();
    request.id = requestId;

    response.setHeader('X-API-REQUEST-ID', requestId);

    next();
  };

@Injectable()
export class RequestHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((handlerData: any) => {
        if (handlerData instanceof StreamableFile) {
          return handlerData;
        }
        const res = {
          data: handlerData?.data || handlerData,
          metadata: handlerData?.metadata,
        };
        return res;
      }),
    );
  }
}
