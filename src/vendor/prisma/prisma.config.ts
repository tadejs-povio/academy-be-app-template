import { Prisma } from '@prisma/client';

import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
} from 'class-validator';

const PrismaLoglevel: Prisma.LogLevel[] = ['query', 'info', 'warn', 'error'];

export class PrismaConfig {
  @IsString()
  dbUsername!: string;

  @IsString()
  dbPassword!: string;

  @IsString()
  dbHost!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  dbPort!: number;

  @IsString()
  dbName!: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(PrismaLoglevel, { each: true })
  log?: Prisma.LogLevel[];

  @IsBoolean()
  runMigrations!: boolean;
}
