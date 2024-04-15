import 'tsconfig-paths/register';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ConfigModule } from '~common/config/config.module';

import { PrismaModule } from '~vendor/prisma/prisma.module';
import { PrismaService } from '~vendor/prisma/prisma.service';

@Module({
  imports: [PrismaModule, ConfigModule],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const prisma = app.get(PrismaService);

  const dbs: { datname: string }[] = await prisma.client
    .$queryRaw`SELECT datname FROM pg_database WHERE datname LIKE '%test_%';`;

  const promises: Promise<any>[] = [];
  dbs.forEach((x) => {
    promises.push(
      prisma.client.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${x.datname};`),
    );
  });
  await Promise.all(promises);

  console.log('\nDangling test databases deleted.');

  await prisma.client.$disconnect();
}

bootstrap();
