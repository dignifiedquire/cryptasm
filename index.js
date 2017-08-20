'use strict'

const assert = require('assert')
// const Module = require('./target/asmjs-unknown-emscripten/debug/cryptasm')
const Module = require('./target/asmjs-unknown-emscripten/release/cryptasm')

const cEncrypt = Module.cwrap('c_encrypt', '', ['number', 'number', 'number', 'number', 'number', 'number'])

module.exports = {
  encrypt (message, key, iv) {
    assert(Buffer.isBuffer(message))
    assert(Buffer.isBuffer(key))
    assert(Buffer.isBuffer(iv))
    assert.equal(key.byteLength, 32)
    assert.equal(iv.byteLength, 16)

    // malloc
    const messagePtr = _writeToHeap(message)
    const keyPtr = _writeToHeap(key)
    const ivPtr = _writeToHeap(iv)

    const cipherLen = outputSize(message, true)
    const cipherPtr = Module._malloc(cipherLen)

    cEncrypt(messagePtr, message.byteLength, keyPtr, ivPtr, cipherPtr, cipherLen)

    const result = new Uint8Array(Module.HEAPU8.buffer, cipherPtr, cipherLen)

    // dealloc
    _freeHeap(messagePtr)
    _freeHeap(keyPtr)
    _freeHeap(ivPtr)
    _freeHeap(cipherPtr)

    return Buffer.from(result)
  }
}

function outputSize (buf, padding) {
  if (padding) {
    return (Math.floor(buf.byteLength / 16) + 1) * 16
  }

  return buf.byteLength
}

function _writeToHeap (buf) {
  const ptr = Module._malloc(buf.byteLength)
  Module.writeArrayToMemory(buf, ptr)

  return ptr
}

function _freeHeap (ptr) {
  Module._free(ptr)
}
