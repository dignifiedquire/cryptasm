'use strict'

const Module = require('./target/asmjs-unknown-emscripten/debug/cryptasm')

const main = Module.cwrap('testing', '', [])

module.exports = {
  main
}
