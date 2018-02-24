'use strict'

const assert = require('assert')
// const ModuleDebug = require('./target/asmjs-unknown-emscripten/debug/cryptasm')
// const ModuleRelease = require('./target/asmjs-unknown-emscripten/release/cryptasm')
const wasm = require('./src/main.rs')

module.exports = cryptasm

// module.exports = cryptasm(ModuleRelease)
// module.exports.debug = cryptasm(ModuleDebug)

function cryptasm () {
  console.log('start')
  return wasm.initialize().then((Module) => {
    console.log('resolved', Module)
    const cEncrypt = Module.cwrap('c_encrypt', '', ['number', 'number', 'number', 'number', 'number', 'number'])
    const cDecrypt = Module.cwrap('c_decrypt', 'number', ['number', 'number', 'number', 'number', 'number'])

    return {
      encrypt (message, key, iv) {
        assert(Buffer.isBuffer(message))
        assert(Buffer.isBuffer(key))
        assert(Buffer.isBuffer(iv))
        assert.equal(key.byteLength, 32)
        assert.equal(iv.byteLength, 16)

        // malloc
        const messagePtr = _writeToHeap(Module, message)
        const keyPtr = _writeToHeap(Module, key)
        const ivPtr = _writeToHeap(Module, iv)

        const cipherLen = outputSize(message, true)
        const cipherPtr = Module._malloc(cipherLen)

        cEncrypt(messagePtr, message.byteLength, keyPtr, ivPtr, cipherPtr, cipherLen)

        const result = new Uint8Array(Module.HEAPU8.buffer, cipherPtr, cipherLen)

        // dealloc
        _freeHeap(Module, messagePtr)
        _freeHeap(Module, keyPtr)
        _freeHeap(Module, ivPtr)
        _freeHeap(Module, cipherPtr)

        return Buffer.from(result)
      },
      decrypt (message, key, iv) {
        assert(Buffer.isBuffer(message))
        assert(Buffer.isBuffer(key))
        assert(Buffer.isBuffer(iv))
        assert.equal(key.byteLength, 32)
        assert.equal(iv.byteLength, 16)

        // malloc
        const messagePtr = _writeToHeap(Module, message)
        const keyPtr = _writeToHeap(Module, key)
        const ivPtr = _writeToHeap(Module, iv)

        const plainPtr = Module._malloc(message.byteLength)

        const plainLen = cDecrypt(messagePtr, message.byteLength, keyPtr, ivPtr, plainPtr)

        const result = new Uint8Array(Module.HEAPU8.buffer, plainPtr, plainLen)

        // dealloc
        _freeHeap(Module, messagePtr)
        _freeHeap(Module, keyPtr)
        _freeHeap(Module, ivPtr)
        _freeHeap(Module, plainPtr)

        return Buffer.from(result)
      }
    }
  }).catch((err) => {
    console.error('fail', err)
  })
}

function outputSize (buf, padding) {
  if (padding) {
    return (Math.floor(buf.byteLength / 16) + 1) * 16
  }

  return buf.byteLength
}

function _writeToHeap (Module, buf) {
  const ptr = Module._malloc(buf.byteLength)
  Module.writeArrayToMemory(buf, ptr)

  return ptr
}

function _freeHeap (Module, ptr) {
  Module._free(ptr)
}
