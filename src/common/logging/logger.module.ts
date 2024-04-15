import { LoggerModule as PinoModule } from 'nestjs-pino';
import pino from 'pino';

import { LoggerConfig } from '~common/logging/logger.config';

export const LoggerModule = PinoModule.forRootAsync({
  inject: [LoggerConfig],
  useFactory: async (loggerConfig: LoggerConfig) => {
    let level;
    if (loggerConfig.level === 'log') {
      level = 'info';
    } else {
      level = loggerConfig.level;
    }

    const transport = {
      targets: [] as pino.TransportTargetOptions[],
    };

    if (loggerConfig.output === 'console') {
      transport.targets.push({
        target: 'pino-pretty',
        level,
        options: {},
      });
    }

    if (loggerConfig.output === 'json') {
      transport.targets.push({
        target: 'pino/file',
        level,
        options: {},
      });
    }

    return {
      pinoHttp: {
        customSuccessMessage: function (req, res) {
          return `${req.method} ${req.url} ${res.statusCode}`;
        },
        customErrorMessage: function (req, res) {
          return `${req.method} ${req.url} ${res.statusCode}`;
        },
        transport,
        redact: {
          paths: ['req.headers.authorization'],
        },
      },
    };
  },
});
