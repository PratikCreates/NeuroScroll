const path = require('path');

const commonConfig = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.extension.json'
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // Do not clean here, or handle carefully if parallel
  },
  optimization: {
    minimize: false, // Keep readable for development
  },
  devtool: false,
};

module.exports = [
  // Background Script - Runs in Service Worker
  Object.assign({}, commonConfig, {
    name: 'background',
    entry: {
      'background': './src/background/background.ts',
    },
    target: 'webworker', // Critical for Service Worker chunk loading (importScripts)
    output: {
      ...commonConfig.output,
      clean: true, // Clean once
    }
  }),
  // Content Script - Runs in Page Context
  Object.assign({}, commonConfig, {
    name: 'content',
    entry: {
      'content-script': './src/content/content-script.ts'
    },
    target: 'web', // Critical for DOM access
    output: {
      ...commonConfig.output,
      clean: false, // Don't clean again
    }
  })
];