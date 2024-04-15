import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from '~common/config/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ValidationError } from '~common/error/validation.error';
import { flatten } from '~utils/validation';
import { AllExceptionsFilter } from '~common/http/exception-response.helper';
import { Logger, LoggerErrorInterceptor, PinoLogger } from 'nestjs-pino';
import { requestHandlerMiddleware } from '~common/http/request-handler.helper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // buffer logs until logger is setup
    abortOnError: false, // force nest.js to bubble up exceptions
  });

  const rootConfig = app.get(Config);

  const logger = app.get(Logger);
  app.useLogger(logger);
  // This enables error cause stack in the logs
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.use(requestHandlerMiddleware());

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // use DTOs as runtime types
      whitelist: true, // strip non-whitelisted
      exceptionFactory: (fieldErrors) => {
        const err = new ValidationError(flatten(fieldErrors));
        return err;
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Gold Price Tracker API')
    .setDescription('API docs for Gold Price Tracker API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(rootConfig.app.port);

  logger.log(`Using configuration for "${process.env.NODE_ENV}" environment.`);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((e) => {
  PinoLogger.root.error(e.message, e, 'Bootstrap');
  process.exit(1);
});
