module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  testMatch: [
    "**/src/**/*.test.ts"
  ],
  coverageThreshold: {
    "global": {
      "branches": 50,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
};