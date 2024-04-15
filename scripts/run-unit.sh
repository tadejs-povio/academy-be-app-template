#!/bin/sh

export TEST_SCOPE="unit"

node --no-compilation-cache ./node_modules/jest-cli/bin/jest.js --logHeapUsage --config ./jest.config.js $1


