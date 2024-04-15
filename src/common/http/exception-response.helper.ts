import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import type { Response } from 'express';
import { P, match } from 'ts-pattern';

import { BaseError } from '~common/error/base.error';

import { ErrorResponseDto } from './dto/error-response.dto';
import { ClientRequest } from './interfaces/client-request.interface';
import {
  INPUT_VALIDATION_ERROR,
  ValidationError,
} from '~common/error/validation.error';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<ClientRequest>();

    const response = ctx.getResponse<Response>();

    let httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponseDto = match(exception)
      .with(P.instanceOf(ValidationError), (e: ValidationError) => {
        httpStatus = HttpStatus.BAD_REQUEST;

        const detailItems = Object.entries(e.fieldErrors).map(([k, v]) => {
          return {
            message: v.message,
            field: k,
          };
        });

        return new ErrorResponseDto({
          code: INPUT_VALIDATION_ERROR,
          message: 'Input validation failed',
          details: {
            errors: detailItems,
          },
          meta: {
            requestId: request.id,
          },
        });
      })
      .with(P.instanceOf(BaseError), (e: BaseError) => {
        return new ErrorResponseDto({
          code: e.code,
          message: e.message,
          meta: {
            ...e.meta,
            requestId: request.id,
          },
        });
      })
      .with(P.instanceOf(HttpException), (e: HttpException) => {
        httpStatus = e.getStatus();
        const code =
          e.cause instanceof BaseError ? e.cause.code : `http-${httpStatus}`;
        return new ErrorResponseDto({
          code,
          message: e.message,
          meta: {
            requestId: request.id,
          },
        });
      })
      .otherwise((e: Error) => {
        PinoLogger.root.error(e);
        return new ErrorResponseDto({
          code: 'UNCAUGHT-EXCEPTION',
          message: 'Uncaught Exception',
          meta: {
            requestId: request.id,
          },
        });
      });

    if (!response.headersSent) {
      response.status(httpStatus);
      response.json(
        instanceToPlain(errorResponseDto, { excludeExtraneousValues: true }),
      );
    }
  }
}
