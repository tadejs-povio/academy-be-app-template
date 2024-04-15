import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

import { PrismaConfig } from './prisma.config';

@Injectable()
export class PrismaService {
  client!: PrismaClient;

  constructor(private readonly config: PrismaConfig) {
    PrismaService.generateEnvFile(config);
    this.init();
  }

  init() {
    this.client = new PrismaClient({
      log: this.config.log,
      datasources: {
        db: {
          url: PrismaService.getDatabaseUrl(this.config),
        },
      },
    });
    if (this.config.runMigrations) this.runMigrations();
  }

  // This generates .env file because prisma cli is by default looking for this file at project root.
  public static generateEnvFile(prismaConfig: PrismaConfig) {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    writeFileSync(
      `${process.cwd()}/.prisma.env`,
      `DATABASE_URL=${PrismaService.getDatabaseUrl(prismaConfig)}`,
    );
  }

  public static getDatabaseUrl(prismaConfig: PrismaConfig) {
    return `postgresql://${prismaConfig.dbUsername}:${prismaConfig.dbPassword}@${prismaConfig.dbHost}:${prismaConfig.dbPort}/${prismaConfig.dbName}?schema=public`;
  }

  async destroyClient() {
    await this.client.$disconnect();
  }

  private async runMigrations() {
    console.log('Running DB migrations');
    const cmd = spawn('npm', ['run', 'prisma', 'migrate', 'deploy']);

    cmd.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    cmd.stderr.on('data', (data) => {
      console.error(`${data}`);
      process.exit(1);
    });

    cmd.on('close', (code) => {
      console.log(`DB migration ended with code ${code}`);
    });
  }
}
