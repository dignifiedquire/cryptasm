'use strict'

const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.rs$/,
      use: {
        loader: 'rust-wasm-loader',
        options: {
          path: 'dist/'
        }
      }
    }, {
      test: /\.wasm$/,
      loader: 'file-loader'
    }]
  },
  node: {
    // fs: 'empty'
  },
  target: 'node'
}
