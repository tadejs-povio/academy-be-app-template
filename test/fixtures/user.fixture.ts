import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { CreateAccessTokenUseCase } from '~modules/auth/use-cases/create-access-token.use-case';
import { UserEntity } from '~modules/user/user.entity';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '~modules/user/user.repository';

type CreateUser = {
  fullName?: string;
};

export const newUserFixture = async (
  app: INestApplication,
  data: CreateUser = {},
) => {
  const userRepository = app.get<IUserRepository>(USER_REPOSITORY);

  const user = await userRepository.create(
    await UserEntity.new({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      ...data,
    }),
  );

  return user;
};

export const newUserWithAccessTokenFixture = async (
  app: INestApplication,
  data: CreateUser = {},
) => {
  const createAccessTokenUseCase = app.get(CreateAccessTokenUseCase);
  const user = await newUserFixture(app, data);

  const accessToken = createAccessTokenUseCase.execute(user);

  return { user, accessToken: `Bearer ${accessToken}` };
};
