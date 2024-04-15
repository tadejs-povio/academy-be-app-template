import { InjectableProxy } from 'nestjs-cls';

@InjectableProxy()
export class AuthAsyncCtx {
  private _currentUser!: unknown;

  get currentUser() {
    return this._currentUser;
  }

  async initFromJwtToken(userId: string) {
    // const user = get user from db

    // this._currentUser = user;

    return this._currentUser;
  }
}
