import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  createTestingApp,
  startTestingApp,
  stopTestingApp,
} from '../../utils/create-testing-app.utils';
import { AppController } from '~app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module = await createTestingApp({
      controllers: [AppController],
    });

    app = await startTestingApp(module);
  });

  afterAll(async () => {
    await stopTestingApp(app);
  });

  it('should get a succes response for health check', () => {
    request(app.getHttpServer()).get('/').expect(200).expect('Ok!');
  });
});
