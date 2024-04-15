process.env.TEST_SCOPE = process.env.TEST_SCOPE || 'unit';

const config = {
  unit: {
    testRegex: '.(unit|spec).ts$',
    roots: ['src'],
    coverageDirectory: './coverage/unit',
  },
  e2e: {
    testRegex: '.e2e-spec.ts$',
    roots: ['src', 'test'],
    coverageDirectory: './coverage/e2e',
  },
  all: {
    testRegex: '.(unit|spec|e2e|e2e-spec).ts$',
    roots: ['src', 'test'],
  },
}[process.env.TEST_SCOPE];

module.exports = {
  preset: 'ts-jest',

  // where to find tests
  rootDir: '.',
  roots: config.roots,

  /**
   * There are different kinds of tests depending on development cycles
   *  - unit, is a test of function or a method, without dependencies, great for TDD
   *  - spec, is a test of a interface, optional services, great for BDD
   *  - e2e, is a test of a HTTP interface, with services, great for BDD
   */
  testRegex: config.testRegex,
  testMatch: null, // ts-node needs this to apply testRegex

  // report all tests
  verbose: true,

  globalSetup: config.globalSetup,

  testTimeout: 45000,

  // coverage
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  coverageReporters: ['json', 'lcov', 'text'],
  coverageDirectory: config.coverageDirectory,
  coveragePathIgnorePatterns: [
    '/data-migration-scripts/',
    'main.ts',
    '.(unit|spec|e2e|e2e-spec).ts$',
  ],

  // set up ~ prefixes
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src/$1',
    '@test(.*)$': '<rootDir>/test/$1',
  },
  workerThreads: false,
  workerIdleMemoryLimit: '512MB',
  // If "isolatedModules" is true, then this will prevent type checking and speed up the tests.
  // If you want to check types set env CHECK_TYPES=true".
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { isolatedModules: process.env.CHECK_TYPES !== 'true' },
    ],
  },
};
