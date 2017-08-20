'use strict'

const Benchmark = require('benchmark')
const aesBrowserify = require('browserify-aes/browser')
const crypto = require('crypto')
const cryptasm = require('../')

const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

const message = (size) => crypto.randomBytes(size)

function run (size) {
  let res = []

  new Benchmark.Suite()
    .add('cryptasm', () => {
      res.push(cryptasm.encrypt(message(size), key, iv))
    })
    .add('node crypto', () => {
      const node = crypto.createCipheriv('aes-256-cbc', key, iv)
      const b = node.update(message(size))
      res.push(Buffer.concat([b, node.final()]))
    })
    .add('browserify-aes', () => {
      const browserify = aesBrowserify.createCipheriv('aes-256-cbc', key, iv)
      const b = browserify.update(message(size))
      res.push(Buffer.concat([b, browserify.final()]))
    })
    .on('cycle', (e) => {
      res = []
      console.log('\t' + String(e.target) + ' - ' + size + '\t')
    })
    .run()
}

console.log('AES 256 CBC')
run(20)
run(80)
run(800)
