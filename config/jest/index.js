// module-alias needs to be called before anything else

module.exports = {
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/client/**/*.js'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    '<rootDir>\\/src\\/server\\/(lib|middleware)\\/\\w*\\/index\\.js',
    '/test/',
  ],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 41,
      statements: 26,
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
  testMatch: ['<rootDir>/src/client/**/*.test.js'],
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
