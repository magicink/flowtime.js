module.exports = {
  coveragePathIgnorePatterns: [
    '/assets/',
    '/dist',
    '/img/',
    '/js',
    '/node_modules/'
  ],
  transform: {
    '^.+\\.jsx?$': `<rootDir>/src/helpers/jest/preprocess.js`
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``
  },
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/src/helpers/jest/loadershim.js`]
}
