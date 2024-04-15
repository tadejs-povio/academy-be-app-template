import * as nock from 'nock';

export const disableNetwork = () => {
  // This prevents the tests from making real HTTP requests. It's important to do this
  // otherwise we can't be assured the tests are using the mocked/recorded responses.
  nock.disableNetConnect();
  // Allow localhost connections so we can test local routes and mock servers.
  nock.enableNetConnect(
    (host) => host.includes('127.0.0.1') || host.includes('localhost'),
  );
};
