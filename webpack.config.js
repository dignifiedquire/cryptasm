// webpack.config.js
const path = require('path')

module.exports = {
  entry: './bench/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    noParse: [ /benchmark/ ]
  },
  mode: 'development'
}
