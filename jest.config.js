module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '.(css|less)$': '<rootDir>/jest-style-mock.js'
  }
}
