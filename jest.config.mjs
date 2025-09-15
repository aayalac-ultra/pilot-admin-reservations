import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'node:fs';

const tsconfig = JSON.parse(readFileSync('./tsconfig.json', 'utf-8'));
const paths = tsconfig.compilerOptions.paths || {};

export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: 'tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
  testMatch: ['**/__tests__/**/*.spec.ts', '**/?(*.)+(spec).ts'],
  globals: {},
  collectCoverageFrom: [
    'src/app/**/*.{ts,js}',
    '!src/main.ts',
    '!src/environments/*.ts',
    '!src/app/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  reporters: ['default'],
  extensionsToTreatAsEsm: ['.ts'],
  resolver: 'jest-preset-angular/build/resolvers/ng-jest-resolver.js'
};
