import { TypedConfigModule, fileLoader, selectConfig } from 'nest-typed-config';
import { Config } from './config';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'local';
}

export const ConfigModule = TypedConfigModule.forRoot({
  schema: Config,
  load: fileLoader({
    disallowUndefinedEnvironmentVariables: true,
    ignoreEnvironmentVariableSubstitution: false,
  }),
});

/*
  When you need configuration data outside of NestJS IoC container,
  import rootConfig and use it directly.
*/
export const rootConfigNoIoC = selectConfig(ConfigModule, Config);
