import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Test matching
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // Module resolution
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/index.ts',
    '!src/types/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Performance
  maxWorkers: '50%',
  
  // Ignore
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  
  // Transform
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
      },
    }],
  },
  
  // Verbose output
  verbose: true,
};

export default config;