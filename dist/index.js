module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const assert = __webpack_require__(1)
// const ModuleDebug = require('./target/asmjs-unknown-emscripten/debug/cryptasm')
// const ModuleRelease = require('./target/asmjs-unknown-emscripten/release/cryptasm')
const wasm = __webpack_require__(2)

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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: /Users/dignifiedquire/opensource/cryptasm/node_modules/rust-wasm-loader/index.js??ref--0!/Users/dignifiedquire/opensource/cryptasm/src/main.rs Unterminated string constant (10:63)\nYou may need an appropriate loader to handle this file type.\n|             }\n|             var Module = Object.assign({}, userDefinedModule, existingModule);\n|             Module['wasmBinary'] = Module['readBinary'](Module['wasmBinaryFile]);\n|             Module['onRuntimeInitialized'] = () => resolve(Module);\n|             ");

/***/ })
/******/ ]);