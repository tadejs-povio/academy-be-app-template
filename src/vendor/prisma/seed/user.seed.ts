import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';

export const usersSeed = [
  {
    id: '4c8388cc-e9b9-420d-ae27-a46be06d426b',
    firstName: faker.person.firstName(),
    lastName: faker.person.firstName(),
    username: 'admin',
    password: 'pass',
  },
];

export const userSeed = async (app: INestApplication) => {
  // Write your seed logic here
};
