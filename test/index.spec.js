'use strict'

const Benchmark = require('benchmark')
const aesBrowserify = require('browserify-aes/browser')
const crypto = require('crypto')
const cryptasm = require('../')

const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

function run (message) {
  let res = []

  new Benchmark.Suite()
    .add('cryptasm', () => {
      res.push(cryptasm.encrypt(message(), key, iv))
    })
    .add('node crypto', () => {
      const node = crypto.createCipheriv('aes-256-cbc', key, iv)
      node.update(message())
      res.push(node.final())
    })
    .add('browserify-aes', () => {
      const browserify = aesBrowserify.createCipheriv('aes-256-cbc', key, iv)
      browserify.update(message())
      res.push(browserify.final())
    })
    .on('cycle', (e) => {
      res = []
      console.log(String(e.target))
    })
    .run()
}

let lorem = (size) => () => crypto.randomBytes(size)
run(lorem(20))
run(lorem(80))
// run(lorem(800))
