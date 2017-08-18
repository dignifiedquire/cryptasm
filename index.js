'use strict'

const Module = require('./target/asmjs-unknown-emscripten/debug/cryptasm')

const main = Module.cwrap('testing', '', ['array', 'array', 'number', 'number'])

module.exports = {
  main (M, keySchedule, nRounds) {
    const result = new Int32Array([0, 0, 0, 0])
    const heapBytes = _arrayToHeap(result)

    main(M, keySchedule, nRounds, heapBytes.byteOffset)

    const out = new Array(4)
    const ptr = heapBytes.byteOffset
    const offsetLen = result.BYTES_PER_ELEMENT

    out[0] = Module.getValue(ptr, 'i32')
    out[1] = Module.getValue(ptr + offsetLen, 'i32')
    out[2] = Module.getValue(ptr + offsetLen * 2, 'i32')
    out[3] = Module.getValue(ptr + offsetLen * 3, 'i32')

    _freeArray(heapBytes)

    return out
  }
}

function _arrayToHeap (typedArray) {
  var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT
  var ptr = Module._malloc(numBytes)
  var heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes)
  heapBytes.set(new Uint8Array(typedArray.buffer))
  return heapBytes
}

function _freeArray (heapBytes) {
  Module._free(heapBytes.byteOffset)
}
