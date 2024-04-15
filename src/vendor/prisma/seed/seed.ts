import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '~common/config/config.module';

import { userSeed } from './user.seed';

@Module({
  imports: [ConfigModule],
})
export class AppModule {}

async function bootstrap() {
  console.log('Seeding database...');
  const app = await NestFactory.create(AppModule);

  await userSeed(app);

  console.log('Seeding database completed!');
}

bootstrap();
