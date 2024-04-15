import { ClsModule as _ClsModule } from 'nestjs-cls';
import { AuthAsyncCtx } from '~modules/auth/auth-async-ctx';

export const ClsModule = _ClsModule.forRoot({
  global: true,
  middleware: {
    mount: true,
  },
  proxyProviders: [AuthAsyncCtx],
});
