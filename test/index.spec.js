'use strict'

const Benchmark = require('benchmark')
const aesBrowserify = require('browserify-aes')
const crypto = require('crypto')
const cryptasm = require('../')

function run () {
  let key = new Buffer('000102030405060708090A0B0C0D0E0F', 'hex')
  let input = new Buffer('00112233445566778899AABBCCDDEEFF', 'hex')

  new Benchmark.Suite()
    .add('cryptasm', () => {
      const eKey = cryptasm.setEncryptKey(key, 128)
    })
    .add('browserify-aes', () => {
      const cipher = aesBrowserify.createCipher('aes-128-ecb', key)
    })
    .on('cycle', (e) => {
      console.log(String(e.target))
    })
    .run()
}

// run()

const message = new Buffer('hello world')
const key = Buffer.allocUnsafe(32)
const iv = Buffer.allocUnsafe(16)
iv.fill(0)

console.log(cryptasm.encrypt(message, key, iv))
const c = crypto.createCipheriv('aes-256-cbc', key, iv)
c.update(message)
console.log(c.final().toString('hex'))
