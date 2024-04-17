import { InjectableProxy } from 'nestjs-cls';

@InjectableProxy()
export class AuthAsyncCtx {
  private _currentUser!: unknown;

  get currentUser() {
    return this._currentUser;
  }

  async init() {
    //get user from db

    return this._currentUser;
  }
}
