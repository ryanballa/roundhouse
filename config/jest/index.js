// module-alias needs to be called before anything else

module.exports = {
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js', '<rootDir>/packages/**/*.js'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    '<rootDir>\\/src\\/server\\/(lib|middleware)\\/\\w*\\/index\\.js',
    '/test/',
  ],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  modulePaths: [
    '<rootDir>', // resolves "src"
  ],
  rootDir: '../../',
  // expect will not be defined in these files
  setupFiles: [
    '<rootDir>/config/jest/test-setup.js',
    // The next line is commented out until we fix all prop errors
    // 'jest-prop-type-error',
  ],
  // but it will be defined in this file.
  setupFilesAfterEnv: ['<rootDir>/config/jest/extensions.js'],
  testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/packages/**/*.test.js'],
  testURL: 'http://test',
  transform: {
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  verbose: true,
};
