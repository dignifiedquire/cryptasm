'use strict'

import _local from '../'
const Benchmark = require('benchmark')
if (typeof window !== 'undefined') {
  window.Benchmark = Benchmark
}

const _browserify = require('browserify-aes/browser')
const _openssl = require('crypto')
let key = Buffer.alloc(16, 0xff)
let iv = Buffer.alloc(16, 0x01)

_local.then((_local) => {
  function test (mod, message) {
    let cipher = mod.createCipheriv('aes-128-ctr', key, iv)
    let b = cipher.update(message)
    return Buffer.concat([b, cipher.final()])
  }

  let local = (m) => {
    const res = _local.aes128_ctr(Uint8Array.from(key), Uint8Array.from(iv), Uint8Array.from(m))
    return Buffer.from(res)
  }

  let browserify = (m) => test(_browserify, m)
  let openssl = (m) => test(_openssl, m)

  function run (message) {
    var a = local(message).toString('hex')
    var b = browserify(message).toString('hex')
    if (a !== b) {
      throw new Error('not equal ' + a + '\n' + b)
    }

    new Benchmark.Suite()
      // .add('openssl', () => openssl(message))
      .add('local', () => local(message))
      .add('browserify', () => browserify(message))
      .on('cycle', (e) => console.log(String(e.target)))
      .run()
  }

  let lorem = Buffer.allocUnsafe(800).fill(0x12)
  run(lorem.slice(0, 20), key)
  run(lorem.slice(0, 80), key)
  // run(lorem, key)
})
