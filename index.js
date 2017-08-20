'use strict'

const assert = require('assert')
const Module = require('./target/asmjs-unknown-emscripten/debug/cryptasm')

const cEncrypt = Module.cwrap('c_encrypt', 'number', ['number', 'number', 'number', 'number'])

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
    console.log(messagePtr, keyPtr, ivPtr)
    cEncrypt(messagePtr, message.byteLength, keyPtr, ivPtr)

    // dealloc
    _freeHeap(messagePtr)
    _freeHeap(keyPtr)
    _freeHeap(ivPtr)

    return 0
  }
}

function _writeToHeap (buf) {
  const ptr = Module._malloc(buf.byteLength)
  Module.writeArrayToMemory(buf, ptr)

  return ptr
}

function _freeHeap (ptr) {
  Module._free(ptr)
}
