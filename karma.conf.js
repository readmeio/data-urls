/* eslint-disable @typescript-eslint/no-var-requires */
const { host } = require('@jsdevtools/host-environment');
const { karmaConfig } = require('@jsdevtools/karma-config');

module.exports = karmaConfig({
  sourceDir: '.',
  browsers: {
    chrome: true,
    firefox: true,
    safari: host.os.mac,
    edge: false,
    ie: false,
  },
  tests: ['test/*.ts'],
  config: {
    client: {
      mocha: {
        // Windows CI sometimes takes longer than 2s to run some tests.
        timeout: 15000,
      },
    },
    webpack: {
      resolve: {
        extensions: ['.js', '.ts'],
      },
      mode: 'production',
      module: {
        rules: [{ test: /\.ts$/, use: 'ts-loader' }],
      },
    },
  },
});
