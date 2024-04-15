import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { execSync } from 'node:child_process';

import { ConfigModule } from '~common/config/config.module';

import { PrismaConfig } from '~vendor/prisma/prisma.config';
import { PrismaModule } from '~vendor/prisma/prisma.module';
import { PrismaService } from '~vendor/prisma/prisma.service';

@Injectable()
class TestDbService {
  private dbName!: string;

  constructor(
    private prisma: PrismaService,
    private prismaConfig: PrismaConfig,
  ) {}

  async create() {
    try {
      this.generateDbName();
      this.prismaConfig.dbName = this.dbName;
      await this.createDatabase();
      await this.runMigrations();
      await this.prisma.client.$disconnect();

      return this.dbName;
    } catch (error) {
      console.log(error);
      const err = error as PrismaClientKnownRequestError;
      if (err.code === 'P2002') {
        console.error('Test DB already exists');
      }
      throw error;
    }
  }

  private generateDbName() {
    /*
      To make DB name unique we use test spec file path, provided by Jest.expect, to generate the name.
    */
    const { testPath } = expect.getState();

    if (!testPath) {
      throw Error('Test Path not present in Jest object');
    }

    const testNameArr = testPath.split('/');
    const testName = testNameArr[testNameArr.length - 1];

    this.dbName = `test_${testName.replaceAll('-', '_').replaceAll('.', '_')}`;
  }

  private async createDatabase() {
    // We must use unsafe query because every template variable will try to be wrapped with '' so this.dbName would become 'this.dbName'
    await this.prisma.client.$executeRawUnsafe(`
            CREATE DATABASE ${this.dbName} WITH
            OWNER = ${this.prismaConfig.dbUsername}
            ENCODING = 'UTF8'
            LC_COLLATE = 'en_US.utf8'
            LC_CTYPE = 'en_US.utf8'
            TABLESPACE = pg_default
            CONNECTION LIMIT = -1;`);
  }

  private async runMigrations() {
    execSync(
      `export DATABASE_URL=${PrismaService.getDatabaseUrl(this.prismaConfig)} && npx prisma migrate deploy`,
    );
  }
}

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [TestDbService],
})
class AppModule {}

export async function createTestDb() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const testDbService = app.get(TestDbService);

  return await testDbService.create();
}
