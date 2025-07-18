const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    'blocks/example-block/index': './src/blocks/example-block/index.js',
    'blocks/hero-block/index': './src/blocks/hero-block/index.js',
    'blocks/sample-block/index': './src/blocks/sample-block/index.js',
  },
  output: {
    ...defaultConfig.output,
    path: path.resolve(__dirname, 'build'),
    clean: false, // Don't clean the build directory
  },
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    },
  },
};