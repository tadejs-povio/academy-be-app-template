import { LogLevel } from '@nestjs/common';
import { IsEnum, IsString } from 'class-validator';

enum LogLevelEnum {
  'fatal' = 'fatal',
  'error' = 'error',
  'warn' = 'warn',
  'log' = 'log',
  'debug' = 'debug',
  'verbose' = 'verbose',
}

/**
 * Logger configuration used throughout the app
 *  the level defines the output printed to the console
 *  hooks can capture errors that are not printed
 */
export class LoggerConfig {
  /**
   * Type of logger to use locally
   *  - do not use console in AWS !
   */
  @IsString()
  output: 'json' | 'console' = 'json';

  /**
   * Default log level for all unspecified contexts
   *  logs the selected severity and above
   */
  @IsEnum(LogLevelEnum)
  level: LogLevel = 'log';
}
