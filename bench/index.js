'use strict'

import _local from '../'
import _ from 'lodash'
import process from 'process'

const benchmark = require('benchmark')
const Benchmark = benchmark.runInContext({ _, process })

if (typeof window !== 'undefined') {
  window.Benchmark = Benchmark
}

const _browserify = require('browserify-aes/browser')
const _openssl = require('crypto')
const _libp2p = require('libp2p-crypto')

let key = Buffer.alloc(16, 0xff)
let iv = Buffer.alloc(16, 0x01)

console.log("STARTING")

_local.then((_local) => {
  function test (mod, message, cb) {
    let cipher = mod.createCipheriv('aes-128-ctr', key, iv)
    let b = cipher.update(message)
    cb(Buffer.concat([b, cipher.final()]))
  }

  let local = (m, cb) => {
    const res = _local.aes128_ctr(Uint8Array.from(key), Uint8Array.from(iv), Uint8Array.from(m))
    cb(Buffer.from(res))
  }

  let libp2p = (m, cb) => {
    _libp2p.aes.create(key, iv, (err, cipher) => {
      if (err) throw err
      cipher.encrypt(m, (err, res) => {
        if (err) throw err
        cb(res)
      })
    })
  }

  let browserify = (m, cb) => test(_browserify, m, cb)
  let openssl = (m, cb) => test(_openssl, m, cb)

  function run (message) {
    local(message, (a) => {
      browserify(message, (b) => {
        if (a.toString('hex') !== b.toString('hex')) {
          throw new Error('not equal ' + a + '\n' + b)
        }

        new Benchmark.Suite()
        // .add('openssl', (d) => openssl(message, () => d.resolve()), {defer: true})
          .add('libp2p', (d) => libp2p(message, () => d.resolve()), {defer: true})
          .add('local', (d) => local(message, () => d.resolve()), {defer: true})
          .add('browserify', (d) => browserify(message, () => d.resolve()), {defer: true})
          .on('cycle', (e) => console.log(String(e.target)))
          .run()
      })
    })
  }

  let lorem = Buffer.allocUnsafe(800).fill(0x12)
  run(lorem.slice(0, 20), key)
  run(lorem.slice(0, 80), key)
  // run(lorem, key)
}).catch((err) => {
  console.error("FAIL")
  console.error(err)
})
