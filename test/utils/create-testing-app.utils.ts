import {
  Type,
  DynamicModule,
  ForwardReference,
  Provider,
  INestApplication,
} from '@nestjs/common';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import * as nock from 'nock';

import { ClsModule } from '~common/cls/cls.module';
import { ConfigModule } from '~common/config/config.module';

import { PrismaConfig } from '~vendor/prisma/prisma.config';
import { PrismaService } from '~vendor/prisma/prisma.service';

import { disableNetwork } from './disable-network.utils';
import { createTestDb } from './test-db';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from '~modules/auth/auth.module';
import { PrismaModule } from '~vendor/prisma/prisma.module';

interface ModuleMetadata {
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  controllers?: Type<any>[];
  providers?: Provider[];
}

export async function createTestingApp(
  opts?: ModuleMetadata,
): Promise<TestingModuleBuilder> {
  const otherModules = opts?.imports || [];

  return Test.createTestingModule({
    imports: [
      ClsModule,
      ConfigModule,
      ScheduleModule.forRoot(),
      AuthModule,
      PrismaModule,
      ...otherModules,
    ],
    controllers: opts?.controllers,
    providers: opts?.providers,
  });
}

export async function startTestingApp(
  module: TestingModuleBuilder,
  withLogger = false,
): Promise<INestApplication> {
  disableNetwork();

  const testDbName = await createTestDb();

  const compiledModule = await module.compile();

  const appOptions: NestApplicationContextOptions = {
    bufferLogs: true,
  };

  if (!withLogger) {
    appOptions.logger = false;
  }

  const app = compiledModule.createNestApplication(appOptions);

  await app.init();

  const prismaService = app.get(PrismaService);

  // With this, we change prisma client to use testing db instead of the development one.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  prismaService.client = undefined;
  const prismaConfig = app.get<PrismaConfig>(PrismaConfig);
  prismaConfig.dbName = testDbName;
  prismaService.init();

  return app;
}

export async function stopTestingApp(app: INestApplication): Promise<void> {
  try {
    //  add when we need to explicitly close the attached resources
  } catch (error) {
    // nothing to do with the error
  }

  /*
    This prevents memory leaks according to nock docs - https://www.npmjs.com/package/nock#memory-issues-with-jest
    Whenever you use nock in a particular testing suite, you should call .restore() after tests are done.
  */
  nock.restore();

  await app.close();
}
