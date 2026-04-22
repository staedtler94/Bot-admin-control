import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  restoreMocks: true,
  resetModules: false,
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/config/setupDatabase.ts',
    '!src/config/database.ts',
    '!src/utils/logger.ts',
    '!src/**/*.d.ts',
    '!src/repositories/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  snapshotFormat: {
    printBasicPrototype: false,
    escapeString: false,
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' > ',
        suiteNameTemplate: '{filepath}',
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: 'reports/html',
        filename: 'index.html',
        pageTitle: 'Bot Admin Control - Backend Test Report',
        expand: true,
      },
    ],
  ],
};

export default config;
