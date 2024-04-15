#!/bin/sh

export TEST_SCOPE="e2e"

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

# Occasionally some testing databases couldn't be deleted
# because errors occured during the tests run. This
# leads to database name conflicts in the next tests run.
# With this script which is run before all e2e tests
# we ensure that all dangling databases are deleted.
npx ts-node -r tsconfig-paths/register $ROOT_DIR/test/utils/delete-test-dbs.ts

node --no-compilation-cache ./node_modules/jest-cli/bin/jest.js --logHeapUsage --config ./jest.config.js $1


