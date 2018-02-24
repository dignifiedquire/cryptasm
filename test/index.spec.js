/* eslint-env jest */
'use strict'

const crypto = require('crypto')
const cryptasm = require('../').debug

const key = crypto.randomBytes(32)
const iv = crypto.randomBytes(16)

describe('AES 256 CBC', () => {
  it('encrypt - matches node crypto', () => {
    const message = crypto.randomBytes(100)
    const nodeCipher = crypto.createCipheriv('aes-256-cbc', key, iv)

    const b = nodeCipher.update(message)
    const nodeOut = Buffer.concat([b, nodeCipher.final()])
    const out = cryptasm.encrypt(message, key, iv)

    expect(
      out.toString('hex')
    ).toEqual(
      nodeOut.toString('hex')
    )
  })

  it('encrypt - decrypt', () => {
    const message = crypto.randomBytes(100)
    expect(
      cryptasm.decrypt(
        cryptasm.encrypt(message, key, iv),
        key,
        iv
      ).toString('hex')
    ).toEqual(
      message.toString('hex')
    )
  })
})
