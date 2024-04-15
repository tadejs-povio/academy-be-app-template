# Description

# Installation

```bash
npm install

# only before the very first run
npx prisma generate
npx ts-node -r tsconfig-paths/register ./src/vendor/prisma/utils/generate-env.util.ts
```

## Running the app

```bash
# Starting the database
$ docker compose up -d

# Open Prisma Studio - a DB GUI client
$ npm run prisma studio

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
