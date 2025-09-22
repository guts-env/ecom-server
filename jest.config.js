export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  transformIgnorePatterns: ['node_modules/(?!(uuid)/)'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts': ['ts-jest', { useESM: true }],
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.spec.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/setup.ts',
    '/__tests__/helpers/',
    '/__tests__/mocks/',
    '/__tests__/config/',
  ],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/types/**/*', '!src/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testTimeout: 10000,
  clearMocks: true,
  verbose: false,
};
